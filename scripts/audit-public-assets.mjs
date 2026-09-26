import { appendFile, readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const sourceDir = path.resolve("client");
const publicDir = path.resolve("client/public");
const validExtensions = new Set([".tsx", ".ts", ".html", ".css"]);
const requiredAssets = new Set();
const optionalAssets = new Set();

async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspect(file);
      continue;
    }
    if (!validExtensions.has(path.extname(file))) continue;

    const source = await readFile(file, "utf8");
    for (const match of source.matchAll(/\/portfolio-media\/[\w.-]+/g)) requiredAssets.add(match[0]);
    for (const match of source.matchAll(/\/manus-storage\/[\w.-]+/g)) optionalAssets.add(match[0]);
  }
}

async function findMissing(assets) {
  const missing = [];
  for (const asset of [...assets].sort()) {
    const file = path.join(publicDir, asset.slice(1));
    try {
      if (!(await stat(file)).isFile()) missing.push(asset);
    } catch {
      missing.push(asset);
    }
  }
  return missing;
}

await inspect(sourceDir);

const missingRequired = await findMissing(requiredAssets);
const missingOptional = await findMissing(optionalAssets);
const requiredMessage = `${requiredAssets.size} mídia(s) versionada(s); ${missingRequired.length} arquivo(s) obrigatório(s) ausente(s).`;
const optionalMessage = `${optionalAssets.size} referência(s) opcional(is); ${missingOptional.length} arquivo(s) opcional(is) ausente(s).`;

console.log(requiredMessage);
console.log(optionalMessage);

if (missingRequired.length) {
  console.log(`Obrigatórios ausentes: ${missingRequired.join(", ")}`);
  if (process.env.GITHUB_ACTIONS) console.log(`::error title=Mídias obrigatórias ausentes::${requiredMessage}`);
}
if (missingOptional.length && process.env.GITHUB_ACTIONS) {
  console.log(`::notice title=Mídias opcionais não versionadas::${optionalMessage}`);
}

if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(
    process.env.GITHUB_STEP_SUMMARY,
    `### Arquivos públicos\n\n- ${requiredMessage}\n- ${optionalMessage}\n\n`,
  );
}

if (missingRequired.length && (process.argv.includes("--strict") || process.argv.includes("--strict-if-present"))) {
  process.exitCode = 1;
}
