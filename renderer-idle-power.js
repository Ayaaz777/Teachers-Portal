/**
 * Shared helpers to cut idle CPU — gate polling when the app is hidden or off-page.
 */
(function rmeIdlePowerModule() {
  "use strict";

  /** @param {number} ms @param {() => void} fn @returns {() => void} */
  function debounce(ms, fn) {
    let t = 0;
    return function debounced() {
      window.clearTimeout(t);
      t = window.setTimeout(fn, ms);
    };
  }

  function isDocumentHidden() {
    return document.visibilityState === "hidden";
  }

  function isAuthGateVisible() {
    const g = document.getElementById("authGate");
    return g instanceof HTMLElement && !g.hidden;
  }

  /** App is not interactively in use (minimized tab, another app focused, sign-in gate). */
  function isAppBackgrounded() {
    return isDocumentHidden() || isAuthGateVisible();
  }

  /** @param {string} id */
  function isDomPageVisible(id) {
    const el = document.getElementById(id);
    return el instanceof HTMLElement && !el.hidden;
  }

  /** @param {string} paneId */
  function isNotionWsPaneVisible(paneId) {
    const pane = document.getElementById(paneId);
    if (!(pane instanceof HTMLElement) || pane.hidden) {
      return false;
    }
    return pane.classList.contains("notion-ws-pane--visible");
  }

  /**
   * @param {() => void} fn
   * @param {{ activeMs: number; idleMs?: number; hiddenMs?: number; shouldRun?: () => boolean }} opts
   */
  function runOnAdaptiveInterval(fn, opts) {
    const activeMs = Math.max(250, opts.activeMs);
    const idleMs = Math.max(activeMs, opts.idleMs ?? activeMs * 4);
    const hiddenMs = Math.max(idleMs, opts.hiddenMs ?? idleMs * 3);
    const shouldRun = typeof opts.shouldRun === "function" ? opts.shouldRun : () => true;

    const loop = () => {
      if (shouldRun()) {
        try {
          fn();
        } catch (e) {
          console.warn("rmeIdlePower interval:", e);
        }
      }
      let next = activeMs;
      if (isAppBackgrounded()) {
        next = hiddenMs;
      } else if (!shouldRun()) {
        next = idleMs;
      }
      window.setTimeout(loop, next);
    };
    loop();
  }

  window.rmeIdlePower = {
    debounce,
    isDocumentHidden,
    isAuthGateVisible,
    isAppBackgrounded,
    isDomPageVisible,
    isNotionWsPaneVisible,
    runOnAdaptiveInterval,
  };
})();
