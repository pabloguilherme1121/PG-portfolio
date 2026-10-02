import { ArrowUpRight, BadgeCheck, BookOpenText, Gamepad2, Gauge } from "lucide-react";
import { caseStudies } from "@/features/portfolio/portfolioData";
import { arcadeGames } from "@/features/portfolio/utils/arcadeSession";

const publishedProducts = new Set(
  caseStudies.flatMap((study) =>
    study.proofs
      .filter((proof) => proof.type === "live")
      .map((proof) => proof.href),
  ),
).size;

const signals = [
  {
    value: String(caseStudies.length),
    label: "cases",
    detail: "decisões e provas",
    href: "#estudos-de-caso",
    ariaLabel: `${caseStudies.length} cases documentados`,
    Icon: BookOpenText,
  },
  {
    value: String(publishedProducts),
    label: "produto publicado",
    detail: "Observatório ao vivo",
    href: "https://pabloguilherme01.github.io/observatorio/#dashboard",
    ariaLabel: `${publishedProducts} produto publicado — Observatório publicado`,
    Icon: Gauge,
  },
  {
    value: String(arcadeGames.length),
    label: "jogos",
    detail: "PG Arcade",
    href: "#pg-lab",
    ariaLabel: `${arcadeGames.length} jogos no PG Arcade`,
    Icon: Gamepad2,
  },
  {
    value: "CI",
    label: "+ testes",
    detail: "qualidade automatizada",
    href: "#qualidade",
    ariaLabel: "CI e testes automatizados",
    Icon: BadgeCheck,
  },
] as const;

export default function PortfolioHomeSignalStrip() {
  return (
    <div
      data-home-signal-strip="true"
      aria-label="Resumo verificável do portfólio"
      className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-white/[0.1] bg-white/[0.1] sm:grid-cols-4"
    >
      {signals.map(({ value, label, detail, href, ariaLabel, Icon }) => {
        const external = href.startsWith("http");

        return (
          <a
            key={ariaLabel}
            data-home-signal="true"
            href={href}
            aria-label={ariaLabel}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className="group flex min-h-[74px] min-w-0 items-center gap-3 bg-[#071326]/94 px-3 py-3 transition-colors hover:bg-[#0a2034] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a5f3fc] sm:min-h-[82px] sm:px-4"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] border border-[#67e8f9]/20 bg-[#0b2746] text-[#67e8f9]">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline gap-1.5">
                <strong className="font-display text-xl font-semibold tracking-[-0.04em] text-white sm:text-2xl">{value}</strong>
                <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#a5f3fc]">{label}</span>
              </span>
              <span className="mt-0.5 block truncate font-body text-[11px] leading-4 text-[#8fa8c7] sm:text-xs">{detail}</span>
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#67e8f9] opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
