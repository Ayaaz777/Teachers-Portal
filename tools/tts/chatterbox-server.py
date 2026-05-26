"""Chatterbox TTS server — OpenAI-compatible /v1/audio/speech and /v1/audio/speech/stream endpoints.

Usage:
    pip install -r tools/tts/requirements.txt
    python tools/tts/chatterbox-server.py [--port 8123] [--device auto]

The device auto-detects CUDA, then MPS, then falls back to CPU.
"""

import argparse
import io
import logging
import os
import sys
import time

logging.basicConfig(level=logging.INFO, format="[chatterbox] %(message)s")
log = logging.getLogger(__name__)

# Cache for voice conditionals so we don't re-extract on every request
_COND_CACHE = {}

parser = argparse.ArgumentParser(description="Chatterbox TTS server")
parser.add_argument("--port", type=int, default=8123, help="Port to listen on")
parser.add_argument("--device", default="auto", help="Device: cuda, cpu, auto")
parser.add_argument("--model", default=os.environ.get("RME_CHATTERBOX_MODEL", "original"), choices=["original"])
parser.add_argument("--voice-ref", default=None, help="Path to voice reference WAV (default: tools/tts/voices/aaron.wav)")
parser.add_argument("--default-exaggeration", type=float, default=float(os.environ.get("RME_CHATTERBOX_EXAGGERATION", os.environ.get("CHATTERBOX_EXAGGERATION", "0.7"))), help="Default exaggeration for cached conditionals")
parser.add_argument("--compile", default=os.environ.get("RME_CHATTERBOX_COMPILE", "false"), choices=["true", "false"], help="Enable torch.compile on t3+s3gen")
args = parser.parse_args()

# Resolve device
device = args.device
if device == "auto":
    import torch
    if torch.cuda.is_available():
        device = "cuda"
        log.info("CUDA detected")
    elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
        device = "mps"
        log.info("MPS detected")
    else:
        device = "cpu"
        log.info("No GPU, using CPU")

log.info("Loading Chatterbox model (device=%s model=%s)...", device, args.model)
sys.stdout.flush()
t0 = time.time()

model = None
sample_rate = 24000

# Load Chatterbox model (streaming variant includes generate_stream)
try:
    from chatterbox.tts import ChatterboxTTS
    model = ChatterboxTTS.from_pretrained(device=device)
    sample_rate = getattr(model, "sr", getattr(model, "sample_rate", 24000))
    log.info("Chatterbox loaded in %.1fs, sr=%d", time.time() - t0, sample_rate)
except Exception as e:
    log.error("Could not load Chatterbox TTS: %s", str(e))
    log.error("Run: pip install -r tools/tts/requirements.txt")
    sys.exit(1)

model_sample_rate = getattr(model, "sr", getattr(model, "sample_rate", 24000))
log.info("Model sample rate: %d", model_sample_rate)

# Patch norm_loudness to preserve float32 (pyloudnorm internally converts to float64)
import numpy as _np
model.norm_loudness = lambda wav, sr: wav.astype(_np.float32) if hasattr(wav, 'astype') else wav.float()

# torch.compile — env-gated, warms up at boot
_COMPILE_ACTIVE = False
if args.compile == "true":
    try:
        import torch
        log.info("Applying torch.compile to t3...")
        model.t3 = torch.compile(model.t3, fullgraph=False)
        log.info("Applying torch.compile to s3gen...")
        model.s3gen = torch.compile(model.s3gen, fullgraph=False)
        _COMPILE_ACTIVE = True
        log.info("torch.compile active on t3+s3gen")
    except Exception as e:
        log.warning("torch.compile failed, falling back to uncompiled: %s", str(e))
        _COMPILE_ACTIVE = False

# Warm-up inference — pays the one-time compile cost at boot
if _COMPILE_ACTIVE:
    try:
        log.info("Running warm-up inference...")
        t_warm = time.time()
        warm_input = "Hello, this is a warm up of the model."
        warm_kwargs = dict(exaggeration=0.35, cfg_weight=0.55)
        wav = model.generate(warm_input, **warm_kwargs)
        if isinstance(wav, tuple):
            wav = wav[0]
        _ = wav.cpu().numpy() if hasattr(wav, "cpu") else wav
        log.info("Warm-up inference done in %.1fs", time.time() - t_warm)
    except Exception as e:
        log.warning("Warm-up inference failed: %s", str(e))

# Cache voice conditionals at startup so prepare_conditionals runs exactly once
DEFAULT_VOICE_REF = args.voice_ref or os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "voices", "aaron.wav"
)
DEFAULT_EXAGGERATION = args.default_exaggeration
if os.path.isfile(DEFAULT_VOICE_REF):
    t_cond = time.time()
    model.prepare_conditionals(DEFAULT_VOICE_REF, exaggeration=DEFAULT_EXAGGERATION)
    _COND_CACHE[DEFAULT_VOICE_REF] = model.conds
    log.info("conditionals cached for %s, default exaggeration=%s (%.1fs)",
             DEFAULT_VOICE_REF, DEFAULT_EXAGGERATION, time.time() - t_cond)
else:
    log.warning("voice ref not found, conditionals not cached: %s", DEFAULT_VOICE_REF)

# FastAPI server
from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="Chatterbox TTS")


OUTPUT_SR = 48000
VOICE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "voices")
VOICE_MAP = {
    "aaron": os.path.join(VOICE_DIR, "aaron.wav"),
    "andy": os.path.join(VOICE_DIR, "andy.wav"),
    "abigail": os.path.join(VOICE_DIR, "abigail.wav"),
    "lucy": os.path.join(VOICE_DIR, "lucy.wav"),
}


class TTSRequest(BaseModel):
    input: str
    voice: str = "abigail"
    model: str = "tts-1"
    exaggeration: float = 0.35
    cfg_weight: float = 0.55


@app.post("/v1/audio/speech")
async def speech(req: TTSRequest):
    import soundfile as sf
    kwargs = dict(
        exaggeration=req.exaggeration,
        cfg_weight=req.cfg_weight,
    )
    ref_path = VOICE_MAP.get(req.voice) or DEFAULT_VOICE_REF
    log.info("synth start chars=%d used_cached_conds=%s compile=%s", len(req.input), ref_path in _COND_CACHE, _COMPILE_ACTIVE)
    if not (ref_path and os.path.isfile(ref_path)):
        if req.voice and os.path.isfile(req.voice):
            ref_path = req.voice
    if ref_path and os.path.isfile(ref_path):
        if ref_path not in _COND_CACHE:
            log.info("Preparing conditionals for voice from %s", ref_path)
            model.prepare_conditionals(ref_path, exaggeration=req.exaggeration)
            _COND_CACHE[ref_path] = model.conds
        else:
            model.conds = _COND_CACHE[ref_path]
    wav = model.generate(req.input, **kwargs)
    if isinstance(wav, tuple):
        wav = wav[0]
    arr = wav.cpu().numpy() if hasattr(wav, "cpu") else wav
    if arr.ndim > 1:
        arr = arr.squeeze()
    # Resample to 48kHz preserving float32
    if model_sample_rate != OUTPUT_SR:
        import librosa as _lb
        arr = _lb.resample(arr, orig_sr=model_sample_rate, target_sr=OUTPUT_SR).astype(_np.float32)
    buf = io.BytesIO()
    sf.write(buf, arr, OUTPUT_SR, format="WAV", subtype="PCM_16")
    return Response(content=buf.getvalue(), media_type="audio/wav")


@app.post("/v1/audio/speech/stream")
async def speech_stream(req: TTSRequest):
    kwargs = dict(
        exaggeration=req.exaggeration,
        cfg_weight=req.cfg_weight,
    )
    ref_path = VOICE_MAP.get(req.voice) or DEFAULT_VOICE_REF
    log.info("stream start chars=%d cached_conds=%s compile=%s", len(req.input), ref_path in _COND_CACHE, _COMPILE_ACTIVE)
    if ref_path and os.path.isfile(ref_path):
        if ref_path not in _COND_CACHE:
            log.info("Preparing conditionals for voice from %s", ref_path)
            model.prepare_conditionals(ref_path, exaggeration=req.exaggeration)
            _COND_CACHE[ref_path] = model.conds
        else:
            model.conds = _COND_CACHE[ref_path]

    def generate():
        for audio_chunk, metrics in model.generate_stream(req.input, **kwargs):
            arr = audio_chunk.cpu().numpy() if hasattr(audio_chunk, "cpu") else audio_chunk
            if arr.ndim > 1:
                arr = arr.squeeze()
            pcm_bytes = (arr * 32767).astype(_np.int16).tobytes()
            yield pcm_bytes

    return StreamingResponse(generate(), media_type="audio/L16;rate=24000;channels=1")


@app.get("/health")
async def health():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=args.port, log_level="warning")
