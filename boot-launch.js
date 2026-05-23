/**
 * Loads renderer.js as soon as the document is parsed so the app becomes interactive
 * quickly. The main stylesheet is already in flight from <head>; deferring an extra
 * animation frame only delayed the large bundle without measurable paint benefit here.
 */
(function rmeBootLaunch() {
  function loadRenderer() {
    const idle = document.createElement("script");
    idle.src = "renderer-idle-power.js";
    idle.addEventListener("load", function onIdlePowerLoaded() {
      idle.removeEventListener("load", onIdlePowerLoaded);
      loadRendererBundle();
    });
    document.body.appendChild(idle);
  }

  function loadRendererBundle() {
    const s = document.createElement("script");
    s.src = "renderer.js";
    s.addEventListener("load", function onRendererLoaded() {
      s.removeEventListener("load", onRendererLoaded);
      const c = document.createElement("script");
      c.src = "renderer-calendar.js";
      c.addEventListener("load", function onCalendarLoaded() {
        c.removeEventListener("load", onCalendarLoaded);
        const lk = document.createElement("script");
        lk.src = "obsidian-links.js";
        lk.addEventListener("load", function onLinksLoaded() {
          lk.removeEventListener("load", onLinksLoaded);
          const o = document.createElement("script");
          o.src = "renderer-obsidian-view.js";
          o.addEventListener("load", function onObsidianLoaded() {
            o.removeEventListener("load", onObsidianLoaded);
            const g = document.createElement("script");
            g.src = "renderer-settings.js";
            document.body.appendChild(g);
          });
          document.body.appendChild(o);
        });
        document.body.appendChild(lk);
      });
      document.body.appendChild(c);
    });
    document.body.appendChild(s);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadRenderer, { once: true });
  } else {
    loadRenderer();
  }
})();
