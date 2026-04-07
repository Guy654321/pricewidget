import fs from 'node:fs';
import path from 'node:path';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const IMAGES_DIR = path.join(process.cwd(), "public/images");
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];
const MAX_SIZE = 5 * 1024 * 1024;
const POST = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: "No file provided." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: "Invalid file type. Allowed: JPEG, PNG, WebP, AVIF, SVG." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    if (file.size > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: "File too large. Max 5 MB." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 60);
    const timestamp = Date.now();
    const filename = `${base}-${timestamp}${ext}`;
    const filePath = path.join(IMAGES_DIR, filename);
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    return new Response(
      JSON.stringify({ ok: true, path: `/images/${filename}` }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Upload error:", err);
    return new Response(
      JSON.stringify({ error: "Upload failed." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
