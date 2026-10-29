import { ArrowUpRight } from "lucide-react";
import type { RefObject } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";

type PortfolioHeroProps = {
  markUrl: string;
  portraitUrl: string;
  portraitResponsive: { avif: string; webp: string };
  heroCtaRef: RefObject<HTMLDivElement | null>;
  onOpenPGBot: (trigger: HTMLElement) => void;
};

export default function PortfolioHero({ portraitUrl, portraitResponsive, heroCtaRef, onOpenPGBot }: PortfolioHeroProps) {
  return (
    <section id="inicio" className="professional-hero relative pt-[76px]" aria-labelledby="hero-title">
      <div className="professional-hero-grid mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="min-w-0">
          <p className="professional-eyebrow">Pablo Guilherme · projetos, interfaces e dados</p>
          <h1 id="hero-title" className="professional-hero-title mt-4 font-display font-semibold text-white">Interfaces claras.<br />Produtos que você pode usar.</h1>
          <p className="mt-5 max-w-[58ch] font-body text-base leading-7 text-[#bed0ea] sm:text-lg sm:leading-8">Crio sites e aplicações com React e TypeScript enquanto estudo Análise e Desenvolvimento de Sistemas. Abra produtos reais, conheça as decisões de interface e confira código e testes. Os projetos em evolução estão identificados.</p>
          <div ref={heroCtaRef} data-hero-cta="true" className="mt-6 flex flex-col gap-3">
            <div data-hero-primary-actions="true" className="flex flex-wrap gap-3">
              <a href="#projetos" className="professional-primary">Ver projetos <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
              <a href="#contato" onClick={() => trackPortfolioEvent("quote_cta", { source: "hero" })} className="professional-secondary">Conversar sobre um projeto <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
            </div>
            <div data-hero-optional-actions="true" className="flex flex-wrap gap-2 border-t border-[#67e8f9]/20 pt-3">
              <a href="#curriculo-web" onClick={() => trackPortfolioEvent("professional_profile_opened")} className="professional-secondary">Ver currículo <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
              <button type="button" data-hero-pg-bot="true" aria-keyshortcuts="Alt+B" title="Abrir PG Bot (Alt+B)" onClick={event => onOpenPGBot(event.currentTarget)} className="professional-secondary inline-flex min-h-11 items-center gap-2 border-[#67e8f9]/45 bg-[#0b2b46]/55 hover:bg-[#133b59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><img src={`${import.meta.env.BASE_URL}brand/pg-bot/mascot.webp`} alt="" width="26" height="30" loading="lazy" decoding="async" className="h-[30px] w-[26px] object-contain" />Perguntar ao PG Bot <span aria-hidden="true" className="hidden rounded border border-[#67e8f9]/30 px-1.5 py-0.5 font-mono text-[10px] tracking-normal text-[#bbf7ff] sm:inline">Alt+B</span></button>
            </div>
          </div>
          <nav className="hero-project-index" aria-label="Explore meu trabalho">
            <a href="#observatorio"><span className="hero-project-number" aria-hidden="true">01</span><span><strong>Dados que fazem sentido</strong><small>Observatório · conhecer o case</small></span><ArrowUpRight aria-hidden="true" /></a>
            <a href="#pg-lab"><span className="hero-project-number" aria-hidden="true">02</span><span><strong>Interação que convida a jogar</strong><small>PG Arcade · explorar as mecânicas</small></span><ArrowUpRight aria-hidden="true" /></a>
            <a href="#trajeto"><span className="hero-project-number" aria-hidden="true">03</span><span><strong>Serviços e mobilidade</strong><small>Trajeto · produto em evolução</small></span><ArrowUpRight aria-hidden="true" /></a>
          </nav>
        </div>
        <figure className="professional-portrait">
          <picture>
            <source type="image/avif" srcSet={portraitResponsive.avif} />
            <source type="image/webp" srcSet={portraitResponsive.webp} />
            <img src={portraitUrl} alt="Retrato de Pablo Guilherme" width="720" height="900" loading="eager" decoding="async" className="h-full w-full object-cover object-top" />
          </picture>
          <figcaption className="mt-3 font-body text-sm leading-6 text-[#bed0ea]">Projetos para testar. Decisões para conferir.<br /><a href="#perfil-profissional" onClick={() => trackPortfolioEvent("professional_profile_opened")} className="inline-flex min-h-11 items-center text-[#a5f3fc] underline underline-offset-4">Conhecer meu perfil</a></figcaption>
        </figure>
      </div>
    </section>
  );
}
