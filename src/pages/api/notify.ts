import type { APIRoute } from 'astro';
import { sendOwnerEmail } from '../../lib/notifications';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request.' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const result = await sendOwnerEmail({
    name: String(body.name || ''),
    phone: String(body.phone || ''),
    zip: String(body.zip || ''),
    email: String(body.email || ''),
    service: String(body.service || ''),
    tier: String(body.tier || ''),
    price: String(body.price || ''),
    source: String(body.source || 'quote'),
  });

  const status = result.ok ? 200 : 502;
  return new Response(JSON.stringify(result), { status, headers: JSON_HEADERS });
};
