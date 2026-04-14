import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

const IMAGES_DIR = path.join(process.cwd(), 'public/images');
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function pickBlobToken(): string | undefined {
  return (
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.KV_STORAGE_BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_BLOB_READ_WRITE_TOKEN ||
    undefined
  );
}

function pickKvUrl(): string | undefined {
  return (
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_URL ||
    process.env.REDIS_URL ||
    process.env.KV_STORAGE_KV_REST_API_URL ||
    process.env.KV_STORAGE_KV_URL ||
    process.env.KV_STORAGE_REDIS_URL ||
    undefined
  );
}

function pickKvReadToken(): string | undefined {
  return (
    process.env.KV_REST_API_READ_ONLY_TOKEN ||
    process.env.KV_STORAGE_KV_REST_API_READ_ONLY_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_TOKEN ||
    process.env.KV_STORAGE_KV_REST_API_TOKEN ||
    undefined
  );
}

function pickKvWriteToken(): string | undefined {
  return (
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_TOKEN ||
    process.env.KV_STORAGE_KV_REST_API_TOKEN ||
    undefined
  );
}

async function kvCommand<T = unknown>(command: (string | number)[], write = false): Promise<T | null> {
  const url = pickKvUrl();
  const token = write ? pickKvWriteToken() : pickKvReadToken();
  if (!url || !token) return null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(command),
    });
    if (!res.ok) {
      console.error('KV command failed:', res.status, await res.text());
      return null;
    }
    const json = (await res.json()) as { result?: T };
    return (json?.result ?? null) as T | null;
  } catch (err) {
    console.error('KV command error:', err);
    return null;
  }
}

export const GET: APIRoute = async ({ url }) => {
  const key = url.searchParams.get('key');
  if (!key || !key.startsWith('uploads:')) {
    return new Response(JSON.stringify({ error: 'Missing or invalid image key.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload = await kvCommand<string>(['GET', key]);
  if (!payload) {
    return new Response(JSON.stringify({ error: 'Image not found.' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let parsed: { mimeType?: string; data?: string } | null = null;
  try {
    parsed = JSON.parse(payload) as { mimeType?: string; data?: string };
  } catch {
    parsed = null;
  }
  if (!parsed?.mimeType || !parsed?.data) {
    return new Response(JSON.stringify({ error: 'Stored image payload is invalid.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const bytes = Buffer.from(parsed.data, 'base64');
  return new Response(bytes, {
    status: 200,
    headers: {
      'Content-Type': parsed.mimeType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'No file provided.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, AVIF, SVG.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (file.size > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File too large. Max 5 MB.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const mimeType = file.type;

    // Read file buffer ONCE upfront — file streams can only be read once
    const arrayBuf = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuf);

    // Sanitize filename
    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const base = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 60);
    const timestamp = Date.now();
    const filename = `${base}-${timestamp}${ext}`;

    const blobToken = pickBlobToken();

    // ── Strategy 1: Vercel Blob ──────────────────────────────────
    if (blobToken) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(`images/${filename}`, buffer, {
          access: 'public',
          token: blobToken,
          addRandomSuffix: false,
          contentType: mimeType,
        });

        return new Response(
          JSON.stringify({ ok: true, path: blob.url, storage: 'blob' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (blobErr) {
        console.error('Vercel Blob upload failed:', blobErr);
        // Fall through to next strategy
      }
    }

    // ── Strategy 2: Filesystem (local dev only) ──────────────────
    if (!process.env.VERCEL) {
      try {
        const filePath = path.join(IMAGES_DIR, filename);
        if (!fs.existsSync(IMAGES_DIR)) {
          fs.mkdirSync(IMAGES_DIR, { recursive: true });
        }
        fs.writeFileSync(filePath, buffer);

        return new Response(
          JSON.stringify({ ok: true, path: `/images/${filename}`, storage: 'filesystem' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (fsErr) {
        console.error('Filesystem write failed:', fsErr);
      }
    }

    // ── Strategy 3: KV-backed image storage ──────────────────────
    // Persist image bytes in KV when Blob is unavailable.
    const kvUrl = pickKvUrl();
    const kvToken = pickKvWriteToken();
    if (kvUrl && kvToken) {
      const imageKey = `uploads:${filename}`;
      const encoded = buffer.toString('base64');
      const setResult = await kvCommand<string>([
        'SET',
        imageKey,
        JSON.stringify({ mimeType, data: encoded }),
      ], true);
      if (setResult === 'OK') {
        const imageUrl = `/api/upload?key=${encodeURIComponent(imageKey)}`;
        return new Response(
          JSON.stringify({ ok: true, path: imageUrl, storage: 'kv' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }
      console.error('KV image write failed for key:', imageKey);
    }

    return new Response(
      JSON.stringify({
        error: process.env.VERCEL
          ? 'Upload storage unavailable. Configure BLOB_READ_WRITE_TOKEN or KV_REST_API_URL/KV_REST_API_TOKEN.'
          : 'Upload storage unavailable.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Upload error:', err);
    return new Response(
      JSON.stringify({ error: 'Upload failed. ' + (err instanceof Error ? err.message : '') }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
