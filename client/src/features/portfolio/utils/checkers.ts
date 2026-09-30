export type CheckersPlayer = "blue" | "red";
export type CheckersDifficulty = "easy" | "normal" | "hard";
export type CheckersVariant = "quick" | "classic";
export type CheckersPiece = { player: CheckersPlayer; king: boolean };
export type CheckersBoard = Array<CheckersPiece | null>;
export type CheckersMove = { from: number; to: number; capture?: number };

const BOARD_SIZE = 8;
const indexOf = (row: number, col: number) => row * BOARD_SIZE + col;
const inBounds = (row: number, col: number) => row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

export function getCheckersCoordinates(index: number) {
  return { row: Math.floor(index / BOARD_SIZE), col: index % BOARD_SIZE };
}

export function createCheckersBoard(variant: CheckersVariant = "classic"): CheckersBoard {
  const board: CheckersBoard = Array.from({ length: 64 }, () => null);
  const rowsPerSide = variant === "classic" ? 3 : 2;

  for (let row = 0; row < rowsPerSide; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if ((row + col) % 2 === 1) board[indexOf(row, col)] = { player: "red", king: false };
    }
  }

  for (let row = BOARD_SIZE - rowsPerSide; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if ((row + col) % 2 === 1) board[indexOf(row, col)] = { player: "blue", king: false };
    }
  }

  return board;
}

function directionsFor(piece: CheckersPiece) {
  if (piece.king) return [-1, 1] as const;
  return piece.player === "red" ? [1] as const : [-1] as const;
}

export function getCheckersMovesFrom(board: CheckersBoard, from: number, captureOnly = false): CheckersMove[] {
  const piece = board[from];
  if (!piece) return [];
  const { row, col } = getCheckersCoordinates(from);
  const captures: CheckersMove[] = [];
  const steps: CheckersMove[] = [];

  for (const rowDirection of directionsFor(piece)) {
    for (const colDirection of [-1, 1] as const) {
      const nextRow = row + rowDirection;
      const nextCol = col + colDirection;
      if (!inBounds(nextRow, nextCol)) continue;
      const nextIndex = indexOf(nextRow, nextCol);
      const occupant = board[nextIndex];

      if (!occupant && !captureOnly) steps.push({ from, to: nextIndex });

      if (occupant && occupant.player !== piece.player) {
        const jumpRow = row + rowDirection * 2;
        const jumpCol = col + colDirection * 2;
        if (!inBounds(jumpRow, jumpCol)) continue;
        const jumpIndex = indexOf(jumpRow, jumpCol);
        if (!board[jumpIndex]) captures.push({ from, to: jumpIndex, capture: nextIndex });
      }
    }
  }

  return captures.length ? captures : captureOnly ? [] : steps;
}

export function getCheckersLegalMoves(board: CheckersBoard, player: CheckersPlayer): CheckersMove[] {
  const captures: CheckersMove[] = [];
  const steps: CheckersMove[] = [];

  board.forEach((piece, index) => {
    if (piece?.player !== player) return;
    const moves = getCheckersMovesFrom(board, index);
    for (const move of moves) {
      if (move.capture !== undefined) captures.push(move);
      else steps.push(move);
    }
  });

  return captures.length ? captures : steps;
}

export function applyCheckersMove(board: CheckersBoard, move: CheckersMove): CheckersBoard {
  const next = board.map((piece) => (piece ? { ...piece } : null));
  const piece = next[move.from];
  if (!piece) return next;

  next[move.from] = null;
  if (move.capture !== undefined) next[move.capture] = null;

  const destination = getCheckersCoordinates(move.to);
  const promoted =
    !piece.king &&
    ((piece.player === "blue" && destination.row === 0) ||
      (piece.player === "red" && destination.row === BOARD_SIZE - 1));

  next[move.to] = { ...piece, king: piece.king || promoted };
  return next;
}

export function getCheckersWinner(board: CheckersBoard, playerToMove: CheckersPlayer): CheckersPlayer | null {
  const blueCount = board.filter((piece) => piece?.player === "blue").length;
  const redCount = board.filter((piece) => piece?.player === "red").length;
  if (!blueCount) return "red";
  if (!redCount) return "blue";
  if (!getCheckersLegalMoves(board, playerToMove).length) return playerToMove === "blue" ? "red" : "blue";
  return null;
}

function evaluateBoard(board: CheckersBoard, player: CheckersPlayer) {
  const opponent = player === "blue" ? "red" : "blue";
  const scoreFor = (target: CheckersPlayer) =>
    board.reduce((score, piece) => {
      if (piece?.player !== target) return score;
      return score + (piece.king ? 5 : 3);
    }, 0);
  return scoreFor(player) - scoreFor(opponent) + getCheckersLegalMoves(board, player).length * 0.2;
}

export function chooseCheckersBotMove(
  board: CheckersBoard,
  player: CheckersPlayer,
  difficulty: CheckersDifficulty,
  random: () => number = Math.random,
): CheckersMove | null {
  const moves = getCheckersLegalMoves(board, player);
  if (!moves.length) return null;
  if (difficulty === "easy") return moves[Math.floor(random() * moves.length)] ?? moves[0];

  const scored = moves.map((move) => {
    const next = applyCheckersMove(board, move);
    const destination = next[move.to];
    const captureBonus = move.capture !== undefined ? 8 : 0;
    const promotionBonus = destination?.king && !board[move.from]?.king ? 6 : 0;
    const strategic = difficulty === "hard" ? evaluateBoard(next, player) * 2 : 0;
    return { move, score: captureBonus + promotionBonus + strategic };
  });

  return scored.sort((a, b) => b.score - a.score)[0].move;
}
