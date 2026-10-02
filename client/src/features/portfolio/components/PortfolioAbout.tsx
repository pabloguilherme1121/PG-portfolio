
type ResponsiveSourceSet = {
  avif: string;
  webp: string;
};

type PortfolioAboutProps = {
  portraitUrl: string;
  portraitResponsive: ResponsiveSourceSet;
};

export default function PortfolioAbout({
  portraitUrl,
  portraitResponsive,
}: PortfolioAboutProps) {
  return (
    <section id="sobre" className="relative border-t border-white/[0.07] bg-[#0a0f18]">
      <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.88fr_2.12fr]">
        <aside className="relative border-b border-white/[0.07] px-5 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-20">
          <div className="sticky top-28">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">Sobre</p>
            <p className="mt-5 max-w-[14rem] font-display text-2xl font-medium leading-tight text-white">Menos ruído. Mais contexto, uso e entrega.</p>
            <div className="mt-12 hidden h-40 w-px bg-[linear-gradient(#3b82f6,transparent)] lg:block" />
          </div>
        </aside>

        <div className="relative px-5 py-12 sm:px-8 lg:px-16 lg:py-20">
          <span className="absolute left-0 top-0 h-full w-px bg-[#3b82f6]/50" />
          <div className="grid gap-12 xl:grid-cols-[1.5fr_0.7fr] xl:gap-16">
            <div>
              <p className="font-display text-[clamp(2.3rem,4.6vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[#f4f8ff]">
                Não parto de uma tela. Parto do que precisa ficar mais simples para quem vai usar.
              </p>
              <div className="mt-9 max-w-2xl space-y-5 font-body text-base leading-8 text-[#b8c8df]">
                <p>Antes de escolher tecnologia ou formato, identifico o problema, a pessoa que vai usar a solução e a informação que precisa ganhar clareza. Depois organizo a experiência, desenvolvo, testo e publico.</p>
                <p>O Observatório é a prova mais completa desse processo: informação pública organizada em uma experiência navegável, com indicadores, dashboard e publicação real.</p>
              </div>

              <aside className="human-note mt-9 max-w-2xl p-5 sm:p-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#a5f3fc]">princípio de trabalho</p>
                <p className="mt-3 max-w-xl font-body text-lg leading-8 text-[#e6f8ff]">Clareza antes da complexidade: entender, estruturar, construir, publicar e melhorar.</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#91b9cd] light-muted-ink">processo / execução</p>
              </aside>

            </div>

            <div className="border-l border-white/10 pl-6 xl:mt-4">
              <figure className="relative mb-8 overflow-hidden border border-white/10 bg-[#0d1523]">
                <picture>
                  <source type="image/avif" srcSet={portraitResponsive.avif} sizes="(min-width: 640px) 448px, 100vw" />
                  <source type="image/webp" srcSet={portraitResponsive.webp} sizes="(min-width: 640px) 448px, 100vw" />
                  <img src={portraitUrl} alt="Pablo Guilherme" width="720" height="860" loading="lazy" decoding="async" className="h-64 w-full object-cover object-center saturate-[0.8] contrast-110 transition-transform duration-700 hover:scale-[1.03] sm:h-72" />
                </picture>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(6,8,13,0.92)_100%)]" />
                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 py-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#d9e8ff]">Pablo Guilherme</span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#6fa4ff]">perfil / 2026</span>
                </figcaption>
              </figure>

              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#7d94b8] light-muted-ink">coordenadas atuais</p>
              <dl className="mt-5 space-y-5">
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#7b91b3]">formação</dt>
                  <dd className="mt-1.5 font-body text-sm text-[#e7f0ff]">Análise e Desenvolvimento de Sistemas</dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#7b91b3]">interesse</dt>
                  <dd className="mt-1.5 font-body text-sm text-[#e7f0ff]">Produtos digitais, interfaces e informação</dd>
                </div>
                <div>
                  <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#7b91b3]">modo de trabalho</dt>
                  <dd className="mt-1.5 font-body text-sm text-[#e7f0ff]">Entender → estruturar → desenvolver → publicar</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
