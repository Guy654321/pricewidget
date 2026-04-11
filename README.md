# Derby Strong Widget

Floating quote / AI chat widget, built as a standalone Astro SSR app. Embedded on host sites via a single async `<script>` tag.

## Local development

```bash
npm install
cp .env.example .env   # fill in real keys (NEVER commit .env)
npm run dev
```

- Test page: http://localhost:4321/
- Admin: http://localhost:4321/admin
- Embed demo: http://localhost:4321/embed-demo

## Deploying to Vercel

This repo is configured to deploy as a Vercel serverless Astro project.

### 1. Import the repo
1. Go to https://vercel.com/new
2. Import `Guy654321/pricewidget`
3. Framework: Astro (auto-detected)
4. Build command: `npm run build` (default)
5. Output directory: leave default

### 2. Set environment variables
In Vercel → Project → Settings → Environment Variables, add the keys from `.env.example`:

| Variable | Required | Used by |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | `/api/chat` (AI routing) |
| `TWILIO_ACCOUNT_SID` | optional | `/api/sms` (booking SMS) |
| `TWILIO_AUTH_TOKEN` | optional | `/api/sms` |
| `TWILIO_FROM_NUMBER` | optional | `/api/sms` |
| `OWNER_PHONE` | optional | `/api/sms` (owner notifications) |
| `RESEND_API_KEY` | optional | `/api/notify` (owner emails) |
| `OWNER_EMAIL` | optional | `/api/notify` |

### 3. Custom domain (optional)
Attach a subdomain such as `widget.example.com` in Vercel → Domains.

## Embedding on a host site

Add one line before `</body>` on any host page:

```html
<script src="https://<your-widget-domain>/api/widget.js" async></script>
```

Then trigger it from your own button:

```html
<button data-derby-widget="open">Get Instant Quote</button>
```

Or programmatically:

```js
window.DerbyWidget.open();
window.DerbyWidget.close();
window.DerbyWidget.toggle();
```

The loader adds no visible UI until `.open()` is called. The widget renders in a lazy-loaded iframe (no LCP impact).

## CSP requirements on the host site

If the host site sets a Content-Security-Policy, add the widget origin to:
- `script-src https://<your-widget-domain>`
- `frame-src https://<your-widget-domain>`

## Known limitations on Vercel

Vercel's filesystem is **read-only at runtime**. The widget currently writes to:
- `public/config/services.json` (admin edits)
- `public/config/bookings.json` (leads)
- `public/uploads/` (user-uploaded photos)

These writes will silently fail in production until a follow-up PR migrates persistence to Vercel KV / Upstash / Blob. Until then, edit `public/config/services.json` in the repo and redeploy.

## Security

- **Never commit `.env`.** It is in `.gitignore`.
- Rotate the Gemini API key via Google AI Studio if it has ever been committed to git.
