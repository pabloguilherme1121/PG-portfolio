import { describe, expect, it } from "vitest";
import { isStaleBundleError } from "./runtimeRecovery";

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
    expect(isStaleBundleError("Importing a module script failed")).toBe(true);
  });

  it("does not classify ordinary application exceptions as stale-bundle failures", () => {
    expect(isStaleBundleError(new Error("Cannot read properties of undefined (reading 'id')"))).toBe(false);
  });
});
