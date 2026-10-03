import { describe, expect, it } from "vitest";
import {
  applyChessMove,
  createInitialChessState,
  getChessLegalMoves,
  getChessStatus,
  type ChessState,
} from "./chess";

function move(state: ChessState, from: number, to: number) {
  const next = applyChessMove(state, { from, to });
  expect(next).not.toBeNull();
  return next!;
}

describe("special chess rules", () => {
  it("castles both pieces and retires the rights without mutating the previous position", () => {
    const state = createInitialChessState();
    state.board[61] = null;
    state.board[62] = null;
    const next = move(state, 60, 62);
    expect(next.board[62]?.type).toBe("king");
    expect(next.board[61]?.type).toBe("rook");
    expect(next.board[63]).toBeNull();
    expect(next.castling.whiteKingSide).toBe(false);
    expect(next.castling.whiteQueenSide).toBe(false);
    expect(state.board[60]?.type).toBe("king");
    expect(state.castling.whiteKingSide).toBe(true);
  });

  it("forbids castling through an attacked square or after the rook returned home", () => {
    const state = createInitialChessState();
    state.board[61] = state.board[62] = null;
    state.board[53] = { color: "black", type: "rook" };
    expect(getChessLegalMoves(state).some(m => m.castle === "king")).toBe(
      false
    );
    state.board[53] = null;
    let next = move(state, 63, 62);
    next = move(next, 8, 16);
    next = move(next, 62, 63);
    next = move(next, 16, 24);
    expect(getChessLegalMoves(next).some(m => m.castle === "king")).toBe(false);
  });

  it("captures en passant only on the immediately following turn", () => {
    let state = createInitialChessState();
    for (const [from, to] of [
      [52, 36],
      [8, 16],
      [36, 28],
      [11, 27],
    ])
      state = move(state, from, to);
    const capture = getChessLegalMoves(state).find(
      m => m.from === 28 && m.to === 19
    );
    expect(capture?.enPassantCapture).toBe(27);
    const next = move(state, 28, 19);
    expect(next.board[27]).toBeNull();
    expect(next.board[19]).toEqual({ color: "white", type: "pawn" });
    state = move(state, 48, 40);
    state = move(state, 16, 24);
    expect(
      getChessLegalMoves(state).some(m => m.from === 28 && m.to === 19)
    ).toBe(false);
  });

  it("rejects an en passant capture that exposes its own king", () => {
    const state = createInitialChessState();
    state.board.fill(null);
    state.board[31] = { color: "white", type: "king" };
    state.board[30] = { color: "white", type: "pawn" };
    state.board[29] = { color: "black", type: "pawn" };
    state.board[24] = { color: "black", type: "rook" };
    state.board[0] = { color: "black", type: "king" };
    state.enPassant = 21;
    expect(
      getChessLegalMoves(state).some(m => m.from === 30 && m.to === 21)
    ).toBe(false);
  });

  it("detects stalemate and refuses injected special-move metadata", () => {
    const state = createInitialChessState();
    state.board.fill(null);
    state.board[0] = { color: "black", type: "king" };
    state.board[18] = { color: "white", type: "king" };
    state.board[17] = { color: "white", type: "queen" };
    state.turn = "black";
    expect(getChessStatus(state).kind).toBe("stalemate");
    const next = applyChessMove(createInitialChessState(), {
      from: 52,
      to: 36,
      enPassantCapture: 4,
      castle: "king",
    });
    expect(next?.board[4]?.type).toBe("king");
    expect(next?.board[63]?.type).toBe("rook");
  });
});
