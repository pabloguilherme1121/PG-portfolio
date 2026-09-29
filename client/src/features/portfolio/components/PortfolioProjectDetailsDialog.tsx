import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Repository } from "@/features/portfolio/portfolioData";
import { ArrowUpRight, ChevronLeft, ChevronRight, Copy, Heart, Share2 } from "lucide-react";
import type { MouseEvent, TouchEvent } from "react";

type ProjectDetailsTransition = "next" | "previous" | null;
type ProjectShareStatus = "idle" | "copied" | "error";

type PortfolioProjectDetailsDialogProps = {
  project: Repository;
  loading: boolean;
  transition: ProjectDetailsTransition;
  showSwipeHint: boolean;
  isFavorite: boolean;
  shareStatus: ProjectShareStatus;
  copyStatus: ProjectShareStatus;
  previousProject?: Repository;
  nextProject?: Repository;
  projectIndex: number;
  projectCount: number;
  onOpenChange: (open: boolean) => void;
  onTouchStart: (event: TouchEvent<HTMLElement>) => void;
  onTouchEnd: (event: TouchEvent<HTMLElement>) => void;
  onToggleFavorite: (event: MouseEvent<HTMLElement>) => void;
  onShare: () => void;
  onCopyLink: () => void;
  onNavigate: (direction: "previous" | "next") => void;
};

export default function PortfolioProjectDetailsDialog({
  project,
  loading,
  transition,
  showSwipeHint,
  isFavorite,
  shareStatus,
  copyStatus,
  previousProject,
  nextProject,
  projectIndex,
  projectCount,
  onOpenChange,
  onTouchStart,
  onTouchEnd,
  onToggleFavorite,
  onShare,
  onCopyLink,
  onNavigate,
}: PortfolioProjectDetailsDialogProps) {
  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent
        data-project-details-dialog="true"
        data-project-details-transition={transition ?? "idle"}
        aria-modal="true"
        aria-busy={loading}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`touch-pan-y w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-3xl h-[calc(100svh-1rem)] min-h-0 max-h-[calc(100svh-1rem)] overflow-x-hidden overflow-y-auto overscroll-contain border-[#3b82f6]/30 bg-[#071326] p-0 text-[#e6f2ff] shadow-[0_24px_90px_rgba(0,0,0,0.6)] transition-[opacity,transform] duration-260 motion-reduce:transition-none ${transition === "next" ? "translate-x-1 opacity-90" : transition === "previous" ? "-translate-x-1 opacity-90" : "translate-x-0 opacity-100"}`}
      >
        {loading && (
          <div data-project-details-loading="true" role="status" aria-live="polite" className="pointer-events-none absolute inset-x-0 top-0 z-20 grid gap-3 border-b border-[#67e8f9]/20 bg-[#071326]/90 p-4 backdrop-blur-sm sm:p-8">
            <div className="h-2 w-28 animate-pulse bg-[#3b82f6]/35" />
            <div className="h-9 w-4/5 animate-pulse bg-white/10" />
            <div className="h-3 w-full animate-pulse bg-white/10" />
            <div className="h-3 w-2/3 animate-pulse bg-white/10" />
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9fc6e9]">carregando projeto…</span>
          </div>
        )}

        {showSwipeHint && (
          <div data-project-swipe-hint="true" className="pointer-events-none absolute inset-x-4 top-4 z-30 flex justify-center sm:hidden" role="status" aria-live="polite">
            <span className="border border-[#67e8f9]/35 bg-[#06172f]/95 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff] shadow-[0_10px_28px_rgba(0,0,0,0.3)]">deslize para navegar</span>
          </div>
        )}

        {project.cover && (
          <img
            src={project.cover}
            alt={`Imagem do projeto ${project.name}`}
            width="1200"
            height="800"
            className="max-h-[38svh] w-full max-w-full object-cover sm:max-h-[42svh]"
          />
        )}

        <div className="min-h-0 min-w-0 overflow-x-hidden p-4 sm:p-8">
          <DialogHeader className="min-w-0 text-left">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#60a5fa]">projeto em destaque</p>
            <DialogTitle className="mt-2 break-words font-display text-3xl font-medium tracking-[-0.05em] text-white [overflow-wrap:anywhere]">{project.name}</DialogTitle>
            <DialogDescription className="mt-3 max-w-2xl break-words font-body text-sm leading-6 text-[#c4d9ee] [overflow-wrap:anywhere]">{project.description}</DialogDescription>

            <div className="mt-5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
              <button
                type="button"
                data-project-modal-favorite="true"
                onClick={onToggleFavorite}
                aria-pressed={isFavorite}
                aria-label={isFavorite ? `Remover ${project.name} dos projetos salvos` : `Salvar ${project.name} nos projetos favoritos`}
                className={`inline-flex min-h-11 items-center gap-2 self-start border px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97] ${isFavorite ? "border-[#67e8f9] bg-[#0b3156] text-[#e5fbff]" : "border-[#3b82f6]/35 text-[#cfe3ff] hover:border-[#70a6ff] hover:text-white"}`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} aria-hidden="true" />
                {isFavorite ? "salvo nos favoritos" : "salvar nos favoritos"}
              </button>

              <button type="button" data-project-modal-share="true" onClick={onShare} aria-label={`Copiar link direto de ${project.name}`} className="inline-flex min-h-11 items-center gap-2 border border-[#3b82f6]/35 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#70a6ff] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                {shareStatus === "copied" ? "link copiado" : shareStatus === "error" ? "tentar novamente" : "compartilhar projeto"}
              </button>

              <button type="button" data-project-modal-copy-link="true" onClick={onCopyLink} aria-label={`Copiar link de ${project.name}`} className="inline-flex min-h-11 items-center gap-2 border border-[#67e8f9]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]">
                <Copy className="h-4 w-4" aria-hidden="true" />
                {copyStatus === "copied" ? "link copiado" : copyStatus === "error" ? "tentar novamente" : "copiar link"}
              </button>

              <a href={project.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-[#67e8f9]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                abrir projeto
              </a>

              <span data-project-modal-share-status="true" role="status" aria-live="polite" className="sr-only">
                {shareStatus === "copied" || copyStatus === "copied"
                  ? "Link direto do projeto copiado."
                  : shareStatus === "error" || copyStatus === "error"
                    ? "Não foi possível copiar o link direto do projeto."
                    : ""}
              </span>
            </div>
          </DialogHeader>

          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            <div><p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#60a5fa]">papel</p><p className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{project.role || "Informação não registrada."}</p></div>
            <div><p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#60a5fa]">processo</p><p className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{project.process || "Informação não registrada."}</p></div>
            <div><p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#60a5fa]">resultado</p><p className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{project.result || "Informação não registrada."}</p></div>
          </div>

          {project.caseStudy && (
            <section data-project-case-study="true" className="mt-7 border-t border-white/10 pt-5" aria-labelledby="project-case-study-title">
              <p id="project-case-study-title" className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#60a5fa]">leitura do caso</p>
              <dl className="mt-4 grid gap-5 sm:grid-cols-2">
                {[
                  ["contexto", project.caseStudy.context],
                  ["problema", project.caseStudy.problem],
                  ["objetivo", project.caseStudy.objective],
                  ["minha função", project.caseStudy.function],
                  ["processo", project.caseStudy.process],
                  ["decisões", project.caseStudy.decisions],
                  ["resultado", project.caseStudy.result],
                  ["aprendizado", project.caseStudy.learning],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#87b8c9]">{label}</dt>
                    <dd className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <div className="mt-7 border-t border-white/10 pt-5">
            <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#60a5fa]">tecnologias e repertório</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map(technology => (
                <span key={technology} className="border border-[#3b82f6]/30 bg-[#0b2746] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[#cfe3ff]">{technology}</span>
              ))}
            </div>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:flex sm:items-center sm:justify-between">
            <button type="button" data-project-modal-previous="true" onClick={() => onNavigate("previous")} disabled={!previousProject} aria-label={previousProject ? `Ver projeto anterior: ${previousProject.name}` : "Nenhum projeto anterior"} className="inline-flex min-h-11 items-center gap-2 border border-[#3b82f6]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#70a6ff] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-not-allowed disabled:opacity-35">
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              anterior
            </button>
            <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7189ae]" aria-live="polite">
              {projectIndex >= 0 ? `${String(projectIndex + 1).padStart(2, "0")} / ${String(projectCount).padStart(2, "0")}` : ""}
            </span>
            <button type="button" data-project-modal-next="true" onClick={() => onNavigate("next")} disabled={!nextProject} aria-label={nextProject ? `Ver próximo projeto: ${nextProject.name}` : "Nenhum próximo projeto"} className="inline-flex min-h-11 items-center gap-2 border border-[#3b82f6]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#70a6ff] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-not-allowed disabled:opacity-35">
              próximo
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
