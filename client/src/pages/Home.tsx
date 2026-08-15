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
  Camera,
  Check,
  Clapperboard,
  Download,
  FolderGit2,
  Github,
  Instagram,
  Layers2,
  Menu,
  Plane,
  Play,
  Send,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";

const markUrl = "/manus-storage/pablo-pg-mark_3a636084.png";
const heroUrl = "/manus-storage/pablo-hero-archive_fbc55c04.png";
const textureUrl = "/manus-storage/pablo-systems-texture_cf9aade1.png";
const portraitUrl = "/manus-storage/pablo-guilherme-retrato-principal_c719478f.jpg";
const resumeUrl = "/manus-storage/curriculo-pablo-guilherme_be777d0a.pdf";

const skillTracks = [
  {
    number: "01",
    title: "Tecnologia da Informação",
    text: "Lógica, pensamento estruturado e a disciplina de entender o problema antes de procurar a ferramenta.",
  },
  {
    number: "02",
    title: "Criação de conteúdo",
    text: "Narrativas visuais pensadas para registrar momentos, comunicar ideias e dar forma a histórias que merecem ser vistas.",
  },
  {
    number: "03",
    title: "Captação de imagens",
    text: "Filmagens terrestres e imagens aéreas com drone, unindo perspectiva, ritmo e atenção aos detalhes de cada evento.",
  },
];

const serviceOffers = [
  {
    number: "01",
    label: "drone / perspectiva aérea",
    title: "Filmagem aérea",
    text: "Imagens com drone para apresentar espaços, eventos e movimentos sob uma perspectiva mais ampla.",
    detail: "ENQUADRAMENTO · ESCALA · ATMOSFERA",
    Icon: Plane,
  },
  {
    number: "02",
    label: "câmera / registro em solo",
    title: "Captação terrestre",
    text: "Registros em solo para acompanhar detalhes, pessoas e a energia que acontece dentro de cada momento.",
    detail: "PRESENÇA · RITMO · DETALHE",
    Icon: Camera,
  },
  {
    number: "03",
    label: "narrativa / presença digital",
    title: "Criação de conteúdo",
    text: "Conteúdo visual pensado para documentar, comunicar e dar continuidade às histórias de pessoas e marcas.",
    detail: "IDEIA · REGISTRO · CONEXÃO",
    Icon: Clapperboard,
  },
];

type Repository = {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url: string;
  kind: "repository" | "video";
  cover?: string;
  featured?: boolean;
};

/**
 * Galeria de trabalhos reais. Novos repositórios e vídeos devem entrar aqui
 * somente quando Pablo fornecer os respectivos links ou arquivos verdadeiros.
 */
const repositories: Repository[] = [
  {
    id: "AUD.01",
    name: "Chá da Eloise",
    description: "Registro audiovisual de evento social, com imagens amplas do ambiente e momentos da celebração.",
    technologies: ["Vídeo", "Drone", "Conteúdo"],
    url: "/manus-storage/cha-da-eloise-cobertura-aerea_d6a43ac9.mp4",
    kind: "video",
    cover: "/manus-storage/cha-da-eloise-capa_0d17d433.jpg",
    featured: true,
  },
  {
    id: "CNT.02",
    name: "RHAM — Serviços no app",
    description: "Vídeo vertical de navegação por serviços em uma interface móvel da RHAM Águas Lindas.",
    technologies: ["Vídeo", "Conteúdo", "Interface"],
    url: "/manus-storage/rham-interface-servicos-01_de540335.mp4",
    kind: "video",
    cover: "/manus-storage/rham-interface-servicos-01_72f2d942.jpg",
  },
  {
    id: "CNT.03",
    name: "RHAM — Mensagem em vídeo",
    description: "Registro vertical com apresentação diante da câmera para comunicação institucional.",
    technologies: ["Vídeo", "Conteúdo"],
    url: "/manus-storage/rham-depoimento-02_e0bfccc3.mp4",
    kind: "video",
    cover: "/manus-storage/rham-depoimento-02_c0845a39.jpg",
  },
  {
    id: "AUD.04",
    name: "Captação noturna — visão aérea",
    description: "Registro vertical noturno com perspectiva elevada sobre o espaço e seus arredores.",
    technologies: ["Vídeo", "Drone", "Noturno"],
    url: "/manus-storage/captacao-noturna-03_7e22eda5.mp4",
    kind: "video",
    cover: "/manus-storage/captacao-noturna-03_1033bede.jpg",
  },
  {
    id: "AUD.05",
    name: "Campo iluminado — vista aérea",
    description: "Captação horizontal de campo esportivo à noite, valorizando escala, luz e movimento.",
    technologies: ["Vídeo", "Drone", "Noturno"],
    url: "/manus-storage/campo-iluminado-04_dace435d.mp4",
    kind: "video",
    cover: "/manus-storage/campo-iluminado-04_665a6d8f.jpg",
  },
  {
    id: "CNT.06",
    name: "RHAM — Navegação de serviços",
    description: "Segundo recorte vertical de interface móvel, focado na jornada de serviços do aplicativo.",
    technologies: ["Vídeo", "Conteúdo", "Interface"],
    url: "/manus-storage/rham-interface-navegacao-05_b0c568ac.mp4",
    kind: "video",
    cover: "/manus-storage/rham-interface-navegacao-05_6de0dfd3.jpg",
  },
  {
    id: "AUD.07",
    name: "Campo iluminado — sequência aérea",
    description: "Novo enquadramento horizontal do campo, explorando a perspectiva de voo e a atmosfera noturna.",
    technologies: ["Vídeo", "Drone", "Noturno"],
    url: "/manus-storage/campo-iluminado-movimento-06_d3806c2d.mp4",
    kind: "video",
    cover: "/manus-storage/campo-iluminado-movimento-06_cc198d97.jpg",
  },
];
const technologyFilters = ["Todos", "Vídeo", "Drone", "Conteúdo", "Interface", "Noturno", "HTML", "CSS", "JavaScript", "Python"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [activeTechnology, setActiveTechnology] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState<Repository | null>(null);

  const visibleRepositories = repositories.filter((repository) =>
    activeTechnology === "Todos" ? true : repository.technologies.includes(activeTechnology),
  );

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
                ["atuação", "#trilha"],
                ["serviços", "#servicos"],
                ["trabalhos", "#projetos"],
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
                ["02 / atuação", "#trilha"],
                ["03 / serviços", "#servicos"],
                ["04 / trabalhos", "#projetos"],
                ["05 / contato", "#contato"],
              ].map(([label, href]) => (
                <a key={label} href={href} onClick={closeMenu} className="border-b border-white/[0.07] py-3 font-mono text-xs uppercase tracking-[0.12em] text-[#b7cdf1]">
                  {label}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <main className="relative">
        <div className="archive-spine pointer-events-none absolute bottom-0 top-0 z-20" aria-hidden="true" />
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
                  Sou <strong className="font-semibold text-white">Pablo Guilherme</strong>, estudante de Tecnologia da Informação e criador de conteúdo. Entre código, câmera e drone, transformo estudo e olhar criativo em projetos que registram o que importa.
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
                CAMPOS: TI · CONTEÚDO · AUDIOVISUAL
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
                    Não sigo uma única rota. Estou construindo repertório entre <span className="text-[#4e8df8]">tecnologia, conteúdo e imagem.</span>
                  </p>
                  <div className="mt-9 max-w-2xl space-y-5 font-body text-base leading-8 text-[#b8c8df]">
                    <p>Escolhi a área de TI porque gosto da combinação entre lógica, criação e descoberta. Para mim, aprender tecnologia não é apenas memorizar ferramentas: é desenvolver uma forma mais clara de pensar, resolver e comunicar.</p>
                    <p>Essa vontade de comunicar também está presente na criação de conteúdo. Trabalho com filmagens terrestres e captação aérea com drone para registrar eventos, ambientes e momentos de um jeito próprio.</p>
                  </div>
                  <a
                    href={resumeUrl}
                    download="curriculo-pablo-guilherme.pdf"
                    className="group mt-9 inline-flex w-full max-w-md items-center justify-between border border-[#3b82f6]/45 bg-[#0b1220] px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#3b82f6] hover:bg-[#0e1930] hover:shadow-[0_12px_30px_rgba(0,0,0,0.24)] sm:w-auto sm:min-w-[320px]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center bg-[#3b82f6] text-white transition-transform duration-200 group-hover:scale-105"><Download className="h-4 w-4" /></span>
                      <span className="text-left">
                        <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white">Baixar currículo</span>
                        <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.11em] text-[#7691b8]">PDF · perfil profissional</span>
                      </span>
                    </span>
                    <ArrowDownRight className="h-4 w-4 text-[#70a6ff] transition-transform duration-200 group-hover:translate-y-1" />
                  </a>
                </div>
                <div className="border-l border-white/10 pl-6 xl:mt-4">
                  <figure className="relative mb-8 overflow-hidden border border-white/10 bg-[#0d1523]">
                    <img src={portraitUrl} alt="Pablo Guilherme" className="h-64 w-full object-cover object-center saturate-[0.8] contrast-110 transition-transform duration-700 hover:scale-[1.03] sm:h-72" />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(6,8,13,0.92)_100%)]" />
                    <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 py-3">
                      <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#d9e8ff]">Pablo Guilherme</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#6fa4ff]">perfil / 2026</span>
                    </figcaption>
                  </figure>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#7d94b8]">coordenadas atuais</p>
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

        <section id="trilha" className="relative overflow-hidden border-t border-white/[0.07] bg-[#070a10] py-16 sm:py-24 lg:py-32">
          <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.13] mix-blend-screen" style={{ backgroundImage: `url(${textureUrl})` }} />
          <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.4fr] lg:gap-20">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">03 / frentes de atuação</p>
                <h2 className="mt-5 max-w-md font-display text-[clamp(2.4rem,4vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">Onde coloco energia.</h2>
                <p className="mt-6 max-w-sm font-body text-base leading-7 text-[#9fb2ce]">Tecnologia e audiovisual se encontram no mesmo processo: aprender, observar e transformar uma ideia em algo que as pessoas possam usar ou sentir.</p>
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

        <section id="servicos" className="relative overflow-hidden border-t border-white/[0.07] bg-[#09101a]">
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
            <div className="grid gap-10 border-b border-white/[0.1] pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">04 / serviços</p>
                <h2 className="mt-5 max-w-md font-display text-[clamp(2.7rem,4.8vw,5.5rem)] font-medium leading-[0.93] tracking-[-0.06em] text-white">Da ideia<br />ao enquadramento.</h2>
              </div>
              <div className="lg:pb-2">
                <p className="max-w-2xl font-body text-base leading-8 text-[#adc0db]">Serviços de imagem para registrar o que acontece no chão, no ar e no espaço digital. Cada entrega começa com uma boa leitura do momento que precisa ser contado.</p>
                <a href="#contato" className="mt-7 inline-flex items-center gap-2 border-b border-[#3b82f6] pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#e3eeff] transition-colors hover:text-[#76aaff]">falar sobre um projeto <ArrowUpRight className="h-3.5 w-3.5" /></a>
              </div>
            </div>

            <div className="mt-8 grid gap-px bg-white/[0.1] lg:grid-cols-3">
              {serviceOffers.map(({ number, label, title, text, detail, Icon }) => (
                <article key={number} className="group relative min-h-[360px] overflow-hidden bg-[#09101a] p-7 sm:p-9">
                  <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-[#3b82f6]/15 transition-transform duration-500 group-hover:scale-[1.55]" />
                  <div className="relative flex items-start justify-between">
                    <span className="font-mono text-[11px] text-[#5c84c1]">{number}</span>
                    <span className="grid h-11 w-11 place-items-center border border-[#3b82f6]/25 bg-[#0c1728] text-[#71a6fb] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white"><Icon className="h-5 w-5" /></span>
                  </div>
                  <div className="relative mt-16">
                    <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#7190bd]">{label}</p>
                    <h3 className="mt-4 font-display text-[clamp(2rem,3vw,3.2rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">{title}</h3>
                    <p className="mt-5 max-w-sm font-body text-sm leading-7 text-[#a4b5cf]">{text}</p>
                  </div>
                  <p className="absolute bottom-8 left-7 right-7 border-t border-white/[0.1] pt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f8db8] sm:left-9 sm:right-9">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projetos" className="border-y border-white/[0.07] bg-[#0a0f18]">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
            <div className="flex flex-col justify-between gap-6 border-b border-white/[0.1] pb-9 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">05 / trabalhos selecionados</p>
                <h2 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,5rem)] font-medium leading-none tracking-[-0.06em] text-white">O que já<br className="hidden sm:block" /> estou fazendo.</h2>
                <div className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#7795bf]"><img src={markUrl} alt="" className="h-5 w-5 object-contain" /> PG // arquivo visual em progresso</div>
              </div>
              <p className="max-w-sm font-body text-sm leading-7 text-[#9fb2ce]">Uma galeria para reunir repositórios, vídeos e registros reais — cada projeto com seu contexto, tecnologias e acesso direto.</p>
            </div>

            <div className="mt-8 flex flex-wrap gap-2" aria-label="Filtrar repositórios por tecnologia">
              {technologyFilters.map((technology) => (
                <button
                  type="button"
                  key={technology}
                  onClick={() => setActiveTechnology(technology)}
                  aria-pressed={activeTechnology === technology}
                  className={`border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-200 active:scale-[0.97] ${
                    activeTechnology === technology
                      ? "border-[#3b82f6] bg-[#3b82f6] text-white"
                      : "border-white/10 bg-transparent text-[#88a0c4] hover:border-[#3b82f6]/60 hover:text-[#eaf2ff]"
                  }`}
                >
                  {technology}
                </button>
              ))}
            </div>

            {visibleRepositories.length > 0 ? (
              <div className="mt-8 grid gap-px bg-white/[0.1] lg:grid-cols-3">
                {visibleRepositories.map((repository) => {
                  const cardContent = (
                    <>
                      {repository.cover && <img src={repository.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 saturate-[0.75] transition-transform duration-700 group-hover:scale-105" />}
                      {repository.cover && <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,16,0.18),rgba(6,10,16,0.95)_78%)]" />}
                      <span className="relative flex items-start justify-between gap-4">
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#bdcff0]">{repository.id}</span>
                        {repository.kind === "video" ? <span className="grid h-9 w-9 place-items-center border border-[#8bb4ff]/50 bg-[#3b82f6]/25 text-[#f3f8ff] transition-all duration-200 group-hover:scale-110 group-hover:bg-[#3b82f6]"><Play className="h-4 w-4 fill-current" /></span> : <ArrowUpRight className="h-4 w-4 text-[#6fa4ff] transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />}
                      </span>
                      <span className="relative mt-auto block">
                        <span className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.13em] text-[#83b0fc]">{repository.kind === "video" ? <><Clapperboard className="h-3.5 w-3.5" /> assistir trabalho</> : "repositório"}</span>
                        <span className="block font-display text-3xl font-medium leading-[1.02] tracking-[-0.04em] text-white">{repository.name}</span>
                        <span className="mt-4 block max-w-md font-body text-sm leading-6 text-[#c2d0e4]">{repository.description}</span>
                        <span className="mt-6 flex flex-wrap gap-2">
                          {repository.technologies.map((technology) => <span key={technology} className="border border-[#8eb7ff]/40 bg-[#07101e]/65 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#b6d0ff]">{technology}</span>)}
                        </span>
                      </span>
                    </>
                  );

                  return repository.kind === "video" ? (
                    <button key={repository.id} type="button" onClick={() => setSelectedProject(repository)} className={`group relative flex flex-col overflow-hidden bg-[#0a0f18] p-6 text-left transition-colors hover:bg-[#0d1523] sm:p-8 ${repository.featured ? "min-h-[440px] lg:col-span-2" : "min-h-[380px]"}`}>
                      {cardContent}
                    </button>
                  ) : (
                    <a key={repository.id} href={repository.url} target="_blank" rel="noreferrer" className="group relative flex min-h-[380px] flex-col overflow-hidden bg-[#0a0f18] p-6 transition-colors hover:bg-[#0d1523] sm:p-8">
                      {cardContent}
                    </a>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 grid border border-white/[0.1] bg-[#09101c] lg:grid-cols-[1.42fr_0.58fr]">
                <div className="relative overflow-hidden p-7 sm:p-10">
                  <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-35" />
                  <div className="relative">
                    <span className="grid h-12 w-12 place-items-center border border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#70a6ff]"><FolderGit2 className="h-5 w-5" /></span>
                    <p className="mt-8 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#72a7fb]">arquivo em preparo / novos trabalhos</p>
                    <h3 className="mt-4 max-w-xl font-display text-[clamp(2rem,3.5vw,3.7rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">Seu próximo trabalho vai aparecer aqui.</h3>
                    <p className="mt-5 max-w-2xl font-body text-sm leading-7 text-[#9fb2ce]">
                      {activeTechnology === "Todos"
                        ? "Quando você tiver um link do GitHub, um vídeo ou uma nova filmagem, eu posso adicioná-lo com descrição, tecnologias e acesso direto."
                        : `Ainda não há um trabalho real marcado com ${activeTechnology}. Quando houver, ele será filtrado aqui automaticamente.`}
                    </p>
                    <a href="#contato" className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.13em] text-[#d9e8ff] transition-colors hover:text-[#70a6ff]">enviar um repositório quando estiver pronto <ArrowUpRight className="h-3.5 w-3.5" /></a>
                  </div>
                </div>
                <div className="border-t border-white/[0.1] bg-[#070b13] p-7 sm:p-10 lg:border-l lg:border-t-0">
                  <Layers2 className="h-5 w-5 text-[#3b82f6]" />
                  <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-[#7189ae]">ficha de inclusão</p>
                  <div className="mt-5 space-y-3 font-mono text-[11px] leading-5 text-[#c8d8ef]">
                    <p><span className="text-[#3b82f6]">01</span> nome do trabalho</p>
                    <p><span className="text-[#3b82f6]">02</span> descrição objetiva</p>
                    <p><span className="text-[#3b82f6]">03</span> tecnologias ou formato</p>
                    <p><span className="text-[#3b82f6]">04</span> link ou arquivo</p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 border-t border-white/[0.1] pt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#60789d]"><Github className="h-3.5 w-3.5" /> pronto para conectar</div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section id="contato" className="relative overflow-hidden bg-[#070a10]">
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto grid max-w-[1440px] lg:grid-cols-[1fr_1.12fr]">
            <div className="border-b border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24 lg:border-b-0 lg:border-r lg:px-12 lg:py-28">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">06 / canal aberto</p>
              <h2 className="mt-6 max-w-xl font-display text-[clamp(3.1rem,5.6vw,6rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">Uma boa pergunta pode ser o começo.</h2>
              <p className="mt-8 max-w-md font-body text-base leading-8 text-[#aec1dc]">Se você quer conversar sobre tecnologia, criação de conteúdo ou uma cobertura audiovisual, deixe uma mensagem.</p>
              <div className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8ca4c8]"><span className="h-2 w-2 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" /> disponível para novas ideias</div>
              <div className="mt-7 grid max-w-md gap-px border border-white/[0.1] bg-white/[0.1] sm:grid-cols-2">
                <a href="https://www.instagram.com/pablogui000/" target="_blank" rel="noreferrer" className="social-channel group flex items-center gap-3 bg-[#070a10] px-4 py-4">
                  <span className="social-icon-mark grid h-8 w-8 place-items-center border border-[#3b82f6]/35 text-[#77a9fc]"><Instagram className="h-4 w-4" /></span>
                  <span className="min-w-0"><span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f87ad]">Instagram</span><span className="mt-1 block truncate font-mono text-[11px] text-[#e7f0ff]">@pablogui000</span></span>
                </a>
                <a href="https://www.instagram.com/mpjstoryworks/" target="_blank" rel="noreferrer" className="social-channel group flex items-center gap-3 bg-[#070a10] px-4 py-4">
                  <span className="social-icon-mark grid h-8 w-8 place-items-center border border-[#3b82f6]/35 text-[#77a9fc]"><Instagram className="h-4 w-4" /></span>
                  <span className="min-w-0"><span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f87ad]">Instagram</span><span className="mt-1 block truncate font-mono text-[11px] text-[#e7f0ff]">@mpjstoryworks</span></span>
                </a>
              </div>
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
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#7b91b3]">Pablo Guilherme · TI · conteúdo · audiovisual</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/pablogui000/" target="_blank" rel="noreferrer" aria-label="Instagram @pablogui000" className="footer-social-icon text-[#6e85a8]"><Instagram className="h-4 w-4" /></a>
            <a href="https://www.instagram.com/mpjstoryworks/" target="_blank" rel="noreferrer" aria-label="Instagram @mpjstoryworks" className="footer-social-icon text-[#6e85a8]"><Instagram className="h-4 w-4" /></a>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#526783]">arquivo pessoal / em atualização contínua</p>
          </div>
        </div>
      </footer>

      {selectedProject?.kind === "video" && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-[#02050a]/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Vídeo: ${selectedProject.name}`}>
          <div className="relative w-full max-w-5xl border border-white/15 bg-[#080d16] shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            <button type="button" onClick={() => setSelectedProject(null)} aria-label="Fechar vídeo" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center border border-white/15 bg-[#060a10]/90 text-white transition-colors hover:border-[#3b82f6] hover:text-[#8db8ff]"><X className="h-5 w-5" /></button>
            <video className="max-h-[72vh] w-full bg-black" src={selectedProject.url} poster={selectedProject.cover} controls autoPlay preload="metadata">Seu navegador não oferece suporte à reprodução de vídeo.</video>
            <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#75a7fb]">projeto audiovisual</p><p className="mt-1 font-display text-xl text-white">{selectedProject.name}</p></div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.11em] text-[#9cb3d4]"><Camera className="h-3.5 w-3.5 text-[#3b82f6]" /> conteúdo · evento <Plane className="ml-2 h-3.5 w-3.5 text-[#3b82f6]" /> imagem aérea</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
