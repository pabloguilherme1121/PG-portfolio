import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";

const port = 4317;
const server = spawn(process.execPath, ["apps/api/dist/index.js"], {
  env: { ...process.env, NODE_ENV: "production", PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"],
});
let logs = "";
server.stdout.on("data", chunk => { logs += chunk; });
server.stderr.on("data", chunk => { logs += chunk; });
try {
  let home;
  for (let attempt = 0; attempt < 50; attempt++) {
    try { home = await fetch(`http://127.0.0.1:${port}/`); break; } catch { await setTimeout(200); }
  }
  assert.ok(home?.ok, logs);
  assert.match(await home.text(), /<div id="root">/);
  const privacy = await fetch(`http://127.0.0.1:${port}/privacidade`, { headers: { accept: "text/html" } });
  assert.equal(privacy.status, 200);
  const storage = await fetch(`http://127.0.0.1:${port}/manus-storage/folder/example.jpg`);
  assert.equal(storage.status, 500);
  assert.equal(await storage.text(), "Storage proxy not configured");
  const auth = await fetch(`http://127.0.0.1:${port}/api/trpc/auth.me`);
  assert.equal(auth.status, 200);
  assert.match(auth.headers.get("cache-control"), /no-store/);
  assert.equal((await auth.json()).result.data.json, null);
  console.log("API smoke passed: HTML, storage route, privacy fallback and unauthenticated tRPC.");
} finally {
  server.kill();
}
