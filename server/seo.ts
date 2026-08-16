import type { Express, Request, Response } from "express";

function getPublicOrigin(request: Request) {
  const forwardedProto = request.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || request.protocol || "https";
  const host = request.get("host") || "localhost";
  return `${protocol}://${host}`;
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
