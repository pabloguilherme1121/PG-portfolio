import { lazy, Suspense, useState } from "react";
type PortfolioArcadeModule =
  typeof import("@/features/portfolio/components/PortfolioArcade");
let portfolioArcadePromise: Promise<PortfolioArcadeModule> | null = null;

const loadPortfolioArcade = () => {
  if (!portfolioArcadePromise) {
    portfolioArcadePromise = import(
      "@/features/portfolio/components/PortfolioArcade"
    ).catch(error => {
      portfolioArcadePromise = null;
      throw error;
    });
  }
  return portfolioArcadePromise;
};
const PortfolioArcade = lazy(loadPortfolioArcade);

export function useArcadeSection(avoidSpeculativePreload: boolean) {
  const [pgLabOpen, setPgLabOpen] = useState(false);
  function preloadPgArcade() {
    if (avoidSpeculativePreload) return;
    void loadPortfolioArcade().catch(() => undefined);
  }

  function openPgArcade() {
    preloadPgArcade();
    setPgLabOpen(true);
    window.requestAnimationFrame(() => {
      const target = document.getElementById("pg-lab");
      if (!target) return;
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
      target.scrollIntoView({
        behavior: reduceMotion || isMobileViewport ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  function togglePgArcade() {
    if (pgLabOpen) {
      setPgLabOpen(false);
      return;
    }
    openPgArcade();
  }

  return { pgLabOpen, preloadPgArcade, openPgArcade, togglePgArcade };
}
export type ArcadeController = ReturnType<typeof useArcadeSection>;
export function ArcadeSection({
  controller,
}: {
  controller: ArcadeController;
}) {
  const { pgLabOpen, preloadPgArcade, togglePgArcade } = controller;
  return (
    <section
      id="pg-lab"
      className="archive-chapter scroll-mt-24 border-t border-white/[0.07] bg-[#040a13] px-4 py-9 min-[360px]:px-5 sm:px-8 sm:py-10 lg:px-12"
      aria-labelledby="pg-lab-title"
    >
      <div className="mx-auto max-w-[1440px] border border-[#67e8f9]/20 bg-[#06172f]/55 p-4 min-[360px]:p-5 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-7">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">
            PG Arcade · opcional
          </p>
          <h2
            id="pg-lab-title"
            className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white"
          >
            Quatro experiências de lógica e interação
          </h2>
          <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#a9bfd8]">
            Jogo da velha, dominó, damas e futebol: lógica local, bots
            determinísticos e partidas 1 × 1. Uma demonstração de engenharia com
            controles por toque e teclado, acessibilidade e testes em Chromium e
            WebKit. Carrega ao abrir.
          </p>
        </div>
        <button
          type="button"
          data-arcade-open-control="true"
          data-arcade-preload="intent"
          onPointerEnter={preloadPgArcade}
          onFocus={preloadPgArcade}
          onTouchStart={preloadPgArcade}
          onClick={togglePgArcade}
          aria-expanded={pgLabOpen}
          aria-controls="pg-lab-game"
          className="mt-5 inline-flex min-h-12 w-full shrink-0 items-center justify-center border border-[#67e8f9]/45 px-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff] transition-colors hover:border-[#a5f3fc] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:mt-0 sm:w-auto"
        >
          {pgLabOpen ? "fechar PG Arcade" : "jogar no PG Arcade"}
        </button>
      </div>
      <div
        id="pg-lab-game"
        hidden={!pgLabOpen}
        className="-mx-4 max-w-[1440px] min-[360px]:-mx-5 sm:mx-auto"
      >
        {pgLabOpen && (
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
