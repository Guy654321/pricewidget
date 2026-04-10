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
 * Fast LCP: nothing is rendered until .open() is called.
 * Iframe is lazy-loaded and panel animates in from the bottom-right (desktop)
 * or full-screen (mobile ≤520px).
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
    ".ds-w-overlay{position:fixed;inset:0;z-index:2147483646;background:rgba(10,15,25,0.45);opacity:0;pointer-events:none;transition:opacity .22s ease;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);}",
    ".ds-w-overlay[data-open='true']{opacity:1;pointer-events:auto;}",
    ".ds-w-wrap{position:fixed;bottom:0;right:0;width:420px;max-width:100vw;height:680px;max-height:100dvh;z-index:2147483647;transform:translateY(24px);opacity:0;pointer-events:none;transition:opacity .22s ease,transform .22s ease;}",
    ".ds-w-wrap[data-open='true']{transform:translateY(0);opacity:1;pointer-events:auto;}",
    ".ds-w-wrap iframe{width:100%;height:100%;border:0;border-radius:16px 16px 0 0;box-shadow:0 -8px 48px rgba(0,0,0,0.22);background:#fff;display:block;}",
    ".ds-w-close{position:fixed;top:16px;right:16px;z-index:2147483647;width:36px;height:36px;border-radius:999px;border:0;background:rgba(255,255,255,0.96);box-shadow:0 2px 10px rgba(0,0,0,0.15);cursor:pointer;display:none;align-items:center;justify-content:center;font-size:22px;line-height:1;color:#0E121B;padding:0;}",
    ".ds-w-wrap[data-open='true'] ~ .ds-w-close{display:flex;}",
    "@media(max-width:520px){.ds-w-wrap{width:100vw;height:100dvh;top:0;bottom:0;right:0;left:0;transform:translateY(100%);}.ds-w-wrap[data-open='true']{transform:translateY(0);}.ds-w-wrap iframe{border-radius:0;}.ds-w-overlay{display:none;}}",
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
    iframe.setAttribute("loading", "lazy");
    iframe.setAttribute("title", "Derby Strong Instant Quote");
    iframe.setAttribute("allow", "camera; clipboard-write");
    wrap.appendChild(iframe);

    closeBtn = document.createElement("button");
    closeBtn.className = "ds-w-close";
    closeBtn.setAttribute("aria-label", "Close quote panel");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", api.close);

    document.body.appendChild(overlay);
    document.body.appendChild(wrap);
    document.body.appendChild(closeBtn);
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
    },
    toggle: function () { isOpen ? api.close() : api.open(); }
  };

  // Messages from the widget iframe
  window.addEventListener("message", function (e) {
    if (e.origin !== ORIGIN) return;
    var d = e.data;
    if (d === "ds-widget-close" || (d && d.type === "ds-widget-close")) api.close();
  });

  window.DerbyWidget = api;

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
