import type { APIRoute } from 'astro';
import { getRaw, setJSON, isKvEnabled } from '../../lib/storage';

export const prerender = false;

const STORAGE_KEY = 'services';
const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

export const GET: APIRoute = async () => {
  const raw = await getRaw(STORAGE_KEY);
  if (raw == null) {
    return new Response(JSON.stringify({ error: 'Failed to read config.' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
  return new Response(raw, { status: 200, headers: JSON_HEADERS });
};

export const PUT: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON.' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  if (!body.services || !Array.isArray(body.services)) {
    return new Response(JSON.stringify({ error: 'Invalid config: services array required.' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }
  if (!body.contact || typeof body.contact !== 'object') {
    return new Response(JSON.stringify({ error: 'Invalid config: contact object required.' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const ok = await setJSON(STORAGE_KEY, body);
  if (!ok) {
    return new Response(
      JSON.stringify({
        error: isKvEnabled
          ? 'KV write failed — check KV_REST_API_URL/TOKEN.'
          : 'Config storage is read-only in this environment. Attach Vercel KV to enable saves.',
      }),
      { status: 503, headers: JSON_HEADERS }
    );
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
};
