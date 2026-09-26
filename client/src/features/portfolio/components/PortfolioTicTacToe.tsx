import { RotateCcw, Sparkles } from "lucide-react";
import { useState } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import {
  chooseTicTacToeBotMove,
  getTicTacToeWinner,
  type TicTacToeBoard,
} from "@/features/portfolio/utils/ticTacToe";

const emptyBoard = (): TicTacToeBoard => Array.from({ length: 9 }, () => null);

type GameResult = "player" | "bot" | "draw" | null;

export default function PortfolioTicTacToe() {
  const [board, setBoard] = useState<TicTacToeBoard>(emptyBoard);
  const [result, setResult] = useState<GameResult>(null);
  const [score, setScore] = useState({ player: 0, bot: 0, draws: 0 });
  const [started, setStarted] = useState(false);

  const status = result === "player"
    ? "Você venceu esta rodada."
    : result === "bot"
      ? "PG Bot fechou a rodada. Tente outra estratégia."
      : result === "draw"
        ? "Empate. Boa leitura de jogo."
        : "Sua vez: escolha uma casa.";

  function completeRound(nextResult: Exclude<GameResult, null>) {
    setResult(nextResult);
    setScore((current) => ({
      player: current.player + (nextResult === "player" ? 1 : 0),
      bot: current.bot + (nextResult === "bot" ? 1 : 0),
      draws: current.draws + (nextResult === "draw" ? 1 : 0),
    }));
    trackPortfolioEvent("tic_tac_toe_completed", { gameResult: nextResult });
  }

  function play(index: number) {
    if (board[index] || result) return;

    if (!started) {
      setStarted(true);
      trackPortfolioEvent("tic_tac_toe_started");
    }

    const next = [...board];
    next[index] = "X";

    if (getTicTacToeWinner(next) === "X") {
      setBoard(next);
      completeRound("player");
      return;
    }

    if (next.every(Boolean)) {
      setBoard(next);
      completeRound("draw");
      return;
    }

    const botMove = chooseTicTacToeBotMove(next);
    if (botMove >= 0) next[botMove] = "O";

    setBoard(next);

    if (getTicTacToeWinner(next) === "O") {
      completeRound("bot");
      return;
    }

    if (next.every(Boolean)) completeRound("draw");
  }

  function restart() {
    setBoard(emptyBoard());
    setResult(null);
    setStarted(false);
    trackPortfolioEvent("tic_tac_toe_restarted");
  }

  return (
    <section
      data-tic-tac-toe="true"
      aria-labelledby="tic-tac-toe-title"
      className="archive-chapter border-y border-white/[0.07] bg-[#06111e]"
    >
      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 py-14 sm:px-8 sm:py-18 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:px-12 lg:py-20">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">
            pausa interativa · ~30 segundos
          </p>
          <h2
            id="tic-tac-toe-title"
            className="mt-4 font-display text-[clamp(2.4rem,5vw,4.6rem)] font-medium leading-[0.92] tracking-[-0.055em] text-white"
          >
            Jogo da velha.
            <br />
            Você contra o PG Bot.
          </h2>
          <p className="mt-5 max-w-xl font-body text-sm leading-7 text-[#a8c4d7]">
            Uma pausa rápida entre os cases e o contato. Você joga com X; o bot responde com O.
            O jogo é opcional e não interfere no restante do portfólio.
          </p>

          <div className="mt-6 grid max-w-md grid-cols-3 gap-px bg-white/10">
            <div className="bg-[#071827] p-3 text-center">
              <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#7191a8]">você</p>
              <p className="mt-1 font-display text-2xl text-[#67e8f9]">{score.player}</p>
            </div>
            <div className="bg-[#071827] p-3 text-center">
              <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#7191a8]">PG Bot</p>
              <p className="mt-1 font-display text-2xl text-white">{score.bot}</p>
            </div>
            <div className="bg-[#071827] p-3 text-center">
              <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#7191a8]">empates</p>
              <p className="mt-1 font-display text-2xl text-[#b8cce0]">{score.draws}</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p
              data-game-status="true"
              role="status"
              aria-live="polite"
              className="font-body text-sm text-[#d5edf7]"
            >
              {status}
            </p>
            <button
              type="button"
              onClick={restart}
              className="inline-flex min-h-11 items-center gap-2 border border-[#67e8f9]/30 px-3 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#bdf7ff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
              aria-label="Reiniciar rodada"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              reiniciar rodada
            </button>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[520px] border border-[#67e8f9]/20 bg-[#071827]/80 p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#67e8f9]">tabuleiro</p>
              <p className="mt-1 font-body text-xs text-[#819fb3]">X = você · O = PG Bot</p>
            </div>
            <Sparkles className="h-5 w-5 text-[#67e8f9]" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-3 gap-2" role="grid" aria-label="Tabuleiro do jogo da velha">
            {board.map((cell, index) => {
              const row = Math.floor(index / 3) + 1;
              const column = (index % 3) + 1;
              return (
                <button
                  key={index}
                  type="button"
                  role="gridcell"
                  data-game-cell="true"
                  disabled={Boolean(cell) || Boolean(result)}
                  onClick={() => play(index)}
                  aria-label={`Linha ${row}, coluna ${column}: ${cell ?? "vazio"}`}
                  className="aspect-square min-h-16 border border-white/10 bg-[#08111d] font-display text-[clamp(2rem,8vw,4.5rem)] font-medium text-white transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-[#67e8f9]/60 hover:bg-[#0a2034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-default disabled:hover:translate-y-0 motion-reduce:transition-none"
                >
                  <span className={cell === "X" ? "text-[#67e8f9]" : "text-white"}>{cell ?? ""}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
