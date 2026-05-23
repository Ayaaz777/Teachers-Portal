async function wikiSearch(query, limit = 5) {
	const q = String(query || "").trim();
	if (!q) return [];
	const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&format=json&srlimit=${Math.max(1, Math.min(Number(limit) || 5, 20))}`;
	const res = await fetch(url, {
		headers: { "User-Agent": "RME-Desktop-App/1.0" },
	});
	if (!res.ok) return [];
	const data = await res.json();
	const results = data?.query?.search || [];
	return results.map((r) => ({
		title: r.title,
		pageId: r.pageid,
		snippet: r.snippet?.replace(/<[^>]*>/g, "") || "",
	}));
}

async function wikiLookup(title) {
	const t = String(title || "").trim();
	if (!t) return null;
	const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(t)}`;
	const res = await fetch(url, {
		headers: { "User-Agent": "RME-Desktop-App/1.0" },
	});
	if (!res.ok) return null;
	return await res.json();
}

module.exports = { wikiSearch, wikiLookup };
