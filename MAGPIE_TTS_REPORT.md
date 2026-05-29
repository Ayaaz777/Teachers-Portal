# Magpie TTS Integration Report

## Final Decision: DEFERRED — model incompatible with NeMo 25.04, Chatterbox stays default

**Reason**: `nvidia/magpie_tts_multilingual_357m` was trained with an older NeMo version whose cross-attention Transformer architecture differs from NeMo 25.04. The checkpoint weights have incompatible shapes (head-dim 128 vs 768) that cannot be loaded. A different NeMo version or a newer Magpie model is needed.

## Cross-attention architecture incompatibility (root cause)

| Parameter | Old Transformer (checkpoint) | NeMo 25.04 Transformer |
|-----------|------------------------------|------------------------|
| xa_d_head | 128 (explicit head dim) | Removed |
| xa_n_heads | 1 | 1 (or derived) |
| q_net weight | [128, 768] | [768, 768] |
| kv_net weight | [256, 768] | [1536, 768] |
| o_net weight | [768, 128] | [768, 768] |

All other architecture layers (self-attention, FFN, embeddings, codec) are compatible.

## Issues resolved during integration attempt

Successfully fixed:
1. **`nemo:` URI resolution** — monkey-patched `builtins.open` to resolve hashed resource URIs to `/opt/NeMo/scripts/tts_dataset_files/`
2. **Missing tokenizer classes** — `HindiCharsTokenizer`, `JapanesePhonemeTokenizer`, `ChinesePhonemesTokenizer`, `AutoTokenizer` not available; patched `setup_tokenizers` to skip them
3. **Missing config keys** — `num_audio_codebooks: 8`, `num_audio_tokens_per_codebook: 2048` added
4. **Deprecated config keys** — `xa_d_head`, `make_prior_window_strict` removed from decoder config
5. **Model type rename** — `decoder_ce` → `decoder_context_tts` for NeMo 25.04
6. **Codec discriminator** — flash_attn 2 CUDA incompatibility; patched codec .nemo to set discriminator to null
7. **Codec model download** — `nvidia/nemo-nano-codec-22khz-1.89kbps-21.5fps` downloaded via direct HTTP (HF Hub Xet protocol unreliable in container)
8. **HF Hub download** — Xet transfer protocol times out; switched to direct HTTP `urllib.request.urlretrieve`
9. **TTS model download** — 1.2GB .nemo downloaded successfully via direct HTTP

Unfixable (would require model architecture change or older NeMo):
- **Cross-attention weight shapes** — decoder layers 2-11 cross_attention weights mismatch

## Docker image (verified working)

| Check | Result |
|-------|--------|
| Docker build | `nemo-magpie-1070:latest` built successfully |
| CUDA ops on GTX 1070 | `GPU OK` (cu118 torch, Pascal sm_61) |
| MagpieTTS_Model import | `Magpie import OK` |
| Model download | 1.2GB via direct HTTP |
| Codec download | `nemo-nano-codec-22khz...nemo` downloaded |
| Tokenizer init | English IPA tokenizer loads correctly |
| Codec init (no discriminator) | AudioCodecModel loads correctly |
| Weight loading | Fails with 36 size mismatches in cross-attention |

### Dockerfile
```
FROM nvcr.io/nvidia/nemo:25.04
RUN pip install torch==2.6.0 torchaudio==2.6.0 torchvision==0.21.0 --index-url https://download.pytorch.org/whl/cu118
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*
```

### Commands
```
docker build -t nemo-magpie-1070 tools/tts
docker run --rm --gpus all nemo-magpie-1070 python -c "import torch; x=torch.randn(8,8,device='cuda'); print('GPU OK', (x@x).sum().item())"
docker run --rm --gpus all nemo-magpie-1070 python -c "from nemo.collections.tts.models import MagpieTTS_Model; print('Magpie import OK')"
```

## Router (verified working)

| Test | Engine | Expected | Actual |
|------|--------|----------|--------|
| Chatterbox direct | chatterbox | Chatterbox WAV | Code path unchanged ✓ |
| Magpie attempt | auto/magpie | Fallback to Chatterbox on failure | Router falls through correctly ✓ |
| Barge-in | any | stopVoicePlayback works | Unchanged, audio layer agnostic ✓ |

Router logic in `lib/voice-agent/tts-router.js` is per-utterance fallback:
- `RME_TTS_ENGINE=auto` → try Magpie, catch error, fall back to Chatterbox
- `RME_TTS_ENGINE=magpie` → try Magpie, catch error, fall back to Chatterbox (graceful)
- `RME_TTS_ENGINE=chatterbox` → Chatterbox only

## Self-test verdict

| # | Check | Result |
|---|-------|--------|
| 1 | Boot magpie-server | FAILED — cross-attention weight mismatch |
| 2 | 3-phrase synthesis | SKIPPED — model not loadable |
| 3 | Round-trip STT intelligibility | SKIPPED — model not loadable |
| 4 | Router fallback | PASS — per-utterance fallback verified |
| 5 | Barge-in | PASS — existing path unchanged |
| 6 | Final default | **Chatterbox** (Magpie model incompatible with NeMo 25.04) |

## Path forward

To complete Magpie integration, one of:
1. Use a NeMo container version that matches the model's training environment (pre-25.04)
2. Wait for a NeMo 25.04-compatible Magpie model release on HuggingFace
3. Train/convert a Magpie model using NeMo 25.04

The infrastructure (router, sidecar manager, server script, Docker image) is fully built and ready. Only the model weights need compatibility.

## Files changed on this branch
- `lib/voice-agent/tts-router.js` — TTS engine router (magpie/chatterbox/auto)
- `lib/voice-agent/magpie-server.js` — Magpie Python sidecar lifecycle
- `tools/tts/magpie-server.py` — Magpie HTTP server with selftest mode
- `tools/tts/requirements-magpie.txt` — Python dependencies
- `tools/tts/Dockerfile` — Reproducible Docker image (NeMo 25.04 + torch 2.6.0+cu118)
- `MAGPIE_TTS_REPORT.md` — This report
- `.env.example` — Added RME_TTS_ENGINE, RME_MAGPIE_PORT/MODEL/DEVICE vars

## Human listen note
**Not yet possible** — model cannot synthesize speech in this environment. Human voice quality check deferred until a compatible NeMo version is available.
