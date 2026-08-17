import { ArrowDownRight, ArrowUpRight, Download } from "lucide-react";
import { caseStudies, processSteps, repertoireSignals, serviceOffers, skillTracks } from "../portfolioData";

type ResponsiveSourceSet = {
  avif: string;
  webp: string;
};

type PortfolioNarrativeProps = {
  markUrl: string;
  portraitUrl: string;
  portraitResponsive: ResponsiveSourceSet;
  resumeUrl: string;
  textureUrl: string;
  textureResponsive: ResponsiveSourceSet;
  isDesktopViewport: boolean;
};

export function PortfolioNarrative({
  markUrl,
  portraitUrl,
  portraitResponsive,
  resumeUrl,
  textureUrl,
  textureResponsive,
  isDesktopViewport,
}: PortfolioNarrativeProps) {
  return (
    <>
        <section id="sobre" className="relative border-t border-white/[0.07] bg-[#0a0f18]">
              <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.88fr_2.12fr]">
                <aside className="relative border-b border-white/[0.07] px-5 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-20">
                  <div className="sticky top-28">
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">02 / manifesto</p>
                    <p className="mt-5 max-w-[14rem] font-display text-2xl font-medium leading-tight text-white">Um repertório em construção.</p>
                    <div className="mt-12 hidden h-40 w-px bg-[linear-gradient(#3b82f6,transparent)] lg:block" />
                  </div>
                </aside>
                <div className="relative px-5 py-12 sm:px-8 lg:px-16 lg:py-20">
                  <span className="absolute left-0 top-0 h-full w-px bg-[#3b82f6]/50" />
                  <div className="grid gap-12 xl:grid-cols-[1.5fr_0.7fr] xl:gap-16">
                    <div>
                      <p className="font-display text-[clamp(2.3rem,4.6vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[#f4f8ff]">
                          Tecnologia, conteúdo e imagem se encontram para dar forma a projetos que precisam ser entendidos, vistos e lembrados.
                      </p>
                      <div className="mt-9 max-w-2xl space-y-5 font-body text-base leading-8 text-[#b8c8df]">
                        <p>O ponto de partida é sempre o mesmo: entender o problema, organizar a ideia e escolher a linguagem que faz sentido para quem vai receber.</p>
                        <p>O repertório reúne interfaces, conteúdo vertical, captação terrestre e imagens aéreas — frentes diferentes que se fortalecem quando trabalham juntas.</p>
                      </div>
                      <aside className="human-note mt-9 max-w-2xl p-5 sm:p-6">
                        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#a5f3fc]">nota de direção</p>
                        <p className="mt-3 max-w-xl font-body text-lg leading-8 text-[#e6f8ff]">“Um bom projeto não precisa começar pronto. Precisa de clareza para dar o próximo passo.”</p>
                        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#91b9cd] light-muted-ink">— direção e processo</p>
                      </aside>
                      <a
                        href={resumeUrl}
                        download="portfolio-pablo-guilherme.pdf"
                        className="group mt-9 inline-flex w-full max-w-md items-center justify-between border border-[#67e8f9]/45 bg-[#0b1d2e] px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#102a3b] hover:shadow-[0_12px_30px_rgba(14,116,144,0.28)] sm:w-auto sm:min-w-[320px]"
                      >
                        <span className="flex items-center gap-3">
                          <span className="grid h-9 w-9 place-items-center bg-[#3b82f6] text-white transition-transform duration-200 group-hover:scale-[1.03]"><Download className="h-4 w-4" /></span>
                          <span className="text-left">
                            <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white">Baixar portfólio</span>
                            <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.11em] text-[#9edce9]">PDF · perfil profissional · links clicáveis</span>
                          </span>
                        </span>
                        <ArrowDownRight className="h-4 w-4 text-[#70a6ff] transition-transform duration-200 group-hover:translate-y-1" />
                      </a>
                    </div>
                    <div className="border-l border-white/10 pl-6 xl:mt-4">
                      <figure className="relative mb-8 overflow-hidden border border-white/10 bg-[#0d1523]">
                        <picture><source type="image/avif" srcSet={portraitResponsive.avif} sizes="(min-width: 640px) 448px, 100vw" /><source type="image/webp" srcSet={portraitResponsive.webp} sizes="(min-width: 640px) 448px, 100vw" /><img src={portraitUrl} alt="Pablo Guilherme" width="720" height="860" loading="lazy" decoding="async" className="h-64 w-full object-cover object-center saturate-[0.8] contrast-110 transition-transform duration-700 hover:scale-[1.03] sm:h-72" /></picture>
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(6,8,13,0.92)_100%)]" />
                        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 py-3">
                          <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#d9e8ff]">Pablo Guilherme</span>
                          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#6fa4ff]">perfil / 2026</span>
                        </figcaption>
                      </figure>
                      <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#7d94b8] light-muted-ink">coordenadas atuais</p>
                      <dl className="mt-5 space-y-5">
                        <div>
                          <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#536887]">formação</dt>
                          <dd className="mt-1.5 font-body text-sm text-[#e7f0ff]">Estudante de Tecnologia da Informação</dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#536887]">interesse</dt>
                          <dd className="mt-1.5 font-body text-sm text-[#e7f0ff]">Tecnologia, conteúdo e audiovisual</dd>
                        </div>
                        <div>
                          <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#536887]">modo de trabalho</dt>
                          <dd className="mt-1.5 font-body text-sm text-[#e7f0ff]">Criatividade, prática e melhoria contínua</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </section>
    
            <section id="trilha" className="archive-chapter relative overflow-hidden border-t border-white/[0.07] bg-[#070a10] py-16 sm:py-24 lg:py-32">
              {isDesktopViewport && <picture className="pointer-events-none absolute inset-0 block"><source type="image/avif" srcSet={textureResponsive.avif} sizes="100vw" /><source type="image/webp" srcSet={textureResponsive.webp} sizes="100vw" /><img src={textureUrl} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-[0.13] mix-blend-screen" /></picture>}
              <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
                <div className="grid gap-8 lg:grid-cols-[0.85fr_1.4fr] lg:gap-20">
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">03 / frentes de atuação</p>
                    <div className="flex items-center gap-3"><img src={markUrl} alt="" width="28" height="28" loading="lazy" decoding="async" className="h-7 w-7 object-contain opacity-80" /><span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">PG / caderno de prática</span></div><h2 className="mt-5 max-w-md font-display text-[clamp(2.4rem,4vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">O que estou aprendendo a fazer bem.</h2>
                    <p className="mt-6 max-w-sm font-body text-base leading-7 text-[#b6d7eb]">As frentes se complementam: lógica e presença, tela e câmera, detalhe e visão geral.</p><div className="mt-8 border-l-2 border-[#67e8f9] pl-4"><p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#67e8f9]">status do arquivo</p><p className="mt-2 font-body text-sm leading-6 text-[#c9e8f0]">Aprendendo na prática, registrando o processo e melhorando a cada entrega.</p></div>
                  </div>
                  <div className="border-t border-white/[0.1]">
                    {skillTracks.map((skill) => (
                      <article key={skill.number} className="group grid gap-4 border-b border-white/[0.1] py-7 sm:grid-cols-[70px_1fr_auto] sm:items-start sm:gap-7 sm:py-8">
                        <span className="font-mono text-xs text-[#3b82f6]">{skill.number}</span>
                        <div>
                          <h3 className="font-display text-2xl font-medium text-[#eff6ff] transition-colors group-hover:text-[#69a1ff]">{skill.title}</h3>
                          <p className="mt-3 max-w-lg font-body text-sm leading-7 text-[#9eb0cc]">{skill.text}</p>
                          <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f91b7] light-muted-ink">{skill.tools}</p>
                        </div>
                        <span className="flex h-8 w-8 items-center justify-center border border-white/10 text-[#7daafa] transition-all duration-200 group-hover:border-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white">
                          <ArrowUpRight className="h-4 w-4" />
                        </span>
                      </article>
                    ))}
                  </div>
                </div>
                <div className="mt-12 border-t border-white/[0.1] pt-8">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                    <div>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a5f3fc]">repertório aplicado</p>
                      <h3 className="mt-3 font-display text-[clamp(2rem,3vw,3.4rem)] font-medium leading-none tracking-[-0.05em] text-white">Três formas de pensar a imagem.</h3>
                    </div>
                    <p className="max-w-sm font-body text-sm leading-7 text-[#9eb0cc]">As imagens entram como referência prática: o que foi observado, para que serviu e como pode ajudar um novo projeto.</p>
                  </div>
                  <div className="mt-7 grid gap-px bg-white/[0.1] md:grid-cols-3">
                    {repertoireSignals.map((signal) => (
                      <article key={signal.title} className="evidence-card group relative min-h-[270px] overflow-hidden bg-[#07101c] p-5 sm:p-6">
                        <img src={signal.cover} alt={`Referência visual: ${signal.title}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-45 saturate-[0.75] transition duration-500 group-hover:scale-[1.03] group-hover:opacity-60" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030b1e] via-[#030b1e]/65 to-transparent" />
                        <div className="relative flex h-full flex-col justify-end">
                          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#a5f3fc]">{signal.label}</p>
                          <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">{signal.title}</h3>
                          <p className="mt-2 max-w-sm font-body text-sm leading-6 text-[#c2d9e7]">{signal.text}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            </section>
    
            <section id="servicos" className="archive-chapter relative overflow-hidden border-t border-white/[0.07] bg-[#09101a]">
              <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
              <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
                <div className="grid gap-10 border-b border-white/[0.1] pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">04 / serviços</p>
                    <div className="flex items-center gap-3"><img src={markUrl} alt="" width="28" height="28" loading="lazy" decoding="async" className="h-7 w-7 object-contain opacity-80" /><span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">PG / caderno de produção</span></div><h2 className="mt-5 max-w-md font-display text-[clamp(2.7rem,4.8vw,5.5rem)] font-medium leading-[0.93] tracking-[-0.06em] text-white">Como uma ideia vira entrega.</h2>
                    <div className="mt-7 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#7795bf]"><img src={markUrl} alt="" width="20" height="20" loading="lazy" decoding="async" className="h-5 w-5 object-contain" /> PG // direção e imagem</div>
                  </div>
                  <div className="lg:pb-2">
                    <p className="max-w-2xl font-body text-base leading-8 text-[#c0e3f4]">Cada projeto recebe uma combinação de direção, captação e organização para que a entrega seja clara antes, durante e depois da produção.</p>
                    <a href="#contato" className="mt-7 inline-flex items-center gap-2 border-b border-[#3b82f6] pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#e3eeff] transition-colors hover:text-[#76aaff]">falar sobre um projeto <ArrowUpRight className="h-3.5 w-3.5" /></a>
                  </div>
                </div>
    
                <div className="mt-8 divide-y divide-white/[0.1] border-y border-white/[0.1]">
                  {serviceOffers.map(({ number, label, title, text, detail, delivery, duration, Icon }, index) => (
                    <article key={number} className={`archive-entry group relative grid gap-7 overflow-hidden border-l border-transparent py-9 transition-all duration-300 hover:border-[#67e8f9]/60 hover:bg-[#0b1728] sm:py-11 lg:items-start ${index === 1 ? "lg:grid-cols-[0.5fr_1.1fr_0.8fr] lg:pl-[12%]" : "lg:grid-cols-[0.42fr_1.18fr_0.9fr]"}`}>
                      <div className="flex items-start justify-between gap-4 lg:pr-8">
                        <div><span className="font-mono text-xl text-[#3b82f6]">{number}</span><p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#607aa1] light-muted-ink">PG / SVC.{number}</p></div>
                        <span className="grid h-11 w-11 place-items-center border border-[#3b82f6]/25 bg-[#0c1728] text-[#71a6fb] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white"><Icon className="h-5 w-5" /></span>
                      </div>
                      <div className="lg:border-l lg:border-white/[0.1] lg:pl-8">
                        <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#7190bd] light-muted-ink">{label}</p>
                        <h3 className="mt-4 font-display text-[clamp(2rem,3vw,3.2rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">{title}</h3>
                        <p className="mt-5 max-w-lg font-body text-sm leading-7 text-[#a4b5cf]">{text}</p>
                      </div>
                      <div className="border-t border-white/[0.1] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f8db8] light-muted-ink">{detail}</p>
                        <div className="mt-5 grid grid-cols-2 gap-4">
                          <div><p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#516987]">entrega</p><p className="mt-1 font-mono text-[9px] uppercase leading-4 tracking-[0.08em] text-[#b6cae8]">{delivery}</p></div>
                          <div><p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#516987]">duração típica</p><p className="mt-1 font-mono text-[9px] uppercase leading-4 tracking-[0.08em] text-[#b6cae8]">{duration}</p></div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
                <p className="mt-5 max-w-3xl font-mono text-[9px] uppercase leading-5 tracking-[0.11em] text-[#637da5] light-muted-ink">REFERÊNCIAS INICIAIS DE MERCADO. FORMATOS, QUANTIDADE DE PEÇAS E DURAÇÃO PODEM SER AJUSTADOS CONFORME O OBJETIVO DE CADA PROJETO.</p>
              </div>
            </section>
    
            <section className="archive-chapter relative overflow-hidden border-t border-white/[0.07] bg-[#061226]">
              <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-35" />
              <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:py-28">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a5f3fc]">05 / como o trabalho acontece</p>
                  <h2 className="mt-5 max-w-md font-display text-[clamp(2.7rem,4.8vw,5.5rem)] font-medium leading-[0.93] tracking-[-0.06em] text-white">Da primeira conversa<br />à entrega final.</h2>
                  <p className="mt-6 max-w-sm font-body text-base leading-8 text-[#c0e3f4]">Um processo simples ajuda a decidir melhor: contexto, formato, produção e próximos usos.</p>
                  <a href="#contato" className="mt-7 inline-flex items-center gap-2 border-b border-[#38bdf8] pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#e3faff] transition-colors hover:text-[#a5f3fc]">contar sua ideia <ArrowUpRight className="h-3.5 w-3.5" /></a>
                </div>
                <div className="divide-y divide-cyan-100/[0.12] border-y border-cyan-100/[0.12]">
                  {processSteps.map((step) => (
                    <article key={step.number} className="grid gap-5 py-7 sm:grid-cols-[80px_1fr] sm:py-9">
                      <span className="font-mono text-xl text-[#67e8f9]">{step.number}</span>
                      <div>
                        <h3 className="font-display text-2xl font-medium text-white">{step.title}</h3>
                        <p className="mt-3 max-w-xl font-body text-sm leading-7 text-[#b9d8e8]">{step.text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
    </>
  );
}
