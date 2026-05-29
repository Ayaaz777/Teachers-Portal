"""Magpie TTS HTTP server — /health + /synthesize (text -> wav).

Mirrors tools/stt/parakeet-server.py pattern.
Requires: torch, nemo-toolkit, soundfile, numpy
Install: pip install -r tools/tts/requirements-magpie.txt
"""

import argparse
import base64
import io
import json
import logging
import time
import wave

import numpy as np
import torch

logging.basicConfig(level=logging.INFO, format="[magpie-server] %(message)s")
log = logging.getLogger(__name__)

parser = argparse.ArgumentParser(description="Magpie TTS HTTP Server")
parser.add_argument("--port", type=int, default=8129, help="HTTP port")
parser.add_argument("--device", default="cuda", help="Device: cuda or cpu")
parser.add_argument("--model", default="nvidia/magpie_tts_multilingual_357m", help="HuggingFace model id")
args = parser.parse_args()

device = args.device
if device == "cuda" and not torch.cuda.is_available():
	log.warning("CUDA not available, falling back to CPU")
	device = "cpu"

log.info("Loading Magpie TTS model (device=%s)...", device)
t0 = time.time()

# Lazy-load NeMo — only import when server actually starts
try:
	from nemo.collections.tts.models import MagpieTTSModel
	model = MagpieTTSModel.from_pretrained(args.model)
	model = model.to(device)
	model.eval()
	load_s = time.time() - t0
	log.info("Magpie TTS loaded in %.1fs (device=%s)", load_s, device)
except ImportError as e:
	log.error("NeMo not installed. Run: pip install nemo-toolkit")
	log.error("Import error: %s", e)
	# Continue as a no-op server — just return errors gracefully
	model = None
except Exception as e:
	log.error("Failed to load Magpie model: %s", e)
	model = None

SAMPLE_RATE = 24000


def synthesize(text: str) -> dict:
	"""Generate WAV audio for the given text. Returns {"ok": bool, ...}"""
	if model is None:
		return {"ok": False, "error": "Magpie model not loaded. Check server logs."}

	try:
		t0 = time.time()
		with torch.no_grad():
			audio = model.generate(text)
			if isinstance(audio, torch.Tensor):
				audio = audio.squeeze().cpu().numpy()
			elif isinstance(audio, np.ndarray):
				pass
			else:
				return {"ok": False, "error": "Unexpected output type: " + str(type(audio))}

		# Resample to 24000 if needed (model may output at 22050 or other rate)
		if hasattr(model, "sample_rate"):
			sr = model.sample_rate
		else:
			sr = SAMPLE_RATE

		audio = audio.astype(np.float32)
		audio = np.clip(audio, -1.0, 1.0)

		# Convert to int16 WAV
		int16 = (audio * 32767).astype(np.int16)
		buf = io.BytesIO()
		with wave.open(buf, "wb") as wf:
			wf.setnchannels(1)
			wf.setsampwidth(2)
			wf.setframerate(SAMPLE_RATE)
			wf.writeframes(int16.tobytes())
		wav_bytes = buf.getvalue()
		audio_b64 = base64.b64encode(wav_bytes).decode("ascii")
		duration_ms = int(len(int16) / SAMPLE_RATE * 1000)
		ms = int((time.time() - t0) * 1000)

		log.info("synth text='%s' ms=%d duration_ms=%d", text[:60], ms, duration_ms)
		return {
			"ok": True,
			"audio_base64": audio_b64,
			"mime_type": "audio/wav",
			"duration_ms": duration_ms,
			"synthesis_ms": ms,
			"device": device,
		}
	except Exception as e:
		log.error("Synthesis error: %s", e)
		return {"ok": False, "error": str(e)}


def handle_request(environ):
	"""Minimal WSGI-style handler for single requests."""
	from urllib.parse import urlparse

	method = environ.get("REQUEST_METHOD", "GET")
	path = urlparse(environ.get("PATH_INFO", "/")).path
	body_raw = environ.get("wsgi.input", None)
	body = ""
	if body_raw is not None:
		content_len = int(environ.get("CONTENT_LENGTH", 0) or 0)
		if content_len > 0:
			body = body_raw.read(content_len).decode("utf-8", errors="replace")

	if method == "GET" and path == "/health":
		status = "ok" if model is not None else "error"
		msg = "model loaded" if model is not None else "model not loaded"
		return 200, {"Content-Type": "application/json"}, json.dumps(
			{"status": status, "model": args.model, "device": device, "loaded": model is not None, "message": msg}
		)

	if method == "POST" and path == "/synthesize":
		try:
			req = json.loads(body) if body else {}
			text = req.get("text", "")
			if not text:
				return 400, {"Content-Type": "application/json"}, json.dumps({"ok": False, "error": "text required"})
			result = synthesize(text)
			return 200, {"Content-Type": "application/json"}, json.dumps(result)
		except json.JSONDecodeError:
			return 400, {"Content-Type": "application/json"}, json.dumps({"ok": False, "error": "invalid JSON"})

	return 404, {"Content-Type": "application/json"}, json.dumps({"ok": False, "error": "not found"})


def main():
	from wsgiref.simple_server import make_server

	server = make_server("127.0.0.1", args.port, lambda environ, start_response: (
		lambda s, h, b: start_response(s, list(h.items())) or [b.encode("utf-8")]
	)(*handle_request(environ)))
	log.info("Magpie TTS server listening on http://127.0.0.1:%d", args.port)
	server.serve_forever()


if __name__ == "__main__":
	main()
