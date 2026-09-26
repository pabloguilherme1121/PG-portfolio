import { ArrowUpRight, Clapperboard, FileText, Github, Mail, Route, ShieldCheck, SquareChartGantt } from "lucide-react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";

const portfolioMediaPath = (file: string) => `${import.meta.env.BASE_URL}portfolio-media/${file}`;

const opportunityEmailUrl =
  "mailto:mpjcreator@gmail.com?subject=Oportunidade%20profissional%20-%20Pablo%20Guilherme&body=Ol%C3%A1%2C%20Pablo.%20Vi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar%20sobre%20uma%20oportunidade%20profissional.";

export default function PortfolioProfessionalSnapshot() {
  const proofs = [
    {
      id: "resume",
      label: "Currículo",
      title: "Abrir currículo web",
      text: "Versão verificável e imprimível com formação, stack, projetos e contato.",
      href: "#curriculo-web",
      external: false,
      Icon: FileText,
      available: true,
    },
    {
      id: "github",
      label: "Código",
      title: "Ver GitHub",
      text: "Repositórios públicos e histórico técnico verificável.",
      href: "https://github.com/pabloguilherme1121",
      external: true,
      Icon: Github,
      available: true,
    },
    {
      id: "product",
      label: "Produto publicado",
      title: "Ver Observatório",
      text: "Dashboard navegável em produção, fora do próprio portfólio.",
      href: "https://pabloguilherme01.github.io/observatorio/#dashboard",
      external: true,
      Icon: SquareChartGantt,
      available: true,
    },
    {
      id: "fullstack",
      label: "Produto full-stack",
      title: "Ver Trajeto",
      text: "Produto em evolução com frontend, API, persistência, testes e CI em código público.",
      href: "https://github.com/Pabloguilherme01/trajeto-web",
      external: true,
      Icon: Route,
      available: true,
    },
    {
      id: "media",
      label: "Comunicação",
      title: "Assistir peça",
      text: "Peça vertical autoral que demonstra mensagem, hierarquia e comunicação de uma proposta digital.",
      href: portfolioMediaPath("pg-site-vendendo-2026.mp4"),
      external: true,
      Icon: Clapperboard,
      available: true,
    },
    {
      id: "quality",
      label: "Qualidade",
      title: "Ver qualidade",
      text: "TypeScript, testes, browser checks, mobile e acessibilidade.",
      href: "#qualidade",
      external: false,
      Icon: ShieldCheck,
      available: true,
    },
  ] as const;

  return (
    <section
      id="perfil-profissional"
      data-professional-snapshot="true"
      className="archive-chapter scroll-mt-24 border-t border-white/[0.07] bg-[#06101d]"
      aria-labelledby="professional-snapshot-title"
    >
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a5f3fc]">
              para recrutadores e times
            </p>
            <h2
              id="professional-snapshot-title"
              className="mt-4 max-w-xl font-display text-[clamp(2.6rem,4.6vw,5rem)] font-medium leading-[0.92] tracking-[-0.06em] text-white"
            >
              Avaliação profissional, sem caça ao tesouro.
            </h2>
            <p className="mt-6 max-w-xl font-body text-base leading-8 text-[#b8d3e6]">
              Currículo, código, produto publicado, desenvolvimento full-stack, comunicação e sinais de qualidade reunidos em uma leitura curta para quem está avaliando perfil, processo e capacidade de entrega.
            </p>

            <dl className="mt-8 grid gap-px border border-white/[0.1] bg-white/[0.1] sm:grid-cols-2">
              <div className="bg-[#081523] p-4">
                <dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#718ca4]">formação</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#e4f3fb]">Análise e Desenvolvimento de Sistemas</dd>
              </div>
              <div className="bg-[#081523] p-4">
                <dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#718ca4]">foco</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#e4f3fb]">Produtos digitais · interfaces · dados</dd>
              </div>
              <div className="bg-[#081523] p-4">
                <dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#718ca4]">stack demonstrada</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#e4f3fb]">React · TypeScript · tRPC</dd>
              </div>
              <div className="bg-[#081523] p-4">
                <dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#718ca4]">validação</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#e4f3fb]">Unitários · Playwright · build publicado</dd>
              </div>
            </dl>

            <a
              href={opportunityEmailUrl}
              onClick={() => trackPortfolioEvent("professional_contact_clicked")}
              className="group mt-7 inline-flex min-h-12 w-full items-center justify-between gap-4 bg-[#38bdf8] px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-all hover:-translate-y-0.5 hover:bg-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:w-auto"
            >
              <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" aria-hidden="true" /> falar sobre oportunidade</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" />
            </a>
          </div>

          <div className="grid gap-px bg-cyan-100/[0.12] sm:grid-cols-2 xl:grid-cols-3">
            {proofs.map(({ id, label, title, text, href, external, Icon }) => {
              const className =
                "group flex min-h-[190px] flex-col justify-between bg-[#071326] p-5 transition-colors hover:bg-[#0a1d33] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a5f3fc] sm:p-6";

              return (
                <a
                  key={id}
                  data-professional-proof="true"
                  data-professional-proof-id={id}
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  onClick={() => trackPortfolioEvent("professional_evidence_opened", { professionalEvidence: id })}
                  className={className}
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <Icon className="h-5 w-5 text-[#67e8f9]" aria-hidden="true" />
                      <ArrowUpRight className="h-4 w-4 text-[#5d7892] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" />
                    </div>
                    <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#77a9fc]">{label}</p>
                    <p className="mt-2 font-display text-2xl tracking-[-0.04em] text-white">{title}</p>
                  </div>
                  <p className="mt-5 font-body text-xs leading-5 text-[#9db8ca]">{text}</p>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
