/**
 * Shared notification helpers used by /api/bookings (on every new lead) and
 * by the standalone /api/notify and /api/sms endpoints.
 *
 * Each helper is best-effort: it logs and resolves on failure so the booking
 * pipeline never breaks because of a transient email/SMS provider issue.
 */

import nodemailer, { type Transporter } from 'nodemailer';
import { getJSON } from './storage';

export interface LeadPayload {
  name?: string;
  phone: string;
  zip?: string;
  email?: string;
  service?: string;
  tier?: string;
  price?: string;
  source?: string;
}

export interface NotificationResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

const env = (key: string): string | undefined => {
  const fromImport = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  return fromImport?.[key] ?? process.env[key];
};

function escHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function digitsOnly(phone: string): string {
  return String(phone || '').replace(/\D/g, '');
}

function toE164(phone: string): string {
  const digits = digitsOnly(phone);
  if (!digits) return '';
  return digits.length === 10 ? `+1${digits}` : `+${digits}`;
}

function formatUsPhone(phone: string): string {
  const digits = digitsOnly(phone);
  return digits.length === 10
    ? `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
    : phone;
}

let cachedTransporter: Transporter | null = null;
function getGmailTransporter(): Transporter | null {
  if (cachedTransporter) return cachedTransporter;
  const user = env('GMAIL_USER');
  const pass = env('GMAIL_APP_PASSWORD');
  if (!user || !pass) return null;
  cachedTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
  return cachedTransporter;
}

/**
 * Send the owner an HTML email with the lead details via Gmail SMTP.
 * Requires GMAIL_USER and GMAIL_APP_PASSWORD env vars (Google App Password).
 */
export async function sendOwnerEmail(lead: LeadPayload): Promise<NotificationResult> {
  const transporter = getGmailTransporter();
  const ownerEmail = env('OWNER_EMAIL');
  const gmailUser = env('GMAIL_USER');

  if (!transporter || !ownerEmail) {
    console.log('[notifications] Owner email not configured — skipping.');
    return { ok: true, skipped: true };
  }

  const name = lead.name || 'Unknown';
  const phone = digitsOnly(lead.phone);
  const formattedPhone = formatUsPhone(phone);
  const service = lead.service || '';
  const tier = lead.tier || '';
  const price = lead.price || '';
  const zip = lead.zip || '';
  const email = lead.email || '';
  const source = lead.source || 'quote';

  const htmlBody = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #0F3D3E; color: white; padding: 20px 24px; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 20px;">New Lead from Derby Strong Widget</h1>
      </div>
      <div style="background: #fff; border: 1px solid #e2e5ea; border-top: none; padding: 24px; border-radius: 0 0 10px 10px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b; width: 120px;">Name</td><td style="padding: 8px 0;">${escHtml(name)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Phone</td><td style="padding: 8px 0;"><a href="tel:${escHtml(phone)}">${escHtml(formattedPhone)}</a></td></tr>
          ${zip ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #64748b;">ZIP</td><td style="padding: 8px 0;">${escHtml(zip)}</td></tr>` : ''}
          ${email ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Email</td><td style="padding: 8px 0;"><a href="mailto:${escHtml(email)}">${escHtml(email)}</a></td></tr>` : ''}
          <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Service</td><td style="padding: 8px 0;">${escHtml(service)}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Tier</td><td style="padding: 8px 0;">${escHtml(tier)}</td></tr>
          ${price ? `<tr><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Price</td><td style="padding: 8px 0;">${escHtml(price)}</td></tr>` : ''}
          <tr><td style="padding: 8px 0; font-weight: 600; color: #64748b;">Source</td><td style="padding: 8px 0;">${source === 'chat' ? 'AI Chat' : 'Quote Widget'}</td></tr>
        </table>
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e2e5ea; font-size: 13px; color: #94a3b8;">
          Received ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
        </div>
      </div>
    </div>
  `;

  const fromAddress = env('LEAD_FROM_EMAIL') || `Derby Strong Leads <${gmailUser}>`;
  const subject = `New Lead: ${service}${tier ? ` (${tier})` : ''} — ${name}`;

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: ownerEmail,
      subject,
      html: htmlBody,
      replyTo: email || undefined,
    });
    return { ok: true };
  } catch (err) {
    console.error('[notifications] Gmail send error:', err);
    return { ok: false, error: 'Email service error.' };
  }
}

async function sendTwilioMessage(to: string, body: string): Promise<NotificationResult> {
  const twilioSid = env('TWILIO_ACCOUNT_SID');
  const twilioToken = env('TWILIO_AUTH_TOKEN');
  const twilioFrom = env('TWILIO_FROM_NUMBER');

  if (!twilioSid || !twilioToken || !twilioFrom) {
    console.log('[notifications] Twilio not configured — skipping SMS.');
    return { ok: true, skipped: true };
  }

  if (!to) {
    return { ok: false, error: 'Missing recipient.' };
  }

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa(`${twilioSid}:${twilioToken}`),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: to,
          From: twilioFrom,
          Body: body,
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error('[notifications] Twilio error:', res.status, errText);
      return { ok: false, error: 'SMS send failed.' };
    }

    return { ok: true };
  } catch (err) {
    console.error('[notifications] SMS fetch error:', err);
    return { ok: false, error: 'SMS service error.' };
  }
}

/**
 * Send the owner a short SMS alert when a new lead arrives.
 * Requires OWNER_PHONE env var. No-op if missing.
 */
export async function sendOwnerSms(lead: LeadPayload): Promise<NotificationResult> {
  const ownerPhone = env('OWNER_PHONE');
  if (!ownerPhone) {
    console.log('[notifications] OWNER_PHONE not set — skipping owner SMS.');
    return { ok: true, skipped: true };
  }

  const name = lead.name || 'New customer';
  const phone = formatUsPhone(lead.phone);
  const service = lead.service || 'service';
  const tier = lead.tier ? ` (${lead.tier})` : '';
  const price = lead.price ? ` ${lead.price}` : '';

  const body = `New Derby Strong lead: ${name} — ${phone}. ${service}${tier}${price}.`;
  return sendTwilioMessage(toE164(ownerPhone), body);
}

/**
 * Send the customer a confirmation SMS using the configurable template
 * stored in public/config/services.json (smsTemplate field), with a sane
 * fallback if the template is missing.
 */
export async function sendCustomerSms(lead: LeadPayload): Promise<NotificationResult> {
  const phone = digitsOnly(lead.phone);
  if (phone.length < 10) {
    return { ok: false, error: 'Invalid phone.' };
  }

  let template = '';
  try {
    const cfg = await getJSON<{ smsTemplate?: string }>('services');
    if (cfg && typeof cfg.smsTemplate === 'string') template = cfg.smsTemplate;
  } catch {
    /* fall through to default */
  }

  let message: string;
  if (template) {
    message = template
      .replace(/\{name\}/g, lead.name || 'there')
      .replace(/\{service\}/g, lead.service || '')
      .replace(/\{tier\}/g, lead.tier || '')
      .replace(/\{price\}/g, lead.price || '')
      .replace(/\{phone\}/g, phone);
  } else {
    const greeting = lead.name ? `Hi ${lead.name}! ` : 'Hi! ';
    const tierService = [lead.tier, lead.service].filter(Boolean).join(' ');
    const priceInfo = lead.price ? ` (estimated ${lead.price})` : '';
    message = `${greeting}Thanks for reaching out to Derby Strong Garage Doors${tierService ? ` about your ${tierService}` : ''}${priceInfo}. We received your message and will be calling you shortly. Questions? Call us at 502-619-5198.`;
  }

  return sendTwilioMessage(toE164(phone), message);
}

/**
 * Fire all three notifications in parallel. Never throws.
 */
export async function dispatchLeadNotifications(lead: LeadPayload) {
  const [ownerEmail, ownerSms, customerSms] = await Promise.allSettled([
    sendOwnerEmail(lead),
    sendOwnerSms(lead),
    sendCustomerSms(lead),
  ]);

  return { ownerEmail, ownerSms, customerSms };
}
