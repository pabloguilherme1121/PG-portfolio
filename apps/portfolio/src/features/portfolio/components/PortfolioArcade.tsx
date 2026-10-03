import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CircleDot, Crown, Gamepad2, Goal, Grid3X3, Sparkles, Castle } from "lucide-react";
import PortfolioTicTacToe from "@/features/portfolio/components/PortfolioTicTacToe";
import PortfolioDomino from "@/features/portfolio/components/PortfolioDomino";
import PortfolioCheckers from "@/features/portfolio/components/PortfolioCheckers";
import PortfolioChess from "@/features/portfolio/components/PortfolioChess";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import {
  arcadeSessionStorageKey,
  getMostVisitedArcadeGame,
  getSuggestedArcadeGame,
  markArcadeGameExplored,
  normalizeArcadeSession,
  recordArcadeGameVisit,
  resetArcadeSessionProgress,
  type ArcadeGame,
  type ArcadeSession,
} from "@/features/portfolio/utils/arcadeSession";

// HomeExperience already loads this entire Arcade on demand. Keep its games in
// that loading boundary so a mobile tab switch never suspends on another import.
import PortfolioFootball from "./PortfolioFootball";
import "./PortfolioArcade.css";

const games = [
  { id: "velha", label: "Jogo da velha", meta: "estratégia rápida", icon: Grid3X3 },
  { id: "domino", label: "Dominó", meta: "compra + bloqueio", icon: CircleDot },
  { id: "futebol", label: "Futebol", meta: "pênaltis + faltas", icon: Goal },
  { id: "damas", label: "Damas", meta: "captura + séries", icon: Crown },
  { id: "xadrez", label: "Xadrez", meta: "xeque + quatro níveis", icon: Castle },
] as const;

const gameHelp: Record<ArcadeGame, string> = {
  velha: "Toque em uma casa vazia. Complete três marcas em linha, coluna ou diagonal. Use a dica ou escolha 1 × 1 para jogar no mesmo aparelho.",
  domino: "Escolha uma peça que combine com uma das pontas da mesa. Compre quando não houver jogada. Os números identificam as peças, além das cores.",
  futebol: "Ajuste a mira tocando no campo ou usando os controles. Regule força e curva e chute. São cinco cobranças por série; experimente também as faltas.",
  damas: "Selecione uma peça e uma casa disponível. Capturas são obrigatórias; continue a sequência com a mesma peça. Chegue à última linha para promover sua peça.",
  xadrez: "Selecione uma peça para ver as jogadas e toque no destino. Proteja seu rei e busque o xeque-mate. Comece em um nível fácil e aumente a dificuldade aos poucos.",
};

function readArcadeSession(): ArcadeSession {
  if (typeof window === "undefined") return normalizeArcadeSession(null);
  try {
    const stored = window.localStorage.getItem(arcadeSessionStorageKey);
    return normalizeArcadeSession(stored ? JSON.parse(stored) : null);
  } catch {
    return normalizeArcadeSession(null);
  }
}

function renderArcadeGame(game: ArcadeGame) {
  if (game === "velha") return <PortfolioTicTacToe />;
  if (game === "domino") return <PortfolioDomino />;
  if (game === "futebol") return <PortfolioFootball />;
  if (game === "damas") return <PortfolioCheckers />;
  return <PortfolioChess />;
}

export default function PortfolioArcade() {
  const [focusMode, setFocusMode] = useState(false);
  const [session, setSession] = useState<ArcadeSession>(readArcadeSession);
  const [game, setGame] = useState<ArcadeGame>(session.lastGame);
  const [mountedGames, setMountedGames] = useState<ArcadeGame[]>(() => [
    session.lastGame,
  ]);
  const tabsRef = useRef<HTMLDivElement>(null);
  const mostVisitedGame = getMostVisitedArcadeGame(session);
  const suggestedGame = getSuggestedArcadeGame(session, game);
  const totalSelections = Object.values(session.visits).reduce(
    (total, count) => total + count,
    0,
  );
  const selectedGameLabel =
    games.find((item) => item.id === game)?.label ?? "Jogo da velha";
  const suggestedGameLabel =
    games.find((item) => item.id === suggestedGame)?.label ?? "Dominó";
  const explorationPercent = Math.round(
    (session.explored.length / games.length) * 100,
  );

  useEffect(() => {
    setSession((current) => markArcadeGameExplored(current, game));
  }, [game]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        arcadeSessionStorageKey,
        JSON.stringify(session),
      );
    } catch {
      // O Arcade continua funcionando mesmo quando o armazenamento local não está disponível.
    }
  }, [session]);

  const selectGame = (nextGame: ArcadeGame) => {
    if (nextGame === game) return;

    setMountedGames((current) =>
      current.includes(nextGame) ? current : [...current, nextGame],
    );
    setGame(nextGame);
    setSession((current) => recordArcadeGameVisit(current, nextGame));
    trackPortfolioEvent("arcade_game_selected", { arcadeGame: nextGame });
  };

  const resetProgress = () => {
    setSession((current) => resetArcadeSessionProgress(current, game));
    trackPortfolioEvent("arcade_progress_reset", { arcadeGame: game });
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    const tabs = Array.from(
      tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
    );
    if (!tabs.length) return;

    const activeIndex = Math.max(
      0,
      tabs.findIndex((tab) => tab === document.activeElement),
    );
    let nextIndex = activeIndex;

    if (event.key === "ArrowRight") nextIndex = (activeIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft")
      nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    event.preventDefault();
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  };

  return (
    <div data-arcade-hub="true" data-arcade-focus={focusMode} className="arcade-hub relative isolate overflow-hidden bg-[#030b16]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.14),transparent_62%)]" />
      <div className="mx-auto max-w-[1180px] px-4 pt-4 sm:px-8 lg:px-12">
        <div className="overflow-hidden rounded-[22px] border border-[#67e8f9]/20 bg-[linear-gradient(145deg,rgba(8,32,59,0.96),rgba(4,18,37,0.92))] p-3 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-5">
          <div className="flex min-w-0 flex-wrap items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="inline-flex max-w-full flex-wrap items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#67e8f9]">
                <Gamepad2 className="h-4 w-4" aria-hidden="true" />
                PG Arcade · escolher jogo
              </p>
              <p data-arcade-overview="true" className="mt-1 font-body text-sm text-[#a9bfd8]">
                Cinco jogos: estratégia, tabuleiros clássicos, dominó e futebol com
                pênaltis e faltas.
              </p>
            </div>
            <div className="flex min-w-0 max-w-full flex-wrap justify-start gap-2 sm:justify-end">
              <button type="button" aria-pressed={focusMode} onClick={() => setFocusMode((current) => !current)} className="min-h-11 rounded-xl border border-[#67e8f9]/40 bg-[#08203b] px-3 text-sm text-[#cffafe] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
                Modo de jogo
              </button>
              <span data-arcade-overview="true" className="max-w-full rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase leading-4 tracking-[0.07em] text-[#8fa8c7] [overflow-wrap:anywhere]">
                sem cadastro · progresso local
              </span>
              <span
                data-arcade-session-summary="true"
                aria-live="polite"
                className="max-w-full rounded-full border border-[#67e8f9]/20 bg-[#08203b] px-2.5 py-1 font-mono text-[10px] uppercase leading-4 tracking-[0.07em] text-[#a5f3fc] [overflow-wrap:anywhere]"
              >
                {totalSelections > 0
                  ? `último: ${selectedGameLabel} · ${totalSelections} seleções`
                  : "o arcade lembra seu último jogo"}
              </span>
            </div>
          </div>
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Jogos do PG Arcade"
            aria-orientation="horizontal"
            onKeyDown={handleTabKeyDown}
            className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5"
          >
            {games.map((item) => {
              const Icon = item.icon;
              const isActive = game === item.id;
              return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`arcade-tab-${item.id}`}
                aria-selected={game === item.id}
                aria-controls={`arcade-panel-${item.id}`}
                tabIndex={game === item.id ? 0 : -1}
                data-arcade-game-tab={item.id}
                data-arcade-game-visits={session.visits[item.id]}
                data-arcade-game-explored={
                  session.explored.includes(item.id) ? "true" : "false"
                }
                data-arcade-most-visited={
                  mostVisitedGame === item.id ? "true" : undefined
                }
                onClick={() => selectGame(item.id)}
                className={`group relative min-h-[82px] min-w-0 max-w-full overflow-hidden rounded-[15px] border px-3 py-3 text-left transition-[border-color,background-color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-safe:hover:-translate-y-0.5 ${isActive ? "border-[#67e8f9]/80 bg-[#0c3150] text-white shadow-[inset_0_1px_rgba(255,255,255,0.08),0_12px_30px_rgba(8,145,178,0.12)]" : "border-white/10 bg-[#071326]/90 text-[#9bb4c7] hover:border-[#67e8f9]/40 hover:bg-[#0a1c32]"}`}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className={`grid h-8 w-8 place-items-center rounded-[10px] border ${isActive ? "border-[#67e8f9]/40 bg-[#67e8f9]/10 text-[#a5f3fc]" : "border-white/10 bg-white/[0.03] text-[#7894ae] group-hover:text-[#a5f3fc]"}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {session.explored.includes(item.id) ? (
                    <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#67e8f9]">
                      {mostVisitedGame === item.id && session.visits[item.id] > 1 ? "mais aberto" : "visitado"}
                    </span>
                  ) : null}
                </span>
                <span className="mt-2 block max-w-full font-mono text-xs font-semibold leading-4 [overflow-wrap:anywhere]">{item.label}</span>
                <span className="mt-0.5 hidden max-w-full font-body text-[11px] leading-4 text-[#9fb7d1] [overflow-wrap:anywhere] min-[390px]:block">
                  {item.meta}

                </span>
              </button>
              );
            })}
          </div>

          <div
            data-arcade-exploration="true"
            className="mt-3 min-w-0 max-w-full flex-col gap-3 rounded-[15px] flex border border-white/8 bg-black/15 p-3.5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.09em] text-[#9fb7d1]">
                <span className="inline-flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-[#67e8f9]" aria-hidden="true" />{session.explored.length} de {games.length} jogos explorados</span>
                <span className="text-[#67e8f9]">
                  próximo: {suggestedGameLabel}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Progresso de exploração do PG Arcade"
                aria-valuemin={0}
                aria-valuemax={games.length}
                aria-valuenow={session.explored.length}
                className="mt-2 h-2 overflow-hidden rounded-full border border-white/5 bg-[#020913]"
              >
                <span
                  aria-hidden="true"
                  className="block h-full rounded-full bg-[linear-gradient(90deg,#22d3ee,#67e8f9,#a5f3fc)] shadow-[0_0_14px_rgba(103,232,249,0.45)] transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${explorationPercent}%` }}
                />
              </div>
            </div>
            <div className="flex min-w-0 max-w-full shrink-0 flex-col gap-2 min-[420px]:flex-row">
              {totalSelections > 0 || session.explored.length > 1 ? (
                <button
                  type="button"
                  data-arcade-reset-progress="true"
                  onClick={resetProgress}
                  className="min-h-11 rounded-[10px] border border-white/12 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#a9bfd8] transition-colors hover:border-white/25 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
                >
                  Zerar progresso
                </button>
              ) : null}
              <button
                type="button"
                data-arcade-suggestion="true"
                onClick={() => selectGame(suggestedGame)}
                className="min-h-11 rounded-[10px] border border-[#67e8f9]/35 bg-[#08203b] px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#cffafe] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
              >
                Experimentar {suggestedGameLabel}
              </button>
            </div>
          </div>
        </div>
      </div>

      <details key={game} className="mx-auto mt-4 max-w-[1180px] px-4 text-[#a9bfd8] sm:px-8 lg:px-12">
        <summary className="min-h-11 cursor-pointer rounded-xl border border-white/15 px-3 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">Como jogar {selectedGameLabel}</summary>
        <p className="px-3 py-3 text-sm leading-6">{gameHelp[game]}</p>
      </details>

      {games.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`arcade-panel-${item.id}`}
          aria-labelledby={`arcade-tab-${item.id}`}
          hidden={game !== item.id}
          className="mt-4"
        >
          {mountedGames.includes(item.id) ? renderArcadeGame(item.id) : null}
        </div>
      ))}
    </div>
  );
}
