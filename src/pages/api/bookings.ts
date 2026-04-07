import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

const DATA_PATH = path.join(process.cwd(), 'public/config/bookings.json');

interface Booking {
  id: string;
  timestamp: string;
  name: string;
  phone: string;
  zip: string;
  email: string;
  service: string;
  serviceId: string;
  tier: string;
  price: string;
  source: string; // "quote" | "chat"
  status: string; // "new" | "contacted" | "scheduled" | "completed" | "cancelled"
  notes: string;
}

function readBookings(): Booking[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeBookings(bookings: Booking[]) {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(DATA_PATH, JSON.stringify(bookings, null, 2));
}

// GET — list all bookings (newest first)
export const GET: APIRoute = async ({ url }) => {
  const bookings = readBookings();
  const status = url.searchParams.get('status');
  const filtered = status ? bookings.filter(b => b.status === status) : bookings;
  // newest first
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return new Response(JSON.stringify(filtered), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

// POST — create new booking (from widget)
export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const phone = String(body.phone || '').replace(/\D/g, '');
  if (phone.length < 10) {
    return new Response(JSON.stringify({ error: 'Phone required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const booking: Booking = {
    id: 'b_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    name: String(body.name || '').trim(),
    phone,
    zip: String(body.zip || '').trim(),
    email: String(body.email || '').trim(),
    service: String(body.service || ''),
    serviceId: String(body.serviceId || ''),
    tier: String(body.tier || ''),
    price: String(body.price || ''),
    source: String(body.source || 'quote'),
    status: 'new',
    notes: '',
  };

  const bookings = readBookings();
  bookings.push(booking);
  writeBookings(bookings);

  return new Response(JSON.stringify({ ok: true, id: booking.id }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};

// PATCH — update status/notes on existing booking
export const PATCH: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const id = String(body.id || '');
  if (!id) {
    return new Response(JSON.stringify({ error: 'id required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const bookings = readBookings();
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (body.status !== undefined) bookings[idx].status = String(body.status);
  if (body.notes !== undefined) bookings[idx].notes = String(body.notes);

  writeBookings(bookings);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
