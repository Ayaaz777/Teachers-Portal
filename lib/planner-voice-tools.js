/**
 * Voice-agent planner tools — reminders, to-dos, day notes.
 * Built on the Phase 1 Supabase tables (planner_events, planner_day_pages, planner_kv).
 * All writes go through planner-store-supabase.js so UI stays in sync.
 */
const crypto = require("crypto");
const planner = require("./planner-store-supabase");
const { getAdminClient } = require("./supabase/admin-client");
const { embedAndUpsert, removeEmbeddings, buildEmbedText } = require("./planner-search");

/* ================================================================
 * HELPERS
 * ================================================================ */

/** Fire-and-forget re-embed after write */
function reindex(userId, email, source, sourceId, item, todos) {
  const text = buildEmbedText(source, item, todos);
  embedAndUpsert(userId, email, source, sourceId, text).catch(e => console.warn("[planner] reindex failed:", e instanceof Error ? e.message : String(e)));
}
function unindex(userId, source, sourceId) {
  removeEmbeddings(userId, source, sourceId).catch(e => console.warn("[planner] unindex failed:", e instanceof Error ? e.message : String(e)));
}

/** Normalize title/text for fuzzy matching */
function norm(text) {
  return String(text || "").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

/** Parse spoken date/time into ISO datetime string */
function parseSpokenDateTime(text, referenceDate) {
  const ref = referenceDate || new Date();
  const t = norm(text);

  if (t === "today") return toYmd(ref);
  if (t === "tomorrow") return toYmd(addDays(ref, 1));
  if (t === "day after tomorrow") return toYmd(addDays(ref, 2));

  const inHours = t.match(/^in\s+(\d+)\s*hours?$/i);
  if (inHours) return addHours(ref, Number(inHours[1])).toISOString();
  const inMins = t.match(/^in\s+(\d+)\s*min(?:ute)?s?$/i);
  if (inMins) return addMinutes(ref, Number(inMins[1])).toISOString();

  const days = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const dayIdx = days.indexOf(t.replace(/^next\s+/, ""));
  if (dayIdx >= 0) {
    const isNext = /^next\s+/.test(t);
    const todayDay = ref.getDay();
    let diff = dayIdx - todayDay;
    if (diff <= 0) diff += 7;
    if (isNext) diff += 7;
    return toYmd(addDays(ref, diff));
  }

  const dayTime = t.match(/^(\w+)\s+(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (dayTime) {
    const d = days.indexOf(dayTime[1].toLowerCase());
    if (d >= 0) {
      let hrs = Number(dayTime[2]);
      const mins = Number(dayTime[3] || 0);
      const ampm = (dayTime[4] || "").toLowerCase();
      if (ampm === "pm" && hrs < 12) hrs += 12;
      if (ampm === "am" && hrs === 12) hrs = 0;
      const todayDay = ref.getDay();
      let diff = d - todayDay;
      if (diff <= 0) diff += 7;
      const date = addDays(ref, diff);
      date.setHours(hrs, mins, 0, 0);
      return date.toISOString();
    }
  }

  const timeOnly = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (timeOnly) {
    let hrs = Number(timeOnly[1]);
    const mins = Number(timeOnly[2] || 0);
    const ampm = (timeOnly[3] || "").toLowerCase();
    if (ampm === "pm" && hrs < 12) hrs += 12;
    if (ampm === "am" && hrs === 12) hrs = 0;
    const date = new Date(ref);
    date.setHours(hrs, mins, 0, 0);
    return date.toISOString();
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;

  const snoozeHrs = t.match(/^(\d+)\s*hours?$/i);
  if (snoozeHrs) return addHours(ref, Number(snoozeHrs[1])).toISOString();
  const snoozeMins = t.match(/^(\d+)\s*min(?:ute)?s?$/i);
  if (snoozeMins) return addMinutes(ref, Number(snoozeMins[1])).toISOString();

  return null;
}

function toYmd(date) { return date.toISOString().slice(0, 10); }
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }
function addHours(date, n) { const d = new Date(date); d.setHours(d.getHours() + n); return d; }
function addMinutes(date, n) { const d = new Date(date); d.setMinutes(d.getMinutes() + n); return d; }
function nowISO() { return new Date().toISOString(); }

/* ================================================================
 * TRASH HELPERS
 * ================================================================ */

async function loadTrash(userId) {
  const db = getAdminClient();
  const r = await db.from("planner_kv").select("json").eq("user_id", userId).eq("id", "trash").maybeSingle();
  if (r?.data?.json && Array.isArray(r.data.json)) return r.data.json;
  return [];
}

async function saveTrash(userId, trash) {
  return planner.saveKv(userId, "trash", trash);
}

async function addToTrash(userId, kind, data) {
  const trash = await loadTrash(userId);
  trash.push({ kind, data, deletedAt: nowISO(), id: crypto.randomUUID() });
  await saveTrash(userId, trash);
  return { ok: true };
}

/* ================================================================
 * FUZZY MATCH HELPER
 * ================================================================ */

function fuzzyFind(items, query, titleFn) {
  const q = norm(query);
  if (!q || !items.length) return { exact: null, matches: [] };
  let exact = null;
  const matches = [];
  for (const item of items) {
    const t = norm(titleFn(item));
    if (t === q) exact = item;
    else if (t.includes(q)) matches.push(item);
  }
  if (exact) matches.unshift(exact);
  return { exact, matches };
}

function pickSingle(items, query, titleFn) {
  const { exact, matches } = fuzzyFind(items, query, titleFn);
  if (exact && matches.length === 1) return { item: exact, ambiguous: false };
  if (matches.length === 1) return { item: matches[0], ambiguous: false };
  if (matches.length === 0) return { item: null, ambiguous: false };
  return { item: null, ambiguous: true, matches };
}

/* ================================================================
 * TOOL DEFINITIONS
 * ================================================================ */

function buildToolDefs() {
  return [
    {
      name: "reminder_list",
      description: "List reminders. Optional filter: 'today', 'upcoming' (next 7 days), or a date range (from/to ISO dates). Without filter, lists all reminders.",
      input_schema: {
        type: "object",
        properties: {
          filter: { type: "string", description: "'all', 'today', 'upcoming', or leave empty for all" },
          from: { type: "string", description: "ISO start date (YYYY-MM-DD)" },
          to: { type: "string", description: "ISO end date (YYYY-MM-DD)" },
        },
      },
    },
    {
      name: "reminder_search",
      description: "Search reminders by keyword in title and description.",
      input_schema: {
        type: "object",
        properties: { query: { type: "string" } },
        required: ["query"],
      },
    },
    {
      name: "reminder_create",
      description: "Create a new reminder. dateTime: spoken date/time like 'tomorrow', 'Friday 3pm', 'next Monday'. priority: 'high'/'medium'/'low'. repeat: 'none','daily','weekly'. If weekly, provide weekdays as [0..6] (0=Sun). notes: optional description. IMPORTANT: If the user says 'delete' or 'remove', call reminder_delete instead — never create a reminder with 'delete' in its title.",
      input_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          dateTime: { type: "string", description: "Spoken date/time (tomorrow, Friday 3pm, next Monday, YYYY-MM-DD)" },
          priority: { type: "string", description: "'high', 'medium', or 'low'" },
          repeat: { type: "string", description: "'none', 'daily', 'weekly'" },
          weekdays: { type: "array", items: { type: "integer" }, description: "Weekdays for weekly repeat [0=Sun..6=Sat]" },
          notes: { type: "string", description: "Optional extra notes" },
        },
        required: ["title", "dateTime"],
      },
    },
    {
      name: "reminder_edit",
      description: "Edit an existing reminder by fuzzy-matching its title. Update any field. DESTRUCTIVE — confirm with user before calling.",
      input_schema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the reminder to edit (fuzzy match)" },
          newTitle: { type: "string", description: "New title (optional)" },
          dateTime: { type: "string", description: "New date/time (optional, spoken)" },
          priority: { type: "string", description: "New priority (optional)" },
          notes: { type: "string", description: "New notes (optional)" },
          confirm: { type: "boolean", description: "Set to true after user confirms" },
        },
        required: ["title", "confirm"],
      },
    },
    {
      name: "reminder_reschedule",
      description: "Change the date/time of a reminder.",
      input_schema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the reminder (fuzzy match)" },
          newDateTime: { type: "string", description: "New spoken date/time" },
        },
        required: ["title", "newDateTime"],
      },
    },
    {
      name: "reminder_snooze",
      description: "Snooze a reminder. duration: '10 min', '1 hour', 'tomorrow', 'in 3 hours', etc.",
      input_schema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the reminder (fuzzy match)" },
          duration: { type: "string", description: "Snooze duration (10 min, 1 hour, tomorrow)" },
        },
        required: ["title", "duration"],
      },
    },
    {
      name: "reminder_set_priority",
      description: "Change a reminder's priority. Not destructive — no confirmation needed.",
      input_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          priority: { type: "string", description: "'high', 'medium', or 'low'" },
        },
        required: ["title", "priority"],
      },
    },
    {
      name: "reminder_delete",
      description: "Delete a reminder (moves to Trash — recoverable). DESTRUCTIVE — confirm with user before calling.",
      input_schema: {
        type: "object",
        properties: {
          title: { type: "string", description: "Title of the reminder (fuzzy match)" },
          confirm: { type: "boolean", description: "Set to true after user explicitly confirms" },
        },
        required: ["title", "confirm"],
      },
    },

    {
      name: "todo_list",
      description: "List to-dos for a given day. Defaults to today if no date specified.",
      input_schema: {
        type: "object",
        properties: { date: { type: "string", description: "Spoken date (today, tomorrow, Friday, YYYY-MM-DD) — defaults to today" } },
      },
    },
    {
      name: "todo_add",
      description: "Add a to-do to a day. Defaults to today.",
      input_schema: {
        type: "object",
        properties: {
          date: { type: "string", description: "Spoken date — defaults to today" },
          text: { type: "string", description: "The to-do text" },
        },
        required: ["text"],
      },
    },
    {
      name: "todo_complete",
      description: "Mark a to-do as done (complete=true) or undo (complete=false). Fuzzy match on text.",
      input_schema: {
        type: "object",
        properties: {
          text: { type: "string", description: "To-do text to match (fuzzy)" },
          date: { type: "string", description: "Day the to-do is on — defaults to today" },
          complete: { type: "boolean", description: "true to mark done, false to undo" },
        },
        required: ["text"],
      },
    },
    {
      name: "todo_edit",
      description: "Change a to-do's text. Not destructive — no confirmation needed.",
      input_schema: {
        type: "object",
        properties: {
          text: { type: "string", description: "Current to-do text to match (fuzzy)" },
          newText: { type: "string", description: "New text" },
          date: { type: "string", description: "Day the to-do is on — defaults to today" },
        },
        required: ["text", "newText"],
      },
    },
    {
      name: "todo_delete",
      description: "Delete a to-do (moves to Trash — recoverable). DESTRUCTIVE — confirm with user before calling.",
      input_schema: {
        type: "object",
        properties: {
          text: { type: "string", description: "To-do text to match (fuzzy)" },
          date: { type: "string", description: "Day the to-do is on — defaults to today" },
          confirm: { type: "boolean", description: "Set to true after user confirms" },
        },
        required: ["text", "confirm"],
      },
    },

    {
      name: "daynote_read",
      description: "Read a day's notes. Defaults to today.",
      input_schema: {
        type: "object",
        properties: { date: { type: "string", description: "Spoken date — defaults to today" } },
      },
    },
    {
      name: "daynote_append",
      description: "Append text to a day's notes. Non-destructive — no confirmation needed. Defaults to today.",
      input_schema: {
        type: "object",
        properties: {
          date: { type: "string", description: "Spoken date — defaults to today" },
          content: { type: "string", description: "Text to append" },
        },
        required: ["content"],
      },
    },
    {
      name: "daynote_edit",
      description: "Replace the entire content of a day's notes. DESTRUCTIVE — confirm with user before calling.",
      input_schema: {
        type: "object",
        properties: {
          date: { type: "string", description: "Spoken date — defaults to today" },
          content: { type: "string", description: "New full content" },
          confirm: { type: "boolean", description: "Set to true after user confirms" },
        },
        required: ["content", "confirm"],
      },
    },
  ];
}

/* ================================================================
 * TOOL HANDLER
 * ================================================================ */

async function callTool(tName, tInput, userId, email) {
  try {
    if (tName === "reminder_list") {
      const { data } = await planner.fetchEvents(userId);
      let events = (data || []).filter(e => !e.deferred_at);
      const filter = String(tInput.filter || "").toLowerCase();
      if (filter === "today") events = events.filter(e => e.start.startsWith(toYmd(new Date())));
      else if (filter === "upcoming") {
        const today = toYmd(new Date());
        const week = toYmd(addDays(new Date(), 7));
        events = events.filter(e => e.start >= today && e.start <= week);
      }
      if (tInput.from) events = events.filter(e => e.start >= String(tInput.from));
      if (tInput.to) events = events.filter(e => e.start <= String(tInput.to));
      events.sort((a, b) => (a.start || "").localeCompare(b.start || ""));
      return { ok: true, data: events };
    }

    if (tName === "reminder_search") {
      const query = norm(String(tInput.query || ""));
      if (!query) return { ok: false, error: { code: "BAD_INPUT", message: "query required" } };
      const { data } = await planner.fetchEvents(userId);
      const hits = (data || []).filter(e => {
        const hay = norm(`${e.title} ${e.description || ""}`);
        return hay.includes(query);
      });
      return { ok: true, data: hits };
    }

    if (tName === "reminder_create") {
      const title = String(tInput.title || "").trim();
      const dateTime = String(tInput.dateTime || "").trim();
      if (!title || !dateTime) return { ok: false, error: { code: "BAD_INPUT", message: "title and dateTime required" } };
      const parsed = parseSpokenDateTime(dateTime, new Date());
      if (!parsed) return { ok: false, error: { code: "BAD_INPUT", message: "Could not parse date/time: \"" + dateTime + "\". Try 'tomorrow', 'Friday 3pm', or 'YYYY-MM-DD'." } };
      const notes = String(tInput.notes || "").trim();
      const priorityMap = { high: 2, medium: 1, low: 0 };
      const priority = priorityMap[String(tInput.priority || "").toLowerCase()] ?? 0;
      const repeat = String(tInput.repeat || "none").toLowerCase();
      const event = {
        id: crypto.randomUUID(),
        title,
        start: parsed,
        end_time: null,
        description: notes || null,
        priority,
        color: null,
        deferred_at: null,
        deferred_reason: null,
        reminder_repeat: repeat === "none" ? null : repeat,
        repeat_weekdays: repeat === "weekly" && Array.isArray(tInput.weekdays) ? tInput.weekdays : null,
        extra_times: null,
      };
      await planner.saveEvents(userId, [event], email);
      reindex(userId, email, "reminder", event.id, { title, description: notes || undefined });
      return { ok: true, data: { id: event.id, title, start: parsed } };
    }

    if (tName === "reminder_edit") {
      if (!tInput.confirm) return { ok: false, error: { code: "CONFIRM_REQUIRED", message: "Confirm by setting confirm=true after user says yes." } };
      const title = norm(String(tInput.title || ""));
      if (!title) return { ok: false, error: { code: "BAD_INPUT", message: "title required" } };
      const { data } = await planner.fetchEvents(userId);
      const pick = pickSingle(data || [], title, e => e.title);
      if (pick.ambiguous) return { ok: false, error: { code: "AMBIGUOUS", message: "Multiple matches: " + pick.matches.map(m => '"' + m.title + '" (' + (m.start || "").slice(0, 10) + ")").join(", ") + ". Which one?" } };
      if (!pick.item) return { ok: false, error: { code: "NOT_FOUND", message: "No reminder matching \"" + tInput.title + "\"" } };
      const item = pick.item;
      if (tInput.newTitle) item.title = String(tInput.newTitle).trim() || item.title;
      if (tInput.dateTime) {
        const p = parseSpokenDateTime(String(tInput.dateTime), new Date());
        if (p) item.start = p;
      }
      if (tInput.priority) {
        const pm = { high: 2, medium: 1, low: 0 };
        item.priority = pm[String(tInput.priority).toLowerCase()] ?? item.priority;
      }
      if (tInput.notes !== undefined) item.description = String(tInput.notes || "").trim() || null;
      await planner.saveEvents(userId, [item], email);
      reindex(userId, email, "reminder", item.id, { title: item.title, description: item.description || undefined });
      return { ok: true, data: { id: item.id, title: item.title } };
    }

    if (tName === "reminder_reschedule") {
      const title = norm(String(tInput.title || ""));
      const newDt = String(tInput.newDateTime || "").trim();
      if (!title || !newDt) return { ok: false, error: { code: "BAD_INPUT", message: "title and newDateTime required" } };
      const parsed = parseSpokenDateTime(newDt, new Date());
      if (!parsed) return { ok: false, error: { code: "BAD_INPUT", message: "Could not parse: \"" + newDt + "\"." } };
      const { data } = await planner.fetchEvents(userId);
      const pick = pickSingle(data || [], title, e => e.title);
      if (pick.ambiguous) return { ok: false, error: { code: "AMBIGUOUS", message: "Multiple matches: " + pick.matches.map(m => '"' + m.title + '"').join(", ") + "." } };
      if (!pick.item) return { ok: false, error: { code: "NOT_FOUND", message: "No reminder matching \"" + tInput.title + "\"" } };
      pick.item.start = parsed;
      await planner.saveEvents(userId, [pick.item], email);
      reindex(userId, email, "reminder", pick.item.id, { title: pick.item.title, description: pick.item.description || undefined });
      return { ok: true, data: { id: pick.item.id, title: pick.item.title, newStart: parsed } };
    }

    if (tName === "reminder_snooze") {
      const title = norm(String(tInput.title || ""));
      const duration = String(tInput.duration || "").trim();
      if (!title || !duration) return { ok: false, error: { code: "BAD_INPUT", message: "title and duration required" } };
      const { data } = await planner.fetchEvents(userId);
      const pick = pickSingle(data || [], title, e => e.title);
      if (!pick.item) return { ok: false, error: { code: "NOT_FOUND", message: "No reminder matching \"" + tInput.title + "\"" } };
      let snoozed;
      if (duration === "tomorrow") {
        const orig = new Date(pick.item.start);
        const tomorrow = addDays(new Date(), 1);
        tomorrow.setHours(orig.getHours(), orig.getMinutes(), 0, 0);
        snoozed = tomorrow.toISOString();
      } else {
        const parsed = parseSpokenDateTime(duration, new Date());
        if (!parsed) return { ok: false, error: { code: "BAD_INPUT", message: "Could not parse duration: \"" + duration + "\". Try '10 min', '1 hour', 'tomorrow'." } };
        snoozed = parsed;
      }
      pick.item.start = snoozed;
      await planner.saveEvents(userId, [pick.item], email);
      reindex(userId, email, "reminder", pick.item.id, { title: pick.item.title, description: pick.item.description || undefined });
      return { ok: true, data: { title: pick.item.title, snoozedUntil: snoozed } };
    }

    if (tName === "reminder_set_priority") {
      const title = norm(String(tInput.title || ""));
      const priority = String(tInput.priority || "").toLowerCase();
      const pm = { high: 2, medium: 1, low: 0 };
      if (!(priority in pm)) return { ok: false, error: { code: "BAD_INPUT", message: "priority must be high, medium, or low" } };
      const { data } = await planner.fetchEvents(userId);
      const pick = pickSingle(data || [], title, e => e.title);
      if (pick.ambiguous) return { ok: false, error: { code: "AMBIGUOUS", message: "Multiple matches: " + pick.matches.map(m => '"' + m.title + '"').join(", ") + "." } };
      if (!pick.item) return { ok: false, error: { code: "NOT_FOUND", message: "No reminder matching \"" + tInput.title + "\"" } };
      pick.item.priority = pm[priority];
      await planner.saveEvents(userId, [pick.item], email);
      reindex(userId, email, "reminder", pick.item.id, { title: pick.item.title, description: pick.item.description || undefined });
      return { ok: true, data: { title: pick.item.title, priority } };
    }

    if (tName === "reminder_delete") {
      if (!tInput.confirm) return { ok: false, error: { code: "CONFIRM_REQUIRED", message: "Confirm by setting confirm=true after user explicitly says yes." } };
      const title = norm(String(tInput.title || ""));
      if (!title) return { ok: false, error: { code: "BAD_INPUT", message: "title required" } };
      const { data } = await planner.fetchEvents(userId);
      const pick = pickSingle(data || [], title, e => e.title);
      if (pick.ambiguous) return { ok: false, error: { code: "AMBIGUOUS", message: "Multiple matches: " + pick.matches.map(m => '"' + m.title + '" (' + (m.start || "").slice(0, 10) + ")").join(", ") + ". Which one?" } };
      if (!pick.item) return { ok: false, error: { code: "NOT_FOUND", message: "No reminder matching \"" + tInput.title + "\"" } };
      await addToTrash(userId, "reminder", pick.item);
      await planner.deleteEventsById(userId, [pick.item.id]);
      unindex(userId, "reminder", pick.item.id);
      return { ok: true, data: { deleted: pick.item.title, movedTo: "trash" } };
    }

    /* ---- To-dos ---- */
    const resolveDate = (spoken) => {
      if (!spoken) return toYmd(new Date());
      const p = parseSpokenDateTime(String(spoken), new Date());
      return p ? toYmd(new Date(p)) : toYmd(new Date());
    };

    if (tName === "todo_list") {
      const ymd = resolveDate(tInput.date);
      const { data } = await planner.fetchDayPages(userId);
      const row = (data || []).find(r => r.id === ymd);
      return { ok: true, data: { date: ymd, todos: row?.todos || [] } };
    }

    if (tName === "todo_add") {
      const ymd = resolveDate(tInput.date);
      const text = String(tInput.text || "").trim();
      if (!text) return { ok: false, error: { code: "BAD_INPUT", message: "text required" } };
      const { data } = await planner.fetchDayPages(userId);
      let row = (data || []).find(r => r.id === ymd);
      const todos = Array.isArray(row?.todos) ? [...row.todos] : [];
      todos.push({ id: crypto.randomUUID(), text, done: false });
      await planner.saveDayPages(userId, [{ id: ymd, title: row?.title || null, notes: row?.notes || null, todos }], email);
      reindex(userId, email, "day_note", ymd, { title: row?.title || undefined, notes: row?.notes || undefined }, todos);
      return { ok: true, data: { date: ymd, text, id: todos[todos.length - 1].id } };
    }

    if (tName === "todo_complete") {
      const ymd = resolveDate(tInput.date);
      const text = norm(String(tInput.text || ""));
      const complete = tInput.complete !== false;
      if (!text) return { ok: false, error: { code: "BAD_INPUT", message: "text required" } };
      const { data } = await planner.fetchDayPages(userId);
      let row = (data || []).find(r => r.id === ymd);
      const todos = Array.isArray(row?.todos) ? [...row.todos] : [];
      const found = todos.find(t => norm(t.text).includes(text));
      if (!found) return { ok: false, error: { code: "NOT_FOUND", message: "No to-do matching \"" + tInput.text + "\" on " + ymd } };
      found.done = complete;
      await planner.saveDayPages(userId, [{ id: ymd, title: row?.title || null, notes: row?.notes || null, todos }], email);
      reindex(userId, email, "day_note", ymd, { title: row?.title || undefined, notes: row?.notes || undefined }, todos);
      return { ok: true, data: { text: found.text, done: complete, date: ymd } };
    }

    if (tName === "todo_edit") {
      const ymd = resolveDate(tInput.date);
      const text = norm(String(tInput.text || ""));
      const newText = String(tInput.newText || "").trim();
      if (!text || !newText) return { ok: false, error: { code: "BAD_INPUT", message: "text and newText required" } };
      const { data } = await planner.fetchDayPages(userId);
      let row = (data || []).find(r => r.id === ymd);
      const todos = Array.isArray(row?.todos) ? [...row.todos] : [];
      const found = todos.find(t => norm(t.text).includes(text));
      if (!found) return { ok: false, error: { code: "NOT_FOUND", message: "No to-do matching \"" + tInput.text + "\"" } };
      found.text = newText;
      await planner.saveDayPages(userId, [{ id: ymd, title: row?.title || null, notes: row?.notes || null, todos }], email);
      reindex(userId, email, "day_note", ymd, { title: row?.title || undefined, notes: row?.notes || undefined }, todos);
      return { ok: true, data: { date: ymd, old: tInput.text, new: newText } };
    }

    if (tName === "todo_delete") {
      if (!tInput.confirm) return { ok: false, error: { code: "CONFIRM_REQUIRED", message: "Confirm by setting confirm=true after user says yes." } };
      const ymd = resolveDate(tInput.date);
      const text = norm(String(tInput.text || ""));
      if (!text) return { ok: false, error: { code: "BAD_INPUT", message: "text required" } };
      const { data } = await planner.fetchDayPages(userId);
      let row = (data || []).find(r => r.id === ymd);
      const todos = Array.isArray(row?.todos) ? [...row.todos] : [];
      const idx = todos.findIndex(t => norm(t.text).includes(text));
      if (idx === -1) return { ok: false, error: { code: "NOT_FOUND", message: "No to-do matching \"" + tInput.text + "\"" } };
      const removed = todos.splice(idx, 1)[0];
      await addToTrash(userId, "todo", { date: ymd, ...removed });
      await planner.saveDayPages(userId, [{ id: ymd, title: row?.title || null, notes: row?.notes || null, todos }], email);
      reindex(userId, email, "day_note", ymd, { title: row?.title || undefined, notes: row?.notes || undefined }, todos);
      return { ok: true, data: { deleted: removed.text, movedTo: "trash" } };
    }

    /* ---- Day notes ---- */

    if (tName === "daynote_read") {
      const ymd = resolveDate(tInput.date);
      const { data } = await planner.fetchDayPages(userId);
      const row = (data || []).find(r => r.id === ymd);
      return { ok: true, data: { date: ymd, title: row?.title || null, notes: row?.notes || null } };
    }

    if (tName === "daynote_append") {
      const ymd = resolveDate(tInput.date);
      const content = String(tInput.content || "").trim();
      if (!content) return { ok: false, error: { code: "BAD_INPUT", message: "content required" } };
      const { data } = await planner.fetchDayPages(userId);
      let row = (data || []).find(r => r.id === ymd);
      const notes = (row?.notes || "") + "\n\n" + content;
      await planner.saveDayPages(userId, [{ id: ymd, title: row?.title || null, notes: notes.trim(), todos: row?.todos || [] }], email);
      reindex(userId, email, "day_note", ymd, { title: row?.title || undefined, notes: notes.trim() }, row?.todos || []);
      return { ok: true, data: { date: ymd, appended: content.slice(0, 100) } };
    }

    if (tName === "daynote_edit") {
      if (!tInput.confirm) return { ok: false, error: { code: "CONFIRM_REQUIRED", message: "Confirm by setting confirm=true after user says yes." } };
      const ymd = resolveDate(tInput.date);
      const content = String(tInput.content || "").trim();
      if (!content) return { ok: false, error: { code: "BAD_INPUT", message: "content required" } };
      const { data } = await planner.fetchDayPages(userId);
      let row = (data || []).find(r => r.id === ymd);
      await planner.saveDayPages(userId, [{ id: ymd, title: row?.title || null, notes: content, todos: row?.todos || [] }], email);
      reindex(userId, email, "day_note", ymd, { title: row?.title || undefined, notes: content }, row?.todos || []);
      return { ok: true, data: { date: ymd, replaced: true } };
    }

    return { ok: false, error: { code: "UNKNOWN_TOOL", message: "Unknown tool: " + tName } };
  } catch (e) {
    return { ok: false, error: { code: "INTERNAL", message: e instanceof Error ? e.message : String(e) } };
  }
}

module.exports = { buildToolDefs, callTool };
