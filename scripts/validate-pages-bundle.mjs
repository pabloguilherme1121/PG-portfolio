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
assert.ok(home.includes('var rescueVersion = "v10"'), "The preboot runtime rescue version is stale");
assert.ok(home.includes('var rescueMode = "network-only"'), "The preboot rescue must retire service workers instead of replacing them");
assert.ok(home.includes("clearLegacyRuntime"), "The Pages shell must clean legacy runtime state");
assert.ok(home.includes("reserveRecovery"), "The preboot rescue must share a one-shot recovery reservation");
assert.ok(home.includes("registration.unregister()"), "The Pages shell must unregister legacy workers from its own scope");
assert.ok(!home.includes("legacy-boundary"), "The network-only shell must not retain DOM observation for legacy error boundaries");
assert.ok(home.includes('href="/PG-portfolio/favicon.svg"'));
assert.ok(home.includes('rel="manifest" href="/PG-portfolio/manifest.webmanifest"'));
assert.equal(manifest.display, "standalone");
assert.equal(manifest.start_url, "./");
assert.equal(manifest.scope, "./");
assert.ok(manifest.icons?.some((icon) => icon.sizes === "192x192"));
assert.ok(manifest.icons?.some((icon) => icon.sizes === "512x512"));
assert.ok(manifest.icons?.some((icon) => icon.sizes === "any" && icon.purpose.includes("maskable")));
assert.ok(serviceWorker.includes('const CACHE_PREFIX = "pg-portfolio-pwa-"'), "Retirement worker cache scope is missing");
assert.ok(serviceWorker.includes("retireLegacyRuntime"), "Retirement worker must expose the legacy cleanup path");
assert.ok(!serviceWorker.includes("client.navigate"), "Network-only retirement worker must not navigate client pages");
assert.ok(!serviceWorker.includes("includeUncontrolled: true"), "Network-only retirement worker must not coordinate uncontrolled clients");
assert.ok(serviceWorker.includes("self.registration.unregister()"), "Retirement worker must unregister itself");
assert.ok(serviceWorker.includes("PG_RETIRE_RUNTIME"), "Retirement worker must accept explicit cleanup messages");
assert.ok(!serviceWorker.includes('self.addEventListener("fetch"'), "Retirement worker must not intercept network requests");
assert.ok(!serviceWorker.includes("cache.put"), "Retirement worker must not persist application assets");
assert.ok(legacyRuntimeAlias.includes('importScripts("./sw.js?alias=v10")'), "v8 worker URL must converge on the v10 retirement runtime");
assert.ok((await readFile(path.join(root, "pwa-icon-maskable.svg"), "utf8")).includes("<svg"));
const builtScripts = (await readdir(path.join(root, "assets"))).filter((file) => file.endsWith(".js"));
const builtScriptSources = await Promise.all(builtScripts.map((file) => readFile(path.join(root, "assets", file), "utf8")));
assert.ok(!builtScriptSources.some((source) => source.includes(".register(") && source.includes("serviceWorker") && source.includes("sw.js")), "The production bundle must not register a portfolio service worker");
assert.ok(builtScriptSources.some((source) => source.includes("getRegistrations") && source.includes("PG_RETIRE_RUNTIME") && source.includes("v10")), "The production bundle does not retire legacy service workers");
assert.ok(builtScriptSources.some((source) => source.includes("vite:preloadError")), "The production bundle does not recover from stale lazy chunks");
assert.ok(builtScriptSources.some((source) => source.includes("runtime-hardening-v10")), "The production bundle does not migrate legacy PWA runtime state");
assert.ok(home.includes('content="https://pabloguilherme1121.github.io/PG-portfolio/social-preview.png"'));
assert.ok(!home.includes('src="/manus-storage/"'));
assert.ok(!builtScriptSources.some((source) => source.includes("/manus-storage/")), "The production bundle must not reference retired media");
const preview = await readFile(path.join(root, "social-preview.png"));
assert.ok(preview.length > 10_000, "Social preview is missing or empty");
assert.ok(Buffer.byteLength(home) < 50_000, "Unexpected inline runtime in the Pages HTML");
console.log("GitHub Pages HTML and public route validated.");
