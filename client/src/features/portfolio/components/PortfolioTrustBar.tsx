import { ArrowUpRight, BadgeCheck, Gauge, GitBranch } from "lucide-react";

const proofItems = [
  {
    eyebrow: "produção",
    title: "Observatório",
    description: "Dashboard público em produção, responsivo e navegável por indicadores.",
    href: "https://pabloguilherme01.github.io/observatorio/#dashboard",
    cta: "abrir",
    Icon: Gauge,
  },
  {
    eyebrow: "arquitetura",
    title: "Trajeto",
    description: "React, TypeScript, tRPC, Express e MySQL/Drizzle em evolução pública.",
    href: "https://github.com/Pabloguilherme01/trajeto-web",
    cta: "GitHub",
    Icon: GitBranch,
  },
  {
    eyebrow: "qualidade",
    title: "Entrega testada",
    description: "Typecheck, Vitest, Playwright, WebKit e deploy automatizado.",
    href: "#processo",
    cta: "processo",
    Icon: BadgeCheck,
  },
] as const;

export default function PortfolioTrustBar() {
  return (
    <section
      data-portfolio-trust-bar="true"
      aria-labelledby="portfolio-proof-title"
      className="border-y border-cyan-100/[0.09] bg-[#06101d] px-4 py-4 min-[360px]:px-5 sm:px-8 sm:py-5 lg:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.16em] text-[#67e8f9]">provas de execução</p>
            <h2 id="portfolio-proof-title" className="mt-1 font-display text-lg font-semibold tracking-[-0.035em] text-white sm:text-xl">
              Produto publicado, código público e qualidade verificável.
            </h2>
          </div>
          <p className="hidden max-w-md text-right font-body text-xs leading-5 text-[#7f9bb7] lg:block">
            O essencial para validar entrega antes de explorar o restante do portfólio.
          </p>
        </div>

        <div
          data-portfolio-proof-rail="true"
          aria-label="Provas verificáveis do portfólio"
          className="mt-3 grid overflow-hidden border border-white/[0.08] bg-white/[0.08] md:grid-cols-[1.15fr_1fr_0.85fr]"
        >
          {proofItems.map(({ eyebrow, title, description, href, cta, Icon }) => (
            <article
              key={title}
              data-portfolio-proof="true"
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-3 bg-[#071522] p-3 md:grid-cols-[auto_1fr] md:items-start md:p-4"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] border border-[#67e8f9]/20 bg-[#0b2746] text-[#67e8f9]">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>

              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3 className="font-display text-base font-semibold tracking-[-0.03em] text-white sm:text-lg">{title}</h3>
                  <span className="font-mono text-[7px] font-semibold uppercase tracking-[0.13em] text-[#7ea4bd]">{eyebrow}</span>
                </div>
                <p className="mt-1 font-body text-[11px] leading-4 text-[#a7bdd7] sm:text-xs sm:leading-5">{description}</p>
              </div>

              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="inline-flex min-h-11 items-center gap-1.5 self-center px-1 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#c9f8ff] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] md:col-start-2 md:min-h-9 md:justify-self-start md:px-0"
                aria-label={`${cta}: ${title}`}
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
