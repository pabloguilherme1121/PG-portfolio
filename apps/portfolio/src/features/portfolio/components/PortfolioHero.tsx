import { ArrowUpRight } from "lucide-react";
import type { RefObject } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";

type PortfolioHeroProps = {
  markUrl: string;
  portraitUrl: string;
  portraitResponsive: { avif: string; webp: string };
  heroCtaRef: RefObject<HTMLDivElement | null>;
};

export default function PortfolioHero({ portraitUrl, portraitResponsive, heroCtaRef }: PortfolioHeroProps) {
  return (
    <section id="inicio" className="professional-hero relative pt-[76px]" aria-labelledby="hero-title">
      <div className="professional-hero-grid mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
        <div className="min-w-0">
          <p className="professional-eyebrow">Pablo Guilherme · desenvolvimento web</p>
          <h1 id="hero-title" className="professional-hero-title mt-4 font-display font-semibold text-white">Interfaces claras.<br />Produtos que você pode usar.</h1>
          <p className="mt-5 max-w-[58ch] font-body text-base leading-7 text-[#bed0ea] sm:text-lg sm:leading-8">Sou estudante de Análise e Desenvolvimento de Sistemas. Desenvolvo experiências web com React e TypeScript, da organização da informação à interface e publicação.</p>
          <div ref={heroCtaRef} data-hero-cta="true" className="mt-6 flex flex-wrap gap-3">
            <a href="#projetos" className="professional-primary">Ver projetos <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href="#contato" onClick={() => trackPortfolioEvent("quote_cta", { source: "hero" })} className="professional-secondary">Conversar sobre um projeto <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
          </div>
        </div>
        <figure className="professional-portrait">
          <picture>
            <source type="image/avif" srcSet={portraitResponsive.avif} />
            <source type="image/webp" srcSet={portraitResponsive.webp} />
            <img src={portraitUrl} alt="Retrato de Pablo Guilherme" width="720" height="900" loading="eager" decoding="async" className="h-full w-full object-cover object-top" />
          </picture>
          <figcaption className="mt-3 font-body text-sm leading-6 text-[#bed0ea]">Produto, interface e código.<br /><a href="#perfil-profissional" onClick={() => trackPortfolioEvent("professional_profile_opened")} className="inline-flex min-h-11 items-center text-[#a5f3fc] underline underline-offset-4">Conhecer meu perfil</a></figcaption>
        </figure>
      </div>
    </section>
  );
}
