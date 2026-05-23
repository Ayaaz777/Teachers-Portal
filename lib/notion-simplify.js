function flattenPropertyValue(propObj) {
	if (!propObj || typeof propObj !== "object") return null;
	const type = propObj.type;
	const val = propObj[type];
	if (val === null || val === undefined) return null;

	switch (type) {
		case "title":
		case "rich_text":
			return Array.isArray(val) ? val.map(t => t.plain_text || t.text?.content || "").join("") : "";
		case "number":
			return val;
		case "select":
		case "status":
			return val?.name || null;
		case "multi_select":
			return Array.isArray(val) ? val.map(o => o.name).filter(Boolean) : [];
		case "date":
			return val?.start || null;
		case "email":
			return val || null;
		case "phone_number":
			return val || null;
		case "url":
			return val || null;
		case "checkbox":
			return val === true;
		case "formula":
			return val?.type ? val[val.type] : null;
		case "relation":
			return Array.isArray(val) ? val.map(r => r.id) : [];
		case "rollup":
			if (val?.type === "array" && Array.isArray(val.array)) {
				return val.array.map(flattenPropertyValue);
			}
			return val?.type ? val[val.type] : null;
		case "people":
			return Array.isArray(val) ? val.map(p => p.name || p.id).filter(Boolean) : [];
		case "unique_id":
			return val?.number != null ? String(val.number) : null;
		case "button":
			return null;
		default:
			return null;
	}
}

function simplifyProperties(properties) {
	if (!properties || typeof properties !== "object") return {};
	const out = {};
	for (const [name, prop] of Object.entries(properties)) {
		const val = flattenPropertyValue(prop);
		if (val !== null && val !== undefined) {
			out[name] = val;
		}
	}
	return out;
}

function extractTitle(properties) {
	if (!properties || typeof properties !== "object") return null;
	for (const prop of Object.values(properties)) {
		if (prop?.type === "title") {
			const title = prop.title;
			if (Array.isArray(title) && title.length > 0) {
				return title.map(t => t.plain_text || t.text?.content || "").join("");
			}
		}
	}
	return null;
}

function simplifyQueryResults(raw) {
	const results = Array.isArray(raw.results) ? raw.results : (Array.isArray(raw.data) ? raw.data : []);
	const data = results.map(row => ({
		_id: row.id,
		...simplifyProperties(row.properties),
	}));
	return { rows: data.length, data };
}

function simplifyPage(raw) {
	const props = raw.properties || {};
	return {
		id: raw.id,
		title: extractTitle(props),
		properties: simplifyProperties(props),
	};
}

function simplifyBlockChildren(raw) {
	const blocks = Array.isArray(raw.results) ? raw.results : [];
	return blocks.map(block => {
		const type = block.type;
		const content = block[type];
		if (!content) return { type, text: null };
		const texts = content.rich_text || [];
		const text = texts.map(t => t.plain_text || t.text?.content || "").join("");
		const out = { type, text: text || null };
		if (block.has_children) {
			out.hasChildren = true;
			out.blockId = block.id;
		}
		return out;
	});
}

function simplifySearch(raw) {
	const results = Array.isArray(raw.results) ? raw.results : [];
	return results.map(r => {
		const props = r.properties || {};
		return {
			id: r.id,
			title: extractTitle(props),
			type: r.object,
		};
	});
}

function simplifySchema(raw) {
	const props = raw.properties || {};
	const out = {};
	for (const [name, prop] of Object.entries(props)) {
		const entry = { type: prop.type };
		const opts = prop[prop.type]?.options;
		if (Array.isArray(opts)) {
			entry.options = opts.map(o => o.name);
		}
		out[name] = entry;
	}
	return { properties: out };
}

function simplifyWriteResult(raw) {
	const props = raw.properties || {};
	return {
		id: raw.id,
		title: extractTitle(props),
		properties: simplifyProperties(props),
	};
}

function simplifyArchive(raw) {
	return {
		id: raw.id,
		archived: !!raw.archived,
		inTrash: !!raw.in_trash,
	};
}

function simplifyResponse(type, raw) {
	if (!raw || typeof raw !== "object") return raw;
	if (Array.isArray(raw)) return raw;

	switch (type) {
		case "queryDataSource":
			return simplifyQueryResults(raw);
		case "fetchPage":
			return simplifyPage(raw);
		case "getBlockChildren":
			return simplifyBlockChildren(raw);
		case "search":
			return simplifySearch(raw);
		case "getDataSourceSchema":
			return simplifySchema(raw);
		case "createPage":
		case "updatePage":
		case "createDatabase":
		case "appendBlockChildren":
			return simplifyWriteResult(raw);
		case "archiveItem":
		case "restoreItem":
			return simplifyArchive(raw);
		case "createComment":
			return { id: raw.id };
		default:
			return raw;
	}
}

module.exports = { simplifyResponse, flattenPropertyValue };
