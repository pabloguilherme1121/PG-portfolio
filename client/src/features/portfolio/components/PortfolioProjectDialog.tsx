import { ArrowRight, Play } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Repository } from "@/features/portfolio/portfolioData";

type PortfolioProjectDialogProps = {
  project: Repository | null;
  onOpenChange: (open: boolean) => void;
};

export default function PortfolioProjectDialog({ project, onOpenChange }: PortfolioProjectDialogProps) {
  return (
    <Dialog open={Boolean(project)} onOpenChange={onOpenChange}>
      {project && (
        <DialogContent
          data-project-details-dialog="true"
          aria-modal="true"
          className="max-h-[calc(100svh-1rem)] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] overflow-y-auto border-[#3b82f6]/30 bg-[#071326] p-0 text-[#e6f2ff] shadow-[0_24px_90px_rgba(0,0,0,0.6)] sm:max-w-3xl"
        >
          {project.kind === "video" ? (
            <div className="relative bg-black">
              <video
                className="block max-h-[42svh] w-full bg-black object-contain"
                src={project.url}
                poster={project.cover}
                controls
                playsInline
                preload="metadata"
              >
                Seu navegador não oferece suporte à reprodução audiovisual.
              </video>
              <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 bg-[#06172f]/90 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff]">
                <Play className="h-3.5 w-3.5" aria-hidden="true" /> projeto audiovisual
              </span>
            </div>
          ) : project.cover ? (
            <img
              src={project.cover}
              alt={`Imagem do projeto ${project.name}`}
              width="1200"
              height="800"
              className="max-h-[42svh] w-full object-cover"
            />
          ) : null}

          <div className="p-5 sm:p-8">
            <DialogHeader className="text-left">
              <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#60a5fa]">{project.id}</p>
              <DialogTitle className="mt-2 font-display text-3xl font-medium tracking-[-0.05em] text-white">
                {project.name}
              </DialogTitle>
              <DialogDescription className="mt-3 max-w-2xl font-body text-sm leading-7 text-[#c4d9ee]">
                {project.description}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <span key={technology} className="border border-[#67e8f9]/20 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#a5dff4]">
                  {technology}
                </span>
              ))}
            </div>

            <dl className="mt-7 grid gap-px bg-white/[0.1] sm:grid-cols-3">
              <div className="bg-[#081426] p-4">
                <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#70a6ff]">papel</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#d2e4f5]">{project.role}</dd>
              </div>
              <div className="bg-[#081426] p-4">
                <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#70a6ff]">processo</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#d2e4f5]">{project.process}</dd>
              </div>
              <div className="bg-[#081426] p-4">
                <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#70a6ff]">resultado</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#d2e4f5]">{project.result}</dd>
              </div>
            </dl>

            {project.caseStudy && (
              <div data-project-case-study="true" className="mt-7 border-l-2 border-[#38bdf8] bg-[#071a35]/70 p-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">estudo de caso</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f8fb7]">contexto</p>
                    <p className="mt-1 font-body text-sm leading-6 text-[#cbe8f6]">{project.caseStudy.context}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f8fb7]">decisão</p>
                    <p className="mt-1 font-body text-sm leading-6 text-[#cbe8f6]">{project.caseStudy.decisions}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f8fb7]">resultado</p>
                    <p className="mt-1 font-body text-sm leading-6 text-[#cbe8f6]">{project.caseStudy.result}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f8fb7]">aprendizado</p>
                    <p className="mt-1 font-body text-sm leading-6 text-[#cbe8f6]">{project.caseStudy.learning}</p>
                  </div>
                </div>
              </div>
            )}

            <a
              href="#contato"
              onClick={() => onOpenChange(false)}
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 bg-[#38bdf8] px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-colors hover:bg-[#a5f3fc]"
            >
              conversar sobre um projeto <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
