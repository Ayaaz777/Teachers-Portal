const Anthropic = require("@anthropic-ai/sdk");
const crypto = require("crypto");
const { log } = require("./log");
const voiceMemory = require("./supabase/voice-memory");
const pageMemory = require("./supabase/page-memory");
const searchTools = require("./search");

const TOOL_CALL_CAP = 5;
const TOOL_TIMEOUT_MS = 15000;
const BACKOFF_INITIAL = 500;
const BACKOFF_MAX = 8000;
const BACKOFF_RETRIES = 3;
const LOOP_TIMEOUT_MS = 60000;

const DEFAULT_MODEL = "claude-sonnet-4-5-20250929";
const DEFAULT_MAX_TOKENS = 4096;

class AiChatService {
	constructor() {
		/** @type {import("./notion-api").NotionApi | null} */
		this._notionApi = null;
		this._userEmail = "inforecruitmyenglish@gmail.com";
	}

	setUserEmail(email) {
		if (typeof email === "string" && email.trim()) this._userEmail = email.trim();
	}

	get isConnected() { return true; }

	_buildClaudeTools() {
		const tools = [];
		if (this._notionApi) {
			const defs = this._notionApi.buildClaudeToolDefs();
			if (Array.isArray(defs)) {
				for (const t of defs) {
					tools.push({
						name: t.name,
						description: t.description,
						input_schema: t.input_schema || { type: "object", properties: {} },
					});
				}
			}
		}
		tools.push(
			{
				name: "memory_store_fact",
				description: "Store a fact or preference you were asked to remember. INPUT: key (short snake_case tag), value (plain English fact).",
				input_schema: { type: "object", properties: { key: { type: "string" }, value: { type: "string" } }, required: ["key", "value"] },
			},
			{
				name: "memory_forget_fact",
				description: "Delete a stored fact by its key. INPUT: key (snake_case tag).",
				input_schema: { type: "object", properties: { key: { type: "string" } }, required: ["key"] },
			},
			{
				name: "memory_list_facts",
				description: "List all stored facts and preferences.",
				input_schema: { type: "object", properties: {} },
			},
			{
				name: "memory_recall",
				description: "Search stored facts and page references by keyword. Use this when the pre-injected data doesn't contain what you need. INPUT: search (string, the word or phrase to search for).",
				input_schema: { type: "object", properties: { search: { type: "string", description: "Word or phrase to search for" } }, required: ["search"] },
			},
		);
		/* Page reference tools — auto-stored page IDs */
		tools.push(
			{
				name: "page_ref_find",
				description: "Find a stored Notion page ID by the teacher/page name. CALL THIS BEFORE notion_fetch or notion_update_page when the user refers to a page by name. INPUT: pageName (string, the teacher or page name to look up).",
				input_schema: { type: "object", properties: { pageName: { type: "string" } }, required: ["pageName"] },
			},
			{
				name: "page_ref_list",
				description: "List all stored page references — every page or record that was created or updated and auto-saved.",
				input_schema: { type: "object", properties: {} },
			},
			{
				name: "page_ref_remove",
				description: "Remove a stored page reference by name. INPUT: pageName (string).",
				input_schema: { type: "object", properties: { pageName: { type: "string" } }, required: ["pageName"] },
			},
		);
		const searchDefs = searchTools.buildToolDefs();
		if (Array.isArray(searchDefs)) {
			for (const t of searchDefs) tools.push(t);
		}
		return tools;
	}

	async _callNotionTool(toolName, args) {
		/* Memory tools handled inline */
		if (toolName === "memory_store_fact") {
			const key = typeof args.key === "string" ? args.key.trim() : "";
			const value = typeof args.value === "string" ? args.value.trim() : "";
			if (!key || !value) return { ok: false, data: [{ type: "text", text: "key and value required" }], isError: true, ms: 0 };
			const storeResult = await voiceMemory.storeFact({ userEmail: this._userEmail, key, value, sourceCid: null });
			let responseText = "Fact stored";
			if (storeResult.contradiction && storeResult.previousValue) {
				responseText = `Fact stored (previous: ${storeResult.previousValue} → new: ${value})`;
			}
			return { ok: storeResult.ok, data: [{ type: "text", text: responseText }], isError: !storeResult.ok, ms: 0 };
		}
		if (toolName === "memory_forget_fact") {
			const key = typeof args.key === "string" ? args.key.trim() : "";
			if (!key) return { ok: false, data: [{ type: "text", text: "key required" }], isError: true, ms: 0 };
			const forgetResult = await voiceMemory.forgetFact({ userEmail: this._userEmail, key });
			return { ok: forgetResult.ok, data: forgetResult.ok ? [{ type: "text", text: "Fact removed" }] : [{ type: "text", text: forgetResult.error?.message || "Unknown error" }], isError: !forgetResult.ok, ms: 0 };
		}
		if (toolName === "memory_list_facts") {
			const listResult = await voiceMemory.listFacts({ userEmail: this._userEmail });
			return { ok: listResult.ok, data: listResult.ok ? listResult.data.map(fact => ({ type: "text", text: `${fact.fact_key}: ${fact.fact_value}` })) : [{ type: "text", text: listResult.error?.message || "Unknown error" }], isError: !listResult.ok, ms: 0 };
		}
		if (toolName === "memory_recall") {
			const search = typeof args.search === "string" ? args.search.trim() : "";
			if (!search) return { ok: false, data: [{ type: "text", text: "search string required" }], isError: true, ms: 0 };
			const [factResults, pageRefResults] = await Promise.all([
				voiceMemory.searchFacts({ userEmail: this._userEmail, search, limit: 5 }),
				pageMemory.searchPageRefs({ userEmail: this._userEmail, search, limit: 5 }),
			]);
			const lines = [];
			if (factResults.ok && Array.isArray(factResults.data)) {
				for (const f of factResults.data) lines.push(`fact: ${f.fact_key}: ${f.fact_value}`);
			}
			if (pageRefResults.ok && Array.isArray(pageRefResults.data)) {
				for (const r of pageRefResults.data) lines.push(`page: ${r.page_name} → ${r.page_id}`);
			}
			if (lines.length === 0) lines.push("No matches found");
			return { ok: true, data: lines.map(text => ({ type: "text", text })), isError: false, ms: 0 };
		}

		/* Page reference tools */
		if (toolName === "page_ref_find") {
			const pageName = typeof args.pageName === "string" ? args.pageName.trim() : "";
			if (!pageName) return { ok: false, data: [{ type: "text", text: "pageName required" }], isError: true, ms: 0 };
			const findResult = await pageMemory.findPageRef({ userEmail: this._userEmail, pageName });
			if (findResult.ok && findResult.data) {
				return { ok: true, data: [{ type: "text", text: `Found page ID: ${findResult.data.page_id}` }], isError: false, ms: 0 };
			} else {
				return { ok: false, data: [{ type: "text", text: findResult.error?.message || "No page found with that name" }], isError: true, ms: 0 };
			}
		}
		if (toolName === "page_ref_list") {
			const listResult = await pageMemory.listPageRefs({ userEmail: this._userEmail });
			if (listResult.ok) {
				const facts = listResult.data.map(ref => `${ref.page_name} (ID: ${ref.page_id})`);
				return { ok: true, data: facts.map(text => ({ type: "text", text })), isError: false, ms: 0 };
			} else {
				return { ok: false, data: [{ type: "text", text: listResult.error?.message || "Unknown error" }], isError: true, ms: 0 };
			}
		}
		if (toolName === "page_ref_remove") {
			const pageName = typeof args.pageName === "string" ? args.pageName.trim() : "";
			if (!pageName) return { ok: false, data: [{ type: "text", text: "pageName required" }], isError: true, ms: 0 };
			const removeResult = await pageMemory.removePageRef({ userEmail: this._userEmail, pageName });
			return { ok: removeResult.ok, data: removeResult.ok ? [{ type: "text", text: "Page reference removed" }] : [{ type: "text", text: removeResult.error?.message || "Unknown error" }], isError: !removeResult.ok, ms: 0 };
		}

		/* Web search + Wikipedia tools */
		if (toolName === "web_search" || toolName === "web_fetch" || toolName === "wiki_search" || toolName === "wiki_lookup") {
			const result = await searchTools.callTool(toolName, args);
			return { ok: result.ok, data: result.data, isError: !result.ok, ms: 0 };
		}

		if (!this._notionApi) {
			return { ok: false, data: [{ type: "text", text: "NotionApi not initialized" }], isError: true, ms: 0 };
		}
		const t0 = Date.now();
		try {
			const result = await Promise.race([
				this._notionApi.callTool(toolName, args),
				new Promise((_, reject) => setTimeout(() => reject(new Error(`Tool ${toolName} timed out`)), TOOL_TIMEOUT_MS)),
			]);
			const ms = Date.now() - t0;
			if (result && result.ok) {
				/* Auto-store page IDs on successful writes */
				if (toolName === "notion_create_page" || toolName === "notion_update_page") {
					try {
						const body = JSON.parse(result.data[0].text);
						const pageId = body.id;
						if (pageId) {
							const teacherName = body.title || "";
							if (teacherName) {
								const dbId = toolName === "notion_create_page" ? String(args.database_id || "").trim() : "";
								pageMemory.storePageRef({ userEmail: this._userEmail, pageId, pageName: teacherName, databaseId: dbId, sourceCid: null }).catch(() => {});
							}
						}
					} catch {}
				}
				return { ok: true, data: result.data, isError: false, ms };
			}
			return { ok: false, data: [{ type: "text", text: result?.error?.message || "Unknown error" }], isError: true, ms };
		} catch (e) {
			return { ok: false, data: [{ type: "text", text: e instanceof Error ? e.message : String(e) }], isError: true, ms: Date.now() - t0 };
		}
	}

	async _callAnthropicWithTimeout(anthropic, body, signal) {
		const timeout = new Promise((_, reject) =>
			setTimeout(() => reject(new Error("Claude API timed out")), LOOP_TIMEOUT_MS)
		);
		return Promise.race([
			anthropic.messages.create(body, { signal }),
			timeout,
		]);
	}

	_systemPrompt() {
		return "You are a helpful assistant with access to a Notion workspace. Read pages, search content, and query databases when asked. Answer concisely. Do not narrate tool calls.";
	}

	async chat({ messages, model, maxTokens, systemPrompt, signal, onDelta, onToolUse }) {
		const cid = crypto.randomUUID();
		try {
		const anthropicKey = process.env.ANTHROPIC_API_KEY;
		if (!anthropicKey) {
			return { ok: false, error: { code: "NO_KEY", message: "ANTHROPIC_API_KEY not set", cid } };
		}
		if (!Array.isArray(messages) || messages.length === 0) {
			return { ok: false, error: { code: "BAD_INPUT", message: "messages required", cid } };
		}

		/* Load conversation history from Supabase and prepend */
		const userEmail = this._userEmail;
		const convResult = await voiceMemory.getRecentConversations({ userEmail, limit: 100 });
		if (convResult.ok && Array.isArray(convResult.data) && convResult.data.length > 0) {
			const historyMessages = convResult.data
				.slice()
				.reverse()
				.map(row => ({
					role: row.turn_role === "assistant" ? "assistant" : "user",
					content: row.content,
				}));
			messages.unshift(...historyMessages);
			log.info("chat", { convHistoryRows: convResult.data.length, cid });
		}

		const lastUserMsg = messages.reduceRight((acc, m) => {
			if (acc === null && m.role === "user" && typeof m.content === "string") return m.content;
			return acc;
		}, null);
		let assistantReply = "";

		const anthropic = new Anthropic({ apiKey: anthropicKey });
		const notionTools = this._buildClaudeTools();
		const effectiveModel = String(model || DEFAULT_MODEL).trim() || DEFAULT_MODEL;
		const effectiveMaxTokens = Math.min(8192, Math.max(16, Number(maxTokens) || DEFAULT_MAX_TOKENS));
		let sys = typeof systemPrompt === "string" && systemPrompt.trim() ? systemPrompt : this._systemPrompt();

		/* Inject stored facts and page references into system prompt via retrieval pipeline */
		const retrievalPipeline = require("./retrieval-pipeline");
		const contextBlocks = [];

		if (lastUserMsg) {
			const retrievalResult = await Promise.race([
				retrievalPipeline.retrieve({ userEmail, query: lastUserMsg, k: 10, confidenceThreshold: 0.4, staleDays: 90 }),
				new Promise(resolve => setTimeout(() => resolve({ facts: [], pageRefs: [], memories: [], staleFacts: [], writeStaleFacts: [], temporalSummary: null, temporalConversations: [] }), 1500)),
			]);

			if (Array.isArray(retrievalResult.memories) && retrievalResult.memories.length > 0) {
				const lines = retrievalResult.memories.map(h =>
					`- [${h.source_table}] (similarity ${(h.similarity || 0).toFixed(2)}) ${h.content}`
				);
				contextBlocks.push("## Relevant memories from past conversations:\n" + lines.join("\n"));
				log.info("chat", { recallHits: retrievalResult.memories.length, cid });
			}

			if (Array.isArray(retrievalResult.staleFacts) && retrievalResult.staleFacts.length > 0) {
				const staleLines = retrievalResult.staleFacts.slice(0, 3).map(f =>
					`  - ${f.fact_key}: ${f.fact_value} (stored ${new Date(f.updated_at || f.created_at).toLocaleDateString()}) — ask user if still current`
				);
				contextBlocks.push("## Facts to verify (may be outdated):\n" + staleLines.join("\n"));
				log.info("chat", { staleCount: retrievalResult.staleFacts.length, cid });
			}

			if (Array.isArray(retrievalResult.writeStaleFacts) && retrievalResult.writeStaleFacts.length > 0) {
				const writeStaleLines = retrievalResult.writeStaleFacts.map(f =>
					`  - ${f.fact_key}: ${f.fact_value} (updated ${new Date(f.updated_at || f.created_at).toLocaleDateString()})`
				);
				contextBlocks.push("## Facts older than 30 days (verify before writes):\n" + writeStaleLines.join("\n"));
				log.info("chat", { writeStaleCount: retrievalResult.writeStaleFacts.length, cid });
			}

			if (retrievalResult.temporalSummary) {
				const ts = retrievalResult.temporalSummary;
				const label = ts.week_label || "";
				let block = "## Past conversation summary";
				if (label) block += ` (${label})`;
				block += ":\n" + (ts.summaryText || ts.summary_text || "");
				if (Array.isArray(retrievalResult.temporalConversations) && retrievalResult.temporalConversations.length > 0) {
					const excerptLines = retrievalResult.temporalConversations.slice(0, 6).map(r =>
						`- ${r.turn_role === "assistant" ? "Assistant" : "User"}: ${r.content.slice(0, 200)}`
					);
					block += "\n\nRelevant conversations:\n" + excerptLines.join("\n");
				}
				contextBlocks.push(block);
				log.info("chat", { temporalInjected: 1, cid });
			}
		}

		/* Fallback: always include recent facts and page refs */
		const [factsFallback, refsFallback] = await Promise.all([
			voiceMemory.listFacts({ userEmail }),
			pageMemory.listPageRefs({ userEmail }),
		]);
		const fallbackFacts = (factsFallback.ok ? factsFallback.data : []).slice(0, 30);
		const fallbackRefs = (refsFallback.ok ? refsFallback.data : []).slice(0, 30);

		if (fallbackFacts.length > 0) {
			const factLines = fallbackFacts.map(f => `  - ${f.fact_key}: ${f.fact_value} (updated ${new Date(f.updated_at || f.created_at).toLocaleDateString()})`);
			contextBlocks.push("## Stored facts (most recent 30):\n" + factLines.join("\n"));
			log.info("chat", { injectedFacts: fallbackFacts.length, cid });
		}
		if (fallbackRefs.length > 0) {
			const refLines = fallbackRefs.map(r => `  - ${r.page_name} → page_id: ${r.page_id}${r.database_id ? ` (database: ${r.database_id})` : ""}`);
			contextBlocks.push("## Stored page references (most recent 30):\n" + refLines.join("\n"));
			log.info("chat", { injectedPageRefs: fallbackRefs.length, cid });
		}

		if (contextBlocks.length > 0) {
			sys = contextBlocks.join("\n\n") + "\n\n" + sys;
		}

		for (let loop = 0; loop <= TOOL_CALL_CAP; loop++) {
			if (loop === TOOL_CALL_CAP) {
				return { ok: false, error: { code: "LOOP_LIMIT", message: "Tool call limit reached", cid } };
			}
			if (signal && signal.aborted) {
				return { ok: false, error: { code: "ABORTED", message: "Request cancelled", cid } };
			}

			const body = {
				model: effectiveModel,
				max_tokens: effectiveMaxTokens,
				system: sys,
				messages,
			};
			if (notionTools.length > 0) {
				body.tools = notionTools;
			}

			let res;
			let apiErr = "";
			for (let attempt = 1; attempt <= BACKOFF_RETRIES; attempt++) {
				try {
					res = await this._callAnthropicWithTimeout(anthropic, body, signal);
					break;
				} catch (e) {
					if (signal && signal.aborted) throw e;
					apiErr = e instanceof Error ? e.message : String(e);
					log.warn("chat", { claudeApiError: apiErr, attempt, cid });
					if (attempt < BACKOFF_RETRIES) {
						const delay = Math.min(BACKOFF_INITIAL * Math.pow(2, attempt - 1), BACKOFF_MAX);
						await new Promise(r => setTimeout(r, delay));
					}
				}
			}
			if (!res) {
				return { ok: false, error: { code: "RATE_LIMITED", message: apiErr, cid } };
			}

			const toolUseBlocks = res.content.filter(b => b.type === "tool_use");
			const textBlocks = res.content.filter(b => b.type === "text");

			if (textBlocks.length > 0 && onDelta) {
				for (const b of textBlocks) onDelta(b.text);
			}

			if (toolUseBlocks.length === 0) {
				const text = textBlocks.map(b => b.text).join("");
				assistantReply = text;
				voiceMemory.storeTurn({ userEmail, role: "user", content: lastUserMsg, cid }).catch(() => {});
				voiceMemory.storeTurn({ userEmail, role: "assistant", content: text, cid }).catch(() => {});
				return { ok: true, data: text, cid };
			}

			messages.push({ role: "assistant", content: res.content });

			if (onToolUse) {
				for (const tb of toolUseBlocks) onToolUse(tb);
			}

			const toolResults = await Promise.all(toolUseBlocks.map(async (tb) => {
				const toolResult = await this._callNotionTool(tb.name, tb.input || {});
				log.info("chat", { toolCall: tb.name, ok: toolResult.ok, ms: toolResult.ms, cid });
				return { tb, toolResult };
			}));

			for (const { tb, toolResult } of toolResults) {
				messages.push({
					role: "user",
					content: [{
						type: "tool_result",
						tool_use_id: tb.id,
						content: toolResult.data,
						is_error: toolResult.isError,
					}],
				});
				if (onToolUse) {
					onToolUse({ type: "tool_result", tool_use_id: tb.id, name: tb.name, ok: toolResult.ok });
				}
			}
		}
	} catch (e) {
		const msg = e instanceof Error ? e.message : String(e);
		log.error("chat", { error: msg, cid });
		return { ok: false, error: { code: "CHAT_ERROR", message: msg, cid } };
	}
	}

	async listStatus() {
		if (this._notionApi) {
			return [{ name: "notion", connected: true, toolCount: (this._notionApi.buildClaudeToolDefs() || []).length }];
		}
		return [{ name: "notion", connected: false, toolCount: 0 }];
	}
}

let instance = null;
function getAiChatService() {
	if (!instance) instance = new AiChatService();
	return instance;
}

module.exports = { AiChatService, getAiChatService };
