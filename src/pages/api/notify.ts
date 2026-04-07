import type { APIRoute } from 'astro';

export const prerender = false;

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

export const POST: APIRoute = async ({ request }) => {
  const resendKey = import.meta.env.RESEND_API_KEY;
  const ownerEmail = import.meta.env.OWNER_EMAIL;

  if (!resendKey || !ownerEmail) {
    console.log('Email notification not configured — skipping.');
    return new Response(
      JSON.stringify({ ok: true, skipped: true, reason: 'Email not configured' }),
      { status: 200, headers: JSON_HEADERS }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request.' }),
      { status: 400, headers: JSON_HEADERS }
    );
  }

  const name = String(body.name || 'Unknown');
  const phone = String(body.phone || '');
  const service = String(body.service || '');
  const tier = String(body.tier || '');
  const price = String(body.price || '');
  const zip = String(body.zip || '');
  const email = String(body.email || '');
  const source = String(body.source || 'quote');

  const formattedPhone = phone.length === 10
    ? `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
    : phone;

  const htmlBody = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0F3D3E; color: white; padding: 20px 24px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">New Lead from Derby Strong Widget</h1>
      </div>
      <div style="background: #fff; border: 1px solid #e2e5ea; border-top: none; padding: 24px; border-radius: 0 0 10px 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #64748b; width: 120px;">Name</td>
            <td style="padding: 8px 0;">${escHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Phone</td>
            <td style="padding: 8px 0;"><a href="tel:${escHtml(phone)}">${escHtml(formattedPhone)}</a></td>
          </tr>
          ${zip ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #64748b;">ZIP</td><td style="padding: 8px 0;">${escHtml(zip)}</td></tr>` : ''}
          ${email ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>` : ''}
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Service</td>
            <td style="padding: 8px 0;">${escHtml(service)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Tier</td>
            <td style="padding: 8px 0;">${escHtml(tier)}</td>
          </tr>
          ${price ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Price</td><td style="padding: 8px 0;">${escHtml(price)}</td></tr>` : ''}
          <tr>
            <td style="padding: 8px 0; font-weight: 600; color: #64748b;">Source</td>
            <td style="padding: 8px 0;">${source === 'chat' ? 'AI Chat' : 'Quote Widget'}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e5ea; font-size: 13px; color: #94a3b8;">
          Received ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
        </div>
      </div>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Derby Strong Leads <leads@derbystrong.com>',
        to: [ownerEmail],
        subject: `New Lead: ${service} (${tier}) — ${name}`,
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', res.status, err);
      return new Response(
        JSON.stringify({ ok: false, error: 'Email send failed.' }),
        { status: 502, headers: JSON_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: JSON_HEADERS }
    );
  } catch (err) {
    console.error('Email fetch error:', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Email service error.' }),
      { status: 502, headers: JSON_HEADERS }
    );
  }
};

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
