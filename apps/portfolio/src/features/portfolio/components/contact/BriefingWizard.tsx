import { lazy, Suspense } from "react";
import { useBriefingFlow } from "@/features/portfolio/hooks/useBriefingFlow";
import { BriefingFields } from "./BriefingFields";
import { BriefingHeader } from "./BriefingHeader";
import { BriefingNavigation } from "./BriefingNavigation";
import { BriefingSummary } from "./BriefingSummary";
import { BriefingSubmission } from "./BriefingSubmission";
import type { PortfolioContactProps } from "./types";

const BriefingProfessionalLayer = lazy(
  () => import("@/features/portfolio/components/BriefingProfessionalLayer")
);

type BriefingWizardProps = Pick<
  PortfolioContactProps,
  | "handleSubmit"
  | "isQuoteRequestPending"
  | "formError"
  | "formSent"
  | "setFormSent"
  | "successMessageRef"
  | "isStaticDeploy"
  | "briefingWhatsAppUrl"
  | "onBriefingFocusChange"
  | "initialBriefingSeed"
>;

export function BriefingWizard({
  handleSubmit,
  isQuoteRequestPending,
  formError,
  formSent,
  setFormSent,
  successMessageRef,
  isStaticDeploy,
  briefingWhatsAppUrl,
  onBriefingFocusChange,
  initialBriefingSeed = null,
}: BriefingWizardProps) {
  const {
    briefingDraft,
    briefingFormRef,
    briefingProgress,
    briefingRevision,
    briefingStatus,
    briefingStep,
    captureBriefingDraft,
    clearBriefingDraft,
    moveBriefingStep,
    trackBriefingStarted,
  } = useBriefingFlow({ initialBriefingSeed, setFormSent });

  const hasProfessionalBriefingDraft = [
    "contentStatus",
    "visualIdentity",
    "pagesScreens",
    "features",
    "integrations",
    "qualityPriority",
    "postLaunch",
    "success",
    "references",
    "constraints",
    "briefing",
  ].some(field => briefingDraft[field]?.trim());
  const shouldLoadProfessionalLayer =
    briefingStep >= 3 || hasProfessionalBriefingDraft;

  return (
    <form
      data-briefing-form="true"
      key={briefingRevision}
      ref={briefingFormRef}
      id="contato-briefing"
      aria-busy={isQuoteRequestPending}
      onSubmit={handleSubmit}
      onChangeCapture={event => captureBriefingDraft(event.currentTarget)}
      onFocusCapture={() => {
        onBriefingFocusChange(true);
        trackBriefingStarted();
      }}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          onBriefingFocusChange(false);
      }}
      className="w-full min-w-0 max-w-2xl scroll-mt-24"
    >
      <BriefingHeader
        briefingProgress={briefingProgress}
        briefingStatus={briefingStatus}
        briefingStep={briefingStep}
      />
      <label
        aria-hidden="true"
        className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
      >
        <span>Website</span>
        <input
          tabIndex={-1}
          autoComplete="off"
          name="website"
          defaultValue=""
        />
      </label>

      <div data-briefing-studio="true" className="grid min-w-0 gap-7">
        <BriefingFields
          briefingDraft={briefingDraft}
          briefingStep={briefingStep}
        />
        {shouldLoadProfessionalLayer && (
          <Suspense
            fallback={
              <div
                data-briefing-professional-loading="true"
                role="status"
                aria-live="polite"
                className="border border-white/[0.1] bg-[#080f1a]/60 p-6 font-mono text-[9px] uppercase tracking-[0.12em] text-[#9bb9ca]"
              >
                carregando requisitos do briefing…
              </div>
            }
          >
            <BriefingProfessionalLayer
              draft={briefingDraft}
              requirementsHidden={briefingStep !== 3}
              reviewHidden={briefingStep !== 4}
            />
          </Suspense>
        )}

        <BriefingNavigation
          briefingStep={briefingStep}
          moveBriefingStep={moveBriefingStep}
        />
      </div>

      <BriefingSummary briefingDraft={briefingDraft} />
      <BriefingSubmission
        isQuoteRequestPending={isQuoteRequestPending}
        briefingStep={briefingStep}
        clearBriefingDraft={clearBriefingDraft}
        isStaticDeploy={isStaticDeploy}
        formError={formError}
        formSent={formSent}
        successMessageRef={successMessageRef}
        briefingWhatsAppUrl={briefingWhatsAppUrl}
        setFormSent={setFormSent}
      />
    </form>
  );
}
