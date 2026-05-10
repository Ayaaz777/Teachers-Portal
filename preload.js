const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("authApi", {
  hasAdmin: () => ipcRenderer.invoke("auth:has-admin"),
  allowedAdminEmail: () =>
    ipcRenderer.invoke("auth:allowed-admin-email"),
});

contextBridge.exposeInMainWorld("notionApi", {
  queryDatabase: (opts) =>
    ipcRenderer.invoke("notion:query-database", opts ?? {}),
  queryTeacherDatabases: (sources) =>
    ipcRenderer.invoke("notion:query-teacher-databases", sources),
  queryTeacherPaySlips: (payload) =>
    ipcRenderer.invoke("notion:query-teacher-payslips", payload),
  retrievePageTable: (payload) =>
    ipcRenderer.invoke("notion:retrieve-page-table", payload),
  updatePageDate: (payload) =>
    ipcRenderer.invoke("notion:update-page-date", payload ?? {}),
  updatePageNumber: (payload) =>
    ipcRenderer.invoke("notion:update-page-number", payload ?? {}),
});

contextBridge.exposeInMainWorld("payslipApi", {
  savePaySlipPdf: (payload) => ipcRenderer.invoke("payslip:save-pdf", payload),
});

contextBridge.exposeInMainWorld("shellApi", {
  openUserDataFolder: () => ipcRenderer.invoke("shell:open-user-data"),
  relaunchApp: () => ipcRenderer.invoke("app:relaunch"),
});

/** @type {import("@supabase/supabase-js").SupabaseClient | null} */
let supabaseClient = null;

/**
 * @returns {Promise<{ url: string; anonKey: string }>}
 */
async function loadPublicConfig() {
  const cfg = await ipcRenderer.invoke("config:get-supabase");
  return {
    url: typeof cfg?.url === "string" ? cfg.url : "",
    anonKey: typeof cfg?.anonKey === "string" ? cfg.anonKey : "",
  };
}

function resetSupabaseClient() {
  supabaseClient = null;
}

function loadCreateClient() {
  try {
    return require("@supabase/supabase-js").createClient;
  } catch (e) {
    console.error("teacherAuth: could not load @supabase/supabase-js", e);
    return null;
  }
}

/** `'1'` = keep session in localStorage; `'0'` = this browser session only (sessionStorage). */
const REMEMBER_ME_PREF_KEY = "recruit-auth-remember-me";

function rememberMePrefersPersistentSession() {
  try {
    return window.localStorage.getItem(REMEMBER_ME_PREF_KEY) !== "0";
  } catch {
    return true;
  }
}

function getAuthPersistenceStorage() {
  return rememberMePrefersPersistentSession()
    ? window.localStorage
    : window.sessionStorage;
}

function setStoredRememberPreference(remember) {
  try {
    window.localStorage.setItem(
      REMEMBER_ME_PREF_KEY,
      Boolean(remember) ? "1" : "0",
    );
  } catch {
    /* ignore */
  }
  resetSupabaseClient();
}

/**
 * @returns {Promise<import("@supabase/supabase-js").SupabaseClient | null>}
 */
async function ensureClient() {
  if (supabaseClient) {
    return supabaseClient;
  }
  const createClient = loadCreateClient();
  if (!createClient) {
    return null;
  }
  const { url, anonKey } = await loadPublicConfig();
  if (!url || !anonKey) {
    return null;
  }
  supabaseClient = createClient(url, anonKey, {
    auth: {
      flowType: "pkce",
      detectSessionInUrl: false,
      persistSession: true,
      autoRefreshToken: true,
      storage: getAuthPersistenceStorage(),
    },
  });
  return supabaseClient;
}

/**
 * @returns {Promise<{ user: { id: string; email: string; user_metadata: Record<string, unknown> } | null; error: string | null }>}
 */
async function getSessionUser() {
  try {
    const client = await ensureClient();
    if (!client) {
      return { user: null, error: "not_configured" };
    }
    const { data, error } = await client.auth.getSession();
    if (error) {
      return { user: null, error: error.message };
    }
    const u = data?.session?.user;
    if (!u) {
      return { user: null, error: null };
    }
    const meta =
      u.user_metadata && typeof u.user_metadata === "object"
        ? JSON.parse(JSON.stringify(u.user_metadata))
        : {};
    return {
      user: {
        id: u.id,
        email: typeof u.email === "string" ? u.email : "",
        user_metadata: meta,
      },
      error: null,
    };
  } catch (e) {
    return {
      user: null,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ error: string | null }>}
 */
async function signInWithEmail(email, password) {
  try {
    const client = await ensureClient();
    if (!client) {
      return { error: "Supabase is not configured." };
    }
    const { error } = await client.auth.signInWithPassword({
      email: String(email || "").trim(),
      password: String(password || ""),
    });
    return { error: error ? error.message : null };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ error: string | null; needsEmailConfirmation: boolean }>}
 */
async function signUpWithEmail(email, password) {
  try {
    const client = await ensureClient();
    if (!client) {
      return {
        error: "Supabase is not configured.",
        needsEmailConfirmation: false,
      };
    }
    const { data, error } = await client.auth.signUp({
      email: String(email || "").trim(),
      password: String(password || ""),
    });
    if (error) {
      return { error: error.message, needsEmailConfirmation: false };
    }
    if (data?.session) {
      return { error: null, needsEmailConfirmation: false };
    }
    if (data?.user) {
      return { error: null, needsEmailConfirmation: true };
    }
    return { error: null, needsEmailConfirmation: true };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : String(e),
      needsEmailConfirmation: false,
    };
  }
}

/**
 * @returns {Promise<{ error: string | null }>}
 */
async function signOutSupabase() {
  try {
    const client = await ensureClient();
    if (!client) {
      return { error: null };
    }
    const { error } = await client.auth.signOut();
    return { error: error ? error.message : null };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * @returns {Promise<
 *   | { kind: "not_configured" }
 *   | { kind: "auth_error"; message: string }
 *   | { kind: "not_signed_in" }
 *   | { kind: "ok"; email: string; user_metadata: Record<string, unknown>; row: Record<string, unknown> | null; rowError: string | null }
 * >}
 */
async function getTeacherProfileState() {
  const client = await ensureClient();
  if (!client) {
    return { kind: "not_configured" };
  }
  const { data, error } = await client.auth.getSession();
  if (error) {
    return { kind: "auth_error", message: error.message };
  }
  const sessionUser = data?.session?.user;
  if (!sessionUser) {
    return { kind: "not_signed_in" };
  }
  const meta =
    sessionUser.user_metadata &&
    typeof sessionUser.user_metadata === "object"
      ? JSON.parse(JSON.stringify(sessionUser.user_metadata))
      : {};
  const email =
    typeof sessionUser.email === "string" ? sessionUser.email : "";

  const { data: row, error: rowErr } = await client
    .from("teachers")
    .select("*")
    .eq("id", sessionUser.id)
    .maybeSingle();

  const safeRow = row
    ? JSON.parse(JSON.stringify(row))
    : null;

  return {
    kind: "ok",
    email,
    user_metadata: meta,
    row: safeRow,
    rowError: rowErr ? rowErr.message : null,
  };
}

/**
 * @param {{
 *   firstName: string;
 *   lastName: string;
 *   contactEmail?: string;
 *   phoneNumber?: string;
 *   bankDetails?: string;
 *   nationalId?: string;
 * }} payload
 * @returns {Promise<{ error: string | null }>}
 */
async function updateTeacherProfile(payload) {
  try {
    const client = await ensureClient();
    if (!client) {
      return { error: "Supabase is not configured." };
    }
    const { data: authData, error: authErr } = await client.auth.getSession();
    if (authErr) {
      return { error: authErr.message };
    }
    const u = authData?.session?.user;
    if (!u?.id) {
      return { error: "You are not signed in." };
    }
    const fn = String(payload?.firstName ?? "").trim();
    const ln = String(payload?.lastName ?? "").trim();
    const fullName =
      fn || ln ? `${fn} ${ln}`.trim() : null;
    const emailRaw =
      payload && "contactEmail" in payload
        ? String(payload.contactEmail ?? "").trim()
        : null;
    const phoneRaw =
      payload && "phoneNumber" in payload
        ? String(payload.phoneNumber ?? "").trim()
        : null;
    const bankRaw =
      payload && "bankDetails" in payload
        ? String(payload.bankDetails ?? "").trim()
        : null;
    const idRaw =
      payload && "nationalId" in payload
        ? String(payload.nationalId ?? "").trim()
        : null;
    /** @type {Record<string, string | null>} */
    const patch = {
      first_name: fn || null,
      last_name: ln || null,
      full_name: fullName,
    };
    if (emailRaw !== null) {
      patch.email = emailRaw || null;
    }
    if (phoneRaw !== null) {
      patch.phone_number = phoneRaw || null;
    }
    if (bankRaw !== null) {
      patch.bank_details = bankRaw || null;
    }
    if (idRaw !== null) {
      patch.national_id = idRaw || null;
    }
    const { error } = await client
      .from("teachers")
      .update(patch)
      .eq("id", u.id);
    return { error: error ? error.message : null };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

const AVATAR_ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const AVATAR_EXT = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * @param {{ data: ArrayBuffer; contentType: string }} payload
 * @returns {Promise<{ error: string | null }>}
 */
async function uploadTeacherAvatar(payload) {
  try {
    const client = await ensureClient();
    if (!client) {
      return { error: "Supabase is not configured." };
    }
    const { data: authData, error: authErr } = await client.auth.getSession();
    if (authErr) {
      return { error: authErr.message };
    }
    const u = authData?.session?.user;
    if (!u?.id) {
      return { error: "You are not signed in." };
    }
    const ct = String(payload?.contentType ?? "")
      .split(";")[0]
      .trim()
      .toLowerCase();
    if (!AVATAR_ALLOWED_TYPES.has(ct)) {
      return {
        error: "Use a JPEG, PNG, WebP, or GIF image.",
      };
    }
    const raw = payload?.data;
    if (!(raw instanceof ArrayBuffer) || raw.byteLength === 0) {
      return { error: "Invalid image data." };
    }
    const maxBytes = 5 * 1024 * 1024;
    if (raw.byteLength > maxBytes) {
      return { error: "Image must be 5 MB or smaller." };
    }
    const ext = AVATAR_EXT[ct] || "jpg";
    const path = `${u.id}/avatar.${ext}`;
    const body = new Uint8Array(raw);
    const { error: upErr } = await client.storage
      .from("teacher-avatars")
      .upload(path, body, {
        contentType: ct,
        upsert: true,
      });
    if (upErr) {
      return { error: upErr.message };
    }
    const { data: pub } = client.storage
      .from("teacher-avatars")
      .getPublicUrl(path);
    const publicUrl =
      pub && typeof pub.publicUrl === "string" ? pub.publicUrl : "";
    if (!publicUrl) {
      return { error: "Could not get public URL for the image." };
    }
    const { error: dbErr } = await client
      .from("teachers")
      .update({ avatar_url: publicUrl })
      .eq("id", u.id);
    return { error: dbErr ? dbErr.message : null };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * @returns {Promise<
 *   | { ok: true; teachers: Record<string, unknown>[]; error: null }
 *   | { ok: false; teachers: []; error: string }
 * >}
 */
async function listTeachersForAdmin() {
  try {
    const client = await ensureClient();
    if (!client) {
      return { ok: false, error: "Supabase is not configured.", teachers: [] };
    }
    const { data: authData, error: authErr } = await client.auth.getSession();
    if (authErr) {
      return { ok: false, error: authErr.message, teachers: [] };
    }
    if (!authData?.session?.user) {
      return { ok: false, error: "You are not signed in.", teachers: [] };
    }
    const { data, error } = await client
      .from("teachers")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      return { ok: false, error: error.message, teachers: [] };
    }
    const list = Array.isArray(data) ? data : [];
    const teachers = list.map((row) => JSON.parse(JSON.stringify(row)));
    return { ok: true, error: null, teachers };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
      teachers: [],
    };
  }
}

/**
 * @param {Record<string, unknown>} r
 * @returns {{ rowKey: string; givenName: string; familyName: string; notionRecordId: string } | null}
 */
function mapPayslipNotionLinkFromDbRow(r) {
  if (!r || typeof r !== "object") {
    return null;
  }
  const rowKey =
    typeof r.row_key === "string" ? r.row_key.trim() : String(r.row_key ?? "").trim();
  if (!rowKey) {
    return null;
  }
  return {
    rowKey,
    givenName:
      typeof r.given_name === "string"
        ? r.given_name
        : String(r.given_name ?? ""),
    familyName:
      typeof r.family_name === "string"
        ? r.family_name
        : String(r.family_name ?? ""),
    notionRecordId:
      typeof r.notion_record_id === "string"
        ? r.notion_record_id
        : String(r.notion_record_id ?? ""),
  };
}

/**
 * @returns {Promise<
 *   | { ok: true; rows: { rowKey: string; givenName: string; familyName: string; notionRecordId: string }[]; error: null }
 *   | { ok: false; rows: []; error: string }
 * >}
 */
async function fetchPayslipNotionPersonLinksForAdmin() {
  try {
    const client = await ensureClient();
    if (!client) {
      return { ok: false, error: "Supabase is not configured.", rows: [] };
    }
    const { data: authData, error: authErr } = await client.auth.getSession();
    if (authErr) {
      return { ok: false, error: authErr.message, rows: [] };
    }
    if (!authData?.session?.user) {
      return { ok: false, error: "You are not signed in.", rows: [] };
    }
    const { data, error } = await client
      .from("payslip_notion_person_links")
      .select("row_key, given_name, family_name, notion_record_id, sort_order")
      .order("sort_order", { ascending: true })
      .order("row_key", { ascending: true });
    if (error) {
      return { ok: false, error: error.message, rows: [] };
    }
    const list = Array.isArray(data) ? data : [];
    /** @type {{ rowKey: string; givenName: string; familyName: string; notionRecordId: string }[]} */
    const rows = [];
    for (const raw of list) {
      const q = mapPayslipNotionLinkFromDbRow(raw);
      if (q) {
        rows.push(q);
      }
    }
    return { ok: true, error: null, rows };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
      rows: [],
    };
  }
}

/**
 * Full replace: upserts all rows and deletes server rows missing from the payload.
 * @param {{ rowKey: string; givenName: string; familyName: string; notionRecordId: string }[]} rows
 * @returns {Promise<{ error: string | null }>}
 */
async function syncPayslipNotionPersonLinksForAdmin(rows) {
  try {
    const client = await ensureClient();
    if (!client) {
      return { error: "Supabase is not configured." };
    }
    const { data: authData, error: authErr } = await client.auth.getSession();
    if (authErr) {
      return { error: authErr.message };
    }
    if (!authData?.session?.user) {
      return { error: "You are not signed in." };
    }
    const arr = Array.isArray(rows) ? rows : [];
    const incomingKeys = new Set(
      arr.map((r) => String(r?.rowKey ?? "").trim()).filter(Boolean),
    );

    const { data: existing, error: exErr } = await client
      .from("payslip_notion_person_links")
      .select("row_key");
    if (exErr) {
      return { error: exErr.message };
    }
    for (const row of existing || []) {
      const k = typeof row?.row_key === "string" ? row.row_key.trim() : "";
      if (k && !incomingKeys.has(k)) {
        const { error: delErr } = await client
          .from("payslip_notion_person_links")
          .delete()
          .eq("row_key", k);
        if (delErr) {
          return { error: delErr.message };
        }
      }
    }

    if (arr.length === 0) {
      return { error: null };
    }
    const payload = arr.map((r, i) => ({
      row_key: String(r.rowKey ?? "").trim(),
      given_name: String(r.givenName ?? "").slice(0, 200),
      family_name: String(r.familyName ?? "").slice(0, 200),
      notion_record_id: String(r.notionRecordId ?? "").slice(0, 200),
      sort_order: i,
      updated_at: new Date().toISOString(),
    }));
    const { error: upErr } = await client
      .from("payslip_notion_person_links")
      .upsert(payload, { onConflict: "row_key" });
    return { error: upErr ? upErr.message : null };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * @returns {Promise<
 *   | { ok: true; state: Record<string, unknown>; error: null }
 *   | { ok: false; state: Record<string, unknown>; error: string }
 * >}
 */
async function fetchPayslipAppUserState() {
  try {
    const client = await ensureClient();
    if (!client) {
      return {
        ok: false,
        state: {},
        error: "Supabase is not configured.",
      };
    }
    const { data: authData, error: authErr } = await client.auth.getSession();
    if (authErr) {
      return { ok: false, state: {}, error: authErr.message };
    }
    const uid = authData?.session?.user?.id;
    if (!uid) {
      return { ok: false, state: {}, error: "You are not signed in." };
    }
    const { data, error } = await client
      .from("payslip_app_user_state")
      .select("state")
      .eq("user_id", uid)
      .maybeSingle();
    if (error) {
      return { ok: false, state: {}, error: error.message };
    }
    const s = data?.state;
    const state =
      s && typeof s === "object" && !Array.isArray(s)
        ? /** @type {Record<string, unknown>} */ (
            JSON.parse(JSON.stringify(s))
          )
        : {};
    return { ok: true, state, error: null };
  } catch (e) {
    return {
      ok: false,
      state: {},
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/** Same keys as `renderer.js` — nested maps keyed by workspace page id. */
const MIRROR_FLOATING_DRAFTS_KEY = "recruit-notion-workspace-page-floating-drafts-v1";
const MIRROR_CANVAS_DRAFTS_KEY = "recruit-notion-workspace-canvas-drafts-v1";

/**
 * @param {unknown} prev
 * @param {unknown} patchVal
 * @returns {Record<string, unknown>}
 */
function shallowMergePageKeyedBlob(prev, patchVal) {
  const a =
    prev && typeof prev === "object" && !Array.isArray(prev)
      ? /** @type {Record<string, unknown>} */ (prev)
      : {};
  const b =
    patchVal && typeof patchVal === "object" && !Array.isArray(patchVal)
      ? /** @type {Record<string, unknown>} */ (patchVal)
      : {};
  return { ...a, ...b };
}

/**
 * Shallow-merge `patch` into the signed-in user's `state` JSON (read-modify-write).
 * Per-page draft blobs are merged with existing server state so a partial patch cannot drop
 * another workspace page's databases (race / bug hardening).
 * @param {Record<string, unknown>} patch
 * @returns {Promise<{ error: string | null }>}
 */
async function mergePayslipAppUserState(patch) {
  try {
    const client = await ensureClient();
    if (!client) {
      return { error: "Supabase is not configured." };
    }
    const { data: authData, error: authErr } = await client.auth.getSession();
    if (authErr) {
      return { error: authErr.message };
    }
    const u = authData?.session?.user;
    if (!u?.id) {
      return { error: "You are not signed in." };
    }
    const p =
      patch && typeof patch === "object" && !Array.isArray(patch) ? patch : {};
    const { data: row, error: selErr } = await client
      .from("payslip_app_user_state")
      .select("state")
      .eq("user_id", u.id)
      .maybeSingle();
    if (selErr) {
      return { error: selErr.message };
    }
    const prevRaw = row?.state;
    const prev =
      prevRaw && typeof prevRaw === "object" && !Array.isArray(prevRaw)
        ? /** @type {Record<string, unknown>} */ (
            JSON.parse(JSON.stringify(prevRaw))
          )
        : {};
    const next = { ...prev };
    for (const [k, v] of Object.entries(p)) {
      if (v === null || v === undefined) {
        delete next[k];
      } else if (k === MIRROR_FLOATING_DRAFTS_KEY || k === MIRROR_CANVAS_DRAFTS_KEY) {
        next[k] = shallowMergePageKeyedBlob(prev[k], v);
      } else {
        next[k] = v;
      }
    }
    const { error: upErr } = await client.from("payslip_app_user_state").upsert(
      {
        user_id: u.id,
        state: next,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
    return { error: upErr ? upErr.message : null };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * @returns {Promise<
 *   | { ok: true; rows: Record<string, unknown>[]; error: null }
 *   | { ok: false; rows: []; error: string }
 * >}
 */
async function fetchPayslipWorkspaceDatabases() {
  try {
    const client = await ensureClient();
    if (!client) {
      return { ok: false, rows: [], error: "Supabase is not configured." };
    }
    const { data: authData, error: authErr } = await client.auth.getSession();
    if (authErr) {
      return { ok: false, rows: [], error: authErr.message };
    }
    const uid = authData?.session?.user?.id;
    if (!uid) {
      return { ok: false, rows: [], error: "You are not signed in." };
    }
    const { data, error } = await client
      .from("user_workspace_draft_databases")
      .select("workspace_page_id, replica_id, title, snapshot, updated_at")
      .eq("user_id", uid);
    if (error) {
      return { ok: false, rows: [], error: error.message };
    }
    const rows = Array.isArray(data) ? data : [];
    return { ok: true, rows, error: null };
  } catch (e) {
    return {
      ok: false,
      rows: [],
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * @param {{
 *   workspace_page_id: string;
 *   replica_id: string;
 *   title?: string;
 *   snapshot: Record<string, unknown>;
 * }} payload
 * @returns {Promise<{ error: string | null }>}
 */
async function upsertPayslipWorkspaceDatabase(payload) {
  try {
    const client = await ensureClient();
    if (!client) {
      return { error: "Supabase is not configured." };
    }
    const { data: authData, error: authErr } = await client.auth.getSession();
    if (authErr) {
      return { error: authErr.message };
    }
    const u = authData?.session?.user;
    if (!u?.id) {
      return { error: "You are not signed in." };
    }
    const wp = String(payload?.workspace_page_id ?? "").trim();
    const rid = String(payload?.replica_id ?? "").trim();
    if (!wp || !rid) {
      return { error: "workspace_page_id and replica_id are required." };
    }
    const title =
      typeof payload?.title === "string" ? payload.title.slice(0, 400) : "";
    const snap =
      payload?.snapshot && typeof payload.snapshot === "object" && !Array.isArray(payload.snapshot)
        ? payload.snapshot
        : {};
    const { error: upErr } = await client
      .from("user_workspace_draft_databases")
      .upsert(
        {
          user_id: u.id,
          workspace_page_id: wp,
          replica_id: rid,
          title,
          snapshot: snap,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,workspace_page_id,replica_id" },
      );
    return { error: upErr ? upErr.message : null };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * Heartbeat: marks the signed-in teacher as currently online.
 * Updates `teachers.last_seen_at = now()` for `auth.uid() = id` (RLS-safe).
 * @returns {Promise<{ ok: boolean; error: string | null; lastSeenAt: string | null }>}
 */
async function touchTeacherPresence() {
  try {
    const client = await ensureClient();
    if (!client) {
      return { ok: false, error: "Supabase is not configured.", lastSeenAt: null };
    }
    const { data: authData, error: authErr } = await client.auth.getSession();
    if (authErr) {
      return { ok: false, error: authErr.message, lastSeenAt: null };
    }
    const u = authData?.session?.user;
    if (!u?.id) {
      return { ok: false, error: "You are not signed in.", lastSeenAt: null };
    }
    const nowIso = new Date().toISOString();
    const { error } = await client
      .from("teachers")
      .update({ last_seen_at: nowIso })
      .eq("id", u.id);
    if (error) {
      return { ok: false, error: error.message, lastSeenAt: null };
    }
    return { ok: true, error: null, lastSeenAt: nowIso };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
      lastSeenAt: null,
    };
  }
}

contextBridge.exposeInMainWorld("teacherAuth", {
  loadPublicConfig,
  resetSupabaseClient,
  getRememberMePreference: rememberMePrefersPersistentSession,
  setRememberMePreference: setStoredRememberPreference,
  getSessionUser,
  signInWithEmail,
  signUpWithEmail,
  signOutSupabase,
  getTeacherProfileState,
  updateTeacherProfile,
  uploadTeacherAvatar,
  listTeachersForAdmin,
  touchTeacherPresence,
  fetchPayslipNotionPersonLinksForAdmin,
  syncPayslipNotionPersonLinksForAdmin,
  fetchPayslipAppUserState,
  mergePayslipAppUserState,
  fetchPayslipWorkspaceDatabases,
  upsertPayslipWorkspaceDatabase,
});
