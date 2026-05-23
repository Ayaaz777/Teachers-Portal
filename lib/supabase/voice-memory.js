const { getAdminClient } = require("./admin-client");
const { embed } = require("../embeddings");
const { log } = require("../log");

function redact(tag, data) {
	log.info(tag, data);
}

async function storeTurn({ userEmail, role, content, cid }) {
	try {
		const sb = getAdminClient();
		if (!sb) return { ok: false, error: { code: "SUPABASE_UNAVAILABLE", message: "Supabase not configured" } };
		const emb = await embed(content);
		if (!emb.ok) {
			redact("memory", { storeTurn: "embed_failed", role, cid, error: emb.error });
			const { error: insertErr } = await sb.from("voice_conversations").insert({
				user_email: userEmail, turn_role: role, content, cid,
			});
			if (insertErr) {
				redact("memory", { storeTurn: "insert_error", error: insertErr.message, cid });
				return { ok: false, error: { code: "DB_ERROR", message: insertErr.message } };
			}
			return { ok: true, data: null };
		}
		const { error: insertErr } = await sb.from("voice_conversations").insert({
			user_email: userEmail, turn_role: role, content, cid,
			embedding: emb.data,
		});
		if (insertErr) {
			redact("memory", { storeTurn: "insert_error", error: insertErr.message, cid });
			return { ok: false, error: { code: "DB_ERROR", message: insertErr.message } };
		}
		return { ok: true, data: null };
	} catch (e) {
		redact("memory", { storeTurn: "exception", error: e instanceof Error ? e.message : String(e), cid });
		return { ok: false, error: { code: "INTERNAL", message: e instanceof Error ? e.message : String(e) } };
	}
}

async function recallSemantic({ userEmail, queryText, k = 5 }) {
	try {
		const sb = getAdminClient();
		if (!sb) return { ok: false, error: { code: "SUPABASE_UNAVAILABLE", message: "Supabase not configured" } };
		if (!queryText || typeof queryText !== "string") {
			return { ok: false, error: { code: "BAD_INPUT", message: "queryText required" } };
		}
		const emb = await embed(queryText);
		if (!emb.ok) {
			return { ok: false, error: emb.error };
		}
		const { data, error } = await sb.rpc("match_voice_memories", {
			query_embedding: emb.data,
			match_count: k,
			user_email_filter: userEmail,
		});
		if (error) {
			redact("memory", { recallSemantic: "rpc_error", error: error.message });
			return { ok: false, error: { code: "RPC_ERROR", message: error.message } };
		}
		return { ok: true, data: data || [] };
	} catch (e) {
		redact("memory", { recallSemantic: "exception", error: e instanceof Error ? e.message : String(e) });
		return { ok: false, error: { code: "INTERNAL", message: e instanceof Error ? e.message : String(e) } };
	}
}

async function storeFact({ userEmail, key, value, sourceCid, confidence }) {
	try {
		const sb = getAdminClient();
		if (!sb) return { ok: false, error: { code: "SUPABASE_UNAVAILABLE", message: "Supabase not configured" } };
		const emb = await embed(key + ": " + value);

		/* Fetch previous value for contradiction detection */
		const { data: existing } = await sb.from("voice_facts")
			.select("fact_value")
			.eq("user_email", userEmail)
			.eq("fact_key", key)
			.maybeSingle();
		let previousValue = null;
		if (existing && existing.fact_value) {
			previousValue = existing.fact_value;
		}

		const payload = {
			user_email: userEmail, fact_key: key, fact_value: value, source_cid: sourceCid,
			confidence: typeof confidence === "number" ? confidence : 1.0,
		};
		if (previousValue) payload.previous_value = previousValue;
		if (emb.ok) payload.embedding = emb.data;
		const { error: upsertErr } = await sb.from("voice_facts").upsert(payload, {
			onConflict: "user_email, fact_key",
		});
		if (upsertErr) {
			redact("memory", { storeFact: "upsert_error", error: upsertErr.message, key, cid: sourceCid });
			return { ok: false, error: { code: "DB_ERROR", message: upsertErr.message } };
		}

		/* Compute contradiction flag */
		let contradiction = false;
		if (previousValue && previousValue !== value) {
			contradiction = true;
		}

		return { ok: true, data: null, contradiction, previousValue };
	} catch (e) {
		redact("memory", { storeFact: "exception", error: e instanceof Error ? e.message : String(e), key, cid: sourceCid });
		return { ok: false, error: { code: "INTERNAL", message: e instanceof Error ? e.message : String(e) } };
	}
}

async function listFacts({ userEmail }) {
	try {
		const sb = getAdminClient();
		if (!sb) return { ok: false, error: { code: "SUPABASE_UNAVAILABLE", message: "Supabase not configured" } };
		const { data, error } = await sb.from("voice_facts")
			.select("fact_key, fact_value, confidence, access_count, last_accessed_at, created_at, updated_at")
			.eq("user_email", userEmail)
			.order("updated_at", { ascending: false });
		if (error) {
			redact("memory", { listFacts: "select_error", error: error.message });
			return { ok: false, error: { code: "DB_ERROR", message: error.message } };
		}
		return { ok: true, data: data || [] };
	} catch (e) {
		redact("memory", { listFacts: "exception", error: e instanceof Error ? e.message : String(e) });
		return { ok: false, error: { code: "INTERNAL", message: e instanceof Error ? e.message : String(e) } };
	}
}

async function forgetFact({ userEmail, key }) {
	try {
		const sb = getAdminClient();
		if (!sb) return { ok: false, error: { code: "SUPABASE_UNAVAILABLE", message: "Supabase not configured" } };
		const { error } = await sb.from("voice_facts")
			.delete()
			.eq("user_email", userEmail)
			.eq("fact_key", key);
		if (error) {
			redact("memory", { forgetFact: "delete_error", error: error.message, key });
			return { ok: false, error: { code: "DB_ERROR", message: error.message } };
		}
		return { ok: true, data: null };
	} catch (e) {
		redact("memory", { forgetFact: "exception", error: e instanceof Error ? e.message : String(e), key });
		return { ok: false, error: { code: "INTERNAL", message: e instanceof Error ? e.message : String(e) } };
	}
}

async function getRecentConversations({ userEmail, limit = 100 }) {
	try {
		const sb = getAdminClient();
		if (!sb) return { ok: false, error: { code: "SUPABASE_UNAVAILABLE", message: "Supabase not configured" } };
		const { data, error } = await sb
			.from("voice_conversations")
			.select("turn_role, content")
			.eq("user_email", userEmail)
			.order("created_at", { ascending: false })
			.limit(limit);
		if (error) {
			redact("memory", { getRecentConversations: "select_error", error: error.message });
			return { ok: false, error: { code: "DB_ERROR", message: error.message } };
		}
		return { ok: true, data: data || [] };
	} catch (e) {
		redact("memory", { getRecentConversations: "exception", error: e instanceof Error ? e.message : String(e) });
		return { ok: false, error: { code: "INTERNAL", message: e instanceof Error ? e.message : String(e) } };
	}
}

async function searchFacts({ userEmail, search, limit = 5 }) {
	try {
		const sb = getAdminClient();
		if (!sb) return { ok: false, error: { code: "SUPABASE_UNAVAILABLE", message: "Supabase not configured" } };
		if (!search || typeof search !== "string" || !search.trim()) {
			return { ok: false, error: { code: "BAD_INPUT", message: "search string required" } };
		}
		const pattern = `%${search.trim()}%`;
		const { data, error } = await sb.from("voice_facts")
			.select("fact_key, fact_value, confidence, access_count, last_accessed_at, created_at, updated_at")
			.eq("user_email", userEmail)
			.or(`fact_key.ilike.${pattern},fact_value.ilike.${pattern}`)
			.order("updated_at", { ascending: false })
			.limit(limit);
		if (error) {
			redact("memory", { searchFacts: "select_error", error: error.message, search });
			return { ok: false, error: { code: "DB_ERROR", message: error.message } };
		}
		return { ok: true, data: data || [] };
	} catch (e) {
		redact("memory", { searchFacts: "exception", error: e instanceof Error ? e.message : String(e), search });
		return { ok: false, error: { code: "INTERNAL", message: e instanceof Error ? e.message : String(e) } };
	}
}

async function bumpAccess({ userEmail, key }) {
	try {
		const sb = getAdminClient();
		if (!sb) return;
		await sb.from("voice_facts")
			.update({ last_accessed_at: new Date().toISOString() })
			.eq("user_email", userEmail)
			.eq("fact_key", key);
	} catch {}
}

module.exports = { storeTurn, recallSemantic, storeFact, listFacts, forgetFact, getRecentConversations, searchFacts, bumpAccess };
