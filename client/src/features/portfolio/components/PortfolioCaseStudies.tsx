import { repositories } from "@/features/portfolio/portfolioData";

const caseStudies = [...repositories]
  .filter((repository) => repository.caseStudy)
  .sort((first, second) => second.relevance - first.relevance)
  .slice(0, 3);

export default function PortfolioCaseStudies() {
  return (
    <section className="mt-16 border-t border-cyan-100/[0.12] pt-8 sm:pt-10" aria-labelledby="case-studies-title">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a5f3fc]">estudos de caso</p>
          <h3 id="case-studies-title" className="mt-3 font-display text-[clamp(2rem,3vw,3.5rem)] font-medium leading-none tracking-[-0.05em] text-white">
            Contexto, decisão e resultado.
          </h3>
        </div>
        <p className="max-w-sm font-body text-sm leading-7 text-[#accddd]">
          Três trabalhos com detalhes suficientes para entender o problema, a escolha de execução e o aprendizado de cada entrega.
        </p>
      </div>

      <div className="mt-8 grid gap-px bg-cyan-100/[0.1] lg:grid-cols-3">
        {caseStudies.map((project) => {
          const study = project.caseStudy!;
          return (
            <article key={project.id} className="relative bg-[#071326] p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#67e8f9]">{project.id}</span>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7899ae]">{project.kind === "video" ? "audiovisual" : "digital"}</span>
              </div>
              <h4 className="mt-6 font-display text-2xl font-medium tracking-[-0.04em] text-white">{project.name}</h4>
              <dl className="mt-6 grid gap-5 font-body text-sm leading-7 text-[#bcd9e7]">
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">contexto</dt>
                  <dd className="mt-1">{study.context}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">decisão</dt>
                  <dd className="mt-1">{study.decisions}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">resultado</dt>
                  <dd className="mt-1 text-[#d9f4ff]">{study.result}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
}
