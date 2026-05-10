const { app, BrowserWindow, ipcMain, shell, dialog } = require("electron");
const path = require("path");
const fs = require("fs");

/** Injected on window close as a best-effort sync persist. */
const RENDERER_FLUSH_FLOATING_DRAFTS_JS =
  "(function(){try{if(typeof window.__persistFloatingReplicasNow==='function')window.__persistFloatingReplicasNow();}catch(e){console.error('[persist drafts]',e);}})();";

function loadDotenv() {
  const dotenv = require("dotenv");
  /** Later paths win. Exe dir first, then userData, so AppData edits override install folder. */
  const paths = app.isPackaged
    ? [
        path.join(path.dirname(process.execPath), ".env"),
        path.join(app.getPath("userData"), ".env"),
      ]
    : [path.join(__dirname, ".env")];

  for (const envPath of paths) {
    if (!fs.existsSync(envPath)) {
      continue;
    }
    let raw = fs.readFileSync(envPath, "utf8");
    if (raw.charCodeAt(0) === 0xfeff) {
      raw = raw.slice(1);
    }
    const parsed = dotenv.parse(raw);
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "string") {
        const v = value.trim();
        if (v === "") {
          continue;
        }
        process.env[key] = v;
      } else if (value != null) {
        const s = String(value).trim();
        if (s === "") {
          continue;
        }
        process.env[key] = s;
      }
    }
  }

  if (app.isPackaged) {
    applyBundledNotionDefaults(dotenv);
  }
}

function seedPackagedEnvTemplate(userDataPath) {
  if (!app.isPackaged) {
    return;
  }
  const userEnv = path.join(userDataPath, ".env");
  if (fs.existsSync(userEnv)) {
    return;
  }
  const examplePath = path.join(process.resourcesPath, ".env.example");
  if (!fs.existsSync(examplePath)) {
    return;
  }
  try {
    fs.mkdirSync(userDataPath, { recursive: true });
    fs.copyFileSync(examplePath, userEnv);
  } catch {
    /* ignore */
  }
}

function notionMissingTokenMessage() {
  if (!app.isPackaged) {
    return `Missing NOTION_TOKEN. Save a .env file next to the app project:\n${path.join(__dirname, ".env")}\n(See .env.example.)`;
  }
  const ud = path.join(app.getPath("userData"), ".env");
  const nextToExe = path.join(path.dirname(process.execPath), ".env");
  return (
    "Missing NOTION_TOKEN. Add your Notion secret to a file named .env in one of these places:\n\n" +
    `• ${ud}\n` +
    `• ${nextToExe}\n\n` +
    "Tip: open that .env file in Notepad (or use the button below), paste NOTION_TOKEN= and your database IDs from your dev machine's .env, save, then click Refresh from Notion again."
  );
}

const { pagesToTable, normalizePageId } = require("./notion-simplify");
const { buildPaySlipPdfBuffer } = require("./payslip-pdf");
const {
  hasAdmin,
  ALLOWED_ADMIN_EMAIL,
} = require("./auth-store");

let mainWindow = null;

const NOTION_VERSION = "2026-03-11";

function normalizeNotionToken(raw) {
  if (!raw || typeof raw !== "string") {
    return "";
  }
  let t = raw.trim();
  if (
    (t.startsWith('"') && t.endsWith('"')) ||
    (t.startsWith("'") && t.endsWith("'"))
  ) {
    t = t.slice(1, -1).trim();
  }
  const lower = t.toLowerCase();
  if (lower.startsWith("bearer ")) {
    t = t.slice(7).trim();
  }
  return t;
}

function normalizeDatabaseId(raw) {
  if (!raw) {
    return "";
  }
  const s = String(raw).trim();
  const hex = s.replace(/-/g, "");
  if (hex.length !== 32) {
    return s;
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Accepts plain UUID or Notion collection URL id: collection://uuid */
function normalizeDataSourceId(raw) {
  if (!raw) {
    return "";
  }
  let s = String(raw).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  if (s.toLowerCase().startsWith("collection://")) {
    s = s.slice("collection://".length).trim();
  }
  return normalizeDatabaseId(s);
}

/**
 * Packaged apps read NOTION_TOKEN from .env files; NOTION_DATABASE_ID comes from
 * the shipped resources/.env.example so new installers match the build (stale
 * %APPDATA% seeds no longer pin an old database). Set NOTION_SKIP_BUNDLED_DATABASE_ID=1
 * in .env to use only file-based NOTION_DATABASE_ID.
 */
function applyBundledNotionDefaults(dotenv) {
  if (process.env.NOTION_SKIP_BUNDLED_DATABASE_ID === "1") {
    return;
  }
  const examplePath = path.join(process.resourcesPath, ".env.example");
  if (!fs.existsSync(examplePath)) {
    return;
  }
  let raw = fs.readFileSync(examplePath, "utf8");
  if (raw.charCodeAt(0) === 0xfeff) {
    raw = raw.slice(1);
  }
  const parsed = dotenv.parse(raw);
  const candidate = parsed.NOTION_DATABASE_ID;
  if (candidate == null || String(candidate).trim() === "") {
    return;
  }
  const id = normalizeDatabaseId(String(candidate).trim());
  if (id) {
    process.env.NOTION_DATABASE_ID = id;
  }
}

function notionHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
  };
}

function notionReadHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
  };
}

/**
 * @param {string} token
 * @param {string} databaseId
 * @param {string} [explicitFallbackDs] optional data source id (e.g. from Supabase per-teacher) before env fallback
 */
async function resolveDataSourceId(token, databaseId, explicitFallbackDs) {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}`,
    {
      method: "GET",
      headers: notionReadHeaders(token),
    },
  );
  const bodyText = await res.text();
  if (!res.ok) {
    const err = new Error(
      `Could not load database metadata (${res.status}): ${bodyText}. Check NOTION_DATABASE_ID and that the integration can access this database.`,
    );
    err.code = "API";
    throw err;
  }
  const data = JSON.parse(bodyText);
  const sources = data.data_sources;
  if (!Array.isArray(sources) || sources.length === 0) {
    const fromExplicit = normalizeDataSourceId(explicitFallbackDs);
    if (fromExplicit) {
      return fromExplicit;
    }
    const fromEnv = normalizeDataSourceId(process.env.NOTION_DATA_SOURCE_ID);
    if (fromEnv) {
      return fromEnv;
    }
    const err = new Error(
      "This database has no data_sources in the API response. For wiki databases, set NOTION_DATA_SOURCE_ID in .env to the data source UUID (from the database URL or Notion devtools).",
    );
    err.code = "CONFIG";
    throw err;
  }
  return sources[0].id;
}

/** Notion caps page_size at 100; data source query supports up to ~10k rows via pagination. */
const NOTION_QUERY_PAGE_SIZE = 100;
const NOTION_QUERY_MAX_ROWS = 10_000;

/** @param {unknown} r */
function isDataSourceQueryPageRow(r) {
  if (!r || typeof r !== "object") {
    return false;
  }
  const o = /** @type {{ object?: string; properties?: unknown }} */ (r);
  if (o.object === "data_source") {
    return false;
  }
  if (o.object === "page") {
    return true;
  }
  return (
    o.properties != null &&
    typeof o.properties === "object" &&
    !Array.isArray(o.properties)
  );
}

/**
 * @param {string} token
 * @param {string} dataSourceId
 * @returns {Promise<object[]>}
 */
async function queryDataSourceAllPages(token, dataSourceId) {
  const allPages = [];
  /** @type {string | undefined} */
  let startCursor;
  let hasMore = true;
  let iterations = 0;

  while (hasMore && allPages.length < NOTION_QUERY_MAX_ROWS) {
    iterations += 1;
    if (iterations > 200) {
      break;
    }
    const body = {
      page_size: NOTION_QUERY_PAGE_SIZE,
      /** Wiki DBs can return child data_source rows; pay slip rows are always pages. */
      result_type: "page",
    };
    if (startCursor) {
      body.start_cursor = startCursor;
    }

    const res = await fetch(
      `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
      {
        method: "POST",
        headers: notionHeaders(token),
        body: JSON.stringify(body),
      },
    );

    const bodyText = await res.text();
    if (!res.ok) {
      let message = `Notion API ${res.status}: ${bodyText}`;
      if (res.status === 401) {
        message +=
          "\n\nFix checklist:\n" +
          "• Use an Internal integration: https://www.notion.so/my-integrations → New integration → type Internal. Copy the full secret (one line, no spaces).\n" +
          "• If the integration is Public (OAuth), the \"client secret\" is not the API key — this app expects the internal secret only, unless you add OAuth.\n" +
          "• After pasting, save .env and restart the app. Try \"Refresh secret\" in Notion if this key was ever shared.";
      }
      const err = new Error(message);
      err.code = "API";
      throw err;
    }

    const data = JSON.parse(bodyText);
    const results = Array.isArray(data.results) ? data.results : [];
    for (const r of results) {
      if (isDataSourceQueryPageRow(r)) {
        allPages.push(r);
      }
    }

    hasMore = Boolean(data.has_more);
    startCursor =
      typeof data.next_cursor === "string" && data.next_cursor.trim()
        ? data.next_cursor.trim()
        : undefined;
    if (!hasMore || !startCursor) {
      break;
    }
  }

  return allPages;
}

/**
 * Resolve token + primary data source id (same rules as table load).
 * @param {{ databaseId?: string; dataSourceId?: string }} [opts]
 * @returns {Promise<{ token: string; dataSourceId: string }>}
 */
async function resolveNotionTokenAndDataSourceId(opts = {}) {
  const token = normalizeNotionToken(process.env.NOTION_TOKEN);
  const optDb = normalizeDatabaseId(opts.databaseId);
  const optDs = normalizeDataSourceId(opts.dataSourceId);
  const envDb = normalizeDatabaseId(process.env.NOTION_DATABASE_ID);
  const envDs = normalizeDataSourceId(process.env.NOTION_DATA_SOURCE_ID);

  if (!token) {
    const err = new Error(notionMissingTokenMessage());
    err.code = "CONFIG";
    throw err;
  }

  /** @type {string} */
  let dataSourceId = "";

  if (optDb) {
    dataSourceId = await resolveDataSourceId(token, optDb, optDs);
  } else if (optDs) {
    dataSourceId = optDs;
  } else if (envDb) {
    dataSourceId = await resolveDataSourceId(token, envDb, envDs);
  } else if (envDs) {
    dataSourceId = envDs;
  } else {
    const err = new Error(
      "Set NOTION_DATABASE_ID (database page URL id) and/or NOTION_DATA_SOURCE_ID. The app uses API 2026-03-11: it queries POST /v1/data_sources/{id}/query (legacy /databases/.../query is not valid on this version).",
    );
    err.code = "CONFIG";
    throw err;
  }

  return { token, dataSourceId };
}

/**
 * @param {unknown} properties properties object from GET /pages/{id}
 * @returns {string} Plain text title (Notion databases have exactly one title property).
 */
function plainTitleFromNotionPageProperties(properties) {
  if (!properties || typeof properties !== "object") {
    return "";
  }
  for (const key of Object.keys(properties)) {
    const p = /** @type {{ type?: string; title?: { plain_text?: string }[] }} */ (
      properties[key]
    );
    if (p && p.type === "title" && Array.isArray(p.title)) {
      return p.title.map((t) => t.plain_text || "").join("").trim();
    }
  }
  return "";
}

/**
 * Relation fields on query responses only expose `{ id }`. Fetch linked pages once
 * so sheets show titles (e.g. School Name → related school DB row name), not UUIDs.
 * Mutates relation items with `display_name` when resolvable.
 * @param {string} token
 * @param {object[]} pages
 */
async function enrichRelationTitlesOnPages(token, pages) {
  if (!pages.length) {
    return;
  }

  /** @type {Set<string>} */
  const ids = new Set();

  for (const page of pages) {
    if (!page || typeof page !== "object") {
      continue;
    }
    const props =
      /** @type {{ properties?: Record<string, unknown> }} */ (page)
        .properties;
    if (!props || typeof props !== "object") {
      continue;
    }
    for (const raw of Object.values(props)) {
      const prop =
        /** @type {{ type?: string; relation?: Array<{ id?: string }> }} */ (
          raw
        );
      if (!prop || prop.type !== "relation" || !Array.isArray(prop.relation)) {
        continue;
      }
      for (const r of prop.relation) {
        if (r && typeof r.id === "string") {
          const id = normalizePageId(r.id.trim());
          if (id) {
            ids.add(id);
          }
        }
      }
    }
  }

  if (!ids.size) {
    return;
  }

  const list = [...ids];
  /** @type {Map<string, string>} */
  const idToTitle = new Map();

  const CHUNK = 6;
  for (let i = 0; i < list.length; i += CHUNK) {
    const chunk = list.slice(i, i + CHUNK);
    await Promise.all(
      chunk.map(async (id) => {
        try {
          const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
            method: "GET",
            headers: notionReadHeaders(token),
          });
          const text = await res.text();
          if (!res.ok) {
            return;
          }
          const data = /** @type {{ properties?: unknown }} */ (JSON.parse(text));
          const title = plainTitleFromNotionPageProperties(data.properties);
          if (title) {
            idToTitle.set(id, title);
          }
        } catch {
          /* ignore */
        }
      }),
    );
    if (i + CHUNK < list.length) {
      await new Promise((r) => setTimeout(r, 40));
    }
  }

  for (const page of pages) {
    if (!page || typeof page !== "object") {
      continue;
    }
    const props =
      /** @type {{ properties?: Record<string, unknown> }} */ (page)
        .properties;
    if (!props || typeof props !== "object") {
      continue;
    }
    for (const raw of Object.values(props)) {
      const prop =
        /** @type {{ type?: string; relation?: Array<{ id?: string }> }} */ (
          raw
        );
      if (!prop || prop.type !== "relation" || !Array.isArray(prop.relation)) {
        continue;
      }
      prop.relation = prop.relation.map((r) => {
        if (!r || typeof r !== "object" || typeof r.id !== "string") {
          return r;
        }
        const nid = normalizePageId(r.id.trim());
        const name = idToTitle.get(nid);
        if (typeof name === "string" && name.trim()) {
          return {
            ...r,
            display_name: name.trim(),
          };
        }
        return r;
      });
    }
  }
}

function notionNormalizeComparableTitle(t) {
  return String(t ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * GET /v1/databases/{id}
 * @param {string} token
 * @param {string} databaseIdNormalized
 */
async function notionGetDatabase(token, databaseIdNormalized) {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${databaseIdNormalized}`,
    {
      method: "GET",
      headers: notionReadHeaders(token),
    },
  );
  const bodyText = await res.text();
  if (!res.ok) {
    const err = new Error(
      `Could not retrieve Notion database (${res.status}): ${bodyText}`,
    );
    err.code = "API";
    throw err;
  }
  return JSON.parse(bodyText);
}

/** @param {Record<string, unknown>} dbJson */
function notionPrimaryDataSourceIdFromDbJson(dbJson) {
  const sources = dbJson?.data_sources;
  if (!Array.isArray(sources) || !sources.length) {
    return "";
  }
  const id0 =
    typeof sources[0] === "object" && sources[0] !== null
      ? /** @type {{ id?: string }} */ (sources[0]).id
      : undefined;
  return typeof id0 === "string" ? normalizeDataSourceId(id0.trim()) : "";
}

/** Merge root + first data_sources entry property maps (/wiki DB schemas differ). */
function notionMergedDatabaseSchemaProperties(databaseJson) {
  /** @type {Record<string, unknown>} */
  const merged = {};
  const top = databaseJson?.properties;
  if (top && typeof top === "object" && !Array.isArray(top)) {
    Object.assign(merged, top);
  }
  const dsArr = databaseJson?.data_sources;
  const ds0 =
    Array.isArray(dsArr) && dsArr.length > 0 && typeof dsArr[0] === "object"
      ? dsArr[0]
      : null;
  const nested =
    ds0 &&
    ds0.properties &&
    typeof ds0.properties === "object" &&
    !Array.isArray(ds0.properties)
      ? ds0.properties
      : null;
  if (nested) {
    for (const [k, v] of Object.entries(nested)) {
      if (!(k in merged)) {
        merged[k] = v;
      }
    }
  }
  return merged;
}

/**
 * True when retrieve page rejects because UUID is actually a database.
 * @param {number} status
 * @param {string} detail
 */
function retrievedPageIndicatesDatabaseNotPage(status, detail) {
  if (status !== 400) {
    return false;
  }
  const t = detail.toLowerCase();
  return (
    t.includes("is a database") ||
    (t.includes("database") &&
      (t.includes("not a page") ||
        /\bprovided id\b.*\bdatabase\b/.test(detail.toLowerCase())))
  );
}

/**
 * Fetch every row from a database by id (same pipeline as main sheet refresh).
 * @param {string} token
 * @param {string} dbIdNormalized
 * @returns {Promise<{ columns: string[]; rows: string[][]; pageIds: string[] }>}
 */
async function retrieveNotionFullDatabaseAsTable(token, dbIdNormalized) {
  const dbJson = await notionGetDatabase(token, dbIdNormalized);
  let dataSourceId = notionPrimaryDataSourceIdFromDbJson(dbJson);
  if (!dataSourceId) {
    dataSourceId = await resolveDataSourceId(token, dbIdNormalized, undefined);
  }
  const pages = await queryDataSourceAllPages(token, dataSourceId);
  await enrichRelationTitlesOnPages(token, pages);
  const table = pagesToTable(pages);

  if (table.columns.length > 0 || table.rows.length > 0) {
    return table;
  }

  const schemaCols = Object.keys(notionMergedDatabaseSchemaProperties(dbJson))
    .filter((name) => name && String(name).trim())
    .sort((a, b) => a.localeCompare(b));

  if (!schemaCols.length) {
    const err = new Error(
      "That Notion database returned no rows and no column definitions to display.",
    );
    err.code = "API";
    throw err;
  }

  return { columns: schemaCols, rows: [], pageIds: [] };
}

/**
 * Fetch a single database row by page UUID and return columns/rows/pageIds (same shape as query).
 * If the id is actually a database, loads the entire database into columns/rows/pageIds (up to sync limits).
 * @param {string} token
 * @param {string} pageIdRaw
 * @param {{ rowTitleHint?: string }} [options] Forward-compatibility; reserved for IPC.
 */
async function retrieveNotionPageAsTable(token, pageIdRaw, _options = {}) {
  void _options;

  const id = normalizePageId(pageIdRaw);
  if (!id) {
    const err = new Error("Missing or invalid Notion page id.");
    err.code = "BAD_INPUT";
    throw err;
  }

  const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: "GET",
    headers: notionReadHeaders(token),
  });
  const bodyText = await res.text();
  if (!res.ok) {
    let detail = bodyText;
    try {
      const j = JSON.parse(bodyText);
      if (typeof j.message === "string") {
        detail = j.message;
      }
    } catch {
      /* keep */
    }

    const looksLikeDb = retrievedPageIndicatesDatabaseNotPage(res.status, detail);

    if (looksLikeDb) {
      const dbId = normalizeDatabaseId(pageIdRaw) || normalizeDatabaseId(id);
      if (dbId) {
        try {
          return await retrieveNotionFullDatabaseAsTable(token, dbId);
        } catch (e2) {
          if (
            e2 instanceof Error &&
            typeof e2 === "object" &&
            "code" in e2 &&
            (e2.code === "BAD_INPUT" || e2.code === "API")
          ) {
            throw e2;
          }
          const msg = e2 instanceof Error ? e2.message : String(e2);
          const err = new Error(
            `${detail} — Full database fetch failed: ${msg}`,
          );
          err.code = "API";
          throw err;
        }
      }
    }

    const err = new Error(`Could not read Notion page (${res.status}): ${detail}`);
    err.code = "API";
    throw err;
  }

  const page = JSON.parse(bodyText);
  if (
    page &&
    typeof page === "object" &&
    page.object === "page" &&
    page.properties &&
    typeof page.properties === "object"
  ) {
    await enrichRelationTitlesOnPages(token, [/** @type {object} */ (page)]);
  }

  return pagesToTable([/** @type {object} */ (page)]);
}

/**
 * @param {{ databaseId?: string; dataSourceId?: string }} [opts]
 */
async function queryNotionTableForSource(opts = {}) {
  const { token, dataSourceId } = await resolveNotionTokenAndDataSourceId(opts);
  const pages = await queryDataSourceAllPages(token, dataSourceId);
  await enrichRelationTitlesOnPages(token, pages);
  return pagesToTable(pages);
}

async function queryNotionDatabase() {
  return queryNotionTableForSource({});
}

/**
 * PATCH a database page date property by exact Notion column name (must match a `date`-type column).
 * @param {string} token
 * @param {string} pageIdRaw
 * @param {string} propertyName
 * @param {string | null} ymd `'YYYY-MM-DD'` or empty/null to clear
 */
async function patchNotionPageDateProperty(
  token,
  pageIdRaw,
  propertyName,
  ymd,
) {
  const id = normalizePageId(pageIdRaw);
  if (!id) {
    const err = new Error("Missing or invalid Notion page id.");
    err.code = "BAD_INPUT";
    throw err;
  }
  const prop = String(propertyName ?? "").trim();
  if (!prop) {
    const err = new Error("Missing property name.");
    err.code = "BAD_INPUT";
    throw err;
  }

  /** @type {Record<string, unknown>} */
  const properties = {};

  const clear =
    ymd === null ||
    String(ymd ?? "")
      .trim() === "";

  properties[prop] = clear
    ? { date: null }
    : { date: { start: String(ymd).trim() } };

  const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: "PATCH",
    headers: notionHeaders(token),
    body: JSON.stringify({ properties }),
  });

  const bodyText = await res.text();
  if (!res.ok) {
    let detail = bodyText;
    try {
      const j = JSON.parse(bodyText);
      if (typeof j.message === "string") {
        detail = j.message;
      }
    } catch {
      /* keep bodyText */
    }
    const err = new Error(
      `Could not update Notion (${res.status}): ${detail}`,
    );
    err.code = "API";
    throw err;
  }
}

/**
 * PATCH a database page number property by exact Notion column name (must match a `number`-type column).
 * @param {string} token
 * @param {string} pageIdRaw
 * @param {string} propertyName
 * @param {number | null} value Use `null` to clear
 */
async function patchNotionPageNumberProperty(
  token,
  pageIdRaw,
  propertyName,
  value,
) {
  const id = normalizePageId(pageIdRaw);
  if (!id) {
    const err = new Error("Missing or invalid Notion page id.");
    err.code = "BAD_INPUT";
    throw err;
  }
  const prop = String(propertyName ?? "").trim();
  if (!prop) {
    const err = new Error("Missing property name.");
    err.code = "BAD_INPUT";
    throw err;
  }

  const clear =
    value === null ||
    (typeof value === "number" && !Number.isFinite(value));

  /** @type {Record<string, unknown>} */
  const properties = {};
  properties[prop] = clear ? { number: null } : { number: value };

  const res = await fetch(`https://api.notion.com/v1/pages/${id}`, {
    method: "PATCH",
    headers: notionHeaders(token),
    body: JSON.stringify({ properties }),
  });

  const bodyText = await res.text();
  if (!res.ok) {
    let detail = bodyText;
    try {
      const j = JSON.parse(bodyText);
      if (typeof j.message === "string") {
        detail = j.message;
      }
    } catch {
      /* keep bodyText */
    }
    const err = new Error(
      `Could not update Notion (${res.status}): ${detail}`,
    );
    err.code = "API";
    throw err;
  }
}

function normalizeEmailForPayslip(s) {
  let e = String(s || "")
    .trim()
    .toLowerCase()
    .replace(/^mailto:/i, "");
  if (e.endsWith("@googlemail.com")) {
    const local = e.slice(0, -"@googlemail.com".length);
    e = `${local}@gmail.com`;
  }
  return e;
}

/**
 * Pull every plausible email from a cell (handles "Name <x@y.com>", extra text, multiple addresses).
 * @param {unknown} raw
 * @returns {string[]}
 */
function extractEmailsFromCell(raw) {
  const s = String(raw ?? "");
  const set = new Set();
  const add = (v) => {
    const n = normalizeEmailForPayslip(v);
    if (n) {
      set.add(n);
    }
  };
  add(s);
  for (const part of s.split(/[\s,;|]+/)) {
    add(part);
  }
  const re = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
  let m;
  while ((m = re.exec(s)) !== null) {
    add(m[0]);
  }
  return [...set];
}

function cellMatchesTeacherEmail(cellValue, want) {
  if (!want) {
    return false;
  }
  const inCell = extractEmailsFromCell(cellValue);
  return inCell.includes(want);
}

/**
 * @param {string[]} columns
 * @returns {number[]}
 */
function findPayslipEmailColumnIndices(columns) {
  const indices = [];
  columns.forEach((c, i) => {
    const s = String(c).trim();
    if (!s) {
      return;
    }
    if (/^e-?mails?$/i.test(s)) {
      indices.push(i);
      return;
    }
    if (/\b(e-?mails?|email\s+address)\b/i.test(s)) {
      indices.push(i);
      return;
    }
    if (/\be\s*mail\b/i.test(s)) {
      indices.push(i);
      return;
    }
    if (/\bemail\b/i.test(s)) {
      indices.push(i);
      return;
    }
    if (/\b(e-?mail|electronic\s+mail)\b/i.test(s)) {
      indices.push(i);
      return;
    }
    if (
      /\b(teacher|contact|work|staff|payee|pay\s*roll|payroll)\b/i.test(s) &&
      /\b(e-?mail|email)\b/i.test(s)
    ) {
      indices.push(i);
    }
  });
  return indices;
}

/**
 * @param {{ columns: string[]; rows: string[][]; pageIds: string[] }} table
 * @param {string} teacherEmail
 */
function filterPayslipsForTeacher(table, teacherEmail) {
  const want = normalizeEmailForPayslip(teacherEmail);
  if (!want) {
    return {
      columns: table.columns || [],
      rows: [],
      pageIds: [],
      noEmailColumn: false,
    };
  }
  const cols = table.columns || [];
  const indices = findPayslipEmailColumnIndices(cols);
  const rows = [];
  const pageIds = [];
  const tableRows = table.rows || [];
  const tablePageIds = table.pageIds || [];
  tableRows.forEach((row, i) => {
    if (!row || !row.length) {
      return;
    }
    const match = row.some((cell) => cellMatchesTeacherEmail(cell, want));
    if (match) {
      rows.push(row);
      pageIds.push(tablePageIds[i] || "");
    }
  });
  return {
    columns: cols,
    rows,
    pageIds,
    noEmailColumn: indices.length === 0 && rows.length === 0,
  };
}

function sanitizePaySlipFileStem(title) {
  const base = String(title || "Pay slip")
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  return base || "Pay slip";
}

function focusMainWindow() {
  const w =
    BrowserWindow.getFocusedWindow() ||
    mainWindow ||
    BrowserWindow.getAllWindows()[0];
  if (w && !w.isDestroyed()) {
    if (w.isMinimized()) {
      w.restore();
    }
    w.focus();
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 800,
    show: false,
    fullscreenable: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow = win;

  win.once("ready-to-show", () => {
    try {
      win.setFullScreen(true);
    } catch {
      /* ignore */
    }
    win.show();
  });

  let lifecyclePersistCloseHandled = false;
  win.on("close", (e) => {
    if (lifecyclePersistCloseHandled) {
      return;
    }
    e.preventDefault();
    lifecyclePersistCloseHandled = true;
    void (async () => {
      try {
        if (!win.webContents.isDestroyed()) {
          await win.webContents.executeJavaScript(
            RENDERER_FLUSH_FLOATING_DRAFTS_JS,
            true,
          );
        }
      } catch {
        /* WebContents may refuse during teardown */
      }
      try {
        if (!win.isDestroyed()) {
          win.destroy();
        }
      } catch {
        /* ignore */
      }
    })();
  });

  win.on("closed", () => {
    if (mainWindow === win) {
      mainWindow = null;
    }
  });

  win.loadFile(path.join(__dirname, "index.html"));
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    focusMainWindow();
  });

  app.whenReady().then(() => {
    const userDataPath = app.getPath("userData");
    seedPackagedEnvTemplate(userDataPath);
    loadDotenv();

    ipcMain.handle("auth:has-admin", () => hasAdmin(userDataPath));
    ipcMain.handle("auth:allowed-admin-email", () => ({
      email: ALLOWED_ADMIN_EMAIL,
    }));
    ipcMain.handle("notion:query-database", async (_evt, opts) => {
      try {
        loadDotenv();
        const o =
          opts && typeof opts === "object" && !Array.isArray(opts) ? opts : {};
        const table = await queryNotionTableForSource(o);
        return { ok: true, ...table };
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        const code = e instanceof Error && "code" in e ? e.code : "UNKNOWN";
        return { ok: false, code, message };
      }
    });

    ipcMain.handle("notion:retrieve-page-table", async (_evt, rawPayload) => {
      try {
        loadDotenv();
        const token = normalizeNotionToken(process.env.NOTION_TOKEN);
        if (!token) {
          return {
            ok: false,
            code: "CONFIG",
            message: notionMissingTokenMessage(),
            columns: [],
            rows: [],
            pageIds: [],
          };
        }
        let pageIdRaw = "";
        let rowTitleHint = "";
        if (typeof rawPayload === "string") {
          pageIdRaw = rawPayload;
        } else if (
          rawPayload &&
          typeof rawPayload === "object" &&
          !Array.isArray(rawPayload)
        ) {
          const o = rawPayload;
          pageIdRaw =
            typeof o.pageId === "string"
              ? o.pageId.trim()
              : typeof o.id === "string"
                ? o.id.trim()
                : "";
          rowTitleHint =
            typeof o.rowTitleHint === "string" ? o.rowTitleHint.trim() : "";
        }
        const table = await retrieveNotionPageAsTable(token, pageIdRaw, {
          rowTitleHint,
        });
        return { ok: true, ...table };
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        const code = e instanceof Error && "code" in e ? e.code : "UNKNOWN";
        return {
          ok: false,
          code,
          message,
          columns: [],
          rows: [],
          pageIds: [],
        };
      }
    });

    ipcMain.handle("notion:update-page-date", async (_evt, payload) => {
      try {
        loadDotenv();
        const token = normalizeNotionToken(process.env.NOTION_TOKEN);
        if (!token) {
          return { ok: false, message: notionMissingTokenMessage() };
        }
        const p =
          payload && typeof payload === "object" && !Array.isArray(payload)
            ? payload
            : {};
        const pageId =
          typeof p.pageId === "string"
            ? p.pageId.trim()
            : "";
        const propertyName =
          typeof p.propertyName === "string"
            ? p.propertyName.trim()
            : "";
        const rawYmd =
          typeof p.ymd === "string"
            ? p.ymd.trim()
            : p.ymd == null ? null : "";

        await patchNotionPageDateProperty(
          token,
          pageId,
          propertyName,
          rawYmd == null ? null : rawYmd,
        );

        return { ok: true };
      } catch (e) {
        const message =
          e instanceof Error ? e.message : String(e);
        return { ok: false, message };
      }
    });

    ipcMain.handle("notion:update-page-number", async (_evt, payload) => {
      try {
        loadDotenv();
        const token = normalizeNotionToken(process.env.NOTION_TOKEN);
        if (!token) {
          return { ok: false, message: notionMissingTokenMessage() };
        }
        const p =
          payload && typeof payload === "object" && !Array.isArray(payload)
            ? payload
            : {};
        const pageId =
          typeof p.pageId === "string"
            ? p.pageId.trim()
            : "";
        const propertyName =
          typeof p.propertyName === "string"
            ? p.propertyName.trim()
            : "";
        const rawNum = p.number;

        let num = null;
        if (rawNum === null || rawNum === undefined || rawNum === "") {
          num = null;
        } else if (typeof rawNum === "number" && Number.isFinite(rawNum)) {
          num = rawNum;
        } else if (typeof rawNum === "string" && rawNum.trim() !== "") {
          const parsed = Number.parseFloat(rawNum.trim());
          num = Number.isFinite(parsed) ? parsed : NaN;
        } else {
          num = NaN;
        }

        if (num !== null && Number.isNaN(num)) {
          return { ok: false, message: "Invalid number." };
        }

        await patchNotionPageNumberProperty(
          token,
          pageId,
          propertyName,
          num,
        );

        return { ok: true };
      } catch (e) {
        const message =
          e instanceof Error ? e.message : String(e);
        return { ok: false, message };
      }
    });

    ipcMain.handle("notion:query-teacher-databases", async (_evt, sources) => {
      try {
        loadDotenv();
        const list = Array.isArray(sources) ? sources : [];
        const sections = await Promise.all(
          list.map(async (s) => {
            const key = String(s?.key ?? "");
            const label = String(s?.label ?? (key || "Teacher"));
            const databaseId =
              typeof s?.databaseId === "string" ? s.databaseId : "";
            const dataSourceId =
              typeof s?.dataSourceId === "string" ? s.dataSourceId : "";
            try {
              const table = await queryNotionTableForSource({
                databaseId,
                dataSourceId,
              });
              return {
                key,
                label,
                ok: true,
                message: "",
                databaseId,
                dataSourceId,
                ...table,
              };
            } catch (e) {
              const message = e instanceof Error ? e.message : String(e);
              return {
                key,
                label,
                ok: false,
                message,
                databaseId,
                dataSourceId,
                columns: [],
                rows: [],
                pageIds: [],
              };
            }
          }),
        );
        return { ok: true, sections };
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        const code = e instanceof Error && "code" in e ? e.code : "UNKNOWN";
        return { ok: false, code, message, sections: [] };
      }
    });

    ipcMain.handle("notion:query-teacher-payslips", async (_evt, payload) => {
      try {
        loadDotenv();
        let email = "";
        let databaseId = "";
        let dataSourceId = "";
        if (
          payload &&
          typeof payload === "object" &&
          !Array.isArray(payload)
        ) {
          email =
            typeof payload.email === "string" ? payload.email.trim() : "";
          databaseId =
            typeof payload.databaseId === "string"
              ? payload.databaseId.trim()
              : "";
          dataSourceId =
            typeof payload.dataSourceId === "string"
              ? payload.dataSourceId.trim()
              : "";
        } else if (typeof payload === "string") {
          email = payload.trim();
        }

        const hasDedicatedSource =
          normalizeDatabaseId(databaseId) || normalizeDataSourceId(dataSourceId);

        if (hasDedicatedSource) {
          const table = await queryNotionTableForSource({
            databaseId,
            dataSourceId,
          });
          return { ok: true, ...table, noEmailColumn: false };
        }

        const table = await queryNotionDatabase();
        const filtered = filterPayslipsForTeacher(table, email);
        return { ok: true, ...filtered };
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        const code = e instanceof Error && "code" in e ? e.code : "UNKNOWN";
        return {
          ok: false,
          code,
          message,
          columns: [],
          rows: [],
          pageIds: [],
          noEmailColumn: false,
        };
      }
    });

    ipcMain.handle("payslip:save-pdf", async (_evt, payload) => {
      try {
        const title =
          payload && payload.title != null ? String(payload.title) : "Pay slip";
        const columns = Array.isArray(payload?.columns) ? payload.columns : [];
        const row = Array.isArray(payload?.row) ? payload.row : [];
        const buf = buildPaySlipPdfBuffer({ title, columns, row });
        const win = BrowserWindow.getFocusedWindow() || mainWindow;
        const stem = sanitizePaySlipFileStem(title);
        const { canceled, filePath } = await dialog.showSaveDialog(win, {
          title: "Save pay slip as PDF",
          defaultPath: path.join(app.getPath("documents"), `${stem}.pdf`),
          filters: [{ name: "PDF", extensions: ["pdf"] }],
        });
        if (canceled || !filePath) {
          return { ok: false, canceled: true };
        }
        fs.writeFileSync(filePath, buf);
        return { ok: true, path: filePath };
      } catch (e) {
        return {
          ok: false,
          message: e instanceof Error ? e.message : String(e),
        };
      }
    });

    ipcMain.handle("shell:open-user-data", () => {
      shell.openPath(app.getPath("userData"));
      return { ok: true };
    });

    ipcMain.handle("app:relaunch", () => {
      app.relaunch();
      app.exit(0);
    });

    ipcMain.handle("config:get-supabase", () => {
      loadDotenv();
      const url = process.env.SUPABASE_URL;
      const anonKey = process.env.SUPABASE_ANON_KEY;
      const trimmedUrl = typeof url === "string" ? url.trim() : "";
      const trimmedKey = typeof anonKey === "string" ? anonKey.trim() : "";
      return {
        url: trimmedUrl,
        anonKey: trimmedKey,
      };
    });

    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}
