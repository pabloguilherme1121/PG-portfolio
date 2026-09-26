import { describe, expect, it } from "vitest";
import {
  chooseTicTacToeBotMove,
  getTicTacToeWinner,
  type TicTacToeBoard,
} from "./ticTacToe";

describe("ticTacToe", () => {
  it("detecta vitória em linha", () => {
    const board: TicTacToeBoard = ["X", "X", "X", null, "O", null, "O", null, null];
    expect(getTicTacToeWinner(board)).toBe("X");
  });

  it("prioriza vitória do bot antes de bloquear", () => {
    const board: TicTacToeBoard = ["O", "O", null, "X", "X", null, "X", null, null];
    expect(chooseTicTacToeBotMove(board)).toBe(2);
  });

  it("bloqueia uma vitória imediata do jogador", () => {
    const board: TicTacToeBoard = ["X", "X", null, null, "O", null, null, null, null];
    expect(chooseTicTacToeBotMove(board)).toBe(2);
  });

  it("prefere o centro quando não existe ameaça imediata", () => {
    const board: TicTacToeBoard = ["X", null, null, null, null, null, null, null, null];
    expect(chooseTicTacToeBotMove(board)).toBe(4);
  });
});
