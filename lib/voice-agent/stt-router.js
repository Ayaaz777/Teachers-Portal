const { cudaRuntimeLikelyAvailable } = require("../voice/cuda-check");
const {
	ensureWhisperServer,
	stopWhisperServer,
	transcribeViaServer,
	getWhisperServerConfig,
	getWhisperDevice,
	getWhisperDeviceLabel,
	getWhisperModelBasename,
	isWhisperServerReady,
} = require("./whisper-server");
const {
	ensureParakeetServer,
	stopParakeetServer,
	transcribeViaParakeet,
	getParakeetServerConfig,
	getParakeetDevice,
	getParakeetDeviceLabel,
	getParakeetModelBasename,
	isParakeetServerReady,
} = require("./parakeet-server");

let _activeEngine = null;

function resolveEngine() {
	const override = String(process.env.RME_STT_ENGINE || "auto").trim().toLowerCase();
	if (override === "parakeet") return "parakeet";
	if (override === "whisper") return "whisper";

	const cuda = cudaRuntimeLikelyAvailable();
	return cuda ? "parakeet" : "whisper";
}

function getSttEngine() {
	if (!_activeEngine) {
		_activeEngine = resolveEngine();
	}
	return _activeEngine;
}

async function ensureSttServer() {
	const engine = getSttEngine();
	if (engine === "parakeet") {
		return ensureParakeetServer();
	}
	return ensureWhisperServer();
}

function stopSttServer() {
	const engine = getSttEngine();
	if (engine === "parakeet") {
		stopParakeetServer();
	} else {
		stopWhisperServer();
	}
	_activeEngine = null;
}

async function transcribeViaStt(wavBuffer, filename) {
	const engine = getSttEngine();
	if (engine === "parakeet") {
		return transcribeViaParakeet(wavBuffer, filename);
	}
	return transcribeViaServer(wavBuffer, filename);
}

function getSttDevice() {
	const engine = getSttEngine();
	if (engine === "parakeet") {
		return getParakeetDevice();
	}
	return getWhisperDevice();
}

function getSttDeviceLabel() {
	const engine = getSttEngine();
	if (engine === "parakeet") {
		return getParakeetDeviceLabel();
	}
	return getWhisperDeviceLabel();
}

function getSttModelBasename() {
	const engine = getSttEngine();
	if (engine === "parakeet") {
		return getParakeetModelBasename();
	}
	return getWhisperModelBasename();
}

function isSttServerReady() {
	const engine = getSttEngine();
	if (engine === "parakeet") {
		return isParakeetServerReady();
	}
	return isWhisperServerReady();
}

function getSttConfig() {
	const engine = getSttEngine();
	if (engine === "parakeet") {
		return getParakeetServerConfig();
	}
	return getWhisperServerConfig();
}

module.exports = {
	resolveEngine,
	getSttEngine,
	ensureSttServer,
	stopSttServer,
	transcribeViaStt,
	getSttDevice,
	getSttDeviceLabel,
	getSttModelBasename,
	isSttServerReady,
	getSttConfig,
};
