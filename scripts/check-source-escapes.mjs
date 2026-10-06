import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

const roots = ["apps/portfolio/src", "apps/api/src", "apps/api/client", "packages/contracts", "e2e", "e2e-static"];
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const offenders = [];

function stripQuotedStrings(line) {
  return line
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''")
    .replace(/`(?:\\.|[^`\\])*`/g, "``");
}

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (extensions.has(extname(path))) {
      const source = await readFile(path, "utf8");
      source.split("\n").forEach((line, index) => {
        if (stripQuotedStrings(line).includes("\\n")) offenders.push(`${path}:${index + 1}`);
      });
    }
  }
}

for (const root of roots) await walk(root);
if (offenders.length) {
  console.error("Possíveis escapes \\n literais fora de strings:");
  offenders.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}
console.log("Source escape audit passed.");
