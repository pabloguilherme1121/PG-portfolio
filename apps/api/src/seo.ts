import type { Express, Request, Response } from "express";

const CANONICAL_ORIGIN = "https://pabloguilherme1121.github.io/PG-portfolio";

function getPublicOrigin(_request: Request) {
  return CANONICAL_ORIGIN;
}

function sendXml(response: Response, content: string) {
  response.type("application/xml").set("Cache-Control", "public, max-age=3600").send(content);
}

export function registerSeoRoutes(app: Express) {
  app.get("/sitemap.xml", (request, response) => {
    const origin = getPublicOrigin(request);
    sendXml(
      response,
      `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${origin}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
  <url><loc>${origin}/agenda</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
</urlset>`,
    );
  });

  app.get("/robots.txt", (request, response) => {
    const origin = getPublicOrigin(request);
    response
      .type("text/plain")
      .set("Cache-Control", "public, max-age=3600")
      .send(`User-agent: *\nAllow: /\nDisallow: /favoritos\nDisallow: /curadoria\nSitemap: ${origin}/sitemap.xml\n`);
  });
}
