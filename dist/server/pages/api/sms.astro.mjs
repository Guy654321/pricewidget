export { renderers } from '../../renderers.mjs';

const prerender = false;
const JSON_HEADERS = { "Content-Type": "application/json" };
const POST = async ({ request }) => {
  {
    console.log("SMS not configured — skipping confirmation text.");
    return new Response(
      JSON.stringify({ ok: true, skipped: true, reason: "SMS not configured" }),
      { status: 200, headers: JSON_HEADERS }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
