import { lazy, Suspense } from "react";
import { useNearViewport } from "@/features/portfolio/hooks/useNearViewport";
const PortfolioExperienceHub = lazy(
  () => import("@/features/portfolio/components/PortfolioExperienceHub")
);
const ProjectDiagnostic = lazy(
  () => import("@/features/portfolio/components/ProjectDiagnostic")
);

/** Optional visitor tools follow projects, competence and direct contact. */
export function JourneyTools({
  avoidSpeculativePreload,
}: {
  avoidSpeculativePreload: boolean;
}) {
  const [experienceHubRef, shouldLoadExperienceHub] =
    useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "40px" : "120px");
  const [diagnosticSectionRef, shouldLoadDiagnostic] =
    useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "40px" : "180px");
  const shouldRenderDiagnostic =
    shouldLoadDiagnostic ||
    (typeof window !== "undefined" && window.location.hash === "#diagnostico");
  return (
    <>
      <div
        ref={experienceHubRef}
        data-experience-hub-anchor="true"
        aria-busy={!shouldLoadExperienceHub}
        className="min-h-px"
      >
        {shouldLoadExperienceHub ? (
          <Suspense
            fallback={
              <section
                data-experience-hub-placeholder="true"
                role="status"
                aria-live="polite"
                className="experience-hub-surface archive-chapter min-h-[720px] border-y border-white/[0.08] bg-[#050d18] px-5 py-12 sm:min-h-[820px] sm:px-8 sm:py-16 lg:px-12"
              >
                <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc]">
                  carregando rotas do portfólio…
                </div>
              </section>
            }
          >
            <PortfolioExperienceHub />
          </Suspense>
        ) : (
          <section
            data-experience-hub-placeholder="true"
            className="experience-hub-surface archive-chapter min-h-[720px] border-y border-white/[0.08] bg-[#050d18] px-5 py-12 sm:min-h-[820px] sm:px-8 sm:py-16 lg:px-12"
            aria-label="Rotas do portfólio"
          >
            <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">
              rotas do portfólio serão carregadas ao aproximar
            </div>
          </section>
        )}
      </div>

      <div
        ref={diagnosticSectionRef}
        data-project-diagnostic-anchor="true"
        className="min-h-px"
      >
        {shouldRenderDiagnostic ? (
          <Suspense
            fallback={
              <section
                id="diagnostico"
                data-project-diagnostic-placeholder="true"
                role="status"
                aria-live="polite"
                className="archive-chapter min-h-[760px] border-y border-white/[0.08] bg-[#061226] px-5 py-16 sm:min-h-[900px] sm:px-8 sm:py-20"
              >
                <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc]">
                  carregando Project Lens…
                </div>
              </section>
            }
          >
            <ProjectDiagnostic />
          </Suspense>
        ) : (
          <section
            id="diagnostico"
            data-project-diagnostic-placeholder="true"
            className="archive-chapter min-h-[760px] border-y border-white/[0.08] bg-[#061226] px-5 py-16 sm:min-h-[900px] sm:px-8 sm:py-20"
            aria-label="Project Lens"
          >
            <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">
              Project Lens será carregado ao aproximar
            </div>
          </section>
        )}
      </div>
    </>
  );
}
