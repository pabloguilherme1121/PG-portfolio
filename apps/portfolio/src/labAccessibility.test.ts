import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

describe("PG Lab: rótulos acessíveis", () => {
  it("mantém o nome visível do hub dentro do nome acessível do link principal", () => {
    const html = read("apps/portfolio/public/lab/index.html");
    const brand = html.match(/<header><a\b[^>]*class="brand"[^>]*>/i)?.[0] ?? "";
    expect(brand).toMatch(/aria-label="[^"]*pablo\.builds\.ia[^"]*"/);
    expect(brand).toContain('href="#principal"');
  });

  it("rotula o seletor de arquivo JSON do Shotlist sem expor o campo oculto", () => {
    const html = read("apps/portfolio/public/lab/shotlist/index.html");
    const field = html.match(/<input\b[^>]*id="json-import"[^>]*>/i)?.[0] ?? "";
    expect(field).toContain('aria-label="Selecionar arquivo JSON de cenas"');
    expect(field).toContain('type="file"');
    expect(field).toContain("hidden");
    expect(html).toContain('id="json-import-button"');
  });
});
