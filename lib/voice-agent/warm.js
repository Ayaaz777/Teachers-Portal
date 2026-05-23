/**
 * Pre-warm voice stack and log GPU device labels.
 */
const { cudaRuntimeLikelyAvailable } = require("../voice/cuda-check");
const {
  ensureWhisperServer,
  getWhisperDevice,
  getWhisperDeviceLabel,
  getWhisperModelBasename,
  isWhisperServerReady,
} = require("./whisper-server");

/**
 * @param {{ warmTts?: () => Promise<void>; synthHello?: () => Promise<void> }} deps
 */
async function warmVoiceEngines(deps = {}) {
  const cudaOk = cudaRuntimeLikelyAvailable();
  if (!cudaOk) {
    console.warn(
      "[voice] CUDA 12 toolkit not detected (nvcc). Whisper may use DirectML or CPU.",
    );
  } else {
    console.log("[voice] CUDA 12 runtime detected (nvcc)");
  }

  let whisperLabel = "cli";
  try {
    const serverUp = await ensureWhisperServer();
    whisperLabel = serverUp && isWhisperServerReady()
      ? getWhisperDeviceLabel()
      : "cli";
  } catch (e) {
    console.warn(
      `[voice] whisper-server warm failed: ${e instanceof Error ? e.message : String(e)}`,
    );
    whisperLabel = "cli";
  }

  try {
    if (typeof deps.warmTts === "function") {
      await deps.warmTts();
    }
    if (typeof deps.synthHello === "function") {
      await deps.synthHello();
    }
  } catch (e) {
    console.warn(
      `[voice] TTS warm failed: ${e instanceof Error ? e.message : String(e)}`,
    );
  }

  const whisperDeviceName = getWhisperDevice();
  const whisperUi = whisperDeviceName === "cuda" ? "GPU" : "CPU";
  const modelName = getWhisperModelBasename() || "unknown";
  console.log(`[voice] warmed — whisper=${whisperUi} model=${modelName} tts=Cartesia`);
  return {
    cudaRuntimeOk: cudaOk,
    whisperDevice: whisperDeviceName,
    whisperUi,
  };
}

module.exports = { warmVoiceEngines };
