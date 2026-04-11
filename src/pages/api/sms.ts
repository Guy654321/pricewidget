import type { APIRoute } from 'astro';
import { sendCustomerSms } from '../../lib/notifications';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

export const POST: APIRoute = async ({ request }) => {
  let body: { phone: string; name?: string; service?: string; tier?: string; price?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request.' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  if (!body.phone || String(body.phone).replace(/\D/g, '').length < 10) {
    return new Response(JSON.stringify({ error: 'Invalid phone number.' }), {
      status: 400,
      headers: JSON_HEADERS,
    });
  }

  const result = await sendCustomerSms({
    name: body.name,
    phone: String(body.phone),
    service: body.service,
    tier: body.tier,
    price: body.price,
  });

  const status = result.ok ? 200 : 502;
  return new Response(JSON.stringify(result), { status, headers: JSON_HEADERS });
};
