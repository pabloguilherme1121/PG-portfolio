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
assert.ok(Buffer.byteLength(home) < 50_000, "Unexpected inline runtime in the Pages HTML");
console.log("GitHub Pages HTML and public route validated.");
