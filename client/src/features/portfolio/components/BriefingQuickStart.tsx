import { ArrowUpRight, LayoutTemplate } from "lucide-react";
import {
  briefingQuickStartPresets,
  type BriefingPreset,
} from "@/features/portfolio/briefingPresets";

type BriefingQuickStartProps = {
  onSelect: (preset: BriefingPreset) => void;
};

export default function BriefingQuickStart({ onSelect }: BriefingQuickStartProps) {
  return (
    <section
      data-briefing-quick-start="true"
      aria-labelledby="briefing-quick-start-title"
      className="mb-6 border border-[#67e8f9]/20 bg-[#06172f]/70 p-3.5 sm:mb-7 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">
            início rápido · tudo editável
          </p>
          <h4
            id="briefing-quick-start-title"
            className="mt-2 font-display text-lg font-medium leading-tight tracking-[-0.035em] text-white sm:text-xl"
          >
            Comece com uma rota profissional e personalize o necessário.
          </h4>
        </div>
        <p className="max-w-xs font-body text-xs leading-5 text-[#8fb6c9]">
          Um clique sugere direção, escopo, requisitos e qualidade. Você revisa tudo antes de enviar.
        </p>
      </div>

      <div className="mt-4 grid gap-2 lg:grid-cols-3">
        {briefingQuickStartPresets.map((preset) => (
          <button
            key={preset.id}
            type="button"
            data-briefing-preset="true"
            onClick={() => onSelect(preset)}
            aria-label={`Usar modelo ${preset.title}`}
            className="group min-h-[116px] border border-white/10 bg-[#07111f] p-3.5 sm:min-h-[132px] sm:p-4 text-left transition-[border-color,background-color,transform] hover:-translate-y-0.5 hover:border-[#67e8f9]/50 hover:bg-[#0a1d33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none"
          >
            <div className="flex items-start justify-between gap-3">
              <LayoutTemplate className="h-4 w-4 text-[#67e8f9]" aria-hidden="true" />
              <ArrowUpRight className="h-4 w-4 text-[#58758f] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
            </div>
            <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.12em] text-[#77a9fc]">{preset.eyebrow}</p>
            <p className="mt-1 font-display text-lg tracking-[-0.03em] text-white">{preset.title}</p>
            <p className="mt-2 font-body text-xs leading-5 text-[#8ca9bd]">{preset.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
}
