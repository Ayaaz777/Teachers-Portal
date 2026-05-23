async function webSearch(query, maxResults = 5) {
	const q = String(query || "").trim();
	if (!q) return [];
	const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
	const res = await fetch(url, {
		headers: {
			"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			Accept: "text/html",
		},
	});
	if (!res.ok) return [];

	const html = await res.text();
	const bodies = html.split('class="result__body"');
	const results = [];
	const limit = Math.max(1, Math.min(Number(maxResults) || 5, 15));

	for (let i = 1; i < bodies.length && results.length < limit; i++) {
		const block = bodies[i];
		const titleMatch = block.match(/<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/);
		const snippetMatch = block.match(/<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
		if (titleMatch) {
			results.push({
				title: titleMatch[2].replace(/<[^>]*>/g, "").trim(),
				url: titleMatch[1],
				snippet: snippetMatch ? snippetMatch[1].replace(/<[^>]*>/g, "").trim() : "",
			});
		}
	}
	return results;
}

module.exports = { webSearch };
