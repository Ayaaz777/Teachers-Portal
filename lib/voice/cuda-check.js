/**
 * Best-effort CUDA 12 runtime visibility for startup logs (Windows / NVIDIA).
 */
const { spawnSync } = require("child_process");

/** @returns {boolean} */
function cudaRuntimeLikelyAvailable() {
  if (process.platform === "win32") {
    const candidates = [
      "C:\\Program Files\\NVIDIA GPU Computing Toolkit\\CUDA\\v12.6\\bin\\nvcc.exe",
      "C:\\Program Files\\NVIDIA GPU Computing Toolkit\\CUDA\\v12.5\\bin\\nvcc.exe",
      "C:\\Program Files\\NVIDIA GPU Computing Toolkit\\CUDA\\v12.4\\bin\\nvcc.exe",
      "C:\\Program Files\\NVIDIA GPU Computing Toolkit\\CUDA\\v12.3\\bin\\nvcc.exe",
      "C:\\Program Files\\NVIDIA GPU Computing Toolkit\\CUDA\\v12.2\\bin\\nvcc.exe",
      "C:\\Program Files\\NVIDIA GPU Computing Toolkit\\CUDA\\v12.1\\bin\\nvcc.exe",
    ];
    const fs = require("fs");
    for (const p of candidates) {
      try {
        if (fs.existsSync(p)) return true;
      } catch {
        /* ignore */
      }
    }
    try {
      const r = spawnSync("nvcc", ["--version"], {
        encoding: "utf8",
        timeout: 4000,
        windowsHide: true,
      });
      if (r.status === 0 && /release 12\./i.test(String(r.stdout || ""))) {
        return true;
      }
    } catch {
      /* ignore */
    }
    return false;
  }
  try {
    const r = spawnSync("nvcc", ["--version"], {
      encoding: "utf8",
      timeout: 4000,
    });
    return r.status === 0 && /release 12\./i.test(String(r.stdout || ""));
  } catch {
    return false;
  }
}

module.exports = { cudaRuntimeLikelyAvailable };
