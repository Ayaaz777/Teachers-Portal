const statusEl = document.getElementById("status");
const statusActionsEl = document.getElementById("statusActions");
const openConfigFolderBtn = document.getElementById("openConfigFolderBtn");
const theadEl = document.getElementById("thead");
const tbodyEl = document.getElementById("tbody");
const tableEl = document.getElementById("dataTable");
const refreshBtn = document.getElementById("refreshBtn");
const notionDetailsEl = document.getElementById("notionDetails");
const teacherViewTabsEl = document.getElementById("teacherViewTabs");
const themeToggleEl = document.getElementById("themeToggle");
const themeIconEl = themeToggleEl?.querySelector(".theme-toggle-icon");
const rowDetailOverlayEl = document.getElementById("rowDetailOverlay");
const rowDetailCloseEl = document.getElementById("rowDetailClose");
const rowDetailDownloadPdfEl = document.getElementById("rowDetailDownloadPdf");
const rowDetailTitleEl = document.getElementById("rowDetailTitle");
const rowDetailDlEl = document.getElementById("rowDetailDl");
const rowDetailTeacherViewEl = document.getElementById("rowDetailTeacherView");
const rowDetailPanelEl = document.getElementById("rowDetailPanel");
const rowDetailScrollEl = document.getElementById("rowDetailScroll");
const tableSheetFooterEl = document.getElementById("tableSheetFooter");
const tableLoadHintEl = document.getElementById("tableLoadHint");
const tableToolbarEl = document.getElementById("tableToolbar");
const tableScrollEl = document.getElementById("tableScroll");
const filterToggleEl = document.getElementById("filterToggle");
const tableFiltersEl = document.getElementById("tableFilters");
const filterSchoolGroupEl = document.getElementById("filterSchoolGroup");
const filterDateGroupEl = document.getElementById("filterDateGroup");
const filterSortGroupEl = document.getElementById("filterSortGroup");
const filterSchoolEl = document.getElementById("filterSchool");
const filterDateEl = document.getElementById("filterDate");
const filterSortEl = document.getElementById("filterSort");
const filterClearEl = document.getElementById("filterClear");
const showAllColumnsBtn = document.getElementById("showAllColumnsBtn");
const homeContentEl = document.getElementById("homeContent");
const canvasContextMenuEl = document.getElementById("canvasContextMenu");
const canvasCreateDbTableBtn = document.getElementById(
  "canvasCreateDbTableBtn",
);
const canvasDraftTablesEl = document.getElementById("canvasDraftTables");
/** All workspace editor panes (Pay slips, blank pages, Trash). */
const notionWsPanesRootEl = document.getElementById("notionWsPanes");
const payslipNotionLinksSectionEl = document.getElementById(
  "payslipNotionLinksSection",
);
const payslipNotionLinksTbodyEl = document.getElementById(
  "payslipNotionLinksTbody",
);
const payslipNotionLinksAddRowBtn = document.getElementById(
  "payslipNotionLinksAddRow",
);
const payslipNotionRestrictSheetMappedEl =
  document.querySelector("#payslipNotionRestrictSheetMapped");
const notionWorkspaceEl = document.getElementById("notionWorkspace");
const notionWorkspacePageListEl = document.getElementById(
  "notionWorkspacePageList",
);
const notionWorkspaceNewPageBtn = document.getElementById(
  "notionWorkspaceNewPage",
);
const notionWsPaneTrashEl = document.getElementById("notionWsPaneTrash");
const notionTrashListMountEl = document.getElementById("notionTrashListMount");
const notionEditorSidebarEl = document.getElementById("notionEditorSidebar");
const toggleEditorSidebarBtn = document.getElementById(
  "toggleEditorSidebarBtn",
);
const notionWsBlankPanesMountEl = document.getElementById(
  "notionWsBlankPanesMount",
);
const notionWsPanePaySlipsEl = document.getElementById(
  "notionWsPanePaySlips",
);
const notionWsPaneVaultEl = document.getElementById("notionWsPaneVault");
const notionWsPaneVaultNotionLinksEl = document.getElementById(
  "notionWsPaneVaultNotionLinks",
);
const vaultContentEl = document.getElementById("vaultContent");
const columnMenuEl = document.getElementById("columnMenu");
const columnMenuHideBtn = document.getElementById("columnMenuHide");
const columnMenuRemoveColumnBtn = document.getElementById(
  "columnMenuRemoveColumn",
);
const authGateEl = document.getElementById("authGate");
const appMainEl = document.getElementById("appMain");
const authSupabaseHintEl = document.getElementById("authSupabaseHint");
const authErrorEl = document.getElementById("authError");
const logoutBtn = document.getElementById("logoutBtn");
const navMenuBtn = document.getElementById("navMenuBtn");
const navMenuPanel = document.getElementById("navMenuPanel");
const navMenuBackdrop = document.getElementById("navMenuBackdrop");
const pageHomeEl = document.getElementById("pageHome");
const pageTeachersEl = document.getElementById("pageTeachers");
const pageTeacherDashboardEl = document.getElementById(
  "pageTeacherDashboard",
);
const pageTeacherPaySlipsEl = document.getElementById("pageTeacherPaySlips");
const pageTeachersPaySlipsHubEl = document.getElementById(
  "pageTeachersPaySlipsHub",
);
const teachersPaySlipsHubTitle = document.getElementById(
  "teachersPaySlipsHubTitle",
);
const navGoHome = document.getElementById("navGoHome");
const navOpenWorkspaceDashboard = document.getElementById(
  "navOpenWorkspaceDashboard",
);
const navGoTeachers = document.getElementById("navGoTeachers");
const navTeacherDashboardRefreshGroup = document.getElementById(
  "navTeacherDashboardRefreshGroup",
);
const navTeacherDashboardRefreshBtn = document.getElementById(
  "navTeacherDashboardRefreshBtn",
);
const navRestartAppBtn = document.getElementById("navRestartAppBtn");
const cloudSaveOverlay = document.getElementById("cloudSaveOverlay");
const cloudSaveOverlayMessage = document.getElementById(
  "cloudSaveOverlayMessage",
);
const navAdminHomeGroup = document.getElementById("navAdminHomeGroup");
const navTeacherPortalGroup = document.getElementById("navTeacherPortalGroup");
const navTeacherGoDashboard = document.getElementById("navTeacherGoDashboard");
const navTeacherGoProfile = document.getElementById("navTeacherGoProfile");
const navTeacherGoPaySlips = document.getElementById("navTeacherGoPaySlips");
const navRoleLabel = document.getElementById("navRoleLabel");
const authForm = document.getElementById("authForm");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authPasswordConfirm = document.getElementById("authPasswordConfirm");
const authConfirmWrap = document.getElementById("authConfirmWrap");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authToggleRegister = document.getElementById("authToggleRegister");
const authRememberMe = document.getElementById("authRememberMe");
const authThemeToggle = document.getElementById("authThemeToggle");
const teacherProfileAvatar = document.getElementById("teacherProfileAvatar");
const teacherProfileName = document.getElementById("teacherProfileName");
const teacherProfileDl = document.getElementById("teacherProfileDl");
const teacherProfileError = document.getElementById("teacherProfileError");
const teacherProfileForm = document.getElementById("teacherProfileForm");
const teacherFirstName = document.getElementById("teacherFirstName");
const teacherLastName = document.getElementById("teacherLastName");
const teacherContactEmail = document.getElementById("teacherContactEmail");
const teacherPhoneNumber = document.getElementById("teacherPhoneNumber");
const teacherBankDetails = document.getElementById("teacherBankDetails");
const teacherNationalId = document.getElementById("teacherNationalId");
const teacherAvatarFile = document.getElementById("teacherAvatarFile");
const teacherProfileSaveBtn = document.getElementById("teacherProfileSaveBtn");
const teacherProfileFormMessage = document.getElementById(
  "teacherProfileFormMessage",
);
const adminTeachersPanel = document.getElementById("adminTeachersPanel");
const teacherOwnProfileWrap = document.getElementById("teacherOwnProfileWrap");
const teacherProfileNotionDotBtn = document.getElementById(
  "teacherProfileNotionDotBtn",
);
const teacherProfileNotionReveal = document.getElementById(
  "teacherProfileNotionReveal",
);
const teacherProfileNotionRevealDl = document.getElementById(
  "teacherProfileNotionRevealDl",
);
const adminTeachersError = document.getElementById("adminTeachersError");
const adminTeachersLoading = document.getElementById("adminTeachersLoading");
const adminTeachersTableWrap = document.getElementById("adminTeachersTableWrap");
const adminTeachersTbody = document.getElementById("adminTeachersTbody");
const adminTeachersEmpty = document.getElementById("adminTeachersEmpty");
const adminTeachersCount = document.getElementById("adminTeachersCount");
const adminTeachersRefreshBtn = document.getElementById(
  "adminTeachersRefreshBtn",
);
const teacherPaySlipsSection = document.getElementById("teacherPaySlipsSection");
const teacherPaySlipsHint = document.getElementById("teacherPaySlipsHint");
const teacherPaySlipsError = document.getElementById("teacherPaySlipsError");
const teacherPaySlipsLoading = document.getElementById("teacherPaySlipsLoading");
const teacherPaySlipsTableWrap = document.getElementById(
  "teacherPaySlipsTableWrap",
);
const teacherPaySlipsTbody = document.getElementById("teacherPaySlipsTbody");
const teacherDashboardLoading = document.getElementById(
  "teacherDashboardLoading",
);
const teacherDashboardError = document.getElementById("teacherDashboardError");
const teacherDashboardHint = document.getElementById("teacherDashboardHint");
const teacherDashboardGridWrap = document.getElementById(
  "teacherDashboardGridWrap",
);
const teacherDashboardNetChartWrap = document.getElementById(
  "teacherDashboardNetChartWrap",
);
const teacherDashboardChartCard = document.getElementById(
  "teacherDashboardChartCard",
);
const teacherDashNetDonutSvg = document.getElementById(
  "teacherDashNetDonutSvg",
);
const teacherDashNetDonutLegend = document.getElementById(
  "teacherDashNetDonutLegend",
);
const teacherDashNetDonutEmpty = document.getElementById(
  "teacherDashNetDonutEmpty",
);
const teacherDashNetDonutBody = document.getElementById(
  "teacherDashNetDonutBody",
);
const teacherDashDonutCenterMain = document.getElementById(
  "teacherDashDonutCenterMain",
);
const teacherNetChartSummaryRowEl = document.getElementById(
  "teacherNetChartSummaryRow",
);
const teacherNetChartPayPeriodRangeEl = document.getElementById(
  "teacherNetChartPayPeriodRange",
);
const teacherNetChartPaySlipCountEl = document.getElementById(
  "teacherNetChartPaySlipCount",
);
const teacherDashStatus = document.getElementById("teacherDashStatus");
const teacherDashLastUpdated = document.getElementById(
  "teacherDashLastUpdated",
);
const teacherDashDataSyncNote = document.getElementById(
  "teacherDashDataSyncNote",
);
const teacherDashFees = document.getElementById("teacherDashFees");
const teacherDashExchangeAmount = document.getElementById(
  "teacherDashExchangeAmount",
);

/**
 * Cached teacher pay-slip table (session); cleared on sign-out.
 * @type {{
 *   columns: string[];
 *   rows: string[][];
 *   pageIds: string[];
 *   fetchedAt: number;
 *   notionDatabaseId: string;
 *   notionDataSourceId: string;
 * } | null}
 */
let teacherPaySlipCache = null;

/** @type {string | null} */
let teacherAvatarPreviewObjectUrl = null;

/** When true, Home / Notion is hidden (teacher signed in via Supabase). */
let isTeacherNavMode = false;

/** Heartbeat that marks the signed-in teacher as currently online (admin presence dot). */
const TEACHER_PRESENCE_HEARTBEAT_MS = 45 * 1000;
/** Online window used by the admin Teachers list (matches heartbeat + grace). */
const TEACHER_PRESENCE_ONLINE_WINDOW_MS = 90 * 1000;
/** @type {number} */
let teacherPresenceTimerId = 0;
let teacherPresenceListenersBound = false;
let teacherPresenceTickInFlight = false;

async function teacherPresenceTickOnce() {
  if (
    !isTeacherNavMode ||
    teacherPresenceTickInFlight ||
    typeof window.teacherAuth?.touchTeacherPresence !== "function"
  ) {
    return;
  }
  teacherPresenceTickInFlight = true;
  try {
    await window.teacherAuth.touchTeacherPresence();
  } catch (e) {
    console.warn("teacher presence heartbeat:", e);
  } finally {
    teacherPresenceTickInFlight = false;
  }
}

function teacherPresenceVisibilityListener() {
  if (document.visibilityState === "visible") {
    void teacherPresenceTickOnce();
  }
}

function teacherPresenceFocusListener() {
  void teacherPresenceTickOnce();
}

function startTeacherPresenceHeartbeat() {
  if (!isTeacherNavMode) {
    return;
  }
  if (teacherPresenceTimerId !== 0) {
    return;
  }
  void teacherPresenceTickOnce();
  teacherPresenceTimerId = window.setInterval(
    () => void teacherPresenceTickOnce(),
    TEACHER_PRESENCE_HEARTBEAT_MS,
  );
  if (!teacherPresenceListenersBound) {
    document.addEventListener("visibilitychange", teacherPresenceVisibilityListener);
    window.addEventListener("focus", teacherPresenceFocusListener);
    teacherPresenceListenersBound = true;
  }
}

function stopTeacherPresenceHeartbeat() {
  if (teacherPresenceTimerId !== 0) {
    window.clearInterval(teacherPresenceTimerId);
    teacherPresenceTimerId = 0;
  }
  if (teacherPresenceListenersBound) {
    document.removeEventListener("visibilitychange", teacherPresenceVisibilityListener);
    window.removeEventListener("focus", teacherPresenceFocusListener);
    teacherPresenceListenersBound = false;
  }
}

/** Sign-in card: false = Sign in, true = Create account */
let authRegisterMode = false;

const THEME_KEY = "recruit-my-english-theme";
const HIDDEN_COLS_KEY = "recruit-my-english-hidden-columns";
const COLUMN_ORDER_KEY = "recruit-my-english-column-order";
const COLUMN_WIDTHS_KEY = "recruit-my-english-column-widths";
const APP_NAV_PAGE_KEY = "recruit-app-nav-page";
/** Persisted removals: stripped on every reload; cleared only by editing storage or reinstall — not within this UI. */
const DROPPED_COLS_KEY = "recruit-my-english-dropped-columns";
/** Local map: person display name → Notion database row (page) id for pay slips. */
const PAYSLIP_NOTION_LINK_ROWS_KEY = "recruit-payslip-notion-person-links-v1";
/** When `"1"`, notional sheet hides rows unless `rawTable.pageIds[i]` maps to IDs in payslip notion links table. */
const PAYSLIP_NOTION_RESTRICT_MAPPED_KEY =
  "recruit-payslip-sheet-restrict-by-mapped-ids-v1";

/** Saved only when Remember me is on */
const AUTH_REMEMBER_EMAIL_KEY = "recruit-auth-saved-email";
const AUTH_REMEMBER_PASSWORD_KEY = "recruit-auth-saved-password";
/** Must match {@link REMEMBER_ME_PREF_KEY} in preload.js */
const AUTH_REMEMBER_SESSION_KEY = "recruit-auth-remember-me";
const NAV_MENU_OPEN_CLASS = "nav-menu-open";

/**
 * Same rule as preload `rememberMePrefersPersistentSession`: localStorage key
 * not exactly `'0'` means remember is on (missing key defaults to on).
 * @returns {boolean}
 */
function rememberMeEnabledInStorage() {
  try {
    return window.localStorage.getItem(AUTH_REMEMBER_SESSION_KEY) !== "0";
  } catch {
    return true;
  }
}

function clearSavedAuthCredentialsFromStorage() {
  try {
    window.localStorage.removeItem(AUTH_REMEMBER_EMAIL_KEY);
    window.localStorage.removeItem(AUTH_REMEMBER_PASSWORD_KEY);
  } catch {
    /* ignore */
  }
}

/** @returns {boolean} */
function applyRememberedCredentialsToForm() {
  if (!rememberMeEnabledInStorage()) {
    clearSavedAuthCredentialsFromStorage();
    if (authEmail) {
      authEmail.value = "";
    }
    if (authPassword) {
      authPassword.value = "";
    }
    if (authPasswordConfirm) {
      authPasswordConfirm.value = "";
    }
    return;
  }
  try {
    const em = window.localStorage.getItem(AUTH_REMEMBER_EMAIL_KEY);
    const pw = window.localStorage.getItem(AUTH_REMEMBER_PASSWORD_KEY);
    if (authEmail && em !== null && em !== "") {
      authEmail.value = em;
    }
    if (authPassword != null && pw !== null) {
      authPassword.value = pw;
    }
  } catch {
    /* ignore */
  }
}

function persistAuthCredentialsIfRememberOn(emailRaw, passwordRaw) {
  if (!rememberMeEnabledInStorage()) {
    clearSavedAuthCredentialsFromStorage();
    return;
  }
  const email = String(emailRaw ?? "").trim();
  const password = String(passwordRaw ?? "");
  try {
    window.localStorage.setItem(AUTH_REMEMBER_EMAIL_KEY, email);
    window.localStorage.setItem(AUTH_REMEMBER_PASSWORD_KEY, password);
  } catch {
    /* ignore */
  }
}

/** Notion-style column header glyphs (decorative) */
const HEADER_ICONS = ["\u25C9", "\u2261", "@", "#", "\u2211", "\u25C7"];

/** DataTransfer type for reordering sheet columns via header drag-and-drop */
const COLUMN_DRAG_MIME = "application/x-recruit-col-index";

/** Column drag payloads for floating pay-slip replicas only (`${replicaId}|${logicalColIdx}`). */
const REPLICA_COLUMN_DRAG_MIME = "application/x-recruit-float-replica-col";

/**
 * Moves the column at `fromIdx` so it sits immediately before `toIdx`.
 * Indices refer to positions in {@link rawTable} before the move.
 * @param {number} fromIdx
 * @param {number} toIdx
 */
function reorderRawTableColumnBefore(fromIdx, toIdx) {
  const cols = rawTable.columns;
  const n = cols.length;
  if (n === 0 || fromIdx === toIdx) {
    return;
  }
  if (fromIdx < 0 || fromIdx >= n || toIdx < 0 || toIdx > n) {
    return;
  }
  if (toIdx === n) {
    toIdx = n - 1;
  }
  const insertAt = fromIdx < toIdx ? toIdx - 1 : toIdx;
  if (insertAt === fromIdx) {
    return;
  }
  const [name] = cols.splice(fromIdx, 1);
  cols.splice(insertAt, 0, name);
  for (const row of rawTable.rows) {
    if (!Array.isArray(row) || row.length < n) {
      continue;
    }
    const [cell] = row.splice(fromIdx, 1);
    row.splice(insertAt, 0, cell);
  }
  saveColumnOrderPreference(rawTable.columns.slice());
  closeColumnMenu();
  applyFiltersAndRender();
}

function clearColumnDragHighlight() {
  /** @type {HTMLElement[]} */
  const roots = [];
  for (const table of dataSheetTableRoots()) {
    roots.push(table);
  }
  if (notionWsPanesRootEl) {
    for (const wrap of notionWsPanesRootEl.querySelectorAll(
      ".floating-draft-datasheets-mount",
    )) {
      for (const table of wrap.querySelectorAll("table.data-sheet")) {
        if (table instanceof HTMLTableElement) {
          roots.push(table);
        }
      }
    }
  }
  for (const table of roots) {
    const head = table.tHead;
    if (!head) {
      continue;
    }
    head.querySelectorAll(".th-dragging").forEach((el) =>
      el.classList.remove("th-dragging"),
    );
    head.querySelectorAll(".th-drop-target").forEach((el) =>
      el.classList.remove("th-drop-target"),
    );
  }
}

document.addEventListener("dragend", clearColumnDragHighlight);

/** Notion page id when overlay is open (used to refresh after data reload). */
let overlayOpenPageId = null;

/** @type {{ title: string; columns: string[]; row: string[] } | null} */
let overlayDetailSnapshot = null;

/** Full dataset from Notion (before filters). */
let rawTable = { columns: [], rows: [], pageIds: [] };

/**
 * Pay slips pane — person ↔ Notion row/page id mappings (persisted locally).
 * @typedef {{ rowKey: string; givenName: string; familyName: string; notionRecordId: string }} PayslipNotionLinkRow
 */

/** @type {PayslipNotionLinkRow[]} */
let payslipNotionLinkRows = [];

let payslipNotionLinksDirtyTimer = 0;
let payslipNotionLinksChromeBound = false;

/**
 * Floating pay-slip sheet replica (toolbar + `#dataTable` chrome, local-only rows).
 * @typedef {{
 *   id: string;
 *   workspacePageId: string;
 *   root: HTMLElement;
 *   barTitleEl: HTMLElement;
 *   notionLinkCheckEl: HTMLElement;
 *   tableToolbarEl: HTMLElement;
 *   filterToggleEl: HTMLButtonElement;
 *   filterPanelEl: HTMLElement;
 *   filterSchoolGroupEl: HTMLElement;
 *   filterDateGroupEl: HTMLElement;
 *   filterSortGroupEl: HTMLElement;
 *   filterSchoolEl: HTMLSelectElement;
 *   filterDateEl: HTMLInputElement;
 *   filterSortEl: HTMLSelectElement;
 *   filterClearEl: HTMLButtonElement;
 *   refreshFakeEl: HTMLButtonElement;
 *   showAllColumnsBtn: HTMLButtonElement;
 *   sqlSaveBtn: HTMLButtonElement;
 *   schoolTabsEl: HTMLElement | null;
 *   scrollEl: HTMLElement;
 *   tableEl: HTMLTableElement;
 *   theadEl: HTMLTableSectionElement;
 *   tbodyEl: HTMLTableSectionElement;
 *   footerEl: HTMLElement;
 *   footerHintEl: HTMLElement;
 *   filterPanelExpanded: boolean;
 *   shadow: {
 *     columns: string[];
 *     columnKinds: Array<
 *       | "text"
 *       | "number"
 *       | "status"
 *       | "multi"
 *       | "date"
 *       | "money"
 *       | "email"
 *       | "checkbox"
 *     >;
 *     rows: string[][];
 *     pageIds: string[];
 *     hiddenNames: Set<string>;
 *     colWidths: Map<string, number>;
 *     rowCreatedMs: Array<number>;
 *     rowEditedMs: Array<number>;
 *     omitSysCreated: boolean;
 *     omitSysEdited: boolean;
 *     linkedNotionPageId: string;
 *   };
 * }} FloatingPaySlipReplica
 */

/** Increments per floating pay-slip–styled empty sheet (`#dataTable` look) on any app page. */
let floatingDraftPaySlipSheetUid = 0;

/**
 * Floating full pay-slip replicas (local data keyed by synthetic id).
 * @type {Map<string, FloatingPaySlipReplica>}
 */
const paySlipFloatingReplicas = new Map();

/**
 * Workspace pages where it is safe to persist an empty snapshot (cleared DBs) or overwrite
 * storage: user opened the page, we hydrated replicas from cloud/local storage, or a new DB was
 * registered. Without this, a flush right after cold start could treat in-memory replicas as empty
 * and skip writes incorrectly; with hydration marking, every page that had saved drafts is trusted
 * after `ensureFloatingDraftsHydratedForWorkspacePage` runs.
 * @type {Set<string>}
 */
const floatingDraftWorkspacePageUserActivated = new Set();

/**
 * Keys `workspacePageKey::replicaId` present in `user_workspace_draft_databases` (save icon green).
 * @type {Set<string>}
 */
const userWorkspaceDraftSqlReplicaKeys = new Set();

const FLOATING_DB_PERSIST_DEBOUNCE_MS = 380;
/** @type {Partial<Record<string, number>>} */
const floatingDraftPersistTimers = {};
/** Debounced saves for blank workspace page title + rich body (workspace list in Supabase). */
/** @type {Partial<Record<string, number>>} */
const blankWorkspacePersistTimers = {};
let suppressFloatingReplicaPersistWrites = false;
/** Skips canvas HTML persist while hydrating from app state mirror. */
let suppressCanvasDraftPersistWrites = false;
/** @type {number} */
let canvasDraftPersistTimer = 0;

/** Increments per locally created database view on the pay canvas. */
let canvasDraftTableUid = 0;

const CANVAS_LOCAL_DB_ROOT_CLASS = "canvas-local-database-root";

/** Check icon next to draft DB title; green only when `linkedNotionPageId` is set (Notion row linked). */
const LINKED_DB_CHECK_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>';

/** Save-to-SQL toolbar icon (disk) — matches stroke style of other filter-toggle icons. */
const FLOATING_REPLICA_SAVE_SQL_SVG =
  '<svg class="filter-toggle-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />' +
  '<polyline points="17 21 17 13 7 13 7 21" />' +
  '<polyline points="7 3 7 8 15 8" />' +
  "</svg>";

const WORKSPACE_PAGES_KEY = "recruit-notion-workspace-pages-v2";
const WORKSPACE_ACTIVE_PAGE_KEY = "recruit-notion-workspace-active-v2";
const WORKSPACE_TRASH_KEY = "recruit-notion-workspace-trash-v1";
const WORKSPACE_FLOATING_DRAFTS_KEY =
  "recruit-notion-workspace-page-floating-drafts-v1";
/** Dashboard canvas local DB blocks (`#canvasDraftTables`) keyed by workspace page id. */
const WORKSPACE_CANVAS_DRAFTS_KEY =
  "recruit-notion-workspace-canvas-drafts-v1";
const WORKSPACE_BLANK_BODY_HTML_MAX_CHARS = 900_000;
const EDITOR_SIDEBAR_COLLAPSED_KEY = "recruit-editor-sidebar-collapsed-v1";

function readEditorSidebarCollapsedPref() {
  try {
    return payslipAppStateGetItem(EDITOR_SIDEBAR_COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

/** @param {boolean} collapsed */
function persistEditorSidebarCollapsed(collapsed) {
  try {
    payslipAppStateSetItem(
      EDITOR_SIDEBAR_COLLAPSED_KEY,
      collapsed ? "1" : "0",
    );
  } catch {
    /* ignore */
  }
}

function applyStoredEditorSidebarCollapse() {
  if (!notionWorkspaceEl) {
    return;
  }
  const collapsed = readEditorSidebarCollapsedPref();
  notionWorkspaceEl.classList.toggle(
    "notion-workspace--sidebar-collapsed",
    collapsed,
  );
  if (collapsed) {
    notionEditorSidebarEl?.setAttribute("aria-hidden", "true");
  } else {
    notionEditorSidebarEl?.removeAttribute("aria-hidden");
  }
}

function refreshEditorSidebarToggleButtonState() {
  if (!toggleEditorSidebarBtn || !notionWorkspaceEl) {
    return;
  }
  const collapsed = notionWorkspaceEl.classList.contains(
    "notion-workspace--sidebar-collapsed",
  );
  toggleEditorSidebarBtn.setAttribute(
    "aria-pressed",
    collapsed ? "false" : "true",
  );
  toggleEditorSidebarBtn.setAttribute(
    "aria-label",
    collapsed ? "Show pages sidebar" : "Hide pages sidebar",
  );
}

/** Dismiss floating pages sidebar when the user taps the main editor pane beneath it. */
function collapseEditorSidebarIfOpen() {
  if (
    !notionWorkspaceEl ||
    !toggleEditorSidebarBtn ||
    toggleEditorSidebarBtn.hidden
  ) {
    return;
  }
  if (
    notionWorkspaceEl.classList.contains(
      "notion-workspace--sidebar-collapsed",
    )
  ) {
    return;
  }
  notionWorkspaceEl.classList.add("notion-workspace--sidebar-collapsed");
  persistEditorSidebarCollapsed(true);
  notionEditorSidebarEl?.setAttribute("aria-hidden", "true");
  refreshEditorSidebarToggleButtonState();
}

function syncEditorSidebarToggleChrome() {
  if (!toggleEditorSidebarBtn || !pageHomeEl) {
    return;
  }
  const show = !isTeacherNavMode && !pageHomeEl.hidden;
  toggleEditorSidebarBtn.hidden = !show;
  if (show) {
    refreshEditorSidebarToggleButtonState();
  }
}
const WORKSPACE_PAYSLIPS_PAGE_ID = "__payslips";
const WORKSPACE_VAULT_PAGE_ID = "__vault";
/** Fixed child of Vault: Names and Notion row IDs (payslip person ↔ Notion page links). */
const WORKSPACE_VAULT_NOTION_LINKS_PAGE_ID = "__vaultNotionLinks";
const WORKSPACE_TRASH_PAGE_ID = "__trash";
/** Deleted sidebar pages expire from Trash automatically after this many days. */
const WORKSPACE_TRASH_RETENTION_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * Blank pages may include `bodyHtml` (auto-saved rich text). Trash snapshots always include `bodyHtml` when present.
 * `parentId` nests the page under another sidebar page (preorder flat list + tree helpers).
 * @typedef {{ id: string; title: string; kind: "payslips" | "vault" | "blank" | "trash"; fixed?: boolean; bodyHtml?: string; parentId?: string | null }} NotionWorkspacePage
 */

/**
 * @typedef {{ page: NotionWorkspacePage; children: WorkspacePageTreeNode[] }} WorkspacePageTreeNode
 */

/** @typedef {NotionWorkspacePage & { bodyHtml?: string; trashedAt?: number }} TrashedWorkspacePage */

/** @type {NotionWorkspacePage[]} */
let notionWorkspacePagesState = [];
/** Trashed blank pages until restored, permanently erased, or past retention. */
/** @type {TrashedWorkspacePage[]} */
let notionWorkspaceTrashState = [];
/** @type {string | null} */
let notionWorkspaceActiveId = null;

/** Values stored as plain strings in `payslip_app_user_state` (not JSON objects). */
const PAYSPIP_APP_USER_STATE_RAW_STRING_KEYS = new Set([
  WORKSPACE_ACTIVE_PAGE_KEY,
  THEME_KEY,
  EDITOR_SIDEBAR_COLLAPSED_KEY,
  PAYSLIP_NOTION_RESTRICT_MAPPED_KEY,
]);

/** In-memory mirror of `payslip_app_user_state.state` (Supabase); replaces app localStorage. */
/** @type {Record<string, unknown>} */
let payslipAppUserStateMirror = Object.create(null);
/** @type {Set<string>} */
const payslipAppUserStateDirtyKeys = new Set();
/** @type {number} */
let payslipAppUserStateFlushTimer = 0;
const PAYSPIP_APP_USER_STATE_DEBOUNCE_MS = 320;
/** After sign-in fetch, reads/writes sync to Supabase (with debounced merge). */
let payslipAppUserStateCloudReady = false;
/** Avoid duplicate exit uploads when both `beforeunload` and `pagehide` fire. */
let payslipAppExitSnapshotStarted = false;
/** Serializes Supabase merges so concurrent patches cannot drop draft data. */
let payslipAppUserStateFlushChain = Promise.resolve();

function payslipAppStateUsesCloudStorage(key) {
  const k = String(key ?? "");
  if (!k) {
    return false;
  }
  if (
    k === WORKSPACE_PAGES_KEY ||
    k === WORKSPACE_ACTIVE_PAGE_KEY ||
    k === WORKSPACE_TRASH_KEY ||
    k === WORKSPACE_FLOATING_DRAFTS_KEY ||
    k === WORKSPACE_CANVAS_DRAFTS_KEY ||
    k === EDITOR_SIDEBAR_COLLAPSED_KEY ||
    k === THEME_KEY ||
    k === PAYSLIP_NOTION_RESTRICT_MAPPED_KEY
  ) {
    return true;
  }
  if (
    k === HIDDEN_COLS_KEY ||
    k.startsWith(`${HIDDEN_COLS_KEY}:`) ||
    k === COLUMN_ORDER_KEY ||
    k.startsWith(`${COLUMN_ORDER_KEY}:`) ||
    k === COLUMN_WIDTHS_KEY ||
    k.startsWith(`${COLUMN_WIDTHS_KEY}:`) ||
    k === DROPPED_COLS_KEY ||
    k.startsWith(`${DROPPED_COLS_KEY}:`)
  ) {
    return true;
  }
  return false;
}

function payslipAppStateMirrorKeyPresent(key) {
  return Object.prototype.hasOwnProperty.call(payslipAppUserStateMirror, key);
}

/** @returns {string | null} same contract as `localStorage.getItem` for cloud-backed keys */
function payslipAppStateGetItem(key) {
  if (!payslipAppStateUsesCloudStorage(key)) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  if (!payslipAppStateMirrorKeyPresent(key)) {
    return null;
  }
  const v = payslipAppUserStateMirror[key];
  if (v === undefined || v === null) {
    return null;
  }
  if (PAYSPIP_APP_USER_STATE_RAW_STRING_KEYS.has(key)) {
    return String(v);
  }
  try {
    return JSON.stringify(v);
  } catch {
    return null;
  }
}

/**
 * @param {string} key
 * @param {string} stringVal same as `localStorage.setItem` value (JSON string for objects)
 */
function payslipAppStateSetItem(key, stringVal) {
  if (!payslipAppStateUsesCloudStorage(key)) {
    try {
      window.localStorage.setItem(key, stringVal);
    } catch {
      /* ignore */
    }
    return;
  }
  if (PAYSPIP_APP_USER_STATE_RAW_STRING_KEYS.has(key)) {
    payslipAppUserStateMirror[key] = stringVal;
  } else {
    try {
      payslipAppUserStateMirror[key] = JSON.parse(stringVal);
    } catch {
      payslipAppUserStateMirror[key] = stringVal;
    }
  }
  // Never queue Supabase writes before sign-in + hydrate. `initNotionWorkspace()` runs at load and
  // would otherwise persist empty floating/canvas blobs; the post-login flush could wipe real data.
  if (!payslipAppUserStateCloudReady) {
    return;
  }
  payslipAppUserStateDirtyKeys.add(key);
  if (
    key === WORKSPACE_FLOATING_DRAFTS_KEY ||
    key === WORKSPACE_CANVAS_DRAFTS_KEY
  ) {
    flushPayslipAppUserStateDirtyImmediate();
  } else {
    scheduleFlushPayslipAppUserStateToSupabase();
  }
}

function payslipAppStateRemoveItem(key) {
  if (!payslipAppStateUsesCloudStorage(key)) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return;
  }
  delete payslipAppUserStateMirror[key];
  if (!payslipAppUserStateCloudReady) {
    return;
  }
  payslipAppUserStateDirtyKeys.add(key);
  if (
    key === WORKSPACE_FLOATING_DRAFTS_KEY ||
    key === WORKSPACE_CANVAS_DRAFTS_KEY
  ) {
    flushPayslipAppUserStateDirtyImmediate();
  } else {
    scheduleFlushPayslipAppUserStateToSupabase();
  }
}

function scheduleFlushPayslipAppUserStateToSupabase() {
  if (!payslipAppUserStateCloudReady) {
    return;
  }
  if (payslipAppUserStateFlushTimer) {
    window.clearTimeout(payslipAppUserStateFlushTimer);
  }
  payslipAppUserStateFlushTimer = window.setTimeout(() => {
    payslipAppUserStateFlushTimer = 0;
    void flushPayslipAppUserStateDirtyNow();
  }, PAYSPIP_APP_USER_STATE_DEBOUNCE_MS);
}

/**
 * Writes dirty app-state keys to Supabase immediately (no debounce).
 * Used for draft databases so a restart cannot skip a pending timer.
 * @returns {Promise<void>}
 */
function flushPayslipAppUserStateDirtyImmediate() {
  if (!payslipAppUserStateCloudReady) {
    return Promise.resolve();
  }
  if (payslipAppUserStateFlushTimer) {
    window.clearTimeout(payslipAppUserStateFlushTimer);
    payslipAppUserStateFlushTimer = 0;
  }
  return flushPayslipAppUserStateDirtyNow();
}

async function flushPayslipAppUserStateDirtyNowInner() {
  while (payslipAppUserStateCloudReady && payslipAppUserStateDirtyKeys.size > 0) {
    const keysSnap = [...payslipAppUserStateDirtyKeys];
    /** @type {Record<string, unknown>} */
    const patch = {};
    for (const k of keysSnap) {
      if (Object.prototype.hasOwnProperty.call(payslipAppUserStateMirror, k)) {
        patch[k] = payslipAppUserStateMirror[k];
      } else {
        patch[k] = null;
      }
    }
    try {
      if (typeof window.teacherAuth?.mergePayslipAppUserState === "function") {
        const { error } = await window.teacherAuth.mergePayslipAppUserState(patch);
        if (error) {
          console.warn("payslip_app_user_state save:", error);
          return;
        }
      }
    } catch (e) {
      console.warn("payslip_app_user_state save:", e);
      return;
    }
    for (const k of keysSnap) {
      payslipAppUserStateDirtyKeys.delete(k);
    }
  }
}

/** @returns {Promise<void>} */
async function flushPayslipAppUserStateDirtyNow() {
  payslipAppUserStateFlushChain = payslipAppUserStateFlushChain
    .then(() => flushPayslipAppUserStateDirtyNowInner())
    .catch((e) => {
      console.warn("payslip_app_user_state flush chain:", e);
    });
  return payslipAppUserStateFlushChain;
}

/**
 * Coerces known `payslip_app_user_state.state` values when the DB returns JSON embedded as a string.
 * @param {string} key
 * @param {unknown} v
 * @returns {unknown}
 */
function normalizePayslipServerMirrorValue(key, v) {
  if (
    v != null &&
    typeof v === "string" &&
    (key === WORKSPACE_FLOATING_DRAFTS_KEY ||
      key === WORKSPACE_CANVAS_DRAFTS_KEY ||
      key === WORKSPACE_PAGES_KEY ||
      key === WORKSPACE_TRASH_KEY)
  ) {
    const t = v.trim();
    if (
      (t.startsWith("{") && t.endsWith("}")) ||
      (t.startsWith("[") && t.endsWith("]"))
    ) {
      try {
        return JSON.parse(t);
      } catch {
        return v;
      }
    }
  }
  return v;
}

async function hydratePayslipAppUserStateAfterAuth() {
  payslipAppUserStateDirtyKeys.clear();
  /** @type {Record<string, unknown>} */
  let server = {};
  try {
    if (typeof window.teacherAuth?.fetchPayslipAppUserState === "function") {
      const r = await window.teacherAuth.fetchPayslipAppUserState();
      if (r?.ok && r.state && typeof r.state === "object") {
        server = r.state;
      } else if (r?.error) {
        console.warn("payslip_app_user_state fetch:", r.error);
      }
    }
  } catch (e) {
    console.warn("payslip_app_user_state fetch:", e);
  }
  for (const [k, v] of Object.entries(server)) {
    if (!payslipAppStateUsesCloudStorage(k)) {
      continue;
    }
    payslipAppUserStateMirror[k] = normalizePayslipServerMirrorValue(k, v);
  }
  mergeFloatingDraftsLocalStorageBackupIfMirrorEmptyish();
  await mergePublishedWorkspaceDatabasesFromSupabaseIntoMirror();
  let migrated = false;
  try {
    const keysToScan = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i);
      if (k) {
        keysToScan.push(k);
      }
    }
    for (const k of keysToScan) {
      if (!payslipAppStateUsesCloudStorage(k)) {
        continue;
      }
      if (payslipAppStateMirrorKeyPresent(k)) {
        continue;
      }
      const t = window.localStorage.getItem(k);
      if (t == null || t === "") {
        continue;
      }
      if (PAYSPIP_APP_USER_STATE_RAW_STRING_KEYS.has(k)) {
        payslipAppUserStateMirror[k] = t;
      } else {
        try {
          payslipAppUserStateMirror[k] = JSON.parse(t);
        } catch {
          payslipAppUserStateMirror[k] = t;
        }
      }
      migrated = true;
      window.localStorage.removeItem(k);
    }
  } catch {
    /* ignore */
  }
  payslipAppUserStateCloudReady = true;
  payslipAppExitSnapshotStarted = false;
  await flushPayslipAppUserStateDirtyNow();
  if (migrated && typeof window.teacherAuth?.mergePayslipAppUserState === "function") {
    try {
      const snap = JSON.parse(JSON.stringify(payslipAppUserStateMirror));
      const { error } = await window.teacherAuth.mergePayslipAppUserState(snap);
      if (error) {
        console.warn("payslip_app_user_state migrate upload:", error);
      }
    } catch (e) {
      console.warn("payslip_app_user_state migrate upload:", e);
    }
  }
  try {
    const th = payslipAppStateGetItem(THEME_KEY);
    if (th === "dark" || th === "light") {
      applyTheme(th);
    }
  } catch {
    /* ignore */
  }
  try {
    if (typeof window.localStorage.removeItem === "function") {
      window.localStorage.removeItem(PAYSLIP_NOTION_LINK_ROWS_KEY);
    }
  } catch {
    /* ignore */
  }
}

async function refreshNotionWorkspaceAfterRemoteStateLoaded() {
  purgeTrashPastRetentionMs();
  loadNotionWorkspacePages();
  loadNotionWorkspaceTrash();
  const mountParent = notionWsBlankPanesMountEl?.parentElement;
  if (mountParent instanceof HTMLElement) {
    const allowed = new Set(
      notionWorkspacePagesState
        .filter((p) => p.kind === "blank")
        .map((p) => p.id),
    );
    for (const el of mountParent.querySelectorAll(
      ":scope > .notion-ws-pane[data-workspace-id]",
    )) {
      if (!(el instanceof HTMLElement)) {
        continue;
      }
      const id = el.dataset.workspaceId ?? "";
      if (
        id &&
        !allowed.has(id) &&
        id !== WORKSPACE_PAYSLIPS_PAGE_ID &&
        id !== WORKSPACE_VAULT_PAGE_ID &&
        id !== WORKSPACE_VAULT_NOTION_LINKS_PAGE_ID &&
        id !== WORKSPACE_TRASH_PAGE_ID
      ) {
        el.remove();
      }
    }
  }
  notionWorkspacePagesState.forEach((p) => {
    if (p.kind === "blank") {
      ensureBlankWorkspacePane(p);
    }
  });
  syncWorkspaceSubpageEmbedsForAllParents();
  repairStrayFloatingDraftDatasheetMounts();
  for (const p of notionWorkspacePagesState) {
    if (p.kind !== "trash") {
      ensureFloatingDraftsHydratedForWorkspacePage(p.id);
    }
  }
  enforceFloatingReplicasLiveOnTheirWorkspacePages();
  activateNotionWorkspacePage(
    notionWorkspaceActiveId ?? WORKSPACE_PAYSLIPS_PAGE_ID,
  );
  applyStoredEditorSidebarCollapse();
  syncEditorSidebarToggleChrome();
  hydrateCanvasDraftTablesFromStorage();
  renderNotionWorkspacePageList();
}

const WORKSPACE_SIDEBAR_EXPANDED_KEY =
  "recruit-workspace-sidebar-expanded-branch-ids-v1";

function readWorkspaceSidebarExpandedIdsFromSession() {
  try {
    const raw = sessionStorage.getItem(WORKSPACE_SIDEBAR_EXPANDED_KEY);
    if (!raw) {
      return new Set();
    }
    const a = JSON.parse(raw);
    return Array.isArray(a) ? new Set(a.map((x) => String(x))) : new Set();
  } catch {
    return new Set();
  }
}

/** @type {Set<string>} */
let workspaceSidebarExpandedIds = readWorkspaceSidebarExpandedIdsFromSession();

function persistWorkspaceSidebarExpandedIds() {
  try {
    sessionStorage.setItem(
      WORKSPACE_SIDEBAR_EXPANDED_KEY,
      JSON.stringify([...workspaceSidebarExpandedIds]),
    );
  } catch {
    /* ignore */
  }
}

/**
 * @param {string} pageId
 */
function toggleWorkspaceSidebarBranch(pageId) {
  const id = String(pageId ?? "").trim();
  if (!id) {
    return;
  }
  if (workspaceSidebarExpandedIds.has(id)) {
    workspaceSidebarExpandedIds.delete(id);
  } else {
    workspaceSidebarExpandedIds.add(id);
  }
  persistWorkspaceSidebarExpandedIds();
  renderNotionWorkspacePageList();
}

const ADMIN_ACTIVE_TEACHER_TAB_KEY = "recruit-admin-active-teacher-tab";

/**
 * Per-teacher admin view (Notion database + UI state).
 * @type {Map<string, { rawTable: typeof rawTable; filterSchool: string; filterDate: string; filterSort: string; filterPanelExpanded: boolean; label: string; subtitle: string; loadError: string | null; linked: boolean }>}
 */
const adminTeacherViews = new Map();

/** @type {string | null} */
let activeAdminTeacherId = null;

/** Whether the filter controls row is visible (icon toggles this). */
let filterPanelExpanded = false;

let columnMenuAnchorEl = null;
let columnMenuTargetColumn = "";

/** Notion `#dataTable` when null; local floating replica otherwise. */
let columnMenuTargetReplicaId = null;

function getPreferredTheme() {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  if (themeToggleEl) {
    themeToggleEl.setAttribute(
      "aria-label",
      isDark ? "Use light mode" : "Use dark mode",
    );
  }
  if (themeIconEl) {
    themeIconEl.textContent = isDark ? "\u2600" : "\u263D";
  }
  const authThemeIcon = document.querySelector("#authThemeToggle .auth-theme-icon");
  if (authThemeIcon) {
    authThemeIcon.textContent = isDark ? "\u2600" : "\u263D";
  }
}

function initTheme() {
  try {
    const stored = payslipAppStateGetItem(THEME_KEY);
    if (stored === "dark" || stored === "light") {
      applyTheme(stored);
      return;
    }
  } catch {
    /* ignore */
  }
  applyTheme(getPreferredTheme());
}

initTheme();

function toggleTheme() {
  const next =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    payslipAppStateSetItem(THEME_KEY, next);
  } catch {
    /* ignore */
  }
}

function closeNavMenu() {
  appMainEl?.classList.remove(NAV_MENU_OPEN_CLASS);
  if (navMenuPanel) {
    navMenuPanel.hidden = true;
  }
  if (navMenuBackdrop) {
    navMenuBackdrop.hidden = true;
  }
  if (navMenuBtn) {
    navMenuBtn.setAttribute("aria-expanded", "false");
    navMenuBtn.classList.remove("nav-menu-burger--open");
  }
}

function openNavMenu() {
  appMainEl?.classList.add(NAV_MENU_OPEN_CLASS);
  if (navMenuPanel) {
    navMenuPanel.hidden = false;
  }
  if (navMenuBackdrop) {
    navMenuBackdrop.hidden = false;
  }
  if (navMenuBtn) {
    navMenuBtn.setAttribute("aria-expanded", "true");
    navMenuBtn.classList.add("nav-menu-burger--open");
  }
}

function toggleNavMenu() {
  if (navMenuPanel?.hidden) {
    openNavMenu();
  } else {
    closeNavMenu();
  }
}

function isNavMenuOpen() {
  return navMenuPanel && !navMenuPanel.hidden;
}

function clearTeacherPaySlipCache() {
  teacherPaySlipCache = null;
}

/**
 * Teacher portal uses the same session key with values dashboard | teachers | payslips.
 * Legacy value teachers-pay-slips maps to dashboard.
 * @param {string} page
 * @returns {"dashboard" | "teachers" | "payslips"}
 */
function normalizeTeacherNavPage(page) {
  if (page === "dashboard" || page === "teachers" || page === "payslips") {
    return page;
  }
  return "dashboard";
}

function syncTeacherPortalNavActive(teacherPage) {
  navTeacherGoDashboard?.classList.toggle(
    "active",
    teacherPage === "dashboard",
  );
  navTeacherGoProfile?.classList.toggle("active", teacherPage === "teachers");
  navTeacherGoPaySlips?.classList.toggle(
    "active",
    teacherPage === "payslips",
  );
}

function readStoredNavPage() {
  try {
    const p = sessionStorage.getItem(APP_NAV_PAGE_KEY);
    if (isTeacherNavMode) {
      if (p === "dashboard" || p === "teachers" || p === "payslips") {
        return p;
      }
      if (p === "teachers-pay-slips") {
        return "dashboard";
      }
      return "dashboard";
    }
    if (p === "home" || p === "teachers") {
      return p;
    }
  } catch {
    /* ignore */
  }
  return isTeacherNavMode ? "dashboard" : "home";
}


function notionDefaultWorkspacePages() {
  /** @returns {NotionWorkspacePage[]} */
  return [
    {
      id: WORKSPACE_PAYSLIPS_PAGE_ID,
      title: "Dashboard",
      kind: "payslips",
      fixed: true,
    },
    {
      id: WORKSPACE_VAULT_PAGE_ID,
      title: "Vault",
      kind: "vault",
      fixed: true,
    },
    {
      id: WORKSPACE_TRASH_PAGE_ID,
      title: "Trash",
      kind: "trash",
      fixed: true,
    },
  ];
}

/**
 * @param {Record<string, unknown>} o
 * @param {string} selfId
 * @returns {string | null}
 */
function readWorkspaceParentIdRaw(o, selfId) {
  const raw = o.parentId != null ? String(o.parentId).trim() : "";
  if (!raw || raw === selfId) {
    return null;
  }
  return raw;
}

/**
 * @param {NotionWorkspacePage[]} pages
 * @returns {NotionWorkspacePage[]}
 */
function stripBrokenWorkspaceParents(pages) {
  const out = pages.map((p) => ({ ...p }));
  const byId = new Map(out.map((p) => [p.id, p]));
  for (const p of out) {
    let pid = p.parentId != null ? String(p.parentId).trim() : "";
    if (!pid || pid === p.id || !byId.has(pid)) {
      p.parentId = null;
      continue;
    }
    const par = byId.get(pid);
    if (par && par.kind === "trash") {
      p.parentId = null;
    }
  }
  for (const p of out) {
    const seen = new Set();
    let cur = p.parentId != null ? String(p.parentId).trim() : "";
    while (cur) {
      if (cur === p.id) {
        p.parentId = null;
        break;
      }
      if (seen.has(cur)) {
        p.parentId = null;
        break;
      }
      seen.add(cur);
      const n = byId.get(cur);
      cur = n?.parentId != null ? String(n.parentId).trim() : "";
    }
  }
  return out;
}

/**
 * @param {NotionWorkspacePage[]} pages
 * @returns {WorkspacePageTreeNode[]}
 */
function workspaceTreeFromFlatPages(pages) {
  const idx = new Map(pages.map((p, i) => [p.id, i]));
  /** @type {Map<string, WorkspacePageTreeNode>} */
  const byId = new Map();
  for (const p of pages) {
    byId.set(p.id, { page: { ...p }, children: [] });
  }
  for (const p of pages) {
    const node = byId.get(p.id);
    if (!node) {
      continue;
    }
    let pid =
      node.page.parentId != null ? String(node.page.parentId).trim() : "";
    if (node.page.kind === "trash") {
      node.page.parentId = null;
      pid = "";
    }
    if (!pid || !byId.has(pid)) {
      node.page.parentId = null;
      continue;
    }
    const par = byId.get(pid);
    if (!par || par.page.kind === "trash") {
      node.page.parentId = null;
      continue;
    }
    node.page.parentId = pid;
    par.children.push(node);
  }
  /** @type {WorkspacePageTreeNode[]} */
  const roots = [];
  for (const p of pages) {
    const node = byId.get(p.id);
    if (!node) {
      continue;
    }
    if (node.page.parentId == null || node.page.parentId === "") {
      roots.push(node);
    }
  }
  function sortKids(nodes) {
    nodes.sort(
      (a, b) => (idx.get(a.page.id) ?? 0) - (idx.get(b.page.id) ?? 0),
    );
    for (const n of nodes) {
      sortKids(n.children);
    }
  }
  roots.sort(
    (a, b) => (idx.get(a.page.id) ?? 0) - (idx.get(b.page.id) ?? 0),
  );
  sortKids(roots);
  return roots;
}

/**
 * @param {WorkspacePageTreeNode[]} roots
 */
function enforceTrashRootLast(roots) {
  const ix = roots.findIndex((r) => r.page.kind === "trash");
  if (ix >= 0 && ix !== roots.length - 1) {
    const [t] = roots.splice(ix, 1);
    roots.push(t);
    t.page.parentId = null;
  }
}

/**
 * @param {WorkspacePageTreeNode[]} roots
 * @returns {NotionWorkspacePage[]}
 */
function workspaceFlatFromTree(roots) {
  /** @type {NotionWorkspacePage[]} */
  const out = [];
  function walk(n) {
    out.push(n.page);
    for (const c of n.children) {
      walk(c);
    }
  }
  for (const r of roots) {
    walk(r);
  }
  return out;
}

/**
 * Merges defaults, validates `parentId`, outputs a stable preorder list (Trash last at root).
 * @param {NotionWorkspacePage[]} nextIn
 * @returns {NotionWorkspacePage[]}
 */
function normalizeWorkspaceChromeOrder(nextIn) {
  /** @type {Map<string, NotionWorkspacePage>} */
  const map = new Map();
  for (const d of notionDefaultWorkspacePages()) {
    map.set(d.id, { ...d, parentId: null });
  }
  for (const p of nextIn) {
    if (!p || typeof p !== "object") {
      continue;
    }
    const q = sanitizeWorkspacePageEntry(p);
    if (!q) {
      continue;
    }
    if (q.kind === "blank") {
      map.set(q.id, q);
    } else {
      const prev = map.get(q.id);
      const parentResolved =
        q.kind === "trash"
          ? null
          : q.parentId != null && String(q.parentId).trim()
            ? String(q.parentId).trim()
            : null;
      map.set(q.id, {
        ...(prev ?? q),
        ...q,
        fixed: true,
        parentId: parentResolved,
      });
    }
  }
  ensureFixedVaultNotionLinksPageInMap(map);
  if (!map.has(WORKSPACE_PAYSLIPS_PAGE_ID)) {
    map.set(WORKSPACE_PAYSLIPS_PAGE_ID, notionDefaultWorkspacePages()[0]);
  }
  let pages = [...map.values()];
  pages = stripBrokenWorkspaceParents(pages);
  const tree = workspaceTreeFromFlatPages(pages);
  enforceTrashRootLast(tree);
  return workspaceFlatFromTree(tree);
}

/**
 * Ensures the payslip Notion links UI lives on a dedicated sidebar page nested under Vault.
 * @param {Map<string, NotionWorkspacePage>} map
 */
function ensureFixedVaultNotionLinksPageInMap(map) {
  const id = WORKSPACE_VAULT_NOTION_LINKS_PAGE_ID;
  const prev = map.get(id);
  const title =
    prev && String(prev.title ?? "").trim()
      ? String(prev.title).trim()
      : "Names and Notion row IDs";
  map.set(id, {
    id,
    title,
    kind: "blank",
    fixed: true,
    parentId: WORKSPACE_VAULT_PAGE_ID,
  });
}

/**
 * @param {NotionWorkspacePage[]} pages
 * @param {string} ancestorId
 * @param {string} nodeId
 */
function isStrictDescendantInWorkspace(pages, ancestorId, nodeId) {
  if (ancestorId === nodeId) {
    return false;
  }
  const byId = new Map(pages.map((p) => [p.id, p]));
  let cur = nodeId;
  while (cur) {
    const n = byId.get(cur);
    if (!n?.parentId) {
      return false;
    }
    const p = String(n.parentId).trim();
    if (p === ancestorId) {
      return true;
    }
    cur = p;
  }
  return false;
}

/**
 * @param {WorkspacePageTreeNode[]} roots
 * @param {string} id
 * @returns {WorkspacePageTreeNode | null}
 */
function findWorkspaceTreeNode(roots, id) {
  for (const r of roots) {
    const f = findWorkspaceTreeNodeDeep(r, id);
    if (f) {
      return f;
    }
  }
  return null;
}

/**
 * @param {WorkspacePageTreeNode} n
 * @param {string} id
 * @returns {WorkspacePageTreeNode | null}
 */
function findWorkspaceTreeNodeDeep(n, id) {
  if (n.page.id === id) {
    return n;
  }
  for (const c of n.children) {
    const f = findWorkspaceTreeNodeDeep(c, id);
    if (f) {
      return f;
    }
  }
  return null;
}

/**
 * @param {WorkspacePageTreeNode[]} roots
 * @param {string} id
 * @returns {WorkspacePageTreeNode | null}
 */
function removeWorkspaceTreeNode(roots, id) {
  for (let i = 0; i < roots.length; i++) {
    if (roots[i].page.id === id) {
      return roots.splice(i, 1)[0] ?? null;
    }
    const found = removeWorkspaceTreeNode(roots[i].children, id);
    if (found) {
      return found;
    }
  }
  return null;
}

/**
 * @param {WorkspacePageTreeNode[]} nodes
 * @param {string | null} parentId
 */
function syncWorkspaceSubtreeParentIds(nodes, parentId) {
  for (const n of nodes) {
    n.page.parentId = parentId;
    syncWorkspaceSubtreeParentIds(n.children, n.page.id);
  }
}

/**
 * @param {WorkspacePageTreeNode[]} roots
 * @param {string} wantId
 * @returns {{ parentId: string | null } | null}
 */
function workspaceLocateParentMeta(roots, wantId) {
  for (const r of roots) {
    const m = workspaceLocateParentMetaDFS(r, null, wantId);
    if (m) {
      return m;
    }
  }
  return null;
}

/**
 * @param {WorkspacePageTreeNode} n
 * @param {string | null} parentId
 * @param {string} wantId
 * @returns {{ parentId: string | null } | null}
 */
function workspaceLocateParentMetaDFS(n, parentId, wantId) {
  if (n.page.id === wantId) {
    return { parentId: parentId ?? null };
  }
  for (const c of n.children) {
    const m = workspaceLocateParentMetaDFS(c, n.page.id, wantId);
    if (m) {
      return m;
    }
  }
  return null;
}

/**
 * @param {WorkspacePageTreeNode[]} roots
 * @param {string} targetId
 * @param {WorkspacePageTreeNode} node
 */
function insertWorkspaceSiblingBefore(roots, targetId, node) {
  const meta = workspaceLocateParentMeta(roots, targetId);
  if (!meta) {
    return;
  }
  node.page.parentId = meta.parentId;
  if (meta.parentId == null) {
    const ix = roots.findIndex((r) => r.page.id === targetId);
    if (ix >= 0) {
      roots.splice(ix, 0, node);
    }
    return;
  }
  const par = findWorkspaceTreeNode(roots, meta.parentId);
  if (!par) {
    roots.push(node);
    node.page.parentId = null;
    return;
  }
  const ix = par.children.findIndex((c) => c.page.id === targetId);
  if (ix >= 0) {
    par.children.splice(ix, 0, node);
  }
}

/**
 * @param {WorkspacePageTreeNode[]} roots
 * @param {string} targetId
 * @param {WorkspacePageTreeNode} node
 */
function insertWorkspaceSiblingAfter(roots, targetId, node) {
  const meta = workspaceLocateParentMeta(roots, targetId);
  if (!meta) {
    return;
  }
  node.page.parentId = meta.parentId;
  if (meta.parentId == null) {
    const ix = roots.findIndex((r) => r.page.id === targetId);
    if (ix >= 0) {
      roots.splice(ix + 1, 0, node);
    }
    return;
  }
  const par = findWorkspaceTreeNode(roots, meta.parentId);
  if (!par) {
    roots.push(node);
    node.page.parentId = null;
    return;
  }
  const ix = par.children.findIndex((c) => c.page.id === targetId);
  if (ix >= 0) {
    par.children.splice(ix + 1, 0, node);
  }
}

/**
 * @param {WorkspacePageTreeNode[]} roots
 * @param {string} parentId
 * @param {WorkspacePageTreeNode} node
 * @returns {boolean}
 */
function insertWorkspaceChildLast(roots, parentId, node) {
  const par = findWorkspaceTreeNode(roots, parentId);
  if (!par || par.page.kind === "trash") {
    return false;
  }
  node.page.parentId = parentId;
  par.children.push(node);
  return true;
}

/**
 * @param {string} dragId
 * @param {string} targetId
 * @param {"before" | "after" | "into"} zone
 */
function applyWorkspacePageDrop(dragId, targetId, zone) {
  const d = dragId.trim();
  const t = targetId.trim();
  if (!d || !t || d === t) {
    return;
  }
  const dragMeta = notionWorkspacePagesState.find((p) => p.id === d);
  if (dragMeta?.fixed) {
    return;
  }
  const snap = notionWorkspacePagesState.map((p) => ({ ...p }));
  if (isStrictDescendantInWorkspace(snap, d, t)) {
    return;
  }
  let roots = workspaceTreeFromFlatPages(snap);
  const dragged = removeWorkspaceTreeNode(roots, d);
  if (!dragged) {
    return;
  }
  let z = zone;
  if (t === WORKSPACE_TRASH_PAGE_ID && z === "into") {
    z = "before";
  }
  if (z === "into") {
    if (!insertWorkspaceChildLast(roots, t, dragged)) {
      insertWorkspaceSiblingBefore(roots, t, dragged);
    }
  } else if (z === "before") {
    insertWorkspaceSiblingBefore(roots, t, dragged);
  } else {
    insertWorkspaceSiblingAfter(roots, t, dragged);
  }
  enforceTrashRootLast(roots);
  syncWorkspaceSubtreeParentIds(roots, null);
  notionWorkspacePagesState = workspaceFlatFromTree(roots);
  if (z === "into") {
    workspaceSidebarExpandedIds.add(t);
    persistWorkspaceSidebarExpandedIds();
  }
  saveNotionWorkspacePages();
  applyNotionWorkspacePaneVisibility();
}

/**
 * @param {DragEvent} ev
 * @returns {"before" | "after" | "into"}
 */
function workspacePageRowDropZoneFromPointer(ev) {
  const row = ev.currentTarget;
  if (!(row instanceof HTMLElement)) {
    return "into";
  }
  const r = row.getBoundingClientRect();
  const y = ev.clientY - r.top;
  const h = Math.max(r.height, 1);
  if (row.classList.contains("notion-editor-page-row--trash")) {
    return y < h * 0.5 ? "before" : "after";
  }
  if (y < h * 0.28) {
    return "before";
  }
  if (y > h * 0.72) {
    return "after";
  }
  return "into";
}

function clearWorkspacePageListDropHints() {
  notionWorkspacePageListEl
    ?.querySelectorAll(".notion-editor-page-row[data-drop-hint]")
    .forEach((el) => {
      if (el instanceof HTMLElement) {
        el.removeAttribute("data-drop-hint");
      }
    });
}

/**
 * @param {string | null | undefined} pageId
 * @returns {string | null}
 */
function workspacePageDragPayloadId(pageId) {
  const s = pageId != null ? String(pageId).trim() : "";
  if (!s || s === WORKSPACE_TRASH_PAGE_ID) {
    return null;
  }
  return s;
}

/**
 * @param {unknown} v
 * @returns {NotionWorkspacePage | null}
 */
function sanitizeWorkspacePageEntry(v) {
  if (!v || typeof v !== "object") {
    return null;
  }
  const o = /** @type {{ id?: unknown; title?: unknown; kind?: unknown; bodyHtml?: unknown }} */ (
    v
  );
  const idRaw = o.id != null ? String(o.id).trim() : "";
  if (!idRaw) {
    return null;
  }
  const titleBase =
    o.title != null && String(o.title).trim()
      ? String(o.title).trim()
      : "Untitled";

  if (o.kind === "payslips" && idRaw === WORKSPACE_PAYSLIPS_PAGE_ID) {
    const legacy =
      /^pay\s*slips?$/i.test(titleBase.trim()) ||
      /^all\s+pay\s+slips?$/i.test(titleBase.trim());
    const titleResolved =
      titleBase === "Untitled" || legacy ? "Dashboard" : titleBase;
    const parentId = readWorkspaceParentIdRaw(
      /** @type {Record<string, unknown>} */ (o),
      WORKSPACE_PAYSLIPS_PAGE_ID,
    );
    return {
      id: WORKSPACE_PAYSLIPS_PAGE_ID,
      title: titleResolved,
      kind: "payslips",
      fixed: true,
      parentId,
    };
  }

  if (o.kind === "trash" && idRaw === WORKSPACE_TRASH_PAGE_ID) {
    return {
      id: WORKSPACE_TRASH_PAGE_ID,
      title: titleBase === "Untitled" ? "Trash" : titleBase,
      kind: "trash",
      fixed: true,
      parentId: null,
    };
  }

  if (o.kind === "vault" && idRaw === WORKSPACE_VAULT_PAGE_ID) {
    const parentId = readWorkspaceParentIdRaw(
      /** @type {Record<string, unknown>} */ (o),
      WORKSPACE_VAULT_PAGE_ID,
    );
    return {
      id: WORKSPACE_VAULT_PAGE_ID,
      title: titleBase === "Untitled" ? "Vault" : titleBase,
      kind: "vault",
      fixed: true,
      parentId,
    };
  }

  if (
    idRaw === WORKSPACE_PAYSLIPS_PAGE_ID ||
    idRaw === WORKSPACE_TRASH_PAGE_ID ||
    idRaw === WORKSPACE_VAULT_PAGE_ID
  ) {
    return null;
  }

  if (idRaw === WORKSPACE_VAULT_NOTION_LINKS_PAGE_ID) {
    if (o.kind !== "blank") {
      return null;
    }
    return {
      id: WORKSPACE_VAULT_NOTION_LINKS_PAGE_ID,
      title:
        titleBase === "Untitled"
          ? "Names and Notion row IDs"
          : titleBase,
      kind: "blank",
      fixed: true,
      parentId: WORKSPACE_VAULT_PAGE_ID,
    };
  }

  if (o.kind !== "blank") {
    return null;
  }

  const bodyHtmlRaw = o.bodyHtml != null ? String(o.bodyHtml) : "";
  const bodyHtml =
    bodyHtmlRaw.length > WORKSPACE_BLANK_BODY_HTML_MAX_CHARS
      ? bodyHtmlRaw.slice(0, WORKSPACE_BLANK_BODY_HTML_MAX_CHARS)
      : bodyHtmlRaw;
  const parentId = readWorkspaceParentIdRaw(
    /** @type {Record<string, unknown>} */ (o),
    idRaw,
  );

  if (bodyHtml) {
    return {
      id: idRaw,
      title: titleBase,
      kind: "blank",
      bodyHtml,
      parentId,
    };
  }
  return {
    id: idRaw,
    title: titleBase,
    kind: "blank",
    parentId,
  };
}

/**
 * @param {unknown} v
 * @returns {TrashedWorkspacePage | null}
 */
function sanitizeTrashedWorkspacePage(v) {
  const base = sanitizeWorkspacePageEntry(v);
  if (!base || base.kind !== "blank") {
    return null;
  }
  const o =
    v && typeof v === "object" ? /** @type {Record<string, unknown>} */ (v) : {};
  const bodyHtml =
    typeof o.bodyHtml === "string" ? o.bodyHtml : "";
  let trashedAt;
  if ("trashedAt" in o) {
    const n = Number(o.trashedAt);
    if (Number.isFinite(n) && n > 0) {
      trashedAt = n;
    }
  }
  return trashedAt !== undefined
    ? { ...base, bodyHtml, trashedAt }
    : { ...base, bodyHtml };
}

/**
 * Permanently drops trash entries older than {@link WORKSPACE_TRASH_RETENTION_MS}.
 * @returns {boolean} True if any entry was removed.
 */
function purgeTrashPastRetentionMs() {
  const cutoff = Date.now() - WORKSPACE_TRASH_RETENTION_MS;
  const prevLen = notionWorkspaceTrashState.length;
  notionWorkspaceTrashState = notionWorkspaceTrashState.filter((t) => {
    const ta =
      typeof t.trashedAt === "number" && Number.isFinite(t.trashedAt)
        ? t.trashedAt
        : cutoff;
    if (ta < cutoff) {
      purgeFloatingReplicasForWorkspacePageFromMap(t.id);
      deleteFloatingDraftsStoreKey(t.id);
      workspacePaneElFor(t.id)?.remove();
      return false;
    }
    return true;
  });
  if (notionWorkspaceTrashState.length !== prevLen) {
    saveNotionWorkspaceTrash();
    return true;
  }
  return false;
}

function loadNotionWorkspacePages() {
  notionWorkspaceActiveId = WORKSPACE_PAYSLIPS_PAGE_ID;

  /** @type {NotionWorkspacePage[]} */
  let next = [...notionDefaultWorkspacePages()];
  try {
    const raw = payslipAppStateGetItem(WORKSPACE_PAGES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        /** @type {NotionWorkspacePage[]} */
        const cleaned = [];
        for (const row of parsed) {
          const q = sanitizeWorkspacePageEntry(row);
          if (q) {
            cleaned.push(q);
          }
        }
        const hasPay = cleaned.some(
          (p) =>
            p.kind === "payslips" && p.id === WORKSPACE_PAYSLIPS_PAGE_ID,
        );
        if (cleaned.length > 0 && hasPay) {
          next = cleaned;
        }
      }
    }
  } catch {
    /* ignore */
  }

  notionWorkspacePagesState = normalizeWorkspaceChromeOrder(next);

  try {
    const savedActive = payslipAppStateGetItem(WORKSPACE_ACTIVE_PAGE_KEY);
    if (
      typeof savedActive === "string" &&
      savedActive.trim() &&
      notionWorkspacePagesState.some((p) => p.id === savedActive.trim())
    ) {
      notionWorkspaceActiveId = savedActive.trim();
    }
  } catch {
    /* ignore */
  }

  loadNotionWorkspaceTrash();
}

/** Trashed entries must never duplicate ids that still exist under Pages. */
function reconcileWorkspaceTrashWithActivePages() {
  const activeIds = new Set(
    notionWorkspacePagesState.map((p) => p.id),
  );
  const prevLen = notionWorkspaceTrashState.length;
  notionWorkspaceTrashState = notionWorkspaceTrashState.filter(
    (t) => !activeIds.has(t.id),
  );
  if (notionWorkspaceTrashState.length !== prevLen) {
    saveNotionWorkspaceTrash();
  }
}

function loadNotionWorkspaceTrash() {
  notionWorkspaceTrashState = [];
  let migratedMissingTrashTimestamp = false;
  try {
    const raw = payslipAppStateGetItem(WORKSPACE_TRASH_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        /** @type {Set<string>} */
        const seen = new Set();
        for (const row of parsed) {
          const q = sanitizeTrashedWorkspacePage(row);
          if (q && !seen.has(q.id)) {
            seen.add(q.id);
            if (
              !(typeof q.trashedAt === "number" && Number.isFinite(q.trashedAt))
            ) {
              q.trashedAt = Date.now();
              migratedMissingTrashTimestamp = true;
            }
            notionWorkspaceTrashState.push(q);
          }
        }
      }
    }
  } catch {
    notionWorkspaceTrashState = [];
  }
  reconcileWorkspaceTrashWithActivePages();
  purgeTrashPastRetentionMs();
  if (migratedMissingTrashTimestamp) {
    saveNotionWorkspaceTrash();
  }
}

function saveNotionWorkspaceTrash() {
  try {
    payslipAppStateSetItem(
      WORKSPACE_TRASH_KEY,
      JSON.stringify(notionWorkspaceTrashState),
    );
  } catch {
    /* ignore */
  }
}

function saveNotionWorkspacePages() {
  try {
    payslipAppStateSetItem(
      WORKSPACE_PAGES_KEY,
      JSON.stringify(notionWorkspacePagesState),
    );
  } catch {
    /* ignore */
  }
}

function saveNotionWorkspaceActivePage() {
  try {
    if (notionWorkspaceActiveId != null && notionWorkspaceActiveId !== "") {
      payslipAppStateSetItem(
        WORKSPACE_ACTIVE_PAGE_KEY,
        notionWorkspaceActiveId,
      );
    }
  } catch {
    /* ignore */
  }
}

/**
 * @param {string | null | undefined} id
 */
function workspacePaneElFor(id) {
  const sid = id != null ? String(id).trim() : "";
  if (sid === WORKSPACE_PAYSLIPS_PAGE_ID) {
    return notionWsPanePaySlipsEl;
  }
  if (sid === WORKSPACE_VAULT_PAGE_ID) {
    return notionWsPaneVaultEl;
  }
  if (sid === WORKSPACE_VAULT_NOTION_LINKS_PAGE_ID) {
    return notionWsPaneVaultNotionLinksEl;
  }
  if (sid === WORKSPACE_TRASH_PAGE_ID) {
    return notionWsPaneTrashEl;
  }
  const mountParent = notionWsBlankPanesMountEl?.parentElement;
  if (!mountParent) {
    return null;
  }
  for (const ch of mountParent.querySelectorAll(
    ":scope > .notion-ws-pane[data-workspace-id]",
  )) {
    if (ch instanceof HTMLElement && ch.dataset.workspaceId === sid) {
      return ch;
    }
  }
  return null;
}

/**
 * Which workspace route the user is interacting with (from DOM), for routing new draft DBs to the correct page.
 * @param {Element} start
 * @returns {string}
 */
function resolveFloatingDraftWorkspacePageIdFromDomHit(start) {
  if (!(start instanceof Element)) {
    return normalizeWorkspaceFloatingDraftPageKey(
      notionWorkspaceActiveId ?? WORKSPACE_PAYSLIPS_PAGE_ID,
    );
  }
  const mount = start.closest(".floating-draft-datasheets-mount");
  if (mount instanceof HTMLElement) {
    const id = (mount.dataset.workspacePageId ?? "").trim();
    if (id) {
      return normalizeWorkspaceFloatingDraftPageKey(id);
    }
  }
  const pane = start.closest(".notion-ws-pane[data-workspace-id]");
  if (pane instanceof HTMLElement) {
    const id = (pane.dataset.workspaceId ?? "").trim();
    if (id && id !== WORKSPACE_TRASH_PAGE_ID) {
      return normalizeWorkspaceFloatingDraftPageKey(id);
    }
  }
  return normalizeWorkspaceFloatingDraftPageKey(
    notionWorkspaceActiveId ?? WORKSPACE_PAYSLIPS_PAGE_ID,
  );
}

/**
 * Host element inside which per-page draft databases are appended (with page content, not loose on the pane edge).
 * Dashboard: inside `#notionDetails` panel body (below canvas). Vault: `#vaultContent`. Blank pages: `.notion-blank-body-wrap` under the rich-text body.
 * @param {string | null | undefined} pageId Workspace page id (`__payslips`, `__vault`, blank id, …).
 */
function resolveFloatingDraftMountHostElement(pageId) {
  const sid =
    pageId != null && String(pageId).trim() !== ""
      ? String(pageId).trim()
      : WORKSPACE_PAYSLIPS_PAGE_ID;
  if (sid === WORKSPACE_TRASH_PAGE_ID) {
    return null;
  }
  if (sid === WORKSPACE_VAULT_NOTION_LINKS_PAGE_ID) {
    return null;
  }
  const pane = workspacePaneElFor(sid);
  if (!(pane instanceof HTMLElement)) {
    return null;
  }
  if (sid === WORKSPACE_PAYSLIPS_PAGE_ID) {
    const panelBody =
      notionDetailsEl instanceof HTMLElement
        ? notionDetailsEl.querySelector(":scope > .notion-panel-body")
        : null;
    if (
      panelBody instanceof HTMLElement &&
      homeContentEl instanceof HTMLElement &&
      pane.contains(homeContentEl)
    ) {
      return panelBody;
    }
    if (homeContentEl instanceof HTMLElement && pane.contains(homeContentEl)) {
      return homeContentEl;
    }
    return pane;
  }
  if (sid === WORKSPACE_VAULT_PAGE_ID) {
    if (vaultContentEl instanceof HTMLElement && pane.contains(vaultContentEl)) {
      return vaultContentEl;
    }
    return pane;
  }
  const bodyWrap = pane.querySelector(".notion-blank-pane .notion-blank-body-wrap");
  if (bodyWrap instanceof HTMLElement) {
    return bodyWrap;
  }
  return pane;
}

/** @returns {HTMLElement | null} */
function ensureFloatingDraftMountInHost(hostEl) {
  if (!(hostEl instanceof HTMLElement)) {
    return null;
  }
  const existing = hostEl.querySelector(
    ":scope > .floating-draft-datasheets-mount",
  );
  if (existing instanceof HTMLElement) {
    return existing;
  }
  const mount = document.createElement("div");
  mount.className = "floating-draft-datasheets-mount";
  mount.setAttribute("aria-label", "Databases on this page");
  mount.setAttribute("aria-live", "polite");
  hostEl.appendChild(mount);
  return mount;
}

/** Per-page draft DB mount for the given workspace route (sidebar page). */
function floatingDraftDatasheetMountForWorkspacePage(pageId) {
  const sid =
    pageId != null && String(pageId).trim() !== ""
      ? String(pageId).trim()
      : WORKSPACE_PAYSLIPS_PAGE_ID;
  const host = resolveFloatingDraftMountHostElement(pageId);
  if (!(host instanceof HTMLElement)) {
    return null;
  }
  /** @type {HTMLElement | null} */
  let out = null;
  if (sid === WORKSPACE_PAYSLIPS_PAGE_ID && homeContentEl instanceof HTMLElement) {
    const legacy = homeContentEl.querySelector(
      ":scope > .floating-draft-datasheets-mount",
    );
    if (
      legacy instanceof HTMLElement &&
      legacy.parentElement !== host &&
      !host.contains(legacy)
    ) {
      host.appendChild(legacy);
      out = legacy;
    }
  }
  if (
    !out &&
    sid !== WORKSPACE_PAYSLIPS_PAGE_ID &&
    sid !== WORKSPACE_VAULT_PAGE_ID &&
    sid !== WORKSPACE_TRASH_PAGE_ID
  ) {
    const pane = workspacePaneElFor(sid);
    if (pane instanceof HTMLElement) {
      const legacy = pane.querySelector(
        ":scope > .floating-draft-datasheets-mount",
      );
      if (
        legacy instanceof HTMLElement &&
        legacy.parentElement !== host &&
        !host.contains(legacy)
      ) {
        host.appendChild(legacy);
        out = legacy;
      }
    }
  }
  if (!out) {
    out = ensureFloatingDraftMountInHost(host);
  }
  if (out instanceof HTMLElement) {
    out.dataset.workspacePageId = sid;
  }
  return out;
}

/**
 * Resolves which workspace sidebar page a draft mount belongs to (for re-homing strays).
 * Prefers `data-workspace-page-id`, then the enclosing pane `data-workspace-id`, then a card's in-memory replica.
 * @param {HTMLElement} mount
 * @returns {string | null} Normalized page id, or null if unknown / trash pane.
 */
function resolveWorkspacePageIdForStrayFloatingDraftMount(mount) {
  const fromDs = (mount.dataset.workspacePageId ?? "").trim();
  if (fromDs) {
    if (fromDs === WORKSPACE_TRASH_PAGE_ID) {
      return null;
    }
    return normalizeWorkspaceFloatingDraftPageKey(fromDs);
  }
  const pane = mount.closest("[data-workspace-id]");
  const fromPane =
    pane instanceof HTMLElement ? (pane.dataset.workspaceId ?? "").trim() : "";
  if (fromPane === WORKSPACE_TRASH_PAGE_ID) {
    return null;
  }
  if (fromPane) {
    return normalizeWorkspaceFloatingDraftPageKey(fromPane);
  }
  const directCard = mount.querySelector(
    ":scope > .floating-draft-datasheet-card",
  );
  if (directCard instanceof HTMLElement) {
    const fromCard = (directCard.dataset.workspacePageId ?? "").trim();
    if (fromCard && fromCard !== WORKSPACE_TRASH_PAGE_ID) {
      return normalizeWorkspaceFloatingDraftPageKey(fromCard);
    }
  }
  const card = mount.querySelector(".floating-draft-datasheet-card");
  if (card instanceof HTMLElement) {
    const rid = (card.dataset.floatingReplicaId ?? "").trim();
    if (rid) {
      const rep = paySlipFloatingReplicas.get(rid);
      if (rep) {
        return normalizeWorkspaceFloatingDraftPageKey(rep.workspacePageId);
      }
    }
  }
  return null;
}

/**
 * One-time DOM pass: find every `.floating-draft-datasheets-mount`, merge any non-canonical
 * node into the canonical mount for its page (see `floatingDraftDatasheetMountForWorkspacePage`), then remove the stray.
 * Run before per-page hydration so orphans from older layouts or duplicate mounts survive restart.
 */
function repairStrayFloatingDraftDatasheetMounts() {
  const root =
    notionWsPanesRootEl instanceof HTMLElement
      ? notionWsPanesRootEl
      : document.body;
  const list = [...root.querySelectorAll(".floating-draft-datasheets-mount")];
  for (const m of list) {
    if (!(m instanceof HTMLElement) || !m.isConnected) {
      continue;
    }
    const pid = resolveWorkspacePageIdForStrayFloatingDraftMount(m);
    if (!pid) {
      continue;
    }
    const canonical = floatingDraftDatasheetMountForWorkspacePage(pid);
    if (!(canonical instanceof HTMLElement) || m === canonical) {
      continue;
    }
    while (m.firstChild) {
      canonical.appendChild(m.firstChild);
    }
    m.remove();
  }
}

/**
 * Ensures every in-memory draft card's DOM lives under the mount for {@link FloatingPaySlipReplica#workspacePageId}
 * (fixes drift after layout changes or partial hydration).
 */
function enforceFloatingReplicasLiveOnTheirWorkspacePages() {
  for (const rep of paySlipFloatingReplicas.values()) {
    const pid = normalizeWorkspaceFloatingDraftPageKey(rep.workspacePageId);
    if (pid === WORKSPACE_TRASH_PAGE_ID) {
      continue;
    }
    const mount = floatingDraftDatasheetMountForWorkspacePage(pid);
    if (!(mount instanceof HTMLElement) || !(rep.root instanceof HTMLElement)) {
      continue;
    }
    if (rep.root.dataset.workspacePageId !== pid) {
      rep.root.dataset.workspacePageId = pid;
    }
    if (!mount.contains(rep.root)) {
      mount.appendChild(rep.root);
    }
  }
}

function floatingDraftDatasheetMountForActiveWorkspacePage() {
  return floatingDraftDatasheetMountForWorkspacePage(
    notionWorkspaceActiveId ?? WORKSPACE_PAYSLIPS_PAGE_ID,
  );
}

/**
 * Sidebar page bucket for persisting replica DBs locally.
 * @param {string | null | undefined} pageId
 */
function normalizeWorkspaceFloatingDraftPageKey(pageId) {
  const sid =
    typeof pageId === "string" && pageId.trim() !== ""
      ? pageId.trim()
      : WORKSPACE_PAYSLIPS_PAGE_ID;
  if (sid === WORKSPACE_TRASH_PAGE_ID) {
    return WORKSPACE_PAYSLIPS_PAGE_ID;
  }
  return sid;
}

/** @returns {Record<string, unknown[]>} */
function readFloatingDraftsObjectStore() {
  try {
    const raw = payslipAppStateGetItem(WORKSPACE_FLOATING_DRAFTS_KEY);
    if (!raw) {
      return {};
    }
    const o = JSON.parse(raw);
    let root = null;
    if (o && typeof o === "object" && !Array.isArray(o)) {
      root = o;
    } else if (typeof o === "string") {
      try {
        const inner = JSON.parse(o);
        if (inner && typeof inner === "object" && !Array.isArray(inner)) {
          root = inner;
        }
      } catch {
        return {};
      }
    }
    if (!root) {
      return {};
    }
    /** @type {Record<string, unknown[]>} */
    const out = {};
    for (const [k0, arr] of Object.entries(root)) {
      const key = typeof k0 === "string" ? k0.trim() : "";
      if (!key || key === WORKSPACE_TRASH_PAGE_ID) {
        continue;
      }
      if (Array.isArray(arr)) {
        out[key] = arr;
      }
    }
    return out;
  } catch {
    return {};
  }
}

/** @param {unknown} v Mirror value for {@link WORKSPACE_FLOATING_DRAFTS_KEY} */
function floatingDraftMirrorBlobHasAnySnapshots(v) {
  if (v == null || typeof v !== "object" || Array.isArray(v)) {
    return false;
  }
  for (const arr of Object.values(v)) {
    if (Array.isArray(arr) && arr.length > 0) {
      return true;
    }
  }
  return false;
}

/**
 * If the cloud mirror has no draft DB rows but `localStorage` still has a backup (e.g. merge
 * had not finished before `npm start`), restore into the mirror so the next flush can upload.
 */
function mergeFloatingDraftsLocalStorageBackupIfMirrorEmptyish() {
  if (
    floatingDraftMirrorBlobHasAnySnapshots(
      payslipAppUserStateMirror[WORKSPACE_FLOATING_DRAFTS_KEY],
    )
  ) {
    return;
  }
  try {
    const t = window.localStorage.getItem(WORKSPACE_FLOATING_DRAFTS_KEY);
    if (!t || !String(t).trim()) {
      return;
    }
    const o = JSON.parse(t);
    if (!floatingDraftMirrorBlobHasAnySnapshots(o)) {
      return;
    }
    payslipAppUserStateMirror[WORKSPACE_FLOATING_DRAFTS_KEY] = o;
    payslipAppUserStateDirtyKeys.add(WORKSPACE_FLOATING_DRAFTS_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * @param {string | null | undefined} workspacePageId
 * @param {string | null | undefined} replicaId
 * @returns {string}
 */
function floatingReplicaWorkspaceSqlKey(workspacePageId, replicaId) {
  return `${normalizeWorkspaceFloatingDraftPageKey(workspacePageId)}::${String(replicaId ?? "").trim()}`;
}

/** @param {FloatingPaySlipReplica} rep */
function syncFloatingReplicaSqlSaveButtonAppearance(rep) {
  const btn = rep.sqlSaveBtn;
  if (!(btn instanceof HTMLButtonElement)) {
    return;
  }
  const saved = userWorkspaceDraftSqlReplicaKeys.has(
    floatingReplicaWorkspaceSqlKey(rep.workspacePageId, rep.id),
  );
  btn.classList.toggle("floating-replica-save-sql-btn--saved", saved);
  btn.classList.toggle("floating-replica-save-sql-btn--unsaved", !saved);
  btn.title = saved
    ? "Stored in user_workspace_draft_databases. Click to update the saved copy."
    : "Not in Supabase SQL yet — click to save permanently to user_workspace_draft_databases.";
}

function refreshAllFloatingReplicaSqlSaveButtonAppearances() {
  for (const rep of paySlipFloatingReplicas.values()) {
    syncFloatingReplicaSqlSaveButtonAppearance(rep);
  }
}

/**
 * Merges `public.user_workspace_draft_databases` rows into the floating-drafts mirror so
 * SQL-saved replicas reload after a hard app restart (alongside payslip_app_user_state JSON).
 */
async function mergePublishedWorkspaceDatabasesFromSupabaseIntoMirror() {
  try {
    if (typeof window.teacherAuth?.fetchPayslipWorkspaceDatabases !== "function") {
      return;
    }
    const r = await window.teacherAuth.fetchPayslipWorkspaceDatabases();
    if (!r?.ok || !Array.isArray(r.rows)) {
      return;
    }
    userWorkspaceDraftSqlReplicaKeys.clear();
    /** @type {Record<string, unknown[]>} */
    const blob = { ...readFloatingDraftsObjectStore() };
    let changed = false;
    for (const row of r.rows) {
      if (!row || typeof row !== "object") {
        continue;
      }
      const ro = /** @type {Record<string, unknown>} */ (row);
      const wpRaw =
        ro.workspace_page_id != null ? String(ro.workspace_page_id).trim() : "";
      if (!wpRaw || wpRaw === WORKSPACE_TRASH_PAGE_ID) {
        continue;
      }
      const pageKey = normalizeWorkspaceFloatingDraftPageKey(wpRaw);
      const rrid =
        ro.replica_id != null ? String(ro.replica_id).trim() : "";
      if (pageKey && rrid) {
        userWorkspaceDraftSqlReplicaKeys.add(
          floatingReplicaWorkspaceSqlKey(pageKey, rrid),
        );
      }
      const snap = ro.snapshot;
      if (snap == null || typeof snap !== "object" || Array.isArray(snap)) {
        continue;
      }
      const snapObj = /** @type {Record<string, unknown>} */ (snap);
      const rid = snapObj.id != null ? String(snapObj.id).trim() : "";
      if (!rid) {
        continue;
      }
      const prevArr = Array.isArray(blob[pageKey]) ? [...blob[pageKey]] : [];
      const ix = prevArr.findIndex(
        (s) =>
          s &&
          typeof s === "object" &&
          !Array.isArray(s) &&
          String(/** @type {{ id?: unknown }} */ (s).id ?? "").trim() === rid,
      );
      const merged = {
        ...snapObj,
        workspacePageId: snapObj.workspacePageId ?? pageKey,
      };
      if (ix >= 0) {
        prevArr[ix] = merged;
      } else {
        prevArr.push(merged);
      }
      blob[pageKey] = prevArr;
      changed = true;
    }
    if (changed) {
      payslipAppUserStateMirror[WORKSPACE_FLOATING_DRAFTS_KEY] = blob;
      payslipAppUserStateDirtyKeys.add(WORKSPACE_FLOATING_DRAFTS_KEY);
    }
    refreshAllFloatingReplicaSqlSaveButtonAppearances();
  } catch (e) {
    console.warn("merge user_workspace_draft_databases into mirror:", e);
  }
}

/** @param {Record<string, unknown[]>} blob */
function writeFloatingDraftsObjectStore(blob) {
  try {
    const json = JSON.stringify(blob);
    payslipAppStateSetItem(WORKSPACE_FLOATING_DRAFTS_KEY, json);
    try {
      window.localStorage.setItem(WORKSPACE_FLOATING_DRAFTS_KEY, json);
    } catch {
      /* ignore */
    }
  } catch (e) {
    const code =
      e && typeof e === "object" && "code" in e
        ? /** @type {{ code?: unknown }} */ (e).code
        : null;
    if (code === 22 || code === "QuotaExceededError") {
      console.error(
        "Floating drafts could not save: browser storage quota is full.",
        e,
      );
    } else {
      console.error("Floating drafts save failed:", e);
    }
  }
}

/** @returns {Record<string, string>} */
function readCanvasDraftsObjectStore() {
  try {
    const raw = payslipAppStateGetItem(WORKSPACE_CANVAS_DRAFTS_KEY);
    if (!raw) {
      return {};
    }
    const o = JSON.parse(raw);
    if (!o || typeof o !== "object" || Array.isArray(o)) {
      return {};
    }
    /** @type {Record<string, string>} */
    const out = {};
    for (const [k0, v] of Object.entries(o)) {
      const key = typeof k0 === "string" ? k0.trim() : "";
      if (!key || key === WORKSPACE_TRASH_PAGE_ID) {
        continue;
      }
      if (typeof v === "string") {
        out[key] = v;
      }
    }
    return out;
  } catch {
    return {};
  }
}

/** @param {Record<string, string>} blob */
function writeCanvasDraftsObjectStore(blob) {
  try {
    payslipAppStateSetItem(WORKSPACE_CANVAS_DRAFTS_KEY, JSON.stringify(blob));
  } catch (e) {
    const code =
      e && typeof e === "object" && "code" in e
        ? /** @type {{ code?: unknown }} */ (e).code
        : null;
    if (code === 22 || code === "QuotaExceededError") {
      console.error(
        "Canvas draft databases could not save: browser storage quota is full.",
        e,
      );
    } else {
      console.error("Canvas draft databases save failed:", e);
    }
  }
}

function deleteFloatingDraftsStoreKey(pageId) {
  const k = normalizeWorkspaceFloatingDraftPageKey(pageId);
  const blob = readFloatingDraftsObjectStore();
  delete blob[k];
  writeFloatingDraftsObjectStore(blob);
}

/** @param {unknown} raw @param {string[]} fallbackCols */
function coercePersistedFloatingReplica(raw, fallbackCols) {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const o = /** @type {Record<string, unknown>} */ (raw);
  const idRaw =
    typeof o.id === "string" && o.id.trim() !== ""
      ? o.id.trim().slice(0, 240)
      : "";
  let cols = fallbackCols.slice();
  if (Array.isArray(o.columns)) {
    const next = [];
    for (const c of o.columns) {
      next.push(String(c ?? "").slice(0, 240));
    }
    if (next.length > 0 && next.length <= 96) {
      cols = next;
    }
  }
  const ncol = cols.length;

  /** @type {unknown[]} */
  let kindsIn = [];
  if (Array.isArray(o.columnKinds)) {
    kindsIn = o.columnKinds;
  }
  /** @type {Array<"text"|"number"|"status"|"multi"|"date"|"money">} */
  const columnKinds = [];
  for (let ki = 0; ki < ncol; ki += 1) {
    const rawK = kindsIn[ki];
    const coercedK = sanitizeFloatingReplicaPropKind(rawK);
    columnKinds.push(
      coercedK ?? inferFloatingReplicaPropKind(cols, ki, cols[ki]),
    );
  }

  /** @type {unknown[][]} */
  let rowsIn = [];
  if (Array.isArray(o.rows)) {
    rowsIn = o.rows;
  }
  const rows = rowsIn.slice(0, 2500).map((r0) => {
    const cells = [];
    if (Array.isArray(r0)) {
      for (let i = 0; i < ncol; i += 1) {
        cells.push(
          r0[i] == null ? "" : String(r0[i]).slice(0, 8000),
        );
      }
    } else {
      for (let i = 0; i < ncol; i += 1) {
        cells.push("");
      }
    }
    return cells;
  });
  if (!rows.length) {
    rows.push(Array.from({ length: ncol }, () => ""));
  }

  let pageIds = [];
  if (Array.isArray(o.pageIds)) {
    pageIds = o.pageIds
      .map((x) => (x == null ? "" : String(x).trim().slice(0, 280)))
      .slice(0, rows.length + 512);
  }
  if (pageIds.length < rows.length) {
    for (let i = pageIds.length; i < rows.length; i += 1) {
      pageIds.push(floatingReplicaNewRowId());
    }
  } else if (pageIds.length > rows.length) {
    pageIds = pageIds.slice(0, rows.length);
  }

  const hn = Array.isArray(o.hiddenNames)
    ? new Set(
        o.hiddenNames.filter((x) => typeof x === "string").map((s) => s.trim()),
      )
    : new Set();

  const cw = new Map();
  if (Array.isArray(o.colWidths)) {
    for (const pair of o.colWidths) {
      if (!Array.isArray(pair) || pair.length < 2) {
        continue;
      }
      const nk = typeof pair[0] === "string" ? pair[0] : String(pair[0]);
      const w = typeof pair[1] === "number" ? pair[1] : Number(pair[1]);
      if (
        nk &&
        Number.isFinite(w) &&
        w >= MIN_COL_WIDTH_PX &&
        w <= MAX_COL_WIDTH_PX
      ) {
        cw.set(nk, Math.round(w));
      }
    }
  }

  const title =
    typeof o.title === "string" ? o.title.slice(0, 400) : "New database";
  const fs =
    typeof o.filterSchool === "string" ? o.filterSchool.slice(0, 280) : "";
  const fd = typeof o.filterDate === "string" ? o.filterDate.slice(0, 48) : "";
  const fq =
    typeof o.filterSort === "string" &&
    ["", "asc", "desc"].includes(o.filterSort)
      ? o.filterSort
      : "desc";

  /** @type {boolean} */
  let fExpanded = Boolean(o.filterPanelExpanded);
  if (typeof o.filterPanelExpanded !== "boolean") {
    fExpanded =
      fs !== "" || fd !== "" || (fq !== "" && fq !== "desc") ? true : false;
  }

  let fid = idRaw;
  if (!fid) {
    floatingDraftPaySlipSheetUid += 1;
    fid = `float-${floatingDraftPaySlipSheetUid}`;
  }

  /** @param {unknown} raw */
  const oneMsRow = (raw) => {
    if (typeof raw === "number" && Number.isFinite(raw)) {
      return raw > 0 ? raw : 0;
    }
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  };
  const rn = rows.length;
  const creIn = Array.isArray(o.rowCreatedMs) ? o.rowCreatedMs : [];
  const edIn = Array.isArray(o.rowEditedMs) ? o.rowEditedMs : [];
  /** @type {number[]} */
  const rowCreatedMs = [];
  /** @type {number[]} */
  const rowEditedMs = [];
  for (let ri = 0; ri < rn; ri += 1) {
    rowCreatedMs.push(oneMsRow(creIn[ri]));
    rowEditedMs.push(oneMsRow(edIn[ri]));
  }

  const omitSysCreated = Boolean(o.omitSysCreated);
  const omitSysEdited = Boolean(o.omitSysEdited);
  const linkedNotionPageId = normalizeNotionRecordIdForMatch(
    typeof o.linkedNotionPageId === "string" ? o.linkedNotionPageId : "",
  );

  return {
    id: fid,
    columns: cols,
    columnKinds,
    rows,
    pageIds,
    hiddenNames: hn,
    colWidths: cw,
    title,
    filterSchool: fs,
    filterDate: fd,
    filterSort: fq,
    filterPanelExpanded: fExpanded,
    rowCreatedMs,
    rowEditedMs,
    omitSysCreated,
    omitSysEdited,
    linkedNotionPageId,
  };
}

/** @param {FloatingPaySlipReplica} rep */
function normalizeFloatingReplicaRowTimestamps(rep) {
  const n = rep.shadow.rows.length;
  if (!Array.isArray(rep.shadow.rowCreatedMs)) rep.shadow.rowCreatedMs = [];
  if (!Array.isArray(rep.shadow.rowEditedMs)) rep.shadow.rowEditedMs = [];
  const rm = rep.shadow.rowCreatedMs;
  const em = rep.shadow.rowEditedMs;
  while (rm.length < n) rm.push(0);
  while (em.length < n) em.push(0);
  if (rm.length > n) rm.length = n;
  if (em.length > n) em.length = n;
}

/** @param {number} ms */
function formatFloatingReplicaDateTime(ms) {
  if (!(typeof ms === "number" && Number.isFinite(ms) && ms > 0)) {
    return "—";
  }
  try {
    return new Date(ms).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "—";
  }
}

/** @param {FloatingPaySlipReplica} rep */
function serializeFloatingReplicaForStorage(rep) {
  ensureFloatingReplicaShadowColumnKinds(rep);
  normalizeFloatingReplicaRowTimestamps(rep);
  return {
    v: 1,
    id: rep.id,
    workspacePageId: rep.workspacePageId,
    title: (() => {
      let t = String(rep.barTitleEl.textContent ?? "").replace(/\u00a0/g, " ").trim();
      if (!t.length) {
        t = "New database";
      }
      return t.slice(0, 400);
    })(),
    columns: rep.shadow.columns.slice(),
    columnKinds: rep.shadow.columnKinds.slice(),
    rows: rep.shadow.rows.map((r) =>
      [...r].map((c) => (c == null ? "" : String(c))),
    ),
    pageIds: rep.shadow.pageIds.slice(),
    hiddenNames: [...rep.shadow.hiddenNames],
    colWidths: [...rep.shadow.colWidths.entries()],
    filterSchool: rep.filterSchoolEl.value,
    filterDate: rep.filterDateEl.value,
    filterSort: rep.filterSortEl.value,
    filterPanelExpanded: rep.filterPanelExpanded,
    rowCreatedMs: rep.shadow.rowCreatedMs.slice(),
    rowEditedMs: rep.shadow.rowEditedMs.slice(),
    omitSysCreated: Boolean(rep.shadow.omitSysCreated),
    omitSysEdited: Boolean(rep.shadow.omitSysEdited),
    linkedNotionPageId:
      normalizeNotionRecordIdForMatch(rep.shadow.linkedNotionPageId ?? ""),
  };
}

/**
 * True when the DOM host for draft DBs on this workspace page exists and is connected.
 * Used to avoid replacing stored drafts with `[]` when the page has never been built yet.
 * @param {string | null | undefined} pageId
 */
function floatingDraftSaveHostIsLiveForWorkspacePage(pageId) {
  const k = normalizeWorkspaceFloatingDraftPageKey(pageId);
  if (k === WORKSPACE_TRASH_PAGE_ID) {
    return false;
  }
  const host = resolveFloatingDraftMountHostElement(pageId);
  return host instanceof HTMLElement && host.isConnected;
}

function persistFloatingDraftSnapshotsForWorkspacePage(pageId) {
  const k = normalizeWorkspaceFloatingDraftPageKey(pageId);
  if (k === WORKSPACE_TRASH_PAGE_ID) {
    return;
  }
  const snapshots = [];
  for (const rep of paySlipFloatingReplicas.values()) {
    if (normalizeWorkspaceFloatingDraftPageKey(rep.workspacePageId) !== k) {
      continue;
    }
    try {
      snapshots.push(serializeFloatingReplicaForStorage(rep));
    } catch (e) {
      console.error(`Floating draft serialize failed (${rep?.id ?? "?"}):`, e);
    }
  }
  const blob = readFloatingDraftsObjectStore();
  const prev = blob[k];
  const live = floatingDraftSaveHostIsLiveForWorkspacePage(k);
  if (snapshots.length === 0 && Array.isArray(prev) && prev.length > 0) {
    if (!live) {
      return;
    }
    if (!floatingDraftWorkspacePageUserActivated.has(k)) {
      return;
    }
  }
  blob[k] = snapshots;
  writeFloatingDraftsObjectStore(blob);
}

/** @param {string | null | undefined} pageId */
function scheduleFloatingDraftPersistForWorkspacePage(pageId) {
  if (suppressFloatingReplicaPersistWrites) {
    return;
  }
  const k = normalizeWorkspaceFloatingDraftPageKey(pageId);
  const prev = floatingDraftPersistTimers[k];
  if (prev != null) {
    window.clearTimeout(prev);
  }
  floatingDraftPersistTimers[k] = window.setTimeout(() => {
    delete floatingDraftPersistTimers[k];
    persistFloatingDraftSnapshotsForWorkspacePage(k);
  }, FLOATING_DB_PERSIST_DEBOUNCE_MS);
}

function persistBlankWorkspacePageSnapshotNow(pageId) {
  const pid = pageId != null ? String(pageId).trim() : "";
  if (!pid) {
    return;
  }
  const pg = notionWorkspacePagesState.find((p) => p.id === pid);
  if (!pg || pg.kind !== "blank" || pg.fixed) {
    return;
  }
  const pane = workspacePaneElFor(pid);
  if (!(pane instanceof HTMLElement) || !pane.isConnected) {
    return;
  }
  const snap = captureBlankWorkspacePaneSnapshot(pid);
  const t = snap.title.trim() || "Untitled";
  pg.title = t;
  if (snap.bodyHtml && String(snap.bodyHtml).trim() !== "") {
    pg.bodyHtml = snap.bodyHtml;
  } else {
    delete pg.bodyHtml;
  }
  saveNotionWorkspacePages();
  syncNotionWorkspacePageSidebarLabel(pid, pg.title);
  syncWorkspaceSubpageEmbedForParentsOfDescendant(pid);
}

function scheduleBlankWorkspacePersist(pageId) {
  const pid = pageId != null ? String(pageId).trim() : "";
  if (!pid) {
    return;
  }
  const pg = notionWorkspacePagesState.find((p) => p.id === pid);
  if (!pg || pg.kind !== "blank" || pg.fixed) {
    return;
  }
  const prev = blankWorkspacePersistTimers[pid];
  if (prev != null) {
    window.clearTimeout(prev);
  }
  blankWorkspacePersistTimers[pid] = window.setTimeout(() => {
    delete blankWorkspacePersistTimers[pid];
    persistBlankWorkspacePageSnapshotNow(pid);
  }, FLOATING_DB_PERSIST_DEBOUNCE_MS);
}

function flushBlankWorkspacePersistTimers() {
  const ks = Object.keys(blankWorkspacePersistTimers);
  for (const k of ks) {
    const tid = blankWorkspacePersistTimers[k];
    delete blankWorkspacePersistTimers[k];
    if (tid != null) {
      window.clearTimeout(tid);
    }
    persistBlankWorkspacePageSnapshotNow(k);
  }
}

function persistCanvasDraftTablesNow() {
  if (suppressCanvasDraftPersistWrites || !canvasDraftTablesEl) {
    return;
  }
  let html = canvasDraftTablesEl.innerHTML;
  if (html.length > WORKSPACE_BLANK_BODY_HTML_MAX_CHARS) {
    html = html.slice(0, WORKSPACE_BLANK_BODY_HTML_MAX_CHARS);
  }
  const blob = readCanvasDraftsObjectStore();
  blob[WORKSPACE_PAYSLIPS_PAGE_ID] = html;
  writeCanvasDraftsObjectStore(blob);
}

function scheduleCanvasDraftPersist() {
  if (suppressCanvasDraftPersistWrites || !canvasDraftTablesEl) {
    return;
  }
  if (canvasDraftPersistTimer) {
    window.clearTimeout(canvasDraftPersistTimer);
  }
  canvasDraftPersistTimer = window.setTimeout(() => {
    canvasDraftPersistTimer = 0;
    persistCanvasDraftTablesNow();
  }, FLOATING_DB_PERSIST_DEBOUNCE_MS);
}

function flushCanvasDraftPersistTimer() {
  if (canvasDraftPersistTimer) {
    window.clearTimeout(canvasDraftPersistTimer);
    canvasDraftPersistTimer = 0;
  }
  persistCanvasDraftTablesNow();
}

function hydrateCanvasDraftTablesFromStorage() {
  if (!canvasDraftTablesEl) {
    return;
  }
  const blob = readCanvasDraftsObjectStore();
  const html = blob[WORKSPACE_PAYSLIPS_PAGE_ID];
  if (typeof html !== "string" || html.trim() === "") {
    return;
  }
  suppressCanvasDraftPersistWrites = true;
  try {
    canvasDraftTablesEl.innerHTML = html;
    for (const wrap of canvasDraftTablesEl.querySelectorAll(
      `.${CANVAS_LOCAL_DB_ROOT_CLASS}`,
    )) {
      if (wrap instanceof HTMLElement) {
        syncAllLocalDbBodyRows(wrap);
      }
    }
  } finally {
    suppressCanvasDraftPersistWrites = false;
  }
}

function initCanvasDraftAutoPersistObserver() {
  if (!canvasDraftTablesEl || typeof MutationObserver === "undefined") {
    return;
  }
  const obs = new MutationObserver(() => {
    scheduleCanvasDraftPersist();
  });
  obs.observe(canvasDraftTablesEl, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  canvasDraftTablesEl.addEventListener("input", () => {
    scheduleCanvasDraftPersist();
  });
}

/** Clears pending debounced writes and persists those page keys immediately. */
function flushFloatingDraftPersistTimers() {
  const ks = Object.keys(floatingDraftPersistTimers);
  for (const k of ks) {
    const tid = floatingDraftPersistTimers[k];
    delete floatingDraftPersistTimers[k];
    if (tid != null) {
      window.clearTimeout(tid);
    }
    persistFloatingDraftSnapshotsForWorkspacePage(k);
  }
}

/** Writes every floating draft currently in memory to its workspace-page bucket (Supabase). */
function persistAllFloatingReplicasToWorkspacePages() {
  const keys = new Set();
  try {
    for (const k0 of Object.keys(readFloatingDraftsObjectStore())) {
      keys.add(normalizeWorkspaceFloatingDraftPageKey(k0));
    }
  } catch {
    /* ignore */
  }
  for (const p of notionWorkspacePagesState) {
    if (p.kind !== "trash") {
      keys.add(normalizeWorkspaceFloatingDraftPageKey(p.id));
    }
  }
  for (const rep of paySlipFloatingReplicas.values()) {
    keys.add(normalizeWorkspaceFloatingDraftPageKey(rep.workspacePageId));
  }
  for (const k of keys) {
    persistFloatingDraftSnapshotsForWorkspacePage(k);
  }
}

/**
 * Re-syncs floating draft DOM with the in-memory map and persisted state before any flush.
 * Prevents empty snapshots from wiping saved data when cards were skipped for hydration
 * or detached from the mount.
 */
function repairAllFloatingDraftPagesBeforeFlush() {
  try {
    /** @type {Set<string>} */
    const ids = new Set();
    for (const p of notionWorkspacePagesState) {
      if (p.kind !== "trash") {
        ids.add(normalizeWorkspaceFloatingDraftPageKey(p.id));
      }
    }
    try {
      for (const k0 of Object.keys(readFloatingDraftsObjectStore())) {
        const nk = normalizeWorkspaceFloatingDraftPageKey(k0);
        if (nk !== WORKSPACE_TRASH_PAGE_ID) {
          ids.add(nk);
        }
      }
    } catch {
      /* ignore */
    }
    for (const id of ids) {
      ensureFloatingDraftsHydratedForWorkspacePage(id);
    }
    enforceFloatingReplicasLiveOnTheirWorkspacePages();
  } catch (e) {
    console.warn("floating draft pre-flush repair:", e);
  }
}

/** Flush debounced persists, then snapshot all replicas so drafts survive navigation and reload. */
function flushAllFloatingDraftPersistence() {
  repairAllFloatingDraftPagesBeforeFlush();
  flushFloatingDraftPersistTimers();
  persistAllFloatingReplicasToWorkspacePages();
  flushBlankWorkspacePersistTimers();
  flushCanvasDraftPersistTimer();
  if (payslipAppUserStateCloudReady && payslipAppUserStateDirtyKeys.size > 0) {
    flushPayslipAppUserStateDirtyImmediate();
  }
}

/**
 * Admin editor: persist the **currently open** workspace sidebar page from live DOM into the mirror
 * (blank title/body, draft DBs on that page, dashboard canvas when on Dashboard) before the global snapshot.
 * No-op in teacher mode. Called from {@link snapshotPersistentAppStateToMirror} when building a full mirror snapshot.
 */
function snapshotPersistentOpenWorkspacePageToMirror() {
  if (isTeacherNavMode) {
    return;
  }
  const aid =
    notionWorkspaceActiveId != null &&
    String(notionWorkspaceActiveId).trim() !== ""
      ? String(notionWorkspaceActiveId).trim()
      : WORKSPACE_PAYSLIPS_PAGE_ID;
  if (aid === WORKSPACE_TRASH_PAGE_ID) {
    return;
  }
  try {
    ensureFloatingDraftsHydratedForWorkspacePage(aid);
  } catch {
    /* ignore */
  }
  const pg = notionWorkspacePagesState.find((p) => p.id === aid);
  if (pg?.kind === "blank") {
    persistBlankWorkspacePageSnapshotNow(aid);
  }
  if (aid === WORKSPACE_PAYSLIPS_PAGE_ID) {
    flushCanvasDraftPersistTimer();
  }
  try {
    persistFloatingDraftSnapshotsForWorkspacePage(aid);
  } catch {
    /* ignore */
  }
}

/**
 * Copies every persisted surface from the live DOM/replicas into {@link payslipAppUserStateMirror}.
 * Workspace pages (titles, blank rich text), trash, last-open tab, per-page draft databases
 * (keyed by page id in {@link WORKSPACE_FLOATING_DRAFTS_KEY}), dashboard canvas DBs, payslip↔Notion links,
 * and column prefs — each page keeps its own payload so cloud sync can restore that page.
 */
function snapshotPersistentAppStateToMirror() {
  snapshotPersistentOpenWorkspacePageToMirror();
  if (payslipNotionLinksSectionEl instanceof HTMLElement) {
    collectPayslipNotionLinksFromDom();
  }
  savePayslipNotionLinkRowsToStorage();
  flushBlankWorkspacePersistTimers();
  for (const p of notionWorkspacePagesState) {
    if (p.kind === "blank") {
      persistBlankWorkspacePageSnapshotNow(p.id);
    }
  }
  saveNotionWorkspacePages();
  saveNotionWorkspaceTrash();
  saveNotionWorkspaceActivePage();
  flushAllFloatingDraftPersistence();
}

/**
 * Best-effort mirror + Supabase merge when the window is closing.
 * Does not block unload; duplicate `beforeunload`/`pagehide` pairs are deduped.
 */
function flushPersistentAppStateOnExit() {
  if (!payslipAppUserStateCloudReady) {
    return;
  }
  if (payslipAppExitSnapshotStarted) {
    return;
  }
  payslipAppExitSnapshotStarted = true;
  try {
    snapshotPersistentAppStateToMirror();
  } catch (e) {
    console.warn("app exit snapshot:", e);
  }
  void flushPayslipAppUserStateDirtyNow();
}

/** @type {number} */
let cloudSaveOverlayHideTimer = 0;

function clearCloudSaveOverlayHideTimer() {
  if (cloudSaveOverlayHideTimer) {
    window.clearTimeout(cloudSaveOverlayHideTimer);
    cloudSaveOverlayHideTimer = 0;
  }
}

function hideCloudSaveOverlay() {
  clearCloudSaveOverlayHideTimer();
  if (cloudSaveOverlay instanceof HTMLElement) {
    cloudSaveOverlay.hidden = true;
    cloudSaveOverlay.removeAttribute("data-phase");
    cloudSaveOverlay.setAttribute("aria-busy", "false");
  }
}

function showCloudSaveOverlaySaving() {
  clearCloudSaveOverlayHideTimer();
  if (!(cloudSaveOverlay instanceof HTMLElement)) {
    return;
  }
  cloudSaveOverlay.hidden = false;
  cloudSaveOverlay.setAttribute("data-phase", "saving");
  cloudSaveOverlay.setAttribute("aria-busy", "true");
  if (cloudSaveOverlayMessage instanceof HTMLElement) {
    cloudSaveOverlayMessage.textContent = "Saving…";
  }
}

function showCloudSaveOverlaySuccess() {
  if (!(cloudSaveOverlay instanceof HTMLElement)) {
    return;
  }
  cloudSaveOverlay.setAttribute("data-phase", "success");
  cloudSaveOverlay.setAttribute("aria-busy", "false");
  if (cloudSaveOverlayMessage instanceof HTMLElement) {
    cloudSaveOverlayMessage.textContent = "Successfully saved!";
  }
}

function showCloudSaveOverlayError(msg) {
  if (!(cloudSaveOverlay instanceof HTMLElement)) {
    return;
  }
  cloudSaveOverlay.setAttribute("data-phase", "error");
  cloudSaveOverlay.setAttribute("aria-busy", "false");
  if (cloudSaveOverlayMessage instanceof HTMLElement) {
    cloudSaveOverlayMessage.textContent =
      typeof msg === "string" && msg.trim() ? msg.trim() : "Save failed.";
  }
}

function scheduleHideCloudSaveOverlay(ms) {
  clearCloudSaveOverlayHideTimer();
  cloudSaveOverlayHideTimer = window.setTimeout(() => {
    cloudSaveOverlayHideTimer = 0;
    hideCloudSaveOverlay();
  }, ms);
}

/**
 * Writes a full snapshot to Supabase for the signed-in user: workspace list/trash/active page,
 * each blank page body/title, floating draft DBs, dashboard canvas DBs, column prefs,
 * theme/sidebar flags, and payslip↔Notion link rows. After sign-in, that state is loaded back
 * so the app resumes at the last saved workspace (window close or programmatic save).
 * @param {{ showOverlay?: boolean } | undefined} [opts] Pass `{ showOverlay: true }` for the blurred overlay + spinner (e.g. devtools).
 * @returns {Promise<boolean>} true if cloud mirror was ready and the run completed without throwing
 */
async function saveAllAppStateToSupabaseNow(opts) {
  const showOverlay = Boolean(opts?.showOverlay);
  if (showOverlay) {
    showCloudSaveOverlaySaving();
  }
  if (!payslipAppUserStateCloudReady) {
    setStatus("Sign in first — cloud save needs an active session.", true);
    if (showOverlay) {
      showCloudSaveOverlayError("Sign in first to save.");
      scheduleHideCloudSaveOverlay(2800);
    }
    return false;
  }
  try {
    snapshotPersistentAppStateToMirror();
    flushPayslipAppUserStateDirtyImmediate();
    await flushPayslipAppUserStateDirtyNow();
    if (payslipAppUserStateDirtyKeys.size > 0) {
      await flushPayslipAppUserStateDirtyNow();
    }
    if (showOverlay) {
      showCloudSaveOverlaySuccess();
      scheduleHideCloudSaveOverlay(2200);
    }
    setStatus(
      "Saved — full snapshot for this account (workspace pages, draft databases, and preferences).",
      false,
    );
    return true;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    setStatus(`Save failed: ${msg}`, true);
    if (showOverlay) {
      const short =
        msg.length > 140 ? `${msg.slice(0, 137).trimEnd()}…` : msg;
      showCloudSaveOverlayError(short);
      scheduleHideCloudSaveOverlay(3600);
    }
    return false;
  }
}

/** @param {string | null | undefined} pageId */
function purgeFloatingReplicasForWorkspacePageFromMap(pageId) {
  const k = normalizeWorkspaceFloatingDraftPageKey(pageId);
  for (const [rid, rep] of [...paySlipFloatingReplicas.entries()]) {
    if (normalizeWorkspaceFloatingDraftPageKey(rep.workspacePageId) === k) {
      paySlipFloatingReplicas.delete(rid);
    }
  }
}

/** @param {NotionWorkspacePage} pg */
function ensureBlankWorkspacePane(pg) {
  const parentEl = notionWsBlankPanesMountEl?.parentElement;
  const beforeEl = notionWsBlankPanesMountEl;
  if (
    pg.kind !== "blank" ||
    !(parentEl instanceof HTMLElement) ||
    !(beforeEl instanceof HTMLElement)
  ) {
    return;
  }
  if (pg.id === WORKSPACE_VAULT_NOTION_LINKS_PAGE_ID) {
    syncWorkspaceSubpageEmbedsForAllParents();
    return;
  }
  if (workspacePaneElFor(pg.id)) {
    const titleExisting = workspacePaneElFor(pg.id)?.querySelector(
      ".notion-blank-title",
    );
    if (titleExisting instanceof HTMLInputElement) {
      titleExisting.value = pg.title;
    }
    ensureBlankSubpagesHostInPane(pg.id);
    syncWorkspaceSubpageEmbedsForAllParents();
    return;
  }

  const section = document.createElement("section");
  section.className = "notion-ws-pane";
  section.dataset.workspaceId = pg.id;
  section.setAttribute("role", "tabpanel");

  const docRoot = document.createElement("article");
  docRoot.className = "notion-blank-pane";

  const title = document.createElement("input");
  title.type = "text";
  title.className = "notion-blank-title";
  title.value = pg.title;
  title.placeholder = "Untitled";
  title.setAttribute("aria-label", "Page title");
  title.autocomplete = "off";

  const subDetails = document.createElement("details");
  subDetails.className = "notion-ws-subpages-details";
  subDetails.hidden = true;
  const subSum = document.createElement("summary");
  subSum.className = "notion-ws-subpages-summary";
  subSum.setAttribute("aria-label", "Nested workspace pages");
  const subMount = document.createElement("div");
  subMount.className = "notion-ws-subpages-list-mount";

  const wrap = document.createElement("div");
  wrap.className = "notion-blank-body-wrap";
  const body = document.createElement("div");
  body.className = "notion-blank-body";
  body.contentEditable = "true";
  body.setAttribute("spellcheck", "true");
  body.dataset.placeholder =
    "Write something brilliant. Press '/' when shortcuts are wired.";

  if (pg.bodyHtml != null && String(pg.bodyHtml).trim() !== "") {
    body.innerHTML = String(pg.bodyHtml);
  }

  wrap.appendChild(body);
  subDetails.appendChild(subSum);
  subDetails.appendChild(subMount);
  docRoot.appendChild(title);
  docRoot.appendChild(subDetails);
  docRoot.appendChild(wrap);
  section.appendChild(docRoot);

  parentEl.insertBefore(section, beforeEl);
  syncWorkspaceSubpageEmbedsForAllParents();
}

/**
 * @param {string} parentId
 * @returns {NotionWorkspacePage[]}
 */
function getDirectWorkspaceChildPagesOrdered(parentId) {
  const pid = String(parentId).trim();
  const ord = new Map(notionWorkspacePagesState.map((p, i) => [p.id, i]));
  return notionWorkspacePagesState
    .filter((p) => {
      const pr = p.parentId != null ? String(p.parentId).trim() : "";
      return pr === pid && p.kind !== "trash";
    })
    .sort((a, b) => (ord.get(a.id) ?? 0) - (ord.get(b.id) ?? 0));
}

/**
 * @param {NotionWorkspacePage} p
 */
function workspaceSubpageLinkLabel(p) {
  if (p.kind === "payslips") {
    return "Dashboard";
  }
  if (p.kind === "vault") {
    return "Vault";
  }
  return String(p.title ?? "").trim() || "Untitled";
}

/**
 * @param {HTMLElement | null} hostEl
 * @param {string} parentId
 */
function renderWorkspaceSubpagesIntoHost(hostEl, parentId) {
  if (!(hostEl instanceof HTMLElement)) {
    return;
  }
  const kids = getDirectWorkspaceChildPagesOrdered(parentId);
  const detailsEl = hostEl.closest(".notion-ws-subpages-details");
  hostEl.replaceChildren();
  if (kids.length === 0) {
    if (detailsEl instanceof HTMLElement) {
      detailsEl.hidden = true;
    }
    return;
  }
  if (detailsEl instanceof HTMLElement) {
    detailsEl.hidden = false;
  }
  for (const ch of kids) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "notion-ws-subpage-link";
    btn.dataset.workspaceId = ch.id;
    btn.textContent = workspaceSubpageLinkLabel(ch);
    hostEl.appendChild(btn);
  }
}

/** @returns {HTMLElement | null} */
function getOrCreateDashboardSubpagesHost() {
  const el = document.getElementById("workspaceSubpagesMountDash");
  return el instanceof HTMLElement ? el : null;
}

/** @returns {HTMLElement | null} */
function getOrCreateVaultSubpagesHost() {
  const el = document.getElementById("workspaceSubpagesMountVault");
  return el instanceof HTMLElement ? el : null;
}

/** @returns {HTMLElement | null} */
function ensureBlankSubpagesHostInPane(pageId) {
  const pane = workspacePaneElFor(pageId);
  const docRoot = pane?.querySelector(".notion-blank-pane");
  if (!(docRoot instanceof HTMLElement)) {
    return null;
  }
  let mount = docRoot.querySelector(
    ":scope > .notion-ws-subpages-details .notion-ws-subpages-list-mount",
  );
  if (!(mount instanceof HTMLElement)) {
    for (const legacy of docRoot.querySelectorAll(
      ":scope > .notion-ws-subpages-host-blank, :scope > .notion-ws-subpages-host",
    )) {
      legacy.remove();
    }
    const details = document.createElement("details");
    details.className = "notion-ws-subpages-details";
    details.hidden = true;
    const sum = document.createElement("summary");
    sum.className = "notion-ws-subpages-summary";
    sum.setAttribute("aria-label", "Nested workspace pages");
    mount = document.createElement("div");
    mount.className = "notion-ws-subpages-list-mount";
    details.appendChild(sum);
    details.appendChild(mount);
    const wrap = docRoot.querySelector(".notion-blank-body-wrap");
    if (wrap instanceof HTMLElement) {
      docRoot.insertBefore(details, wrap);
    } else {
      docRoot.appendChild(details);
    }
  }
  return mount;
}

/**
 * @param {string | null | undefined} parentId
 */
function syncWorkspaceSubpageEmbedForParent(parentId) {
  const pid = String(parentId ?? "").trim();
  if (!pid || pid === WORKSPACE_TRASH_PAGE_ID) {
    return;
  }
  if (pid === WORKSPACE_PAYSLIPS_PAGE_ID) {
    renderWorkspaceSubpagesIntoHost(getOrCreateDashboardSubpagesHost(), pid);
    return;
  }
  if (pid === WORKSPACE_VAULT_PAGE_ID) {
    renderWorkspaceSubpagesIntoHost(getOrCreateVaultSubpagesHost(), pid);
    return;
  }
  renderWorkspaceSubpagesIntoHost(ensureBlankSubpagesHostInPane(pid), pid);
}

function syncWorkspaceSubpageEmbedsForAllParents() {
  for (const p of notionWorkspacePagesState) {
    if (p.kind === "trash") {
      continue;
    }
    syncWorkspaceSubpageEmbedForParent(p.id);
  }
}

/**
 * Refreshes subpage lists on any parent that lists `descendantId` as a child (e.g. title edits).
 * @param {string} descendantId
 */
function syncWorkspaceSubpageEmbedForParentsOfDescendant(descendantId) {
  const id = String(descendantId ?? "").trim();
  if (!id) {
    return;
  }
  for (const p of notionWorkspacePagesState) {
    if (p.kind === "trash") {
      continue;
    }
    const kids = getDirectWorkspaceChildPagesOrdered(p.id);
    if (kids.some((k) => k.id === id)) {
      syncWorkspaceSubpageEmbedForParent(p.id);
    }
  }
}

/**
 * Snapshot editable content before moving a blank page to Trash.
 * @param {string} pageId
 */
function captureBlankWorkspacePaneSnapshot(pageId) {
  const pane = workspacePaneElFor(pageId);
  if (!pane) {
    return { title: "Untitled", bodyHtml: "" };
  }
  const titleEl = pane.querySelector(".notion-blank-title");
  const bodyEl = pane.querySelector(".notion-blank-body");
  const title =
    titleEl instanceof HTMLInputElement
      ? titleEl.value.trim() || "Untitled"
      : "Untitled";
  const bodyHtml =
    bodyEl instanceof HTMLElement ? bodyEl.innerHTML : "";
  return { title, bodyHtml };
}

/** @param {HTMLButtonElement} btn */
function populateWorkspaceTrashNavButton(btn, title) {
  const label = String(title ?? "Trash").trim() || "Trash";
  btn.replaceChildren();
  btn.classList.add("notion-editor-page-btn--trash");
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "notion-editor-trash-nav-icon");
  svg.setAttribute("width", "17");
  svg.setAttribute("height", "17");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const ns = svg.namespaceURI;
  const poly = document.createElementNS(ns, "polyline");
  poly.setAttribute("points", "3 6 5 6 21 6");
  const path = document.createElementNS(ns, "path");
  path.setAttribute(
    "d",
    "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  );
  const line1 = document.createElementNS(ns, "line");
  line1.setAttribute("x1", "10");
  line1.setAttribute("y1", "11");
  line1.setAttribute("x2", "10");
  line1.setAttribute("y2", "17");
  const line2 = document.createElementNS(ns, "line");
  line2.setAttribute("x1", "14");
  line2.setAttribute("y1", "11");
  line2.setAttribute("x2", "14");
  line2.setAttribute("y2", "17");
  svg.appendChild(poly);
  svg.appendChild(path);
  svg.appendChild(line1);
  svg.appendChild(line2);
  const span = document.createElement("span");
  span.className = "notion-editor-trash-nav-label";
  span.textContent = label;
  btn.appendChild(svg);
  btn.appendChild(span);
  btn.setAttribute("aria-label", label);
}

function syncNotionWorkspacePageSidebarLabel(pageId, provisionalTitle) {
  notionWorkspacePageListEl?.querySelectorAll(".notion-editor-page-row").forEach((row) => {
    if (!(row instanceof HTMLElement) || row.dataset.pageId !== pageId) {
      return;
    }
    const btn = row.querySelector(".notion-editor-page-btn");
    if (!(btn instanceof HTMLElement)) {
      return;
    }
    const pg = notionWorkspacePagesState.find((p) => p.id === pageId);
    if (
      provisionalTitle !== undefined &&
      provisionalTitle !== null &&
      String(provisionalTitle).trim() &&
      pg?.kind !== "trash" &&
      pg?.kind !== "payslips" &&
      pg?.kind !== "vault"
    ) {
      btn.textContent = String(provisionalTitle).trim();
      return;
    }
    if (pg?.kind === "trash") {
      const t = String(pg.title ?? "Trash").trim() || "Trash";
      let labelEl = btn.querySelector(".notion-editor-trash-nav-label");
      if (!(labelEl instanceof HTMLElement)) {
        populateWorkspaceTrashNavButton(/** @type {HTMLButtonElement} */ (btn), t);
        labelEl = btn.querySelector(".notion-editor-trash-nav-label");
      }
      if (labelEl instanceof HTMLElement) {
        labelEl.textContent = t;
      }
      btn.setAttribute("aria-label", t);
      return;
    }
    btn.textContent =
      pg?.kind === "payslips"
        ? "Dashboard"
        : pg?.kind === "vault"
          ? "Vault"
          : (pg?.title ?? "Untitled");
  });
}

/** @returns {HTMLElement | undefined} */
function wrapForWorkspacePageRow(pageId) {
  if (!notionWorkspacePageListEl) {
    return undefined;
  }
  const esc =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(String(pageId))
      : String(pageId).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const hit = notionWorkspacePageListEl.querySelector(
    `.notion-editor-page-row[data-page-id="${esc}"]`,
  );
  return hit instanceof HTMLElement ? hit : undefined;
}

function activateNotionWorkspacePage(pageId) {
  flushAllFloatingDraftPersistence();
  let pid = typeof pageId === "string" ? pageId.trim() : "";
  if (!pid || !notionWorkspacePagesState.some((p) => p.id === pid)) {
    pid = WORKSPACE_PAYSLIPS_PAGE_ID;
  }
  notionWorkspaceActiveId = pid;
  saveNotionWorkspaceActivePage();
  if (pid !== WORKSPACE_TRASH_PAGE_ID) {
    floatingDraftWorkspacePageUserActivated.add(pid);
  }
  applyNotionWorkspacePaneVisibility();
  wrapForWorkspacePageRow(pid)?.scrollIntoView({
    block: "nearest",
    inline: "nearest",
  });
  ensureFloatingDraftsHydratedForWorkspacePage(pid);
  enforceFloatingReplicasLiveOnTheirWorkspacePages();
  syncNavOpenWorkspaceDashboardActive();
}

/** Keeps the menu “workspace Dashboard” icon in sync with Home + Payslips sidebar selection. */
function syncNavOpenWorkspaceDashboardActive() {
  if (!(navOpenWorkspaceDashboard instanceof HTMLElement)) {
    return;
  }
  if (isTeacherNavMode) {
    return;
  }
  const onHome = Boolean(pageHomeEl && !pageHomeEl.hidden);
  const onPayslipsPane =
    (notionWorkspaceActiveId ?? WORKSPACE_PAYSLIPS_PAGE_ID) ===
    WORKSPACE_PAYSLIPS_PAGE_ID;
  navOpenWorkspaceDashboard.classList.toggle("active", onHome && onPayslipsPane);
}

/** Admin: switch to Home, expand the Pages sidebar if needed, open the Payslips / Dashboard workspace page. */
function openWorkspaceDashboardInSidebar() {
  if (isTeacherNavMode) {
    return;
  }
  closeNavMenu();
  showAppPage("home");
  if (
    notionWorkspaceEl?.classList.contains("notion-workspace--sidebar-collapsed")
  ) {
    notionWorkspaceEl.classList.remove("notion-workspace--sidebar-collapsed");
    persistEditorSidebarCollapsed(false);
    notionEditorSidebarEl?.removeAttribute("aria-hidden");
    refreshEditorSidebarToggleButtonState();
  }
  activateNotionWorkspacePage(WORKSPACE_PAYSLIPS_PAGE_ID);
  if (notionDetailsEl instanceof HTMLDetailsElement) {
    notionDetailsEl.open = true;
  }
  wrapForWorkspacePageRow(WORKSPACE_PAYSLIPS_PAGE_ID)?.scrollIntoView({
    block: "nearest",
    inline: "nearest",
  });
}

/**
 * @param {HTMLElement} container
 * @param {WorkspacePageTreeNode} node
 * @param {number} depth
 */
function appendWorkspaceBranchToDOM(container, node, depth) {
  const pg = node.page;
  if (pg.kind === "trash") {
    return;
  }
  const branch = document.createElement("div");
  branch.className = "notion-editor-page-branch";
  branch.dataset.branchRootId = pg.id;
  const visibleChildren = node.children.filter(
    (c) => c.page.kind !== "trash",
  );
  const hasChildPages = visibleChildren.length > 0;
  const row = buildWorkspaceSidebarPageRow(pg, depth, hasChildPages);
  branch.appendChild(row);
  if (hasChildPages) {
    const wrap = document.createElement("div");
    wrap.className = "notion-editor-page-children-wrap";
    wrap.hidden = !workspaceSidebarExpandedIds.has(pg.id);
    for (const ch of visibleChildren) {
      appendWorkspaceBranchToDOM(wrap, ch, depth + 1);
    }
    branch.appendChild(wrap);
  }
  container.appendChild(branch);
}

/**
 * @param {NotionWorkspacePage} p
 * @param {number} depth
 * @param {boolean} hasChildPages
 * @returns {HTMLElement}
 */
function buildWorkspaceSidebarPageRow(p, depth, hasChildPages) {
  const row = document.createElement("div");
  row.className = "notion-editor-page-row";
  if (p.kind !== "trash") {
    row.classList.add("notion-editor-page-row--draggable");
  }
  row.dataset.pageId = p.id;
  if (depth > 0) {
    row.style.marginLeft = `${Math.min(depth, 24) * 10}px`;
  }

  if (hasChildPages) {
    const expanded = workspaceSidebarExpandedIds.has(p.id);
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "notion-editor-page-children-toggle";
    toggle.dataset.workspaceExpandId = p.id;
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
    toggle.setAttribute(
      "aria-label",
      expanded ? "Hide pages inside" : "Show pages inside",
    );
    toggle.textContent = expanded ? "\u25be" : "\u25b8";
    row.appendChild(toggle);
  } else {
    const sp = document.createElement("span");
    sp.className = "notion-editor-page-leading-spacer";
    sp.setAttribute("aria-hidden", "true");
    row.appendChild(sp);
  }

  const tab = document.createElement("button");
  tab.type = "button";
  tab.className = "notion-editor-page-btn";
  tab.dataset.workspaceId = p.id;
  tab.draggable = false;
  if (p.kind === "trash") {
    row.classList.add("notion-editor-page-row--trash");
    populateWorkspaceTrashNavButton(tab, p.title ?? "Trash");
  } else {
    tab.textContent =
      p.kind === "payslips"
        ? "Dashboard"
        : p.kind === "vault"
          ? "Vault"
          : p.title;
  }

  const close = document.createElement("button");
  close.type = "button";
  close.className = "notion-editor-page-remove";
  close.dataset.workspaceCloseId = p.id;
  close.setAttribute("aria-label", "Move to trash");
  close.textContent = "\u2715";
  close.draggable = false;
  if (
    p.fixed ||
    p.kind === "payslips" ||
    p.kind === "vault" ||
    p.kind === "trash"
  ) {
    close.hidden = true;
    close.disabled = true;
  }

  row.appendChild(tab);
  row.appendChild(close);

  row.addEventListener("dragover", onWorkspacePageRowDragOver);
  row.addEventListener("drop", onWorkspacePageRowDrop);

  if (p.kind !== "trash") {
    row.draggable = true;
    row.addEventListener("dragstart", onWorkspacePageRowDragStart);
    row.addEventListener("dragend", onWorkspacePageRowDragEnd);
  }

  return row;
}

function renderNotionWorkspacePageList() {
  if (!notionWorkspacePageListEl) {
    return;
  }
  notionWorkspacePageListEl.replaceChildren();
  const roots = workspaceTreeFromFlatPages(notionWorkspacePagesState);
  for (const r of roots) {
    if (r.page.kind === "trash") {
      notionWorkspacePageListEl.appendChild(
        buildWorkspaceSidebarPageRow(r.page, 0, false),
      );
      continue;
    }
    appendWorkspaceBranchToDOM(notionWorkspacePageListEl, r, 0);
  }

  notionWorkspacePageListEl
    .querySelectorAll(".notion-editor-page-row")
    .forEach((el) => {
      if (!(el instanceof HTMLElement)) {
        return;
      }
      el.dataset.active =
        el.dataset.pageId === notionWorkspaceActiveId ? "true" : "false";
      const tb = el.querySelector(".notion-editor-page-btn");
      if (!(tb instanceof HTMLButtonElement)) {
        return;
      }
      const active = notionWorkspaceActiveId === el.dataset.pageId;
      if (active) {
        tb.setAttribute("aria-current", "page");
      } else {
        tb.removeAttribute("aria-current");
      }
      tb.tabIndex = active ? 0 : -1;
    });
  renderNotionWorkspaceTrashList();
}

function renderNotionWorkspaceTrashList() {
  purgeTrashPastRetentionMs();
  if (!notionTrashListMountEl) {
    return;
  }
  notionTrashListMountEl.replaceChildren();
  if (notionWorkspaceTrashState.length === 0) {
    const hint = document.createElement("p");
    hint.className = "notion-editor-trash-empty";
    hint.textContent = "No pages here yet.";
    notionTrashListMountEl.appendChild(hint);
    return;
  }
  for (const p of notionWorkspaceTrashState) {
    if (p.kind !== "blank") {
      continue;
    }
    const row = document.createElement("div");
    row.className = "notion-editor-trash-row";
    row.dataset.trashRowId = p.id;

    const label = document.createElement("span");
    label.className = "notion-editor-trash-title";
    label.textContent = p.title ?? "Untitled";

    const actions = document.createElement("div");
    actions.className = "notion-editor-trash-actions";

    const restore = document.createElement("button");
    restore.type = "button";
    restore.className = "notion-editor-trash-restore";
    restore.dataset.workspaceRestoreId = p.id;
    restore.setAttribute("aria-label", "Restore page");
    restore.title = "Put this page back in Pages";
    restore.textContent = "Restore";

    const purge = document.createElement("button");
    purge.type = "button";
    purge.className = "notion-editor-trash-delete";
    purge.dataset.workspaceTrashPurgeId = p.id;
    purge.setAttribute("aria-label", "Permanently delete page");
    purge.title = "Delete forever";
    purge.textContent = "Erase";

    actions.appendChild(restore);
    actions.appendChild(purge);
    row.appendChild(label);
    row.appendChild(actions);
    notionTrashListMountEl.appendChild(row);
  }
}

function applyNotionWorkspacePaneVisibility() {
  const mountParent = notionWsBlankPanesMountEl?.parentElement;
  if (!mountParent) {
    return;
  }
  for (const pane of mountParent.querySelectorAll(
    ":scope > .notion-ws-pane[data-workspace-id]",
  )) {
    if (!(pane instanceof HTMLElement)) {
      continue;
    }
    pane.classList.remove("notion-ws-pane--visible");
  }

  const targetId =
    notionWorkspaceActiveId ??
    WORKSPACE_PAYSLIPS_PAGE_ID;
  const targetPane = workspacePaneElFor(targetId);
  if (targetPane instanceof HTMLElement) {
    targetPane.classList.add("notion-ws-pane--visible");
  }

  renderNotionWorkspacePageList();
  syncWorkspaceSubpageEmbedsForAllParents();
}

function newBlankNotionWorkspacePage() {
  const id =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `np-${Date.now()}`;
  const active = notionWorkspaceActiveId?.trim() ?? "";
  const parentId =
    active &&
    active !== WORKSPACE_TRASH_PAGE_ID &&
    notionWorkspacePagesState.some((p) => p.id === active)
      ? active
      : null;
  notionWorkspacePagesState.push({
    id,
    title: "Untitled",
    kind: "blank",
    parentId,
  });
  notionWorkspacePagesState = normalizeWorkspaceChromeOrder(
    notionWorkspacePagesState,
  );
  saveNotionWorkspacePages();
  const added = notionWorkspacePagesState.find((p) => p.id === id);
  if (added) {
    ensureBlankWorkspacePane(added);
  }
  renderNotionWorkspacePageList();
  activateNotionWorkspacePage(id);
}

function moveNotionWorkspacePageToTrash(pageId) {
  if (
    !pageId ||
    pageId === WORKSPACE_PAYSLIPS_PAGE_ID ||
    pageId === WORKSPACE_VAULT_PAGE_ID ||
    pageId === WORKSPACE_VAULT_NOTION_LINKS_PAGE_ID ||
    pageId === WORKSPACE_TRASH_PAGE_ID
  ) {
    return;
  }
  const idx = notionWorkspacePagesState.findIndex((p) => p.id === pageId);
  if (idx < 0) {
    return;
  }
  const pg = notionWorkspacePagesState[idx];
  if (!pg || pg.kind !== "blank" || pg.fixed) {
    return;
  }
  const reparentTo =
    pg.parentId != null &&
    String(pg.parentId).trim() &&
    notionWorkspacePagesState.some((x) => x.id === String(pg.parentId).trim())
      ? String(pg.parentId).trim()
      : null;
  for (const p of notionWorkspacePagesState) {
    if (p.parentId === pageId) {
      p.parentId = reparentTo;
    }
  }
  const snap = captureBlankWorkspacePaneSnapshot(pageId);
  /** @type {TrashedWorkspacePage} */
  const entry = {
    id: pg.id,
    title: snap.title.length ? snap.title : pg.title,
    kind: "blank",
    bodyHtml: snap.bodyHtml,
    trashedAt: Date.now(),
  };
  notionWorkspacePagesState.splice(idx, 1);
  notionWorkspacePagesState = normalizeWorkspaceChromeOrder(
    notionWorkspacePagesState,
  );
  notionWorkspaceTrashState.unshift(entry);
  flushFloatingDraftPersistTimers();
  persistFloatingDraftSnapshotsForWorkspacePage(
    normalizeWorkspaceFloatingDraftPageKey(pageId),
  );
  purgeFloatingReplicasForWorkspacePageFromMap(pageId);
  workspacePaneElFor(pageId)?.remove();
  saveNotionWorkspacePages();
  saveNotionWorkspaceTrash();
  if (notionWorkspaceActiveId === pageId) {
    activateNotionWorkspacePage(WORKSPACE_PAYSLIPS_PAGE_ID);
    return;
  }
  applyNotionWorkspacePaneVisibility();
}

function restoreNotionWorkspacePageFromTrash(pageId) {
  const ix = notionWorkspaceTrashState.findIndex((p) => p.id === pageId);
  if (ix < 0) {
    return;
  }
  const trashEntry = notionWorkspaceTrashState[ix];
  if (!trashEntry || trashEntry.kind !== "blank") {
    return;
  }
  notionWorkspaceTrashState.splice(ix, 1);
  notionWorkspacePagesState.push({
    id: trashEntry.id,
    title: trashEntry.title,
    kind: "blank",
    parentId: null,
  });
  notionWorkspacePagesState = normalizeWorkspaceChromeOrder(
    notionWorkspacePagesState,
  );
  saveNotionWorkspaceTrash();
  saveNotionWorkspacePages();
  const restoredId = trashEntry.id;
  const restored = notionWorkspacePagesState.find((p) => p.id === restoredId);
  if (restored) {
    ensureBlankWorkspacePane(restored);
  }
  const pane = workspacePaneElFor(restoredId);
  const titleEl = pane?.querySelector(".notion-blank-title");
  if (titleEl instanceof HTMLInputElement) {
    titleEl.value = trashEntry.title;
  }
  const bodyEl = pane?.querySelector(".notion-blank-body");
  if (
    bodyEl instanceof HTMLElement &&
    trashEntry.bodyHtml != null &&
    trashEntry.bodyHtml !== ""
  ) {
    bodyEl.innerHTML = trashEntry.bodyHtml;
  }
  renderNotionWorkspacePageList();
  applyNotionWorkspacePaneVisibility();
  activateNotionWorkspacePage(restoredId);
}

function permanentlyDeleteTrashedWorkspacePage(pageId) {
  if (!pageId) {
    return;
  }
  if (
    !window.confirm(
      "Permanently delete this page from Trash? You cannot undo this.",
    )
  ) {
    return;
  }
  const beforeLen = notionWorkspaceTrashState.length;
  notionWorkspaceTrashState = notionWorkspaceTrashState.filter(
    (p) => p.id !== pageId,
  );
  if (notionWorkspaceTrashState.length === beforeLen) {
    return;
  }
  purgeFloatingReplicasForWorkspacePageFromMap(pageId);
  deleteFloatingDraftsStoreKey(pageId);
  workspacePaneElFor(pageId)?.remove();
  saveNotionWorkspaceTrash();
  renderNotionWorkspacePageList();
}

/** @type {string | null} */
let workspacePageDnDActiveId = null;

/**
 * @param {DragEvent} ev
 */
function onWorkspacePageRowDragStart(ev) {
  const t = ev.target;
  if (t instanceof Element) {
    if (
      t.closest(".notion-editor-page-children-toggle") ||
      t.closest(".notion-editor-page-remove")
    ) {
      ev.preventDefault();
      return;
    }
  }
  const row =
    ev.currentTarget instanceof HTMLElement
      ? ev.currentTarget
      : t instanceof Element
        ? t.closest(".notion-editor-page-row")
        : null;
  const id = workspacePageDragPayloadId(
    row instanceof HTMLElement ? row.dataset.pageId : "",
  );
  if (!id || !ev.dataTransfer) {
    ev.preventDefault();
    return;
  }
  const dragPg = notionWorkspacePagesState.find((p) => p.id === id);
  if (dragPg?.fixed) {
    ev.preventDefault();
    return;
  }
  workspacePageDnDActiveId = id;
  ev.dataTransfer.setData("text/plain", id);
  ev.dataTransfer.effectAllowed = "move";
  if (row instanceof HTMLElement) {
    row.classList.add("notion-editor-page-row--dragging");
  }
}

function onWorkspacePageRowDragEnd() {
  workspacePageDnDActiveId = null;
  clearWorkspacePageListDropHints();
  notionWorkspacePageListEl
    ?.querySelectorAll(".notion-editor-page-row--dragging")
    .forEach((el) => {
      el.classList.remove("notion-editor-page-row--dragging");
    });
}

/**
 * @param {DragEvent} ev
 */
function onWorkspacePageRowDragOver(ev) {
  if (!workspacePageDnDActiveId) {
    return;
  }
  if (!(ev.currentTarget instanceof HTMLElement)) {
    return;
  }
  ev.preventDefault();
  try {
    ev.dataTransfer.dropEffect = "move";
  } catch {
    /* ignore */
  }
  clearWorkspacePageListDropHints();
  const row = ev.currentTarget;
  let zone = workspacePageRowDropZoneFromPointer(ev);
  if (row.dataset.pageId === WORKSPACE_TRASH_PAGE_ID && zone === "into") {
    zone = "before";
  }
  row.setAttribute("data-drop-hint", zone);
}

/**
 * @param {DragEvent} ev
 */
function onWorkspacePageRowDrop(ev) {
  if (!(ev.currentTarget instanceof HTMLElement)) {
    return;
  }
  ev.preventDefault();
  const dragId =
    workspacePageDnDActiveId ||
    workspacePageDragPayloadId(ev.dataTransfer?.getData("text/plain"));
  const targetId = ev.currentTarget.dataset.pageId?.trim() ?? "";
  if (!dragId || !targetId) {
    return;
  }
  const zone = workspacePageRowDropZoneFromPointer(ev);
  applyWorkspacePageDrop(dragId, targetId, zone);
  workspacePageDnDActiveId = null;
  clearWorkspacePageListDropHints();
  notionWorkspacePageListEl
    ?.querySelectorAll(".notion-editor-page-row--dragging")
    .forEach((el) => {
      el.classList.remove("notion-editor-page-row--dragging");
    });
}

let notionWorkspaceListenersBound = false;

function bindNotionWorkspaceChromeOnce() {
  if (notionWorkspaceListenersBound || !notionWorkspaceEl) {
    return;
  }
  notionWorkspaceListenersBound = true;

  notionWorkspaceNewPageBtn?.addEventListener("click", () => {
    newBlankNotionWorkspacePage();
  });

  notionWorkspacePageListEl?.addEventListener("dragover", (ev) => {
    if (workspacePageDnDActiveId) {
      ev.preventDefault();
    }
  });

  notionWorkspacePageListEl?.addEventListener("click", (ev) => {
    const tgt = /** @type {Element} */ (ev.target);

    const expandHit = tgt.closest(".notion-editor-page-children-toggle");
    if (
      expandHit instanceof HTMLButtonElement &&
      expandHit.dataset.workspaceExpandId
    ) {
      ev.preventDefault();
      ev.stopPropagation();
      toggleWorkspaceSidebarBranch(
        expandHit.dataset.workspaceExpandId.trim(),
      );
      return;
    }

    const closeHit = tgt.closest(".notion-editor-page-remove");
    if (
      closeHit instanceof HTMLButtonElement &&
      closeHit.dataset.workspaceCloseId &&
      !closeHit.disabled &&
      closeHit.hidden !== true
    ) {
      ev.preventDefault();
      ev.stopPropagation();
      moveNotionWorkspacePageToTrash(closeHit.dataset.workspaceCloseId.trim());
      return;
    }

    const tab = tgt.closest(".notion-editor-page-btn");
    if (!(tab instanceof HTMLButtonElement)) {
      return;
    }
    const wid = tab.dataset.workspaceId ?? "";
    if (!wid.trim()) {
      return;
    }
    activateNotionWorkspacePage(wid.trim());
  });

  notionTrashListMountEl?.addEventListener("click", (ev) => {
    const tgt = /** @type {Element} */ (ev.target);
    const restoreHit = tgt.closest("[data-workspace-restore-id]");
    if (
      restoreHit instanceof HTMLButtonElement &&
      restoreHit.dataset.workspaceRestoreId
    ) {
      ev.preventDefault();
      ev.stopPropagation();
      restoreNotionWorkspacePageFromTrash(
        restoreHit.dataset.workspaceRestoreId.trim(),
      );
      return;
    }
    const purgeHit = tgt.closest("[data-workspace-trash-purge-id]");
    if (
      purgeHit instanceof HTMLButtonElement &&
      purgeHit.dataset.workspaceTrashPurgeId
    ) {
      ev.preventDefault();
      ev.stopPropagation();
      permanentlyDeleteTrashedWorkspacePage(
        purgeHit.dataset.workspaceTrashPurgeId.trim(),
      );
    }
  });

  notionWorkspaceEl.addEventListener("click", (ev) => {
    const sub = ev.target.closest(".notion-ws-subpage-link");
    if (
      sub instanceof HTMLButtonElement &&
      sub.dataset.workspaceId &&
      !sub.disabled
    ) {
      ev.preventDefault();
      activateNotionWorkspacePage(sub.dataset.workspaceId.trim());
    }
  });

  notionWorkspaceEl.addEventListener(
    "input",
    (ev) => {
      const tg = ev.target;
      if (tg instanceof HTMLInputElement && tg.classList.contains("notion-blank-title")) {
        const pane = tg.closest("[data-workspace-id]");
        if (!(pane instanceof HTMLElement)) {
          return;
        }
        const pid = pane.dataset.workspaceId ?? "";
        syncNotionWorkspacePageSidebarLabel(pid, tg.value.trim() || "Untitled");
        syncWorkspaceSubpageEmbedForParentsOfDescendant(pid);
        scheduleBlankWorkspacePersist(pid);
        return;
      }
      if (tg instanceof Element) {
        const bodyEl = tg.closest(".notion-blank-body");
        if (bodyEl instanceof HTMLElement) {
          const pane = bodyEl.closest("[data-workspace-id]");
          if (pane instanceof HTMLElement) {
            scheduleBlankWorkspacePersist(pane.dataset.workspaceId ?? "");
          }
        }
      }
    },
    true,
  );

  notionWorkspaceEl.addEventListener(
    "blur",
    (ev) => {
      const tg = ev.target;
      if (!(tg instanceof HTMLInputElement)) {
        return;
      }
      if (!tg.classList.contains("notion-blank-title")) {
        return;
      }
      const pane = tg.closest("[data-workspace-id]");
      if (!(pane instanceof HTMLElement)) {
        return;
      }
      const pid = pane.dataset.workspaceId ?? "";
      const pg = notionWorkspacePagesState.find((x) => x.id === pid);
      if (!pg || pg.kind !== "blank") {
        return;
      }
      const tid = blankWorkspacePersistTimers[pid];
      if (tid != null) {
        window.clearTimeout(tid);
      }
      delete blankWorkspacePersistTimers[pid];
      persistBlankWorkspacePageSnapshotNow(pid);
    },
    true,
  );

  notionWorkspaceEl.addEventListener(
    "focusout",
    (ev) => {
      const tg = ev.target;
      if (!(tg instanceof Element)) {
        return;
      }
      const bodyEl = tg.closest(".notion-blank-body");
      if (!(bodyEl instanceof HTMLElement)) {
        return;
      }
      const rt = ev.relatedTarget;
      if (rt instanceof Node && bodyEl.contains(rt)) {
        return;
      }
      const pane = bodyEl.closest("[data-workspace-id]");
      if (!(pane instanceof HTMLElement)) {
        return;
      }
      const pid = pane.dataset.workspaceId ?? "";
      const tid = blankWorkspacePersistTimers[pid];
      if (tid != null) {
        window.clearTimeout(tid);
      }
      delete blankWorkspacePersistTimers[pid];
      persistBlankWorkspacePageSnapshotNow(pid);
    },
    true,
  );

  /** Hour-long sweeps plus tab focus refresh so Trash expires without a reload. */
  const TRASH_RETENTION_TICK_MS = 60 * 60 * 1000;
  window.setInterval(() => {
    const beforeLen = notionWorkspaceTrashState.length;
    purgeTrashPastRetentionMs();
    if (notionWorkspaceTrashState.length !== beforeLen) {
      renderNotionWorkspacePageList();
    }
  }, TRASH_RETENTION_TICK_MS);

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") {
      return;
    }
    const beforeLen = notionWorkspaceTrashState.length;
    purgeTrashPastRetentionMs();
    if (notionWorkspaceTrashState.length !== beforeLen) {
      renderNotionWorkspacePageList();
    }
  });
}

function payslipNotionLinksNewRowKey() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `pnl-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * @param {unknown} v
 * @returns {PayslipNotionLinkRow | null}
 */
function sanitizePayslipNotionLinkRow(v) {
  if (!v || typeof v !== "object") {
    return null;
  }
  const o = /** @type {Record<string, unknown>} */ (v);
  const rowKeyRaw = o.rowKey != null ? String(o.rowKey).trim() : "";
  const rowKey = rowKeyRaw || payslipNotionLinksNewRowKey();
  return {
    rowKey,
    givenName: String(o.givenName ?? "")
      .trim()
      .slice(0, 200),
    familyName: String(o.familyName ?? "")
      .trim()
      .slice(0, 200),
    notionRecordId: String(o.notionRecordId ?? "")
      .trim()
      .slice(0, 200),
  };
}

function savePayslipNotionLinkRowsToStorage(skipCloudSync = false) {
  if (!skipCloudSync) {
    void syncPayslipNotionLinksToSupabaseIfPossible();
  }
}

/**
 * Push current in-memory rows to Supabase (admin session + RLS).
 */
async function syncPayslipNotionLinksToSupabaseIfPossible() {
  try {
    if (typeof window.teacherAuth?.syncPayslipNotionPersonLinksForAdmin !== "function") {
      return;
    }
    const { error } =
      await window.teacherAuth.syncPayslipNotionPersonLinksForAdmin(
        payslipNotionLinkRows,
      );
    if (error) {
      console.warn("payslip notion links Supabase sync:", error);
    }
  } catch (e) {
    console.warn("payslip notion links Supabase sync:", e);
  }
}

/**
 * Load from Supabase when admin and data exists; otherwise starts empty until signed in.
 * If cloud is empty but legacy local rows existed, uploads once to Supabase.
 */
async function loadPayslipNotionLinksHybrid() {
  let usedCloud = false;
  try {
    if (
      typeof window.teacherAuth?.fetchPayslipNotionPersonLinksForAdmin ===
      "function"
    ) {
      const res = await window.teacherAuth.fetchPayslipNotionPersonLinksForAdmin();
      if (res?.ok && Array.isArray(res.rows)) {
        if (res.rows.length > 0) {
          payslipNotionLinkRows = [];
          const seen = new Set();
          for (const raw of res.rows) {
            const q = sanitizePayslipNotionLinkRow(raw);
            if (q && !seen.has(q.rowKey)) {
              seen.add(q.rowKey);
              payslipNotionLinkRows.push(q);
            }
          }
          savePayslipNotionLinkRowsToStorage(true);
          usedCloud = true;
        } else {
          payslipNotionLinkRows = [];
          try {
            const raw = window.localStorage.getItem(PAYSLIP_NOTION_LINK_ROWS_KEY);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (Array.isArray(parsed)) {
                const seen = new Set();
                for (const row of parsed) {
                  const q = sanitizePayslipNotionLinkRow(row);
                  if (q && !seen.has(q.rowKey)) {
                    seen.add(q.rowKey);
                    payslipNotionLinkRows.push(q);
                  }
                }
              }
            }
          } catch {
            payslipNotionLinkRows = [];
          }
          if (payslipNotionLinkRows.length > 0) {
            const { error } =
              await window.teacherAuth.syncPayslipNotionPersonLinksForAdmin(
                payslipNotionLinkRows,
              );
            if (error) {
              console.warn("payslip notion links migrate to Supabase:", error);
            }
          }
          try {
            window.localStorage.removeItem(PAYSLIP_NOTION_LINK_ROWS_KEY);
          } catch {
            /* ignore */
          }
          usedCloud = true;
        }
      }
    }
  } catch (e) {
    console.warn("payslip notion links cloud load:", e);
  }
  if (!usedCloud) {
    payslipNotionLinkRows = [];
  }
}

/**
 * Loose match for Notion page / row IDs (hyphens, case, stray spaces stripped).
 * @param {unknown} raw
 * @returns {string} hexadecimal signature, or empty if too short / invalid.
 */
function normalizeNotionRecordIdForMatch(raw) {
  const s = String(raw ?? "").trim().toLowerCase();
  if (!s) {
    return "";
  }
  const hex = s.replace(/[^a-f0-9]/g, "");
  if (hex.length >= 24) {
    return hex;
  }
  if (hex.length >= 8) {
    return hex;
  }
  return "";
}

/** @returns {Set<string>} */
function normalizedNotionIdSetFromPayslipLinkRows() {
  const set = new Set();
  for (const row of payslipNotionLinkRows) {
    const n = normalizeNotionRecordIdForMatch(row.notionRecordId);
    if (n.length) {
      set.add(n);
    }
  }
  return set;
}

/**
 * @param {unknown} wants
 * @param {unknown} pageIdCandidate
 */
function notionPageIdsLooselyMatch(wants, pageIdCandidate) {
  const wb = normalizeNotionRecordIdForMatch(wants);
  const pb = normalizeNotionRecordIdForMatch(pageIdCandidate);
  return Boolean(wb && pb && wb === pb);
}

/** @returns {readonly PayslipNotionLinkRow[]} */
function payslipNotionLinksMatchingRawTableRowIndex(rawRowIdx) {
  const ids = rawTable.pageIds;
  if (!Array.isArray(ids) || rawRowIdx < 0 || rawRowIdx >= ids.length) {
    return [];
  }
  const pageRaw = ids[rawRowIdx];
  if (!normalizeNotionRecordIdForMatch(pageRaw)) {
    return [];
  }
  return payslipNotionLinkRows.filter((link) =>
    notionPageIdsLooselyMatch(link.notionRecordId, pageRaw),
  );
}

/** Raw row indexes (full table) whose `pageIds[i]` correspond to IDs in mapping table. */
function rawTableIndicesMatchingStoredPayslipNotionIds() {
  const want = normalizedNotionIdSetFromPayslipLinkRows();
  if (!want.size) {
    return [];
  }
  return rawTable.rows
    .map((_, i) => i)
    .filter((i) => rawTableRowIndexMatchesPayslipNotionNormalizedSet(i, want));
}

/**
 * @param {number} rawRowIdx
 * @param {Set<string>} normalizedWant hex ids from mapping table
 */
function rawTableRowIndexMatchesPayslipNotionNormalizedSet(
  rawRowIdx,
  normalizedWant,
) {
  if (!(normalizedWant instanceof Set) || normalizedWant.size === 0) {
    return false;
  }
  const ids = rawTable.pageIds;
  if (!Array.isArray(ids) || rawRowIdx < 0 || rawRowIdx >= ids.length) {
    return false;
  }
  const n = normalizeNotionRecordIdForMatch(ids[rawRowIdx]);
  return Boolean(n && normalizedWant.has(n));
}

/**
 * After school/date/sort filtering, optionally keep rows that map to pasted IDs.
 * @param {number[]} indices indexes into rawTable.rows
 */
function narrowRowIndicesByPayslipNotionMappedIds(indices) {
  if (!readPayslipNotionRestrictMappedPref()) {
    return indices;
  }
  const want = normalizedNotionIdSetFromPayslipLinkRows();
  if (!want.size) {
    return indices;
  }
  return indices.filter((i) =>
    rawTableRowIndexMatchesPayslipNotionNormalizedSet(i, want),
  );
}

function readPayslipNotionRestrictMappedPref() {
  try {
    return payslipAppStateGetItem(PAYSLIP_NOTION_RESTRICT_MAPPED_KEY) === "1";
  } catch {
    return false;
  }
}

/** @param {boolean} on */
function persistPayslipNotionRestrictMappedPref(on) {
  try {
    payslipAppStateSetItem(PAYSLIP_NOTION_RESTRICT_MAPPED_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function mappedPayslipNotionRestrictionIsActiveNow() {
  return (
    readPayslipNotionRestrictMappedPref() &&
    normalizedNotionIdSetFromPayslipLinkRows().size > 0
  );
}

/** Normalize draft database title ↔ payslip links name match (lowercase / spaces). */
function normalizeFloatingReplicaTitleForPersonMatch(displayTitle) {
  return String(displayTitle ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Match database title against "Names and Notion row IDs" table (given + surname, or lone name fields).
 * @param {string} displayTitle Visible database title (`contenteditable`).
 * @returns {string} Raw Notion row id field from mapping, or empty.
 */
function notionPersonRecordIdMatchingFloatingReplicaTitle(displayTitle) {
  collectPayslipNotionLinksFromDom();
  const want = normalizeFloatingReplicaTitleForPersonMatch(displayTitle);
  if (!want) {
    return "";
  }
  for (const row of payslipNotionLinkRows) {
    const recordNorm = normalizeNotionRecordIdForMatch(row.notionRecordId);
    if (!recordNorm) {
      continue;
    }
    const full = normalizeFloatingReplicaTitleForPersonMatch(
      `${row.givenName} ${row.familyName}`,
    );
    if (full && full === want) {
      return row.notionRecordId.trim().slice(0, 200);
    }
    const gn = normalizeFloatingReplicaTitleForPersonMatch(row.givenName);
    const fn = normalizeFloatingReplicaTitleForPersonMatch(row.familyName);
    if (fn === "" && gn === want) {
      return row.notionRecordId.trim().slice(0, 200);
    }
    if (gn === "" && fn === want) {
      return row.notionRecordId.trim().slice(0, 200);
    }
  }
  return "";
}

/** True when this draft may use Payslip Names & Notion row IDs (table present in markup). Applies to drafts on any workspace page, not only Pay slips sidebar. */
function floatingReplicaIsOnPaySlipsSidebarPage(rep) {
  return (
    !!rep &&
    payslipNotionLinksTbodyEl instanceof HTMLElement
  );
}

/** @param {string} normHex normalized id from `normalizeNotionRecordIdForMatch` */
function findPaySlipMainRawRowIndexForNormalizedNotionId(normHex) {
  if (!normHex) {
    return -1;
  }
  const ids = rawTable.pageIds;
  if (!Array.isArray(ids)) {
    return -1;
  }
  for (let i = 0; i < ids.length; i++) {
    if (normalizeNotionRecordIdForMatch(ids[i]) === normHex) {
      return i;
    }
  }
  return -1;
}

/**
 * Replace floating replica data with one or more Notion rows (columns + cell matrix).
 * @returns {boolean}
 */
function applyHydratedFloatingReplicaShadowFromNotionMirror(
  rep,
  columns,
  rowsFromNotion,
  pageIdsFromNotion,
  linkedFallbackNormHex,
) {
  const ncol = columns.length;
  if (!ncol || !Array.isArray(rowsFromNotion)) {
    return false;
  }

  /** @type {string[][]} */
  const paddedRows = rowsFromNotion.map((row) => {
    const cells = Array.isArray(row) ? row : [];
    const padded = [];
    for (let c = 0; c < ncol; c++) {
      const v = cells[c];
      padded.push(v == null ? "" : String(v).slice(0, 8000));
    }
    return padded;
  });

  if (!paddedRows.length) {
    paddedRows.push(Array.from({ length: ncol }, () => ""));
  }

  /** @type {string[]} */
  let pids =
    Array.isArray(pageIdsFromNotion) && pageIdsFromNotion.length
      ? pageIdsFromNotion.map((id) =>
          id == null ? "" : String(id).trim().slice(0, 280),
        )
      : [];

  while (pids.length < paddedRows.length) {
    pids.push(floatingReplicaNewRowId());
  }
  if (pids.length > paddedRows.length) {
    pids = pids.slice(0, paddedRows.length);
  }

  ensureFloatingReplicaSysTimeShadowFields(rep);

  /** @type {Set<string>} */
  const preservedHidden = new Set();
  if (rep.shadow.hiddenNames.has(FLOATING_REPLICA_SYS_TIME_CREATED_MENU_COL)) {
    preservedHidden.add(FLOATING_REPLICA_SYS_TIME_CREATED_MENU_COL);
  }
  if (rep.shadow.hiddenNames.has(FLOATING_REPLICA_SYS_TIME_EDITED_MENU_COL)) {
    preservedHidden.add(FLOATING_REPLICA_SYS_TIME_EDITED_MENU_COL);
  }

  rep.shadow.columns = columns.map((nm) =>
    nm == null ? "" : String(nm).slice(0, 240),
  );
  rep.shadow.hiddenNames = preservedHidden;
  rep.shadow.colWidths = new Map();
  /** @type {FloatingPaySlipReplica["shadow"]["columnKinds"]} */
  rep.shadow.columnKinds = rep.shadow.columns.map((nm, idx) =>
    inferFloatingReplicaPropKind(rep.shadow.columns, idx, nm),
  );
  ensureFloatingReplicaShadowColumnKinds(rep);

  rep.shadow.rows = paddedRows;
  rep.shadow.pageIds = pids;

  rep.shadow.linkedNotionPageId = normalizeNotionRecordIdForMatch(
    typeof linkedFallbackNormHex === "string" ? linkedFallbackNormHex : "",
  );

  const nowTs = Date.now();
  rep.shadow.rowCreatedMs = paddedRows.map(() => nowTs);
  rep.shadow.rowEditedMs = paddedRows.map(() => nowTs);
  return true;
}

/**
 * Rebuild replica columns/values from linked Notion row (drops property-level hidden cols; preserves created/edited hides).
 * @returns {boolean}
 */
function applyHydratedFloatingReplicaShadowFromLinkedNotion(
  rep,
  columns,
  rowCells,
  pageIdForReplica,
  linkedFallbackNormHex,
) {
  const ncol = columns.length;
  if (!ncol || !Array.isArray(rowCells)) {
    return false;
  }
  const pid =
    pageIdForReplica == null
      ? ""
      : String(pageIdForReplica).trim().slice(0, 280);
  return applyHydratedFloatingReplicaShadowFromNotionMirror(
    rep,
    columns,
    [rowCells],
    pid ? [pid] : [],
    linkedFallbackNormHex,
  );
}

function payslipMappedFilterRefreshSheetIfPossible() {
  if (!rawTable.columns.length) {
    return;
  }
  applyFiltersAndRender();
}

function collectPayslipNotionLinksFromDom() {
  if (!payslipNotionLinksTbodyEl) {
    return;
  }
  /** @type {PayslipNotionLinkRow[]} */
  const out = [];
  for (const tr of payslipNotionLinksTbodyEl.querySelectorAll(
    "tr[data-link-row-key]",
  )) {
    const inputs =
      /** @type {HTMLInputElement[]} */
      ([
        ...tr.querySelectorAll("input.payslip-notion-links-input"),
      ]);
    const [givenIn, familyIn, idIn] = inputs;
    let key =
      typeof tr.dataset.linkRowKey === "string"
        ? tr.dataset.linkRowKey.trim()
        : "";
    if (!key) {
      key = payslipNotionLinksNewRowKey();
      tr.dataset.linkRowKey = key;
    }
    const q = sanitizePayslipNotionLinkRow({
      rowKey: key,
      givenName: givenIn instanceof HTMLInputElement ? givenIn.value : "",
      familyName: familyIn instanceof HTMLInputElement ? familyIn.value : "",
      notionRecordId: idIn instanceof HTMLInputElement ? idIn.value : "",
    });
    if (q) {
      out.push(q);
    }
  }
  payslipNotionLinkRows = out;
}

function schedulePersistPayslipNotionLinksFromInputs() {
  window.clearTimeout(payslipNotionLinksDirtyTimer);
  payslipNotionLinksDirtyTimer = window.setTimeout(() => {
    collectPayslipNotionLinksFromDom();
    savePayslipNotionLinkRowsToStorage();
    syncFilterToolbarUi();
    payslipMappedFilterRefreshSheetIfPossible();
  }, 260);
}

/**
 * @param {PayslipNotionLinkRow} row
 */
function buildPayslipNotionLinksTableRowEl(row) {
  const tr = document.createElement("tr");
  tr.dataset.linkRowKey = row.rowKey;

  const tdGiven = document.createElement("td");
  const givenIn = document.createElement("input");
  givenIn.type = "text";
  givenIn.className = "payslip-notion-links-input";
  givenIn.placeholder = "Name";
  givenIn.value = row.givenName;
  givenIn.autocomplete = "off";
  givenIn.spellcheck = true;
  givenIn.setAttribute("aria-label", "Name");
  tdGiven.appendChild(givenIn);

  const tdFamily = document.createElement("td");
  const familyIn = document.createElement("input");
  familyIn.type = "text";
  familyIn.className = "payslip-notion-links-input";
  familyIn.placeholder = "Surname";
  familyIn.value = row.familyName;
  familyIn.autocomplete = "off";
  familyIn.spellcheck = true;
  familyIn.setAttribute("aria-label", "Surname");
  tdFamily.appendChild(familyIn);

  const tdId = document.createElement("td");
  const idIn = document.createElement("input");
  idIn.type = "text";
  idIn.className =
    "payslip-notion-links-input payslip-notion-links-input--id";
  idIn.placeholder = "Notion row / page UUID";
  idIn.value = row.notionRecordId;
  idIn.autocomplete = "off";
  idIn.spellcheck = false;
  idIn.setAttribute("aria-label", "Notion database row ID");

  tdId.appendChild(idIn);

  const tdRm = document.createElement("td");
  tdRm.className = "payslip-notion-links-td-action";

  const rm = document.createElement("button");
  rm.type = "button";
  rm.className = "payslip-notion-links-remove";
  rm.dataset.payslipLinkRemove = row.rowKey;
  rm.textContent = "Remove";
  const personLabel =
    [row.givenName, row.familyName].filter(Boolean).join(" ").trim() || "person";
  rm.setAttribute(
    "aria-label",
    `Remove row for ${personLabel}`,
  );
  tdRm.appendChild(rm);

  tr.appendChild(tdGiven);
  tr.appendChild(tdFamily);
  tr.appendChild(tdId);
  tr.appendChild(tdRm);

  return tr;
}

function renderPayslipNotionLinksTableBody() {
  if (!payslipNotionLinksTbodyEl) {
    return;
  }
  payslipNotionLinksTbodyEl.replaceChildren();
  for (const row of payslipNotionLinkRows) {
    const q = sanitizePayslipNotionLinkRow(row);
    if (!q) {
      continue;
    }
    payslipNotionLinksTbodyEl.appendChild(buildPayslipNotionLinksTableRowEl(q));
  }
}

function addEmptyPayslipNotionLinksRowAndPersist() {
  const next =
    sanitizePayslipNotionLinkRow({
      rowKey: payslipNotionLinksNewRowKey(),
      givenName: "",
      familyName: "",
      notionRecordId: "",
    }) ?? null;
  if (!next) {
    return;
  }
  payslipNotionLinkRows.push(next);
  savePayslipNotionLinkRowsToStorage();
  renderPayslipNotionLinksTableBody();
  syncFilterToolbarUi();
  payslipMappedFilterRefreshSheetIfPossible();
}

function removePayslipNotionLinkRowByKey(rowKeyRaw) {
  const k =
    typeof rowKeyRaw === "string" ? rowKeyRaw.trim() : "";
  if (!k) {
    return;
  }
  payslipNotionLinkRows = payslipNotionLinkRows.filter((x) => x.rowKey !== k);
  savePayslipNotionLinkRowsToStorage();
  renderPayslipNotionLinksTableBody();
  syncFilterToolbarUi();
  payslipMappedFilterRefreshSheetIfPossible();
}

function bindPayslipNotionLinksChromeOnce() {
  if (payslipNotionLinksChromeBound) {
    return;
  }
  if (
    !payslipNotionLinksSectionEl ||
    !payslipNotionLinksTbodyEl ||
    !payslipNotionLinksAddRowBtn
  ) {
    return;
  }

  payslipNotionLinksChromeBound = true;
  void loadPayslipNotionLinksHybrid().then(() => {
    renderPayslipNotionLinksTableBody();
    if (payslipNotionRestrictSheetMappedEl instanceof HTMLInputElement) {
      payslipNotionRestrictSheetMappedEl.checked =
        readPayslipNotionRestrictMappedPref();
    }
  });

  if (payslipNotionRestrictSheetMappedEl instanceof HTMLInputElement) {
    payslipNotionRestrictSheetMappedEl.addEventListener("change", () => {
      persistPayslipNotionRestrictMappedPref(
        payslipNotionRestrictSheetMappedEl.checked,
      );
      syncFilterToolbarUi();
      payslipMappedFilterRefreshSheetIfPossible();
    });
  }

  payslipNotionLinksSectionEl.addEventListener("input", () => {
    schedulePersistPayslipNotionLinksFromInputs();
  });

  payslipNotionLinksSectionEl.addEventListener(
    "click",
    (ev) => {
      const tgt = /** @type {Element} */ (ev.target);
      const rmBtn = tgt.closest("[data-payslip-link-remove]");
      if (!(rmBtn instanceof HTMLButtonElement)) {
        return;
      }
      const key = rmBtn.dataset.payslipLinkRemove ?? "";
      if (!key.trim()) {
        return;
      }
      ev.preventDefault();
      removePayslipNotionLinkRowByKey(key.trim());
    },
  );

  payslipNotionLinksAddRowBtn.addEventListener(
    "click",
    () => {
      addEmptyPayslipNotionLinksRowAndPersist();
    },
  );

  payslipNotionLinksSectionEl.addEventListener(
    "blur",
    (ev) => {
      const tg = ev.target;
      if (!(tg instanceof HTMLInputElement)) {
        return;
      }
      if (!tg.closest("#payslipNotionLinksSection")) {
        return;
      }
      collectPayslipNotionLinksFromDom();
      savePayslipNotionLinkRowsToStorage();
      syncFilterToolbarUi();
      payslipMappedFilterRefreshSheetIfPossible();
    },
    true,
  );
}

/** Call once — builds editor sidebar pages and restores the last-open pane. */
function initNotionWorkspace() {
  if (
    !notionWorkspaceEl ||
    !notionWorkspacePageListEl ||
    !notionTrashListMountEl ||
    !notionWsPaneTrashEl ||
    !notionWsPaneVaultEl ||
    !notionWsPaneVaultNotionLinksEl
  ) {
    return;
  }

  bindNotionWorkspaceChromeOnce();
  loadNotionWorkspacePages();
  notionWorkspacePagesState.forEach((p) => {
    if (p.kind === "blank") {
      ensureBlankWorkspacePane(p);
    }
  });
  syncWorkspaceSubpageEmbedsForAllParents();
  repairStrayFloatingDraftDatasheetMounts();
  /** Restore floating DBs for every page so a non-active route is not skipped on cold start. */
  for (const p of notionWorkspacePagesState) {
    if (p.kind !== "trash") {
      ensureFloatingDraftsHydratedForWorkspacePage(p.id);
    }
  }
  enforceFloatingReplicasLiveOnTheirWorkspacePages();
  activateNotionWorkspacePage(
    notionWorkspaceActiveId ?? WORKSPACE_PAYSLIPS_PAGE_ID,
  );
  applyStoredEditorSidebarCollapse();
  syncEditorSidebarToggleChrome();
}

/**
 * @param {boolean} on
 */
function setTeacherNavMode(on) {
  isTeacherNavMode = on;
  if (appMainEl) {
    appMainEl.classList.toggle("teacher-nav-portal", Boolean(on));
  }
  if (navAdminHomeGroup) {
    navAdminHomeGroup.hidden = on;
  }
  if (navOpenWorkspaceDashboard) {
    navOpenWorkspaceDashboard.hidden = on;
  }
  if (navGoTeachers) {
    navGoTeachers.hidden = on;
  }
  if (navTeacherPortalGroup) {
    navTeacherPortalGroup.hidden = !on;
  }
  if (!on) {
    navTeacherGoDashboard?.classList.remove("active");
    navTeacherGoProfile?.classList.remove("active");
    navTeacherGoPaySlips?.classList.remove("active");
  }
  if (navRoleLabel) {
    navRoleLabel.textContent = on ? "TEACHER" : "Admin";
  }
  syncEditorSidebarToggleChrome();
  syncNavOpenWorkspaceDashboardActive();
}

/**
 * @param {"home" | "teachers" | "payslips" | "dashboard" | "teachers-pay-slips"} page
 */
function showAppPage(page) {
  flushAllFloatingDraftPersistence();
  if (isTeacherNavMode) {
    const teacherPage = normalizeTeacherNavPage(
      page === "home" ? "dashboard" : String(page),
    );
    try {
      sessionStorage.setItem(APP_NAV_PAGE_KEY, teacherPage);
    } catch {
      /* ignore */
    }
    if (pageTeachersPaySlipsHubEl) {
      pageTeachersPaySlipsHubEl.hidden = false;
    }
    if (pageHomeEl) {
      pageHomeEl.hidden = true;
    }
    if (teachersPaySlipsHubTitle) {
      teachersPaySlipsHubTitle.textContent =
        teacherPage === "dashboard"
          ? "Dashboard"
          : teacherPage === "teachers"
            ? "Profile"
            : "Pay slips";
    }
    if (pageTeacherDashboardEl) {
      pageTeacherDashboardEl.hidden = teacherPage !== "dashboard";
    }
    if (pageTeacherPaySlipsEl) {
      pageTeacherPaySlipsEl.hidden = teacherPage !== "payslips";
    }
    if (pageTeachersEl) {
      pageTeachersEl.hidden = teacherPage !== "teachers";
    }
    navGoHome?.classList.remove("active");
    navGoTeachers?.classList.remove("active");
    syncTeacherPortalNavActive(teacherPage);
    syncNavOpenWorkspaceDashboardActive();
    if (navTeacherDashboardRefreshGroup) {
      navTeacherDashboardRefreshGroup.hidden = false;
    }
    closeNavMenu();
    if (adminTeachersPanel) {
      adminTeachersPanel.hidden = true;
    }
    if (teacherOwnProfileWrap) {
      teacherOwnProfileWrap.hidden = false;
    }
    if (teacherPage === "dashboard") {
      void loadTeacherDashboard();
    } else if (teacherPage === "teachers") {
      void loadTeacherProfile();
    } else {
      void loadTeacherPaySlips();
    }
    syncEditorSidebarToggleChrome();
    return;
  }
  /** @type {"home" | "teachers"} */
  const target = page === "teachers" ? "teachers" : "home";
  try {
    sessionStorage.setItem(APP_NAV_PAGE_KEY, target);
  } catch {
    /* ignore */
  }
  const hubForAdminTeachers = target === "teachers";
  const hubOpen = hubForAdminTeachers;
  if (pageTeachersPaySlipsHubEl) {
    pageTeachersPaySlipsHubEl.hidden = !hubOpen;
  }
  if (pageHomeEl) {
    pageHomeEl.hidden = target !== "home";
  }
  if (hubOpen && teachersPaySlipsHubTitle) {
    teachersPaySlipsHubTitle.textContent = "Teachers directory";
  }
  if (pageTeacherDashboardEl) {
    pageTeacherDashboardEl.hidden = true;
  }
  if (pageTeacherPaySlipsEl) {
    pageTeacherPaySlipsEl.hidden = true;
  }
  if (pageTeachersEl) {
    pageTeachersEl.hidden = !hubOpen;
  }
  navGoHome?.classList.toggle("active", target === "home");
  navGoTeachers?.classList.toggle("active", target === "teachers");
  syncNavOpenWorkspaceDashboardActive();
  if (navTeacherDashboardRefreshGroup) {
    navTeacherDashboardRefreshGroup.hidden =
      target !== "home" && target !== "teachers";
  }
  closeNavMenu();
  if (hubForAdminTeachers) {
    resetTeacherProfileForm();
    if (teacherOwnProfileWrap) {
      teacherOwnProfileWrap.hidden = true;
    }
    if (adminTeachersPanel) {
      adminTeachersPanel.hidden = false;
    }
    if (teacherProfileError) {
      teacherProfileError.hidden = true;
      teacherProfileError.textContent = "";
    }
    loadAdminTeachersList();
  }
  syncEditorSidebarToggleChrome();
}

function applyStoredAppPage() {
  showAppPage(readStoredNavPage());
}

function hideTeacherProfileError() {
  if (teacherProfileError) {
    teacherProfileError.hidden = true;
    teacherProfileError.textContent = "";
  }
}

function setTeacherProfileError(msg) {
  if (!teacherProfileError) {
    return;
  }
  if (msg) {
    teacherProfileError.textContent = msg;
    teacherProfileError.hidden = false;
  } else {
    teacherProfileError.hidden = true;
    teacherProfileError.textContent = "";
  }
}

function clearTeacherProfileDl() {
  if (teacherProfileDl) {
    teacherProfileDl.innerHTML = "";
  }
}

/**
 * @param {string} label
 * @param {string} value
 */
function appendTeacherDetail(label, value) {
  if (!teacherProfileDl) {
    return;
  }
  const raw = typeof value === "string" ? value : "";
  const display = raw.trim() ? raw : "—";
  const dt = document.createElement("dt");
  dt.textContent = label;
  const dd = document.createElement("dd");
  dd.textContent = display;
  teacherProfileDl.appendChild(dt);
  teacherProfileDl.appendChild(dd);
}

/**
 * @param {string} iso
 */
function formatTeacherDateLabel(iso) {
  if (!iso || typeof iso !== "string") {
    return "";
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  try {
    return d.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

function revokeTeacherAvatarPreview() {
  if (teacherAvatarPreviewObjectUrl) {
    URL.revokeObjectURL(teacherAvatarPreviewObjectUrl);
    teacherAvatarPreviewObjectUrl = null;
  }
}

function setTeacherProfileFormMessage(text, kind) {
  if (!teacherProfileFormMessage) {
    return;
  }
  if (!text) {
    teacherProfileFormMessage.hidden = true;
    teacherProfileFormMessage.textContent = "";
    teacherProfileFormMessage.classList.remove("is-ok", "is-err");
    return;
  }
  teacherProfileFormMessage.hidden = false;
  teacherProfileFormMessage.textContent = text;
  teacherProfileFormMessage.classList.toggle("is-ok", kind === "ok");
  teacherProfileFormMessage.classList.toggle("is-err", kind === "err");
}

function resetTeacherProfileForm() {
  revokeTeacherAvatarPreview();
  if (teacherProfileForm) {
    teacherProfileForm.hidden = true;
  }
  if (teacherFirstName) {
    teacherFirstName.value = "";
  }
  if (teacherLastName) {
    teacherLastName.value = "";
  }
  if (teacherContactEmail) {
    teacherContactEmail.value = "";
  }
  if (teacherPhoneNumber) {
    teacherPhoneNumber.value = "";
  }
  if (teacherBankDetails) {
    teacherBankDetails.value = "";
  }
  if (teacherNationalId) {
    teacherNationalId.value = "";
  }
  if (teacherAvatarFile) {
    teacherAvatarFile.value = "";
  }
  if (teacherProfileSaveBtn) {
    teacherProfileSaveBtn.disabled = false;
  }
  setTeacherProfileFormMessage("", null);
}

/**
 * @param {Record<string, unknown> | null} row
 * @param {string} fallbackName
 */
function teacherDisplayName(row, fallbackName) {
  if (row && typeof row === "object") {
    const fn =
      typeof row.first_name === "string" ? row.first_name.trim() : "";
    const ln =
      typeof row.last_name === "string" ? row.last_name.trim() : "";
    const combined = `${fn} ${ln}`.trim();
    if (combined) {
      return combined;
    }
    const legacy =
      typeof row.full_name === "string" ? row.full_name.trim() : "";
    if (legacy) {
      return legacy;
    }
  }
  if (typeof fallbackName === "string" && fallbackName.trim()) {
    return fallbackName.trim();
  }
  return "—";
}

/**
 * @param {string} url
 * @param {string} [version]
 */
function teacherAvatarDisplayUrl(url, version) {
  if (!url || typeof url !== "string") {
    return "";
  }
  if (!version || typeof version !== "string") {
    return url;
  }
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}profile_v=${encodeURIComponent(version)}`;
}

/**
 * @param {Record<string, unknown> | null | undefined} row
 * @param {string} key
 */
function teacherProfileTextFromRow(row, key) {
  if (!row || typeof row !== "object") {
    return "";
  }
  const v = row[key];
  if (v == null) {
    return "";
  }
  if (typeof v === "string") {
    return v;
  }
  return String(v);
}

/**
 * @param {Record<string, unknown> | null} row
 */
function teacherNameFieldsFromRow(row) {
  let fn = "";
  let ln = "";
  if (row && typeof row === "object") {
    if (typeof row.first_name === "string") {
      fn = row.first_name;
    }
    if (typeof row.last_name === "string") {
      ln = row.last_name;
    }
    if (!fn.trim() && !ln.trim() && typeof row.full_name === "string") {
      const full = row.full_name.trim();
      const sp = full.indexOf(" ");
      if (sp === -1) {
        fn = full;
      } else {
        fn = full.slice(0, sp).trim();
        ln = full.slice(sp + 1).trim();
      }
    }
  }
  return { fn: fn.trim(), ln: ln.trim() };
}

function setAdminTeachersError(msg) {
  if (!adminTeachersError) {
    return;
  }
  if (msg) {
    adminTeachersError.textContent = msg;
    adminTeachersError.hidden = false;
  } else {
    adminTeachersError.hidden = true;
    adminTeachersError.textContent = "";
  }
}

/**
 * Online dot for an admin row: based on `teachers.last_seen_at` heartbeat.
 * @param {string} lastSeenIso `last_seen_at` ISO string from the row (may be empty).
 * @returns {{ kind: "online" | "offline" | "unknown"; tooltip: string }}
 */
function computeAdminTeachersPresence(lastSeenIso) {
  if (!lastSeenIso) {
    return { kind: "unknown", tooltip: "Never seen online" };
  }
  const t = Date.parse(lastSeenIso);
  if (!Number.isFinite(t)) {
    return { kind: "unknown", tooltip: "Never seen online" };
  }
  const ageMs = Date.now() - t;
  const human = describeAdminPresenceAge(ageMs, lastSeenIso);
  if (ageMs >= 0 && ageMs <= TEACHER_PRESENCE_ONLINE_WINDOW_MS) {
    return { kind: "online", tooltip: `Online — last seen ${human}` };
  }
  return { kind: "offline", tooltip: `Offline — last seen ${human}` };
}

/**
 * @param {number} ageMs
 * @param {string} lastSeenIso
 */
function describeAdminPresenceAge(ageMs, lastSeenIso) {
  if (!Number.isFinite(ageMs) || ageMs < 0) {
    return formatTeacherDateLabel(lastSeenIso) || "just now";
  }
  const sec = Math.round(ageMs / 1000);
  if (sec < 60) {
    return `${sec}s ago`;
  }
  const min = Math.round(sec / 60);
  if (min < 60) {
    return `${min}m ago`;
  }
  const hr = Math.round(min / 60);
  if (hr < 24) {
    return `${hr}h ago`;
  }
  const fallback = formatTeacherDateLabel(lastSeenIso);
  if (fallback) {
    return fallback;
  }
  const day = Math.round(hr / 24);
  return `${day}d ago`;
}

async function loadAdminTeachersList() {
  setAdminTeachersError("");
  if (adminTeachersCount) {
    adminTeachersCount.hidden = true;
    adminTeachersCount.textContent = "";
  }
  if (adminTeachersEmpty) {
    adminTeachersEmpty.hidden = true;
  }
  if (adminTeachersTableWrap) {
    adminTeachersTableWrap.hidden = true;
  }
  if (adminTeachersTbody) {
    adminTeachersTbody.innerHTML = "";
  }
  if (adminTeachersLoading) {
    adminTeachersLoading.hidden = false;
  }

  if (typeof window.teacherAuth?.listTeachersForAdmin !== "function") {
    if (adminTeachersLoading) {
      adminTeachersLoading.hidden = true;
    }
    if (adminTeachersCount) {
      adminTeachersCount.hidden = true;
    }
    setAdminTeachersError("Teacher list is not available in this view.");
    return;
  }

  try {
    const result = await window.teacherAuth.listTeachersForAdmin();
    if (adminTeachersLoading) {
      adminTeachersLoading.hidden = true;
    }
    if (!result.ok) {
      setAdminTeachersError(result.error || "Could not load teachers.");
      if (adminTeachersCount) {
        adminTeachersCount.hidden = true;
      }
      return;
    }
    const teachers = result.teachers || [];
    if (teachers.length === 0) {
      if (adminTeachersCount) {
        adminTeachersCount.hidden = true;
      }
      if (adminTeachersEmpty) {
        adminTeachersEmpty.hidden = false;
      }
      return;
    }
    if (adminTeachersCount) {
      const n = teachers.length;
      adminTeachersCount.textContent = `${n} teacher${n === 1 ? "" : "s"}`;
      adminTeachersCount.hidden = false;
    }
    if (adminTeachersTableWrap) {
      adminTeachersTableWrap.hidden = false;
    }
    if (!adminTeachersTbody) {
      return;
    }
    for (const row of teachers) {
      const tr = document.createElement("tr");
      const name = teacherDisplayName(
        row && typeof row === "object"
          ? /** @type {Record<string, unknown>} */ (row)
          : null,
        "",
      );

      const tdStatus = document.createElement("td");
      tdStatus.className = "admin-teachers-presence-cell";
      const dot = document.createElement("span");
      dot.className = "admin-teachers-presence-dot";
      const lastSeenIso =
        row &&
        typeof row === "object" &&
        typeof row.last_seen_at === "string" &&
        row.last_seen_at.trim()
          ? row.last_seen_at.trim()
          : "";
      const presence = computeAdminTeachersPresence(lastSeenIso);
      dot.classList.add(`admin-teachers-presence-dot--${presence.kind}`);
      dot.setAttribute("aria-label", presence.tooltip);
      dot.title = presence.tooltip;
      tdStatus.appendChild(dot);

      const tdPhoto = document.createElement("td");
      const av =
        row &&
        typeof row === "object" &&
        typeof row.avatar_url === "string" &&
        row.avatar_url.trim();
      if (av) {
        const ver =
          typeof row.updated_at === "string" ? row.updated_at : "";
        const img = document.createElement("img");
        img.className = "admin-teachers-cell-avatar";
        img.alt = "";
        img.src = teacherAvatarDisplayUrl(av, ver);
        tdPhoto.appendChild(img);
      } else {
        tdPhoto.textContent = "—";
      }

      const tdName = document.createElement("td");
      tdName.textContent = name && name !== "—" ? name : "—";

      const tdEmail = document.createElement("td");
      tdEmail.textContent =
        row &&
        typeof row === "object" &&
        typeof row.email === "string" &&
        row.email.trim()
          ? row.email.trim()
          : "—";

      const tdJoined = document.createElement("td");
      tdJoined.textContent = formatTeacherDateLabel(
        row &&
          typeof row === "object" &&
          typeof row.created_at === "string"
          ? row.created_at
          : "",
      );

      const tdUpd = document.createElement("td");
      tdUpd.textContent = formatTeacherDateLabel(
        row &&
          typeof row === "object" &&
          typeof row.updated_at === "string"
          ? row.updated_at
          : "",
      );

      tr.appendChild(tdStatus);
      tr.appendChild(tdPhoto);
      tr.appendChild(tdName);
      tr.appendChild(tdEmail);
      tr.appendChild(tdJoined);
      tr.appendChild(tdUpd);
      adminTeachersTbody.appendChild(tr);
    }
  } catch (e) {
    if (adminTeachersLoading) {
      adminTeachersLoading.hidden = true;
    }
    if (adminTeachersCount) {
      adminTeachersCount.hidden = true;
    }
    setAdminTeachersError(
      e instanceof Error ? e.message : String(e),
    );
  }
}

adminTeachersRefreshBtn?.addEventListener("click", async () => {
  if (
    !(adminTeachersRefreshBtn instanceof HTMLButtonElement) ||
    adminTeachersRefreshBtn.disabled
  ) {
    return;
  }
  adminTeachersRefreshBtn.disabled = true;
  adminTeachersRefreshBtn.setAttribute("aria-busy", "true");
  try {
    await loadAdminTeachersList();
  } finally {
    adminTeachersRefreshBtn.disabled = false;
    adminTeachersRefreshBtn.removeAttribute("aria-busy");
  }
});

/** @type {Record<string, unknown> | null} */
let lastTeacherProfileRowForNotion = null;

function resetTeacherProfileNotionLinkUi() {
  lastTeacherProfileRowForNotion = null;
  if (teacherProfileNotionDotBtn) {
    teacherProfileNotionDotBtn.hidden = true;
    teacherProfileNotionDotBtn.classList.remove(
      "teacher-profile-notion-dot--ok",
      "teacher-profile-notion-dot--err",
    );
    teacherProfileNotionDotBtn.classList.add("teacher-profile-notion-dot--unknown");
    teacherProfileNotionDotBtn.setAttribute("aria-expanded", "false");
    teacherProfileNotionDotBtn.removeAttribute("title");
  }
  if (teacherProfileNotionReveal) {
    teacherProfileNotionReveal.hidden = true;
  }
  if (teacherProfileNotionRevealDl) {
    teacherProfileNotionRevealDl.replaceChildren();
  }
}

/**
 * @param {"ok" | "err" | "unknown"} kind
 */
function setTeacherProfileNotionDotState(kind) {
  const btn = teacherProfileNotionDotBtn;
  if (!btn) {
    return;
  }
  btn.classList.remove(
    "teacher-profile-notion-dot--ok",
    "teacher-profile-notion-dot--err",
    "teacher-profile-notion-dot--unknown",
  );
  if (kind === "ok") {
    btn.classList.add("teacher-profile-notion-dot--ok");
  } else if (kind === "err") {
    btn.classList.add("teacher-profile-notion-dot--err");
  } else {
    btn.classList.add("teacher-profile-notion-dot--unknown");
  }
}

/**
 * @param {Record<string, unknown> | null | undefined} profileRow
 * @param {{
 *   ok?: boolean;
 *   noEmail?: boolean;
 *   message?: string;
 *   notionDatabaseId?: string;
 *   notionDataSourceId?: string;
 * }} fetchResult
 */
function renderTeacherProfileNotionRevealDl(profileRow, fetchResult) {
  if (!teacherProfileNotionRevealDl) {
    return;
  }
  teacherProfileNotionRevealDl.replaceChildren();
  const row = profileRow && typeof profileRow === "object" ? profileRow : {};
  const appendPair = (label, value) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    teacherProfileNotionRevealDl.appendChild(dt);
    teacherProfileNotionRevealDl.appendChild(dd);
  };
  const nd =
    typeof row.notion_database_id === "string"
      ? row.notion_database_id.trim()
      : row.notion_database_id != null
        ? String(row.notion_database_id).trim()
        : "";
  const ns =
    typeof row.notion_data_source_id === "string"
      ? row.notion_data_source_id.trim()
      : row.notion_data_source_id != null
        ? String(row.notion_data_source_id).trim()
        : "";
  appendPair(
    "Notion database ID (your profile)",
    nd || "Not set — the app default database is used when empty.",
  );
  appendPair(
    "Notion data source ID (your profile)",
    ns || "Not set",
  );
  const ok = Boolean(fetchResult?.ok && !fetchResult?.noEmail);
  appendPair(
    "Pay-slip query (same as Dashboard / Pay slips)",
    ok
      ? "Succeeded — Notion responded for this sign-in."
      : fetchResult?.noEmail
        ? "Failed — no sign-in email."
        : `Failed — ${fetchResult?.message || "Unknown error"}`,
  );
  const effDb =
    fetchResult?.notionDatabaseId != null
      ? String(fetchResult.notionDatabaseId).trim()
      : "";
  const effDs =
    fetchResult?.notionDataSourceId != null
      ? String(fetchResult.notionDataSourceId).trim()
      : "";
  appendPair(
    "Resolved database ID (last query)",
    effDb || "—",
  );
  appendPair("Resolved data source ID (last query)", effDs || "—");
}

/**
 * Hover tooltip: resolved Notion IDs only (same as last pay-slip query).
 * @param {{
 *   notionDatabaseId?: string;
 *   notionDataSourceId?: string;
 * }} fetched
 */
function teacherProfileNotionDotTooltipFromFetch(fetched) {
  const raw = fetched && typeof fetched === "object" ? fetched : {};
  const db =
    raw.notionDatabaseId != null ? String(raw.notionDatabaseId).trim() : "";
  const ds =
    raw.notionDataSourceId != null
      ? String(raw.notionDataSourceId).trim()
      : "";
  const parts = [];
  if (db) {
    parts.push(db);
  }
  if (ds && ds !== db) {
    parts.push(ds);
  }
  return parts.join(" ");
}

/**
 * @param {Record<string, unknown> | null | undefined} profileRow
 * @param {{ force?: boolean }} [opts]
 */
async function refreshTeacherProfileNotionLinkUi(profileRow, opts) {
  if (!isTeacherNavMode || !teacherProfileNotionDotBtn) {
    return;
  }
  const nm = teacherProfileName?.textContent?.trim() ?? "";
  if (!nm || nm === "…" || nm === "—") {
    resetTeacherProfileNotionLinkUi();
    return;
  }
  lastTeacherProfileRowForNotion =
    profileRow && typeof profileRow === "object" ? profileRow : {};
  teacherProfileNotionDotBtn.hidden = false;
  setTeacherProfileNotionDotState("unknown");
  const force = Boolean(opts?.force);
  const fetched = await fetchTeacherPaySlipTable({ force });
  const connected = Boolean(fetched.ok && !fetched.noEmail);
  setTeacherProfileNotionDotState(connected ? "ok" : "err");
  renderTeacherProfileNotionRevealDl(
    lastTeacherProfileRowForNotion,
    fetched,
  );
  const tip = teacherProfileNotionDotTooltipFromFetch(fetched);
  if (teacherProfileNotionDotBtn) {
    if (tip) {
      teacherProfileNotionDotBtn.setAttribute("title", tip);
    } else {
      teacherProfileNotionDotBtn.removeAttribute("title");
    }
  }
}

async function loadTeacherProfile() {
  revokeTeacherAvatarPreview();
  setTeacherProfileFormMessage("", null);
  resetTeacherProfileNotionLinkUi();
  if (teacherAvatarFile) {
    teacherAvatarFile.value = "";
  }
  if (teacherProfileForm) {
    teacherProfileForm.hidden = true;
  }

  hideTeacherProfileError();
  clearTeacherProfileDl();
  if (teacherProfileName) {
    teacherProfileName.textContent = "…";
  }
  if (teacherProfileAvatar) {
    teacherProfileAvatar.hidden = true;
    teacherProfileAvatar.removeAttribute("src");
  }

  if (typeof window.teacherAuth?.getTeacherProfileState !== "function") {
    setTeacherProfileError("Sign-in is not available in this view.");
    resetTeacherProfileForm();
    return;
  }

  try {
    const state = await window.teacherAuth.getTeacherProfileState();
    if (state.kind === "not_configured") {
      setTeacherProfileError("Supabase is not configured.");
      if (teacherProfileName) {
        teacherProfileName.textContent = "—";
      }
      resetTeacherProfileForm();
      return;
    }
    if (state.kind === "auth_error") {
      setTeacherProfileError(state.message);
      if (teacherProfileName) {
        teacherProfileName.textContent = "—";
      }
      resetTeacherProfileForm();
      return;
    }
    if (state.kind === "not_signed_in") {
      setTeacherProfileError("You are not signed in.");
      if (teacherProfileName) {
        teacherProfileName.textContent = "—";
      }
      resetTeacherProfileForm();
      return;
    }

    const meta = state.user_metadata || {};
    const fallbackName =
      typeof meta.full_name === "string"
        ? meta.full_name
        : typeof meta.name === "string"
          ? meta.name
          : "";
    const fallbackEmail =
      typeof state.email === "string" ? state.email : "";

    const pic =
      typeof meta.avatar_url === "string"
        ? meta.avatar_url
        : typeof meta.picture === "string"
          ? meta.picture
          : "";
    if (teacherProfileAvatar && pic) {
      teacherProfileAvatar.src = pic;
      teacherProfileAvatar.hidden = false;
    }

    if (state.rowError) {
      const hint =
        /first_name|last_name|bank_details|national_id|phone_number|schema cache|column/i.test(
          state.rowError,
        )
          ? " If you recently updated the app, run the latest supabase/migrations scripts (e.g. 002_teacher_profile.sql, 005_teacher_bank_id.sql, 006_teacher_phone.sql, 007_payslip_notion_person_links.sql, 008_payslip_app_user_state.sql) in the Supabase SQL editor."
          : "";
      setTeacherProfileError(`${state.rowError}${hint}`);
      if (teacherProfileName) {
        teacherProfileName.textContent = teacherDisplayName(null, fallbackName);
      }
      if (teacherProfileForm && state.row) {
        const partialRow = state.row;
        const names = teacherNameFieldsFromRow(partialRow);
        if (teacherFirstName) {
          teacherFirstName.value = names.fn;
        }
        if (teacherLastName) {
          teacherLastName.value = names.ln;
        }
        const partialEmail =
          (typeof partialRow.email === "string" && partialRow.email) ||
          fallbackEmail;
        if (teacherContactEmail) {
          teacherContactEmail.value = partialEmail;
        }
        if (teacherPhoneNumber) {
          teacherPhoneNumber.value = teacherProfileTextFromRow(
            partialRow,
            "phone_number",
          );
        }
        if (teacherBankDetails) {
          teacherBankDetails.value = teacherProfileTextFromRow(
            partialRow,
            "bank_details",
          );
        }
        if (teacherNationalId) {
          teacherNationalId.value = teacherProfileTextFromRow(
            partialRow,
            "national_id",
          );
        }
        teacherProfileForm.hidden = false;
      }
      void refreshTeacherProfileNotionLinkUi(state.row || {}, {
        force: false,
      });
      return;
    }

    const row = state.row;
    const displayName = teacherDisplayName(row, fallbackName);
    if (teacherProfileName) {
      teacherProfileName.textContent = displayName;
    }
    const rowEmail =
      (row && typeof row.email === "string" && row.email) ||
      fallbackEmail;

    const rowPicRaw =
      (row && typeof row.avatar_url === "string" && row.avatar_url) ||
      pic;
    const ver =
      row && typeof row.updated_at === "string" ? row.updated_at : "";
    const rowPic = teacherAvatarDisplayUrl(rowPicRaw, ver);
    if (teacherProfileAvatar && rowPic) {
      teacherProfileAvatar.src = rowPic;
      teacherProfileAvatar.hidden = false;
    } else if (teacherProfileAvatar) {
      teacherProfileAvatar.hidden = true;
      teacherProfileAvatar.removeAttribute("src");
    }

    if (!row) {
      setTeacherProfileError(
        "Your profile row is not in the database yet. Ask an admin to confirm the sign-up trigger ran in Supabase, or open the SQL migration in the project and run it.",
      );
      resetTeacherProfileForm();
      void refreshTeacherProfileNotionLinkUi({}, { force: false });
      return;
    }

    const names = teacherNameFieldsFromRow(row);
    if (teacherFirstName) {
      teacherFirstName.value = names.fn;
    }
    if (teacherLastName) {
      teacherLastName.value = names.ln;
    }
    if (teacherContactEmail) {
      teacherContactEmail.value = rowEmail;
    }
    if (teacherPhoneNumber) {
      teacherPhoneNumber.value = teacherProfileTextFromRow(
        row,
        "phone_number",
      );
    }
    if (teacherBankDetails) {
      teacherBankDetails.value = teacherProfileTextFromRow(
        row,
        "bank_details",
      );
    }
    if (teacherNationalId) {
      teacherNationalId.value = teacherProfileTextFromRow(
        row,
        "national_id",
      );
    }
    if (teacherProfileForm) {
      teacherProfileForm.hidden = false;
    }

    if (
      row.updated_at &&
      row.created_at &&
      row.updated_at !== row.created_at
    ) {
      appendTeacherDetail(
        "Profile updated",
        formatTeacherDateLabel(
          typeof row.updated_at === "string" ? row.updated_at : "",
        ),
      );
    }
    void refreshTeacherProfileNotionLinkUi(row, { force: false });
  } catch (e) {
    setTeacherProfileError(
      e instanceof Error ? e.message : String(e),
    );
    resetTeacherProfileNotionLinkUi();
    if (teacherProfileName) {
      teacherProfileName.textContent = "—";
    }
    resetTeacherProfileForm();
  }
}

teacherAvatarFile?.addEventListener("change", () => {
  revokeTeacherAvatarPreview();
  const f = teacherAvatarFile.files?.[0];
  if (f && teacherProfileAvatar) {
    teacherAvatarPreviewObjectUrl = URL.createObjectURL(f);
    teacherProfileAvatar.src = teacherAvatarPreviewObjectUrl;
    teacherProfileAvatar.hidden = false;
  }
});

teacherProfileNotionDotBtn?.addEventListener("click", () => {
  if (!teacherProfileNotionDotBtn || teacherProfileNotionDotBtn.hidden) {
    return;
  }
  const rev = teacherProfileNotionReveal;
  if (!rev) {
    return;
  }
  const wasHidden = rev.hidden;
  rev.hidden = !wasHidden;
  teacherProfileNotionDotBtn.setAttribute(
    "aria-expanded",
    wasHidden ? "true" : "false",
  );
  if (wasHidden) {
    void refreshTeacherProfileNotionLinkUi(
      lastTeacherProfileRowForNotion ?? {},
      { force: true },
    );
  }
});

teacherProfileForm?.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  if (
    typeof window.teacherAuth?.updateTeacherProfile !== "function" ||
    typeof window.teacherAuth?.uploadTeacherAvatar !== "function"
  ) {
    setTeacherProfileFormMessage("Saving is not available in this view.", "err");
    return;
  }
  if (teacherProfileSaveBtn) {
    teacherProfileSaveBtn.disabled = true;
  }
  setTeacherProfileFormMessage("", null);

  const firstName = teacherFirstName ? teacherFirstName.value : "";
  const lastName = teacherLastName ? teacherLastName.value : "";
  const contactEmail = teacherContactEmail
    ? teacherContactEmail.value.trim()
    : "";
  const phoneNumber = teacherPhoneNumber ? teacherPhoneNumber.value.trim() : "";
  const bankDetails = teacherBankDetails ? teacherBankDetails.value.trim() : "";
  const nationalId = teacherNationalId ? teacherNationalId.value.trim() : "";
  const file = teacherAvatarFile?.files?.[0] ?? null;

  const { error: nameErr } = await window.teacherAuth.updateTeacherProfile({
    firstName,
    lastName,
    contactEmail,
    phoneNumber,
    bankDetails,
    nationalId,
  });
  if (nameErr) {
    setTeacherProfileFormMessage(nameErr, "err");
    if (teacherProfileSaveBtn) {
      teacherProfileSaveBtn.disabled = false;
    }
    return;
  }

  if (file) {
    let buf;
    try {
      buf = await file.arrayBuffer();
    } catch (readErr) {
      setTeacherProfileFormMessage(
        readErr instanceof Error ? readErr.message : String(readErr),
        "err",
      );
      if (teacherProfileSaveBtn) {
        teacherProfileSaveBtn.disabled = false;
      }
      return;
    }
    const { error: upErr } = await window.teacherAuth.uploadTeacherAvatar({
      data: buf,
      contentType: file.type || "image/jpeg",
    });
    if (upErr) {
      setTeacherProfileFormMessage(upErr, "err");
      if (teacherProfileSaveBtn) {
        teacherProfileSaveBtn.disabled = false;
      }
      return;
    }
  }

  revokeTeacherAvatarPreview();
  if (teacherAvatarFile) {
    teacherAvatarFile.value = "";
  }
  setTeacherProfileFormMessage("Saved.", "ok");
  const savedPhone = phoneNumber;
  const savedBank = bankDetails;
  const savedNational = nationalId;
  await loadTeacherProfile();
  if (
    savedPhone.trim() &&
    teacherPhoneNumber &&
    !teacherPhoneNumber.value.trim()
  ) {
    teacherPhoneNumber.value = savedPhone;
  }
  if (
    savedBank.trim() &&
    teacherBankDetails &&
    !teacherBankDetails.value.trim()
  ) {
    teacherBankDetails.value = savedBank;
  }
  if (
    savedNational.trim() &&
    teacherNationalId &&
    !teacherNationalId.value.trim()
  ) {
    teacherNationalId.value = savedNational;
  }
  if (teacherProfileSaveBtn) {
    teacherProfileSaveBtn.disabled = false;
  }
});

themeToggleEl?.addEventListener("click", () => {
  toggleTheme();
  closeNavMenu();
});

authThemeToggle?.addEventListener("click", () => {
  toggleTheme();
});
navMenuBtn?.addEventListener("click", (ev) => {
  ev.stopPropagation();
  toggleNavMenu();
});
navMenuBackdrop?.addEventListener("click", closeNavMenu);

navGoHome?.addEventListener("click", () => {
  showAppPage("home");
});
navOpenWorkspaceDashboard?.addEventListener("click", () => {
  openWorkspaceDashboardInSidebar();
});
navGoTeachers?.addEventListener("click", () => {
  showAppPage("teachers");
});

navTeacherGoDashboard?.addEventListener("click", () => {
  showAppPage("dashboard");
});
navTeacherGoProfile?.addEventListener("click", () => {
  showAppPage("teachers");
});
navTeacherGoPaySlips?.addEventListener("click", () => {
  showAppPage("payslips");
});

toggleEditorSidebarBtn?.addEventListener("click", () => {
  if (!notionWorkspaceEl || toggleEditorSidebarBtn.hidden) {
    return;
  }
  const nowCollapsed = notionWorkspaceEl.classList.toggle(
    "notion-workspace--sidebar-collapsed",
  );
  persistEditorSidebarCollapsed(nowCollapsed);
  if (nowCollapsed) {
    notionEditorSidebarEl?.setAttribute("aria-hidden", "true");
  } else {
    notionEditorSidebarEl?.removeAttribute("aria-hidden");
  }
  refreshEditorSidebarToggleButtonState();
});

notionWsPanesRootEl?.addEventListener("click", (ev) => {
  const t = /** @type {Element | null} */ (ev.target);
  if (
    t instanceof Element &&
    t.closest("[data-floating-replica-prop-menu-toggle]")
  ) {
    return;
  }
  collapseEditorSidebarIfOpen();
});

navTeacherDashboardRefreshBtn?.addEventListener("click", () => {
  void globalRefreshNotionConnections();
});

navRestartAppBtn?.addEventListener("click", () => {
  if (
    !window.confirm(
      "Restart the desktop app? The app will quit and reopen.",
    )
  ) {
    return;
  }
  closeNavMenu();
  if (typeof window.shellApi?.relaunchApp === "function") {
    void window.shellApi.relaunchApp();
    return;
  }
  setStatus("Restart requires the desktop app (Electron).", true);
});

function hiddenColsStorageKey() {
  if (activeAdminTeacherId == null) {
    return HIDDEN_COLS_KEY;
  }
  return `${HIDDEN_COLS_KEY}:${activeAdminTeacherId}`;
}

function droppedColsStorageKey() {
  if (activeAdminTeacherId == null) {
    return DROPPED_COLS_KEY;
  }
  return `${DROPPED_COLS_KEY}:${activeAdminTeacherId}`;
}

function columnOrderStorageKey() {
  if (activeAdminTeacherId == null) {
    return COLUMN_ORDER_KEY;
  }
  return `${COLUMN_ORDER_KEY}:${activeAdminTeacherId}`;
}

/**
 * Persist current column titles for the active view (main or per teacher).
 * @param {string[]} columnNames
 */
function saveColumnOrderPreference(columnNames) {
  try {
    if (!Array.isArray(columnNames) || columnNames.length === 0) {
      payslipAppStateRemoveItem(columnOrderStorageKey());
      return;
    }
    payslipAppStateSetItem(
      columnOrderStorageKey(),
      JSON.stringify(columnNames),
    );
  } catch {
    /* ignore */
  }
}

/** Reorders {@link rawTable} columns/cells using saved preference merged with API order. */
function applyStoredColumnOrderToRawTable() {
  const cols = rawTable.columns;
  const rows = rawTable.rows;
  const n = cols.length;
  if (n <= 1) {
    return;
  }

  /** @type {string[]} */
  let saved = [];
  try {
    const raw = payslipAppStateGetItem(columnOrderStorageKey());
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return;
    }
    saved = parsed.filter((x) => typeof x === "string");
    if (!saved.length) {
      return;
    }
  } catch {
    return;
  }

  const curSet = new Set(cols);
  /** @type {string[]} */
  const order = [];
  for (const name of saved) {
    if (curSet.has(name) && !order.includes(name)) {
      order.push(name);
    }
  }
  for (const name of cols) {
    if (!order.includes(name)) {
      order.push(name);
    }
  }

  if (order.length !== n || order.every((name, i) => name === cols[i])) {
    return;
  }

  const nameToOldIdx = new Map(cols.map((name, i) => [name, i]));

  cols.splice(0, cols.length, ...order);
  for (const row of rows) {
    if (!Array.isArray(row) || row.length < n) {
      continue;
    }
    const snap = row.slice(0, n);
    for (let j = 0; j < n; j++) {
      const oi = nameToOldIdx.get(order[j]);
      if (oi !== undefined) {
        row[j] = snap[oi];
      }
    }
  }
}

const MIN_COL_WIDTH_PX = 40;
const MAX_COL_WIDTH_PX = 900;

function columnWidthsStorageKey() {
  if (activeAdminTeacherId == null) {
    return COLUMN_WIDTHS_KEY;
  }
  return `${COLUMN_WIDTHS_KEY}:${activeAdminTeacherId}`;
}

/** @returns {Map<string, number>} Property name → width in px */
function parseColumnWidthMapFromStorage() {
  try {
    const raw = payslipAppStateGetItem(columnWidthsStorageKey());
    if (!raw) {
      return new Map();
    }
    const o = JSON.parse(raw);
    if (!o || typeof o !== "object" || Array.isArray(o)) {
      return new Map();
    }
    const m = new Map();
    for (const [k, v] of Object.entries(o)) {
      if (typeof k !== "string") {
        continue;
      }
      const n =
        typeof v === "number" ? v : Number.parseFloat(String(v ?? ""));
      if (!Number.isFinite(n)) {
        continue;
      }
      const w = Math.round(n);
      if (w >= MIN_COL_WIDTH_PX && w <= MAX_COL_WIDTH_PX) {
        m.set(k, w);
      }
    }
    return m;
  } catch {
    return new Map();
  }
}

/** @param {Map<string, number>} map */
function saveColumnWidthMapToStorage(map) {
  try {
    if (map.size === 0) {
      payslipAppStateRemoveItem(columnWidthsStorageKey());
      return;
    }
    const o = Object.fromEntries(map);
    payslipAppStateSetItem(columnWidthsStorageKey(), JSON.stringify(o));
  } catch {
    /* ignore */
  }
}

/** @returns {HTMLTableElement[]} */
function dataSheetTableRoots() {
  /** @type {HTMLTableElement[]} */
  const roots = [];
  if (tableEl) {
    roots.push(tableEl);
  }
  return roots;
}

/**
 * @returns {HTMLTableCellElement[]}
 */
function cellsWithColIndexInTable(tableRoot, colIndex) {
  const key = String(colIndex);
  /** @type {HTMLTableCellElement[]} */
  const out = [];
  if (!tableRoot) {
    return out;
  }
  for (const el of tableRoot.querySelectorAll(
    `th[data-col-index="${key}"], td[data-col-index="${key}"]`,
  )) {
    if (el instanceof HTMLTableCellElement) {
      out.push(el);
    }
  }
  return out;
}

/** Main Notion `#dataTable` cells only — keeps replica widths isolated. */
function dataSheetCellsForColumnIndex(colIndex) {
  return tableEl ? cellsWithColIndexInTable(tableEl, colIndex) : [];
}

/** @returns {number} */
function clampColSheetWidthPx(widthPx) {
  return Math.min(
    MAX_COL_WIDTH_PX,
    Math.max(MIN_COL_WIDTH_PX, Math.round(widthPx)),
  );
}

/** @returns {number} Clamped applied width */
function paintColumnWidthOntoCells(cells, widthPx) {
  const w = clampColSheetWidthPx(widthPx);
  for (const el of cells) {
    el.style.width = `${w}px`;
    el.style.minWidth = `${w}px`;
    el.style.maxWidth = "none";
    el.setAttribute("data-col-width-set", "1");
  }
  return w;
}

/** @returns {number} Clamped applied width */
function applyColumnWidthForTableRoot(tableRoot, colIndex, widthPx) {
  if (!tableRoot) {
    return clampColSheetWidthPx(widthPx);
  }
  const cells = cellsWithColIndexInTable(tableRoot, colIndex);
  return paintColumnWidthOntoCells(cells, widthPx);
}

/** @returns {number} Clamped applied width */
function applyColumnWidthToDom(colIndex, widthPx) {
  return applyColumnWidthForTableRoot(tableEl, colIndex, widthPx);
}

/** Apply saved widths after thead/tbody render (indexed by visible raw column index). */
function applyStoredColumnWidthsToSheet() {
  const m = parseColumnWidthMapFromStorage();
  if (m.size === 0 || !rawTable.columns?.length) {
    return;
  }
  const cols = rawTable.columns;
  const visible = getVisibleColumnIndices();
  for (const colIdx of visible) {
    const name = cols[colIdx];
    const w = m.get(name);
    if (w == null) {
      continue;
    }
    applyColumnWidthToDom(colIdx, w);
  }
}

/**
 * Column resize drag session (pointer).
 * @type {{
 *   pointerId: number;
 *   handleEl: HTMLElement;
 *   headerTh: HTMLElement;
 *   colName: string;
 *   colIndex: number;
 *   startX: number;
 *   startWidth: number;
 *   scrollParentEl: HTMLElement | null;
 *   tableRoot: HTMLTableElement;
 *   replicaId: string | null;
 * } | null}
 */
let columnResizeSession = null;

/** @type {HTMLDivElement | null} */
let columnResizeGuideEl = null;

function getOrCreateColumnResizeGuideEl() {
  if (!columnResizeGuideEl) {
    const el = document.createElement("div");
    el.className = "sheet-col-resize-guide";
    el.hidden = true;
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
    columnResizeGuideEl = el;
  }
  return columnResizeGuideEl;
}

function hideColumnResizeGuide() {
  if (columnResizeGuideEl) {
    columnResizeGuideEl.hidden = true;
  }
}

function syncColumnResizeGuidePosition() {
  if (!columnResizeSession) {
    return;
  }
  const th = columnResizeSession.headerTh;
  const guide = getOrCreateColumnResizeGuideEl();
  const r = th.getBoundingClientRect();
  const scrollHost =
    columnResizeSession.scrollParentEl?.getBoundingClientRect() ??
    tableScrollEl?.getBoundingClientRect();
  const bottom =
    scrollHost != null ? scrollHost.bottom : window.innerHeight;
  guide.hidden = false;
  guide.style.left = `${Math.round(r.right)}px`;
  guide.style.top = `${Math.round(r.top)}px`;
  guide.style.height = `${Math.max(0, Math.round(bottom - r.top))}px`;
}

function teardownColumnResizeSession() {
  if (!columnResizeSession) {
    return;
  }
  columnResizeSession.scrollParentEl?.removeEventListener(
    "scroll",
    syncColumnResizeGuidePosition,
  );
  window.removeEventListener("resize", syncColumnResizeGuidePosition);
  hideColumnResizeGuide();
  document.body.classList.remove("sheet-col-resizing");
  columnResizeSession.headerTh.classList.remove("th-col-resizing");
  document.removeEventListener("pointermove", onColumnResizePointerMove);
  document.removeEventListener("pointerup", onColumnResizePointerEnd);
  document.removeEventListener("pointercancel", onColumnResizePointerEnd);
  columnResizeSession = null;
}

/** @param {PointerEvent} ev */
function onColumnResizePointerMove(ev) {
  if (!columnResizeSession || ev.pointerId !== columnResizeSession.pointerId) {
    return;
  }
  ev.preventDefault();
  const dx = ev.clientX - columnResizeSession.startX;
  applyColumnWidthForTableRoot(
    columnResizeSession.tableRoot,
    columnResizeSession.colIndex,
    columnResizeSession.startWidth + dx,
  );
  syncColumnResizeGuidePosition();
}

/** @param {PointerEvent} ev */
function onColumnResizePointerEnd(ev) {
  if (!columnResizeSession || ev.pointerId !== columnResizeSession.pointerId) {
    return;
  }
  const session = columnResizeSession;
  const cells = cellsWithColIndexInTable(
    session.tableRoot,
    session.colIndex,
  );
  const th = cells.find((el) => el.tagName === "TH");
  const applied = th?.offsetWidth ?? session.startWidth;
  const w = Math.min(
    MAX_COL_WIDTH_PX,
    Math.max(MIN_COL_WIDTH_PX, Math.round(applied)),
  );
  applyColumnWidthForTableRoot(session.tableRoot, session.colIndex, w);
  if (session.replicaId) {
    const rep = paySlipFloatingReplicas.get(session.replicaId);
    if (rep) {
      rep.shadow.colWidths.set(session.colName, w);
    }
  } else {
    const merged = parseColumnWidthMapFromStorage();
    merged.set(session.colName, w);
    saveColumnWidthMapToStorage(merged);
  }
  try {
    session.handleEl.releasePointerCapture(ev.pointerId);
  } catch {
    /* ignore */
  }
  teardownColumnResizeSession();
}

/**
 * @param {HTMLElement} handleEl
 * @param {HTMLTableCellElement} headerTh
 * @param {string} colName
 * @param {number} colIndex
 * @param {string | null} [replicaId]
 */
function attachColumnResizeHandleListeners(
  handleEl,
  headerTh,
  colName,
  colIndex,
  replicaId = null,
) {
  handleEl.addEventListener("pointerdown", (ev) => {
    if (
      columnResizeSession ||
      (ev.pointerType === "mouse" && ev.button !== 0)
    ) {
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    const tableRootEl = headerTh.closest("table");
    if (!(tableRootEl instanceof HTMLTableElement)) {
      return;
    }
    const scrollParentEl =
      headerTh.closest(".table-scroll") ??
      tableScrollEl ??
      /** @type {HTMLElement | null} */ (null);
    columnResizeSession = {
      pointerId: ev.pointerId,
      handleEl,
      headerTh,
      colName,
      colIndex,
      startX: ev.clientX,
      startWidth: headerTh.offsetWidth,
      scrollParentEl,
      tableRoot: tableRootEl,
      replicaId: replicaId ?? null,
    };
    document.body.classList.add("sheet-col-resizing");
    headerTh.classList.add("th-col-resizing");
    try {
      handleEl.setPointerCapture(ev.pointerId);
    } catch {
      teardownColumnResizeSession();
      return;
    }
    syncColumnResizeGuidePosition();
    scrollParentEl?.addEventListener("scroll", syncColumnResizeGuidePosition, {
      passive: true,
    });
    window.addEventListener("resize", syncColumnResizeGuidePosition);
    document.addEventListener("pointermove", onColumnResizePointerMove);
    document.addEventListener("pointerup", onColumnResizePointerEnd);
    document.addEventListener("pointercancel", onColumnResizePointerEnd);
  });
}

function getHiddenColumnNames() {
  try {
    const raw = payslipAppStateGetItem(hiddenColsStorageKey());
    if (!raw) {
      return new Set();
    }
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) {
      return new Set();
    }
    return new Set(arr.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function setHiddenColumnNames(set) {
  try {
    payslipAppStateSetItem(hiddenColsStorageKey(), JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

function getDroppedColumnNames() {
  try {
    const raw = payslipAppStateGetItem(droppedColsStorageKey());
    if (!raw) {
      return new Set();
    }
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) {
      return new Set();
    }
    return new Set(arr.filter((x) => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function setDroppedColumnNames(set) {
  try {
    payslipAppStateSetItem(droppedColsStorageKey(), JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}

function persistCurrentAdminViewFilters() {
  if (
    activeAdminTeacherId == null ||
    !adminTeacherViews.has(activeAdminTeacherId)
  ) {
    return;
  }
  const v = adminTeacherViews.get(activeAdminTeacherId);
  if (!v) {
    return;
  }
  v.filterSchool = filterSchoolEl?.value ?? "";
  v.filterDate = filterDateEl?.value ?? "";
  v.filterSort = filterSortEl?.value ?? "";
  v.filterPanelExpanded = filterPanelExpanded;
}

/**
 * @param {Record<string, unknown>} row
 */
function teacherRowLabelFromDirectory(row) {
  const fn = row?.first_name;
  const ln = row?.last_name;
  const full = row?.full_name;
  const email = row?.email;
  const name = [fn, ln]
    .filter((x) => x != null && String(x).trim())
    .map((x) => String(x).trim())
    .join(" ")
    .trim();
  if (name) {
    return name;
  }
  if (full && String(full).trim()) {
    return String(full).trim();
  }
  if (email && String(email).trim()) {
    return String(email).trim();
  }
  return "Teacher";
}

function shortNotionIdHint(databaseId, dataSourceId) {
  const raw = databaseId || dataSourceId || "";
  const hex = String(raw).replace(/-/g, "");
  if (hex.length >= 8) {
    return `${hex.slice(0, 8)}…`;
  }
  const s = String(raw).trim();
  return s.length > 12 ? `${s.slice(0, 12)}…` : s || "Notion";
}

function renderTeacherViewTabs() {
  if (!teacherViewTabsEl) {
    return;
  }
  teacherViewTabsEl.replaceChildren();
  if (adminTeacherViews.size === 0) {
    teacherViewTabsEl.hidden = true;
    return;
  }
  teacherViewTabsEl.hidden = false;
  for (const [id, view] of adminTeacherViews) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "teacher-view-tab";
    btn.setAttribute("role", "tab");
    btn.dataset.teacherId = id;
    const selected = id === activeAdminTeacherId;
    btn.setAttribute("aria-selected", selected ? "true" : "false");
    btn.title = view.subtitle || view.label;
    btn.textContent = view.label;
    btn.addEventListener("click", () => {
      selectAdminTeacherTab(id);
    });
    teacherViewTabsEl.appendChild(btn);
  }
}

/**
 * @param {string} teacherId
 */
function selectAdminTeacherTab(teacherId) {
  if (!adminTeacherViews.has(teacherId)) {
    return;
  }
  persistCurrentAdminViewFilters();
  activeAdminTeacherId = teacherId;
  const v = adminTeacherViews.get(teacherId);
  if (!v) {
    return;
  }
  rawTable = v.rawTable;

  if (filterSchoolEl) {
    filterSchoolEl.value = v.filterSchool;
  }
  if (filterDateEl) {
    filterDateEl.value = v.filterDate;
  }
  if (filterSortEl) {
    filterSortEl.value = v.filterSort;
  }
  filterPanelExpanded = v.filterPanelExpanded;
  syncFilterToolbarUi();

  try {
    sessionStorage.setItem(ADMIN_ACTIVE_TEACHER_TAB_KEY, teacherId);
  } catch {
    /* ignore */
  }

  renderTeacherViewTabs();
  closeColumnMenu();

  if (v.loadError) {
    setStatus(v.loadError, true);
    if (tableEl) {
      tableEl.hidden = true;
    }
    if (tableSheetFooterEl) {
      tableSheetFooterEl.hidden = true;
    }
    if (tableLoadHintEl) {
      tableLoadHintEl.textContent = "";
    }
    return;
  }

  if (!rawTable.columns.length) {
    if (tableEl) {
      tableEl.hidden = true;
    }
    if (tableSheetFooterEl) {
      tableSheetFooterEl.hidden = true;
    }
    if (tableLoadHintEl) {
      tableLoadHintEl.textContent = "0 row(s) loaded.";
    }
    updateFilterGroupsVisibility();
    setStatus("", false);
    return;
  }

  pruneHiddenColumnsForCurrentTable();
  unhideEmailLikeColumnsForCurrentTable();
  pruneDroppedColumnsForCurrentTable();
  applyStoredColumnOrderToRawTable();
  applyDroppedColumnsToRawTable();
  pruneColumnWidthsToExistingColumns();
  populateSchoolOptions();
  updateFilterGroupsVisibility();
  applyFiltersAndRender();
  scheduleFloatingReplicaLinkedNotionResyncAfterMainPayslipTableLoad();
}

function rebuildSchoolQuickTabs() {
  updateSchoolTabsVisibility();
}

/**
 * @param {Array<Record<string, unknown>>} sections
 * @param {Array<{ key: string; label: string; databaseId?: string; dataSourceId?: string }>} sourcesMeta
 */
function ingestAdminTeacherNotionSections(sections, sourcesMeta) {
  adminTeacherViews.clear();
  const metaByKey = new Map(sourcesMeta.map((s) => [s.key, s]));

  for (const sec of sections) {
    const key = String(sec.key ?? "");
    const subtitleOk = shortNotionIdHint(
      typeof sec.databaseId === "string" ? sec.databaseId : "",
      typeof sec.dataSourceId === "string" ? sec.dataSourceId : "",
    );
    const ok = Boolean(sec.ok);
    const message =
      typeof sec.message === "string" ? sec.message : "";

    adminTeacherViews.set(key, {
      rawTable: {
        columns: Array.isArray(sec.columns) ? sec.columns : [],
        rows: Array.isArray(sec.rows) ? sec.rows : [],
        pageIds: Array.isArray(sec.pageIds) ? sec.pageIds : [],
      },
      filterSchool: "",
      filterDate: "",
      filterSort: "desc",
      filterPanelExpanded: false,
      label: String(
        sec.label ?? metaByKey.get(key)?.label ?? "Teacher",
      ),
      subtitle: ok ? `Notion ${subtitleOk}` : message,
      loadError: ok ? null : message || "Could not load database.",
      linked: ok,
    });
  }

  /** @type {string | null} */
  let pick = null;
  try {
    const stored = sessionStorage.getItem(ADMIN_ACTIVE_TEACHER_TAB_KEY);
    if (stored && adminTeacherViews.has(stored)) {
      pick = stored;
    }
  } catch {
    /* ignore */
  }
  if (!pick && adminTeacherViews.size > 0) {
    pick = adminTeacherViews.keys().next().value;
  }

  activeAdminTeacherId = pick;

  if (teacherViewTabsEl) {
    renderTeacherViewTabs();
  }

  if (!pick || !adminTeacherViews.has(pick)) {
    rawTable = { columns: [], rows: [], pageIds: [] };
    setStatus(
      "No teacher Notion databases linked. Add notion_database_id (or notion_data_source_id) on teacher rows in Supabase.",
      true,
    );
    if (tableEl) {
      tableEl.hidden = true;
    }
    if (tableSheetFooterEl) {
      tableSheetFooterEl.hidden = true;
    }
    if (tableScrollEl) {
      tableScrollEl.classList.remove("table-scroll--with-tabs");
    }
    return;
  }

  const v = adminTeacherViews.get(pick);
  if (!v) {
    return;
  }
  rawTable = v.rawTable;

  if (filterSchoolEl) {
    filterSchoolEl.value = v.filterSchool;
  }
  if (filterDateEl) {
    filterDateEl.value = v.filterDate;
  }
  if (filterSortEl) {
    filterSortEl.value = v.filterSort;
  }
  filterPanelExpanded = v.filterPanelExpanded;
  syncFilterToolbarUi();

  if (v.loadError) {
    setStatus(v.loadError, true);
    if (tableEl) {
      tableEl.hidden = true;
    }
    if (tableSheetFooterEl) {
      tableSheetFooterEl.hidden = true;
    }
    if (tableLoadHintEl) {
      tableLoadHintEl.textContent = "";
    }
    updateFilterGroupsVisibility();
    return;
  }

  if (!rawTable.columns.length) {
    tableEl.hidden = true;
    if (tableSheetFooterEl) {
      tableSheetFooterEl.hidden = true;
    }
    if (tableLoadHintEl) {
      tableLoadHintEl.textContent = "";
    }
    if (tableScrollEl) {
      tableScrollEl.classList.remove("table-scroll--with-tabs");
    }
    updateFilterGroupsVisibility();
    setStatus(
      "Database returned no columns. Check that the integration can access this database.",
      true,
    );
    return;
  }

  pruneHiddenColumnsForCurrentTable();
  unhideEmailLikeColumnsForCurrentTable();
  pruneDroppedColumnsForCurrentTable();
  applyStoredColumnOrderToRawTable();
  applyDroppedColumnsToRawTable();
  pruneColumnWidthsToExistingColumns();
  populateSchoolOptions();
  updateFilterGroupsVisibility();
  applyFiltersAndRender();
}

function pruneHiddenColumnsForCurrentTable() {
  const colSet = new Set(rawTable.columns);
  const h = getHiddenColumnNames();
  const next = new Set();
  let changed = false;
  for (const name of h) {
    if (colSet.has(name)) {
      next.add(name);
    } else {
      changed = true;
    }
  }
  if (changed) {
    setHiddenColumnNames(next);
  }
}

/** Matches notion-simplify isEmailLikeColumnName so new Email properties stay visible on the admin sheet. */
function isEmailLikeNotionColumnForUi(col) {
  const s = String(col).trim();
  if (!s) {
    return false;
  }
  if (/^e-?mails?$/i.test(s)) {
    return true;
  }
  if (/\b(e-?mails?|email\s+address)\b/i.test(s)) {
    return true;
  }
  if (/\be\s*mail\b/i.test(s)) {
    return true;
  }
  if (/\bemail\b/i.test(s)) {
    return true;
  }
  if (/\b(e-?mail|electronic\s+mail)\b/i.test(s)) {
    return true;
  }
  return (
    /\b(teacher|contact|work|staff|payee|pay\s*roll|payroll)\b/i.test(s) &&
    /\b(e-?mail|email)\b/i.test(s)
  );
}

function unhideEmailLikeColumnsForCurrentTable() {
  const hidden = getHiddenColumnNames();
  let changed = false;
  for (const name of rawTable.columns) {
    if (hidden.has(name) && isEmailLikeNotionColumnForUi(name)) {
      hidden.delete(name);
      changed = true;
    }
  }
  if (changed) {
    setHiddenColumnNames(hidden);
  }
}

function pruneDroppedColumnsForCurrentTable() {
  const colSet = new Set(rawTable.columns);
  const dropped = getDroppedColumnNames();
  const next = new Set();
  let changed = false;
  for (const name of dropped) {
    if (colSet.has(name)) {
      next.add(name);
    } else {
      changed = true;
    }
  }
  if (changed) {
    setDroppedColumnNames(next);
  }
}

function applyDroppedColumnsToRawTable() {
  const dropped = getDroppedColumnNames();
  if (!dropped.size) {
    return;
  }
  const cols = rawTable.columns;
  const rows = rawTable.rows;
  const removeIdx = [];
  for (let i = 0; i < cols.length; i++) {
    if (dropped.has(cols[i])) {
      removeIdx.push(i);
    }
  }
  if (!removeIdx.length) {
    return;
  }
  for (let j = removeIdx.length - 1; j >= 0; j--) {
    const idx = removeIdx[j];
    cols.splice(idx, 1);
    for (const row of rows) {
      if (Array.isArray(row) && row.length > idx) {
        row.splice(idx, 1);
      }
    }
  }
}

/** Drop width prefs for columns that no longer exist in {@link rawTable}. */
function pruneColumnWidthsToExistingColumns() {
  const m = parseColumnWidthMapFromStorage();
  if (m.size === 0) {
    return;
  }
  const colSet = new Set(rawTable.columns);
  let changed = false;
  const next = new Map(m);
  for (const name of m.keys()) {
    if (!colSet.has(name)) {
      next.delete(name);
      changed = true;
    }
  }
  if (changed) {
    saveColumnWidthMapToStorage(next);
  }
}

function getVisibleColumnIndicesFor(columns, hiddenNames) {
  /** @type {number[]} */
  const inds = [];
  const hidden =
    hiddenNames instanceof Set ? hiddenNames : new Set(hiddenNames ?? []);
  for (let i = 0; i < columns.length; i += 1) {
    if (!hidden.has(columns[i])) {
      inds.push(i);
    }
  }
  return inds;
}

function getVisibleColumnIndices() {
  return getVisibleColumnIndicesFor(rawTable.columns, getHiddenColumnNames());
}

function updateShowAllColumnsBtnVisibilityForButton(btn) {
  if (!btn) {
    return;
  }
  const nh = getHiddenColumnNames().size;
  btn.hidden = nh === 0;
  const label =
    nh === 1 ? "Show hidden columns (1)" : `Show hidden columns (${nh})`;
  btn.title =
    nh === 0
      ? ""
      : "Reveal columns you hid locally only—does not fetch from Notion (use Refresh). Deleted columns cannot be restored here.";
  btn.setAttribute("aria-label", label);
  btn.classList.toggle("filter-toggle--active", nh > 0);
}

function updateShowAllColumnsBtnVisibility() {
  updateShowAllColumnsBtnVisibilityForButton(showAllColumnsBtn);
}

function closeColumnMenu() {
  if (!columnMenuEl) {
    return;
  }
  columnMenuEl.hidden = true;
  if (columnMenuAnchorEl) {
    columnMenuAnchorEl.setAttribute("aria-expanded", "false");
    columnMenuAnchorEl = null;
  }
  columnMenuTargetColumn = "";
  columnMenuTargetReplicaId = null;
}

function positionColumnMenu(anchorEl) {
  if (!columnMenuEl || !anchorEl) {
    return;
  }
  const margin = 8;
  const m = columnMenuEl.getBoundingClientRect();
  const a = anchorEl.getBoundingClientRect();
  let left = a.right - m.width;
  if (left < margin) {
    left = a.left;
  }
  if (left + m.width > window.innerWidth - margin) {
    left = window.innerWidth - margin - m.width;
  }
  let top = a.bottom + 4;
  if (top + m.height > window.innerHeight - margin) {
    top = a.top - m.height - 4;
  }
  if (top < margin) {
    top = margin;
  }
  columnMenuEl.style.left = `${left}px`;
  columnMenuEl.style.top = `${top}px`;
}

function openColumnMenu(anchorEl, columnName, replicaId = null) {
  closeColumnMenu();
  columnMenuTargetColumn = columnName;
  columnMenuTargetReplicaId = replicaId ?? null;
  columnMenuAnchorEl = anchorEl;
  if (!columnMenuEl) {
    return;
  }
  columnMenuEl.hidden = false;
  anchorEl.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => positionColumnMenu(anchorEl));
}

function rowLabelFromCells(row) {
  const cell = row.find((c) => c != null && String(c).trim() !== "");
  const s = cell != null ? String(cell).trim() : "Pay slip";
  return s.length > 48 ? `${s.slice(0, 45)}\u2026` : s;
}

function closeRowOverlay() {
  overlayOpenPageId = null;
  overlayDetailSnapshot = null;
  if (rowDetailOverlayEl) {
    rowDetailOverlayEl.hidden = true;
  }
  if (rowDetailTeacherViewEl) {
    rowDetailTeacherViewEl.hidden = true;
    rowDetailTeacherViewEl.replaceChildren();
  }
  if (rowDetailDlEl) {
    rowDetailDlEl.hidden = false;
  }
  rowDetailPanelEl?.classList.remove("row-detail-panel--payslip");
  rowDetailScrollEl?.classList.remove("row-detail-scroll--payslip");
}

/**
 * If the row-detail overlay is open for a teacher pay slip, refresh it after reload.
 */
function syncTeacherPaySlipsOverlay(columns, rows, pageIds) {
  if (!overlayOpenPageId || !rowDetailOverlayEl || rowDetailOverlayEl.hidden) {
    return;
  }
  const ids = Array.isArray(pageIds) ? pageIds : [];
  const idx = ids.indexOf(overlayOpenPageId);
  if (idx >= 0 && rows[idx]) {
    const r = rows[idx];
    const title = rowLabelFromCells(r);
    renderRowDetail({ title, columns, row: r });
    overlayDetailSnapshot = {
      title,
      columns: columns.slice(),
      row: r.slice(),
    };
  }
}

function openRowOverlay(columns, row, pageId) {
  if (!rowDetailOverlayEl) {
    return;
  }
  overlayOpenPageId =
    pageId && String(pageId).trim() ? String(pageId).trim() : null;
  const title = rowLabelFromCells(row);
  renderRowDetail({ title, columns, row });
  overlayDetailSnapshot = {
    title,
    columns: columns.slice(),
    row: row.slice(),
  };
  rowDetailOverlayEl.hidden = false;
  rowDetailCloseEl?.focus({ preventScroll: true });
}

/** Pay-slip overlay (teacher): hide these Notion property labels (normalized match). */
const TEACHER_PAYSLIP_ROW_DETAIL_OMIT = new Set([
  "email",
  "bank details",
  "contract",
  "id",
]);

function normalizeNotionColumnLabel(colName) {
  return String(colName ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Visible column title (Notion PATCH still uses raw keys). Mirrors `displayNotionSheetColumnLabel`
 * in notion-simplify.js.
 * @param {string | undefined | null} colName
 */
function displayNotionSheetColumnLabel(colName) {
  const n = normalizeNotionColumnLabel(colName);
  if (n === "adults") {
    return "ADULTS CLASSES";
  }
  if (n === "kid" || n === "kids") {
    return "KIDS CLASSES";
  }
  if (n === "trial" || n === "trials") {
    return "TRIAL CLASSES";
  }
  return String(colName ?? "");
}

function omitFromTeacherPaySlipRowDetail(colName) {
  return TEACHER_PAYSLIP_ROW_DETAIL_OMIT.has(normalizeNotionColumnLabel(colName));
}

function teacherPayslipSessionOrder(name) {
  const s = dashNormCol(name);
  const c = /cancel/i.test(s);
  if (c && /kids/i.test(s)) {
    return 4;
  }
  if (c && /adults/i.test(s)) {
    return 5;
  }
  if (/trials?/i.test(s)) {
    return 3;
  }
  if (/kids/i.test(s)) {
    return 1;
  }
  if (/adults/i.test(s)) {
    return 2;
  }
  return 100;
}

/**
 * @param {number} i
 * @param {string[]} columns
 * @returns {[number, number, number]}
 */
function teacherPayslipRankTuple(i, columns) {
  const name = columns[i];
  const s = dashNormCol(name);
  const schoolI = findSchoolColumnIndex(columns);
  const dateI = findDateColumnIndex(columns);
  const statusI = findStatusColumnIndex(columns);
  if (i === schoolI) {
    return [0, 0, 0];
  }
  if (i === dateI) {
    return [0, 1, 0];
  }
  if (i === statusI) {
    return [0, 2, 0];
  }
  if (/exchange\s*amount/.test(s) && !/rate/.test(s)) {
    return [3, 50, 0];
  }
  if (/exchange\s*rate/.test(s)) {
    return [3, 40, 0];
  }
  if (/total\s*net|net\s*amount/i.test(s)) {
    return [3, 30, 0];
  }
  if (/\bfees?\b/i.test(s)) {
    return [3, 20, 0];
  }
  if (/total\s*amount/i.test(s) && !/net/i.test(s)) {
    return [3, 10, 0];
  }
  if (/(kids|adults|trials|cancel)/i.test(s)) {
    return [1, teacherPayslipSessionOrder(name), 0];
  }
  return [2, 0, i];
}

/**
 * Teacher pay-slip column order: header (school, date, status), session block,
 * other fields, then finance (amount, fees, net, rate, exchange amount).
 * @param {string[]} columns
 * @returns {number[]} original indices (filtered: no URL / omitted props)
 */
function orderIndicesForTeacherPaySlipDisplay(columns) {
  if (!Array.isArray(columns)) {
    return [];
  }
  const indices = [];
  const n = columns.length;
  for (let i = 0; i < n; i++) {
    const colName = columns[i];
    if (String(colName ?? "").trim().toLowerCase() === "url") {
      continue;
    }
    if (omitFromTeacherPaySlipRowDetail(colName)) {
      continue;
    }
    indices.push(i);
  }
  indices.sort((a, b) => {
    const ta = teacherPayslipRankTuple(a, columns);
    const tb = teacherPayslipRankTuple(b, columns);
    for (let k = 0; k < 3; k++) {
      if (ta[k] !== tb[k]) {
        return ta[k] - tb[k];
      }
    }
    return a - b;
  });
  return indices;
}

function teacherPaySlipCellDisplay(raw) {
  const t = raw == null ? "" : String(raw).trim();
  if (!t || /^empty$/i.test(t)) {
    return { text: "Empty", empty: true };
  }
  return { text: t, empty: false };
}

function teacherPayslipIsFinanceColumnName(colName) {
  const s = dashNormCol(colName);
  if (/exchange\s*amount/.test(s) && !/rate/.test(s)) {
    return true;
  }
  if (/exchange\s*rate/.test(s)) {
    return true;
  }
  if (/total\s*net|net\s*amount/i.test(s)) {
    return true;
  }
  if (/\bfees?\b/i.test(s)) {
    return true;
  }
  if (/total\s*amount/i.test(s)) {
    return true;
  }
  return false;
}

function renderTeacherPaySlipDetail(columns, row) {
  if (!rowDetailTeacherViewEl || !rowDetailDlEl) {
    return;
  }
  rowDetailTeacherViewEl.replaceChildren();
  rowDetailTeacherViewEl.hidden = false;
  rowDetailDlEl.hidden = true;
  rowDetailPanelEl?.classList.add("row-detail-panel--payslip");
  rowDetailScrollEl?.classList.add("row-detail-scroll--payslip");

  const idxs = orderIndicesForTeacherPaySlipDisplay(columns);
  const visible = new Set(idxs);
  const schoolI = findSchoolColumnIndex(columns);
  const dateI = findDateColumnIndex(columns);
  const statusI = findStatusColumnIndex(columns);
  const headerSlots = [
    schoolI >= 0 && visible.has(schoolI) ? schoolI : null,
    dateI >= 0 && visible.has(dateI) ? dateI : null,
    statusI >= 0 && visible.has(statusI) ? statusI : null,
  ];
  const headerSet = new Set(headerSlots.filter((x) => x != null));

  const headerEl = document.createElement("div");
  headerEl.className = "teacher-payslip-detail__header";
  for (const slotI of headerSlots) {
    const cell = document.createElement("div");
    cell.className = "teacher-payslip-detail__head-cell";
    if (slotI == null) {
      headerEl.appendChild(cell);
      continue;
    }
    const colName = columns[slotI];
    const label = document.createElement("div");
    label.className = "teacher-payslip-detail__label";
    label.textContent =
      colName == null ? "" : displayNotionSheetColumnLabel(colName);
    const disp = teacherPaySlipCellDisplay(row[slotI]);
    const valWrap = document.createElement("div");
    if (slotI === schoolI) {
      if (disp.empty) {
        valWrap.className =
          "teacher-payslip-detail__value teacher-payslip-detail__value--empty";
        valWrap.textContent = disp.text;
      } else {
        const pill = document.createElement("span");
        pill.className =
          "teacher-payslip-detail__pill teacher-payslip-detail__pill--school";
        pill.textContent = disp.text;
        valWrap.appendChild(pill);
      }
    } else if (slotI === dateI) {
      valWrap.className = "teacher-payslip-detail__value";
      const pretty = formatDateCellPretty(row[slotI]);
      if (pretty !== "") {
        valWrap.textContent = pretty;
      } else if (disp.empty) {
        valWrap.classList.add("teacher-payslip-detail__value--empty");
        valWrap.textContent = disp.text;
      } else {
        valWrap.textContent = disp.text;
      }
    } else if (slotI === statusI) {
      if (disp.empty) {
        valWrap.className =
          "teacher-payslip-detail__value teacher-payslip-detail__value--empty";
        valWrap.textContent = disp.text;
      } else {
        const pill = document.createElement("span");
        pill.className =
          "teacher-payslip-detail__pill teacher-payslip-detail__pill--status";
        pill.textContent = disp.text;
        valWrap.appendChild(pill);
      }
    } else {
      valWrap.className = "teacher-payslip-detail__value";
      if (disp.empty) {
        valWrap.classList.add("teacher-payslip-detail__value--empty");
      }
      valWrap.textContent = disp.text;
    }
    cell.appendChild(label);
    cell.appendChild(valWrap);
    headerEl.appendChild(cell);
  }
  rowDetailTeacherViewEl.appendChild(headerEl);

  const stack = document.createElement("div");
  stack.className = "teacher-payslip-detail__stack";
  let financeStarted = false;
  for (const i of idxs) {
    if (headerSet.has(i)) {
      continue;
    }
    const colName = columns[i];
    const isFin = teacherPayslipIsFinanceColumnName(colName);
    if (isFin && !financeStarted) {
      const div = document.createElement("div");
      div.className = "teacher-payslip-detail__divider";
      stack.appendChild(div);
      financeStarted = true;
    }
    const rowEl = document.createElement("div");
    rowEl.className = "teacher-payslip-detail__row";
    const lab = document.createElement("div");
    lab.className = "teacher-payslip-detail__label";
    lab.textContent =
      colName == null ? "" : displayNotionSheetColumnLabel(colName);
    const disp = teacherPaySlipCellDisplay(row[i]);
    const val = document.createElement("div");
    val.className = "teacher-payslip-detail__value";
    const datePretty = i === dateI ? formatDateCellPretty(row[i]) : "";
    const slipMoneySpec = notionMoneySpecForColumn(colName);
    if (datePretty !== "") {
      val.textContent = datePretty;
    } else if (slipMoneySpec !== null) {
      const ms = formatMoneyCellForDisplay(slipMoneySpec, row[i]);
      if (ms.trim() === "") {
        val.classList.add("teacher-payslip-detail__value--empty");
        val.textContent = disp.text;
      } else {
        val.textContent = ms;
      }
    } else if (disp.empty) {
      val.classList.add("teacher-payslip-detail__value--empty");
      val.textContent = disp.text;
    } else {
      val.textContent = disp.text;
    }
    rowEl.appendChild(lab);
    rowEl.appendChild(val);
    stack.appendChild(rowEl);
  }
  rowDetailTeacherViewEl.appendChild(stack);
}

/**
 * Columns/values shown on the teacher pay slip (matches row-detail overlay).
 * @param {string[]} columns
 * @param {string[]} row
 * @returns {{ columns: string[]; row: string[] }}
 */
function sliceRowForTeacherPaySlipPdf(columns, row) {
  if (!Array.isArray(columns) || !Array.isArray(row)) {
    return { columns: [], row: [] };
  }
  const idxs = orderIndicesForTeacherPaySlipDisplay(columns);
  const outCols = idxs.map((i) => columns[i]);
  const outCells = idxs.map((i) => row[i]);
  return { columns: outCols, row: outCells };
}

/**
 * @param {{ title: string; columns: string[]; row: string[] }} detail
 */
function renderRowDetail(detail) {
  if (!rowDetailTitleEl || !rowDetailDlEl) {
    return;
  }
  const { title, columns, row } = detail;
  if (!columns || !row) {
    return;
  }
  rowDetailTitleEl.textContent = title;
  rowDetailDlEl.replaceChildren();
  if (isTeacherNavMode) {
    renderTeacherPaySlipDetail(columns, row);
    return;
  }
  if (rowDetailTeacherViewEl) {
    rowDetailTeacherViewEl.hidden = true;
    rowDetailTeacherViewEl.replaceChildren();
  }
  rowDetailDlEl.hidden = false;
  rowDetailPanelEl?.classList.remove("row-detail-panel--payslip");
  rowDetailScrollEl?.classList.remove("row-detail-scroll--payslip");
  const overlayDateIdx = findDateColumnIndex(columns);
  columns.forEach((colName, i) => {
    const dt = document.createElement("dt");
    dt.textContent = displayNotionSheetColumnLabel(colName);
    const dd = document.createElement("dd");
    const val = row[i];
    let display = displayCellInSchoolSheet(columns, i, val);
    if (overlayDateIdx >= 0 && i === overlayDateIdx) {
      const pretty = formatDateCellPretty(val);
      if (pretty !== "") {
        display = pretty;
      }
    }
    const moneySpecOv = notionMoneySpecForColumn(colName);
    if (moneySpecOv !== null) {
      display = formatMoneyCellForDisplay(moneySpecOv, val);
    }
    if (isPillColumn(colName) && display.trim() !== "") {
      const pill = document.createElement("span");
      pill.className = "row-detail-value-pill";
      pill.textContent = display;
      dd.appendChild(pill);
    } else {
      dd.textContent = display;
    }
    rowDetailDlEl.appendChild(dt);
    rowDetailDlEl.appendChild(dd);
  });
}

/**
 * @param {string} title
 * @param {string[]} columns
 * @param {string[]} row
 * @param {{ teacherPaySlipOnly?: boolean }} [opts]
 */
async function savePaySlipPdfFromRow(title, columns, row, opts) {
  if (typeof window.payslipApi?.savePaySlipPdf !== "function") {
    return;
  }
  const showErr = (msg) => {
    if (isTeacherNavMode && teacherPaySlipsError) {
      teacherPaySlipsError.textContent = msg;
      teacherPaySlipsError.hidden = false;
    } else {
      setStatus(msg, true);
    }
  };
  let cols = columns;
  let cells = row;
  if (opts?.teacherPaySlipOnly) {
    const sliced = sliceRowForTeacherPaySlipPdf(columns, row);
    cols = sliced.columns;
    cells = sliced.row;
  }
  try {
    const result = await window.payslipApi.savePaySlipPdf({
      title,
      columns: cols,
      row: cells,
    });
    if (result?.canceled) {
      return;
    }
    if (!result?.ok) {
      showErr(result?.message || "Could not save PDF.");
    }
  } catch (e) {
    showErr(e instanceof Error ? e.message : String(e));
  }
}

function trimTeacherNotionSourceId(v) {
  if (v == null) {
    return "";
  }
  return String(v).trim();
}

/**
 * Cache is valid only if it was loaded for the same Notion source the profile
 * specifies (so linking a dedicated DB invalidates an older default-DB snapshot).
 * @param {{ notionDatabaseId?: string; notionDataSourceId?: string } | null} cache
 * @param {string} notionDatabaseId
 * @param {string} notionDataSourceId
 */
function teacherPaySlipCacheMatchesNotionSource(
  cache,
  notionDatabaseId,
  notionDataSourceId,
) {
  if (!cache) {
    return false;
  }
  const wantDb = trimTeacherNotionSourceId(notionDatabaseId);
  const wantDs = trimTeacherNotionSourceId(notionDataSourceId);
  const gotDb = trimTeacherNotionSourceId(cache.notionDatabaseId);
  const gotDs = trimTeacherNotionSourceId(cache.notionDataSourceId);
  return gotDb === wantDb && gotDs === wantDs;
}

/**
 * @param {{ force?: boolean }} [opts]
 * @returns {Promise<{
 *   ok: boolean;
 *   columns?: string[];
 *   rows?: string[][];
 *   pageIds?: string[];
 *   message?: string;
 *   noEmailColumn?: boolean;
 *   fromCache?: boolean;
 *   noEmail?: boolean;
 *   notionDatabaseId?: string;
 *   notionDataSourceId?: string;
 * }>}
 */
async function fetchTeacherPaySlipTable(opts) {
  const force = Boolean(opts?.force);

  if (typeof window.notionApi?.queryTeacherPaySlips !== "function") {
    return {
      ok: false,
      message: "Pay slips could not be loaded in this view.",
    };
  }

  let email = "";
  try {
    const { user } = await window.teacherAuth.getSessionUser();
    email = user && typeof user.email === "string" ? user.email.trim() : "";
  } catch {
    /* ignore */
  }
  if (!email) {
    return { ok: false, message: "no_email", noEmail: true };
  }

  let notionDatabaseId = "";
  let notionDataSourceId = "";
  try {
    const profile = await window.teacherAuth.getTeacherProfileState();
    if (profile.kind === "ok" && profile.row) {
      const r = profile.row;
      const nd =
        r.notion_database_id != null ? String(r.notion_database_id).trim() : "";
      const ns =
        r.notion_data_source_id != null
          ? String(r.notion_data_source_id).trim()
          : "";
      if (nd) {
        notionDatabaseId = nd;
      }
      if (ns) {
        notionDataSourceId = ns;
      }
    }
  } catch {
    /* ignore */
  }

  if (
    !force &&
    teacherPaySlipCache &&
    Array.isArray(teacherPaySlipCache.columns) &&
    teacherPaySlipCacheMatchesNotionSource(
      teacherPaySlipCache,
      notionDatabaseId,
      notionDataSourceId,
    )
  ) {
    return {
      ok: true,
      columns: teacherPaySlipCache.columns.slice(),
      rows: teacherPaySlipCache.rows.map((r) => r.slice()),
      pageIds: teacherPaySlipCache.pageIds.slice(),
      fromCache: true,
      noEmailColumn: false,
      notionDatabaseId: teacherPaySlipCache.notionDatabaseId,
      notionDataSourceId: teacherPaySlipCache.notionDataSourceId,
    };
  }

  let result;
  try {
    result = await window.notionApi.queryTeacherPaySlips({
      email,
      databaseId: notionDatabaseId,
      dataSourceId: notionDataSourceId,
    });
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : String(e),
    };
  }

  if (!result?.ok) {
    return {
      ok: false,
      message: result?.message || "Could not load pay slips.",
    };
  }

  const columns = Array.isArray(result.columns) ? result.columns : [];
  const rows = Array.isArray(result.rows) ? result.rows : [];
  const pageIds = Array.isArray(result.pageIds) ? result.pageIds : [];
  const noEmailColumn = Boolean(result.noEmailColumn);

  teacherPaySlipCache = {
    columns: columns.slice(),
    rows: rows.map((r) => (Array.isArray(r) ? r.slice() : [])),
    pageIds: pageIds.slice(),
    fetchedAt: Date.now(),
    notionDatabaseId,
    notionDataSourceId,
  };

  return {
    ok: true,
    columns,
    rows,
    pageIds,
    noEmailColumn,
    notionDatabaseId,
    notionDataSourceId,
  };
}

/** @param {HTMLElement | null} root */
function resetPayslipAnalyticsCardDom(root) {
  if (!(root instanceof HTMLElement)) {
    return;
  }
  for (const slotName of ["net-bars", "status-bars", "trend"]) {
    const el = root.querySelector(`[data-dash-slot="${slotName}"]`);
    if (el) {
      el.replaceChildren();
    }
  }
  root.hidden = true;
  root.setAttribute("hidden", "");
}

function resetTeacherDashboardAnalyticsDom() {
  resetPayslipAnalyticsCardDom(
    document.getElementById("teacherDashAnalyticsWrap"),
  );
}

/**
 * @param {HTMLElement | null} panel
 * @param {string} label
 * @param {number} fillPct
 * @param {string} valueText
 * @param {boolean} [mutedFill]
 */
function appendPayslipDashHBar(panel, label, fillPct, valueText, mutedFill) {
  if (!(panel instanceof HTMLElement)) {
    return;
  }
  const rowEl = document.createElement("div");
  rowEl.className = "teacher-dash-hbar";
  const lab = document.createElement("span");
  lab.className = "teacher-dash-hbar-label";
  lab.textContent = label;
  const track = document.createElement("div");
  track.className = "teacher-dash-hbar-track";
  const fill = document.createElement("div");
  fill.className = mutedFill
    ? "teacher-dash-hbar-fill teacher-dash-hbar-fill--muted"
    : "teacher-dash-hbar-fill";
  fill.style.width = `${Math.min(100, Math.max(0, fillPct))}%`;
  track.appendChild(fill);
  const val = document.createElement("span");
  val.className = "teacher-dash-hbar-value";
  val.textContent = valueText;
  rowEl.appendChild(lab);
  rowEl.appendChild(track);
  rowEl.appendChild(val);
  panel.appendChild(rowEl);
}

/**
 * KPIs + bar / line charts from a pay-slip column/row snapshot (teacher hub).
 * @param {HTMLElement | null} root
 * @param {string[]} columns
 * @param {string[][]} rows
 * @param {"teacher"} variant
 */
function renderPayslipAnalyticsCard(root, columns, rows, variant) {
  resetPayslipAnalyticsCardDom(root);
  if (!(root instanceof HTMLElement)) {
    return;
  }

  /** @param {string} name */
  const dashSlot = (name) =>
    root.querySelector(`[data-dash-slot="${name}"]`);

  if (!Array.isArray(columns)) {
    return;
  }
  const safeRows = Array.isArray(rows) ? rows : [];

  /** @param {HTMLElement} el */
  const showAnalyticsWrap = (el) => {
    el.removeAttribute("hidden");
    el.hidden = false;
  };

  if (safeRows.length === 0) {
    showAnalyticsWrap(root);
    const heroBig = dashSlot("hero-metric-big");
    const heroDesc = dashSlot("hero-desc");
    if (heroBig) {
      heroBig.textContent = "0";
    }
    if (heroDesc) {
      heroDesc.textContent =
        columns.length > 0
          ? "No pay slip rows yet (or none matched your sign-in). Connect rows in Notion and refresh — KPIs and charts will populate here."
          : "No pay slip table columns loaded yet.";
    }
    const kpiCols = dashSlot("kpi-cols");
    if (kpiCols) {
      kpiCols.textContent = columns.length > 0 ? String(columns.length) : "—";
    }
    const kpiSchools = dashSlot("kpi-schools");
    const kpiSchoolsNote = dashSlot("kpi-schools-note");
    if (kpiSchools) {
      kpiSchools.textContent = "—";
    }
    if (kpiSchoolsNote) {
      kpiSchoolsNote.textContent = "no rows";
    }
    const kpiDates = dashSlot("kpi-dates");
    if (kpiDates) {
      kpiDates.textContent = "—";
    }
    const kpiNet = dashSlot("kpi-net-sum");
    if (kpiNet) {
      kpiNet.textContent = "—";
    }
    const emptyMsg = "No rows to chart yet.";
    for (const slotName of ["net-bars", "status-bars", "trend"]) {
      const panel = dashSlot(slotName);
      if (panel) {
        const p = document.createElement("p");
        p.className = "teacher-dash-trend-empty";
        p.textContent = emptyMsg;
        panel.appendChild(p);
      }
    }
    return;
  }

  showAnalyticsWrap(root);

  const schoolIdx = findSchoolColumnIndex(columns);
  const dateIdx = findDateColumnIndex(columns);
  const statusIdx = findStatusColumnIndex(columns);
  let netIdx = findNetProfitColumnIndex(columns);
  if (netIdx < 0) {
    netIdx = findExchangeAmountColumnIndex(columns);
  }
  const exIdx = findExchangeAmountColumnIndex(columns);

  const heroBig = dashSlot("hero-metric-big");
  const heroDesc = dashSlot("hero-desc");
  if (heroBig) {
    heroBig.textContent = String(safeRows.length);
  }
  if (heroDesc) {
    heroDesc.textContent = `Your synced Notion pay slips after the email filter: ${columns.length} columns · ${safeRows.length} rows. Charts mirror the Pay slips table (status, net / exchange, pay dates).`;
  }

  const kpiCols = dashSlot("kpi-cols");
  if (kpiCols) {
    kpiCols.textContent = String(columns.length);
  }

  /** @type {Set<string>} */
  const schoolSet = new Set();
  if (schoolIdx >= 0) {
    for (const row of safeRows) {
      if (!Array.isArray(row)) {
        continue;
      }
      const s =
        row[schoolIdx] != null ? String(row[schoolIdx]).trim() : "";
      if (s) {
        schoolSet.add(s);
      }
    }
  }
  const kpiSchools = dashSlot("kpi-schools");
  const kpiSchoolsNote = dashSlot("kpi-schools-note");
  if (kpiSchools) {
    kpiSchools.textContent = schoolIdx < 0 ? "—" : String(schoolSet.size);
  }
  if (kpiSchoolsNote) {
    kpiSchoolsNote.textContent =
      schoolIdx < 0 ? "No school column" : "distinct schools";
  }

  /** @type {string[]} */
  const ymds = [];
  if (dateIdx >= 0) {
    for (const row of safeRows) {
      if (!Array.isArray(row)) {
        continue;
      }
      const y = extractYmd(row[dateIdx]);
      if (y) {
        ymds.push(y);
      }
    }
    ymds.sort();
  }
  const kpiDates = dashSlot("kpi-dates");
  if (kpiDates) {
    kpiDates.textContent =
      ymds.length > 0
        ? `${formatDashDisplayDate(ymds[0])} → ${formatDashDisplayDate(ymds[ymds.length - 1])}`
        : "—";
  }

  let sumNet = 0;
  if (netIdx >= 0) {
    for (const row of safeRows) {
      if (!Array.isArray(row)) {
        continue;
      }
      const n = parseNumberFromCell(row[netIdx]);
      if (n != null) {
        sumNet += n;
      }
    }
  }
  const kpiNet = dashSlot("kpi-net-sum");
  if (kpiNet) {
    kpiNet.textContent = netIdx >= 0 ? formatDashCurrencyZar(sumNet) : "—";
  }

  const netBars = dashSlot("net-bars");
  if (netBars) {
    /** @type {{ sortKey: string; dateLabel: string; net: number }[]} */
    const netItems = [];
    safeRows.forEach((row, rowIdx) => {
      if (!Array.isArray(row)) {
        return;
      }
      const net = netIdx >= 0 ? parseNumberFromCell(row[netIdx]) : null;
      if (net == null) {
        return;
      }
      let sortKey;
      let dateLabel;
      if (dateIdx >= 0) {
        const ymd = extractYmd(row[dateIdx]);
        if (ymd) {
          sortKey = ymd;
          dateLabel = formatDashDisplayDate(row[dateIdx]);
        } else {
          sortKey = `~${String(rowIdx).padStart(5, "0")}`;
          dateLabel = `Row ${rowIdx + 1}`;
        }
      } else {
        sortKey = `~${String(rowIdx).padStart(5, "0")}`;
        dateLabel = `Row ${rowIdx + 1}`;
      }
      netItems.push({ sortKey, dateLabel, net });
    });
    netItems.sort((a, b) => a.sortKey.localeCompare(b.sortKey));
    const tail = netItems.slice(-14);
    const maxAbs = tail.reduce((m, it) => Math.max(m, Math.abs(it.net)), 0);
    if (maxAbs <= 0) {
      const p = document.createElement("p");
      p.className = "teacher-dash-trend-empty";
      p.textContent = "No numeric net / exchange values to chart.";
      netBars.appendChild(p);
    } else {
      for (const it of tail) {
        const pct = Math.min(
          100,
          Math.round((Math.abs(it.net) / maxAbs) * 1000) / 10,
        );
        const rowEl = document.createElement("div");
        rowEl.className = "teacher-dash-hbar";
        const lab = document.createElement("span");
        lab.className = "teacher-dash-hbar-label";
        lab.textContent = it.dateLabel;
        const track = document.createElement("div");
        track.className = "teacher-dash-hbar-track";
        const fill = document.createElement("div");
        fill.className = "teacher-dash-hbar-fill";
        fill.style.width = `${pct}%`;
        track.appendChild(fill);
        const val = document.createElement("span");
        val.className = "teacher-dash-hbar-value";
        val.textContent = formatDashCurrencyZar(it.net);
        rowEl.appendChild(lab);
        rowEl.appendChild(track);
        rowEl.appendChild(val);
        netBars.appendChild(rowEl);
      }
    }
  }

  const statusBars = dashSlot("status-bars");
  if (statusBars) {
    if (statusIdx >= 0) {
      const counts = new Map();
      for (const row of safeRows) {
        if (!Array.isArray(row)) {
          continue;
        }
        const label = formatDashStatus(row[statusIdx]);
        counts.set(label, (counts.get(label) ?? 0) + 1);
      }
      const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
      const maxC = sorted[0]?.[1] ?? 1;
      if (!sorted.length) {
        const p = document.createElement("p");
        p.className = "teacher-dash-trend-empty";
        p.textContent = "No status values.";
        statusBars.appendChild(p);
      } else {
        for (const [label, n] of sorted.slice(0, 10)) {
          const pct = Math.round((n / maxC) * 1000) / 10;
          const rowEl = document.createElement("div");
          rowEl.className = "teacher-dash-hbar";
          const lab = document.createElement("span");
          lab.className = "teacher-dash-hbar-label";
          lab.textContent = label;
          const track = document.createElement("div");
          track.className = "teacher-dash-hbar-track";
          const fill = document.createElement("div");
          fill.className =
            "teacher-dash-hbar-fill teacher-dash-hbar-fill--muted";
          fill.style.width = `${pct}%`;
          track.appendChild(fill);
          const val = document.createElement("span");
          val.className = "teacher-dash-hbar-value";
          val.textContent = String(n);
          rowEl.appendChild(lab);
          rowEl.appendChild(track);
          rowEl.appendChild(val);
          statusBars.appendChild(rowEl);
        }
      }
    } else {
      const p = document.createElement("p");
      p.className = "teacher-dash-trend-empty";
      p.textContent = "No status column matched.";
      statusBars.appendChild(p);
    }
  }

  const trendWrap = dashSlot("trend");
  if (trendWrap) {
    if (exIdx >= 0 && dateIdx >= 0) {
      /** @type {{ ymd: string; y: number; lab: string }[]} */
      const pts = [];
      safeRows.forEach((row) => {
        if (!Array.isArray(row)) {
          return;
        }
        const ymd = extractYmd(row[dateIdx]);
        const ex = parseNumberFromCell(row[exIdx]);
        if (!ymd || ex == null) {
          return;
        }
        pts.push({
          ymd,
          y: ex,
          lab: formatDashDisplayDate(row[dateIdx]),
        });
      });
      pts.sort((a, b) => a.ymd.localeCompare(b.ymd));
      if (pts.length >= 2) {
        const W = 420;
        const H = 96;
        const padL = 4;
        const padR = 4;
        const padT = 8;
        const padB = 18;
        const ys = pts.map((p) => p.y);
        const ymin = Math.min(...ys);
        const ymax = Math.max(...ys);
        const span = ymax - ymin || 1;
        const innerW = W - padL - padR;
        const innerH = H - padT - padB;
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg",
        );
        svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
        svg.setAttribute("class", "teacher-dash-trend-svg");
        svg.setAttribute("role", "img");
        svg.setAttribute(
          "aria-label",
          "Exchange amount trend by pay date",
        );
        const coords = pts.map((p, i) => {
          const x =
            padL +
            innerW * (pts.length === 1 ? 0 : i / (pts.length - 1));
          const yn = padT + innerH * (1 - (p.y - ymin) / span);
          return { x, y: yn };
        });
        let d = "";
        coords.forEach((c, i) => {
          d += `${i === 0 ? "M" : "L"} ${c.x.toFixed(1)} ${c.y.toFixed(1)} `;
        });
        const areaD = `${d.trim()} L ${coords[coords.length - 1].x.toFixed(1)} ${(padT + innerH).toFixed(1)} L ${coords[0].x.toFixed(1)} ${(padT + innerH).toFixed(1)} Z`;
        const fillPath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        fillPath.setAttribute("d", areaD);
        fillPath.setAttribute("fill", "rgba(37, 99, 235, 0.14)");
        const strokePath = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path",
        );
        strokePath.setAttribute("d", d.trim());
        strokePath.setAttribute("fill", "none");
        strokePath.setAttribute("stroke", "var(--money-cell-selection)");
        strokePath.setAttribute("stroke-width", "2.25");
        strokePath.setAttribute("stroke-linecap", "round");
        strokePath.setAttribute("stroke-linejoin", "round");
        svg.appendChild(fillPath);
        svg.appendChild(strokePath);
        for (const c of coords) {
          const dot = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle",
          );
          dot.setAttribute("cx", String(c.x));
          dot.setAttribute("cy", String(c.y));
          dot.setAttribute("r", "3.5");
          dot.setAttribute("fill", "var(--surface)");
          dot.setAttribute("stroke", "var(--money-cell-selection)");
          dot.setAttribute("stroke-width", "1.5");
          svg.appendChild(dot);
        }
        const last = pts[pts.length - 1];
        const cap = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "text",
        );
        cap.setAttribute("x", String(padL));
        cap.setAttribute("y", String(H - 4));
        cap.setAttribute("fill", "var(--text-muted)");
        cap.setAttribute("font-size", "9");
        cap.textContent = `${last.lab} · ${formatDashCurrencyZar(last.y)}`;
        svg.appendChild(cap);
        trendWrap.appendChild(svg);
      } else {
        const p = document.createElement("p");
        p.className = "teacher-dash-trend-empty";
        p.textContent =
          pts.length === 1
            ? "Add another dated row to see an exchange trend line."
            : "No exchange + pay date points to plot.";
        trendWrap.appendChild(p);
      }
    } else {
      const p = document.createElement("p");
      p.className = "teacher-dash-trend-empty";
      p.textContent =
        "Link Pay date and Exchange amount columns to plot this trend.";
      trendWrap.appendChild(p);
    }
  }
}

/**
 * Teacher hub analytics (same card as workspace admin; uses data-dash-slot under root).
 * @param {string[]} columns
 * @param {string[][]} rows
 */
function renderTeacherDashboardAnalytics(columns, rows) {
  renderPayslipAnalyticsCard(
    document.getElementById("teacherDashAnalyticsWrap"),
    columns,
    rows,
    "teacher",
  );
}

function resetTeacherDashboardPlaceholders() {
  const ids = [
    teacherDashExchangeAmount,
    teacherDashStatus,
    teacherDashLastUpdated,
    teacherDashFees,
  ];
  for (const el of ids) {
    if (el) {
      el.textContent = "—";
    }
  }
  if (teacherDashDataSyncNote) {
    teacherDashDataSyncNote.textContent = "";
    teacherDashDataSyncNote.hidden = true;
  }
  resetTeacherNetProfitDonutChart();
  resetTeacherDashboardAnalyticsDom();
}

function resetTeacherNetChartSummaryCards() {
  if (teacherNetChartPayPeriodRangeEl) {
    teacherNetChartPayPeriodRangeEl.textContent = "—";
  }
  if (teacherNetChartPaySlipCountEl) {
    teacherNetChartPaySlipCountEl.textContent = "—";
  }
  if (teacherNetChartSummaryRowEl) {
    teacherNetChartSummaryRowEl.hidden = true;
  }
}

/**
 * @param {{ dateLabel: string }[]} items
 */
function updateTeacherNetChartSummaryCards(items) {
  if (
    !teacherNetChartSummaryRowEl ||
    !teacherNetChartPayPeriodRangeEl ||
    !teacherNetChartPaySlipCountEl ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return;
  }
  const first = items[0];
  const last = items[items.length - 1];
  const rangeText =
    first.dateLabel === last.dateLabel
      ? first.dateLabel
      : `${first.dateLabel} – ${last.dateLabel}`;
  teacherNetChartPayPeriodRangeEl.textContent = rangeText;
  teacherNetChartPaySlipCountEl.textContent = String(items.length);
  teacherNetChartSummaryRowEl.hidden = false;
}

/**
 * Clear net-profit donut (dashboard chart).
 */
function resetTeacherNetProfitDonutChart() {
  resetTeacherNetChartSummaryCards();
  if (teacherDashNetDonutSvg) {
    teacherDashNetDonutSvg.innerHTML = "";
    teacherDashNetDonutSvg.removeAttribute("aria-label");
  }
  if (teacherDashNetDonutLegend) {
    teacherDashNetDonutLegend.innerHTML = "";
  }
  if (teacherDashNetDonutEmpty) {
    teacherDashNetDonutEmpty.textContent = "";
    teacherDashNetDonutEmpty.hidden = true;
  }
  if (teacherDashNetDonutBody) {
    teacherDashNetDonutBody.hidden = true;
  }
  if (teacherDashDonutCenterMain) {
    teacherDashDonutCenterMain.textContent = "—";
  }
}

/** Pastel donut segments (reference chart). */
const TEACHER_DONUT_SLICE_COLORS = [
  "#81c784",
  "#ffd54f",
  "#64b5f6",
  "#ba68c8",
  "#4dd0e1",
  "#ff8a65",
];
/** Gap between slices (radians); reveals frame background. */
const TEACHER_DONUT_SLICE_GAP_RAD = 0.05;

/**
 * @param {number} cx
 * @param {number} cy
 * @param {number} rIn
 * @param {number} rOut
 * @param {number} a0
 * @param {number} a1
 */
function teacherNetDonutSlicePath(cx, cy, rIn, rOut, a0, a1) {
  const delta = a1 - a0;
  if (delta <= 1e-6) {
    return "";
  }
  const large = delta > Math.PI ? 1 : 0;
  const xos = cx + rOut * Math.cos(a0);
  const yos = cy + rOut * Math.sin(a0);
  const xoe = cx + rOut * Math.cos(a1);
  const yoe = cy + rOut * Math.sin(a1);
  const xie = cx + rIn * Math.cos(a1);
  const yie = cy + rIn * Math.sin(a1);
  const xis = cx + rIn * Math.cos(a0);
  const yis = cy + rIn * Math.sin(a0);
  return `M ${xos} ${yos} A ${rOut} ${rOut} 0 ${large} 1 ${xoe} ${yoe} L ${xie} ${yie} A ${rIn} ${rIn} 0 ${large} 0 ${xis} ${yis} Z`;
}

/**
 * Donut from all teacher pay slip rows: slice size ∝ |net| per period; center =
 * Σ net.
 * @param {string[]} columns
 * @param {string[][]} rows
 */
function renderTeacherNetProfitDonut(columns, rows) {
  resetTeacherNetChartSummaryCards();
  if (
    !teacherDashboardNetChartWrap ||
    !teacherDashNetDonutSvg ||
    !teacherDashNetDonutLegend ||
    !teacherDashNetDonutBody ||
    !teacherDashNetDonutEmpty
  ) {
    return;
  }
  if (!rows.length || !columns.length) {
    teacherDashNetDonutEmpty.textContent = "No pay slips to chart.";
    teacherDashNetDonutEmpty.hidden = false;
    return;
  }

  let netIdx = findNetProfitColumnIndex(columns);
  if (netIdx < 0) {
    netIdx = findExchangeAmountColumnIndex(columns);
  }
  if (netIdx < 0) {
    teacherDashNetDonutEmpty.textContent =
      "Add a “Net profit”, “Net pay”, or “Exchange amount” column to see this chart.";
    teacherDashNetDonutEmpty.hidden = false;
    return;
  }

  const dateIdx = findDateColumnIndex(columns);
  /** @type {{ sortKey: string; dateLabel: string; net: number }[]} */
  const items = [];
  rows.forEach((row, rowIdx) => {
    const net = parseNumberFromCell(row[netIdx]);
    if (net == null) {
      return;
    }
    let sortKey;
    let dateLabel;
    if (dateIdx >= 0) {
      const ymd = extractYmd(row[dateIdx]);
      if (ymd) {
        sortKey = ymd;
        dateLabel = formatDashDisplayDate(row[dateIdx]);
      } else {
        sortKey = `~${String(rowIdx).padStart(5, "0")}`;
        dateLabel = `Row ${rowIdx + 1} (no date)`;
      }
    } else {
      sortKey = `~${String(rowIdx).padStart(5, "0")}`;
      dateLabel = `Pay slip ${rowIdx + 1}`;
    }
    items.push({ sortKey, dateLabel, net });
  });

  if (!items.length) {
    teacherDashNetDonutEmpty.textContent =
      "No numeric values in the net column for your pay slips.";
    teacherDashNetDonutEmpty.hidden = false;
    return;
  }

  items.sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  const sumNet = items.reduce((s, it) => s + it.net, 0);
  const sumAbs = items.reduce((s, it) => s + Math.abs(it.net), 0);
  if (sumAbs === 0) {
    teacherDashNetDonutEmpty.textContent =
      "Net values are all zero — nothing to chart.";
    teacherDashNetDonutEmpty.hidden = false;
    return;
  }

  teacherDashNetDonutBody.hidden = false;
  teacherDashNetDonutEmpty.hidden = true;

  if (teacherDashDonutCenterMain) {
    teacherDashDonutCenterMain.textContent = formatDashCurrencyZar(sumNet);
  }

  while (teacherDashNetDonutSvg.firstChild) {
    teacherDashNetDonutSvg.removeChild(teacherDashNetDonutSvg.firstChild);
  }
  teacherDashNetDonutLegend.innerHTML = "";

  const cx = 100;
  const cy = 100;
  const rOut = 97.5;
  const rIn = 94.25;
  const ns = "http://www.w3.org/2000/svg";
  const gap = TEACHER_DONUT_SLICE_GAP_RAD;
  const nSl = items.length;
  const arcAvailable = 2 * Math.PI - nSl * gap;
  let theta = -Math.PI / 2;
  /** @type {string[]} */
  const ariaParts = [];

  items.forEach((it, i) => {
    const frac = Math.abs(it.net) / sumAbs;
    const span = frac * arcAvailable;
    const a0 = theta;
    const a1 = theta + span;
    theta = a1 + gap;
    const pathD = teacherNetDonutSlicePath(cx, cy, rIn, rOut, a0, a1);
    if (pathD) {
      const fill = TEACHER_DONUT_SLICE_COLORS[i % TEACHER_DONUT_SLICE_COLORS.length];
      const path = document.createElementNS(ns, "path");
      path.setAttribute("d", pathD);
      path.setAttribute("fill", fill);
      teacherDashNetDonutSvg.appendChild(path);
    }

    const li = document.createElement("li");
    const sw = document.createElement("span");
    sw.className = "teacher-dashboard-net-donut-swatch";
    sw.style.background =
      TEACHER_DONUT_SLICE_COLORS[i % TEACHER_DONUT_SLICE_COLORS.length];
    const dateSpan = document.createElement("span");
    dateSpan.className = "teacher-dashboard-net-donut-legend-date";
    dateSpan.textContent = it.dateLabel;
    li.appendChild(sw);
    li.appendChild(dateSpan);
    teacherDashNetDonutLegend.appendChild(li);

    const pct = sumAbs > 0 ? Math.round((Math.abs(it.net) / sumAbs) * 100) : 0;
    ariaParts.push(`${it.dateLabel} (${pct}%)`);
  });

  teacherDashNetDonutSvg.setAttribute(
    "aria-label",
    `Net profit total ${formatDashCurrencyZar(sumNet)}. ${items.length} pay periods. ${ariaParts.join("; ")}`,
  );
  updateTeacherNetChartSummaryCards(items);
}

/**
 * @param {string[]} columns
 * @param {string[][]} rows
 */
function renderTeacherDashboardFromTable(columns, rows) {
  resetTeacherDashboardPlaceholders();
  renderTeacherNetProfitDonut(columns, rows);
  renderTeacherDashboardAnalytics(columns, rows);
  if (!teacherDashboardGridWrap) {
    return;
  }
  const idx = findLatestPaySlipRowIndex(columns, rows);
  if (idx < 0 || !rows[idx]) {
    return;
  }
  const row = rows[idx];
  const dateIdx = findDateColumnIndex(columns);
  const statusIdx = findStatusColumnIndex(columns);
  const feesIdx = findFeesColumnIndex(columns);
  const exchangeAmtIdx = findExchangeAmountColumnIndex(columns);

  if (teacherDashExchangeAmount) {
    teacherDashExchangeAmount.textContent =
      exchangeAmtIdx >= 0
        ? formatDashCurrencyZar(parseNumberFromCell(row[exchangeAmtIdx]))
        : "—";
  }
  if (teacherDashStatus) {
    teacherDashStatus.textContent =
      statusIdx >= 0
        ? formatDashStatus(row[statusIdx])
        : "—";
  }
  if (teacherDashLastUpdated) {
    teacherDashLastUpdated.textContent =
      dateIdx >= 0
        ? formatDashDisplayDate(row[dateIdx])
        : "—";
  }

  if (teacherDashFees) {
    teacherDashFees.textContent =
      feesIdx >= 0
        ? formatDashCurrencyUsd(parseNumberFromCell(row[feesIdx]))
        : "—";
  }

  const fetchedAt = teacherPaySlipCache?.fetchedAt;
  if (
    teacherDashDataSyncNote &&
    typeof fetchedAt === "number" &&
    Number.isFinite(fetchedAt)
  ) {
    teacherDashDataSyncNote.textContent = `Data loaded ${new Date(
      fetchedAt,
    ).toLocaleString()}`;
    teacherDashDataSyncNote.hidden = false;
  }
}

/**
 * @param {{ force?: boolean }} [opts]
 * When force is true, bypasses cached pay-slip table data (explicit refresh).
 */
async function loadTeacherDashboard(opts) {
  if (!isTeacherNavMode) {
    return;
  }
  if (teacherDashboardError) {
    teacherDashboardError.hidden = true;
    teacherDashboardError.textContent = "";
  }
  if (teacherDashboardHint) {
    teacherDashboardHint.hidden = true;
    teacherDashboardHint.textContent = "";
  }
  if (teacherDashboardGridWrap) {
    teacherDashboardGridWrap.hidden = true;
  }
  const teacherDashAnalyticsWrap = document.getElementById(
    "teacherDashAnalyticsWrap",
  );
  if (teacherDashAnalyticsWrap) {
    teacherDashAnalyticsWrap.hidden = true;
  }
  if (teacherDashboardChartCard) {
    teacherDashboardChartCard.hidden = true;
  }
  resetTeacherDashboardPlaceholders();
  if (teacherDashboardLoading) {
    teacherDashboardLoading.hidden = false;
  }

  if (typeof window.notionApi?.queryTeacherPaySlips !== "function") {
    if (teacherDashboardLoading) {
      teacherDashboardLoading.hidden = true;
    }
    return;
  }

  const fetched = await fetchTeacherPaySlipTable({
    force: Boolean(opts?.force),
  });
  if (teacherDashboardLoading) {
    teacherDashboardLoading.hidden = true;
  }

  if (fetched.noEmail) {
    if (teacherDashboardError) {
      teacherDashboardError.textContent =
        "Sign in to load pay slips linked to your email.";
      teacherDashboardError.hidden = false;
    }
    return;
  }

  if (!fetched.ok) {
    if (teacherDashboardError) {
      teacherDashboardError.textContent =
        fetched.message || "Could not load pay slips.";
      teacherDashboardError.hidden = false;
    }
    return;
  }

  const columns = fetched.columns || [];
  const rows = fetched.rows || [];

  if (fetched.noEmailColumn) {
    if (teacherDashboardHint) {
      teacherDashboardHint.textContent =
        "No pay slips matched your sign-in email. Add a column whose name includes “Email”, or put your exact sign-in address in any field on each pay slip row.";
      teacherDashboardHint.hidden = false;
    }
    renderTeacherDashboardFromTable(columns, rows);
    if (teacherDashboardGridWrap) {
      teacherDashboardGridWrap.hidden = true;
    }
    const analyticsNoEmail = document.getElementById(
      "teacherDashAnalyticsWrap",
    );
    if (analyticsNoEmail) {
      analyticsNoEmail.removeAttribute("hidden");
      analyticsNoEmail.hidden = false;
    }
    if (teacherDashboardChartCard) {
      teacherDashboardChartCard.removeAttribute("hidden");
      teacherDashboardChartCard.hidden = false;
    }
    return;
  }

  if (rows.length === 0) {
    if (teacherDashboardHint) {
      const dedicated =
        Boolean(fetched.notionDatabaseId) ||
        Boolean(fetched.notionDataSourceId);
      try {
        const { user } = await window.teacherAuth.getSessionUser();
        const em =
          user && typeof user.email === "string" ? user.email.trim() : "";
        teacherDashboardHint.textContent = dedicated
          ? "No pay slip rows in your Notion database yet."
          : em
            ? `No pay slips found. Check that your Notion rows include this exact email: ${em} (any property is fine, including the page title).`
            : "No pay slips found.";
      } catch {
        teacherDashboardHint.textContent = dedicated
          ? "No pay slip rows in your Notion database yet."
          : "No pay slips found.";
      }
      teacherDashboardHint.hidden = false;
    }
    renderTeacherDashboardFromTable(columns, rows);
    if (teacherDashboardGridWrap) {
      teacherDashboardGridWrap.hidden = true;
    }
    const analyticsEmpty = document.getElementById("teacherDashAnalyticsWrap");
    if (analyticsEmpty) {
      analyticsEmpty.removeAttribute("hidden");
      analyticsEmpty.hidden = false;
    }
    if (teacherDashboardChartCard) {
      teacherDashboardChartCard.removeAttribute("hidden");
      teacherDashboardChartCard.hidden = false;
    }
    return;
  }

  renderTeacherDashboardFromTable(columns, rows);
  if (teacherDashboardGridWrap) {
    teacherDashboardGridWrap.hidden = false;
  }
  const teacherDashAnalyticsWrapEl = document.getElementById(
    "teacherDashAnalyticsWrap",
  );
  if (teacherDashAnalyticsWrapEl) {
    teacherDashAnalyticsWrapEl.removeAttribute("hidden");
    teacherDashAnalyticsWrapEl.hidden = false;
  }
  if (teacherDashboardChartCard) {
    teacherDashboardChartCard.removeAttribute("hidden");
    teacherDashboardChartCard.hidden = false;
  }
}

/**
 * @param {{ force?: boolean }} [opts]
 * When force is true, bypasses cached pay-slip table data (explicit refresh).
 */
async function loadTeacherPaySlips(opts) {
  const forceFetch = Boolean(opts?.force);
  if (!isTeacherNavMode || !teacherPaySlipsSection) {
    return;
  }
  teacherPaySlipsSection.hidden = false;
  if (teacherPaySlipsHint) {
    teacherPaySlipsHint.hidden = true;
    teacherPaySlipsHint.textContent = "";
  }
  if (teacherPaySlipsError) {
    teacherPaySlipsError.hidden = true;
    teacherPaySlipsError.textContent = "";
  }
  if (teacherPaySlipsTableWrap) {
    teacherPaySlipsTableWrap.hidden = true;
  }
  if (teacherPaySlipsTbody) {
    teacherPaySlipsTbody.innerHTML = "";
  }

  const hadCache =
    teacherPaySlipCache != null &&
    Array.isArray(teacherPaySlipCache.rows) &&
    teacherPaySlipCache.rows.length > 0;
  if (teacherPaySlipsLoading) {
    teacherPaySlipsLoading.hidden = hadCache;
  }

  const fetched = await fetchTeacherPaySlipTable({ force: forceFetch });

  if (teacherPaySlipsLoading) {
    teacherPaySlipsLoading.hidden = true;
  }

  if (fetched.noEmail) {
    if (teacherPaySlipsError) {
      teacherPaySlipsError.textContent =
        "Sign in to load pay slips linked to your email.";
      teacherPaySlipsError.hidden = false;
    }
    return;
  }

  if (!fetched.ok) {
    if (teacherPaySlipsError) {
      teacherPaySlipsError.textContent =
        fetched.message || "Could not load pay slips.";
      teacherPaySlipsError.hidden = false;
    }
    return;
  }

  if (fetched.noEmailColumn) {
    if (teacherPaySlipsHint) {
      teacherPaySlipsHint.textContent =
        "No pay slips matched your sign-in email. Add a column whose name includes “Email”, or put your exact sign-in address in any field on each pay slip row (e.g. title, notes, or a formula).";
      teacherPaySlipsHint.hidden = false;
    }
    return;
  }

  const columns = fetched.columns || [];
  const rows = fetched.rows || [];
  const pageIds = fetched.pageIds || [];

  if (rows.length === 0) {
    if (teacherPaySlipsHint) {
      const dedicated =
        Boolean(fetched.notionDatabaseId) ||
        Boolean(fetched.notionDataSourceId);
      try {
        const { user } = await window.teacherAuth.getSessionUser();
        const em =
          user && typeof user.email === "string" ? user.email.trim() : "";
        teacherPaySlipsHint.textContent = dedicated
          ? "No pay slip rows in your Notion database yet."
          : "No pay slips found. Check that your Notion pay slip rows include this exact email: " +
            (em || "(your sign-in email)") +
            " (any property is fine, including the page title).";
      } catch {
        teacherPaySlipsHint.textContent = dedicated
          ? "No pay slip rows in your Notion database yet."
          : "No pay slips found.";
      }
      teacherPaySlipsHint.hidden = false;
    }
    return;
  }

  if (!teacherPaySlipsTbody) {
    return;
  }

  const dateIdx = findDateColumnIndex(columns);
  rows.forEach((row, rowIndex) => {
    const pageId = pageIds[rowIndex] || "";
    const tr = document.createElement("tr");
    tr.className = "tr-with-peek";

    const tdTitle = document.createElement("td");
    const wrap = document.createElement("div");
    wrap.className = "cell-with-open";
    const span = document.createElement("span");
    span.className = "cell-primary";
    span.textContent = rowLabelFromCells(row);
    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.className = "row-open-peek";
    const icon = document.createElement("span");
    icon.className = "row-open-peek-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "\u29C9";
    openBtn.appendChild(icon);
    openBtn.appendChild(document.createTextNode(" Open"));
    openBtn.title = "Show this pay slip in a window over the table";
    const snapCols = columns.slice();
    const snapRow = row.slice();
    const snapPageId = pageId;
    openBtn.addEventListener("click", () =>
      openRowOverlay(snapCols, snapRow, snapPageId),
    );
    wrap.appendChild(span);
    wrap.appendChild(openBtn);
    tdTitle.appendChild(wrap);

    const tdDate = document.createElement("td");
    const rawD =
      dateIdx >= 0 && row[dateIdx] != null ? String(row[dateIdx]).trim() : "";
    tdDate.textContent = rawD ? formatDashDisplayDate(row[dateIdx]) : "—";
    const tdPdf = document.createElement("td");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "teacher-payslip-pdf-btn";
    btn.textContent = "Download PDF";
    const snapTitle = rowLabelFromCells(row);
    btn.addEventListener("click", () => {
      savePaySlipPdfFromRow(snapTitle, snapCols, snapRow, {
        teacherPaySlipOnly: true,
      });
    });
    tdPdf.appendChild(btn);
    tr.appendChild(tdTitle);
    tr.appendChild(tdDate);
    tr.appendChild(tdPdf);
    teacherPaySlipsTbody.appendChild(tr);
  });
  syncTeacherPaySlipsOverlay(columns, rows, pageIds);
  if (teacherPaySlipsTableWrap) {
    teacherPaySlipsTableWrap.hidden = false;
  }
}

/** Tag-style cells for columns whose names resemble the reference (e.g. School Name). */
function isPillColumn(columnName) {
  if (!columnName) {
    return false;
  }
  return /school|status|tags?|type|category|label|department|role|stage|pipeline|global|team/i.test(
    String(columnName),
  );
}

const FLOATING_REPLICA_PROP_KINDS_ALL = /** @type {const} */ ([
  "text",
  "number",
  "status",
  "multi",
  "date",
  "money",
  "email",
  "checkbox",
]);

/** @param {unknown} x */
function sanitizeFloatingReplicaPropKind(x) {
  const s = typeof x === "string" ? x.trim().toLowerCase().slice(0, 24) : "";
  for (const k of FLOATING_REPLICA_PROP_KINDS_ALL) {
    if (s === k) {
      return /** @type {"text"|"number"|"status"|"multi"|"date"|"money"|"email"|"checkbox"} */ (
        k
      );
    }
  }
  return null;
}

/** @param {string[]} columns @param {number} idx @param {string} colName */
function inferFloatingReplicaPropKind(columns, idx, colName) {
  if (idx === findDateColumnIndex(columns)) {
    return /** @type {const} */ ("date");
  }
  if (notionMoneySpecForColumn(colName)) {
    return /** @type {const} */ ("money");
  }
  const nm = String(colName ?? "").trim();
  if (/\b(e-?mail|email\s*address)\b/i.test(nm)) {
    return /** @type {const} */ ("email");
  }
  if (isPillColumn(colName)) {
    return /** @type {const} */ ("status");
  }
  return /** @type {const} */ ("text");
}

/** Feather-style glyphs for local draft sheet column headers (`viewBox 0 0 24 24`). */
const FLOATING_REPLICA_TH_KIND_SVG =
  /** @type {Record<"text"|"number"|"status"|"multi"|"date"|"money"|"email"|"checkbox", string>} */ ({
    text:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M4 12h16M4 17h13"/></svg>',
    number:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M10 5L7 21M21 13H4M21 9H13"/></svg>',
    date:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    email:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 8L2 7"/></svg>',
    checkbox:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    status:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/></svg>',
    multi:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 8h13M8 12h13M8 16h13"/><circle cx="4" cy="8" r="1.3" fill="currentColor"/><circle cx="4" cy="12" r="1.3" fill="currentColor"/><circle cx="4" cy="16" r="1.3" fill="currentColor"/></svg>',
    money:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  });

const FLOATING_REPLICA_TH_ADD_COL_PLUS_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>';

/** Shown beside system-time columns — not draggable property kinds. */
const FLOATING_REPLICA_SYS_CREATED_LABEL = "Created time";

const FLOATING_REPLICA_SYS_EDITED_LABEL = "Last edited time";

/** Sentinel keys passed to column menu hide/show (not property columns). */
const FLOATING_REPLICA_SYS_TIME_CREATED_MENU_COL =
  "__floatingReplica_created_time_meta";

const FLOATING_REPLICA_SYS_TIME_EDITED_MENU_COL =
  "__floatingReplica_edited_time_meta";

/** @param {unknown} raw */
function floatingReplicaIsSysTimeMetaMenuColumn(raw) {
  const s = String(raw ?? "").trim();
  return (
    s === FLOATING_REPLICA_SYS_TIME_CREATED_MENU_COL ||
    s === FLOATING_REPLICA_SYS_TIME_EDITED_MENU_COL
  );
}

/** Normalizes persisted omit flags — call before reading sys column visibility. */
function ensureFloatingReplicaSysTimeShadowFields(rep) {
  rep.shadow.omitSysCreated = Boolean(rep.shadow.omitSysCreated);
  rep.shadow.omitSysEdited = Boolean(rep.shadow.omitSysEdited);
  if (typeof rep.shadow.linkedNotionPageId !== "string") {
    rep.shadow.linkedNotionPageId = "";
  }
}

/** @param {FloatingPaySlipReplica} rep */
function floatingReplicaShowsCreatedTimeColumn(rep) {
  ensureFloatingReplicaSysTimeShadowFields(rep);
  return (
    rep.shadow.columns.length > 0 &&
    !rep.shadow.omitSysCreated &&
    !rep.shadow.hiddenNames.has(FLOATING_REPLICA_SYS_TIME_CREATED_MENU_COL)
  );
}

/** @param {FloatingPaySlipReplica} rep */
function floatingReplicaShowsEditedTimeColumn(rep) {
  ensureFloatingReplicaSysTimeShadowFields(rep);
  return (
    rep.shadow.columns.length > 0 &&
    !rep.shadow.omitSysEdited &&
    !rep.shadow.hiddenNames.has(FLOATING_REPLICA_SYS_TIME_EDITED_MENU_COL)
  );
}

const FLOATING_REPLICA_SYS_TIME_CREATED_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>';

const FLOATING_REPLICA_SYS_TIME_EDITED_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/><circle cx="19" cy="6" r="1.85" fill="currentColor" stroke="none"/></svg>';

/** @param {"text"|"number"|"status"|"multi"|"date"|"money"|"email"|"checkbox"} kind */
function floatingReplicaPropKindLegend(kind) {
  switch (kind) {
    case "text":
      return "Text";
    case "number":
      return "Number";
    case "date":
      return "Date";
    case "email":
      return "Email";
    case "checkbox":
      return "Checkbox";
    case "status":
      return "Status";
    case "multi":
      return "Multi-select";
    case "money":
      return "Money";
    default:
      return "Column";
  }
}

/** @param {FloatingPaySlipReplica} rep */
function ensureFloatingReplicaShadowColumnKinds(rep) {
  const { columns } = rep.shadow;
  const n = columns.length;
  /** @type {FloatingPaySlipReplica["shadow"]["columnKinds"]} */
  let kinds = Array.isArray(rep.shadow.columnKinds)
    ? rep.shadow.columnKinds.map((x) => sanitizeFloatingReplicaPropKind(x) ?? "text")
    : [];
  kinds = kinds.slice(0, n);
  while (kinds.length < n) {
    const i = kinds.length;
    kinds.push(inferFloatingReplicaPropKind(columns, i, columns[i]));
  }
  for (let i = 0; i < n; i += 1) {
    const k =
      sanitizeFloatingReplicaPropKind(kinds[i]) ??
      inferFloatingReplicaPropKind(columns, i, columns[i]);
    kinds[i] = k;
  }
  rep.shadow.columnKinds = kinds;
}

/**
 * @param {FloatingPaySlipReplica} rep
 * @param {number} cellIdx
 */
function effectiveFloatingReplicaPropKind(rep, cellIdx) {
  ensureFloatingReplicaShadowColumnKinds(rep);
  const k =
    sanitizeFloatingReplicaPropKind(rep.shadow.columnKinds[cellIdx]) ??
    inferFloatingReplicaPropKind(
      rep.shadow.columns,
      cellIdx,
      rep.shadow.columns[cellIdx],
    );
  return k;
}

/** @type {HTMLElement | null} */
let floatingReplicaPropPopoverAnchor = null;
/** @type {string} */
let floatingReplicaPropPopoverReplicaId = "";

/** @returns {HTMLElement | null} */
function ensureFloatingReplicaPropKindPopoverEl() {
  /** @type {HTMLElement | null} */
  let el = document.getElementById("floatingReplicaPropKindPopover");
  if (el?.isConnected && el.dataset.floatingPopoverVersion === "2") {
    return el;
  }
  if (el?.parentElement) {
    el.remove();
  }
  el = document.createElement("div");
  el.id = "floatingReplicaPropKindPopover";
  el.dataset.floatingPopoverVersion = "2";
  el.className = "floating-replica-prop-popover";
  el.hidden = true;
  el.setAttribute("role", "menu");
  /** @type {readonly [("text"|"number"|"status"|"multi"|"date"|"email"|"checkbox"), string][]} */
  const items = [
    ["text", "Text"],
    ["number", "Number"],
    ["date", "Date"],
    ["email", "Email"],
    ["checkbox", "Checkbox"],
    ["status", "Status"],
    ["multi", "Multi-select"],
  ];
  for (const [kind, lbl] of items) {
    const b = document.createElement("button");
    b.type = "button";
    b.dataset.floatingReplicaPropKindPick = kind;
    b.className = "floating-replica-prop-popover-item";
    b.setAttribute("aria-label", `Add column: ${lbl}`);
    b.textContent = lbl;
    el.appendChild(b);
  }
  document.body.appendChild(el);
  return el;
}

function repositionFloatingReplicaPropPopover() {
  const pop = /** @type {HTMLElement | null} */ (
    document.getElementById("floatingReplicaPropKindPopover")
  );
  const anch = floatingReplicaPropPopoverAnchor;
  if (!(pop instanceof HTMLElement) || pop.hidden || !anch?.isConnected) {
    return;
  }
  const r = anch.getBoundingClientRect();
  const pad = 4;
  const maxLeft = Math.max(window.innerWidth - 220, 8);
  pop.style.position = "fixed";
  pop.style.left = `${Math.round(Math.min(Math.max(r.left, 8), maxLeft))}px`;
  pop.style.top = `${Math.round(r.bottom + pad)}px`;
}

function closeFloatingReplicaPropKindPopover() {
  const pop = document.getElementById("floatingReplicaPropKindPopover");
  if (pop instanceof HTMLElement) {
    pop.hidden = true;
  }
  floatingReplicaPropPopoverAnchor = null;
  floatingReplicaPropPopoverReplicaId = "";
  window.removeEventListener("resize", repositionFloatingReplicaPropPopover);
  window.removeEventListener(
    "scroll",
    repositionFloatingReplicaPropPopover,
    true,
  );
}

/**
 * @param {HTMLElement} anchor
 * @param {FloatingPaySlipReplica} rep
 */
function toggleFloatingReplicaPropKindPopover(anchor, rep) {
  const popEl = document.getElementById("floatingReplicaPropKindPopover");
  if (
    floatingReplicaPropPopoverAnchor === anchor &&
    popEl instanceof HTMLElement &&
    !popEl.hidden
  ) {
    closeFloatingReplicaPropKindPopover();
    return;
  }
  const pop = /** @type {HTMLElement} */ (
    /** @type {unknown} */ ensureFloatingReplicaPropKindPopoverEl()
  );
  floatingReplicaPropPopoverAnchor = anchor;
  floatingReplicaPropPopoverReplicaId = rep.id;
  pop.hidden = false;
  repositionFloatingReplicaPropPopover();
  window.addEventListener("resize", repositionFloatingReplicaPropPopover);
  window.addEventListener(
    "scroll",
    repositionFloatingReplicaPropPopover,
    true,
  );
}

document.addEventListener(
  "pointerdown",
  (ev) => {
    const pop = document.getElementById("floatingReplicaPropKindPopover");
    const t = ev.target;
    if (
      !(pop instanceof HTMLElement) ||
      pop.hidden ||
      !(t instanceof Node)
    ) {
      return;
    }
    const anch = floatingReplicaPropPopoverAnchor;
    if (pop.contains(t) || (anch instanceof Node && anch.contains(t))) {
      return;
    }
    closeFloatingReplicaPropKindPopover();
  },
  true,
);

/**
 * @param {FloatingPaySlipReplica} rep
 * @param {"text"|"number"|"status"|"multi"|"date"|"email"|"checkbox"} kind
 */
function nextFloatingReplicaPropertyLabel(rep, kind) {
  const labelBase =
    kind === "text"
      ? "Text"
      : kind === "number"
        ? "Number"
        : kind === "status"
          ? "Status"
          : kind === "multi"
            ? "Tags"
            : kind === "date"
              ? "Date"
              : kind === "email"
                ? "Email"
                : kind === "checkbox"
                  ? "Checkbox"
                  : "Text";
  const taken = new Set(
    rep.shadow.columns.map((c) =>
      typeof c === "string" ? c.trim().toLowerCase() : "",
    ),
  );
  const has =
    /** @param {string} lbl @returns {boolean} */ (lbl) =>
      taken.has(String(lbl).trim().toLowerCase());
  if (!has(labelBase)) {
    return labelBase.slice(0, 240);
  }
  let n = 2;
  while (has(`${labelBase} ${n}`)) {
    n += 1;
  }
  return `${labelBase} ${n}`.slice(0, 240);
}

/**
 * @param {FloatingPaySlipReplica} rep
 * @param {"text"|"number"|"status"|"multi"|"date"|"email"|"checkbox"} kind
 */
function addFloatingReplicaPropertyColumn(rep, kind) {
  closeFloatingReplicaPropKindPopover();
  const name = nextFloatingReplicaPropertyLabel(rep, kind);
  rep.shadow.columns.push(name);
  rep.shadow.columnKinds.push(kind);
  for (const row of rep.shadow.rows) {
    row.push("");
  }
  ensureFloatingReplicaShadowColumnKinds(rep);
  applyFloatingPaySlipReplicaRender(rep);
}

function createFloatingReplicaNumberInput(rep, rowIx, cellIdx, colName, inline) {
  const row = rep.shadow.rows[rowIx];

  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = "decimal";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.className = [
    "cell-replica-draft-input",
    inline ? "cell-replica-draft-input--inline" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const cur = row?.[cellIdx];
  const raw = cur == null ? "" : String(cur).trim();
  input.value =
    raw !== "" && Number.isFinite(Number(raw.replace(/,/g, "")))
      ? String(Number(raw.replace(/,/g, "")))
      : raw;

  input.setAttribute("aria-label", colName);
  input.title = "Plain number — this draft only";

  input.addEventListener("change", () => {
    const rNow = rep.shadow.rows[rowIx];
    if (!rNow) {
      return;
    }
    const trimmed = input.value.trim();
    const prev = rNow[cellIdx];
    let nextRaw = "";
    if (trimmed !== "") {
      const parsed = Number(trimmed.replace(/,/g, ""));
      nextRaw = Number.isFinite(parsed) ? String(parsed) : trimmed;
    }
    if (prev === nextRaw || String(prev ?? "") === nextRaw) {
      return;
    }
    rNow[cellIdx] = nextRaw;
    syncOverlayIfFloatingReplicaOpen(rep);
    floatingReplicaBumpRowEdited(rep, rowIx);
  });

  return input;
}

/** @param {unknown} val */
function floatingReplicaParseCheckboxCell(val) {
  const s = val == null ? "" : String(val).trim().toLowerCase();
  return (
    s === "true" ||
    s === "1" ||
    s === "yes" ||
    s === "y" ||
    s === "on" ||
    s === "\u2611" ||
    s === "[x]"
  );
}

function createFloatingReplicaEmailInput(
  rep,
  rowIx,
  cellIdx,
  colName,
  inline,
) {
  const row = rep.shadow.rows[rowIx];
  const cur = row?.[cellIdx];
  const input = document.createElement("input");
  input.type = "email";
  input.autocomplete = "email";
  input.inputMode = "email";
  input.spellcheck = false;
  input.className = [
    "cell-replica-draft-input",
    inline ? "cell-replica-draft-input--inline" : "",
  ]
    .filter(Boolean)
    .join(" ");
  input.value = cur == null ? "" : String(cur);
  input.setAttribute("aria-label", colName);
  input.title = "Email — this draft only";

  input.addEventListener("change", () => {
    const rNow = rep.shadow.rows[rowIx];
    if (!rNow) {
      return;
    }
    const next = input.value.trim();
    if (String(rNow[cellIdx] ?? "").trim() === next) {
      return;
    }
    rNow[cellIdx] = next;
    syncOverlayIfFloatingReplicaOpen(rep);
    floatingReplicaBumpRowEdited(rep, rowIx);
  });
  return input;
}

function createFloatingReplicaCheckboxInput(
  rep,
  rowIx,
  cellIdx,
  colName,
  inline,
) {
  const row = rep.shadow.rows[rowIx];
  const input = document.createElement("input");
  input.type = "checkbox";
  input.className = [
    "floating-replica-cb-native",
    inline ? "floating-replica-cb-native--inline" : "",
  ]
    .filter(Boolean)
    .join(" ");
  input.checked = floatingReplicaParseCheckboxCell(row?.[cellIdx]);
  input.setAttribute("aria-label", colName);
  input.title = "Toggle checkbox — this draft only";
  input.addEventListener("change", () => {
    const r = rep.shadow.rows[rowIx];
    if (!r) {
      return;
    }
    const next = input.checked ? "true" : "";
    if ((r[cellIdx] ?? "") === next) {
      return;
    }
    r[cellIdx] = next;
    syncOverlayIfFloatingReplicaOpen(rep);
    floatingReplicaBumpRowEdited(rep, rowIx);
  });
  return input;
}

/** @returns {HTMLElement} */
function createFloatingReplicaMultiPillWrap(rep, rowIx, cellIdx, colName) {
  const wrap = document.createElement("div");
  wrap.className = "floating-replica-multi-tags cell-pill-wrap";

  const addBtn = document.createElement("button");
  addBtn.type = "button";
  addBtn.className = "floating-replica-multi-add-tag";
  addBtn.textContent = "+";
  addBtn.title = "Add tag";
  addBtn.setAttribute("aria-label", `Add tag to ${colName}`);
  wrap.appendChild(addBtn);

  function readTagsFromWrap() {
    return [...wrap.querySelectorAll(":scope > .cell-pill--multi-draft")].map(
      (pill) =>
        pill.textContent.replace(/\u200b/g, "").trim(),
    );
  }

  function commitPartsFromWrap() {
    const parts = readTagsFromWrap().filter(Boolean);
    const merged = parts.join(", ");
    const r = rep.shadow.rows[rowIx];
    if (!r) {
      return;
    }
    r[cellIdx] = merged;
    syncOverlayIfFloatingReplicaOpen(rep);
    floatingReplicaBumpRowEdited(rep, rowIx);
  }

  /** @param {string[]} parts */
  function renderPills(parts) {
    wrap.querySelectorAll(":scope > .cell-pill--multi-draft").forEach((el) => {
      el.remove();
    });
    const list = parts.length > 0 ? parts : [""];
    for (const token of list) {
      const pill = document.createElement("span");
      pill.className = "cell-pill cell-pill--multi-draft";
      pill.contentEditable = "true";
      pill.setAttribute("role", "textbox");
      pill.spellcheck = false;
      pill.setAttribute("aria-label", colName);
      pill.textContent = token.trim() === "" ? "\u200b" : token;
      pill.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
          ev.preventDefault();
        }
      });
      pill.addEventListener("blur", () => commitPartsFromWrap());
      wrap.insertBefore(pill, addBtn);
    }
  }

  const raw0 = rep.shadow.rows[rowIx]?.[cellIdx];
  const s0 = raw0 == null ? "" : String(raw0).trim();
  const initParts = !s0.length
    ? []
    : s0.split(/\s*,\s*/).map((x) => x.trim()).filter(Boolean);

  renderPills(initParts.length > 0 ? initParts : [""]);

  addBtn.addEventListener("mousedown", (ev) => {
    ev.preventDefault();
  });
  addBtn.addEventListener("click", (ev) => {
    ev.preventDefault();
    commitPartsFromWrap();
    const merged = readTagsFromWrap();
    const next = merged.length > 0 ? [...merged, ""] : [""];
    renderPills(next);
    const pills = wrap.querySelectorAll(".cell-pill--multi-draft");
    const last = pills[pills.length - 1];
    if (last instanceof HTMLElement) {
      last.focus();
    }
  });

  return wrap;
}

/**
 * Prefer the canonical Notion column "School Name" over properties that merely
 * contain the word school (avoid wrong column winning first match).
 */
function scoreSchoolColumnCandidate(col) {
  const raw = String(col ?? "").trim();
  if (!raw) {
    return 0;
  }
  const n = normalizedNotionSheetColumnLabel(raw);
  if (n === "school name") {
    return 100;
  }
  if (/\bschool\b/.test(n) && /\bname\b/.test(n)) {
    return 85;
  }
  if (/\bschool\b/.test(n)) {
    return 50;
  }
  if (/school/i.test(raw)) {
    return 15;
  }
  return 0;
}

function normalizedNotionSheetColumnLabel(col) {
  return String(col ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function findSchoolColumnIndex(columns) {
  let bestIdx = -1;
  let bestScore = -1;
  let bestLen = Infinity;
  columns.forEach((c, idx) => {
    const score = scoreSchoolColumnCandidate(c);
    if (score <= 0) {
      return;
    }
    const len = String(c).trim().length;
    if (
      score > bestScore ||
      (score === bestScore && len < bestLen) ||
      (score === bestScore && len === bestLen && idx < bestIdx)
    ) {
      bestScore = score;
      bestIdx = idx;
      bestLen = len;
    }
  });
  return bestIdx;
}

/**
 * Strips stray trailing slashes (e.g. Notion/export "TALKING GLOBAL\").
 */
function normalizeSchoolCellForUi(val) {
  return String(val == null ? "" : val)
    .trim()
    .replace(/\\+$/g, "")
    .trim();
}

/** School labels hidden from tabs, filters, and the School column cells. */
function isSuppressedSchoolTableLabel(val) {
  const n = normalizeSchoolCellForUi(val).toLowerCase();
  return n === "magic english" || n === "talking global";
}

/**
 * @param {string[]} columns
 * @param {number} cellIdx
 * @param {unknown} cell
 */
function displayCellInSchoolSheet(columns, cellIdx, cell) {
  const schoolIdx = findSchoolColumnIndex(columns);
  if (schoolIdx >= 0 && cellIdx === schoolIdx && isSuppressedSchoolTableLabel(cell)) {
    return "";
  }
  if (cell == null) {
    return "";
  }
  return String(cell);
}

function findDateColumnIndex(columns) {
  const candidates = [];
  columns.forEach((c, idx) => {
    const s = String(c);
    if (/created|edited|modified|updated|last\s*edit/i.test(s)) {
      return;
    }
    let score = 0;
    if (/\bpay\s*date|paydate|payday|pay\s*period\b/i.test(s)) {
      score += 5;
    }
    if (/\bperiod\b|invoice\s*date|statement\s*date/i.test(s)) {
      score += 3;
    }
    if (/\bdue\s*date\b/i.test(s)) {
      score += 2;
    }
    if (/\bdate\b/i.test(s)) {
      score += 1;
    }
    if (/\bmonth\b/i.test(s)) {
      score += 1;
    }
    if (score > 0) {
      candidates.push({ idx, score });
    }
  });
  if (!candidates.length) {
    return -1;
  }
  candidates.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.idx - b.idx;
  });
  return candidates[0].idx;
}

/**
 * Normalize a cell value to YYYY-MM-DD when possible (Notion date or range).
 * @param {unknown} cellVal
 * @returns {string | null}
 */
function extractYmd(cellVal) {
  const s = cellVal == null ? "" : String(cellVal).trim();
  if (!s) {
    return null;
  }
  const start = s.includes(" → ") ? s.split(" → ")[0].trim() : s;
  const iso = start.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return `${iso[1]}-${iso[2]}-${iso[3]}`;
  }
  const compactMar = start.match(
    /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2})\s+(\d{2})$/i,
  );
  if (compactMar) {
    const key = compactMar[1].toLowerCase().slice(0, 3);
    const monthNum = {
      jan: 1,
      feb: 2,
      mar: 3,
      apr: 4,
      may: 5,
      jun: 6,
      jul: 7,
      aug: 8,
      sep: 9,
      oct: 10,
      nov: 11,
      dec: 12,
    }[key];
    if (monthNum) {
      const dayNum = Number(compactMar[2]);
      const yy = Number(compactMar[3]);
      const fullY = yy >= 70 ? 1900 + yy : 2000 + yy;
      return `${fullY}-${String(monthNum).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
    }
  }
  const d = new Date(start);
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

const DISPLAY_SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * @param {string} ymd `YYYY-MM-DD`
 * @returns {string} e.g. Mar 31 06
 */
function formatYmdAsMarDdYy(ymd) {
  const parts = ymd.split("-");
  if (parts.length !== 3) {
    return ymd;
  }
  const y = Number(parts[0]);
  const mo = Number(parts[1]);
  const day = Number(parts[2]);
  if (
    !Number.isFinite(y) ||
    !Number.isFinite(mo) ||
    !Number.isFinite(day)
  ) {
    return ymd;
  }
  const d = new Date(y, mo - 1, day);
  if (Number.isNaN(d.getTime())) {
    return ymd;
  }
  return `${DISPLAY_SHORT_MONTHS[d.getMonth()]} ${d.getDate()} ${String(y).slice(-2)}`;
}

/**
 * @param {{
 *   rowIndex: number;
 *   cellIdx: number;
 *   pageId: string;
 *   propertyName: string;
 *   extraInputClass?: string;
 * }} opts
 */
function createNotionDateInput(opts) {
  const row = rawTable.rows[opts.rowIndex];
  const cur = row?.[opts.cellIdx];
  const ymdStart = extractYmd(cur);

  const input = document.createElement("input");
  input.type = "date";
  input.className =
    opts.extraInputClass && opts.extraInputClass.trim() !== ""
      ? `cell-date-input ${opts.extraInputClass.trim()}`
      : "cell-date-input";
  input.value = ymdStart ?? "";
  input.title = "Edit date in Notion";
  input.setAttribute("aria-label", `Edit ${opts.propertyName}`);
  input.addEventListener("change", async () => {
    const rNow = rawTable.rows[opts.rowIndex];
    if (!rNow) {
      return;
    }
    const prevRaw = rNow[opts.cellIdx];
    const prevYmd = extractYmd(prevRaw);
    const nextRaw = input.value.trim();
    if (prevYmd !== null ? nextRaw === prevYmd : nextRaw === "") {
      return;
    }
    input.disabled = true;
    /** @type {{ ok?: boolean; message?: string }} */
    let res = { ok: false, message: "Not available." };
    try {
      res =
        (await window.notionApi?.updatePageDate?.({
          pageId: opts.pageId,
          propertyName: opts.propertyName,
          ymd: nextRaw === "" ? null : nextRaw,
        })) ?? res;
    } catch (e) {
      res = {
        ok: false,
        message: e instanceof Error ? e.message : String(e),
      };
    }
    input.disabled = false;
    if (!res.ok) {
      setStatus(typeof res.message === "string" ? res.message : "Update failed.", true);
      input.value = prevYmd ?? "";
      return;
    }
    rNow[opts.cellIdx] =
      nextRaw === "" ? "" : nextRaw;
    setStatus("", false);
    syncOverlayFromTable(
      rawTable.columns,
      rawTable.rows,
      rawTable.pageIds,
    );
    persistCurrentAdminViewFilters();
    applyFiltersAndRender();
  });

  return input;
}

function dashNormCol(c) {
  return String(c ?? "").trim().toLowerCase();
}

/**
 * Exchange rate / exchange amount: shown and edited as ZAR (Notion `number` unchanged).
 * @param {string} columnName
 * @returns {boolean}
 */
function isZarEditableMoneyColumn(columnName) {
  const s = dashNormCol(columnName).replace(/\s+/g, " ");
  if (!s || !s.includes("exchange")) {
    return false;
  }
  return /\brate\b/.test(s) || /\bamount\b/.test(s);
}

/**
 * @returns {{ code: "USD" | "ZAR"; prefix: string } | null}
 */
function notionMoneySpecForColumn(columnName) {
  if (isZarEditableMoneyColumn(columnName)) {
    return { code: "ZAR", prefix: "R" };
  }
  if (isUsdEditableMoneyColumn(columnName)) {
    return { code: "USD", prefix: "$" };
  }
  return null;
}

/**
 * Pay / class / fee columns backed by Notion `number` as USD in the sheet.
 * Includes: Total amount, Fees, Net amount, class / kids / trial(s) rates, cancellation adults/kids rates.
 * @param {string} columnName
 * @returns {boolean}
 */
function isUsdEditableMoneyColumn(columnName) {
  const s = dashNormCol(columnName).replace(/\s+/g, " ");
  if (!s) {
    return false;
  }
  const hasCancel =
    s.includes("cancelation") || s.includes("cancellation");
  if (hasCancel) {
    if (/\badults?\b/.test(s) && /\brate\b/.test(s)) {
      return true;
    }
    if (/\bkids?\b/.test(s) && /\brate\b/.test(s)) {
      return true;
    }
    return false;
  }
  if (/\bnet\b/.test(s) && /\bamount\b/.test(s)) {
    return true;
  }
  if (/\btotal\b/.test(s) && /\bamount\b/.test(s)) {
    return true;
  }
  if (/\bfees\b/.test(s)) {
    return true;
  }
  if (/\bkids?\b/.test(s) && /\brate\b/.test(s)) {
    return true;
  }
  if (/\btrials?\b/.test(s) && /\brate\b/.test(s)) {
    return true;
  }
  if (s.includes("class") && s.includes("rate")) {
    return true;
  }
  return false;
}

/** @param {unknown} cellVal */
function parseMoneyNumberFromCell(cellVal) {
  const s = cellVal == null ? "" : String(cellVal).trim();
  if (!s) {
    return null;
  }
  let t = s.replace(/\u202f/g, " ").replace(/\u00a0/g, " ");
  t = t.replace(/\bzar\b/gi, "").trim();
  t = t.replace(/^r\s+/i, "").replace(/^r(?=[\d\s,.+-])/i, "");
  t = t.replace(/\$/g, "").trim();
  t = t.replace(/\s+/g, "");
  const hasComma = t.includes(",");
  const hasDot = t.includes(".");
  if (hasComma && (!hasDot || t.lastIndexOf(",") > t.lastIndexOf("."))) {
    t = t.replace(/\./g, "").replace(/,(\d+)$/, ".$1");
  } else {
    t = t.replace(/,/g, "");
  }
  const n = Number.parseFloat(t);
  return Number.isFinite(n) ? n : null;
}

/** @param {string} text @param {"USD"|"ZAR"} currency */
function parseMoneyInputTextToNumber(text, currency) {
  const t0 = String(text ?? "").trim();
  if (t0 === "") {
    return null;
  }
  let t = t0.replace(/\u202f/g, " ").replace(/\u00a0/g, " ").trim();
  if (currency === "ZAR") {
    t = t.replace(/^r\s+/i, "").replace(/\bzar\b/gi, "").trim();
  } else {
    t = t.replace(/^\$/g, "").trim();
  }
  t = t.replace(/\s+/g, "");
  const hasComma = t.includes(",");
  const hasDot = t.includes(".");
  if (hasComma && (!hasDot || t.lastIndexOf(",") > t.lastIndexOf("."))) {
    t = t.replace(/\./g, "").replace(/,(\d+)$/, ".$1");
  } else {
    t = t.replace(/,/g, "");
  }
  if (t === "" || t === "-" || t === ".") {
    return null;
  }
  const n = Number.parseFloat(t);
  return Number.isFinite(n) ? n : Number.NaN;
}

function roundMoneyMinor(n) {
  return Math.round(n * 100) / 100;
}

/** @param {number} n @param {"USD"|"ZAR"} currency */
function formatMoneyDisplay(n, currency) {
  if (n == null || !Number.isFinite(n)) {
    return "";
  }
  if (currency === "ZAR") {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Typed amount string (ASCII decimal) for editing. */
function formatMoneyPlainInput(n, currency) {
  if (n == null || !Number.isFinite(n)) {
    return "";
  }
  const r = roundMoneyMinor(n);
  const locale = currency === "ZAR" ? "en-ZA" : "en-US";
  return r.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
}

/**
 * Plain string for overlays / dd when IPC editing is unavailable.
 * @param {{ code: "USD" | "ZAR"; prefix: string }} moneySpec
 * @param {unknown} cellVal
 * @returns {string}
 */
function formatMoneyCellForDisplay(moneySpec, cellVal) {
  const currency = moneySpec.code === "ZAR" ? "ZAR" : "USD";
  const n = parseMoneyNumberFromCell(cellVal);
  if (n != null && Number.isFinite(n)) {
    return `${moneySpec.prefix}${formatMoneyPlainInput(n, currency)}`;
  }
  const s = cellVal == null ? "" : String(cellVal).trim();
  return s;
}

function syncMoneyInputChWidth(inputEl) {
  if (!inputEl) {
    return;
  }
  if (inputEl.disabled) {
    inputEl.style.width = "";
    return;
  }
  const t = inputEl.value.trim();
  const len = t.length > 0 ? t.length : 3;
  const ch = Math.max(2, len) + 0.2;
  inputEl.style.width = `min(100%, ${ch}ch)`;
}

/**
 * @param {{
 *   rowIndex: number;
 *   cellIdx: number;
 *   pageId: string;
 *   propertyName: string;
 *   currency: "USD" | "ZAR";
 *   prefix: string;
 *   extraInputClass?: string;
 * }} opts
 */
function createNotionMoneyNumberInput(opts) {
  const { currency } = opts;
  const ccLabel = currency === "ZAR" ? "ZAR" : "USD";
  const row = rawTable.rows[opts.rowIndex];
  const cur = row?.[opts.cellIdx];
  const initialNum = parseMoneyNumberFromCell(cur);

  const wrap = document.createElement("div");
  const inline =
    typeof opts.extraInputClass === "string" &&
    /\binline\b/.test(opts.extraInputClass);
  wrap.className = inline ? "cell-money-wrap cell-money-wrap--inline" : "cell-money-wrap";

  const prefix = document.createElement("span");
  prefix.className = "cell-money-prefix";
  prefix.setAttribute("aria-hidden", "true");
  prefix.textContent = opts.prefix;

  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = "decimal";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.className =
    opts.extraInputClass && String(opts.extraInputClass).trim() !== ""
      ? `cell-money-input ${String(opts.extraInputClass).trim()}`
      : "cell-money-input";
  input.value =
    initialNum != null && Number.isFinite(initialNum)
      ? formatMoneyPlainInput(initialNum, currency)
      : "";
  input.title =
    currency === "ZAR"
      ? "Edit ZAR amount in Notion"
      : "Edit USD amount in Notion";
  input.setAttribute("aria-label", `Edit ${opts.propertyName} (${ccLabel})`);

  input.addEventListener("blur", () => {
    const p = parseMoneyInputTextToNumber(input.value, currency);
    if (p !== null && !Number.isNaN(p)) {
      input.value = formatMoneyPlainInput(roundMoneyMinor(p), currency);
    }
    syncMoneyInputChWidth(input);
  });

  input.addEventListener("input", () => {
    syncMoneyInputChWidth(input);
  });

  input.addEventListener("change", async () => {
    const rNow = rawTable.rows[opts.rowIndex];
    if (!rNow) {
      return;
    }
    const prevRaw = rNow[opts.cellIdx];
    const prevNum = parseMoneyNumberFromCell(prevRaw);
    const parsed = parseMoneyInputTextToNumber(input.value, currency);
    if (Number.isNaN(parsed)) {
      setStatus("Enter a valid amount.", true);
      input.value =
        prevNum != null ? formatMoneyPlainInput(prevNum, currency) : "";
      syncMoneyInputChWidth(input);
      return;
    }
    const nextRounded = parsed === null ? null : roundMoneyMinor(parsed);
    const same =
      (nextRounded === null && prevNum === null) ||
      (nextRounded !== null &&
        prevNum !== null &&
        Math.abs(nextRounded - prevNum) < 0.0001);
    if (same) {
      if (nextRounded !== null) {
        input.value = formatMoneyPlainInput(nextRounded, currency);
      }
      syncMoneyInputChWidth(input);
      return;
    }
    input.disabled = true;
    /** @type {{ ok?: boolean; message?: string }} */
    let res = { ok: false, message: "Not available." };
    try {
      res =
        (await window.notionApi?.updatePageNumber?.({
          pageId: opts.pageId,
          propertyName: opts.propertyName,
          number:
            nextRounded === null ? null : nextRounded,
        })) ?? res;
    } catch (e) {
      res = {
        ok: false,
        message: e instanceof Error ? e.message : String(e),
      };
    }
    input.disabled = false;
    if (!res.ok) {
      setStatus(
        typeof res.message === "string" ? res.message : "Update failed.",
        true,
      );
      input.value =
        prevNum != null ? formatMoneyPlainInput(prevNum, currency) : "";
      syncMoneyInputChWidth(input);
      return;
    }
    rNow[opts.cellIdx] =
      nextRounded === null ? "" : formatMoneyDisplay(nextRounded, currency);
    setStatus("", false);
    syncOverlayFromTable(
      rawTable.columns,
      rawTable.rows,
      rawTable.pageIds,
    );
    persistCurrentAdminViewFilters();
    applyFiltersAndRender();
  });

  const atomic = document.createElement("span");
  atomic.className = "cell-money-atomic";
  atomic.appendChild(prefix);
  atomic.appendChild(input);
  wrap.appendChild(atomic);

  syncMoneyInputChWidth(input);
  return wrap;
}

/**
 * Same prefix + number layout as money inputs, without editing (e.g. IPC not ready).
 * @param {{ code: "USD" | "ZAR"; prefix: string }} moneySpec
 * @param {unknown} cellVal
 * @param {{ inline?: boolean }} [layout]
 */
function createReadOnlyMoneyCell(moneySpec, cellVal, layout = {}) {
  const currency = moneySpec.code === "ZAR" ? "ZAR" : "USD";
  const ccLabel = currency === "ZAR" ? "ZAR" : "USD";
  const wrap = document.createElement("div");
  const inline = Boolean(layout.inline);
  wrap.className = inline
    ? "cell-money-wrap cell-money-wrap--inline cell-money-wrap--readonly"
    : "cell-money-wrap cell-money-wrap--readonly";

  const prefix = document.createElement("span");
  prefix.className = "cell-money-prefix";
  prefix.setAttribute("aria-hidden", "true");
  prefix.textContent = moneySpec.prefix;

  const value = document.createElement("span");
  value.className = "cell-money-readonly-value";
  const n = parseMoneyNumberFromCell(cellVal);
  if (n != null && Number.isFinite(n)) {
    value.textContent = formatMoneyPlainInput(n, currency);
  } else if (cellVal != null && String(cellVal).trim() !== "") {
    value.textContent = String(cellVal).trim();
  }

  wrap.title = `Amount in ${ccLabel}`;
  const atomic = document.createElement("span");
  atomic.className = "cell-money-atomic";
  atomic.appendChild(prefix);
  atomic.appendChild(value);
  wrap.appendChild(atomic);

  const shown = `${moneySpec.prefix}${value.textContent}`.trim();
  wrap.setAttribute(
    "aria-label",
    shown ? `${ccLabel} amount: ${shown}` : `${ccLabel} amount`,
  );
  return wrap;
}

/**
 * Latest row by pay date; if no date column parsable dates, uses last row in
 * API order (see plan).
 * @param {string[]} columns
 * @param {string[][]} rows
 */
function findLatestPaySlipRowIndex(columns, rows) {
  if (!rows.length) {
    return -1;
  }
  const dateIdx = findDateColumnIndex(columns);
  if (dateIdx < 0) {
    return rows.length - 1;
  }
  let bestIdx = rows.length - 1;
  let bestYmd = "";
  rows.forEach((row, idx) => {
    const ymd = extractYmd(row[dateIdx]);
    if (!ymd) {
      return;
    }
    if (!bestYmd || ymd > bestYmd) {
      bestYmd = ymd;
      bestIdx = idx;
    }
  });
  if (!bestYmd) {
    return rows.length - 1;
  }
  return bestIdx;
}

/**
 * @param {string[]} columns
 * @returns {number}
 */
function findStatusColumnIndex(columns) {
  return columns.findIndex((c) => {
    const s = dashNormCol(c);
    return /\bstatus\b/.test(s) || /^payment\s*status$/i.test(String(c).trim());
  });
}

/**
 * @param {string[]} columns
 * @returns {number}
 */
function findFeesColumnIndex(columns) {
  let best = -1;
  let bestScore = -1;
  columns.forEach((c, i) => {
    const s = dashNormCol(c);
    let score = 0;
    if (/total\s*fee|fees\s*total/.test(s)) {
      score += 5;
    } else if (
      /\bfee(s)?\b|commission|bank\s*charge|service\s*fee/.test(s)
    ) {
      score += 3;
    } else if (/deduction/.test(s)) {
      score += 2;
    }
    if (!score) {
      return;
    }
    if (/gross|subtotal|net\s*pay|total\s*net|class(es)?\b/.test(s)) {
      return;
    }
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return bestScore >= 2 ? best : -1;
}

/**
 * @param {string[]} columns
 * @returns {number}
 */
function findExchangeAmountColumnIndex(columns) {
  return columns.findIndex((c) => {
    const s = dashNormCol(c);
    return /exchange\s*amount/.test(s) && !/rate/.test(s);
  });
}

/**
 * @param {string[]} columns
 * @returns {number}
 */
function findExchangeRateColumnIndex(columns) {
  return columns.findIndex((c) => {
    const s = dashNormCol(c);
    return /exchange/.test(s) && /rate/.test(s) && !/amount/.test(s);
  });
}

/**
 * Class / kids / trials / adults rate columns (USD money) for session totals.
 * @param {string[]} columns
 * @returns {number[]}
 */
function findClassSessionRateColumnIndices(columns) {
  /** @type {number[]} */
  const out = [];
  columns.forEach((c, i) => {
    if (!isUsdEditableMoneyColumn(c)) {
      return;
    }
    const s = dashNormCol(c).replace(/\s+/g, " ");
    if (/(class|kids|trials|adults)\b/.test(s) && /\brate\b/.test(s)) {
      out.push(i);
    }
  });
  return out;
}

/**
 * Net profit / net pay (prefers ZAR-style columns over foreign-currency net).
 * @param {string[]} columns
 * @returns {number}
 */
function findNetProfitColumnIndex(columns) {
  let best = -1;
  let bestScore = -1;
  columns.forEach((c, i) => {
    const s = dashNormCol(c);
    const raw = String(c ?? "").trim();
    if (!s) {
      return;
    }
    if (
      /gross|subtotal|total\s*deduct|exchange\s*rate|exchange\s*amount/.test(
        s,
      ) &&
      !/net/.test(s)
    ) {
      return;
    }
    if (/^fees?$|commission|bank\s*charge/.test(s) && !/net/.test(s)) {
      return;
    }
    let score = 0;
    if (
      /net\s*profit|profit\s*\(?\s*net|take[\s-]*home|net\s*margin/i.test(s)
    ) {
      score = 8;
    } else if (
      /net\s*pay|total\s*net|net\s*amount|net\s*remuneration|net\s*due|net\s*earning/i.test(
        s,
      )
    ) {
      score = 6;
    } else if (
      /\bnet\b/.test(s) &&
      /pay|profit|amount|earning|income|balance|clear|payout/i.test(s)
    ) {
      score = 5;
    } else if (/^\s*net\s*$/i.test(raw)) {
      score = 4;
    }
    if (!score) {
      return;
    }
    if (
      /usd|\$|dollar|pound|euro|£|€/.test(s) &&
      !/zar|r\s*\d|rand/i.test(s)
    ) {
      score -= 3;
    }
    if (score > bestScore) {
      bestScore = score;
      best = i;
    }
  });
  return bestScore >= 4 ? best : -1;
}

/**
 * @param {unknown} val
 */
function parseNumberFromCell(val) {
  if (val == null) {
    return null;
  }
  let s = String(val).trim();
  if (!s) {
    return null;
  }
  s = s.replace(/[R$\u00A3€\s]/gi, "");
  s = s.replace(/,/g, "");
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

/**
 * @param {number | null} n
 */
function formatDashCurrencyZar(n) {
  if (n == null) {
    return "—";
  }
  try {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `R\u00A0${n.toFixed(2)}`;
  }
}

/**
 * @param {number | null} n
 */
function formatDashCurrencyUsd(n) {
  if (n == null) {
    return "—";
  }
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

/**
 * @param {unknown} val
 */
function formatDashStatus(val) {
  if (val == null) {
    return "—";
  }
  const s = String(val).trim();
  if (!s) {
    return "—";
  }
  const u = s.toUpperCase();
  if (/PAID|COMPLETE|SETTLED|DONE|CONFIRM/.test(u)) {
    return "PAID";
  }
  if (/PEND|UNPAID|WAIT|DUE|OUTSTAND|PROCESS/.test(u)) {
    return "PENDING";
  }
  return s;
}

/**
 * @param {unknown} cellVal
 * @returns {string} empty when no text; never "—"
 */
function formatDateCellPretty(cellVal) {
  const vs = cellVal == null ? "" : String(cellVal).trim();
  if (!vs) {
    return "";
  }
  if (vs.includes(" → ")) {
    return vs
      .split(" → ")
      .map((p) => {
        const t = p.trim();
        const y = extractYmd(t);
        return y ? formatYmdAsMarDdYy(y) : t;
      })
      .join(" → ");
  }
  const y = extractYmd(vs);
  return y ? formatYmdAsMarDdYy(y) : vs;
}

/**
 * @param {unknown} cellVal
 */
function formatDashDisplayDate(cellVal) {
  const pretty = formatDateCellPretty(cellVal);
  return pretty === "" ? "—" : pretty;
}

function schoolMatchesFilter(cellVal, selectedSchool) {
  if (!selectedSchool) {
    return true;
  }
  const v = cellVal == null ? "" : String(cellVal).trim();
  const s = String(selectedSchool).trim();
  if (!s) {
    return true;
  }
  return v.toLowerCase() === s.toLowerCase();
}

function dateMatchesFilter(cellVal, filterYmd) {
  if (!filterYmd) {
    return true;
  }
  const ymd = extractYmd(cellVal);
  return ymd === filterYmd;
}

/**
 * @param {number} idxA
 * @param {number} idxB
 * @param {"asc" | "desc"} mode
 */
function compareRowIndicesByDate(idxA, idxB, mode) {
  return compareRowIndicesByDateFor(
    rawTable.columns,
    rawTable.rows,
    idxA,
    idxB,
    mode,
  );
}

function compareRowIndicesByDateFor(columns, rows, idxA, idxB, mode) {
  const dateIdx = findDateColumnIndex(columns);
  if (dateIdx < 0) {
    return 0;
  }
  const ymdA = extractYmd(rows[idxA]?.[dateIdx]);
  const ymdB = extractYmd(rows[idxB]?.[dateIdx]);
  if (!ymdA && !ymdB) {
    return 0;
  }
  if (!ymdA) {
    return 1;
  }
  if (!ymdB) {
    return -1;
  }
  if (mode === "desc") {
    return ymdB.localeCompare(ymdA);
  }
  return ymdA.localeCompare(ymdB);
}

function syncSchoolTabsUi() {
  /* School quick-filter tabs removed; school filter remains on the filter row. */
}

function updateSchoolTabsVisibility() {
  const show = false;
  if (tableScrollEl) {
    tableScrollEl.classList.toggle("table-scroll--with-tabs", show);
  }
}

/**
 * @param {string[]} columns
 * @param {unknown[][]} rows
 * @param {string} schoolVal
 * @param {string} dateVal
 * @param {string} sortMode
 */
function getFilteredRowIndicesFromInputsForCore(
  columns,
  rows,
  schoolVal,
  dateVal,
  sortMode,
) {
  const schoolIdx = findSchoolColumnIndex(columns);
  const dateIdx = findDateColumnIndex(columns);

  let indices = rows
    .map((_, i) => i)
    .filter((i) => {
      if (schoolIdx >= 0 && !schoolMatchesFilter(rows[i][schoolIdx], schoolVal)) {
        return false;
      }
      if (dateIdx >= 0 && !dateMatchesFilter(rows[i][dateIdx], dateVal)) {
        return false;
      }
      return true;
    });

  if (
    dateIdx >= 0 &&
    (sortMode === "asc" || sortMode === "desc")
  ) {
    indices = [...indices].sort((a, b) =>
      compareRowIndicesByDateFor(columns, rows, a, b, sortMode),
    );
  }

  return indices;
}

function getFilteredRowIndicesFromInputs(schoolVal, dateVal, sortMode) {
  return getFilteredRowIndicesFromInputsForCore(
    rawTable.columns,
    rawTable.rows,
    schoolVal,
    dateVal,
    sortMode,
  );
}

function getFilteredRowIndices() {
  let indices = getFilteredRowIndicesFromInputs(
    filterSchoolEl?.value ?? "",
    filterDateEl?.value ?? "",
    filterSortEl?.value ?? "",
  );
  indices = narrowRowIndicesByPayslipNotionMappedIds(indices);
  return indices;
}

/**
 * @param {HTMLSelectElement} selectEl
 * @param {string} [previousValue] If omitted, uses current `selectEl.value` before replace.
 * @param {string[]} [overrideColumns]
 * @param {unknown[][]} [overrideRows]
 */
function refillSchoolFilterSelect(
  selectEl,
  previousValue,
  overrideColumns,
  overrideRows,
) {
  const columns = Array.isArray(overrideColumns)
    ? overrideColumns
    : rawTable.columns;
  const rowsData = Array.isArray(overrideRows)
    ? overrideRows
    : rawTable.rows;
  const schoolIdx = findSchoolColumnIndex(columns);
  const prev =
    previousValue !== undefined ? previousValue : selectEl.value;
  selectEl.replaceChildren();
  const all = document.createElement("option");
  all.value = "";
  all.textContent = "All schools";
  selectEl.appendChild(all);
  if (schoolIdx < 0) {
    return;
  }
  const seen = new Set();
  const vals = [];
  for (const row of rowsData) {
    const v = row[schoolIdx];
    if (v == null || String(v).trim() === "") {
      continue;
    }
    const t = String(v).trim();
    if (isSuppressedSchoolTableLabel(t)) {
      continue;
    }
    if (!seen.has(t)) {
      seen.add(t);
      vals.push(t);
    }
  }
  vals.sort((a, b) => a.localeCompare(b));
  for (const t of vals) {
    const o = document.createElement("option");
    o.value = t;
    o.textContent = t;
    selectEl.appendChild(o);
  }
  if (prev && [...selectEl.options].some((o) => o.value === prev)) {
    selectEl.value = prev;
  } else if (prev) {
    selectEl.value = "";
  }
}

function populateSchoolOptions() {
  if (filterSchoolEl) {
    refillSchoolFilterSelect(filterSchoolEl, filterSchoolEl.value);
  }
  rebuildSchoolQuickTabs();
}

function syncFilterToolbarUi() {
  if (!filterToggleEl || !tableFiltersEl) {
    return;
  }
  const cols = rawTable.columns;
  const schoolIdx = findSchoolColumnIndex(cols);
  const dateIdx = findDateColumnIndex(cols);
  const showToolbar = cols.length > 0 && (schoolIdx >= 0 || dateIdx >= 0);
  if (!showToolbar) {
    tableFiltersEl.hidden = true;
    filterPanelExpanded = false;
    filterToggleEl.setAttribute("aria-expanded", "false");
    filterToggleEl.classList.remove("filter-toggle--active");
    return;
  }
  tableFiltersEl.hidden = !filterPanelExpanded;
  filterToggleEl.setAttribute(
    "aria-expanded",
    filterPanelExpanded ? "true" : "false",
  );
  const active =
    Boolean(
      (filterSchoolEl?.value ?? "") ||
        (filterDateEl?.value ?? "") ||
        (filterSortEl && filterSortEl.value !== "desc"),
    ) ||
    mappedPayslipNotionRestrictionIsActiveNow();
  filterToggleEl.classList.toggle("filter-toggle--active", active);
}

function updateFilterGroupsVisibility() {
  const cols = rawTable.columns;
  const schoolIdx = findSchoolColumnIndex(cols);
  const dateIdx = findDateColumnIndex(cols);
  if (tableToolbarEl) {
    tableToolbarEl.hidden = false;
  }
  if (filterToggleEl) {
    filterToggleEl.hidden = !(
      cols.length > 0 &&
      (schoolIdx >= 0 || dateIdx >= 0)
    );
  }
  if (filterSchoolGroupEl) {
    filterSchoolGroupEl.hidden = schoolIdx < 0;
  }
  if (filterDateGroupEl) {
    filterDateGroupEl.hidden = dateIdx < 0;
  }
  if (filterSortGroupEl) {
    filterSortGroupEl.hidden = dateIdx < 0;
  }
  updateSchoolTabsVisibility();
  syncFilterToolbarUi();
}

function syncOverlayFromTable(columns, rows, pageIds) {
  if (!rowDetailOverlayEl || rowDetailOverlayEl.hidden) {
    return;
  }
  if (!overlayOpenPageId) {
    return;
  }
  const ids = Array.isArray(pageIds) ? pageIds : [];
  const idx = ids.indexOf(overlayOpenPageId);
  if (idx >= 0 && rows[idx]) {
    const r = rows[idx];
    const title = rowLabelFromCells(r);
    renderRowDetail({
      title,
      columns,
      row: r,
    });
    overlayDetailSnapshot = {
      title,
      columns: columns.slice(),
      row: r.slice(),
    };
  }
}

function renderThead(columns, theadTarget) {
  const thEl = theadTarget ?? theadEl;
  if (!thEl) {
    return;
  }
  thEl.innerHTML = "";
  const visible = getVisibleColumnIndices();
  /** Left sheet columns stack higher so resize gutters sit centered on seams and stay clickable. */
  const thZBase = visible.length + 24;
  const headRow = document.createElement("tr");
  visible.forEach((colIdx, visualColIndex) => {
    const col = columns[colIdx];
    const colTitle = displayNotionSheetColumnLabel(col);
    const th = document.createElement("th");
    th.className = "th-with-menu";
    th.dataset.colIndex = String(colIdx);
    th.style.zIndex = String(thZBase - visualColIndex);
    const inner = document.createElement("div");
    inner.className = "th-inner";
    const wrap = document.createElement("span");
    wrap.className = "th-label th-label--draggable";
    wrap.draggable = true;
    wrap.title = "Drag left or right to reorder columns";
    const icon = document.createElement("span");
    icon.className = "th-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = HEADER_ICONS[colIdx % HEADER_ICONS.length];
    wrap.appendChild(icon);
    const labelText = document.createElement("span");
    labelText.className = "th-label-text";
    labelText.textContent = colTitle;
    wrap.appendChild(labelText);
    const menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "th-menu-btn";
    menuBtn.setAttribute("aria-label", `Options for ${colTitle}`);
    menuBtn.setAttribute("aria-haspopup", "true");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.title = "Column options";
    menuBtn.draggable = false;
    const tri = document.createElement("span");
    tri.className = "th-menu-tri";
    tri.setAttribute("aria-hidden", "true");
    menuBtn.appendChild(tri);
    menuBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (
        columnMenuAnchorEl === menuBtn &&
        columnMenuEl &&
        !columnMenuEl.hidden
      ) {
        closeColumnMenu();
        return;
      }
      openColumnMenu(menuBtn, col);
    });
    inner.appendChild(wrap);
    inner.appendChild(menuBtn);
    th.appendChild(inner);

    const resizeHandle = document.createElement("span");
    resizeHandle.className = "th-resize-handle";
    resizeHandle.setAttribute("role", "separator");
    resizeHandle.setAttribute("aria-orientation", "vertical");
    resizeHandle.setAttribute(
      "aria-label",
      `Resize «${colTitle}» column (drag sideways)`,
    );
    resizeHandle.title = "Drag sideways to widen or narrow this column";
    attachColumnResizeHandleListeners(resizeHandle, th, col, colIdx);
    th.appendChild(resizeHandle);

    wrap.addEventListener("dragstart", (ev) => {
      ev.stopPropagation();
      th.classList.add("th-dragging");
      try {
        ev.dataTransfer?.setData(COLUMN_DRAG_MIME, String(colIdx));
        ev.dataTransfer?.setData("text/plain", String(colIdx));
        if (ev.dataTransfer) {
          ev.dataTransfer.effectAllowed = "move";
        }
      } catch {
        /* ignore */
      }
    });
    th.addEventListener("dragover", (ev) => {
      ev.preventDefault();
      if (ev.dataTransfer) {
        ev.dataTransfer.dropEffect = "move";
      }
      th.classList.add("th-drop-target");
    });
    th.addEventListener("dragleave", (ev) => {
      const rel = /** @type {Node | null} */ (ev.relatedTarget);
      if (rel instanceof Node && th.contains(rel)) {
        return;
      }
      th.classList.remove("th-drop-target");
    });
    th.addEventListener("drop", (ev) => {
      ev.preventDefault();
      th.classList.remove("th-drop-target");
      let fromRaw = NaN;
      try {
        const dt = ev.dataTransfer;
        const mimeRaw = dt?.getData(COLUMN_DRAG_MIME) ?? "";
        const plainRaw = dt?.getData("text/plain") ?? "";
        const merged = mimeRaw !== "" ? mimeRaw : plainRaw;
        fromRaw = Number(merged);
      } catch {
        fromRaw = NaN;
      }
      const dropIdx =
        typeof th.dataset.colIndex === "string"
          ? Number(th.dataset.colIndex)
          : NaN;
      if (!Number.isInteger(fromRaw) || !Number.isInteger(dropIdx)) {
        return;
      }
      reorderRawTableColumnBefore(fromRaw, dropIdx);
    });

    headRow.appendChild(th);
  });
  thEl.appendChild(headRow);
}

function renderTbody(columns, indices, tbodyTarget) {
  const tbEl = tbodyTarget ?? tbodyEl;
  if (!tbEl) {
    return;
  }
  tbEl.innerHTML = "";
  const { rows, pageIds } = rawTable;
  const ids = Array.isArray(pageIds) ? pageIds : [];
  const visible = getVisibleColumnIndices();
  const firstVisible = visible[0];
  const dateIdx = findDateColumnIndex(columns);
  const notionUpdateDate =
    typeof window.notionApi?.updatePageDate === "function";
  const notionUpdateNumber =
    typeof window.notionApi?.updatePageNumber === "function";

  for (const idx of indices) {
    const row = rows[idx];
    const pageId = ids[idx] || "";
    const tr = document.createElement("tr");
    tr.className = "tr-with-peek";

    for (const cellIdx of visible) {
      const cell = row[cellIdx];
      const colName = columns[cellIdx];
      const td = document.createElement("td");
      const display = displayCellInSchoolSheet(columns, cellIdx, cell);
      const canEditDate =
        dateIdx >= 0 &&
        cellIdx === dateIdx &&
        notionUpdateDate &&
        pageId.trim() !== "";
      const moneySpec = notionMoneySpecForColumn(colName);
      const canEditMoney =
        moneySpec !== null &&
        notionUpdateNumber &&
        pageId.trim() !== "";

      if (cellIdx === firstVisible) {
        const wrap = document.createElement("div");
        wrap.className = "cell-with-open";
        if (canEditDate) {
          wrap.appendChild(
            createNotionDateInput({
              rowIndex: idx,
              cellIdx,
              pageId,
              propertyName: colName,
              extraInputClass: "cell-date-input--inline",
            }),
          );
        } else if (canEditMoney) {
          wrap.appendChild(
            createNotionMoneyNumberInput({
              rowIndex: idx,
              cellIdx,
              pageId,
              propertyName: colName,
              currency: moneySpec.code,
              prefix: moneySpec.prefix,
              extraInputClass: "cell-money-input--inline",
            }),
          );
        } else if (moneySpec !== null) {
          wrap.appendChild(
            createReadOnlyMoneyCell(moneySpec, cell, { inline: true }),
          );
        } else {
          const span = document.createElement("span");
          span.className = "cell-primary";
          span.textContent = display;
          wrap.appendChild(span);
        }
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "row-open-peek";
        const icon = document.createElement("span");
        icon.className = "row-open-peek-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = "\u29C9";
        btn.appendChild(icon);
        btn.appendChild(document.createTextNode(" Open"));
        btn.title = "Show this pay slip in a window over the table";
        btn.addEventListener("click", () =>
          openRowOverlay(columns, row, pageId),
        );
        wrap.appendChild(btn);
        td.appendChild(wrap);
      } else if (canEditDate) {
        td.appendChild(
          createNotionDateInput({
            rowIndex: idx,
            cellIdx,
            pageId,
            propertyName: colName,
          }),
        );
      } else if (canEditMoney) {
        td.appendChild(
          createNotionMoneyNumberInput({
            rowIndex: idx,
            cellIdx,
            pageId,
            propertyName: colName,
            currency: moneySpec.code,
            prefix: moneySpec.prefix,
          }),
        );
      } else if (moneySpec !== null) {
        td.appendChild(createReadOnlyMoneyCell(moneySpec, cell));
      } else if (
        isPillColumn(colName) &&
        display.trim() !== ""
      ) {
        td.className = "cell-pill-wrap";
        const pill = document.createElement("span");
        pill.className = "cell-pill";
        pill.textContent = display;
        td.appendChild(pill);
      } else {
        td.textContent = display;
      }

      td.dataset.colIndex = String(cellIdx);

      tr.appendChild(td);
    }

    tbEl.appendChild(tr);
  }
}

function hideCanvasContextMenu() {
  if (canvasContextMenuEl) {
    canvasContextMenuEl.hidden = true;
  }
}

/** Position the canvas menu after measuring (keeps inside viewport). */
function repositionCanvasContextMenuAround(clientX, clientY) {
  if (!canvasContextMenuEl) {
    return;
  }
  const pad = 6;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let x = clientX;
  let y = clientY;
  canvasContextMenuEl.style.left = `${x}px`;
  canvasContextMenuEl.style.top = `${y}px`;
  const rect = canvasContextMenuEl.getBoundingClientRect();
  if (x + rect.width + pad > vw) {
    x = Math.max(pad, vw - rect.width - pad);
  }
  if (y + rect.height + pad > vh) {
    y = Math.max(pad, vh - rect.height - pad);
  }
  canvasContextMenuEl.style.left = `${x}px`;
  canvasContextMenuEl.style.top = `${y}px`;
}

/**
 * Right-click anywhere in the shell (empty areas): offer a blank pay-slip styled sheet.
 */
function shouldOfferFloatingDraftDatabaseMenu(ev) {
  const t = ev.target;
  if (!(t instanceof Element)) {
    return false;
  }
  if (!appMainEl || appMainEl.hidden) {
    return false;
  }
  if (authGateEl && !authGateEl.hidden) {
    return false;
  }
  if (!appMainEl.contains(t)) {
    return false;
  }
  if (isNavMenuOpen()) {
    return false;
  }
  if (
    rowDetailOverlayEl &&
    !rowDetailOverlayEl.hidden &&
    rowDetailOverlayEl.contains(t)
  ) {
    return false;
  }
  if (
    t.closest(
      "button,a,summary,input,select,textarea,label,[role='tab'],[role='menu']",
    )
  ) {
    return false;
  }
  if (t.closest(".floating-draft-datasheet-card")) {
    return false;
  }
  if (t.closest("#dataTable")) {
    return false;
  }
  if (t.closest(".table-toolbar")) {
    return false;
  }
  if (t.closest(".canvas-local-database-root")) {
    return false;
  }
  if (t.closest("#columnMenu")) {
    return false;
  }
  if (canvasContextMenuEl && canvasContextMenuEl.contains(t)) {
    return false;
  }
  if (t.closest("#notionEditorSidebar")) {
    return false;
  }
  if (t.closest("#notionWsPaneTrash")) {
    return false;
  }
  if (t.closest(".teacher-payslips-table-wrap")) {
    return false;
  }
  if (t.closest(".admin-teachers-table-wrap")) {
    return false;
  }
  return true;
}

/**
 * @param {HTMLTableRowElement} theadRow
 * @returns {number}
 */
function countLocalDbPropertyColumns(theadRow) {
  return theadRow.querySelectorAll(":scope > .canvas-local-db-prop-th").length;
}

/**
 * @param {string} displayLabel
 */
function createLocalDbPropertyTh(displayLabel) {
  const th = document.createElement("th");
  th.className = "canvas-local-db-prop-th";
  const inner = document.createElement("div");
  inner.className = "canvas-local-db-prop-head";
  const icon = document.createElement("span");
  icon.className = "canvas-local-db-type-icon";
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = "Aa";
  const labelSpan = document.createElement("span");
  labelSpan.className = "canvas-local-db-prop-label";
  labelSpan.contentEditable = "true";
  labelSpan.setAttribute("spellcheck", "false");
  labelSpan.textContent = displayLabel;
  inner.appendChild(icon);
  inner.appendChild(labelSpan);
  th.appendChild(inner);
  return th;
}

function createLocalDbAddPropertyHeaderCell() {
  const th = document.createElement("th");
  th.className = "canvas-local-db-add-property-col";
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "canvas-local-db-add-property-btn";
  btn.textContent = "+ Add property";
  th.appendChild(btn);
  return th;
}

/**
 * @param {HTMLTableRowElement} tr
 * @param {HTMLTableSectionElement} tbody
 */
function syncLocalDbRowCellCount(tr, tbody) {
  const table = tbody.closest("table");
  const theadRow = table?.querySelector("thead tr");
  if (!(theadRow instanceof HTMLTableRowElement)) {
    return;
  }
  const propCount = countLocalDbPropertyColumns(theadRow);
  while (tr.cells.length > propCount) {
    tr.deleteCell(-1);
  }
  while (tr.cells.length < propCount) {
    const ix = tr.cells.length;
    const td = document.createElement("td");
    if (tr.classList.contains("canvas-local-db-data-row")) {
      td.className = "canvas-local-db-cell";
      td.contentEditable = "true";
      td.setAttribute("spellcheck", "false");
    } else if (tr.classList.contains("canvas-local-db-new-page-row")) {
      if (ix === 0) {
        td.className = "canvas-local-db-cell canvas-local-db-cell--new-slot";
        const b = document.createElement("button");
        b.type = "button";
        b.className = "canvas-local-db-new-page-btn";
        b.textContent = "+ New page";
        td.appendChild(b);
      } else {
        td.className =
          "canvas-local-db-cell canvas-local-db-cell--muted canvas-local-db-cell--empty";
        td.innerHTML = "\u200b";
      }
    } else {
      td.className =
        "canvas-local-db-cell canvas-local-db-cell--muted canvas-local-db-cell--placeholder";
      td.innerHTML = "\u200b";
    }
    tr.appendChild(td);
  }
}

/** @param {HTMLElement} wrap */
function syncAllLocalDbBodyRows(wrap) {
  const tbody = wrap.querySelector("tbody");
  if (!(tbody instanceof HTMLTableSectionElement)) {
    return;
  }
  tbody.querySelectorAll("tr").forEach((tr) => {
    if (tr instanceof HTMLTableRowElement) {
      syncLocalDbRowCellCount(tr, tbody);
    }
  });
}

/** @param {HTMLElement} wrap */
function addCanvasLocalDbPropertyColumn(wrap) {
  const theadRow = wrap.querySelector("thead tr");
  const addHdr = theadRow?.querySelector(".canvas-local-db-add-property-col");
  if (
    !(theadRow instanceof HTMLTableRowElement) ||
    !(addHdr instanceof HTMLTableCellElement)
  ) {
    return;
  }
  const existingProp = countLocalDbPropertyColumns(theadRow);
  const label = existingProp === 1 ? "Text" : `Text ${existingProp}`;
  theadRow.insertBefore(createLocalDbPropertyTh(label), addHdr);
  syncAllLocalDbBodyRows(wrap);
}

/** @param {HTMLElement} wrap */
function addCanvasLocalDbDataRow(wrap) {
  const tbody = wrap.querySelector("tbody");
  const trigger = tbody?.querySelector(".canvas-local-db-new-page-row");
  if (
    !(tbody instanceof HTMLTableSectionElement) ||
    !(trigger instanceof HTMLTableRowElement)
  ) {
    return;
  }
  const tr = document.createElement("tr");
  tr.className = "canvas-local-db-data-row";
  tbody.insertBefore(tr, trigger.nextSibling);
  syncLocalDbRowCellCount(tr, tbody);
}

/**
 * Embedded empty database modeled on Notion (local editing only; not synced).
 */
function appendCanvasDraftDatabaseTable() {
  if (!canvasDraftTablesEl) {
    return;
  }
  canvasDraftTableUid += 1;
  const uid = canvasDraftTableUid;

  const wrap = document.createElement("div");
  wrap.className = `canvas-draft-table-wrap ${CANVAS_LOCAL_DB_ROOT_CLASS}`;
  wrap.setAttribute("aria-label", `Local database ${uid}`);

  const shell = document.createElement("div");
  shell.className = "canvas-local-database-shell";

  const hdr = document.createElement("header");
  hdr.className = "canvas-local-db-header";

  const titleSpan = document.createElement("span");
  titleSpan.className = "canvas-local-db-title";
  titleSpan.contentEditable = "true";
  titleSpan.setAttribute("spellcheck", "false");
  titleSpan.textContent = "New database";

  const actions = document.createElement("div");
  actions.className = "canvas-local-db-actions";

  /**
   * @param {string} cls
   * @param {string} ariaLabel
   * @param {string} svgMarkup
   */
  const mkIconBtn = (cls, ariaLabel, svgMarkup) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.setAttribute("aria-label", ariaLabel);
    b.innerHTML = svgMarkup;
    return b;
  };

  actions.appendChild(
    mkIconBtn(
      "canvas-local-db-icon-btn",
      "Expand",
      '<svg class="canvas-local-db-icon-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 3H5a2 2 0 0 0-2 2v4M21 13v4a2 2 0 0 1-2 2h-4M15 21h4a2 2 0 0 0 2-2v-4M3 9V5a2 2 0 0 1 2-2h4"/><path d="m14 10 7-7M10 14 3 21"/><path d="m10 10-7-7M14 14 7 21"/></svg>',
    ),
  );
  actions.appendChild(
    mkIconBtn(
      "canvas-local-db-icon-btn",
      "View options",
      '<svg class="canvas-local-db-icon-svg" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="19" cy="6" r="1.65"/><circle cx="12" cy="6" r="1.65"/><circle cx="5" cy="6" r="1.65"/><path d="M4 15h16M8 18.5h8"/></svg>',
    ),
  );

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "canvas-local-db-remove";
  removeBtn.textContent = "Remove";
  removeBtn.title = "Remove this database block";

  const newRowBtn = document.createElement("button");
  newRowBtn.type = "button";
  newRowBtn.className = "canvas-local-db-toolbar-new";
  newRowBtn.setAttribute("aria-label", "New row");
  newRowBtn.title = "Add row";
  newRowBtn.innerHTML =
    'New<span class="canvas-local-db-chevron" aria-hidden="true">\u25BE</span>';

  actions.appendChild(removeBtn);
  actions.appendChild(newRowBtn);

  hdr.appendChild(titleSpan);
  hdr.appendChild(actions);

  const scrollWrap = document.createElement("div");
  scrollWrap.className = "canvas-local-db-scroll";

  const tbl = document.createElement("table");
  tbl.className = "canvas-local-db-table";
  tbl.setAttribute("aria-label", "Local database");

  const thead = document.createElement("thead");
  const headRow = document.createElement("tr");
  headRow.appendChild(createLocalDbPropertyTh("Name"));
  headRow.appendChild(createLocalDbAddPropertyHeaderCell());
  thead.appendChild(headRow);

  const tbody = document.createElement("tbody");

  const trNew = document.createElement("tr");
  trNew.className = "canvas-local-db-new-page-row";
  tbody.appendChild(trNew);

  for (let i = 0; i < 2; i++) {
    const pr = document.createElement("tr");
    pr.className = "canvas-local-db-placeholder-row";
    tbody.appendChild(pr);
  }

  tbl.appendChild(thead);
  tbl.appendChild(tbody);
  scrollWrap.appendChild(tbl);

  const tableFoot = document.createElement("div");
  tableFoot.className = "canvas-local-db-table-foot";
  tableFoot.innerHTML =
    '<div class="canvas-local-db-foot-rail" aria-hidden="true">' +
    '<span class="canvas-local-db-foot-track"></span>' +
    '<span class="canvas-local-db-foot-grip"></span></div>' +
    '<button type="button" class="canvas-local-db-foot-nudge" aria-label="Scroll">' +
    "\u25B6</button>";

  shell.appendChild(hdr);
  shell.appendChild(scrollWrap);
  shell.appendChild(tableFoot);
  wrap.appendChild(shell);
  canvasDraftTablesEl.appendChild(wrap);

  syncAllLocalDbBodyRows(wrap);

  if (notionDetailsEl instanceof HTMLDetailsElement) {
    notionDetailsEl.open = true;
  }
  scheduleCanvasDraftPersist();
}

/** Same heading pattern as typical pay-slip Notion rows — used for floating local replicas. */
const FLOATING_DRAFT_PAYSLIP_COLUMN_LABELS = [
  "School",
  "Teacher",
  "Pay date",
  "Exchange amount",
  "Net Profit (ZAR)",
  "Fees (USD)",
  "Status",
];

function floatingReplicaNewRowId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `row-${Math.random().toString(36).slice(2, 12)}-${Date.now()}`;
}

/**
 * Upserts the replica snapshot into `user_workspace_draft_databases`, then mirrors into app state.
 * @param {FloatingPaySlipReplica} rep
 */
async function saveFloatingReplicaToSupabasePersistent(rep) {
  if (!payslipAppUserStateCloudReady) {
    setStatus("Sign in first — SQL save needs an active Supabase session.", true);
    return;
  }
  if (typeof window.teacherAuth?.upsertPayslipWorkspaceDatabase !== "function") {
    setStatus("SQL save is only available in the desktop app with Supabase configured.", true);
    return;
  }
  try {
    const snap = serializeFloatingReplicaForStorage(rep);
    const wp = normalizeWorkspaceFloatingDraftPageKey(rep.workspacePageId);
    const { error } = await window.teacherAuth.upsertPayslipWorkspaceDatabase({
      workspace_page_id: wp,
      replica_id: rep.id,
      title: snap.title,
      snapshot: snap,
    });
    if (error) {
      console.warn("upsertPayslipWorkspaceDatabase:", error);
      setStatus(`SQL save failed: ${error}`, true);
      return;
    }
    userWorkspaceDraftSqlReplicaKeys.add(
      floatingReplicaWorkspaceSqlKey(wp, rep.id),
    );
    syncFloatingReplicaSqlSaveButtonAppearance(rep);
    setStatus(
      `Saved "${snap.title}" to Supabase table user_workspace_draft_databases.`,
      false,
    );
    persistFloatingDraftSnapshotsForWorkspacePage(wp);
    await flushPayslipAppUserStateDirtyNow();
    refreshFloatingReplicaTableBody(rep, "Stored in Supabase (SQL).");
  } catch (e) {
    const m = e instanceof Error ? e.message : String(e);
    setStatus(`SQL save failed: ${m}`, true);
  }
}

/** @returns {FloatingPaySlipReplica | null} */
function getFloatingReplicaFromEventTarget(evTarget) {
  if (!(evTarget instanceof Element)) {
    return null;
  }
  const card = evTarget.closest("[data-floating-replica-id]");
  if (!(card instanceof HTMLElement)) {
    return null;
  }
  const id = card.getAttribute("data-floating-replica-id");
  return id ? paySlipFloatingReplicas.get(id) ?? null : null;
}

/** @param {FloatingPaySlipReplica} rep */
function getFloatingReplicaFilteredIndices(rep) {
  return getFilteredRowIndicesFromInputsForCore(
    rep.shadow.columns,
    rep.shadow.rows,
    rep.filterSchoolEl?.value ?? "",
    rep.filterDateEl?.value ?? "",
    rep.filterSortEl?.value ?? "",
  );
}

/** @param {FloatingPaySlipReplica} rep */
function reorderFloatingReplicaColumnBefore(rep, fromIdx, toIdx) {
  ensureFloatingReplicaShadowColumnKinds(rep);
  const cols = rep.shadow.columns;
  const rows = rep.shadow.rows;
  const n = cols.length;
  if (n === 0 || fromIdx === toIdx) {
    return;
  }
  if (fromIdx < 0 || fromIdx >= n || toIdx < 0 || toIdx > n) {
    return;
  }
  if (toIdx === n) {
    toIdx = n - 1;
  }
  const insertAt = fromIdx < toIdx ? toIdx - 1 : toIdx;
  if (insertAt === fromIdx) {
    return;
  }
  const [name] = cols.splice(fromIdx, 1);
  cols.splice(insertAt, 0, name);
  const kk = /** @type {FloatingPaySlipReplica["shadow"]["columnKinds"]} */ (
    rep.shadow.columnKinds
  );
  if (Array.isArray(kk) && kk.length >= n) {
    const [kEntry] = kk.splice(fromIdx, 1);
    kk.splice(insertAt, 0, kEntry);
  }
  for (const row of rows) {
    if (!Array.isArray(row) || row.length < n) {
      continue;
    }
    const [cell] = row.splice(fromIdx, 1);
    row.splice(insertAt, 0, cell);
  }
  closeColumnMenu();
  applyFloatingPaySlipReplicaRender(rep);
}

/** @param {FloatingPaySlipReplica} rep */
function applyFloatingReplicaColumnWidths(rep) {
  const { columns, hiddenNames, colWidths } = rep.shadow;
  if (!rep.tableEl || colWidths.size === 0) {
    return;
  }
  const visible = getVisibleColumnIndicesFor(columns, hiddenNames);
  for (const colIdx of visible) {
    const name = columns[colIdx];
    const w = colWidths.get(name);
    if (w == null) {
      continue;
    }
    applyColumnWidthForTableRoot(rep.tableEl, colIdx, w);
  }
}

/** @param {FloatingPaySlipReplica} rep */
function syncFloatingReplicaFilterGroups(rep) {
  const cols = rep.shadow.columns;
  const schoolIdx = findSchoolColumnIndex(cols);
  const dateIdx = findDateColumnIndex(cols);
  rep.tableToolbarEl.hidden = false;
  rep.filterToggleEl.hidden = !(
    cols.length > 0 &&
    (schoolIdx >= 0 || dateIdx >= 0)
  );
  rep.filterSchoolGroupEl.hidden = schoolIdx < 0;
  rep.filterDateGroupEl.hidden = dateIdx < 0;
  rep.filterSortGroupEl.hidden = dateIdx < 0;
}

/** @param {FloatingPaySlipReplica} rep */
function updateFloatingReplicaSchoolTabsVisibility(rep) {
  rep.scrollEl.classList.remove("table-scroll--with-tabs");
}

/** @param {FloatingPaySlipReplica} rep */
function updateFloatingReplicaShowAllColumnsBtn(rep) {
  const nh = rep.shadow.hiddenNames.size;
  const btn = rep.showAllColumnsBtn;
  btn.hidden = nh === 0;
  const label =
    nh === 1 ? "Show hidden columns (1)" : `Show hidden columns (${nh})`;
  btn.title =
    nh === 0
      ? ""
      : "Reveal columns you hid in this draft. Deleted columns cannot be restored.";
  btn.setAttribute("aria-label", label);
  btn.classList.toggle("filter-toggle--active", nh > 0);
}

/** @param {FloatingPaySlipReplica} rep */
function syncFloatingReplicaFilterToolbar(rep) {
  const cols = rep.shadow.columns;
  const schoolIdx = findSchoolColumnIndex(cols);
  const dateIdx = findDateColumnIndex(cols);
  const showToolbar = cols.length > 0 && (schoolIdx >= 0 || dateIdx >= 0);
  if (!showToolbar) {
    rep.filterPanelEl.hidden = true;
    rep.filterPanelExpanded = false;
    rep.filterToggleEl.setAttribute("aria-expanded", "false");
    rep.filterToggleEl.classList.remove("filter-toggle--active");
    return;
  }
  rep.filterPanelEl.hidden = !rep.filterPanelExpanded;
  rep.filterToggleEl.setAttribute(
    "aria-expanded",
    rep.filterPanelExpanded ? "true" : "false",
  );
  const active =
    Boolean(
      (rep.filterSchoolEl?.value ?? "") ||
        (rep.filterDateEl?.value ?? "") ||
        (rep.filterSortEl && rep.filterSortEl.value !== "desc"),
    );
  rep.filterToggleEl.classList.toggle("filter-toggle--active", active);
}

function syncOverlayIfFloatingReplicaOpen(rep) {
  syncOverlayFromTable(
    rep.shadow.columns,
    rep.shadow.rows,
    rep.shadow.pageIds,
  );
}

/**
 * Local date edit for floating replicas (does not sync to Notion).
 * @param {FloatingPaySlipReplica} rep
 * @param {number} rowIx
 * @param {number} cellIdx
 * @param {string} colName
 */
function createFloatingReplicaLocalDateInput(rep, rowIx, cellIdx, colName) {
  const row = rep.shadow.rows[rowIx];
  const cur = row?.[cellIdx];
  const ymdStart = extractYmd(cur);

  const input = document.createElement("input");
  input.type = "date";
  input.className = "cell-date-input";
  input.value = ymdStart ?? "";
  input.title = "Edit date in this draft only";
  input.setAttribute("aria-label", `Edit ${colName}`);
  input.addEventListener("change", () => {
    const rNow = rep.shadow.rows[rowIx];
    if (!rNow) {
      return;
    }
    const prevYmd = extractYmd(rNow[cellIdx]);
    const nextRaw = input.value.trim();
    if (prevYmd !== null ? nextRaw === prevYmd : nextRaw === "") {
      return;
    }
    rNow[cellIdx] = nextRaw === "" ? "" : nextRaw;
    syncOverlayIfFloatingReplicaOpen(rep);
    floatingReplicaBumpRowEdited(rep, rowIx);
  });
  return input;
}

function createFloatingReplicaLocalDateInputInline(
  rep,
  rowIx,
  cellIdx,
  colName,
) {
  const input = createFloatingReplicaLocalDateInput(rep, rowIx, cellIdx, colName);
  input.classList.add("cell-date-input", "cell-date-input--inline");
  return input;
}

/**
 * @param {FloatingPaySlipReplica} rep
 * @param {number} rowIx
 * @param {number} cellIdx
 * @param {string} colName
 * @param {"USD"|"ZAR"} currency
 * @param {string} prefix
 * @param {{ inline?: boolean }} [layout]
 */
function createFloatingReplicaLocalMoneyNumberInput(
  rep,
  rowIx,
  cellIdx,
  colName,
  currency,
  prefix,
  layout = {},
) {
  const row = rep.shadow.rows[rowIx];
  const cur = row?.[cellIdx];
  const initialNum = parseMoneyNumberFromCell(cur);
  const inline = Boolean(layout.inline);

  const wrap = document.createElement("div");
  wrap.className = inline
    ? "cell-money-wrap cell-money-wrap--inline"
    : "cell-money-wrap";

  const prefixSpan = document.createElement("span");
  prefixSpan.className = "cell-money-prefix";
  prefixSpan.setAttribute("aria-hidden", "true");
  prefixSpan.textContent = prefix;

  const input = document.createElement("input");
  input.type = "text";
  input.inputMode = "decimal";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.className = inline
    ? "cell-money-input cell-money-input--inline"
    : "cell-money-input";
  input.value =
    initialNum != null && Number.isFinite(initialNum)
      ? formatMoneyPlainInput(initialNum, currency)
      : "";
  input.title = `Edit (${currency}) in this draft only`;
  input.setAttribute("aria-label", `Edit ${colName} (${currency})`);

  input.addEventListener("blur", () => {
    const p = parseMoneyInputTextToNumber(input.value, currency);
    if (p !== null && !Number.isNaN(p)) {
      input.value = formatMoneyPlainInput(roundMoneyMinor(p), currency);
    }
    syncMoneyInputChWidth(input);
  });
  input.addEventListener("input", () => {
    syncMoneyInputChWidth(input);
  });

  input.addEventListener("change", () => {
    const rNow = rep.shadow.rows[rowIx];
    if (!rNow) {
      return;
    }
    const prevRaw = rNow[cellIdx];
    const prevNum = parseMoneyNumberFromCell(prevRaw);
    const parsed = parseMoneyInputTextToNumber(input.value, currency);
    if (Number.isNaN(parsed)) {
      input.value =
        prevNum != null ? formatMoneyPlainInput(prevNum, currency) : "";
      syncMoneyInputChWidth(input);
      return;
    }
    const nextRounded = parsed === null ? null : roundMoneyMinor(parsed);
    const same =
      (nextRounded === null && prevNum === null) ||
      (nextRounded !== null &&
        prevNum !== null &&
        Math.abs(nextRounded - prevNum) < 0.0001);
    if (same) {
      if (nextRounded !== null) {
        input.value = formatMoneyPlainInput(nextRounded, currency);
      }
      syncMoneyInputChWidth(input);
      return;
    }
    rNow[cellIdx] =
      nextRounded === null ? "" : formatMoneyDisplay(nextRounded, currency);
    syncOverlayIfFloatingReplicaOpen(rep);
    floatingReplicaBumpRowEdited(rep, rowIx);
  });

  const atomic = document.createElement("span");
  atomic.className = "cell-money-atomic";
  atomic.appendChild(prefixSpan);
  atomic.appendChild(input);
  wrap.appendChild(atomic);
  syncMoneyInputChWidth(input);
  return wrap;
}

/**
 * @param {FloatingPaySlipReplica} rep
 * @param {number} rowIx
 * @param {number} cellIdx
 * @param {string} colName
 * @param {boolean} inline
 * @param {string} [extraClass]
 */
function createFloatingReplicaPlainText(
  rep,
  rowIx,
  cellIdx,
  colName,
  inline,
  extraClass,
) {
  const rowNow = rep.shadow.rows[rowIx];
  const cur = rowNow?.[cellIdx];
  const input = document.createElement("input");
  input.type = "text";
  input.className = [
    "cell-replica-draft-input",
    inline ? "cell-replica-draft-input--inline" : "",
    extraClass ?? "",
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
  input.value = cur == null ? "" : String(cur);
  input.setAttribute("spellcheck", "false");
  input.setAttribute("aria-label", colName);
  const commit = () => {
    const r = rep.shadow.rows[rowIx];
    if (!r) {
      return;
    }
    const next = input.value;
    if (String(r[cellIdx] ?? "") === next) {
      return;
    }
    r[cellIdx] = next;
    syncOverlayIfFloatingReplicaOpen(rep);
    floatingReplicaBumpRowEdited(rep, rowIx);
  };
  input.addEventListener("change", commit);
  input.addEventListener("blur", commit);
  return input;
}

/**
 * Editable pill (local draft — not synced to Notion).
 * @param {FloatingPaySlipReplica} rep
 * @param {number} rowIx
 * @param {number} cellIdx
 * @param {string} colName
 * @param {string} display
 */
function createFloatingReplicaPillEditable(
  rep,
  rowIx,
  cellIdx,
  colName,
  display,
) {
  const rowNow = rep.shadow.rows[rowIx];
  const span = document.createElement("span");
  span.className = "cell-pill";
  span.contentEditable = "true";
  span.setAttribute("role", "textbox");
  span.setAttribute("aria-label", colName);
  span.setAttribute("spellcheck", "false");
  span.textContent = String(display ?? "").trim() === "" ? "\u200b" : display;

  span.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      ev.preventDefault();
    }
  });

  span.addEventListener("blur", () => {
    const r = rep.shadow.rows[rowIx];
    if (!r) {
      return;
    }
    const next = span.textContent.replace(/\u200b/g, "").trim();
    if (String(r[cellIdx] ?? "").trim() === next) {
      return;
    }
    r[cellIdx] = next;
    syncOverlayIfFloatingReplicaOpen(rep);
    floatingReplicaBumpRowEdited(rep, rowIx);
  });
  return span;
}

/**
 * @param {FloatingPaySlipReplica} rep
 * @param {number} rowIx
 * @param {string[]} row
 * @param {string} pageId
 * @param {number} cellIdx
 * @param {HTMLTableCellElement} td
 * @param {{ withOpenPeek: boolean }} opts
 */
function appendFloatingReplicaTableCell(
  rep,
  rowIx,
  row,
  pageId,
  cellIdx,
  td,
  opts,
) {
  const columns = rep.shadow.columns;
  const colName = columns[cellIdx];
  const cell = row[cellIdx];
  const display = displayCellInSchoolSheet(columns, cellIdx, cell);
  ensureFloatingReplicaShadowColumnKinds(rep);
  const fk = effectiveFloatingReplicaPropKind(rep, cellIdx);
  const moneySpec = notionMoneySpecForColumn(colName);
  const withOpenPeek = opts.withOpenPeek;

  const buildEditor = () => {
    if (fk === "number") {
      return createFloatingReplicaNumberInput(
        rep,
        rowIx,
        cellIdx,
        colName,
        withOpenPeek,
      );
    }
    if (fk === "multi") {
      td.classList.add("cell-pill-wrap");
      return createFloatingReplicaMultiPillWrap(rep, rowIx, cellIdx, colName);
    }
    if (fk === "status") {
      td.classList.add("cell-pill-wrap");
      return createFloatingReplicaPillEditable(
        rep,
        rowIx,
        cellIdx,
        colName,
        display,
      );
    }
    if (fk === "date") {
      return withOpenPeek
        ? createFloatingReplicaLocalDateInputInline(
            rep,
            rowIx,
            cellIdx,
            colName,
          )
        : createFloatingReplicaLocalDateInput(
            rep,
            rowIx,
            cellIdx,
            colName,
          );
    }
    if (fk === "email") {
      return createFloatingReplicaEmailInput(
        rep,
        rowIx,
        cellIdx,
        colName,
        withOpenPeek,
      );
    }
    if (fk === "checkbox") {
      return createFloatingReplicaCheckboxInput(
        rep,
        rowIx,
        cellIdx,
        colName,
        withOpenPeek,
      );
    }
    const blockMoney =
      moneySpec !== null &&
      fk !== "number" &&
      fk !== "multi" &&
      fk !== "status" &&
      fk !== "date" &&
      fk !== "email" &&
      fk !== "checkbox";
    if (blockMoney) {
      return createFloatingReplicaLocalMoneyNumberInput(
        rep,
        rowIx,
        cellIdx,
        colName,
        moneySpec.code,
        moneySpec.prefix,
        { inline: withOpenPeek },
      );
    }
    if (moneySpec !== null) {
      return createReadOnlyMoneyCell(moneySpec, cell, {
        inline: withOpenPeek,
      });
    }
    if (isPillColumn(colName)) {
      td.classList.add("cell-pill-wrap");
      return createFloatingReplicaPillEditable(
        rep,
        rowIx,
        cellIdx,
        colName,
        display,
      );
    }
    return createFloatingReplicaPlainText(
      rep,
      rowIx,
      cellIdx,
      colName,
      withOpenPeek,
      withOpenPeek ? "cell-primary" : "",
    );
  };

  if (withOpenPeek) {
    const wrap = document.createElement("div");
    wrap.className = "cell-with-open";
    wrap.appendChild(buildEditor());
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "row-open-peek";
    const icon = document.createElement("span");
    icon.className = "row-open-peek-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "\u29C9";
    btn.appendChild(icon);
    btn.appendChild(document.createTextNode(" Open"));
    btn.title = "Show this draft row over the table";
    btn.addEventListener("click", () =>
      openRowOverlay(columns, row, pageId),
    );
    wrap.appendChild(btn);
    td.appendChild(wrap);
  } else {
    td.appendChild(buildEditor());
  }
}

document.addEventListener("click", (ev) => {
  const tgt = /** @type {Element | null} */ (ev.target);
  const pickEl =
    tgt && "closest" in tgt
      ? tgt.closest("[data-floating-replica-prop-kind-pick]")
      : null;
  if (!(pickEl instanceof HTMLButtonElement)) {
    return;
  }
  const raw = (
    pickEl.dataset.floatingReplicaPropKindPick ?? ""
  ).trim();
  if (
    raw !== "text" &&
    raw !== "number" &&
    raw !== "status" &&
    raw !== "multi" &&
    raw !== "date" &&
    raw !== "email" &&
    raw !== "checkbox"
  ) {
    return;
  }
  const rid =
    typeof floatingReplicaPropPopoverReplicaId === "string"
      ? floatingReplicaPropPopoverReplicaId.trim()
      : "";
  const rep =
    rid.length > 0 ? paySlipFloatingReplicas.get(rid) ?? null : null;
  if (!rep) {
    closeFloatingReplicaPropKindPopover();
    return;
  }
  ev.preventDefault();
  /** @type {"text"|"number"|"status"|"multi"|"date"|"email"|"checkbox"} */
  const kt = raw;
  addFloatingReplicaPropertyColumn(rep, kt);
});

/** @param {FloatingPaySlipReplica} rep */
function renderFloatingReplicaThead(rep) {
  const thEl = rep.theadEl;
  const columns = rep.shadow.columns;
  if (!thEl) {
    return;
  }
  thEl.innerHTML = "";
  ensureFloatingReplicaShadowColumnKinds(rep);
  const visible = getVisibleColumnIndicesFor(
    columns,
    rep.shadow.hiddenNames,
  );
  const thZBase = visible.length + 24;
  const headRow = document.createElement("tr");
  visible.forEach((colIdx, visualColIndex) => {
    const col = columns[colIdx];
    const colTitle = displayNotionSheetColumnLabel(col);
    const th = document.createElement("th");
    th.className = "th-with-menu";
    th.dataset.colIndex = String(colIdx);
    th.style.zIndex = String(thZBase - visualColIndex);
    const inner = document.createElement("div");
    inner.className = "th-inner";
    const wrap = document.createElement("span");
    wrap.className = "th-label th-label--draggable";
    wrap.draggable = true;
    const fkHi = effectiveFloatingReplicaPropKind(rep, colIdx);
    wrap.title = `${floatingReplicaPropKindLegend(fkHi)} — drag to reorder`;
    const icon = document.createElement("span");
    icon.className = "th-icon th-icon--floating-prop-kind";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML =
      FLOATING_REPLICA_TH_KIND_SVG[fkHi] ?? FLOATING_REPLICA_TH_KIND_SVG.text;
    icon.title = `${floatingReplicaPropKindLegend(fkHi)}`;
    wrap.appendChild(icon);
    const labelText = document.createElement("span");
    labelText.className = "th-label-text";
    labelText.textContent = colTitle;
    wrap.appendChild(labelText);

    const menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "th-menu-btn";
    menuBtn.setAttribute("aria-label", `Options for ${colTitle}`);
    menuBtn.setAttribute("aria-haspopup", "true");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.title = "Column options";
    menuBtn.draggable = false;
    const tri = document.createElement("span");
    tri.className = "th-menu-tri";
    tri.setAttribute("aria-hidden", "true");
    menuBtn.appendChild(tri);
    menuBtn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      if (
        columnMenuAnchorEl === menuBtn &&
        columnMenuEl &&
        !columnMenuEl.hidden
      ) {
        closeColumnMenu();
        return;
      }
      openColumnMenu(menuBtn, col, rep.id);
    });
    inner.appendChild(wrap);
    inner.appendChild(menuBtn);
    th.appendChild(inner);

    const resizeHandle = document.createElement("span");
    resizeHandle.className = "th-resize-handle";
    resizeHandle.setAttribute("role", "separator");
    resizeHandle.setAttribute("aria-orientation", "vertical");
    resizeHandle.setAttribute(
      "aria-label",
      `Resize «${colTitle}» column (drag sideways)`,
    );
    resizeHandle.title = "Drag sideways to widen or narrow this column";
    attachColumnResizeHandleListeners(resizeHandle, th, col, colIdx, rep.id);
    th.appendChild(resizeHandle);

    wrap.addEventListener("dragstart", (ev) => {
      ev.stopPropagation();
      th.classList.add("th-dragging");
      try {
        ev.dataTransfer?.setData(
          REPLICA_COLUMN_DRAG_MIME,
          `${rep.id}|${String(colIdx)}`,
        );
        if (ev.dataTransfer) {
          ev.dataTransfer.effectAllowed = "move";
        }
      } catch {
        /* ignore */
      }
    });

    th.addEventListener("dragover", (ev) => {
      ev.preventDefault();
      if (ev.dataTransfer) {
        ev.dataTransfer.dropEffect = "move";
      }
      th.classList.add("th-drop-target");
    });
    th.addEventListener("dragleave", (ev) => {
      const rel = /** @type {Node | null} */ (ev.relatedTarget);
      if (rel instanceof Node && th.contains(rel)) {
        return;
      }
      th.classList.remove("th-drop-target");
    });
    th.addEventListener("drop", (ev) => {
      ev.preventDefault();
      th.classList.remove("th-drop-target");
      let merged = "";
      try {
        merged = ev.dataTransfer?.getData(REPLICA_COLUMN_DRAG_MIME) ?? "";
      } catch {
        merged = "";
      }
      const parts = merged.split("|");
      const dragRepId = String(parts[0] ?? "").trim();
      const fromRaw = Number(parts[1]);
      const dropIdx =
        typeof th.dataset.colIndex === "string"
          ? Number(th.dataset.colIndex)
          : NaN;
      if (
        dragRepId !== rep.id ||
        !Number.isInteger(fromRaw) ||
        !Number.isInteger(dropIdx)
      ) {
        return;
      }
      reorderFloatingReplicaColumnBefore(rep, fromRaw, dropIdx);
    });

    headRow.appendChild(th);
  });
  if (columns.length > 0) {
    const appendSysHead = (
      menuColKey,
      svgHtml,
      labelText,
      tooltip,
      extraCls,
      showCol,
    ) => {
      if (!showCol(rep)) {
        return;
      }
      const th = document.createElement("th");
      th.className = [
        "th-with-menu",
        "floating-replica-sys-time-th",
        extraCls,
      ]
        .filter(Boolean)
        .join(" ");

      th.scope = "col";
      const inner = document.createElement("div");
      inner.className = "th-inner floating-replica-sys-time-inner";

      const wrap = document.createElement("span");
      wrap.className = "th-label";
      wrap.draggable = false;
      wrap.title = tooltip;
      const icon = document.createElement("span");
      icon.className = "th-icon th-icon--floating-prop-kind";
      icon.setAttribute("aria-hidden", "true");
      icon.innerHTML = svgHtml;
      icon.title = labelText;

      const lab = document.createElement("span");
      lab.className = "th-label-text";
      lab.textContent = labelText;
      wrap.appendChild(icon);
      wrap.appendChild(lab);

      const menuBtn = document.createElement("button");
      menuBtn.type = "button";
      menuBtn.className = "th-menu-btn";
      menuBtn.setAttribute("aria-label", `Options for ${labelText}`);
      menuBtn.setAttribute("aria-haspopup", "true");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.title = "Column options";
      menuBtn.draggable = false;
      const tri = document.createElement("span");
      tri.className = "th-menu-tri";
      tri.setAttribute("aria-hidden", "true");
      menuBtn.appendChild(tri);
      menuBtn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        if (
          columnMenuAnchorEl === menuBtn &&
          columnMenuEl &&
          !columnMenuEl.hidden
        ) {
          closeColumnMenu();
          return;
        }
        openColumnMenu(menuBtn, menuColKey, rep.id);
      });

      inner.appendChild(wrap);
      inner.appendChild(menuBtn);
      th.appendChild(inner);

      headRow.appendChild(th);
    };

    appendSysHead(
      FLOATING_REPLICA_SYS_TIME_CREATED_MENU_COL,
      FLOATING_REPLICA_SYS_TIME_CREATED_SVG,
      FLOATING_REPLICA_SYS_CREATED_LABEL,
      `${FLOATING_REPLICA_SYS_CREATED_LABEL} — read-only in this draft`,
      "floating-replica-sys-time-th--created",
      floatingReplicaShowsCreatedTimeColumn,
    );
    appendSysHead(
      FLOATING_REPLICA_SYS_TIME_EDITED_MENU_COL,
      FLOATING_REPLICA_SYS_TIME_EDITED_SVG,
      FLOATING_REPLICA_SYS_EDITED_LABEL,
      `${FLOATING_REPLICA_SYS_EDITED_LABEL} — read-only in this draft`,
      "floating-replica-sys-time-th--edited",
      floatingReplicaShowsEditedTimeColumn,
    );

    const addTh = document.createElement("th");
    addTh.className = "floating-replica-add-property-col";
    addTh.scope = "col";
    addTh.dataset.floatingReplicaAddPropertyCol = "";
    addTh.style.zIndex = "1";
    const addBtnWrap = document.createElement("div");
    addBtnWrap.className = "floating-replica-add-property-inner";
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "floating-replica-add-property-btn";
    addBtn.dataset.floatingReplicaPropMenuToggle = "";
    addBtn.title = "Add property";
    addBtn.setAttribute("aria-label", "Add property column");
    addBtn.setAttribute("aria-haspopup", "menu");
    addBtn.innerHTML =
      `<span class="floating-replica-add-prop-btn-chip">${FLOATING_REPLICA_TH_ADD_COL_PLUS_SVG}</span>`;
    addBtnWrap.appendChild(addBtn);
    addTh.appendChild(addBtnWrap);
    headRow.appendChild(addTh);
  }
  thEl.appendChild(headRow);
}

/**
 * @param {FloatingPaySlipReplica} rep
 * @param {number[]} indices
 */
function renderFloatingReplicaTbody(rep, indices) {
  const columns = rep.shadow.columns;
  const tbEl = rep.tbodyEl;
  if (!tbEl) {
    return;
  }
  normalizeFloatingReplicaRowTimestamps(rep);
  tbEl.innerHTML = "";
  const { rows, pageIds } = rep.shadow;
  const ids = Array.isArray(pageIds) ? pageIds : [];
  const visible = getVisibleColumnIndicesFor(columns, rep.shadow.hiddenNames);
  const firstVisible = visible[0];

  for (const idx of indices) {
    const row = rows[idx];
    const pageId = ids[idx] || "";
    const tr = document.createElement("tr");
    tr.className = "tr-with-peek floating-draft-data-row";

    for (const cellIdx of visible) {
      const td = document.createElement("td");
      appendFloatingReplicaTableCell(rep, idx, row, pageId, cellIdx, td, {
        withOpenPeek: cellIdx === firstVisible,
      });
      td.dataset.colIndex = String(cellIdx);
      tr.appendChild(td);
    }
    if (columns.length > 0) {
      if (floatingReplicaShowsCreatedTimeColumn(rep)) {
        const creTd = document.createElement("td");
        creTd.className =
          "floating-replica-sys-time-td floating-replica-sys-time-td--created";
        creTd.textContent = formatFloatingReplicaDateTime(
          rep.shadow.rowCreatedMs[idx] ?? 0,
        );
        creTd.title = FLOATING_REPLICA_SYS_CREATED_LABEL;
        creTd.dataset.floatingReplicaSysTimeRole = "created";
        tr.appendChild(creTd);
      }
      if (floatingReplicaShowsEditedTimeColumn(rep)) {
        const edTd = document.createElement("td");
        edTd.className =
          "floating-replica-sys-time-td floating-replica-sys-time-td--edited";
        edTd.textContent = formatFloatingReplicaDateTime(
          rep.shadow.rowEditedMs[idx] ?? 0,
        );
        edTd.title = FLOATING_REPLICA_SYS_EDITED_LABEL;
        edTd.dataset.floatingReplicaSysTimeRole = "edited";
        tr.appendChild(edTd);
      }

      const spacer = document.createElement("td");
      spacer.className = "floating-replica-add-prop-spacer";
      spacer.dataset.floatingReplicaAddPropSpacer = "";
      spacer.textContent = "\u200b";
      tr.appendChild(spacer);
    }
    tbEl.appendChild(tr);
  }
}

/** @param {FloatingPaySlipReplica} rep @param {number} rowIx */
function floatingReplicaBumpRowEdited(rep, rowIx) {
  if (
    !(Number.isInteger(rowIx) && rowIx >= 0 && rowIx < rep.shadow.rows.length)
  ) {
    return;
  }
  normalizeFloatingReplicaRowTimestamps(rep);
  rep.shadow.rowEditedMs[rowIx] = Date.now();
  refreshFloatingReplicaTableBody(rep);
  scheduleFloatingDraftPersistForWorkspacePage(rep.workspacePageId);
}

/** @param {FloatingPaySlipReplica} rep */
function syncFloatingReplicaNotionLinkIndicator(rep) {
  const el = rep.notionLinkCheckEl;
  if (!(el instanceof HTMLElement)) {
    return;
  }
  const linked = normalizeNotionRecordIdForMatch(
    rep.shadow.linkedNotionPageId ?? "",
  );
  el.classList.toggle("db-linked-check--notion-linked", Boolean(linked));
}

/** @param {FloatingPaySlipReplica} rep @param {string} [extraFootnote] */
function refreshFloatingReplicaTableBody(rep, extraFootnote = "") {
  const indices = getFloatingReplicaFilteredIndices(rep);
  renderFloatingReplicaTbody(rep, indices);
  const n = indices.length;
  const linked = normalizeNotionRecordIdForMatch(
    rep.shadow.linkedNotionPageId ?? "",
  );
  const linkSuf =
    linked && floatingReplicaIsOnPaySlipsSidebarPage(rep)
      ? " · Hydrated from Notion (Names & Notion row IDs match)."
      : "";
  const note = extraFootnote && String(extraFootnote).trim()
    ? ` · ${String(extraFootnote).trim()}`
    : "";
  rep.footerHintEl.textContent = `${n} row(s) loaded.${linkSuf}${note}`;
  syncFloatingReplicaFilterToolbar(rep);
  syncFloatingReplicaNotionLinkIndicator(rep);
}

/** @param {FloatingPaySlipReplica} rep */
function applyFloatingPaySlipReplicaRender(rep, opts = {}) {
  normalizeFloatingReplicaRowTimestamps(rep);
  refillSchoolFilterSelect(
    rep.filterSchoolEl,
    rep.filterSchoolEl.value,
    rep.shadow.columns,
    rep.shadow.rows,
  );
  updateFloatingReplicaSchoolTabsVisibility(rep);
  syncFloatingReplicaFilterGroups(rep);

  renderFloatingReplicaThead(rep);

  refreshFloatingReplicaTableBody(rep);

  applyFloatingReplicaColumnWidths(rep);

  updateFloatingReplicaShowAllColumnsBtn(rep);
  syncFloatingReplicaFilterToolbar(rep);
  syncFloatingReplicaSqlSaveButtonAppearance(rep);

  rep.tableEl.hidden = rep.shadow.columns.length === 0;
  rep.footerEl.hidden = rep.shadow.columns.length === 0;
  const skipPersist = Boolean(opts && opts.skipPersistSchedule);
  if (!skipPersist && !suppressFloatingReplicaPersistWrites) {
    scheduleFloatingDraftPersistForWorkspacePage(rep.workspacePageId);
  }
}

/** @param {FloatingPaySlipReplica} rep */
function floatingReplicaAppendBlankDataRow(rep) {
  const n = rep.shadow.columns.length;
  if (n <= 0) {
    return;
  }
  const now = Date.now();
  rep.shadow.rows.push(Array.from({ length: n }, () => ""));
  rep.shadow.pageIds.push(floatingReplicaNewRowId());
  normalizeFloatingReplicaRowTimestamps(rep);
  const lastIx = rep.shadow.rows.length - 1;
  rep.shadow.rowCreatedMs[lastIx] = now;
  rep.shadow.rowEditedMs[lastIx] = now;
  applyFloatingPaySlipReplicaRender(rep);
}

/** @param {FloatingPaySlipReplica} rep */
function clearFloatingReplicaFilters(rep) {
  if (rep.filterSchoolEl) {
    rep.filterSchoolEl.value = "";
  }
  if (rep.filterDateEl) {
    rep.filterDateEl.value = "";
  }
  if (rep.filterSortEl) {
    rep.filterSortEl.value = "desc";
  }
}

function floatingReplicaEnforceNonemptyBarTitle(rep) {
  let t = String(rep.barTitleEl?.textContent ?? "")
    .replace(/\u00a0/g, " ")
    .trim();
  if (!t.length) {
    rep.barTitleEl.textContent = "New database";
    return "New database";
  }
  if (t.length > 400) {
    const s = t.slice(0, 400);
    rep.barTitleEl.textContent = s;
    return s;
  }
  return t;
}

/**
 * @typedef {{ forceNotionApi?: boolean }} FloatingReplicaNotionSyncOpts
 */

/**
 * Match title to "Names and Notion row IDs" on Payslips page; fill draft from main `rawTable` or Notion API.
 * With `forceNotionApi`, tries a live Notion page fetch first (toolbar refresh); falls back to the loaded payslip table only when the app cannot complete the fetch but that row is present locally.
 * @param {FloatingPaySlipReplica} rep
 * @param {FloatingReplicaNotionSyncOpts} [opts]
 */
async function floatingReplicaTrySyncLinkedNotionRow(rep, opts = {}) {
  if (!rep || !rep.root?.isConnected) {
    return;
  }
  if (!floatingReplicaIsOnPaySlipsSidebarPage(rep)) {
    return;
  }
  if (rep._linkedNotionSyncBusy) {
    return;
  }
  ensureFloatingReplicaSysTimeShadowFields(rep);
  rep._linkedNotionSyncBusy = true;

  const notionPullBtns = rep.root.querySelectorAll(
    "[data-floating-replica-notion-refresh-toolbar]",
  );

  try {
    notionPullBtns.forEach((b) => {
      if (b instanceof HTMLButtonElement) {
        b.disabled = true;
        b.setAttribute("aria-busy", "true");
      }
    });

    const forceNotionApi = opts.forceNotionApi === true;
    const notionApiAvail =
      typeof window !== "undefined" &&
      window.notionApi &&
      typeof window.notionApi.retrievePageTable === "function";

    const titleCommitted = floatingReplicaEnforceNonemptyBarTitle(rep);
    collectPayslipNotionLinksFromDom();
    const recordRaw =
      notionPersonRecordIdMatchingFloatingReplicaTitle(titleCommitted);

    if (!String(recordRaw ?? "").trim()) {
      rep.shadow.linkedNotionPageId = "";
      refreshFloatingReplicaTableBody(
        rep,
        forceNotionApi
          ? "No Notion row ID for this title — add the person to Names and Notion row IDs."
          : "",
      );
      return;
    }

    const rid = String(recordRaw).trim().slice(0, 200);
    const normWant = normalizeNotionRecordIdForMatch(rid);
    if (!normWant) {
      rep.shadow.linkedNotionPageId = "";
      refreshFloatingReplicaTableBody(rep);
      return;
    }

    const rawIx = findPaySlipMainRawRowIndexForNormalizedNotionId(normWant);
    /** @type {string} */
    let footerExtra = "";
    let okHydrate = false;

    /**
     * @returns {Promise<{ ok: boolean; detail?: string }>}
     */
    async function retrievePageAndHydrate() {
      if (!notionApiAvail) {
        return { ok: false, detail: "" };
      }
      /** @type {{ ok?: boolean; message?: string; columns?: unknown[]; rows?: unknown[][]; pageIds?: unknown[] }} */
      let res;
      try {
        res = await window.notionApi.retrievePageTable({
          pageId: rid,
          rowTitleHint: titleCommitted,
        });
      } catch (e0) {
        const msg = e0 instanceof Error ? e0.message : String(e0);
        return { ok: false, detail: msg };
      }
      if (!res || res.ok !== true) {
        const detail =
          typeof res.message === "string" ? res.message : "Notion request failed.";
        return { ok: false, detail };
      }
      const cols = Array.isArray(res.columns) ? res.columns : [];
      const rowz = Array.isArray(res.rows) ? res.rows : [];
      const pids = Array.isArray(res.pageIds) ? res.pageIds : [];
      if (!cols.length) {
        return {
          ok: false,
          detail: "Notion returned no columns for that id.",
        };
      }

      /** @type {string[][]} */
      const rows2d = [];
      for (let i = 0; i < rowz.length; i++) {
        const r = rowz[i];
        rows2d.push(Array.isArray(r) ? [...r] : []);
      }

      const ok = applyHydratedFloatingReplicaShadowFromNotionMirror(
        rep,
        cols.map((x) => (x == null ? "" : String(x))),
        rows2d,
        pids,
        normWant,
      );
      if (!ok) {
        return {
          ok: false,
          detail: "Could not map Notion data onto this draft.",
        };
      }
      return { ok: true };
    }

    if (!forceNotionApi) {
      if (rawIx >= 0) {
        const row = rawTable.rows[rawIx];
        okHydrate = applyHydratedFloatingReplicaShadowFromLinkedNotion(
          rep,
          rawTable.columns,
          [...(row ?? [])],
          rawTable.pageIds?.[rawIx],
          normWant,
        );
      } else if (notionApiAvail) {
        const r = await retrievePageAndHydrate();
        if (r.ok) {
          okHydrate = true;
        } else {
          rep.shadow.linkedNotionPageId = "";
          refreshFloatingReplicaTableBody(
            rep,
            r.detail || "Notion request failed.",
          );
          return;
        }
      } else {
        rep.shadow.linkedNotionPageId = "";
        refreshFloatingReplicaTableBody(
          rep,
          "Row not in the loaded payslip table — refresh the main sheet, or use the desktop app to fetch by ID.",
        );
        return;
      }
    } else {
      const rApi = notionApiAvail ? await retrievePageAndHydrate() : { ok: false };
      if (rApi.ok) {
        okHydrate = true;
      } else if (rawIx >= 0) {
        const row = rawTable.rows[rawIx];
        okHydrate = applyHydratedFloatingReplicaShadowFromLinkedNotion(
          rep,
          rawTable.columns,
          [...(row ?? [])],
          rawTable.pageIds?.[rawIx],
          normWant,
        );
        if (okHydrate) {
          footerExtra = notionApiAvail
            ? `Notion fetch did not succeed (${rApi.detail || "unknown error"}); using values from the loaded payslip table instead.`
            : "Values from the loaded payslip table. Use the desktop app to pull straight from Notion by page ID.";
        }
      } else if (notionApiAvail) {
        rep.shadow.linkedNotionPageId = "";
        refreshFloatingReplicaTableBody(
          rep,
          rApi.detail || "Could not fetch that Notion page.",
        );
        return;
      } else {
        rep.shadow.linkedNotionPageId = "";
        refreshFloatingReplicaTableBody(
          rep,
          "Row not in the loaded payslip table — refresh the main sheet, or use the desktop app to fetch by ID.",
        );
        return;
      }
    }

    if (!okHydrate) {
      rep.shadow.linkedNotionPageId = "";
      refreshFloatingReplicaTableBody(rep, "Could not map that Notion row onto this draft.");
      return;
    }

    applyFloatingPaySlipReplicaRender(rep);
    scheduleFloatingDraftPersistForWorkspacePage(rep.workspacePageId);
    if (footerExtra) {
      refreshFloatingReplicaTableBody(rep, footerExtra);
    }
  } finally {
    rep._linkedNotionSyncBusy = false;
    notionPullBtns.forEach((b) => {
      if (b instanceof HTMLButtonElement) {
        b.disabled = false;
        b.removeAttribute("aria-busy");
      }
    });
  }
}

/**
 * Run async work on `items` with at most `limit` in flight (order not preserved across items).
 * @template T
 * @param {T[]} items
 * @param {number} limit
 * @param {(item: T) => Promise<void>} fn
 */
async function asyncPoolForEach(items, limit, fn) {
  if (items.length === 0) {
    return;
  }
  let next = 0;
  const cap = Math.max(1, Math.min(limit, items.length));
  async function worker() {
    while (true) {
      const i = next;
      next += 1;
      if (i >= items.length) {
        return;
      }
      await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: cap }, () => worker()));
}

function scheduleFloatingReplicaLinkedNotionResyncAfterMainPayslipTableLoad() {
  const reps = [...paySlipFloatingReplicas.values()].filter(
    (fr) =>
      floatingReplicaIsOnPaySlipsSidebarPage(fr) && fr.root?.isConnected,
  );
  void (async () => {
    await asyncPoolForEach(reps, 12, (fr) =>
      floatingReplicaTrySyncLinkedNotionRow(fr),
    );
  })();
}

/**
 * Ensures every workspace page’s draft databases are mounted, then resyncs each in-DOM replica
 * with Notion. After a fresh {@link loadNotion}, use `forceNotionApi: false` (default) so rows that
 * appear in the main payslip table hydrate instantly; set `forceNotionApi: true` to always hit
 * the Notion API first (slower — use the per-card toolbar refresh for that).
 * @param {{ forceNotionApi?: boolean }} [opts]
 */
async function refreshAllFloatingReplicasNotionHydration(opts = {}) {
  const forceNotionApi = opts.forceNotionApi === true;
  for (const p of notionWorkspacePagesState) {
    if (p.kind !== "trash") {
      ensureFloatingDraftsHydratedForWorkspacePage(p.id);
    }
  }
  const reps = [...paySlipFloatingReplicas.values()].filter(
    (fr) =>
      floatingReplicaIsOnPaySlipsSidebarPage(fr) && fr.root?.isConnected,
  );
  const inFlight = forceNotionApi ? 5 : 12;
  await asyncPoolForEach(reps, inFlight, (fr) =>
    floatingReplicaTrySyncLinkedNotionRow(fr, { forceNotionApi }),
  );
}

function svgFilterToggleIcon() {
  return (
    '<svg class="filter-toggle-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />' +
    "</svg>"
  );
}

/** @param {FloatingPaySlipReplica} rep */
function bindFloatingReplicaTitlePersist(rep) {
  rep.barTitleEl.addEventListener("blur", () => {
    void floatingReplicaTrySyncLinkedNotionRow(rep).finally(() =>
      scheduleFloatingDraftPersistForWorkspacePage(rep.workspacePageId),
    );
  });
}

/**
 * Toolbar refresh listener (direct listener so SVG inner nodes still register).
 * @param {FloatingPaySlipReplica} rep
 */
function attachFloatingReplicaNotionPullClickHandlers(rep) {
  if (rep._notionPullClickHandlersBound) {
    return;
  }
  rep._notionPullClickHandlersBound = true;

  const runPull = (ev) => {
    ev.preventDefault();
    ev.stopPropagation();
    void floatingReplicaTrySyncLinkedNotionRow(rep, { forceNotionApi: true });
  };

  const tool = rep.refreshFakeEl;
  if (
    tool instanceof HTMLButtonElement &&
    tool.hasAttribute("data-floating-replica-notion-refresh-toolbar")
  ) {
    tool.addEventListener("click", runPull);
  }
}

/** @param {FloatingPaySlipReplica} rep @param {HTMLElement} mountParent */
function registerFloatingReplicaInMemory(rep, mountParent) {
  paySlipFloatingReplicas.set(rep.id, rep);
  floatingDraftWorkspacePageUserActivated.add(
    normalizeWorkspaceFloatingDraftPageKey(rep.workspacePageId),
  );
  bindFloatingReplicaTitlePersist(rep);
  attachFloatingReplicaNotionPullClickHandlers(rep);
  mountParent.appendChild(rep.root);
  applyFloatingPaySlipReplicaRender(rep);
  void floatingReplicaTrySyncLinkedNotionRow(rep);
}

/**
 * Hydrate saved drafts for this workspace page, reattach in-memory replicas to the mount,
 * and recover from orphan DOM (cards without map entries) when storage can repopulate.
 * @param {string | null | undefined} pageId
 */
function ensureFloatingDraftsHydratedForWorkspacePage(pageId) {
  const k = normalizeWorkspaceFloatingDraftPageKey(pageId);
  if (k === WORKSPACE_TRASH_PAGE_ID) {
    return;
  }
  const mountEl = floatingDraftDatasheetMountForWorkspacePage(pageId);
  if (!mountEl) {
    return;
  }

  const blob = readFloatingDraftsObjectStore();
  const list = Array.isArray(blob[k]) ? blob[k] : [];

  const repsForK = [...paySlipFloatingReplicas.values()].filter(
    (r) => normalizeWorkspaceFloatingDraftPageKey(r.workspacePageId) === k,
  );

  if (repsForK.length > 0) {
    suppressFloatingReplicaPersistWrites = true;
    try {
      mountEl.replaceChildren();
      for (const rep of repsForK) {
        mountEl.appendChild(rep.root);
      }
    } finally {
      suppressFloatingReplicaPersistWrites = false;
    }
    floatingDraftWorkspacePageUserActivated.add(k);
    return;
  }

  const hadDomCards = Boolean(
    mountEl.querySelector(":scope > .floating-draft-datasheet-card"),
  );

  if (hadDomCards && list.length === 0) {
    return;
  }

  if (hadDomCards && list.length > 0) {
    mountEl.replaceChildren();
  }

  if (list.length === 0) {
    return;
  }

  suppressFloatingReplicaPersistWrites = true;
  try {
    for (const snap of list) {
      const rep = buildFloatingReplicaFromPersistOrNew(k, snap);
      if (!rep) {
        continue;
      }
      paySlipFloatingReplicas.set(rep.id, rep);
      bindFloatingReplicaTitlePersist(rep);
      attachFloatingReplicaNotionPullClickHandlers(rep);
      mountEl.appendChild(rep.root);
      applyFloatingPaySlipReplicaRender(rep, { skipPersistSchedule: true });
    }
  } finally {
    suppressFloatingReplicaPersistWrites = false;
  }
  if (
    [...paySlipFloatingReplicas.values()].some(
      (r) => normalizeWorkspaceFloatingDraftPageKey(r.workspacePageId) === k,
    )
  ) {
    floatingDraftWorkspacePageUserActivated.add(k);
  }
  if (payslipNotionLinksTbodyEl instanceof HTMLElement) {
    scheduleFloatingReplicaLinkedNotionResyncAfterMainPayslipTableLoad();
  }
}

/**
 * Builds a floating replica (DOM + shadow). Caller must append and register unless restoring.
 * @param {string} workspacePageKey Normalized sidebar page id
 * @param {unknown | null | undefined} persistedSnap JSON snapshot from storage, or null for an empty replica
 */
function buildFloatingReplicaFromPersistOrNew(
  workspacePageKey,
  persistedSnap,
) {
  const wp = normalizeWorkspaceFloatingDraftPageKey(workspacePageKey);
  if (wp === WORKSPACE_TRASH_PAGE_ID) {
    return null;
  }

  const colsDefault = FLOATING_DRAFT_PAYSLIP_COLUMN_LABELS.slice();
  const coerced =
    persistedSnap != null && typeof persistedSnap === "object"
      ? coercePersistedFloatingReplica(persistedSnap, colsDefault.slice())
      : null;

  if (persistedSnap != null && typeof persistedSnap === "object" && !coerced) {
    return null;
  }

  /** @type {string} */
  let replicaId;
  if (!coerced) {
    floatingDraftPaySlipSheetUid += 1;
    replicaId = `float-${floatingDraftPaySlipSheetUid}`;
  } else {
    replicaId = coerced.id;
  }

  /** @type {string[]} initialCols */
  let initialCols;
  /** @type {string[][]} rows */
  let rows;
  /** @type {string[]} pid */
  let pageIds;
  /** @type {Set<string>} */
  let hiddenNames;
  /** @type {Map<string, number>} */
  let colWidths;
  /** @type {string} titleText */
  let titleText;
  /** @type {string} fvSchool fvDate fvSort */
  let fvSchool = "";
  let fvDate = "";
  let fvSort = "desc";
  /** @type {boolean} fpExp */
  let fpExp = false;

  /** @type {FloatingPaySlipReplica["shadow"]["columnKinds"]} */
  let initialColumnKinds;

  /** @type {number[]} */
  let rowCreatedMs;
  /** @type {number[]} */
  let rowEditedMs;

  /** @type {boolean} */
  let omitSysCreated = false;
  /** @type {boolean} */
  let omitSysEdited = false;

  /** @type {string} linked Notion row id hex (normalized) when hydrated from Payslip IDs table */
  let linkedNotionPageId = "";

  if (coerced) {
    initialCols = coerced.columns;
    rows = coerced.rows.map((r) => [...r]);
    pageIds = coerced.pageIds.slice();
    hiddenNames = new Set(coerced.hiddenNames);
    colWidths = new Map(coerced.colWidths);
    titleText = coerced.title;
    fvSchool = coerced.filterSchool;
    fvDate = coerced.filterDate;
    fvSort =
      coerced.filterSort === "asc" || coerced.filterSort === ""
        ? coerced.filterSort
        : "desc";
    fpExp = coerced.filterPanelExpanded;
    initialColumnKinds = [...coerced.columnKinds];
    rowCreatedMs =
      Array.isArray(coerced.rowCreatedMs)
        ? coerced.rowCreatedMs.slice()
        : [];
    rowEditedMs =
      Array.isArray(coerced.rowEditedMs) ? coerced.rowEditedMs.slice() : [];
    omitSysCreated = Boolean(coerced.omitSysCreated);
    omitSysEdited = Boolean(coerced.omitSysEdited);
    linkedNotionPageId = normalizeNotionRecordIdForMatch(
      typeof coerced.linkedNotionPageId === "string"
        ? coerced.linkedNotionPageId
        : "",
    );
  } else {
    initialCols = colsDefault.slice();
    rows = [Array.from({ length: initialCols.length }, () => "")];
    pageIds = [floatingReplicaNewRowId()];
    hiddenNames = new Set();
    colWidths = new Map();
    titleText = "New database";
    initialColumnKinds = initialCols.map((_, i) =>
      inferFloatingReplicaPropKind(initialCols, i, initialCols[i]),
    );
    const nowTs = Date.now();
    rowCreatedMs = [nowTs];
    rowEditedMs = [nowTs];
  }

  const card = document.createElement("div");
  card.className = "floating-draft-datasheet-card";
  card.dataset.floatingReplicaId = replicaId;
  card.dataset.workspacePageId = wp;

  const bar = document.createElement("div");
  bar.className = "floating-draft-datasheet-bar";

  const titleRow = document.createElement("div");
  titleRow.className = "floating-draft-datasheet-title-row";

  const titleSpan = document.createElement("span");
  titleSpan.className = "floating-draft-datasheet-title";
  titleSpan.contentEditable = "true";
  titleSpan.setAttribute("spellcheck", "false");
  titleSpan.textContent = titleText;
  if (payslipNotionLinksTbodyEl instanceof HTMLElement) {
    titleSpan.title =
      'Every draft needs a title; blank titles become "New database". If this title matches Given + Family in the Payslip Names and Notion row IDs table, the draft fills from that person\'s Notion row.';
  }
  titleRow.appendChild(titleSpan);

  const titleCheck = document.createElement("span");
  titleCheck.className = "db-linked-check";
  titleCheck.setAttribute("aria-hidden", "true");
  titleCheck.innerHTML = LINKED_DB_CHECK_SVG;
  titleRow.appendChild(titleCheck);

  const actions = document.createElement("div");
  actions.className = "floating-draft-datasheet-actions";

  const rm = document.createElement("button");
  rm.type = "button";
  rm.className =
    "floating-draft-datasheet-remove floating-draft-datasheet-remove--replica";
  rm.textContent = "Remove card";
  rm.title = "Remove this draft database from the workspace";
  rm.dataset.floatingReplicaRemove = "";
  actions.appendChild(rm);

  bar.appendChild(titleRow);
  bar.appendChild(actions);

  const wrap = document.createElement("div");
  wrap.className = "table-wrap floating-replica-table-wrap";

  const tableToolbarEl = document.createElement("div");
  tableToolbarEl.className = "table-toolbar floating-replica-table-toolbar";

  const stripOuter = document.createElement("div");
  stripOuter.className = "table-toolbar-strip";

  const iconsWrap = document.createElement("div");
  iconsWrap.className = "table-toolbar-icons";

  const filterToggleEl = document.createElement("button");
  filterToggleEl.type = "button";
  filterToggleEl.className = "filter-toggle floating-replica-filter-toggle";
  filterToggleEl.setAttribute("aria-expanded", fpExp ? "true" : "false");
  filterToggleEl.hidden = false;
  filterToggleEl.dataset.floatingReplicaFilterToggle = "";
  filterToggleEl.innerHTML = svgFilterToggleIcon();
  filterToggleEl.setAttribute("aria-label", "Filters");
  filterToggleEl.title = "Show or hide filters";

  const refreshBtn = document.createElement("button");
  refreshBtn.type = "button";
  refreshBtn.innerHTML =
    '<svg class="filter-toggle-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />' +
    "</svg>";
  if (payslipNotionLinksTbodyEl instanceof HTMLElement) {
    refreshBtn.disabled = false;
    refreshBtn.className =
      "filter-toggle floating-replica-refresh-toolbar floating-replica-refresh-from-notion";
    refreshBtn.setAttribute(
      "data-floating-replica-notion-refresh-toolbar",
      "1",
    );
    refreshBtn.setAttribute(
      "aria-label",
      "Refresh from Notion using database title",
    );
    refreshBtn.title =
      "Matches the database title to Names and Notion row IDs, then reloads all properties from that person's Notion page.";
  } else {
    refreshBtn.disabled = true;
    refreshBtn.className = "filter-toggle floating-replica-refresh-placeholder";
    refreshBtn.dataset.floatingReplicaRefreshDisabled = "";
    refreshBtn.setAttribute("aria-label", "Refresh");
    refreshBtn.title =
      "This draft stays on your device — there is nothing to refresh from Notion.";
  }

  const showAllColumnsBtn = document.createElement("button");
  showAllColumnsBtn.type = "button";
  showAllColumnsBtn.hidden = true;
  showAllColumnsBtn.className =
    "filter-toggle filter-toggle--show-hidden-cols floating-replica-show-all";
  showAllColumnsBtn.dataset.floatingReplicaShowAllCols = "";
  showAllColumnsBtn.setAttribute("aria-label", "Show hidden columns");
  showAllColumnsBtn.innerHTML =
    '<svg class="filter-toggle-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/>' +
    '<circle cx="12" cy="12" r="3"/>' +
    "</svg>";

  iconsWrap.appendChild(filterToggleEl);
  iconsWrap.appendChild(refreshBtn);
  iconsWrap.appendChild(showAllColumnsBtn);

  const saveSqlBtn = document.createElement("button");
  saveSqlBtn.type = "button";
  saveSqlBtn.className =
    "filter-toggle floating-replica-save-sql-btn floating-replica-save-sql-btn--unsaved";
  saveSqlBtn.dataset.floatingReplicaSaveSql = "";
  saveSqlBtn.setAttribute(
    "aria-label",
    "Save database to Supabase (permanent SQL storage)",
  );
  saveSqlBtn.title =
    "Not in Supabase SQL yet — click to save permanently to user_workspace_draft_databases.";
  saveSqlBtn.innerHTML = FLOATING_REPLICA_SAVE_SQL_SVG;
  iconsWrap.appendChild(saveSqlBtn);

  stripOuter.appendChild(iconsWrap);

  const filterPanelEl = document.createElement("div");
  filterPanelEl.className = "table-filters floating-replica-table-filters";
  filterPanelEl.id = `floatingReplicaTf_${replicaId}`;
  filterPanelEl.hidden = !fpExp;
  filterToggleEl.setAttribute("aria-controls", filterPanelEl.id);

  const filterSchoolSel = document.createElement("select");
  filterSchoolSel.setAttribute("aria-label", "Filter by school");

  const filterSchoolGroup = document.createElement("div");
  filterSchoolGroup.className = "filter-group floating-replica-fg-school";
  const lblSch = document.createElement("label");
  lblSch.appendChild(document.createTextNode("School"));
  lblSch.appendChild(filterSchoolSel);
  filterSchoolGroup.appendChild(lblSch);

  const filterDateIn = document.createElement("input");
  filterDateIn.type = "date";
  filterDateIn.setAttribute("aria-label", "Filter by date");
  const filterDateGroup = document.createElement("div");
  filterDateGroup.className = "filter-group floating-replica-fg-date";
  const lblDate = document.createElement("label");
  lblDate.appendChild(document.createTextNode("Date"));
  lblDate.appendChild(filterDateIn);
  filterDateGroup.appendChild(lblDate);

  const filterSortSel = document.createElement("select");
  filterSortSel.setAttribute("aria-label", "Sort by date");
  for (const [val, txt] of [
    ["", "Notion order"],
    ["desc", "Newest first"],
    ["asc", "Oldest first"],
  ]) {
    const oOpt = document.createElement("option");
    oOpt.value = val;
    oOpt.textContent = txt;
    filterSortSel.appendChild(oOpt);
  }
  filterSortSel.value = fvSort === "asc" || fvSort === "" ? fvSort : "desc";
  filterSchoolSel.value = fvSchool;
  filterDateIn.value = fvDate;

  const filterSortGroup = document.createElement("div");
  filterSortGroup.className = "filter-group floating-replica-fg-sort";
  const lblSort = document.createElement("label");
  lblSort.appendChild(document.createTextNode("Sort by date"));
  lblSort.appendChild(filterSortSel);
  filterSortGroup.appendChild(lblSort);

  const filterClearEl = document.createElement("button");
  filterClearEl.type = "button";
  filterClearEl.className = "filter-clear floating-replica-filter-clear";
  filterClearEl.textContent = "Clear filters";
  filterClearEl.dataset.floatingReplicaFilterClear = "";

  filterPanelEl.appendChild(filterSchoolGroup);
  filterPanelEl.appendChild(filterDateGroup);
  filterPanelEl.appendChild(filterSortGroup);
  filterPanelEl.appendChild(filterClearEl);

  tableToolbarEl.appendChild(stripOuter);
  tableToolbarEl.appendChild(filterPanelEl);

  const scrollEl = document.createElement("div");
  scrollEl.className = "table-scroll floating-draft-table-scroll";

  const table = document.createElement("table");
  table.className = "data-sheet floating-draft-data-sheet";
  table.dataset.floatingReplicaTable = "";
  table.setAttribute("aria-label", "Local draft database");

  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");
  table.appendChild(thead);
  table.appendChild(tbody);

  scrollEl.appendChild(table);

  const addRowStrip = document.createElement("div");
  addRowStrip.className = "floating-replica-add-row-strip";

  const addRowFab = document.createElement("button");
  addRowFab.type = "button";
  addRowFab.className = "floating-replica-add-row-fab";
  addRowFab.dataset.floatingReplicaAddRow = "";
  addRowFab.title = "Add row";
  addRowFab.setAttribute("aria-label", "Add row");
  addRowFab.textContent = "+";
  addRowStrip.appendChild(addRowFab);

  const footerEl = document.createElement("div");
  footerEl.className = "table-sheet-footer floating-replica-table-footer";
  const footerHintEl = document.createElement("p");
  footerHintEl.className = "table-load-hint floating-replica-load-hint";
  footerHintEl.setAttribute("aria-live", "polite");
  footerEl.appendChild(footerHintEl);

  wrap.appendChild(tableToolbarEl);
  wrap.appendChild(scrollEl);
  wrap.appendChild(addRowStrip);
  wrap.appendChild(footerEl);

  card.appendChild(bar);
  card.appendChild(wrap);

  /** @type {FloatingPaySlipReplica} */
  const rep = {
    id: replicaId,
    workspacePageId: wp,
    root: card,
    barTitleEl: titleSpan,
    notionLinkCheckEl: titleCheck,
    tableToolbarEl,
    filterToggleEl,
    filterPanelEl,
    filterSchoolGroupEl: filterSchoolGroup,
    filterDateGroupEl: filterDateGroup,
    filterSortGroupEl: filterSortGroup,
    filterSchoolEl: filterSchoolSel,
    filterDateEl: filterDateIn,
    filterSortEl: filterSortSel,
    filterClearEl,
    refreshFakeEl: refreshBtn,
    sqlSaveBtn: saveSqlBtn,
    showAllColumnsBtn,
    schoolTabsEl: null,
    scrollEl,
    tableEl: table,
    theadEl: thead,
    tbodyEl: tbody,
    footerEl,
    footerHintEl,
    filterPanelExpanded: fpExp,
    shadow: {
      columns: initialCols,
      columnKinds: initialColumnKinds,
      rows,
      pageIds,
      hiddenNames,
      colWidths,
      rowCreatedMs,
      rowEditedMs,
      omitSysCreated,
      omitSysEdited,
      linkedNotionPageId,
    },
  };

  return rep;
}

/** Create an empty replica on the given workspace page (defaults to active) and persist. */
async function appendFloatingEmptyPaySlipStyledDataSheet(
  preferredWorkspacePageId,
) {
  let wp =
    preferredWorkspacePageId != null &&
    String(preferredWorkspacePageId).trim() !== ""
      ? normalizeWorkspaceFloatingDraftPageKey(preferredWorkspacePageId)
      : normalizeWorkspaceFloatingDraftPageKey(
          notionWorkspaceActiveId ?? WORKSPACE_PAYSLIPS_PAGE_ID,
        );

  const curRaw = notionWorkspaceActiveId ?? "";
  const cur =
    curRaw.trim() !== ""
      ? normalizeWorkspaceFloatingDraftPageKey(curRaw)
      : WORKSPACE_PAYSLIPS_PAGE_ID;

  if (wp !== cur) {
    activateNotionWorkspacePage(wp);
  }

  const mount = floatingDraftDatasheetMountForWorkspacePage(wp);
  if (!mount) {
    return;
  }
  const rep = buildFloatingReplicaFromPersistOrNew(wp, null);
  if (!rep) {
    return;
  }
  registerFloatingReplicaInMemory(rep, mount);
  /** Persist immediately so a fast quit/restart cannot skip the debounced save. */
  persistFloatingDraftSnapshotsForWorkspacePage(wp);
  if (payslipAppUserStateCloudReady) {
    await flushPayslipAppUserStateDirtyNow();
  }
  cardScrollFloatingReplicaIntoView(rep);
  if (pageHomeEl && !pageHomeEl.hidden) {
    if (
      wp === WORKSPACE_PAYSLIPS_PAGE_ID &&
      notionDetailsEl instanceof HTMLDetailsElement
    ) {
      notionDetailsEl.open = true;
    }
  }
}

/** @param {FloatingPaySlipReplica} rep */
function cardScrollFloatingReplicaIntoView(rep) {
  rep.root.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function applyFiltersAndRender() {
  const { columns, rows, pageIds } = rawTable;
  if (!columns.length) {
    if (tableEl) {
      tableEl.hidden = true;
    }
    if (tableSheetFooterEl) {
      tableSheetFooterEl.hidden = true;
    }
    updateShowAllColumnsBtnVisibility();
    syncFilterToolbarUi();
    return;
  }

  if (
    getVisibleColumnIndices().length === 0 &&
    columns.length > 0
  ) {
    setHiddenColumnNames(new Set());
  }
  renderThead(columns);
  const indices = getFilteredRowIndices();

  renderTbody(columns, indices);

  applyStoredColumnWidthsToSheet();

  tableEl.hidden = false;
  if (tableSheetFooterEl) {
    tableSheetFooterEl.hidden = false;
  }
  let hintPrimary =
    indices.length === rows.length
      ? `${rows.length} row(s) loaded.`
      : `${indices.length} row(s) shown (${rows.length} loaded).`;

  const schoolDateShown = getFilteredRowIndicesFromInputs(
    filterSchoolEl?.value ?? "",
    filterDateEl?.value ?? "",
    filterSortEl?.value ?? "",
  ).length;

  if (mappedPayslipNotionRestrictionIsActiveNow()) {
    const nMapped = normalizedNotionIdSetFromPayslipLinkRows().size;
    hintPrimary += ` Mapped-ID filter active: ${indices.length}/${schoolDateShown} row(s) remain (${nMapped} ID(s)).`;
  } else if (
    readPayslipNotionRestrictMappedPref() &&
    normalizedNotionIdSetFromPayslipLinkRows().size === 0
  ) {
    hintPrimary +=
      " Mapped-ID filter is on — add at least one Notion row ID below to narrow rows.";
  }
  if (tableLoadHintEl) {
    tableLoadHintEl.textContent = hintPrimary;
  }

  syncOverlayFromTable(columns, rows, pageIds);
  setStatus("", false);
  updateShowAllColumnsBtnVisibility();
  syncSchoolTabsUi();
  persistCurrentAdminViewFilters();
}

function ingestNotionTable(columns, rows, pageIds) {
  activeAdminTeacherId = null;
  adminTeacherViews.clear();
  if (teacherViewTabsEl) {
    teacherViewTabsEl.replaceChildren();
    teacherViewTabsEl.hidden = true;
  }

  rawTable = {
    columns: Array.isArray(columns) ? columns : [],
    rows: Array.isArray(rows) ? rows : [],
    pageIds: Array.isArray(pageIds) ? pageIds : [],
  };

  if (!rawTable.columns.length) {
    tableEl.hidden = true;
    if (tableSheetFooterEl) {
      tableSheetFooterEl.hidden = true;
    }
    if (tableScrollEl) {
      tableScrollEl.classList.remove("table-scroll--with-tabs");
    }
    if (tableLoadHintEl) {
      tableLoadHintEl.textContent = "";
    }
    updateFilterGroupsVisibility();
    setStatus(
      "Database returned no columns. Check that the integration can access this database.",
      true,
    );
    return;
  }

  pruneHiddenColumnsForCurrentTable();
  unhideEmailLikeColumnsForCurrentTable();
  pruneDroppedColumnsForCurrentTable();
  applyStoredColumnOrderToRawTable();
  applyDroppedColumnsToRawTable();
  pruneColumnWidthsToExistingColumns();
  populateSchoolOptions();
  updateFilterGroupsVisibility();
  applyFiltersAndRender();
  scheduleFloatingReplicaLinkedNotionResyncAfterMainPayslipTableLoad();
}

function clearFilters() {
  if (filterSchoolEl) {
    filterSchoolEl.value = "";
  }
  if (filterDateEl) {
    filterDateEl.value = "";
  }
  applyFiltersAndRender();
}

rowDetailCloseEl?.addEventListener("click", () => {
  closeRowOverlay();
});

rowDetailDownloadPdfEl?.addEventListener("click", () => {
  if (!overlayDetailSnapshot) {
    return;
  }
  const { title, columns, row } = overlayDetailSnapshot;
  savePaySlipPdfFromRow(title, columns, row, {
    teacherPaySlipOnly: isTeacherNavMode,
  });
});

rowDetailOverlayEl?.addEventListener("click", (ev) => {
  if (ev.target === rowDetailOverlayEl) {
    closeRowOverlay();
  }
});

document.addEventListener("keydown", (ev) => {
  if (ev.key !== "Escape") {
    return;
  }
  if (isNavMenuOpen()) {
    closeNavMenu();
    ev.preventDefault();
    return;
  }
  if (columnMenuEl && !columnMenuEl.hidden) {
    closeColumnMenu();
    ev.preventDefault();
    return;
  }
  const frPop = document.getElementById("floatingReplicaPropKindPopover");
  if (frPop instanceof HTMLElement && !frPop.hidden) {
    closeFloatingReplicaPropKindPopover();
    ev.preventDefault();
    return;
  }
  if (canvasContextMenuEl && !canvasContextMenuEl.hidden) {
    hideCanvasContextMenu();
    ev.preventDefault();
    return;
  }
  if (!rowDetailOverlayEl || rowDetailOverlayEl.hidden) {
    return;
  }
  closeRowOverlay();
});

filterSchoolEl?.addEventListener("change", () => {
  applyFiltersAndRender();
  syncFilterToolbarUi();
});
filterDateEl?.addEventListener("change", () => {
  applyFiltersAndRender();
  syncFilterToolbarUi();
});
filterSortEl?.addEventListener("change", () => {
  applyFiltersAndRender();
  syncFilterToolbarUi();
});
filterClearEl?.addEventListener("click", () => {
  clearFilters();
  syncFilterToolbarUi();
});

filterToggleEl?.addEventListener("click", () => {
  filterPanelExpanded = !filterPanelExpanded;
  syncFilterToolbarUi();
});

appMainEl?.addEventListener("contextmenu", (ev) => {
  if (!shouldOfferFloatingDraftDatabaseMenu(ev)) {
    hideCanvasContextMenu();
    return;
  }
  ev.preventDefault();
  closeColumnMenu();
  if (!canvasContextMenuEl) {
    return;
  }
  const t = ev.target;
  const pageId =
    t instanceof Element
      ? resolveFloatingDraftWorkspacePageIdFromDomHit(t)
      : normalizeWorkspaceFloatingDraftPageKey(
          notionWorkspaceActiveId ?? WORKSPACE_PAYSLIPS_PAGE_ID,
        );
  if (canvasContextMenuEl instanceof HTMLElement) {
    canvasContextMenuEl.dataset.pendingWorkspacePageId = pageId;
  }
  canvasContextMenuEl.hidden = false;
  repositionCanvasContextMenuAround(ev.clientX, ev.clientY);
});

canvasCreateDbTableBtn?.addEventListener("click", () => {
  let preferred = "";
  if (canvasContextMenuEl instanceof HTMLElement) {
    preferred = (
      canvasContextMenuEl.dataset.pendingWorkspacePageId ?? ""
    ).trim();
    delete canvasContextMenuEl.dataset.pendingWorkspacePageId;
  }
  void appendFloatingEmptyPaySlipStyledDataSheet(
    preferred !== "" ? preferred : undefined,
  );
  hideCanvasContextMenu();
});

notionWsPanesRootEl?.addEventListener("click", (ev) => {
  const tgt = /** @type {Element} */ (ev.target);
  const draftMount = tgt.closest(".floating-draft-datasheets-mount");
  if (
    !(draftMount instanceof HTMLElement) ||
    !(notionWsPanesRootEl?.contains(draftMount) ?? false)
  ) {
    return;
  }
  const rep = getFloatingReplicaFromEventTarget(tgt);
  if (!rep) {
    return;
  }
  if (tgt.closest("[data-floating-replica-prop-menu-toggle]")) {
    ev.preventDefault();
    ev.stopPropagation();
    const menuBtn = tgt.closest("[data-floating-replica-prop-menu-toggle]");
    if (!(menuBtn instanceof HTMLButtonElement)) {
      return;
    }
    toggleFloatingReplicaPropKindPopover(menuBtn, rep);
    return;
  }
  if (tgt.closest("[data-floating-replica-remove]")) {
    ev.preventDefault();
    const pageKey = normalizeWorkspaceFloatingDraftPageKey(
      rep.workspacePageId,
    );
    paySlipFloatingReplicas.delete(rep.id);
    rep.root.remove();
    persistFloatingDraftSnapshotsForWorkspacePage(pageKey);
    return;
  }
  if (tgt.closest("[data-floating-replica-filter-toggle]")) {
    ev.preventDefault();
    rep.filterPanelExpanded = !rep.filterPanelExpanded;
    syncFloatingReplicaFilterToolbar(rep);
    scheduleFloatingDraftPersistForWorkspacePage(rep.workspacePageId);
    return;
  }
  if (tgt.closest("[data-floating-replica-show-all-cols]")) {
    ev.preventDefault();
    rep.shadow.hiddenNames.clear();
    applyFloatingPaySlipReplicaRender(rep);
    return;
  }
  const saveSqlHit = tgt.closest("[data-floating-replica-save-sql]");
  if (saveSqlHit instanceof HTMLButtonElement) {
    ev.preventDefault();
    ev.stopPropagation();
    saveSqlHit.disabled = true;
    void saveFloatingReplicaToSupabasePersistent(rep).finally(() => {
      saveSqlHit.disabled = false;
    });
    return;
  }
  if (tgt.closest("[data-floating-replica-add-row]")) {
    ev.preventDefault();
    floatingReplicaAppendBlankDataRow(rep);
    return;
  }
  if (tgt.closest("[data-floating-replica-filter-clear]")) {
    ev.preventDefault();
    clearFloatingReplicaFilters(rep);
    refreshFloatingReplicaTableBody(rep);
    scheduleFloatingDraftPersistForWorkspacePage(rep.workspacePageId);
    return;
  }
});

notionWsPanesRootEl?.addEventListener("change", (ev) => {
  const t = ev.target;
  if (!(t instanceof HTMLSelectElement || t instanceof HTMLInputElement)) {
    return;
  }
  const draftMount = t.closest(".floating-draft-datasheets-mount");
  if (
    !(draftMount instanceof HTMLElement) ||
    !(notionWsPanesRootEl?.contains(draftMount) ?? false)
  ) {
    return;
  }
  const rep = getFloatingReplicaFromEventTarget(t);
  if (!rep) {
    return;
  }
  if (
    t === rep.filterSchoolEl ||
    t === rep.filterDateEl ||
    t === rep.filterSortEl
  ) {
    refreshFloatingReplicaTableBody(rep);
    scheduleFloatingDraftPersistForWorkspacePage(rep.workspacePageId);
  }
});

canvasDraftTablesEl?.addEventListener("click", (ev) => {
  if (ev.target.closest(".canvas-local-db-remove")) {
    ev.preventDefault();
    const wrapRm = ev.target.closest?.(`.${CANVAS_LOCAL_DB_ROOT_CLASS}`);
    wrapRm?.remove();
    scheduleCanvasDraftPersist();
    return;
  }
  const wrap = ev.target.closest?.(`.${CANVAS_LOCAL_DB_ROOT_CLASS}`);
  if (!wrap || !canvasDraftTablesEl?.contains(wrap)) {
    return;
  }
  if (ev.target.closest(".canvas-local-db-add-property-btn")) {
    ev.preventDefault();
    addCanvasLocalDbPropertyColumn(wrap);
    return;
  }
  if (ev.target.closest(".canvas-local-db-new-page-btn")) {
    ev.preventDefault();
    addCanvasLocalDbDataRow(wrap);
    return;
  }
  if (ev.target.closest(".canvas-local-db-toolbar-new")) {
    ev.preventDefault();
    addCanvasLocalDbDataRow(wrap);
  }
});

document.addEventListener(
  "pointerdown",
  (ev) => {
    if (!canvasContextMenuEl || canvasContextMenuEl.hidden) {
      return;
    }
    const t = ev.target;
    if (t instanceof Node && canvasContextMenuEl.contains(t)) {
      return;
    }
    hideCanvasContextMenu();
  },
  true,
);

window.addEventListener("scroll", hideCanvasContextMenu, true);

document.addEventListener("click", (ev) => {
  if (!columnMenuEl || columnMenuEl.hidden) {
    return;
  }
  if (columnMenuEl.contains(ev.target)) {
    return;
  }
  if (columnMenuAnchorEl && columnMenuAnchorEl.contains(ev.target)) {
    return;
  }
  closeColumnMenu();
});

columnMenuHideBtn?.addEventListener("click", (ev) => {
  ev.stopPropagation();
  const rawName = columnMenuTargetColumn;
  if (
    typeof columnMenuTargetReplicaId === "string" &&
    columnMenuTargetReplicaId.trim() !== ""
  ) {
    const rep = paySlipFloatingReplicas.get(columnMenuTargetReplicaId.trim());
    if (!rep || !rawName) {
      closeColumnMenu();
      return;
    }
    const colKey = String(rawName).trim();
    if (floatingReplicaIsSysTimeMetaMenuColumn(colKey)) {
      rep.shadow.hiddenNames.add(colKey);
      closeColumnMenu();
      applyFloatingPaySlipReplicaRender(rep);
      return;
    }
    const columns = rep.shadow.columns;
    const visible = getVisibleColumnIndicesFor(
      columns,
      rep.shadow.hiddenNames,
    );
    if (visible.length <= 1) {
      closeColumnMenu();
      return;
    }
    rep.shadow.hiddenNames.add(colKey);
    closeColumnMenu();
    applyFloatingPaySlipReplicaRender(rep);
    return;
  }

  const visible = getVisibleColumnIndices();
  if (visible.length <= 1) {
    closeColumnMenu();
    return;
  }
  if (!rawName) {
    closeColumnMenu();
    return;
  }
  const h = getHiddenColumnNames();
  h.add(String(rawName));
  setHiddenColumnNames(h);
  closeColumnMenu();
  applyFiltersAndRender();
});

columnMenuRemoveColumnBtn?.addEventListener("click", (ev) => {
  ev.stopPropagation();
  const rawName = columnMenuTargetColumn;
  if (
    typeof columnMenuTargetReplicaId === "string" &&
    columnMenuTargetReplicaId.trim() !== ""
  ) {
    const rid = columnMenuTargetReplicaId.trim();
    const rep = paySlipFloatingReplicas.get(rid);
    if (!rep || !rawName || String(rawName).trim() === "") {
      closeColumnMenu();
      return;
    }
    const colKey = String(rawName).trim();
    if (floatingReplicaIsSysTimeMetaMenuColumn(colKey)) {
      const isCreated = colKey === FLOATING_REPLICA_SYS_TIME_CREATED_MENU_COL;
      const titled = isCreated
        ? FLOATING_REPLICA_SYS_CREATED_LABEL
        : FLOATING_REPLICA_SYS_EDITED_LABEL;
      if (
        !window.confirm(
          `Permanently delete “${titled}” from this draft?\n\n` +
            "This removes the meta column permanently. Show hidden columns will not restore it.",
        )
      ) {
        return;
      }
      rep.shadow.hiddenNames.delete(colKey);
      if (isCreated) {
        rep.shadow.omitSysCreated = true;
      } else {
        rep.shadow.omitSysEdited = true;
      }
      closeColumnMenu();
      applyFloatingPaySlipReplicaRender(rep);
      return;
    }
    const cols = rep.shadow.columns;
    const visible = getVisibleColumnIndicesFor(
      cols,
      rep.shadow.hiddenNames,
    );
    if (visible.length <= 1) {
      closeColumnMenu();
      return;
    }
    const col = String(rawName).trim();
    const titled = displayNotionSheetColumnLabel(col);
    if (
      !window.confirm(
        `Permanently delete “${titled}” from this draft?\n\n` +
          "This cannot be undone in the app.",
      )
    ) {
      return;
    }
    const colIdx = cols.indexOf(col);
    if (colIdx < 0) {
      closeColumnMenu();
      return;
    }
    cols.splice(colIdx, 1);
    if (Array.isArray(rep.shadow.columnKinds) && rep.shadow.columnKinds.length > colIdx) {
      rep.shadow.columnKinds.splice(colIdx, 1);
    }
    for (const row of rep.shadow.rows) {
      if (Array.isArray(row) && row.length > colIdx) {
        row.splice(colIdx, 1);
      }
    }
    rep.shadow.hiddenNames.delete(col);
    rep.shadow.colWidths.delete(col);
    closeColumnMenu();
    applyFloatingPaySlipReplicaRender(rep);
    return;
  }

  const visible = getVisibleColumnIndices();
  if (visible.length <= 1) {
    closeColumnMenu();
    return;
  }
  if (!rawName || String(rawName).trim() === "") {
    closeColumnMenu();
    return;
  }
  const col = String(rawName).trim();
  const titled = displayNotionSheetColumnLabel(col);
  if (
    !window.confirm(
      `Permanently delete “${titled}” from this app?\n\n` +
        "You cannot bring this column back in the app—not after Refresh nor any button here. Nothing is deleted in Notion.",
    )
  ) {
    return;
  }
  const dropped = getDroppedColumnNames();
  dropped.add(col);
  setDroppedColumnNames(dropped);
  const hidden = getHiddenColumnNames();
  if (hidden.delete(col)) {
    setHiddenColumnNames(hidden);
  }
  closeColumnMenu();
  applyDroppedColumnsToRawTable();
  saveColumnOrderPreference(rawTable.columns);
  pruneColumnWidthsToExistingColumns();
  applyFiltersAndRender();
});

showAllColumnsBtn?.addEventListener("click", () => {
  setHiddenColumnNames(new Set());
  applyFiltersAndRender();
});

function setStatus(text, isError) {
  statusEl.textContent = text;
  statusEl.classList.toggle("error", Boolean(isError));
  statusEl.hidden = !text;
  if (statusActionsEl) {
    statusActionsEl.hidden = !(
      Boolean(isError) &&
      typeof text === "string" &&
      text.includes("NOTION_TOKEN")
    );
  }
  if (isError && tableLoadHintEl) {
    tableLoadHintEl.textContent = "";
  }
  if (isError && notionDetailsEl) {
    notionDetailsEl.open = true;
  }
}

async function loadNotion() {
  if (refreshBtn) {
    refreshBtn.disabled = true;
  }
  closeColumnMenu();
  setStatus("Fetching from Notion…");
  tableEl.hidden = true;
  if (tableSheetFooterEl) {
    tableSheetFooterEl.hidden = true;
  }
  if (tableLoadHintEl) {
    tableLoadHintEl.textContent = "";
  }
  if (tableScrollEl) {
    tableScrollEl.classList.remove("table-scroll--with-tabs");
  }

  try {
    if (typeof window.teacherAuth?.listTeachersForAdmin === "function") {
      const dir = await window.teacherAuth.listTeachersForAdmin();
      if (dir.ok && Array.isArray(dir.teachers)) {
        /** @type {{ key: string; label: string; databaseId: string; dataSourceId: string }[]} */
        const sources = [];
        for (const t of dir.teachers) {
          const dbRaw = t.notion_database_id;
          const dsRaw = t.notion_data_source_id;
          const dbId = dbRaw != null ? String(dbRaw).trim() : "";
          const dsId = dsRaw != null ? String(dsRaw).trim() : "";
          if (!dbId && !dsId) {
            continue;
          }
          sources.push({
            key: String(t.id),
            label: teacherRowLabelFromDirectory(t),
            databaseId: dbId,
            dataSourceId: dsId,
          });
        }
        if (
          sources.length > 0 &&
          typeof window.notionApi?.queryTeacherDatabases === "function"
        ) {
          const batch = await window.notionApi.queryTeacherDatabases(sources);
          if (!batch?.ok) {
            setStatus(batch?.message || "Request failed.", true);
            return;
          }
          ingestAdminTeacherNotionSections(batch.sections || [], sources);
          return;
        }
      }
    }

    const result = await window.notionApi.queryDatabase({});
    if (!result.ok) {
      setStatus(result.message || "Request failed.", true);
      return;
    }
    ingestNotionTable(
      result.columns || [],
      result.rows || [],
      result.pageIds || [],
    );
  } catch (e) {
    setStatus(e instanceof Error ? e.message : String(e), true);
  } finally {
    if (refreshBtn) {
      refreshBtn.disabled = false;
    }
  }
}

/**
 * Reloads the main Notion database (and teacher pay slips when applicable), then updates every
 * workspace draft database from that snapshot in the background. The menu button re-enables as
 * soon as the main fetch finishes; draft cards may finish a moment later.
 */
async function globalRefreshNotionConnections() {
  closeNavMenu();

  let navBusy = false;
  if (navTeacherDashboardRefreshBtn instanceof HTMLButtonElement) {
    navBusy = true;
    navTeacherDashboardRefreshBtn.disabled = true;
    navTeacherDashboardRefreshBtn.setAttribute("aria-busy", "true");
  }

  try {
    await loadNotion();

    if (
      isTeacherNavMode &&
      typeof window.notionApi?.queryTeacherPaySlips === "function"
    ) {
      await fetchTeacherPaySlipTable({ force: true });
      await loadTeacherDashboard({ force: false });
      await loadTeacherPaySlips({ force: false });
      await loadTeacherProfile();
    }
  } finally {
    if (
      navBusy &&
      navTeacherDashboardRefreshBtn instanceof HTMLButtonElement
    ) {
      navTeacherDashboardRefreshBtn.disabled = false;
      navTeacherDashboardRefreshBtn.removeAttribute("aria-busy");
    }
  }

  void refreshAllFloatingReplicasNotionHydration({ forceNotionApi: false }).catch(
    (e) => {
      console.warn("floating replicas nav refresh:", e);
    },
  );
}

refreshBtn?.addEventListener("click", () => {
  loadNotion();
});

openConfigFolderBtn?.addEventListener("click", async () => {
  try {
    await window.shellApi?.openUserDataFolder?.();
  } catch {
    /* ignore */
  }
});

function setAuthError(msg) {
  if (!authErrorEl) {
    return;
  }
  if (msg) {
    authErrorEl.textContent = msg;
    authErrorEl.hidden = false;
  } else {
    authErrorEl.textContent = "";
    authErrorEl.hidden = true;
  }
}

function normalizeEmailForRole(s) {
  return String(s || "").trim().toLowerCase();
}

/**
 * Admins: email matches auth-store ALLOWED_ADMIN_EMAIL (same Supabase account).
 * @param {{ email?: string } | null | undefined} user
 */
async function supabaseSessionUserIsAdmin(user) {
  if (!user || typeof user.email !== "string") {
    return false;
  }
  try {
    const r = await window.authApi.allowedAdminEmail?.();
    if (!r?.email) {
      return false;
    }
    return (
      normalizeEmailForRole(user.email) ===
      normalizeEmailForRole(r.email)
    );
  } catch {
    return false;
  }
}

/** Full app with Notion (Supabase session, admin email). */
async function enterAdminApp() {
  setTeacherNavMode(false);
  if (authGateEl) {
    authGateEl.hidden = true;
  }
  if (appMainEl) {
    appMainEl.hidden = false;
  }
  await hydratePayslipAppUserStateAfterAuth();
  await refreshNotionWorkspaceAfterRemoteStateLoaded();
  applyStoredAppPage();
  loadNotion();
  void loadPayslipNotionLinksHybrid().then(() => {
    if (payslipNotionLinksTbodyEl) {
      renderPayslipNotionLinksTableBody();
      syncFilterToolbarUi();
      payslipMappedFilterRefreshSheetIfPossible();
    }
  });
}

function syncRememberMeCheckbox() {
  if (!authRememberMe) {
    return;
  }
  try {
    if (typeof window.teacherAuth?.getRememberMePreference === "function") {
      authRememberMe.checked = Boolean(
        window.teacherAuth.getRememberMePreference(),
      );
    } else {
      authRememberMe.checked = true;
    }
  } catch {
    authRememberMe.checked = true;
  }
  applyRememberedCredentialsToForm();
}

function syncAuthFormMode() {
  if (!authConfirmWrap || !authSubmitBtn || !authToggleRegister) {
    return;
  }
  if (authRegisterMode) {
    authConfirmWrap.hidden = false;
    if (authPasswordConfirm) {
      authPasswordConfirm.required = true;
    }
    authSubmitBtn.textContent = "Create account";
    authToggleRegister.textContent = "Already have an account? Sign in";
  } else {
    authConfirmWrap.hidden = true;
    if (authPasswordConfirm) {
      authPasswordConfirm.required = false;
      authPasswordConfirm.value = "";
    }
    authSubmitBtn.textContent = "Sign in";
    authToggleRegister.textContent = "Create an account";
  }
  syncRememberMeCheckbox();
}

authToggleRegister?.addEventListener("click", () => {
  setAuthError("");
  authRegisterMode = !authRegisterMode;
  syncAuthFormMode();
});

authRememberMe?.addEventListener("change", () => {
  const on = Boolean(authRememberMe.checked);
  window.teacherAuth?.setRememberMePreference?.(on);
  if (!on) {
    clearSavedAuthCredentialsFromStorage();
    if (authEmail) {
      authEmail.value = "";
    }
    if (authPassword) {
      authPassword.value = "";
    }
    if (authPasswordConfirm) {
      authPasswordConfirm.value = "";
    }
  } else {
    persistAuthCredentialsIfRememberOn(
      authEmail?.value ?? "",
      authPassword?.value ?? "",
    );
    applyRememberedCredentialsToForm();
  }
});

authForm?.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  setAuthError("");
  const email = authEmail?.value ?? "";
  const password = authPassword?.value ?? "";
  const confirm = authPasswordConfirm?.value ?? "";
  window.teacherAuth?.setRememberMePreference?.(
    Boolean(authRememberMe?.checked ?? true),
  );
  if (authRegisterMode && password !== confirm) {
    setAuthError("Passwords do not match.");
    return;
  }
  if (authSubmitBtn) {
    authSubmitBtn.disabled = true;
  }
  try {
    if (authRegisterMode) {
      const { error, needsEmailConfirmation } =
        await window.teacherAuth.signUpWithEmail(email, password);
      if (error) {
        setAuthError(error);
        return;
      }
      if (needsEmailConfirmation) {
        persistAuthCredentialsIfRememberOn(email, password);
        setAuthError(
          "Supabase is waiting for email confirmation: open the link in the message sent to your address, then use “Already have an account? Sign in” below. To skip this in development, turn off “Confirm email” under Dashboard → Authentication → Providers → Email.",
        );
        authRegisterMode = false;
        syncAuthFormMode();
        return;
      }
      const { user, error: uerr } =
        await window.teacherAuth.getSessionUser();
      if (uerr === "not_configured") {
        setAuthError("Supabase is not configured.");
        return;
      }
      if (uerr) {
        setAuthError(uerr);
        return;
      }
      if (!user) {
        setAuthError(
          "Account created but no session was returned. Try signing in with the same email and password.",
        );
        authRegisterMode = false;
        syncAuthFormMode();
        return;
      }
      persistAuthCredentialsIfRememberOn(email, password);
      if (await supabaseSessionUserIsAdmin(user)) {
        await enterAdminApp();
      } else {
        await enterTeacherApp();
      }
      return;
    }

    const { error } = await window.teacherAuth.signInWithEmail(
      email,
      password,
    );
    if (error) {
      setAuthError(error);
      return;
    }
    const { user, error: userErr } =
      await window.teacherAuth.getSessionUser();
    if (userErr === "not_configured") {
      setAuthError("Supabase is not configured.");
      return;
    }
    if (userErr) {
      setAuthError(userErr);
      return;
    }
    if (!user) {
      setAuthError("Could not load session after sign-in.");
      return;
    }
    persistAuthCredentialsIfRememberOn(email, password);
    if (await supabaseSessionUserIsAdmin(user)) {
      await enterAdminApp();
    } else {
      await enterTeacherApp();
    }
  } catch (e) {
    setAuthError(e instanceof Error ? e.message : String(e));
  } finally {
    if (authSubmitBtn) {
      authSubmitBtn.disabled = false;
    }
  }
});

async function applySupabaseAuthGateUi() {
  let ok = false;
  try {
    if (typeof window.teacherAuth?.loadPublicConfig === "function") {
      const cfg = await window.teacherAuth.loadPublicConfig();
      ok = Boolean(cfg?.url && cfg?.anonKey);
    }
  } catch {
    ok = false;
  }
  if (authSubmitBtn) {
    authSubmitBtn.disabled = false;
  }
  if (authToggleRegister) {
    authToggleRegister.disabled = false;
  }
  syncRememberMeCheckbox();
}

async function enterTeacherApp() {
  await hydratePayslipAppUserStateAfterAuth();
  await refreshNotionWorkspaceAfterRemoteStateLoaded();
  setTeacherNavMode(true);
  if (authGateEl) {
    authGateEl.hidden = true;
  }
  if (appMainEl) {
    appMainEl.hidden = false;
  }
  try {
    sessionStorage.setItem(APP_NAV_PAGE_KEY, "dashboard");
  } catch {
    /* ignore */
  }
  startTeacherPresenceHeartbeat();
  applyStoredAppPage();
}

async function showAuthScreen(_hasAdminAccount) {
  closeNavMenu();
  hideCloudSaveOverlay();
  stopTeacherPresenceHeartbeat();
  setTeacherNavMode(false);
  clearTeacherPaySlipCache();
  payslipAppUserStateCloudReady = false;
  payslipAppExitSnapshotStarted = false;
  floatingDraftWorkspacePageUserActivated.clear();
  userWorkspaceDraftSqlReplicaKeys.clear();
  payslipAppUserStateMirror = Object.create(null);
  payslipAppUserStateDirtyKeys.clear();
  payslipAppUserStateFlushChain = Promise.resolve();
  if (payslipAppUserStateFlushTimer) {
    window.clearTimeout(payslipAppUserStateFlushTimer);
    payslipAppUserStateFlushTimer = 0;
  }
  try {
    window.teacherAuth?.resetSupabaseClient?.();
  } catch {
    /* ignore */
  }
  if (authGateEl) {
    authGateEl.hidden = false;
  }
  if (appMainEl) {
    appMainEl.hidden = true;
  }
  if (authForm) {
    authForm.hidden = false;
  }
  sessionStorage.removeItem(APP_NAV_PAGE_KEY);
  closeColumnMenu();
  closeRowOverlay();
  setAuthError("");
  authRegisterMode = false;
  syncAuthFormMode();
  await applySupabaseAuthGateUi();
  queueMicrotask(() => {
    syncRememberMeCheckbox();
  });
}

logoutBtn?.addEventListener("click", async () => {
  closeNavMenu();
  try {
    await window.teacherAuth?.signOutSupabase?.();
  } catch {
    /* ignore */
  }
  try {
    window.teacherAuth?.resetSupabaseClient?.();
  } catch {
    /* ignore */
  }
  let has = true;
  try {
    has = await window.authApi.hasAdmin();
  } catch {
    has = true;
  }
  await showAuthScreen(has);
});

async function boot() {
  /** Preload exposes this only in Electron; HTTP preview / file open in Chrome has no IPC. */
  const authBridgeReady =
    typeof window.authApi?.hasAdmin === "function";

  if (!authBridgeReady) {
    if (authGateEl) {
      authGateEl.hidden = false;
    }
    if (appMainEl) {
      appMainEl.hidden = true;
    }
    if (authForm) {
      authForm.hidden = true;
    }
    setAuthError(
      "This screen is running outside the desktop app (browser or preview cannot load Electron). Close it and launch the app from the Start menu / installer, or in this project folder run: npm start",
    );
    return;
  }

  /* Always show the sign-in gate on launch: clear any persisted Supabase session instead of restoring it. */
  try {
    if (typeof window.teacherAuth?.getSessionUser === "function") {
      const { user, error } = await window.teacherAuth.getSessionUser();
      if (!error && user) {
        try {
          await window.teacherAuth?.signOutSupabase?.();
        } catch {
          /* ignore */
        }
        try {
          window.teacherAuth?.resetSupabaseClient?.();
        } catch {
          /* ignore */
        }
      }
    }
  } catch (e) {
    console.warn("teacher session check:", e);
  }

  let has = false;
  try {
    has = await window.authApi.hasAdmin();
  } catch (e) {
    console.error("auth:has-admin IPC failed:", e);
    if (authGateEl) {
      authGateEl.hidden = false;
    }
    if (appMainEl) {
      appMainEl.hidden = true;
    }
    setAuthError(
      "Sign-in couldn’t reach the desktop app process. Quit the app completely (all windows closed) and start it again. If this persists, reinstall from your latest setup build.",
    );
    if (authForm) {
      authForm.hidden = true;
    }
    return;
  }

  await showAuthScreen(has);
}

window.__persistFloatingReplicasNow = flushAllFloatingDraftPersistence;
window.__saveAllAppStateToSupabaseNow = saveAllAppStateToSupabaseNow;

initNotionWorkspace();
hydrateCanvasDraftTablesFromStorage();
initCanvasDraftAutoPersistObserver();
bindPayslipNotionLinksChromeOnce();
try {
  window.addEventListener("beforeunload", () => {
    flushPersistentAppStateOnExit();
  });
} catch {
  /* ignore */
}
try {
  window.addEventListener("pagehide", () => {
    flushPersistentAppStateOnExit();
  });
} catch {
  /* ignore */
}
try {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      flushAllFloatingDraftPersistence();
    }
  });
} catch {
  /* ignore */
}
boot();
