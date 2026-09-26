import { ArrowUpRight, Github, Play } from "lucide-react";
import type { Repository } from "@/features/portfolio/portfolioData";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";

type PortfolioFeaturedProjectCardProps = {
  project: Repository;
  onOpenDetails: (project: Repository) => void;
};

export default function PortfolioFeaturedProjectCard({
  project,
  onOpenDetails,
}: PortfolioFeaturedProjectCardProps) {
  const EvidenceIcon = project.evidence.type === "code" ? Github : Play;

  return (
    <article
      data-featured-project={project.id}
      className="featured-project-card group flex min-h-full flex-col bg-[#07111f] p-4 text-left sm:p-5"
      aria-labelledby={`featured-title-${project.id}`}
    >
      {project.cover ? (
        <img
          src={project.cover}
          alt={`Miniatura de ${project.name}`}
          width="720"
          height="480"
          loading="lazy"
          decoding="async"
          className="aspect-[16/10] w-full object-cover opacity-85 transition-[transform,opacity] duration-200 ease-out group-hover:scale-[1.025] group-hover:opacity-100 motion-reduce:transition-none"
        />
      ) : (
        <div className="grid aspect-[16/10] place-items-center border border-[#67e8f9]/15 bg-[linear-gradient(135deg,#081a2e,#06111f)] text-center">
          <div>
            <Github className="mx-auto h-8 w-8 text-[#67e8f9]" aria-hidden="true" />
            <span className="mt-3 block font-mono text-[9px] uppercase tracking-[0.14em] text-[#93c5d8]">
              código público · produto em evolução
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#60a5fa]">{project.id}</p>
        <span
          data-project-status="true"
          className="border border-[#67e8f9]/25 bg-[#0b2746]/55 px-2 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.11em] text-[#bdf7ff]"
        >
          {project.status}
        </span>
      </div>

      <h4
        id={`featured-title-${project.id}`}
        className="mt-3 break-words font-display text-[clamp(1.35rem,2vw,1.8rem)] font-medium leading-tight tracking-[-0.04em] text-white"
      >
        {project.name}
      </h4>

      <p className="mt-3 font-body text-sm leading-6 text-[#9fb9cf]">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.slice(0, 4).map((technology) => (
          <span
            key={technology}
            className="border border-white/[0.09] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.09em] text-[#87a7c7]"
          >
            {technology}
          </span>
        ))}
      </div>

      <dl className="mt-5 grid gap-4 border-t border-white/[0.08] pt-4 sm:grid-cols-2">
        <div>
          <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#60a5fa]">papel</dt>
          <dd className="mt-1 font-body text-xs leading-5 text-[#c4d9ee]">{project.role}</dd>
        </div>
        <div>
          <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#60a5fa]">prova demonstrada</dt>
          <dd className="mt-1 font-body text-xs leading-5 text-[#c4d9ee]">{project.result}</dd>
        </div>
      </dl>

      <div className="mt-auto grid gap-2 pt-6 sm:grid-cols-2">
        <a
          data-featured-evidence="true"
          href={project.evidence.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir prova · ${project.evidence.label} · ${project.name}`}
          onClick={() =>
            trackPortfolioEvent("featured_project_evidence_opened", {
              projectId: project.id,
              evidenceType: project.evidence.type,
            })
          }
          className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#38bdf8] px-4 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#02111f] transition-colors hover:bg-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
        >
          <EvidenceIcon className="h-4 w-4" aria-hidden="true" />
          abrir prova · {project.evidence.label}
        </a>

        <button
          type="button"
          aria-label={`Ver detalhes de ${project.name}`}
          onClick={() => onOpenDetails(project)}
          className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#67e8f9]/30 px-4 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#d8f7ff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
        >
          ver detalhes
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
