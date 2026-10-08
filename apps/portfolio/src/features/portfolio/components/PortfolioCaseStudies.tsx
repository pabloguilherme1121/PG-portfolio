import { caseStudies } from "@/features/portfolio/portfolioData";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { ArrowUpRight, Github } from "lucide-react";

export default function PortfolioCaseStudies() {
  return (
    <div className="mt-12 border-t sm:mt-16 border-cyan-100/[0.12] pt-8 sm:pt-10">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a5f3fc]">por trás dos trabalhos</p>
          <h3 className="mt-3 font-display text-[clamp(2rem,3vw,3.5rem)] font-medium leading-none tracking-[-0.05em] text-white">Contexto, escolha e resultado.</h3>
        </div>
        <p className="max-w-sm font-body text-sm leading-7 text-[#accddd]">Cada estudo resume o que precisava ser resolvido, qual caminho foi escolhido e o que a entrega comprova.</p>
      </div>
      <div className="mt-6 grid gap-px sm:mt-8 bg-cyan-100/[0.1] lg:grid-cols-2">
        {caseStudies.map((study) => (
          <article key={study.id} data-case-study="true" className="relative min-w-0 bg-[#071326] p-4 min-[360px]:p-5 sm:p-8">
            <div className="flex items-center justify-between gap-4"><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#67e8f9]">{study.id}</span><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7899ae]" data-case-stage="true">{study.stage}</span></div>
            <h4 className="mt-5 font-display text-[1.65rem] leading-tight sm:mt-7 sm:text-3xl font-medium tracking-[-0.04em] text-white">{study.title}</h4>
            <p className="mt-4 font-body text-sm leading-7 text-[#bcd9e7]">{study.result}</p>
            <details className="professional-disclosure mt-5"><summary>Ler estudo · contexto, decisões e aprendizado</summary>
            <dl className="mt-5 grid gap-4 font-body sm:mt-6 sm:gap-5 text-sm leading-7 text-[#bcd9e7]">
              <div><dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">contexto</dt><dd className="mt-1">{study.context}</dd></div>
              {([
                ["problema", study.problem],
                ["objetivo", study.objective],
                ["decisões", study.decisions],
                ["resultado", study.result],
              ] as const).map(([label, text]) => (
                <div key={label} data-case-detail={label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#8fa8c7]">{label}</dt>
                  <dd className="mt-1">{text}</dd>
                </div>
              ))}
              <div><dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">o que aprendi</dt><dd className="mt-1 text-[#d9f4ff]">{study.learning}</dd></div>
            </dl>
            <p className="mt-4 pb-5 font-body text-sm leading-7 text-[#bcd9e7]">{study.id === "TEC.01" ? "Limites: consulte a fonte e a data dos indicadores no produto; capturas registram um momento específico, e não dados atuais." : "Limites: produto em evolução. Código e testes demonstram a implementação, sem provar disponibilidade em produção."}</p>
            </details>
            <div className="mt-6 flex flex-wrap gap-2 sm:mt-7">{study.tags.map((tag) => <span key={tag} className="border border-cyan-100/[0.16] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#a5dff4]">{tag}</span>)}</div>
            <div className="mt-6 border-t sm:mt-7 border-cyan-100/[0.12] pt-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#67e8f9]">evidência verificável</p>
              <div className="mt-3 grid gap-2">
                {study.proofs.map((proof) => {
                  const Icon = proof.type === "code" ? Github : ArrowUpRight;
                  return (
                    <a
                      key={proof.label}
                      data-case-evidence="true"
                      href={proof.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackPortfolioEvent("case_study_evidence_opened", { caseId: study.id, evidenceType: proof.type })}
                      className="group flex min-h-12 items-center justify-between gap-4 border border-[#67e8f9]/25 bg-[#06172f]/70 px-4 py-3 transition-all hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
                    >
                      <span className="min-w-0">
                        <span className="block font-mono text-[9px] font-semibold uppercase tracking-[0.11em] text-[#e3fbff]">{proof.label}</span>
                        <span className="mt-1 block font-body text-sm leading-6 text-[#8fb6c9]">{proof.description}</span>
                      </span>
                      <Icon className="h-4 w-4 shrink-0 text-[#67e8f9] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" />
                    </a>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
