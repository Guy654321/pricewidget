import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

const CONFIG_PATH = path.join(process.cwd(), 'public/config/services.json');

export const GET: APIRoute = async () => {
  try {
    const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
    return new Response(raw, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Config read error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to read config.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    // Ensure config directory exists and is writable
    const configDir = path.dirname(CONFIG_PATH);
    fs.mkdirSync(configDir, { recursive: true });

    try {
      fs.accessSync(configDir, fs.constants.W_OK);
    } catch {
      return new Response(
        JSON.stringify({ error: 'Config storage is read-only in this environment.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Basic validation
    if (!body.services || !Array.isArray(body.services)) {
      return new Response(
        JSON.stringify({ error: 'Invalid config: services array required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    if (!body.contact || typeof body.contact !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Invalid config: contact object required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Write with pretty formatting
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(body, null, 2) + '\n', 'utf-8');

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Config write error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: `Failed to save config: ${message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
