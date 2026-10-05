import type { RefObject } from "react";
import { lazy, Suspense } from "react";
import {
  portfolioMarkUrl as markUrl,
  portfolioPortraitResponsive as portraitResponsive,
  portfolioPortraitUrl as portraitUrl,
} from "@/features/portfolio/portfolioConfig";

const InstagramRepertoire = lazy(
  () => import("@/features/social/InstagramRepertoire"),
);
const PortfolioDeferredProfileSections = lazy(
  () => import("@/features/portfolio/components/PortfolioDeferredProfileSections"),
);
const PortfolioDeferredStaticSections = lazy(
  () => import("@/features/portfolio/components/PortfolioDeferredStaticSections"),
);
const PortfolioWebResume = lazy(
  () => import("@/features/portfolio/components/PortfolioWebResume"),
);

type PortfolioDeferredContentSectionsProps = {
  profileSectionsRef: RefObject<HTMLDivElement | null>;
  shouldRenderProfileSections: boolean;
  webResumeSectionRef: RefObject<HTMLDivElement | null>;
  shouldRenderWebResume: boolean;
  staticSectionsRef: RefObject<HTMLDivElement | null>;
  shouldRenderStaticSections: boolean;
  socialSectionRef: RefObject<HTMLDivElement | null>;
  shouldLoadSocial: boolean;
};

export function PortfolioDeferredContentSections({
  profileSectionsRef,
  shouldRenderProfileSections,
  webResumeSectionRef,
  shouldRenderWebResume,
  staticSectionsRef,
  shouldRenderStaticSections,
  socialSectionRef,
  shouldLoadSocial,
}: PortfolioDeferredContentSectionsProps) {
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
            <PortfolioWebResume embedded />
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
            <PortfolioDeferredStaticSections markUrl={markUrl} />
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

      <div ref={socialSectionRef} aria-hidden="true" className="h-px w-full" />
      {shouldLoadSocial ? (
        <Suspense
          fallback={
            <section
              id="social"
              className="archive-chapter border-t border-white/[0.07] bg-[#050c18] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
              aria-label="Carregando repertório social"
            >
              <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">
                carregando repertório social
              </div>
            </section>
          }
        >
          <InstagramRepertoire />
        </Suspense>
      ) : (
        <section
          id="social"
          className="archive-chapter border-t border-white/[0.07] bg-[#050c18] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
          aria-label="Repertório social"
        >
          <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">
            repertório social será carregado ao rolar
          </div>
        </section>
      )}
    </>
  );
}
