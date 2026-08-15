/**
 * Design: Arquivo Profundo — editorial técnico em azul cobalto e grafite.
 * A página transforma a trajetória de Pablo em capítulos assimétricos, com
 * metadados, linha de progresso e linguagem visual de arquivo em evolução.
 */
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Braces,
  Check,
  Code2,
  Menu,
  Send,
  Terminal,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";

const markUrl = "/manus-storage/pablo-pg-mark_3a636084.png";
const heroUrl = "/manus-storage/pablo-hero-archive_fbc55c04.png";
const textureUrl = "/manus-storage/pablo-systems-texture_cf9aade1.png";

const skillTracks = [
  {
    number: "01",
    title: "Fundamentos",
    text: "Lógica, pensamento estruturado e a disciplina de entender o problema antes de procurar a ferramenta.",
  },
  {
    number: "02",
    title: "Web em construção",
    text: "Interfaces responsivas, HTML, CSS e JavaScript como ponto de partida para experiências úteis e claras.",
  },
  {
    number: "03",
    title: "Próximo sistema",
    text: "Cada estudo vira terreno para testar, errar, melhorar e registrar o que aprendi no caminho.",
  },
];

const projectNotes = [
  {
    id: "ARQ.01",
    type: "LABORATÓRIO",
    title: "Interfaces que explicam",
    text: "Um espaço para transformar referências de design e código em páginas simples, responsivas e legíveis.",
    tag: "Front-end",
  },
  {
    id: "ARQ.02",
    type: "EM EVOLUÇÃO",
    title: "Lógica em prática",
    text: "Exercícios, algoritmos e pequenos desafios que ajudam a criar repertório antes de construir algo maior.",
    tag: "Fundamentos",
  },
  {
    id: "ARQ.03",
    type: "PRÓXIMO CAPÍTULO",
    title: "Repositório aberto",
    text: "O lugar reservado para projetos que ainda vão nascer de uma boa pergunta, uma ideia e muito estudo.",
    tag: "Processo",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormSent(true);
    event.currentTarget.reset();
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#070a10] text-[#eef5ff] selection:bg-[#3b82f6] selection:text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.07] bg-[#070a10]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#inicio" aria-label="Ir ao início" className="group flex items-center gap-3" onClick={closeMenu}>
            <span className="grid h-10 w-10 place-items-center border border-[#3b82f6]/45 bg-[#0b1220] transition-transform duration-200 group-hover:-translate-y-0.5">
              <img src={markUrl} alt="Símbolo PG" className="h-7 w-7 object-contain" />
            </span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#b7cdf1]">
              Pablo <span className="text-[#3b82f6]">/</span> Guilherme
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
            {[
              ["manifesto", "#sobre"],
              ["trajetória", "#trilha"],
              ["arquivo", "#projetos"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="nav-link text-[11px] font-mono uppercase tracking-[0.14em] text-[#90a3c3] transition-colors hover:text-white">
                {label}
              </a>
            ))}
            <a href="#contato" className="inline-flex items-center gap-2 border border-[#3b82f6] bg-[#3b82f6] px-4 py-2 text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-white transition-all hover:bg-[#5b9aff] hover:shadow-[0_0_24px_rgba(59,130,246,0.24)]">
              contato <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center border border-white/10 text-[#d8e6fa] md:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-white/[0.07] bg-[#090d16] px-5 py-5 md:hidden" aria-label="Navegação móvel">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-1 sm:px-3">
              {[
                ["01 / manifesto", "#sobre"],
                ["02 / trajetória", "#trilha"],
                ["03 / arquivo", "#projetos"],
                ["04 / contato", "#contato"],
              ].map(([label, href]) => (
                <a key={label} href={href} onClick={closeMenu} className="border-b border-white/[0.07] py-3 font-mono text-xs uppercase tracking-[0.12em] text-[#b7cdf1]">
                  {label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main>
        <section id="inicio" className="relative isolate min-h-[810px] overflow-hidden pt-[76px] sm:min-h-[850px]">
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-70" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-full bg-cover bg-center opacity-70 lg:w-[72%]" style={{ backgroundImage: `url(${heroUrl})` }} />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-full bg-[linear-gradient(90deg,#070a10_5%,rgba(7,10,16,0.94)_30%,rgba(7,10,16,0.34)_68%,rgba(7,10,16,0.62)_100%)] lg:w-[80%]" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-52 bg-[linear-gradient(0deg,#070a10,transparent)]" />

          <div className="relative mx-auto flex min-h-[734px] max-w-[1440px] flex-col justify-between px-5 pb-8 pt-16 sm:px-8 sm:pt-24 lg:min-h-[774px] lg:px-12">
            <div className="max-w-4xl">
              <div className="reveal flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">
                <span className="h-px w-10 bg-[#3b82f6]" />
                01 / arquivo pessoal
              </div>
              <h1 className="reveal delay-1 mt-7 max-w-4xl font-display text-[clamp(3.4rem,8.8vw,8.8rem)] font-semibold leading-[0.82] tracking-[-0.075em] text-white">
                Eu estudo
                <br />
                para construir
                <br />
                <span className="text-[#3b82f6]">o que importa.</span>
              </h1>
              <div className="reveal delay-2 mt-9 flex max-w-xl flex-col gap-6 sm:ml-[16.8%]">
                <p className="text-balance font-body text-base leading-8 text-[#bed0ea] sm:text-lg">
                  Sou <strong className="font-semibold text-white">Pablo Guilherme</strong>, estudante de Tecnologia da Informação. Ainda estou no começo da trajetória — e é exatamente por isso que aprendo com intenção, testando ideias e registrando cada avanço.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a href="#sobre" className="group inline-flex items-center gap-3 bg-[#3b82f6] px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#5b9aff] hover:shadow-[0_10px_30px_rgba(59,130,246,0.24)] active:scale-[0.97]">
                    ler meu manifesto <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  </a>
                  <a href="#contato" className="inline-flex items-center gap-2 px-2 py-3 font-mono text-[11px] uppercase tracking-[0.13em] text-[#b7cdf1] transition-colors hover:text-white">
                    iniciar conversa <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="reveal delay-3 grid border-t border-white/[0.12] pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-sm font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-[#7890b4]">
                STATUS: em evolução<br />
                CAMPO: tecnologia da informação
              </p>
              <a href="#sobre" className="mt-6 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#b7cdf1] transition-colors hover:text-[#3b82f6] sm:mt-0">
                descer para o capítulo 02 <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="sobre" className="relative border-t border-white/[0.07] bg-[#0a0f18]">
          <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.88fr_2.12fr]">
            <aside className="relative border-b border-white/[0.07] px-5 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-20">
              <div className="sticky top-28">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">02 / manifesto</p>
                <p className="mt-5 max-w-[14rem] font-display text-2xl font-medium leading-tight text-white">De onde eu começo.</p>
                <div className="mt-12 hidden h-40 w-px bg-[linear-gradient(#3b82f6,transparent)] lg:block" />
              </div>
            </aside>
            <div className="relative px-5 py-12 sm:px-8 lg:px-16 lg:py-20">
              <span className="absolute left-0 top-0 h-full w-px bg-[#3b82f6]/50" />
              <div className="grid gap-12 xl:grid-cols-[1.5fr_0.7fr] xl:gap-16">
                <div>
                  <p className="font-display text-[clamp(2.3rem,4.6vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[#f4f8ff]">
                    Não estou tentando parecer pronto. Estou me preparando para ser <span className="text-[#4e8df8]">consistente.</span>
                  </p>
                  <div className="mt-9 max-w-2xl space-y-5 font-body text-base leading-8 text-[#b8c8df]">
                    <p>Escolhi a área de TI porque gosto da combinação entre lógica, criação e descoberta. Para mim, aprender tecnologia não é apenas memorizar ferramentas: é desenvolver uma forma mais clara de pensar, resolver e comunicar.</p>
                    <p>Este portfólio é um registro honesto desse processo. Aqui ficam meus estudos, experiências e os projetos que vou usar para transformar curiosidade em prática.</p>
                  </div>
                </div>
                <div className="border-l border-white/10 pl-6 xl:mt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#7d94b8]">coordenadas atuais</p>
                  <dl className="mt-5 space-y-5">
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#536887]">formação</dt>
                      <dd className="mt-1.5 font-body text-sm text-[#e7f0ff]">Estudante de Tecnologia da Informação</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#536887]">interesse</dt>
                      <dd className="mt-1.5 font-body text-sm text-[#e7f0ff]">Desenvolvimento, interfaces e resolução de problemas</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#536887]">modo de trabalho</dt>
                      <dd className="mt-1.5 font-body text-sm text-[#e7f0ff]">Curiosidade, prática e melhoria contínua</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="trilha" className="relative overflow-hidden border-t border-white/[0.07] bg-[#070a10] py-16 sm:py-24 lg:py-32">
          <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.13] mix-blend-screen" style={{ backgroundImage: `url(${textureUrl})` }} />
          <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.4fr] lg:gap-20">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">03 / trilha de estudo</p>
                <h2 className="mt-5 max-w-md font-display text-[clamp(2.4rem,4vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">Onde quero colocar energia.</h2>
                <p className="mt-6 max-w-sm font-body text-base leading-7 text-[#9fb2ce]">Minha base está em formação. Cada frente abaixo é um compromisso de estudo, prática e documentação do que aprendo.</p>
              </div>
              <div className="border-t border-white/[0.1]">
                {skillTracks.map((skill) => (
                  <article key={skill.number} className="group grid gap-4 border-b border-white/[0.1] py-7 sm:grid-cols-[70px_1fr_auto] sm:items-start sm:gap-7 sm:py-8">
                    <span className="font-mono text-xs text-[#3b82f6]">{skill.number}</span>
                    <div>
                      <h3 className="font-display text-2xl font-medium text-[#eff6ff] transition-colors group-hover:text-[#69a1ff]">{skill.title}</h3>
                      <p className="mt-3 max-w-lg font-body text-sm leading-7 text-[#9eb0cc]">{skill.text}</p>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center border border-white/10 text-[#7daafa] transition-all duration-200 group-hover:border-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="projetos" className="border-y border-white/[0.07] bg-[#0a0f18]">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
            <div className="flex flex-col justify-between gap-6 border-b border-white/[0.1] pb-9 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">04 / arquivo de projetos</p>
                <h2 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,5rem)] font-medium leading-none tracking-[-0.06em] text-white">O que estou<br className="hidden sm:block" /> preparando.</h2>
              </div>
              <p className="max-w-sm font-body text-sm leading-7 text-[#9fb2ce]">Nada aqui tenta fingir uma trajetória pronta. Estes são os espaços de prática que vou transformar em projetos consistentes.</p>
            </div>

            <div className="mt-8 grid gap-px bg-white/[0.1] lg:grid-cols-3">
              {projectNotes.map((project, index) => (
                <article key={project.id} className="group relative min-h-[350px] bg-[#0a0f18] p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#6580aa]">{project.id}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#3b82f6]">{project.type}</span>
                  </div>
                  <div className="absolute right-6 top-16 grid h-12 w-12 place-items-center border border-[#3b82f6]/25 text-[#3b82f6] transition-all duration-300 group-hover:scale-110 group-hover:border-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white">
                    {index === 0 ? <Code2 className="h-5 w-5" /> : index === 1 ? <Braces className="h-5 w-5" /> : <Terminal className="h-5 w-5" />}
                  </div>
                  <div className="absolute bottom-7 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8">
                    <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.13em] text-[#78aaff]">{project.tag}</p>
                    <h3 className="font-display text-3xl font-medium leading-[1.02] tracking-[-0.04em] text-white">{project.title}</h3>
                    <p className="mt-4 font-body text-sm leading-6 text-[#95a8c3]">{project.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="relative overflow-hidden bg-[#070a10]">
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto grid max-w-[1440px] lg:grid-cols-[1fr_1.12fr]">
            <div className="border-b border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24 lg:border-b-0 lg:border-r lg:px-12 lg:py-28">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">05 / canal aberto</p>
              <h2 className="mt-6 max-w-xl font-display text-[clamp(3.1rem,5.6vw,6rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">Uma boa pergunta pode ser o começo.</h2>
              <p className="mt-8 max-w-md font-body text-base leading-8 text-[#aec1dc]">Se você quer trocar uma ideia sobre estudos, tecnologia ou um projeto em que eu possa aprender, deixe uma mensagem.</p>
              <div className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8ca4c8]"><span className="h-2 w-2 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" /> disponível para aprender</div>
            </div>

            <div className="px-5 py-16 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
              <form onSubmit={handleSubmit} className="max-w-xl" noValidate>
                <div className="grid gap-7">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">seu nome</span>
                    <input required name="name" autoComplete="name" placeholder="Como você se chama?" className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white outline-none transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">seu e-mail</span>
                    <input required type="email" name="email" autoComplete="email" placeholder="voce@exemplo.com" className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white outline-none transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">mensagem</span>
                    <textarea required name="message" rows={4} placeholder="O que você gostaria de conversar?" className="mt-3 w-full resize-none border-b border-white/15 bg-transparent px-0 py-3 font-body text-base leading-7 text-white outline-none transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                </div>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" className="h-auto w-fit rounded-none bg-[#3b82f6] px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-white transition-all hover:-translate-y-0.5 hover:bg-[#5b9aff] hover:shadow-[0_12px_30px_rgba(59,130,246,0.25)] active:scale-[0.97]">
                    enviar mensagem <Send className="h-4 w-4" />
                  </Button>
                  <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-[#647a9f]">resposta por e-mail a configurar</p>
                </div>
                {formSent && (
                  <p role="status" className="mt-6 flex items-center gap-2 border-l-2 border-[#3b82f6] bg-[#3b82f6]/10 px-4 py-3 font-body text-sm text-[#dceaff]">
                    <Check className="h-4 w-4 text-[#65a0ff]" /> Mensagem preparada. Conecte um endereço de e-mail para ativar o envio real.
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.07] bg-[#06080d]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <img src={markUrl} alt="" className="h-6 w-6 object-contain" />
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#7b91b3]">Pablo Guilherme · estudante de TI</p>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#526783]">arquivo pessoal / em atualização contínua</p>
        </div>
      </footer>
    </div>
  );
}
