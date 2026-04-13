import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

const IMAGES_DIR = path.join(process.cwd(), 'public/images');
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// Vercel Blob token — injected when a Blob store is attached to the project.
function pickBlobToken(): string | undefined {
  return (
    process.env.BLOB_READ_WRITE_TOKEN ||
    process.env.KV_STORAGE_BLOB_READ_WRITE_TOKEN ||
    process.env.VERCEL_BLOB_READ_WRITE_TOKEN ||
    undefined
  );
}

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

    // Sanitize filename
    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const base = file.name
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 60);
    const timestamp = Date.now();
    const filename = `${base}-${timestamp}${ext}`;

    const blobToken = pickBlobToken();

    // ── Strategy 1: Vercel Blob (production with store attached) ──
    if (blobToken) {
      try {
        const { put } = await import('@vercel/blob');
        const blob = await put(`images/${filename}`, file, {
          access: 'public',
          token: blobToken,
          addRandomSuffix: false,
        });

        return new Response(
          JSON.stringify({ ok: true, path: blob.url, storage: 'blob' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (blobErr) {
        console.error('Vercel Blob upload failed:', blobErr);
        // Fall through to data URL fallback
      }
    }

    // ── Strategy 2: Filesystem (local dev) ───────────────────────
    const isVercel = !!process.env.VERCEL;
    if (!isVercel) {
      try {
        const filePath = path.join(IMAGES_DIR, filename);
        if (!fs.existsSync(IMAGES_DIR)) {
          fs.mkdirSync(IMAGES_DIR, { recursive: true });
        }
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        return new Response(
          JSON.stringify({ ok: true, path: `/images/${filename}`, storage: 'filesystem' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      } catch (fsErr) {
        console.error('Filesystem write failed:', fsErr);
      }
    }

    // ── Strategy 3: Base64 data URL (works everywhere, no storage needed) ──
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;

    return new Response(
      JSON.stringify({ ok: true, path: dataUrl, storage: 'dataurl' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Upload error:', err);
    return new Response(
      JSON.stringify({ error: 'Upload failed. ' + (err instanceof Error ? err.message : '') }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
