/**
 * Resolve voice stack paths: use .env when valid, else tools/voice/ bundled layout.
 */
const fs = require("fs");
const path = require("path");

/** @param {string} p */
function fileExists(p) {
  try {
    return Boolean(p) && fs.existsSync(p);
  } catch {
    return false;
  }
}

/** @param {string} [raw] */
function isPlaceholderPath(raw) {
  const s = String(raw || "").trim().toLowerCase();
  return !s || s.includes("path/to") || s.includes("path\\to");
}

/**
 * @param {string} appRoot Directory containing tools/voice (main.js folder).
 * @param {{
 *   whisperBin?: string;
 *   whisperServerBin?: string;
 *   whisperModel?: string;
 *   ffmpegBin?: string;
 * }} fromEnv
 */
function resolveVoiceEnvPaths(appRoot, fromEnv = {}) {
  const voiceRoot = path.join(appRoot, "tools", "voice");
  const modelName = String(process.env.RME_WHISPER_MODEL_NAME || "small.en").trim();
  const bundled = {
    whisperModel: path.join(voiceRoot, "models", `ggml-${modelName}.bin`),
    ffmpegBin: path.join(voiceRoot, "ffmpeg", "bin", "ffmpeg.exe"),
    whisperBin: "",
  };

  function findExe(dir, name) {
    if (!fs.existsSync(dir)) return "";
    /** @param {string} d */
    function walk(d) {
      let entries;
      try {
        entries = fs.readdirSync(d, { withFileTypes: true });
      } catch {
        return "";
      }
      for (const ent of entries) {
        const full = path.join(d, ent.name);
        if (ent.isFile() && ent.name.toLowerCase() === name.toLowerCase()) {
          return full;
        }
        if (ent.isDirectory()) {
          const hit = walk(full);
          if (hit) return hit;
        }
      }
      return "";
    }
    return walk(dir);
  }

  const whisperDir = path.join(voiceRoot, "whisper");
  bundled.whisperBin = findExe(whisperDir, "whisper-cli.exe");
  if (!bundled.whisperBin) {
    bundled.whisperBin = findExe(whisperDir, "main.exe");
  }
  bundled.whisperServerBin = findExe(whisperDir, "whisper-server.exe");
  /** @param {string | undefined} envVal @param {string} fallback */
  function pick(envVal, fallback) {
    const v = String(envVal || "").trim();
    if (v && !isPlaceholderPath(v) && fileExists(v)) {
      return v;
    }
    if (fallback && fileExists(fallback)) {
      return fallback;
    }
    return v || fallback;
  }

  return {
    whisperBin: pick(fromEnv.whisperBin, bundled.whisperBin),
    whisperServerBin: pick(fromEnv.whisperServerBin, bundled.whisperServerBin),
    whisperModel: pick(fromEnv.whisperModel, bundled.whisperModel),
    ffmpegBin: pick(fromEnv.ffmpegBin, bundled.ffmpegBin),
  };
}

/**
 * Patch process.env with resolved voice paths when .env points at missing files.
 * @param {string} appRoot
 */
function applyVoiceEnvPaths(appRoot) {
  const resolved = resolveVoiceEnvPaths(appRoot, {
    whisperBin: process.env.RME_WHISPER_BIN,
    whisperServerBin: process.env.RME_WHISPER_SERVER_BIN,
    whisperModel: process.env.RME_WHISPER_MODEL,
    ffmpegBin: process.env.RME_FFMPEG_BIN,
  });
  if (resolved.whisperBin) process.env.RME_WHISPER_BIN = resolved.whisperBin;
  if (resolved.whisperServerBin) {
    process.env.RME_WHISPER_SERVER_BIN = resolved.whisperServerBin;
  }
  if (resolved.whisperModel) process.env.RME_WHISPER_MODEL = resolved.whisperModel;
  if (resolved.ffmpegBin) process.env.RME_FFMPEG_BIN = resolved.ffmpegBin;
  return resolved;
}

module.exports = {
  resolveVoiceEnvPaths,
  applyVoiceEnvPaths,
  isPlaceholderPath,
  fileExists,
};
