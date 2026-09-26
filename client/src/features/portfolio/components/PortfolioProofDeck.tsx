import { ArrowUpRight, BarChart3, ClipboardCheck, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";

const proofItems = [
  {
    id: "produto",
    tab: "produto",
    eyebrow: "produto em produção",
    status: "LIVE / CASE 01",
    title: "Observatório",
    text: "Um dashboard publicado e navegável: a prova principal de que a entrega sai do conceito e chega ao uso real.",
    href: "#observatorio",
    cta: "abrir case principal",
    Icon: BarChart3,
  },
  {
    id: "qualidade",
    tab: "qualidade",
    eyebrow: "engenharia verificável",
    status: "4 CAMADAS",
    title: "Qualidade que aparece no processo",
    text: "Typecheck, Vitest, Playwright e auditoria de assets sustentam a entrega além da aparência da interface.",
    href: "#qualidade",
    cta: "ver provas de qualidade",
    Icon: ShieldCheck,
  },
  {
    id: "briefing",
    tab: "briefing",
    eyebrow: "entrada inteligente",
    status: "30 SEG",
    title: "Diagnóstico que vira contexto",
    text: "Objetivo e estágio do projeto alimentam o briefing para a conversa começar com direção, não com uma mensagem vazia.",
    href: "#diagnostico",
    cta: "fazer diagnóstico",
    Icon: ClipboardCheck,
  },
] as const;

export default function PortfolioProofDeck() {
  const [activeId, setActiveId] = useState<(typeof proofItems)[number]["id"]>("produto");
  const active = proofItems.find((item) => item.id === activeId) ?? proofItems[0];
  const ActiveIcon = active.Icon;

  return (
    <aside
      data-attention-hook="proof-deck"
      aria-label="Provas interativas do portfólio"
      className="relative overflow-hidden border border-[#67e8f9]/20 bg-[#061226]/88 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-md"
    >
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="relative grid gap-px bg-white/10 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="bg-[#07111f]/96 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#67e8f9]">PG / PROOF.DECK</p>
              <h2 className="mt-2 max-w-xs font-display text-2xl font-medium leading-[0.95] tracking-[-0.045em] text-white">
                Provas que você pode abrir e verificar.
              </h2>
            </div>
            <span
              className="relative h-2.5 w-2.5 shrink-0 rounded-full bg-[#67e8f9] shadow-[0_0_16px_rgba(103,232,249,0.85)] motion-safe:animate-pulse"
              aria-hidden="true"
            />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-1" role="group" aria-label="Selecionar prova do portfólio">
            {proofItems.map((item) => {
              const selected = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setActiveId(item.id);
                    trackPortfolioEvent("proof_deck_selected", { proofId: item.id });
                  }}
                  className={`min-h-11 border px-2 py-2 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${selected ? "border-[#67e8f9] bg-[#0b2746] text-white" : "border-white/10 bg-[#07101c] text-[#8fa8c7] hover:border-[#67e8f9]/45 hover:text-white"}`}
                >
                  {item.tab}
                </button>
              );
            })}
          </div>
        </div>

        <div key={active.id} className="relative bg-[#08182a] p-4 sm:p-5 motion-safe:animate-[fadeIn_220ms_ease-out]">
          <div className="flex items-start justify-between gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center border border-[#67e8f9]/30 bg-[#0b2746] text-[#a5f3fc]">
              <ActiveIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-[#67e8f9]">{active.status}</p>
          </div>

          <p className="mt-5 font-mono text-[8px] uppercase tracking-[0.13em] text-[#7fa8cc]">{active.eyebrow}</p>
          <h3 className="mt-2 font-display text-[clamp(1.65rem,3vw,2.6rem)] font-medium leading-[0.95] tracking-[-0.045em] text-white">
            {active.title}
          </h3>
          <p className="mt-3 max-w-xl font-body text-sm leading-6 text-[#bed9e8]">{active.text}</p>

          <a
            href={active.href}
            onClick={() => trackPortfolioEvent("proof_deck_cta", { proofId: active.id })}
            className="group mt-5 inline-flex min-h-11 items-center gap-2 border-b border-[#38bdf8] font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#e3faff] transition-colors hover:text-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
          >
            {active.cta}
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </aside>
  );
}
