import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(process.cwd(), "apps/portfolio/src/index.css"), "utf8");

describe("index.css hygiene", () => {
  it("keeps a single light-theme hover rule for project gallery cards", () => {
    const matches =
      css.match(/\.arquivo-page\[data-theme="light"\] \.project-gallery-card:hover\s*\{/g) ?? [];

    expect(matches).toHaveLength(1);
  });

  it("does not repeat the reduced-motion html scroll reset", () => {
    const matches = css.match(/html\s*\{\s*scroll-behavior:\s*auto;\s*\}/g) ?? [];

    expect(matches).toHaveLength(1);
  });
});
