/**
 * Inline Obsidian-style view for My planner — files, editor, live graph.
 * @typedef {{ getEvents: () => unknown[]; getDayPages: () => Record<string, unknown>; saveEvents: () => void; saveDayPages: () => void; openCalendarDay?: (ymd: string) => void }} RmeObsidianBridge
 * @typedef {{ openDaySheet: (ymd: string) => void; openReminderEditor: (ev: unknown, dayKey?: string) => void; refresh?: (opts?: { force?: boolean }) => void }} RmePlannerUi
 */
(function rmeObsidianPlannerView() {
  "use strict";

  const PRIORITY_LABELS = ["High", "Medium", "Low"];
  /** Matches My planner calendar: 0 = high, 1 = medium, 2 = low */
  const PRIORITY_HEX = ["#dc2626", "#ca8a04", "#2563eb"];
  /** Solid wikilink / structural edges. */
  const GRAPH_LINK_SOLID_COLOR = "#60a5fa";
  const GRAPH_LINK_SOLID_DIM = "#1e40af";
  /** Dashed unlinked-mention edges. */
  const GRAPH_LINK_DASH_COLOR = "#c4b5fd";
  const GRAPH_LINK_DASH_DIM = "#7c3aed";
  /** Day pages with written notes (no to-dos). */
  const GRAPH_DAY_NOTE_COLOR = "#fbbf24";
  /** Day pages with a custom title (e.g. Budget). */
  const GRAPH_DAY_NAMED_COLOR = "#60a5fa";
  /** Day anchors with no notes or to-dos yet. */
  const GRAPH_DAY_EMPTY_SLATE = "#94a3b8";
  /** Day pages with to-dos (and nodes linked from to-do lines). */
  const GRAPH_TODO_TEAL = "#6ee7b7";
  /** Default graph (no hover): tinted but readable. */
  const GRAPH_DIM_IDLE = 0.58;
  /** Non-neighbor nodes while hovering/selecting. */
  const GRAPH_DIM_FADED = 0.28;
  const TAG_RE = /(?:^|\s)#([a-zA-Z0-9_/-]+)/g;
  const MD_LINK_RE = /\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const LINK = () => window.RmeObsidianLinks;
  const KEYWORDS = () => window.keywordsApi;

  /** @type {HTMLElement | null} */
  let hostEl = null;
  /** @type {RmeObsidianBridge | null} */
  let bridge = null;
  /** @type {Record<string, HTMLElement>} */
  let els = {};
  /** @type {Map<string, { id: string; path: string; title: string; folder: string; kind: string; content: string; links: string[]; tags: string[]; meta?: Record<string, unknown> }>} */
  let notes = new Map();
  /** @type {{ source: string; target: string; type: string; label?: string; heading?: string; block?: string }[]} */
  let edges = [];
  /** @type {Map<string, string>} */
  let aliasIndex = new Map();
  /** @type {Record<string, unknown>} */
  let dayPagesRaw = {};
  /** @type {Record<string, unknown>[]} */
  let eventsRaw = [];
  /** @type {{ id: string; title: string; content: string; createdAt: string; updatedAt: string }[]} */
  let obsidianNotesRaw = [];
  let activeId = null;
  let editorMode = "preview";
  let leftMode = "files";
  let filesNavOpen = false;
  let sidePanelOpen = false;
  let settingsPanelOpen = false;
  let dirty = false;
  let saveTimer = 0;
  let uiBound = false;
  let keywordSyncTimer = 0;
  let keywordMentionsReq = 0;
  /** @type {{ enabled: boolean; minLength: number; minFiles: number; maxFilesPerTerm: number; customStopwords: string[]; promoteToEdges: boolean; caseSensitive: boolean }} */
  let keywordConfig = {
    enabled: true,
    minLength: 3,
    minFiles: 2,
    maxFilesPerTerm: 50,
    customStopwords: [],
    promoteToEdges: false,
    caseSensitive: false,
  };

  const graph = {
    nodes: [],
    links: [],
    zoom: 1,
    panX: 0,
    panY: 0,
    hoverId: null,
    selectedId: null,
    dragId: null,
    pickX: 0,
    pickY: 0,
    panning: false,
    lastX: 0,
    lastY: 0,
    anim: 0,
    frozen: false,
  };

  function q(sel) {
    return hostEl ? hostEl.querySelector(sel) : null;
  }

  function formatDayHeading(ymd) {
    const [y, mo, d] = ymd.split("-").map(Number);
    const dt = new Date(y, mo - 1, d);
    return dt.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function slugify(title) {
    return String(title || "")
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  function extractTags(text) {
    const out = new Set();
    const re = new RegExp(TAG_RE.source, "g");
    let m;
    while ((m = re.exec(text))) out.add(String(m[1]).toLowerCase());
    return [...out];
  }

  function legacyPriorityFromColorIdx(n) {
    if (!Number.isFinite(n) || n < 0) return 1;
    if (n > 2) {
      const L = [2, 2, 1, 1, 0, 1, 2];
      return L[Math.min(n, 6)];
    }
    const old012 = [2, 2, 1];
    return old012[n] ?? 1;
  }

  /** @param {Record<string, unknown> | null | undefined} ev @returns {0|1|2} */
  function eventPriority(ev) {
    if (ev && typeof ev.priority === "number" && ev.priority >= 0 && ev.priority <= 2) {
      return /** @type {0|1|2} */ (ev.priority);
    }
    return /** @type {0|1|2} */ (legacyPriorityFromColorIdx(Number(ev?.colorIdx)));
  }

  /** @param {0|1|2} pi */
  function priorityHex(pi) {
    return PRIORITY_HEX[Math.min(2, Math.max(0, pi))] ?? PRIORITY_HEX[1];
  }

  /** @param {string} ymd */
  function dayKeyHasTodos(ymd) {
    const page = dayPagesRaw[ymd];
    if (!page) return false;
    return (page.todos || []).some((t) => {
      const text = String(t.text || "").trim();
      return text && !(text.startsWith("_") && text.endsWith("_"));
    });
  }

  /** @param {string} ymd */
  function dayKeyHasNotes(ymd) {
    const page = dayPagesRaw[ymd];
    if (!page) return false;
    const text = String(page.notes ?? "").trim();
    return Boolean(text && !(text.startsWith("_") && text.endsWith("_")));
  }

  /** @param {string} ymd */
  function dayKeyHasCustomTitle(ymd) {
    const page = dayPagesRaw[ymd];
    return Boolean(String(page?.title ?? "").trim());
  }

  function noteIdFromTitle(title) {
    const L = LINK();
    if (L) return L.resolveNoteId(title, aliasIndex, notes);
    const t = String(title || "").trim().toLowerCase();
    for (const n of notes.values()) {
      if (n.title.toLowerCase() === t) return n.id;
    }
    return null;
  }

  function rebuildAliasIndex() {
    const L = LINK();
    aliasIndex = L ? L.buildAliasIndex(notes) : new Map();
  }

  /** @param {string} ymd */
  function parseYmd(ymd) {
    const k = String(ymd || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) return null;
    const [y, mo, d] = k.split("-").map(Number);
    const dt = new Date(y, mo - 1, d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  const MS_PER_DAY = 86400000;

  function startOfTodayMs() {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  }

  /** @param {number} dateMs */
  function daysFromToday(dateMs) {
    return (dateMs - startOfTodayMs()) / MS_PER_DAY;
  }

  /** @param {string} s */
  function stableHash01(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return (h >>> 0) / 4294967296;
  }

  /** Stable per-node offset so labels do not stack on one point. */
  function nodeScatterXY(nodeId, scale = 1) {
    const a = stableHash01(`${nodeId}:a`) * Math.PI * 2;
    const r = (28 + stableHash01(`${nodeId}:r`) * 52) * scale;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.88 };
  }

  /** Graph radius from today: near dates cluster loosely; future/past drift outward. */
  function todayTargetRadius(offsetDays) {
    const abs = Math.abs(offsetDays);
    const core = 62;
    if (abs <= 18) return core * (0.5 + (0.5 * abs) / 18);
    const extra = abs - 18;
    const future = offsetDays > 0;
    const ramp = (future ? 2.35 : 1.7) * Math.pow(extra, 0.62);
    return core + Math.min(future ? 240 : 155, ramp);
  }

  /** @param {number} offsetDays @param {string} nodeId */
  function todayTargetAngle(offsetDays, nodeId) {
    if (Math.abs(offsetDays) <= 32) {
      return stableHash01(`${nodeId}:near`) * Math.PI * 2;
    }
    const jitter = (stableHash01(nodeId) - 0.5) * 1.65;
    return (offsetDays > 0 ? -0.55 : 2.1) + jitter;
  }

  /** @param {number} offsetDays @param {string} nodeId */
  function todayTargetXY(offsetDays, nodeId) {
    const r = todayTargetRadius(offsetDays);
    const a = todayTargetAngle(offsetDays, nodeId);
    const scatter = nodeScatterXY(
      nodeId,
      Math.abs(offsetDays) <= 40 ? 1.25 : 0.95,
    );
    return {
      x: Math.cos(a) * r + scatter.x,
      y: Math.sin(a) * r * 0.72 + scatter.y,
    };
  }

  /** @param {number} dateMs @param {string} nodeId */
  function seedDayNodePosition(dateMs, nodeId) {
    return todayTargetXY(daysFromToday(dateMs), nodeId);
  }

  /** @param {number} msA @param {number} msB */
  function temporalAffinity(msA, msB) {
    const days = Math.abs(msA - msB) / MS_PER_DAY;
    if (days > 120) return 0;
    const offA = Math.abs(daysFromToday(msA));
    const offB = Math.abs(daysFromToday(msB));
    const spanFromToday = Math.max(offA, offB);
    if (spanFromToday > 320) return 0;
    const calendarPull = Math.exp(-days / 48);
    const todayPull = Math.exp(-spanFromToday / 70);
    let aff = calendarPull * (0.25 + 0.75 * todayPull);
    if (days <= 35) aff = Math.max(aff, 0.42 * (1 - days / 40));
    return aff;
  }

  /** Ideal spacing between two day nodes from calendar distance (pixels). */
  function dayPairTargetDist(daysApart, linkDist) {
    if (daysApart <= 7) return linkDist * 0.9;
    if (daysApart <= 31) return linkDist * (1.05 + daysApart / 28);
    if (daysApart <= 90) return linkDist * (2.25 + (daysApart - 31) / 22);
    return linkDist * (5 + Math.min(4, (daysApart - 90) / 45));
  }

  /** @param {{ id: string; dateMs?: number; x: number; y: number }} node */
  function temporalClusterCentroid(node) {
    if (typeof node.dateMs !== "number") return null;
    let cx = 0;
    let cy = 0;
    let w = 0;
    for (const m of graph.nodes) {
      if (m.id === node.id || typeof m.dateMs !== "number") continue;
      const aff = temporalAffinity(node.dateMs, m.dateMs);
      if (aff < 0.04) continue;
      cx += m.x * aff;
      cy += m.y * aff;
      w += aff;
    }
    if (w <= 0) return null;
    return { x: cx / w, y: cy / w };
  }

  /** @param {{ id: string; dateMs?: number; x: number; y: number; vx: number; vy: number }} node */
  function nudgeDayNodeTowardCluster(node) {
    if (typeof node.dateMs !== "number") return;
    const offset = daysFromToday(node.dateMs);
    const target = todayTargetXY(offset, node.id);
    const c = temporalClusterCentroid(node);
    let tx = target.x;
    let ty = target.y;
    if (c) {
      const blend = Math.abs(offset) <= 45 ? 0.38 : 0.22;
      tx = target.x * (1 - blend) + c.x * blend;
      ty = target.y * (1 - blend) + c.y * blend;
    }
    const dx = tx - node.x;
    const dy = ty - node.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
    const kick = Math.min(1.4, d * 0.022);
    node.vx += (dx / d) * kick;
    node.vy += (dy / d) * kick;
  }

  /** @param {Date} d */
  function isoDateOnly(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  /** @param {Record<string, unknown>} ev @param {string} ymd */
  function eventSpansDayKey(ev, ymd) {
    const day = parseYmd(ymd);
    if (!day) return false;
    const s0 = parseYmd(String(ev.start || "").slice(0, 10));
    if (!s0) return false;
    const sK = isoDateOnly(s0);
    const eRaw = ev.end && String(ev.end).length >= 10 ? ev.end : ev.start;
    const e0 = parseYmd(String(eRaw || "").slice(0, 10)) || s0;
    const eK = isoDateOnly(e0);
    if (ev.reminderRepeat === "daily" || ev.reminderRepeat === "weekly") {
      if (ymd < sK || ymd > eK) return false;
      if (ev.reminderRepeat === "daily") return true;
      const wd = Array.isArray(ev.repeatWeekdays) ? ev.repeatWeekdays : [];
      return wd.length > 0 && wd.includes(day.getDay());
    }
    return sK <= ymd && ymd <= eK;
  }

  /** @param {string} ymd */
  function dayPageHasNotesOrTodos(ymd) {
    const page = dayPagesRaw[ymd];
    if (!page) return false;
    if (String(page.notes || "").trim()) return true;
    return (page.todos || []).some((t) => String(t.text || "").trim());
  }

  /** One-off / ranged reminders on this day (not daily/weekly repeat — those live under Reminders). */
  /** @param {string} ymd */
  function nonRepeatRemindersOnDayKey(ymd) {
    return eventsRaw.filter((ev) => {
      if (!String(ev?.title ?? "").trim()) return false;
      if (ev.reminderRepeat === "daily" || ev.reminderRepeat === "weekly") return false;
      return eventSpansDayKey(ev, ymd);
    });
  }

  /** Day appears in second brain only when it has real planner content. */
  /** @param {string} ymd */
  function dayHasPlannerContent(ymd) {
    if (dayPageHasNotesOrTodos(ymd)) return true;
    return nonRepeatRemindersOnDayKey(ymd).length > 0;
  }

  /** YYYY-MM-DD keys that should appear under Days/ and in the graph. */
  function collectActiveDayKeys() {
    const keys = new Set();
    for (const ymd of Object.keys(dayPagesRaw)) {
      if (dayHasPlannerContent(ymd)) keys.add(ymd);
    }
    for (const ev of eventsRaw) {
      if (!String(ev?.title ?? "").trim()) continue;
      if (ev.reminderRepeat === "daily" || ev.reminderRepeat === "weekly") continue;
      const s0 = parseYmd(String(ev.start || "").slice(0, 10));
      if (!s0) continue;
      const eRaw = ev.end && String(ev.end).length >= 10 ? ev.end : ev.start;
      const e0 = parseYmd(String(eRaw || "").slice(0, 10)) || s0;
      const end = new Date(e0);
      const cur = new Date(s0);
      let guard = 0;
      while (cur <= end && guard < 400) {
        const k = isoDateOnly(cur);
        if (dayHasPlannerContent(k)) keys.add(k);
        cur.setDate(cur.getDate() + 1);
        guard++;
      }
    }
    return [...keys].sort();
  }

  /** @param {string} ymd @param {Record<string, unknown> | null | undefined} page */
  function dayDisplayTitle(ymd, page) {
    const custom = String(page?.title ?? "").trim();
    return custom || formatDayHeading(ymd);
  }

  /** Raw planner fields only (title + notes + to-dos), not generated headings. */
  function dayPlannerSourceText(page) {
    const parts = [];
    const titleText = String(page?.title ?? "").trim();
    if (titleText) parts.push(titleText);
    const notesText = String(page?.notes ?? "").trim();
    if (notesText) parts.push(notesText);
    for (const t of page?.todos || []) {
      const tx = String(t?.text ?? "").trim();
      if (!tx || (tx.startsWith("_") && tx.endsWith("_"))) continue;
      parts.push(tx);
    }
    return parts.join("\n");
  }

  function dayMarkdown(ymd, page) {
    const dateHeading = formatDayHeading(ymd);
    const displayTitle = dayDisplayTitle(ymd, page);
    const customTitle = String(page?.title ?? "").trim();
    const notesText = String(page?.notes ?? "").trim();
    const todos = Array.isArray(page?.todos) ? page.todos : [];
    const lines = [
      `# ${displayTitle}`,
      "",
      `> Day · \`${ymd}\` · ${dateHeading}`,
    ];
    if (customTitle) {
      lines.push("", `aliases: ${dateHeading}, ${ymd}`);
    }
    lines.push("", "## Notes", "", notesText || "_No notes yet._", "", "## To-do", "");
    if (!todos.length) lines.push("- [ ] _Add a to-do_", "");
    else {
      for (const t of todos) {
        lines.push(`- [${t.done ? "x" : " "}] ${String(t.text || "").trim() || "Untitled"}`);
      }
      lines.push("");
    }
    const dayReminders = nonRepeatRemindersOnDayKey(ymd);
    if (dayReminders.length) {
      lines.push("## Reminders on this day", "");
      for (const ev of dayReminders) {
        lines.push(`- [[${String(ev.title || "").trim() || "Reminder"}]]`);
      }
      lines.push("");
    }
    return lines.join("\n");
  }

  function reminderMarkdown(ev) {
    const title = String(ev.title || "").trim() || "Reminder";
    const start = String(ev.start || "").slice(0, 16).replace("T", " ");
    const pri =
      typeof ev.priority === "number" && ev.priority >= 0 && ev.priority <= 2
        ? PRIORITY_LABELS[ev.priority]
        : "Medium";
    const notesText = String(ev.notes ?? "").trim();
    const lines = [
      `# ${title}`,
      "",
      `> Reminder · **${pri}**`,
      "",
      `- **When:** ${start || "—"}`,
      "",
      "## Notes",
      "",
      notesText || "_No notes._",
      "",
    ];
    const dayKey = String(ev.start || "").slice(0, 10);
    if (dayKey && /^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
      const dayPage = dayPagesRaw[dayKey];
      lines.push(`Linked day: [[${dayDisplayTitle(dayKey, dayPage)}]]`, "");
    }
    return lines.join("\n");
  }

  function parseDayMarkdown(ymd, content) {
    const page = /** @type {{ title: string; notes: string; todos: { id: string; text: string; done: boolean }[] }} */ (
      dayPagesRaw[ymd] || { title: "", notes: "", todos: [] }
    );
    const dateHeading = formatDayHeading(ymd);
    let title = "";
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      const h1 = titleMatch[1].trim();
      if (h1.toLowerCase() !== dateHeading.toLowerCase()) {
        title = h1;
      }
    }
    page.title = title;
    const notesMatch = content.match(/## Notes\s*\n([\s\S]*?)(?=\n## To-do|\n## |$)/i);
    page.notes = notesMatch ? notesMatch[1].replace(/_No notes yet\._/g, "").trim() : "";
    const todoSection = content.match(/## To-do\s*\n([\s\S]*?)(?=\n## |$)/i);
    const todos = [];
    if (todoSection) {
      const re = /^- \[([ xX])\]\s*(.+)$/gm;
      let m;
      while ((m = re.exec(todoSection[1]))) {
        const text = m[2].trim();
        if (text.startsWith("_") && text.endsWith("_")) continue;
        todos.push({
          id: `todo-${ymd}-${todos.length}`,
          text,
          done: m[1].toLowerCase() === "x",
        });
      }
    }
    page.todos = todos;
    dayPagesRaw[ymd] = page;
  }

  function parseReminderMarkdown(ev, content) {
    const notesMatch = content.match(/## Notes\s*\n([\s\S]*?)(?=\n## |$)/i);
    ev.notes = notesMatch ? notesMatch[1].replace(/_No notes\._/g, "").trim() : "";
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) ev.title = titleMatch[1].trim();
  }

  function buildVault() {
    notes = new Map();
    edges = [];
    notes.set("welcome", {
      id: "welcome",
      path: "Welcome.md",
      title: "Welcome",
      folder: "",
      kind: "welcome",
      content: [
        "# Obsidian view",
        "",
        "Your **My planner** notes, to-dos, and reminders — linked like [Obsidian](https://obsidian.md/).",
        "",
        "- **Wikilinks:** `[[Note]]` · `[[Note|alias]]` · `[[Note#Heading]]` · `[[Note^block-id]]`",
        "- **Markdown links:** `[label](Reminders/title.md)`",
        "- **Aliases:** add `aliases: name one, name two` at the top of a note",
        "- **Backlinks** and **Outgoing links** panes below the editor",
        "- **Gray links (Unlinked)** — words or phrases in notes and to-dos that match another note’s title (no `[[link]]` needed)",
        "- Graph: filter by folder, tag, path, link type · **Depth** for local graph · **Freeze** to pin layout",
        "",
        "Folders: **Days/** · **Reminders/** · **Notes/** · **Tags/**",
      ].join("\n"),
      links: [],
      tags: [],
    });

    for (const ymd of collectActiveDayKeys()) {
      const page = dayPagesRaw[ymd] || { title: "", notes: "", todos: [] };
      const id = `day:${ymd}`;
      const content = dayMarkdown(ymd, page);
      const dateHeading = formatDayHeading(ymd);
      notes.set(id, {
        id,
        path: `Days/${ymd}.md`,
        title: dayDisplayTitle(ymd, page),
        folder: "Days",
        kind: "day",
        content,
        links: [],
        tags: extractTags(content),
        meta: { ymd, dateHeading },
      });
    }

    rebuildAliasIndex();

    for (const ev of eventsRaw) {
      if (!ev?.id) continue;
      const title = String(ev.title || "").trim();
      if (!title) continue;
      const id = `reminder:${ev.id}`;
      const content = reminderMarkdown(ev);
      notes.set(id, {
        id,
        path: `Reminders/${slugify(title) || ev.id}.md`,
        title,
        folder: "Reminders",
        kind: "reminder",
        content,
        links: [],
        tags: extractTags(content),
        meta: { eventId: ev.id, priority: eventPriority(ev) },
      });
      for (const ymd of collectActiveDayKeys()) {
        if (!nonRepeatRemindersOnDayKey(ymd).some((e) => e.id === ev.id)) continue;
        const dayId = `day:${ymd}`;
        if (notes.has(dayId)) {
          edges.push({ source: id, target: dayId, type: "structural" });
          edges.push({ source: dayId, target: id, type: "structural" });
        }
      }
    }

    for (const n of obsidianNotesRaw) {
      if (!n?.id) continue;
      const title = String(n.title || "").trim();
      if (!title) continue;
      const id = `obsidian:${n.id}`;
      const content = n.content || "";
      notes.set(id, {
        id,
        path: `Notes/${slugify(title) || n.id}.md`,
        title,
        folder: "Notes",
        kind: "obsidian",
        content,
        links: [],
        tags: extractTags(content),
        meta: { createdAt: n.createdAt, updatedAt: n.updatedAt },
      });
    }

    const L = LINK();
    for (const note of notes.values()) {
      if (note.id === "welcome") continue;
      /** @type {Array<{ type: string; source: string; target: string; label?: string; lineNumber?: number; todoDone?: boolean }>} */
      const parsed = [];
      const seen = new Set();

      const addParsed = (list) => {
        for (const link of list) {
          const key = `${link.source}|${link.target}|${link.type}`;
          if (seen.has(key)) continue;
          seen.add(key);
          parsed.push(link);
        }
      };

      if (L) {
        addParsed(L.extractLinksFromContent(note.content, note.id, aliasIndex, notes));
        if (L.extractYmdMentionEdges) {
          addParsed(L.extractYmdMentionEdges(note.content, note.id, notes));
        }
        if (note.kind === "day" && note.meta?.ymd) {
          const plannerText = dayPlannerSourceText(dayPagesRaw[String(note.meta.ymd)]);
          if (plannerText && L.extractPlannerReferenceEdges) {
            const explicitTargets = new Set(parsed.map((e) => e.target));
            addParsed(
              L.extractPlannerReferenceEdges(
                plannerText,
                note.id,
                notes,
                aliasIndex,
                explicitTargets,
              ),
            );
          } else if (plannerText) {
            addParsed(L.extractLinksFromContent(plannerText, note.id, aliasIndex, notes));
            addParsed(L.extractYmdMentionEdges(plannerText, note.id, notes));
          }
        } else if (L.findUnlinkedMentionsFromText) {
          const explicitTargets = new Set(parsed.map((e) => e.target));
          for (const m of L.findUnlinkedMentionsFromText(
            note.content,
            note.id,
            notes,
            aliasIndex,
            explicitTargets,
          )) {
            explicitTargets.add(m.id);
            addParsed([
              {
                type: "unlinked",
                source: note.id,
                target: m.id,
                label: m.alias,
              },
            ]);
          }
        }
      }

      note.links = parsed;
      for (const link of parsed) {
        edges.push(link);
      }
      for (const tag of note.tags) {
        const tagId = `tag:${tag}`;
        if (!notes.has(tagId)) {
          notes.set(tagId, {
            id: tagId,
            path: `Tags/${tag}.md`,
            title: `#${tag}`,
            folder: "Tags",
            kind: "tag",
            content: `# #${tag}`,
            links: [],
            tags: [tag],
          });
        }
        edges.push({ source: note.id, target: tagId, type: "tag" });
      }
    }

    scheduleKeywordSync();
  }

  function vaultFilesPayload() {
    return [...notes.values()]
      .filter((n) => n.id !== "welcome")
      .map((n) => ({ id: n.id, path: n.path, content: n.content }));
  }

  function wikiEdgesPayload() {
    return edges.filter((e) => e.type !== "unlinked" && e.type !== "keyword");
  }

  async function refreshKeywordEdges() {
    const api = KEYWORDS();
    if (!api?.getEdges) return;
    const res = await api.getEdges();
    edges = edges.filter((e) => e.type !== "keyword");
    if (!res?.ok || !keywordConfig.promoteToEdges) {
      buildGraphSimulation();
      return;
    }
    for (const e of res.data || []) {
      edges.push({
        type: "keyword",
        source: e.source,
        target: e.target,
        term: e.term,
      });
    }
    buildGraphSimulation();
  }

  function scheduleKeywordSync() {
    const api = KEYWORDS();
    if (!api?.syncVault) return;
    clearTimeout(keywordSyncTimer);
    keywordSyncTimer = window.setTimeout(async () => {
      keywordSyncTimer = 0;
      await api.syncVault({ files: vaultFilesPayload(), wikiEdges: wikiEdgesPayload() });
      await refreshKeywordEdges();
      renderKeywordMentionsPane();
    }, 500);
  }

  async function loadKeywordConfig() {
    const api = KEYWORDS();
    if (!api?.getConfig) return;
    const res = await api.getConfig();
    if (!res?.ok || !res.data) return;
    const { stopwords, stopwordSet, ...rest } = res.data;
    void stopwords;
    void stopwordSet;
    keywordConfig = { ...keywordConfig, ...rest };
    if (els.kwPromote) els.kwPromote.checked = Boolean(keywordConfig.promoteToEdges);
    if (els.kwMinLength) els.kwMinLength.value = String(keywordConfig.minLength ?? 3);
    if (els.kwMinFiles) els.kwMinFiles.value = String(keywordConfig.minFiles ?? 2);
    if (els.kwMaxFiles) els.kwMaxFiles.value = String(keywordConfig.maxFilesPerTerm ?? 50);
    if (els.kwCustomStop) {
      els.kwCustomStop.value = (keywordConfig.customStopwords || []).join(", ");
    }
  }

  async function persistKeywordConfig(partial) {
    const api = KEYWORDS();
    if (!api?.updateConfig) return;
    const res = await api.updateConfig(partial);
    if (res?.ok && res.data) {
      const { stopwords, stopwordSet, ...rest } = res.data;
      void stopwords;
      void stopwordSet;
      keywordConfig = { ...keywordConfig, ...rest };
    }
    scheduleKeywordSync();
  }

  function scrollToNoteLine(lineNumber) {
    const ta = els.source;
    if (!ta) return;
    const lines = ta.value.split("\n");
    const ln = Math.max(1, Math.min(lineNumber, lines.length));
    let pos = 0;
    for (let i = 0; i < ln - 1; i++) pos += lines[i].length + 1;
    const end = pos + (lines[ln - 1]?.length ?? 0);
    setEditorMode("edit");
    ta.focus();
    ta.setSelectionRange(pos, end);
    const lineH = 18;
    ta.scrollTop = Math.max(0, (ln - 3) * lineH);
  }

  function renderMarkdown(md) {
    let html = String(md || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    html = html.replace(/^### (.+)$/gm, "<h3 class=\"rme-obs-h3\">$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2 class=\"rme-obs-h2\">$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1 class=\"rme-obs-h1\">$1</h1>");
    html = html.replace(/^> (.+)$/gm, (_m, line) => {
      let inner = String(line)
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/`([^`]+)`/g, "<code>$1</code>");
      let cls = "rme-obs-bq";
      if (/Reminder/i.test(inner)) cls += " rme-obs-bq--reminder";
      if (/Day\s*·/i.test(inner)) cls += " rme-obs-bq--day";
      if (/<strong>High<\/strong>/i.test(inner)) cls += " rme-obs-bq--pri-high";
      else if (/<strong>Medium<\/strong>/i.test(inner)) cls += " rme-obs-bq--pri-med";
      else if (/<strong>Low<\/strong>/i.test(inner)) cls += " rme-obs-bq--pri-low";
      return `<blockquote class="${cls}">${inner}</blockquote>`;
    });
    html = html.replace(/\[\[([^\]]+)\]\]/g, (_m, inner) => {
      const L = LINK();
      const p = L ? L.parseWikiTarget(inner) : { target: inner, display: null, heading: null, block: null };
      const id = noteIdFromTitle(p.target);
      let label = p.display || p.target;
      if (p.heading) label += ` › ${p.heading}`;
      if (p.block) label += ` ^${p.block}`;
      return id
        ? `<a href="#" data-note-link="${id}">${label}</a>`
        : `<a href="#" class="rme-obs-missing-link">${label}</a>`;
    });
    html = html.replace(MD_LINK_RE, (_m, label, href) => {
      const h = String(href || "").trim();
      if (h.startsWith("http://") || h.startsWith("https://")) {
        return `<a href="${h}" target="_blank" rel="noopener">${label || h}</a>`;
      }
      const id = noteIdFromTitle(h.replace(/\.md$/i, "").split("/").pop() || h);
      return id
        ? `<a href="#" data-note-link="${id}">${label || h}</a>`
        : `<a href="${h}">${label || h}</a>`;
    });
    html = html.replace(/^- \[x\]\s*(.+)$/gim, '<li class="rme-obs-li task-done">$1</li>');
    html = html.replace(/^- \[ \]\s*(.+)$/gim, '<li class="rme-obs-li">$1</li>');
    html = html.replace(/^- (.+)$/gm, '<li class="rme-obs-li">$1</li>');
    html = html.replace(/(<li class="rme-obs-li"[\s\S]*?<\/li>)+/g, (m) => `<ul class="rme-obs-ul">${m}</ul>`);
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/#([a-zA-Z0-9_/-]+)/g, (_m, tag) => {
      const tagId = `tag:${String(tag).toLowerCase()}`;
      return notes.has(tagId)
        ? `<a href="#" class="rme-obs-tag" data-note-link="${tagId}">#${tag}</a>`
        : `<span class="rme-obs-tag">#${tag}</span>`;
    });
    const blocks = html.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
    const body = blocks
      .map((b) => {
        if (/^<(h[1-3]|blockquote|ul)\b/i.test(b)) return b;
        return `<p class="rme-obs-p">${b}</p>`;
      })
      .join("");
    return `<div class="rme-obs-md">${body}</div>`;
  }

  function renderFileTree() {
    const tree = els.fileTree;
    if (!tree) return;
    tree.replaceChildren();
    const ul = document.createElement("ul");
    ul.className = "rme-obs-tree";

    const welcomeBtn = document.createElement("button");
    welcomeBtn.type = "button";
    welcomeBtn.className =
      "rme-obs-leaf" + (activeId === "welcome" ? " rme-obs-leaf--on" : "");
    welcomeBtn.textContent = "Welcome";
    welcomeBtn.addEventListener("click", () => {
      setSidePanelOpen(true);
      openNote("welcome");
    });
    ul.appendChild(welcomeBtn);

    const folders = /** @type {Record<string, typeof notes extends Map<string, infer V> ? V[] : never>} */ ({});
    for (const n of notes.values()) {
      if (n.id === "welcome") continue;
      const f = n.folder || "Other";
      if (!folders[f]) folders[f] = [];
      folders[f].push(n);
    }

    for (const folder of ["Days", "Reminders", "Notes", "Tags"]) {
      const items = folders[folder];
      if (!items?.length) continue;
      items.sort((a, b) => a.path.localeCompare(b.path));
      const det = document.createElement("details");
      det.open = true;
      const sum = document.createElement("summary");
      sum.textContent = folder;
      det.appendChild(sum);
      for (const n of items) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "rme-obs-leaf" + (activeId === n.id ? " rme-obs-leaf--on" : "");
        btn.textContent = n.title;
        btn.title =
          n.kind === "day" && n.meta?.dateHeading
            ? `${n.path}\n${String(n.meta.dateHeading)}`
            : n.path;
        btn.addEventListener("click", () => {
          setSidePanelOpen(true);
          openNote(n.id);
        });
        det.appendChild(btn);
      }
      ul.appendChild(det);
    }
    tree.appendChild(ul);
  }

  function linkTypeLabel(edgeOrType) {
    const edge =
      edgeOrType && typeof edgeOrType === "object" ? edgeOrType : { type: edgeOrType };
    const type = edge.type;
    if (type === "todo") return edge.todoDone ? "TODO ✓" : "TODO";
    const map = {
      wikilink: "Wiki",
      heading: "Heading",
      block: "Block",
      markdown: "MD",
      structural: "Planner",
      tag: "Tag",
      unlinked: "Match",
    };
    return map[type] || type;
  }

  function appendLinkButton(container, edge, direction) {
    const otherId = direction === "in" ? edge.source : edge.target;
    const n = notes.get(otherId);
    if (!n) return;
    const b = document.createElement("button");
    b.type = "button";
    b.className =
      "rme-obs-link-row" + (edge.type === "unlinked" ? " rme-obs-link-row--unlinked" : "");
    let text = n.title;
    if (edge.heading) text += ` › ${edge.heading}`;
    if (edge.block) text += ` ^${edge.block}`;
    if (edge.label && edge.label !== n.title) text = `${edge.label} → ${n.title}`;
    b.innerHTML = `<span class="rme-obs-link-row-title">${text}</span><span class="rme-obs-link-type">${linkTypeLabel(edge)}</span>`;
        b.addEventListener("click", () => {
          setSidePanelOpen(true);
          openNote(otherId);
        });
    container.appendChild(b);
  }

  function renderLinkPanes() {
    const outBox = els.outgoing;
    const inBox = els.backlinks;
    const unBox = els.unlinked;
    if (!outBox || !inBox || !unBox) return;
    outBox.replaceChildren();
    inBox.replaceChildren();
    unBox.replaceChildren();
    if (!activeId) return;

    const outgoing = edges.filter((e) => e.source === activeId && e.type !== "unlinked");
    const incoming = edges.filter((e) => e.target === activeId);
    const unlinked = edges.filter((e) => e.source === activeId && e.type === "unlinked");

    if (!outgoing.length) {
      const p = document.createElement("p");
      p.className = "rme-obs-muted";
      p.textContent = "No outgoing links";
      outBox.appendChild(p);
    } else {
      for (const e of outgoing) appendLinkButton(outBox, e, "out");
    }

    if (!incoming.length) {
      const p = document.createElement("p");
      p.className = "rme-obs-muted";
      p.textContent = "No backlinks";
      inBox.appendChild(p);
    } else {
      for (const e of incoming) appendLinkButton(inBox, e, "in");
    }

    if (!unlinked.length) {
      const p = document.createElement("p");
      p.className = "rme-obs-muted rme-obs-title-mentions-empty";
      p.textContent = "No title matches";
      unBox.appendChild(p);
    } else {
      for (const e of unlinked) {
        const n = notes.get(e.target);
        if (!n) continue;
        const b = document.createElement("button");
        b.type = "button";
        b.className = "rme-obs-link-row rme-obs-link-row--unlinked";
        b.innerHTML = `<span class="rme-obs-link-row-title">${n.title}</span><span class="rme-obs-link-type">Link?</span>`;
        b.addEventListener("click", () => {
          if (els.source && activeId) {
            const note = notes.get(activeId);
            if (note) {
              const insert = `[[${
                n.title
              }]]`;
              els.source.value = `${els.source.value.trimEnd()}\n\n${insert}\n`;
              scheduleSave();
            }
          }
          openNote(activeId);
        });
        unBox.appendChild(b);
      }
    }
    renderKeywordMentionsPane();
  }

  function renderKeywordMentionsPane() {
    const unBox = els.unlinked;
    if (!unBox) return;
    unBox.querySelectorAll(".rme-obs-kw-group").forEach((el) => el.remove());
    const note = activeId ? notes.get(activeId) : null;
    if (!note || note.id === "welcome") return;

    const req = ++keywordMentionsReq;
    const api = KEYWORDS();
    if (!api?.getMentions) return;

    api.getMentions(note.path).then((res) => {
      if (req !== keywordMentionsReq || activeId !== note.id) return;
      const groups = res?.ok && Array.isArray(res.data) ? res.data : [];
      unBox.querySelector(".rme-obs-kw-empty")?.remove();

      if (!groups.length) {
        if (!unBox.querySelector(".rme-obs-title-mentions-empty") && !unBox.children.length) {
          const p = document.createElement("p");
          p.className = "rme-obs-muted rme-obs-kw-empty";
          p.textContent = "No shared keywords";
          unBox.appendChild(p);
        }
        return;
      }

      for (const g of groups) {
        const wrap = document.createElement("div");
        wrap.className = "rme-obs-kw-group";
        const head = document.createElement("p");
        head.className = "rme-obs-kw-term";
        head.textContent = g.term;
        wrap.appendChild(head);
        for (const occ of g.occurrences || []) {
          const targetId =
            occ.fileId ||
            [...notes.values()].find((n) => n.path === occ.filePath)?.id;
          const title =
            (targetId && notes.get(targetId)?.title) || occ.filePath || "Note";
          const b = document.createElement("button");
          b.type = "button";
          b.className = "rme-obs-link-row rme-obs-link-row--keyword";
          const snip = String(occ.snippet || "").slice(0, 160);
          b.innerHTML = `<span class="rme-obs-link-row-title">${title}</span><span class="rme-obs-link-snippet">${snip}</span>`;
          b.addEventListener("click", () => {
            if (targetId) openNote(targetId, { lineNumber: occ.lineNumber });
          });
          wrap.appendChild(b);
        }
        unBox.appendChild(wrap);
      }
    });
  }

  function clearGraphFocus() {
    if (!graph.selectedId) return;
    graph.selectedId = null;
    if (sidePanelOpen) showEmptyNoteState();
    buildGraphSimulation();
  }

  function showEmptyNoteState() {
    activeId = null;
    graph.selectedId = null;
    if (els.tabLabel) {
      els.tabLabel.textContent = "Note preview";
      els.tabLabel.classList.remove("rme-obs-tab-label--reminder", "rme-obs-tab-label--day");
    }
    if (els.source) els.source.value = "";
    if (els.preview) {
      els.preview.hidden = false;
      els.preview.innerHTML =
        '<p class="rme-obs-empty">Select a node on the graph, or open Notes to read one.</p>';
    }
    if (els.noteHero) els.noteHero.hidden = true;
    if (els.statusPath) els.statusPath.textContent = "";
    if (els.statusDeg) els.statusDeg.textContent = "";
    const openDayBtn = q(".rme-obs-open-day");
    if (openDayBtn) openDayBtn.hidden = true;
    els.outgoing?.replaceChildren();
    els.backlinks?.replaceChildren();
    els.unlinked?.replaceChildren();
    renderFileTree();
    setEditorMode("preview");
  }

  /** @param {string} id @param {{ fromGraph?: boolean; lineNumber?: number }} [opts] */
  function openNote(id, opts) {
    const note = notes.get(id);
    if (!note) return;
    const fromGraph = Boolean(opts?.fromGraph);
    const lineNumber = opts?.lineNumber;
    activeId = id;
    graph.selectedId = id;
    if (els.source) els.source.value = note.content;
    if (els.tabLabel) {
      els.tabLabel.textContent = note.title;
      els.tabLabel.classList.toggle("rme-obs-tab-label--reminder", note.kind === "reminder");
      els.tabLabel.classList.toggle("rme-obs-tab-label--day", note.kind === "day");
    }
    if (els.preview) els.preview.innerHTML = renderMarkdown(note.content);
    updateNoteHero();
    syncNoteHeroVisibility();
    if (els.statusPath) els.statusPath.textContent = note.path;
    const deg = edges.filter((e) => e.source === id || e.target === id).length;
    if (els.statusDeg) els.statusDeg.textContent = `${deg} links`;
    const openDayBtn = q(".rme-obs-open-day");
    if (openDayBtn) {
      const show = Boolean(note.meta?.ymd && bridge?.openCalendarDay);
      openDayBtn.hidden = !show;
    }
    dirty = false;
    renderFileTree();
    renderLinkPanes();
    buildGraphSimulation();
    if (lineNumber && Number.isFinite(lineNumber)) {
      scrollToNoteLine(lineNumber);
    } else {
      setEditorMode("preview");
    }
    if (fromGraph) setFilesNavOpen(false);
  }

  /** Graph clicks: highlight only — open notes from the Notes tab, not modals. */
  /** @param {string} id */
  function selectGraphNode(id) {
    if (!notes.has(id)) return;
    graph.selectedId = id;
    buildGraphSimulation();
  }

  function persistActiveNote() {
    if (!activeId || !dirty || !bridge) return;
    const note = notes.get(activeId);
    if (!note || note.kind === "welcome") return;
    const oldTitle = note.title;
    let content = els.source?.value ?? note.content;

    if (note.kind === "day" && note.meta?.ymd) {
      parseDayMarkdown(String(note.meta.ymd), content);
      bridge.saveDayPages();
    } else if (note.kind === "reminder" && note.meta?.eventId) {
      const ev = eventsRaw.find((e) => e.id === note.meta.eventId);
      if (ev) {
        parseReminderMarkdown(ev, content);
        bridge.saveEvents();
      }
    }

    syncFromBridge();
    const updated = notes.get(activeId);
    if (updated && oldTitle !== updated.title) {
      const L = LINK();
      if (L) {
        for (const n of notes.values()) {
          if (n.id === activeId) continue;
          const next = L.updateWikilinksOnRename(oldTitle, updated.title, n.content);
          if (next !== n.content) {
            n.content = next;
            if (n.kind === "day" && n.meta?.ymd) {
              parseDayMarkdown(String(n.meta.ymd), next);
            } else if (n.kind === "reminder" && n.meta?.eventId) {
              const ev2 = eventsRaw.find((e) => e.id === n.meta.eventId);
              if (ev2) parseReminderMarkdown(ev2, next);
            }
          }
        }
        bridge.saveDayPages();
        bridge.saveEvents();
        syncFromBridge();
      }
    }

    dirty = false;
    renderFileTree();
    renderLinkPanes();
    buildGraphSimulation();
  }

  function scheduleSave() {
    dirty = true;
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(persistActiveNote, 600);
  }

  function syncNoteHeroVisibility() {
    if (!els.noteHero) return;
    els.noteHero.hidden = editorMode === "preview";
  }

  function updateNoteHero() {
    const src = els.source?.value ?? "";
    const titleM = src.match(/^#\s+(.+)$/m);
    const bqM = src.match(/^>\s+(.+)$/m);
    const stripMd = (s) =>
      String(s || "")
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/`([^`]+)`/g, "$1")
        .trim();
    if (els.noteHeroTitle) {
      els.noteHeroTitle.textContent = titleM ? stripMd(titleM[1]) : "";
    }
    if (els.noteHeroMeta) {
      const meta = bqM ? stripMd(bqM[1]) : "";
      els.noteHeroMeta.textContent = meta;
      els.noteHeroMeta.hidden = !meta;
      const pri =
        /\bHigh\b/i.test(meta) ? "high" : /\bMedium\b/i.test(meta) ? "med" : /\bLow\b/i.test(meta) ? "low" : "";
      els.noteHeroMeta.classList.remove(
        "rme-obs-note-hero-meta--high",
        "rme-obs-note-hero-meta--med",
        "rme-obs-note-hero-meta--low",
      );
      if (pri) els.noteHeroMeta.classList.add(`rme-obs-note-hero-meta--${pri}`);
    }
    if (els.noteHero) {
      const show = Boolean(titleM || bqM) && editorMode !== "preview";
      els.noteHero.hidden = !show;
    }
  }

  function setEditorMode(mode) {
    editorMode = mode;
    hostEl?.querySelectorAll(".rme-obs-chip").forEach((b) => {
      b.classList.toggle("rme-obs-chip--on", b.getAttribute("data-mode") === mode);
    });
    const split = els.editorSplit;
    const preview = els.preview;
    const source = els.source;
    if (!split || !preview || !source) return;
    if (mode === "edit") {
      split.classList.remove("rme-obs-split--both");
      preview.hidden = true;
      source.hidden = false;
    } else if (mode === "preview") {
      split.classList.remove("rme-obs-split--both");
      preview.hidden = false;
      source.hidden = true;
      preview.innerHTML = renderMarkdown(source.value);
    } else {
      split.classList.add("rme-obs-split--both");
      preview.hidden = false;
      source.hidden = false;
      preview.innerHTML = renderMarkdown(source.value);
    }
    syncNoteHeroVisibility();
    updateNoteHero();
  }

  function setLeftMode(mode) {
    leftMode = mode;
    hostEl?.querySelectorAll("[data-obs-left]").forEach((b) => {
      const m = b.getAttribute("data-obs-left");
      const on =
        m === mode && (m !== "files" || filesNavOpen);
      b.classList.toggle("rme-obs-ribbon-btn--on", on);
      if (m === "files") {
        b.setAttribute("aria-expanded", filesNavOpen ? "true" : "false");
        b.title = filesNavOpen ? "Hide file tree" : "Show file tree";
      }
    });
    els.filesPanel?.classList.toggle("rme-obs-panel--hidden", mode !== "files");
    els.searchPanel?.classList.toggle("rme-obs-panel--hidden", mode !== "search");
    if (els.leftTitle) els.leftTitle.textContent = mode === "search" ? "Search" : "Files";
  }

  /** @param {boolean} open */
  function setFilesNavOpen(open) {
    filesNavOpen = open;
    els.side?.classList.toggle("rme-obs-side--nav-closed", !open);
    els.nav?.setAttribute("aria-hidden", open ? "false" : "true");
    setLeftMode(leftMode);
    window.requestAnimationFrame(() => resizeCanvas());
  }

  function syncViewToggles() {
    hostEl?.querySelectorAll("[data-obs-view]").forEach((btn) => {
      const v = btn.getAttribute("data-obs-view");
      let on = false;
      if (v === "graph") on = !sidePanelOpen;
      else if (v === "notes") on = sidePanelOpen;
      else if (v === "settings") on = settingsPanelOpen;
      btn.classList.toggle("rme-obs-view-toggle--on", on);
      if (v === "notes") btn.setAttribute("aria-expanded", sidePanelOpen ? "true" : "false");
    });
  }

  /** @param {boolean} open */
  function setSettingsPanelOpen(open) {
    settingsPanelOpen = open;
    els.graphSettings?.classList.toggle("rme-obs-graph-settings--hidden", !open);
    q(".rme-obs-color-legend")?.classList.toggle("rme-obs-color-legend--hidden", open);
    syncViewToggles();
  }

  /** @param {boolean} open */
  function setSidePanelOpen(open) {
    sidePanelOpen = open;
    const shell = q(".rme-obs-shell");
    shell?.classList.toggle("rme-obs-shell--side-closed", !open);
    if (open) {
      setFilesNavOpen(false);
      if (graph.selectedId && notes.has(graph.selectedId)) {
        openNote(graph.selectedId, { fromGraph: true });
      } else if (!activeId) {
        showEmptyNoteState();
      } else {
        setEditorMode("preview");
      }
    }
    syncViewToggles();
    window.requestAnimationFrame(() => resizeCanvas());
  }

  function linkTypeVisible(type) {
    const t = String(type || "wikilink");
    if (t === "unlinked" || t === "keyword") {
      const el = els.linkUnlinked;
      return !el || el.checked !== false;
    }
    const map = {
      wikilink: els.linkWiki,
      heading: els.linkHeading,
      block: els.linkBlock,
      markdown: els.linkMd,
      structural: els.linkStructural,
      tag: els.linkTag,
      todo: els.linkTodo,
    };
    const el = map[t];
    return !el || el.checked !== false;
  }

  /** @param {string} startId @param {number} depth */
  function graphNodesWithinDepth(startId, depth) {
    const allowed = new Set([startId]);
    let frontier = [startId];
    for (let d = 0; d < depth; d++) {
      const next = [];
      for (const id of frontier) {
        for (const e of edges) {
          if (!linkTypeVisible(e.type)) continue;
          const other = e.source === id ? e.target : e.target === id ? e.source : null;
          if (other && !allowed.has(other)) {
            allowed.add(other);
            next.push(other);
          }
        }
      }
      frontier = next;
    }
    return allowed;
  }

  function buildGraphSimulation() {
    const showTags = els.showTags?.checked !== false;
    const showOrphans = els.showOrphans?.checked !== false;
    const pathQ = (els.graphPathFilter?.value || "").trim().toLowerCase();
    const tagQ = (els.graphTagFilter?.value || "").trim().toLowerCase();
    const depth = Number(els.graphDepth?.value || 0);

    let nodeList = [...notes.values()].filter((n) => {
      if (n.id === "welcome") return false;
      if (n.id.startsWith("tag:") && !showTags) return false;
      const folder = n.folder || "";
      if (folder === "Days" && els.filterDays?.checked === false) return false;
      if (folder === "Reminders" && els.filterReminders?.checked === false) return false;
      if (folder === "Tags" && els.filterTagsFolder?.checked === false) return false;
      if (pathQ) {
        const hay = `${n.path}\n${n.title}`.toLowerCase();
        if (!hay.includes(pathQ)) return false;
      }
      if (tagQ) {
        const has = (n.tags || []).some((t) => t.includes(tagQ));
        if (!has && !String(n.content || "").toLowerCase().includes(`#${tagQ}`)) return false;
      }
      return true;
    });

    const nodeIds = new Set(nodeList.map((n) => n.id));
    /** Any vault edge (all link types) — used only to decide orphan vs connected. */
    const connectionDegree = /** @type {Record<string, number>} */ ({});
    for (const e of edges) {
      if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) continue;
      connectionDegree[e.source] = (connectionDegree[e.source] || 0) + 1;
      connectionDegree[e.target] = (connectionDegree[e.target] || 0) + 1;
    }

    let edgeList = edges.filter((e) => {
      if (!notes.has(e.source) || !notes.has(e.target)) return false;
      if (e.type === "todo") return true;
      if (!linkTypeVisible(e.type)) return false;
      return true;
    });

    if (depth > 0 && graph.selectedId && notes.has(graph.selectedId)) {
      const allowed = graphNodesWithinDepth(graph.selectedId, depth);
      nodeList = nodeList.filter((n) => allowed.has(n.id));
      edgeList = edgeList.filter((e) => allowed.has(e.source) && allowed.has(e.target));
    }

    const linkSet = new Set();
    const links = [];
    for (const e of edgeList) {
      const key = [e.source, e.target, e.type].join("|");
      if (linkSet.has(key)) continue;
      linkSet.add(key);
      links.push({
        source: e.source,
        target: e.target,
        type: e.type,
        todoDone: e.todoDone,
        lineNumber: e.lineNumber,
      });
    }
    const degree = /** @type {Record<string, number>} */ ({});
    for (const l of links) {
      degree[l.source] = (degree[l.source] || 0) + 1;
      degree[l.target] = (degree[l.target] || 0) + 1;
    }
    const filtered = showOrphans
      ? nodeList
      : nodeList.filter(
          (n) => (connectionDegree[n.id] || 0) > 0 || n.id === graph.selectedId,
        );

    const oldPos = new Map(graph.nodes.map((n) => [n.id, { x: n.x, y: n.y }]));
    const todoTargets = new Set();
    for (const l of links) {
      if (l.type === "todo") todoTargets.add(l.target);
    }

    graph.nodes = filtered.map((n, i) => {
      const d = degree[n.id] || 0;
      const prev = oldPos.get(n.id);
      const angle = (i / Math.max(1, filtered.length)) * Math.PI * 2;
      const ymd =
        n.kind === "day" && n.meta?.ymd ? String(n.meta.ymd) : "";
      const dateMs = ymd ? parseYmd(ymd)?.getTime() : undefined;
      const seeded =
        typeof dateMs === "number" ? seedDayNodePosition(dateMs, n.id) : null;
      const scatter = nodeScatterXY(n.id, 1.05);
      const ring = 100 + d * 11;
      return {
        id: n.id,
        label: n.title,
        x:
          prev?.x ??
          seeded?.x ??
          Math.cos(angle) * ring + scatter.x,
        y:
          prev?.y ??
          seeded?.y ??
          Math.sin(angle) * ring + scatter.y,
        vx: 0,
        vy: 0,
        r: 6 + Math.min(22, 4 + d * 3.5),
        degree: d,
        kind: n.kind,
        ymd: ymd || undefined,
        dateMs: typeof dateMs === "number" ? dateMs : undefined,
        hasTodos: ymd ? dayKeyHasTodos(ymd) : false,
        hasNotes: ymd ? dayKeyHasNotes(ymd) : false,
        hasCustomTitle: ymd ? dayKeyHasCustomTitle(ymd) : false,
        todoLinked: n.kind !== "reminder" && todoTargets.has(n.id),
        priority:
          n.kind === "reminder" && typeof n.meta?.priority === "number"
            ? /** @type {0|1|2} */ (n.meta.priority)
            : null,
      };
    });
    graph.links = links.filter(
      (l) =>
        graph.nodes.some((n) => n.id === l.source) &&
        graph.nodes.some((n) => n.id === l.target),
    );
  }

  function resizeCanvas() {
    const c = els.canvas;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    const h = c.clientHeight;
    if (w < 2 || h < 2) return;
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    const ctx = c.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function graphForces() {
    const centerF = Number(els.forceCenter?.value || 0.22);
    const repelF = Number(els.forceRepel?.value || 420);
    const linkF = Number(els.forceLink?.value || 0.5);
    const temporalF = Number(els.forceTemporal?.value || 0.32);
    const dist = Number(els.forceDist?.value || 135);
    /** When Links is fully right, link springs win over date layout; fades temporal cues. */
    const linkDominance = Math.min(1, Math.pow(linkF, 2));
    const temporalWeight = temporalF * (1 - 0.94 * linkDominance);
    /** Stronger springs at high slider; extra boost when Dates is high so links can still dominate. */
    const linkAccel =
      linkF * 0.02 * (1 + Math.pow(linkF, 1.85) * (12 + temporalF * 6));
    const idMap = new Map(graph.nodes.map((n) => [n.id, n]));
    const dayNodes = graph.nodes.filter((n) => typeof n.dateMs === "number");

    for (const n of graph.nodes) {
      if (graph.dragId === n.id) continue;
      const centerScale = typeof n.dateMs === "number" ? 0.4 : 1;
      n.vx += (0 - n.x) * centerF * 0.002 * centerScale;
      n.vy += (0 - n.y) * centerF * 0.002 * centerScale;
    }

    for (let i = 0; i < graph.nodes.length; i++) {
      for (let j = i + 1; j < graph.nodes.length; j++) {
        const a = graph.nodes[i];
        const b = graph.nodes[j];
        if (graph.dragId === a.id || graph.dragId === b.id) continue;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const d2 = dx * dx + dy * dy || 0.01;
        let f = repelF / d2;
        if (typeof a.dateMs === "number" && typeof b.dateMs === "number") {
          f *= 1.45;
        }
        const d = Math.sqrt(d2);
        a.vx -= (dx / d) * f;
        a.vy -= (dy / d) * f;
        b.vx += (dx / d) * f;
        b.vy += (dy / d) * f;
      }
    }

    const labelClear = Math.max(72, dist * 0.72);
    for (let i = 0; i < dayNodes.length; i++) {
      for (let j = i + 1; j < dayNodes.length; j++) {
        const a = dayNodes[i];
        const b = dayNodes[j];
        if (graph.dragId === a.id || graph.dragId === b.id) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        if (d >= labelClear) continue;
        const push = ((labelClear - d) / labelClear) * 0.42;
        a.vx -= (dx / d) * push;
        a.vy -= (dy / d) * push;
        b.vx += (dx / d) * push;
        b.vy += (dy / d) * push;
      }
    }

    for (const l of graph.links) {
      const a = idMap.get(l.source);
      const b = idMap.get(l.target);
      if (!a || !b) continue;
      if (graph.dragId === a.id || graph.dragId === b.id) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      let linkScale = 1;
      if (typeof a.dateMs === "number" && Math.abs(daysFromToday(a.dateMs)) > 55) {
        linkScale *= 0.5;
      }
      if (typeof b.dateMs === "number" && Math.abs(daysFromToday(b.dateMs)) > 55) {
        linkScale *= 0.5;
      }
      // Old behavior weakened distant-day links; when Links is high, prioritize graph edges instead.
      linkScale = linkScale + (1 - linkScale) * linkDominance;
      const f = (d - dist) * linkAccel * linkScale;
      a.vx += (dx / d) * f;
      a.vy += (dy / d) * f;
      b.vx -= (dx / d) * f;
      b.vy -= (dy / d) * f;
    }

    for (const n of dayNodes) {
      if (graph.dragId === n.id) continue;
      const offset = daysFromToday(n.dateMs);
      const target = todayTargetXY(offset, n.id);
      const dx = target.x - n.x;
      const dy = target.y - n.y;
      const distToTarget = Math.sqrt(dx * dx + dy * dy) || 0.01;
      let pull = temporalWeight * 0.011;
      if (Math.abs(offset) <= 40) pull *= 0.55;
      else if (offset > 50) {
        pull *= 1 + Math.min(1.2, (offset - 50) / 120);
      } else if (offset < -50) {
        pull *= 1 + Math.min(0.65, (-offset - 50) / 130);
      }
      pull *= Math.min(1, distToTarget / 90);
      n.vx += dx * pull;
      n.vy += dy * pull;

      const centroid = temporalClusterCentroid(n);
      if (!centroid) continue;
      const cdx = centroid.x - n.x;
      const cdy = centroid.y - n.y;
      const cd = Math.sqrt(cdx * cdx + cdy * cdy) || 0.01;
      let calendarPull = temporalWeight * 0.018;
      if (n.degree <= 0) calendarPull *= 1.85;
      else if (n.degree === 1) calendarPull *= 1.35;
      calendarPull *= Math.min(1, cd / 160);
      n.vx += (cdx / cd) * calendarPull;
      n.vy += (cdy / cd) * calendarPull;
    }

    for (let i = 0; i < dayNodes.length; i++) {
      for (let j = i + 1; j < dayNodes.length; j++) {
        const a = dayNodes[i];
        const b = dayNodes[j];
        if (graph.dragId === a.id || graph.dragId === b.id) continue;
        const aff = temporalAffinity(a.dateMs, b.dateMs);
        if (aff < 0.04) continue;
        const daysApart = Math.abs(a.dateMs - b.dateMs) / MS_PER_DAY;
        const targetDist = dayPairTargetDist(daysApart, dist);
        const minDist = targetDist * 0.88;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const attractCap = daysApart <= 35 ? 0.48 : 0.22;
        let f;
        if (d < minDist) {
          f = (minDist - d) * temporalWeight * 0.014 * Math.max(aff, 0.25);
          a.vx -= (dx / d) * f;
          a.vy -= (dy / d) * f;
          b.vx += (dx / d) * f;
          b.vy += (dy / d) * f;
        } else {
          f = (d - targetDist) * temporalWeight * 0.014 * aff;
          f = Math.max(-attractCap, Math.min(attractCap, f));
          a.vx += (dx / d) * f;
          a.vy += (dy / d) * f;
          b.vx -= (dx / d) * f;
          b.vy -= (dy / d) * f;
        }
      }
    }

    for (const n of graph.nodes) {
      if (graph.dragId === n.id) continue;
      n.vx *= 0.86;
      n.vy *= 0.86;
      n.x += n.vx;
      n.y += n.vy;
    }
  }

  /** @param {string} hex @param {number} alpha */
  function hexToRgba(hex, alpha) {
    const h = String(hex || "").replace("#", "");
    if (h.length !== 6) return `rgba(156, 163, 175, ${alpha})`;
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /** @param {string} hex @param {number} [strength] 0–1, lower = dimmer */
  function dimHexColor(hex, strength = GRAPH_DIM_IDLE) {
    const h = String(hex || "").replace("#", "");
    if (h.length !== 6) return "#2a2a2a";
    const mix = Math.max(0, Math.min(1, strength));
    const channel = (start) =>
      Math.round(parseInt(h.slice(start, start + 2), 16) * mix)
        .toString(16)
        .padStart(2, "0");
    return `#${channel(0)}${channel(2)}${channel(4)}`;
  }

  /** Type color (day notes, named days, to-dos, priority reminders, etc.). */
  function nodeTypeColor(n) {
    if (n.kind === "reminder" && typeof n.priority === "number") {
      return priorityHex(n.priority);
    }
    if (n.kind === "day") {
      if (n.hasTodos) return GRAPH_TODO_TEAL;
      if (n.hasCustomTitle) return GRAPH_DAY_NAMED_COLOR;
      if (n.hasNotes) return GRAPH_DAY_NOTE_COLOR;
      return GRAPH_DAY_EMPTY_SLATE;
    }
    if (n.kind === "tag") return GRAPH_DAY_NAMED_COLOR;
    if (n.todoLinked) return GRAPH_TODO_TEAL;
    return GRAPH_DAY_NOTE_COLOR;
  }

  /** @param {{ kind?: string; priority?: number; hasTodos?: boolean; hasNotes?: boolean; hasCustomTitle?: boolean; todoLinked?: boolean }} n
   *  @param {boolean} faded non-neighbor while graph has focus
   *  @param {boolean} bright hover/selection neighbor */
  function nodeFillColor(n, faded, bright) {
    const type = nodeTypeColor(n);
    if (bright) return type;
    if (faded) return dimHexColor(type, GRAPH_DIM_FADED);
    return dimHexColor(type, GRAPH_DIM_IDLE);
  }

  /** Shadow/glow tint matching the node's own color. */
  function nodeGlowColor(n) {
    return hexToRgba(nodeTypeColor(n), 0.92);
  }

  function drawGraph() {
    const c = els.canvas;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = c.clientWidth;
    const h = c.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const idMap = new Map(graph.nodes.map((n) => [n.id, n]));
    const z = graph.zoom;
    const ox = w / 2 + graph.panX;
    const oy = h / 2 + graph.panY;
    const focusId = graph.hoverId || graph.selectedId;
    const graphFocused = Boolean(focusId);
    const highlight = new Set();
    if (focusId) {
      highlight.add(focusId);
      for (const l of graph.links) {
        if (l.source === focusId) highlight.add(l.target);
        if (l.target === focusId) highlight.add(l.source);
      }
    }

    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(z, z);

    for (const l of graph.links) {
      if (!linkTypeVisible(l.type)) continue;
      const a = idMap.get(l.source);
      const b = idMap.get(l.target);
      if (!a || !b) continue;
      const dim =
        graphFocused && !highlight.has(l.source) && !highlight.has(l.target);
      const linkType = l.type || "wikilink";
      let glowColor = "transparent";
      let glowBlur = 0;
      if (linkType === "todo") {
        const done = Boolean(l.todoDone);
        ctx.globalAlpha = dim ? 0.14 : done ? 0.35 : 0.78;
        ctx.strokeStyle = dim ? GRAPH_LINK_SOLID_DIM : done ? "#9ca3af" : PRIORITY_HEX[0];
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = dim ? 1 : 1.35;
      } else if (linkType === "keyword") {
        ctx.globalAlpha = dim ? 0.1 : 0.5;
        ctx.strokeStyle = dim ? GRAPH_LINK_SOLID_DIM : "#64748b";
        ctx.setLineDash([2, 4]);
        ctx.lineWidth = 1;
      } else {
        const dashed = linkType === "unlinked";
        ctx.globalAlpha = dim ? 0.28 : dashed ? 0.78 : 0.9;
        ctx.strokeStyle = dim
          ? dashed
            ? GRAPH_LINK_DASH_DIM
            : GRAPH_LINK_SOLID_DIM
          : linkType === "tag"
            ? "#fbbf24"
            : dashed
              ? GRAPH_LINK_DASH_COLOR
              : GRAPH_LINK_SOLID_COLOR;
        ctx.setLineDash(dashed ? [5, 4] : []);
        ctx.lineWidth = dim ? 1.15 : linkType === "structural" ? 1.25 : 1.65;
        glowColor = dashed
          ? dim
            ? "rgba(124,58,237,0.55)"
            : "rgba(196,181,253,0.95)"
          : dim
            ? "rgba(30,64,175,0.5)"
            : "rgba(96,165,250,0.95)";
        glowBlur = dim ? 6 : 12;
      }
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = glowBlur;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.shadowColor = "transparent";
      ctx.setLineDash([]);
    }
    ctx.globalAlpha = 1;

    for (const n of graph.nodes) {
      const bright = graphFocused && highlight.has(n.id);
      const faded = graphFocused && !highlight.has(n.id);
      const selected = n.id === graph.selectedId;
      const hovered = n.id === graph.hoverId;
      const active = selected || hovered;
      const radius = active ? n.r + 2 : n.r;
      const fill = nodeFillColor(n, faded, bright);

      if (active && bright) {
        ctx.shadowColor = nodeGlowColor(n);
        ctx.shadowBlur = selected ? 26 : 18;
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (selected && bright) {
        ctx.shadowColor = nodeGlowColor(n);
        ctx.shadowBlur = 34;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const muted =
      getComputedStyle(document.documentElement).getPropertyValue("--text-muted").trim() ||
      "#64748b";
    ctx.fillStyle = muted;
    ctx.font = "11px var(--font, Segoe UI), sans-serif";
    ctx.textAlign = "center";
    ctx.globalAlpha = Math.min(1, 0.5 + z * 0.35);
    for (const n of graph.nodes) {
      if (z < 0.55 && n.degree < 2 && !highlight.has(n.id)) continue;
      ctx.fillText(n.label.slice(0, 36), n.x, n.y + n.r + 11);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function graphLoop() {
    if (!graph.frozen) graphForces();
    drawGraph();
    graph.anim = requestAnimationFrame(graphLoop);
  }

  function startGraph() {
    if (graph.anim) return;
    resizeCanvas();
    buildGraphSimulation();
    graph.anim = requestAnimationFrame(graphLoop);
  }

  function stopGraph() {
    if (graph.anim) {
      cancelAnimationFrame(graph.anim);
      graph.anim = 0;
    }
  }

  function graphNodeAt(clientX, clientY) {
    const c = els.canvas;
    if (!c) return null;
    const rect = c.getBoundingClientRect();
    const ox = c.clientWidth / 2 + graph.panX;
    const oy = c.clientHeight / 2 + graph.panY;
    const x = (clientX - rect.left - ox) / graph.zoom;
    const y = (clientY - rect.top - oy) / graph.zoom;
    for (const n of graph.nodes) {
      const dx = n.x - x;
      const dy = n.y - y;
      if (dx * dx + dy * dy <= (n.r + 6) * (n.r + 6)) return n.id;
    }
    return null;
  }

  function bindGraph() {
    const c = els.canvas;
    if (!c || c.dataset.obsBound === "1") return;
    c.dataset.obsBound = "1";

    c.addEventListener("wheel", (e) => {
      e.preventDefault();
      graph.zoom = Math.min(3, Math.max(0.3, graph.zoom * (e.deltaY > 0 ? 0.92 : 1.08)));
    }, { passive: false });

    c.addEventListener("mousedown", (e) => {
      const hit = graphNodeAt(e.clientX, e.clientY);
      graph.lastX = e.clientX;
      graph.lastY = e.clientY;
      if (hit) {
        graph.pickX = e.clientX;
        graph.pickY = e.clientY;
        graph.dragId = hit;
        selectGraphNode(hit);
      } else {
        graph.panning = true;
        clearGraphFocus();
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (graph.dragId) {
        const rect = c.getBoundingClientRect();
        const ox = c.clientWidth / 2 + graph.panX;
        const oy = c.clientHeight / 2 + graph.panY;
        const n = graph.nodes.find((nd) => nd.id === graph.dragId);
        if (n) {
          n.x = (e.clientX - rect.left - ox) / graph.zoom;
          n.y = (e.clientY - rect.top - oy) / graph.zoom;
          n.vx = 0;
          n.vy = 0;
        }
        return;
      }
      if (graph.panning) {
        graph.panX += e.clientX - graph.lastX;
        graph.panY += e.clientY - graph.lastY;
        graph.lastX = e.clientX;
        graph.lastY = e.clientY;
        return;
      }
      graph.hoverId = graphNodeAt(e.clientX, e.clientY);
      if (els.graphHint) {
        const note = graph.hoverId ? notes.get(graph.hoverId) : null;
        els.graphHint.textContent = note
          ? note.title
          : sidePanelOpen
            ? "Drag to pan · scroll to zoom · click a node to open its note"
            : "Drag to pan · scroll to zoom · click a node to select";
      }
    });

    window.addEventListener("mouseup", (e) => {
      const nodeId = graph.dragId;
      if (nodeId) {
        const released = graph.nodes.find((nd) => nd.id === nodeId);
        if (released?.dateMs) nudgeDayNodeTowardCluster(released);
        const dx = e.clientX - graph.pickX;
        const dy = e.clientY - graph.pickY;
        if (sidePanelOpen && dx * dx + dy * dy < 64) {
          openNote(nodeId, { fromGraph: true });
        }
      }
      graph.panning = false;
      graph.dragId = null;
    });

    const rebuildGraph = () => buildGraphSimulation();
    for (const sel of [
      ".rme-obs-force-center",
      ".rme-obs-force-repel",
      ".rme-obs-force-link",
      ".rme-obs-force-temporal",
      ".rme-obs-force-dist",
      ".rme-obs-show-tags",
      ".rme-obs-show-orphans",
      ".rme-obs-graph-path",
      ".rme-obs-graph-tag",
      ".rme-obs-graph-depth",
      ".rme-obs-filter-days",
      ".rme-obs-filter-reminders",
      ".rme-obs-filter-tags-folder",
      ".rme-obs-link-wiki",
      ".rme-obs-link-heading",
      ".rme-obs-link-block",
      ".rme-obs-link-md",
      ".rme-obs-link-structural",
      ".rme-obs-link-tag",
      ".rme-obs-link-unlinked",
    ]) {
      const el = q(sel);
      el?.addEventListener("input", rebuildGraph);
      el?.addEventListener("change", rebuildGraph);
    }
    q(".rme-obs-link-todo")?.addEventListener("change", () => drawGraph());
    els.graphFreeze?.addEventListener("change", () => {
      graph.frozen = Boolean(els.graphFreeze?.checked);
    });

    q(".rme-obs-zoom-in")?.addEventListener("click", () => {
      graph.zoom = Math.min(3, graph.zoom * 1.12);
    });
    q(".rme-obs-zoom-out")?.addEventListener("click", () => {
      graph.zoom = Math.max(0.3, graph.zoom / 1.12);
    });
    q(".rme-obs-zoom-fit")?.addEventListener("click", () => {
      graph.zoom = 1;
      graph.panX = 0;
      graph.panY = 0;
    });
  }

  function runSearch(q) {
    const box = els.searchResults;
    if (!box) return;
    box.replaceChildren();
    const needle = q.trim().toLowerCase();
    if (!needle) return;
    for (const n of notes.values()) {
      if (n.id === "welcome") continue;
      const hay = `${n.title}\n${n.content}`.toLowerCase();
      if (!hay.includes(needle)) continue;
      const hit = document.createElement("button");
      hit.type = "button";
      hit.className = "rme-obs-search-hit";
      hit.innerHTML = `${n.title}<small>${n.path}</small>`;
      hit.addEventListener("click", () => {
        setSidePanelOpen(true);
        openNote(n.id);
      });
      box.appendChild(hit);
    }
  }

  function syncFromBridge() {
    if (!bridge) return;
    eventsRaw = bridge.getEvents();
    dayPagesRaw = bridge.getDayPages();
    obsidianNotesRaw = typeof bridge.getObsidianNotes === "function" ? bridge.getObsidianNotes() || [] : [];
    if (!Array.isArray(eventsRaw)) eventsRaw = [];
    if (!dayPagesRaw || typeof dayPagesRaw !== "object") dayPagesRaw = {};
    if (!Array.isArray(obsidianNotesRaw)) obsidianNotesRaw = [];
    buildVault();
  }

  function bindUi() {
    if (uiBound) return;
    uiBound = true;

    hostEl?.querySelectorAll("[data-obs-left]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const m = btn.getAttribute("data-obs-left");
        if (m === "files") {
          if (leftMode === "files" && filesNavOpen) {
            setFilesNavOpen(false);
          } else {
            setLeftMode("files");
            setFilesNavOpen(true);
          }
          return;
        }
        if (m === "search") {
          setLeftMode("search");
          setFilesNavOpen(true);
        }
      });
    });

    els.source?.addEventListener("input", () => {
      if (els.preview && editorMode !== "edit") {
        els.preview.innerHTML = renderMarkdown(els.source.value);
      }
      updateNoteHero();
      scheduleSave();
    });

    els.preview?.addEventListener("click", (e) => {
      const t = /** @type {HTMLElement} */ (e.target);
      const link = t.closest("[data-note-link]");
      if (link) {
        e.preventDefault();
        const id = link.getAttribute("data-note-link");
        if (id) {
          setSidePanelOpen(true);
          openNote(id);
        }
      }
    });

    els.searchInput?.addEventListener("input", () => {
      runSearch(els.searchInput.value);
    });

    q(".rme-obs-open-day")?.addEventListener("click", () => {
      const note = activeId ? notes.get(activeId) : null;
      const ymd = note?.meta?.ymd;
      if (!ymd) return;
      const key = String(ymd).slice(0, 10);
      const ui = /** @type {RmePlannerUi | undefined} */ (window.rmePlannerUi);
      if (ui?.openDaySheet && /^\d{4}-\d{2}-\d{2}$/.test(key)) {
        ui.openDaySheet(key);
        return;
      }
      if (bridge?.openCalendarDay) bridge.openCalendarDay(key);
    });

    hostEl?.querySelectorAll("[data-obs-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-obs-view");
        if (v === "graph") setSidePanelOpen(false);
        else if (v === "notes") setSidePanelOpen(!sidePanelOpen);
        else if (v === "settings") setSettingsPanelOpen(!settingsPanelOpen);
      });
    });

    bindGraph();
    bindKeywordSettings();
  }

  function cacheEls() {
    els = {
      side: q(".rme-obs-side"),
      nav: q(".rme-obs-nav"),
      noteHero: q(".rme-obs-note-hero"),
      noteHeroTitle: q(".rme-obs-note-hero-title"),
      noteHeroMeta: q(".rme-obs-note-hero-meta"),
      fileTree: q(".rme-obs-file-tree"),
      filesPanel: q(".rme-obs-files-panel"),
      searchPanel: q(".rme-obs-search-panel"),
      searchInput: /** @type {HTMLInputElement | null} */ (q(".rme-obs-search-input")),
      searchResults: q(".rme-obs-search-results"),
      leftTitle: q(".rme-obs-left-title"),
      source: /** @type {HTMLTextAreaElement | null} */ (q(".rme-obs-source")),
      preview: q(".rme-obs-preview"),
      editorSplit: q(".rme-obs-editor-split"),
      tabLabel: q(".rme-obs-tab-label"),
      outgoing: q(".rme-obs-outgoing-list"),
      backlinks: q(".rme-obs-backlinks-list"),
      unlinked: q(".rme-obs-unlinked-list"),
      graphPathFilter: /** @type {HTMLInputElement | null} */ (q(".rme-obs-graph-path")),
      graphTagFilter: /** @type {HTMLInputElement | null} */ (q(".rme-obs-graph-tag")),
      graphDepth: /** @type {HTMLSelectElement | null} */ (q(".rme-obs-graph-depth")),
      graphFreeze: /** @type {HTMLInputElement | null} */ (q(".rme-obs-graph-freeze")),
      filterDays: /** @type {HTMLInputElement | null} */ (q(".rme-obs-filter-days")),
      filterReminders: /** @type {HTMLInputElement | null} */ (q(".rme-obs-filter-reminders")),
      filterTagsFolder: /** @type {HTMLInputElement | null} */ (q(".rme-obs-filter-tags-folder")),
      linkWiki: /** @type {HTMLInputElement | null} */ (q(".rme-obs-link-wiki")),
      linkHeading: /** @type {HTMLInputElement | null} */ (q(".rme-obs-link-heading")),
      linkBlock: /** @type {HTMLInputElement | null} */ (q(".rme-obs-link-block")),
      linkMd: /** @type {HTMLInputElement | null} */ (q(".rme-obs-link-md")),
      linkStructural: /** @type {HTMLInputElement | null} */ (q(".rme-obs-link-structural")),
      linkTag: /** @type {HTMLInputElement | null} */ (q(".rme-obs-link-tag")),
      linkUnlinked: /** @type {HTMLInputElement | null} */ (q(".rme-obs-link-unlinked")),
      linkTodo: /** @type {HTMLInputElement | null} */ (q(".rme-obs-link-todo")),
      statusPath: q(".rme-obs-status-path"),
      statusDeg: q(".rme-obs-status-deg"),
      canvas: /** @type {HTMLCanvasElement | null} */ (q(".rme-obs-graph-canvas")),
      graphSettings: q(".rme-obs-graph-settings"),
      graphHint: q(".rme-obs-graph-hint"),
      forceCenter: /** @type {HTMLInputElement | null} */ (q(".rme-obs-force-center")),
      forceRepel: /** @type {HTMLInputElement | null} */ (q(".rme-obs-force-repel")),
      forceLink: /** @type {HTMLInputElement | null} */ (q(".rme-obs-force-link")),
      forceTemporal: /** @type {HTMLInputElement | null} */ (q(".rme-obs-force-temporal")),
      forceDist: /** @type {HTMLInputElement | null} */ (q(".rme-obs-force-dist")),
      showTags: /** @type {HTMLInputElement | null} */ (q(".rme-obs-show-tags")),
      showOrphans: /** @type {HTMLInputElement | null} */ (q(".rme-obs-show-orphans")),
      kwPromote: /** @type {HTMLInputElement | null} */ (q(".rme-obs-kw-promote")),
      kwMinLength: /** @type {HTMLInputElement | null} */ (q(".rme-obs-kw-min-length")),
      kwMinFiles: /** @type {HTMLInputElement | null} */ (q(".rme-obs-kw-min-files")),
      kwMaxFiles: /** @type {HTMLInputElement | null} */ (q(".rme-obs-kw-max-files")),
      kwCustomStop: /** @type {HTMLInputElement | null} */ (q(".rme-obs-kw-custom-stop")),
    };
  }

  function bindKeywordSettings() {
    const applyNums = () => {
      persistKeywordConfig({
        minLength: Number(els.kwMinLength?.value || 3),
        minFiles: Number(els.kwMinFiles?.value || 2),
        maxFilesPerTerm: Number(els.kwMaxFiles?.value || 50),
        customStopwords: String(els.kwCustomStop?.value || "")
          .split(/[,;\n]+/)
          .map((s) => s.trim().toLowerCase())
          .filter(Boolean),
      });
    };
    els.kwPromote?.addEventListener("change", () => {
      const on = Boolean(els.kwPromote?.checked);
      persistKeywordConfig({ promoteToEdges: on });
      refreshKeywordEdges();
    });
    for (const sel of [".rme-obs-kw-min-length", ".rme-obs-kw-min-files", ".rme-obs-kw-max-files"]) {
      q(sel)?.addEventListener("change", applyNums);
    }
    els.kwCustomStop?.addEventListener("change", applyNums);
  }

  async function initialKeywordRebuild() {
    const api = KEYWORDS();
    if (!api?.rebuild) return;
    await api.rebuild({
      files: vaultFilesPayload(),
      wikiEdges: wikiEdgesPayload(),
    });
    await refreshKeywordEdges();
  }

  const SHELL_HTML = `
    <div class="rme-obs-shell rme-obs-shell--side-closed">
      <main class="rme-obs-graph rme-cal-glass-panel">
        <header class="rme-obs-graph-head">
          <div class="rme-obs-view-toggles" role="group" aria-label="Obsidian panels">
            <button type="button" class="rme-obs-view-toggle rme-obs-view-toggle--on" data-obs-view="graph" title="Graph only">Graph</button>
            <button type="button" class="rme-obs-view-toggle" data-obs-view="notes" aria-expanded="false" aria-controls="rmeObsSidePanel" title="Note preview">Notes</button>
            <button type="button" class="rme-obs-view-toggle" data-obs-view="settings" title="Graph settings">Settings</button>
          </div>
        </header>
        <div class="rme-obs-graph-stage">
          <div class="rme-obs-color-legend" aria-label="Graph node colors">
            <span><i class="rme-obs-swatch rme-obs-swatch--note"></i> Day · notes</span>
            <span><i class="rme-obs-swatch rme-obs-swatch--named"></i> Named day</span>
            <span><i class="rme-obs-swatch rme-obs-swatch--todo"></i> To-do</span>
            <span><i class="rme-obs-swatch rme-obs-swatch--high"></i> High</span>
            <span><i class="rme-obs-swatch rme-obs-swatch--med"></i> Medium</span>
            <span><i class="rme-obs-swatch rme-obs-swatch--low"></i> Low</span>
          </div>
          <canvas class="rme-obs-graph-canvas" aria-label="Note graph"></canvas>
          <p class="rme-obs-graph-hint">Drag to pan · scroll to zoom · click a node to select</p>
          <div class="rme-obs-graph-settings rme-cal-glass-inset rme-obs-graph-settings--hidden">
            <label class="rme-obs-graph-filter"><span>Path</span><input type="search" class="rme-obs-graph-path" placeholder="folder…" /></label>
            <label class="rme-obs-graph-filter"><span>Tag</span><input type="search" class="rme-obs-graph-tag" placeholder="#tag" /></label>
            <label class="rme-obs-graph-filter"><span>Depth</span>
              <select class="rme-obs-graph-depth">
                <option value="0">Full vault</option>
                <option value="1">Local · 1</option>
                <option value="2">Local · 2</option>
                <option value="3">Local · 3</option>
              </select>
            </label>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-graph-freeze" /> Freeze</label>
            <p class="rme-obs-graph-subhead">Folders</p>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-filter-days" checked /> Days</label>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-filter-reminders" checked /> Reminders</label>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-filter-tags-folder" checked /> Tags</label>
            <p class="rme-obs-graph-subhead">Link types</p>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-link-wiki" checked /> Wiki</label>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-link-heading" checked /> Heading</label>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-link-block" checked /> Block</label>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-link-md" checked /> Markdown</label>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-link-structural" checked /> Planner</label>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-link-tag" checked /> Tag</label>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-link-unlinked" checked /> Text match</label>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-link-todo" checked /> Todo</label>
            <p class="rme-obs-graph-subhead">Forces</p>
            <label><span>Center</span><input type="range" class="rme-obs-force-center" min="0" max="1" step="0.05" value="0.22" /></label>
            <label><span>Repel</span><input type="range" class="rme-obs-force-repel" min="0" max="800" step="20" value="420" /></label>
            <label><span>Links</span><input type="range" class="rme-obs-force-link" min="0" max="1" step="0.05" value="0.5" /></label>
            <label><span>Dates</span><input type="range" class="rme-obs-force-temporal" min="0" max="1" step="0.05" value="0.32" title="Gently group days near today; push future and distant past outward" /></label>
            <label><span>Distance</span><input type="range" class="rme-obs-force-dist" min="20" max="260" step="5" value="135" /></label>
            <label class="rme-obs-check"><input type="checkbox" class="rme-obs-show-tags" checked /> Tag nodes</label>
            <label class="rme-obs-check" title="On: show all notes. Off: hide notes with no links (wiki, todo, text match, reminder, tag, etc.)."><input type="checkbox" class="rme-obs-show-orphans" checked /> Orphans</label>
            <div class="rme-obs-priority-legend" aria-hidden="true">
              <span><i class="rme-obs-swatch rme-obs-swatch--high"></i> High</span>
              <span><i class="rme-obs-swatch rme-obs-swatch--med"></i> Med</span>
              <span><i class="rme-obs-swatch rme-obs-swatch--low"></i> Low</span>
            </div>
            <div class="rme-obs-zoom-row">
              <button type="button" class="rme-obs-zoom-in rme-cal-btn rme-cal-btn--ghost">+</button>
              <button type="button" class="rme-obs-zoom-out rme-cal-btn rme-cal-btn--ghost">−</button>
              <button type="button" class="rme-obs-zoom-fit rme-cal-btn rme-cal-btn--ghost">Fit</button>
            </div>
          </div>
        </div>
      </main>
      <aside id="rmeObsSidePanel" class="rme-obs-side rme-cal-glass-panel">
        <nav class="rme-obs-ribbon" aria-label="Obsidian tools">
          <button type="button" class="rme-obs-ribbon-btn rme-obs-ribbon-btn--on" data-obs-left="files" title="Files">▤</button>
          <button type="button" class="rme-obs-ribbon-btn" data-obs-left="search" title="Search">⌕</button>
        </nav>
        <div class="rme-obs-nav rme-cal-glass-inset">
          <div class="rme-obs-left-head"><span class="rme-obs-left-title">Files</span></div>
          <div class="rme-obs-files-panel rme-obs-panel"><div class="rme-obs-file-tree"></div></div>
          <div class="rme-obs-search-panel rme-obs-panel rme-obs-panel--hidden">
            <input type="search" class="rme-obs-search-input" placeholder="Search notes…" />
            <div class="rme-obs-search-results"></div>
          </div>
        </div>
        <section class="rme-obs-center rme-cal-glass-inset rme-obs-center--preview-only">
          <header class="rme-obs-tabbar"><span class="rme-obs-tab-label">Note preview</span>
            <button type="button" class="rme-obs-open-day rme-cal-btn rme-cal-btn--ghost" hidden>Open in calendar</button>
          </header>
          <div class="rme-obs-note-hero" hidden>
            <h1 class="rme-obs-note-hero-title"></h1>
            <p class="rme-obs-note-hero-meta"></p>
          </div>
          <div class="rme-obs-editor-split">
            <textarea class="rme-obs-source" spellcheck="true" hidden></textarea>
            <div class="rme-obs-preview"></div>
          </div>
          <div class="rme-obs-link-panels">
            <div class="rme-obs-link-col">
              <h4 class="rme-obs-link-col-title">Outgoing links</h4>
              <div class="rme-obs-outgoing-list"></div>
            </div>
            <div class="rme-obs-link-col">
              <h4 class="rme-obs-link-col-title">Backlinks</h4>
              <div class="rme-obs-backlinks-list"></div>
            </div>
            <div class="rme-obs-link-col">
              <h4 class="rme-obs-link-col-title">Unlinked mentions</h4>
              <div class="rme-obs-unlinked-list"></div>
            </div>
          </div>
          <footer class="rme-obs-editor-foot">
            <span class="rme-obs-status-path"></span>
            <span class="rme-obs-status-deg"></span>
          </footer>
        </section>
      </aside>
    </div>
`;
  function mount(host, bridgeIn) {
    hostEl = host;
    bridge = bridgeIn;
    host.className = "rme-obs-host";
    host.innerHTML = SHELL_HTML;
    cacheEls();
    bindUi();
    setFilesNavOpen(false);
    setSidePanelOpen(false);
    setSettingsPanelOpen(false);
    syncFromBridge();
    loadKeywordConfig().then(() => initialKeywordRebuild());
    renderFileTree();
    showEmptyNoteState();
    startGraph();
    const ro = new ResizeObserver(() => resizeCanvas());
    ro.observe(host);
    host.dataset.rmeObsMounted = "1";
  }

  function refresh(bridgeIn) {
    bridge = bridgeIn || bridge;
    syncFromBridge();
    renderFileTree();
    activeId = null;
    graph.selectedId = null;
    showEmptyNoteState();
    setFilesNavOpen(false);
    setSidePanelOpen(false);
    setSettingsPanelOpen(false);
    buildGraphSimulation();
  }

  function destroy() {
    stopGraph();
    if (hostEl) {
      hostEl.innerHTML = "";
      delete hostEl.dataset.rmeObsMounted;
    }
    hostEl = null;
    bridge = null;
    uiBound = false;
    activeId = null;
    sidePanelOpen = false;
    settingsPanelOpen = false;
    filesNavOpen = false;
    editorMode = "preview";
  }

  window.rmeObsidianPlanner = { mount, refresh, destroy };
})();
