import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";

const indexHtmlPath = path.resolve(import.meta.dirname, "../index.html");

async function readIndexHtml() {
  return readFile(indexHtmlPath, "utf8");
}

describe("portfolio HTML shell", () => {
  it("keeps classic inline scripts free from import.meta syntax", async () => {
    const html = await readIndexHtml();
    const inlineScripts = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
    const classicScripts = inlineScripts
      .filter(([, attributes]) => !/type=["']module["']/i.test(attributes))
      .map(([, , body]) => body);

    expect(classicScripts.join("\n")).not.toContain("import.meta");
  });

  it("ships valid Person structured data", async () => {
    const html = await readIndexHtml();
    const structuredData = html.match(
      /<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i,
    )?.[1];

    expect(structuredData).toBeTruthy();
    expect(() => JSON.parse(structuredData ?? "")).not.toThrow();
    expect(JSON.parse(structuredData ?? "{}").url).toBe(
      "https://pabloguilherme1121.github.io/PG-portfolio/",
    );
  });

  it("uses the dedicated social preview and Vite base-aware favicon", async () => {
    const html = await readIndexHtml();

    expect(html).toContain(
      'content="https://pabloguilherme1121.github.io/PG-portfolio/social-preview.png"',
    );
    expect(html).toContain('href="%BASE_URL%favicon.svg"');
  });
});
