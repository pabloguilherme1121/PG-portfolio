import { ArrowUpRight } from "lucide-react";
import type { Repository } from "@/features/portfolio/portfolioData";

type PortfolioProjectsOverviewProps = {
  markUrl: string;
  featuredCardsReady: boolean;
  featuredRepositories: Repository[];
  openProjectDetails: (project: Repository) => void;
};

export default function PortfolioProjectsOverview({
  markUrl,
  featuredCardsReady,
  featuredRepositories,
  openProjectDetails,
}: PortfolioProjectsOverviewProps) {
  return (
    <>
      <div className="flex flex-col justify-between gap-6 border-b border-white/[0.1] pb-9 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">Projetos selecionados</p>
          <h2 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,5rem)] font-medium leading-none tracking-[-0.06em] text-white">
            Trabalhos que mostram processo,<br className="hidden sm:block" /> execução e resultado.
          </h2>
          <div className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#7795bf]">
            <img src={markUrl} alt="" width="20" height="20" loading="lazy" decoding="async" className="h-5 w-5 object-contain" />
            PG // projetos & estudos de caso
          </div>
        </div>
        <p className="max-w-sm font-body text-sm leading-7 text-[#b6d7eb]">
          Uma seleção curada de entregas digitais e audiovisuais, com contexto suficiente para avaliar como cada trabalho foi conduzido.
        </p>
      </div>

      <article className="mt-8 grid gap-6 border border-[#67e8f9]/30 bg-[#081a2e] p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">projeto web publicado</p>
          <h3 className="mt-3 font-display text-[clamp(1.8rem,3vw,3rem)] font-medium tracking-[-0.05em] text-white">Observatório</h3>
          <p className="mt-3 max-w-2xl font-body text-sm leading-7 text-[#bdd5e8]">
            Projeto em produção que demonstra desenvolvimento front-end, organização de interface e entrega real na web.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#9fc4e8]">
            <span className="border border-white/10 px-2 py-1">React</span>
            <span className="border border-white/10 px-2 py-1">interface</span>
            <span className="border border-white/10 px-2 py-1">produção</span>
          </div>
        </div>
        <a
          href="https://pabloguilherme01.github.io/observatorio/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#38bdf8] px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-colors hover:bg-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
        >
          visitar site <ArrowUpRight className="h-4 w-4" />
        </a>
      </article>

      <section className="mt-10" aria-labelledby="trabalhos-destaque-title">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#60a5fa]">destaques</p>
            <h3 id="trabalhos-destaque-title" className="mt-2 font-display text-[clamp(1.7rem,3vw,2.8rem)] font-medium leading-none tracking-[-0.05em] text-white">
              Projetos em destaque.
            </h3>
          </div>
          <p className="max-w-sm font-body text-sm leading-6 text-[#b6d7eb]">
            Abra um projeto para ver papel, processo, resultado e decisões de execução.
          </p>
        </div>

        <div className="mt-6 grid gap-px bg-[#3b82f6]/15 sm:grid-cols-3" aria-busy={!featuredCardsReady}>
          <div role="status" aria-live="polite" className="sr-only">
            {featuredCardsReady ? `${featuredRepositories.length} projetos destacados disponíveis.` : "Carregando projetos destacados."}
          </div>

          {featuredCardsReady
            ? featuredRepositories.map((project) => (
                <article
                  key={project.id}
                  data-featured-project={project.id}
                  role="button"
                  tabIndex={0}
                  aria-labelledby={`featured-title-${project.id}`}
                  onClick={() => openProjectDetails(project)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openProjectDetails(project);
                    }
                  }}
                  className="featured-project-card group cursor-pointer bg-[#07111f] p-4 text-left outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[#60a5fa] focus-visible:ring-inset sm:p-5"
                >
                  {project.cover && (
                    <img
                      src={project.cover}
                      alt={`Miniatura de ${project.name}`}
                      width="720"
                      height="480"
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/10] w-full object-cover opacity-80 transition-[transform,opacity] duration-200 ease-out group-hover:scale-[1.03] group-hover:opacity-100 motion-reduce:transition-none"
                    />
                  )}
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#60a5fa]">{project.id}</p>
                    <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#7894bb]">
                      {project.kind === "video" ? "vídeo" : "projeto"}
                    </span>
                  </div>
                  <h4 id={`featured-title-${project.id}`} className="mt-2 break-words font-display text-xl font-medium leading-tight tracking-[-0.035em] text-white">
                    {project.name}
                  </h4>
                  <p className="mt-3 font-body text-sm leading-6 text-[#c4d9ee]">{project.description}</p>
                  <span className="mt-5 inline-flex font-mono text-[9px] uppercase tracking-[0.12em] text-[#8db8ff] transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">
                    ver detalhes <ArrowUpRight className="ml-2 h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                </article>
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <div key={index} aria-hidden="true" className="featured-project-card min-h-[340px] animate-pulse bg-[#0a1422] p-4 sm:p-5 motion-reduce:animate-none">
                  <div className="aspect-[16/10] w-full bg-[#163354]" />
                  <div className="mt-5 space-y-3">
                    <div className="h-2 w-16 bg-[#294568]" />
                    <div className="h-7 w-4/5 bg-[#294568]" />
                    <div className="h-3 w-full bg-[#1c3454]" />
                    <div className="h-3 w-2/3 bg-[#1c3454]" />
                  </div>
                </div>
              ))}
        </div>
      </section>
    </>
  );
}
