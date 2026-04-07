import fs from 'node:fs';
import path from 'node:path';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const DATA_PATH = path.join(process.cwd(), "public/config/bookings.json");
function readBookings() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function writeBookings(bookings) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(bookings, null, 2));
}
const GET = async ({ url }) => {
  const bookings = readBookings();
  const status = url.searchParams.get("status");
  const filtered = status ? bookings.filter((b) => b.status === status) : bookings;
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return new Response(JSON.stringify(filtered), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
const POST = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const phone = String(body.phone || "").replace(/\D/g, "");
  if (phone.length < 10) {
    return new Response(JSON.stringify({ error: "Phone required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const booking = {
    id: "b_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    name: String(body.name || "").trim(),
    phone,
    zip: String(body.zip || "").trim(),
    email: String(body.email || "").trim(),
    service: String(body.service || ""),
    serviceId: String(body.serviceId || ""),
    tier: String(body.tier || ""),
    price: String(body.price || ""),
    source: String(body.source || "quote"),
    status: "new",
    notes: ""
  };
  const bookings = readBookings();
  bookings.push(booking);
  writeBookings(bookings);
  return new Response(JSON.stringify({ ok: true, id: booking.id }), {
    status: 201,
    headers: { "Content-Type": "application/json" }
  });
};
const PATCH = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const id = String(body.id || "");
  if (!id) {
    return new Response(JSON.stringify({ error: "id required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }
  const bookings = readBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }
  if (body.status !== void 0) bookings[idx].status = String(body.status);
  if (body.notes !== void 0) bookings[idx].notes = String(body.notes);
  writeBookings(bookings);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  PATCH,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
