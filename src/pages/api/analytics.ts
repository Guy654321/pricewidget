import type { APIRoute } from 'astro';
import { getList, appendToList, setJSON } from '../../lib/storage';

export const prerender = false;

const STORAGE_KEY = 'analytics';
const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

interface AnalyticsEvent {
  id: string;
  timestamp: string;
  sessionId: string;
  type: string;       // e.g. "screen_view", "button_click", "tier_select", "chat_message", "photo_upload", "drop_off"
  screen?: string;    // current widget screen at time of event
  service?: string;
  serviceId?: string;
  tier?: string;
  price?: string;
  buttonId?: string;
  message?: string;   // chat message text (truncated)
  role?: string;      // "user" | "assistant"
  photoCount?: number;
  metadata?: Record<string, unknown>;
  userAgent?: string;
}

// POST — record an event from the widget
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

  const type = String(body.type || '').slice(0, 64);
  const sessionId = String(body.sessionId || '').slice(0, 64);
  if (!type || !sessionId) {
    return new Response(JSON.stringify({ error: 'type and sessionId required' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const event: AnalyticsEvent = {
    id: 'e_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    timestamp: new Date().toISOString(),
    sessionId,
    type,
    screen: body.screen ? String(body.screen).slice(0, 64) : undefined,
    service: body.service ? String(body.service).slice(0, 128) : undefined,
    serviceId: body.serviceId ? String(body.serviceId).slice(0, 64) : undefined,
    tier: body.tier ? String(body.tier).slice(0, 64) : undefined,
    price: body.price ? String(body.price).slice(0, 32) : undefined,
    buttonId: body.buttonId ? String(body.buttonId).slice(0, 128) : undefined,
    message: body.message ? String(body.message).slice(0, 500) : undefined,
    role: body.role ? String(body.role).slice(0, 16) : undefined,
    photoCount: typeof body.photoCount === 'number' ? body.photoCount : undefined,
    metadata: typeof body.metadata === 'object' && body.metadata !== null
      ? (body.metadata as Record<string, unknown>)
      : undefined,
    userAgent: request.headers.get('user-agent')?.slice(0, 256) || undefined,
  };

  await appendToList(STORAGE_KEY, event, 10000);

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
};

// GET — fetch all events (admin dashboard); supports ?session= filter
export const GET: APIRoute = async ({ url }) => {
  const events = await getList<AnalyticsEvent>(STORAGE_KEY);
  const session = url.searchParams.get('session');
  const filtered = session ? events.filter((e) => e.sessionId === session) : events;
  filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  return new Response(JSON.stringify(filtered), { status: 200, headers: JSON_HEADERS });
};

// DELETE — clear all analytics (admin reset)
export const DELETE: APIRoute = async () => {
  await setJSON(STORAGE_KEY, []);
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
};
