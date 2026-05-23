const path = require("path");
const fs = require("fs");
const { log } = require("./log");
const { simplifyResponse } = require("./notion-simplify");

const NOTION_VERSION = "2026-03-11";

const WORKSPACE_CANON = [
	// Operating hub
	{ name: "THE VAULT", type: "page", envKey: "NOTION_DATABASE_ID" },
	{ name: "Mission Control", type: "page", envKey: "NOTION_MISSION_CONTROL_ID" },
	{ name: "Teachers Portal App Codes", type: "page", envKey: "NOTION_PORTAL_CODES_ID" },
	// Reference pages
	{ name: "Operations Audit and Automation Blueprint — May 2026", type: "page", envKey: "NOTION_AUDIT_PAGE_ID" },
	{ name: "ARCHIVE (PAY SLIPS)", type: "page", envKey: "NOTION_ARCHIVE_PAGE_ID" },
	{ name: "Accounting Dep.", type: "page", envKey: "NOTION_ACCOUNTING_PAGE_ID" },
	{ name: "Interview Scoring Rubric — RME", type: "page", envKey: "NOTION_RUBRIC_PAGE_ID" },
	{ name: "Rejection email template — requirements mismatch", type: "page", envKey: "NOTION_REJECTION_EMAIL_PAGE_ID" },
	// Yushra's databases
	{ name: "Job Application Forms", type: "database", envKey: "NOTION_JOB_APPS_DB_ID" },
	{ name: "Interviews & Demos", type: "database", envKey: "NOTION_INTERVIEWS_DB_ID" },
	{ name: "Teacher Health", type: "database", envKey: "NOTION_TEACHER_HEALTH_DB_ID" },
	{ name: "Recruiting Message Templates", type: "database", envKey: "NOTION_RECRUITING_MSGS_DB_ID" },
	{ name: "Employment Letter Requests", type: "database", envKey: "NOTION_EMPLOY_LETTERS_DB_ID" },
	{ name: "Application Screener Queue", type: "database", envKey: "NOTION_SCREENER_DB_ID" },
	{ name: "Outreach Drafts", type: "database", envKey: "NOTION_OUTREACH_DB_ID" },
	{ name: "Sub-Agents Registry", type: "database", envKey: "NOTION_SUB_AGENTS_DB_ID" },
	{ name: "SOPs", type: "database", envKey: "NOTION_SOPS_DB_ID" },
	// Per-school accounting databases
	{ name: "Talking Global", type: "database", envKey: "NOTION_TG_DB_ID" },
	{ name: "Talking Global 2", type: "database", envKey: "NOTION_TG2_DB_ID" },
	{ name: "Talking Global 4", type: "database", envKey: "NOTION_TG4_DB_ID" },
	{ name: "Talking Global 5", type: "database", envKey: "NOTION_TG5_DB_ID" },
	{ name: "Talking Global 6", type: "database", envKey: "NOTION_TG6_DB_ID" },
	{ name: "Magic English SA", type: "database", envKey: "NOTION_ME_DB_ID" },
	{ name: "Magic English SA 7", type: "database", envKey: "NOTION_ME7_DB_ID" },
	{ name: "Speak English 4", type: "database", envKey: "NOTION_SE4_DB_ID" },
	{ name: "Speak English 3.5", type: "database", envKey: "NOTION_SE35_DB_ID" },
	{ name: "Speak English 3", type: "database", envKey: "NOTION_SE3_DB_ID" },
	{ name: "Nice Kid 8", type: "database", envKey: "NOTION_NICEKID8_DB_ID" },
	{ name: "Nice Kid 9", type: "database", envKey: "NOTION_NICEKID9_DB_ID" },
];

class NotionApi {
	constructor() {
		this._workspaceIdCache = null;
	}

	_hasToken() {
		return !!(process.env.NOTION_TOKEN && process.env.NOTION_TOKEN.trim());
	}

	async _fetch(path, options = {}) {
		if (!this._hasToken()) {
			throw new Error("NOTION_TOKEN not set — add it to .env");
		}
		const url = "https://api.notion.com/v1/" + path.replace(/^\//, "");
		const headers = {
			"Authorization": "Bearer " + process.env.NOTION_TOKEN.trim(),
			"Notion-Version": NOTION_VERSION,
		};
		if (options.headers) {
			Object.assign(headers, options.headers);
			delete options.headers;
		}
		const fetchOpts = { ...options, headers };
		const res = await fetch(url, fetchOpts);
		const body = await res.text();
		if (!res.ok) {
			throw new Error("Notion API " + res.status + ": " + body.slice(0, 500));
		}
		return JSON.parse(body);
	}

	async queryDataSource(args) {
		const t0 = Date.now();
		try {
			let dsId = String(args.data_source_id || "").trim();
			const dbId = String(args.database_id || "").trim();

			if (!dsId && dbId) {
				try {
					const dbInfo = await this._fetch("databases/" + encodeURIComponent(dbId));
					const sources = dbInfo?.data_sources;
					if (Array.isArray(sources) && sources.length > 0 && sources[0] && sources[0].id) {
						dsId = String(sources[0].id).trim();
					}
				} catch {
					dsId = dbId;
				}
				if (!dsId) {
					return { ok: false, error: { code: "NO_DATA_SOURCE", message: "Could not find a data source for database " + dbId }, ms: Date.now() - t0 };
				}
			}

			if (!dsId) {
				return { ok: false, error: { code: "BAD_INPUT", message: "Provide either database_id or data_source_id" }, ms: 0 };
			}

			const body = {};
			if (args.filter && typeof args.filter === "object") body.filter = args.filter;
			if (Array.isArray(args.sorts)) body.sorts = args.sorts;
			const data = await this._fetch("data_sources/" + encodeURIComponent(dsId) + "/query", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const text = JSON.stringify(simplifyResponse("queryDataSource", data), null, 2);
			return { ok: true, data: [{ type: "text", text }], ms: Date.now() - t0 };
		} catch (e) {
			return { ok: false, error: { code: "API_ERROR", message: e instanceof Error ? e.message : String(e) }, ms: Date.now() - t0 };
		}
	}

	async getBlockChildren(args) {
		const t0 = Date.now();
		try {
			const blockId = String(args.block_id || args.id || "").trim();
			if (!blockId) {
				return { ok: false, error: { code: "BAD_INPUT", message: "block_id is required" }, ms: 0 };
			}
			const data = await this._fetch("blocks/" + encodeURIComponent(blockId) + "/children?page_size=100");
			const text = JSON.stringify(simplifyResponse("getBlockChildren", data), null, 2);
			return { ok: true, data: [{ type: "text", text }], ms: Date.now() - t0 };
		} catch (e) {
			return { ok: false, error: { code: "API_ERROR", message: e instanceof Error ? e.message : String(e) }, ms: Date.now() - t0 };
		}
	}

	async search(args) {
		const t0 = Date.now();
		try {
			const query = String(args.query || "").trim();
			if (!query) {
				return { ok: false, error: { code: "BAD_INPUT", message: "query string is required" }, ms: 0 };
			}
			const body = { query, page_size: 10 };
			if (args.filter && typeof args.filter === "object") body.filter = args.filter;
			const data = await this._fetch("search", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const text = JSON.stringify(simplifyResponse("search", data), null, 2);
			return { ok: true, data: [{ type: "text", text }], ms: Date.now() - t0 };
		} catch (e) {
			return { ok: false, error: { code: "API_ERROR", message: e instanceof Error ? e.message : String(e) }, ms: Date.now() - t0 };
		}
	}

	async fetchPage(args) {
		const t0 = Date.now();
		try {
			const raw = args.identifier || args.url || "";
			const id = (raw.match(/([a-f0-9]{32})/i) || [raw])[0].replace(/[-\s]/g, "").toLowerCase();
			if (!id || id.length !== 32) {
				return { ok: false, error: { code: "BAD_INPUT", message: "Provide a valid page URL or identifier (32 hex chars)" }, ms: 0 };
			}
			/* Try as a page first, fall back to database */
			let data;
			try {
				data = await this._fetch("pages/" + encodeURIComponent(id));
			} catch {
				try {
					data = await this._fetch("databases/" + encodeURIComponent(id));
				} catch (e2) {
					throw new Error("Could not fetch page or database with id " + id.slice(0, 12) + "...");
				}
			}
			const text = JSON.stringify(simplifyResponse("fetchPage", data), null, 2);
			return { ok: true, data: [{ type: "text", text }], ms: Date.now() - t0 };
		} catch (e) {
			return { ok: false, error: { code: "API_ERROR", message: e instanceof Error ? e.message : String(e) }, ms: Date.now() - t0 };
		}
	}

	_writesEnabled() {
		return process.env.RME_NOTION_WRITES_ENABLED === "1";
	}

	async getDataSourceSchema(args) {
		const t0 = Date.now();
		try {
			const id = String(args.data_source_id || args.database_id || "").trim();
			if (!id) {
				return { ok: false, error: { code: "BAD_INPUT", message: "data_source_id or database_id required" }, ms: 0 };
			}
			let dsId = id;
			if (args.database_id) {
				try {
					const dbInfo = await this._fetch("databases/" + encodeURIComponent(id));
					const sources = dbInfo?.data_sources;
					if (Array.isArray(sources) && sources.length > 0 && sources[0] && sources[0].id) {
						dsId = String(sources[0].id).trim();
					}
				} catch { /* use raw id */ }
			}
			const data = await this._fetch("data_sources/" + encodeURIComponent(dsId));
			const text = JSON.stringify(simplifyResponse("getDataSourceSchema", data), null, 2);
			return { ok: true, data: [{ type: "text", text }], ms: Date.now() - t0 };
		} catch (e) {
			return { ok: false, error: { code: "API_ERROR", message: e instanceof Error ? e.message : String(e) }, ms: Date.now() - t0 };
		}
	}

	async createPage(args) {
		const t0 = Date.now();
		if (!this._writesEnabled()) {
			return { ok: false, error: { code: "WRITES_DISABLED", message: "Writes are disabled. Set RME_NOTION_WRITES_ENABLED=1 in .env to enable." }, ms: 0 };
		}
		try {
			const databaseId = String(args.database_id || "").trim();
			if (!databaseId) {
				return { ok: false, error: { code: "BAD_INPUT", message: "database_id is required" }, ms: 0 };
			}
			if (!args.properties || typeof args.properties !== "object") {
				return { ok: false, error: { code: "BAD_INPUT", message: "properties object is required" }, ms: 0 };
			}
			const body = {
				parent: { type: "database_id", database_id: databaseId },
				properties: args.properties,
			};
			const data = await this._fetch("pages", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const text = JSON.stringify(simplifyResponse("createPage", data), null, 2);
			return { ok: true, data: [{ type: "text", text }], ms: Date.now() - t0 };
		} catch (e) {
			return { ok: false, error: { code: "API_ERROR", message: e instanceof Error ? e.message : String(e) }, ms: Date.now() - t0 };
		}
	}

	async updatePage(args) {
		const t0 = Date.now();
		if (!this._writesEnabled()) {
			return { ok: false, error: { code: "WRITES_DISABLED", message: "Writes are disabled. Set RME_NOTION_WRITES_ENABLED=1 in .env to enable." }, ms: 0 };
		}
		try {
			const pageId = String(args.page_id || "").trim();
			if (!pageId) {
				return { ok: false, error: { code: "BAD_INPUT", message: "page_id is required" }, ms: 0 };
			}
			if (!args.properties || typeof args.properties !== "object") {
				return { ok: false, error: { code: "BAD_INPUT", message: "properties object is required" }, ms: 0 };
			}
			const body = { properties: args.properties };
			if (args.archived !== undefined) body.archived = args.archived;
			const data = await this._fetch("pages/" + encodeURIComponent(pageId), {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const text = JSON.stringify(simplifyResponse("updatePage", data), null, 2);
			return { ok: true, data: [{ type: "text", text }], ms: Date.now() - t0 };
		} catch (e) {
			return { ok: false, error: { code: "API_ERROR", message: e instanceof Error ? e.message : String(e) }, ms: Date.now() - t0 };
		}
	}

	async archiveItem(args) {
		const t0 = Date.now();
		if (!this._writesEnabled()) {
			return { ok: false, error: { code: "WRITES_DISABLED", message: "Writes are disabled. Set RME_NOTION_WRITES_ENABLED=1 in .env to enable." }, ms: 0 };
		}
		try {
			const id = String(args.id || args.page_id || args.database_id || "").trim();
			if (!id) {
				return { ok: false, error: { code: "BAD_INPUT", message: "id is required" }, ms: 0 };
			}
			/* Database pages require in_trash, standalone pages use archived. Try in_trash first. */
			let data;
			try {
				data = await this._fetch("pages/" + encodeURIComponent(id), {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ in_trash: true }),
				});
			} catch {
				data = await this._fetch("pages/" + encodeURIComponent(id), {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ archived: true }),
				});
			}
			const text = JSON.stringify(simplifyResponse("archiveItem", data), null, 2);
			return { ok: true, data: [{ type: "text", text }], ms: Date.now() - t0 };
		} catch (e) {
			return { ok: false, error: { code: "API_ERROR", message: e instanceof Error ? e.message : String(e) }, ms: Date.now() - t0 };
		}
	}

	async restoreItem(args) {
		const t0 = Date.now();
		if (!this._writesEnabled()) {
			return { ok: false, error: { code: "WRITES_DISABLED", message: "Writes are disabled. Set RME_NOTION_WRITES_ENABLED=1 in .env to enable." }, ms: 0 };
		}
		try {
			const id = String(args.id || args.page_id || args.database_id || "").trim();
			if (!id) {
				return { ok: false, error: { code: "BAD_INPUT", message: "id is required" }, ms: 0 };
			}
			/* Try in_trash first for database pages, fall back to archived for standalone pages */
			let data;
			try {
				data = await this._fetch("pages/" + encodeURIComponent(id), {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ in_trash: false }),
				});
			} catch {
				data = await this._fetch("pages/" + encodeURIComponent(id), {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ archived: false }),
				});
			}
			const text = JSON.stringify(simplifyResponse("restoreItem", data), null, 2);
			return { ok: true, data: [{ type: "text", text }], ms: Date.now() - t0 };
		} catch (e) {
			return { ok: false, error: { code: "API_ERROR", message: e instanceof Error ? e.message : String(e) }, ms: Date.now() - t0 };
		}
	}

	async createDatabase(args) {
		const t0 = Date.now();
		if (!this._writesEnabled()) {
			return { ok: false, error: { code: "WRITES_DISABLED", message: "Writes are disabled. Set RME_NOTION_WRITES_ENABLED=1 in .env to enable." }, ms: 0 };
		}
		try {
			const parentPageId = String(args.parent_page_id || args.page_id || "").trim();
			if (!parentPageId) {
				return { ok: false, error: { code: "BAD_INPUT", message: "parent_page_id is required" }, ms: 0 };
			}
			const title = String(args.title || "").trim();
			if (!title) {
				return { ok: false, error: { code: "BAD_INPUT", message: "title is required" }, ms: 0 };
			}
			if (!args.properties || typeof args.properties !== "object") {
				return { ok: false, error: { code: "BAD_INPUT", message: "properties schema object is required" }, ms: 0 };
			}
			const body = {
				parent: { type: "page_id", page_id: parentPageId },
				title: [{ type: "text", text: { content: title } }],
				properties: args.properties,
			};
			const data = await this._fetch("databases", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const text = JSON.stringify(simplifyResponse("createDatabase", data), null, 2);
			return { ok: true, data: [{ type: "text", text }], ms: Date.now() - t0 };
		} catch (e) {
			return { ok: false, error: { code: "API_ERROR", message: e instanceof Error ? e.message : String(e) }, ms: Date.now() - t0 };
		}
	}

	async appendBlockChildren(args) {
		const t0 = Date.now();
		if (!this._writesEnabled()) {
			return { ok: false, error: { code: "WRITES_DISABLED", message: "Writes are disabled. Set RME_NOTION_WRITES_ENABLED=1 in .env to enable." }, ms: 0 };
		}
		try {
			const blockId = String(args.block_id || args.id || "").trim();
			if (!blockId) {
				return { ok: false, error: { code: "BAD_INPUT", message: "block_id is required" }, ms: 0 };
			}
			if (!Array.isArray(args.children)) {
				return { ok: false, error: { code: "BAD_INPUT", message: "children array is required" }, ms: 0 };
			}
			const data = await this._fetch("blocks/" + encodeURIComponent(blockId) + "/children", {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ children: args.children }),
			});
			const text = JSON.stringify(simplifyResponse("appendBlockChildren", data), null, 2);
			return { ok: true, data: [{ type: "text", text }], ms: Date.now() - t0 };
		} catch (e) {
			return { ok: false, error: { code: "API_ERROR", message: e instanceof Error ? e.message : String(e) }, ms: Date.now() - t0 };
		}
	}

	async createComment(args) {
		const t0 = Date.now();
		if (!this._writesEnabled()) {
			return { ok: false, error: { code: "WRITES_DISABLED", message: "Writes are disabled. Set RME_NOTION_WRITES_ENABLED=1 in .env to enable." }, ms: 0 };
		}
		try {
			const pageId = String(args.page_id || args.parent_page_id || "").trim();
			if (!pageId) {
				return { ok: false, error: { code: "BAD_INPUT", message: "page_id is required" }, ms: 0 };
			}
			const richText = args.rich_text;
			if (!richText || (typeof richText === "string" ? !richText.trim() : !Array.isArray(richText))) {
				return { ok: false, error: { code: "BAD_INPUT", message: "rich_text is required (string or array of rich text objects)" }, ms: 0 };
			}
			const body = {
				parent: { page_id: pageId },
				rich_text: typeof richText === "string"
					? [{ type: "text", text: { content: richText } }]
					: richText,
			};
			const data = await this._fetch("comments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const text = JSON.stringify(simplifyResponse("createComment", data), null, 2);
			return { ok: true, data: [{ type: "text", text }], ms: Date.now() - t0 };
		} catch (e) {
			return { ok: false, error: { code: "API_ERROR", message: e instanceof Error ? e.message : String(e) }, ms: Date.now() - t0 };
		}
	}

	async getWorkspaceMap() {
		const t0 = Date.now();
		if (this._workspaceIdCache) {
			return { ok: true, data: [{ type: "text", text: JSON.stringify(this._workspaceIdCache, null, 2) }], ms: Date.now() - t0 };
		}
		const map = {};
		for (const item of WORKSPACE_CANON) {
			const envId = (process.env[item.envKey] || "").trim();
			if (envId) {
				map[item.name] = {
					id: envId.replace(/-/g, ""),
					type: item.type,
					found: true,
				};
			} else {
				map[item.name] = { id: null, type: item.type, found: false };
			}
		}
		this._workspaceIdCache = map;
		return { ok: true, data: [{ type: "text", text: JSON.stringify(map, null, 2) }], ms: Date.now() - t0 };
	}

	buildClaudeToolDefs() {
		const tools = [
			{
				name: "rme_workspace_map",
				description: "Returns the complete map of RME workspace databases and pages with their pre-seeded Notion IDs. Call this FIRST when the user mentions any database name (school, recruiting, etc.) or any page (the audit, ARCHIVE, etc.). The returned IDs are real and can be used directly with notion_query_data_source (for databases) or notion_fetch / notion_get_block_children (for pages). Every school, recruiting database, and reference page in the RME workspace is listed here.",
				input_schema: {
					type: "object",
					properties: {},
					required: [],
				},
			},
			{
				name: "notion_fetch",
				description: "Fetch a Notion page by URL or ID. USE WHEN: the user names a page (ARCHIVE, the audit, Interview Scoring Rubric, etc.) and you have its ID from rme_workspace_map. DO NOT use this tool for database row data — it returns only page properties and content, not database rows. For row data, call notion_query_data_source directly with the database_id from rme_workspace_map. INPUT: url (string) or identifier (32 hex chars, with or without hyphens). RETURNS: page content and properties.",
				input_schema: {
					type: "object",
					properties: {
						identifier: { type: "string", description: "32-character hex ID (with or without hyphens)" },
						url: { type: "string", description: "Full Notion URL" },
					},
				},
			},
			{
				name: "notion_search",
				description: "Search across the RME Notion workspace for pages, databases, or other items. USE WHEN: the user names a page, database, or topic and you do NOT already have its ID from rme_workspace_map. Be aware: search returns database metadata (title, type, URL) but NOT actual row values. To get row data from a database, first get its ID via this tool or rme_workspace_map, then call notion_query_data_source. INPUT: query string. RETURNS: up to 10 results ranked by relevance with id, title, type, and URL.",
				input_schema: {
					type: "object",
					properties: {
						query: { type: "string", description: "Search query — use the most distinctive phrase" },
						filter: {
							type: "object",
							description: "Optional filter object with value (page, database) and property (object)",
						},
					},
					required: ["query"],
				},
			},
			{
				name: "notion_query_data_source",
				description: "Query actual data rows from a Notion database by its database ID. USE THIS FOR ALL DATA QUERIES: school class counts, payslip amounts, applicant pipeline, outreach drafts — any row-level data. Always has permission — uses the internal integration which is shared with all RME databases. Do NOT call notion_fetch to 'prepare' for this tool. FLOW: Call rme_workspace_map first to get the database_id. Then call this tool DIRECTLY with that database_id — no fetch needed. INPUT: database_id (string, 32 hex chars with or without hyphens). Optional filter and sorts. RETURNS: results with all their actual property values from Notion. Every value in the response is real data from your workspace — use it verbatim.",
				input_schema: {
					type: "object",
					properties: {
						database_id: { type: "string", description: "The database ID (32 hex chars, with or without hyphens)" },
						data_source_id: { type: "string", description: "Optional — the data source ID if known directly" },
						filter: { type: "object", description: "Optional filter object" },
						sorts: { type: "array", description: "Optional array of sort objects", items: { type: "object" } },
					},
				},
			},
			{
				name: "notion_get_block_children",
				description: "Fetch the child blocks of a Notion block or page. USE WHEN: you need the body content (paragraphs, headings, lists, etc.) of a page. This tool uses the internal integration which has full access to all RME pages. INPUT: block_id (string, required). RETURNS: list of child blocks with their content.",
				input_schema: {
					type: "object",
					properties: {
						block_id: { type: "string", description: "The block or page ID (32 hex chars)" },
					},
					required: ["block_id"],
				},
			},
			{
				name: "notion_get_data_source_schema",
				description: "Fetch the schema (property definitions) of a data source. USE BEFORE WRITING: always call this before notion_create_page or notion_update_page to get the exact property names, types, and option values. The schema tells you the correct property names (including emoji and case) and available select/status options. INPUT: data_source_id or database_id (32 hex chars). RETURNS: properties schema with all field types, option values, and configurations.",
				input_schema: {
					type: "object",
					properties: {
						database_id: { type: "string", description: "The database ID (32 hex chars)" },
						data_source_id: { type: "string", description: "The data source ID (32 hex chars)" },
					},
				},
			},
			{
				name: "notion_create_page",
				description: "Create a new page (row) in a database. USE WHEN: the user asks you to add a new record — a new applicant, outreach draft, teacher row, etc. IMPORTANT: First call notion_get_data_source_schema to get the exact property names and types. PROPERTY FORMAT (map schema type → value): title: { title: [{ type: \"text\", text: { content: \"...\" } }] }, rich_text: { rich_text: [{ type: \"text\", text: { content: \"...\" } }] }, number: { number: 123 }, select: { select: { name: \"...\" } }, status: { status: { name: \"...\" } }, date: { date: { start: \"2025-01-01\" } }, email: { email: \"...\" }, phone_number: { phone_number: \"...\" }, url: { url: \"...\" }, checkbox: { checkbox: true }. Using the wrong type causes a validation error. RETURNS: the created page with its id and all properties.",
				input_schema: {
					type: "object",
					properties: {
						database_id: { type: "string", description: "The database ID (32 hex chars)" },
						properties: { type: "object", description: "Property values keyed by exact property name. Use correct types from the schema." },
					},
					required: ["database_id", "properties"],
				},
			},
			{
				name: "notion_update_page",
				description: "Update properties on an existing page (row). USE WHEN: the user asks to change a status, update class counts, modify a phone number, etc. IMPORTANT: First call notion_fetch with the page_id to see current values, and notion_get_data_source_schema to get exact property names and types. PROPERTY FORMAT matches notion_create_page — use the type from the schema. RETURNS: the updated page.",
				input_schema: {
					type: "object",
					properties: {
						page_id: { type: "string", description: "The page ID (32 hex chars)" },
						properties: { type: "object", description: "Property values to update. Use the type from the schema for each property." },
					},
					required: ["page_id", "properties"],
				},
			},
			{
				name: "notion_archive_item",
				description: "Archive (soft-delete / move to trash) a page or database. USE WHEN: the user asks to delete, archive, remove, or trash a record. Confirm with the user before calling this tool — it is destructive. The item can be restored later with notion_restore_item. INPUT: id, page_id, or database_id. RETURNS: the archived item.",
				input_schema: {
					type: "object",
					properties: {
						id: { type: "string", description: "The page or database ID (32 hex chars)" },
						page_id: { type: "string", description: "Alternative to id" },
						database_id: { type: "string", description: "Alternative to id for databases" },
					},
					required: [],
				},
			},
			{
				name: "notion_restore_item",
				description: "Restore an archived (trashed) page or database. USE WHEN: the user asks to restore or un-delete a previously archived item. INPUT: id, page_id, or database_id. RETURNS: the restored item.",
				input_schema: {
					type: "object",
					properties: {
						id: { type: "string", description: "The page or database ID (32 hex chars)" },
						page_id: { type: "string", description: "Alternative to id" },
						database_id: { type: "string", description: "Alternative to id for databases" },
					},
					required: [],
				},
			},
			{
				name: "notion_create_database",
				description: "Create a new database under a parent page. USE WHEN: the user asks to create a new database. INPUT: parent_page_id (the page that will contain the database), title (string), properties (schema object defining column names and types — e.g. { \"Name\": { \"title\": {} }, \"Status\": { \"select\": { \"options\": [{ \"name\": \"Active\", \"color\": \"green\" }] } } }). RETURNS: the created database with its id.",
				input_schema: {
					type: "object",
					properties: {
						parent_page_id: { type: "string", description: "The ID of the parent page (32 hex chars)" },
						title: { type: "string", description: "The database title" },
						properties: { type: "object", description: "Schema of property definitions" },
					},
					required: ["parent_page_id", "title", "properties"],
				},
			},
			{
				name: "notion_append_block_children",
				description: "Add content blocks (paragraphs, headings, bulleted list items, etc.) to a page. USE WHEN: adding body content, notes, or structured text to a page. INPUT: block_id (the page or block to append to), children (array of block objects following Notion block format: { object: \"block\", type: \"paragraph\", paragraph: { rich_text: [{ type: \"text\", text: { content: \"...\" } }] } }). RETURNS: the appended block list.",
				input_schema: {
					type: "object",
					properties: {
						block_id: { type: "string", description: "The block or page ID (32 hex chars)" },
						children: { type: "array", description: "Array of block objects to append", items: { type: "object" } },
					},
					required: ["block_id", "children"],
				},
			},
			{
				name: "notion_create_comment",
				description: "Add a discussion comment to a page. USE WHEN: the user asks you to add a comment, note, or feedback to a specific Notion page. INPUT: page_id (32 hex chars), rich_text (string or array of rich text objects). RETURNS: the created comment.",
				input_schema: {
					type: "object",
					properties: {
						page_id: { type: "string", description: "The page ID (32 hex chars)" },
						rich_text: { description: "Comment text — can be a plain string or array of rich text objects" },
					},
					required: ["page_id", "rich_text"],
				},
			},
		];
		return tools;
	}

	async callTool(name, args) {
		switch (name) {
			case "rme_workspace_map":
				return this.getWorkspaceMap();
			case "notion_query_data_source":
				return this.queryDataSource(args);
			case "notion_get_block_children":
				return this.getBlockChildren(args);
			case "notion_fetch":
				return this.fetchPage(args);
			case "notion_search":
				return this.search(args);
			case "notion_get_data_source_schema":
				return this.getDataSourceSchema(args);
			case "notion_create_page":
				return this.createPage(args);
			case "notion_update_page":
				return this.updatePage(args);
			case "notion_archive_item":
				return this.archiveItem(args);
			case "notion_restore_item":
				return this.restoreItem(args);
			case "notion_create_database":
				return this.createDatabase(args);
			case "notion_append_block_children":
				return this.appendBlockChildren(args);
			case "notion_create_comment":
				return this.createComment(args);
			default:
				return { ok: false, error: { code: "TOOL_NOT_FOUND", message: 'No tool for "' + name + '"' } };
		}
	}

	getStatus() {
		return {
			connected: true,
			hasToken: this._hasToken(),
			writesEnabled: this._writesEnabled(),
			version: NOTION_VERSION,
			toolCount: 13,
		};
	}
}

module.exports = { NotionApi, WORKSPACE_CANON };
