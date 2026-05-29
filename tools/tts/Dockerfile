# Magpie TTS environment for Pascal GPUs (GTX 1070, sm_61)
# Uses NeMo 25.04 container but swaps torch for a cu118 build that includes Pascal kernels.

FROM nvcr.io/nvidia/nemo:25.04

# Swap torch for cu118 build — NeMo 25.04 ships a newer torch that dropped sm_61
# (Pascal) support. cu118 still ships Pascal-compatible kernels.
# torchvision must match torch 2.6 major version.
RUN pip install torch==2.6.0 torchaudio==2.6.0 torchvision==0.21.0 \
    --index-url https://download.pytorch.org/whl/cu118

# ffmpeg needed for audio file I/O (pydub backend)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*
