import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(root, "dist", "public", "assets");

const budgets = {
  javascriptChunk: 225 * 1024,
  stylesheet: 240 * 1024,
};

if (!fs.existsSync(assetsDir)) {
  console.error("Bundle budget: dist/public/assets não existe. Execute o build antes da auditoria.");
  process.exit(1);
}

const files = fs.readdirSync(assetsDir);
const javascriptFiles = files.filter((file) => file.endsWith(".js"));
const stylesheetFiles = files.filter((file) => file.endsWith(".css"));

const violations = [];

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(2)} kB`;
}

for (const file of javascriptFiles) {
  const size = fs.statSync(path.join(assetsDir, file)).size;
  if (size > budgets.javascriptChunk) {
    violations.push(`${file}: ${formatKb(size)} > ${formatKb(budgets.javascriptChunk)}`);
  }
}

for (const file of stylesheetFiles) {
  const size = fs.statSync(path.join(assetsDir, file)).size;
  if (size > budgets.stylesheet) {
    violations.push(`${file}: ${formatKb(size)} > ${formatKb(budgets.stylesheet)}`);
  }
}

const largestJs = javascriptFiles
  .map((file) => ({ file, size: fs.statSync(path.join(assetsDir, file)).size }))
  .sort((a, b) => b.size - a.size)[0];
const largestCss = stylesheetFiles
  .map((file) => ({ file, size: fs.statSync(path.join(assetsDir, file)).size }))
  .sort((a, b) => b.size - a.size)[0];

if (largestJs) console.log(`Bundle budget · maior JS: ${largestJs.file} · ${formatKb(largestJs.size)} / ${formatKb(budgets.javascriptChunk)}`);
if (largestCss) console.log(`Bundle budget · CSS: ${largestCss.file} · ${formatKb(largestCss.size)} / ${formatKb(budgets.stylesheet)}`);

if (violations.length) {
  console.error("Bundle budget excedido:");
  violations.forEach((violation) => console.error(`- ${violation}`));
  process.exit(1);
}

console.log("Bundle budget aprovado.");
