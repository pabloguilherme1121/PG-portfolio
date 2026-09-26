import { ArrowUpRight } from "lucide-react";
import { repositories, type Repository } from "@/features/portfolio/portfolioData";

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
  return (
    <>
      <div className="flex flex-col justify-between gap-6 border-b border-white/[0.1] pb-9 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">Projetos selecionados</p>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,5rem)] font-medium leading-none tracking-[-0.06em] text-white">Trabalhos que mostram processo,<br className="hidden sm:block" /> execução e resultado.</h2>
          <div className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#7795bf]"><img src={markUrl} alt="" width="20" height="20" loading="lazy" decoding="async" className="h-5 w-5 object-contain" /> PG // projetos & estudos de caso</div>
        </div>
        <div className="max-w-sm">
          <p className="font-body text-sm leading-7 text-[#b6d7eb]">O portfólio é organizado por evidências: o problema enfrentado, meu papel, as decisões tomadas e a entrega que pode ser examinada.</p>
          <div className="mt-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f8fb7] light-muted-ink"><span className="h-px w-8 bg-[#38bdf8]" /> {repositories.length} {repositories.length === 1 ? "trabalho" : "trabalhos"} com mídia + 1 produto digital publicado</div>
        </div>
      </div>

      <article id="observatorio" className="mt-8 scroll-mt-28 grid gap-6 border border-[#67e8f9]/30 bg-[#081a2e] p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">produto digital publicado · dados públicos</p>
          <h3 className="mt-3 font-display text-[clamp(1.8rem,3vw,3rem)] font-medium tracking-[-0.05em] text-white">Observatório</h3>
          <p className="mt-3 max-w-2xl font-body text-sm leading-7 text-[#bdd5e8]">O case que melhor representa meu objetivo profissional: transformar informação complexa em um produto digital utilizável. O Observatório reúne arquitetura de informação, interface responsiva, visualização de dados e publicação web em uma solução que pode ser aberta e avaliada em funcionamento.</p>
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#9fc4e8]"><span className="border border-white/10 px-2 py-1">Web</span><span className="border border-white/10 px-2 py-1">dashboard</span><span className="border border-white/10 px-2 py-1">dados públicos</span><span className="border border-white/10 px-2 py-1">produto publicado</span></div>
        </div>
        <a href={"https:" + "//pabloguilherme01.github.io/observatorio/#dashboard"} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#38bdf8] px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-colors hover:bg-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">ver produto em produção <ArrowUpRight className="h-4 w-4" /></a>
      </article>

      <div className="showroom-portrait-entry mt-8 grid gap-5 border-y border-[#67e8f9]/20 bg-[#07111f]/65 p-4 sm:grid-cols-[112px_1fr_auto] sm:items-center sm:p-5">
        <picture><source type="image/avif" srcSet={portraitResponsive.avif} sizes="112px" /><source type="image/webp" srcSet={portraitResponsive.webp} sizes="112px" /><img src={portraitUrl} alt="Retrato profissional de Pablo Guilherme no início do Showroom" width="720" height="900" loading="lazy" decoding="async" className="h-28 w-28 object-cover object-top" /></picture>
        <div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#67e8f9]">perfil profissional</p><p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#c4d9ee]">O eixo principal é desenvolvimento de produtos digitais. Conteúdo e audiovisual aparecem como competências complementares quando ajudam a explicar, demonstrar ou apresentar melhor uma solução.</p></div>
        <a href="#sobre" className="inline-flex min-h-11 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#b7cdf1] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">sobre mim <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
      </div>

      <section aria-labelledby="trabalhos-destaque-title" className="mt-8 border-y border-[#3b82f6]/25 bg-[#06172f]/55 py-6 sm:py-8">
        <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#60a5fa]">destaques</p>
            <h3 id="trabalhos-destaque-title" className="mt-2 font-display text-[clamp(1.7rem,3vw,2.8rem)] font-medium leading-none tracking-[-0.05em] text-white">Projetos em destaque.</h3>
          </div>
          <p className="max-w-sm font-body text-sm leading-6 text-[#b6d7eb]">Projetos selecionados para mostrar o que foi feito, por que as decisões foram tomadas e qual valor cada entrega demonstra.</p>
        </div>
        <div className="mt-6 grid gap-px bg-[#3b82f6]/15 sm:grid-cols-2 xl:grid-cols-4" aria-busy={!featuredCardsReady}>
          <div role="status" aria-live="polite" className="sr-only">{featuredCardsReady ? `${featuredRepositories.length} projetos destacados disponíveis para abrir detalhes.` : "Carregando projetos destacados."}</div>
          {featuredCardsReady ? featuredRepositories.map((project) => (
            <article key={`featured-${project.id}`} data-featured-project={project.id} role="button" tabIndex={0} aria-labelledby={`featured-title-${project.id}`} onClick={() => openProjectDetails(project)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openProjectDetails(project); } }} className="featured-project-card group cursor-pointer bg-[#07111f] p-4 text-left outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[#60a5fa] focus-visible:ring-inset sm:p-5">
              {project.cover && <img src={project.cover} alt={`Miniatura de ${project.name}`} width="720" height="480" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover opacity-80 transition-[transform,opacity] duration-200 ease-out group-hover:scale-[1.04] group-hover:opacity-100 motion-reduce:transition-none" />}
              <div className="mt-4 flex items-center justify-between gap-3">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#60a5fa]">{project.id}</p>
                <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#7894bb]">{project.kind === "video" ? "vídeo" : "repositório"}</span>
              </div>
              <h4 id={`featured-title-${project.id}`} className="mt-2 break-words font-display text-xl font-medium leading-tight tracking-[-0.035em] text-white">{project.name}</h4>
              <dl className="mt-4 grid gap-3 text-sm leading-5">
                <div><dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#60a5fa]">papel</dt><dd className="mt-1 text-[#c4d9ee]">{project.role}</dd></div>
                <div><dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#60a5fa]">processo</dt><dd className="mt-1 text-[#c4d9ee]">{project.process}</dd></div>
                <div><dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#60a5fa]">resultado</dt><dd className="mt-1 text-[#c4d9ee]">{project.result}</dd></div>
              </dl>
              <span className="mt-5 inline-flex font-mono text-[9px] uppercase tracking-[0.12em] text-[#8db8ff] transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">abrir detalhes <ArrowUpRight className="ml-2 h-3.5 w-3.5" aria-hidden="true" /></span>
            </article>
          )) : Array.from({ length: 4 }).map((_, index) => (
            <div key={`featured-skeleton-${index}`} aria-hidden="true" className="featured-project-card min-h-[430px] animate-pulse bg-[#0a1422] p-4 sm:p-5 motion-reduce:animate-none">
              <div className="aspect-[16/10] w-full bg-[#163354]" />
              <div className="mt-5 space-y-3"><div className="h-2 w-16 bg-[#294568]" /><div className="h-7 w-4/5 bg-[#294568]" /><div className="h-3 w-full bg-[#1c3454]" /><div className="h-3 w-2/3 bg-[#1c3454]" /></div>
              <div className="mt-6 space-y-3"><div className="h-2 w-12 bg-[#294568]" /><div className="h-3 w-full bg-[#1c3454]" /><div className="h-2 w-16 bg-[#294568]" /><div className="h-3 w-4/5 bg-[#1c3454]" /></div>
            </div>
          ))}
        </div>
      </section>

    </>
  );
}
