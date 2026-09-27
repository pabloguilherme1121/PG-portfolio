export type TicTacToeMark = "X" | "O";
export type TicTacToeCell = TicTacToeMark | null;
export type TicTacToeBoard = TicTacToeCell[];
export type TicTacToeDifficulty = "easy" | "normal" | "impossible";

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

export function getTicTacToeWinningLine(board: TicTacToeBoard): readonly [number, number, number] | null {
  for (const line of winningLines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
}

export function getTicTacToeWinner(board: TicTacToeBoard): TicTacToeMark | null {
  const line = getTicTacToeWinningLine(board);
  return line ? board[line[0]] : null;
}

function findFinishingMove(board: TicTacToeBoard, mark: TicTacToeMark) {
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) continue;
    const candidate = [...board];
    candidate[index] = mark;
    if (getTicTacToeWinner(candidate) === mark) return index;
  }
  return null;
}

export function chooseTicTacToeBotMove(board: TicTacToeBoard) {
  const winningMove = findFinishingMove(board, "O");
  if (winningMove !== null) return winningMove;

  const blockingMove = findFinishingMove(board, "X");
  if (blockingMove !== null) return blockingMove;

  if (!board[4]) return 4;

  for (const index of [0, 2, 6, 8]) {
    if (!board[index]) return index;
  }

  return board.findIndex((cell) => cell === null);
}

function minimax(board: TicTacToeBoard, maximizing: boolean): number {
  const winner = getTicTacToeWinner(board);
  if (winner === "O") return 10;
  if (winner === "X") return -10;
  if (board.every(Boolean)) return 0;

  const scores: number[] = [];
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) continue;
    const candidate = [...board];
    candidate[index] = maximizing ? "O" : "X";
    scores.push(minimax(candidate, !maximizing));
  }
  return maximizing ? Math.max(...scores) : Math.min(...scores);
}

function chooseImpossibleMove(board: TicTacToeBoard) {
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) continue;
    const candidate = [...board];
    candidate[index] = "O";
    const score = minimax(candidate, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }
  return bestMove;
}

export function chooseTicTacToeBotMoveByDifficulty(
  board: TicTacToeBoard,
  difficulty: TicTacToeDifficulty,
  random: () => number = Math.random,
) {
  const available = board.flatMap((cell, index) => cell === null ? [index] : []);
  if (!available.length) return -1;
  if (difficulty === "easy") {
    return available[Math.min(available.length - 1, Math.floor(random() * available.length))];
  }
  if (difficulty === "impossible") return chooseImpossibleMove(board);
  return chooseTicTacToeBotMove(board);
}
