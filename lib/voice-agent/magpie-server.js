/**
 * Magpie TTS Python sidecar lifecycle.
 * Mirrors lib/voice-agent/parakeet-server.js pattern.
 * HTTP server on 127.0.0.1:<port> with /health and /synthesize endpoints.
 */
const fs = require("fs");
const path = require("path");
const net = require("net");
const { spawn } = require("child_process");

const APP_ROOT = path.join(__dirname, "..", "..");

let serverProc = null;
let startPromise = null;
let magpieDevice = "cuda";

function getMagpieServerConfig() {
	const port = Number(process.env.RME_MAGPIE_PORT || "8126");
	const model = String(process.env.RME_MAGPIE_MODEL || "nvidia/magpie_tts_multilingual_357m").trim();
	const device = String(process.env.RME_MAGPIE_DEVICE || "cuda").trim();
	const pythonExe = String(process.env.RME_MAGPIE_PYTHON || process.env.RME_PYTHON_EXE || "python").trim();

	const scriptPath = path.join(APP_ROOT, "tools", "tts", "magpie-server.py");
	const venvDir = path.join(APP_ROOT, "tools", "tts", "magpie-venv");
	const venvPython = process.platform === "win32"
		? path.join(venvDir, "Scripts", "python.exe")
		: path.join(venvDir, "bin", "python");

	let python = pythonExe;
	if (fs.existsSync(venvPython)) python = venvPython;

	return { port, host: "127.0.0.1", baseUrl: "http://127.0.0.1:" + port, model, device, python, scriptPath };
}

function getMagpieDevice() { return magpieDevice; }
function getMagpieDeviceLabel() { return magpieDevice === "cuda" ? "gpu" : "cpu"; }
function isMagpieServerReady() { return Boolean(serverProc && !serverProc.killed); }

async function waitForHealth(baseUrl, timeoutMs) {
	const deadline = Date.now() + (timeoutMs || 120000);
	while (Date.now() < deadline) {
		try {
			const res = await fetch(baseUrl + "/health", { method: "GET" });
			if (res.ok) {
				const body = await res.text();
				if (body.includes('"status":"ok"')) return true;
			}
		} catch { /* not up yet */ }
		const urlObj = new URL(baseUrl);
		const ok = await new Promise((resolve) => {
			const sock = new net.Socket();
			sock.setTimeout(1000);
			sock.on("connect", () => { sock.destroy(); resolve(true); });
			sock.on("error", () => resolve(false));
			sock.on("timeout", () => { sock.destroy(); resolve(false); });
			sock.connect(Number(urlObj.port) || 8126, urlObj.hostname);
		});
		if (ok) return true;
		await new Promise((r) => setTimeout(r, 500));
	}
	return false;
}

async function ensureMagpieServer() {
	if (startPromise) return startPromise;
	startPromise = (async () => {
		const cfg = getMagpieServerConfig();

		if (!fs.existsSync(cfg.scriptPath)) {
			console.error("[magpie] Server script not found: " + cfg.scriptPath);
			startPromise = null;
			return false;
		}

		if (!fs.existsSync(cfg.python)) {
			console.error("[magpie] Python not found: " + cfg.python);
			startPromise = null;
			return false;
		}

		if (serverProc && !serverProc.killed) {
			return waitForHealth(cfg.baseUrl, 30000);
		}

		const args = ["-u", cfg.scriptPath, "--port", String(cfg.port), "--device", cfg.device, "--model", cfg.model];

		console.log("[magpie] Starting server: " + cfg.python + " " + args.join(" "));

		const env = { ...process.env, PYTHONUNBUFFERED: "1", RME_MAGPIE_PORT: String(cfg.port), RME_MAGPIE_DEVICE: cfg.device, RME_MAGPIE_MODEL: cfg.model };

		serverProc = spawn(cfg.python, args, { cwd: APP_ROOT, windowsHide: true, stdio: ["ignore", "pipe", "pipe"], env });

		serverProc.stdout?.on("data", (c) => { const s = String(c); if (s.trim()) console.log("[magpie]", s.trim()); });
		serverProc.stderr?.on("data", (c) => { const s = String(c); if (s.trim()) console.log("[magpie]", s.trim()); });
		serverProc.on("exit", (code) => { if (code != null && code !== 0) console.warn("[magpie] server exited " + code); serverProc = null; startPromise = null; });

		const ok = await waitForHealth(cfg.baseUrl, 600000);
		if (ok) {
			try {
				const res = await fetch(cfg.baseUrl + "/health", { method: "GET" });
				if (res.ok) {
					const body = await res.json();
					if (body.device) magpieDevice = String(body.device).toLowerCase();
				}
			} catch { /* ignore */ }
			console.log("[magpie] server up (" + (magpieDevice === "cuda" ? "CUDA" : "CPU") + ") model=" + cfg.model + " — " + cfg.baseUrl + "/health");
		} else {
			console.warn("[magpie] server health check timed out after 600s");
			if (serverProc && !serverProc.killed) { try { serverProc.kill(); } catch {}; serverProc = null; startPromise = null; }
			return false;
		}
		return ok;
	})();
	return startPromise;
}

function stopMagpieServer() {
	if (serverProc && !serverProc.killed) {
		console.log("[magpie] Killing Magpie server...");
		try { serverProc.kill(); } catch (e) { console.warn("[magpie] kill error:", e); }
	}
	serverProc = null;
	startPromise = null;
}

/**
 * Synthesize text via Magpie server.
 * @param {string} text
 * @param {object} [opts]
 * @returns {Promise<{ ok: boolean; data?: { audioBase64: string; mimeType: string; durationMs: number }; error?: string }>}
 */
async function synthesizeViaMagpie(text, opts) {
	const cfg = getMagpieServerConfig();
	const t0 = Date.now();

	const res = await fetch(cfg.baseUrl + "/synthesize", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ text: String(text || ""), ...(opts || {}) }),
	});

	const raw = await res.text();
	if (!res.ok) throw new Error("Magpie server " + res.status + ": " + raw.slice(0, 400));

	let parsed;
	try { parsed = JSON.parse(raw); } catch { throw new Error("Magpie returned non-JSON"); }

	if (!parsed.ok) throw new Error("Magpie synth failed: " + (parsed.error || "unknown"));

	const ms = Date.now() - t0;
	console.log("[magpie] synth=" + ms + "ms bytes=" + (parsed.audio_base64 ? parsed.audio_base64.length : 0));

	return {
		ok: true,
		data: {
			audioBase64: parsed.audio_base64,
			mimeType: parsed.mime_type || "audio/wav",
			durationMs: parsed.duration_ms || 0,
		},
	};
}

module.exports = {
	ensureMagpieServer,
	stopMagpieServer,
	synthesizeViaMagpie,
	getMagpieServerConfig,
	getMagpieDevice,
	getMagpieDeviceLabel,
	isMagpieServerReady,
};
