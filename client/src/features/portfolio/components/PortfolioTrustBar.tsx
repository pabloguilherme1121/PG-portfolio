import { ArrowUpRight, BadgeCheck, Gauge, GitBranch } from "lucide-react";

const proofItems = [
  {
    eyebrow: "produto publicado",
    title: "Observatório",
    description: "Dashboard público em produção.",
    href: "https://pabloguilherme01.github.io/observatorio/#dashboard",
    cta: "abrir produto",
    Icon: Gauge,
  },
  {
    eyebrow: "código público",
    title: "Trajeto",
    description: "Produto full-stack em evolução.",
    href: "https://github.com/Pabloguilherme01/trajeto-web",
    cta: "ver código",
    Icon: GitBranch,
  },
  {
    eyebrow: "qualidade",
    title: "Processo testado",
    description: "Typecheck, Vitest, Playwright e CI.",
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
      className="border-y border-cyan-100/[0.09] bg-[#06101d] px-4 py-4 min-[360px]:px-5 sm:px-8 sm:py-5 lg:px-12"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <div>
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">provas verificáveis</p>
            <h2 id="portfolio-proof-title" className="mt-1 font-display text-lg font-semibold tracking-[-0.03em] text-white sm:text-xl">
              Produto, código e processo que você pode abrir.
            </h2>
          </div>
          <p className="max-w-lg font-body text-xs leading-5 text-[#8fa8c7] sm:text-right">
            Três atalhos para validar execução antes de seguir pela página.
          </p>
        </div>

        <div
          data-portfolio-proof-rail="true"
          aria-label="Provas verificáveis do portfólio"
          className="-mx-1 mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1.5 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0"
        >
          {proofItems.map(({ eyebrow, title, description, href, cta, Icon }) => (
            <a
              key={title}
              data-portfolio-proof="true"
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex min-h-[116px] w-[76%] min-w-[76%] shrink-0 snap-start flex-col justify-between border border-white/[0.08] bg-[#081827] p-3.5 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-[#67e8f9]/35 hover:bg-[#0a2034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transform-none md:w-auto md:min-w-0 md:shrink"
            >
              <span className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#67e8f9]/20 bg-[#0b2746] text-[#67e8f9]">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-mono text-[8px] font-semibold uppercase tracking-[0.11em] text-[#7ea4bd]">{eyebrow}</span>
                  <span className="mt-1 block font-display text-lg font-semibold tracking-[-0.03em] text-white">{title}</span>
                  <span className="mt-1 block font-body text-xs leading-4 text-[#a7bdd7]">{description}</span>
                </span>
              </span>
              <span className="mt-3 inline-flex items-center justify-between gap-3 border-t border-white/[0.08] pt-2.5 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-[#c9f8ff]">
                {cta}
                <ArrowUpRight className="h-3.5 w-3.5 text-[#67e8f9] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
