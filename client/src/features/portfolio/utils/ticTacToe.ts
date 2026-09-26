export type TicTacToeMark = "X" | "O";
export type TicTacToeCell = TicTacToeMark | null;
export type TicTacToeBoard = TicTacToeCell[];

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

export function getTicTacToeWinner(board: TicTacToeBoard): TicTacToeMark | null {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
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
