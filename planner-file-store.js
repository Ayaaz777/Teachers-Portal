/**
 * File-backed planner storage under Electron userData/planner/[scope]/.
 * Replaces localStorage for calendar reminders, notes, to-dos, trash, and settings.
 */
const fs = require("fs");
const path = require("path");

/** @type {Record<string, string>} */
const FILE_NAMES = {
  events: "events.json",
  "day-pages": "day-pages.json",
  trash: "trash.json",
  deferrals: "deferrals.json",
  settings: "settings.json",
  meta: "meta.json",
};

/**
 * @param {string} raw
 * @returns {string}
 */
function sanitizePlannerScopeId(raw) {
  const s = String(raw ?? "").trim().toLowerCase();
  if (
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      s,
    )
  ) {
    return s;
  }
  return "";
}

/**
 * @param {string} userDataPath
 * @param {string} [scopeId] Auth user id (teachers.id) — omit for legacy root planner/
 */
function createPlannerFileStore(userDataPath, scopeId) {
  const scope = sanitizePlannerScopeId(scopeId);
  const dir = scope
    ? path.join(userDataPath, "planner", scope)
    : path.join(userDataPath, "planner");

  function ensureDir() {
    fs.mkdirSync(dir, { recursive: true });
  }

  /**
   * @param {string} key
   */
  function resolvePath(key) {
    const name = FILE_NAMES[key] || `${key}.json`;
    return path.join(dir, name);
  }

  function isInitialized() {
    return fs.existsSync(resolvePath("meta"));
  }

  /**
   * @param {string} key
   * @returns {string | null}
   */
  function read(key) {
    ensureDir();
    const p = resolvePath(key);
    if (!fs.existsSync(p)) {
      return null;
    }
    try {
      return fs.readFileSync(p, "utf8");
    } catch {
      return null;
    }
  }

  /**
   * @param {string} key
   * @param {string} content
   */
  function write(key, content) {
    ensureDir();
    const p = resolvePath(key);
    const tmp = `${p}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, content, "utf8");
    fs.renameSync(tmp, p);
  }

  /**
   * @param {Record<string, unknown>} meta
   */
  function markInitialized(meta) {
    write(
      "meta",
      JSON.stringify(
        {
          version: 1,
          at: new Date().toISOString(),
          ...meta,
        },
        null,
        2,
      ),
    );
  }

  function storageInfo() {
    ensureDir();
    /** @type {Record<string, number>} */
    const files = {};
    let totalBytes = 0;
    for (const key of Object.keys(FILE_NAMES)) {
      const p = resolvePath(key);
      if (!fs.existsSync(p)) continue;
      try {
        const size = fs.statSync(p).size;
        files[key] = size;
        totalBytes += size;
      } catch {
        /* ignore */
      }
    }
    return { dir, scope: scope || null, totalBytes, files };
  }

  return {
    dir,
    scope: scope || null,
    read,
    write,
    isInitialized,
    markInitialized,
    storageInfo,
  };
}

/**
 * Copy planner JSON files from one store directory to another (first-time migration).
 * @param {ReturnType<typeof createPlannerFileStore>} fromStore
 * @param {ReturnType<typeof createPlannerFileStore>} toStore
 * @param {Record<string, unknown>} [meta]
 * @returns {boolean}
 */
function migratePlannerStore(fromStore, toStore, meta) {
  if (toStore.isInitialized()) {
    return false;
  }
  if (!fromStore.isInitialized()) {
    return false;
  }
  for (const key of Object.keys(FILE_NAMES)) {
    if (key === "meta") {
      continue;
    }
    const content = fromStore.read(key);
    if (typeof content === "string" && content.length) {
      toStore.write(key, content);
    }
  }
  toStore.markInitialized({
    ...(meta && typeof meta === "object" ? meta : {}),
    migratedFrom: fromStore.dir,
  });
  return true;
}

module.exports = {
  createPlannerFileStore,
  migratePlannerStore,
  sanitizePlannerScopeId,
  PLANNER_FILE_KEYS: Object.keys(FILE_NAMES),
};
