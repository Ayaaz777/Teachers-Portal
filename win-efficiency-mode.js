/**
 * Windows 11 Efficiency Mode (EcoQoS) — green leaf in Task Manager.
 * Uses SetProcessInformation(ProcessPowerThrottling) + optional IDLE priority.
 */
"use strict";

const PROCESS_POWER_THROTTLING_CURRENT_VERSION = 1;
const PROCESS_POWER_THROTTLING_EXECUTION_SPEED = 0x1;
const ProcessPowerThrottling = 4;
const PROCESS_SET_INFORMATION = 0x0200;
const IDLE_PRIORITY_CLASS = 0x40;
const NORMAL_PRIORITY_CLASS = 0x20;

/** @type {ReturnType<typeof loadKernel32> | null} */
let kernel = null;

function loadKernel32() {
  if (kernel) {
    return kernel;
  }
  const koffi = require("koffi");
  const lib = koffi.load("kernel32.dll");

  const PROCESS_POWER_THROTTLING_STATE = koffi.struct(
    "PROCESS_POWER_THROTTLING_STATE",
    {
      Version: "uint32",
      ControlMask: "uint32",
      StateMask: "uint32",
    },
  );

  kernel = {
    PROCESS_POWER_THROTTLING_STATE,
    SetProcessInformation: lib.func(
      "bool __stdcall SetProcessInformation(void *hProcess, uint32 ProcessInformationClass, PROCESS_POWER_THROTTLING_STATE *ProcessInformation, uint32 ProcessInformationSize)",
    ),
    GetCurrentProcess: lib.func("void * __stdcall GetCurrentProcess()"),
    OpenProcess: lib.func(
      "void * __stdcall OpenProcess(uint32 dwDesiredAccess, bool bInheritHandle, uint32 dwProcessId)",
    ),
    CloseHandle: lib.func("bool __stdcall CloseHandle(void *hObject)"),
    SetPriorityClass: lib.func(
      "bool __stdcall SetPriorityClass(void *hProcess, uint32 dwPriorityClass)",
    ),
  };
  return kernel;
}

/**
 * @param {ReturnType<typeof loadKernel32>} api
 * @param {unknown} hProcess
 * @param {boolean} enable
 */
function setEcoQoS(api, hProcess, enable) {
  const state = {
    Version: PROCESS_POWER_THROTTLING_CURRENT_VERSION,
    ControlMask: PROCESS_POWER_THROTTLING_EXECUTION_SPEED,
    StateMask: enable ? PROCESS_POWER_THROTTLING_EXECUTION_SPEED : 0,
  };
  return api.SetProcessInformation(
    hProcess,
    ProcessPowerThrottling,
    state,
    12,
  );
}

/**
 * @param {ReturnType<typeof loadKernel32>} api
 * @param {unknown} hProcess
 * @param {"background" | "foreground"} profile
 */
function applyProfileToHandle(api, hProcess, profile) {
  setEcoQoS(api, hProcess, true);
  const priority =
    profile === "background" ? IDLE_PRIORITY_CLASS : NORMAL_PRIORITY_CLASS;
  api.SetPriorityClass(hProcess, priority);
}

/**
 * @param {unknown} hProcess
 * @param {"background" | "foreground"} [profile]
 */
function applyToHandle(hProcess, profile = "background") {
  const api = loadKernel32();
  applyProfileToHandle(api, hProcess, profile);
}

/**
 * @param {number} pid
 * @param {"background" | "foreground"} [profile]
 * @returns {{ ok: boolean; reason?: string }}
 */
function applyToPid(pid, profile = "background") {
  if (process.platform !== "win32") {
    return { ok: false, reason: "not-win32" };
  }
  const n = Number(pid);
  if (!Number.isFinite(n) || n <= 0) {
    return { ok: false, reason: "bad-pid" };
  }
  try {
    const api = loadKernel32();
    const h = api.OpenProcess(PROCESS_SET_INFORMATION, false, n);
    if (!h) {
      return { ok: false, reason: "OpenProcess failed" };
    }
    try {
      applyProfileToHandle(api, h, profile);
      return { ok: true };
    } finally {
      api.CloseHandle(h);
    }
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : String(e),
    };
  }
}

/** @param {"background" | "foreground"} [profile] */
function applyToCurrentProcess(profile = "background") {
  if (process.platform !== "win32") {
    return { ok: false, reason: "not-win32" };
  }
  try {
    const api = loadKernel32();
    applyProfileToHandle(api, api.GetCurrentProcess(), profile);
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      reason: e instanceof Error ? e.message : String(e),
    };
  }
}

/**
 * @param {import("electron").BrowserWindow} win
 * @param {"background" | "foreground"} [profile]
 */
function applyToBrowserWindow(win, profile = "background") {
  if (!win || win.isDestroyed()) {
    return { ok: false, reason: "no-window" };
  }
  const results = [applyToCurrentProcess(profile)];
  try {
    const pid = win.webContents.getOSProcessId();
    results.push(applyToPid(pid, profile));
  } catch {
    /* ignore */
  }
  const ok = results.some((r) => r.ok);
  return ok
    ? { ok: true }
    : { ok: false, reason: results.map((r) => r.reason).filter(Boolean).join("; ") };
}

module.exports = {
  applyToCurrentProcess,
  applyToPid,
  applyToBrowserWindow,
};
