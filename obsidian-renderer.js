/**
 * Obsidian-style vault window — reads My planner notes, to-dos, and reminders.
 */
(function obsidianVault() {
  "use strict";

  const PRIORITY_LABELS = ["High", "Medium", "Low"];
  const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;
  const TAG_RE = /(?:^|\s)#([a-zA-Z0-9_/-]+)/g;

  /** @typedef {{ id: string; path: string; title: string; folder: string; kind: "day" | "reminder" | "welcome"; content: string; links: string[]; tags: string[]; meta?: Record<string, unknown> }} VaultNote */
  /** @typedef {{ source: string; target: string; kind: "wikilink" | "structural" | "tag" }} VaultEdge */

  /** @type {Map<string, VaultNote>} */
  let notes = new Map();
  /** @type {VaultEdge[]} */
  let edges = [];
  /** @type {Record<string, { notes: string; todos: { id: string; text: string; done: boolean }[] }>} */
  let dayPagesRaw = {};
  /** @type {Record<string, unknown>[]} */
  let eventsRaw = [];
  /** @type {string | null} */
  let activeId = null;
  /** @type {"edit" | "preview" | "split"} */
  let editorMode = "edit";
  /** @type {"files" | "search" | "graph"} */
  let ribbonView = "files";
  let saveTimer = 0;
  let dirty = false;

  const $ = (id) => document.getElementById(id);

  const els = {
    fileTree: $("obsFileTree"),
    searchPanel: $("obsSearchPanel"),
    searchInput: $("obsSearchInput"),
    searchResults: $("obsSearchResults"),
    sidebarTitle: $("obsSidebarTitle"),
    editorPane: $("obsEditorPane"),
    graphPane: $("obsGraphPane"),
    source: /** @type {HTMLTextAreaElement} */ ($("obsSource")),
    preview: $("obsPreview"),
    editorSplit: $("obsEditorSplit"),
    tabLabel: $("obsActiveTabLabel"),
    backlinks: $("obsBacklinks"),
    outline: $("obsOutline"),
    statusNote: $("obsStatusNote"),
    statusLinks: $("obsStatusLinks"),
    canvas: /** @type {HTMLCanvasElement} */ ($("obsGraphCanvas")),
    graphHint: $("obsGraphHint"),
    forceCenter: /** @type {HTMLInputElement} */ ($("obsForceCenter")),
    forceRepel: /** @type {HTMLInputElement} */ ($("obsForceRepel")),
    forceLink: /** @type {HTMLInputElement} */ ($("obsForceLink")),
    forceDist: /** @type {HTMLInputElement} */ ($("obsForceDist")),
    showTags: /** @type {HTMLInputElement} */ ($("obsShowTags")),
    showOrphans: /** @type {HTMLInputElement} */ ($("obsShowOrphans")),
  };

  const graph = {
    nodes: /** @type {{ id: string; x: number; y: number; vx: number; vy: number; r: number; label: string; degree: number }[]} */ ([]),
    links: /** @type {{ source: string; target: string }[]} */ ([]),
    zoom: 1,
    panX: 0,
    panY: 0,
    hoverId: null,
    selectedId: null,
    dragging: false,
    panning: false,
    lastX: 0,
    lastY: 0,
    anim: 0,
  };

  function storageApi() {
    return window.calendarStorageApi;
  }

  async function readPlannerJson(key, fallback) {
    const api = storageApi();
    if (!api?.read) return fallback;
    try {
      const res = await api.read(key);
      if (!res?.ok || !res.content) return fallback;
      return JSON.parse(res.content);
    } catch {
      return fallback;
    }
  }

  async function writePlannerJson(key, data) {
    const api = storageApi();
    if (!api?.write) return false;
    const res = await api.write(key, JSON.stringify(data, null, 2));
    return Boolean(res?.ok);
  }

  function slugify(title) {
    return String(title || "")
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  function noteIdFromTitle(title) {
    const t = String(title || "").trim().toLowerCase();
    for (const n of notes.values()) {
      if (n.title.toLowerCase() === t) return n.id;
    }
    return null;
  }

  function extractWikilinks(text) {
    const out = [];
    const re = new RegExp(WIKILINK_RE.source, "g");
    let m;
    while ((m = re.exec(text))) {
      out.push(String(m[1]).trim());
    }
    return out;
  }

  function extractTags(text) {
    const out = new Set();
    const re = new RegExp(TAG_RE.source, "g");
    let m;
    while ((m = re.exec(text))) {
      out.add(String(m[1]).toLowerCase());
    }
    return [...out];
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

  function dayMarkdown(ymd, page) {
    const heading = formatDayHeading(ymd);
    const notesText = String(page?.notes ?? "").trim();
    const todos = Array.isArray(page?.todos) ? page.todos : [];
    const lines = [`# ${heading}`, "", `> Planner day · \`${ymd}\``, ""];
    lines.push("## Notes", "");
    lines.push(notesText || "_No notes yet._", "");
    lines.push("## To-do", "");
    if (!todos.length) {
      lines.push("- [ ] _Add a to-do in My planner or here_", "");
    } else {
      for (const t of todos) {
        const box = t.done ? "x" : " ";
        lines.push(`- [${box}] ${String(t.text || "").trim() || "Untitled"}`);
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
      `> Reminder · priority **${pri}**`,
      "",
      `- **When:** ${start || "—"}`,
    ];
    if (ev.allDay) lines.push("- **All day:** yes");
    if (ev.reminderRepeat) lines.push(`- **Repeats:** ${ev.reminderRepeat}`);
    lines.push("", "## Notes", "", notesText || "_No notes._", "");
    const dayKey = String(ev.start || "").slice(0, 10);
    if (dayKey) {
      lines.push(`Linked day: [[${formatDayHeading(dayKey)}]]`, "");
    }
    return lines.join("\n");
  }

  function parseDayMarkdown(ymd, content) {
    const page = dayPagesRaw[ymd] || { notes: "", todos: [] };
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
          id: `todo-${ymd}-${todos.length}-${Date.now()}`,
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
    ev.notes = notesMatch
      ? notesMatch[1].replace(/_No notes\._/g, "").trim()
      : "";
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) ev.title = titleMatch[1].trim();
  }

  function buildVault() {
    notes = new Map();
    edges = [];

    const welcome = {
      id: "welcome",
      path: "Welcome.md",
      title: "Welcome",
      folder: "",
      kind: "welcome",
      content: [
        "# Planner Vault",
        "",
        "Sharpen your thinking — your **My planner** notes, to-dos, and reminders as a private vault.",
        "",
        "Like [Obsidian](https://obsidian.md/):",
        "",
        "- **Links** — connect ideas with `[[Note Title]]` wikilinks",
        "- **Graph** — circles are notes, lines are links; bigger dots = more connections",
        "- **Tags** — organize with `#projects` `#travel` and see them in the graph",
        "- **Local notes** — plain Markdown saved to your planner on disk",
        "",
        "Folders: **Days/** · **Reminders/** · **Tags/**",
        "",
        "Open the graph from the left ribbon, hover a dot to highlight its links, click to open the note.",
      ].join("\n"),
      links: [],
      tags: [],
    };
    notes.set(welcome.id, welcome);

    const dayKeys = Object.keys(dayPagesRaw).sort();
    for (const ymd of dayKeys) {
      const page = dayPagesRaw[ymd];
      const title = formatDayHeading(ymd);
      const id = `day:${ymd}`;
      const content = dayMarkdown(ymd, page);
      const note = {
        id,
        path: `Days/${ymd}.md`,
        title,
        folder: "Days",
        kind: "day",
        content,
        links: extractWikilinks(content),
        tags: extractTags(content),
        meta: { ymd },
      };
      notes.set(id, note);
    }

    for (const ev of eventsRaw) {
      if (!ev?.id) continue;
      const title = String(ev.title || "").trim() || "Reminder";
      const id = `reminder:${ev.id}`;
      const content = reminderMarkdown(ev);
      const note = {
        id,
        path: `Reminders/${slugify(title) || ev.id}.md`,
        title,
        folder: "Reminders",
        kind: "reminder",
        content,
        links: extractWikilinks(content),
        tags: extractTags(content),
        meta: { eventId: ev.id },
      };
      notes.set(id, note);
      const dayKey = String(ev.start || "").slice(0, 10);
      const dayId = `day:${dayKey}`;
      if (notes.has(dayId)) {
        edges.push({ source: id, target: dayId, kind: "structural" });
        edges.push({ source: dayId, target: id, kind: "structural" });
      }
    }

    for (const note of notes.values()) {
      for (const raw of note.links) {
        const targetId = noteIdFromTitle(raw);
        if (targetId && targetId !== note.id) {
          edges.push({ source: note.id, target: targetId, kind: "wikilink" });
        }
      }
      for (const tag of note.tags) {
        const tagId = `tag:${tag}`;
        if (!notes.has(tagId)) {
          notes.set(tagId, {
            id: tagId,
            path: `Tags/${tag}.md`,
            title: `#${tag}`,
            folder: "Tags",
            kind: "day",
            content: `# #${tag}\n\nTag hub for planner notes mentioning \`#${tag}\`.`,
            links: [],
            tags: [tag],
          });
        }
        edges.push({ source: note.id, target: tagId, kind: "tag" });
      }
    }
  }

  function renderMarkdown(md) {
    let html = String(md || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
    html = html.replace(/\[\[([^\]]+)\]\]/g, (_m, t) => {
      const id = noteIdFromTitle(t);
      return id
        ? `<a href="#" data-note-link="${id}">${t}</a>`
        : `<a href="#" class="obs-missing-link">${t}</a>`;
    });
    html = html.replace(
      /^- \[x\]\s*(.+)$/gim,
      '<li class="task-done"><input type="checkbox" checked disabled /> $1</li>',
    );
    html = html.replace(
      /^- \[ \]\s*(.+)$/gim,
      '<li><input type="checkbox" disabled /> $1</li>',
    );
    html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>[\s\S]*?<\/li>)+/g, (m) => `<ul>${m}</ul>`);
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    html = html.replace(/#([a-zA-Z0-9_/-]+)/g, (_m, tag) => {
      const tagId = `tag:${String(tag).toLowerCase()}`;
      return notes.has(tagId)
        ? `<a href="#" class="obs-tag" data-note-link="${tagId}">#${tag}</a>`
        : `<span class="obs-tag">#${tag}</span>`;
    });
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
    );
    html = html.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");
    html = html.replace(/\n\n/g, "</p><p>");
    return `<div class="obs-md"><p>${html}</p></div>`;
  }

  function renderFileTree() {
    if (!els.fileTree) return;
    els.fileTree.replaceChildren();
    const ul = document.createElement("ul");
    ul.className = "obs-file-tree";

    const folders = /** @type {Record<string, VaultNote[]>} */ ({});
    for (const n of notes.values()) {
      if (n.id === "welcome") continue;
      const f = n.folder || "Other";
      if (!folders[f]) folders[f] = [];
      folders[f].push(n);
    }

    const welcomeLi = document.createElement("li");
    const welcomeBtn = document.createElement("button");
    welcomeBtn.type = "button";
    welcomeBtn.className =
      "obs-file-leaf" + (activeId === "welcome" ? " obs-file-leaf--active" : "");
    welcomeBtn.textContent = "Welcome";
    welcomeBtn.addEventListener("click", () => openNote("welcome"));
    welcomeLi.appendChild(welcomeBtn);
    ul.appendChild(welcomeLi);

    for (const folder of ["Days", "Reminders", "Tags"]) {
      const items = folders[folder];
      if (!items?.length) continue;
      items.sort((a, b) => a.path.localeCompare(b.path));
      const det = document.createElement("details");
      det.className = "obs-file-folder";
      det.open = true;
      const sum = document.createElement("summary");
      sum.textContent = folder;
      det.appendChild(sum);
      const inner = document.createElement("ul");
      inner.className = "obs-file-tree";
      for (const n of items) {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className =
          "obs-file-leaf" + (activeId === n.id ? " obs-file-leaf--active" : "");
        btn.textContent = n.kind === "day" ? String(n.meta?.ymd || n.title) : n.title;
        btn.title = n.path;
        btn.addEventListener("click", () => openNote(n.id));
        li.appendChild(btn);
        inner.appendChild(li);
      }
      det.appendChild(inner);
      const wrap = document.createElement("li");
      wrap.appendChild(det);
      ul.appendChild(wrap);
    }
    els.fileTree.appendChild(ul);
  }

  function renderBacklinks() {
    if (!els.backlinks) return;
    els.backlinks.replaceChildren();
    if (!activeId) return;
    const incoming = edges.filter((e) => e.target === activeId);
    if (!incoming.length) {
      const p = document.createElement("p");
      p.style.color = "var(--obs-text-faint)";
      p.style.fontSize = "12px";
      p.textContent = "No backlinks.";
      els.backlinks.appendChild(p);
      return;
    }
    for (const e of incoming) {
      const n = notes.get(e.source);
      if (!n) continue;
      const b = document.createElement("div");
      b.className = "obs-backlink";
      b.textContent = n.title;
      b.addEventListener("click", () => openNote(n.id));
      els.backlinks.appendChild(b);
    }
  }

  function renderOutline() {
    if (!els.outline) return;
    els.outline.replaceChildren();
    const note = activeId ? notes.get(activeId) : null;
    if (!note) return;
    const heads = [...note.content.matchAll(/^(#{1,3})\s+(.+)$/gm)];
    for (const m of heads) {
      const level = m[1].length;
      const item = document.createElement("div");
      item.className = "obs-outline-item";
      item.style.paddingLeft = `${(level - 1) * 10 + 8}px`;
      item.textContent = m[2];
      els.outline.appendChild(item);
    }
  }

  function openNote(id) {
    const note = notes.get(id);
    if (!note) return;
    activeId = id;
    if (els.source) els.source.value = note.content;
    if (els.tabLabel) els.tabLabel.textContent = note.title;
    if (els.preview) els.preview.innerHTML = renderMarkdown(note.content);
    if (els.statusNote) els.statusNote.textContent = note.path;
    const deg = edges.filter((e) => e.source === id || e.target === id).length;
    if (els.statusLinks) els.statusLinks.textContent = `${deg} connections`;
    dirty = false;
    renderFileTree();
    renderBacklinks();
    renderOutline();
    graph.selectedId = id;
    if (ribbonView === "graph") buildGraphSimulation();
  }

  async function persistActiveNote() {
    if (!activeId || !dirty) return;
    const note = notes.get(activeId);
    if (!note || note.kind === "welcome") return;
    const content = els.source?.value ?? note.content;
    note.content = content;
    note.links = extractWikilinks(content);
    note.tags = extractTags(content);

    if (note.kind === "day" && note.meta?.ymd) {
      parseDayMarkdown(String(note.meta.ymd), content);
      await writePlannerJson("day-pages", dayPagesRaw);
    } else if (note.kind === "reminder" && note.meta?.eventId) {
      const ev = eventsRaw.find((e) => e.id === note.meta.eventId);
      if (ev) {
        parseReminderMarkdown(ev, content);
        await writePlannerJson("events", eventsRaw);
      }
    }
    dirty = false;
    buildVault();
    renderFileTree();
    renderBacklinks();
    if (ribbonView === "graph") buildGraphSimulation();
  }

  function scheduleSave() {
    dirty = true;
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      void persistActiveNote();
    }, 600);
  }

  function setEditorMode(mode) {
    editorMode = mode;
    document.querySelectorAll(".obs-chip").forEach((b) => {
      b.classList.toggle("obs-chip--on", b.getAttribute("data-mode") === mode);
    });
    const split = els.editorSplit;
    const preview = els.preview;
    const source = els.source;
    if (!split || !preview || !source) return;
    if (mode === "edit") {
      split.classList.remove("obs-editor-split--split");
      preview.classList.add("obs-preview--hidden");
      source.style.display = "";
    } else if (mode === "preview") {
      split.classList.remove("obs-editor-split--split");
      preview.classList.remove("obs-preview--hidden");
      source.style.display = "none";
      preview.innerHTML = renderMarkdown(source.value);
    } else {
      split.classList.add("obs-editor-split--split");
      preview.classList.remove("obs-preview--hidden");
      source.style.display = "";
      preview.innerHTML = renderMarkdown(source.value);
    }
  }

  function setRibbonView(view) {
    ribbonView = view;
    document.querySelectorAll(".obs-ribbon-btn[data-view]").forEach((b) => {
      b.classList.toggle("obs-ribbon-btn--on", b.getAttribute("data-view") === view);
    });
    const fileBody = els.fileTree?.parentElement;
    if (fileBody) fileBody.classList.toggle("obs-sidebar-body--hidden", view === "search");
    els.searchPanel?.classList.toggle("obs-sidebar-body--hidden", view !== "search");
    if (els.sidebarTitle) {
      els.sidebarTitle.textContent =
        view === "search" ? "Search" : view === "graph" ? "Graph" : "Files";
    }
    const showGraph = view === "graph";
    els.editorPane?.classList.toggle("obs-pane--hidden", showGraph);
    els.graphPane?.classList.toggle("obs-pane--hidden", !showGraph);
    if (showGraph) {
      buildGraphSimulation();
      startGraphLoop();
    } else {
      stopGraphLoop();
    }
  }

  function buildGraphSimulation() {
    const showTags = els.showTags?.checked !== false;
    const showOrphans = els.showOrphans?.checked !== false;
    const nodeList = [...notes.values()].filter((n) => {
      if (n.id.startsWith("tag:") && !showTags) return false;
      if (n.id === "welcome") return false;
      return true;
    });

    const linkSet = new Set();
    const links = [];
    for (const e of edges) {
      if (!notes.has(e.source) || !notes.has(e.target)) continue;
      const key = [e.source, e.target].sort().join("|");
      if (linkSet.has(key)) continue;
      linkSet.add(key);
      links.push({ source: e.source, target: e.target });
    }

    const degree = /** @type {Record<string, number>} */ ({});
    for (const l of links) {
      degree[l.source] = (degree[l.source] || 0) + 1;
      degree[l.target] = (degree[l.target] || 0) + 1;
    }

    const filtered = showOrphans
      ? nodeList
      : nodeList.filter((n) => (degree[n.id] || 0) > 0 || n.id === graph.selectedId);

    graph.nodes = filtered.map((n, i) => {
      const d = degree[n.id] || 0;
      const angle = (i / Math.max(1, filtered.length)) * Math.PI * 2;
      const r = 6 + Math.min(24, 4 + d * 4);
      return {
        id: n.id,
        label: n.title,
        x: Math.cos(angle) * 120,
        y: Math.sin(angle) * 120,
        vx: 0,
        vy: 0,
        r,
        degree: d,
      };
    });
    graph.links = links.filter(
      (l) => filtered.some((n) => n.id === l.source) && filtered.some((n) => n.id === l.target),
    );
  }

  function resizeCanvas() {
    const c = els.canvas;
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    const w = c.clientWidth;
    const h = c.clientHeight;
    c.width = Math.floor(w * dpr);
    c.height = Math.floor(h * dpr);
    const ctx = c.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function graphForces() {
    const centerF = Number(els.forceCenter?.value || 0.35);
    const repelF = Number(els.forceRepel?.value || 320);
    const linkF = Number(els.forceLink?.value || 0.55);
    const dist = Number(els.forceDist?.value || 110);
    const c = els.canvas;
    if (!c) return;
    const idMap = new Map(graph.nodes.map((n) => [n.id, n]));

    for (const n of graph.nodes) {
      n.vx += (0 - n.x) * centerF * 0.002;
      n.vy += (0 - n.y) * centerF * 0.002;
    }

    for (let i = 0; i < graph.nodes.length; i++) {
      for (let j = i + 1; j < graph.nodes.length; j++) {
        const a = graph.nodes[i];
        const b = graph.nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let d2 = dx * dx + dy * dy || 0.01;
        const force = repelF / d2;
        const fx = (dx / Math.sqrt(d2)) * force;
        const fy = (dy / Math.sqrt(d2)) * force;
        a.vx -= fx;
        a.vy -= fy;
        b.vx += fx;
        b.vy += fy;
      }
    }

    for (const l of graph.links) {
      const a = idMap.get(l.source);
      const b = idMap.get(l.target);
      if (!a || !b) continue;
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const force = (d - dist) * linkF * 0.02;
      const fx = (dx / d) * force;
      const fy = (dy / d) * force;
      a.vx += fx;
      a.vy += fy;
      b.vx -= fx;
      b.vy -= fy;
    }

    for (const n of graph.nodes) {
      n.vx *= 0.86;
      n.vy *= 0.86;
      n.x += n.vx;
      n.y += n.vy;
    }
  }

  function drawGraph() {
    const c = els.canvas;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const w = c.clientWidth;
    const h = c.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#161616";
    ctx.fillRect(0, 0, w, h);

    const idMap = new Map(graph.nodes.map((n) => [n.id, n]));
    const z = graph.zoom;
    const ox = w / 2 + graph.panX;
    const oy = h / 2 + graph.panY;

    const highlight = new Set();
    if (graph.hoverId) {
      highlight.add(graph.hoverId);
      for (const l of graph.links) {
        if (l.source === graph.hoverId) highlight.add(l.target);
        if (l.target === graph.hoverId) highlight.add(l.source);
      }
    }

    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(z, z);

    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;
    for (const l of graph.links) {
      const a = idMap.get(l.source);
      const b = idMap.get(l.target);
      if (!a || !b) continue;
      const dim =
        graph.hoverId && !highlight.has(l.source) && !highlight.has(l.target);
      ctx.globalAlpha = dim ? 0.15 : 0.65;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    for (const n of graph.nodes) {
      const dim = graph.hoverId && !highlight.has(n.id);
      const selected = n.id === graph.selectedId;
      const hovered = graph.hoverId === n.id;
      if (hovered) {
        ctx.shadowColor = "rgba(127, 109, 242, 0.85)";
        ctx.shadowBlur = 16;
      }
      ctx.beginPath();
      ctx.arc(n.x, n.y, hovered ? n.r + 2 : n.r, 0, Math.PI * 2);
      ctx.fillStyle = selected
        ? "#a89bff"
        : dim
          ? "#3a3a3a"
          : hovered
            ? "#9d8fff"
            : "#7f6df2";
      ctx.fill();
      ctx.shadowBlur = 0;
      if (selected || hovered) {
        ctx.strokeStyle = selected ? "#fff" : "rgba(255,255,255,0.45)";
        ctx.lineWidth = selected ? 2 : 1;
        ctx.stroke();
      }
    }

    ctx.fillStyle = "#b4b4b4";
    ctx.font = "11px Segoe UI, sans-serif";
    ctx.textAlign = "center";
    const fade = 0.55 * z;
    ctx.globalAlpha = Math.min(1, fade);
    for (const n of graph.nodes) {
      if (z < 0.65 && n.degree < 2) continue;
      ctx.fillText(n.label.slice(0, 42), n.x, n.y + n.r + 12);
    }
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function graphLoop() {
    graphForces();
    drawGraph();
    graph.anim = requestAnimationFrame(graphLoop);
  }

  function startGraphLoop() {
    if (graph.anim) return;
    resizeCanvas();
    graph.anim = requestAnimationFrame(graphLoop);
  }

  function stopGraphLoop() {
    if (graph.anim) {
      cancelAnimationFrame(graph.anim);
      graph.anim = 0;
    }
  }

  function graphNodeAt(clientX, clientY) {
    const c = els.canvas;
    if (!c) return null;
    const rect = c.getBoundingClientRect();
    const w = c.clientWidth;
    const h = c.clientHeight;
    const ox = w / 2 + graph.panX;
    const oy = h / 2 + graph.panY;
    const x = (clientX - rect.left - ox) / graph.zoom;
    const y = (clientY - rect.top - oy) / graph.zoom;
    for (const n of graph.nodes) {
      const dx = n.x - x;
      const dy = n.y - y;
      if (dx * dx + dy * dy <= (n.r + 4) * (n.r + 4)) return n.id;
    }
    return null;
  }

  function bindGraphEvents() {
    const c = els.canvas;
    if (!c) return;

    c.addEventListener("wheel", (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.92 : 1.08;
      graph.zoom = Math.min(3, Math.max(0.25, graph.zoom * delta));
    }, { passive: false });

    c.addEventListener("mousedown", (e) => {
      const hit = graphNodeAt(e.clientX, e.clientY);
      graph.lastX = e.clientX;
      graph.lastY = e.clientY;
      if (hit) {
        graph.selectedId = hit;
        openNote(hit);
        setRibbonView("files");
      } else {
        graph.panning = true;
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (graph.panning) {
        graph.panX += e.clientX - graph.lastX;
        graph.panY += e.clientY - graph.lastY;
        graph.lastX = e.clientX;
        graph.lastY = e.clientY;
        return;
      }
      graph.hoverId = graphNodeAt(e.clientX, e.clientY);
      if (els.graphHint) {
        const n = graph.hoverId ? notes.get(graph.hoverId) : null;
        els.graphHint.textContent = n
          ? `${n.title} · ${n.path}`
          : "Circles are notes · lines are links · size reflects connections";
      }
    });

    window.addEventListener("mouseup", () => {
      graph.panning = false;
    });

    for (const id of ["obsForceCenter", "obsForceRepel", "obsForceLink", "obsForceDist", "obsShowTags", "obsShowOrphans"]) {
      $(id)?.addEventListener("input", () => buildGraphSimulation());
    }

    $("obsGraphZoomIn")?.addEventListener("click", () => {
      graph.zoom = Math.min(3, graph.zoom * 1.15);
    });
    $("obsGraphZoomOut")?.addEventListener("click", () => {
      graph.zoom = Math.max(0.25, graph.zoom / 1.15);
    });
    $("obsGraphFit")?.addEventListener("click", () => {
      graph.zoom = 1;
      graph.panX = 0;
      graph.panY = 0;
    });

    window.addEventListener("resize", () => {
      resizeCanvas();
      buildGraphSimulation();
    });
  }

  function runSearch(q) {
    if (!els.searchResults) return;
    els.searchResults.replaceChildren();
    const needle = q.trim().toLowerCase();
    if (!needle) return;
    for (const n of notes.values()) {
      if (n.id === "welcome") continue;
      const hay = `${n.title}\n${n.content}`.toLowerCase();
      if (!hay.includes(needle)) continue;
      const hit = document.createElement("div");
      hit.className = "obs-search-hit";
      hit.innerHTML = `${n.title}<small>${n.path}</small>`;
      hit.addEventListener("click", () => {
        openNote(n.id);
        setRibbonView("files");
      });
      els.searchResults.appendChild(hit);
    }
  }

  async function reloadVault() {
    eventsRaw = await readPlannerJson("events", []);
    dayPagesRaw = await readPlannerJson("day-pages", {});
    if (!Array.isArray(eventsRaw)) eventsRaw = [];
    if (!dayPagesRaw || typeof dayPagesRaw !== "object") dayPagesRaw = {};
    buildVault();
    renderFileTree();
    if (activeId && notes.has(activeId)) openNote(activeId);
    else openNote("welcome");
    if (ribbonView === "graph") buildGraphSimulation();
  }

  function bindUi() {
    document.querySelectorAll(".obs-ribbon-btn[data-view]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const v = btn.getAttribute("data-view");
        if (v === "files" || v === "search" || v === "graph") setRibbonView(v);
      });
    });

    $("obsRefreshBtn")?.addEventListener("click", () => {
      void reloadVault();
    });

    document.querySelectorAll(".obs-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const m = btn.getAttribute("data-mode");
        if (m === "edit" || m === "preview" || m === "split") setEditorMode(m);
      });
    });

    els.source?.addEventListener("input", () => {
      if (els.preview && editorMode !== "edit") {
        els.preview.innerHTML = renderMarkdown(els.source.value);
      }
      scheduleSave();
    });

    els.preview?.addEventListener("click", (e) => {
      const t = /** @type {HTMLElement} */ (e.target);
      const link = t.closest("[data-note-link]");
      if (link) {
        e.preventDefault();
        const id = link.getAttribute("data-note-link");
        if (id) openNote(id);
      }
    });

    els.searchInput?.addEventListener("input", () => {
      runSearch(els.searchInput.value);
    });

    bindGraphEvents();

    window.addEventListener("keydown", (e) => {
      if (ribbonView !== "graph") return;
      if (e.key === "+" || e.key === "=") {
        graph.zoom = Math.min(3, graph.zoom * 1.12);
        e.preventDefault();
      } else if (e.key === "-") {
        graph.zoom = Math.max(0.25, graph.zoom / 1.12);
        e.preventDefault();
      }
    });
  }

  async function init() {
    bindUi();
    setEditorMode("edit");
    await reloadVault();
    setRibbonView("files");
    resizeCanvas();
  }

  void init();
})();
