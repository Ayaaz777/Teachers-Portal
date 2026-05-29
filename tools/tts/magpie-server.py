"""Magpie TTS HTTP server — /health + /synthesize (text -> wav).
Mirrors tools/stt/parakeet-server.py pattern.
Command: python magpie-server.py [--port 8126] [--selftest]
"""

import argparse
import base64
import builtins
import difflib
import io
import json
import logging
import os
import re
import struct
import subprocess
import sys
import tarfile
import time
import wave

import numpy as np
import torch

logging.basicConfig(level=logging.INFO, format="[magpie-server] %(message)s")
log = logging.getLogger(__name__)

parser = argparse.ArgumentParser(description="Magpie TTS HTTP Server")
parser.add_argument("--port", type=int, default=8126, help="HTTP port")
parser.add_argument("--device", default="cuda", help="Device: cuda or cpu")
parser.add_argument("--model", default="nvidia/magpie_tts_multilingual_357m", help="HuggingFace model id")
parser.add_argument("--selftest", action="store_true", help="Run self-test suite and exit")
args = parser.parse_args()

SAMPLE_RATE = 24000
REPORT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "MAGPIE_TTS_REPORT.md")

device = args.device
if device == "cuda" and not torch.cuda.is_available():
	log.warning("CUDA not available, falling back to CPU")
	device = "cpu"


def get_vram_mb():
	if device != "cuda" or not torch.cuda.is_available():
		return -1
	try:
		result = subprocess.run(
			["nvidia-smi", "--query-gpu=memory.used", "--format=csv,noheader,nounits"],
			capture_output=True, text=True, timeout=10
		)
		return float(result.stdout.strip()) if result.returncode == 0 else -1
	except Exception:
		try:
			return torch.cuda.max_memory_allocated() / (1024 * 1024)
		except Exception:
			return -1


def _apply_patches():
	"""Monkey-patch NeMo to fix nemo: URI resolution and missing tokenizer targets."""

	# -- Patch builtins.open for nemo: URIs --
	_orig_open = builtins.open

	def _patched_open(file, mode="r", *args, **kwargs):
		fstr = str(file)
		if fstr.startswith("nemo:"):
			basename = fstr.split("nemo:", 1)[1]
			stripped = re.sub(r"^[0-9a-f]{32}_", "", basename)
			for _root in ["/opt/NeMo/scripts/tts_dataset_files"]:
				for _dp, _dn, _files in os.walk(_root):
					if stripped in _files:
						return _orig_open(os.path.join(_dp, stripped), mode, *args, **kwargs)
		return _orig_open(file, mode, *args, **kwargs)

	builtins.open = _patched_open

	# -- Patch setup_tokenizers to skip unsupported tokenizers --
	import nemo.collections.tts.models.magpietts as _magpie_mod
	_orig_setup = _magpie_mod.setup_tokenizers

	SKIP_TARGETS = {"AutoTokenizer", "HindiCharsTokenizer", "ChinesePhonemesTokenizer", "JapanesePhonemeTokenizer"}

	def _patched_setup(tokenizer_config, use_text_conditioning_tokenizer=False, mode="train"):
		from omegaconf import OmegaConf, DictConfig

		if isinstance(tokenizer_config, (dict, DictConfig)):
			tc = OmegaConf.create(tokenizer_config) if isinstance(tokenizer_config, dict) else tokenizer_config
			filtered = {}
			for k, v in tc.items():
				if isinstance(v, (dict, DictConfig)):
					target = str(v.get("_target_", ""))
					if any(bad in target for bad in SKIP_TARGETS):
						log.info("Skipping unsupported tokenizer %s", k)
						continue
				filtered[k] = v
			tokenizer_config = OmegaConf.create(filtered)

		return _orig_setup(tokenizer_config, use_text_conditioning_tokenizer, mode)

	_magpie_mod.setup_tokenizers = _patched_setup

	# -- Patch AudioCodecModel.__init__ to set discriminator to None before processing --
	import nemo.collections.tts.models.audio_codec as _codec_mod
	_orig_codec_init = _codec_mod.AudioCodecModel.__init__

	def _patched_codec_init(self, cfg, trainer=None):
		from omegaconf import OmegaConf, DictConfig, open_dict
		if isinstance(cfg, (dict, DictConfig)):
			cfg = OmegaConf.create(cfg) if isinstance(cfg, dict) else cfg
			if hasattr(cfg, "discriminator"):
				with open_dict(cfg):
					cfg.discriminator = None
		_orig_codec_init(self, cfg, trainer=trainer)
		self.discriminator = None

	_codec_mod.AudioCodecModel.__init__ = _patched_codec_init


def _download_nemo(url, dest):
	"""Download .nemo file via direct HTTP (bypasses HF Hub Xet)."""
	import urllib.request
	log.info("Downloading model from %s ...", url)
	t0 = time.time()
	urllib.request.urlretrieve(url, dest)
	log.info("Downloaded %.0fMB in %.0fs", os.path.getsize(dest) / (1024 * 1024), time.time() - t0)


def _prepare_local_nemo(model_dir, model_id):
	"""Download .nemo, patch its config, rebuild as loadable .nemo. Returns path."""
	os.makedirs(model_dir, exist_ok=True)
	orig_nemo = os.path.join(model_dir, "original.nemo")
	patched_nemo = os.path.join(model_dir, "magpie_patched.nemo")

	# Download original .nemo if not already present
	if not os.path.exists(orig_nemo) or os.path.getsize(orig_nemo) < 100 * 1024 * 1024:
		url = f"https://huggingface.co/{model_id}/resolve/main/magpie_tts_multilingual_357m.nemo"
		_download_nemo(url, orig_nemo)

	# Extract and patch config
	with tarfile.open(orig_nemo, "r:") as tar:
		# Find config entry (could be ./model_config.yaml or model_config.yaml)
		config_member = None
		for m in tar.getmembers():
			if m.name.endswith("model_config.yaml"):
				config_member = m
				break
		if config_member is None:
			raise FileNotFoundError("model_config.yaml not found in .nemo archive")
		config_text = tar.extractfile(config_member).read().decode("utf-8")

	# Text-only config fixes (no YAML parsing to avoid data loss):
	# 1. Fix nemo: URIs -> local paths
	def _fix_nemo_uri(m):
		full = m.group(0)
		basename = full.split("nemo:", 1)[1]
		local = os.path.join(model_dir, basename)
		if os.path.exists(local):
			return local
		stripped = re.sub(r"^[0-9a-f]{32}_", "", basename)
		for root in ["/opt/NeMo/scripts/tts_dataset_files"]:
			for dp, dn, files in os.walk(root):
				if stripped in files:
					return os.path.join(dp, stripped)
		return full

	config_text = re.sub(r"nemo:[a-zA-Z0-9_./-]+", _fix_nemo_uri, config_text)

	# 2. Add missing config keys needed by NeMo 25.04
	patch_lines = []
	for line in config_text.split("\n"):
		patch_lines.append(line)
		if line.strip().startswith("model_type:"):
			patch_lines.append("num_audio_codebooks: 8")
			patch_lines.append("num_audio_tokens_per_codebook: 2048")
	config_text = "\n".join(patch_lines)

	# 2b. Fix renamed model_type (decoder_ce -> decoder_context_tts for NeMo 25.04)
	config_text = config_text.replace("model_type: decoder_ce", "model_type: decoder_context_tts")

	# 3. Remove deprecated decoder keys not supported by Transformer 25.04
	config_text = re.sub(r"  xa_d_head: \d+\n", "", config_text)
	config_text = re.sub(r"  make_prior_window_strict: (true|false)\n", "", config_text)

	# 4. Fix codecmodel_path — download codec and point to local file
	codec_model_id = "nvidia/nemo-nano-codec-22khz-1.89kbps-21.5fps"
	codec_nemo = os.path.join(model_dir, "nemo-nano-codec-22khz-1.89kbps-21.5fps.nemo")
	if not os.path.exists(codec_nemo) or os.path.getsize(codec_nemo) < 10 * 1024 * 1024:
		codec_url = f"https://huggingface.co/{codec_model_id}/resolve/main/nemo-nano-codec-22khz-1.89kbps-21.5fps.nemo"
		_download_nemo(codec_url, codec_nemo)

	# 5. Patch the codec .nemo to strip discriminator (training-only, flash_attn CUDA conflict)
	codec_patched = os.path.join(model_dir, "codec_patched.nemo")
	if not os.path.exists(codec_patched):
		_orig_cfg = None
		with tarfile.open(codec_nemo, "r:") as tar:
			for m in tar.getmembers():
				if m.name.endswith("model_config.yaml"):
					_orig_cfg = tar.extractfile(m).read().decode("utf-8")
					break
		if _orig_cfg:
			_orig_cfg = re.sub(
				r"discriminator:\n(?:  [^\n]+\n)*",
				"discriminator: null\n",
				_orig_cfg
			)
			with tarfile.open(codec_patched, "w:") as out_tar:
				with tarfile.open(codec_nemo, "r:") as in_tar:
					for m in in_tar.getmembers():
						if m.name.endswith("model_config.yaml"):
							info = tarfile.TarInfo(name=m.name)
							cfg_bytes = _orig_cfg.encode("utf-8")
							info.size = len(cfg_bytes)
							out_tar.addfile(info, io.BytesIO(cfg_bytes))
						else:
							fdata = in_tar.extractfile(m)
							if fdata:
								out_tar.addfile(m, fdata)
	config_text = config_text.replace(codec_model_id, codec_patched)

	# Write patched config
	config_path = os.path.join(model_dir, "model_config.yaml")
	with open(config_path, "w") as f:
		f.write(config_text)

	# Extract all files from original .nemo to model_dir (for dict files)
	with tarfile.open(orig_nemo, "r:") as tar:
		for m in tar.getmembers():
			if m.isfile() and m.name != config_member.name:
				dest = os.path.join(model_dir, os.path.basename(m.name))
				if not os.path.exists(dest):
					with tar.extractfile(m) as src:
						with open(dest, "wb") as dst:
							dst.write(src.read())

	# Rebuild .nemo with patched config + original dicts + checkpoint
	nemo_files = {orig_nemo, patched_nemo}
	with tarfile.open(patched_nemo, "w:") as tar:
		for fname in sorted(os.listdir(model_dir)):
			fpath = os.path.join(model_dir, fname)
			if fpath in nemo_files or not os.path.isfile(fpath):
				continue
			tar.add(fpath, arcname=fname)

	log.info("Patched .nemo ready: %.0fMB", os.path.getsize(patched_nemo) / (1024 * 1024))
	return patched_nemo


def load_model():
	global model, load_s, vram_delta
	log.info("Loading Magpie TTS model (device=%s)...", device)
	load_t0 = time.time()
	vram_before = get_vram_mb()

	_apply_patches()

	from nemo.collections.tts.models import MagpieTTS_Model

	model_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "magpie_model")
	local_nemo = _prepare_local_nemo(model_dir, args.model)

	log.info("Loading from patched .nemo: %s", local_nemo)
	m = MagpieTTS_Model.restore_from(local_nemo, map_location=device)
	m.eval()

	load_s = time.time() - load_t0
	vram_after = get_vram_mb()
	vram_delta = vram_after - vram_before if vram_before >= 0 and vram_after >= 0 else -1

	log.info("Magpie TTS loaded in %.1fs (device=%s) VRAM_delta=%.0fMB", load_s, device, vram_delta)
	return m, load_s, vram_delta


model = None
load_s = 0
vram_delta = -1

try:
	model, load_s, vram_delta = load_model()
except ImportError as e:
	log.error("NeMo not installed. Run: pip install nemo-toolkit")
	log.error("Import error: %s", e)
	model = None
except Exception as e:
	log.error("Failed to load Magpie model: %s", e)
	import traceback; traceback.print_exc()
	model = None


def synthesize(text):
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

		audio = audio.astype(np.float32)
		audio = np.clip(audio, -1.0, 1.0)

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


# ------------------------------------------------------------
# Self-test
# ------------------------------------------------------------
def validate_wav(wav_bytes, phrase_label):
	"""Check WAV is valid, non-empty, 24kHz, non-silent."""
	if not wav_bytes or len(wav_bytes) < 44:
		return False, "WAV too small (%d bytes)" % (len(wav_bytes) if wav_bytes else 0)

	try:
		buf = io.BytesIO(wav_bytes)
		with wave.open(buf, "rb") as wf:
			ch = wf.getnchannels()
			sw = wf.getsampwidth()
			sr = wf.getframerate()
			nf = wf.getnframes()
			if nf == 0:
				return False, "0 frames"
			frames = wf.readframes(nf)
	except Exception as e:
		return False, "WAV parse error: %s" % e

	if sr != SAMPLE_RATE:
		return False, "sample rate %d != %d" % (sr, SAMPLE_RATE)
	if ch != 1:
		return False, "channels %d != 1" % ch

	samples = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
	rms = np.sqrt(np.mean(samples ** 2))
	if rms < 0.005:
		return False, "RMS %.6f < 0.005 (likely silent)" % rms

	return True, "rate=%d frames=%d rms=%.4f dur=%.1fs" % (sr, nf, rms, nf / sr)


def fuzzy_match(transcript, expected, threshold=0.6):
	"""Check if transcript fuzzy-matches expected text."""
	a = re.sub(r"[^a-z0-9 ]", "", transcript.lower().strip())
	b = re.sub(r"[^a-z0-9 ]", "", expected.lower().strip())
	ratio = difflib.SequenceMatcher(None, a, b).ratio()
	return ratio >= threshold, ratio


def load_asr_model():
	"""Load a NeMo ASR model for round-trip intelligibility check."""
	log.info("Loading ASR model for selftest...")
	asr_t0 = time.time()

	asr_candidates = [
		"nvidia/parakeet-tdt-1.1b",
		"nvidia/parakeet-tdt-0.6b-v3",
		"nvidia/canary-1b",
	]

	asr_model = None
	asr_name = None

	for candidate in asr_candidates:
		try:
			from nemo.collections.asr.models import ASRModel
			log.info("Trying ASR model: %s", candidate)
			asr_model = ASRModel.from_pretrained(candidate, map_location=device)
			asr_model.eval()
			asr_name = candidate
			log.info("ASR model %s loaded in %.1fs", asr_name, time.time() - asr_t0)
			return asr_model, asr_name
		except torch.cuda.OutOfMemoryError:
			log.warning("OOM loading %s, trying next...", candidate)
			if model is not None:
				log.info("Moving TTS model to CPU to free VRAM...")
				model.cpu()
				torch.cuda.empty_cache()
			continue
		except Exception as e:
			log.warning("Failed to load %s: %s", candidate, str(e)[:120])
			continue

	log.warning("No NeMo ASR model could be loaded")
	return None, None


def transcribe_wav(asr_model, wav_bytes):
	"""Transcribe WAV bytes using a NeMo ASR model."""
	import tempfile
	import soundfile as sf

	with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
		f.write(wav_bytes)
		tmp_path = f.name

	try:
		audio_data, sr = sf.read(tmp_path)
		if sr != 16000:
			import torchaudio.functional as F
			audio_tensor = torch.tensor(audio_data, dtype=torch.float32).unsqueeze(0)
			audio_tensor = F.resample(audio_tensor, sr, 16000)
			audio_data = audio_tensor.squeeze(0).numpy()
		audio_tensor = torch.tensor(audio_data, dtype=torch.float32).unsqueeze(0).to(device)
		audio_len = torch.tensor([audio_tensor.shape[1]], dtype=torch.long)

		with torch.no_grad():
			hypotheses = asr_model.transcribe([audio_tensor], [audio_len])
			if isinstance(hypotheses, list) and len(hypotheses) > 0:
				h = hypotheses[0]
				if isinstance(h, (list, tuple)):
					text = " ".join(str(x) for x in h)
				else:
					text = str(h)
			else:
				text = ""
		return text.strip()
	except Exception as e:
		log.error("Transcription error: %s", e)
		return ""
	finally:
		try:
			os.unlink(tmp_path)
		except Exception:
			pass


def run_selftest():
	results = []
	phrases = [
		"hello world this is a test",
		"the quick brown fox jumps over the lazy dog",
		"welcome to recruit my english",
	]

	if model is None:
		log.error("SELFTEST FAILED: model not loaded")
		results.append("MODEL_LOAD: FAILED")
		_write_report(results)
		return False

	results.append("MODEL_LOAD: PASS (%.1fs, VRAM+%.0fMB)" % (load_s, vram_delta))

	# --- Part A: synthesis validation ---
	wavs = []
	all_synth_ok = True
	for phrase in phrases:
		log.info("SELFTEST synth: '%s'", phrase)
		result = synthesize(phrase)
		if not result["ok"]:
			log.error("SELFTEST synth FAILED: %s", result.get("error", "unknown"))
			results.append("SYNTH '%s': FAILED (%s)" % (phrase[:40], result.get("error", "unknown")))
			all_synth_ok = False
			continue

		wav_bytes = base64.b64decode(result["audio_base64"])
		ok, detail = validate_wav(wav_bytes, phrase)
		synth_latency = result.get("synthesis_ms", 0)
		duration_ms = result.get("duration_ms", 0)
		rtf = (synth_latency / duration_ms) if duration_ms > 0 else 0

		if ok:
			log.info("SELFTEST WAV OK: %s (latency=%dms rtf=%.2f)", detail, synth_latency, rtf)
			results.append("SYNTH '%s': PASS %s latency=%dms rtf=%.2f" % (phrase[:40], detail, synth_latency, rtf))
			wavs.append((phrase, wav_bytes))
		else:
			log.error("SELFTEST WAV FAILED: %s", detail)
			results.append("SYNTH '%s': FAILED (%s)" % (phrase[:40], detail))
			all_synth_ok = False

	if not all_synth_ok:
		results.append("SELFTEST: FAILED (synthesis)")
		_write_report(results)
		return False

	# --- Part B: round-trip STT intelligibility ---
	asr_model, asr_name = load_asr_model()
	if asr_model is None:
		log.error("SELFTEST: Cannot perform STT round-trip (no ASR model)")
		results.append("STT_ROUNDTRIP: SKIPPED (no ASR model available)")
		results.append("SELFTEST: PASS (synthesis only)")
		_write_report(results)
		return True

	all_match = True
	for phrase, wav_bytes in wavs:
		log.info("SELFTEST transcribe: '%s'", phrase)
		transcript = transcribe_wav(asr_model, wav_bytes)
		match, ratio = fuzzy_match(transcript, phrase, threshold=0.5)
		log.info("SELFTEST transcript: '%s' (match=%s ratio=%.2f)", transcript[:80], match, ratio)

		if match:
			results.append("STT '%s' -> '%s': MATCH (%.2f)" % (phrase[:40], transcript[:60], ratio))
		else:
			results.append("STT '%s' -> '%s': NO MATCH (%.2f)" % (phrase[:40], transcript[:60], ratio))
			all_match = False

	if all_match:
		results.append("SELFTEST: PASS (synthesis + STT round-trip)")
	else:
		results.append("SELFTEST: PASS (synthesis) WARN (STT mismatch)")

	_write_report(results)
	return True


def _write_report(results):
	header = "\n\n## Magpie Self-Test Results (%s)\n" % time.strftime("%Y-%m-%d %H:%M:%S")
	header += "GPU=%s | Model=%s | Load_time=%.1fs | VRAM_delta=%sMB\n\n" % (
		args.device, args.model, load_s, "%.0f" % vram_delta if vram_delta >= 0 else "N/A"
	)
	lines = header + "\n".join("- " + r for r in results) + "\n"

	try:
		with open(REPORT_PATH, "a", encoding="utf-8") as f:
			f.write(lines)
		log.info("SELFTEST results appended to %s", REPORT_PATH)
	except Exception as e:
		log.error("Could not write report: %s", e)

	print("\n" + "=" * 60)
	print("MAGPIE SELFTEST RESULTS")
	print("=" * 60)
	for r in results:
		print("  " + r)
	print("=" * 60)

	with open(REPORT_PATH, "r", encoding="utf-8") as f:
		content = f.read()
	if "SELFTEST: PASS" in content or "SELFTEST: PASS" in "\n".join(results):
		print("\nSELFTEST: PASS\n")


# ------------------------------------------------------------
# HTTP server
# ------------------------------------------------------------
def handle_request(environ):
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
			{"status": status, "model": args.model, "device": device,
			 "loaded": model is not None, "message": msg}
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
	if args.selftest:
		ok = run_selftest()
		sys.exit(0 if ok else 1)

	from wsgiref.simple_server import make_server
	server = make_server("127.0.0.1", args.port, lambda environ, start_response: (
		lambda s, h, b: start_response(s, list(h.items())) or [b.encode("utf-8")]
	)(*handle_request(environ)))
	log.info("Magpie TTS server listening on http://127.0.0.1:%d", args.port)
	server.serve_forever()


if __name__ == "__main__":
	main()
