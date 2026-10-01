import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { RefObject } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { publicMediaPath } from "@/features/portfolio/utils/publicMediaPath";

const heroUrl = publicMediaPath("/manus-storage/pablo-hero-archive_fbc55c04.png");
const heroResponsive = {
  avif: publicMediaPath("/manus-storage/pablo-hero-archive-480w_e40b1df5.avif 480w, /manus-storage/pablo-hero-archive-768w_5499edae.avif 768w, /manus-storage/pablo-hero-archive-1200w_862455f5.avif 1200w, /manus-storage/pablo-hero-archive-1600w_1c356f9e.avif 1600w, /manus-storage/pablo-hero-archive-1920w_64ab699e.avif 1920w"),
  webp: publicMediaPath("/manus-storage/pablo-hero-archive-480w_b3b1574d.webp 480w, /manus-storage/pablo-hero-archive-768w_cd8f428d.webp 768w, /manus-storage/pablo-hero-archive-1200w_b0307ff4.webp 1200w, /manus-storage/pablo-hero-archive-1600w_d789da48.webp 1600w, /manus-storage/pablo-hero-archive-1920w_19e9d0c3.webp 1920w"),
};

const heroSignals = [
  ["cases", "2 documentados"],
  ["produção", "Observatório publicado"],
  ["qualidade", "CI multi-browser"],
] as const;

type ResponsiveSourceSet = {
  avif: string;
  webp: string;
};

type PortfolioHeroProps = {
  heroAvailable: boolean;
  markUrl: string;
  portraitUrl: string;
  portraitResponsive: ResponsiveSourceSet;
  heroCtaRef: RefObject<HTMLDivElement | null>;
};

export default function PortfolioHero({
  heroAvailable,
  markUrl,
  portraitUrl,
  portraitResponsive,
  heroCtaRef,
}: PortfolioHeroProps) {
  return (
    <section id="inicio" className="relative isolate min-h-[590px] overflow-hidden pt-[76px] min-[390px]:min-h-[620px] sm:min-h-[760px]">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-65" />
      {heroAvailable && (
        <picture className="pointer-events-none absolute inset-y-0 right-0 block w-full opacity-65 lg:w-[72%]">
          <source type="image/avif" srcSet={heroResponsive.avif} sizes="(min-width: 1024px) 72vw, 100vw" />
          <source type="image/webp" srcSet={heroResponsive.webp} sizes="(min-width: 1024px) 72vw, 100vw" />
          <img src={heroUrl} alt="" width="1920" height="1080" loading="eager" fetchPriority="high" decoding="async" className="h-full w-full object-cover object-center" />
        </picture>
      )}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-full bg-[linear-gradient(90deg,#07111f_5%,rgba(7,17,31,0.97)_31%,rgba(7,17,31,0.34)_68%,rgba(7,17,31,0.70)_100%)] lg:w-[80%]" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-[linear-gradient(0deg,#07111f,transparent)]" />
      <div className="pointer-events-none absolute right-[8%] top-[18%] hidden w-24 opacity-25 drop-shadow-[0_0_26px_rgba(56,189,248,0.55)] lg:block">
        <img src={markUrl} alt="" width="160" height="160" decoding="async" className="w-full" />
      </div>

      <div className="relative mx-auto flex min-h-[514px] max-w-[1440px] items-center px-4 py-8 min-[360px]:px-5 min-[390px]:min-h-[544px] sm:min-h-[684px] sm:px-8 sm:py-16 lg:px-12">
        <div className="relative w-full max-w-4xl">
          <div className="reveal flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a5f3fc]">
            <span className="h-px w-10 bg-[#38bdf8]" />
            Pablo Guilherme · produto digital, interface e desenvolvimento web
          </div>

          <h1 className="reveal delay-1 mt-5 max-w-4xl font-display text-[clamp(2.2rem,9.8vw,3.35rem)] font-semibold leading-[0.96] tracking-[-0.06em] text-white min-[400px]:text-[clamp(2.95rem,8.8vw,8.4rem)] sm:mt-7 sm:leading-[0.86] sm:tracking-[-0.07em]">
            Desenvolvo produtos digitais que tornam informação complexa simples de usar.
          </h1>

          <figure className="hero-portrait-card mt-4 flex max-w-sm items-center gap-3 border border-[#67e8f9]/25 bg-[#07111f]/84 p-2 lg:absolute lg:right-[-8rem] lg:top-0 lg:mt-0 lg:w-56 lg:flex-col lg:items-stretch">
            <picture>
              <source type="image/avif" srcSet={portraitResponsive.avif} sizes="(min-width: 1024px) 224px, 80px" />
              <source type="image/webp" srcSet={portraitResponsive.webp} sizes="(min-width: 1024px) 224px, 80px" />
              <img src={portraitUrl} alt="Pablo Guilherme em retrato profissional" width="720" height="900" loading="eager" fetchPriority="high" decoding="async" className="h-20 w-20 shrink-0 object-cover object-top lg:h-56 lg:w-full" />
            </picture>
            <figcaption className="min-w-0 py-1 lg:px-1 lg:pb-1">
              <span className="block font-mono text-[8px] uppercase tracking-[0.15em] text-[#67e8f9]">perfil profissional</span>
              <span className="mt-1 block truncate font-display text-lg tracking-[-0.03em] text-white">Pablo Guilherme</span>
              <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.1em] text-[#8fa8c7]">ADS · React · TypeScript · produto</span>
            </figcaption>
          </figure>

          <div className="reveal delay-2 mt-5 flex max-w-xl flex-col gap-4 sm:ml-[16.8%] sm:mt-8 sm:gap-5">
            <p className="text-balance font-body text-base leading-7 text-[#bed0ea] sm:text-lg sm:leading-8">
              Do briefing ao deploy, organizo produto, interface, código e validação para transformar uma necessidade em algo utilizável e demonstrável.
            </p>

            <dl data-hero-signals="true" className="grid grid-cols-3 gap-px overflow-hidden rounded-[12px] border border-white/[0.08] bg-white/[0.08]">
              {heroSignals.map(([label, value]) => (
                <div key={label} data-hero-signal="true" className="min-w-0 bg-[#071326]/92 px-2.5 py-3 sm:px-3">
                  <dt className="font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#67e8f9]">{label}</dt>
                  <dd className="mt-1 text-balance font-body text-[11px] leading-4 text-[#dcecf8] sm:text-xs">{value}</dd>
                </div>
              ))}
            </dl>

            <div ref={heroCtaRef} data-hero-cta="true" className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center sm:gap-3">
              <a
                href="#projetos"
                className="group inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#38bdf8] px-5 py-3.5 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[#02111f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_10px_30px_rgba(56,189,248,0.28)] active:scale-[0.97] sm:w-auto"
              >
                ver projetos <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#diagnostico"
                onClick={() => trackPortfolioEvent("quote_cta", { source: "hero" })}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-white/[0.12] px-3 py-3 text-center font-mono text-[11px] uppercase tracking-[0.13em] text-[#b7cdf1] transition-colors hover:border-[#67e8f9]/45 hover:text-white sm:w-auto"
              >
                começar diagnóstico <ArrowDownRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
