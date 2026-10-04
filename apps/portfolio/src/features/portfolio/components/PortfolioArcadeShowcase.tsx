import { ArrowUpRight, Gamepad2 } from "lucide-react";

import { portfolioArcadeUrl } from "@/features/portfolio/portfolioConfig";

export default function PortfolioArcadeShowcase() {
  return (
    <section
      id="pg-lab"
      data-arcade-showcase="true"
      className="archive-chapter relative scroll-mt-24 overflow-hidden border-y border-[#67e8f9]/15 bg-[#040a13] px-4 py-10 min-[360px]:px-5 sm:px-8 sm:py-14 lg:px-12"
      aria-labelledby="pg-lab-title"
    >
      <div className="relative mx-auto grid max-w-[1440px] gap-6 overflow-hidden border border-[#67e8f9]/25 bg-[linear-gradient(135deg,rgba(6,23,47,.96),rgba(5,13,24,.92))] p-5 shadow-[0_24px_80px_rgba(0,0,0,.24)] sm:grid-cols-[1fr_auto] sm:items-end sm:gap-10 sm:p-8">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">
            PG Arcade · produto dedicado
          </p>
          <h2
            id="pg-lab-title"
            className="mt-3 max-w-3xl font-display text-[clamp(2rem,4vw,4.25rem)] font-medium leading-[0.94] tracking-[-0.055em] text-white"
          >
            Código que você pode jogar.
          </h2>
          <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-[#a9bfd8]">
            O Arcade agora vive em uma aplicação própria. Assim, jogos, modos e evolução
            técnica têm uma única fonte de verdade, enquanto o portfólio continua mostrando
            o projeto sem duplicar runtime e manutenção.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <a
            href={portfolioArcadeUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-arcade-full-site="true"
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#67e8f9]/45 bg-[#0b2746] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#bdf7ff] transition-colors hover:bg-[#103857] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
          >
            <Gamepad2 className="h-4 w-4" aria-hidden="true" />
            abrir PG Arcade
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <p className="max-w-xs text-xs leading-5 text-[#a9bfd8] sm:text-right">
            Experiência dedicada, aberta em outra aba para preservar a jornada do portfólio.
          </p>
        </div>
      </div>
    </section>
  );
}
