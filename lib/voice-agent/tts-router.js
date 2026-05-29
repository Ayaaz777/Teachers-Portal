/**
 * TTS engine router — mirrors lib/voice-agent/stt-router.js pattern.
 * Routes between Magpie (primary) and Chatterbox (fallback).
 * Driven by RME_TTS_ENGINE env var.
 */
const { getTtsStatus, synthesize } = require("../tts/index");

let _activeEngine = null;

function resolveEngine() {
	const override = String(process.env.RME_TTS_ENGINE || "auto").trim().toLowerCase();
	if (override === "magpie") return "magpie";
	if (override === "chatterbox") return "chatterbox";
	return "auto";
}

function getTtsEngine() {
	if (!_activeEngine) _activeEngine = resolveEngine();
	return _activeEngine;
}

function setTtsEngine(engine) {
	_activeEngine = engine;
}

/**
 * Synthesize text to speech, with auto-fallback.
 * Mirrors transcribeViaStt() pattern.
 * @param {string} text
 * @param {object} [opts]
 * @returns {Promise<{ ok: boolean; data?: object; error?: string; engine?: string }>}
 */
async function synthesizeViaTts(text, opts) {
	const engine = getTtsEngine();

	if (engine === "magpie") {
		try {
			const { synthesizeViaMagpie } = require("./magpie-server");
			const result = await synthesizeViaMagpie(text, opts);
			if (result.ok) {
				console.log("[tts] engine=magpie text='" + text.slice(0, 40) + "'");
				return { ...result, engine: "magpie" };
			}
			console.warn("[tts] magpie failed:", result.error || "unknown");
		} catch (e) {
			console.warn("[tts] magpie exception:", e instanceof Error ? e.message : String(e));
		}
	}

	if (engine === "auto" || engine === "magpie") {
		console.log("[tts] fallback: magpie->chatterbox");
	}

	const result = await synthesize({ text, ...opts });
	if (result.ok) {
		console.log("[tts] engine=chatterbox text='" + text.slice(0, 40) + "'");
		return { ...result, engine: "chatterbox" };
	}

	return result;
}

module.exports = {
	resolveEngine,
	getTtsEngine,
	setTtsEngine,
	synthesizeViaTts,
};
