function applyGuardrails(text, opts) {
	if (!text || typeof text !== "string") return text || "";
	let t = text;
	const knownNumbers = opts && opts.knownNumbers instanceof Set ? opts.knownNumbers : null;

	t = t.replace(/\{[^}]*"type"\s*:\s*"(?:tool_use|tool_result)"[^}]*\}/g, "");
	t = t.replace(/"id"\s*:\s*"toolu_[^"]+"/g, "");

	t = t.replace(/```[\s\S]*?```/g, "");
	t = t.replace(/`([^`]+)`/g, "$1");
	t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
	t = t.replace(/\*\*([^*]+)\*\*/g, "$1");
	t = t.replace(/__([^_]+)__/g, "$1");
	t = t.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1");
	t = t.replace(/(?<!_)_([^_]+)_(?!_)/g, "$1");
	t = t.replace(/^#{1,6}\s+/gm, "");
	t = t.replace(/[*#_~]/g, " ");

	if (knownNumbers && knownNumbers.size > 0) {
		t = t.replace(/\b(\d{4,})\b/g, (match) => {
			if (knownNumbers.has(match) || knownNumbers.has(match.replace(/^0+/, ""))) return match;
			console.log(`[guardrails] hallucinated number ${match} replaced`);
			return "a number";
		});
	}

	t = t.replace(/\s{2,}/g, " ").trim();
	return t;
}

module.exports = { applyGuardrails };
