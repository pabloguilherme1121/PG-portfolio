import { Monitor, Moon, Sun, X } from "lucide-react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { ThemePreference } from "@/contexts/ThemeContext";

type PortfolioAppearancePanelProps = {
  theme: "light" | "dark";
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  fontScale: number;
  setFontScale: Dispatch<SetStateAction<number>>;
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
};

export default function PortfolioAppearancePanel({
  theme,
  preference,
  setPreference,
  fontScale,
  setFontScale,
  closeRef,
  onClose,
}: PortfolioAppearancePanelProps) {
  return (
    <div
      data-appearance-panel="true"
      role="dialog"
      aria-modal="false"
      aria-labelledby="appearance-title"
      aria-describedby="appearance-description"
      className="appearance-panel fixed right-4 top-[88px] z-[60] max-h-[calc(100dvh-7rem)] w-[min(92vw,340px)] overflow-y-auto overscroll-contain border border-[#67e8f9]/30 bg-[#071326] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.42)] sm:right-8 lg:right-12"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#67e8f9]">configurações</p>
          <h2 id="appearance-title" className="mt-2 font-display text-2xl tracking-[-0.04em] text-white">Aparência</h2>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar configurações de aparência"
          className="grid h-8 w-8 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p id="appearance-description" className="mt-3 font-body text-xs leading-5 text-[#9fb2ce]">Escolha como o arquivo deve aparecer neste dispositivo.</p>

      <div className="mt-5 grid gap-2" role="group" aria-label="Preferência de tema">
        {([
          ["light", "Claro", Sun],
          ["dark", "Escuro", Moon],
          ["system", "Preferência do sistema", Monitor],
        ] as const).map(([value, label, Icon]) => (
          <button
            key={value}
            type="button"
            onClick={() => setPreference(value)}
            aria-pressed={preference === value}
            className={`flex items-center gap-3 border px-3 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${preference === value ? "border-[#67e8f9] bg-[#0b2746] text-[#d9fbff]" : "border-white/10 text-[#9fb2ce] hover:border-[#67e8f9]/60 hover:text-[#d9fbff]"}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="flex-1">{label}</span>
            {preference === value && <span className="text-[8px] text-[#67e8f9]">ativo</span>}
          </button>
        ))}
      </div>

      <div className="mt-5 border-t border-white/10 pt-4" role="group" aria-label="Tamanho da fonte">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">tamanho do texto</p>
          <span className="font-mono text-[9px] text-[#9fb2ce]">{Math.round(fontScale * 100)}%</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <button type="button" onClick={() => setFontScale(value => Math.max(0.92, Number((value - 0.04).toFixed(2))))} disabled={fontScale <= 0.92} aria-label="Diminuir tamanho da fonte" className="border border-white/10 px-2 py-3 font-mono text-xs text-[#d9fbff] transition-colors hover:border-[#67e8f9] disabled:opacity-40">A−</button>
          <button type="button" onClick={() => setFontScale(1)} aria-label="Restaurar tamanho padrão da fonte" className="border border-white/10 px-2 py-3 font-mono text-xs text-[#d9fbff] transition-colors hover:border-[#67e8f9]">100%</button>
          <button type="button" onClick={() => setFontScale(value => Math.min(1.16, Number((value + 0.04).toFixed(2))))} disabled={fontScale >= 1.16} aria-label="Aumentar tamanho da fonte" className="border border-white/10 px-2 py-3 font-mono text-xs text-[#d9fbff] transition-colors hover:border-[#67e8f9] disabled:opacity-40">A+</button>
        </div>
      </div>

      <p className="mt-4 border-t border-white/10 pt-4 font-mono text-[9px] uppercase tracking-[0.11em] text-[#7189ae]">tema aplicado agora: {theme === "dark" ? "escuro" : "claro"}</p>
    </div>
  );
}
