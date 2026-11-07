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
          <p className="professional-eyebrow">Pablo Guilherme · Desenvolvimento Web e Produção Audiovisual</p>
          <h1 id="hero-title" className="professional-hero-title mt-4 font-display font-semibold text-white">Sites e aplicações<br />que funcionam no celular.</h1>
          <p className="mt-5 max-w-[58ch] font-body text-base leading-7 text-[#bed0ea] sm:text-lg sm:leading-8">Crio sites e aplicações para negócios locais e utilidade pública, com dados organizados e vídeos que explicam. Estudo Análise e Desenvolvimento de Sistemas e trabalho com React, TypeScript, PWA, filmagem e edição em Águas Lindas de Goiás.</p>
          <div ref={heroCtaRef} data-hero-cta="true" className="mt-6 flex flex-col gap-3">
            <div data-hero-primary-actions="true" className="flex flex-wrap gap-3">
              <a href="#estudos-de-caso" className="professional-primary">Ver dois cases <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
              <a href="#contato" onClick={() => trackPortfolioEvent("quote_cta", { source: "hero" })} className="professional-secondary">Conversar sobre um projeto <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
            </div>
            <div data-hero-optional-actions="true" className="flex flex-wrap gap-2 border-t border-[#67e8f9]/20 pt-3">
              <a href="#curriculo-web" onClick={() => trackPortfolioEvent("professional_profile_opened")} className="professional-secondary">Ver currículo <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
              <button type="button" data-hero-pg-bot="true" aria-keyshortcuts="Alt+B" title="Abrir PG Bot (Alt+B)" onClick={event => onOpenPGBot(event.currentTarget)} className="professional-secondary inline-flex min-h-11 items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><img src={`${import.meta.env.BASE_URL}brand/pg-bot/mascot.webp`} alt="" width="26" height="30" loading="lazy" decoding="async" className="h-[30px] w-[26px] object-contain" />Perguntar ao PG Bot <span aria-hidden="true" className="hidden rounded border border-[#67e8f9]/30 px-1.5 py-0.5 font-mono text-[10px] tracking-normal sm:inline">Alt+B</span></button>
            </div>
          </div>
          <nav className="hero-project-index" aria-label="Explore meu trabalho">
            <a href="#estudos-de-caso"><span className="hero-project-number" aria-hidden="true">01</span><span><strong>Trajeto + Observatório</strong><small>Utilidade pública · dados e rotas com fontes</small></span><ArrowUpRight aria-hidden="true" /></a>
            <a href="#estudos-de-caso"><span className="hero-project-number" aria-hidden="true">02</span><span><strong>MPJ Storyworks</strong><small>Audiovisual · RHAM e loja de moda, separados</small></span><ArrowUpRight aria-hidden="true" /></a>
          </nav>
        </div>
        <figure className="professional-portrait">
          <picture>
            <source type="image/avif" srcSet={portraitResponsive.avif} />
            <source type="image/webp" srcSet={portraitResponsive.webp} />
            <img src={portraitUrl} alt="Retrato de Pablo Guilherme" width="720" height="900" loading="eager" decoding="async" className="h-full w-full object-cover object-top" />
          </picture>
          <figcaption className="mt-3 font-body text-sm leading-6 text-[#bed0ea]">Produtos para testar. Vídeos e decisões para conferir.<br /><a href="#perfil-profissional" onClick={() => trackPortfolioEvent("professional_profile_opened")} className="inline-flex min-h-11 items-center text-[#a5f3fc] underline underline-offset-4">Conhecer meu perfil</a></figcaption>
        </figure>
      </div>
    </section>
  );
}
