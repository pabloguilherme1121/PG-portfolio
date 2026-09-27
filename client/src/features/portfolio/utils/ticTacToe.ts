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

export function chooseTicTacToeBotMove(board: TicTacToeBoard, botMark: TicTacToeMark = "O") {
  const winningMove = findFinishingMove(board, botMark);
  if (winningMove !== null) return winningMove;

  const blockingMove = findFinishingMove(board, otherMark(botMark));
  if (blockingMove !== null) return blockingMove;

  if (!board[4]) return 4;

  for (const index of [0, 2, 6, 8]) {
    if (!board[index]) return index;
  }

  return board.findIndex((cell) => cell === null);
}

function chooseImpossibleMove(board: TicTacToeBoard, botMark: TicTacToeMark) {
  let bestScore = -Infinity;
  let bestMove = -1;
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) continue;
    const candidate = [...board];
    candidate[index] = botMark;
    const score = minimaxForMark(candidate, botMark, otherMark(botMark), 0);
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
  botMark: TicTacToeMark = "O",
) {
  const available = board.flatMap((cell, index) => cell === null ? [index] : []);
  if (!available.length) return -1;
  if (difficulty === "easy") {
    return available[Math.min(available.length - 1, Math.floor(random() * available.length))];
  }
  if (difficulty === "impossible") return chooseImpossibleMove(board, botMark);
  return chooseTicTacToeBotMove(board, botMark);
}


export type TicTacToePreset = "quick" | "competitive" | "local";

export type TicTacToeLifetimeStats = {
  games: number;
  wins: number;
  losses: number;
  draws: number;
  currentWinStreak: number;
  bestWinStreak: number;
};

export const emptyTicTacToeLifetimeStats: TicTacToeLifetimeStats = {
  games: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  currentWinStreak: 0,
  bestWinStreak: 0,
};

export function getTicTacToePresetConfig(preset: TicTacToePreset) {
  if (preset === "competitive") {
    return { mode: "bot" as const, difficulty: "impossible" as const, seriesLength: 3 as const };
  }
  if (preset === "local") {
    return { mode: "local" as const, difficulty: "normal" as const, seriesLength: 3 as const };
  }
  return { mode: "bot" as const, difficulty: "normal" as const, seriesLength: 1 as const };
}

function otherMark(mark: TicTacToeMark): TicTacToeMark {
  return mark === "X" ? "O" : "X";
}

function minimaxForMark(
  board: TicTacToeBoard,
  maximizingMark: TicTacToeMark,
  currentMark: TicTacToeMark,
  depth = 0,
): number {
  const winner = getTicTacToeWinner(board);
  if (winner === maximizingMark) return 10 - depth;
  if (winner === otherMark(maximizingMark)) return depth - 10;
  if (board.every(Boolean)) return 0;

  const scores: number[] = [];
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) continue;
    const candidate = [...board];
    candidate[index] = currentMark;
    scores.push(minimaxForMark(candidate, maximizingMark, otherMark(currentMark), depth + 1));
  }

  return currentMark === maximizingMark ? Math.max(...scores) : Math.min(...scores);
}

export function getTicTacToeHintMove(board: TicTacToeBoard, mark: TicTacToeMark) {
  if (getTicTacToeWinner(board) || board.every(Boolean)) return -1;

  let bestMove = -1;
  let bestScore = -Infinity;
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) continue;
    const candidate = [...board];
    candidate[index] = mark;
    const score = minimaxForMark(candidate, mark, otherMark(mark), 0);
    if (score > bestScore) {
      bestScore = score;
      bestMove = index;
    }
  }
  return bestMove;
}

export function updateTicTacToeLifetimeStats(
  stats: TicTacToeLifetimeStats | undefined,
  result: "player" | "bot" | "draw",
): TicTacToeLifetimeStats {
  const current = stats ?? emptyTicTacToeLifetimeStats;
  const currentWinStreak = result === "player" ? current.currentWinStreak + 1 : 0;
  return {
    games: current.games + 1,
    wins: current.wins + (result === "player" ? 1 : 0),
    losses: current.losses + (result === "bot" ? 1 : 0),
    draws: current.draws + (result === "draw" ? 1 : 0),
    currentWinStreak,
    bestWinStreak: Math.max(current.bestWinStreak, currentWinStreak),
  };
}

export function getTicTacToeAchievements(stats: TicTacToeLifetimeStats) {
  const achievements: Array<"primeira-vitoria" | "trinca" | "invicto"> = [];
  if (stats.wins >= 1) achievements.push("primeira-vitoria");
  if (stats.bestWinStreak >= 3) achievements.push("trinca");
  if (stats.games >= 5 && stats.losses === 0) achievements.push("invicto");
  return achievements;
}
