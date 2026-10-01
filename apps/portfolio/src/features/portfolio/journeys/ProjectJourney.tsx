import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useNearViewport } from "@/features/portfolio/hooks/useNearViewport";
import { usePortfolioDeferredHashRequests } from "@/features/portfolio/hooks/usePortfolioDeferredHashRequests";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useFavoriteProjects } from "@/features/portfolio/hooks/useFavoriteProjects";
import { useProjectDetailsController } from "@/features/portfolio/hooks/useProjectDetailsController";
import { repositories } from "@/features/portfolio/portfolioData";
import {
  portfolioMarkUrl as markUrl,
  portfolioPortraitResponsive as portraitResponsive,
  portfolioPortraitUrl as portraitUrl,
} from "@/features/portfolio/portfolioConfig";
const PortfolioProjectsOverview = lazy(
  () => import("@/features/portfolio/components/PortfolioProjectsOverview")
);
const PortfolioProjectDetailsDialog = lazy(
  () => import("@/features/portfolio/components/PortfolioProjectDetailsDialog")
);
const PortfolioCaseStudies = lazy(
  () => import("@/features/portfolio/components/PortfolioCaseStudies")
);

export function ProjectJourney({
  avoidSpeculativePreload,
  onOverlayChange,
}: {
  avoidSpeculativePreload: boolean;
  onOverlayChange: (open: boolean) => void;
}) {
  const [projectsSectionRef, shouldLoadProjects] = useNearViewport<HTMLElement>(
    avoidSpeculativePreload ? "80px" : "240px"
  );
  const [caseStudiesSectionRef, shouldLoadCaseStudies] =
    useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "80px" : "420px");
  const { caseStudies: caseStudiesHashRequested } =
    usePortfolioDeferredHashRequests();
  const [featuredCardsReady, setFeaturedCardsReady] = useState(false);
  const { favoriteProjectIdSet, toggleFavoriteProject } = useFavoriteProjects();
  const {
    selectedProject,
    projectDetailsLoading,
    projectDetailsTransition,
    showProjectSwipeHint,
    projectShareStatus,
    projectCopyStatus,
    previousSelectedProject,
    nextSelectedProject,
    selectedProjectIndex,
    projectCount,
    openProjectDetails,
    closeProjectDetails,
    navigateSelectedProject,
    handleProjectDetailsTouchStart,
    handleProjectDetailsTouchEnd,
    shareSelectedProject,
    copySelectedProjectLink,
  } = useProjectDetailsController({ repositories });
  const shouldRenderProjects =
    shouldLoadProjects ||
    (typeof window !== "undefined" &&
      (window.location.hash === "#projetos" ||
        window.location.hash === "#observatorio" ||
        new URLSearchParams(window.location.search).has("projeto")));
  const shouldRenderCaseStudies =
    shouldLoadCaseStudies || caseStudiesHashRequested;
  useEffect(() => {
    onOverlayChange(Boolean(selectedProject));
  }, [selectedProject, onOverlayChange]);
  useEffect(() => {
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 120
      : 420;
    const timer = window.setTimeout(() => setFeaturedCardsReady(true), delay);
    return () => window.clearTimeout(timer);
  }, []);

  const featuredRepositories = useMemo(
    () =>
      repositories
        .filter(repository => repository.featured || repository.relevance >= 80)
        .sort((first, second) => second.relevance - first.relevance)
        .slice(0, 4),
    []
  );
  function toggleFavorite(
    projectId: string,
    event: React.MouseEvent | React.KeyboardEvent
  ) {
    event.preventDefault();
    event.stopPropagation();
    const isAlreadySaved = toggleFavoriteProject(projectId);
    const projectName =
      repositories.find(repository => repository.id === projectId)?.name ??
      "Projeto";
    if (isAlreadySaved) {
      toast("Projeto removido", {
        description: `${projectName} foi removido dos projetos salvos.`,
      });
    } else {
      toast.success("Projeto salvo", {
        description: `${projectName} está disponível em projetos salvos.`,
      });
    }
  }

  return (
    <>
      <section
        id="projetos"
        ref={projectsSectionRef}
        tabIndex={-1}
        className="archive-chapter relative border-y border-white/[0.07] bg-[#0a0f18]"
      >
        <div className="mx-auto max-w-[1440px] px-4 py-14 min-[360px]:px-5 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          {shouldRenderProjects ? (
            <Suspense
              fallback={
                <div
                  data-projects-overview-placeholder="true"
                  role="status"
                  aria-live="polite"
                  className="min-h-[28rem] border border-white/[0.08] bg-[#071326]/55 p-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9] sm:min-h-[32rem]"
                >
                  carregando vitrine de projetos…
                </div>
              }
            >
              <PortfolioProjectsOverview
                markUrl={markUrl}
                portraitUrl={portraitUrl}
                portraitResponsive={portraitResponsive}
                featuredCardsReady={featuredCardsReady}
                featuredRepositories={featuredRepositories}
                openProjectDetails={openProjectDetails}
              />
            </Suspense>
          ) : (
            <div
              data-projects-overview-placeholder="true"
              className="min-h-[28rem] border border-white/[0.08] bg-[#071326]/35 p-5 sm:min-h-[32rem]"
              aria-label="Vitrine de projetos"
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">
                vitrine de projetos será carregada ao aproximar
              </p>
            </div>
          )}
          <div className="mt-10 flex flex-col gap-4 border-y border-white/[0.1] py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">
                quer ver mais ou discutir um projeto?
              </p>
              <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#a9bfd8]">
                Os destaques acima representam a seleção principal. Para
                detalhes técnicos, contexto ou uma proposta, fale diretamente
                comigo.
              </p>
            </div>
            <a
              href="#contato"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[#38bdf8] px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-colors hover:bg-[#a5f3fc]"
            >
              falar sobre um projeto <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div
            id="estudos-de-caso"
            ref={caseStudiesSectionRef}
            data-case-studies-anchor="true"
            aria-busy={!shouldRenderCaseStudies}
            className="scroll-mt-24"
          >
            {shouldRenderCaseStudies ? (
              <Suspense
                fallback={
                  <div
                    data-case-studies-placeholder="true"
                    className="mt-12 min-h-40 border-t border-cyan-100/[0.12] pt-8 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9] sm:mt-16 sm:pt-10"
                  >
                    carregando estudos de caso…
                  </div>
                }
              >
                <PortfolioCaseStudies />
              </Suspense>
            ) : (
              <div
                data-case-studies-placeholder="true"
                className="mt-12 min-h-40 border-t border-cyan-100/[0.12] pt-8 sm:mt-16 sm:pt-10"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">
                  estudos de caso carregam ao aproximar
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedProject && (
        <Suspense
          fallback={
            <div
              data-project-details-loading-shell="true"
              role="status"
              aria-live="polite"
              className="fixed inset-0 z-[70] grid place-items-center bg-[#02050a]/90 p-6 font-mono text-[10px] uppercase tracking-[0.14em] text-[#c8f7ff]"
            >
              carregando detalhes do projeto…
            </div>
          }
        >
          <PortfolioProjectDetailsDialog
            project={selectedProject}
            loading={projectDetailsLoading}
            transition={projectDetailsTransition}
            showSwipeHint={showProjectSwipeHint}
            isFavorite={favoriteProjectIdSet.has(selectedProject.id)}
            shareStatus={projectShareStatus}
            copyStatus={projectCopyStatus}
            previousProject={previousSelectedProject}
            nextProject={nextSelectedProject}
            projectIndex={selectedProjectIndex}
            projectCount={projectCount}
            onOpenChange={open => {
              if (!open) closeProjectDetails();
            }}
            onTouchStart={handleProjectDetailsTouchStart}
            onTouchEnd={handleProjectDetailsTouchEnd}
            onToggleFavorite={event =>
              toggleFavorite(selectedProject.id, event)
            }
            onShare={shareSelectedProject}
            onCopyLink={copySelectedProjectLink}
            onNavigate={navigateSelectedProject}
          />
        </Suspense>
      )}
    </>
  );
}
