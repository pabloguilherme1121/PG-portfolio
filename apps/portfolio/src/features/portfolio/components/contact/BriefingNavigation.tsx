import { ChevronLeft, ChevronRight } from "lucide-react";
import { briefingSteps } from "@/features/portfolio/utils/briefingFlow";

type BriefingNavigationProps = {
  briefingStep: number;
  moveBriefingStep: (step: number) => void;
};

export function BriefingNavigation({
  briefingStep,
  moveBriefingStep,
}: BriefingNavigationProps) {
  return (
    <div className="grid gap-3 border border-white/10 bg-[#07111f]/85 p-3.5 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:p-4">
      <button
        type="button"
        onClick={() => moveBriefingStep(briefingStep - 1)}
        disabled={briefingStep === 0}
        className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/10 px-4 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a8c5d8] transition-colors hover:border-[#67e8f9]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-not-allowed disabled:opacity-35 sm:justify-self-start"
        aria-label={
          briefingStep > 0
            ? `Voltar para ${briefingSteps[briefingStep - 1].label}`
            : "Primeira etapa do briefing"
        }
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        {briefingStep > 0
          ? `voltar: ${briefingSteps[briefingStep - 1].label}`
          : "início"}
      </button>

      <div className="text-center">
        <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#67e8f9]">
          etapa {briefingStep + 1} de {briefingSteps.length}
        </p>
        <p className="mt-1 font-body text-xs leading-5 text-[#86a8bc]">
          {briefingSteps[briefingStep].description}
        </p>
      </div>

      {briefingStep < briefingSteps.length - 1 ? (
        <button
          type="button"
          onClick={() => moveBriefingStep(briefingStep + 1)}
          className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#123b67] px-4 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#18508c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:justify-self-end"
          aria-label={`Continuar para ${briefingSteps[briefingStep + 1].label}`}
        >
          continuar: {briefingSteps[briefingStep + 1].label}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : (
        <span className="hidden sm:block" aria-hidden="true" />
      )}
    </div>
  );
}
