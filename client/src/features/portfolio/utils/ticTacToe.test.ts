import { describe, expect, it } from "vitest";
import {
  chooseTicTacToeBotMove,
  chooseTicTacToeBotMoveByDifficulty,
  getTicTacToeWinner,
  getTicTacToeWinningLine,
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
  it("expõe a linha vencedora para destacar o fechamento da rodada", () => {
    const board: TicTacToeBoard = ["O", null, "X", "O", "X", null, "O", null, null];
    expect(getTicTacToeWinningLine(board)).toEqual([0, 3, 6]);
  });

  it("no modo fácil escolhe entre as casas disponíveis usando a fonte aleatória recebida", () => {
    const board: TicTacToeBoard = ["X", null, "O", null, null, null, null, null, null];
    expect(chooseTicTacToeBotMoveByDifficulty(board, "easy", () => 0)).toBe(1);
    expect(chooseTicTacToeBotMoveByDifficulty(board, "easy", () => 0.99)).toBe(8);
  });

  it("no modo impossível impede uma bifurcação clássica do jogador", () => {
    const board: TicTacToeBoard = ["X", null, null, null, "O", null, null, null, "X"];
    expect([1, 3, 5, 7]).toContain(chooseTicTacToeBotMoveByDifficulty(board, "impossible"));
  });
});
