/**
 * Storage adapter — Vercel KV (Upstash Redis) when configured, otherwise
 * falls back to the local filesystem so `astro dev` keeps working without
 * any cloud dependencies.
 *
 * Used by /api/bookings, /api/config, /api/chat-config, and /api/analytics
 * to read/write durable state. Vercel's serverless filesystem is read-only
 * at runtime, which is why production needs KV.
 *
 * Configure in Vercel by attaching a KV (or Upstash Redis) integration to
 * the project — it injects KV_REST_API_URL + KV_REST_API_TOKEN automatically.
 * In dev, leave them unset and the adapter writes to public/config/*.json.
 */

import fs from 'node:fs';
import path from 'node:path';

// ── Upstash REST client (no SDK dep — keeps cold start fast) ──────────────

// Vercel KV / Upstash inject env vars under various prefixes depending on
// how the store was created. Try every known name so it "just works".
function pickEnv(...keys: string[]): string | undefined {
  for (const k of keys) {
    if (process.env[k]) return process.env[k];
  }
  return undefined;
}

const URL_VARS = [
  'KV_REST_API_URL',
  'UPSTASH_REDIS_REST_URL',
  'KV_URL',
  'REDIS_URL',
  // Vercel KV stores sometimes prefix everything with KV_STORAGE_
  'KV_STORAGE_KV_REST_API_URL',
  'KV_STORAGE_KV_URL',
  'KV_STORAGE_REDIS_URL',
];
const TOKEN_VARS = [
  'KV_REST_API_TOKEN',
  'UPSTASH_REDIS_REST_TOKEN',
  'KV_REST_API_READ_ONLY_TOKEN',
  'REDIS_TOKEN',
  'KV_STORAGE_KV_REST_API_TOKEN',
  'KV_STORAGE_KV_REST_API_READ_ONLY_TOKEN',
];

const KV_URL = pickEnv(...URL_VARS);
const KV_TOKEN = pickEnv(...TOKEN_VARS);

export const isKvEnabled = Boolean(KV_URL && KV_TOKEN);
export const kvDebugInfo = {
  urlVar: URL_VARS.find((k) => Boolean(process.env[k])) || null,
  tokenVar: TOKEN_VARS.find((k) => Boolean(process.env[k])) || null,
};

async function kvCommand<T = unknown>(command: (string | number)[]): Promise<T | null> {
  if (!KV_URL || !KV_TOKEN) return null;
  try {
    const res = await fetch(KV_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) {
      console.error('[storage] KV error:', res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { result?: T };
    return (json?.result ?? null) as T | null;
  } catch (err) {
    console.error('[storage] KV fetch error:', err);
    return null;
  }
}

// ── Filesystem fallback ───────────────────────────────────────────────────

function fsPath(key: string): string {
  // key like "config:services" → public/config/services.json
  // key like "bookings"        → public/config/bookings.json
  // key like "analytics"       → public/config/analytics.json
  const safe = key.replace(/[^a-z0-9_:-]/gi, '_').replace(/:/g, '-');
  return path.join(process.cwd(), 'public/config', `${safe}.json`);
}

function fsRead(key: string): string | null {
  try {
    return fs.readFileSync(fsPath(key), 'utf-8');
  } catch {
    return null;
  }
}

function fsWrite(key: string, value: string): boolean {
  try {
    const p = fsPath(key);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, value, 'utf-8');
    return true;
  } catch (err) {
    console.warn('[storage] FS write skipped:', err);
    return false;
  }
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Read a JSON value by key. Returns null if missing or unparseable.
 *
 * When KV is enabled, ONLY reads from KV. Falls back to the bundled
 * file ONLY if KV explicitly returns null (key never written), NOT on
 * transient errors. This prevents stale bundled data from being served
 * and accidentally saved back to KV, overwriting live edits.
 */
export async function getJSON<T = unknown>(key: string): Promise<T | null> {
  if (isKvEnabled) {
    const raw = await kvCommand<string>(['GET', key]);
    if (raw != null) {
      try {
        return JSON.parse(raw) as T;
      } catch {
        return null;
      }
    }
    // KV returned null — could be a miss OR a transient error.
    // Check if the key actually exists before falling back to bundled file.
    const exists = await kvCommand<number>(['EXISTS', key]);
    if (exists === 1) {
      // Key exists in KV but GET returned null — transient error.
      // Do NOT fall back to bundled file, return null to avoid serving stale data.
      console.error('[storage] KV key exists but GET returned null — possible transient error for key:', key);
      return null;
    }
    // Key truly doesn't exist in KV — safe to fall through to bundled file as seed
  }
  const raw = fsRead(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Write a JSON value by key. Returns true on success.
 */
export async function setJSON(key: string, value: unknown): Promise<boolean> {
  const serialized = JSON.stringify(value);
  if (isKvEnabled) {
    const result = await kvCommand<string>(['SET', key, serialized]);
    return result === 'OK';
  }
  return fsWrite(key, serialized);
}

/**
 * Append an item to a JSON-array key. Atomic-ish: read-modify-write.
 * Used for bookings and analytics events where we accumulate records.
 */
export async function appendToList<T = unknown>(key: string, item: T, max = 5000): Promise<boolean> {
  const list = (await getJSON<T[]>(key)) || [];
  list.push(item);
  // Keep memory and KV value size bounded — drop oldest entries if huge
  const trimmed = list.length > max ? list.slice(list.length - max) : list;
  return setJSON(key, trimmed);
}

/**
 * Read a JSON-array key. Returns [] if missing.
 */
export async function getList<T = unknown>(key: string): Promise<T[]> {
  return (await getJSON<T[]>(key)) || [];
}

/**
 * Read raw from KV only (for debugging).
 */
export async function getRawFromKv(key: string): Promise<string | null> {
  if (!isKvEnabled) return null;
  return kvCommand<string>(['GET', key]);
}

/**
 * Read raw from filesystem only (for debugging).
 */
export function getRawFromFs(key: string): string | null {
  return fsRead(key);
}

/**
 * Convenience: read raw text (used by /api/config, which streams the
 * services.json bytes straight back to the client).
 *
 * When KV is enabled, only falls back to bundled file if the key truly
 * doesn't exist in KV (not on transient errors).
 */
export async function getRaw(key: string): Promise<string | null> {
  if (isKvEnabled) {
    const raw = await kvCommand<string>(['GET', key]);
    if (raw != null) return raw;
    // Check if key actually exists before falling back
    const exists = await kvCommand<number>(['EXISTS', key]);
    if (exists === 1) {
      console.error('[storage] KV key exists but GET returned null — possible transient error for key:', key);
      return null;
    }
  }
  return fsRead(key);
}
