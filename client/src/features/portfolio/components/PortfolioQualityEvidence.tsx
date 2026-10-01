import { ArrowUpRight, CheckCircle2, Gauge, ShieldCheck } from "lucide-react";

const qualityGates = [
  "auditoria de dependências",
  "integridade de mídia e fonte",
  "TypeScript + testes unitários",
  "build estático real",
  "smoke + E2E em navegador",
  "regressão mobile WebKit",
  "orçamento de bundle",
  "rotas do GitHub Pages",
] as const;

export default function PortfolioQualityEvidence() {
  return (
    <aside data-quality-evidence="true" className="mt-px border border-[#67e8f9]/18 bg-[#04101f] p-4 min-[360px]:p-5 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            quality gate deste portfólio
          </p>
          <h4 className="mt-3 max-w-xl font-display text-[clamp(1.65rem,3vw,2.7rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white">
            Publicar só depois de validar.
          </h4>
          <p className="mt-3 max-w-xl font-body text-sm leading-7 text-[#aac8da]">
            Pull requests e atualizações da main passam pelo mesmo fluxo automatizado antes do GitHub Pages receber um novo artefato.
          </p>
          <a
            href="https://github.com/pabloguilherme1121/PG-portfolio/actions/workflows/pages.yml"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex min-h-11 items-center gap-2 border border-[#67e8f9]/30 px-3.5 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#d8f7ff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
          >
            ver pipeline público <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">
            <Gauge className="h-4 w-4 text-[#67e8f9]" aria-hidden="true" />
            barreiras automáticas de publicação
          </div>
          <div className="mt-3 grid gap-px bg-white/[0.08] sm:grid-cols-2">
            {qualityGates.map((gate) => (
              <div key={gate} data-quality-gate="true" className="flex min-h-12 min-w-0 items-center gap-2.5 bg-[#06172f] px-3 py-3">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#67e8f9]" aria-hidden="true" />
                <span className="font-mono text-[8px] font-semibold uppercase leading-4 tracking-[0.08em] text-[#c7eaf6]">{gate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
