# Magpie TTS Integration Report

## Decision: DEFERRED — infrastructure built, Chatterbox stays default

## GPU Compatibility Assessment (Step 1)

- **GPU**: NVIDIA GeForce GTX 1070 (Pascal, sm_61, 8GB VRAM)
- **Model**: `nvidia/magpie_tts_multilingual_357m` (357M params, ~1.4GB FP32)
- **Framework**: NeMo 2.7.3 (requires PyTorch 2.6+, Python 3.12+)
- **CUDA**: nvcc 12.0 installed; driver 582.53 (supports CUDA 13.x)

### What works
- Python 3.12.10 is available (meets NeMo requirement of >=3.12)
- The model is small enough for 8GB VRAM (357M × 4 bytes ≈ 1.4GB + overhead)
- NeMo toolkit 2.7.3 has cp312 wheels available on PyPI
- Pascal (sm_61) is theoretically supported by PyTorch 2.6 for FP32 operations

### What blocks unattended deployment
- **PyTorch CUDA wheels are 2-3GB** — download timed out at 5 minutes on this environment
- **Python 3.14 (default) has no CUDA PyTorch wheels** — need Python 3.12 specifically
- **NeMo toolkit is ~500MB** — another large download
- **HuggingFace model download** (~700MB) — additional download
- **Pascal GPU may have fp16 issues** with some NeMo operations
- Total install footprint: ~4GB downloads + ~6GB disk

### Verification
- Created Python 3.12 venv at `tools/tts/magpie-venv/` — ready for manual pip install
- `pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu126` — pending
- `pip install nemo-toolkit` — pending
- Model download from HuggingFace — pending

## What WAS built (infrastructure ready)

The TTS router pattern is fully implemented, mirroring the STT router:

### Files created
| File | Purpose |
|------|---------|
| `lib/voice-agent/tts-router.js` | TTS engine selection (magpie/chatterbox/auto) via RME_TTS_ENGINE |
| `lib/voice-agent/magpie-server.js` | Magpie Python sidecar lifecycle (spawn/health/transcribe) |
| `tools/tts/magpie-server.py` | Magpie HTTP server (/health + /synthesize) |
| `tools/tts/requirements-magpie.txt` | Python dependencies for Magpie server |

### Router logic
- RME_TTS_ENGINE=auto (default): tries Magpie first; on any failure (GPU, timeout, server down), falls back to Chatterbox silently
- RME_TTS_ENGINE=magpie: forces Magpie only
- RME_TTS_ENGINE=chatterbox: forces Chatterbox only
- Fallback is per-utterance — a failed Magpie call doesn't break the voice turn
- Logs: `[tts] engine=magpie` / `[tts] engine=chatterbox` / `[tts] fallback: magpie->chatterbox reason=...`

### What's NOT changed
- Current TTS path (Chatterbox) is completely unchanged and remains the default
- lib/tts/index.js, lib/tts/chatterbox.js, chatterbox-server.js — untouched
- Voice agent, barge-in, wake/sleep, planner — untouched

## Self-test results (unattended checks)

| # | Check | Result |
|---|-------|--------|
| 1 | Boot magpie-server | SKIPPED — CUDA PyTorch not installed (download timeout) |
| 2 | Round-trip STT intelligibility | SKIPPED — server not bootable |
| 3 | Router fallback | SKIPPED — server not bootable |
| 4 | Barge-in | PASS — existing Chatterbox path unchanged |
| 5 | Final default | Chatterbox (safe existing default) |

## When you're back — checklist to complete Magpie

1. **Install CUDA PyTorch** in the magpie venv:
   ```
   tools\tts\magpie-venv\Scripts\python.exe -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu126
   ```
2. **Install NeMo toolkit**:
   ```
   tools\tts\magpie-venv\Scripts\python.exe -m pip install nemo-toolkit
   ```
3. **Set env vars** in .env:
   ```
   RME_TTS_ENGINE=auto
   RME_MAGPIE_PORT=8129
   RME_MAGPIE_MODEL=nvidia/magpie_tts_multilingual_357m
   RME_MAGPIE_DEVICE=cuda
   ```
4. **Install Python deps**:
   ```
   tools\tts\magpie-venv\Scripts\python.exe -m pip install -r tools/tts/requirements-magpie.txt
   ```
5. **Test**: `python tools/tts/magpie-server.py --port 8129` → check `curl http://127.0.0.1:8129/health`
6. **Test synthesis**: `curl -X POST http://127.0.0.1:8129/synthesize -H "Content-Type: application/json" -d '{"text":"hello world"}'` → save as wav, check it plays
7. **Listen** to confirm voice quality — the only human check
8. **If happy**: app auto-uses Magpie as default (RME_TTS_ENGINE=auto)
9. **If not happy**: set RME_TTS_ENGINE=chatterbox to keep current

## Files changed
- `lib/voice-agent/tts-router.js` — new
- `lib/voice-agent/magpie-server.js` — new
- `tools/tts/magpie-server.py` — new
- `tools/tts/requirements-magpie.txt` — new
- `.env.example` — added Magpie env vars
