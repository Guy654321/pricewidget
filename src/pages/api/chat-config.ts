import type { APIRoute } from 'astro';
import { getJSON, setJSON, isKvEnabled } from '../../lib/storage';

export const prerender = false;

const STORAGE_KEY = 'chat';
const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

export const GET: APIRoute = async () => {
  const cfg = (await getJSON<{ systemPrompt?: string }>(STORAGE_KEY)) || { systemPrompt: '' };
  return new Response(JSON.stringify(cfg), { status: 200, headers: JSON_HEADERS });
};

export const PUT: APIRoute = async ({ request }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON.' }), {
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
          : 'Chat config storage is read-only in this environment. Attach Vercel KV to enable saves.',
      }),
      { status: 503, headers: JSON_HEADERS }
    );
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
};
