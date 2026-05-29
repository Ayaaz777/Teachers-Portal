/**
 * Supabase-backed planner storage service.
 * Replaces planner-file-store.js — same API surface, cloud-backed.
 */
const { getAdminClient } = require("./supabase/admin-client");

/** @returns {import("@supabase/supabase-js").SupabaseClient | null} */
function db() {
  return getAdminClient();
}

/**
 * @param {string} userId
 * @returns {boolean}
 */
function isValidScope(userId) {
  return Boolean(
    userId &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(userId.trim().toLowerCase())
  );
}

/* ======================== Events ======================== */

/**
 * @param {string} userId
 * @returns {Promise<import("@supabase/supabase-js").PostgrestSingleResponse<object[]> | null>}
 */
async function fetchEvents(userId) {
  return db().from("planner_events").select("*").eq("user_id", userId).order("start", { ascending: true });
}

/**
 * @param {string} userId
 * @param {object[]} rows
 * @param {string} [email]
 */
async function saveEvents(userId, rows, email) {
  if (!rows.length) return { ok: true };
  const now = new Date().toISOString();
  const payload = rows.map(r => ({
    id: r.id,
    user_id: userId,
    email: email || null,
    title: r.title,
    start: r.start,
    end_time: r.end_time || null,
    description: r.description || null,
    priority: typeof r.priority === "number" ? r.priority : 0,
    color: r.color || null,
    deferred_at: r.deferred_at || null,
    deferred_reason: r.deferred_reason || null,
    reminder_repeat: r.reminderRepeat || null,
    repeat_weekdays: Array.isArray(r.repeatWeekdays) ? r.repeatWeekdays : null,
    extra_times: Array.isArray(r.extraTimes) ? r.extraTimes : null,
    updated_at: now,
  }));
  return db().from("planner_events").upsert(payload, { onConflict: "id,user_id" });
}

/**
 * @param {string} userId
 * @param {string[]} idsToDelete
 */
async function deleteEventsById(userId, idsToDelete) {
  if (!idsToDelete.length) return { ok: true };
  return db().from("planner_events").delete().eq("user_id", userId).in("id", idsToDelete);
}

/* ======================== Day Pages ======================== */

/**
 * @param {string} userId
 */
async function fetchDayPages(userId) {
  return db().from("planner_day_pages").select("*").eq("user_id", userId);
}

/**
 * @param {string} userId
 * @param {{ id?: string, title?: string, notes?: string, todos?: object[] }[]} rows
 * @param {string} [email]
 */
async function saveDayPages(userId, rows, email) {
  if (!rows.length) return { ok: true };
  const now = new Date().toISOString();
  const payload = rows.map(r => ({
    id: String(r.id || ""),      // YYYY-MM-DD
    user_id: userId,
    email: email || null,
    title: r.title || null,
    notes: r.notes || null,
    todos: r.todos || [],
    updated_at: now,
  }));
  return db().from("planner_day_pages").upsert(payload, { onConflict: "id,user_id" });
}

/**
 * @param {string} userId
 * @param {string[]} idsToDelete
 */
async function deleteDayPagesById(userId, idsToDelete) {
  if (!idsToDelete.length) return { ok: true };
  return db().from("planner_day_pages").delete().eq("user_id", userId).in("id", idsToDelete);
}

/* ======================== Obsidian Notes ======================== */

/**
 * @param {string} userId
 */
async function fetchObsidianNotes(userId) {
  return db().from("planner_obsidian_notes").select("*").eq("user_id", userId).order("updated_at", { ascending: false });
}

/**
 * @param {string} userId
 * @param {{ id: string, title: string, content: string, createdAt?: string, updatedAt?: string }[]} notes
 * @param {string} [email]
 */
async function saveObsidianNotes(userId, notes, email) {
  const now = new Date().toISOString();
  const payload = notes.map(n => ({
    id: n.id,
    user_id: userId,
    email: email || null,
    title: n.title,
    content: n.content,
    created_at: n.createdAt || now,
    updated_at: now,
  }));
  return db().from("planner_obsidian_notes").upsert(payload, { onConflict: "id,user_id" });
}

/**
 * @param {string} userId
 * @param {string[]} idsToDelete
 */
async function deleteObsidianNotesById(userId, idsToDelete) {
  if (!idsToDelete.length) return { ok: true };
  return db().from("planner_obsidian_notes").delete().eq("user_id", userId).in("id", idsToDelete);
}

/* ======================== Key-Value (settings, trash, deferrals, meta) ======================== */

/**
 * @param {string} userId
 * @param {string} key
 */
async function fetchKv(userId, key) {
  return db().from("planner_kv").select("*").eq("user_id", userId).eq("id", key).maybeSingle();
}

/**
 * @param {string} userId
 * @param {string} key
 * @param {object} json
 * @param {string} [email]
 */
async function saveKv(userId, key, json, email) {
  const now = new Date().toISOString();
  return db().from("planner_kv").upsert({
    id: key,
    user_id: userId,
    email: email || null,
    json: json || {},
    updated_at: now,
  }, { onConflict: "id,user_id" });
}

module.exports = {
  isValidScope,
  fetchEvents,
  saveEvents,
  deleteEventsById,
  fetchDayPages,
  saveDayPages,
  deleteDayPagesById,
  fetchObsidianNotes,
  saveObsidianNotes,
  deleteObsidianNotesById,
  fetchKv,
  saveKv,
};
