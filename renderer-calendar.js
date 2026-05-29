/**
 * Workspace Calendar page — mounted in #rmeCalendarRoot after renderer.js loads.
 * Reminders, per-day notes/to-dos, and settings persist on disk (userData/planner/).
 */
(function rmeWorkspaceCalendar() {
  "use strict";

  const STORAGE_EVENTS = "recruit-rme-calendar-events-v1";
  const STORAGE_SETTINGS = "recruit-rme-calendar-settings-v1";
  const STORAGE_DAY_PAGES = "recruit-rme-calendar-day-pages-v1";
  const STORAGE_TRASH = "recruit-rme-calendar-trash-v1";
  const STORAGE_DEFERRALS = "recruit-rme-calendar-reminder-deferrals-v1";
  const STORAGE_OBSIDIAN_NOTES = "recruit-obsidian-notes-v1";
  /** @type {Record<string, string>} localStorage key → planner file key */
  const PLANNER_FILE_KEY = {
    [STORAGE_EVENTS]: "events",
    [STORAGE_DAY_PAGES]: "day-pages",
    [STORAGE_TRASH]: "trash",
    [STORAGE_DEFERRALS]: "deferrals",
    [STORAGE_SETTINGS]: "settings",
    [STORAGE_OBSIDIAN_NOTES]: "obsidian-notes",
  };
  const PLANNER_LS_KEYS = Object.keys(PLANNER_FILE_KEY);

  /** Signed-in user id (lowercase UUID) — must match main process planner scope. */
  function getPlannerScopeId() {
    const raw =
      typeof window.__rmePlannerScopeId === "string"
        ? window.__rmePlannerScopeId.trim().toLowerCase()
        : "";
    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
        raw,
      )
    ) {
      return raw;
    }
    return "";
  }

  /** @param {string} baseKey */
  function plannerLsKey(baseKey) {
    const scope = getPlannerScopeId();
    return scope ? `${baseKey}::${scope}` : baseKey;
  }

  let plannerStoreReady = false;
  let plannerUsesFileStore = false;
  let plannerScopeBound = "";
  let warnedNoPlannerScope = false;
  /** Serializes planner disk writes so they complete in order. */
  let plannerWriteChain = Promise.resolve();

  const MAX_TRASH = 80;
  const LIB_PAGE_SIZE = 25;
  /** Open-ended daily / weekly repeats store this as the end date (date-only, no time). */
  const RME_CAL_REPEAT_OPEN_END = "2099-12-31";
  /** Fire reminders even if the user missed the exact minute (e.g. was on another page). */
  const REMINDER_ALARM_GRACE_MS = 30 * 60 * 1000;
  const REMINDER_ALARM_POLL_MAX_MS = 60000;
  const REMINDER_ALARM_POLL_MIN_MS = 1500;
  /** Reminder alarms: one play plus two repeats, then stop. */
  const REMINDER_SOUND_ALARM_PLAYS = 3;
  const REMINDER_SOUND_LOOP_GAP_S = 0.45;

  /** @typedef {{ weekStartsOn: 0 | 1; reminderSound?: string }} RmeCalSettings */
  /** @typedef {{ id: string; title: string; start: string; end?: string; allDay?: boolean; colorIdx?: number; notes?: string; priority?: 0 | 1 | 2; reminderRepeat?: 'daily' | 'weekly'; repeatWeekdays?: number[]; pinned?: boolean; extraTimes?: string[]; reminderTimes?: string[] }} RmeCalEvent */
  /** @typedef {{ id: string; text: string; done: boolean }} RmeCalDayTodo */
  /** @typedef {{ title?: string; notes: string; todos: RmeCalDayTodo[] }} RmeCalDayPage */
  /**
   * @typedef {{
   *   id: string;
   *   at: string;
   *   kind:
   *     | "clear-all-notes"
   *     | "clear-all-todos"
   *     | "clear-all-reminders"
   *     | "delete-reminder"
   *     | "delete-day-note"
   *     | "delete-todo";
   *   summary: string;
   *   detail?: string;
   *   payload: unknown;
   * }} RmeCalTrashEntry
   */

  /** High / medium / low — stored as `priority` + `colorIdx` (both 0–2). */
  const PRIORITY_LEVELS = [
    {
      id: 0,
      key: "high",
      label: "High",
      hint: "Urgent — needs attention first",
      hex: "#dc2626",
      soft: "color-mix(in srgb, #dc2626 22%, transparent)",
    },
    {
      id: 1,
      key: "medium",
      label: "Medium",
      hint: "Soon — steady follow-up",
      hex: "#ca8a04",
      soft: "color-mix(in srgb, #eab308 28%, transparent)",
    },
    {
      id: 2,
      key: "low",
      label: "Low",
      hint: "Whenever — not blocking yet",
      hex: "#2563eb",
      soft: "color-mix(in srgb, #2563eb 20%, transparent)",
    },
  ];

  function legacyPriorityFromColorIdx(n) {
    if (!Number.isFinite(n) || n < 0) return 1;
    if (n > 2) {
      const L = [2, 2, 1, 1, 0, 1, 2];
      return L[Math.min(n, 6)];
    }
    const old012 = [2, 2, 1];
    return old012[n] ?? 1;
  }

  /** @param {RmeCalEvent | null | undefined} ev */
  function eventPriority(ev) {
    if (ev && typeof ev.priority === "number" && ev.priority >= 0 && ev.priority <= 2) {
      return /** @type {0|1|2} */ (ev.priority);
    }
    return legacyPriorityFromColorIdx(Number(ev?.colorIdx));
  }

  /** @param {0|1|2} pi */
  function priorityHex(pi) {
    return PRIORITY_LEVELS[Math.min(2, Math.max(0, pi))]?.hex ?? PRIORITY_LEVELS[1].hex;
  }

  /** @type {RmeCalEvent[]} */
  let events = [];
  /** Last raw localStorage snapshot — skip JSON.parse when unchanged. */
  let eventsStorageSnapshot = null;
  /** Bumps when events array changes (derived planner caches key off this). */
  let eventsRev = 0;
  /** @type {Record<string, RmeCalDayPage>} */
  let dayPages = {};
  let dayPagesStorageSnapshot = null;
  /** @type {RmeCalTrashEntry[]} */
  let trash = [];
  let trashStorageSnapshot = null;
  /** @type {RmeCalSettings} */
  let settings = { weekStartsOn: 1, reminderSound: "windows" };

  /** @type {AudioContext | null} */
  let reminderAudioCtx = null;

  /** @type {readonly { id: string; label: string }[]} */
  const REMINDER_SOUNDS = [
    { id: "windows", label: "Windows default" },
    { id: "chime", label: "Chime" },
    { id: "bell", label: "Bell" },
    { id: "ping", label: "Ping" },
    { id: "soft", label: "Soft" },
    { id: "urgent", label: "Urgent" },
    { id: "off", label: "Silent" },
  ];

  /** @type {"month" | "week" | "trash" | "obsidian"} */
  let viewMode = "month";
  /** Calendar tab to restore when leaving Obsidian view (month or week). */
  let calendarViewBeforeObsidian = "month";
  /** @type {HTMLElement | null} */
  let obsidianHostEl = null;
  /** View anchor (month/week uses this date). */
  let anchor = new Date();
  /** @type {string} YYYY-MM-DD */
  let pickedDay = isoDateOnly(new Date());
  let searchQ = "";
  /** Reminder library page index (0-based). */
  let libPage = 0;
  /** @type {number} */
  let calSearchDebounce = 0;

  /** occurrenceKey → ISO when this slot should ring next (snooze / defer). */
  /** @type {Record<string, string>} */
  let reminderDeferrals = {};
  let deferralsStorageSnapshot = null;
  /** @type {{ key: string; byDay: Map<string, RmeCalEvent[]> } | null} */
  let viewRemindersCache = null;
  /** @type {RmeCalEvent[] | null} */
  let libraryRemindersCache = null;
  let libraryRemindersCacheKey = "";
  /** Bumps when day notes / to-dos change (render fingerprint). */
  let dayPagesRev = 0;
  /** @type {{ notes: { id: string; title: string; content: string; createdAt: string; updatedAt: string }[] }} */
  let obsidianNotes = { notes: [] };
  let obsidianNotesSnapshot = null;
  let lastRenderFingerprint = "";
  let renderRaf = 0;
  let renderForceNext = false;
  /** @type {{ key: string; list: { ev: RmeCalEvent; dayKey: string; hhmm: string; occKey: string; wakeMs: number }[] } | null} */
  let todayAlarmCache = null;
  /** Dedupe alarm toasts: `${occKey}|${floor(wakeMs/60000)}` */
  const reminderRung = new Set();
  let rmeCalAlarmTimer = 0;
  /** @type {HTMLElement | null} */
  let rmeCalToastEl = null;
  /** @type {HTMLElement | null} */
  let rmeCalSnoozePopoverEl = null;
  /** @type {{ evId: string; dayKey: string; hhmm: string; occKey: string } | null} */
  let lastAlarmCtx = null;

  /** @type {RmeCalEvent | null} */
  let editing = null;
  /** @type {HTMLElement | null} */
  let modalHost = null;

  function closeModalHost() {
    if (!modalHost) return;
    if (modalHost instanceof HTMLDialogElement && modalHost.open) {
      modalHost.close();
    }
    modalHost.remove();
    modalHost = null;
  }

  /** Notes / reminder editor open — skip full calendar DOM rebuild (Electron focus + typing). */
  function plannerModalIsOpen() {
    if (!modalHost) return false;
    if (modalHost instanceof HTMLDialogElement) return modalHost.open;
    return modalHost.isConnected;
  }

  /** Native <dialog> on body so day card can use full viewport width (admin + teacher). */
  function mountPlannerModalDialog(dialog) {
    const theme =
      document.documentElement.dataset.theme === "light" ? "light" : "dark";
    dialog.style.colorScheme = theme;
    document.body.appendChild(dialog);
  }

  function isoDateOnly(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function plannerTodayYmd() {
    return isoDateOnly(new Date());
  }

  /** @param {string} ymd */
  function isYmdBeforeToday(ymd) {
    const k = String(ymd || "").trim().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k)) return false;
    return k < plannerTodayYmd();
  }

  /** @param {string} ymd */
  function clampYmdToTodayOrFuture(ymd) {
    const k = String(ymd || "").trim().slice(0, 10);
    const today = plannerTodayYmd();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(k) || k < today) return today;
    return k;
  }

  /**
   * @param {string} ymd
   * @param {{ silent?: boolean }} [opts]
   */
  function rejectPastReminderDate(ymd, opts) {
    if (!isYmdBeforeToday(ymd)) return true;
    if (!opts?.silent) {
      window.alert("Reminders can only be set for today or a future date.");
    }
    return false;
  }

  /** @param {HTMLInputElement} input */
  function applyPlannerMinDateInput(input) {
    input.min = plannerTodayYmd();
  }

  function parseYmd(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || "").trim());
    if (!m) return null;
    const y = Number(m[1]);
    const mo = Number(m[2]) - 1;
    const d = Number(m[3]);
    const dt = new Date(y, mo, d);
    if (dt.getFullYear() !== y || dt.getMonth() !== mo || dt.getDate() !== d) {
      return null;
    }
    return dt;
  }

  function invalidateCalendarDerivedCaches() {
    eventsRev += 1;
    viewRemindersCache = null;
    libraryRemindersCache = null;
    libraryRemindersCacheKey = "";
    todayAlarmCache = null;
  }

  function isPlannerPaneVisible() {
    if (typeof window.rmeIdlePower?.isNotionWsPaneVisible === "function") {
      return window.rmeIdlePower.isNotionWsPaneVisible("notionWsPaneCalendar");
    }
    const pane = document.getElementById("notionWsPaneCalendar");
    return Boolean(
      pane instanceof HTMLElement &&
        !pane.hidden &&
        pane.classList.contains("notion-ws-pane--visible"),
    );
  }

  /** Signed-in app shell is up — reminders must run on any page, not only My planner. */
  function isReminderAlarmActive() {
    if (typeof window.rmeIdlePower?.isAuthGateVisible === "function") {
      if (window.rmeIdlePower.isAuthGateVisible()) return false;
    } else {
      const gate = document.getElementById("authGate");
      if (gate instanceof HTMLElement && !gate.hidden) return false;
    }
    const appMain = document.getElementById("appMain");
    return !(appMain instanceof HTMLElement && appMain.hidden);
  }

  function renderFingerprint() {
    return [
      viewMode,
      isoDateOnly(anchor),
      pickedDay,
      searchQ.trim(),
      libPage,
      eventsRev,
      dayPagesRev,
      trash.length,
      settings.weekStartsOn,
    ].join("|");
  }

  /** @param {string} nextKey YYYY-MM-DD */
  function patchCalendarPickedDay(nextKey) {
    if (!nextKey || pickedDay === nextKey) {
      return;
    }
    const root = document.getElementById("rmeCalendarRoot");
    const prevKey = pickedDay;
    pickedDay = nextKey;
    if (!root) {
      return;
    }
    if (prevKey) {
      const prev = root.querySelector(`[data-rme-cal-day="${prevKey}"]`);
      if (prev) {
        prev.classList.remove("rme-cal-cell--picked", "rme-cal-week-col--picked");
      }
    }
    const next = root.querySelector(`[data-rme-cal-day="${nextKey}"]`);
    if (next) {
      next.classList.add(
        viewMode === "week" ? "rme-cal-week-col--picked" : "rme-cal-cell--picked",
      );
    }
  }

  function plannerStorageApi() {
    const api = window.calendarStorageApi;
    return api && typeof api === "object" ? api : null;
  }

  /**
   * @param {string} lsKey
   * @returns {Promise<string | null>}
   */
  /** @param {string} lsKey */
  function readPlannerLsRaw(lsKey) {
    const keys = [plannerLsKey(lsKey), lsKey];
    for (const k of keys) {
      try {
        const raw = window.localStorage.getItem(k);
        if (raw != null && String(raw).trim()) {
          return raw;
        }
      } catch {
        /* try next */
      }
    }
    return null;
  }

  /** @param {string} lsKey @param {string | null | undefined} raw */
  function plannerPayloadIsEmpty(lsKey, raw) {
    const s = String(raw ?? "").trim();
    if (!s) return true;
    if (lsKey === STORAGE_EVENTS) return s === "[]";
    if (lsKey === STORAGE_DAY_PAGES) return s === "{}";
    if (lsKey === STORAGE_TRASH) return s === "[]";
    if (lsKey === STORAGE_DEFERRALS) return s === "{}";
    return false;
  }

  /**
   * Copy scoped (and legacy unscoped) localStorage into the file store when disk is empty.
   * @returns {Promise<boolean>}
   */
  async function migratePlannerFromLocalStorageIfNeeded() {
    const api = plannerStorageApi();
    if (!api || typeof api.write !== "function") {
      return false;
    }
    let migrated = false;
    for (const lsKey of PLANNER_LS_KEYS) {
      const fileKey = PLANNER_FILE_KEY[lsKey];
      if (!fileKey) continue;
      let fileRaw = null;
      if (typeof api.read === "function") {
        try {
          const res = await api.read(fileKey);
          if (res && res.ok && typeof res.content === "string") {
            fileRaw = res.content;
          }
        } catch {
          fileRaw = null;
        }
      }
      if (fileRaw && !plannerPayloadIsEmpty(lsKey, fileRaw)) {
        continue;
      }
      const lsRaw = readPlannerLsRaw(lsKey);
      if (!lsRaw || plannerPayloadIsEmpty(lsKey, lsRaw)) {
        continue;
      }
      try {
        const wr = await api.write(fileKey, lsRaw);
        if (wr && wr.ok) {
          migrated = true;
        }
      } catch (e) {
        console.warn("planner localStorage migrate:", fileKey, e);
      }
    }
    if (migrated) {
      for (const lsKey of PLANNER_LS_KEYS) {
        try {
          window.localStorage.removeItem(plannerLsKey(lsKey));
        } catch {
          /* ignore */
        }
      }
    }
    return migrated;
  }

  async function readPlannerStorage(lsKey) {
    const scope = getPlannerScopeId();
    if (!scope) {
      return null;
    }
    await ensurePlannerFileStore();
    const fileKey = PLANNER_FILE_KEY[lsKey];
    const api = plannerStorageApi();
    if (api && typeof api.read === "function" && fileKey) {
      try {
        const res = await api.read(fileKey);
        if (res && res.ok && typeof res.content === "string" && res.content.length) {
          return res.content;
        }
      } catch (e) {
        console.warn("planner file read:", fileKey, e);
      }
    }
    return readPlannerLsRaw(lsKey);
  }

  /**
   * @param {string} lsKey
   * @param {string} json
   */
  async function writePlannerStorageImpl(lsKey, json) {
    const scope = getPlannerScopeId();
    if (!scope) {
      if (!warnedNoPlannerScope) {
        warnedNoPlannerScope = true;
        console.warn(
          "planner save skipped: storage scope not set (sign in and open My planner first)",
        );
      }
      return;
    }
    warnedNoPlannerScope = false;
    const fileKey = PLANNER_FILE_KEY[lsKey];
    const api = plannerStorageApi();
    if (!api) {
      try {
        window.localStorage.setItem(plannerLsKey(lsKey), json);
      } catch (e) {
        console.warn("planner storage save (local only):", lsKey, e);
      }
      return;
    }
    await ensurePlannerFileStore();
    if (typeof api.write === "function" && fileKey) {
      try {
        const res = await api.write(fileKey, json);
        if (res && res.ok) {
          return;
        }
        console.warn(
          "planner file write failed:",
          fileKey,
          res?.message || "unknown error",
        );
      } catch (e) {
        console.warn("planner file write error:", fileKey, e);
      }
    }
    try {
      window.localStorage.setItem(plannerLsKey(lsKey), json);
    } catch (e) {
      console.warn("planner storage save:", lsKey, e);
    }
  }

  /**
   * @param {string} lsKey
   * @param {string} json
   */
  function writePlannerStorage(lsKey, json) {
    plannerWriteChain = plannerWriteChain
      .then(() => writePlannerStorageImpl(lsKey, json))
      .catch((e) => {
        console.warn("planner write queue:", lsKey, e);
      });
  }

  async function flushPlannerStorageWrites() {
    await plannerWriteChain;
  }

  async function reloadPlannerForCurrentScope() {
    const scope = getPlannerScopeId();
    if (!scope) {
      return;
    }
    const scopeChanged =
      Boolean(plannerScopeBound) && plannerScopeBound !== scope;
    if (scopeChanged) {
      resetPlannerStorageBinding();
    }
    await ensurePlannerFileStore();
    await reloadAllPlannerData();
    render({ force: true });
    tickReminderAlarms();
  }

  function clearPlannerStorageScope() {
    resetPlannerStorageBinding();
    warnedNoPlannerScope = false;
    plannerWriteChain = Promise.resolve();
  }

  /** Rebind disk store after sign-in / scope change (admin + teacher portals). */
  window.rmePlannerReloadScope = reloadPlannerForCurrentScope;
  window.rmePlannerFlushAll = flushPlannerStorageWrites;
  window.rmePlannerClearScope = clearPlannerStorageScope;

  function resetPlannerStorageBinding() {
    plannerStoreReady = false;
    plannerUsesFileStore = false;
    plannerScopeBound = "";
    events = [];
    dayPages = {};
    trash = [];
    reminderDeferrals = {};
    eventsRev = 0;
    dayPagesRev = 0;
    invalidateCalendarDerivedCaches();
  }

  async function ensurePlannerFileStore() {
    const scope = getPlannerScopeId();
    if (!scope) {
      plannerUsesFileStore = false;
      return false;
    }
    if (plannerStoreReady && plannerScopeBound === scope) {
      return plannerUsesFileStore;
    }
    if (plannerScopeBound && plannerScopeBound !== scope) {
      resetPlannerStorageBinding();
    }
    plannerScopeBound = scope;
    plannerStoreReady = true;
    const api = plannerStorageApi();
    if (!api || typeof api.isInitialized !== "function") {
      plannerUsesFileStore = false;
      return false;
    }
    try {
      plannerUsesFileStore = true;
      const migrated = await migratePlannerFromLocalStorageIfNeeded();
      const st = await api.isInitialized();
      if (!st || !st.ok || !st.initialized) {
        if (typeof api.markInitialized === "function") {
          await api.markInitialized({
            migratedFrom: migrated ? "localStorage" : "fresh",
            teacherId: scope,
          });
        }
      }
      return true;
    } catch (e) {
      console.warn("planner file store init:", e);
      plannerUsesFileStore = false;
      return false;
    }
  }

  async function reloadAllPlannerData() {
    if (getPlannerScopeId()) {
      await ensurePlannerFileStore();
    }
    await Promise.all([
      reloadEventsFromStore(),
      reloadDayPagesFromStore(),
      reloadTrashFromStore(),
      reloadDeferralsFromStore(),
      reloadSettingsFromStore(),
    ]);
  }

  function loadEvents() {
    void reloadEventsFromStore();
  }

  async function reloadEventsFromStore() {
    const raw = await readPlannerStorage(STORAGE_EVENTS);
    if (raw === eventsStorageSnapshot) {
      return;
    }
    eventsStorageSnapshot = raw;
    try {
      if (!raw) {
        events = [];
        invalidateCalendarDerivedCaches();
        return;
      }
      const arr = JSON.parse(raw);
      let migratedShape = false;
      events = Array.isArray(arr)
        ? arr
            .filter(
              (x) =>
                x &&
                typeof x.id === "string" &&
                typeof x.title === "string" &&
                typeof x.start === "string",
            )
            .map((x) => {
              const snap = JSON.stringify(x);
              if (Array.isArray(x.extraTimes)) {
                const cleaned = x.extraTimes
                  .map((t) => normalizeHHMM(String(t)))
                  .filter(Boolean);
                if (cleaned.length) x.extraTimes = cleaned;
                else delete x.extraTimes;
              } else if (x.extraTimes != null) {
                delete x.extraTimes;
              }
              if (x.reminderRepeat !== "daily" && x.reminderRepeat !== "weekly") {
                delete x.reminderRepeat;
              }
              if (x.reminderRepeat === "weekly" && Array.isArray(x.repeatWeekdays)) {
                const wd = x.repeatWeekdays
                  .map((n) => Number(n))
                  .filter((n) => Number.isInteger(n) && n >= 0 && n <= 6);
                if (wd.length) x.repeatWeekdays = [...new Set(wd)].sort((a, b) => a - b);
                else delete x.repeatWeekdays;
              } else if (x.repeatWeekdays != null) {
                delete x.repeatWeekdays;
              }
              if (x.pinned === true) x.pinned = true;
              else delete x.pinned;
              migrateRepeatReminderShape(x);
              if (JSON.stringify(x) !== snap) migratedShape = true;
              return x;
            })
        : [];
      if (migratedShape) {
        saveEvents();
      }
      invalidateCalendarDerivedCaches();
    } catch {
      events = [];
      invalidateCalendarDerivedCaches();
    }
  }

  function saveEvents() {
    try {
      const json = JSON.stringify(events);
      writePlannerStorage(STORAGE_EVENTS, json);
      eventsStorageSnapshot = json;
      invalidateCalendarDerivedCaches();
    } catch (e) {
      console.warn("calendar events save:", e);
    }
  }

  function loadSettings() {
    void reloadSettingsFromStore();
  }

  async function reloadSettingsFromStore() {
    try {
      const raw = await readPlannerStorage(STORAGE_SETTINGS);
      if (!raw) {
        settings = { weekStartsOn: 1, reminderSound: "windows" };
        return;
      }
      const o = JSON.parse(raw);
      const w = Number(o?.weekStartsOn);
      settings = {
        weekStartsOn: w === 0 ? 0 : 1,
        reminderSound: normalizeReminderSoundId(o?.reminderSound),
      };
    } catch {
      settings = { weekStartsOn: 1, reminderSound: "windows" };
    }
  }

  /** @param {unknown} raw */
  function normalizeReminderSoundId(raw) {
    const id = String(raw || "windows").trim();
    return REMINDER_SOUNDS.some((s) => s.id === id) ? id : "windows";
  }

  /** @param {string} soundId */
  function reminderSoundUsesOsDefault(soundId) {
    return normalizeReminderSoundId(soundId) === "windows";
  }

  function getReminderAudioCtx() {
    if (reminderAudioCtx && reminderAudioCtx.state !== "closed") {
      return reminderAudioCtx;
    }
    const Ctx =
      /** @type {typeof AudioContext | undefined} */ (window.AudioContext) ||
      /** @type {typeof AudioContext | undefined} */ (window.webkitAudioContext);
    if (!Ctx) return null;
    reminderAudioCtx = new Ctx();
    return reminderAudioCtx;
  }

  /** @param {string} soundId */
  function reminderSoundPatternDurationSec(soundId) {
    switch (soundId) {
      case "chime":
        return 0.76;
      case "bell":
        return 0.66;
      case "ping":
        return 0.26;
      case "soft":
        return 0.68;
      case "urgent":
        return 0.98;
      default:
        return 0.5;
    }
  }

  /**
   * @param {AudioContext} ctx
   * @param {GainNode} master
   * @param {number} t0
   * @param {string} soundId
   */
  function scheduleReminderSoundPattern(ctx, master, t0, soundId) {
    /**
     * @param {number} freq
     * @param {number} start
     * @param {number} dur
     * @param {OscillatorType} [type]
     * @param {number} [vol]
     */
    function beep(freq, start, dur, type = "sine", vol = 1) {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0 + start);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol), t0 + start + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur);
      g.connect(master);
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(freq, t0 + start);
      o.connect(g);
      o.start(t0 + start);
      o.stop(t0 + start + dur + 0.03);
    }

    switch (soundId) {
      case "chime":
        beep(880, 0, 0.2, "sine", 0.9);
        beep(1174.66, 0.15, 0.24, "sine", 0.82);
        beep(1318.51, 0.32, 0.4, "sine", 0.75);
        break;
      case "bell":
        beep(622.25, 0, 0.58, "triangle", 1);
        beep(1244.5, 0.05, 0.48, "sine", 0.38);
        break;
      case "ping":
        beep(1400, 0, 0.09, "sine", 1);
        beep(1046.5, 0.07, 0.14, "sine", 0.55);
        break;
      case "soft":
        beep(523.25, 0, 0.38, "sine", 0.52);
        beep(659.25, 0.22, 0.42, "sine", 0.38);
        break;
      case "urgent":
        for (let i = 0; i < 3; i++) {
          const off = i * 0.24;
          beep(880, off, 0.13, "square", 0.22);
          beep(659.25, off + 0.13, 0.09, "square", 0.18);
        }
        break;
      default:
        break;
    }
  }

  /**
   * @param {string} soundId
   * @param {{ preview?: boolean }} [opts]
   */
  async function playReminderSound(soundId, opts) {
    const rawId = normalizeReminderSoundId(soundId);
    if (rawId === "off") return;

    const isPreview = Boolean(opts?.preview);
    const osHandlesFirst = rawId === "windows" && !isPreview;
    let id = rawId === "windows" ? "chime" : rawId;

    const ctx = getReminderAudioCtx();
    if (!ctx) return;
    try {
      await ctx.resume();
    } catch {
      return;
    }

    const master = ctx.createGain();
    master.gain.value = isPreview ? 0.42 : 0.68;
    master.connect(ctx.destination);

    const patternDur = reminderSoundPatternDurationSec(id);
    const plays = isPreview
      ? 1
      : osHandlesFirst
        ? REMINDER_SOUND_ALARM_PLAYS - 1
        : REMINDER_SOUND_ALARM_PLAYS;
    const t0 = ctx.currentTime;

    for (let i = 0; i < plays; i++) {
      scheduleReminderSoundPattern(
        ctx,
        master,
        t0 + i * (patternDur + REMINDER_SOUND_LOOP_GAP_S),
        id,
      );
    }
  }

  function saveSettings() {
    try {
      writePlannerStorage(STORAGE_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn("calendar settings save:", e);
    }
  }

  function newTodoId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `td-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function loadDayPages() {
    void reloadDayPagesFromStore();
  }

  async function reloadDayPagesFromStore() {
    const raw = await readPlannerStorage(STORAGE_DAY_PAGES);
    if (raw === dayPagesStorageSnapshot) {
      return;
    }
    dayPagesStorageSnapshot = raw;
    try {
      if (!raw) {
        dayPages = {};
        return;
      }
      const o = JSON.parse(raw);
      if (!o || typeof o !== "object" || Array.isArray(o)) {
        dayPages = {};
        return;
      }
      /** @type {Record<string, RmeCalDayPage>} */
      const next = {};
      for (const key of Object.keys(o)) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
        const p = o[key];
        if (!p || typeof p !== "object") continue;
        const notes = typeof p.notes === "string" ? p.notes : "";
        const rawTodos = Array.isArray(p.todos) ? p.todos : [];
        const todos = rawTodos
          .filter((t) => t && typeof t === "object" && typeof t.id === "string")
          .map((t) => ({
            id: String(t.id),
            text: typeof t.text === "string" ? t.text : "",
            done: Boolean(t.done),
          }));
        const title = typeof p.title === "string" ? p.title.trim() : "";
        next[key] = { title, notes, todos };
      }
      dayPages = next;
    } catch {
      dayPages = {};
    }
  }

  function saveDayPages() {
    try {
      const json = JSON.stringify(dayPages);
      writePlannerStorage(STORAGE_DAY_PAGES, json);
      dayPagesStorageSnapshot = json;
      dayPagesRev += 1;
    } catch (e) {
      console.warn("calendar day pages save:", e);
    }
  }

  function newTrashEntryId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `tr-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function loadTrash() {
    void reloadTrashFromStore();
  }

  async function reloadTrashFromStore() {
    const raw = await readPlannerStorage(STORAGE_TRASH);
    if (raw === trashStorageSnapshot) {
      return;
    }
    trashStorageSnapshot = raw;
    try {
      if (!raw) {
        trash = [];
        return;
      }
      const arr = JSON.parse(raw);
      trash = Array.isArray(arr)
        ? arr.filter(
            (x) =>
              x &&
              typeof x.id === "string" &&
              typeof x.at === "string" &&
              typeof x.kind === "string" &&
              typeof x.summary === "string",
          )
        : [];
    } catch {
      trash = [];
    }
  }

  function saveTrash() {
    try {
      const json = JSON.stringify(trash);
      writePlannerStorage(STORAGE_TRASH, json);
      trashStorageSnapshot = json;
    } catch (e) {
      console.warn("calendar trash save:", e);
    }
  }

  /** @param {Omit<RmeCalTrashEntry, "id" | "at">} partial */
  function pushTrashEntry(partial) {
    /** @type {RmeCalTrashEntry} */
    const entry = {
      id: newTrashEntryId(),
      at: new Date().toISOString(),
      kind: partial.kind,
      summary: partial.summary,
      detail: partial.detail,
      payload: partial.payload,
    };
    trash.unshift(entry);
    if (trash.length > MAX_TRASH) {
      trash.length = MAX_TRASH;
    }
    saveTrash();
  }

  /** @param {string} trashId */
  function removeTrashEntry(trashId) {
    const i = trash.findIndex((t) => t.id === trashId);
    if (i >= 0) {
      trash.splice(i, 1);
      saveTrash();
    }
  }

  function deepCloneJson(x) {
    try {
      return JSON.parse(JSON.stringify(x));
    } catch {
      return x;
    }
  }

  /** @param {RmeCalEvent} ev */
  function moveReminderToTrash(ev) {
    pushTrashEntry({
      kind: "delete-reminder",
      summary: `Deleted reminder: ${ev.title}`,
      detail: ev.start ? String(ev.start).slice(0, 16) : "",
      payload: { reminder: deepCloneJson(ev) },
    });
    events = events.filter((x) => x.id !== ev.id);
    saveEvents();
    render();
  }

  /** @param {string} dayKey @param {string} notesText @param {string} [dayTitle] */
  function moveDayNoteToTrash(dayKey, notesText, dayTitle) {
    const text = String(notesText ?? "").trim();
    if (!text || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
      return;
    }
    const label = String(dayTitle ?? "").trim() || dayDateHeading(dayKey);
    pushTrashEntry({
      kind: "delete-day-note",
      summary: `Note: ${label}`,
      detail: truncatePlainPreview(text, 140),
      payload: { dayKey, notes: text, dayTitle: String(dayTitle ?? "").trim() },
    });
  }

  /**
   * @param {string} dayKey
   * @param {RmeCalDayTodo} todo
   * @param {string} [dayTitle]
   */
  function moveTodoToTrash(dayKey, todo, dayTitle) {
    if (!todo || typeof todo.id !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) {
      return;
    }
    const text = String(todo.text ?? "").trim();
    const label = String(dayTitle ?? "").trim() || dayDateHeading(dayKey);
    pushTrashEntry({
      kind: "delete-todo",
      summary: text ? `To-do: ${truncatePlainPreview(text, 72)}` : "To-do",
      detail: label,
      payload: {
        dayKey,
        dayTitle: String(dayTitle ?? "").trim(),
        todo: {
          id: todo.id,
          text: String(todo.text ?? ""),
          done: Boolean(todo.done),
        },
      },
    });
  }

  /** @param {RmeCalTrashEntry} entry @returns {boolean} true if entry should be removed */
  function pruneTrashEntryAfterItemRemoved(entry) {
    const pl = entry.payload;
    if (entry.kind === "clear-all-notes") {
      const nb =
        pl && typeof pl === "object" && pl.notesByDay && typeof pl.notesByDay === "object"
          ? pl.notesByDay
          : {};
      for (const k of Object.keys(nb)) {
        if (!String(nb[k] ?? "").trim()) {
          delete nb[k];
        }
      }
      return Object.keys(nb).length === 0;
    }
    if (entry.kind === "clear-all-todos") {
      const tb =
        pl && typeof pl === "object" && pl.todosByDay && typeof pl.todosByDay === "object"
          ? pl.todosByDay
          : {};
      for (const k of Object.keys(tb)) {
        const list = Array.isArray(tb[k]) ? tb[k] : [];
        const kept = list.filter((t) => t && typeof t.id === "string");
        if (kept.length) {
          tb[k] = kept;
        } else {
          delete tb[k];
        }
      }
      return Object.keys(tb).length === 0;
    }
    return false;
  }

  /**
   * @param {string} entryId
   * @param {string} dayKey
   */
  function deleteNoteFromTrashBulk(entryId, dayKey) {
    const entry = trash.find((t) => t.id === entryId);
    if (!entry || entry.kind !== "clear-all-notes") {
      return;
    }
    const pl = entry.payload;
    if (!pl || typeof pl !== "object" || !pl.notesByDay) {
      return;
    }
    delete pl.notesByDay[dayKey];
    if (pruneTrashEntryAfterItemRemoved(entry)) {
      removeTrashEntry(entryId);
    } else {
      saveTrash();
    }
    render();
  }

  /**
   * @param {string} entryId
   * @param {string} dayKey
   * @param {string} todoId
   */
  function deleteTodoFromTrashBulk(entryId, dayKey, todoId) {
    const entry = trash.find((t) => t.id === entryId);
    if (!entry || entry.kind !== "clear-all-todos") {
      return;
    }
    const pl = entry.payload;
    if (!pl || typeof pl !== "object" || !pl.todosByDay || !Array.isArray(pl.todosByDay[dayKey])) {
      return;
    }
    pl.todosByDay[dayKey] = pl.todosByDay[dayKey].filter((t) => t && t.id !== todoId);
    if (pruneTrashEntryAfterItemRemoved(entry)) {
      removeTrashEntry(entryId);
    } else {
      saveTrash();
    }
    render();
  }

  /** @param {RmeCalTrashEntry} entry */
  function restoreTrashEntry(entry) {
    const pl = entry.payload;
    switch (entry.kind) {
      case "clear-all-notes": {
        const notesByDay = /** @type {Record<string, string>} */ (
          pl && typeof pl === "object" && pl.notesByDay && typeof pl.notesByDay === "object"
            ? pl.notesByDay
            : {}
        );
        for (const [key, text] of Object.entries(notesByDay)) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
          dayPageFor(key).notes = String(text ?? "");
        }
        saveDayPages();
        break;
      }
      case "clear-all-todos": {
        const todosByDay = /** @type {Record<string, RmeCalDayTodo[]>} */ (
          pl && typeof pl === "object" && pl.todosByDay && typeof pl.todosByDay === "object"
            ? pl.todosByDay
            : {}
        );
        for (const [key, list] of Object.entries(todosByDay)) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) continue;
          const raw = Array.isArray(list) ? list : [];
          dayPageFor(key).todos = raw
            .filter((t) => t && typeof t === "object" && typeof t.id === "string")
            .map((t) => ({
              id: String(t.id),
              text: typeof t.text === "string" ? t.text : "",
              done: Boolean(t.done),
            }));
        }
        saveDayPages();
        break;
      }
      case "clear-all-reminders": {
        const list = /** @type {RmeCalEvent[]} */ (
          pl && typeof pl === "object" && Array.isArray(pl.reminders) ? pl.reminders : []
        );
        for (const r of list) {
          if (!r || typeof r.id !== "string" || typeof r.title !== "string" || typeof r.start !== "string") {
            continue;
          }
          const copy = deepCloneJson(r);
          if (events.some((e) => e.id === copy.id)) {
            copy.id =
              typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : `ev-${Date.now()}-${Math.random().toString(16).slice(2)}`;
          }
          events.push(copy);
        }
        saveEvents();
        break;
      }
      case "delete-reminder": {
        const r =
          pl && typeof pl === "object" && pl.reminder && typeof pl.reminder === "object"
            ? /** @type {RmeCalEvent} */ (deepCloneJson(pl.reminder))
            : null;
        if (r && typeof r.id === "string") {
          if (!events.some((e) => e.id === r.id)) {
            events.push(r);
          }
        }
        saveEvents();
        break;
      }
      case "delete-day-note": {
        const dayKey =
          pl && typeof pl === "object" && typeof pl.dayKey === "string" ? pl.dayKey : "";
        const notes =
          pl && typeof pl === "object" && typeof pl.notes === "string" ? pl.notes : "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(dayKey) && notes.trim()) {
          const p = dayPageFor(dayKey);
          if (!String(p.notes || "").trim()) {
            p.notes = notes;
          } else {
            p.notes = `${String(p.notes).trim()}\n\n${notes.trim()}`;
          }
          if (
            pl &&
            typeof pl.dayTitle === "string" &&
            pl.dayTitle.trim() &&
            !String(p.title || "").trim()
          ) {
            p.title = pl.dayTitle.trim();
          }
          saveDayPages();
        }
        break;
      }
      case "delete-todo": {
        const dayKey =
          pl && typeof pl === "object" && typeof pl.dayKey === "string" ? pl.dayKey : "";
        const todo =
          pl && typeof pl === "object" && pl.todo && typeof pl.todo === "object"
            ? pl.todo
            : null;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dayKey) && todo && typeof todo.id === "string") {
          const p = dayPageFor(dayKey);
          if (!p.todos.some((t) => t.id === todo.id)) {
            p.todos.push({
              id: todo.id,
              text: typeof todo.text === "string" ? todo.text : "",
              done: Boolean(todo.done),
            });
          }
          saveDayPages();
        }
        break;
      }
      default:
        return;
    }
    removeTrashEntry(entry.id);
    render();
  }

  /** @param {string} kind */
  function trashKindLabel(kind) {
    if (kind === "clear-all-notes") return "Notes";
    if (kind === "clear-all-todos") return "To-dos";
    if (kind === "clear-all-reminders") return "Reminders";
    if (kind === "delete-reminder") return "Reminder";
    if (kind === "delete-day-note") return "Note";
    if (kind === "delete-todo") return "To-do";
    return "Item";
  }

  /** @param {string} iso */
  function formatTrashTime(iso) {
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return String(iso || "");
      return d.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return String(iso || "");
    }
  }

  /** @param {RmeCalTrashEntry} entry */
  function trashDetailPreview(entry) {
    const pl = entry.payload;
    try {
      if (entry.kind === "clear-all-notes") {
        const nb =
          pl && typeof pl === "object" && pl.notesByDay && typeof pl.notesByDay === "object"
            ? pl.notesByDay
            : {};
        const keys = Object.keys(nb);
        return keys.length ? `${keys.length} day(s) with saved note text.` : "No note payload.";
      }
      if (entry.kind === "clear-all-todos") {
        const tb =
          pl && typeof pl === "object" && pl.todosByDay && typeof pl.todosByDay === "object"
            ? pl.todosByDay
            : {};
        let tasks = 0;
        for (const list of Object.values(tb)) {
          if (!Array.isArray(list)) continue;
          tasks += list.filter((t) => t && String(t.text || "").trim()).length;
        }
        return `${tasks} to-do line(s) across ${Object.keys(tb).length} day(s).`;
      }
      if (entry.kind === "clear-all-reminders") {
        const list =
          pl && typeof pl === "object" && Array.isArray(pl.reminders) ? pl.reminders : [];
        const titles = list
          .map((r) => (r && r.title ? String(r.title).trim() : ""))
          .filter(Boolean)
          .slice(0, 4);
        return titles.length ? titles.join(" · ") : `${list.length} reminder(s).`;
      }
      if (entry.kind === "delete-reminder") {
        const r = pl && typeof pl === "object" ? pl.reminder : null;
        if (r && r.start) return `Was scheduled: ${String(r.start).slice(0, 16)}`;
      }
      if (entry.kind === "delete-day-note") {
        const dayKey =
          pl && typeof pl === "object" && typeof pl.dayKey === "string" ? pl.dayKey : "";
        const notes =
          pl && typeof pl === "object" && typeof pl.notes === "string" ? pl.notes : "";
        return notes.trim()
          ? truncatePlainPreview(notes, 160)
          : dayKey
            ? dayDateHeading(dayKey)
            : "";
      }
      if (entry.kind === "delete-todo") {
        const todo =
          pl && typeof pl === "object" && pl.todo && typeof pl.todo === "object"
            ? pl.todo
            : null;
        return todo && typeof todo.text === "string" ? todo.text.trim() : "";
      }
    } catch {
      /* ignore */
    }
    return "";
  }

  /** @param {string} key */
  function dayPageFor(key) {
    if (!dayPages[key]) {
      dayPages[key] = { title: "", notes: "", todos: [] };
    }
    if (typeof dayPages[key].title !== "string") {
      dayPages[key].title = "";
    }
    return dayPages[key];
  }

  /** @param {string} key */
  function dayDateHeading(key) {
    const day = parseYmd(key);
    return day
      ? day.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : key;
  }

  /** @param {string} key */
  function dayPageTitle(key) {
    return String(dayPages[key]?.title ?? "").trim();
  }

  /** Vault / graph label: custom title, else calendar date heading. */
  function dayDisplayLabel(key) {
    const t = dayPageTitle(key);
    return t || dayDateHeading(key);
  }

  /** @param {string} key */
  function dayHasTitle(key) {
    return Boolean(dayPageTitle(key));
  }

  /** @param {string} key */
  function dayHasNotes(key) {
    const p = dayPages[key];
    return Boolean(p && String(p.notes || "").trim().length);
  }

  /** @param {string} key */
  function dayHasTodos(key) {
    const p = dayPages[key];
    return Boolean(
      p && (p.todos || []).some((t) => String(t.text || "").trim().length > 0),
    );
  }

  /** @param {string} s @param {number} maxLen */
  function truncatePlainPreview(s, maxLen) {
    const raw = String(s || "").trim();
    if (!raw) return "";
    const cap = Math.max(8, maxLen);
    if (raw.length <= cap) return raw;
    return `${raw.slice(0, cap - 1).trim()}…`;
  }

  /**
   * Compact labeled summary for aria / search (not the tile DOM).
   * @param {string} key
   * @param {number} maxLen
   */
  function dayCardPreviewPlain(key, maxLen) {
    const p = dayPages[key];
    if (!p) return "";
    const titleRaw = dayPageTitle(key);
    const notesRaw = String(p.notes || "")
      .replace(/\r\n/g, "\n")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const todoItems = (p.todos || []).filter((t) => String(t?.text ?? "").trim().length > 0);
    if (!titleRaw && !notesRaw && !todoItems.length) return "";
    const cap = Math.max(24, maxLen);
    const parts = [];
    if (titleRaw) {
      parts.push(`Title: ${truncatePlainPreview(titleRaw, Math.min(cap - 8, 96))}`);
    }
    if (notesRaw) {
      parts.push(`Notes: ${truncatePlainPreview(notesRaw, Math.min(cap - 8, 96))}`);
    }
    for (const t of todoItems) {
      const line = String(t.text || "").trim();
      const done = Boolean(t.done);
      const label = done ? "To-do (done)" : "To-do";
      parts.push(`${label}: ${truncatePlainPreview(line, Math.min(cap - 8, 96))}`);
    }
    return truncatePlainPreview(parts.join(". "), cap);
  }

  /** Tooltip text for the day-card preview (full notes + each to-do line). */
  function dayCardPreviewTitle(key) {
    const p = dayPages[key];
    if (!p) return "";
    const titleFull = dayPageTitle(key);
    const noteFull = String(p.notes || "").trim();
    const todoBlock = (p.todos || [])
      .filter((t) => String(t?.text ?? "").trim().length > 0)
      .map((t) => {
        const tx = String(t.text || "").trim();
        return t.done ? `${tx} (done)` : tx;
      })
      .join("\n");
    const bits = [];
    if (titleFull) bits.push(titleFull);
    if (noteFull) bits.push(noteFull);
    if (todoBlock) bits.push(todoBlock);
    return bits.join("\n\n");
  }

  /** One-line normalized reminder note for excerpts. */
  function reminderNoteOneLine(ev) {
    return String(ev?.notes || "")
      .replace(/\r\n/g, "\n")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Flat summary for aria-label (day sheet + each reminder title/notes). */
  function dayTileAriaSummaryPlain(key, maxLen) {
    const cap = Math.max(32, maxLen);
    const bits = [];
    const sheet = dayCardPreviewPlain(key, cap);
    if (sheet) bits.push(sheet);
    const day = parseYmd(key);
    if (day) {
      for (const ev of sidebarRemindersForDay(day)) {
        const t = String(ev.title || "").trim() || "Reminder";
        const n = reminderNoteOneLine(ev);
        bits.push(n ? `${t}: ${n}` : t);
      }
    }
    return truncatePlainPreview(bits.join(". "), cap);
  }

  /** Tooltip: day sheet + each reminder (title + full notes). */
  function dayTileBodyTitle(key) {
    const bits = [];
    const ds = dayCardPreviewTitle(key);
    if (ds) bits.push(ds);
    const day = parseYmd(key);
    if (day) {
      const rs = sidebarRemindersForDay(day)
        .map((ev) => {
          const t = String(ev.title || "").trim() || "Reminder";
          const n = String(ev.notes || "").trim();
          if (n) return `${t}\n${n}`;
          return t;
        })
        .filter(Boolean);
      if (rs.length) bits.push(`Reminders:\n${rs.join("\n\n")}`);
    }
    return bits.join("\n\n");
  }

  /** @param {string} key */
  function daySheetHasContent(key) {
    return dayHasTitle(key) || dayHasNotes(key) || dayHasTodos(key);
  }

  function normalizedSearchQ() {
    return searchQ.trim().toLowerCase();
  }

  /** @param {string} text @param {string} q */
  function textMatchesSearch(text, q) {
    return Boolean(q) && String(text || "").toLowerCase().includes(q);
  }

  /** @param {string} key @param {string} q */
  function dayPageMatchesSearch(key, q) {
    if (!q) return daySheetHasContent(key);
    const p = dayPages[key];
    if (!p) return false;
    if (textMatchesSearch(p.title, q)) return true;
    if (textMatchesSearch(p.notes, q)) return true;
    return (p.todos || []).some((t) => textMatchesSearch(t.text, q));
  }

  /** @param {string} key @param {string} q */
  function dayDateMatchesSearch(key, q) {
    if (!q) return false;
    const d = parseYmd(key);
    if (!d) return false;
    const hay = [
      key,
      d.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      d.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
      d.toLocaleDateString(undefined, { month: "long", year: "numeric" }),
      String(d.getDate()),
      String(d.getFullYear()),
    ]
      .join("\n")
      .toLowerCase();
    return hay.includes(q);
  }

  /** @param {Date} day @param {string} q */
  function dayHasSearchableReminders(day, q) {
    const list = q ? eventsForDay(day) : remindersOnDay(day);
    return list.some((ev) => String(ev?.title ?? "").trim().length > 0);
  }

  /** @param {string} key */
  function dayMatchesGlobalSearch(key) {
    const q = normalizedSearchQ();
    if (!q) return true;
    const day = parseYmd(key);
    if (dayDateMatchesSearch(key, q)) return true;
    if (dayPageMatchesSearch(key, q)) return true;
    if (day && dayHasSearchableReminders(day, q)) return true;
    return false;
  }

  /** Day keys with matching notes, to-dos, or date text (side-panel search). */
  function globalSearchDayHits() {
    const q = normalizedSearchQ();
    if (!q) return [];
    /** @type {Set<string>} */
    const keys = new Set();
    for (const key of Object.keys(dayPages)) {
      if (dayPageMatchesSearch(key, q)) keys.add(key);
    }
    for (const ev of events) {
      const k = reminderDayKey(ev);
      if (k && dayDateMatchesSearch(k, q)) keys.add(k);
    }
    return [...keys].sort();
  }

  /** All day keys that match the current search (notes, to-dos, reminders, dates). */
  function globalSearchMatchDayKeys() {
    const q = normalizedSearchQ();
    if (!q) return [];
    /** @type {Set<string>} */
    const keys = new Set(globalSearchDayHits());
    for (const ev of libraryReminders()) {
      const k = reminderDayKey(ev);
      if (k) keys.add(k);
    }
    return [...keys].sort();
  }

  /** @param {string} key YYYY-MM-DD */
  function anchorShowsDay(key) {
    if (viewMode === "month") {
      return monthMatrix(anchor).some((d) => isoDateOnly(d) === key);
    }
    if (viewMode === "week") {
      return weekDayKeysForView(anchor).includes(key);
    }
    return false;
  }

  /** Jump month/week view to a day and select it on the grid. */
  function focusCalendarOnDay(key) {
    const d = parseYmd(key);
    if (!d) return;
    pickedDay = key;
    if (viewMode === "month") {
      anchor = new Date(d.getFullYear(), d.getMonth(), 1);
    } else if (viewMode === "week") {
      anchor = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
  }

  /** When searching, show the first matching day on the calendar grid. */
  function applySearchCalendarFocus() {
    const q = normalizedSearchQ();
    if (!q || viewMode === "trash") return;
    const hits = globalSearchMatchDayKeys();
    if (!hits.length) return;
    focusCalendarOnDay(hits[0]);
  }

  /**
   * Glowing reminder dots on the top-right of a day card.
   * @param {HTMLElement} headEl
   * @param {Date} day
   * @returns {RmeCalEvent[]}
   */
  function appendDayCardReminderDots(headEl, day, opts) {
    const maxDots = opts?.maxDots ?? 12;
    const dayReminders = sidebarRemindersForDay(day);
    if (!dayReminders.length) return dayReminders;
    const dayKey = isoDateOnly(day);
    const dotsWrap = document.createElement("div");
    dotsWrap.className = "rme-cal-cell-reminder-dots";
    dotsWrap.title =
      dayReminders.length === 1
        ? "1 reminder — drag to another day to reschedule"
        : `${dayReminders.length} reminders — drag a dot to reschedule`;
    dotsWrap.setAttribute("aria-hidden", "true");
    const shown = dayReminders.slice(0, maxDots);
    for (const ev of shown) {
      const mk = document.createElement("span");
      mk.className =
        "rme-cal-day-badge rme-cal-day-badge--reminder rme-cal-reminder-dot--draggable";
      mk.draggable = true;
      mk.style.setProperty("--rme-cal-pri", priorityHex(eventPriority(ev)));
      const title = String(ev.title || "Reminder").trim() || "Reminder";
      const wall = eventWallTimes(ev);
      const timeHint =
        wall.length > 1
          ? ` · ${wall.join(", ")}`
          : wall.length === 1
            ? ` · ${wall[0]}`
            : "";
      mk.title = `${title}${timeHint} — drag to another day`;
      mk.addEventListener("mousedown", (e) => {
        e.stopPropagation();
      });
      mk.addEventListener("dragstart", (e) => {
        e.stopPropagation();
        onReminderDragStart(e, ev.id, dayKey);
      });
      mk.addEventListener("dragend", onReminderDragEnd);
      dotsWrap.appendChild(mk);
    }
    if (dayReminders.length > maxDots) {
      const more = document.createElement("span");
      more.className = "rme-cal-day-badge rme-cal-day-badge--more";
      more.textContent = `+${dayReminders.length - maxDots}`;
      more.title = `${dayReminders.length - maxDots} more reminder(s)`;
      dotsWrap.appendChild(more);
    }
    headEl.appendChild(dotsWrap);
    return dayReminders;
  }

  /**
   * Labeled rows for day-sheet notes and each to-do on the calendar tile.
   * @param {HTMLElement} mainEl
   * @param {string} key
   * @param {number} previewMax
   */
  function appendDaySheetPreviewRows(mainEl, key, previewMax) {
    const p = dayPages[key];
    if (!p) return;
    const q = normalizedSearchQ();
    const notesRaw = String(p.notes || "")
      .replace(/\r\n/g, "\n")
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const todoItems = (p.todos || []).filter((t) => {
      const line = String(t?.text ?? "").trim();
      if (!line.length) return false;
      if (!q) return true;
      return textMatchesSearch(line, q);
    });
    const showNotes = notesRaw && (!q || textMatchesSearch(notesRaw, q));
    const titleRaw = dayPageTitle(key);
    const showTitle = titleRaw && (!q || textMatchesSearch(titleRaw, q));
    if (!showTitle && !showNotes && !todoItems.length) return;

    const wrap = document.createElement("div");
    wrap.className = "rme-cal-cell-day-sheet-rows";
    const bodyCap = Math.max(28, Math.floor(previewMax * 0.92));

    if (showTitle) {
      const row = document.createElement("div");
      row.className = "rme-cal-cell-day-sheet-row";
      const lb = document.createElement("span");
      lb.className = "rme-cal-cell-day-sheet-label rme-cal-cell-day-sheet-label--title";
      lb.textContent = "Title:";
      const body = document.createElement("span");
      body.className = "rme-cal-cell-day-sheet-body";
      body.textContent = truncatePlainPreview(titleRaw, bodyCap);
      row.appendChild(lb);
      row.appendChild(body);
      wrap.appendChild(row);
    }

    if (showNotes) {
      const row = document.createElement("div");
      row.className = "rme-cal-cell-day-sheet-row";
      const lb = document.createElement("span");
      lb.className = "rme-cal-cell-day-sheet-label rme-cal-cell-day-sheet-label--notes";
      lb.textContent = "Notes:";
      const body = document.createElement("span");
      body.className = "rme-cal-cell-day-sheet-body";
      body.textContent = truncatePlainPreview(notesRaw, bodyCap);
      row.appendChild(lb);
      row.appendChild(body);
      wrap.appendChild(row);
    }
    for (const todo of todoItems) {
      const line = String(todo.text || "").trim();
      const row = document.createElement("div");
      row.className = "rme-cal-cell-day-sheet-row";
      if (Boolean(todo.done)) row.classList.add("rme-cal-cell-day-sheet-row--done");
      const lb = document.createElement("span");
      lb.className = "rme-cal-cell-day-sheet-label rme-cal-cell-day-sheet-label--todo";
      lb.textContent = "To-do:";
      const body = document.createElement("span");
      body.className = "rme-cal-cell-day-sheet-body";
      body.textContent = truncatePlainPreview(line, bodyCap);
      row.appendChild(lb);
      row.appendChild(body);
      wrap.appendChild(row);
    }

    mainEl.appendChild(wrap);
  }

  /**
   * Note preview + N/T badges on month/week day cards.
   * @param {HTMLElement} host
   * @param {string} key YYYY-MM-DD
   * @param {{ previewMax?: number }} [opts]
   */
  function appendDayCardNotesUi(host, key, opts) {
    const compact = opts?.compact === true;
    const previewMax = opts?.previewMax ?? 96;
    const day = parseYmd(key);
    const reminders = day ? sidebarRemindersForDay(day) : [];
    const q = normalizedSearchQ();
    const hasSheet = q ? dayPageMatchesSearch(key, q) : daySheetHasContent(key);

    if (hasSheet || (!compact && reminders.length)) {
      const main = document.createElement("div");
      main.className = "rme-cal-cell-preview-main";
      const tip = compact ? dayCardPreviewTitle(key) : dayTileBodyTitle(key);
      if (tip) main.title = tip;

      if (hasSheet) {
        appendDaySheetPreviewRows(main, key, previewMax);
      }

      if (!compact && reminders.length) {
        const stack = document.createElement("div");
        stack.className = "rme-cal-cell-reminder-text-stack";
        const noteCap = Math.max(40, Math.floor(previewMax * 0.9));
        for (const ev of reminders) {
          const block = document.createElement("div");
          block.className = "rme-cal-cell-reminder-block";
          const title = String(ev.title || "").trim() || "Reminder";
          const noteLine = reminderNoteOneLine(ev);
          const fullNote = String(ev.notes || "").trim();

          const ttl = document.createElement("div");
          ttl.className = "rme-cal-cell-reminder-title";
          ttl.textContent = title;
          ttl.style.setProperty("--rme-rm-pri", priorityHex(eventPriority(ev)));
          block.appendChild(ttl);

          if (noteLine) {
            const sep = document.createElement("span");
            sep.className = "rme-cal-cell-reminder-sep";
            sep.setAttribute("aria-hidden", "true");
            sep.textContent = "\u2014";
            block.appendChild(sep);
            const ne = document.createElement("div");
            ne.className = "rme-cal-cell-reminder-note";
            ne.textContent = truncatePlainPreview(noteLine, noteCap);
            block.appendChild(ne);
          }

          const hhCard = anchorHhmmForDayCard(ev, key);
          const sz = document.createElement("button");
          sz.type = "button";
          sz.className = "rme-cal-cell-snooze-btn";
          sz.textContent = "\u23f0";
          sz.title = "Snooze (10 min · 1 hr · tomorrow)";
          sz.setAttribute("aria-label", "Snooze reminder");
          sz.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openSnoozePopover(sz, ev.id, key, hhCard);
          });
          block.appendChild(sz);

          block.title = fullNote ? `${title}\n${fullNote}` : title;
          stack.appendChild(block);
        }
        main.appendChild(stack);
      }

      host.appendChild(main);
    }

    const strip = document.createElement("div");
    strip.className = "rme-cal-cell-strip";
    strip.setAttribute("aria-hidden", "true");
    const showNotesBadge = q
      ? textMatchesSearch(dayPages[key]?.notes, q) ||
        textMatchesSearch(dayPages[key]?.title, q)
      : dayHasNotes(key) || dayHasTitle(key);
    const showTodosBadge = q
      ? (dayPages[key]?.todos || []).some((t) => textMatchesSearch(t.text, q))
      : dayHasTodos(key);
    if (showNotesBadge) {
      const b = document.createElement("span");
      b.className = "rme-cal-day-badge rme-cal-day-badge--notes";
      b.title = "Notes";
      b.textContent = "N";
      strip.appendChild(b);
    }
    if (showTodosBadge) {
      const b = document.createElement("span");
      b.className = "rme-cal-day-badge rme-cal-day-badge--todos";
      b.title = "To-dos";
      b.textContent = "T";
      strip.appendChild(b);
    }
    if (strip.childElementCount) host.appendChild(strip);
  }

  /** Debounced full calendar repaint while day notes / to-dos are edited (modal stays open). */
  let calFromSheetRenderHold = 0;
  function scheduleRenderFromDaySheet() {
    dayPagesRev += 1;
    window.clearTimeout(calFromSheetRenderHold);
    calFromSheetRenderHold = window.setTimeout(() => {
      calFromSheetRenderHold = 0;
      render();
    }, 420);
  }

  /**
   * Remove this day's page (title, notes, to-dos) and move its reminders to Trash.
   * @param {string} dayKey YYYY-MM-DD
   * @returns {boolean} whether anything was removed
   */
  function deleteDaySheetAll(dayKey) {
    const key = typeof dayKey === "string" ? dayKey.trim() : "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
    const day = parseYmd(key);
    if (!day) return false;

    const page = dayPages[key];
    const notesText = page ? String(page.notes ?? "") : "";
    const todosList =
      page && Array.isArray(page.todos) ? /** @type {RmeCalDayTodo[]} */ (page.todos) : [];
    const titleText = page ? String(page.title ?? "").trim() : "";
    const hasNotes = Boolean(notesText.trim());
    const hasTodos = todosList.some((t) => String(t?.text ?? "").trim());
    const hasPage = Boolean(page && (hasNotes || hasTodos || titleText));

    const dayReminders = remindersOnDay(day);
    if (!hasPage && !dayReminders.length) return false;

    if (hasNotes) {
      pushTrashEntry({
        kind: "clear-all-notes",
        summary: `Deleted day notes: ${dayDisplayLabel(key)}`,
        detail: key,
        payload: { notesByDay: { [key]: notesText } },
      });
    }
    if (hasTodos) {
      pushTrashEntry({
        kind: "clear-all-todos",
        summary: `Deleted day to-dos: ${dayDisplayLabel(key)}`,
        detail: key,
        payload: { todosByDay: { [key]: deepCloneJson(todosList) } },
      });
    }
    if (page) {
      delete dayPages[key];
      saveDayPages();
      dayPagesRev += 1;
    }

    if (dayReminders.length) {
      for (const ev of dayReminders) {
        pushTrashEntry({
          kind: "delete-reminder",
          summary: `Deleted reminder: ${ev.title}`,
          detail: ev.start ? String(ev.start).slice(0, 16) : "",
          payload: { reminder: deepCloneJson(ev) },
        });
      }
      const ids = new Set(dayReminders.map((e) => e.id));
      events = events.filter((x) => !ids.has(x.id));
      saveEvents();
    }

    return true;
  }

  /**
   * Day notes + to-do list (separate from reminders).
   * @param {string} dayKey YYYY-MM-DD
   */
  function openDaySheet(dayKey) {
    const key = typeof dayKey === "string" ? dayKey.trim() : "";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return;

    closeModalHost();

    pickedDay = key;
    const day = parseYmd(key);
    const page = dayPageFor(key);
    const pageSnapshot = {
      title: String(page.title ?? ""),
      notes: String(page.notes ?? ""),
      todos: JSON.parse(JSON.stringify(page.todos || [])),
    };

    const back = document.createElement("div");
    back.className = "rme-cal-modal-back rme-cal-modal-back--day";
    back.setAttribute("role", "presentation");
    const modal = document.createElement("div");
    modal.className = "rme-cal-modal rme-cal-modal--day";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute(
      "aria-label",
      "Day notes, reminders, to-dos, and add reminder",
    );

    const dayHead = document.createElement("div");
    dayHead.className = "rme-cal-day-sheet-head";
    const headRow = document.createElement("div");
    headRow.className = "rme-cal-day-sheet-head-row";
    const headLeft = document.createElement("div");
    headLeft.className = "rme-cal-day-sheet-head-left";
    const dayHeadEmoji = document.createElement("span");
    dayHeadEmoji.className = "rme-cal-day-sheet-emoji";
    dayHeadEmoji.textContent = "📓";
    dayHeadEmoji.setAttribute("aria-hidden", "true");
    const dayHeadText = document.createElement("div");
    dayHeadText.className = "rme-cal-day-sheet-head-text";
    const titleIn = document.createElement("textarea");
    titleIn.id = "rmeCalDayTitle";
    titleIn.className = "rme-cal-day-sheet-title";
    titleIn.rows = 1;
    titleIn.placeholder = "Title — e.g. Budget review";
    titleIn.value = String(page.title ?? "");
    titleIn.required = true;
    titleIn.setAttribute("aria-required", "true");
    titleIn.setAttribute("autocomplete", "off");
    titleIn.setAttribute("spellcheck", "true");
    titleIn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
      }
    });
    const dateSub = document.createElement("p");
    dateSub.className = "rme-cal-day-sheet-date";
    dateSub.textContent = dayDateHeading(key);
    dayHeadText.appendChild(titleIn);
    dayHeadText.appendChild(dateSub);
    headLeft.appendChild(dayHeadEmoji);
    headLeft.appendChild(dayHeadText);
    headRow.appendChild(headLeft);

    function closeSheetToPlanner() {
      window.clearTimeout(persistTimer);
      flushDayPageFromSheet();
      saveDayPages();
      close();
      render({ force: true });
    }

    const closeSheetBtn = document.createElement("button");
    closeSheetBtn.type = "button";
    closeSheetBtn.className = "rme-cal-day-sheet-close";
    closeSheetBtn.setAttribute("aria-label", "Close day sheet");
    closeSheetBtn.title = "Close";
    closeSheetBtn.textContent = "×";
    closeSheetBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeSheetToPlanner();
    });
    headRow.appendChild(closeSheetBtn);
    dayHead.appendChild(headRow);

    const fNotes = field("Notes", "textarea", "rmeCalDayNotes", page.notes);
    const notesTa = /** @type {HTMLTextAreaElement} */ (fNotes.input);
    notesTa.value = String(page.notes ?? "");

    const remindersSection = document.createElement("div");
    remindersSection.className = "rme-cal-day-reminders";
    const remindersTitle = document.createElement("h3");
    remindersTitle.className = "rme-cal-day-reminders-title";
    remindersTitle.textContent = "Reminders";
    const remindersListEl = document.createElement("div");
    remindersListEl.className = "rme-cal-day-reminder-list";
    remindersSection.appendChild(remindersTitle);
    remindersSection.appendChild(remindersListEl);

    const todosSection = document.createElement("div");
    todosSection.className = "rme-cal-day-todos";
    const todosTitle = document.createElement("h3");
    todosTitle.className = "rme-cal-day-todos-title";
    todosTitle.textContent = "To-do";
    const listEl = document.createElement("div");
    listEl.className = "rme-cal-day-todo-list";
    todosSection.appendChild(todosTitle);
    todosSection.appendChild(listEl);

    const addRow = document.createElement("div");
    addRow.className = "rme-cal-day-todo-add";
    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "rme-cal-btn rme-cal-btn--ghost";
    addBtn.textContent = "+ Add to-do";
    addRow.appendChild(addBtn);
    todosSection.appendChild(addRow);

    let persistTimer = 0;
    function persistSoon() {
      window.clearTimeout(persistTimer);
      persistTimer = window.setTimeout(() => {
        saveDayPages();
        scheduleRenderFromDaySheet();
      }, 320);
    }

    function flushDayPageFromSheet() {
      page.title = titleIn.value.trim();
      page.notes = notesTa.value;
    }

    function requireDaySheetTitle() {
      flushDayPageFromSheet();
      if (page.title.trim()) {
        titleIn.setCustomValidity("");
        return true;
      }
      titleIn.setCustomValidity("Enter a title for this day.");
      titleIn.reportValidity();
      titleIn.focus();
      return false;
    }

    function openReminderFromSheet(ev) {
      if (!requireDaySheetTitle()) return;
      window.clearTimeout(persistTimer);
      saveDayPages();
      close();
      openModal(ev);
      render();
    }

    function renderDaySheetReminders() {
      remindersListEl.replaceChildren();
      const dayReminders = day ? remindersOnDay(day) : [];
      if (!dayReminders.length) {
        const empty = document.createElement("p");
        empty.className = "rme-cal-hint rme-cal-day-reminders-empty";
        empty.textContent = "No reminders for this day.";
        remindersListEl.appendChild(empty);
        return;
      }
      for (const ev of dayReminders) {
        const row = document.createElement("button");
        row.type = "button";
        row.className = "rme-cal-day-reminder-row";
        const body = document.createElement("div");
        body.className = "rme-cal-day-reminder-body";
        body.style.borderLeftColor = priorityHex(eventPriority(ev));
        const t1 = document.createElement("div");
        t1.className = "rme-cal-day-reminder-title";
        t1.textContent = String(ev.title || "").trim() || "Reminder";
        body.appendChild(t1);
        const meta = reminderListMeta(ev);
        if (meta) {
          const t2 = document.createElement("div");
          t2.className = "rme-cal-day-reminder-meta";
          t2.textContent = meta;
          body.appendChild(t2);
        }
        const noteLine = reminderNoteOneLine(ev);
        if (noteLine) {
          const t3 = document.createElement("div");
          t3.className = "rme-cal-day-reminder-note";
          t3.textContent = noteLine;
          body.appendChild(t3);
        }
        row.appendChild(body);
        row.title = "Edit reminder";
        row.addEventListener("click", () => openReminderFromSheet(ev));
        remindersListEl.appendChild(row);
      }
    }

    function renderTodoList() {
      listEl.replaceChildren();
      const visibleTodos = page.todos || [];
      if (!visibleTodos.length) {
        const empty = document.createElement("p");
        empty.className = "rme-cal-hint rme-cal-day-todos-empty";
        empty.textContent = "No to-dos yet.";
        listEl.appendChild(empty);
        return;
      }
      visibleTodos.forEach((todo) => {
        const row = document.createElement("div");
        row.className = "rme-cal-day-todo-row";

        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "rme-cal-day-todo-check";
        cb.checked = Boolean(todo.done);
        cb.setAttribute("aria-label", "Done");
        cb.addEventListener("change", () => {
          todo.done = cb.checked;
          saveDayPages();
          scheduleRenderFromDaySheet();
        });

        const ti = document.createElement("input");
        ti.type = "text";
        ti.className = "rme-cal-day-todo-text";
        ti.placeholder = "Task...";
        ti.value = todo.text;
        ti.addEventListener("input", () => {
          todo.text = ti.value;
          persistSoon();
          scheduleRenderFromDaySheet();
        });

        const rm = document.createElement("button");
        rm.type = "button";
        rm.className = "rme-cal-btn rme-cal-btn--ghost rme-cal-day-todo-remove";
        rm.setAttribute("aria-label", "Remove to-do");
        rm.textContent = "×";
        rm.addEventListener("click", () => {
          flushDayPageFromSheet();
          moveTodoToTrash(key, todo, page.title);
          page.todos = page.todos.filter((t) => t.id !== todo.id);
          saveDayPages();
          renderTodoList();
          scheduleRenderFromDaySheet();
        });

        row.appendChild(cb);
        row.appendChild(ti);
        row.appendChild(rm);
        listEl.appendChild(row);
      });
    }

    addBtn.addEventListener("click", () => {
      page.todos.push({ id: newTodoId(), text: "", done: false });
      saveDayPages();
      renderTodoList();
      scheduleRenderFromDaySheet();
      const last = listEl.querySelector(".rme-cal-day-todo-text:last-of-type");
      if (last instanceof HTMLInputElement) {
        last.focus();
      }
    });

    titleIn.addEventListener("input", () => {
      flushDayPageFromSheet();
      if (page.title.trim()) {
        titleIn.setCustomValidity("");
      }
      persistSoon();
    });
    titleIn.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
    });
    titleIn.addEventListener("mousedown", (e) => {
      e.stopPropagation();
    });

    notesTa.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
    });
    notesTa.addEventListener("mousedown", (e) => {
      e.stopPropagation();
    });
    notesTa.addEventListener("input", () => {
      flushDayPageFromSheet();
      persistSoon();
    });

    renderDaySheetReminders();
    renderTodoList();

    const actions = document.createElement("div");
    actions.className = "rme-cal-modal-actions";
    const discardSheet = document.createElement("button");
    discardSheet.type = "button";
    discardSheet.className = "rme-cal-btn rme-cal-btn--ghost";
    discardSheet.textContent = "Delete";
    discardSheet.title =
      "Delete this day's title, notes, to-dos, and reminders";
    const addReminder = document.createElement("button");
    addReminder.type = "button";
    addReminder.className = "rme-cal-btn";
    addReminder.textContent = "Add reminder";
    const dayIsPast = isYmdBeforeToday(key);
    if (dayIsPast) {
      addReminder.disabled = true;
      addReminder.title = "Reminders can only be added for today or a future date.";
    } else {
      addReminder.title = "Save notes and open a new reminder for this date";
      addReminder.addEventListener("click", () => {
        if (!requireDaySheetTitle()) return;
        window.clearTimeout(persistTimer);
        saveDayPages();
        close();
        pickedDay = key;
        openModal(null);
        render();
      });
    }
    const done = document.createElement("button");
    done.type = "button";
    done.className = "rme-cal-btn rme-cal-btn--primary";
    done.textContent = "Done";
    done.addEventListener("click", () => dismissDaySheet());

    discardSheet.addEventListener("click", () => {
      flushDayPageFromSheet();
      const reminderCount = day ? remindersOnDay(day).length : 0;
      const hasContent = Boolean(
        page.title.trim() ||
          page.notes.trim() ||
          (page.todos || []).some((t) => String(t.text || "").trim()) ||
          reminderCount > 0,
      );
      if (!hasContent) {
        window.clearTimeout(persistTimer);
        close();
        render({ force: true });
        return;
      }
      const label = dayDateHeading(key);
      const msg =
        reminderCount > 0
          ? `Delete everything for ${label}? Notes and to-dos will be removed. ${reminderCount} reminder(s) will move to Trash.`
          : `Delete everything for ${label}? Notes and to-dos will be removed.`;
      if (!window.confirm(msg)) return;
      window.clearTimeout(persistTimer);
      deleteDaySheetAll(key);
      close();
      render({ force: true });
    });

    actions.appendChild(discardSheet);
    actions.appendChild(addReminder);
    actions.appendChild(done);

    modal.appendChild(dayHead);
    modal.appendChild(fNotes.wrap);
    modal.appendChild(remindersSection);
    modal.appendChild(todosSection);
    modal.appendChild(actions);
    back.appendChild(modal);
    mountPlannerModalDialog(back);
    modalHost = back;

    modal.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
    });
    modal.addEventListener("mousedown", (e) => {
      e.stopPropagation();
    });

    function dismissDaySheet() {
      if (!requireDaySheetTitle()) return;
      window.clearTimeout(persistTimer);
      flushDayPageFromSheet();
      const clearedNotes =
        String(pageSnapshot.notes ?? "").trim().length > 0 &&
        !String(page.notes ?? "").trim().length;
      if (clearedNotes) {
        moveDayNoteToTrash(key, pageSnapshot.notes, pageSnapshot.title || page.title);
      }
      saveDayPages();
      close();
      render({ force: true });
    }

    function onDaySheetKey(ev) {
      if (ev.key === "Escape") {
        ev.preventDefault();
        closeSheetToPlanner();
      }
    }
    document.addEventListener("keydown", onDaySheetKey);

    back.addEventListener("click", (e) => {
      if (e.target === back) closeSheetToPlanner();
    });

    function close() {
      document.removeEventListener("keydown", onDaySheetKey);
      window.clearTimeout(persistTimer);
      closeModalHost();
    }

    if (!String(page.title ?? "").trim()) {
      window.requestAnimationFrame(() => {
        try {
          titleIn.focus({ preventScroll: true });
        } catch {
          /* ignore */
        }
      });
    }
  }

  function monthMatrix(view) {
    const y = view.getFullYear();
    const m = view.getMonth();
    const first = new Date(y, m, 1);
    const startDow = first.getDay();
    const offset = settings.weekStartsOn === 1 ? (startDow + 6) % 7 : startDow;
    const gridStart = new Date(y, m, 1 - offset);
    /** @type {Date[]} */
    const cells = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      cells.push(d);
    }
    return cells;
  }

  function weekRangeContaining(d) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dow = x.getDay();
    const delta =
      settings.weekStartsOn === 1 ? (dow + 6) % 7 : dow;
    const start = new Date(x);
    start.setDate(x.getDate() - delta);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
  }

  function eventSpansDay(ev, day) {
    const key = isoDateOnly(day);
    const s0 = parseYmd(ev.start.slice(0, 10));
    if (!s0) return false;
    const sK = isoDateOnly(s0);
    const eRaw = ev.end && ev.end.length >= 10 ? ev.end : ev.start;
    const e0 = parseYmd(eRaw.slice(0, 10)) || s0;
    const eK = isoDateOnly(e0);
    if (ev.reminderRepeat === "daily" || ev.reminderRepeat === "weekly") {
      if (key < sK || key > eK) return false;
      if (ev.reminderRepeat === "daily") return true;
      const wd = Array.isArray(ev.repeatWeekdays) ? ev.repeatWeekdays : [];
      return wd.length > 0 && wd.includes(day.getDay());
    }
    return sK <= key && key <= eK;
  }

  const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  /** @param {number[] | undefined} days */
  function formatWeekdaysShort(days) {
    if (!Array.isArray(days) || !days.length) return "";
    return [...new Set(days)]
      .filter((d) => d >= 0 && d <= 6)
      .sort((a, b) => a - b)
      .map((d) => WEEKDAY_SHORT[d])
      .join(", ");
  }

  /** @param {string[]} dayKeys YYYY-MM-DD */
  function warmViewRemindersCache(dayKeys) {
    const viewKey = `${eventsRev}|${viewMode}|${isoDateOnly(anchor)}|${dayKeys.join(",")}`;
    if (viewRemindersCache && viewRemindersCache.key === viewKey) {
      return viewRemindersCache.byDay;
    }
    /** @type {Map<string, RmeCalEvent[]>} */
    const byDay = new Map();
    for (const k of dayKeys) {
      byDay.set(k, []);
    }
    const titled = events.filter((ev) => String(ev?.title ?? "").trim().length > 0);
    /** @type {{ k: string; d: Date; dow: number }[]} */
    const dayEntries = [];
    for (const k of dayKeys) {
      const d = parseYmd(k);
      if (d) {
        dayEntries.push({ k, d, dow: d.getDay() });
      }
    }
    for (const ev of titled) {
      const isRepeat =
        ev.reminderRepeat === "daily" || ev.reminderRepeat === "weekly";
      if (isRepeat) {
        const sK = String(ev.start || "").slice(0, 10);
        const eRaw = ev.end && ev.end.length >= 10 ? ev.end : ev.start;
        const eK = String(eRaw || ev.start || "").slice(0, 10);
        const wd =
          ev.reminderRepeat === "weekly" && Array.isArray(ev.repeatWeekdays)
            ? ev.repeatWeekdays
            : null;
        for (const entry of dayEntries) {
          if (entry.k < sK || entry.k > eK) continue;
          if (ev.reminderRepeat === "daily") {
            byDay.get(entry.k).push(ev);
          } else if (wd && wd.includes(entry.dow)) {
            byDay.get(entry.k).push(ev);
          }
        }
      } else {
        const sK = String(ev.start || "").slice(0, 10);
        const eRaw = ev.end && ev.end.length >= 10 ? ev.end : ev.start;
        const eK = String(eRaw || ev.start || "").slice(0, 10);
        if (!sK) continue;
        for (const entry of dayEntries) {
          if (entry.k >= sK && entry.k <= eK) {
            byDay.get(entry.k).push(ev);
          }
        }
      }
    }
    viewRemindersCache = { key: viewKey, byDay };
    return byDay;
  }

  /** @param {Date} day */
  function weekDayKeysForView(day) {
    const { start } = weekRangeContaining(day);
    /** @type {string[]} */
    const keys = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      keys.push(isoDateOnly(d));
    }
    return keys;
  }

  function eventsForDay(day) {
    const k = isoDateOnly(day);
    const q = searchQ.trim().toLowerCase();
    const cached = viewRemindersCache?.byDay?.get(k);
    const base =
      cached ??
      events.filter((ev) => eventSpansDay(ev, day));
    if (!q) {
      return base;
    }
    return base.filter((ev) => {
      const hay = `${ev.title}\n${ev.notes || ""}`.toLowerCase();
      if (hay.includes(q)) return true;
      return dayDateMatchesSearch(k, q);
    });
  }

  /**
   * Reminders on a calendar day (ignores library search).
   * @param {Date} day
   * @returns {RmeCalEvent[]}
   */
  function remindersOnDay(day) {
    const k = isoDateOnly(day);
    const cached = viewRemindersCache?.byDay?.get(k);
    if (cached) {
      return cached;
    }
    return events.filter(
      (ev) =>
        eventSpansDay(ev, day) &&
        String(ev?.title ?? "").trim().length > 0,
    );
  }

  /**
   * Reminders for a given day (month dots, search). Whitespace-only titles excluded.
   * @param {Date} day
   * @returns {RmeCalEvent[]}
   */
  function sidebarRemindersForDay(day) {
    return eventsForDay(day).filter(
      (ev) => String(ev?.title ?? "").trim().length > 0,
    );
  }

  /** All titled reminders, search-filtered, sorted by start (side-panel library). */
  function libraryReminders() {
    const q = searchQ.trim().toLowerCase();
    const cacheKey = `${eventsRev}|${q}`;
    if (libraryRemindersCache && libraryRemindersCacheKey === cacheKey) {
      return libraryRemindersCache;
    }
    const result = events
      .filter((ev) => String(ev?.title ?? "").trim().length > 0)
      .filter((ev) => {
        if (!q) return true;
        const hay = `${ev.title}\n${ev.notes || ""}`.toLowerCase();
        if (hay.includes(q)) return true;
        const k = reminderDayKey(ev);
        return Boolean(k && dayDateMatchesSearch(k, q));
      })
      .sort((a, b) => {
        const ap = a.pinned ? 0 : 1;
        const bp = b.pinned ? 0 : 1;
        if (ap !== bp) return ap - bp;
        return String(a.start).localeCompare(String(b.start));
      });
    libraryRemindersCache = result;
    libraryRemindersCacheKey = cacheKey;
    return result;
  }

  /** @param {RmeCalEvent} ev */
  function reminderDayKey(ev) {
    return String(ev?.start || "").slice(0, 10);
  }

  const RME_CAL_REMINDER_DRAG = "application/x-rme-cal-reminder";
  /** Suppress day-cell click after a successful drag-drop reschedule. */
  let calDragDidMove = false;

  /** @param {string} ymd @param {number} deltaDays */
  function shiftYmdByDays(ymd, deltaDays) {
    const d = parseYmd(ymd);
    if (!d || !Number.isFinite(deltaDays)) return ymd;
    d.setDate(d.getDate() + deltaDays);
    return isoDateOnly(d);
  }

  /** @param {string} fromYmd @param {string} toYmd */
  function dayDelta(fromYmd, toYmd) {
    const a = parseYmd(fromYmd);
    const b = parseYmd(toYmd);
    if (!a || !b) return 0;
    return Math.round((b.getTime() - a.getTime()) / 86400000);
  }

  /** @param {string} iso @param {string} newDay YYYY-MM-DD */
  function withNewDatePart(iso, newDay) {
    const s = String(iso || "");
    if (s.includes("T")) return `${newDay}T${s.slice(11)}`;
    return newDay;
  }

  /**
   * Move a reminder from one calendar day to another (drag-drop).
   * Repeating reminders shift their whole date range by the day delta.
   * @param {string} evId
   * @param {string} fromDayKey YYYY-MM-DD
   * @param {string} toDayKey YYYY-MM-DD
   * @returns {boolean}
   */
  function rescheduleReminderToDay(evId, fromDayKey, toDayKey) {
    if (!evId || !fromDayKey || !toDayKey || fromDayKey === toDayKey) return false;
    if (isYmdBeforeToday(toDayKey)) return false;
    const ev = events.find((x) => x.id === evId);
    if (!ev || !String(ev.title || "").trim()) return false;
    const fromDay = parseYmd(fromDayKey);
    if (!fromDay || !eventSpansDay(ev, fromDay)) return false;

    if (ev.reminderRepeat === "daily" || ev.reminderRepeat === "weekly") {
      const delta = dayDelta(fromDayKey, toDayKey);
      if (!delta) return false;
      const startDay = String(ev.start || "").slice(0, 10);
      const endDay = String(ev.end || ev.start || "").slice(0, 10);
      if (!startDay) return false;
      ev.start = withNewDatePart(ev.start, shiftYmdByDays(startDay, delta));
      ev.end = withNewDatePart(ev.end || ev.start, shiftYmdByDays(endDay || startDay, delta));
    } else {
      ev.start = withNewDatePart(ev.start, toDayKey);
      ev.end = withNewDatePart(ev.end || ev.start, toDayKey);
    }
    return true;
  }

  function clearCalReminderDropTargets() {
    document
      .querySelectorAll(
        "#notionWsPaneCalendar .rme-cal-cell--drop-target, #notionWsPaneCalendar .rme-cal-week-col--drop-target",
      )
      .forEach((el) => {
        el.classList.remove("rme-cal-cell--drop-target", "rme-cal-week-col--drop-target");
      });
  }

  /**
   * @param {DragEvent} ev
   * @param {string} eventId
   * @param {string} fromDayKey
   */
  function onReminderDragStart(ev, eventId, fromDayKey) {
    calDragDidMove = false;
    if (!ev.dataTransfer) return;
    ev.dataTransfer.setData(
      RME_CAL_REMINDER_DRAG,
      JSON.stringify({ id: eventId, from: fromDayKey }),
    );
    ev.dataTransfer.effectAllowed = "move";
    if (ev.target instanceof HTMLElement) {
      ev.target.classList.add("rme-cal-reminder-dragging");
    }
  }

  function onReminderDragEnd(ev) {
    if (ev.target instanceof HTMLElement) {
      ev.target.classList.remove("rme-cal-reminder-dragging");
    }
    clearCalReminderDropTargets();
  }

  /**
   * @param {HTMLElement} el month cell or week column
   * @param {string} dayKey YYYY-MM-DD
   */
  function bindCalDayDropZone(el, dayKey) {
    el.dataset.rmeCalDay = dayKey;
    el.addEventListener("dragover", (ev) => {
      if (!ev.dataTransfer?.types.includes(RME_CAL_REMINDER_DRAG)) return;
      if (isYmdBeforeToday(dayKey)) {
        ev.dataTransfer.dropEffect = "none";
        return;
      }
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
      clearCalReminderDropTargets();
      if (el.classList.contains("rme-cal-cell")) {
        el.classList.add("rme-cal-cell--drop-target");
      } else {
        el.classList.add("rme-cal-week-col--drop-target");
      }
    });
    el.addEventListener("dragleave", (ev) => {
      const rel = ev.relatedTarget;
      if (rel instanceof Node && el.contains(rel)) return;
      el.classList.remove("rme-cal-cell--drop-target", "rme-cal-week-col--drop-target");
    });
    el.addEventListener("drop", (ev) => {
      if (!ev.dataTransfer?.types.includes(RME_CAL_REMINDER_DRAG)) return;
      ev.preventDefault();
      ev.stopPropagation();
      clearCalReminderDropTargets();
      let payload;
      try {
        payload = JSON.parse(ev.dataTransfer.getData(RME_CAL_REMINDER_DRAG));
      } catch {
        return;
      }
      const id = payload && typeof payload.id === "string" ? payload.id : "";
      const from =
        payload && typeof payload.from === "string" ? payload.from : "";
      if (!rescheduleReminderToDay(id, from, dayKey)) return;
      calDragDidMove = true;
      pickedDay = dayKey;
      saveEvents();
      render();
    });
  }

  function timePart(iso) {
    const m = /T(\d{2}:\d{2})/.exec(String(iso || ""));
    return m ? m[1] : "09:00";
  }

  /** @param {string} raw */
  function normalizeHHMM(raw) {
    const s = String(raw || "").trim();
    const m = /^(\d{1,2}):(\d{2})/.exec(s);
    if (!m) return "";
    const h = Math.min(23, Math.max(0, parseInt(m[1], 10)));
    const mi = Math.min(59, Math.max(0, parseInt(m[2], 10)));
    return `${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
  }

  /**
   * Legacy wall-clock times from start / end / extraTimes (before reminderTimes).
   * @param {RmeCalEvent} ev
   */
  function legacyEventWallTimesFromFields(ev) {
    if (!ev) return [];
    if (ev.allDay) {
      const times = new Set();
      const ex = Array.isArray(ev.extraTimes) ? ev.extraTimes : [];
      for (const t of ex) {
        const n = normalizeHHMM(t);
        if (n) times.add(n);
      }
      if (!times.size && String(ev.start || "").includes("T")) {
        const a = normalizeHHMM(timePart(ev.start));
        if (a) times.add(a);
      }
      if (!times.size) times.add("09:00");
      return [...times].sort();
    }
    const times = new Set();
    if (String(ev.start || "").includes("T")) {
      const a = normalizeHHMM(timePart(ev.start));
      if (a) times.add(a);
    }
    if (!ev.reminderRepeat && String(ev.end || "").includes("T")) {
      const d0 = String(ev.start || "").slice(0, 10);
      const d1 = String(ev.end || "").slice(0, 10);
      if (d0 && d0 === d1) {
        const b = normalizeHHMM(timePart(ev.end));
        if (b) times.add(b);
      }
    }
    const ex = Array.isArray(ev.extraTimes) ? ev.extraTimes : [];
    for (const t of ex) {
      const n = normalizeHHMM(t);
      if (n) times.add(n);
    }
    return [...times].sort();
  }

  /**
   * @param {RmeCalEvent} ev
   * @returns {RmeCalEvent}
   */
  function migrateRepeatReminderShape(ev) {
    const endK = String(ev.end || ev.start || "").slice(0, 10);
    if (
      !ev.reminderRepeat &&
      endK >= "2090-01-01" &&
      String(ev.start || "").includes("T")
    ) {
      ev.reminderRepeat = "daily";
    }
    if (ev.reminderRepeat === "daily" || ev.reminderRepeat === "weekly") {
      let wall = Array.isArray(ev.reminderTimes)
        ? ev.reminderTimes.map((t) => normalizeHHMM(String(t))).filter(Boolean)
        : [];
      if (!wall.length) {
        wall = legacyEventWallTimesFromFields(ev);
      }
      wall = [...new Set(wall)].sort();
      if (wall.length) {
        ev.reminderTimes = wall;
        const dayK = String(ev.start || "").slice(0, 10) || plannerTodayYmd();
        ev.start = `${dayK}T${wall[0]}:00`;
      }
      if (ev.end && String(ev.end).includes("T")) {
        ev.end = String(ev.end).slice(0, 10);
      }
      if (!ev.end) {
        ev.end = RME_CAL_REPEAT_OPEN_END;
      }
      delete ev.extraTimes;
    }
    return ev;
  }

  /**
   * All wall-clock times (HH:MM) for this reminder, sorted, deduped.
   * Repeating reminders use reminderTimes — every listed time fires on each matching day.
   * @param {RmeCalEvent} ev
   */
  function eventWallTimes(ev) {
    if (!ev) return [];
    if (ev.reminderRepeat === "daily" || ev.reminderRepeat === "weekly") {
      const rt = Array.isArray(ev.reminderTimes) ? ev.reminderTimes : [];
      const cleaned = rt.map((t) => normalizeHHMM(String(t))).filter(Boolean);
      if (cleaned.length) {
        return [...new Set(cleaned)].sort();
      }
    }
    return legacyEventWallTimesFromFields(ev);
  }

  function loadDeferrals() {
    void reloadDeferralsFromStore();
  }

  async function reloadDeferralsFromStore() {
    const raw = await readPlannerStorage(STORAGE_DEFERRALS);
    if (raw === deferralsStorageSnapshot) {
      return;
    }
    deferralsStorageSnapshot = raw;
    try {
      if (!raw) {
        reminderDeferrals = {};
        return;
      }
      const o = JSON.parse(raw);
      if (!o || typeof o !== "object" || Array.isArray(o)) {
        reminderDeferrals = {};
        return;
      }
      /** @type {Record<string, string>} */
      const next = {};
      for (const [k, v] of Object.entries(o)) {
        if (typeof k !== "string" || typeof v !== "string") continue;
        if (!/^[a-zA-Z0-9_-]+\|\d{4}-\d{2}-\d{2}\|\d{2}:\d{2}$/.test(k)) continue;
        next[k] = v;
      }
      reminderDeferrals = next;
    } catch {
      reminderDeferrals = {};
    }
  }

  function saveDeferrals() {
    try {
      const json = JSON.stringify(reminderDeferrals);
      writePlannerStorage(STORAGE_DEFERRALS, json);
      deferralsStorageSnapshot = json;
    } catch (e) {
      console.warn("calendar deferrals save:", e);
    }
  }

  /** @param {number} nowMs */
  function pruneDeferrals(nowMs) {
    const cutoff = nowMs - 36 * 3600000;
    let changed = false;
    for (const [k, iso] of Object.entries(reminderDeferrals)) {
      const t = new Date(iso).getTime();
      if (!Number.isFinite(t) || t < cutoff) {
        delete reminderDeferrals[k];
        changed = true;
      }
    }
    if (changed) saveDeferrals();
  }

  /** @param {string} dayKey @param {string} hhmm */
  function occurrenceInstantMs(dayKey, hhmm) {
    const d = parseYmd(dayKey);
    const hm = normalizeHHMM(String(hhmm || ""));
    if (!d || !hm) return NaN;
    const p = /^(\d{2}):(\d{2})$/.exec(hm);
    if (!p) return NaN;
    const h = Number(p[1]);
    const mi = Number(p[2]);
    d.setHours(h, mi, 0, 0);
    return d.getTime();
  }

  /** @param {string} evId @param {string} dayKey @param {string} hhmm */
  function occurrenceKey(evId, dayKey, hhmm) {
    const hm = normalizeHHMM(String(hhmm || "")) || "09:00";
    return `${evId}|${dayKey}|${hm}`;
  }

  /** @param {string} occKey */
  function parseOccurrenceKey(occKey) {
    const s = String(occKey || "").trim();
    const m = /^(.+)\|(\d{4}-\d{2}-\d{2})\|(\d{2}:\d{2})$/.exec(s);
    if (!m) return null;
    return { evId: m[1], dayKey: m[2], hhmm: m[3] };
  }

  /** @param {string} occKey */
  function clearRungForOccurrence(occKey) {
    const prefix = `${occKey}|`;
    for (const x of [...reminderRung]) {
      if (x.startsWith(prefix)) reminderRung.delete(x);
    }
  }

  /** @param {RmeCalEvent} ev @param {string} dayKey */
  function anchorHhmmForDayCard(ev, dayKey) {
    const times = eventWallTimes(ev);
    if (!times.length) return "09:00";
    const now = Date.now();
    let best = times[0];
    let bestDelta = Infinity;
    for (const t of times) {
      const ms = occurrenceInstantMs(dayKey, t);
      if (!Number.isFinite(ms)) continue;
      const delta = ms - now;
      if (delta >= -4 * 3600000 && delta < 24 * 3600000 && delta < bestDelta) {
        bestDelta = delta;
        best = t;
      }
    }
    return normalizeHHMM(best) || times[0];
  }

  /** @param {RmeCalEvent} ev */
  function libraryAnchorDayAndHhmm(ev) {
    const todayK = isoDateOnly(new Date());
    const todayD = new Date();
    const dayKey = eventSpansDay(ev, todayD) ? todayK : String(ev.start || "").slice(0, 10) || todayK;
    const hhmm = anchorHhmmForDayCard(ev, dayKey);
    return { dayKey, hhmm };
  }

  /** @param {string} dayKey @param {string} hhmm */
  function nextWakeTomorrowSameHm(dayKey, hhmm) {
    const hm = normalizeHHMM(hhmm) || "09:00";
    let dk = shiftYmdByDays(dayKey, 1);
    let ms = occurrenceInstantMs(dk, hm);
    const now = Date.now();
    let guard = 0;
    while ((!Number.isFinite(ms) || ms <= now) && guard++ < 400) {
      dk = shiftYmdByDays(dk, 1);
      ms = occurrenceInstantMs(dk, hm);
    }
    return ms;
  }

  /**
   * @param {"10m" | "1h" | "tomorrow"} preset
   * @param {string} dayKey
   * @param {string} hhmm
   */
  function snoozeWakeMsForPreset(preset, dayKey, hhmm) {
    const now = Date.now();
    if (preset === "10m") return now + 10 * 60 * 1000;
    if (preset === "1h") return now + 60 * 60 * 1000;
    return nextWakeTomorrowSameHm(dayKey, hhmm);
  }

  /**
   * @param {string} evId
   * @param {string} dayKey
   * @param {string} hhmm
   * @param {"10m" | "1h" | "tomorrow"} preset
   */
  function applyReminderSnooze(evId, dayKey, hhmm, preset) {
    const occKey = occurrenceKey(evId, dayKey, normalizeHHMM(hhmm) || "09:00");
    const until = snoozeWakeMsForPreset(preset, dayKey, normalizeHHMM(hhmm) || "09:00");
    reminderDeferrals[occKey] = new Date(until).toISOString();
    clearRungForOccurrence(occKey);
    saveDeferrals();
    closeSnoozePopover();
    if (rmeCalToastEl) {
      rmeCalToastEl.remove();
      rmeCalToastEl = null;
    }
    render();
  }

  function closeSnoozePopover() {
    if (rmeCalSnoozePopoverEl) {
      rmeCalSnoozePopoverEl.remove();
      rmeCalSnoozePopoverEl = null;
    }
    document.removeEventListener("click", onSnoozePopoverOutside, true);
  }

  function onSnoozePopoverOutside(ev) {
    if (!rmeCalSnoozePopoverEl) return;
    if (ev.target instanceof Node && rmeCalSnoozePopoverEl.contains(ev.target)) return;
    closeSnoozePopover();
  }

  /**
   * @param {HTMLElement} anchor
   * @param {string} evId
   * @param {string} dayKey
   * @param {string} hhmm
   */
  function openSnoozePopover(anchor, evId, dayKey, hhmm) {
    closeSnoozePopover();
    const hm = normalizeHHMM(hhmm) || "09:00";
    const pop = document.createElement("div");
    pop.className = "rme-cal-snooze-popover";
    pop.setAttribute("role", "menu");
    const mkBtn = (label, preset) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "rme-cal-snooze-popover-btn";
      b.textContent = label;
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        applyReminderSnooze(evId, dayKey, hm, preset);
      });
      return b;
    };
    pop.appendChild(mkBtn("10 min", "10m"));
    pop.appendChild(mkBtn("1 hour", "1h"));
    pop.appendChild(mkBtn("Tomorrow", "tomorrow"));
    document.body.appendChild(pop);
    rmeCalSnoozePopoverEl = pop;
    const r = anchor.getBoundingClientRect();
    pop.style.position = "fixed";
    pop.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - pop.offsetWidth - 8))}px`;
    pop.style.top = `${Math.min(r.bottom + 6, window.innerHeight - 8)}px`;
    window.requestAnimationFrame(() => {
      const r2 = anchor.getBoundingClientRect();
      const pw = pop.offsetWidth || 160;
      pop.style.left = `${Math.max(8, Math.min(r2.left, window.innerWidth - pw - 8))}px`;
      pop.style.top = `${Math.min(r2.bottom + 6, window.innerHeight - pop.offsetHeight - 8)}px`;
    });
    window.setTimeout(() => {
      document.addEventListener("click", onSnoozePopoverOutside, true);
    }, 0);
  }

  /** @param {RmeCalEvent} ev @param {string} dayKey @param {string} hhmm @param {string} occKey @param {number} wakeMs */
  function showReminderAlarmToast(ev, dayKey, hhmm, occKey, wakeMs) {
    lastAlarmCtx = { evId: ev.id, dayKey, hhmm: normalizeHHMM(hhmm) || "09:00", occKey };
    if (rmeCalToastEl) rmeCalToastEl.remove();
    const pi = eventPriority(ev);
    const priLvl = PRIORITY_LEVELS[pi] ?? PRIORITY_LEVELS[1];
    const wrap = document.createElement("div");
    wrap.className = "rme-cal-alarm-toast";
    const inner = document.createElement("div");
    inner.className = `rme-cal-alarm-toast-inner rme-cal-alarm-toast-inner--${priLvl.key}`;
    inner.style.setProperty("--rme-cal-pri", priLvl.hex);
    inner.style.setProperty("--rme-cal-pri-soft", priLvl.soft);
    const t1 = document.createElement("div");
    t1.className = "rme-cal-alarm-toast-title";
    t1.textContent = String(ev.title || "Reminder").trim() || "Reminder";
    const t2 = document.createElement("div");
    t2.className = "rme-cal-alarm-toast-meta";
    t2.textContent = `${dayKey} · ${normalizeHHMM(hhmm) || "09:00"}`;
    const row = document.createElement("div");
    row.className = "rme-cal-alarm-toast-actions";
    const mk = (label, preset) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "rme-cal-btn rme-cal-alarm-snooze-btn";
      b.textContent = label;
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        applyReminderSnooze(ev.id, dayKey, hhmm, preset);
      });
      return b;
    };
    row.appendChild(mk("10 min", "10m"));
    row.appendChild(mk("1 hour", "1h"));
    row.appendChild(mk("Tomorrow", "tomorrow"));
    const dismiss = document.createElement("button");
    dismiss.type = "button";
    dismiss.className = "rme-cal-btn rme-cal-btn--ghost rme-cal-alarm-dismiss";
    dismiss.textContent = "Dismiss";
    dismiss.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (rmeCalToastEl) {
        rmeCalToastEl.remove();
        rmeCalToastEl = null;
      }
    });
    row.appendChild(dismiss);
    inner.appendChild(t1);
    inner.appendChild(t2);
    inner.appendChild(row);
    wrap.appendChild(inner);
    document.body.appendChild(wrap);
    rmeCalToastEl = wrap;
  }

  /** @param {RmeCalEvent} ev @param {string} dayKey @param {string} hhmm @param {string} occKey */
  function flashReminderAttention() {
    const calApi = /** @type {{ flashAttention?: () => Promise<unknown> } | undefined} */ (
      window.calendarNotificationApi
    );
    if (calApi && typeof calApi.flashAttention === "function") {
      void calApi.flashAttention().catch(() => {});
    }
  }

  /** @param {RmeCalEvent} ev @param {string} dayKey @param {string} hhmm @param {string} occKey */
  function postOsNotification(ev, dayKey, hhmm, occKey) {
    const title = String(ev.title || "Reminder").trim() || "Reminder";
    const hm = normalizeHHMM(hhmm) || "09:00";
    const note = reminderNoteOneLine(ev);
    const body = note ? `${dayKey} · ${hm}\n${note}` : `${dayKey} · ${hm}`;
    const soundId = normalizeReminderSoundId(settings.reminderSound);
    const osSound = reminderSoundUsesOsDefault(soundId);

    const calApi = /** @type {{ showReminder?: (p: unknown) => void } | undefined} */ (
      window.calendarNotificationApi
    );
    if (calApi && typeof calApi.showReminder === "function") {
      try {
        calApi.showReminder({
          title,
          body,
          tag: occKey,
          silent: !osSound,
        });
      } catch {
        postWebNotification(title, body, occKey, ev, dayKey, hhmm, !osSound);
      }
      return;
    }
    postWebNotification(title, body, occKey, ev, dayKey, hhmm, !osSound);
  }

  /**
   * @param {string} title
   * @param {string} body
   * @param {string} occKey
   * @param {RmeCalEvent} ev
   * @param {string} dayKey
   * @param {string} hhmm
   */
  function postWebNotification(title, body, occKey, ev, dayKey, hhmm, silent) {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    try {
      const n = new Notification(title, { body, tag: occKey, silent: Boolean(silent) });
      n.onclick = () => {
        try {
          window.focus();
        } catch {
          /* ignore */
        }
        if (lastAlarmCtx && lastAlarmCtx.occKey === occKey) {
          showReminderAlarmToast(ev, dayKey, hhmm, occKey, Date.now());
        }
      };
    } catch (e) {
      console.warn("calendar notification:", e);
    }
  }

  function collectWakeCandidatesForToday() {
    const todayD = new Date();
    const todayK = isoDateOnly(todayD);
    /** @type {{ ev: RmeCalEvent; dayKey: string; hhmm: string; occKey: string; wakeMs: number }[]} */
    const out = [];
    for (const ev of events) {
      if (!String(ev?.title ?? "").trim()) continue;
      if (!eventSpansDay(ev, todayD)) continue;
      const times = eventWallTimes(ev);
      if (!times.length) continue;
      for (const hhmm of times) {
        const hm = normalizeHHMM(hhmm);
        if (!hm) continue;
        const baseMs = occurrenceInstantMs(todayK, hm);
        if (!Number.isFinite(baseMs)) continue;
        const occKey = occurrenceKey(ev.id, todayK, hm);
        const def = reminderDeferrals[occKey];
        const wakeMs = def ? Math.max(baseMs, new Date(def).getTime()) : baseMs;
        out.push({ ev, dayKey: todayK, hhmm: hm, occKey, wakeMs });
      }
    }
    out.sort((a, b) => a.wakeMs - b.wakeMs);
    return out;
  }

  function collectWakeCandidatesForTodayCached() {
    const todayK = isoDateOnly(new Date());
    const key = `${eventsRev}|${todayK}|${deferralsStorageSnapshot ?? ""}`;
    if (todayAlarmCache && todayAlarmCache.key === key) {
      return todayAlarmCache.list;
    }
    const list = collectWakeCandidatesForToday();
    todayAlarmCache = { key, list };
    return list;
  }

  function tickReminderAlarms() {
    if (!isReminderAlarmActive()) {
      return;
    }
    const now = Date.now();
    pruneDeferrals(now);
    const list = collectWakeCandidatesForTodayCached();
    for (const it of list) {
      if (it.wakeMs > now) continue;
      if (now - it.wakeMs > REMINDER_ALARM_GRACE_MS) continue;
      const ringId = `${it.occKey}|${Math.floor(it.wakeMs / 60000)}`;
      if (reminderRung.has(ringId)) continue;
      reminderRung.add(ringId);
      const soundId = normalizeReminderSoundId(settings.reminderSound);
      postOsNotification(it.ev, it.dayKey, it.hhmm, it.occKey);
      flashReminderAttention();
      showReminderAlarmToast(it.ev, it.dayKey, it.hhmm, it.occKey, it.wakeMs);
      void playReminderSound(soundId);
      break;
    }
  }

  async function ensureNotificationPermission() {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") return;
    if (Notification.permission === "denied") return;
    try {
      await Notification.requestPermission();
    } catch {
      /* ignore */
    }
  }

  function msUntilNextReminderCheck() {
    if (!isReminderAlarmActive()) {
      return REMINDER_ALARM_POLL_MAX_MS;
    }
    const now = Date.now();
    const list = collectWakeCandidatesForTodayCached();
    let soonestFuture = null;
    for (const it of list) {
      if (it.wakeMs > now) {
        soonestFuture =
          soonestFuture == null ? it.wakeMs : Math.min(soonestFuture, it.wakeMs);
        continue;
      }
      if (now - it.wakeMs <= REMINDER_ALARM_GRACE_MS) {
        return REMINDER_ALARM_POLL_MIN_MS;
      }
    }
    if (soonestFuture != null) {
      const delta = soonestFuture - now;
      return Math.max(
        REMINDER_ALARM_POLL_MIN_MS,
        Math.min(delta, REMINDER_ALARM_POLL_MAX_MS),
      );
    }
    return REMINDER_ALARM_POLL_MAX_MS;
  }

  function scheduleReminderAlarmLoop() {
    if (rmeCalAlarmTimer) {
      window.clearTimeout(rmeCalAlarmTimer);
      rmeCalAlarmTimer = 0;
    }
    rmeCalAlarmTimer = window.setTimeout(() => {
      rmeCalAlarmTimer = 0;
      if (isReminderAlarmActive()) {
        loadEvents();
        loadDeferrals();
        tickReminderAlarms();
      }
      scheduleReminderAlarmLoop();
    }, msUntilNextReminderCheck());
  }

  function runReminderAlarmTickSoon() {
    if (!isReminderAlarmActive()) return;
    loadEvents();
    loadDeferrals();
    tickReminderAlarms();
    scheduleReminderAlarmLoop();
  }

  function startReminderAlarmLoop() {
    if (rmeCalAlarmTimer) {
      window.clearTimeout(rmeCalAlarmTimer);
      rmeCalAlarmTimer = 0;
    }
    scheduleReminderAlarmLoop();
    window.setTimeout(runReminderAlarmTickSoon, 2000);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        runReminderAlarmTickSoon();
      } else {
        scheduleReminderAlarmLoop();
      }
    });
    window.addEventListener("focus", runReminderAlarmTickSoon);
  }

  /** @param {RmeCalEvent} ev */
  function repeatDateRangeKeys(ev) {
    const start = String(ev?.start || "").slice(0, 10);
    const end = String(ev?.end || ev?.start || "").slice(0, 10);
    if (!start) return null;
    return { start, end: end || start };
  }

  /** Short line under reminder title in the side-panel library list. */
  function reminderListMeta(ev) {
    const wall = eventWallTimes(ev);
    const wallStr = wall.length ? wall.join(", ") : "";
    if (ev.reminderRepeat === "daily") {
      const range = repeatDateRangeKeys(ev);
      const openEnded = range?.end === "2099-12-31";
      if (openEnded) {
        return wallStr ? `Daily · ${wallStr}` : "Daily";
      }
      const rangePart = range
        ? range.start === range.end
          ? range.start
          : `${range.start} → ${range.end}`
        : "Repeat reminder";
      return wallStr ? `Daily · ${rangePart} · ${wallStr}` : `Daily · ${rangePart}`;
    }
    if (ev.reminderRepeat === "weekly") {
      const range = repeatDateRangeKeys(ev);
      const daysPart = formatWeekdaysShort(ev.repeatWeekdays) || "Weekdays";
      const openEnded = range?.end === "2099-12-31";
      const rangePart =
        !openEnded && range
          ? range.start === range.end
            ? range.start
            : `${range.start} → ${range.end}`
          : "";
      const core = rangePart ? `${daysPart} · ${rangePart}` : daysPart;
      return wallStr ? `Weekly · ${core} · ${wallStr}` : `Weekly · ${core}`;
    }
    if (ev.allDay) return "Remind once";
    return wallStr;
  }

  function monthTitle(d) {
    return d.toLocaleString(undefined, { month: "long", year: "numeric" });
  }

  function dowLabels() {
    const base = settings.weekStartsOn === 1 ? new Date(2021, 0, 4) : new Date(2021, 0, 3);
    /** @type {string[]} */
    const out = [];
    for (let i = 0; i < 7; i++) {
      const dt = new Date(base);
      dt.setDate(base.getDate() + i);
      out.push(dt.toLocaleString(undefined, { weekday: "short" }));
    }
    return out;
  }

  function openModal(ev) {
    editing = ev;
    closeModalHost();
    const dialog = document.createElement("dialog");
    dialog.className = "rme-cal-modal-dialog";
    const modalLabel = ev ? "Edit reminder" : "New reminder";
    dialog.setAttribute("aria-label", modalLabel);
    const modal = document.createElement("div");
    modal.className = "rme-cal-modal";
    modal.setAttribute("role", "document");

    const h2 = document.createElement("h2");
    h2.textContent = modalLabel;

    const fTitle = field("Title", "textarea", "rmeCalFieldTitle", ev?.title || "");
    fTitle.wrap.classList.add("rme-cal-title-field");
    if (fTitle.input instanceof HTMLTextAreaElement) {
      fTitle.input.className = "rme-cal-title-input";
      fTitle.input.rows = 1;
      fTitle.input.setAttribute("autocomplete", "off");
      fTitle.input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
        }
      });
    }
    const todayYmd = plannerTodayYmd();
    const defaultDay = clampYmdToTodayOrFuture(
      ev?.start?.slice(0, 10) || pickedDay || todayYmd,
    );
    const initialRepeat =
      ev?.reminderRepeat === "daily" || ev?.reminderRepeat === "weekly";
    const initialWeekly = ev?.reminderRepeat === "weekly";
    const defaultEndDay = initialRepeat
      ? String(ev?.end || ev?.start || defaultDay).slice(0, 10) || defaultDay
      : defaultDay;
    const fDay = field("Reminder date", "date", "rmeCalFieldDay", defaultDay);
    fDay.wrap.classList.add("rme-cal-once-date-field");
    const fStart = field("Start date", "date", "rmeCalFieldStart", defaultDay);
    const fEnd = field("End date", "date", "rmeCalFieldEnd", defaultEndDay);
    if (fDay.input instanceof HTMLInputElement) applyPlannerMinDateInput(fDay.input);
    if (fStart.input instanceof HTMLInputElement) applyPlannerMinDateInput(fStart.input);
    if (fEnd.input instanceof HTMLInputElement) applyPlannerMinDateInput(fEnd.input);
    const repeatDatesRow = document.createElement("div");
    repeatDatesRow.className = "rme-cal-time-row-grid rme-cal-repeat-dates-row";
    repeatDatesRow.appendChild(fStart.wrap);
    repeatDatesRow.appendChild(fEnd.wrap);

    const onceCb = document.createElement("input");
    onceCb.type = "checkbox";
    onceCb.id = "rmeCalRemindOnce";
    const hadLegacyAllDay = Boolean(ev && ev.allDay && !String(ev.start || "").includes("T"));
    onceCb.checked = !initialRepeat;
    const onceLabel = document.createElement("label");
    onceLabel.className = "rme-cal-inline-check";
    onceLabel.htmlFor = "rmeCalRemindOnce";
    onceLabel.textContent = "Remind once";
    const onceRow = document.createElement("div");
    onceRow.className = "rme-cal-field rme-cal-inline-check-row";
    onceRow.appendChild(onceCb);
    onceRow.appendChild(onceLabel);

    const repeatDailyCb = document.createElement("input");
    repeatDailyCb.type = "checkbox";
    repeatDailyCb.id = "rmeCalRepeatDaily";
    repeatDailyCb.checked = initialRepeat;
    const repeatDailyLabel = document.createElement("label");
    repeatDailyLabel.className = "rme-cal-inline-check";
    repeatDailyLabel.htmlFor = "rmeCalRepeatDaily";
    repeatDailyLabel.textContent = "Repeat reminder";
    const repeatDailyRow = document.createElement("div");
    repeatDailyRow.className = "rme-cal-field rme-cal-inline-check-row";
    repeatDailyRow.appendChild(repeatDailyCb);
    repeatDailyRow.appendChild(repeatDailyLabel);

    const repeatPatternField = document.createElement("div");
    repeatPatternField.className = "rme-cal-field rme-cal-repeat-pattern-field";
    const repeatPatternLabel = document.createElement("div");
    repeatPatternLabel.className = "rme-cal-field-labelish";
    repeatPatternLabel.textContent = "Repeat pattern";
    const repeatPatternSeg = document.createElement("div");
    repeatPatternSeg.className = "rme-cal-schedule-seg rme-cal-schedule-seg--two";
    const repeatEveryDayBtn = document.createElement("button");
    repeatEveryDayBtn.type = "button";
    repeatEveryDayBtn.className = "rme-cal-schedule-seg-btn";
    repeatEveryDayBtn.textContent = "Daily";
    const repeatWeekdaysBtn = document.createElement("button");
    repeatWeekdaysBtn.type = "button";
    repeatWeekdaysBtn.className = "rme-cal-schedule-seg-btn";
    repeatWeekdaysBtn.textContent = "Weekdays";
    repeatPatternSeg.appendChild(repeatEveryDayBtn);
    repeatPatternSeg.appendChild(repeatWeekdaysBtn);
    repeatPatternField.appendChild(repeatPatternLabel);
    repeatPatternField.appendChild(repeatPatternSeg);

    const weekdayField = document.createElement("div");
    weekdayField.className = "rme-cal-field rme-cal-weekday-field";
    const weekdayLabel = document.createElement("div");
    weekdayLabel.className = "rme-cal-field-labelish";
    weekdayLabel.textContent = "On these days";
    const weekdayChips = document.createElement("div");
    weekdayChips.className = "rme-cal-weekday-chips";
    /** @type {Set<number>} */
    let selectedWeekdays = new Set();
    if (initialWeekly && Array.isArray(ev?.repeatWeekdays) && ev.repeatWeekdays.length) {
      selectedWeekdays = new Set(
        ev.repeatWeekdays.filter((d) => d >= 0 && d <= 6),
      );
    } else {
      const seed = parseYmd(defaultDay);
      selectedWeekdays = new Set(seed ? [seed.getDay()] : [1]);
    }
    /** @returns {number[]} Sun=0 … Sat=6, ordered for chip row (respects week start). */
    function weekdayChipDayOrder() {
      if (settings.weekStartsOn === 1) {
        return [1, 2, 3, 4, 5, 6, 0];
      }
      return [0, 1, 2, 3, 4, 5, 6];
    }
    /** @type {HTMLButtonElement[]} */
    const weekdayChipBtns = [];
    /** @type {Map<number, HTMLButtonElement>} */
    const weekdayChipByDay = new Map();
    function toggleWeekdayChip(dayIndex) {
      if (repeatPatternKind() !== "weekly") {
        return;
      }
      if (selectedWeekdays.has(dayIndex)) {
        if (selectedWeekdays.size <= 1) {
          return;
        }
        selectedWeekdays.delete(dayIndex);
      } else {
        selectedWeekdays.add(dayIndex);
      }
      paintWeekdayChips();
    }
    function paintWeekdayChips() {
      const weekly = repeatPatternKind() === "weekly";
      for (const [dayIndex, btn] of weekdayChipByDay) {
        const on = weekly && selectedWeekdays.has(dayIndex);
        btn.disabled = false;
        btn.tabIndex = weekly ? 0 : -1;
        btn.setAttribute("aria-pressed", on ? "true" : "false");
        btn.classList.toggle("rme-cal-chip--on", on);
        btn.classList.toggle("rme-cal-chip--off", weekly && !on);
      }
    }
    for (const dayIndex of weekdayChipDayOrder()) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "rme-cal-chip";
      chip.textContent = WEEKDAY_SHORT[dayIndex];
      chip.setAttribute("aria-pressed", "false");
      chip.dataset.rmeCalWeekday = String(dayIndex);
      const onChipActivate = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWeekdayChip(dayIndex);
      };
      chip.addEventListener("click", onChipActivate);
      chip.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          toggleWeekdayChip(dayIndex);
        }
      });
      weekdayChipBtns.push(chip);
      weekdayChipByDay.set(dayIndex, chip);
      weekdayChips.appendChild(chip);
    }
    paintWeekdayChips();
    weekdayField.appendChild(weekdayLabel);
    weekdayField.appendChild(weekdayChips);

    /** @returns {"daily" | "weekly"} */
    function repeatPatternKind() {
      return repeatWeekdaysBtn.classList.contains("rme-cal-schedule-seg-btn--on")
        ? "weekly"
        : "daily";
    }

    function setRepeatPatternKind(kind) {
      const weekly = kind === "weekly";
      repeatEveryDayBtn.classList.toggle("rme-cal-schedule-seg-btn--on", !weekly);
      repeatWeekdaysBtn.classList.toggle("rme-cal-schedule-seg-btn--on", weekly);
      weekdayField.hidden = !weekly;
      weekdayField.setAttribute("aria-hidden", weekly ? "false" : "true");
      paintWeekdayChips();
    }
    setRepeatPatternKind(initialWeekly ? "weekly" : "daily");
    repeatEveryDayBtn.addEventListener("click", () => {
      setRepeatPatternKind("daily");
      syncReminderModeUi();
    });
    repeatWeekdaysBtn.addEventListener("click", () => {
      if (
        !initialWeekly &&
        (!Array.isArray(ev?.repeatWeekdays) || !ev.repeatWeekdays.length)
      ) {
        selectedWeekdays = new Set([1, 2, 3, 4, 5]);
      }
      setRepeatPatternKind("weekly");
      syncReminderModeUi();
    });

    const timesField = document.createElement("div");
    timesField.className = "rme-cal-field rme-cal-reminder-times-field";
    const timesLabel = document.createElement("div");
    timesLabel.className = "rme-cal-field-labelish";
    timesLabel.textContent = "Reminder times";
    const timesListEl = document.createElement("div");
    timesListEl.className = "rme-cal-reminder-times-rows";
    const timesActions = document.createElement("div");
    timesActions.className = "rme-cal-reminder-times-actions";
    const addTimeBtn = document.createElement("button");
    addTimeBtn.type = "button";
    addTimeBtn.className = "rme-cal-btn rme-cal-btn--ghost";
    addTimeBtn.textContent = "+ Add time";
    timesActions.appendChild(addTimeBtn);
    timesField.appendChild(timesLabel);
    timesField.appendChild(timesListEl);
    timesField.appendChild(timesActions);

    function gatherSortedTimesFromUI() {
      /** @type {string[]} */
      const raw = [];
      timesListEl.querySelectorAll('input[type="time"]').forEach((inp) => {
        if (inp instanceof HTMLInputElement && inp.value) {
          const n = normalizeHHMM(inp.value);
          if (n) raw.push(n);
        }
      });
      return [...new Set(raw)].sort();
    }

    function syncRemoveBtnVis() {
      const rows = timesListEl.querySelectorAll(".rme-cal-reminder-time-row");
      const multi = rows.length > 1;
      rows.forEach((r) => {
        const btn = r.querySelector(".rme-cal-reminder-time-remove");
        if (btn instanceof HTMLButtonElement) {
          btn.style.visibility = multi ? "visible" : "hidden";
          btn.disabled = !multi;
        }
      });
    }

    function addTimeRow(value) {
      const row = document.createElement("div");
      row.className = "rme-cal-reminder-time-row";
      const ti = document.createElement("input");
      ti.type = "time";
      ti.className = "rme-cal-reminder-time-input";
      ti.value = normalizeHHMM(String(value || "")) || "09:00";
      const rm = document.createElement("button");
      rm.type = "button";
      rm.className = "rme-cal-btn rme-cal-btn--ghost rme-cal-reminder-time-remove";
      rm.textContent = "Remove";
      rm.title = "Remove this time";
      rm.addEventListener("click", () => {
        if (timesListEl.querySelectorAll(".rme-cal-reminder-time-row").length <= 1) {
          return;
        }
        row.remove();
        syncRemoveBtnVis();
      });
      row.appendChild(ti);
      row.appendChild(rm);
      timesListEl.appendChild(row);
      syncRemoveBtnVis();
    }

    if (initialRepeat) {
      const wall = ev ? eventWallTimes(ev) : [];
      if (wall.length) {
        for (const w of wall) addTimeRow(w);
      } else {
        addTimeRow("09:00");
      }
    } else if (hadLegacyAllDay) {
      addTimeRow("09:00");
    } else {
      const wall = ev ? eventWallTimes(ev) : [];
      if (wall.length) {
        addTimeRow(wall[0]);
      } else {
        addTimeRow(timePart(ev?.start || ""));
      }
    }

    function setReminderDatesVisibility(repeat) {
      fDay.wrap.hidden = repeat;
      fDay.wrap.setAttribute("aria-hidden", repeat ? "true" : "false");
      /* Start/end range is legacy-only — never shown (once uses Reminder date; repeat uses times/weekdays). */
      repeatDatesRow.hidden = true;
      repeatDatesRow.setAttribute("aria-hidden", "true");
    }

    function syncReminderModeUi() {
      const repeat = repeatDailyCb.checked;
      if (!repeat) {
        const startVal = /** @type {HTMLInputElement} */ (fStart.input).value.trim();
        if (startVal) {
          /** @type {HTMLInputElement} */ (fDay.input).value = startVal;
        }
      }
      setReminderDatesVisibility(repeat);
      repeatPatternField.hidden = !repeat;
      repeatPatternField.setAttribute("aria-hidden", repeat ? "false" : "true");
      if (!repeat) {
        weekdayField.hidden = true;
        weekdayField.setAttribute("aria-hidden", "true");
      } else {
        const weekly = repeatPatternKind() === "weekly";
        weekdayField.hidden = !weekly;
        weekdayField.setAttribute("aria-hidden", weekly ? "false" : "true");
        paintWeekdayChips();
      }
      timesField.hidden = false;
      timesField.setAttribute("aria-hidden", "false");
      timesActions.hidden = !repeat;
      if (!repeat) {
        const rows = timesListEl.querySelectorAll(".rme-cal-reminder-time-row");
        if (rows.length > 1) {
          let v = "09:00";
          const firstInp = rows[0].querySelector('input[type="time"]');
          if (firstInp instanceof HTMLInputElement && firstInp.value) {
            v = normalizeHHMM(firstInp.value) || v;
          }
          timesListEl.replaceChildren();
          addTimeRow(v);
        } else if (rows.length === 0) {
          addTimeRow("09:00");
        }
      }
      syncRemoveBtnVis();
    }

    onceCb.addEventListener("change", () => {
      if (onceCb.checked) {
        repeatDailyCb.checked = false;
      } else if (!repeatDailyCb.checked) {
        repeatDailyCb.checked = true;
      }
      syncReminderModeUi();
    });
    repeatDailyCb.addEventListener("change", () => {
      if (repeatDailyCb.checked) {
        onceCb.checked = false;
      } else if (!onceCb.checked) {
        onceCb.checked = true;
      }
      syncReminderModeUi();
    });
    addTimeBtn.addEventListener("click", () => {
      addTimeRow("12:00");
    });
    syncReminderModeUi();

    const fNotes = field("Notes", "textarea", "rmeCalNotes", ev?.notes || "");

    const piInit = eventPriority(ev);
    /** @type {0|1|2} */
    let pickedPri = /** @type {0|1|2} */ (Math.min(2, Math.max(0, piInit)));
    const priorityBlock = document.createElement("div");
    priorityBlock.className = "rme-cal-priority-field";
    const ph = document.createElement("div");
    ph.className = "rme-cal-priority-heading";
    ph.textContent = "Priority";
    const pills = document.createElement("div");
    pills.className = "rme-cal-priority-pills";
    PRIORITY_LEVELS.forEach((lvl) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = `rme-cal-priority-pill rme-cal-priority-pill--${lvl.key}`;
      if (lvl.id === pickedPri) b.classList.add("rme-cal-priority-pill--on");
      const lab = document.createElement("span");
      lab.className = "rme-cal-priority-pill-label";
      lab.textContent = lvl.label;
      const hi = document.createElement("span");
      hi.className = "rme-cal-priority-pill-hint";
      hi.textContent = lvl.hint;
      b.appendChild(lab);
      b.appendChild(hi);
      b.addEventListener("click", () => {
        pickedPri = /** @type {0|1|2} */ (lvl.id);
        pills.querySelectorAll("button").forEach((x) => {
          x.classList.remove("rme-cal-priority-pill--on");
        });
        b.classList.add("rme-cal-priority-pill--on");
      });
      pills.appendChild(b);
    });
    priorityBlock.appendChild(ph);
    priorityBlock.appendChild(pills);

    const actions = document.createElement("div");
    actions.className = "rme-cal-modal-actions";
    const del = document.createElement("button");
    del.type = "button";
    del.className = "rme-cal-btn";
    del.textContent = "Delete";
    del.hidden = !ev;
    del.addEventListener("click", () => {
      if (
        ev &&
        window.confirm(
          "Move this reminder to Trash? You can restore it from the Trash page.",
        )
      ) {
        moveReminderToTrash(ev);
        close();
      }
    });
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "rme-cal-btn rme-cal-btn--ghost";
    cancel.textContent = "Cancel";
    cancel.addEventListener("click", () => {
      close();
    });

    /**
     * Persist reminder from the modal. On success, updates `pickedDay` to the
     * reminder date so the right-hand list shows this item after dismiss.
     * @param {{ silent?: boolean }} opts silent: no alert when title/date missing (backdrop / Escape).
     * @returns {boolean}
     */
    /**
     * @param {number[]} weekdays Sun=0 … Sat=6
     * @param {string} [afterYmd] optional YYYY-MM-DD lower bound
     * @returns {string}
     */
    function nearestWeekdayAnchorYmd(weekdays, afterYmd) {
      const sorted = [...weekdays].filter((d) => d >= 0 && d <= 6).sort((a, b) => a - b);
      if (!sorted.length) {
        return plannerTodayYmd();
      }
      const floorYmd = clampYmdToTodayOrFuture(afterYmd || plannerTodayYmd());
      const base = parseYmd(floorYmd) || new Date();
      for (let i = 0; i < 14; i++) {
        const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
        if (sorted.includes(d.getDay())) {
          return isoDateOnly(d);
        }
      }
      return isoDateOnly(base);
    }

    function tryCommitReminderModal(opts) {
      const silent = Boolean(opts && opts.silent);
      const title = String(fTitle.input.value || "").trim();
      const repeatDaily = repeatDailyCb.checked;
      const weeklyPattern = repeatDaily && repeatPatternKind() === "weekly";
      const dailyPattern = repeatDaily && repeatPatternKind() === "daily";
      let day = "";
      let endDay = "";
      if (repeatDaily) {
        if (weeklyPattern) {
          const wd = [...selectedWeekdays].sort((a, b) => a - b);
          if (!wd.length) {
            if (!silent) {
              window.alert("Pick at least one weekday.");
            }
            return false;
          }
          const anchor = clampYmdToTodayOrFuture(
            /** @type {HTMLInputElement} */ (fDay.input).value.trim() ||
              /** @type {HTMLInputElement} */ (fStart.input).value.trim() ||
              (ev?.start ? String(ev.start).slice(0, 10) : "") ||
              pickedDay ||
              plannerTodayYmd(),
          );
          day = nearestWeekdayAnchorYmd(wd, anchor);
          endDay = RME_CAL_REPEAT_OPEN_END;
        } else if (dailyPattern) {
          day = clampYmdToTodayOrFuture(
            /** @type {HTMLInputElement} */ (fDay.input).value.trim() ||
              /** @type {HTMLInputElement} */ (fStart.input).value.trim() ||
              (ev?.start ? String(ev.start).slice(0, 10) : "") ||
              pickedDay ||
              plannerTodayYmd(),
          );
          endDay = RME_CAL_REPEAT_OPEN_END;
        }
        if (!title) {
          if (!silent) {
            window.alert("Title is required.");
          }
          return false;
        }
        if (!rejectPastReminderDate(day, { silent })) {
          return false;
        }
      } else {
        day = /** @type {HTMLInputElement} */ (fDay.input).value.trim();
        endDay = day;
        if (!title || !day) {
          if (!silent) {
            window.alert("Title and reminder date are required.");
          }
          return false;
        }
        if (!rejectPastReminderDate(day, { silent })) {
          return false;
        }
      }
      const sortedT = gatherSortedTimesFromUI();
      if (!sortedT.length) {
        if (!silent) {
          window.alert("Pick at least one reminder time.");
        }
        return false;
      }

      const priority = pickedPri;
      const colorIdx = priority;
      const notes = /** @type {HTMLTextAreaElement} */ (fNotes.input).value.trim();
      let start = day;
      let end = endDay;
      /** @type {'daily' | 'weekly' | undefined} */
      let reminderRepeat;

      const allDay = false;

      if (repeatDaily) {
        const t0 = sortedT[0];
        start = `${day}T${t0}:00`;
        end = endDay;
        if (repeatPatternKind() === "weekly") {
          const wd = [...selectedWeekdays].sort((a, b) => a - b);
          if (!wd.length) {
            if (!silent) {
              window.alert("Pick at least one weekday.");
            }
            return false;
          }
          reminderRepeat = "weekly";
        } else {
          reminderRepeat = "daily";
        }
      } else {
        const t0 = sortedT[0];
        start = `${day}T${t0}:00`;
        end = start;
        reminderRepeat = undefined;
      }

      function applyReminderTimes(target) {
        if (repeatDaily) {
          target.reminderTimes = [...sortedT];
          delete target.extraTimes;
        } else {
          delete target.reminderTimes;
          if (sortedT.length > 1) target.extraTimes = sortedT.slice(1);
          else delete target.extraTimes;
        }
      }

      function applyRepeatFields(target) {
        if (reminderRepeat === "weekly") {
          target.reminderRepeat = "weekly";
          target.repeatWeekdays = [...selectedWeekdays].sort((a, b) => a - b);
        } else if (reminderRepeat === "daily") {
          target.reminderRepeat = "daily";
          delete target.repeatWeekdays;
        } else {
          delete target.reminderRepeat;
          delete target.repeatWeekdays;
        }
      }

      if (ev) {
        ev.title = title;
        ev.start = start;
        ev.end = end;
        ev.allDay = allDay;
        ev.colorIdx = colorIdx;
        ev.priority = priority;
        ev.notes = notes;
        applyRepeatFields(ev);
        applyReminderTimes(ev);
      } else {
        const id =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `ev-${Date.now()}`;
        /** @type {RmeCalEvent} */
        const next = {
          id,
          title,
          start,
          end,
          allDay,
          colorIdx,
          priority,
          notes,
        };
        applyRepeatFields(next);
        applyReminderTimes(next);
        events.push(next);
      }
      pickedDay = day;
      saveEvents();
      void ensureNotificationPermission();
      scheduleReminderAlarmLoop();
      return true;
    }

    const save = document.createElement("button");
    save.type = "button";
    save.className = "rme-cal-btn rme-cal-btn--primary";
    save.textContent = "Save";
    save.addEventListener("click", () => {
      if (!tryCommitReminderModal({ silent: false })) return;
      close();
      render();
    });
    actions.appendChild(del);
    actions.appendChild(cancel);
    actions.appendChild(save);

    modal.appendChild(h2);
    modal.appendChild(fTitle.wrap);
    modal.appendChild(onceRow);
    modal.appendChild(repeatDailyRow);
    modal.appendChild(repeatPatternField);
    modal.appendChild(weekdayField);
    modal.appendChild(fDay.wrap);
    modal.appendChild(repeatDatesRow);
    modal.appendChild(timesField);
    modal.appendChild(priorityBlock);
    modal.appendChild(fNotes.wrap);
    modal.appendChild(actions);
    dialog.appendChild(modal);
    mountPlannerModalDialog(dialog);
    modalHost = dialog;

    function dismissReminderModal() {
      tryCommitReminderModal({ silent: true });
      close();
      render();
    }

    dialog.addEventListener("cancel", (e) => {
      e.preventDefault();
      dismissReminderModal();
    });
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dismissReminderModal();
    });

    dialog.showModal();

    window.requestAnimationFrame(() => {
      try {
        const ti = fTitle.input;
        if (
          ti instanceof HTMLInputElement ||
          ti instanceof HTMLTextAreaElement
        ) {
          ti.focus({ preventScroll: true });
        }
      } catch {
        /* ignore */
      }
    });

    function close() {
      closeModalHost();
      editing = null;
    }
  }

  function field(label, type, id, value) {
    const wrap = document.createElement("div");
    wrap.className = "rme-cal-field";
    const lb = document.createElement("label");
    lb.htmlFor = id;
    lb.textContent = label;
    let input;
    if (type === "textarea") {
      input = document.createElement("textarea");
      input.id = id;
      input.value = value;
    } else {
      input = document.createElement("input");
      input.id = id;
      input.type = type;
      input.value = value;
      input.disabled = false;
      input.readOnly = false;
      if (type === "text" || type === "search" || type === "email") {
        input.setAttribute("autocomplete", "off");
      }
    }
    wrap.appendChild(lb);
    wrap.appendChild(input);
    return { wrap, input };
  }

  function renderMonth(into) {
    into.replaceChildren();
    const grid = document.createElement("div");
    grid.className = "rme-cal-month-grid";
    for (const lab of dowLabels()) {
      const c = document.createElement("div");
      c.className = "rme-cal-dow";
      c.textContent = lab;
      grid.appendChild(c);
    }
    const todayK = isoDateOnly(new Date());
    for (const d of monthMatrix(anchor)) {
      const k = isoDateOnly(d);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "rme-cal-cell";
      if (d.getMonth() !== anchor.getMonth()) cell.classList.add("rme-cal-cell--muted");
      if (k === todayK) cell.classList.add("rme-cal-cell--today");
      if (k === pickedDay) cell.classList.add("rme-cal-cell--picked");
      const q = normalizedSearchQ();
      if (q) {
        cell.classList.add(
          dayMatchesGlobalSearch(k) ? "rme-cal-cell--search-hit" : "rme-cal-cell--search-miss",
        );
      }
      const head = document.createElement("div");
      head.className = "rme-cal-cell-head";
      const num = document.createElement("div");
      num.className = "rme-cal-cell-num";
      num.textContent = String(d.getDate());
      head.appendChild(num);

      const dayReminders = appendDayCardReminderDots(head, d, { maxDots: 5 });
      cell.appendChild(head);

      if (daySheetHasContent(k)) {
        cell.classList.add("rme-cal-cell--sheet");
      }
      if (q && dayPageMatchesSearch(k, q)) {
        cell.classList.add("rme-cal-cell--sheet");
      }

      appendDayCardNotesUi(cell, k, { compact: true });
      const ariaBits = [];
      const bodySnip =
        (q ? dayPageMatchesSearch(k, q) : daySheetHasContent(k))
          ? dayCardPreviewPlain(k, 120)
          : "";
      if (bodySnip) {
        ariaBits.push(bodySnip);
      } else if (dayReminders.length) {
        ariaBits.push(
          `${dayReminders.length} reminder${dayReminders.length === 1 ? "" : "s"}`,
        );
      }
      const dateHuman = d.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      cell.setAttribute(
        "aria-label",
        ariaBits.length ? `${dateHuman}. ${ariaBits.join(", ")}.` : dateHuman,
      );
      bindCalDayDropZone(cell, k);
      cell.addEventListener("click", () => {
        if (calDragDidMove) {
          calDragDidMove = false;
          return;
        }
        patchCalendarPickedDay(k);
        openDaySheet(k);
      });
      grid.appendChild(cell);
    }
    into.appendChild(grid);
  }

  function renderWeek(into) {
    into.replaceChildren();
    const { start } = weekRangeContaining(anchor);
    const wrap = document.createElement("div");
    wrap.className = "rme-cal-week";
    const todayK = isoDateOnly(new Date());
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const k = isoDateOnly(d);
      const col = document.createElement("div");
      col.className = "rme-cal-week-col";
      if (k === todayK) col.classList.add("rme-cal-week-col--today");
      if (k === pickedDay) col.classList.add("rme-cal-week-col--picked");
      const q = normalizedSearchQ();
      if (q) {
        col.classList.add(
          dayMatchesGlobalSearch(k) ? "rme-cal-cell--search-hit" : "rme-cal-cell--search-miss",
        );
      }
      if (daySheetHasContent(k) || (q && dayPageMatchesSearch(k, q))) {
        col.classList.add("rme-cal-week-col--sheet");
      }
      const headRow = document.createElement("div");
      headRow.className = "rme-cal-cell-head rme-cal-week-col-head";
      const head = document.createElement("button");
      head.type = "button";
      head.className = "rme-cal-week-dayhead";
      head.textContent = `${d.toLocaleString(undefined, { weekday: "short" })} ${d.getDate()}`;
      head.addEventListener("click", (e) => {
        e.stopPropagation();
        patchCalendarPickedDay(k);
        openDaySheet(k);
      });
      head.addEventListener("dblclick", (e) => {
        e.stopPropagation();
      });
      headRow.appendChild(head);
      appendDayCardReminderDots(headRow, d);
      col.appendChild(headRow);
      appendDayCardNotesUi(col, k, { previewMax: 140 });
      bindCalDayDropZone(col, k);
      col.addEventListener("click", () => {
        if (calDragDidMove) {
          calDragDidMove = false;
          return;
        }
        patchCalendarPickedDay(k);
        openDaySheet(k);
      });
      col.addEventListener("dblclick", (e) => {
        e.preventDefault();
        if (isYmdBeforeToday(k)) return;
        pickedDay = k;
        openModal(null);
      });
      wrap.appendChild(col);
    }
    into.appendChild(wrap);
  }

  function renderSide(into) {
    into.replaceChildren();
    const headRow = document.createElement("div");
    headRow.className = "rme-cal-side-head";
    const h = document.createElement("h3");
    h.textContent = "Reminder library";
    const addRm = document.createElement("button");
    addRm.type = "button";
    addRm.className = "rme-cal-btn rme-cal-btn--primary rme-cal-side-add-reminder";
    addRm.textContent = "Add reminder";
    addRm.addEventListener("click", () => {
      pickedDay = clampYmdToTodayOrFuture(pickedDay);
      openModal(null);
    });
    headRow.appendChild(h);
    headRow.appendChild(addRm);
    into.appendChild(headRow);

    const lib = libraryReminders();
    const dayHits = globalSearchDayHits();
    const pinnedCount = lib.filter((e) => e.pinned).length;
    const stat = document.createElement("p");
    stat.className = "rme-cal-hint";
    const q = searchQ.trim();
    if (q) {
      const parts = [];
      if (dayHits.length) parts.push(`${dayHits.length} day(s)`);
      if (lib.length) parts.push(`${lib.length} reminder(s)`);
      if (!parts.length) {
        stat.textContent = `No matches for “${q}”.`;
      } else {
        stat.textContent = `${parts.join(" · ")} match search`;
      }
    } else if (!lib.length) {
      stat.textContent = "No reminders in the library yet. Use Add reminder.";
    } else {
      stat.textContent = `${lib.length} reminder(s) in the library`;
    }
    into.appendChild(stat);

    const sc = document.createElement("div");
    sc.className = "rme-cal-side-scroll";

    if (q && dayHits.length) {
      const dayLabel = document.createElement("p");
      dayLabel.className = "rme-cal-side-section-label";
      dayLabel.textContent = "Days · notes & to-dos";
      sc.appendChild(dayLabel);
      for (const key of dayHits) {
        const row = document.createElement("button");
        row.type = "button";
        row.className = "rme-cal-agenda-row rme-cal-agenda-row--compact rme-cal-side-day-hit";
        const d = parseYmd(key);
        const da = document.createElement("div");
        da.className = "rme-cal-agenda-date";
        da.textContent = d
          ? d.toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : key;
        const body = document.createElement("div");
        body.className = "rme-cal-side-lib-body";
        const t1 = document.createElement("div");
        t1.className = "rme-cal-ev-title";
        t1.textContent = dayCardPreviewPlain(key, 88) || "Notes or to-dos";
        body.appendChild(t1);
        row.appendChild(da);
        row.appendChild(body);
        row.addEventListener("click", () => {
          focusCalendarOnDay(key);
          render();
          openDaySheet(key);
        });
        sc.appendChild(row);
      }
      if (lib.length) {
        const remLabel = document.createElement("p");
        remLabel.className = "rme-cal-side-section-label";
        remLabel.textContent = "Reminders";
        sc.appendChild(remLabel);
      }
    }
    const totalLibPages = Math.max(1, Math.ceil(lib.length / LIB_PAGE_SIZE));
    if (libPage >= totalLibPages) {
      libPage = totalLibPages - 1;
    }
    if (libPage < 0) {
      libPage = 0;
    }
    const pageStart = libPage * LIB_PAGE_SIZE;
    const pageEnd = Math.min(lib.length, pageStart + LIB_PAGE_SIZE);

    /**
     * @param {number} from
     * @param {number} to
     */
    function appendSideLibraryRows(from, to) {
      for (let i = from; i < to; i++) {
        const ev = lib[i];
        if (pinnedCount && ev.pinned && i === 0) {
          const pinnedLabel = document.createElement("p");
          pinnedLabel.className = "rme-cal-side-section-label";
          pinnedLabel.textContent = "Pinned";
          sc.appendChild(pinnedLabel);
        }
        if (pinnedCount && !ev.pinned && i === pinnedCount) {
          const divider = document.createElement("p");
          divider.className = "rme-cal-side-section-label";
          divider.textContent = "All reminders";
          sc.appendChild(divider);
        }

        const row = document.createElement("div");
        row.className =
          "rme-cal-agenda-row rme-cal-agenda-row--compact rme-cal-side-lib-row--draggable";
        row.tabIndex = 0;
        row.setAttribute("role", "button");
        row.draggable = true;
        row.title = "Drag to a calendar day to reschedule";
        if (reminderDayKey(ev) === pickedDay) {
          row.classList.add("rme-cal-side-lib-row--picked");
        }
        if (ev.pinned) row.classList.add("rme-cal-side-lib-row--pinned");

        const pinBtn = document.createElement("button");
        pinBtn.type = "button";
        pinBtn.className =
          "rme-cal-side-pin-btn" + (ev.pinned ? " rme-cal-side-pin-btn--on" : "");
        pinBtn.draggable = false;
        pinBtn.setAttribute("aria-label", ev.pinned ? "Unpin reminder" : "Pin reminder");
        pinBtn.title = ev.pinned ? "Unpin" : "Pin to top";
        pinBtn.textContent = ev.pinned ? "★" : "☆";
        pinBtn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          ev.pinned = !ev.pinned;
          saveEvents();
          render();
        });

        const libAnchor = libraryAnchorDayAndHhmm(ev);
        const snoozeLib = document.createElement("button");
        snoozeLib.type = "button";
        snoozeLib.className = "rme-cal-side-snooze-btn";
        snoozeLib.draggable = false;
        snoozeLib.textContent = "\u23f0";
        snoozeLib.title = "Snooze (10 min · 1 hr · tomorrow)";
        snoozeLib.setAttribute("aria-label", "Snooze reminder");
        snoozeLib.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          openSnoozePopover(snoozeLib, ev.id, libAnchor.dayKey, libAnchor.hhmm);
        });

        const da = document.createElement("div");
        da.className = "rme-cal-agenda-date";
        const range = repeatDateRangeKeys(ev);
        if (ev.reminderRepeat === "weekly") {
          const days = formatWeekdaysShort(ev.repeatWeekdays);
          da.textContent = days || "Weekly";
          if (range && range.start !== range.end) {
            da.title = `${range.start} → ${range.end}`;
          } else if (range) {
            da.title = range.start;
          }
        } else {
          da.textContent =
            range && range.start !== range.end
              ? `${range.start} → ${range.end}`
              : reminderDayKey(ev) || "—";
        }

        const body = document.createElement("div");
        body.className = "rme-cal-side-lib-body";
        body.style.borderLeftColor = priorityHex(eventPriority(ev));
        const t1 = document.createElement("div");
        t1.className = "rme-cal-ev-title";
        t1.textContent = ev.title;
        const t2 = document.createElement("div");
        t2.className = "rme-cal-ev-meta";
        t2.textContent = reminderListMeta(ev) || "\u00a0";
        body.appendChild(t1);
        body.appendChild(t2);

        const delLib = document.createElement("button");
        delLib.type = "button";
        delLib.className = "rme-cal-side-delete-btn";
        delLib.draggable = false;
        delLib.setAttribute("aria-label", "Move reminder to trash");
        delLib.title = "Move to trash";
        delLib.textContent = "\u00d7";
        delLib.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          moveReminderToTrash(ev);
        });

        row.appendChild(pinBtn);
        row.appendChild(snoozeLib);
        row.appendChild(da);
        row.appendChild(body);
        row.appendChild(delLib);
        row.addEventListener("dragstart", (e) => {
          if (
            e.target instanceof Element &&
            e.target.closest(
              ".rme-cal-side-pin-btn, .rme-cal-side-snooze-btn, .rme-cal-side-delete-btn",
            )
          ) {
            e.preventDefault();
            return;
          }
          e.stopPropagation();
          onReminderDragStart(e, ev.id, reminderDayKey(ev));
          row.classList.add("rme-cal-reminder-dragging");
        });
        row.addEventListener("dragend", (e) => {
          row.classList.remove("rme-cal-reminder-dragging");
          onReminderDragEnd(e);
        });
        row.addEventListener("click", (e) => {
          if (calDragDidMove) {
            calDragDidMove = false;
            return;
          }
          if (
            e.target instanceof Element &&
            e.target.closest(
              ".rme-cal-side-pin-btn, .rme-cal-side-snooze-btn, .rme-cal-side-delete-btn",
            )
          ) {
            return;
          }
          openModal(ev);
        });
        row.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(ev);
          }
        });
        sc.appendChild(row);
      }
    }

    if (lib.length) {
      appendSideLibraryRows(pageStart, pageEnd);
    }
    into.appendChild(sc);

    if (lib.length > LIB_PAGE_SIZE) {
      const pager = document.createElement("div");
      pager.className = "rme-cal-lib-pager";

      const prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "rme-cal-btn rme-cal-btn--ghost rme-cal-lib-pager-btn";
      prevBtn.textContent = "Prev";
      prevBtn.disabled = libPage <= 0;
      prevBtn.addEventListener("click", () => {
        if (libPage <= 0) return;
        libPage -= 1;
        render();
      });

      const statPg = document.createElement("span");
      statPg.className = "rme-cal-lib-pager-stat";
      const fromN = lib.length ? pageStart + 1 : 0;
      const toN = pageEnd;
      statPg.textContent = `${fromN}–${toN} of ${lib.length} · page ${libPage + 1}/${totalLibPages}`;

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "rme-cal-btn rme-cal-btn--ghost rme-cal-lib-pager-btn";
      nextBtn.textContent = "Next";
      nextBtn.disabled = libPage >= totalLibPages - 1;
      nextBtn.addEventListener("click", () => {
        if (libPage >= totalLibPages - 1) return;
        libPage += 1;
        render();
      });

      pager.appendChild(prevBtn);
      pager.appendChild(statPg);
      pager.appendChild(nextBtn);
      into.appendChild(pager);
    }
  }

  /**
   * Per-note / per-to-do delete inside bulk trash cards.
   * @param {RmeCalTrashEntry} entry
   * @returns {HTMLElement | null}
   */
  function buildTrashBulkItemList(entry) {
    const pl = entry.payload;
    if (entry.kind === "clear-all-notes") {
      const nb =
        pl && typeof pl === "object" && pl.notesByDay && typeof pl.notesByDay === "object"
          ? pl.notesByDay
          : {};
      const keys = Object.keys(nb).filter((k) => String(nb[k] ?? "").trim());
      if (!keys.length) {
        return null;
      }
      const list = document.createElement("ul");
      list.className = "rme-cal-trash-item-list";
      for (const dayKey of keys.sort()) {
        const text = String(nb[dayKey] ?? "").trim();
        const li = document.createElement("li");
        li.className = "rme-cal-trash-item";
        const body = document.createElement("div");
        body.className = "rme-cal-trash-item-body";
        const title = document.createElement("span");
        title.className = "rme-cal-trash-item-title";
        title.textContent = dayDateHeading(dayKey);
        const prev = document.createElement("span");
        prev.className = "rme-cal-trash-item-preview";
        prev.textContent = truncatePlainPreview(text, 96);
        body.appendChild(title);
        body.appendChild(prev);
        const del = document.createElement("button");
        del.type = "button";
        del.className = "rme-cal-btn rme-cal-btn--ghost rme-cal-trash-item-delete";
        del.textContent = "Delete";
        del.addEventListener("click", () => {
          if (
            window.confirm(
              `Permanently delete this note from trash (${dayDateHeading(dayKey)})?`,
            )
          ) {
            deleteNoteFromTrashBulk(entry.id, dayKey);
          }
        });
        li.appendChild(body);
        li.appendChild(del);
        list.appendChild(li);
      }
      return list;
    }
    if (entry.kind === "clear-all-todos") {
      const tb =
        pl && typeof pl === "object" && pl.todosByDay && typeof pl.todosByDay === "object"
          ? pl.todosByDay
          : {};
      const rows = [];
      for (const dayKey of Object.keys(tb).sort()) {
        const list = Array.isArray(tb[dayKey]) ? tb[dayKey] : [];
        for (const todo of list) {
          if (!todo || typeof todo.id !== "string") {
            continue;
          }
          rows.push({ dayKey, todo });
        }
      }
      if (!rows.length) {
        return null;
      }
      const list = document.createElement("ul");
      list.className = "rme-cal-trash-item-list";
      for (const { dayKey, todo } of rows) {
        const text = String(todo.text ?? "").trim() || "Untitled to-do";
        const li = document.createElement("li");
        li.className = "rme-cal-trash-item";
        const body = document.createElement("div");
        body.className = "rme-cal-trash-item-body";
        const title = document.createElement("span");
        title.className = "rme-cal-trash-item-title";
        title.textContent = text;
        const prev = document.createElement("span");
        prev.className = "rme-cal-trash-item-preview";
        prev.textContent = dayDateHeading(dayKey);
        body.appendChild(title);
        body.appendChild(prev);
        const del = document.createElement("button");
        del.type = "button";
        del.className = "rme-cal-btn rme-cal-btn--ghost rme-cal-trash-item-delete";
        del.textContent = "Delete";
        del.addEventListener("click", () => {
          if (window.confirm(`Permanently delete this to-do from trash?`)) {
            deleteTodoFromTrashBulk(entry.id, dayKey, todo.id);
          }
        });
        li.appendChild(body);
        li.appendChild(del);
        list.appendChild(li);
      }
      return list;
    }
    return null;
  }

  /** @param {RmeCalTrashEntry} entry */
  function buildTrashCard(entry) {
    const card = document.createElement("article");
    card.className = "rme-cal-trash-card";
    const top = document.createElement("div");
    top.className = "rme-cal-trash-card-top";
    const kindEl = document.createElement("span");
    kindEl.className = "rme-cal-trash-card-kind";
    kindEl.textContent = trashKindLabel(entry.kind);
    const timeEl = document.createElement("time");
    timeEl.className = "rme-cal-trash-card-time";
    timeEl.dateTime = entry.at;
    timeEl.textContent = formatTrashTime(entry.at);
    top.appendChild(kindEl);
    top.appendChild(timeEl);
    const sum = document.createElement("h3");
    sum.className = "rme-cal-trash-card-title";
    sum.textContent = entry.summary;
    const detail = document.createElement("p");
    detail.className = "rme-cal-trash-card-detail";
    const bulkList = buildTrashBulkItemList(entry);
    if (!bulkList) {
      detail.textContent = entry.detail || trashDetailPreview(entry) || "—";
    } else {
      detail.textContent =
        entry.kind === "clear-all-notes"
          ? "Delete individual notes below, or restore the whole batch."
          : "Delete individual to-dos below, or restore the whole batch.";
    }
    const actions = document.createElement("div");
    actions.className = "rme-cal-trash-card-actions";
    const rest = document.createElement("button");
    rest.type = "button";
    rest.className = "rme-cal-btn rme-cal-btn--primary";
    rest.textContent = "Restore";
    rest.addEventListener("click", () => {
      if (window.confirm("Restore this into My planner?")) {
        restoreTrashEntry(entry);
      }
    });
    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "rme-cal-btn rme-cal-btn--ghost";
    rm.textContent = "Delete";
    rm.addEventListener("click", () => {
      if (
        window.confirm(
          "Permanently delete this trash entry? Restoring will no longer be possible.",
        )
      ) {
        removeTrashEntry(entry.id);
        render();
      }
    });
    actions.appendChild(rest);
    actions.appendChild(rm);
    card.appendChild(top);
    card.appendChild(sum);
    card.appendChild(detail);
    if (bulkList) {
      card.appendChild(bulkList);
    }
    card.appendChild(actions);
    return card;
  }

  function renderTrash(into) {
    into.replaceChildren();
    const wrap = document.createElement("div");
    wrap.className = "rme-cal-trash-root";
    const headBar = document.createElement("div");
    headBar.className = "rme-cal-trash-head";
    const h2 = document.createElement("h2");
    h2.className = "rme-cal-trash-page-title";
    h2.textContent = "Trash";
    const sub = document.createElement("p");
    sub.className = "rme-cal-trash-page-sub";
    sub.textContent =
      "Items you clear from My planner land here. Restore to bring them back, or delete forever.";
    const emptyBtn = document.createElement("button");
    emptyBtn.type = "button";
    emptyBtn.className = "rme-cal-btn rme-cal-btn--ghost rme-cal-trash-empty-all";
    emptyBtn.textContent = "Empty trash";
    emptyBtn.disabled = !trash.length;
    emptyBtn.addEventListener("click", () => {
      if (
        trash.length &&
        window.confirm(
          `Permanently delete all ${trash.length} trash item(s)? This cannot be undone.`,
        )
      ) {
        trash = [];
        saveTrash();
        render();
      }
    });
    headBar.appendChild(h2);
    headBar.appendChild(sub);
    headBar.appendChild(emptyBtn);
    wrap.appendChild(headBar);
    const grid = document.createElement("div");
    grid.className = "rme-cal-trash-grid";
    if (!trash.length) {
      const p = document.createElement("p");
      p.className = "rme-cal-hint rme-cal-trash-empty";
      p.textContent =
        "Nothing in trash yet. Removing a to-do, clearing day notes, or deleting a reminder sends a copy here.";
      grid.appendChild(p);
    } else {
      for (const entry of trash) {
        grid.appendChild(buildTrashCard(entry));
      }
    }
    wrap.appendChild(grid);
    into.appendChild(wrap);
  }

  function render(opts) {
    if (opts?.force) {
      renderForceNext = true;
    }
    if (renderRaf) {
      return;
    }
    renderRaf = window.requestAnimationFrame(() => {
      renderRaf = 0;
      const force = renderForceNext;
      renderForceNext = false;
      renderNow(force);
    });
  }

  function renderNow(force) {
    const root = document.getElementById("rmeCalendarRoot");
    if (!root) return;
    const fp = renderFingerprint();
    if (!force && plannerModalIsOpen()) {
      lastRenderFingerprint = fp;
      return;
    }
    if (!force && fp === lastRenderFingerprint && root.querySelector(".rme-cal-body")) {
      return;
    }
    lastRenderFingerprint = fp;
    if (viewMode === "month") {
      warmViewRemindersCache(monthMatrix(anchor).map((d) => isoDateOnly(d)));
    } else if (viewMode === "week") {
      warmViewRemindersCache(weekDayKeysForView(anchor));
    } else {
      viewRemindersCache = null;
    }
    const ae = document.activeElement;
    const restoreSearch =
      ae instanceof HTMLInputElement && ae.id === "rmeCalSearchInput";
    const selA = restoreSearch ? ae.selectionStart : null;
    const selB = restoreSearch ? ae.selectionEnd : null;

    root.replaceChildren();

    const toolbar = document.createElement("div");
    toolbar.className = "rme-cal-toolbar";

    const left = document.createElement("div");
    left.className = "rme-cal-toolbar-left";
    const title = document.createElement("div");
    title.className = "rme-cal-title";
    const isTrashView = viewMode === "trash";
    const isObsidianView = viewMode === "obsidian";
    title.textContent = isObsidianView
      ? "Obsidian view"
      : isTrashView
        ? "Trash"
        : viewMode === "week"
          ? `Week · ${monthTitle(anchor)}`
          : monthTitle(anchor);
    const prev = document.createElement("button");
    prev.type = "button";
    prev.className = "rme-cal-btn rme-cal-btn--ghost";
    prev.setAttribute("aria-label", "Previous");
    prev.textContent = "◀";
    prev.hidden = isTrashView || isObsidianView;
    prev.addEventListener("click", () => {
      if (viewMode === "month") anchor = new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1);
      else anchor.setDate(anchor.getDate() - 7);
      render();
    });
    const next = document.createElement("button");
    next.type = "button";
    next.className = "rme-cal-btn rme-cal-btn--ghost";
    next.setAttribute("aria-label", "Next");
    next.textContent = "▶";
    next.hidden = isTrashView || isObsidianView;
    next.addEventListener("click", () => {
      if (viewMode === "month") anchor = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1);
      else anchor.setDate(anchor.getDate() + 7);
      render();
    });
    const today = document.createElement("button");
    today.type = "button";
    today.className = "rme-cal-btn";
    today.textContent = "Today";
    today.hidden = isTrashView || isObsidianView;
    today.addEventListener("click", () => {
      anchor = new Date();
      pickedDay = isoDateOnly(new Date());
      render();
    });
    const obsidianBtn = document.createElement("button");
    obsidianBtn.type = "button";
    obsidianBtn.className =
      "rme-cal-btn rme-cal-btn--obsidian" + (isObsidianView ? " rme-cal-btn--active" : "");
    const obsidianBtnEmoji = document.createElement("span");
    obsidianBtnEmoji.className = "rme-cal-obsidian-btn-emoji";
    obsidianBtnEmoji.textContent = "📓";
    obsidianBtnEmoji.setAttribute("aria-hidden", "true");
    const obsidianBtnLabel = document.createElement("span");
    obsidianBtnLabel.className = "rme-cal-obsidian-btn-text";
    obsidianBtnLabel.textContent = "Obsidian view";
    obsidianBtn.appendChild(obsidianBtnEmoji);
    obsidianBtn.appendChild(obsidianBtnLabel);
    obsidianBtn.setAttribute("aria-label", "Obsidian view — notes, to-dos, reminders, and graph");
    obsidianBtn.setAttribute("aria-pressed", isObsidianView ? "true" : "false");
    obsidianBtn.title = isObsidianView
      ? "Back to My planner"
      : "Obsidian view — notes, to-dos, reminders, and graph";
    obsidianBtn.hidden = isTrashView;
    obsidianBtn.addEventListener("click", () => {
      if (viewMode === "obsidian") {
        viewMode =
          calendarViewBeforeObsidian === "week" ? "week" : "month";
      } else {
        calendarViewBeforeObsidian =
          viewMode === "week" ? "week" : "month";
        viewMode = "obsidian";
      }
      render({ force: true });
    });
    left.appendChild(title);
    left.appendChild(prev);
    left.appendChild(next);
    left.appendChild(today);

    const center = document.createElement("div");
    center.className = "rme-cal-toolbar-center";
    center.hidden = isTrashView;
    center.appendChild(obsidianBtn);

    const seg = document.createElement("div");
    seg.className = "rme-cal-seg";
    seg.hidden = isObsidianView;
    for (const m of /** @type {const} */ (["month", "week", "trash"])) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = m === "month" ? "Month" : m === "week" ? "Week" : "Trash";
      if (viewMode === m) b.classList.add("rme-cal-seg--on");
      b.addEventListener("click", () => {
        viewMode = m;
        render();
      });
      seg.appendChild(b);
    }

    const searchWrap = document.createElement("div");
    searchWrap.className = "rme-cal-search-wrap";
    searchWrap.hidden = isTrashView || isObsidianView;

    const searchIcon = document.createElement("span");
    searchIcon.className = "rme-cal-search-icon";
    searchIcon.setAttribute("aria-hidden", "true");
    searchIcon.innerHTML =
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7.5"/><path d="m20 20-4.2-4.2"/></svg>';

    const search = document.createElement("input");
    search.type = "search";
    search.className = "rme-cal-search";
    search.id = "rmeCalSearchInput";
    search.setAttribute("aria-label", "Search calendar");
    search.value = searchQ;
    search.addEventListener("input", () => {
      searchQ = search.value;
      libPage = 0;
      window.clearTimeout(calSearchDebounce);
      calSearchDebounce = window.setTimeout(() => {
        applySearchCalendarFocus();
        render();
      }, 320);
    });

    searchWrap.appendChild(searchIcon);
    searchWrap.appendChild(search);

    const right = document.createElement("div");
    right.className = "rme-cal-toolbar-right";
    right.appendChild(seg);
    right.appendChild(searchWrap);

    toolbar.appendChild(left);
    toolbar.appendChild(center);
    toolbar.appendChild(right);
    root.appendChild(toolbar);

    const body = document.createElement("div");
    body.className =
      "rme-cal-body" +
      (isTrashView ? " rme-cal-body--trash" : "") +
      (isObsidianView ? " rme-cal-body--obsidian" : "");
    if (isObsidianView) {
      if (!obsidianHostEl) {
        obsidianHostEl = document.createElement("div");
      }
      body.appendChild(obsidianHostEl);
      const obs = window.rmeObsidianPlanner;
      const obsBridge = {
        getEvents: () => events,
        getDayPages: () => dayPages,
        getObsidianNotes: () => obsidianNotes.notes,
        saveEvents: () => {
          saveEvents();
          eventsRev++;
        },
        saveDayPages: () => {
          saveDayPages();
          dayPagesRev++;
        },
        openCalendarDay: (ymd) => {
          const key = String(ymd).slice(0, 10);
          if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return;
          viewMode = "month";
          pickedDay = key;
          try {
            const [y, mo, d] = pickedDay.split("-").map(Number);
            anchor = new Date(y, mo - 1, d);
          } catch {
            anchor = new Date();
          }
          render({ force: true });
          openDaySheet(key);
        },
      };
      if (obs && typeof obs.mount === "function" && obsidianHostEl.dataset.rmeObsMounted !== "1") {
        obs.mount(obsidianHostEl, obsBridge);
      } else if (obs && typeof obs.refresh === "function") {
        obs.refresh(obsBridge);
      } else {
        obsidianHostEl.textContent = "Loading Obsidian view…";
      }
    } else {
      const main = document.createElement("div");
      main.className = "rme-cal-main rme-cal-glass-panel";
      if (viewMode === "trash") {
        renderTrash(main);
      } else if (viewMode === "month") {
        renderMonth(main);
      } else {
        renderWeek(main);
      }
      body.appendChild(main);
      if (!isTrashView) {
        const side = document.createElement("aside");
        side.className = "rme-cal-side rme-cal-glass-panel";
        renderSide(side);
        body.appendChild(side);
      }
    }
    root.appendChild(body);

    if (isTrashView) {
      const hint = document.createElement("p");
      hint.className = "rme-cal-hint";
      hint.textContent =
        "Trash is stored on this device. Restore merges data back; delete forever removes the backup only.";
      root.appendChild(hint);
    }

    if (restoreSearch && !isTrashView) {
      const s2 = document.getElementById("rmeCalSearchInput");
      if (s2 instanceof HTMLInputElement) {
        s2.focus();
        try {
          const a = typeof selA === "number" ? selA : s2.value.length;
          const b = typeof selB === "number" ? selB : s2.value.length;
          s2.setSelectionRange(a, b);
        } catch {
          /* ignore */
        }
      }
    }
  }

  async function boot() {
    const root = document.getElementById("rmeCalendarRoot");
    if (!root || root.dataset.rmeCalendarReady === "1") return;
    root.dataset.rmeCalendarReady = "1";
    await ensurePlannerFileStore();
    await reloadAllPlannerData();
    render({ force: true });
    startReminderAlarmLoop();
    void ensureNotificationPermission();

    window.addEventListener("rme-cal-settings-changed", (ev) => {
      const d =
        ev &&
        typeof ev === "object" &&
        "detail" in ev &&
        ev.detail &&
        typeof ev.detail === "object" &&
        !Array.isArray(ev.detail)
          ? /** @type {{ weekStartsOn?: unknown; reminderSound?: unknown }} */ (
              ev.detail
            )
          : null;
      if (!d) return;
      const w = Number(d.weekStartsOn);
      if (w === 0 || w === 1) {
        settings.weekStartsOn = w;
      }
      if (d.reminderSound != null) {
        settings.reminderSound = normalizeReminderSoundId(d.reminderSound);
      }
      render();
    });

    const calNf = /** @type {{ onSnoozeFromOs?: (h: (d: unknown) => void) => () => void } | undefined} */ (
      window.calendarNotificationApi
    );
    if (calNf && typeof calNf.onSnoozeFromOs === "function") {
      calNf.onSnoozeFromOs((detail) => {
        const d =
          detail && typeof detail === "object" && !Array.isArray(detail)
            ? /** @type {{ tag?: unknown; preset?: unknown }} */ (detail)
            : {};
        const tag = typeof d.tag === "string" ? d.tag : "";
        const preset = d.preset;
        if (preset !== "10m" && preset !== "1h" && preset !== "tomorrow") return;
        const parsed = parseOccurrenceKey(tag);
        if (!parsed) return;
        applyReminderSnooze(parsed.evId, parsed.dayKey, parsed.hhmm, preset);
      });
    }

    const authGate = document.getElementById("authGate");
    if (authGate && typeof MutationObserver !== "undefined") {
      const authObs = new MutationObserver(() => {
        if (authGate.hidden) {
          void ensureNotificationPermission();
          runReminderAlarmTickSoon();
        }
      });
      authObs.observe(authGate, { attributes: true, attributeFilter: ["hidden"] });
    }

    const pane = document.getElementById("notionWsPaneCalendar");
    if (pane && typeof MutationObserver !== "undefined") {
      let plannerPaneWasVisible = pane.classList.contains("notion-ws-pane--visible");
      const obs = new MutationObserver(() => {
        const vis = pane.classList.contains("notion-ws-pane--visible");
        if (!vis) {
          plannerPaneWasVisible = false;
          return;
        }
        if (plannerPaneWasVisible) {
          return;
        }
        plannerPaneWasVisible = true;
        void (async () => {
          if (getPlannerScopeId()) {
            await ensurePlannerFileStore();
          }
          await reloadAllPlannerData();
          render({ force: true });
          tickReminderAlarms();
        })().catch((e) => {
          console.warn("planner pane reload:", e);
        });
      });
      obs.observe(pane, { attributes: true, attributeFilter: ["class"] });
    }

    window.addEventListener("rme-planner-scope-changed", () => {
      void reloadPlannerForCurrentScope().catch((e) => {
        console.warn("planner scope reload:", e);
      });
    });
  }

  /** Shared planner modals — same day card + reminder editor in admin and teacher portals. */
  window.rmePlannerUi = {
    openDaySheet,
    openReminderEditor(ev, dayKey) {
      if (typeof dayKey === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dayKey.trim())) {
        pickedDay = dayKey.trim();
      }
      openModal(ev ?? null);
    },
    refresh(opts) {
      render(opts && opts.force ? { force: true } : undefined);
    },
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      void boot();
    }, { once: true });
  } else {
    void boot();
  }
})();
