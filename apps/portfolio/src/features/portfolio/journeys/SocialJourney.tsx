import { lazy, Suspense } from "react";
import { useNearViewport } from "@/features/portfolio/hooks/useNearViewport";
const InstagramRepertoire = lazy(
  () => import("@/features/social/InstagramRepertoire")
);
export function SocialJourney({
  avoidSpeculativePreload,
}: {
  avoidSpeculativePreload: boolean;
}) {
  const [socialSectionRef, shouldLoadSocial] = useNearViewport<HTMLDivElement>(
    avoidSpeculativePreload ? "160px" : "720px"
  );
  return (
    <>
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
