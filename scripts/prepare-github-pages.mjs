import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
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

const homepage = await readFile(path.join(outputDir, "index.html"), "utf8");
const publicUrl = "https://pabloguilherme1121.github.io/PG-portfolio/";
const privacyUrl = `${publicUrl}privacidade/`;

// A real file gives the public privacy route HTTP 200 instead of relying on the 404 fallback.
const privacy = homepage
  .replace(`<title>Pablo Guilherme — Tecnologia, Conteúdo e Repertório Visual</title>`, `<title>Privacidade — Pablo Guilherme</title>`)
  .replace(`rel="canonical" href="${publicUrl}"`, `rel="canonical" href="${privacyUrl}"`)
  .replace(`property="og:url" content="${publicUrl}"`, `property="og:url" content="${privacyUrl}"`)
  .replace(`property="og:title" content="Pablo Guilherme — tecnologia, conteúdo e repertório visual"`, `property="og:title" content="Privacidade — Pablo Guilherme"`)
  .replace(`name="twitter:title" content="Pablo Guilherme — tecnologia, conteúdo e repertório visual"`, `name="twitter:title" content="Privacidade — Pablo Guilherme"`)
  .replace(`property="og:description" content="Projetos de Pablo Guilherme em desenvolvimento web, interfaces, conteúdo audiovisual e captação aérea, conectando tecnologia e produção visual."`, `property="og:description" content="Como o portfólio de Pablo Guilherme trata preferências locais e pedidos de contato."`)
  .replace(`name="twitter:description" content="Desenvolvimento web, interfaces, conteúdo audiovisual e captação aérea em um portfólio multidisciplinar."`, `name="twitter:description" content="Como o portfólio de Pablo Guilherme trata preferências locais e pedidos de contato."`)
  .replace(`content="Portfólio de Pablo Guilherme, estudante de Análise e Desenvolvimento de Sistemas (ADS), com projetos em desenvolvimento web, interfaces, conteúdo audiovisual e captação aérea."`, `content="Como o portfólio de Pablo Guilherme trata preferências locais e pedidos de contato."`);
await mkdir(path.join(outputDir, "privacidade"), { recursive: true });
await writeFile(path.join(outputDir, "privacidade", "index.html"), privacy);

// Unknown routes may render the SPA fallback, but must not be indexed as public pages.
const notFound = homepage.replace(`content="index, follow" id="robots-meta"`, `content="noindex, follow" id="robots-meta"`);
await writeFile(path.join(outputDir, "404.html"), notFound);
console.log("GitHub Pages bundle prepared.");
