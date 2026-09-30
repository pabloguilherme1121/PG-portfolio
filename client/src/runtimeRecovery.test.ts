import { describe, expect, it } from "vitest";
import { buildFreshRuntimeUrl, isStaleBundleError } from "./runtimeRecovery";

describe("runtimeRecovery", () => {
  it("recognizes stale dynamic-import failures produced after a deployment", () => {
    expect(
      isStaleBundleError(
        new TypeError(
          "Failed to fetch dynamically imported module: https://example.com/PG-portfolio/assets/PortfolioContact-old.js",
        ),
      ),
    ).toBe(true);
    expect(isStaleBundleError(new Error("ChunkLoadError: Loading chunk PortfolioContact failed"))).toBe(true);
    expect(isStaleBundleError(new Error("Loading chunk 842 failed"))).toBe(true);
    expect(isStaleBundleError("Importing a module script failed")).toBe(true);
  });

  it("does not classify ordinary application exceptions as stale-bundle failures", () => {
    expect(isStaleBundleError(new Error("Cannot read properties of undefined (reading 'id')"))).toBe(false);
  });

  it("creates a cache-busting recovery URL without losing route state", () => {
    const freshUrl = new URL(
      buildFreshRuntimeUrl(
        "https://example.com/PG-portfolio/?projeto=observatorio#projetos",
        "render-error",
        1_700_000_000_000,
      ),
    );

    expect(freshUrl.searchParams.get("projeto")).toBe("observatorio");
    expect(freshUrl.searchParams.get("pg_recover")).toContain("runtime-hardening-v6-render-error-");
    expect(freshUrl.hash).toBe("#projetos");
  });
});
