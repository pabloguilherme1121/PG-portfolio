import { CheckCircle2, ShieldCheck } from "lucide-react";
import { briefingSteps } from "@/features/portfolio/utils/briefingFlow";

type BriefingHeaderProps = {
  briefingProgress: number;
  briefingStatus: string;
  briefingStep: number;
};

export function BriefingHeader({
  briefingProgress,
  briefingStatus,
  briefingStep,
}: BriefingHeaderProps) {
  return (
    <div
      data-briefing-header="true"
      className="mb-6 min-w-0 border border-[#67e8f9]/20 bg-[#07182a]/80 p-3.5 sm:mb-8 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">
            briefing studio · contexto antes do orçamento
          </p>
          <h3 className="mt-2 font-display text-[1.35rem] font-medium leading-tight tracking-[-0.04em] text-white sm:text-2xl">
            Transforme contexto em um briefing pronto para avançar.
          </h3>
        </div>
        <div className="sm:text-right">
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7892b8]">
            qualidade do contexto
          </p>
          <p
            data-briefing-progress="true"
            aria-live="polite"
            className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#a5f3fc]"
          >
            {briefingProgress}% · {briefingStatus}
          </p>
          <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#7fa2b6]">
            etapa {briefingStep + 1} de {briefingSteps.length} ·{" "}
            {briefingSteps[briefingStep].label}
          </p>
        </div>
      </div>
      <div
        className="mt-4 h-1.5 overflow-hidden bg-white/10"
        aria-hidden="true"
      >
        <span
          className="block h-full origin-left bg-[#38bdf8] transition-transform duration-300 motion-reduce:transition-none"
          style={{ transform: `scaleX(${briefingProgress / 100})` }}
        />
      </div>
      <ol
        className="mt-5 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-5"
        aria-label="Etapas do briefing"
      >
        {briefingSteps.map((step, index) => {
          const active = index === briefingStep;
          const completed = index < briefingStep;
          return (
            <li
              key={step.id}
              aria-current={active ? "step" : undefined}
              className={`min-w-0 bg-[#07111f] px-2.5 py-2.5 sm:px-3 sm:py-3 ${active ? "ring-1 ring-inset ring-[#67e8f9]" : ""}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`font-mono text-[8px] uppercase tracking-[0.12em] ${active || completed ? "text-[#67e8f9]" : "text-[#5f7695]"}`}
                >
                  0{index + 1}
                </span>
                {completed && (
                  <CheckCircle2
                    className="h-3.5 w-3.5 text-[#67e8f9]"
                    aria-hidden="true"
                  />
                )}
              </div>
              <p
                className={`mt-2 font-mono text-[8px] font-semibold uppercase tracking-[0.09em] ${active ? "text-white" : "text-[#9bb4cf]"}`}
              >
                {step.label}
              </p>
            </li>
          );
        })}
      </ol>
      <div className="mt-4 flex items-start gap-3 border-t border-white/10 pt-4">
        <ShieldCheck
          className="mt-0.5 h-4 w-4 shrink-0 text-[#67e8f9]"
          aria-hidden="true"
        />
        <p className="font-body text-xs leading-5 text-[#8fb6c9]">
          O rascunho é salvo apenas neste dispositivo para você não perder o
          preenchimento. Nada é enviado enquanto você não concluir a ação final.
        </p>
      </div>
    </div>
  );
}
