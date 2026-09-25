import { cp, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDir = path.resolve("dist/public");
const repositoryBase = "/PG-portfolio";
const textExtensions = new Set([".html", ".js", ".css", ".json", ".map", ".svg"]);

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  }));
  return files.flat();
}

for (const file of await walk(outputDir)) {
  if (!textExtensions.has(path.extname(file))) continue;
  const source = await readFile(file, "utf8");
  const rewritten = source
    .replaceAll("/manus-storage/", `${repositoryBase}/manus-storage/`)
    .replaceAll("/attached_assets/", `${repositoryBase}/attached_assets/`);
  if (rewritten !== source) await writeFile(file, rewritten, "utf8");
}

// GitHub Pages uses 404.html as the SPA fallback for direct route visits.
await cp(path.join(outputDir, "index.html"), path.join(outputDir, "404.html"));
console.log("GitHub Pages bundle prepared.");
