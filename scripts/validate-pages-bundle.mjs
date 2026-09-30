import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist/public");
const read = (file) => readFile(path.join(root, file), "utf8");
const [home, privacy, fallback, manifestSource, legacyServiceWorker, runtimeServiceWorker] = await Promise.all([
  read("index.html"),
  read("privacidade/index.html"),
  read("404.html"),
  read("manifest.webmanifest"),
  read("sw.js"),
  read("sw-runtime-v8.js"),
]);
const manifest = JSON.parse(manifestSource);

assert.ok(home.includes('rel="canonical" href="https://pabloguilherme1121.github.io/PG-portfolio/"'));
assert.ok(privacy.includes('rel="canonical" href="https://pabloguilherme1121.github.io/PG-portfolio/privacidade/"'));
assert.ok(privacy.includes("<title>Privacidade — Pablo Guilherme</title>"));
assert.ok(fallback.includes('content="noindex, follow" id="robots-meta"'));
assert.ok(!home.includes("/manus-storage/"), "The public shell should not link to missing media");
const structuredData = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert.ok(structuredData, "Person structured data is missing");
assert.equal(JSON.parse(structuredData).url, "https://pabloguilherme1121.github.io/PG-portfolio/");
assert.ok(!home.includes("%BASE_URL%"), "The favicon URL was not expanded by Vite");
assert.ok(!home.includes("import.meta"), "The Pages HTML contains unresolved import.meta syntax");
assert.ok(home.includes('href="/PG-portfolio/favicon.svg"'));
assert.ok(home.includes('rel="manifest" href="/PG-portfolio/manifest.webmanifest"'));
assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "./");
assert.equal(manifest.scope, "./");
assert.ok(manifest.icons?.some((icon) => icon.sizes === "192x192"));
assert.ok(manifest.icons?.some((icon) => icon.sizes === "512x512"));
assert.ok(manifest.icons?.some((icon) => icon.sizes === "any" && icon.purpose.includes("maskable")));
assert.ok(legacyServiceWorker.includes('const TAKEOVER_VERSION = "v8"'), "Legacy worker takeover version is stale");
assert.ok(legacyServiceWorker.includes("client.navigate"), "Legacy worker must actively refresh stale controlled pages");
assert.ok(legacyServiceWorker.includes("includeUncontrolled: true"), "Legacy worker must recover installed/mobile clients");
assert.ok(legacyServiceWorker.includes('fetch(request, { cache: "no-store" })'), "Legacy worker must bypass stale executable caches");
assert.ok(runtimeServiceWorker.includes('const RUNTIME_VERSION = "v8"'), "Unexpected runtime service worker version");
assert.ok(runtimeServiceWorker.includes('self.addEventListener("install"'));
assert.ok(runtimeServiceWorker.includes('self.addEventListener("fetch"'));
assert.ok(runtimeServiceWorker.includes("self.skipWaiting()"), "The current worker must replace legacy cache workers");
assert.ok(runtimeServiceWorker.includes('request.destination === "script"'), "Executable assets must stay network-only");
assert.ok(runtimeServiceWorker.includes('fetch(request, { cache: "no-store" })'), "Navigation and executable assets must bypass stale HTTP cache");
assert.ok(!runtimeServiceWorker.includes("cache.put"), "Runtime worker must not persist application assets");
assert.ok((await readFile(path.join(root, "pwa-icon-maskable.svg"), "utf8")).includes("<svg"));
const builtScripts = (await readdir(path.join(root, "assets"))).filter((file) => file.endsWith(".js"));
const builtScriptSources = await Promise.all(builtScripts.map((file) => readFile(path.join(root, "assets", file), "utf8")));
assert.ok(builtScriptSources.some((source) => source.includes("sw-runtime-v8.js") && source.includes("serviceWorker")), "The production bundle does not register the v8 PWA service worker");
assert.ok(builtScriptSources.some((source) => source.includes("vite:preloadError")), "The production bundle does not recover from stale lazy chunks");
assert.ok(builtScriptSources.some((source) => source.includes("runtime-hardening-v8")), "The production bundle does not migrate legacy PWA runtime state");
assert.ok(home.includes('content="https://pabloguilherme1121.github.io/PG-portfolio/social-preview.png"'));
assert.ok(!home.includes('src="/manus-storage/"'));
assert.ok((await readFile(path.join(root, "media-unavailable.svg"), "utf8")).includes("Imagem em preparação"));
const preview = await readFile(path.join(root, "social-preview.png"));
assert.ok(preview.length > 10_000, "Social preview is missing or empty");
assert.ok(Buffer.byteLength(home) < 50_000, "Unexpected inline runtime in the Pages HTML");
console.log("GitHub Pages HTML and public route validated.");
