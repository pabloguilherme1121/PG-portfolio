import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist/public");
const read = (file) => readFile(path.join(root, file), "utf8");
const [home, privacy, fallback, manifestSource, serviceWorker, legacyRuntimeAlias] = await Promise.all([
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
assert.ok(home.includes("window.__pgRuntimeRescue"), "The Pages shell is missing the preboot mobile runtime rescue");
assert.ok(home.includes('const rescueVersion = "v9"'), "The preboot runtime rescue version is stale");
assert.ok(home.includes("legacy-boundary"), "The preboot rescue must detect the legacy mobile error boundary");
assert.ok(home.includes('href="/PG-portfolio/favicon.svg"'));
assert.ok(home.includes('rel="manifest" href="/PG-portfolio/manifest.webmanifest"'));
assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "./");
assert.equal(manifest.scope, "./");
assert.ok(manifest.icons?.some((icon) => icon.sizes === "192x192"));
assert.ok(manifest.icons?.some((icon) => icon.sizes === "512x512"));
assert.ok(manifest.icons?.some((icon) => icon.sizes === "any" && icon.purpose.includes("maskable")));
assert.ok(serviceWorker.includes('const RUNTIME_VERSION = "v9"'), "Stable service worker version is stale");
assert.ok(serviceWorker.includes("client.navigate"), "Stable worker must actively refresh stale controlled pages");
assert.ok(serviceWorker.includes("includeUncontrolled: true"), "Stable worker must recover installed/mobile clients");
assert.ok(serviceWorker.includes('request.destination === "script"'), "Executable assets must stay network-only");
assert.ok(serviceWorker.includes('fetch(request, { cache: "no-store" })'), "Navigation and executable assets must bypass stale HTTP cache");
assert.ok(serviceWorker.includes("PG_FORCE_RUNTIME_REFRESH"), "Stable worker must accept explicit runtime rescue messages");
assert.ok(!serviceWorker.includes("cache.put"), "Runtime worker must not persist application assets");
assert.ok(legacyRuntimeAlias.includes('importScripts("./sw.js?alias=v9")'), "v8 worker URL must converge on the v9 rescue runtime");
assert.ok((await readFile(path.join(root, "pwa-icon-maskable.svg"), "utf8")).includes("<svg"));
const builtScripts = (await readdir(path.join(root, "assets"))).filter((file) => file.endsWith(".js"));
const builtScriptSources = await Promise.all(builtScripts.map((file) => readFile(path.join(root, "assets", file), "utf8")));
assert.ok(builtScriptSources.some((source) => source.includes("sw.js") && source.includes("runtime=v9") && source.includes("serviceWorker")), "The production bundle does not register the stable v9 PWA service worker");
assert.ok(builtScriptSources.some((source) => source.includes("vite:preloadError")), "The production bundle does not recover from stale lazy chunks");
assert.ok(builtScriptSources.some((source) => source.includes("runtime-hardening-v9")), "The production bundle does not migrate legacy PWA runtime state");
assert.ok(home.includes('content="https://pabloguilherme1121.github.io/PG-portfolio/social-preview.png"'));
assert.ok(!home.includes('src="/manus-storage/"'));
assert.ok((await readFile(path.join(root, "media-unavailable.svg"), "utf8")).includes("Imagem em preparação"));
const preview = await readFile(path.join(root, "social-preview.png"));
assert.ok(preview.length > 10_000, "Social preview is missing or empty");
assert.ok(Buffer.byteLength(home) < 50_000, "Unexpected inline runtime in the Pages HTML");
console.log("GitHub Pages HTML and public route validated.");
