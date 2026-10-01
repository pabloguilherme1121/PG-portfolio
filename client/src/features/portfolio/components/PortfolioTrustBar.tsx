import { ArrowUpRight, BadgeCheck, Gauge, GitBranch } from "lucide-react";

const proofItems = [
  {
    eyebrow: "produto em produção",
    title: "Observatório",
    description: "Dashboard público com dados contextualizados, interface responsiva e acesso às fontes.",
    href: "https://pabloguilherme01.github.io/observatorio/#dashboard",
    cta: "abrir produto",
    Icon: Gauge,
  },
  {
    eyebrow: "full-stack",
    title: "Trajeto",
    description: "Produto em evolução com frontend, API, banco, testes e CI documentados em código público.",
    href: "https://github.com/Pabloguilherme01/trajeto-web",
    cta: "ver código",
    Icon: GitBranch,
  },
  {
    eyebrow: "qualidade",
    title: "Entrega testada",
    description: "Typecheck, Vitest, Playwright, auditoria de dependências e publicação automatizada.",
    href: "#processo",
    cta: "ver processo",
    Icon: BadgeCheck,
  },
] as const;

export default function PortfolioTrustBar() {
  return (
    <section
      data-portfolio-trust-bar="true"
      aria-labelledby="portfolio-proof-title"
      className="border-y border-cyan-100/[0.09] bg-[#06101d] px-4 py-6 min-[360px]:px-5 sm:px-8 sm:py-9 lg:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="grid gap-3 border-b border-white/[0.08] pb-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:items-end sm:pb-6">
          <h2 id="portfolio-proof-title" className="font-display text-[clamp(1.75rem,4vw,3.2rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white">
            Provas que você pode abrir.
          </h2>
          <p className="max-w-2xl font-body text-sm leading-6 text-[#9fb8cf] sm:justify-self-end sm:text-right">
            Produto publicado, código público e processo testado — uma camada de evidência, sem repetir a mesma promessa pela página.
          </p>
        </div>

        <div
          data-portfolio-proof-rail="true"
          aria-label="Provas verificáveis do portfólio"
          className="-mx-1 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2 md:mx-0 md:grid md:grid-cols-[1.25fr_0.75fr] md:grid-rows-2 md:gap-3 md:overflow-visible md:px-0 md:pb-0"
        >
          {proofItems.map(({ eyebrow, title, description, href, cta, Icon }, index) => (
            <article
              key={title}
              data-portfolio-proof="true"
              data-portfolio-proof-primary={index === 0 ? "true" : undefined}
              className={`group flex w-[86%] min-w-[86%] shrink-0 snap-start flex-col border border-white/[0.08] bg-[#081827] p-4 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#67e8f9]/35 hover:bg-[#0a2034] motion-reduce:transform-none md:w-auto md:min-w-0 md:shrink md:snap-none ${index === 0 ? "md:row-span-2 md:min-h-[250px] md:p-6" : "md:min-h-[118px] md:grid md:grid-cols-[auto_1fr_auto] md:items-center md:gap-x-4 md:p-4"}`}
            >
              <div className={`flex items-center justify-between gap-3 ${index === 0 ? "" : "md:contents"}`}>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#67e8f9]/20 bg-[#0b2746] text-[#67e8f9]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className={`font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-[#7ea4bd] ${index === 0 ? "" : "md:col-start-2 md:row-start-1 md:self-end"}`}>{eyebrow}</span>
              </div>
              <div className={index === 0 ? "" : "md:col-start-2 md:row-start-2"}>
                <h3 className={`font-display font-semibold tracking-[-0.035em] text-white ${index === 0 ? "mt-5 text-3xl sm:text-4xl" : "mt-4 text-xl md:mt-0"}`}>{title}</h3>
                <p className={`font-body text-[#a7bdd7] ${index === 0 ? "mt-3 max-w-xl text-sm leading-6" : "mt-2 text-xs leading-5 md:mt-1"}`}>{description}</p>
              </div>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className={`inline-flex min-h-11 items-center gap-3 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#c9f8ff] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${index === 0 ? "mt-auto border-t border-white/[0.08] pt-4" : "mt-4 border-t border-white/[0.08] pt-3 md:col-start-3 md:row-span-2 md:row-start-1 md:mt-0 md:border-0 md:pt-0"}`}
              >
                {cta}
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#67e8f9]" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
