import type { APIRoute } from 'astro';
import { getRaw, setJSON, isKvEnabled, getRawFromKv, getRawFromFs } from '../../lib/storage';

export const prerender = false;

const STORAGE_KEY = 'services';
const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store, max-age=0',
} as const;

export const GET: APIRoute = async ({ url }) => {
  // Debug mode: ?source=debug shows where data is coming from
  if (url.searchParams.get('source') === 'debug') {
    const kvRaw = await getRawFromKv(STORAGE_KEY);
    const fsRaw = await getRawFromFs(STORAGE_KEY);
    return new Response(JSON.stringify({
      kvEnabled: isKvEnabled,
      kvHasData: kvRaw != null,
      kvDataLength: kvRaw?.length ?? 0,
      fsDataLength: fsRaw?.length ?? 0,
      servingFrom: kvRaw != null ? 'kv' : 'bundled-file',
    }), { status: 200, headers: JSON_HEADERS });
  }

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

  // Back up current config before overwriting, so we can restore if needed
  try {
    const currentRaw = await getRaw(STORAGE_KEY);
    if (currentRaw) {
      await setJSON(STORAGE_KEY + ':backup', JSON.parse(currentRaw));
      await setJSON(STORAGE_KEY + ':backup_time', { t: new Date().toISOString() });
    }
  } catch (backupErr) {
    console.error('[config] Backup failed (continuing with save):', backupErr);
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

// POST — restore config from backup
export const POST: APIRoute = async ({ url }) => {
  const action = url.searchParams.get('action');
  if (action === 'restore') {
    const backup = await getRaw(STORAGE_KEY + ':backup');
    if (!backup) {
      return new Response(JSON.stringify({ error: 'No backup found.' }), {
        status: 404, headers: JSON_HEADERS,
      });
    }
    const parsed = JSON.parse(backup);
    const ok = await setJSON(STORAGE_KEY, parsed);
    if (!ok) {
      return new Response(JSON.stringify({ error: 'Restore failed.' }), {
        status: 500, headers: JSON_HEADERS,
      });
    }
    return new Response(JSON.stringify({ ok: true, restored: true }), {
      status: 200, headers: JSON_HEADERS,
    });
  }
  return new Response(JSON.stringify({ error: 'Unknown action.' }), {
    status: 400, headers: JSON_HEADERS,
  });
};
