import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Headless embed script — NO floating trigger button.
 *
 * Usage on host site:
 *   <script src="https://widget.derbystrong.com/api/widget.js" async></script>
 *
 * Then hook up your own button:
 *   <button onclick="DerbyWidget.open()">Get Instant Quote</button>
 *
 * Public API (window.DerbyWidget):
 *   .open()    — open the quote panel (lazy-creates iframe on first call)
 *   .close()   — close the panel
 *   .toggle()  — toggle open/close
 *   .ready     — boolean, true once DOM is ready
 *
 * Fast LCP: no blocking layout/content changes on initial render.
 * Iframe is mounted off-screen in idle time so first open is instant, then
 * panel animates in from the bottom-right (desktop) or full-screen (mobile).
 */
export const GET: APIRoute = async ({ url }) => {
  const baseUrl = `${url.protocol}//${url.host}`;

  const script = `
(function(){
  "use strict";
  if (window.DerbyWidget && window.DerbyWidget.__loaded) return;

  var BASE = ${JSON.stringify(baseUrl)};
  var ORIGIN = new URL(BASE).origin;

  // ── Inject minimal styles once ───────────────────────────────
  var style = document.createElement("style");
  style.setAttribute("data-derby-widget", "");
  style.textContent = [
    ".ds-w-overlay{position:fixed;inset:0;z-index:2147483646;background:rgba(10,15,25,0.45);opacity:0;pointer-events:none;transition:opacity .25s ease;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);}",
    ".ds-w-overlay[data-open='true']{opacity:1;pointer-events:auto;}",
    /* Desktop: right-side panel */
    ".ds-w-wrap{position:fixed;top:0;right:0;bottom:0;width:min(520px,100vw);z-index:2147483647;transform:translateX(100%);opacity:1;pointer-events:none;transition:transform .3s cubic-bezier(.4,0,.2,1);}",
    ".ds-w-wrap[data-open='true']{transform:translateX(0);pointer-events:auto;}",
    /* Wide mode for pricing tiers — centered panel */
    "@media(min-width:521px){.ds-w-wrap[data-wide='true']{top:50%;right:auto;left:50%;bottom:auto;width:min(1080px,calc(100vw - 48px));height:min(720px,calc(100dvh - 48px));transform:translate(-50%,-50%);border-radius:18px;overflow:hidden;}.ds-w-wrap[data-wide='true'][data-open='true']{transform:translate(-50%,-50%);}.ds-w-wrap[data-wide='true'] iframe{border-radius:18px;}}",
    ".ds-w-wrap iframe{width:100%;height:100%;border:0;background:#fff;display:block;}",
    ".ds-w-close{position:absolute;top:12px;right:12px;z-index:2;width:36px;height:36px;border-radius:999px;border:0;background:rgba(255,255,255,0.95);box-shadow:0 2px 8px rgba(0,0,0,0.15);cursor:pointer;display:none;align-items:center;justify-content:center;font-size:22px;line-height:1;color:#0E121B;padding:0;transition:background .15s;}",
    ".ds-w-close:hover{background:#fff;box-shadow:0 2px 12px rgba(0,0,0,0.22);}",
    ".ds-w-wrap[data-open='true'] .ds-w-close{display:flex;}",
    /* Phone: full-screen */
    "@media(max-width:520px){.ds-w-wrap{width:100vw;}.ds-w-overlay{display:none;}}",
    "body.ds-w-locked{overflow:hidden!important;}"
  ].join("");
  (document.head || document.documentElement).appendChild(style);

  var overlay = null, wrap = null, iframe = null, closeBtn = null;
  var isOpen = false;
  var mounted = false;

  function mount() {
    if (mounted) return;
    mounted = true;

    overlay = document.createElement("div");
    overlay.className = "ds-w-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.addEventListener("click", api.close);

    wrap = document.createElement("div");
    wrap.className = "ds-w-wrap";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", "Instant Quote");

    iframe = document.createElement("iframe");
    iframe.src = BASE + "/?embed=1";
    iframe.setAttribute("title", "Derby Strong Instant Quote");
    iframe.setAttribute("allow", "camera; clipboard-write");
    wrap.appendChild(iframe);

    closeBtn = document.createElement("button");
    closeBtn.className = "ds-w-close";
    closeBtn.setAttribute("aria-label", "Close quote panel");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", api.close);
    wrap.appendChild(closeBtn);

    document.body.appendChild(overlay);
    document.body.appendChild(wrap);
  }

  function onKey(e) {
    if (e.key === "Escape" && isOpen) api.close();
  }

  var api = {
    __loaded: true,
    ready: true,
    open: function () {
      mount();
      isOpen = true;
      wrap.style.visibility = "visible";
      overlay.dataset.open = "true";
      wrap.dataset.open = "true";
      document.body.classList.add("ds-w-locked");
      document.addEventListener("keydown", onKey);
      try {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "derby_widget_open", source: "host_button" });
      } catch (_) {}
    },
    close: function () {
      if (!mounted) return;
      isOpen = false;
      overlay.dataset.open = "false";
      wrap.dataset.open = "false";
      document.body.classList.remove("ds-w-locked");
      document.removeEventListener("keydown", onKey);
      // Force-hide after transition to prevent stale white panel
      setTimeout(function(){ if(!isOpen && wrap){ wrap.style.visibility="hidden"; } }, 280);
    },
    toggle: function () { isOpen ? api.close() : api.open(); }
  };

  // Messages from the widget iframe
  window.addEventListener("message", function (e) {
    if (e.origin !== ORIGIN) return;
    var d = e.data;
    if (d === "ds-widget-close" || (d && d.type === "ds-widget-close")) api.close();
    // Resize panel based on widget screen (wide for tiers, narrow for others)
    if (d && d.type === "ds-widget-screen" && wrap) {
      var wide = d.screen === "tiers";
      wrap.dataset.wide = wide ? "true" : "false";
    }
  });

  window.DerbyWidget = api;

  // Preload iframe as soon as browser is idle so first interaction is instant.
  if ("requestIdleCallback" in window) {
    requestIdleCallback(function(){ mount(); }, { timeout: 1200 });
  } else {
    setTimeout(function(){ mount(); }, 500);
  }

  // Auto-wire any element with [data-derby-widget="open"]
  function wireAuto() {
    var els = document.querySelectorAll('[data-derby-widget="open"]');
    for (var i = 0; i < els.length; i++) {
      if (els[i].__dsWired) continue;
      els[i].__dsWired = true;
      els[i].addEventListener("click", function (ev) {
        ev.preventDefault();
        api.open();
      });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wireAuto);
  } else {
    wireAuto();
  }
  // Re-scan on mutations so React/Vue-rendered buttons also work
  try {
    var mo = new MutationObserver(wireAuto);
    mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
  } catch (_) {}
})();
`;

  return new Response(script, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
  });
};
