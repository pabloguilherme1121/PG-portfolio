import { lazy, Suspense } from "react";
import { useNearViewport } from "@/features/portfolio/hooks/useNearViewport";
import { usePortfolioDeferredHashRequests } from "@/features/portfolio/hooks/usePortfolioDeferredHashRequests";
import {
  portfolioMarkUrl as markUrl,
  portfolioPortraitResponsive as portraitResponsive,
  portfolioPortraitUrl as portraitUrl,
  portfolioResumeUrl as resumeUrl,
} from "@/features/portfolio/portfolioConfig";
const PortfolioDeferredProfileSections = lazy(
  () =>
    import("@/features/portfolio/components/PortfolioDeferredProfileSections")
);
const PortfolioDeferredStaticSections = lazy(
  () =>
    import("@/features/portfolio/components/PortfolioDeferredStaticSections")
);
const PortfolioWebResume = lazy(
  () => import("@/features/portfolio/components/PortfolioWebResume")
);
export function ProfileJourney({
  avoidSpeculativePreload,
  isDesktopViewport,
  resumeAvailable,
}: {
  avoidSpeculativePreload: boolean;
  isDesktopViewport: boolean;
  resumeAvailable: boolean;
}) {
  const [webResumeSectionRef, shouldLoadWebResume] =
    useNearViewport<HTMLDivElement>(
      avoidSpeculativePreload ? "160px" : "480px"
    );
  const [profileSectionsRef, shouldLoadProfileSections] =
    useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "80px" : "280px");
  const [staticSectionsRef, shouldLoadStaticSections] =
    useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "80px" : "320px");
  const {
    profileSections: profileSectionsHashRequested,
    staticSections: staticSectionsHashRequested,
  } = usePortfolioDeferredHashRequests();
  const shouldRenderWebResume =
    shouldLoadWebResume ||
    (typeof window !== "undefined" &&
      window.location.hash === "#curriculo-web");
  const shouldRenderProfileSections =
    shouldLoadProfileSections || profileSectionsHashRequested;
  const shouldRenderStaticSections =
    shouldLoadStaticSections || staticSectionsHashRequested;
  return (
    <>
      <div
        ref={profileSectionsRef}
        data-profile-sections-anchor="true"
        aria-busy={!shouldRenderProfileSections}
        className="min-h-px"
      >
        {shouldRenderProfileSections ? (
          <Suspense
            fallback={
              <section
                data-profile-sections-placeholder="true"
                className="archive-chapter min-h-[1150px] border-t border-white/[0.07] bg-[#0a0f18] px-5 py-16 sm:min-h-[1350px] sm:px-8 sm:py-20"
                aria-label="Carregando Sobre e perfil profissional"
              >
                <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc]">
                  carregando Sobre e perfil profissional…
                </div>
              </section>
            }
          >
            <PortfolioDeferredProfileSections
              resumeAvailable={resumeAvailable}
              resumeUrl={resumeUrl}
              portraitUrl={portraitUrl}
              portraitResponsive={portraitResponsive}
            />
          </Suspense>
        ) : (
          <section
            data-profile-sections-placeholder="true"
            className="archive-chapter min-h-[1150px] border-t border-white/[0.07] bg-[#0a0f18] px-5 py-16 sm:min-h-[1350px] sm:px-8 sm:py-20"
            aria-label="Sobre e perfil profissional"
          >
            <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">
              Sobre e perfil profissional serão carregados ao aproximar
            </div>
          </section>
        )}
      </div>

      <div
        id="curriculo-web"
        ref={webResumeSectionRef}
        data-web-resume-anchor="true"
        aria-busy={!shouldRenderWebResume}
        className="scroll-mt-24 min-h-px"
      >
        {shouldRenderWebResume ? (
          <Suspense
            fallback={
              <section
                data-web-resume-placeholder="true"
                className="archive-chapter border-t border-white/[0.07] bg-[#f5fbff] px-5 py-14 text-[#365166]"
                aria-label="Carregando currículo web"
              >
                <div className="mx-auto max-w-[1120px] font-mono text-[10px] uppercase tracking-[0.14em] text-[#0e7490]">
                  carregando currículo web…
                </div>
              </section>
            }
          >
            <PortfolioWebResume
              embedded
              resumeAvailable={resumeAvailable}
              resumeUrl={resumeUrl}
            />
          </Suspense>
        ) : (
          <section
            data-web-resume-placeholder="true"
            className="archive-chapter border-t border-white/[0.07] bg-[#f5fbff] px-5 py-10 text-[#365166]"
            aria-label="Currículo web"
          >
            <div className="mx-auto max-w-[1120px] font-mono text-[9px] uppercase tracking-[0.12em] text-[#0e7490]">
              currículo web disponível ao aproximar
            </div>
          </section>
        )}
      </div>

      <div
        ref={staticSectionsRef}
        data-static-sections-anchor="true"
        aria-busy={!shouldRenderStaticSections}
        className="min-h-px"
      >
        {shouldRenderStaticSections ? (
          <Suspense
            fallback={
              <section
                data-static-sections-placeholder="true"
                className="archive-chapter min-h-[1200px] border-t border-white/[0.07] bg-[#070a10] px-5 py-16 sm:min-h-[1500px] sm:px-8 sm:py-24"
                aria-label="Carregando competências, serviços e processo"
              >
                <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">
                  carregando competências, serviços e processo…
                </div>
              </section>
            }
          >
            <PortfolioDeferredStaticSections
              isDesktopViewport={isDesktopViewport}
              markUrl={markUrl}
            />
          </Suspense>
        ) : (
          <section
            data-static-sections-placeholder="true"
            className="archive-chapter min-h-[1200px] border-t border-white/[0.07] bg-[#070a10] px-5 py-16 sm:min-h-[1500px] sm:px-8 sm:py-24"
            aria-label="Competências, serviços e processo"
          >
            <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">
              competências, serviços e processo serão carregados ao aproximar
            </div>
          </section>
        )}
      </div>
    </>
  );
}
