import { ArrowUpRight, BadgeCheck, Gauge, GitBranch } from "lucide-react";

const proofItems = [
  {
    eyebrow: "produção",
    title: "Observatório",
    description: "Dashboard público publicado, com interface responsiva, fontes e navegação por indicadores.",
    href: "https://pabloguilherme01.github.io/observatorio/#dashboard",
    cta: "abrir Observatório",
    Icon: Gauge,
  },
  {
    eyebrow: "full-stack",
    title: "Trajeto",
    description: "Produto em evolução com React, TypeScript, tRPC, Express, MySQL/Drizzle, testes e CI.",
    href: "https://github.com/Pabloguilherme01/trajeto-web",
    cta: "ver Trajeto no GitHub",
    Icon: GitBranch,
  },
  {
    eyebrow: "qualidade",
    title: "Entrega testada",
    description: "Fluxos críticos cobertos por Playwright e Vitest, com typecheck, auditorias e publicação automatizada.",
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
      className="border-y border-cyan-100/[0.09] bg-[#06101d] px-4 py-5 min-[360px]:px-5 sm:px-8 sm:py-7 lg:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#67e8f9]">provas antes da promessa</p>
            <h2 id="portfolio-proof-title" className="mt-1 font-display text-xl font-semibold tracking-[-0.035em] text-white sm:text-2xl">
              Trabalho verificável, código público e entrega testada.
            </h2>
          </div>
          <p className="max-w-xl font-body text-xs leading-5 text-[#8fa8c7] sm:text-right">
            Três sinais rápidos para entender o nível de execução antes de explorar o restante do portfólio.
          </p>
        </div>

        <div data-portfolio-proof-rail="true" aria-label="Provas verificáveis do portfólio" className="-mx-1 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0">
          {proofItems.map(({ eyebrow, title, description, href, cta, Icon }) => (
            <article
              key={title}
              data-portfolio-proof="true"
              className="group flex w-[82%] min-w-[82%] shrink-0 snap-start flex-col border border-white/[0.08] bg-[#081827] p-4 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#67e8f9]/35 hover:bg-[#0a2034] motion-reduce:transform-none md:w-auto md:min-w-0 md:shrink"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#67e8f9]/20 bg-[#0b2746] text-[#67e8f9]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.13em] text-[#7ea4bd]">{eyebrow}</span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold tracking-[-0.035em] text-white">{title}</h3>
              <p className="mt-2 flex-1 font-body text-xs leading-5 text-[#a7bdd7]">{description}</p>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="mt-4 inline-flex min-h-11 items-center justify-between gap-3 border-t border-white/[0.08] pt-3 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#c9f8ff] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
              >
                {cta}
                <ArrowUpRight className="h-3.5 w-3.5 text-[#67e8f9]" aria-hidden="true" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
