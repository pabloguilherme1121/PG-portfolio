import { lazy, Suspense } from "react";

type PortfolioArcadeModule = typeof import("@/features/portfolio/components/PortfolioArcade");
let portfolioArcadePromise: Promise<PortfolioArcadeModule> | null = null;

export function preloadPortfolioArcade() {
  if (!portfolioArcadePromise) {
    portfolioArcadePromise = import("@/features/portfolio/components/PortfolioArcade").catch((error) => {
      portfolioArcadePromise = null;
      throw error;
    });
  }

  return portfolioArcadePromise;
}

const PortfolioArcade = lazy(preloadPortfolioArcade);

type PortfolioArcadeShowcaseProps = {
  open: boolean;
  onToggle: () => void;
  onPreload: () => void;
};

export default function PortfolioArcadeShowcase({
  open,
  onToggle,
  onPreload,
}: PortfolioArcadeShowcaseProps) {
  return (
    <section
      id="pg-lab"
      data-arcade-showcase="true"
      className="archive-chapter relative scroll-mt-24 overflow-hidden border-y border-[#67e8f9]/15 bg-[#040a13] px-4 py-10 min-[360px]:px-5 sm:px-8 sm:py-14 lg:px-12"
      aria-labelledby="pg-lab-title"
    >
      <div className="relative mx-auto max-w-[1440px] overflow-hidden border border-[#67e8f9]/25 bg-[linear-gradient(135deg,rgba(6,23,47,.96),rgba(5,13,24,.92))] p-5 shadow-[0_24px_80px_rgba(0,0,0,.24)] sm:grid sm:grid-cols-[1fr_auto] sm:items-end sm:gap-10 sm:p-8">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">PG Arcade · laboratório interativo</p>
          <h2 id="pg-lab-title" className="mt-3 max-w-3xl font-display text-[clamp(2rem,4vw,4.25rem)] font-medium leading-[0.94] tracking-[-0.055em] text-white">
            Código que você pode jogar.
          </h2>
          <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#a9bfd8]">
            Cinco experiências jogáveis — Jogo da Velha, Dominó, Futebol, Damas e Xadrez — demonstram lógica, estados, IA, responsividade e cuidado com interação sem competir com os cases profissionais.
          </p>
        </div>
        <button
          type="button"
          data-arcade-open-control="true"
          data-arcade-preload="intent"
          onPointerEnter={(event) => {
            if (event.pointerType === "mouse") onPreload();
          }}
          onFocus={onPreload}
          onClick={onToggle}
          aria-expanded={open}
          aria-controls="pg-lab-game"
          className="mt-6 inline-flex min-h-12 w-full shrink-0 items-center justify-center border border-[#67e8f9]/45 px-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff] transition-colors hover:border-[#a5f3fc] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:mt-0 sm:w-auto"
        >
          {open ? "fechar PG Arcade" : "explorar PG Arcade"}
        </button>
      </div>

      <div id="pg-lab-game" hidden={!open} className="-mx-4 max-w-[1440px] min-[360px]:-mx-5 sm:mx-auto">
        {open && (
          <Suspense
            fallback={
              <div
                data-arcade-loading="true"
                role="status"
                aria-live="polite"
                className="mx-4 my-5 min-h-24 rounded-[14px] border border-[#67e8f9]/20 bg-[#06172f]/70 p-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc] min-[360px]:mx-5 sm:mx-0"
              >
                carregando PG Arcade…
              </div>
            }
          >
            <PortfolioArcade />
          </Suspense>
        )}
      </div>
    </section>
  );
}
