/**
 * Shared-term keyword index for planner vault notes.
 * @typedef {import('./keywordIndex.types')} KeywordLinkConfig
 */
const { EN_STOPWORDS } = require("./stopwords-en.js");

const WIKILINK_RE = /\[\[([^\]]+)\]\]/g;
const PROPER_NOUN_RE = /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\b/g;
const TOKEN_RE = /\b[\p{L}\p{N}'’_-]+\b/gu;
const FENCED_CODE_RE = /```[\s\S]*?```/g;
const INLINE_CODE_RE = /`[^`\n]+`/g;
const HTML_COMMENT_RE = /<!--[\s\S]*?-->/g;
const MEMORY_CEILING_BYTES = 25 * 1024 * 1024;

const DEDUPE_EDGE_TYPES = new Set([
  "wikilink",
  "heading",
  "block",
  "todo",
  "markdown",
]);

/** @type {KeywordLinkConfig} */
const DEFAULT_CONFIG = {
  enabled: true,
  minLength: 3,
  minFiles: 2,
  maxFilesPerTerm: 50,
  stopwords: EN_STOPWORDS,
  customStopwords: [],
  promoteToEdges: false,
  caseSensitive: false,
};

/**
 * @param {Partial<KeywordLinkConfig>} [overrides]
 * @returns {KeywordLinkConfig & { stopwordSet: Set<string> }}
 */
function mergeKeywordConfig(overrides) {
  const base = { ...DEFAULT_CONFIG, ...(overrides || {}) };
  const stopwordSet = new Set(
    [...(base.stopwords || EN_STOPWORDS), ...(base.customStopwords || [])].map((w) =>
      String(w).toLowerCase(),
    ),
  );
  return { ...base, stopwordSet };
}

/**
 * @param {string} text
 * @returns {string}
 */
function stripExcludedRegions(text) {
  return String(text || "")
    .replace(HTML_COMMENT_RE, " ")
    .replace(FENCED_CODE_RE, " ")
    .replace(INLINE_CODE_RE, " ");
}

/**
 * @param {string} line
 * @returns {Array<{ start: number; end: number }>}
 */
function wikilinkSpansOnLine(line) {
  /** @type {Array<{ start: number; end: number }>} */
  const spans = [];
  const re = new RegExp(WIKILINK_RE.source, "g");
  let m;
  while ((m = re.exec(line))) {
    spans.push({ start: m.index, end: m.index + m[0].length });
  }
  return spans;
}

/**
 * @param {number} pos
 * @param {Array<{ start: number; end: number }>} spans
 */
function inSpan(pos, spans) {
  return spans.some((s) => pos >= s.start && pos < s.end);
}

/**
 * @param {string} token
 * @param {KeywordLinkConfig & { stopwordSet: Set<string> }} config
 */
function acceptToken(token, config) {
  const raw = String(token || "").replace(/^['’_-]+|['’_-]+$/g, "");
  if (!raw) return null;
  const norm = config.caseSensitive ? raw : raw.toLowerCase();
  if (norm.length < config.minLength) return null;
  if (/^\d+$/.test(norm)) return null;
  if (config.stopwordSet.has(norm)) return null;
  return norm;
}

/**
 * @param {string} text
 * @param {KeywordLinkConfig & { stopwordSet: Set<string> }} config
 * @returns {string[]}
 */
function tokenize(text, config) {
  const clean = stripExcludedRegions(text);
  /** @type {string[]} */
  const out = [];
  const re = new RegExp(TOKEN_RE.source, TOKEN_RE.flags);
  let m;
  while ((m = re.exec(clean))) {
    const t = acceptToken(m[0], config);
    if (t) out.push(t);
  }
  return out;
}

/**
 * @param {string} line
 * @param {Array<{ start: number; end: number }>} wikiSpans
 * @param {KeywordLinkConfig & { stopwordSet: Set<string> }} config
 * @returns {string[]}
 */
function extractProperNounTerms(line, wikiSpans, config) {
  /** @type {string[]} */
  const terms = [];
  const re = new RegExp(PROPER_NOUN_RE.source, "g");
  let m;
  while ((m = re.exec(line))) {
    if (inSpan(m.index, wikiSpans)) continue;
    const phrase = m[0];
    const words = phrase.split(/\s+/);
    if (words.length < 2) continue;
    const term = config.caseSensitive
      ? phrase
      : words.map((w) => w.toLowerCase()).join(" ");
    if (term.length < config.minLength) continue;
    if (config.stopwordSet.has(term)) continue;
    terms.push(term);
  }
  return terms;
}

/**
 * @param {string} line
 * @param {KeywordLinkConfig & { stopwordSet: Set<string> }} config
 * @returns {string}
 */
function lineWithoutWikilinks(line) {
  return String(line || "").replace(WIKILINK_RE, " ");
}

/**
 * @param {string} text
 * @param {KeywordLinkConfig & { stopwordSet: Set<string> }} config
 * @returns {Map<string, number[]>}
 */
function extractTerms(text, config) {
  /** @type {Map<string, number[]>} */
  const map = new Map();

  const add = (term, lineNumber) => {
    if (!term) return;
    if (!map.has(term)) map.set(term, []);
    const arr = map.get(term);
    if (!arr.includes(lineNumber)) arr.push(lineNumber);
  };

  const lines = String(text || "").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const lineNumber = i + 1;
    const rawLine = lines[i];
    const wikiSpans = wikilinkSpansOnLine(rawLine);
    for (const pn of extractProperNounTerms(rawLine, wikiSpans, config)) {
      add(pn, lineNumber);
    }
    const tokenLine = stripExcludedRegions(lineWithoutWikilinks(rawLine));
    const re = new RegExp(TOKEN_RE.source, TOKEN_RE.flags);
    let m;
    while ((m = re.exec(tokenLine))) {
      const t = acceptToken(m[0], config);
      if (t) add(t, lineNumber);
    }
  }
  return map;
}

/**
 * @param {Map<string, Set<string>>} inverted
 * @param {Map<string, Map<string, number[]>>} fileTerms
 */
function estimateIndexBytes(inverted, fileTerms) {
  let n = 0;
  for (const [term, ids] of inverted) {
    n += term.length * 2 + ids.size * 40;
  }
  for (const [, terms] of fileTerms) {
    for (const [term, lines] of terms) {
      n += term.length * 2 + lines.length * 8;
    }
  }
  return n;
}

/**
 * @param {Array<{ id: string; path: string; content: string }>} files
 * @param {KeywordLinkConfig & { stopwordSet: Set<string> }} config
 */
function buildInvertedIndex(files, config) {
  /** @type {Map<string, Set<string>>} */
  const inverted = new Map();
  /** @type {Map<string, Map<string, number[]>>} */
  const fileTerms = new Map();
  /** @type {Map<string, { id: string; path: string; content: string }>} */
  const fileById = new Map();

  for (const file of files) {
    if (!file?.id || file.id === "welcome") continue;
    fileById.set(file.id, file);
    const terms = config.enabled ? extractTerms(file.content, config) : new Map();
    fileTerms.set(file.id, terms);
    for (const term of terms.keys()) {
      if (!inverted.has(term)) inverted.set(term, new Set());
      inverted.get(term).add(file.id);
    }
  }

  const bytes = estimateIndexBytes(inverted, fileTerms);
  if (bytes > MEMORY_CEILING_BYTES) {
    console.warn(
      `[keywordIndex] estimated ${Math.round(bytes / 1024 / 1024)} MB exceeds ${MEMORY_CEILING_BYTES / 1024 / 1024} MB ceiling`,
    );
  }

  return { inverted, fileTerms, fileById, bytes };
}

/**
 * @param {Map<string, Set<string>>} inverted
 * @param {Map<string, Map<string, number[]>>} fileTerms
 * @param {string} fileId
 * @param {Map<string, number[]>} newTerms
 */
function updateIndexForFile(inverted, fileTerms, fileId, newTerms) {
  const oldTerms = fileTerms.get(fileId);
  if (oldTerms) {
    for (const term of oldTerms.keys()) {
      const set = inverted.get(term);
      if (!set) continue;
      set.delete(fileId);
      if (set.size === 0) inverted.delete(term);
    }
  }
  fileTerms.set(fileId, newTerms);
  for (const term of newTerms.keys()) {
    if (!inverted.has(term)) inverted.set(term, new Set());
    inverted.get(term).add(fileId);
  }
}

/**
 * @param {string} line
 * @param {number} lineNumber
 * @param {string} term
 * @param {number} [radius]
 */
function snippetAroundTerm(line, lineNumber, term, radius = 80) {
  const hay = String(line || "");
  const needle = term;
  let idx = configInsensitiveIndexOf(hay, needle);
  if (idx < 0 && term.includes(" ")) {
    idx = configInsensitiveIndexOf(hay, term);
  }
  if (idx < 0) {
    const slice = hay.slice(0, 160);
    return { snippet: slice, lineNumber };
  }
  const start = Math.max(0, idx - radius);
  const end = Math.min(hay.length, idx + term.length + radius);
  let snippet = hay.slice(start, end);
  if (start > 0) snippet = `…${snippet}`;
  if (end < hay.length) snippet = `${snippet}…`;
  return { snippet, lineNumber };
}

/**
 * @param {string} hay
 * @param {string} needle
 */
function configInsensitiveIndexOf(hay, needle) {
  return hay.toLowerCase().indexOf(needle.toLowerCase());
}

/**
 * @param {string} filePath
 * @param {Map<string, { path: string }>} fileById
 */
function idFromPath(filePath, fileById) {
  for (const [id, f] of fileById) {
    if (f.path === filePath) return id;
  }
  return null;
}

/**
 * @param {string} fileId
 * @param {{
 *   inverted: Map<string, Set<string>>;
 *   fileTerms: Map<string, Map<string, number[]>>;
 *   fileById: Map<string, { id: string; path: string; content: string }>;
 * }} index
 * @param {KeywordLinkConfig & { stopwordSet: Set<string> }} config
 */
function getMentionsForFile(fileId, index, config) {
  const { inverted, fileTerms, fileById } = index;
  const myTerms = fileTerms.get(fileId);
  if (!myTerms || !config.enabled) return [];

  /** @type {Map<string, { term: string; occurrences: Array<{ filePath: string; lineNumber: number; snippet: string; fileId: string }> }>} */
  const byTerm = new Map();

  for (const term of myTerms.keys()) {
    const fileSet = inverted.get(term);
    if (!fileSet || fileSet.size < config.minFiles) continue;
    if (fileSet.size > config.maxFilesPerTerm) continue;

    for (const otherId of fileSet) {
      if (otherId === fileId) continue;
      const other = fileById.get(otherId);
      if (!other) continue;
      const otherTerms = fileTerms.get(otherId);
      const lines = otherTerms?.get(term);
      if (!lines?.length) continue;
      const linesArr = other.content.split("\n");
      if (!byTerm.has(term)) {
        byTerm.set(term, { term, occurrences: [] });
      }
      const group = byTerm.get(term);
      for (const lineNumber of lines) {
        const line = linesArr[lineNumber - 1] ?? "";
        const { snippet } = snippetAroundTerm(line, lineNumber, term);
        group.occurrences.push({
          filePath: other.path,
          fileId: otherId,
          lineNumber,
          snippet,
        });
      }
    }
  }

  return [...byTerm.values()]
    .filter((g) => g.occurrences.length > 0)
    .sort((a, b) => a.term.localeCompare(b.term));
}

/**
 * @param {string} a
 * @param {string} b
 */
function pairKey(a, b) {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/**
 * @param {Array<{ source: string; target: string; type?: string }>} wikiEdges
 */
function wikiPairSetFromEdges(wikiEdges) {
  const set = new Set();
  for (const e of wikiEdges || []) {
    const t = String(e.type || "wikilink");
    if (!DEDUPE_EDGE_TYPES.has(t)) continue;
    set.add(pairKey(e.source, e.target));
  }
  return set;
}

/**
 * @param {{
 *   inverted: Map<string, Set<string>>;
 *   fileById: Map<string, { id: string; path: string; content: string }>;
 * }} index
 * @param {KeywordLinkConfig & { stopwordSet: Set<string> }} config
 * @param {Set<string>} wikiPairs
 */
function generateKeywordEdges(index, config, wikiPairs) {
  if (!config.enabled || !config.promoteToEdges) return [];
  const { inverted, fileById } = index;
  /** @type {Array<{ type: string; source: string; target: string; term: string; sourceLine?: number; targetLine?: number }>} */
  const edges = [];
  const seen = new Set();

  for (const [term, fileSet] of inverted) {
    if (fileSet.size < config.minFiles) continue;
    if (fileSet.size > config.maxFilesPerTerm) continue;
    const ids = [...fileSet].sort();
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i];
        const b = ids[j];
        const pk = pairKey(a, b);
        if (wikiPairs.has(pk)) continue;
        const edgeKey = `${pk}|${term}`;
        if (seen.has(edgeKey)) continue;
        seen.add(edgeKey);
        edges.push({
          type: "keyword",
          source: a,
          target: b,
          term,
        });
      }
    }
  }
  return edges;
}

function createKeywordIndexState(initialConfig) {
  let config = mergeKeywordConfig(initialConfig);
  /** @type {ReturnType<typeof buildInvertedIndex> | null} */
  let index = null;
  /** @type {Set<string>} */
  let wikiPairs = new Set();
  let lastRebuildMs = 0;

  return {
    getConfig: () => ({ ...config, stopwords: EN_STOPWORDS }),
    setConfig(partial) {
      config = mergeKeywordConfig({ ...config, ...partial });
    },
    rebuild(files, wikiEdges) {
      const t0 = Date.now();
      wikiPairs = wikiPairSetFromEdges(wikiEdges);
      index = buildInvertedIndex(files || [], config);
      lastRebuildMs = Date.now() - t0;
      return { ms: lastRebuildMs, bytes: index.bytes };
    },
    updateFile(fileId, content) {
      if (!index) return;
      const file = index.fileById.get(fileId);
      if (!file) return;
      file.content = content;
      const terms = config.enabled ? extractTerms(content, config) : new Map();
      updateIndexForFile(index.inverted, index.fileTerms, fileId, terms);
    },
    getMentions(filePath) {
      if (!index) return [];
      const fileId =
        idFromPath(filePath, index.fileById) ||
        [...index.fileById.entries()].find(([, f]) => f.path === filePath)?.[0];
      if (!fileId) return [];
      return getMentionsForFile(fileId, index, config);
    },
    getKeywordEdges() {
      if (!index) return [];
      return generateKeywordEdges(index, config, wikiPairs);
    },
    getLastRebuildMs: () => lastRebuildMs,
  };
}

module.exports = {
  DEFAULT_CONFIG,
  DEDUPE_EDGE_TYPES,
  MEMORY_CEILING_BYTES,
  mergeKeywordConfig,
  stripExcludedRegions,
  tokenize,
  extractTerms,
  buildInvertedIndex,
  updateIndexForFile,
  getMentionsForFile,
  generateKeywordEdges,
  wikiPairSetFromEdges,
  snippetAroundTerm,
  createKeywordIndexState,
};
