async function fetchUrl(url, opts = {}) {
	const target = String(url || "").trim();
	if (!target) return { ok: false, error: "No URL provided" };
	try {
		const res = await fetch(target, {
			signal: opts.signal || null,
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept: "text/html,text/plain",
			},
		});
		if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
		const text = await res.text();
		const cleaned = text
			.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
			.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
			.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
			.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
			.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
			.replace(/<[^>]*>/g, " ")
			.replace(/&[a-z]+;/g, " ")
			.replace(/\s+/g, " ")
			.trim()
			.slice(0, 8000);
		return { ok: true, text: cleaned };
	} catch (e) {
		return { ok: false, error: e instanceof Error ? e.message : String(e) };
	}
}

module.exports = { fetchUrl };
