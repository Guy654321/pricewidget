import type { APIRoute } from 'astro';
import { isKvEnabled, kvDebugInfo } from '../../lib/storage';

export const prerender = false;

export const GET: APIRoute = async () => {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  return new Response(
    JSON.stringify({
      kvEnabled: isKvEnabled,
      kvDebug: kvDebugInfo,
      blobConfigured: Boolean(blobToken),
      env: process.env.VERCEL ? 'vercel' : 'local',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
