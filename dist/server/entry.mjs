import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_uW3YphmJ.mjs';
import { manifest } from './manifest_8-j_YhwZ.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/admin.astro.mjs');
const _page2 = () => import('./pages/api/bookings.astro.mjs');
const _page3 = () => import('./pages/api/chat.astro.mjs');
const _page4 = () => import('./pages/api/chat-config.astro.mjs');
const _page5 = () => import('./pages/api/config.astro.mjs');
const _page6 = () => import('./pages/api/embed.astro.mjs');
const _page7 = () => import('./pages/api/notify.astro.mjs');
const _page8 = () => import('./pages/api/sms.astro.mjs');
const _page9 = () => import('./pages/api/upload.astro.mjs');
const _page10 = () => import('./pages/embed-demo.astro.mjs');
const _page11 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/node.js", _page0],
    ["src/pages/admin.astro", _page1],
    ["src/pages/api/bookings.ts", _page2],
    ["src/pages/api/chat.ts", _page3],
    ["src/pages/api/chat-config.ts", _page4],
    ["src/pages/api/config.ts", _page5],
    ["src/pages/api/embed.ts", _page6],
    ["src/pages/api/notify.ts", _page7],
    ["src/pages/api/sms.ts", _page8],
    ["src/pages/api/upload.ts", _page9],
    ["src/pages/embed-demo.astro", _page10],
    ["src/pages/index.astro", _page11]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "mode": "standalone",
    "client": "file:///Users/guymei-tal/Desktop/derby-widget/dist/client/",
    "server": "file:///Users/guymei-tal/Desktop/derby-widget/dist/server/",
    "host": false,
    "port": 4321,
    "assets": "_astro"
};
const _exports = createExports(_manifest, _args);
const handler = _exports['handler'];
const startServer = _exports['startServer'];
const options = _exports['options'];
const _start = 'start';
{
	serverEntrypointModule[_start](_manifest, _args);
}

export { handler, options, pageMap, startServer };
