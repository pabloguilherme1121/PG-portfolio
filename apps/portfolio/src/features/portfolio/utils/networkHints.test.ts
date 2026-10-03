import { describe, expect, it } from "vitest";
import { shouldAvoidSpeculativePreload } from "@/features/portfolio/utils/networkHints";

describe("networkHints", () => {
  it("evita preloads especulativos quando economia de dados está ativa", () => {
    expect(shouldAvoidSpeculativePreload({ saveData: true, effectiveType: "4g" })).toBe(true);
  });

  it("evita preloads especulativos em conexões 2g e slow-2g", () => {
    expect(shouldAvoidSpeculativePreload({ effectiveType: "2g" })).toBe(true);
    expect(shouldAvoidSpeculativePreload({ effectiveType: "slow-2g" })).toBe(true);
  });

  it("mantém preload em conexões normais ou quando a API não existe", () => {
    expect(shouldAvoidSpeculativePreload({ effectiveType: "3g" })).toBe(false);
    expect(shouldAvoidSpeculativePreload({ effectiveType: "4g" })).toBe(false);
    expect(shouldAvoidSpeculativePreload(undefined)).toBe(false);
  });
});
