import { Bot, RotateCcw, Swords, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  applyChessMove,
  chooseChessBotMove,
  createInitialChessState,
  getChessLegalMoves,
  getChessStatus,
  isChessKingInCheck,
  type ChessColor,
  type ChessDifficulty,
  type ChessMove,
  type ChessPiece,
  type ChessState,
} from "@/features/portfolio/utils/chess";

type GameMode = "bot" | "local";

const glyph: Record<ChessColor, Record<ChessPiece["type"], string>> = {
  white: { king: "♔", queen: "♕", rook: "♖", bishop: "♗", knight: "♘", pawn: "♙" },
  black: { king: "♚", queen: "♛", rook: "♜", bishop: "♝", knight: "♞", pawn: "♟" },
};

const difficultyLabel: Record<ChessDifficulty, string> = {
  easy: "fácil",
  normal: "normal",
  hard: "difícil",
  master: "mestre",
  expert: "especialista",
};

const pieceLabel: Record<ChessPiece["type"], string> = {
  king: "rei",
  queen: "dama",
  rook: "torre",
  bishop: "bispo",
  knight: "cavalo",
  pawn: "peão",
};

export default function PortfolioChess() {
  const [mode, setMode] = useState<GameMode>("bot");
  const [difficulty, setDifficulty] = useState<ChessDifficulty>("normal");
  const [state, setState] = useState<ChessState>(createInitialChessState);
  const [selected, setSelected] = useState<number | null>(null);

  const status = useMemo(() => getChessStatus(state), [state]);
  const legalMoves = useMemo(() => getChessLegalMoves(state, state.turn), [state]);
  const selectedMoves = useMemo(
    () => selected === null ? [] : legalMoves.filter(move => move.from === selected),
    [legalMoves, selected],
  );

  const reset = () => {
    setState(createInitialChessState());
    setSelected(null);
  };

  const commit = (move: ChessMove) => {
    const next = applyChessMove(state, move);
    if (!next) return;
    setState(next);
    setSelected(null);
  };

  const handleCell = (index: number) => {
    if (status.kind === "checkmate" || status.kind === "stalemate") return;
    if (mode === "bot" && state.turn === "black") return;
    const piece = state.board[index];

    if (piece?.color === state.turn) {
      setSelected(index);
      return;
    }

    if (selected === null) return;
    const move = selectedMoves.find(candidate => candidate.to === index);
    if (move) commit(move);
  };

  useEffect(() => {
    if (mode !== "bot" || state.turn !== "black") return;
    if (status.kind === "checkmate" || status.kind === "stalemate") return;

    const timer = window.setTimeout(() => {
      const move = chooseChessBotMove(state, "black", difficulty);
      if (!move) return;
      const next = applyChessMove(state, move);
      if (next) setState(next);
      setSelected(null);
    }, difficulty === "expert" ? 520 : difficulty === "master" ? 430 : 320);

    return () => window.clearTimeout(timer);
  }, [difficulty, mode, state, status.kind]);

  const statusText =
    status.kind === "checkmate"
      ? status.winner === "white"
        ? mode === "bot" ? "Xeque-mate: você venceu." : "Xeque-mate: jogador 1 venceu."
        : mode === "bot" ? "Xeque-mate: PG Bot venceu." : "Xeque-mate: jogador 2 venceu."
      : status.kind === "stalemate"
        ? "Afogamento: partida empatada."
        : status.kind === "check"
          ? state.turn === "white" ? "Xeque nas peças brancas." : "Xeque nas peças pretas."
          : state.turn === "white"
            ? mode === "bot" ? "Sua vez · peças brancas." : "Vez do jogador 1 · brancas."
            : mode === "bot" ? "PG Bot está calculando." : "Vez do jogador 2 · pretas.";

  const optionClass = (active: boolean) =>
    `inline-flex min-h-11 min-w-0 items-center justify-center rounded-[10px] border px-2.5 font-mono text-[8px] font-semibold uppercase leading-4 tracking-[0.06em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${active ? "border-[#67e8f9] bg-[#0b2746] text-white" : "border-white/10 text-[#91adbf] hover:border-[#67e8f9]/60 hover:text-white"}`;

  return (
    <section data-chess-game="true" aria-labelledby="chess-title" className="border-y border-white/[0.07] bg-[#06111e]">
      <div className="mx-auto grid max-w-[1180px] gap-7 px-4 py-7 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:px-12 lg:py-12">
        <div className="min-w-0">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">PG Arcade · xadrez</p>
          <h2 id="chess-title" className="mt-3 font-display text-[clamp(2.2rem,9vw,4rem)] font-medium leading-[0.92] tracking-[-0.05em] text-white">Xadrez.<br />Posição e cálculo.</h2>
          <p className="mt-4 max-w-xl font-body text-sm leading-6 text-[#a8c4d7]">
            Regras completas de movimento com xeque, xeque-mate, afogamento, roque, en passant e promoção. Jogue localmente ou enfrente o PG Bot em cinco níveis.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#7191a8]">modo</p>
              <div className="grid grid-cols-2 gap-2">
                <button data-chess-mode="bot" type="button" aria-pressed={mode === "bot"} onClick={() => { setMode("bot"); reset(); }} className={optionClass(mode === "bot")}><Bot className="mr-2 h-4 w-4" />contra bot</button>
                <button data-chess-mode="local" type="button" aria-pressed={mode === "local"} onClick={() => { setMode("local"); reset(); }} className={optionClass(mode === "local")}><UsersRound className="mr-2 h-4 w-4" />1 × 1 local</button>
              </div>
            </div>

            {mode === "bot" && (
              <div>
                <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#7191a8]">dificuldade</p>
                <div className="grid grid-cols-2 gap-2 min-[430px]:grid-cols-5" data-chess-difficulty="true">
                  {(["easy", "normal", "hard", "master", "expert"] as ChessDifficulty[]).map(value => (
                    <button key={value} type="button" aria-pressed={difficulty === value} onClick={() => { setDifficulty(value); reset(); }} className={optionClass(difficulty === value)}>
                      {difficultyLabel[value]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-[14px] border border-white/10 bg-[#071827] p-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#7191a8]">leitura da posição</p>
              <p className="mt-2 font-body text-sm leading-6 text-[#c5d9e5]">
                {isChessKingInCheck(state.board, state.turn) ? "O rei está sob ataque: responda ao xeque." : "Selecione uma peça; casas legais ficam marcadas."}
              </p>
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-[18px] border border-white/10 bg-[#071827]/85 p-3 sm:p-5">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
            <p data-chess-status="true" role="status" aria-live="polite" className="min-w-0 font-mono text-[9px] uppercase leading-5 tracking-[0.08em] text-[#d9fbff]">{statusText}</p>
            <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-white/15 px-3 font-mono text-[9px] uppercase text-white">
              <RotateCcw className="h-4 w-4" />reiniciar
            </button>
          </div>

          <div data-chess-board="true" role="grid" aria-label="Tabuleiro de xadrez" className="mx-auto mt-4 grid aspect-square w-full max-w-[600px] grid-cols-8 overflow-hidden rounded-[12px] border border-white/10 bg-[#09121c]">
            {state.board.map((piece, index) => {
              const { row, col } = { row: Math.floor(index / 8), col: index % 8 };
              const dark = (row + col) % 2 === 1;
              const active = selected === index;
              const legal = selectedMoves.some(move => move.to === index);
              const capture = legal && Boolean(piece);
              return (
                <button
                  key={index}
                  type="button"
                  role="gridcell"
                  data-chess-cell="true"
                  data-chess-legal={legal ? "true" : "false"}
                  aria-label={piece ? `${pieceLabel[piece.type]} ${piece.color === "white" ? "branco" : "preto"}, linha ${8 - row}, coluna ${String.fromCharCode(65 + col)}` : `Casa vazia, linha ${8 - row}, coluna ${String.fromCharCode(65 + col)}`}
                  onClick={() => handleCell(index)}
                  className={`relative grid aspect-square min-w-0 place-items-center text-[clamp(1.55rem,8vw,3rem)] leading-none focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a5f3fc] ${dark ? "bg-[#123247]" : "bg-[#d4e1e7]"} ${active ? "ring-2 ring-inset ring-[#67e8f9]" : ""}`}
                >
                  {legal && <span aria-hidden="true" className={`absolute z-[1] rounded-full ${capture ? "inset-1 border-2 border-[#67e8f9]/75" : "h-2.5 w-2.5 bg-[#67e8f9]/75"}`} />}
                  {piece && <span className={`relative z-[2] drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)] ${piece.color === "white" ? "text-white" : "text-[#07111d]"}`}>{glyph[piece.color][piece.type]}</span>}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-2 border-t border-white/10 pt-4 text-xs leading-5 text-[#8fa8c7]">
            <Swords className="mt-0.5 h-4 w-4 shrink-0 text-[#67e8f9]" aria-hidden="true" />
            <p>Promoção vira dama automaticamente. Roque e en passant são tratados pelo motor de regras; movimentos que deixam o próprio rei em xeque são bloqueados.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
