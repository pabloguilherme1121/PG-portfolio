import { Bot, RotateCcw, Sparkles, Swords, UsersRound } from "lucide-react";
import { useMemo, useState } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import {
  chooseTicTacToeBotMoveByDifficulty,
  getTicTacToeWinner,
  getTicTacToeWinningLine,
  type TicTacToeBoard,
  type TicTacToeDifficulty,
  type TicTacToeMark,
} from "@/features/portfolio/utils/ticTacToe";

const emptyBoard = (): TicTacToeBoard => Array.from({ length: 9 }, () => null);
type GameResult = "player" | "bot" | "draw" | null;
type GameMode = "bot" | "local";
type SeriesLength = 1 | 3 | 5;

export default function PortfolioTicTacToe() {
  const [board, setBoard] = useState<TicTacToeBoard>(emptyBoard);
  const [result, setResult] = useState<GameResult>(null);
  const [mode, setMode] = useState<GameMode>("bot");
  const [difficulty, setDifficulty] = useState<TicTacToeDifficulty>("normal");
  const [playerMark, setPlayerMark] = useState<TicTacToeMark>("X");
  const [turn, setTurn] = useState<TicTacToeMark>("X");
  const [seriesLength, setSeriesLength] = useState<SeriesLength>(3);
  const [score, setScore] = useState({ player: 0, opponent: 0, draws: 0 });
  const [round, setRound] = useState(1);
  const [started, setStarted] = useState(false);

  const opponentMark: TicTacToeMark = playerMark === "X" ? "O" : "X";
  const winsNeeded = Math.ceil(seriesLength / 2);
  const winningLine = useMemo(() => getTicTacToeWinningLine(board), [board]);
  const matchWinner = score.player >= winsNeeded ? "player" : score.opponent >= winsNeeded ? "opponent" : null;

  const status = matchWinner === "player"
    ? mode === "bot" ? "Série vencida. Você superou o PG Bot." : "Jogador 1 venceu a série."
    : matchWinner === "opponent"
      ? mode === "bot" ? "PG Bot venceu a série. Hora da revanche." : "Jogador 2 venceu a série."
      : result === "player"
        ? mode === "bot" ? "Você venceu esta rodada." : "Jogador 1 venceu esta rodada."
        : result === "bot"
          ? mode === "bot" ? "PG Bot fechou a rodada." : "Jogador 2 venceu esta rodada."
          : result === "draw"
            ? "Empate. A série continua."
            : mode === "local"
              ? `Vez do jogador ${turn === "X" ? (playerMark === "X" ? "1" : "2") : (playerMark === "O" ? "1" : "2")} · ${turn}`
              : `Sua vez · você joga com ${playerMark}`;

  function recordRound(nextResult: Exclude<GameResult, null>) {
    setResult(nextResult);
    setScore((current) => ({
      player: current.player + (nextResult === "player" ? 1 : 0),
      opponent: current.opponent + (nextResult === "bot" ? 1 : 0),
      draws: current.draws + (nextResult === "draw" ? 1 : 0),
    }));
    trackPortfolioEvent("tic_tac_toe_completed", { gameResult: nextResult });
  }

  function resolveBoard(next: TicTacToeBoard, mark: TicTacToeMark) {
    const winner = getTicTacToeWinner(next);
    if (winner) {
      recordRound(winner === playerMark ? "player" : "bot");
      return true;
    }
    if (next.every(Boolean)) {
      recordRound("draw");
      return true;
    }
    setTurn(mark === "X" ? "O" : "X");
    return false;
  }

  function play(index: number) {
    if (board[index] || result || matchWinner) return;
    if (!started) {
      setStarted(true);
      trackPortfolioEvent("tic_tac_toe_started");
    }

    if (mode === "local") {
      const next = [...board];
      next[index] = turn;
      setBoard(next);
      resolveBoard(next, turn);
      return;
    }

    const next = [...board];
    next[index] = playerMark;
    if (resolveBoard(next, playerMark)) {
      setBoard(next);
      return;
    }

    const botMove = chooseTicTacToeBotMoveByDifficulty(next, difficulty);
    if (botMove >= 0) next[botMove] = opponentMark;
    setBoard(next);

    const winner = getTicTacToeWinner(next);
    if (winner === opponentMark) recordRound("bot");
    else if (next.every(Boolean)) recordRound("draw");
    else setTurn(playerMark);
  }

  function nextRound() {
    setBoard(emptyBoard());
    setResult(null);
    setStarted(false);
    setRound((current) => current + 1);
    setTurn("X");
    trackPortfolioEvent("tic_tac_toe_restarted");
  }

  function restartMatch() {
    setBoard(emptyBoard());
    setResult(null);
    setStarted(false);
    setScore({ player: 0, opponent: 0, draws: 0 });
    setRound(1);
    setTurn("X");
    trackPortfolioEvent("tic_tac_toe_restarted");
  }

  function changeMode(next: GameMode) {
    setMode(next);
    restartMatch();
  }

  function changeMark() {
    setPlayerMark((current) => current === "X" ? "O" : "X");
    restartMatch();
  }

  const optionClass = (active: boolean) => `inline-flex min-h-11 items-center justify-center border px-3 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${active ? "border-[#67e8f9] bg-[#0b2746] text-white" : "border-white/10 text-[#91adbf] hover:border-[#67e8f9]/60 hover:text-white"}`;

  return (
    <section data-tic-tac-toe="true" aria-labelledby="tic-tac-toe-title" className="archive-chapter border-y border-white/[0.07] bg-[#06111e]">
      <div className="mx-auto grid max-w-[1180px] gap-7 px-4 py-12 sm:px-8 sm:py-18 sm:py-18 lg:grid-cols-[0.78fr_1.22fr] lg:items-start lg:px-12 lg:py-20">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">PG Lab · arcade experimental</p>
          <h2 id="tic-tac-toe-title" className="mt-4 font-display text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[0.92] tracking-[-0.055em] text-white">
            Jogo da velha.
            <br />Agora com estratégia.
          </h2>
          <p className="mt-5 max-w-xl font-body text-sm leading-7 text-[#a8c4d7]">
            Escolha o modo, ajuste a dificuldade e dispute uma série. É uma demonstração curta de lógica, estados e interação — opcional e separada da jornada de contratação.
          </p>

          <div className="mt-7 space-y-5">
            <div>
              <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#7191a8]">modo</p>
              <div className="grid grid-cols-2 gap-2 min-[420px]:flex min-[420px]:flex-wrap">
                <button type="button" aria-pressed={mode === "bot"} onClick={() => changeMode("bot")} className={optionClass(mode === "bot")}><Bot className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />contra o bot</button>
                <button type="button" aria-pressed={mode === "local"} onClick={() => changeMode("local")} className={optionClass(mode === "local")}><UsersRound className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />duas pessoas</button>
              </div>
            </div>

            {mode === "bot" && <div>
              <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#7191a8]">dificuldade</p>
              <div className="grid grid-cols-2 gap-2 min-[420px]:flex min-[420px]:flex-wrap">
                {([["easy", "fácil"], ["normal", "normal"], ["impossible", "impossível"]] as const).map(([value, label]) => (
                  <button key={value} type="button" aria-pressed={difficulty === value} onClick={() => { setDifficulty(value); restartMatch(); }} className={optionClass(difficulty === value)}>{label}</button>
                ))}
              </div>
            </div>}

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#7191a8]">série</p>
                <div className="grid grid-cols-2 gap-2 min-[420px]:flex min-[420px]:flex-wrap">
                  {([1, 3, 5] as const).map((length) => <button key={length} type="button" aria-pressed={seriesLength === length} onClick={() => { setSeriesLength(length); restartMatch(); }} className={optionClass(seriesLength === length)}>{length === 1 ? "partida única" : `melhor de ${length}`}</button>)}
                </div>
              </div>
              <div>
                <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#7191a8]">símbolo do jogador 1</p>
                <button type="button" onClick={changeMark} className={optionClass(true)} aria-label={`Jogar com o símbolo ${playerMark}. Clique para trocar`}>jogar com {playerMark} · trocar</button>
              </div>
            </div>
          </div>

          <div data-match-score="true" className="mt-7 grid max-w-md grid-cols-3 gap-px bg-white/10">
            <div className="bg-[#071827] p-3 text-center"><p className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#7191a8]">{mode === "bot" ? "você" : "jogador 1"}</p><p className="mt-1 font-display text-2xl text-[#67e8f9]">{score.player}</p></div>
            <div className="bg-[#071827] p-3 text-center"><p className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#7191a8]">{mode === "bot" ? "PG Bot" : "jogador 2"}</p><p className="mt-1 font-display text-2xl text-white">{score.opponent}</p></div>
            <div className="bg-[#071827] p-3 text-center"><p className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#7191a8]">empates</p><p className="mt-1 font-display text-2xl text-[#b8cce0]">{score.draws}</p></div>
          </div>
          <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.1em] text-[#7191a8]">rodada {round} · primeiro a {winsNeeded} vitória{winsNeeded > 1 ? "s" : ""}</p>
        </div>

        <div className="mx-auto w-full max-w-[540px] border border-[#67e8f9]/20 bg-[#071827]/80 p-3.5 min-[360px]:p-4 sm:p-6">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#67e8f9]">arena</p>
              <p data-game-status="true" role="status" aria-live="polite" className="mt-1 font-body text-sm text-[#d5edf7]">{status}</p>
            </div>
            <Swords className="h-5 w-5 text-[#67e8f9]" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Tabuleiro do jogo da velha">
            {board.map((cell, index) => {
              const row = Math.floor(index / 3) + 1;
              const column = (index % 3) + 1;
              const won = winningLine?.includes(index) ?? false;
              return (
                <button key={index} type="button" data-game-cell="true" data-winning-cell={won ? "true" : undefined} disabled={Boolean(cell) || Boolean(result) || Boolean(matchWinner)} onClick={() => play(index)} aria-label={`Linha ${row}, coluna ${column}: ${cell ?? "vazio"}`} className={`aspect-square min-h-16 border font-display text-[clamp(2rem,8vw,4.5rem)] font-medium transition-[border-color,background-color,transform] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-default motion-reduce:transition-none ${won ? "border-[#67e8f9] bg-[#0d3850] shadow-[inset_0_0_28px_rgba(103,232,249,0.12)]" : "border-white/10 bg-[#08111d] hover:-translate-y-0.5 hover:border-[#67e8f9]/60 hover:bg-[#0a2034] disabled:hover:translate-y-0"}`}>
                  <span className={cell === playerMark ? "text-[#67e8f9]" : "text-white"}>{cell ?? ""}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {result && !matchWinner && <button type="button" onClick={nextRound} className={optionClass(true)}><Sparkles className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />próxima rodada</button>}
            <button type="button" onClick={restartMatch} className={optionClass(false)} aria-label="Reiniciar partida"><RotateCcw className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />reiniciar partida</button>
          </div>
        </div>
      </div>
    </section>
  );
}
