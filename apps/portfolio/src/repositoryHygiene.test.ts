import { existsSync, readFileSync, readdirSync } from "node:fs";
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

    expect(home).not.toContain('components/PortfolioArcade")');
    expect(home).not.toContain('data-arcade-open-control="true"');
    expect(arcadeShortcut?.url).toBe("https://pabloguilherme1121.github.io/PG-Arcade/");
  });

  it("does not retain Manus-branded legacy files or asset probes", () => {
    expect(existsSync(join(root, "apps/portfolio/src/components/ManusDialog.tsx"))).toBe(false);
    expect(existsSync(join(root, "apps/api/src/_core/types/manusTypes.ts"))).toBe(false);
    expect(read("vite.config.ts")).not.toContain("manus-storage");
    expect(read("apps/api/src/_core/sdk.ts")).not.toContain("Manus Scheduled Task");
  });

  it("keeps one current architecture source and archives the obsolete layout", () => {
    expect(existsSync(join(root, "docs/architecture.md"))).toBe(false);
    expect(existsSync(join(root, "docs/current/architecture.md"))).toBe(true);
    expect(existsSync(join(root, "docs/archive/architecture-legacy.md"))).toBe(true);
  });

  it("keeps one canonical Instagram integration note without an exact archive duplicate", () => {
    expect(existsSync(join(root, "docs/integrations/instagram-integration-notes.md"))).toBe(true);
    expect(existsSync(join(root, "docs/archive/instagram-integration-notes.md"))).toBe(false);
  });

  it("does not retain compatibility-only frontend aliases without consumers", () => {
    expect(existsSync(join(root, "apps/portfolio/src/pages/InstagramRepertoire.tsx"))).toBe(false);
    expect(existsSync(join(root, "apps/portfolio/src/lib/portfolioCatalog.ts"))).toBe(false);

    const favoritesManagement = read("apps/api/client/pages/FavoritesManagement.tsx");
    const portfolioContract = read("apps/api/src/portfolioData.contract.test.ts");
    expect(favoritesManagement).not.toContain("@/lib/portfolioCatalog");
    expect(portfolioContract).not.toContain("@/lib/portfolioCatalog");
    expect(favoritesManagement).toContain("@/features/portfolio/utils/projectCatalog");
    expect(portfolioContract).toContain("@/features/portfolio/utils/projectCatalog");
  });

  it("keeps tracked scripts limited to CI and supported workspace tooling", () => {
    const scripts = readdirSync(join(root, "scripts"))
      .filter((file) => file.endsWith(".mjs"))
      .sort();

    expect(scripts).toEqual([
      "audit-public-assets.mjs",
      "build-api.mjs",
      "check-bundle-budget.mjs",
      "check-source-escapes.mjs",
      "prepare-github-pages.mjs",
      "run-workspace.mjs",
      "smoke-api.mjs",
      "validate-pages-bundle.mjs",
      "verify-static-isolation.mjs",
    ]);
  });

  it("keeps the public UI layer limited to primitives that have consumers", () => {
    const uiDirectory = join(root, "apps/portfolio/src/components/ui");
    const uiFiles = readdirSync(uiDirectory)
      .filter((file) => file.endsWith(".tsx"))
      .sort();

    expect(uiFiles).toEqual([
      "alert-dialog.tsx",
      "avatar.tsx",
      "button.tsx",
      "dialog.tsx",
      "dropdown-menu.tsx",
      "input.tsx",
      "separator.tsx",
      "sheet.tsx",
      "sidebar.tsx",
      "skeleton.tsx",
      "sonner.tsx",
      "tooltip.tsx",
    ]);

    const portfolioPackage = JSON.parse(read("apps/portfolio/package.json")) as {
      dependencies?: Record<string, string>;
    };
    const dependencies = portfolioPackage.dependencies ?? {};
    const legacyUiDependencies = [
      "@radix-ui/react-accordion",
      "@radix-ui/react-aspect-ratio",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-slider",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toggle",
      "@radix-ui/react-toggle-group",
      "framer-motion",
      "input-otp",
      "jszip",
      "react-day-picker",
      "react-hook-form",
      "react-resizable-panels",
    ].filter((dependency) => dependency in dependencies);

    expect(legacyUiDependencies).toEqual([]);
  });

  it("does not retain unused template service helpers in the optional API", () => {
    const unusedApiHelpers = [
      "apps/api/src/_core/dataApi.ts",
      "apps/api/src/_core/heartbeat.ts",
      "apps/api/src/_core/imageGeneration.ts",
      "apps/api/src/_core/llm.ts",
      "apps/api/src/_core/map.ts",
      "apps/api/src/_core/voiceTranscription.ts",
      "apps/api/src/storage.ts",
    ];

    for (const path of unusedApiHelpers) {
      expect(existsSync(join(root, path))).toBe(false);
    }
  });

  it("does not allow obsolete external script origins in the API CSP", () => {
    const apiEntry = read("apps/api/src/_core/index.ts");
    expect(apiEntry).not.toContain("https://files.manuscdn.com");
  });

  it("does not retain the unused Manus storage proxy route", () => {
    expect(existsSync(join(root, "apps/api/src/_core/storageProxy.ts"))).toBe(false);
    expect(existsSync(join(root, "apps/api/src/_core/storageProxy.test.ts"))).toBe(false);
    expect(read("apps/api/src/_core/index.ts")).not.toContain("registerStorageProxy");
    expect(read("scripts/smoke-api.mjs")).not.toContain("/manus-storage/");
  });

  it("does not retain placeholder files without a directory-preservation purpose", () => {
    expect(existsSync(join(root, "apps/portfolio/public/.gitkeep"))).toBe(false);
    expect(existsSync(join(root, "apps/api/drizzle/migrations/.gitkeep"))).toBe(false);
  });

  it("keeps the design contract aligned with the dedicated PG Arcade", () => {
    const design = read("DESIGN.md");
    expect(design).not.toContain("cinco jogos");
    expect(design).toContain("PG Arcade dedicado");
  });

});
