import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const host = "127.0.0.1";
const port = Number(process.env.E2E_PORT ?? 4173);
const pagesBase = "/PG-portfolio";
const publicRoot = path.resolve("dist/public");

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".mp4", "video/mp4"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
]);

function isWithinPublicRoot(filePath) {
  const relative = path.relative(publicRoot, filePath);
  return relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}

async function resolveFile(relativePath) {
  const normalized = relativePath.replace(/^\/+/, "");
  const candidate = path.resolve(publicRoot, normalized || "index.html");
  if (!isWithinPublicRoot(candidate)) return null;

  try {
    const details = await stat(candidate);
    if (details.isDirectory()) return path.join(candidate, "index.html");
    if (details.isFile()) return candidate;
  } catch {
    return null;
  }

  return null;
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? "/", `http://${host}:${port}`);
  const pathname = decodeURIComponent(requestUrl.pathname);

  // Keep the production Pages base intact while allowing the existing tests to
  // navigate with root-relative paths such as "/" and "/favoritos".
  if (!pathname.startsWith(pagesBase)) {
    const targetPath = pathname === "/" ? `${pagesBase}/` : `${pagesBase}${pathname}`;
    response.writeHead(302, { Location: `${targetPath}${requestUrl.search}` });
    response.end();
    return;
  }

  const relativePath = pathname.slice(pagesBase.length);
  let filePath = await resolveFile(relativePath);

  // SPA routes are served by the production index shell.
  if (!filePath && !path.extname(relativePath)) {
    filePath = path.join(publicRoot, "index.html");
  }

  if (!filePath) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  try {
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Cache-Control": "no-store",
      "Content-Type": contentTypes.get(path.extname(filePath).toLowerCase()) ?? "application/octet-stream",
    });
    if (request.method === "HEAD") response.end();
    else response.end(body);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end(error instanceof Error ? error.message : "Server error");
  }
});

server.listen(port, host, () => {
  console.log(`Pages E2E server listening on http://${host}:${port}${pagesBase}/`);
});
