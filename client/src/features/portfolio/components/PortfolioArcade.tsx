import { lazy, Suspense, useState } from "react";

type ArcadeGame = "velha" | "domino" | "damas";

const PortfolioTicTacToe = lazy(() => import("@/features/portfolio/components/PortfolioTicTacToe"));
const PortfolioDomino = lazy(() => import("@/features/portfolio/components/PortfolioDomino"));
const PortfolioCheckers = lazy(() => import("@/features/portfolio/components/PortfolioCheckers"));

const games = [
  { id: "velha", label: "Jogo da velha", meta: "estratégia rápida" },
  { id: "domino", label: "Dominó", meta: "mesa + leitura" },
  { id: "damas", label: "Damas", meta: "captura + posição" },
] as const;

export default function PortfolioArcade() {
  const [game, setGame] = useState<ArcadeGame>("velha");

  return (
    <div data-arcade-hub="true">
      <div className="mx-auto max-w-[1180px] px-4 pt-7 sm:px-8 lg:px-12">
        <div className="rounded-[16px] border border-[#67e8f9]/20 bg-[#06172f]/75 p-3 sm:p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">selecionar experiência</p>
              <p className="mt-1 font-body text-sm text-[#a9bfd8]">Três jogos, modos rápidos e clássicos, bot com dificuldade e 1 × 1 local.</p>
            </div>
            <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[7px] uppercase tracking-[0.09em] text-[#8fa8c7]">sem cadastro · mobile first</span>
          </div>
          <div role="tablist" aria-label="Jogos do PG Arcade" className="mt-4 grid grid-cols-3 gap-2">
            {games.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`arcade-tab-${item.id}`}
                aria-selected={game === item.id}
                aria-controls={`arcade-panel-${item.id}`}
                data-arcade-game-tab={item.id}
                onClick={() => setGame(item.id)}
                className={`min-h-14 rounded-[11px] border px-2 py-2 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${game === item.id ? "border-[#67e8f9] bg-[#0b2746] text-white" : "border-white/10 bg-[#071326] text-[#9bb4c7] hover:border-[#67e8f9]/50"}`}
              >
                <span className="block font-mono text-[8px] font-semibold uppercase tracking-[0.08em]">{item.label}</span>
                <span className="mt-1 hidden font-body text-[10px] text-[#8fa8c7] min-[390px]:block">{item.meta}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div role="tabpanel" id={`arcade-panel-${game}`} aria-labelledby={`arcade-tab-${game}`} className="mt-5">
        <Suspense fallback={<div role="status" aria-live="polite" className="mx-auto min-h-40 max-w-[1180px] px-4 py-8 font-mono text-[9px] uppercase tracking-[0.1em] text-[#a5f3fc] sm:px-8 lg:px-12">carregando jogo…</div>}>
          {game === "velha" ? <PortfolioTicTacToe /> : game === "domino" ? <PortfolioDomino /> : <PortfolioCheckers />}
        </Suspense>
      </div>
    </div>
  );
}
