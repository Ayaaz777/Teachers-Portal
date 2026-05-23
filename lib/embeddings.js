let _pipeline = null;
let _warmMs = 0;

async function getPipeline() {
	if (_pipeline) return _pipeline;
	const { pipeline } = await import("@xenova/transformers");
	const t0 = Date.now();
	_pipeline = await pipeline("feature-extraction", "Xenova/bge-small-en-v1.5", {
		quantized: true,
	});
	_warmMs = Date.now() - t0;
	console.log(`[embeddings] model warm-loaded in ${_warmMs}ms`);
	return _pipeline;
}

async function embed(text) {
	try {
		if (!text || typeof text !== "string") {
			return { ok: false, error: { code: "BAD_INPUT", message: "embed requires non-empty string" } };
		}
		const truncated = text.slice(0, 8000);
		const pipe = await getPipeline();
		const output = await pipe(truncated, { pooling: "mean", normalize: true });
		return { ok: true, data: Array.from(output.data) };
	} catch (err) {
		return { ok: false, error: { code: "EMBED_FAILED", message: err instanceof Error ? err.message : String(err) } };
	}
}

function warmMs() { return _warmMs; }

module.exports = { embed, getPipeline, warmMs };
