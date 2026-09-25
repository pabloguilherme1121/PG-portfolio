import { ArrowDown, ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { RefObject } from "react";
import PortfolioShowreel from "@/features/portfolio/components/PortfolioShowreel";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { publicMediaPath } from "@/features/portfolio/utils/publicMediaPath";

const heroUrl = publicMediaPath("/manus-storage/pablo-hero-archive_fbc55c04.png");
const heroResponsive = {
  avif: publicMediaPath("/manus-storage/pablo-hero-archive-480w_e40b1df5.avif 480w, /manus-storage/pablo-hero-archive-768w_5499edae.avif 768w, /manus-storage/pablo-hero-archive-1200w_862455f5.avif 1200w, /manus-storage/pablo-hero-archive-1600w_1c356f9e.avif 1600w, /manus-storage/pablo-hero-archive-1920w_64ab699e.avif 1920w"),
  webp: publicMediaPath("/manus-storage/pablo-hero-archive-480w_b3b1574d.webp 480w, /manus-storage/pablo-hero-archive-768w_cd8f428d.webp 768w, /manus-storage/pablo-hero-archive-1200w_b0307ff4.webp 1200w, /manus-storage/pablo-hero-archive-1600w_d789da48.webp 1600w, /manus-storage/pablo-hero-archive-1920w_19e9d0c3.webp 1920w"),
};

type ResponsiveSourceSet = {
  avif: string;
  webp: string;
};

type PortfolioHeroProps = {
  heroAvailable: boolean;
  markUrl: string;
  portraitUrl: string;
  portraitResponsive: ResponsiveSourceSet;
  showreelAvailable: boolean;
  isDesktopViewport: boolean;
  heroCtaRef: RefObject<HTMLDivElement | null>;
};

export default function PortfolioHero({
  heroAvailable,
  markUrl,
  portraitUrl,
  portraitResponsive,
  showreelAvailable,
  isDesktopViewport,
  heroCtaRef,
}: PortfolioHeroProps) {
  return (
    <section id="inicio" className="relative isolate min-h-[680px] overflow-hidden pt-[76px] sm:min-h-[850px]">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-70" />
      {heroAvailable && (
        <picture className="pointer-events-none absolute inset-y-0 right-0 block w-full opacity-70 lg:w-[72%]">
          <source type="image/avif" srcSet={heroResponsive.avif} sizes="(min-width: 1024px) 72vw, 100vw" />
          <source type="image/webp" srcSet={heroResponsive.webp} sizes="(min-width: 1024px) 72vw, 100vw" />
          <img src={heroUrl} alt="" width="1920" height="1080" loading="eager" fetchPriority="high" decoding="async" className="h-full w-full object-cover object-center" />
        </picture>
      )}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full bg-[linear-gradient(90deg,#07111f_5%,rgba(7,17,31,0.96)_30%,rgba(7,17,31,0.30)_68%,rgba(7,17,31,0.66)_100%)] lg:w-[80%]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-52 bg-[linear-gradient(0deg,#07111f,transparent)]" />
      <div className="pointer-events-none absolute right-[8%] top-[18%] hidden w-24 opacity-30 drop-shadow-[0_0_26px_rgba(56,189,248,0.65)] lg:block">
        <img src={markUrl} alt="" width="160" height="160" decoding="async" className="w-full" />
      </div>

      <div className="relative mx-auto flex min-h-[604px] max-w-[1440px] flex-col justify-between px-5 pb-8 pt-12 sm:min-h-[774px] sm:px-8 sm:pt-24 lg:px-12">
        <div className="relative max-w-4xl">
          <div className="reveal flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a5f3fc]">
            <span className="h-px w-10 bg-[#38bdf8]" />
            01 / portfólio em movimento
          </div>
          <h1 className="reveal delay-1 mt-7 max-w-4xl font-display text-[clamp(2.7rem,11vw,3.15rem)] font-semibold leading-[0.84] tracking-[-0.075em] text-white min-[400px]:text-[clamp(2.85rem,8.8vw,8.8rem)]">
            Ideias com
            <br />
            tecnologia,
            <br />
            conteúdo e imagem.
          </h1>
          <figure className="hero-portrait-card mt-7 flex max-w-sm items-center gap-3 border border-[#67e8f9]/25 bg-[#07111f]/80 p-2 backdrop-blur-sm lg:absolute lg:right-[-8rem] lg:top-0 lg:mt-0 lg:w-56 lg:flex-col lg:items-stretch lg:p-2">
            <picture>
              <source type="image/avif" srcSet={portraitResponsive.avif} sizes="(min-width: 1024px) 224px, 80px" />
              <source type="image/webp" srcSet={portraitResponsive.webp} sizes="(min-width: 1024px) 224px, 80px" />
              <img src={portraitUrl} alt="Pablo Guilherme em retrato profissional" width="720" height="900" loading="eager" fetchPriority="high" decoding="async" className="h-20 w-20 shrink-0 object-cover object-top lg:h-56 lg:w-full" />
            </picture>
            <figcaption className="min-w-0 py-1 lg:px-1 lg:pb-1">
              <span className="block font-mono text-[8px] uppercase tracking-[0.15em] text-[#67e8f9]">arquivo / autor</span>
              <span className="mt-1 block truncate font-display text-lg tracking-[-0.03em] text-white">Pablo Guilherme</span>
              <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.1em] text-[#8fa8c7]">TI · conteúdo · imagem</span>
            </figcaption>
          </figure>

          <div className="reveal delay-2 mt-9 flex max-w-xl flex-col gap-6 sm:ml-[16.8%]">
            <p className="text-balance font-body text-base leading-8 text-[#bed0ea] sm:text-lg">
              Um portfólio que conecta tecnologia, conteúdo e imagem para transformar ideias em interfaces, registros e peças visuais mais claras.
            </p>
            <p className="max-w-xl border-l-2 border-[#38bdf8] pl-3 font-mono text-[10px] uppercase leading-5 tracking-[0.1em] text-[#d8eaff]">
              Vídeos, imagens aéreas e conteúdo visual para eventos, marcas e projetos que precisam ser vistos com clareza.
            </p>

            <div ref={heroCtaRef} data-hero-cta="true" className="grid w-full grid-cols-1 gap-2 min-[390px]:grid-cols-[minmax(0,1fr)_auto] sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-3">
              <a
                href="#contato"
                onClick={() => trackPortfolioEvent("quote_cta", { source: "hero" })}
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#38bdf8] px-5 py-3.5 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[#02111f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_10px_30px_rgba(56,189,248,0.32)] active:scale-[0.97] sm:w-auto"
              >
                solicitar orçamento <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
              </a>
              <a href="#projetos" className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-white/[0.1] px-3 py-3 text-center font-mono text-[11px] uppercase tracking-[0.13em] text-[#b7cdf1] transition-colors hover:border-[#67e8f9]/40 hover:text-white min-[390px]:w-auto min-[390px]:border-transparent sm:w-auto sm:border-transparent">
                ver trabalhos <ArrowDownRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <nav aria-label="Atalhos principais" className="mt-6 grid max-w-2xl gap-px border border-white/[0.1] bg-white/[0.1] sm:grid-cols-3">
              <a href="#projetos" className="archive-quick-route group bg-[#07111f]/90 px-3 py-3 transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-inset">
                <span className="font-mono text-[9px] text-[#67e8f9]">01</span>
                <span className="mt-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#e6f8ff]">ver evidências</span>
                <span className="mt-1 block font-body text-[11px] leading-4 text-[#8fa8c7]">trabalhos e repertório</span>
              </a>
              <a href="#servicos" className="archive-quick-route group bg-[#07111f]/90 px-3 py-3 transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-inset">
                <span className="font-mono text-[9px] text-[#67e8f9]">02</span>
                <span className="mt-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#e6f8ff]">entender serviços</span>
                <span className="mt-1 block font-body text-[11px] leading-4 text-[#8fa8c7]">formatos e duração típica</span>
              </a>
              <a href="#contato" className="archive-quick-route group bg-[#07111f]/90 px-3 py-3 transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-inset">
                <span className="font-mono text-[9px] text-[#67e8f9]">03</span>
                <span className="mt-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#e6f8ff]">iniciar conversa</span>
                <span className="mt-1 block font-body text-[11px] leading-4 text-[#8fa8c7]">orçamento e disponibilidade</span>
              </a>
            </nav>

            <PortfolioShowreel available={showreelAvailable} isDesktopViewport={isDesktopViewport} />
          </div>
        </div>

        <div className="reveal delay-3 grid border-t border-white/[0.12] pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <p className="max-w-sm font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-[#7890b4] light-muted-ink">
            ARQUIVO: em evolução
            <br />
            FOCO ATUAL: TI · CONTEÚDO · AUDIOVISUAL
            <br />
            ATENDIMENTO: ÁGUAS LINDAS · PLANALTINA · ENTORNO
          </p>
          <a href="#sobre" className="mt-6 inline-flex min-h-11 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#b7cdf1] transition-colors hover:text-[#3b82f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:mt-0">
            ver repertório e skills <ArrowDown className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
