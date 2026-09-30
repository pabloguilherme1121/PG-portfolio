import { Bot, RotateCcw, Sparkles, Swords, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  chooseDominoBotMove,
  dealDominoRound,
  getDominoPipTotal,
  getPlayableDominoSides,
  hasPlayableDominoTile,
  placeDominoTile,
  type DominoDifficulty,
  type DominoTile,
} from "@/features/portfolio/utils/domino";

type GameMode = "bot" | "local";
type DominoVariant = "quick" | "classic";
type Turn = "player" | "opponent";
type Winner = Turn | "draw" | null;

const difficultyLabel: Record<DominoDifficulty, string> = {
  easy: "fácil",
  normal: "normal",
  hard: "difícil",
};

function TileFace({ tile }: { tile: DominoTile }) {
  return (
    <span className="inline-grid min-w-14 grid-cols-[1fr_auto_1fr] items-center gap-1 rounded-[9px] border border-white/15 bg-[#0a1b2b] px-2 py-2 font-display text-base text-white shadow-[0_8px_20px_rgba(0,0,0,0.16)]">
      <span>{tile[0]}</span><span className="h-5 w-px bg-white/20" aria-hidden="true" /><span>{tile[1]}</span>
    </span>
  );
}

export default function PortfolioDomino() {
  const [mode, setMode] = useState<GameMode>("bot");
  const [variant, setVariant] = useState<DominoVariant>("quick");
  const [difficulty, setDifficulty] = useState<DominoDifficulty>("normal");
  const [playerHand, setPlayerHand] = useState<DominoTile[]>([]);
  const [opponentHand, setOpponentHand] = useState<DominoTile[]>([]);
  const [boneyard, setBoneyard] = useState<DominoTile[]>([]);
  const [chain, setChain] = useState<DominoTile[]>([]);
  const [turn, setTurn] = useState<Turn>("player");
  const [winner, setWinner] = useState<Winner>(null);
  const [passes, setPasses] = useState(0);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState({ player: 0, opponent: 0, draws: 0 });

  const handSize = variant === "quick" ? 5 : 7;
  const currentHand = turn === "player" ? playerHand : opponentHand;
  const canPlay = hasPlayableDominoTile(currentHand, chain);
  const canDraw = !winner && !canPlay && boneyard.length > 0;

  const restartRound = (resetScore = false) => {
    const dealt = dealDominoRound(handSize);
    setPlayerHand(dealt.player);
    setOpponentHand(dealt.opponent);
    setBoneyard(dealt.boneyard);
    setChain([]);
    setTurn("player");
    setWinner(null);
    setPasses(0);
    if (resetScore) {
      setRound(1);
      setScore({ player: 0, opponent: 0, draws: 0 });
    }
  };

  useEffect(() => {
    restartRound(true);
    // The selected variant is the only input that changes the deal size.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variant]);

  const finishRound = (nextWinner: Winner) => {
    if (!nextWinner) return;
    setWinner(nextWinner);
    setScore((current) => ({
      player: current.player + (nextWinner === "player" ? 1 : 0),
      opponent: current.opponent + (nextWinner === "opponent" ? 1 : 0),
      draws: current.draws + (nextWinner === "draw" ? 1 : 0),
    }));
  };

  const resolveBlockedRound = (nextPlayerHand: DominoTile[], nextOpponentHand: DominoTile[]) => {
    const playerPips = getDominoPipTotal(nextPlayerHand);
    const opponentPips = getDominoPipTotal(nextOpponentHand);
    finishRound(playerPips === opponentPips ? "draw" : playerPips < opponentPips ? "player" : "opponent");
  };

  const playTile = (owner: Turn, index: number) => {
    if (winner || owner !== turn) return;
    const hand = owner === "player" ? playerHand : opponentHand;
    const tile = hand[index];
    if (!tile) return;
    const sides = getPlayableDominoSides(tile, chain);
    if (!sides.length) return;

    const preferredSide = sides.includes("right") ? "right" : sides[0];
    const nextChain = placeDominoTile(chain, tile, preferredSide);
    const nextHand = hand.filter((_, handIndex) => handIndex !== index);
    setChain(nextChain);
    setPasses(0);

    if (owner === "player") setPlayerHand(nextHand);
    else setOpponentHand(nextHand);

    if (!nextHand.length) {
      finishRound(owner);
      return;
    }
    setTurn(owner === "player" ? "opponent" : "player");
  };

  const drawTile = () => {
    if (!canDraw || !boneyard.length) return;
    const [tile, ...rest] = boneyard;
    setBoneyard(rest);
    if (turn === "player") setPlayerHand((hand) => [...hand, tile]);
    else setOpponentHand((hand) => [...hand, tile]);
  };

  const passTurn = () => {
    if (winner || canPlay || boneyard.length) return;
    if (passes >= 1) {
      resolveBlockedRound(playerHand, opponentHand);
      return;
    }
    setPasses((value) => value + 1);
    setTurn((current) => current === "player" ? "opponent" : "player");
  };

  useEffect(() => {
    if (mode !== "bot" || turn !== "opponent" || winner) return;

    const timer = window.setTimeout(() => {
      let nextHand = [...opponentHand];
      let nextYard = [...boneyard];
      let move = chooseDominoBotMove(nextHand, chain, difficulty);

      while (!move && nextYard.length) {
        nextHand.push(nextYard.shift()!);
        move = chooseDominoBotMove(nextHand, chain, difficulty);
      }

      setBoneyard(nextYard);

      if (!move) {
        setOpponentHand(nextHand);
        if (passes >= 1) resolveBlockedRound(playerHand, nextHand);
        else {
          setPasses((value) => value + 1);
          setTurn("player");
        }
        return;
      }

      const tile = nextHand[move.index];
      const nextChain = placeDominoTile(chain, tile, move.side);
      nextHand.splice(move.index, 1);
      setOpponentHand(nextHand);
      setChain(nextChain);
      setPasses(0);
      if (!nextHand.length) finishRound("opponent");
      else setTurn("player");
    }, 360);

    return () => window.clearTimeout(timer);
  }, [boneyard, chain, difficulty, mode, opponentHand, passes, playerHand, turn, winner]);

  const status = useMemo(() => {
    if (winner === "draw") return "Rodada bloqueada: empate por pontos.";
    if (winner === "player") return mode === "bot" ? "Você venceu a rodada." : "Jogador 1 venceu a rodada.";
    if (winner === "opponent") return mode === "bot" ? "PG Bot venceu a rodada." : "Jogador 2 venceu a rodada.";
    if (mode === "bot" && turn === "opponent") return "PG Bot está calculando a jogada.";
    return turn === "player" ? (mode === "bot" ? "Sua vez." : "Vez do jogador 1.") : "Vez do jogador 2.";
  }, [mode, turn, winner]);

  const optionClass = (active: boolean) =>
    `inline-flex min-h-11 items-center justify-center rounded-[10px] border px-3 font-mono text-[8px] font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${active ? "border-[#67e8f9] bg-[#0b2746] text-white" : "border-white/10 text-[#91adbf] hover:border-[#67e8f9]/60 hover:text-white"}`;

  return (
    <section data-domino-game="true" aria-labelledby="domino-title" className="border-y border-white/[0.07] bg-[#06111e]">
      <div className="mx-auto grid max-w-[1180px] gap-7 px-4 py-9 sm:px-8 lg:grid-cols-[0.76fr_1.24fr] lg:px-12 lg:py-14">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">PG Arcade · dominó</p>
          <h2 id="domino-title" className="mt-3 font-display text-[clamp(2.3rem,10vw,4.2rem)] font-medium leading-[0.92] tracking-[-0.055em] text-white">Dominó.<br />Leitura de mesa.</h2>
          <p className="mt-4 max-w-xl font-body text-sm leading-6 text-[#a8c4d7]">Jogue rápido ou clássico, contra o PG Bot em três dificuldades ou em 1 × 1 local no mesmo aparelho.</p>

          <div className="mt-6 space-y-4">
            <div>
              <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#7191a8]">modo</p>
              <div className="grid grid-cols-2 gap-2">
                <button data-domino-mode="bot" type="button" aria-pressed={mode === "bot"} onClick={() => { setMode("bot"); restartRound(true); }} className={optionClass(mode === "bot")}><Bot className="mr-2 h-4 w-4" />contra bot</button>
                <button data-domino-mode="local" type="button" aria-pressed={mode === "local"} onClick={() => { setMode("local"); restartRound(true); }} className={optionClass(mode === "local")}><UsersRound className="mr-2 h-4 w-4" />1 × 1 local</button>
              </div>
            </div>

            <div>
              <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#7191a8]">partida</p>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" aria-pressed={variant === "quick"} onClick={() => setVariant("quick")} className={optionClass(variant === "quick")}><Sparkles className="mr-2 h-4 w-4" />rápida · 5 pedras</button>
                <button type="button" aria-pressed={variant === "classic"} onClick={() => setVariant("classic")} className={optionClass(variant === "classic")}><Swords className="mr-2 h-4 w-4" />clássica · 7 pedras</button>
              </div>
            </div>

            {mode === "bot" && (
              <div>
                <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#7191a8]">dificuldade</p>
                <div className="grid grid-cols-3 gap-2">
                  {(["easy", "normal", "hard"] as const).map((value) => (
                    <button key={value} type="button" aria-pressed={difficulty === value} onClick={() => { setDifficulty(value); restartRound(true); }} className={optionClass(difficulty === value)}>{difficultyLabel[value]}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div data-domino-score="true" className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-[12px] bg-white/10">
            <div className="bg-[#071827] p-3 text-center"><p className="font-mono text-[7px] uppercase text-[#7191a8]">{mode === "bot" ? "você" : "jogador 1"}</p><p className="mt-1 font-display text-2xl text-[#67e8f9]">{score.player}</p></div>
            <div className="bg-[#071827] p-3 text-center"><p className="font-mono text-[7px] uppercase text-[#7191a8]">{mode === "bot" ? "bot" : "jogador 2"}</p><p className="mt-1 font-display text-2xl text-white">{score.opponent}</p></div>
            <div className="bg-[#071827] p-3 text-center"><p className="font-mono text-[7px] uppercase text-[#7191a8]">empates</p><p className="mt-1 font-display text-2xl text-[#b8cce0]">{score.draws}</p></div>
          </div>
        </div>

        <div className="min-w-0 rounded-[18px] border border-white/10 bg-[#071827]/85 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p data-domino-status="true" role="status" aria-live="polite" className="font-mono text-[9px] uppercase tracking-[0.09em] text-[#d9fbff]">{status}</p>
            <p className="font-mono text-[8px] uppercase tracking-[0.08em] text-[#7191a8]">rodada {round} · monte {boneyard.length}</p>
          </div>

          <div data-domino-chain="true" aria-label="Mesa de dominó" className="mt-4 flex min-h-24 items-center gap-2 overflow-x-auto rounded-[12px] border border-white/10 bg-[#04101b] p-3">
            {chain.length ? chain.map((tile, index) => <TileFace key={`${tile.join("-")}-${index}`} tile={tile} />) : <p className="mx-auto font-mono text-[8px] uppercase tracking-[0.1em] text-[#628097]">a primeira pedra abre as duas pontas</p>}
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#7191a8]">{turn === "player" ? (mode === "bot" ? "sua mão" : "mão do jogador 1") : (mode === "bot" ? "mão do PG Bot" : "mão do jogador 2")}</p>
              <span className="font-mono text-[8px] text-[#7191a8]">{currentHand.length} pedras</span>
            </div>
            <div data-domino-hand="true" className="flex flex-wrap gap-2">
              {currentHand.map((tile, index) => {
                const playable = !winner && getPlayableDominoSides(tile, chain).length > 0;
                const hidden = mode === "bot" && turn === "opponent";
                return (
                  <button
                    key={`${tile.join("-")}-${index}`}
                    type="button"
                    data-domino-tile="true"
                    disabled={!playable || hidden}
                    aria-label={hidden ? "Pedra oculta do PG Bot" : `Pedra ${tile[0]} por ${tile[1]}`}
                    onClick={() => playTile(turn, index)}
                    className="rounded-[10px] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
                  >
                    {hidden ? <span className="grid h-12 min-w-14 place-items-center rounded-[9px] border border-white/10 bg-[#0b2236] font-mono text-xs text-[#628097]">PG</span> : <TileFace tile={tile} />}
                  </button>
                );
              })}
            </div>
          </div>

          {!winner && !canPlay && (
            <div className="mt-5 flex flex-wrap gap-2">
              {canDraw ? <button type="button" onClick={drawTile} className="min-h-11 rounded-[10px] bg-[#38bdf8] px-4 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[#02111f]">comprar pedra</button> : mode === "local" || turn === "player" ? <button type="button" onClick={passTurn} className="min-h-11 rounded-[10px] border border-white/15 px-4 font-mono text-[9px] uppercase tracking-[0.08em] text-white">passar vez</button> : null}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-4">
            <button type="button" onClick={() => restartRound(false)} className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-white/15 px-4 font-mono text-[9px] uppercase tracking-[0.08em] text-white"><RotateCcw className="h-4 w-4" />reiniciar rodada</button>
            {winner && <button type="button" onClick={() => { setRound((value) => value + 1); restartRound(false); }} className="min-h-11 rounded-[10px] bg-[#38bdf8] px-4 font-mono text-[9px] font-semibold uppercase tracking-[0.08em] text-[#02111f]">próxima rodada</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
