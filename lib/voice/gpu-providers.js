/**
 * Probe ONNX Runtime execution providers (onnxruntime-node).
 */
/** @returns {{ providers: string[]; cuda: boolean; dml: boolean; cpu: boolean }} */
function probeOnnxProviders() {
  /** @type {string[]} */
  let names = [];
  try {
    const ort = require("onnxruntime-node");
    const backends = ort.listSupportedBackends?.();
    if (Array.isArray(backends)) {
      names = backends.map((b) => String(b?.name || "").toLowerCase()).filter(Boolean);
    }
  } catch {
    names = ["cpu"];
  }
  const cuda = names.includes("cuda");
  const dml = names.includes("dml");
  const cpu = names.includes("cpu") || !names.length;
  /** @type {string[]} */
  const providers = [];
  if (cuda) providers.push("cuda");
  if (dml) providers.push("dml");
  if (cpu) providers.push("cpu");
  if (!providers.length) providers.push("cpu");
  return { providers, cuda, dml, cpu };
}

/**
 * Kokoro / transformers device string for this machine.
 * @param {string} [prefer]
 */
function pickKokoroDevice(prefer) {
  const want = String(prefer || process.env.RME_KOKORO_DEVICE || "cuda")
    .trim()
    .toLowerCase();
  const { cuda, dml } = probeOnnxProviders();
  if (want === "cpu") return { device: "cpu", label: "cpu" };
  if (cuda && (want === "cuda" || want === "gpu" || want === "auto")) {
    return { device: "cuda", label: "cuda" };
  }
  if (dml && (want === "cuda" || want === "dml" || want === "gpu" || want === "auto")) {
    return { device: "dml", label: "gpu" };
  }
  return { device: "cpu", label: "cpu" };
}

module.exports = { probeOnnxProviders, pickKokoroDevice };
