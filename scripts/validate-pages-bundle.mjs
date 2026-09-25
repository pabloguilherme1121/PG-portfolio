import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist/public");
const read = (file) => readFile(path.join(root, file), "utf8");
const [home, privacy, fallback] = await Promise.all([
  read("index.html"),
  read("privacidade/index.html"),
  read("404.html"),
]);

assert.ok(home.includes('rel="canonical" href="https://pabloguilherme1121.github.io/PG-portfolio/"'));
assert.ok(privacy.includes('rel="canonical" href="https://pabloguilherme1121.github.io/PG-portfolio/privacidade/"'));
assert.ok(privacy.includes("<title>Privacidade — Pablo Guilherme</title>"));
assert.ok(fallback.includes('content="noindex, follow" id="robots-meta"'));
assert.ok(!home.includes("/manus-storage/"), "The public shell should not link to missing media");
const structuredData = home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert.ok(structuredData, "Person structured data is missing");
assert.equal(JSON.parse(structuredData).url, "https://pabloguilherme1121.github.io/PG-portfolio/");
assert.ok(!home.includes("%BASE_URL%"), "The favicon URL was not expanded by Vite");
assert.ok(home.includes('href="/PG-portfolio/favicon.svg"'));
assert.ok(home.includes('content="https://pabloguilherme1121.github.io/PG-portfolio/social-preview.png"'));
const preview = await readFile(path.join(root, "social-preview.png"));
assert.ok(preview.length > 10_000, "Social preview is missing or empty");
assert.ok(Buffer.byteLength(home) < 50_000, "Unexpected inline runtime in the Pages HTML");
console.log("GitHub Pages HTML and public route validated.");
