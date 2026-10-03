import { ArrowUpRight, BadgeCheck, Gauge, GitBranch } from "lucide-react";

const proofItems = [
  {
    eyebrow: "produção",
    status: "LIVE",
    title: "Observatório",
    description: "Dashboard público publicado e navegável.",
    href: "https://pabloguilherme01.github.io/observatorio/#dashboard",
    cta: "abrir Observatório",
    Icon: Gauge,
  },
  {
    eyebrow: "full-stack",
    status: "CÓDIGO",
    title: "Trajeto",
    description: "React, TypeScript, tRPC, Express e banco relacional.",
    href: "https://github.com/Pabloguilherme01/trajeto-web",
    cta: "ver Trajeto",
    Icon: GitBranch,
  },
  {
    eyebrow: "qualidade",
    status: "CI",
    title: "Entrega testada",
    description: "Typecheck, Vitest, Playwright e publicação automatizada.",
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
      className="border-y border-cyan-100/[0.09] bg-[#06101d] px-4 py-4 min-[360px]:px-5 sm:px-8 sm:py-6 lg:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        <h2 id="portfolio-proof-title" className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-[#a5f3fc]">Provas verificáveis</h2>

        <div
          data-portfolio-proof-rail="true"
          aria-label="Provas verificáveis do portfólio"
          className="mt-3 grid grid-cols-1 gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] md:grid-cols-3"
        >
          {proofItems.map(({ eyebrow, status, title, description, href, cta, Icon }) => (
            <article key={title} data-portfolio-proof="true" className="min-w-0 bg-[#081827]">
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noreferrer" : undefined}
                className="group grid min-h-[84px] grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3 transition-colors hover:bg-[#0a2034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a5f3fc] md:min-h-[150px] md:grid-cols-1 md:content-between md:gap-2 md:p-4"
                aria-label={cta}
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#67e8f9]/20 bg-[#0b2746] text-[#67e8f9]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>

                <span className="min-w-0">
                  <span className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9fb6d0]">
                    <span>{eyebrow}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#67e8f9]">{status}</span>
                  </span>
                  <span className="mt-1 block font-display text-base font-semibold tracking-[-0.03em] text-white md:text-xl">
                    {title}
                  </span>
                  <span className="mt-1 block font-body text-sm leading-5 text-[#9fb6d0]">
                    {description}
                  </span>
                </span>

                <span className="inline-flex h-9 w-9 items-center justify-center text-[#67e8f9] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none md:h-auto md:w-auto md:justify-between md:border-t md:border-white/[0.08] md:pt-3">
                  <span className="hidden font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#c9f8ff] md:inline">
                    {cta}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
