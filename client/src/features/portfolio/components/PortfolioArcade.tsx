import { useRef, useState, type KeyboardEvent } from "react";
import PortfolioTicTacToe from "@/features/portfolio/components/PortfolioTicTacToe";
import PortfolioDomino from "@/features/portfolio/components/PortfolioDomino";
import PortfolioCheckers from "@/features/portfolio/components/PortfolioCheckers";

// HomeExperience already loads this entire Arcade on demand. Keep its games in
// that loading boundary so a mobile tab switch never suspends on another import.
type ArcadeGame = "velha" | "domino" | "damas";

const games = [
  { id: "velha", label: "Jogo da velha", meta: "estratégia rápida" },
  { id: "domino", label: "Dominó", meta: "compra + bloqueio" },
  { id: "damas", label: "Damas", meta: "captura + séries" },
] as const;

export default function PortfolioArcade() {
  const [game, setGame] = useState<ArcadeGame>("velha");
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    const tabs = Array.from(
      tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
    );
    if (!tabs.length) return;

    const activeIndex = Math.max(0, tabs.findIndex((tab) => tab === document.activeElement));
    let nextIndex = activeIndex;

    if (event.key === "ArrowRight") nextIndex = (activeIndex + 1) % tabs.length;
    if (event.key === "ArrowLeft") nextIndex = (activeIndex - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = tabs.length - 1;

    event.preventDefault();
    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  };

  return (
    <div data-arcade-hub="true">
      <div className="mx-auto max-w-[1180px] px-4 pt-7 sm:px-8 lg:px-12">
        <div className="rounded-[16px] border border-[#67e8f9]/20 bg-[#06172f]/75 p-3 sm:p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">selecionar experiência</p>
              <p className="mt-1 font-body text-sm text-[#a9bfd8]">Três jogos com séries, regras alternativas, bot em até quatro dificuldades e 1 × 1 local.</p>
            </div>
            <span className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[7px] uppercase tracking-[0.09em] text-[#8fa8c7]">sem cadastro · mobile first</span>
          </div>
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Jogos do PG Arcade"
            aria-orientation="horizontal"
            onKeyDown={handleTabKeyDown}
            className="mt-4 grid grid-cols-3 gap-2"
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
        {game === "velha" ? <PortfolioTicTacToe /> : game === "domino" ? <PortfolioDomino /> : <PortfolioCheckers />}
      </div>
    </div>
  );
}
