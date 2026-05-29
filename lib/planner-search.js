/**
 * Semantic search embedding pipeline for planner data.
 * Chunks text, embeds with Xenova/bge-small-en-v1.5, upserts to Supabase.
 */
const { embed } = require("./embeddings");
const { getAdminClient } = require("./supabase/admin-client");

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 50;

/**
 * Split text into overlapping chunks.
 * @param {string} text
 * @returns {string[]}
 */
function chunkText(text) {
  const s = String(text || "").trim();
  if (!s) return [""];
  if (s.length <= CHUNK_SIZE) return [s];
  const chunks = [];
  let pos = 0;
  while (pos < s.length) {
    const end = Math.min(pos + CHUNK_SIZE, s.length);
    chunks.push(s.slice(pos, end));
    if (end >= s.length) break;
    pos += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

/**
 * Build text for embedding from planner item.
 * @param {string} source - 'obsidian' | 'reminder' | 'day_note'
 * @param {{ title?: string; content?: string; notes?: string; description?: string }} item
 * @param {{ id: string; text: string; done: boolean }[]} [todos]
 * @returns {string}
 */
function buildEmbedText(source, item, todos) {
  const title = (item.title || "").trim();
  const body = (item.content || item.notes || item.description || "").trim();
  if (source === "obsidian") return title + "\n" + body;
  if (source === "reminder") return title + (body ? "\n" + body : "");
  if (source === "day_note") {
    let text = (title ? title + "\n" : "") + body;
    if (Array.isArray(todos) && todos.length) {
      text += "\nTo-dos:\n" + todos.map(t => "- " + (t.done ? "[x] " : "[ ] ") + t.text).join("\n");
    }
    return text;
  }
  return title + " " + body;
}

/**
 * Embed a single planner item and upsert chunks.
 * @param {string} userId
 * @param {string} email
 * @param {string} source - 'obsidian' | 'reminder' | 'day_note'
 * @param {string} sourceId - note uuid / event id / 'YYYY-MM-DD'
 * @param {string} text - pre-built text to chunk/embed
 * @returns {Promise<{ ok: boolean; chunks: number; error?: string }>}
 */
async function embedAndUpsert(userId, email, source, sourceId, text) {
  try {
    const db = getAdminClient();
    if (!db) return { ok: false, chunks: 0, error: "Supabase not configured" };

    const trimmed = String(text || "").trim();
    if (!trimmed) {
      await db.from("planner_note_embeddings").delete().eq("user_id", userId).eq("source", source).eq("source_id", sourceId);
      return { ok: true, chunks: 0 };
    }

    const chunks = chunkText(trimmed);
    const embeddings = [];
    for (let i = 0; i < chunks.length; i++) {
      const embResult = await embed(chunks[i]);
      if (!embResult.ok || !embResult.data) continue;
      embeddings.push({
        user_id: userId,
        email: email || null,
        source,
        source_id: sourceId,
        chunk_index: i,
        chunk_text: chunks[i],
        embedding: embResult.data,
        updated_at: new Date().toISOString(),
      });
    }

    await db.from("planner_note_embeddings").delete().eq("user_id", userId).eq("source", source).eq("source_id", sourceId);
    if (embeddings.length) {
      await db.from("planner_note_embeddings").insert(embeddings);
    }

    return { ok: true, chunks: embeddings.length };
  } catch (e) {
    return { ok: false, chunks: 0, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * Remove embeddings for a planner item.
 * @param {string} userId
 * @param {string} source
 * @param {string} sourceId
 */
async function removeEmbeddings(userId, source, sourceId) {
  try {
    const db = getAdminClient();
    if (!db) return { ok: false, error: "Supabase not configured" };
    await db.from("planner_note_embeddings").delete().eq("user_id", userId).eq("source", source).eq("source_id", sourceId);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * Backfill embeddings for all existing planner data for a user.
 * Incremental: skips items whose embeddings are already up-to-date
 * (compares the item's updated_at to the stored embedding's updated_at).
 * @param {string} userId
 * @param {string} email
 * @param {boolean} [force=false] — if true, re-embeds everything (full rebuild)
 * @returns {Promise<{ ok: boolean; results: { obsidian: number; reminders: number; dayNotes: number; skipped: number }; error?: string }>}
 */
async function backfillAll(userId, email, force) {
  const db = getAdminClient();
  if (!db) return { ok: false, results: { obsidian: 0, reminders: 0, dayNotes: 0, skipped: 0 }, error: "Supabase not configured" };

  const results = { obsidian: 0, reminders: 0, dayNotes: 0, skipped: 0 };

  try {
    const [{ data: notes }, { data: events }, { data: days }, { data: existing }] = await Promise.all([
      db.from("planner_obsidian_notes").select("*").eq("user_id", userId),
      db.from("planner_events").select("*").eq("user_id", userId),
      db.from("planner_day_pages").select("*").eq("user_id", userId),
      force ? Promise.resolve({ data: [] }) : db.from("planner_note_embeddings").select("source,source_id,updated_at").eq("user_id", userId),
    ]);

    const embeddedMap = new Map();
    for (const row of (existing || [])) {
      embeddedMap.set(row.source + ":" + row.source_id, row.updated_at);
    }

    if (notes) {
      for (const n of notes) {
        const embUpdated = embeddedMap.get("obsidian:" + n.id);
        if (!force && embUpdated && n.updated_at && embUpdated >= n.updated_at) {
          results.skipped++;
          continue;
        }
        const text = buildEmbedText("obsidian", n);
        const r = await embedAndUpsert(userId, email, "obsidian", n.id, text);
        if (r.ok) results.obsidian++;
      }
    }
    if (events) {
      for (const e of events) {
        const embUpdated = embeddedMap.get("reminder:" + e.id);
        if (!force && embUpdated && e.updated_at && embUpdated >= e.updated_at) {
          results.skipped++;
          continue;
        }
        const text = buildEmbedText("reminder", e);
        const r = await embedAndUpsert(userId, email, "reminder", e.id, text);
        if (r.ok) results.reminders++;
      }
    }
    if (days) {
      for (const d of days) {
        const embUpdated = embeddedMap.get("day_note:" + d.id);
        if (!force && embUpdated && d.updated_at && embUpdated >= d.updated_at) {
          results.skipped++;
          continue;
        }
        const todos = Array.isArray(d.todos) ? d.todos : [];
        const text = buildEmbedText("day_note", d, todos);
        const r = await embedAndUpsert(userId, email, "day_note", d.id, text);
        if (r.ok) results.dayNotes++;
      }
    }

    return { ok: true, results };
  } catch (e) {
    return { ok: false, results, error: e instanceof Error ? e.message : String(e) };
  }
}

/**
 * Semantic search across all planner types.
 * @param {string} userId
 * @param {string} query
 * @param {number} [limit]
 * @param {number} [threshold]
 * @returns {Promise<{ ok: boolean; results?: { source: string; source_id: string; chunk_text: string; similarity: number }[]; error?: string }>}
 */
async function semanticSearch(userId, query, limit, threshold) {
  try {
    const embResult = await embed(query);
    if (!embResult.ok) return { ok: false, error: embResult.error?.message || "Embedding failed" };

    const db = getAdminClient();
    if (!db) return { ok: false, error: "Supabase not configured" };

    const { data, error } = await db.rpc("match_planner_notes", {
      query_embedding: embResult.data,
      match_user_id: userId,
      match_count: limit || 10,
      match_threshold: threshold ?? 0.45,
    });

    if (error) return { ok: false, error: error.message };
    return { ok: true, results: (data || []).map(r => ({ source: r.source, source_id: r.source_id, chunk_text: r.chunk_text, similarity: Math.round(r.similarity * 100) / 100 })) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

module.exports = { embedAndUpsert, removeEmbeddings, backfillAll, semanticSearch, buildEmbedText, chunkText };
