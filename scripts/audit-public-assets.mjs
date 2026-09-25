import { appendFile, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const sourceDir = path.resolve("client");
const publicDir = path.resolve("client/public");
const validExtensions = new Set([".tsx", ".ts", ".html", ".css"]);
const referencedAssets = new Set();

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspect(file);
    } else if (validExtensions.has(path.extname(file))) {
      const source = await readFile(file, "utf8");
      for (const match of source.matchAll(/\/manus-storage\/[\w.-]+/g)) referencedAssets.add(match[0]);
    }
  }
}

await inspect(sourceDir);
const missing = [];
for (const asset of [...referencedAssets].sort()) {
  const file = path.join(publicDir, asset.slice(1));
  try {
    if (!(await stat(file)).isFile()) missing.push(asset);
  } catch {
    missing.push(asset);
  }
}

const message = `${referencedAssets.size} referências de mídia; ${missing.length} arquivo(s) ausente(s) em client/public/manus-storage.`;
console.log(message);
if (missing.length) {
  console.log(`Exemplos: ${missing.slice(0, 8).join(", ")}`);
  if (process.env.GITHUB_ACTIONS) console.log(`::warning title=Mídias ausentes::${message}`);
}
if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, `### Arquivos públicos\n\n${message}\n\n`);
}
if (missing.length && process.argv.includes("--strict")) process.exitCode = 1;
