import { ArrowDownRight, Download } from "lucide-react";

type PortfolioAboutProps = {
  resumeAvailable: boolean;
  resumeUrl: string;
};

export default function PortfolioAbout({ resumeAvailable, resumeUrl }: PortfolioAboutProps) {
  return (
    <section id="sobre" className="relative border-t border-white/[0.07] bg-[#0a0f18]">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.88fr_2.12fr]">
        <aside className="relative border-b border-white/[0.07] px-5 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-20">
          <div className="sticky top-28">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">Sobre</p>
            <p className="mt-5 max-w-[14rem] font-display text-2xl font-medium leading-tight text-white">
              Tecnologia com repertório visual.
            </p>
            <div className="mt-12 hidden h-40 w-px bg-[linear-gradient(#3b82f6,transparent)] lg:block" />
          </div>
        </aside>

        <div className="relative px-5 py-12 sm:px-8 lg:px-16 lg:py-20">
          <span className="absolute left-0 top-0 h-full w-px bg-[#3b82f6]/50" />
          <div className="grid gap-10 xl:grid-cols-[1.35fr_0.65fr] xl:gap-14">
            <div>
              <p className="font-display text-[clamp(2.3rem,4.6vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[#f4f8ff]">
                Construo na interseção entre desenvolvimento, produto e comunicação visual.
              </p>
              <div className="mt-9 max-w-2xl space-y-5 font-body text-base leading-8 text-[#b8c8df]">
                <p>
                  Meu processo começa pelo problema: entender o contexto, organizar prioridades e escolher a solução mais clara para quem vai usar ou assistir.
                </p>
                <p>
                  No digital, trabalho com interfaces e desenvolvimento web. No audiovisual, com conteúdo, captação e edição. O objetivo em ambos é o mesmo: execução cuidadosa e comunicação direta.
                </p>
              </div>

              <aside className="human-note mt-9 max-w-2xl p-5 sm:p-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#a5f3fc]">princípio de trabalho</p>
                <p className="mt-3 max-w-xl font-body text-lg leading-8 text-[#e6f8ff]">
                  Clareza antes do excesso: entender, construir, testar e melhorar.
                </p>
              </aside>

              {resumeAvailable && (
                <a
                  href={resumeUrl}
                  download="portfolio-pablo-guilherme.pdf"
                  className="group mt-9 inline-flex w-full max-w-md items-center justify-between border border-[#67e8f9]/45 bg-[#0b1d2e] px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#102a3b] hover:shadow-[0_12px_30px_rgba(14,116,144,0.28)] sm:w-auto sm:min-w-[320px]"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center bg-[#3b82f6] text-white">
                      <Download className="h-4 w-4" />
                    </span>
                    <span className="text-left">
                      <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white">Baixar portfólio em PDF</span>
                      <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.11em] text-[#9edce9]">perfil profissional · links clicáveis</span>
                    </span>
                  </span>
                  <ArrowDownRight className="h-4 w-4 text-[#70a6ff]" />
                </a>
              )}
            </div>

            <dl className="grid content-start gap-px bg-white/[0.1]">
              <div className="bg-[#0d1523] p-5">
                <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#7b91b3]">formação</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#e7f0ff]">Análise e Desenvolvimento de Sistemas</dd>
              </div>
              <div className="bg-[#0d1523] p-5">
                <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#7b91b3]">stack principal</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#e7f0ff]">React · TypeScript · Vite · HTML · CSS</dd>
              </div>
              <div className="bg-[#0d1523] p-5">
                <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#7b91b3]">diferencial</dt>
                <dd className="mt-2 font-body text-sm leading-6 text-[#e7f0ff]">Desenvolvimento web com repertório de conteúdo e audiovisual.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
