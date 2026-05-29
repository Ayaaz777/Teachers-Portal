/**
 * One-time migration: import local planner JSON files into Supabase.
 * Idempotent — safe to re-run; existing rows are upserted by PK.
 */
const fs = require("fs");
const path = require("path");
const { createPlannerFileStore, PLANNER_FILE_KEYS } = require("../planner-file-store");
const planner = require("./planner-store-supabase");

/**
 * @param {string} userDataPath
 * @param {string} userId
 * @param {string} [email]
 * @param {string} [firstName]
 * @returns {Promise<{ ok: boolean; imported: { events: number; dayPages: number; obsidian: number; kv: number }; error?: string }>}
 */
async function migratePlannerToSupabase(userDataPath, userId, email, firstName) {
  if (!planner.isValidScope(userId)) {
    return { ok: false, imported: { events: 0, dayPages: 0, obsidian: 0, kv: 0 }, error: "Invalid user scope" };
  }

  const store = createPlannerFileStore(userDataPath, userId);
  if (!store.isInitialized()) {
    return { ok: true, imported: { events: 0, dayPages: 0, obsidian: 0, kv: 0 } };
  }

  const results = { events: 0, dayPages: 0, obsidian: 0, kv: 0 };

  try {
    /* --- Events --- */
    const eventsRaw = store.read("events");
    if (eventsRaw) {
      try {
        const events = JSON.parse(eventsRaw);
        if (Array.isArray(events) && events.length) {
          const valid = events.filter(e => e && typeof e.id === "string" && typeof e.title === "string");
          if (valid.length) {
            const { error } = await planner.saveEvents(userId, valid, email);
            if (!error) results.events = valid.length;
          }
        }
      } catch { /* skip corrupt files */ }
    }

    /* --- Day pages --- */
    const dpRaw = store.read("day-pages");
    if (dpRaw) {
      try {
        const dp = JSON.parse(dpRaw);
        if (dp && typeof dp === "object" && !Array.isArray(dp)) {
          const rows = Object.entries(dp)
            .filter(([k]) => /^\d{4}-\d{2}-\d{2}$/.test(k))
            .map(([id, v]) => {
              const p = /** @type {{ title?: string; notes?: string; todos?: object[] }} */ (v);
              return {
                id,
                title: typeof p.title === "string" ? p.title : null,
                notes: typeof p.notes === "string" ? p.notes : null,
                todos: Array.isArray(p.todos) ? p.todos : [],
              };
            });
          if (rows.length) {
            const { error } = await planner.saveDayPages(userId, rows, email);
            if (!error) results.dayPages = rows.length;
          }
        }
      } catch { /* skip */ }
    }

    /* --- Obsidian notes --- */
    const obsRaw = store.read("obsidian-notes");
    if (obsRaw) {
      try {
        const obs = JSON.parse(obsRaw);
        if (obs && Array.isArray(obs.notes) && obs.notes.length) {
          const { error } = await planner.saveObsidianNotes(userId, obs.notes, email);
          if (!error) results.obsidian = obs.notes.length;
        }
      } catch { /* skip */ }
    }

    /* --- Key-value (settings, trash, deferrals, meta) --- */
    for (const key of ["settings", "trash", "deferrals", "meta"]) {
      const raw = store.read(key);
      if (raw) {
        try {
          const json = JSON.parse(raw);
          const db = require("./supabase/admin-client").getAdminClient();
          const { error } = await db.from("planner_kv").upsert({
            id: key,
            user_id: userId,
            email: email || null,
            json: json || {},
            updated_at: new Date().toISOString(),
          }, { onConflict: "id,user_id" });
          if (!error) results.kv++;
        } catch { /* skip */ }
      }
    }

    return { ok: true, imported: results };
  } catch (e) {
    return {
      ok: false,
      imported: results,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

module.exports = { migratePlannerToSupabase };
