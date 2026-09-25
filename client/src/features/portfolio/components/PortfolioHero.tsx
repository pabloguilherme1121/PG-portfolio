import { publicMediaPath } from "@/features/portfolio/utils/publicMediaPath";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { useNearViewport } from "@/features/portfolio/hooks/useNearViewport";
import { ArrowDown, ArrowDownRight, ArrowUpRight, Play, Volume2, VolumeX } from "lucide-react";
import { type RefObject, useRef, useState } from "react";

const heroUrl = publicMediaPath("/manus-storage/pablo-hero-archive_fbc55c04.png");
const heroResponsive = {
  avif: publicMediaPath("/manus-storage/pablo-hero-archive-480w_e40b1df5.avif 480w, /manus-storage/pablo-hero-archive-768w_5499edae.avif 768w, /manus-storage/pablo-hero-archive-1200w_862455f5.avif 1200w, /manus-storage/pablo-hero-archive-1600w_1c356f9e.avif 1600w, /manus-storage/pablo-hero-archive-1920w_64ab699e.avif 1920w"),
  webp: publicMediaPath("/manus-storage/pablo-hero-archive-480w_b3b1574d.webp 480w, /manus-storage/pablo-hero-archive-768w_cd8f428d.webp 768w, /manus-storage/pablo-hero-archive-1200w_b0307ff4.webp 1200w, /manus-storage/pablo-hero-archive-1600w_d789da48.webp 1600w, /manus-storage/pablo-hero-archive-1920w_19e9d0c3.webp 1920w"),
};
const showreelUrl = publicMediaPath("/manus-storage/showreel_e887bf6f.mp4");
const showreelPosterUrl = publicMediaPath("/manus-storage/showreel-poster_847cd0c5.jpg");
const showreelPosterResponsive = {
  avif: publicMediaPath("/manus-storage/showreel-poster-480w_409a88d2.avif 480w, /manus-storage/showreel-poster-768w_e6e5d093.avif 768w, /manus-storage/showreel-poster-1200w_b3315973.avif 1200w, /manus-storage/showreel-poster-1280w_54c3532c.avif 1280w"),
  webp: publicMediaPath("/manus-storage/showreel-poster-480w_5c84b53c.webp 480w, /manus-storage/showreel-poster-768w_c3e4972b.webp 768w, /manus-storage/showreel-poster-1200w_876a4b83.webp 1200w, /manus-storage/showreel-poster-1280w_cab44748.webp 1280w"),
};
const showreelVerticalUrl = publicMediaPath("/manus-storage/showreel-vertical_00d4c92f.mp4");
const showreelVerticalPosterUrl = publicMediaPath("/manus-storage/showreel-vertical-poster_e21c73f9.jpg");
const showreelVerticalPosterResponsive = {
  avif: publicMediaPath("/manus-storage/showreel-vertical-poster-480w_e4656a6a.avif 480w, /manus-storage/showreel-vertical-poster-720w_7e009499.avif 720w"),
  webp: publicMediaPath("/manus-storage/showreel-vertical-poster-480w_092fa9d6.webp 480w, /manus-storage/showreel-vertical-poster-720w_d90358f3.webp 720w"),
};

declare const __PORTFOLIO_HERO_AVAILABLE__: boolean;
declare const __PORTFOLIO_SHOWREEL_AVAILABLE__: boolean;

type ResponsiveImageSources = {
  avif: string;
  webp: string;
};

type PortfolioHeroProps = {
  heroCtaRef: RefObject<HTMLDivElement | null>;
  isDesktopViewport: boolean;
  markUrl: string;
  portraitResponsive: ResponsiveImageSources;
  portraitUrl: string;
};

export default function PortfolioHero({
  heroCtaRef,
  isDesktopViewport,
  markUrl,
  portraitResponsive,
  portraitUrl,
}: PortfolioHeroProps) {
  const isStaticDeploy = import.meta.env.VITE_STATIC_DEPLOY === "true";
  const heroAvailable = !isStaticDeploy || __PORTFOLIO_HERO_AVAILABLE__;
  const showreelAvailable = !isStaticDeploy || __PORTFOLIO_SHOWREEL_AVAILABLE__;
  const [showreelSectionRef, shouldLoadShowreelPoster] = useNearViewport<HTMLDivElement>("0px");
  const [showreelRequested, setShowreelRequested] = useState(false);
  const [showreelReady, setShowreelReady] = useState(false);
  const [showreelError, setShowreelError] = useState(false);
  const [showreelPlaying, setShowreelPlaying] = useState(false);
  const [showreelMuted, setShowreelMuted] = useState(false);
  const showreelVideoRef = useRef<HTMLVideoElement>(null);

  return (
    <section id="inicio" className="relative isolate min-h-[680px] overflow-hidden pt-[76px] sm:min-h-[850px]">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-70" />
      {heroAvailable && <picture className="pointer-events-none absolute inset-y-0 right-0 block w-full opacity-70 lg:w-[72%]"><source type="image/avif" srcSet={heroResponsive.avif} sizes="(min-width: 1024px) 72vw, 100vw" /><source type="image/webp" srcSet={heroResponsive.webp} sizes="(min-width: 1024px) 72vw, 100vw" /><img src={heroUrl} alt="" width="1920" height="1080" loading="eager" fetchPriority="high" decoding="async" className="h-full w-full object-cover object-center" /></picture>}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full bg-[linear-gradient(90deg,#07111f_5%,rgba(7,17,31,0.96)_30%,rgba(7,17,31,0.30)_68%,rgba(7,17,31,0.66)_100%)] lg:w-[80%]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-52 bg-[linear-gradient(0deg,#07111f,transparent)]" />
      <div className="pointer-events-none absolute right-[8%] top-[18%] hidden w-24 opacity-30 drop-shadow-[0_0_26px_rgba(56,189,248,0.65)] lg:block"><img src={markUrl} alt="" width="160" height="160" decoding="async" className="w-full" /></div>

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
            <picture><source type="image/avif" srcSet={portraitResponsive.avif} sizes="(min-width: 1024px) 224px, 80px" /><source type="image/webp" srcSet={portraitResponsive.webp} sizes="(min-width: 1024px) 224px, 80px" /><img src={portraitUrl} alt="Pablo Guilherme em retrato profissional" width="720" height="900" loading="eager" fetchPriority="high" decoding="async" className="h-20 w-20 shrink-0 object-cover object-top lg:h-56 lg:w-full" /></picture>
            <figcaption className="min-w-0 py-1 lg:px-1 lg:pb-1"><span className="block font-mono text-[8px] uppercase tracking-[0.15em] text-[#67e8f9]">arquivo / autor</span><span className="mt-1 block truncate font-display text-lg tracking-[-0.03em] text-white">Pablo Guilherme</span><span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.1em] text-[#8fa8c7]">TI · conteúdo · imagem</span></figcaption>
          </figure>
          <div className="reveal delay-2 mt-9 flex max-w-xl flex-col gap-6 sm:ml-[16.8%]">
            <p className="text-balance font-body text-base leading-8 text-[#bed0ea] sm:text-lg">
              Um portfólio que conecta tecnologia, conteúdo e imagem para transformar ideias em interfaces, registros e peças visuais mais claras.
            </p>
            <p className="max-w-xl border-l-2 border-[#38bdf8] pl-3 font-mono text-[10px] uppercase leading-5 tracking-[0.1em] text-[#d8eaff]">Vídeos, imagens aéreas e conteúdo visual para eventos, marcas e projetos que precisam ser vistos com clareza.</p>
            <div ref={heroCtaRef} data-hero-cta="true" className="flex flex-wrap items-center gap-3">
              <a href="#contato" onClick={() => trackPortfolioEvent("quote_cta", { source: "hero" })} className="group inline-flex items-center gap-3 bg-[#38bdf8] px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[#02111f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_10px_30px_rgba(56,189,248,0.32)] active:scale-[0.97]">
                solicitar orçamento <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
              </a>
              <a href="#projetos" className="inline-flex items-center gap-2 px-2 py-3 font-mono text-[11px] uppercase tracking-[0.13em] text-[#b7cdf1] transition-colors hover:text-white">
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
            {showreelAvailable ? <div ref={showreelSectionRef} className="showreel-card mt-6 overflow-hidden border border-[#67e8f9]/25 bg-[#050c16]/90" data-showreel="true">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.1] px-4 py-3">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#67e8f9]">arquivo em movimento</p>
                  <p className="mt-1 font-body text-xs text-[#a9bed8]">showreel curto · imagem aérea, interface e registro</p>
                </div>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7189ae]">{showreelRequested ? (showreelError ? "erro" : showreelReady ? "pronto" : "carregando") : isDesktopViewport ? "sob demanda" : "vertical sob demanda"}</span>
              </div>
              <div className={`relative bg-[#07111f] ${isDesktopViewport ? "aspect-video" : "aspect-[9/16]"}`}>
                {!showreelRequested && <button type="button" onClick={() => { setShowreelError(false); setShowreelRequested(true); }} className="showreel-poster group absolute inset-0 grid place-items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a5f3fc]" aria-label="Carregar e reproduzir o showreel" data-showreel-trigger="true">
                  {shouldLoadShowreelPoster && <picture className="absolute inset-0"><source type="image/avif" srcSet={isDesktopViewport ? showreelPosterResponsive.avif : showreelVerticalPosterResponsive.avif} sizes="(min-width: 1024px) 900px, 100vw" /><source type="image/webp" srcSet={isDesktopViewport ? showreelPosterResponsive.webp : showreelVerticalPosterResponsive.webp} sizes="(min-width: 1024px) 900px, 100vw" /><img src={isDesktopViewport ? showreelPosterUrl : showreelVerticalPosterUrl} alt={isDesktopViewport ? "Pôster horizontal do showreel com imagem aérea e registro audiovisual" : "Pôster vertical do showreel otimizado para celular"} loading="lazy" decoding="async" width={isDesktopViewport ? 1280 : 720} height={isDesktopViewport ? 720 : 1280} className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none" /></picture>}
                  <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,11,20,0.82),rgba(3,11,20,0.18))]" />
                  <span className="showreel-play-button relative ml-5 inline-flex items-center gap-3 rounded-full border border-[#a5f3fc]/80 bg-[#38bdf8] px-3 py-2 text-[#02111f] shadow-[0_0_28px_rgba(56,189,248,0.35)] transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none" data-showreel-play="true"><span className="grid h-10 w-10 place-items-center rounded-full border border-[#02111f]/25 bg-[#a5f3fc]/80"><Play className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden="true" /></span><span className="pr-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">play</span></span>
                  <span className="absolute bottom-4 left-5 font-mono text-[9px] uppercase tracking-[0.13em] text-[#e6f8ff]">carregar showreel {isDesktopViewport ? "horizontal" : "vertical"} · 00:09</span>
                </button>}
                {showreelRequested && !showreelError && <video ref={showreelVideoRef} key={isDesktopViewport ? "showreel-horizontal" : "showreel-vertical"} src={isDesktopViewport ? showreelUrl : showreelVerticalUrl} poster={isDesktopViewport ? publicMediaPath("/manus-storage/showreel-poster-1280w_54c3532c.avif") : publicMediaPath("/manus-storage/showreel-vertical-poster-720w_7e009499.avif")} controls playsInline preload="metadata" onCanPlay={() => setShowreelReady(true)} onPlay={() => setShowreelPlaying(true)} onPause={() => setShowreelPlaying(false)} onVolumeChange={(event) => setShowreelMuted(event.currentTarget.muted)} onError={() => { setShowreelError(true); setShowreelReady(false); setShowreelPlaying(false); }} className="h-full w-full object-cover" aria-label={isDesktopViewport ? "Showreel horizontal de Pablo Guilherme" : "Showreel vertical de Pablo Guilherme para dispositivos móveis"} data-showreel-video="true" />}
                {showreelRequested && !showreelError && showreelReady && showreelPlaying && <button type="button" onClick={(event) => { event.stopPropagation(); const video = showreelVideoRef.current; if (!video) return; video.muted = !video.muted; setShowreelMuted(video.muted); }} aria-label={showreelMuted ? "Ativar som do showreel" : "Desativar som do showreel"} aria-pressed={showreelMuted} title={showreelMuted ? "Ativar som" : "Desativar som"} className="showreel-volume-control absolute bottom-4 right-4 z-10 grid h-11 w-11 place-items-center border border-[#a5f3fc]/75 bg-[#02111f]/85 text-[#d9fbff] shadow-[0_10px_25px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none" data-showreel-volume="true">{showreelMuted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}</button>}
                {showreelRequested && showreelError && <div className="absolute inset-0 grid place-items-center px-5 text-center"><div><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">showreel indisponível</p><p className="mt-2 max-w-sm font-body text-sm leading-6 text-[#b7cdf1]">O vídeo não carregou agora. Você ainda pode conhecer os trabalhos na galeria.</p><button type="button" onClick={() => { setShowreelError(false); setShowreelReady(false); setShowreelPlaying(false); setShowreelMuted(false); setShowreelRequested(false); }} className="mt-4 border border-[#67e8f9]/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#d9fbff] transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">tentar novamente</button></div></div>}
              </div>
            </div> : <div className="mt-6 border border-[#67e8f9]/25 bg-[#050c16]/90 px-5 py-6" role="status"><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#67e8f9]">arquivo em movimento</p><p className="mt-2 font-body text-sm text-[#b9d4ee]">Showreel em preparação. Conheça os projetos e formatos disponíveis abaixo.</p></div>}
          </div>
        </div>

        <div className="reveal delay-3 grid border-t border-white/[0.12] pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <p className="max-w-sm font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-[#7890b4] light-muted-ink">
            ARQUIVO: em evolução<br />
            FOCO ATUAL: TI · CONTEÚDO · AUDIOVISUAL<br />
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
