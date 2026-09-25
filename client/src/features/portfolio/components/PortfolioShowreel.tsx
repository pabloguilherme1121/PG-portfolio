import { Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";
import { useNearViewport } from "@/features/portfolio/hooks/useNearViewport";
import { publicMediaPath } from "@/features/portfolio/utils/publicMediaPath";

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

type PortfolioShowreelProps = {
  available: boolean;
  isDesktopViewport: boolean;
};

export default function PortfolioShowreel({ available, isDesktopViewport }: PortfolioShowreelProps) {
  const [showreelSectionRef, shouldLoadShowreelPoster] = useNearViewport<HTMLDivElement>("0px");
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reset = () => {
    setError(false);
    setReady(false);
    setPlaying(false);
    setMuted(false);
    setRequested(false);
  };

  if (!available) {
    return (
      <div className="mt-6 border border-[#67e8f9]/25 bg-[#050c16]/90 px-5 py-6" role="status">
        <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#67e8f9]">arquivo em movimento</p>
        <p className="mt-2 font-body text-sm text-[#b9d4ee]">Showreel em preparação. Conheça os projetos e formatos disponíveis abaixo.</p>
      </div>
    );
  }

  return (
    <div ref={showreelSectionRef} className="showreel-card mt-6 overflow-hidden border border-[#67e8f9]/25 bg-[#050c16]/90" data-showreel="true">
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.1] px-4 py-3">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#67e8f9]">arquivo em movimento</p>
          <p className="mt-1 font-body text-xs text-[#a9bed8]">showreel curto · imagem aérea, interface e registro</p>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7189ae]">
          {requested ? (error ? "erro" : ready ? "pronto" : "carregando") : isDesktopViewport ? "sob demanda" : "vertical sob demanda"}
        </span>
      </div>
      <div className={`relative bg-[#07111f] ${isDesktopViewport ? "aspect-video" : "aspect-[9/16]"}`}>
        {!requested && (
          <button
            type="button"
            onClick={() => {
              setError(false);
              setRequested(true);
            }}
            className="showreel-poster group absolute inset-0 grid place-items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a5f3fc]"
            aria-label="Carregar e reproduzir o showreel"
            data-showreel-trigger="true"
          >
            {shouldLoadShowreelPoster && (
              <picture className="absolute inset-0">
                <source type="image/avif" srcSet={isDesktopViewport ? showreelPosterResponsive.avif : showreelVerticalPosterResponsive.avif} sizes="(min-width: 1024px) 900px, 100vw" />
                <source type="image/webp" srcSet={isDesktopViewport ? showreelPosterResponsive.webp : showreelVerticalPosterResponsive.webp} sizes="(min-width: 1024px) 900px, 100vw" />
                <img
                  src={isDesktopViewport ? showreelPosterUrl : showreelVerticalPosterUrl}
                  alt={isDesktopViewport ? "Pôster horizontal do showreel com imagem aérea e registro audiovisual" : "Pôster vertical do showreel otimizado para celular"}
                  loading="lazy"
                  decoding="async"
                  width={isDesktopViewport ? 1280 : 720}
                  height={isDesktopViewport ? 720 : 1280}
                  className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
                />
              </picture>
            )}
            <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,11,20,0.82),rgba(3,11,20,0.18))]" />
            <span className="showreel-play-button relative ml-5 inline-flex items-center gap-3 rounded-full border border-[#a5f3fc]/80 bg-[#38bdf8] px-3 py-2 text-[#02111f] shadow-[0_0_28px_rgba(56,189,248,0.35)] transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none" data-showreel-play="true">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-[#02111f]/25 bg-[#a5f3fc]/80"><Play className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden="true" /></span>
              <span className="pr-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">play</span>
            </span>
            <span className="absolute bottom-4 left-5 font-mono text-[9px] uppercase tracking-[0.13em] text-[#e6f8ff]">carregar showreel {isDesktopViewport ? "horizontal" : "vertical"} · 00:09</span>
          </button>
        )}

        {requested && !error && (
          <video
            ref={videoRef}
            key={isDesktopViewport ? "showreel-horizontal" : "showreel-vertical"}
            src={isDesktopViewport ? showreelUrl : showreelVerticalUrl}
            poster={isDesktopViewport ? publicMediaPath("/manus-storage/showreel-poster-1280w_54c3532c.avif") : publicMediaPath("/manus-storage/showreel-vertical-poster-720w_7e009499.avif")}
            controls
            playsInline
            preload="metadata"
            onCanPlay={() => setReady(true)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
            onError={() => {
              setError(true);
              setReady(false);
              setPlaying(false);
            }}
            className="h-full w-full object-cover"
            aria-label={isDesktopViewport ? "Showreel horizontal de Pablo Guilherme" : "Showreel vertical de Pablo Guilherme para dispositivos móveis"}
            data-showreel-video="true"
          />
        )}

        {requested && !error && ready && playing && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              const video = videoRef.current;
              if (!video) return;
              video.muted = !video.muted;
              setMuted(video.muted);
            }}
            aria-label={muted ? "Ativar som do showreel" : "Desativar som do showreel"}
            aria-pressed={muted}
            title={muted ? "Ativar som" : "Desativar som"}
            className="showreel-volume-control absolute bottom-4 right-4 z-10 grid h-11 w-11 place-items-center border border-[#a5f3fc]/75 bg-[#02111f]/85 text-[#d9fbff] shadow-[0_10px_25px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none"
            data-showreel-volume="true"
          >
            {muted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}
          </button>
        )}

        {requested && error && (
          <div className="absolute inset-0 grid place-items-center px-5 text-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">showreel indisponível</p>
              <p className="mt-2 max-w-sm font-body text-sm leading-6 text-[#b7cdf1]">O vídeo não carregou agora. Você ainda pode conhecer os trabalhos na galeria.</p>
              <button type="button" onClick={reset} className="mt-4 border border-[#67e8f9]/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#d9fbff] transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
                tentar novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
