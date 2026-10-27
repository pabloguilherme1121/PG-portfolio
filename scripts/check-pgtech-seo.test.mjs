import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const get = path => readFileSync(new URL(path, import.meta.url), "utf8");
const html = get("../apps/portfolio/public/lab/index.html");
const origin = "https://pgtech-pi.vercel.app/";

test("PG Tech publishes factual, parseable WebSite structured data", () => {
  const blocks = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  assert.equal(blocks.length, 1, "Only the inert JSON-LD block is allowed");
  assert.match(blocks[0][1], /type=["']application\/ld\+json["']/i);
  const data = JSON.parse(blocks[0][2]);
  assert.equal(data["@context"], "https://schema.org");
  assert.equal(data["@type"], "WebSite");
  assert.equal(data.url, origin);
  assert.equal(data.name, "PG Tech");
  assert.equal(data.inLanguage, "pt-BR");
  assert.equal(data.publisher["@type"], "Person");
  assert.equal(data.publisher.name, "Pablo Guilherme");
  assert.doesNotMatch(blocks[0][2], /LocalBusiness|AggregateRating|openingHours/);
});

test("PG Tech homepage has matching canonical and social URL", () => {
  assert.match(html, /<link rel="canonical" href="https:\/\/pgtech-pi\.vercel\.app\/"/);
  assert.match(html, /<meta property="og:url" content="https:\/\/pgtech-pi\.vercel\.app\/"/);
  assert.match(html, /<meta property="og:site_name" content="PG Tech"/);
  assert.match(html, /<title>PG Tech \| Sites, apps e ferramentas digitais<\/title>/);
});

test("Vercel upload includes crawlable sitemap and robots with canonical host", () => {
  const xml = get("../deploy/pgtech/sitemap.xml");
  const robots = get("../deploy/pgtech/robots.txt");
  assert.match(xml, /<loc>https:\/\/pgtech-pi\.vercel\.app\/<\/loc>/);
  assert.match(xml, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
  assert.match(robots, /^User-agent: \*\nAllow: \/\nSitemap: https:\/\/pgtech-pi\.vercel\.app\/sitemap\.xml\s*$/);
});
