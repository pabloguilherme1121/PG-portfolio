import { describe, expect, it } from "vitest";
import { chooseFootballKeeperPosition, resolveFootballShot } from "./football";
describe("football shots", () => {
  it("rejects excessive power and shots outside the goal", () => {
    expect(resolveFootballShot("penalty", 50, 100, 0, 0).result).toBe("fora");
    expect(resolveFootballShot("penalty", 0, 60, 0, 50).result).toBe("fora");
  });
  it("allows the keeper to save and rewards placement", () => {
    expect(resolveFootballShot("penalty", 50, 65, 0, 50).result).toBe("defesa");
    expect(resolveFootballShot("penalty", 20, 65, 0, 70).result).toBe("gol");
  });
  it("requires height or curve to beat the free-kick wall", () => {
    expect(resolveFootballShot("free-kick", 50, 40, 0, 10).result).toBe(
      "barreira"
    );
    expect(resolveFootballShot("free-kick", 50, 65, 70, 10).result).toBe("gol");
  });  it("keeper difficulty becomes more predictive without becoming deterministic", () => {
    expect(chooseFootballKeeperPosition("easy", 20, 65, 0, () => 0.5)).toBe(50);
    const hard = chooseFootballKeeperPosition("hard", 20, 65, 0, () => 0.5);
    const master = chooseFootballKeeperPosition("master", 20, 65, 0, () => 0.5);
    expect(Math.abs(master - 20)).toBeLessThanOrEqual(Math.abs(hard - 20));
  });
});
