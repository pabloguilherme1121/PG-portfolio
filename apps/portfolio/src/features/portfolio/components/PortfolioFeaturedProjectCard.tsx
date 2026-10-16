import { ArrowUpRight, Github, Play } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { Repository } from "@/features/portfolio/portfolioData";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import TrajetoFlowPreview from "./TrajetoFlowPreview";

type PortfolioFeaturedProjectCardProps = {
  project: Repository;
  onOpenDetails: (project: Repository) => void;
  singleProject?: boolean;
};

export default function PortfolioFeaturedProjectCard({
  project,
  onOpenDetails,
  singleProject = false,
}: PortfolioFeaturedProjectCardProps) {
  const EvidenceIcon = project.evidence.type === "code" ? Github : Play;
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewButton = useRef<HTMLButtonElement>(null);
  const [quickReading, setQuickReading] = useState<
    "Objetivo" | "Decisões" | "Resultado"
  >("Objetivo");
  const readingText =
    quickReading === "Objetivo"
      ? (project.caseStudy?.objective ?? project.description)
      : quickReading === "Decisões"
        ? (project.caseStudy?.decisions ?? project.process)
        : project.result;

  function handlePreviewKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") {
      setPreviewOpen(false);
      event.stopPropagation();
      previewButton.current?.focus();
    }
  }

  function updatePointerFeedback(event: PointerEvent<HTMLElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--project-x",
      `${event.clientX - bounds.left}px`
    );
    event.currentTarget.style.setProperty(
      "--project-y",
      `${event.clientY - bounds.top}px`
    );
  }

  return (
    <article
      data-featured-project={project.id}
      data-project-interaction="spotlight"
      data-project-layout={singleProject ? "single" : undefined}
      onPointerDown={updatePointerFeedback}
      onPointerMove={event => {
        if (event.pointerType !== "touch") updatePointerFeedback(event);
      }}
      className="featured-project-card group flex min-h-full flex-col bg-[#07111f] p-4 text-left sm:p-5"
      aria-labelledby={`featured-title-${project.id}`}
    >
      <div className="featured-project-visual">
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
        ) : project.id === "TEC.09" ? (
          <TrajetoFlowPreview />
        ) : (
          <div className="grid aspect-[16/10] place-items-center border border-[#67e8f9]/15 bg-[linear-gradient(135deg,#081a2e,#06111f)] text-center">
            <div>
              <Github
                className="mx-auto h-8 w-8 text-[#67e8f9]"
                aria-hidden="true"
              />
              <span className="mt-3 block font-mono text-[9px] uppercase tracking-[0.14em] text-[#93c5d8]">
                código público · produto em evolução
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="featured-project-copy flex min-w-0 flex-col">
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#60a5fa]">
            {project.id}
          </p>
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

        <p className="mt-3 font-body text-sm leading-6 text-[#9fb9cf]">
          {project.description}
        </p>

        <button
          ref={previewButton}
          type="button"
          aria-expanded={previewOpen}
          aria-controls={`featured-preview-${project.id}`}
          onClick={() => setPreviewOpen(open => !open)}
          onKeyDown={handlePreviewKeyDown}
          className="mt-4 inline-flex min-h-11 items-center self-start border-b border-[#67e8f9]/50 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#bdf7ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
        >
          {previewOpen ? "fechar prévia rápida" : "prévia rápida"}
        </button>
        {previewOpen && (
          <div
            id={`featured-preview-${project.id}`}
            role="region"
            aria-label={`Prévia do projeto ${project.name}`}
            onKeyDown={handlePreviewKeyDown}
            className="mt-2 border-l-2 border-[#67e8f9] bg-[#0b2746]/60 p-3"
          >
            <div
              role="group"
              aria-label={`Leitura rápida de ${project.name}`}
              className="project-quick-reading text-[#bdf7ff]"
            >
              {(["Objetivo", "Decisões", "Resultado"] as const).map(reading => (
                <button
                  key={reading}
                  type="button"
                  aria-pressed={quickReading === reading}
                  aria-controls={`featured-reading-${project.id}`}
                  onClick={() => setQuickReading(reading)}
                >
                  {reading}
                </button>
              ))}
            </div>
            <p
              id={`featured-reading-${project.id}`}
              role="status"
              className="mt-2 font-body text-sm leading-6 text-[#d8eaff]"
            >
              {readingText}
            </p>
            <a
              href={project.evidence.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-11 items-center gap-2 font-mono text-[10px] font-semibold uppercase text-[#a5f3fc] underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
            >
              examinar prova{" "}
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map(technology => (
            <span
              key={technology}
              className="border border-white/[0.09] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.07em] text-[#a9c5df]"
            >
              {technology}
            </span>
          ))}
        </div>

        <dl className="mt-5 grid gap-4 border-t border-white/[0.08] pt-4 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#60a5fa]">
              papel
            </dt>
            <dd className="mt-1 font-body text-sm leading-6 text-[#c4d9ee]">
              {project.role}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#60a5fa]">
              prova demonstrada
            </dt>
            <dd className="mt-1 font-body text-sm leading-6 text-[#c4d9ee]">
              {project.result}
            </dd>
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
            className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#38bdf8] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.07em] text-[#02111f] transition-colors hover:bg-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
          >
            <EvidenceIcon className="h-4 w-4" aria-hidden="true" />
            abrir prova · {project.evidence.label}
          </a>

          <button
            type="button"
            aria-label={`Ver detalhes de ${project.name}`}
            onClick={() => onOpenDetails(project)}
            className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#67e8f9]/30 px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.07em] text-[#d8f7ff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
          >
            ver detalhes
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
