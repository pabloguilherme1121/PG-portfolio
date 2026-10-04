import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const read = (path: string) => readFileSync(join(root, path), "utf8");

describe("repository hygiene", () => {
  it("uses the dedicated PG Arcade as the only playable Arcade source", () => {
    const home = read("apps/portfolio/src/features/portfolio/HomeExperience.tsx");
    const manifest = JSON.parse(read("apps/portfolio/public/manifest.webmanifest")) as {
      shortcuts?: Array<{ name?: string; url?: string }>;
    };
    const arcadeShortcut = manifest.shortcuts?.find((shortcut) => shortcut.name === "Abrir PG Arcade");

    expect(home).not.toContain('components/PortfolioArcade');
    expect(home).not.toContain('data-arcade-open-control="true"');
    expect(arcadeShortcut?.url).toBe("https://pabloguilherme1121.github.io/PG-Arcade/");
  });

  it("does not retain Manus-branded legacy files or asset probes", () => {
    expect(existsSync(join(root, "apps/portfolio/src/components/ManusDialog.tsx"))).toBe(false);
    expect(existsSync(join(root, "apps/api/src/_core/types/manusTypes.ts"))).toBe(false);
    expect(read("vite.config.ts")).not.toContain("manus-storage");
    expect(read("apps/api/src/_core/sdk.ts")).not.toContain("Manus Scheduled Task");
  });
});
