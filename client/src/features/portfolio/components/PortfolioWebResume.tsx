import { ArrowUpRight, FileDown, Github, Mail, Printer } from "lucide-react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";

type PortfolioWebResumeProps = {
  resumeAvailable: boolean;
  resumeUrl: string;
};

const mediaUrl = `${import.meta.env.BASE_URL}portfolio-media/pg-site-vendendo-2026.mp4`;

export default function PortfolioWebResume({ resumeAvailable, resumeUrl }: PortfolioWebResumeProps) {
  function handlePrint() {
    trackPortfolioEvent("professional_resume_printed");
    window.print();
  }

  return (
    <section
      id="curriculo-web"
      data-web-resume="true"
      className="resume-print-root archive-chapter scroll-mt-24 border-t border-white/[0.07] bg-[#f5fbff] text-[#102033]"
      aria-labelledby="web-resume-title"
    >
      <div className="mx-auto max-w-[1120px] px-5 py-14 sm:px-8 sm:py-18 lg:px-12 lg:py-20">
        <div className="flex flex-col gap-6 border-b border-[#b8cfdd] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0e7490]">
              currículo web · versão verificável
            </p>
            <h2 id="web-resume-title" className="mt-3 font-display text-[clamp(2.6rem,5vw,5.2rem)] font-medium leading-[0.9] tracking-[-0.055em] text-[#071626]">
              Currículo profissional
            </h2>
            <p className="mt-4 max-w-2xl font-body text-base leading-7 text-[#365166]">
              Pablo Guilherme · produtos digitais, interfaces e dados. Formação em Análise e Desenvolvimento de Sistemas, com projetos públicos que demonstram produto, frontend, full-stack, testes e comunicação digital.
            </p>
          </div>

          <div data-print-hidden="true" className="flex flex-col gap-2 sm:min-w-[230px]">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#082f49] px-4 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.11em] text-white transition-colors hover:bg-[#0e7490] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0891b2]"
            >
              <Printer className="h-4 w-4" aria-hidden="true" />
              imprimir / salvar em PDF
            </button>
            {resumeAvailable && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#9ab7c9] px-4 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#164e63] hover:border-[#0e7490]"
              >
                <FileDown className="h-4 w-4" aria-hidden="true" />
                abrir PDF versionado
              </a>
            )}
          </div>
        </div>

        <div className="grid gap-10 py-9 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
          <aside className="space-y-8">
            <section aria-labelledby="resume-contact-title">
              <h3 id="resume-contact-title" className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0e7490]">Contato e presença</h3>
              <div className="mt-4 grid gap-3 text-sm">
                <a href="mailto:mpjcreator@gmail.com" className="inline-flex min-h-11 items-center gap-2 text-[#18384d] hover:text-[#0e7490]">
                  <Mail className="h-4 w-4" aria-hidden="true" /> mpjcreator@gmail.com
                </a>
                <a href="https://github.com/pabloguilherme1121" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-[#18384d] hover:text-[#0e7490]">
                  <Github className="h-4 w-4" aria-hidden="true" /> github.com/pabloguilherme1121
                </a>
              </div>
            </section>

            <section aria-labelledby="resume-education-title">
              <h3 id="resume-education-title" className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0e7490]">Formação</h3>
              <p className="mt-4 font-display text-xl tracking-[-0.03em] text-[#0b2235]">Análise e Desenvolvimento de Sistemas</p>
              <p className="mt-2 text-sm leading-6 text-[#536c7c]">Formação voltada ao desenvolvimento de software e produtos digitais.</p>
            </section>

            <section aria-labelledby="resume-stack-title">
              <h3 id="resume-stack-title" className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0e7490]">Stack demonstrada</h3>
              <p className="mt-4 text-sm leading-7 text-[#27475b]">
                React · TypeScript · Vite · tRPC · Express · MySQL · Drizzle · Zod · Vitest · Playwright · GitHub Actions
              </p>
            </section>

            <section aria-labelledby="resume-quality-title">
              <h3 id="resume-quality-title" className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0e7490]">Qualidade</h3>
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
              <h3 id="resume-profile-title" className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0e7490]">Perfil</h3>
              <p className="mt-4 max-w-3xl font-body text-[15px] leading-7 text-[#365166]">
                Trabalho na transformação de objetivos, informação e dados em produtos digitais claros: estruturo o problema, organizo o fluxo, desenvolvo a interface, valido o comportamento e publico uma versão que pode ser avaliada e evoluída.
              </p>
            </section>

            <section aria-labelledby="resume-capabilities-title">
              <h3 id="resume-capabilities-title" className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0e7490]">Capacidades demonstradas</h3>
              <div className="mt-4 grid gap-px bg-[#bfd1dc] sm:grid-cols-2">
                {[
                  ["Produto e estrutura", "Problema · fluxo · arquitetura de informação · priorização"],
                  ["Interface e frontend", "React · TypeScript · responsividade · acessibilidade"],
                  ["Full-stack e dados", "tRPC · Express · MySQL · Drizzle · Zod"],
                  ["Validação e publicação", "Vitest · Playwright · CI · GitHub Pages"],
                ].map(([title, text]) => (
                  <div key={title} className="bg-white p-4">
                    <p className="font-display text-lg tracking-[-0.03em] text-[#10283a]">{title}</p>
                    <p className="mt-2 font-mono text-[9px] uppercase leading-5 tracking-[0.08em] text-[#5e7483]">{text}</p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-labelledby="resume-projects-title">
              <h3 id="resume-projects-title" className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#0e7490]">Projetos selecionados</h3>
              <div className="mt-4 space-y-4">
                <article className="border border-[#bfd1dc] bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-[#0e7490]">produto em produção</p>
                      <h4 className="mt-2 font-display text-2xl tracking-[-0.04em] text-[#0b2235]">Observatório</h4>
                    </div>
                    <a href="https://pabloguilherme01.github.io/observatorio/#dashboard" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#0e7490]">
                      abrir Observatório <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#536c7c]">Produto publicado para organizar informação pública em uma experiência navegável com indicadores e dashboard.</p>
                </article>

                <article className="border border-[#bfd1dc] bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-[#0e7490]">produto full-stack em evolução</p>
                      <h4 className="mt-2 font-display text-2xl tracking-[-0.04em] text-[#0b2235]">Trajeto</h4>
                    </div>
                    <a href="https://github.com/Pabloguilherme01/trajeto-web" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#0e7490]">
                      ver Trajeto <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#536c7c]">Produto para decisões de rota e abastecimento com React/TypeScript, API tRPC/Express, MySQL/Drizzle, validação, testes e CI.</p>
                </article>

                <article className="border border-[#bfd1dc] bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-[#0e7490]">comunicação digital</p>
                      <h4 className="mt-2 font-display text-2xl tracking-[-0.04em] text-[#0b2235]">Peça vertical autoral</h4>
                    </div>
                    <a href={mediaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.1em] text-[#0e7490]">
                      assistir peça <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-[#536c7c]">Demonstração de mensagem, hierarquia visual e comunicação de uma proposta digital em formato vertical.</p>
                </article>
              </div>
            </section>
          </div>
        </div>

        <footer className="border-t border-[#b8cfdd] pt-5 font-mono text-[9px] uppercase leading-5 tracking-[0.09em] text-[#607788]">
          Conteúdo baseado em projetos e evidências públicas disponíveis neste portfólio. Sem métricas, cargos ou experiências inventadas.
        </footer>
      </div>
    </section>
  );
}
