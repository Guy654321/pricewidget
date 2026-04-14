import type { APIRoute } from 'astro';
import { dispatchLeadNotifications } from '../../lib/notifications';
import { getList, setJSON, appendToList } from '../../lib/storage';

export const prerender = false;

const STORAGE_KEY = 'bookings';

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

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

// GET — list all bookings (newest first)
export const GET: APIRoute = async ({ url }) => {
  const bookings = await getList<Booking>(STORAGE_KEY);
  const status = url.searchParams.get('status');
  const filtered = status ? bookings.filter((b) => b.status === status) : bookings;
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return new Response(JSON.stringify(filtered), { status: 200, headers: JSON_HEADERS });
};

// POST — create new booking (from widget)
export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const phone = String(body.phone || '').replace(/\D/g, '');
  if (phone.length < 10) {
    return new Response(JSON.stringify({ error: 'Phone required' }), {
      status: 400,
      headers: JSON_HEADERS,
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

  await appendToList(STORAGE_KEY, booking);

  // Fire owner email + owner SMS + customer confirmation SMS in parallel.
  // Never block or fail the booking response if a provider hiccups.
  let notifications: Record<string, unknown> = {};
  try {
    const results = await dispatchLeadNotifications({
      name: booking.name,
      phone: booking.phone,
      zip: booking.zip,
      email: booking.email,
      service: booking.service,
      tier: booking.tier,
      price: booking.price,
      source: booking.source,
    });
    // Extract results from Promise.allSettled
    for (const [key, result] of Object.entries(results)) {
      notifications[key] = result.status === 'fulfilled' ? result.value : { ok: false, error: String(result.reason) };
    }
  } catch (err) {
    console.error('[bookings] Notification dispatch error:', err);
    notifications = { error: String(err) };
  }

  return new Response(JSON.stringify({ ok: true, id: booking.id, notifications }), {
    status: 201,
    headers: JSON_HEADERS,
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
      headers: JSON_HEADERS,
    });
  }

  const id = String(body.id || '');
  if (!id) {
    return new Response(JSON.stringify({ error: 'id required' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const bookings = await getList<Booking>(STORAGE_KEY);
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) {
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: JSON_HEADERS,
    });
  }

  if (body.status !== undefined) bookings[idx].status = String(body.status);
  if (body.notes !== undefined) bookings[idx].notes = String(body.notes);

  await setJSON(STORAGE_KEY, bookings);

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
};
