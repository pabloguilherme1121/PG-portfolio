import { describe, expect, it } from "vitest";
import {
  applyCheckersMove,
  chooseCheckersBotMove,
  createCheckersBoard,
  getCheckersLegalMoves,
  getCheckersMovesFrom,
  getCheckersWinner,
  type CheckersBoard,
} from "./checkers";

describe("checkers", () => {
  it("creates classic and quick boards with expected piece counts", () => {
    expect(createCheckersBoard("classic").filter(Boolean)).toHaveLength(24);
    expect(createCheckersBoard("quick").filter(Boolean)).toHaveLength(16);
  });

  it("enforces captures when one is available", () => {
    const board: CheckersBoard = Array.from({ length: 64 }, () => null);
    board[42] = { player: "blue", king: false };
    board[33] = { player: "red", king: false };
    board[44] = { player: "blue", king: false };

    const moves = getCheckersLegalMoves(board, "blue");
    expect(moves).toEqual([{ from: 42, to: 24, capture: 33 }]);
  });

  it("applies captures and promotes pieces", () => {
    const board: CheckersBoard = Array.from({ length: 64 }, () => null);
    board[17] = { player: "blue", king: false };
    board[10] = { player: "red", king: false };

    const next = applyCheckersMove(board, { from: 17, to: 3, capture: 10 });
    expect(next[10]).toBeNull();
    expect(next[3]).toEqual({ player: "blue", king: true });
  });

  it("returns a winner when the opponent has no pieces", () => {
    const board: CheckersBoard = Array.from({ length: 64 }, () => null);
    board[42] = { player: "blue", king: false };
    expect(getCheckersWinner(board, "red")).toBe("blue");
  });

  it("hard bot prioritizes a forced capture", () => {
    const board: CheckersBoard = Array.from({ length: 64 }, () => null);
    board[17] = { player: "red", king: false };
    board[26] = { player: "blue", king: false };
    const move = chooseCheckersBotMove(board, "red", "hard", () => 0);
    expect(move?.capture).toBe(26);
    expect(getCheckersMovesFrom(board, 17).some((candidate) => candidate.capture === 26)).toBe(true);
  });
});
