import { describe, expect, it } from "vitest";
import {
  chooseDominoBotMove,
  createDominoSet,
  dealDominoRound,
  getDominoPipTotal,
  getPlayableDominoSides,
  placeDominoTile,
} from "./domino";

describe("domino", () => {
  it("creates a complete double-six set without duplicates", () => {
    const set = createDominoSet();
    expect(set).toHaveLength(28);
    expect(new Set(set.map((tile) => tile.join("-"))).size).toBe(28);
  });

  it("deals quick and classic hands", () => {
    const fixedRandom = () => 0.42;
    expect(dealDominoRound(5, fixedRandom).player).toHaveLength(5);
    expect(dealDominoRound(7, fixedRandom).opponent).toHaveLength(7);
  });

  it("detects both playable sides and orients tiles when placed", () => {
    const chain = [[2, 4], [4, 6]] as const;
    expect(getPlayableDominoSides([2, 6], [...chain])).toEqual(["left", "right"]);
    expect(placeDominoTile([...chain], [1, 2], "left")[0]).toEqual([1, 2]);
    expect(placeDominoTile([...chain], [3, 6], "right").at(-1)).toEqual([6, 3]);
  });

  it("hard bot prefers stronger moves with future options", () => {
    const hand = [[6, 6], [6, 1], [2, 3]] as const;
    const move = chooseDominoBotMove([...hand], [[4, 6]], "hard", () => 0);
    expect(move).not.toBeNull();
    expect(move?.index).toBe(0);
  });

  it("sums pips for blocked-round scoring", () => {
    expect(getDominoPipTotal([[6, 6], [3, 2], [0, 1]])).toBe(18);
  });
});
