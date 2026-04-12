import type { APIRoute } from 'astro';
import { isKvEnabled, kvDebugInfo } from '../../lib/storage';

export const prerender = false;

/**
 * Lightweight status endpoint the admin polls so it can warn the operator
 * if Vercel KV isn't attached. Without KV, writes to bookings/config/analytics
 * silently fall back to the (read-only on Vercel) filesystem and disappear.
 */
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      kvEnabled: isKvEnabled,
      mode: isKvEnabled ? 'kv' : 'filesystem',
      detectedUrlVar: kvDebugInfo.urlVar,
      detectedTokenVar: kvDebugInfo.tokenVar,
      warning: isKvEnabled
        ? null
        : 'Vercel KV is not attached. Bookings, admin saves, and analytics events are NOT persisting. Attach Vercel KV to the project Storage tab and redeploy.',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
};
