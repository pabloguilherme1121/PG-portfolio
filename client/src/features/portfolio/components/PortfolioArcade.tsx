import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import PortfolioTicTacToe from "@/features/portfolio/components/PortfolioTicTacToe";
import PortfolioDomino from "@/features/portfolio/components/PortfolioDomino";
import PortfolioCheckers from "@/features/portfolio/components/PortfolioCheckers";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import {
  arcadeSessionStorageKey,
  getMostVisitedArcadeGame,
  getSuggestedArcadeGame,
  markArcadeGameExplored,
  normalizeArcadeSession,
  recordArcadeGameVisit,
  type ArcadeGame,
  type ArcadeSession,
} from "@/features/portfolio/utils/arcadeSession";

// HomeExperience already loads this entire Arcade on demand. Keep its games in
// that loading boundary so a mobile tab switch never suspends on another import.
import PortfolioFootball from "./PortfolioFootball";

const games = [
  { id: "velha", label: "Jogo da velha", meta: "estratégia rápida" },
  { id: "domino", label: "Dominó", meta: "compra + bloqueio" },
  { id: "futebol", label: "Futebol", meta: "pênaltis + faltas" },
  { id: "damas", label: "Damas", meta: "captura + séries" },
] as const;

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
  return <PortfolioCheckers />;
}

export default function PortfolioArcade() {
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
    <div data-arcade-hub="true">
      <div className="mx-auto max-w-[1180px] px-4 pt-4 sm:px-8 lg:px-12">
        <div className="rounded-[16px] border border-[#67e8f9]/20 bg-[#06172f]/75 p-3 sm:p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">
                selecionar experiência
              </p>
              <p className="mt-1 font-body text-sm text-[#a9bfd8]">
                Quatro jogos: estratégia, dominó por cores e futebol com
                pênaltis e faltas.
              </p>
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.09em] text-[#8fa8c7]">
                sem cadastro · progresso local
              </span>
              <span
                data-arcade-session-summary="true"
                aria-live="polite"
                className="rounded-full border border-[#67e8f9]/20 bg-[#08203b] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.09em] text-[#a5f3fc]"
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
            className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {games.map((item) => (
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
                className={`min-h-14 rounded-[11px] border px-2 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${game === item.id ? "border-[#67e8f9] bg-[#0b2746] text-white" : "border-white/10 bg-[#071326] text-[#9bb4c7] hover:border-[#67e8f9]/50"}`}
              >
                <span className="block font-mono text-xs font-semibold">
                  {item.label}
                </span>
                <span className="mt-1 hidden font-body text-xs text-[#b8cce0] min-[390px]:block">
                  {item.meta}
                  {mostVisitedGame === item.id && session.visits[item.id] > 1
                    ? " · mais jogado"
                    : session.explored.includes(item.id) && game !== item.id
                      ? " · explorado"
                      : ""}
                </span>
              </button>
            ))}
          </div>

          <div
            data-arcade-exploration="true"
            className="mt-3 flex flex-col gap-3 rounded-[12px] border border-white/8 bg-[#041225]/70 p-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.09em] text-[#9fb7d1]">
                <span>{session.explored.length} de {games.length} jogos explorados</span>
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
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8"
              >
                <span
                  aria-hidden="true"
                  className="block h-full rounded-full bg-[#67e8f9] transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${explorationPercent}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              data-arcade-suggestion="true"
              onClick={() => selectGame(suggestedGame)}
              className="min-h-11 shrink-0 rounded-[10px] border border-[#67e8f9]/35 bg-[#08203b] px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#cffafe] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
            >
              Experimentar {suggestedGameLabel}
            </button>
          </div>
        </div>
      </div>

      {games.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`arcade-panel-${item.id}`}
          aria-labelledby={`arcade-tab-${item.id}`}
          hidden={game !== item.id}
          className="mt-3"
        >
          {mountedGames.includes(item.id) ? renderArcadeGame(item.id) : null}
        </div>
      ))}
    </div>
  );
}
