/**
 * Pre-warm voice stack and log GPU device labels.
 */
const { cudaRuntimeLikelyAvailable } = require("../voice/cuda-check");
const {
  ensureSttServer,
  getSttDevice,
  getSttDeviceLabel,
  getSttModelBasename,
  isSttServerReady,
  getSttEngine,
} = require("./stt-router");

/**
 * @param {{ warmTts?: () => Promise<void>; synthHello?: () => Promise<void> }} deps
 */
async function warmVoiceEngines(deps = {}) {
  const cudaOk = cudaRuntimeLikelyAvailable();
  const sttEngine = getSttEngine();

  if (!cudaOk) {
    console.warn(
      `[voice] CUDA 12 toolkit not detected (nvcc). STT engine: ${sttEngine}.`,
    );
  } else {
    console.log(`[voice] CUDA 12 runtime detected (nvcc). STT engine: ${sttEngine}.`);
  }

  let sttLabel = "cli";
  try {
    const serverUp = await ensureSttServer();
    sttLabel = serverUp && isSttServerReady()
      ? getSttDeviceLabel()
      : "cli";
  } catch (e) {
    console.warn(
      `[voice] STT warm failed: ${e instanceof Error ? e.message : String(e)}`,
    );
    sttLabel = "cli";
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

  const sttDeviceName = getSttDevice();
  const sttUi = sttDeviceName === "cuda" ? "GPU" : "CPU";
  const modelName = getSttModelBasename() || "unknown";
  console.log(`[voice] warmed — stt=${sttEngine} device=${sttUi} model=${modelName}`);
  return {
    cudaRuntimeOk: cudaOk,
    sttEngine,
    sttDevice: sttDeviceName,
    sttUi,
  };
}

module.exports = { warmVoiceEngines };
