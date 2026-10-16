import { useState } from "react";
import { ArrowUpRight, Copy, Github, Mail, Printer } from "lucide-react";
import "./professionalResume.css";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";

type PortfolioWebResumeProps = {
  embedded?: boolean;
};

const competencies = [
  {
    title: "Frontend",
    tools: "React · TypeScript · Vite · Tailwind CSS",
    detail:
      "Interfaces responsivas, componentes reutilizáveis e fluxos de navegação para celular e computador.",
    proof: "Aplicação: portfólio e interfaces dos projetos públicos.",
  },
  {
    title: "APIs e dados",
    tools: "tRPC · Express · MySQL · Drizzle · Zod",
    detail:
      "Contratos tipados, validação de entrada e organização da persistência para recursos de backend.",
    proof: "Aplicação: arquitetura e recursos opcionais do Trajeto.",
  },
  {
    title: "Qualidade",
    tools: "Vitest · Playwright · GitHub Actions",
    detail:
      "Testes unitários e de navegador, checagem de tipos e validação do build antes da publicação.",
    proof: "Aplicação: testes e pipelines dos repositórios públicos.",
  },
] as const;

export default function PortfolioWebResume({
  embedded = false,
}: PortfolioWebResumeProps) {
  const [activeCompetency, setActiveCompetency] = useState(0);

  const [copyMessage, setCopyMessage] = useState("");
  async function handleCopyEmail() {
    try {
      await navigator.clipboard.writeText("mpjcreator@gmail.com");
      setCopyMessage("E-mail copiado.");
    } catch {
      setCopyMessage(
        "Não foi possível copiar. Selecione mpjcreator@gmail.com ou use Entrar em contato."
      );
    }
  }

  function handlePrint() {
    trackPortfolioEvent("professional_resume_printed");
    window.print();
  }

  return (
    <section
      id={embedded ? undefined : "curriculo-web"}
      data-web-resume="true"
      className="professional-resume resume-print-root archive-chapter scroll-mt-24 border-t border-white/[0.07] bg-[#f5fbff] text-[#102033]"
      aria-labelledby="web-resume-title"
    >
      <div className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
        <div className="flex flex-col gap-6 border-b border-[#b8cfdd] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#0e7490]">
              Currículo profissional · desenvolvimento web
            </p>
            <h2
              id="web-resume-title"
              aria-label="Currículo profissional de Pablo Guilherme"
              className="mt-3 font-display text-[clamp(2.6rem,5vw,5.2rem)] font-medium leading-[1.05] tracking-[-0.055em] text-[#071626]"
            >
              Pablo Guilherme
            </h2>
            <p className="mt-4 max-w-2xl font-body text-base leading-7 text-[#365166]">
              Estudante de Análise e Desenvolvimento de Sistemas. Desenvolvo
              interfaces web com React e TypeScript, com atenção à experiência
              mobile, acessibilidade e testes.
            </p>
          </div>

          <div
            data-print-hidden="true"
            className="flex flex-col gap-2 sm:min-w-[230px]"
          >
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#082f49] px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:bg-[#0e7490] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0891b2]"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              imprimir / salvar em PDF
            </button>
            <a
              href="mailto:mpjcreator@gmail.com"
              className="resume-contact-action"
            >
              <Mail className="h-4 w-4" aria-hidden="true" /> Entrar em contato
            </a>
            <button
              type="button"
              onClick={handleCopyEmail}
              className="resume-contact-action"
            >
              <Copy className="h-4 w-4" aria-hidden="true" /> Copiar e-mail
            </button>
            <p role="status" className="resume-copy-feedback">
              {copyMessage}
            </p>
          </div>
        </div>

        <div className="grid gap-10 py-9 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <aside className="space-y-8">
            <section aria-labelledby="resume-contact-title">
              <h3
                id="resume-contact-title"
                className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#0e7490]"
              >
                Contato e presença
              </h3>
              <div className="mt-4 grid gap-3 text-sm">
                <a
                  href="mailto:mpjcreator@gmail.com"
                  className="inline-flex min-h-11 items-center gap-2 text-[#18384d] hover:text-[#0e7490]"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />{" "}
                  mpjcreator@gmail.com
                </a>
                <a
                  href="https://github.com/pabloguilherme1121"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-[#18384d] hover:text-[#0e7490]"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />{" "}
                  github.com/pabloguilherme1121
                </a>
              </div>
            </section>

            <section aria-labelledby="resume-education-title">
              <h3
                id="resume-education-title"
                className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#0e7490]"
              >
                Formação
              </h3>
              <p className="mt-4 font-display text-xl tracking-[-0.03em] text-[#0b2235]">
                Análise e Desenvolvimento de Sistemas
              </p>
              <p className="mt-2 text-sm leading-6 text-[#536c7c]">
                Em andamento · desenvolvimento de software e aplicações web.
              </p>
            </section>

            <section aria-labelledby="resume-stack-title">
              <h3
                id="resume-stack-title"
                className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#0e7490]"
              >
                Tecnologias aplicadas
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#27475b]">
                React · TypeScript · Vite · tRPC · Express · MySQL · Drizzle ·
                Zod · Vitest · Playwright · GitHub Actions
              </p>
            </section>

            <section aria-labelledby="resume-quality-title">
              <h3
                id="resume-quality-title"
                className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#0e7490]"
              >
                Qualidade
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-6 text-[#536c7c]">
                <li>Typecheck e testes automatizados</li>
                <li>Validação em navegador com Playwright</li>
                <li>Interface responsiva e acessibilidade</li>
                <li>CI, build e publicação automatizada</li>
              </ul>
            </section>
          </aside>

          <div className="space-y-9">
            <section aria-labelledby="resume-profile-title">
              <h3
                id="resume-profile-title"
                className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#0e7490]"
              >
                Perfil
              </h3>
              <p className="mt-4 max-w-3xl font-body text-[15px] leading-7 text-[#365166]">
                Foco em desenvolvimento frontend e aplicações web. Nos meus
                projetos, organizo fluxos, implemento interfaces, integro dados
                e valido o comportamento com testes automatizados. Busco aplicar
                essa prática em oportunidades de desenvolvimento de software.
              </p>
            </section>

            <section aria-labelledby="resume-capabilities-title">
              <h3
                id="resume-capabilities-title"
                className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#0e7490]"
              >
                Competências técnicas
              </h3>
              <div
                className="resume-competency-controls"
                role="group"
                aria-label="Explorar competências"
                data-print-hidden="true"
              >
                {competencies.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-pressed={activeCompetency === index}
                    aria-controls="resume-competency-detail"
                    onClick={() => setActiveCompetency(index)}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <div
                id="resume-competency-detail"
                className="resume-competency-detail"
                role="status"
                data-print-hidden="true"
              >
                <p className="font-semibold">
                  {competencies[activeCompetency].tools}
                </p>
                <p>{competencies[activeCompetency].detail}</p>
                <p className="text-sm">
                  {competencies[activeCompetency].proof}
                </p>
              </div>
              <ul className="resume-competency-summary">
                {competencies.map(item => (
                  <li key={item.title}>
                    <strong>{item.title}</strong>
                    <span>{item.tools}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="resume-projects-title">
              <h3
                id="resume-projects-title"
                className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#0e7490]"
              >
                Experiência em projetos próprios
              </h3>
              <div className="mt-4 space-y-4">
                <article className="border border-[#bfd1dc] bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.11em] text-[#0e7490]">
                        produto em produção
                      </p>
                      <h4 className="mt-2 font-display text-2xl tracking-[-0.04em] text-[#0b2235]">
                        Observatório
                      </h4>
                    </div>
                    <a
                      href="https://pabloguilherme01.github.io/observatorio/#dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-[#0e7490]"
                    >
                      abrir Observatório{" "}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#536c7c]">
                    Dashboard de indicadores públicos de Águas Lindas.
                    Organização da informação, filtros e acesso às fontes em uma
                    interface responsiva.
                  </p>
                </article>

                <article className="border border-[#bfd1dc] bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.11em] text-[#0e7490]">
                        utilidade pública e mobilidade
                      </p>
                      <h4 className="mt-2 font-display text-2xl tracking-[-0.04em] text-[#0b2235]">
                        Trajeto
                      </h4>
                    </div>
                    <a
                      href="https://pabloguilherme01.github.io/trajeto-web/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.1em] text-[#0e7490]"
                    >
                      ver Trajeto{" "}
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#536c7c]">
                    Plataforma para encontrar serviços locais, contatos úteis,
                    rotas e abastecimento em Águas Lindas e no Entorno do DF.
                    Consulta pública sem cadastro e preparação para uso offline.
                  </p>
                </article>
              </div>
            </section>
          </div>
        </div>

        <footer className="border-t border-[#b8cfdd] pt-5 font-mono text-xs uppercase leading-5 tracking-[0.09em] text-[#607788]">
          Pablo Guilherme · Águas Lindas de Goiás, GO · mpjcreator@gmail.com
        </footer>
      </div>
    </section>
  );
}
