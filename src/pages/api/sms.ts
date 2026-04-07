import type { APIRoute } from 'astro';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

export const POST: APIRoute = async ({ request }) => {
  const twilioSid = import.meta.env.TWILIO_ACCOUNT_SID;
  const twilioToken = import.meta.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = import.meta.env.TWILIO_FROM_NUMBER;

  if (!twilioSid || !twilioToken || !twilioFrom) {
    // SMS not configured — log and return OK so the booking flow isn't blocked
    console.log('SMS not configured — skipping confirmation text.');
    return new Response(
      JSON.stringify({ ok: true, skipped: true, reason: 'SMS not configured' }),
      { status: 200, headers: JSON_HEADERS }
    );
  }

  let body: { phone: string; name?: string; service: string; tier: string; price?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request.' }),
      { status: 400, headers: JSON_HEADERS }
    );
  }

  const phone = body.phone?.replace(/\D/g, '');
  if (!phone || phone.length < 10) {
    return new Response(
      JSON.stringify({ error: 'Invalid phone number.' }),
      { status: 400, headers: JSON_HEADERS }
    );
  }

  const to = phone.length === 10 ? `+1${phone}` : `+${phone}`;

  // Load configurable template
  let template = '';
  try {
    const fs = require('node:fs');
    const path = require('node:path');
    const cfgPath = path.join(process.cwd(), 'public/config/services.json');
    const raw = fs.readFileSync(cfgPath, 'utf-8');
    const cfg = JSON.parse(raw);
    if (cfg.smsTemplate) template = cfg.smsTemplate;
  } catch { /* use default */ }

  let message: string;
  if (template) {
    message = template
      .replace(/\{name\}/g, body.name || 'there')
      .replace(/\{service\}/g, body.service || '')
      .replace(/\{tier\}/g, body.tier || '')
      .replace(/\{price\}/g, body.price || '')
      .replace(/\{phone\}/g, phone);
  } else {
    const greeting = body.name ? `Hi ${body.name}! ` : 'Hi! ';
    const priceInfo = body.price ? ` (estimated ${body.price})` : '';
    message = `${greeting}Thanks for requesting a ${body.tier} ${body.service} appointment${priceInfo} with Derby Strong Garage Doors. A specialist will contact you shortly to confirm your visit. Questions? Call us at 502-619-5198.`;
  }

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa(`${twilioSid}:${twilioToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: twilioFrom,
          Body: message,
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error('Twilio error:', res.status, err);
      return new Response(
        JSON.stringify({ ok: false, error: 'SMS send failed.' }),
        { status: 502, headers: JSON_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: JSON_HEADERS }
    );
  } catch (err) {
    console.error('SMS fetch error:', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'SMS service error.' }),
      { status: 502, headers: JSON_HEADERS }
    );
  }
};
