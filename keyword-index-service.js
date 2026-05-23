/**
 * Main-process keyword index — IPC-backed shared-term mentions.
 */
const { createKeywordIndexState, mergeKeywordConfig } = require("./lib/vault/keywordIndex.js");

/**
 * @param {{ readSettings?: () => string | null; writeSettings?: (json: string) => void }} deps
 */
function createKeywordIndexService(deps) {
  let state = createKeywordIndexState(loadConfigFromSettings(deps.readSettings?.()));
  let debounceTimer = null;
  /** @type {{ files: unknown[]; wikiEdges: unknown[] } | null} */
  let pendingSync = null;

  function loadConfigFromSettings(raw) {
    try {
      const all = raw ? JSON.parse(raw) : {};
      const kl = all?.keywordLinks;
      if (kl && typeof kl === "object") return mergeKeywordConfig(kl);
    } catch {
      /* ignore */
    }
    return mergeKeywordConfig();
  }

  function persistConfig(partial) {
    state.setConfig(partial);
    try {
      const raw = deps.readSettings?.();
      const all = raw ? JSON.parse(raw) : {};
      const { stopwordSet, stopwords, ...rest } = state.getConfig();
      all.keywordLinks = rest;
      deps.writeSettings?.(JSON.stringify(all, null, 2));
    } catch {
      /* ignore */
    }
  }

  function applySync(payload) {
    const files = Array.isArray(payload?.files) ? payload.files : [];
    const wikiEdges = Array.isArray(payload?.wikiEdges) ? payload.wikiEdges : [];
    const { ms, bytes } = state.rebuild(files, wikiEdges);
    console.info(`[keywordIndex] rebuild ${ms}ms (~${Math.round(bytes / 1024)} KB)`);
    return { ms, bytes, edgeCount: state.getKeywordEdges().length };
  }

  function scheduleSync(payload) {
    pendingSync = payload;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      if (pendingSync) {
        const p = pendingSync;
        pendingSync = null;
        applySync(p);
      }
    }, 500);
  }

  return {
    rebuild(payload) {
      return { ok: true, data: applySync(payload || {}) };
    },
    scheduleSync,
    getMentions(filePath) {
      try {
        const path = String(filePath || "").trim();
        if (!path) return { ok: false, message: "filePath required" };
        return { ok: true, data: state.getMentions(path) };
      } catch (e) {
        return { ok: false, message: e instanceof Error ? e.message : String(e) };
      }
    },
    getEdges() {
      try {
        return { ok: true, data: state.getKeywordEdges() };
      } catch (e) {
        return { ok: false, message: e instanceof Error ? e.message : String(e) };
      }
    },
    promoteEdgesToggle(enabled) {
      try {
        persistConfig({ promoteToEdges: Boolean(enabled) });
        return { ok: true, data: { edgeCount: state.getKeywordEdges().length } };
      } catch (e) {
        return { ok: false, message: e instanceof Error ? e.message : String(e) };
      }
    },
    updateConfig(partial) {
      try {
        persistConfig(partial);
        if (pendingSync) applySync(pendingSync);
        return { ok: true, data: state.getConfig() };
      } catch (e) {
        return { ok: false, message: e instanceof Error ? e.message : String(e) };
      }
    },
    getConfig() {
      return { ok: true, data: state.getConfig() };
    },
    reloadSettings() {
      state.setConfig(loadConfigFromSettings(deps.readSettings?.()));
    },
  };
}

module.exports = { createKeywordIndexService };
