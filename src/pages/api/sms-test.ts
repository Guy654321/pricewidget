import type { APIRoute } from 'astro';
import { sendOwnerSms, sendCustomerSms } from '../../lib/notifications';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

const env = (key: string): string | undefined => {
  const fromImport = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return fromImport?.[key] ?? process.env[key];
};

/**
 * GET  /api/sms-test  — check which Twilio env vars are set (no values exposed)
 * POST /api/sms-test  — send a real test SMS to OWNER_PHONE
 */
export const GET: APIRoute = async () => {
  const vars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_FROM_NUMBER',
    'OWNER_PHONE',
    'GMAIL_USER',
    'GMAIL_APP_PASSWORD',
    'OWNER_EMAIL',
  ];

  const status: Record<string, string> = {};
  for (const v of vars) {
    const val = env(v);
    if (!val) {
      status[v] = 'NOT SET';
    } else {
      // Show first 4 + last 2 chars only
      const masked = val.length > 8
        ? val.slice(0, 4) + '***' + val.slice(-2)
        : '****';
      status[v] = `SET (${masked})`;
    }
  }

  const ready =
    Boolean(env('TWILIO_ACCOUNT_SID')) &&
    Boolean(env('TWILIO_AUTH_TOKEN')) &&
    Boolean(env('TWILIO_FROM_NUMBER'));

  return new Response(
    JSON.stringify({ twilioReady: ready, ownerPhoneSet: Boolean(env('OWNER_PHONE')), vars: status }),
    { status: 200, headers: JSON_HEADERS }
  );
};

export const POST: APIRoute = async () => {
  const ownerPhone = env('OWNER_PHONE');
  if (!ownerPhone) {
    return new Response(
      JSON.stringify({ error: 'OWNER_PHONE not set. Add it to Vercel env vars.' }),
      { status: 400, headers: JSON_HEADERS }
    );
  }

  // Send test owner SMS
  const ownerResult = await sendOwnerSms({
    name: 'Test Lead',
    phone: ownerPhone,
    service: 'Spring Repair',
    tier: 'Better',
    price: '$525-$625',
  });

  // Send test customer SMS (to owner's phone for testing)
  const customerResult = await sendCustomerSms({
    name: 'Test',
    phone: ownerPhone,
    service: 'Spring Repair',
    tier: 'Better',
    price: '$525-$625',
  });

  return new Response(
    JSON.stringify({ ownerSms: ownerResult, customerSms: customerResult }),
    { status: ownerResult.ok && customerResult.ok ? 200 : 502, headers: JSON_HEADERS }
  );
};
