import { ClipboardCheck } from "lucide-react";
import type { BriefingDraft } from "@/features/portfolio/utils/briefingFlow";

export function BriefingSummary({
  briefingDraft,
}: {
  briefingDraft: BriefingDraft;
}) {
  return (
    <aside
      data-briefing-summary="true"
      className="mt-7 border border-[#67e8f9]/25 bg-[#06172f]/80 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <ClipboardCheck
          className="mt-0.5 h-5 w-5 shrink-0 text-[#67e8f9]"
          aria-hidden="true"
        />
        <div className="min-w-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">
            resumo ao vivo
          </p>
          <p className="mt-2 font-body text-sm leading-6 text-[#cbe8f6]">
            {briefingDraft.service || "Serviço ainda não definido"} ·{" "}
            {briefingDraft.projectType || "tipo de projeto a definir"}
          </p>
          {briefingDraft.objective && (
            <p className="mt-2 line-clamp-3 font-body text-xs leading-5 text-[#91b6ca]">
              {briefingDraft.objective}
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            {briefingDraft.stage && (
              <span className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#a5c8dd]">
                {briefingDraft.stage}
              </span>
            )}
            {briefingDraft.deadline && (
              <span className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#a5c8dd]">
                {briefingDraft.deadline}
              </span>
            )}
            {briefingDraft.budget && (
              <span className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#a5c8dd]">
                {briefingDraft.budget}
              </span>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
