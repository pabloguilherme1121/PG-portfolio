import { caseStudies } from "@/features/portfolio/portfolioData";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { ArrowUpRight, CheckCircle2, Github } from "lucide-react";

export default function PortfolioCaseStudies() {
  return (
    <div className="mt-12 border-t border-cyan-100/[0.12] pt-8 sm:mt-16 sm:pt-10">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a5f3fc]">estudos de caso</p>
          <h3 className="mt-3 max-w-4xl font-display text-[clamp(2rem,3vw,3.5rem)] font-medium leading-none tracking-[-0.05em] text-white">
            Problema, decisão, implementação e prova.
          </h3>
        </div>
        <p className="max-w-md font-body text-sm leading-7 text-[#accddd]">
          Menos descrição genérica e mais evidência: o que precisava mudar, quais escolhas estruturaram a solução e o que pode ser verificado hoje.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-px border border-cyan-100/[0.1] bg-cyan-100/[0.1] sm:mt-8 sm:grid-cols-4" aria-label="Critérios usados nos estudos de caso">
        {["problema real", "decisões explícitas", "resultado verificável", "qualidade técnica"].map((item) => (
          <div key={item} className="flex min-h-14 items-center gap-2 bg-[#06172f] px-3 py-3 sm:px-4">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#67e8f9]" aria-hidden="true" />
            <span className="font-mono text-[8px] font-semibold uppercase leading-4 tracking-[0.1em] text-[#bcecff]">{item}</span>
          </div>
        ))}
      </div>

      <div className="mt-px grid gap-px bg-cyan-100/[0.1] xl:grid-cols-2">
        {caseStudies.map((study) => (
          <article key={study.id} data-case-study="true" className="relative min-w-0 bg-[#071326] p-4 min-[360px]:p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#67e8f9]">{study.id}</span>
              <span data-case-stage="true" className="rounded-full border border-[#67e8f9]/20 bg-[#08203b] px-2.5 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#bdf7ff]">
                {study.stage}
              </span>
            </div>

            <h4 className="mt-5 font-display text-[1.65rem] font-medium leading-tight tracking-[-0.04em] text-white sm:mt-7 sm:text-3xl">{study.title}</h4>
            <p className="mt-4 font-body text-sm leading-7 text-[#aac8da]">{study.context}</p>

            <div className="mt-6 border-l-2 border-[#38bdf8] bg-[#06172f] px-4 py-4">
              <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#67e8f9]">objetivo do produto</p>
              <p className="mt-2 font-body text-sm leading-7 text-[#e2f5ff]">{study.objective}</p>
            </div>

            <dl className="mt-6 grid gap-px bg-cyan-100/[0.1] sm:grid-cols-3">
              <div className="min-w-0 bg-[#06111f] p-4">
                <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">problema</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#c5deeb]">{study.problem}</dd>
              </div>
              <div className="min-w-0 bg-[#06111f] p-4">
                <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">decisões</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#c5deeb]">{study.decisions}</dd>
              </div>
              <div className="min-w-0 bg-[#06111f] p-4">
                <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">resultado</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#d9f4ff]">{study.result}</dd>
              </div>
            </dl>

            <div className="mt-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">sinais de qualidade</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {study.qualitySignals.map((signal) => (
                  <span key={signal} className="border border-[#67e8f9]/16 bg-[#06172f]/70 px-2 py-1 font-mono text-[8px] font-semibold uppercase tracking-[0.09em] text-[#a5dff4]">
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 border-t border-cyan-100/[0.12] pt-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">aprendizado</p>
              <p className="mt-2 font-body text-sm leading-7 text-[#c5deeb]">{study.learning}</p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {study.tags.map((tag) => (
                <span key={tag} className="border border-cyan-100/[0.16] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#a5dff4]">{tag}</span>
              ))}
            </div>

            <div className="mt-6 border-t border-cyan-100/[0.12] pt-5 sm:mt-7">
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
                        <span className="mt-1 block font-body text-xs leading-5 text-[#8fb6c9]">{proof.description}</span>
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
