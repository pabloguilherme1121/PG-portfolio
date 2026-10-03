import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { RefObject } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";


type ResponsiveSourceSet = {
  avif: string;
  webp: string;
};

type PortfolioHeroProps = {
  markUrl: string;
  portraitUrl: string;
  portraitResponsive: ResponsiveSourceSet;
  heroCtaRef: RefObject<HTMLDivElement | null>;
};

export default function PortfolioHero({
  markUrl,
  portraitUrl,
  portraitResponsive,
  heroCtaRef,
}: PortfolioHeroProps) {
  return (
    <section id="inicio" className="relative isolate overflow-hidden pt-[76px]">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-70" />
      <div className="hero-shade pointer-events-none absolute inset-y-0 right-0 w-full bg-[linear-gradient(90deg,#07111f_5%,rgba(7,17,31,0.96)_30%,rgba(7,17,31,0.30)_68%,rgba(7,17,31,0.66)_100%)] lg:w-[80%]" />
      <div className="hero-shade pointer-events-none absolute bottom-0 left-0 right-0 h-52 bg-[linear-gradient(0deg,#07111f,transparent)]" />
      <div className="pointer-events-none absolute right-[8%] top-[18%] hidden w-24 opacity-30 drop-shadow-[0_0_26px_rgba(56,189,248,0.65)] lg:block">
        <img src={markUrl} alt="" width="160" height="160" decoding="async" className="w-full" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 pb-3 pt-4 min-[360px]:px-5 sm:px-8 sm:pb-14 sm:pt-16 lg:min-h-[680px] lg:px-12 lg:py-20">
        <div className="relative max-w-4xl">
          <div className="reveal flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a5f3fc]">
            <span className="h-px w-10 bg-[#38bdf8]" />
            Pablo Guilherme · produto digital, interface e desenvolvimento web
          </div>
          <h1 className="reveal delay-1 mt-3 max-w-4xl font-display text-[clamp(1.9rem,9vw,3rem)] font-semibold leading-[0.94] tracking-[-0.06em] sm:mt-7 sm:leading-[0.84] sm:tracking-[-0.075em] text-white min-[400px]:text-[clamp(2.85rem,8.8vw,8.8rem)]">
            Desenvolvo produtos digitais que tornam informação complexa simples de usar.
          </h1>
          <figure className="hero-portrait-card mt-2 hidden max-w-sm items-center gap-3 border border-[#67e8f9]/20 bg-[#07111f]/82 p-2 sm:flex lg:absolute lg:right-[-8rem] lg:top-0 lg:mt-0 lg:w-56 lg:flex-col lg:items-stretch lg:p-2">
            <picture>
              <source media="(min-width: 640px)" type="image/avif" srcSet={portraitResponsive.avif} sizes="(min-width: 1024px) 224px, 80px" />
              <source media="(min-width: 640px)" type="image/webp" srcSet={portraitResponsive.webp} sizes="(min-width: 1024px) 224px, 80px" />
              <source media="(min-width: 640px)" srcSet={portraitUrl} />
              <img src="data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%271%27%20height=%271%27/%3E" alt="Pablo Guilherme em retrato profissional" width="720" height="900" loading="eager" fetchPriority="high" decoding="async" className="h-14 w-14 shrink-0 object-cover object-top min-[390px]:h-16 min-[390px]:w-16 lg:h-56 lg:w-full" />
            </picture>
            <figcaption className="min-w-0 py-1 lg:px-1 lg:pb-1">
              <span className="block font-mono text-[8px] uppercase tracking-[0.15em] text-[#67e8f9]">perfil profissional</span>
              <span className="mt-1 block truncate font-display text-lg tracking-[-0.03em] text-white">Pablo Guilherme</span>
              <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.1em] text-[#8fa8c7]">ADS · React · TypeScript · produtos digitais</span>
              <a href="#perfil-profissional" onClick={() => trackPortfolioEvent("professional_profile_opened")} className="mt-2 inline-flex min-h-9 items-center gap-1.5 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#a5f3fc] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">avaliar perfil <ArrowUpRight className="h-3 w-3" aria-hidden="true" /></a>
            </figcaption>
          </figure>

          <div className="reveal delay-2 mt-2 flex max-w-xl flex-col gap-2.5 sm:mt-8 sm:gap-5 sm:ml-[16.8%]">
            <p className="text-balance font-body text-sm leading-6 text-[#bed0ea] min-[390px]:text-[15px] sm:text-lg sm:leading-8">
              Do briefing ao deploy, organizo produto, interface, código e validação para transformar uma necessidade em algo utilizável e demonstrável.
            </p>
            <div ref={heroCtaRef} data-hero-cta="true" className="grid w-full grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-3">
              <a
                href="#diagnostico"
                onClick={() => trackPortfolioEvent("quote_cta", { source: "hero" })}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#38bdf8] px-5 py-3 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[#02111f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_10px_30px_rgba(56,189,248,0.32)] active:scale-[0.97] sm:w-auto"
              >
                começar diagnóstico <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
              </a>
              <a href="#projetos" className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-white/[0.1] px-3 py-3 text-center font-mono text-[11px] uppercase tracking-[0.13em] text-[#b7cdf1] transition-colors hover:border-[#67e8f9]/40 hover:text-white sm:w-auto sm:border-transparent">
                ver projetos <ArrowDownRight className="h-3.5 w-3.5" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
