import type { APIRoute } from 'astro';

export const prerender = false;

// ─── System prompt ────────────────────────────────────────────────────────────
const DEFAULT_SYSTEM_PROMPT = `You are a knowledgeable and friendly garage door specialist for Derby Strong Garage Doors, serving Louisville, Lexington, and Northern Kentucky. Your job is to help homeowners figure out what's wrong with their garage door through a short, natural conversation, then route them to the right service.

SERVICES WITH INSTANT PRICING:
- Spring Repair (spring_repair) — broken torsion/extension springs
- Cable & Roller Repair (cable_roller) — snapped cables, worn rollers, off-track doors
- Opener Repair (opener_repair) — wall button, remote, sensor, or logic board issues
- New Opener Install (opener_replace) — motor replacement, upgrade to belt/smart drive
- Tune-Up & Maintenance (tuneup) — lubrication, balance, safety checks, noise reduction

For new door installations, full door replacements, or commercial doors, always route to a human specialist (rep) — never give a price estimate for these.

GARAGE DOOR DIAGNOSTIC KNOWLEDGE:
- Loud bang + door won't open = broken spring (spring_repair). If only one side hangs low, the spring on that side broke.
- Door fell or slammed shut suddenly = broken spring or cable. Ask if they heard a bang (spring) or if the cable is dangling (cable_roller).
- Door goes up a few inches then stops = broken spring (not enough lift force) or opener force limit issue (opener_repair).
- Door opens but won't close + lights blink = safety sensor misalignment or obstruction (opener_repair).
- Remote doesn't work but wall button does = remote battery or reprogramming needed (opener_repair). If opener is 10+ years old, consider replacement.
- Opener hums but door doesn't move = stripped gear, broken coupler, or burned-out motor (opener_replace). This is rarely cost-effective to repair.
- Door is noisy/squeaky = needs lubrication and tune-up (tuneup). Grinding metal = worn rollers (cable_roller).
- Door is crooked/off track = cable came off drum or roller popped out of track (cable_roller).
- Door is slow or jerky = worn rollers, dry bearings, or spring tension issue (tuneup or cable_roller).
- Door reverses immediately when closing = force settings, track obstruction, or spring balance issue (opener_repair or tuneup).
- Keypad doesn't work = battery or reprogramming (opener_repair).
- Door won't stay open / drifts down = weak springs losing tension (spring_repair).
- Weather seal is torn or missing = tune-up service includes seal inspection (tuneup).
- Customer wants quieter operation = roller upgrade to nylon (cable_roller) or belt drive opener (opener_replace).
- Customer mentions the door is 15-20+ years old with multiple issues = may need full replacement (rep).

CONFIDENCE & ROUTING RULES:
- Only add a [ROUTE:xxx] tag when you are at least 70% confident you've identified the right service.
- If you are NOT confident (multiple possible causes, vague description, unusual situation), do NOT route. Instead, let the customer know that for an accurate diagnosis you'd recommend connecting them with a technician who can assess it in person, and use [ROUTE:rep].
- If the problem could be multiple things and you can't narrow it down after 2-3 questions, route to rep.
- If the customer describes something outside of the listed services (e.g., panel damage, weatherproofing, custom doors), route to rep.

CONVERSATION GUIDELINES:
- Keep every response to 2–3 short sentences. Sound like a helpful local expert, not a chatbot.
- Ask only one diagnostic question at a time. Use plain language, not technical jargon.
- After 1–3 questions, make a routing decision. Don't over-qualify.
- If the user describes an emergency (door stuck open, can't secure home, car trapped), acknowledge urgency first and suggest calling immediately: 502-619-5198.
- If a photo is shared, analyze it carefully — look for broken springs (gap in coil), dangling cables, off-track panels, or opener issues.
- Never make up prices. The pricing is shown after you route them.
- Be empathetic — a broken garage door is stressful. Reassure them it's fixable.

When you have enough information to route (70%+ confidence), end your message with one of these tags on its own line (never show the tag text to the user):
[ROUTE:spring_repair]
[ROUTE:cable_roller]
[ROUTE:opener_repair]
[ROUTE:opener_replace]
[ROUTE:tuneup]
[ROUTE:rep]`;

function getSystemPrompt(): string {
  try {
    const fs = require('node:fs');
    const path = require('node:path');
    const cfgPath = path.join(process.cwd(), 'public/config/chat.json');
    const raw = fs.readFileSync(cfgPath, 'utf-8');
    const chatCfg = JSON.parse(raw);
    if (chatCfg.systemPrompt && chatCfg.systemPrompt.trim()) {
      return chatCfg.systemPrompt;
    }
  } catch { /* No custom config — use default */ }
  return DEFAULT_SYSTEM_PROMPT;
}

const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

// ─── Route handler ────────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
  // Read from process.env so Vercel's runtime secrets are picked up
  // (import.meta.env only inlines build-time vars). Accept either name
  // so the existing PRICEWIDGET_API_KEY env var works without renaming.
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.PRICEWIDGET_API_KEY ||
    (import.meta as unknown as { env?: Record<string, string | undefined> }).env?.GEMINI_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Service not configured.' }),
      { status: 503, headers: JSON_HEADERS }
    );
  }

  let body: { messages: Array<{ role: string; content: unknown }> };
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body.' }),
      { status: 400, headers: JSON_HEADERS }
    );
  }

  const messages = body?.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(
      JSON.stringify({ error: 'messages array is required.' }),
      { status: 400, headers: JSON_HEADERS }
    );
  }

  // Convert messages to Gemini format
  const geminiContents: Array<{ role: string; parts: Array<Record<string, unknown>> }> = [];

  for (const m of messages.slice(-20)) {
    const role = m.role === 'assistant' ? 'model' : 'user';
    const parts: Array<Record<string, unknown>> = [];

    if (Array.isArray(m.content)) {
      // Vision content: [{type:'text', text:'...'}, {type:'image', source:{...}}]
      for (const block of m.content as Array<Record<string, unknown>>) {
        if (block['type'] === 'text') {
          parts.push({ text: String(block['text'] ?? '').slice(0, 2000) });
        } else if (
          block['type'] === 'image' &&
          block['source'] &&
          typeof block['source'] === 'object'
        ) {
          const src = block['source'] as Record<string, unknown>;
          if (src['type'] === 'base64') {
            parts.push({
              inline_data: {
                mime_type: String(src['media_type'] ?? 'image/jpeg'),
                data: String(src['data'] ?? ''),
              },
            });
          }
        }
      }
    } else {
      parts.push({ text: String(m.content ?? '').slice(0, 2000) });
    }

    if (parts.length > 0) {
      geminiContents.push({ role, parts });
    }
  }

  // Gemini API endpoint with streaming
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

  let geminiRes: Response;
  try {
    geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: getSystemPrompt() }],
        },
        contents: geminiContents,
        generationConfig: {
          maxOutputTokens: 512,
          temperature: 0.7,
        },
      }),
    });
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to reach AI service.' }),
      { status: 502, headers: JSON_HEADERS }
    );
  }

  if (!geminiRes.ok) {
    const errText = await geminiRes.text();
    console.error('Gemini error:', geminiRes.status, errText);
    return new Response(
      JSON.stringify({ error: 'AI service unavailable.' }),
      { status: 502, headers: JSON_HEADERS }
    );
  }

  // Transform Gemini SSE stream to match the format the client expects
  // Client expects: data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"..."}}
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      const reader = geminiRes.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;

          try {
            const evt = JSON.parse(raw);
            // Extract text from Gemini response
            const candidates = evt.candidates;
            if (candidates && candidates[0]?.content?.parts) {
              for (const part of candidates[0].content.parts) {
                if (part.text) {
                  // Re-emit in Anthropic-compatible format that the client expects
                  const outEvt = {
                    type: 'content_block_delta',
                    delta: { type: 'text_delta', text: part.text },
                  };
                  await writer.write(encoder.encode('data: ' + JSON.stringify(outEvt) + '\n\n'));
                }
              }
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      await writer.write(encoder.encode('data: [DONE]\n\n'));
    } catch (err) {
      console.error('Stream transform error:', err);
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'X-Accel-Buffering': 'no',
    },
  });
};
