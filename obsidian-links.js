/**
 * Obsidian-style link parsing & resolution for Planner vault.
 */
(function rmeObsidianLinksFactory(global) {
  "use strict";

  const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;
  const MD_LINK_RE = /\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  const TAG_RE = /(?:^|\s)#([a-zA-Z0-9_/-]+)/g;
  const ALIASES_RE = /^aliases:\s*(.+)$/im;
  /** - [ ], * [x], + [X] task lines */
  const TODO_LINE_RE = /^\s*[-+*]\s+\[([ xX])\]\s*(.*)$/;
  const MIN_IMPLICIT_MATCH_LEN = 4;
  const YMD_RE = /\b(20\d{2}-\d{2}-\d{2})\b/g;
  const WEEKDAY_MONTH_YEAR_RE =
    /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday),?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{4})$/i;
  const WEEKDAY_MONTH_DAY_RE =
    /^(monday|tuesday|wednesday|thursday|friday|saturday|sunday),?\s+(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:st|nd|rd|th)?(?:,?\s+(\d{4}))?$/i;

  function escapeRegExp(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Plain text from note body + to-do lines for implicit (gray) link detection.
   * @param {string} content
   */
  function plainTextForMatching(content) {
    const lines = String(content || "").split("\n");
    const parts = [];
    for (const line of lines) {
      const todo = parseTodoLine(line);
      let chunk = todo ? todo.rest : line;
      chunk = chunk.replace(WIKILINK_RE, (_m, inner) => {
        const p = parseWikiTarget(inner);
        return ` ${p.display || p.target} `;
      });
      chunk = chunk.replace(MD_LINK_RE, (_m, label) => ` ${label} `);
      chunk = chunk
        .replace(/^#+\s+/gm, " ")
        .replace(/[*_`>]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      if (chunk) parts.push(chunk);
    }
    return parts.join("\n").toLowerCase();
  }

  /** @param {string} s */
  function normalizeForPhraseMatch(s) {
    return normalizeDatePhrase(String(s || "").toLowerCase())
      .replace(/,/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * @param {string} haystack lowercased plain text
   * @param {string} phrase note title or alias
   */
  function phraseMatchesInText(haystack, phrase) {
    const hay = normalizeForPhraseMatch(haystack);
    const p = normalizeForPhraseMatch(phrase);
    if (p.length < MIN_IMPLICIT_MATCH_LEN) return false;
    const words = p.split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      const re = new RegExp(`(?:^|[^\\p{L}\\p{N}])${escapeRegExp(words[0])}(?:[^\\p{L}\\p{N}]|$)`, "iu");
      return re.test(hay);
    }
    const re = new RegExp(
      `(?:^|[^\\p{L}\\p{N}])${words.map(escapeRegExp).join("\\s+")}(?:[^\\p{L}\\p{N}]|$)`,
      "iu",
    );
    return re.test(hay);
  }

  /**
   * @param {Map<string, string>} aliasIndex
   * @returns {Map<string, string[]>}
   */
  function aliasesGroupedByNote(aliasIndex) {
    /** @type {Map<string, string[]>} */
    const byId = new Map();
    for (const [alias, id] of aliasIndex) {
      const a = String(alias || "").trim();
      if (a.length < MIN_IMPLICIT_MATCH_LEN) continue;
      if (!byId.has(id)) byId.set(id, []);
      const list = byId.get(id);
      if (!list.includes(a)) list.push(a);
    }
    for (const list of byId.values()) {
      list.sort((a, b) => b.length - a.length);
    }
    return byId;
  }

  /**
   * @param {string} inner content inside [[ ]]
   */
  function parseWikiTarget(inner) {
    let target = String(inner || "").trim();
    let display = null;
    const pipe = target.indexOf("|");
    if (pipe !== -1) {
      display = target.slice(pipe + 1).trim();
      target = target.slice(0, pipe).trim();
    }
    let heading = null;
    let block = null;
    const caret = target.indexOf("^");
    if (caret !== -1) {
      block = target.slice(caret + 1).trim();
      target = target.slice(0, caret).trim();
    }
    const hash = target.indexOf("#");
    if (hash !== -1) {
      heading = target.slice(hash + 1).trim();
      target = target.slice(0, hash).trim();
    }
    return { target, display, heading, block };
  }

  /**
   * @param {string} line
   * @returns {{ done: boolean; rest: string } | null}
   */
  function parseTodoLine(line) {
    const m = String(line || "").match(TODO_LINE_RE);
    if (!m) return null;
    return { done: m[1].toLowerCase() === "x", rest: m[2] };
  }

  /**
   * @param {string} heading
   */
  function slugHeading(heading) {
    return String(heading || "")
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  /** @param {string} ymd */
  function parseYmdParts(ymd) {
    const k = String(ymd || "").slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) return null;
    const [y, mo, d] = k.split("-").map(Number);
    const dt = new Date(y, mo - 1, d);
    return Number.isNaN(dt.getTime()) ? null : dt;
  }

  /** @param {Date} dt */
  function ymdFromDate(dt) {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  /** @param {Date} dt */
  function weekdayMonthYearLabel(dt) {
    const wd = dt.toLocaleDateString("en-US", { weekday: "long" });
    const month = dt.toLocaleDateString("en-US", { month: "long" });
    return `${wd}, ${month} ${dt.getFullYear()}`;
  }

  /** @param {string} target */
  function normalizeDatePhrase(target) {
    return String(target || "")
      .trim()
      .replace(/\b(\d{1,2})(st|nd|rd|th)\b/gi, "$1");
  }

  /** @param {string} target */
  function targetToYmd(target) {
    const t = normalizeDatePhrase(target);
    if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
    const dt = new Date(t);
    if (Number.isNaN(dt.getTime())) return null;
    return ymdFromDate(dt);
  }

  /**
   * @param {string} target e.g. "Tuesday, May 2006"
   * @param {Map<string, { id: string; kind?: string; meta?: Record<string, unknown> }>} notes
   */
  function resolveWeekdayMonthYear(target, notes) {
    const m = String(target || "")
      .trim()
      .toLowerCase()
      .match(WEEKDAY_MONTH_YEAR_RE);
    if (!m) return null;
    const wantWd = m[1];
    const wantMonth = m[2];
    const wantYear = Number(m[3]);
    /** @type {string[]} */
    const hits = [];
    for (const n of notes.values()) {
      if (n.kind !== "day" || !n.meta?.ymd) continue;
      const dt = parseYmdParts(String(n.meta.ymd));
      if (!dt) continue;
      const wd = dt.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const month = dt.toLocaleDateString("en-US", { month: "long" }).toLowerCase();
      if (wd === wantWd && month === wantMonth && dt.getFullYear() === wantYear) hits.push(n.id);
    }
    return hits.length === 1 ? hits[0] : null;
  }

  /**
   * @param {string} target e.g. "Tuesday, May 26" or "Tuesday, May 26, 2026"
   * @param {Map<string, { id: string; kind?: string; meta?: Record<string, unknown> }>} notes
   */
  function resolveWeekdayMonthDay(target, notes) {
    const normalized = normalizeDatePhrase(target).toLowerCase();
    const m = normalized.match(WEEKDAY_MONTH_DAY_RE);
    if (!m) return null;
    const wantWd = m[1];
    const wantMonth = m[2];
    const wantDay = Number(m[3]);
    const wantYear = m[4] ? Number(m[4]) : null;
    /** @type {string[]} */
    const hits = [];
    for (const n of notes.values()) {
      if (n.kind !== "day" || !n.meta?.ymd) continue;
      const dt = parseYmdParts(String(n.meta.ymd));
      if (!dt) continue;
      const wd = dt.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
      const month = dt.toLocaleDateString("en-US", { month: "long" }).toLowerCase();
      if (wd !== wantWd || month !== wantMonth || dt.getDate() !== wantDay) continue;
      if (wantYear !== null && dt.getFullYear() !== wantYear) continue;
      hits.push(n.id);
    }
    return hits.length === 1 ? hits[0] : null;
  }

  /**
   * @param {Map<string, string[]>} bucket
   * @param {string} key
   * @param {string} id
   */
  function bucketAlias(bucket, key, id) {
    const k = String(key || "").trim().toLowerCase();
    if (!k) return;
    if (!bucket.has(k)) bucket.set(k, []);
    bucket.get(k).push(id);
  }

  /**
   * @param {Map<string, string[]>} bucket
   * @param {Map<string, string>} index
   */
  function flushUniqueAliases(bucket, index) {
    for (const [k, ids] of bucket) {
      const unique = [...new Set(ids)];
      if (unique.length === 1) index.set(k, unique[0]);
    }
  }

  /**
   * @param {Map<string, { id: string; title: string; path: string; folder: string; kind: string; content: string; aliases?: string[]; meta?: Record<string, unknown> }>} notes
   */
  function buildAliasIndex(notes) {
    /** @type {Map<string, string>} */
    const index = new Map();
    /** @type {Map<string, string[]>} */
    const weekdayMonthYear = new Map();
    const weekdayMonthDay = new Map();
    const monthDayYear = new Map();

    for (const n of notes.values()) {
      const names = new Set();
      names.add(n.title);
      const base = String(n.path || "")
        .replace(/\.md$/i, "")
        .split("/")
        .pop();
      if (base) names.add(base);
      if (n.meta?.ymd) {
        const ymd = String(n.meta.ymd);
        names.add(ymd);
        const dt = parseYmdParts(ymd);
        if (dt) {
          names.add(
            dt.toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
          );
          const wmy = weekdayMonthYearLabel(dt).toLowerCase();
          bucketAlias(weekdayMonthYear, wmy, n.id);
          const wd = dt.toLocaleDateString("en-US", { weekday: "long" });
          const month = dt.toLocaleDateString("en-US", { month: "long" });
          const dayNum = dt.getDate();
          bucketAlias(weekdayMonthDay, `${wd}, ${month} ${dayNum}`.toLowerCase(), n.id);
          bucketAlias(weekdayMonthDay, `${wd} ${month} ${dayNum}`.toLowerCase(), n.id);
          bucketAlias(
            monthDayYear,
            `${month} ${dt.getDate()}, ${dt.getFullYear()}`.toLowerCase(),
            n.id,
          );
        }
      }
      const aliasMatch = String(n.content || "").match(ALIASES_RE);
      if (aliasMatch) {
        for (const part of aliasMatch[1].split(",")) {
          const a = part.trim();
          if (a) names.add(a);
        }
      }
      if (Array.isArray(n.aliases)) {
        for (const a of n.aliases) if (a) names.add(String(a));
      }
      for (const name of names) {
        const k = String(name).trim().toLowerCase();
        if (k.length > 0) index.set(k, n.id);
      }
    }

    flushUniqueAliases(weekdayMonthYear, index);
    flushUniqueAliases(weekdayMonthDay, index);
    flushUniqueAliases(monthDayYear, index);

    return index;
  }

  /**
   * @param {string} target
   * @param {Map<string, string>} aliasIndex
   * @param {Map<string, { id: string; kind?: string; meta?: Record<string, unknown> }>} [notes]
   */
  function resolveNoteId(target, aliasIndex, notes) {
    const k = String(target || "").trim().toLowerCase();
    if (!k) return null;
    if (aliasIndex.has(k)) return aliasIndex.get(k);

    const ymd = targetToYmd(target);
    if (ymd) {
      const dayId = `day:${ymd}`;
      if (notes?.has(dayId)) return dayId;
      if (aliasIndex.has(ymd)) return aliasIndex.get(ymd);
    }

    if (notes) {
      const wmdId = resolveWeekdayMonthDay(target, notes);
      if (wmdId) return wmdId;
      const wdId = resolveWeekdayMonthYear(target, notes);
      if (wdId) return wdId;
    }

    for (const [alias, id] of aliasIndex) {
      if (alias.includes(k) || k.includes(alias)) {
        if (Math.min(alias.length, k.length) >= 4) return id;
      }
    }
    return null;
  }

  /**
   * @param {string} line
   * @param {number} lineNumber 1-based
   * @param {string} sourceId
   * @param {Map<string, string>} aliasIndex
   * @param {Map<string, { id: string; kind?: string; meta?: Record<string, unknown> }>} [notes]
   * @param {"note"|"todo"} sourceType
   * @param {boolean} [todoDone]
   * @returns {Array<{ type: string; source: string; target: string; label?: string; heading?: string; block?: string; lineNumber: number; todoDone?: boolean }>}
   */
  function extractWikilinksFromLine(line, lineNumber, sourceId, aliasIndex, notes, sourceType, todoDone) {
    /** @type {Array<{ type: string; source: string; target: string; label?: string; heading?: string; block?: string; lineNumber: number; todoDone?: boolean }>} */
    const out = [];
    const wRe = new RegExp(WIKILINK_RE.source, "g");
    let m;
    while ((m = wRe.exec(line))) {
      const parsed = parseWikiTarget(m[1]);
      const tid = resolveNoteId(parsed.target, aliasIndex, notes);
      if (!tid || tid === sourceId) continue;
      const baseType = parsed.block ? "block" : parsed.heading ? "heading" : "wikilink";
      const edge = {
        type: sourceType === "todo" ? "todo" : baseType,
        source: sourceId,
        target: tid,
        label: parsed.display || parsed.target,
        heading: parsed.heading || undefined,
        block: parsed.block || undefined,
        lineNumber,
      };
      if (sourceType === "todo") {
        edge.todoDone = Boolean(todoDone);
      }
      out.push(edge);
    }
    return out;
  }

  /**
   * @param {string} line
   * @param {number} lineNumber
   * @param {string} sourceId
   * @param {Map<string, string>} aliasIndex
   * @param {Map<string, { id: string; kind?: string; meta?: Record<string, unknown> }>} [notes]
   */
  function extractMarkdownLinksFromLine(line, lineNumber, sourceId, aliasIndex, notes) {
    /** @type {Array<{ type: string; source: string; target: string; label?: string; lineNumber: number }>} */
    const out = [];
    const mdRe = new RegExp(MD_LINK_RE.source, "g");
    let m;
    while ((m = mdRe.exec(line))) {
      const label = m[1];
      const href = m[2].trim();
      if (href.startsWith("http://") || href.startsWith("https://")) continue;
      const path = href.replace(/\.md$/i, "").split("/").pop() || href;
      const tid =
        resolveNoteId(path, aliasIndex, notes) || resolveNoteId(href, aliasIndex, notes);
      if (!tid || tid === sourceId) continue;
      out.push({
        type: "markdown",
        source: sourceId,
        target: tid,
        label: label || href,
        lineNumber,
      });
    }
    return out;
  }

  /**
   * Links day notes when body/to-do text mentions another day's YYYY-MM-DD key.
   * @param {string} content
   * @param {string} sourceId
   * @param {Map<string, { id: string; kind?: string; meta?: Record<string, unknown> }>} notes
   */
  function extractYmdMentionEdges(content, sourceId, notes) {
    /** @type {Array<{ type: string; source: string; target: string; label?: string; lineNumber: number }>} */
    const out = [];
    /** @type {Set<string>} */
    const seen = new Set();
    const re = new RegExp(YMD_RE.source, "g");
    let m;
    while ((m = re.exec(String(content || "")))) {
      const ymd = m[1];
      const targetId = `day:${ymd}`;
      if (targetId === sourceId || !notes.has(targetId)) continue;
      const key = `${sourceId}|${targetId}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        type: "wikilink",
        source: sourceId,
        target: targetId,
        label: ymd,
        lineNumber: 0,
      });
    }
    return out;
  }

  /**
   * Pair key for de-dupe: same from/to with body wiki wins over todo.
   * @param {string} sourceId
   * @param {string} targetId
   */
  function bodyPairKey(sourceId, targetId) {
    return `${sourceId}|${targetId}`;
  }

  /**
   * @param {string} content
   * @param {string} sourceId
   * @param {Map<string, string>} aliasIndex
   * @param {Map<string, { id: string; kind?: string; meta?: Record<string, unknown> }>} [notes]
   * @returns {Array<{ type: string; source: string; target: string; label?: string; heading?: string; block?: string; lineNumber: number; todoDone?: boolean }>}
   */
  function extractLinksFromContent(content, sourceId, aliasIndex, notes) {
    /** @type {Array<{ type: string; source: string; target: string; label?: string; heading?: string; block?: string; lineNumber: number; todoDone?: boolean }>} */
    const out = [];
    const lines = String(content || "").split("\n");
    /** @type {Set<string>} */
    const bodyWikiTargets = new Set();

    for (let i = 0; i < lines.length; i++) {
      const lineNumber = i + 1;
      const todo = parseTodoLine(lines[i]);
      if (todo) continue;
      for (const link of extractWikilinksFromLine(
        lines[i],
        lineNumber,
        sourceId,
        aliasIndex,
        notes,
        "note",
      )) {
        bodyWikiTargets.add(bodyPairKey(sourceId, link.target));
        out.push(link);
      }
      for (const link of extractMarkdownLinksFromLine(
        lines[i],
        lineNumber,
        sourceId,
        aliasIndex,
        notes,
      )) {
        bodyWikiTargets.add(bodyPairKey(sourceId, link.target));
        out.push(link);
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const lineNumber = i + 1;
      const todo = parseTodoLine(lines[i]);
      if (!todo) continue;
      for (const link of extractWikilinksFromLine(
        lines[i],
        lineNumber,
        sourceId,
        aliasIndex,
        notes,
        "todo",
        todo.done,
      )) {
        if (bodyWikiTargets.has(bodyPairKey(sourceId, link.target))) continue;
        out.push(link);
      }
    }

    return out;
  }

  /** @type {typeof extractLinksFromContent} */
  const parseLinks = extractLinksFromContent;

  /**
   * Wikilink target strings already present in content (for unlinked detection).
   * @param {string} content
   */
  function linkedTargetKeys(content) {
    const keys = new Set();
    const re = new RegExp(WIKILINK_RE.source, "g");
    let m;
    while ((m = re.exec(content))) {
      const p = parseWikiTarget(m[1]);
      keys.add(p.target.toLowerCase());
    }
    return keys;
  }

  /**
   * Implicit gray links: note titles / aliases found as words or phrases in body + to-do text.
   * @param {string} noteId
   * @param {Map<string, { id: string; title: string; content: string; kind?: string }>} notes
   * @param {Map<string, string>} aliasIndex
   * @param {Set<string>} [explicitTargetIds] already linked (wiki, todo, markdown, …)
   */
  /**
   * @param {string} text planner notes + to-do lines (no template heading)
   * @param {string} noteId
   * @param {Map<string, { id: string; title: string; content: string; kind?: string }>} notes
   * @param {Map<string, string>} aliasIndex
   * @param {Set<string>} [explicitTargetIds]
   */
  function findUnlinkedMentionsFromText(text, noteId, notes, aliasIndex, explicitTargetIds) {
    const content = String(text || "");
    const haystack = plainTextForMatching(content);
    if (!haystack) return [];
    const already = linkedTargetKeys(content);
    const explicit = explicitTargetIds || new Set();
    const grouped = aliasesGroupedByNote(aliasIndex);
    /** @type {{ id: string; title: string; alias: string }[]} */
    const hits = [];
    const seen = new Set();
    for (const [targetId, aliases] of grouped) {
      if (targetId === noteId || seen.has(targetId)) continue;
      if (explicit.has(targetId)) continue;
      const other = notes.get(targetId);
      if (!other || other.kind === "tag") continue;
      let matchedAlias = null;
      for (const alias of aliases) {
        const key = alias.toLowerCase();
        if (already.has(key)) continue;
        if (phraseMatchesInText(haystack, alias)) {
          matchedAlias = alias;
          break;
        }
      }
      if (!matchedAlias) continue;
      seen.add(targetId);
      hits.push({ id: targetId, title: other.title, alias: matchedAlias });
    }
    return hits.sort((a, b) => a.title.localeCompare(b.title));
  }

  function findUnlinkedMentions(noteId, notes, aliasIndex, explicitTargetIds) {
    const note = notes.get(noteId);
    if (!note) return [];
    return findUnlinkedMentionsFromText(note.content, noteId, notes, aliasIndex, explicitTargetIds);
  }

  /**
   * @param {string} text
   * @param {string} sourceId
   * @param {Map<string, { id: string; title: string; content: string; kind?: string; meta?: Record<string, unknown> }>} notes
   * @param {Map<string, string>} aliasIndex
   * @param {Set<string>} [explicitTargetIds]
   */
  function extractPlannerReferenceEdges(text, sourceId, notes, aliasIndex, explicitTargetIds) {
    /** @type {Array<{ type: string; source: string; target: string; label?: string; lineNumber?: number; todoDone?: boolean }>} */
    const out = [];
    const seen = new Set();
    const explicit = new Set(explicitTargetIds || []);

    const push = (edge) => {
      const key = `${edge.source}|${edge.target}|${edge.type}`;
      if (seen.has(key)) return;
      seen.add(key);
      explicit.add(edge.target);
      out.push(edge);
    };

    for (const link of extractLinksFromContent(text, sourceId, aliasIndex, notes)) {
      push(link);
    }
    for (const link of extractYmdMentionEdges(text, sourceId, notes)) {
      push(link);
    }

    for (const m of findUnlinkedMentionsFromText(text, sourceId, notes, aliasIndex, explicit)) {
      const other = notes.get(m.id);
      const type =
        other?.kind === "day" && notes.get(sourceId)?.kind === "day" ? "wikilink" : "unlinked";
      push({
        type,
        source: sourceId,
        target: m.id,
        label: m.alias,
        lineNumber: 0,
      });
    }

    return out;
  }

  /**
   * Replace wikilinks when a note title changes.
   * @param {string} oldTitle
   * @param {string} newTitle
   * @param {string} content
   */
  function updateWikilinksOnRename(oldTitle, newTitle, content) {
    const oldK = String(oldTitle || "").trim();
    const neu = String(newTitle || "").trim();
    if (!oldK || !neu || oldK === neu) return content;
    const re = new RegExp(WIKILINK_RE.source, "g");
    return String(content || "").replace(re, (full, inner) => {
      const p = parseWikiTarget(inner);
      if (p.target.toLowerCase() === oldK.toLowerCase()) {
        let repl = neu;
        if (p.heading) repl += `#${p.heading}`;
        if (p.block) repl += `^${p.block}`;
        if (p.display) repl += `|${p.display}`;
        return `[[${repl}]]`;
      }
      return full;
    });
  }

  const api = {
    parseWikiTarget,
    parseTodoLine,
    slugHeading,
    buildAliasIndex,
    resolveNoteId,
    targetToYmd,
    extractYmdMentionEdges,
    extractPlannerReferenceEdges,
    extractLinksFromContent,
    parseLinks,
    findUnlinkedMentions,
    findUnlinkedMentionsFromText,
    plainTextForMatching,
    phraseMatchesInText,
    updateWikilinksOnRename,
    linkedTargetKeys,
    TAG_RE,
    WIKILINK_RE,
    TODO_LINE_RE,
  };

  global.RmeObsidianLinks = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
