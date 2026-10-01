import { ArrowUpRight, Github } from "lucide-react";
import type { Repository } from "@/features/portfolio/portfolioData";
import PortfolioFeaturedProjectCard from "@/features/portfolio/components/PortfolioFeaturedProjectCard";
import { useHorizontalSnapNavigation } from "@/features/portfolio/hooks/useHorizontalSnapNavigation";
import { useState } from "react";

const observatorioInsights = [
  { label: "Problema", text: "População e eleitorado vêm de fontes e datas diferentes. Sem contexto, é fácil comparar números que medem coisas distintas." },
  { label: "Solução", text: "A leitura rápida mostra cinco indicadores com data de referência e caminho até a fonte; a mesma informação se reorganiza no celular." },
  { label: "Prova", text: "No produto publicado, cada cartão permite conferir a origem. O repositório público mostra como a experiência foi construída." },
] as const;

type ResponsiveSourceSet = {
  avif: string;
  webp: string;
};

type PortfolioProjectsOverviewProps = {
  markUrl: string;
  portraitUrl: string;
  portraitResponsive: ResponsiveSourceSet;
  featuredCardsReady: boolean;
  featuredRepositories: Repository[];
  openProjectDetails: (project: Repository) => void;
};

export default function PortfolioProjectsOverview({
  markUrl,
  portraitUrl,
  portraitResponsive,
  featuredCardsReady,
  featuredRepositories,
  openProjectDetails,
}: PortfolioProjectsOverviewProps) {
  const [activeInsight, setActiveInsight] = useState<(typeof observatorioInsights)[number]["label"]>("Problema");
  const [captureFormat, setCaptureFormat] = useState<"desktop" | "mobile">(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches ? "mobile" : "desktop",
  );
  const featuredCount = featuredCardsReady ? featuredRepositories.length : 0;
  const hasMultipleFeaturedProjects = featuredRepositories.length > 1;
  const {
    activeIndex: activeFeaturedIndex,
    containerRef: featuredStripRef,
    scrollToIndex: scrollToFeaturedIndex,
  } = useHorizontalSnapNavigation({
    itemSelector: "[data-featured-project]",
    itemCount: featuredCount,
  });

  return (
    <>
      <div className="flex flex-col justify-between gap-5 border-b border-white/[0.1] pb-7 sm:gap-6 sm:pb-9 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">Projetos selecionados</p>
          <h2 className="mt-4 font-display text-[clamp(2.1rem,10vw,5rem)] font-medium leading-[0.95] tracking-[-0.055em] sm:leading-none sm:tracking-[-0.06em] text-white">Provas de trabalho, não apenas peças.<br className="hidden sm:block" /> Processo, decisões e entrega.</h2>
          <div className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#7795bf]"><img src={markUrl} alt="" width="20" height="20" loading="lazy" decoding="async" className="h-5 w-5 object-contain" /> PG // projetos & estudos de caso</div>
        </div>
        <div className="max-w-sm">
          <p className="font-body text-sm leading-7 text-[#b6d7eb]">Cada case mostra o que precisava ser resolvido, como a solução foi construída e o que pode ser examinado funcionando.</p>
          <div className="mt-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f8fb7] light-muted-ink"><span className="h-px w-8 bg-[#38bdf8]" /> 1 produto em produção · 1 produto full-stack em evolução</div>
        </div>
      </div>

      <article id="observatorio" className="mt-7 scroll-mt-28 grid min-w-0 gap-6 overflow-hidden border border-[#67e8f9]/30 bg-[#081a2e] p-4 min-[360px]:p-5 sm:mt-8 sm:p-7 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-8">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">case principal · produto em produção</p>
          <h3 className="mt-3 font-display text-[clamp(1.8rem,3vw,3rem)] font-medium tracking-[-0.05em] text-white">Observatório</h3>
          <p className="mt-3 max-w-2xl font-body text-sm leading-7 text-[#bdd5e8]">Indicadores de Águas Lindas de Goiás em uma leitura clara: números com data, contexto e acesso à fonte. Da arquitetura da informação à publicação, a interface ajuda a comparar dados sem perder sua origem.</p>
          <div className="mt-5" aria-label="Leitura guiada do case Observatório">
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Etapas do case">
              {observatorioInsights.map(({ label }) => (
                <button key={label} type="button" aria-pressed={activeInsight === label} onClick={() => setActiveInsight(label)} className="min-h-11 min-w-0 border border-[#67e8f9]/30 px-2 font-mono text-[10px] font-semibold uppercase text-[#bdf7ff] transition-colors hover:bg-[#0b2746] aria-pressed:bg-[#38bdf8] aria-pressed:text-[#02111f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
                  {label}
                </button>
              ))}
            </div>
            <p data-observatorio-insight="true" role="status" className="mt-3 min-h-16 border-l-2 border-[#67e8f9] bg-[#071326] px-3 py-3 font-body text-sm leading-6 text-[#d8eaff]">
              {observatorioInsights.find(({ label }) => label === activeInsight)?.text}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#9fc4e8]">
            <span className="border border-white/10 px-2 py-1">React</span>
            <span className="border border-white/10 px-2 py-1">TypeScript</span>
            <span className="border border-white/10 px-2 py-1">PWA</span>
            <span className="border border-white/10 px-2 py-1">Playwright</span>
            <span className="border border-white/10 px-2 py-1">GitHub Pages</span>
          </div>
        </div>
        <figure className="min-w-0 self-center">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">dentro do produto</p>
              <p className="mt-1 font-body text-xs text-[#bdd5e8]">A mesma leitura de dados em duas telas.</p>
            </div>
            <div role="group" aria-label="Formato da captura do Observatório" className="flex gap-1 border border-[#67e8f9]/25 p-1">
              {(["desktop", "mobile"] as const).map((format) => (
                <button
                  key={format}
                  type="button"
                  aria-pressed={captureFormat === format}
                  onClick={() => setCaptureFormat(format)}
                  className="min-h-11 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#bdf7ff] transition-colors hover:bg-[#0b2746] aria-pressed:bg-[#38bdf8] aria-pressed:text-[#02111f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
                >
                  {format === "desktop" ? "Desktop" : "Mobile"}
                </button>
              ))}
            </div>
          </div>
          <div className="grid min-h-[330px] min-w-0 place-items-center overflow-hidden border border-[#67e8f9]/25 bg-[#04101f] p-3 sm:min-h-[390px] sm:p-5">
            <div className={`min-w-0 overflow-hidden border border-[#c9e5f2]/30 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${captureFormat === "mobile" ? "w-[min(100%,292px)] rounded-[22px] p-[6px]" : "w-full rounded-xl p-1.5"}`}>
              <div aria-hidden="true" className="flex h-6 items-center gap-1.5 border-b border-[#d6e6ef] bg-[#f4f8fb] px-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#ff8b83]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#ffd277]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#82d9ad]" />
                <span className="ml-2 truncate font-mono text-[8px] text-[#456178]">observatorio · indicadores</span>
              </div>
              <img
                data-observatorio-capture="true"
                src={`${import.meta.env.BASE_URL}portfolio-media/observatorio-dashboard-${captureFormat}.png`}
                alt={captureFormat === "mobile"
                  ? "Captura mobile do Observatório com leitura rápida e indicadores apresentados em cartões verticais."
                  : "Captura desktop do Observatório com cinco indicadores, datas de referência e links para as fontes."}
                width={captureFormat === "mobile" ? 351 : 1376}
                height={captureFormat === "mobile" ? 510 : 530}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full"
              />
            </div>
          </div>
          <figcaption className="mt-3 max-w-xl font-body text-[11px] leading-5 text-[#9fc4d8]">
            Captura da interface publicada em setembro de 2026. Os números podem mudar; consulte o produto para dados e fontes atuais.
          </figcaption>
        </figure>
        <div className="flex flex-col gap-2 sm:flex-row lg:col-span-2 lg:justify-end">
          <a href={"https:" + "//pabloguilherme01.github.io/observatorio/#dashboard"} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#38bdf8] px-4 min-[360px]:px-5 sm:w-auto font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-colors hover:bg-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">ver produto em produção <ArrowUpRight className="h-4 w-4" /></a>
          <a href="https://github.com/Pabloguilherme01/observatorio" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 w-full items-center justify-center gap-2 border border-[#67e8f9]/35 px-4 min-[360px]:px-5 sm:w-auto font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#d8f7ff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Github className="h-4 w-4" aria-hidden="true" /> ver código-fonte</a>
        </div>
      </article>

      <div className="showroom-portrait-entry mt-7 grid gap-4 sm:mt-8 sm:gap-5 border-y border-[#67e8f9]/20 bg-[#07111f]/65 p-4 sm:grid-cols-[112px_1fr_auto] sm:items-center sm:p-5">
        <picture><source type="image/avif" srcSet={portraitResponsive.avif} sizes="112px" /><source type="image/webp" srcSet={portraitResponsive.webp} sizes="112px" /><img src={portraitUrl} alt="Retrato profissional de Pablo Guilherme no início do Showroom" width="720" height="900" loading="lazy" decoding="async" className="h-28 w-28 object-cover object-top" /></picture>
        <div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#67e8f9]">perfil profissional</p><p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#c4d9ee]">O eixo principal é transformar problemas de informação e uso em produtos digitais claros, responsivos, testáveis e fáceis de avaliar.</p></div>
        <a href="#sobre" className="inline-flex min-h-11 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#b7cdf1] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">sobre mim <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
      </div>

      <section aria-labelledby="trabalhos-destaque-title" className="mt-7 border-y border-[#3b82f6]/25 sm:mt-8 bg-[#06172f]/55 py-6 sm:py-8">
        <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#60a5fa]">destaques</p>
            <h3 id="trabalhos-destaque-title" className="mt-2 font-display text-[clamp(1.7rem,3vw,2.8rem)] font-medium leading-none tracking-[-0.05em] text-white">Projetos em destaque.</h3>
          </div>
          <p className="max-w-sm font-body text-sm leading-6 text-[#b6d7eb]">Projetos selecionados para mostrar o que foi feito, por que as decisões foram tomadas e qual valor cada entrega demonstra.</p>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 px-4 sm:hidden">
          <p data-featured-swipe-hint="true" className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#8fb6c9]">
            {hasMultipleFeaturedProjects ? "deslize ou toque para comparar" : "toque para ver detalhes"}
          </p>
          {featuredCardsReady && hasMultipleFeaturedProjects && (
            <span data-featured-active-label="true" className="shrink-0 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#d9fbff]">
              {activeFeaturedIndex + 1} / {featuredCount}
            </span>
          )}
        </div>
        <div
          ref={featuredStripRef}
          data-featured-project-strip="true"
          aria-label={hasMultipleFeaturedProjects ? "Projetos em destaque — deslize horizontalmente no celular" : "Projeto em destaque"}
          className="featured-project-showcase mt-3 bg-[#3b82f6]/15 sm:mt-6"
          aria-busy={!featuredCardsReady}
        >
          <div role="status" aria-live="polite" className="sr-only">
            {featuredCardsReady
              ? featuredRepositories.length === 1
                ? "1 projeto destacado com prova direta e detalhes disponíveis."
                : `${featuredRepositories.length} projetos destacados com prova direta e detalhes disponíveis.`
              : "Carregando projetos destacados."}
          </div>
          {featuredCardsReady
            ? featuredRepositories.map((project) => (
                <PortfolioFeaturedProjectCard
                  key={`featured-${project.id}`}
                  project={project}
                  onOpenDetails={openProjectDetails}
                />
              ))
            : Array.from({ length: Math.max(1, featuredRepositories.length) }).map((_, index) => (
                <div
                  key={`featured-skeleton-${index}`}
                  aria-hidden="true"
                  className="featured-project-card min-h-[430px] animate-pulse bg-[#0a1422] p-4 sm:p-5 motion-reduce:animate-none"
                >
                  <div className="aspect-[16/10] w-full bg-[#163354]" />
                  <div className="mt-5 space-y-3">
                    <div className="h-2 w-16 bg-[#294568]" />
                    <div className="h-7 w-4/5 bg-[#294568]" />
                    <div className="h-3 w-full bg-[#1c3454]" />
                    <div className="h-3 w-2/3 bg-[#1c3454]" />
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="h-2 w-12 bg-[#294568]" />
                    <div className="h-3 w-full bg-[#1c3454]" />
                    <div className="h-2 w-16 bg-[#294568]" />
                    <div className="h-3 w-4/5 bg-[#1c3454]" />
                  </div>
                </div>
              ))}
        </div>
        {featuredCardsReady && hasMultipleFeaturedProjects && (
          <div
            data-featured-pagination="true"
            className="mobile-snap-pagination px-4 sm:hidden"
            role="group"
            aria-label="Navegar entre projetos em destaque"
          >
            {featuredRepositories.map((project, index) => (
              <button
                key={`featured-page-${project.id}`}
                type="button"
                aria-label={`Ir para projeto ${index + 1}: ${project.name}`}
                aria-current={activeFeaturedIndex === index ? "true" : undefined}
                onClick={() => scrollToFeaturedIndex(index)}
                className="mobile-snap-page"
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </section>

    </>
  );
}
