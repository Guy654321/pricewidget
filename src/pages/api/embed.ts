import type { APIRoute } from 'astro';

export const prerender = false;

/**
 * Returns a lightweight JS loader that embeds the widget via iframe.
 *
 * Usage on host site:
 *   <script src="https://your-widget-domain.com/api/embed" async></script>
 *
 * The loader:
 * 1. Immediately renders the trigger button in native DOM (fast LCP)
 * 2. On click, opens the widget in a full-height iframe overlay
 * 3. Communication via postMessage for booking confirmations
 */
export const GET: APIRoute = async ({ url }) => {
  const baseUrl = `${url.protocol}//${url.host}`;

  const script = `
(function(){
  "use strict";
  if(window.__DS_EMBED_LOADED) return;
  window.__DS_EMBED_LOADED = true;

  var BASE = ${JSON.stringify(baseUrl)};

  // ── Inject trigger button styles (inline, no external CSS fetch) ──
  var style = document.createElement("style");
  style.textContent = \`
    .ds-embed-trigger {
      position: fixed;
      bottom: 24px; right: 24px;
      z-index: 9998;
      display: flex; align-items: center; gap: 9px;
      padding: 14px 22px;
      background: #FFB703;
      color: #0E121B;
      border: none; border-radius: 999px;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 15px; font-weight: 800;
      letter-spacing: 0.01em;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(255,183,3,0.45), 0 2px 6px rgba(0,0,0,0.12);
      min-height: 50px;
      transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.15s;
      -webkit-tap-highlight-color: transparent;
    }
    .ds-embed-trigger:hover {
      background: #e5a503;
      transform: translateY(-2px);
      box-shadow: 0 6px 28px rgba(255,183,3,0.55), 0 3px 8px rgba(0,0,0,0.14);
    }
    .ds-embed-trigger svg { flex-shrink: 0; }
    /* Desktop default: centered, wide panel that comfortably fits 3 tier cards side-by-side */
    .ds-embed-iframe-wrap {
      position: fixed;
      top: 50%; left: 50%;
      width: min(1080px, calc(100vw - 48px));
      height: min(720px, calc(100dvh - 48px));
      z-index: 9999;
      transform: translate(-50%, calc(-50% + 16px));
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.22s ease, transform 0.22s ease;
    }
    .ds-embed-iframe-wrap[data-open="true"] {
      opacity: 1;
      pointer-events: auto;
      transform: translate(-50%, -50%);
    }
    .ds-embed-iframe-wrap iframe {
      width: 100%; height: 100%;
      border: none;
      border-radius: 18px;
      box-shadow: 0 24px 64px rgba(10,15,25,0.35), 0 4px 16px rgba(10,15,25,0.18);
      background: #fff;
      display: block;
    }
    /* Tablet: side panel */
    @media (max-width: 1024px) {
      .ds-embed-iframe-wrap {
        top: auto; left: auto;
        bottom: 0; right: 0;
        width: 480px;
        height: min(760px, 100dvh);
        transform: translateY(24px);
      }
      .ds-embed-iframe-wrap[data-open="true"] {
        transform: translateY(0);
      }
      .ds-embed-iframe-wrap iframe {
        border-radius: 18px 18px 0 0;
      }
    }
    @media (max-width: 520px) {
      .ds-embed-trigger {
        bottom: 16px; right: 16px;
        padding: 10px 16px;
        font-size: 13px;
        min-height: 42px;
        gap: 6px;
      }
      .ds-embed-trigger svg { width: 14px; height: 14px; }
      .ds-embed-iframe-wrap {
        width: 100vw; height: 100dvh;
        bottom: 0; right: 0;
        transform: translateY(100%);
      }
      .ds-embed-iframe-wrap[data-open="true"] {
        transform: translateY(0);
      }
      .ds-embed-iframe-wrap iframe {
        border-radius: 0;
      }
    }
  \`;
  document.head.appendChild(style);

  // ── Create trigger button (native DOM — best LCP) ──
  var btn = document.createElement("button");
  btn.className = "ds-embed-trigger";
  btn.setAttribute("aria-label", "Get an instant quote");
  btn.innerHTML = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2v11h3v9l7-12h-4l4-8z"/></svg><span>Instant Quote</span>';
  document.body.appendChild(btn);

  // ── Iframe wrapper (lazy — only created on first click) ──
  var wrap = null;
  var iframe = null;
  var isOpen = false;

  function open() {
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.className = "ds-embed-iframe-wrap";
      iframe = document.createElement("iframe");
      iframe.src = BASE + "/?embed=1";
      iframe.setAttribute("loading", "lazy");
      iframe.setAttribute("title", "Derby Strong Instant Quote");
      iframe.setAttribute("allow", "camera");
      wrap.appendChild(iframe);
      document.body.appendChild(wrap);
    }
    isOpen = true;
    wrap.dataset.open = "true";
    btn.style.display = "none";
  }

  function close() {
    isOpen = false;
    if (wrap) wrap.dataset.open = "false";
    btn.style.display = "flex";
  }

  btn.addEventListener("click", open);

  // Listen for close messages from the widget iframe
  window.addEventListener("message", function(e) {
    if (e.origin !== new URL(BASE).origin) return;
    if (e.data === "ds-widget-close") close();
    if (e.data && e.data.type === "ds-widget-close") close();
  });

  // ── Nudge (8s delay, once per session) ──
  if (!sessionStorage.getItem("ds_nudge_dismissed")) {
    setTimeout(function() {
      if (isOpen) return;
      var nudge = document.createElement("div");
      nudge.style.cssText = "position:fixed;bottom:80px;right:24px;z-index:9998;background:#0F3D3E;color:#fff;padding:12px 34px 12px 16px;border-radius:10px;font-family:system-ui,sans-serif;font-size:14px;font-weight:500;box-shadow:0 4px 20px rgba(0,0,0,0.15);cursor:pointer;max-width:260px;opacity:0;transition:opacity 0.3s ease;";
      nudge.textContent = "Need a quick quote? Takes 30 seconds \\u2192";
      var closeBtn = document.createElement("button");
      closeBtn.textContent = "\\u00d7";
      closeBtn.style.cssText = "position:absolute;top:4px;right:6px;background:none;border:none;color:rgba(255,255,255,0.6);font-size:16px;cursor:pointer;padding:2px;";
      closeBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        nudge.remove();
        sessionStorage.setItem("ds_nudge_dismissed", "1");
      });
      nudge.appendChild(closeBtn);
      nudge.addEventListener("click", function() { nudge.remove(); open(); });
      document.body.appendChild(nudge);
      requestAnimationFrame(function() { nudge.style.opacity = "1"; });
    }, 8000);
  }
})();
`;

  return new Response(script, {
    status: 200,
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300, s-maxage=600',
    },
  });
};
