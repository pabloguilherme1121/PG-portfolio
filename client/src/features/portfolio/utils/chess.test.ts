import { describe, expect, it } from "vitest";
import {
  applyChessMove,
  chooseChessBotMove,
  createInitialChessState,
  getChessLegalMoves,
  getChessStatus,
  type ChessState,
} from "./chess";

describe("chess", () => {
  it("creates the standard opening position with 32 pieces", () => {
    const state = createInitialChessState();
    expect(state.board.filter(Boolean)).toHaveLength(32);
    expect(state.turn).toBe("white");
    expect(getChessLegalMoves(state, "white")).toHaveLength(20);
  });

  it("supports castling rights, en passant target and automatic queen promotion", () => {
    let state = createInitialChessState();
    state = applyChessMove(state, { from: 52, to: 36 })!;
    expect(state.enPassant).toBe(44);

    const promotionState: ChessState = {
      ...state,
      turn: "white",
      enPassant: null,
      board: Array.from({ length: 64 }, (_, index) =>
        index === 8 ? { color: "white", type: "pawn" as const } :
        index === 60 ? { color: "white", type: "king" as const } :
        index === 4 ? { color: "black", type: "king" as const } : null
      ),
    };
    const promoted = applyChessMove(promotionState, { from: 8, to: 0 });
    expect(promoted?.board[0]).toEqual({ color: "white", type: "queen" });
  });

  it("filters moves that expose the king and detects checkmate", () => {
    const state: ChessState = {
      board: Array.from({ length: 64 }, (_, index) =>
        index === 7 ? { color: "black", type: "king" as const } :
        index === 14 ? { color: "white", type: "queen" as const } :
        index === 21 ? { color: "white", type: "king" as const } : null
      ),
      turn: "black",
      castling: { whiteKingSide: false, whiteQueenSide: false, blackKingSide: false, blackQueenSide: false },
      enPassant: null,
    };
    expect(getChessStatus(state)).toEqual({ kind: "checkmate", winner: "white" });
  });

  it("bot returns a legal move across all difficulty levels", () => {
    const state = createInitialChessState();
    for (const difficulty of ["easy", "normal", "hard", "master", "expert"] as const) {
      const legal = getChessLegalMoves(state, "white");
      const move = chooseChessBotMove(state, "white", difficulty, () => 0);
      expect(move).not.toBeNull();
      expect(legal).toContainEqual(move);
    }
  });
});
