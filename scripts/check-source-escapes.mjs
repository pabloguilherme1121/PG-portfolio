import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

const roots = ["client/src", "server", "e2e"];
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const offenders = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (extensions.has(extname(path))) {
      const source = await readFile(path, "utf8");
      const lines = source.split("\n");
      lines.forEach((line, index) => {
        if (line.includes("\\n") && !line.includes('"\\n"') && !line.includes("'\\n'") && !line.includes("\\n`")) {
          offenders.push(`${path}:${index + 1}`);
        }
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
