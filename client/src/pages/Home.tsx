/**
 * Design: Arquivo Luminoso — editorial técnico em azul celeste vibrante e azul profundo.
 * A página transforma a trajetória de Pablo em capítulos assimétricos, com
 * metadados, linha de progresso e linguagem visual de arquivo em evolução.
 */
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  Camera,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Braces,
  Download,
  FileText,
  FolderGit2,
  Github,
  Instagram,
  Layers2,
  Loader2,
  MapPin,
  Menu,
  MessageCircle,
  Plane,
  Play,
  Search,
  Send,
  X,
} from "lucide-react";
import { FormEvent, lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  availableTimes,
  buildAvailabilityWhatsAppUrl,
  calendarWeekdays,
  formatAvailabilityDate,
  getAvailabilityButtonLabel,
  isAvailabilityConsultationReady,
  isSelectableAvailabilityDate,
  toDateKey,
} from "@/lib/availability";
import { trpc } from "@/lib/trpc";
const InstagramRepertoire = lazy(() => import("./InstagramRepertoire"));

const markUrl = "/manus-storage/pablo-pg-mark_3a636084.png";
const heroUrl = "/manus-storage/pablo-hero-archive_fbc55c04.png";
const textureUrl = "/manus-storage/pablo-systems-texture_cf9aade1.png";
const portraitUrl = "/manus-storage/pablo-guilherme-retrato-principal_c719478f.jpg";
const resumeUrl = "/manus-storage/main_e88f8102.pdf";
const whatsAppNumber = "5561992903029";
const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=Olá%2C%20Pablo%21%20Vim%20pelo%20portfólio%20e%20gostaria%20de%20solicitar%20um%20orçamento.`;

const skillTracks = [
  {
    number: "01",
    title: "Tecnologia e produto",
    text: "Lógica, interfaces e organização para transformar uma ideia em uma experiência clara e utilizável.",
    tools: "HTML · CSS · JavaScript · Python",
  },
  {
    number: "02",
    title: "Conteúdo e narrativa",
    text: "Roteiro, ritmo e edição para comunicar uma mensagem sem excesso e com intenção.",
    tools: "Roteiro · edição · vídeo vertical · direção",
  },
  {
    number: "03",
    title: "Imagem aérea e terrestre",
    text: "Enquadramento, movimento e leitura de espaço para registrar o que precisa ser percebido.",
    tools: "Drone · câmera · composição · captação",
  },
];

const serviceOffers = [
  {
    number: "01",
    label: "drone / perspectiva aérea",
    title: "Filmagem aérea",
    text: "Perspectiva aérea para revelar escala, movimento e a energia que só aparece quando a câmera sobe.",
    detail: "ENQUADRAMENTO · ESCALA · ATMOSFERA",
    delivery: "9:16 · 16:9",
    duration: "15–60 s / 1–2 min",
    Icon: Plane,
  },
  {
    number: "02",
    label: "câmera / registro em solo",
    title: "Captação terrestre",
    text: "Câmera no ponto certo para acompanhar pessoas, detalhes e o que realmente acontece no momento.",
    detail: "PRESENÇA · RITMO · DETALHE",
    delivery: "Reels · aftermovie",
    duration: "30–90 s / 1–3 min",
    Icon: Camera,
  },
  {
    number: "03",
    label: "narrativa / presença digital",
    title: "Criação de conteúdo",
    text: "Conteúdo que transforma um momento, uma marca ou uma ideia em material pronto para chamar atenção.",
    detail: "IDEIA · REGISTRO · CONEXÃO",
    delivery: "3–5 vídeos verticais",
    duration: "15–60 s por peça",
    Icon: Clapperboard,
  },
];

const processSteps = [
  {
    number: "01",
    title: "Alinhamos o objetivo",
    text: "Contexto, público e resultado esperado entram na conversa antes de qualquer produção.",
  },
  {
    number: "02",
    title: "Escolhemos o formato",
    text: "Referências, linguagem, data e entrega são definidos de forma simples e transparente.",
  },
  {
    number: "03",
    title: "Produzimos com clareza",
    text: "O material é captado, organizado e entregue pronto para o próximo uso do projeto.",
  },
];

const caseStudies = [
  {
    id: "ARQ.01",
    title: "Chá da Eloise",
    context: "Evento social com foco em atmosfera, pessoas e detalhes que ajudam a memória do dia.",
    method: "Planos abertos, aproximações e movimentos suaves para equilibrar espaço e presença.",
    learning: "A imagem funciona quando o ambiente e as pessoas têm espaço para aparecer.",
    tags: ["Evento", "Vídeo", "Aéreo"],
  },
  {
    id: "ARQ.02",
    title: "RHAM — serviços no app",
    context: "Conteúdo vertical para apresentar uma jornada de serviços com rapidez e clareza.",
    method: "Sequência curta, leitura de tela e ritmo guiando cada etapa da experiência.",
    learning: "Legibilidade e ritmo também são parte do produto final.",
    tags: ["Interface", "Conteúdo", "Vertical"],
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

type SearchSuggestion = {
  value: string;
  source: "projeto" | "tecnologia" | "descrição";
};

const descriptionStopWords = new Set([
  "a", "ao", "as", "com", "da", "de", "do", "dos", "e", "em", "na", "nas", "no", "nos", "o", "os", "ou", "para", "por", "que", "uma", "um",
]);

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function renderSuggestionMatch(value: string, query: string, isActive: boolean) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return value;

  const characters = Array.from(value);
  const normalizedCharacters = characters.map((character) => normalizeSearchText(character));
  const normalizedValue = normalizedCharacters.join("");
  const matchStart = normalizedValue.indexOf(normalizedQuery);
  if (matchStart < 0) return value;

  let characterStart = 0;
  let characterEnd = characters.length;
  let normalizedOffset = 0;
  for (let index = 0; index < normalizedCharacters.length; index += 1) {
    const nextOffset = normalizedOffset + normalizedCharacters[index].length;
    if (normalizedOffset <= matchStart && matchStart < nextOffset) characterStart = index;
    if (normalizedOffset < matchStart + normalizedQuery.length && matchStart + normalizedQuery.length <= nextOffset) {
      characterEnd = index + 1;
      break;
    }
    normalizedOffset = nextOffset;
  }

  return <>{characters.slice(0, characterStart).join("")}<strong data-suggestion-match="true" className={`font-bold ${isActive ? "text-[#02111f]" : "text-white"}`}>{characters.slice(characterStart, characterEnd).join("")}</strong>{characters.slice(characterEnd).join("")}</>;
}

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
const repertoireSignals = [
  {
    label: "escala e perspectiva",
    title: "Imagem aérea",
    text: "Leitura de espaço, movimento e contexto para apresentar um lugar de outro ponto de vista.",
    cover: "/manus-storage/campo-iluminado-04_665a6d8f.jpg",
  },
  {
    label: "clareza e ritmo",
    title: "Interface em movimento",
    text: "Registro de produto e serviço com foco no que a pessoa precisa entender primeiro.",
    cover: "/manus-storage/rham-interface-servicos-01_72f2d942.jpg",
  },
  {
    label: "presença e detalhe",
    title: "Registro de evento",
    text: "Captação que aproxima o público da atmosfera, das pessoas e dos pequenos momentos.",
    cover: "/manus-storage/cha-da-eloise-capa_0d17d433.jpg",
  },
];

const technologyFilters = ["Todos", "Vídeo", "Drone", "Conteúdo", "Interface", "Noturno", "HTML", "CSS", "JavaScript", "Python"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [activeTechnology, setActiveTechnology] = useState("Todos");
  const [isProjectFilterTransitioning, setIsProjectFilterTransitioning] = useState(false);
  const [isCompactGallery, setIsCompactGallery] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const [isProjectSearchFocused, setIsProjectSearchFocused] = useState(false);
  const [activeSearchSuggestionIndex, setActiveSearchSuggestionIndex] = useState(-1);
  const [selectedProject, setSelectedProject] = useState<Repository | null>(null);
  const [availabilityDate, setAvailabilityDate] = useState<Date | null>(null);
  const [availabilityTime, setAvailabilityTime] = useState<string | null>(null);
  const [isAvailabilityRedirecting, setIsAvailabilityRedirecting] = useState(false);
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const successMessageRef = useRef<HTMLDivElement>(null);
  const projectFilterTimerRef = useRef<number | null>(null);
  const projectSearchInputRef = useRef<HTMLInputElement>(null);
  const {
    data: blockedDates = [],
    isError: isBlockedDatesError,
    refetch: refetchBlockedDates,
  } = trpc.availability.listBlocked.useQuery();

  const normalizedProjectSearch = normalizeSearchText(projectSearch);
  const projectSearchSuggestions = useMemo<SearchSuggestion[]>(() => {
    const candidates = new Map<string, SearchSuggestion>();
    const addCandidate = (value: string, source: SearchSuggestion["source"]) => {
      const normalizedValue = normalizeSearchText(value);
      if (!normalizedValue || candidates.has(normalizedValue)) return;
      candidates.set(normalizedValue, { value, source });
    };

    repositories
      .filter((repository) => activeTechnology === "Todos" || repository.technologies.includes(activeTechnology))
      .forEach((repository) => {
      addCandidate(repository.name, "projeto");
      repository.technologies.forEach((technology) => addCandidate(technology, "tecnologia"));
      repository.description
        .split(/[^A-Za-zÀ-ÿ0-9]+/)
        .filter((word) => word.length >= 4 && !descriptionStopWords.has(normalizeSearchText(word)))
        .forEach((word) => addCandidate(word, "descrição"));
    });

    return Array.from(candidates.values());
  }, [activeTechnology]);
  const visibleSearchSuggestions = normalizedProjectSearch.length >= 2
    ? projectSearchSuggestions
      .filter((suggestion) => normalizeSearchText(suggestion.value).includes(normalizedProjectSearch))
      .slice(0, 6)
    : [];
  const visibleRepositories = repositories.filter((repository) => {
    const matchesTechnology = activeTechnology === "Todos" || repository.technologies.includes(activeTechnology);
    const searchableProjectText = normalizeSearchText([repository.name, repository.description, ...repository.technologies].join(" "));
    const matchesSearch = !normalizedProjectSearch || searchableProjectText.includes(normalizedProjectSearch);
    return matchesTechnology && matchesSearch;
  });
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const blockedDateKeys = useMemo(() => new Set(blockedDates.map((blockedDate) => blockedDate.dateKey)), [blockedDates]);
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const leadingDays = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const calendarDays = Array.from({ length: leadingDays + daysInMonth }, (_, index) => index < leadingDays ? null : new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index - leadingDays + 1));
  const selectedDateLabel = availabilityDate ? formatAvailabilityDate(availabilityDate) : "";
  const selectedDateKey = availabilityDate ? toDateKey(availabilityDate) : "";
  const availabilityWhatsAppUrl = availabilityDate && availabilityTime
    ? buildAvailabilityWhatsAppUrl(whatsAppNumber, availabilityDate, availabilityTime)
    : "";
  const isAvailabilityConsultationReadyForUser = isAvailabilityConsultationReady(availabilityDate, availabilityTime, isBlockedDatesError);

  useEffect(() => {
    if (formSent) successMessageRef.current?.focus();
  }, [formSent]);

  useEffect(() => {
    if (isBlockedDatesError || (availabilityDate && blockedDateKeys.has(toDateKey(availabilityDate)))) {
      setAvailabilityDate(null);
      setAvailabilityTime(null);
    }
  }, [availabilityDate, blockedDateKeys, isBlockedDatesError]);

  useEffect(() => () => {
    if (projectFilterTimerRef.current) window.clearTimeout(projectFilterTimerRef.current);
  }, []);

  const quoteRequestMutation = trpc.quoteRequest.create.useMutation({
    onSuccess: () => setFormSent(true),
    onError: () => setFormError("Não foi possível enviar agora. Confira sua conexão e tente novamente."),
  });

  function closeMenu() {
    setMenuOpen(false);
  }

  function selectTechnology(technology: string) {
    if (technology === activeTechnology || isProjectFilterTransitioning) return;
    if (projectFilterTimerRef.current) window.clearTimeout(projectFilterTimerRef.current);
    setIsProjectFilterTransitioning(true);
    projectFilterTimerRef.current = window.setTimeout(() => {
      setActiveTechnology(technology);
      projectFilterTimerRef.current = window.setTimeout(() => setIsProjectFilterTransitioning(false), 40);
    }, 130);
  }

  function applyProjectSearchSuggestion(suggestion: SearchSuggestion) {
    setProjectSearch(suggestion.value);
    setActiveSearchSuggestionIndex(-1);
    setIsProjectSearchFocused(false);
    window.requestAnimationFrame(() => projectSearchInputRef.current?.focus());
  }

  function clearProjectSearch() {
    setProjectSearch("");
    setActiveSearchSuggestionIndex(-1);
    setIsProjectSearchFocused(false);
    window.requestAnimationFrame(() => projectSearchInputRef.current?.focus());
  }

  function handleProjectSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setActiveSearchSuggestionIndex(-1);
      setIsProjectSearchFocused(false);
      return;
    }
    if (!visibleSearchSuggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSearchSuggestionIndex((current) => (current + 1) % visibleSearchSuggestions.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSearchSuggestionIndex((current) => current <= 0 ? visibleSearchSuggestions.length - 1 : current - 1);
    }
    if (event.key === "Enter" && activeSearchSuggestionIndex >= 0) {
      event.preventDefault();
      applyProjectSearchSuggestion(visibleSearchSuggestions[activeSearchSuggestionIndex]);
    }
  }

  function consultAvailabilityOnWhatsApp() {
    if (!availabilityWhatsAppUrl || isAvailabilityRedirecting || isBlockedDatesError) return;

    setIsAvailabilityRedirecting(true);
    window.setTimeout(() => {
      const whatsappWindow = window.open(availabilityWhatsAppUrl, "_blank", "noopener,noreferrer");
      if (!whatsappWindow) {
        window.location.assign(availabilityWhatsAppUrl);
      }
      setIsAvailabilityRedirecting(false);
    }, 240);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const eventDate = String(data.get("date") || "");
    setFormError(null);
    setFormSent(false);
    quoteRequestMutation.mutate(
      {
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        service: String(data.get("service") || ""),
        projectType: String(data.get("projectType") || ""),
        location: String(data.get("location") || ""),
        eventDate: eventDate || undefined,
        delivery: String(data.get("delivery") || "") || undefined,
        budget: String(data.get("budget") || "") || undefined,
        briefing: String(data.get("briefing") || ""),
      },
      { onSuccess: () => form.reset() },
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030b1e] text-[#f2fbff] selection:bg-[#38bdf8] selection:text-[#02111f]">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-cyan-200/[0.10] bg-[#030b1e]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#inicio" aria-label="Ir ao início" className="group flex items-center gap-3" onClick={closeMenu}>
            <span className="grid h-10 w-10 place-items-center border border-[#67e8f9]/60 bg-[#062044] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.32)]">
              <img src={markUrl} alt="Símbolo PG" width="28" height="28" decoding="async" className="h-7 w-7 object-contain" />
            </span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#b7cdf1]">
              Pablo <span className="text-[#67e8f9]">/</span> Guilherme
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
            {[
                ["manifesto", "#sobre"],
                ["atuação", "#trilha"],
                ["serviços", "#servicos"],
                ["trabalhos", "#projetos"],
                ["social", "#social"],
            ].map(([label, href]) => (
              <a key={label} href={href} className="nav-link text-[11px] font-mono uppercase tracking-[0.14em] text-[#90a3c3] transition-colors hover:text-white">
                {label}
              </a>
            ))}
            <a href="#contato" className="inline-flex items-center gap-2 border border-[#67e8f9] bg-[#38bdf8] px-4 py-2 text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-all hover:bg-[#a5f3fc] hover:shadow-[0_0_28px_rgba(56,189,248,0.36)]">
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
          <div className="pointer-events-none absolute inset-y-0 right-0 w-full bg-[linear-gradient(90deg,#030b1e_5%,rgba(3,11,30,0.94)_30%,rgba(3,11,30,0.30)_68%,rgba(3,11,30,0.62)_100%)] lg:w-[80%]" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-52 bg-[linear-gradient(0deg,#030b1e,transparent)]" />
          <div className="pointer-events-none absolute right-[8%] top-[18%] hidden w-24 opacity-30 drop-shadow-[0_0_26px_rgba(56,189,248,0.65)] lg:block"><img src={markUrl} alt="" width="160" height="160" decoding="async" className="w-full" /></div>

          <div className="relative mx-auto flex min-h-[734px] max-w-[1440px] flex-col justify-between px-5 pb-8 pt-16 sm:px-8 sm:pt-24 lg:min-h-[774px] lg:px-12">
            <div className="max-w-4xl">
              <div className="reveal flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a5f3fc]">
                <span className="h-px w-10 bg-[#38bdf8]" />
                01 / portfólio em movimento
              </div>
              <h1 className="reveal delay-1 mt-7 max-w-4xl font-display text-[clamp(3.4rem,8.8vw,8.8rem)] font-semibold leading-[0.82] tracking-[-0.075em] text-white">
                Ideias que ganham forma.
                <br />
                Projetos que
                <br />
                seguem em movimento.
              </h1>
              <div className="reveal delay-2 mt-9 flex max-w-xl flex-col gap-6 sm:ml-[16.8%]">
                <p className="text-balance font-body text-base leading-8 text-[#bed0ea] sm:text-lg">
                  Um repertório que combina tecnologia, conteúdo e imagem para transformar uma boa ideia em algo claro, útil e pronto para circular.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a href="#sobre" className="group inline-flex items-center gap-3 bg-[#38bdf8] px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[#02111f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_10px_30px_rgba(56,189,248,0.32)] active:scale-[0.97]">
                    ver como podemos trabalhar <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  </a>
                  <a href="#contato" className="inline-flex items-center gap-2 px-2 py-3 font-mono text-[11px] uppercase tracking-[0.13em] text-[#b7cdf1] transition-colors hover:text-white">
                    conversar sobre o projeto <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="reveal delay-3 grid border-t border-white/[0.12] pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-sm font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-[#7890b4]">
                STATUS: aprendendo na prática<br />
                FOCO ATUAL: TI · CONTEÚDO · AUDIOVISUAL<br />
                ATENDIMENTO: ÁGUAS LINDAS · PLANALTINA · ENTORNO
              </p>
              <a href="#sobre" className="mt-6 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#b7cdf1] transition-colors hover:text-[#3b82f6] sm:mt-0">
                ver repertório e skills <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

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
                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#91b9cd]">— direção e processo</p>
                  </aside>
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
                    <img src={portraitUrl} alt="Pablo Guilherme" width="720" height="860" loading="lazy" decoding="async" className="h-64 w-full object-cover object-center saturate-[0.8] contrast-110 transition-transform duration-700 hover:scale-[1.03] sm:h-72" />
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

        <section id="trilha" className="archive-chapter relative overflow-hidden border-t border-white/[0.07] bg-[#070a10] py-16 sm:py-24 lg:py-32">
          <div className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-[0.13] mix-blend-screen" style={{ backgroundImage: `url(${textureUrl})` }} />
          <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.4fr] lg:gap-20">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">03 / frentes de atuação</p>
                <h2 className="mt-5 max-w-md font-display text-[clamp(2.4rem,4vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">Skills para tirar ideias do lugar.</h2>
                <p className="mt-6 max-w-sm font-body text-base leading-7 text-[#b6d7eb]">As frentes se complementam: estratégia e execução, tela e presença, detalhe e visão geral.</p>
              </div>
              <div className="border-t border-white/[0.1]">
                {skillTracks.map((skill) => (
                  <article key={skill.number} className="group grid gap-4 border-b border-white/[0.1] py-7 sm:grid-cols-[70px_1fr_auto] sm:items-start sm:gap-7 sm:py-8">
                    <span className="font-mono text-xs text-[#3b82f6]">{skill.number}</span>
                    <div>
                      <h3 className="font-display text-2xl font-medium text-[#eff6ff] transition-colors group-hover:text-[#69a1ff]">{skill.title}</h3>
                      <p className="mt-3 max-w-lg font-body text-sm leading-7 text-[#9eb0cc]">{skill.text}</p>
                      <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f91b7]">{skill.tools}</p>
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
                  <article key={signal.title} className="group relative min-h-[270px] overflow-hidden bg-[#07101c] p-5 sm:p-6">
                    <img src={signal.cover} alt={`Referência visual: ${signal.title}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-45 saturate-[0.75] transition duration-500 group-hover:scale-105 group-hover:opacity-60" />
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
                <h2 className="mt-5 max-w-md font-display text-[clamp(2.7rem,4.8vw,5.5rem)] font-medium leading-[0.93] tracking-[-0.06em] text-white">Do briefing à entrega,<br />com clareza.</h2>
                <div className="mt-7 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#7795bf]"><img src={markUrl} alt="" className="h-5 w-5 object-contain" /> PG // direção e imagem</div>
              </div>
              <div className="lg:pb-2">
                <p className="max-w-2xl font-body text-base leading-8 text-[#c0e3f4]">Cada projeto recebe uma combinação de direção, captação e organização para que a entrega seja clara antes, durante e depois da produção.</p>
                <a href="#contato" className="mt-7 inline-flex items-center gap-2 border-b border-[#3b82f6] pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#e3eeff] transition-colors hover:text-[#76aaff]">falar sobre um projeto <ArrowUpRight className="h-3.5 w-3.5" /></a>
              </div>
            </div>

            <div className="mt-8 divide-y divide-white/[0.1] border-y border-white/[0.1]">
              {serviceOffers.map(({ number, label, title, text, detail, delivery, duration, Icon }, index) => (
                <article key={number} className={`group relative grid gap-7 py-9 sm:py-11 lg:items-start ${index === 1 ? "lg:grid-cols-[0.5fr_1.1fr_0.8fr] lg:pl-[12%]" : "lg:grid-cols-[0.42fr_1.18fr_0.9fr]"}`}>
                  <div className="flex items-start justify-between gap-4 lg:pr-8">
                    <div><span className="font-mono text-xl text-[#3b82f6]">{number}</span><p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#607aa1]">PG / SVC.{number}</p></div>
                    <span className="grid h-11 w-11 place-items-center border border-[#3b82f6]/25 bg-[#0c1728] text-[#71a6fb] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white"><Icon className="h-5 w-5" /></span>
                  </div>
                  <div className="lg:border-l lg:border-white/[0.1] lg:pl-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#7190bd]">{label}</p>
                    <h3 className="mt-4 font-display text-[clamp(2rem,3vw,3.2rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">{title}</h3>
                    <p className="mt-5 max-w-lg font-body text-sm leading-7 text-[#a4b5cf]">{text}</p>
                  </div>
                  <div className="border-t border-white/[0.1] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f8db8]">{detail}</p>
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div><p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#516987]">entrega</p><p className="mt-1 font-mono text-[9px] uppercase leading-4 tracking-[0.08em] text-[#b6cae8]">{delivery}</p></div>
                      <div><p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#516987]">duração típica</p><p className="mt-1 font-mono text-[9px] uppercase leading-4 tracking-[0.08em] text-[#b6cae8]">{duration}</p></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-5 max-w-3xl font-mono text-[9px] uppercase leading-5 tracking-[0.11em] text-[#637da5]">REFERÊNCIAS INICIAIS DE MERCADO. FORMATOS, QUANTIDADE DE PEÇAS E DURAÇÃO PODEM SER AJUSTADOS CONFORME O OBJETIVO DE CADA PROJETO.</p>
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

        <section id="projetos" className="archive-chapter relative border-y border-white/[0.07] bg-[#0a0f18]">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
            <div className="flex flex-col justify-between gap-6 border-b border-white/[0.1] pb-9 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">06 / trabalhos selecionados</p>
                <h2 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,5rem)] font-medium leading-none tracking-[-0.06em] text-white">Repertório em uso,<br className="hidden sm:block" /> não só na vitrine.</h2>
                <div className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#7795bf]"><img src={markUrl} alt="" className="h-5 w-5 object-contain" /> PG // arquivo visual em progresso</div>
              </div>
              <p className="max-w-sm font-body text-sm leading-7 text-[#b6d7eb]">Registros reais para mostrar como repertório, linguagem e execução se encontram em diferentes formatos.</p>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-y border-white/[0.1] py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2" aria-label="Filtrar repositórios por tecnologia">
              {technologyFilters.map((technology) => (
                <button
                  type="button"
                  key={technology}
                  onClick={() => selectTechnology(technology)}
                  aria-busy={isProjectFilterTransitioning}
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
              <button
                type="button"
                onClick={() => setIsCompactGallery((current) => !current)}
                aria-pressed={isCompactGallery}
                aria-label={isCompactGallery ? "Voltar para visualização detalhada" : "Ativar visualização compacta"}
                className={`inline-flex shrink-0 items-center justify-center gap-2 border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f18] ${isCompactGallery ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : "border-white/[0.12] bg-[#07101e] text-[#9eb5d2] hover:border-[#67e8f9]/60 hover:text-white"}`}
              >
                <Layers2 className="h-3.5 w-3.5" /> {isCompactGallery ? "modo compacto" : "modo detalhado"}
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block w-full sm:max-w-md">
                <span className="sr-only">Buscar trabalho por nome, tecnologia ou descrição</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6e8bad]" aria-hidden="true" />
                <input
                  ref={projectSearchInputRef}
                  type="search"
                  role="combobox"
                  value={projectSearch}
                  onChange={(event) => {
                    setProjectSearch(event.target.value);
                    setActiveSearchSuggestionIndex(-1);
                    setIsProjectSearchFocused(true);
                  }}
                  onFocus={() => setIsProjectSearchFocused(true)}
                  onBlur={() => setIsProjectSearchFocused(false)}
                  onKeyDown={handleProjectSearchKeyDown}
                  placeholder="buscar por nome, tecnologia ou descrição"
                  aria-describedby="project-search-feedback"
                  aria-autocomplete="list"
                  aria-controls="project-search-suggestions"
                  aria-expanded={isProjectSearchFocused && visibleSearchSuggestions.length > 0}
                  aria-activedescendant={activeSearchSuggestionIndex >= 0 ? `project-search-suggestion-${activeSearchSuggestionIndex}` : undefined}
                  className="w-full border border-white/[0.12] bg-[#07101e] py-3 pl-10 pr-10 font-mono text-[10px] uppercase tracking-[0.1em] text-white placeholder:text-[#59718f] transition-colors focus:border-[#67e8f9] focus:outline-none focus:ring-2 focus:ring-[#a5f3fc] focus:ring-offset-2 focus:ring-offset-[#0a0f18]"
                />
                {isProjectSearchFocused && visibleSearchSuggestions.length > 0 && (
                  <ul id="project-search-suggestions" role="listbox" aria-label="Sugestões de busca" className="absolute z-20 mt-2 w-full overflow-hidden border border-[#67e8f9]/35 bg-[#061226] shadow-[0_18px_40px_rgba(0,0,0,0.36)]">
                    {visibleSearchSuggestions.map((suggestion, index) => (
                      <li
                        key={`${suggestion.source}-${suggestion.value}`}
                        id={`project-search-suggestion-${index}`}
                        role="option"
                        aria-selected={activeSearchSuggestionIndex === index}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => applyProjectSearchSuggestion(suggestion)}
                        className={`flex cursor-pointer items-center justify-between gap-4 border-b border-white/[0.08] px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] last:border-b-0 ${activeSearchSuggestionIndex === index ? "bg-[#38bdf8] text-[#02111f]" : "text-[#d6ecf8] hover:bg-[#0a2446]"}`}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          {suggestion.source === "projeto" ? <FolderGit2 data-suggestion-icon="projeto" className={`h-3.5 w-3.5 shrink-0 ${activeSearchSuggestionIndex === index ? "text-[#083760]" : "text-[#60a5fa]"}`} aria-hidden="true" /> : suggestion.source === "tecnologia" ? <Braces data-suggestion-icon="tecnologia" className={`h-3.5 w-3.5 shrink-0 ${activeSearchSuggestionIndex === index ? "text-[#083760]" : "text-[#67e8f9]"}`} aria-hidden="true" /> : <FileText data-suggestion-icon="descrição" className={`h-3.5 w-3.5 shrink-0 ${activeSearchSuggestionIndex === index ? "text-[#083760]" : "text-[#a5b4fc]"}`} aria-hidden="true" />}
                          <span className="truncate">{renderSuggestionMatch(suggestion.value, projectSearch, activeSearchSuggestionIndex === index)}</span>
                        </span>
                        <span className={`shrink-0 text-[8px] tracking-[0.12em] ${activeSearchSuggestionIndex === index ? "text-[#083760]" : "text-[#6f9cbd]"}`}>{suggestion.source}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={clearProjectSearch}
                  aria-label="Limpar busca de trabalhos"
                  title="Limpar busca"
                  tabIndex={projectSearch ? 0 : -1}
                  className={`absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center border border-transparent text-[#91acd0] transition-[opacity,transform,background-color,border-color,color] duration-200 focus-visible:border-[#67e8f9]/60 focus-visible:bg-[#0b2746] focus-visible:text-[#eaffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101e] active:scale-95 ${projectSearch ? "scale-100 opacity-100 hover:border-[#67e8f9]/35 hover:bg-[#0b2746] hover:text-white" : "pointer-events-none scale-95 opacity-0"}`}
                >
                  <X className="h-4 w-4 transition-transform duration-200 hover:rotate-90" aria-hidden="true" />
                  <span className="sr-only">Limpar busca de trabalhos</span>
                </button>
              </label>
              <p id="project-search-feedback" role="status" aria-live="polite" className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#6e89ab]">{visibleRepositories.length} {visibleRepositories.length === 1 ? "trabalho encontrado" : "trabalhos encontrados"}{projectSearch ? ` para “${projectSearch}”` : ""}</p>
            </div>

            <div aria-busy={isProjectFilterTransitioning} className={`project-gallery-stage mt-8 transition-[opacity,transform] duration-200 ${isProjectFilterTransitioning ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}>
            {visibleRepositories.length > 0 ? (
              <div className={`grid gap-px bg-white/[0.1] ${isCompactGallery ? "sm:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-3"}`}>
                {visibleRepositories.map((repository, index) => {
                  const cardContent = (
                    <>
                      {repository.cover && <img src={repository.cover} alt={`Capa do trabalho ${repository.name}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-55 saturate-[0.75] transition-transform duration-700 group-hover:scale-105" />}
                      {repository.cover && <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,16,0.18),rgba(6,10,16,0.95)_78%)]" />}
                      <span className="relative flex items-start justify-between gap-4">
                        <span><span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#bdcff0]">{repository.id}</span>{!isCompactGallery && <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.12em] text-[#8b9cb4]">EVIDÊNCIA / FRAME {String(index + 1).padStart(2, "0")}</span>}</span>
                        {repository.kind === "video" ? <span className="grid h-9 w-9 place-items-center border border-[#8bb4ff]/50 bg-[#3b82f6]/25 text-[#f3f8ff] transition-all duration-200 group-hover:scale-110 group-hover:bg-[#3b82f6]"><Play className="h-4 w-4 fill-current" /></span> : <ArrowUpRight className="h-4 w-4 text-[#6fa4ff] transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />}
                      </span>
                      <span className="relative mt-auto block">
                        <span className={`${isCompactGallery ? "mb-3" : "mb-5"} flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.13em] text-[#a4b1c6]`}>{repository.kind === "video" ? <><Clapperboard className="h-3.5 w-3.5" /> registro de campo / assistir</> : "repositório"}</span>
                        <span className={`block font-display font-medium leading-[1.02] tracking-[-0.04em] text-white ${isCompactGallery ? "text-xl" : "text-3xl"}`}>{repository.name}</span>
                        {!isCompactGallery && <span className="mt-4 block max-w-md font-body text-sm leading-6 text-[#c2d0e4]">{repository.description}</span>}
                        <span className={`${isCompactGallery ? "mt-4" : "mt-6"} flex flex-wrap gap-2`}>
                          {(isCompactGallery ? repository.technologies.slice(0, 2) : repository.technologies).map((technology) => <span key={technology} className="border border-white/15 bg-[#07101e]/65 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#abb9ce]">{technology}</span>)}
                        </span>
                      </span>
                    </>
                  );

                  return repository.kind === "video" ? (
                    <button key={`${activeTechnology}-${repository.id}`} type="button" onClick={() => setSelectedProject(repository)} style={{ animationDelay: `${index * 45}ms` }} className={`project-gallery-card group relative flex flex-col overflow-hidden bg-[#0a0f18] text-left transition-colors hover:bg-[#0d1523] ${isCompactGallery ? "min-h-[220px] p-4 sm:min-h-[250px] sm:p-5" : `p-6 sm:p-8 ${repository.featured ? "min-h-[440px] lg:col-span-2" : "min-h-[380px]"}`}`}>
                      {cardContent}
                    </button>
                  ) : (
                    <a key={`${activeTechnology}-${repository.id}`} href={repository.url} target="_blank" rel="noreferrer" style={{ animationDelay: `${index * 45}ms` }} className={`project-gallery-card group relative flex flex-col overflow-hidden bg-[#0a0f18] transition-colors hover:bg-[#0d1523] ${isCompactGallery ? "min-h-[220px] p-4 sm:min-h-[250px] sm:p-5" : "min-h-[380px] p-6 sm:p-8"}`}>
                      {cardContent}
                    </a>
                  );
                })}
              </div>
            ) : (
              <div key={`empty-${activeTechnology}`} className="project-gallery-empty grid border border-white/[0.1] bg-[#09101c] lg:grid-cols-[1.42fr_0.58fr]">
                <div className="relative overflow-hidden p-7 sm:p-10">
                  <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-35" />
                  <div className="relative">
                    <span className="grid h-12 w-12 place-items-center border border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#70a6ff]"><FolderGit2 className="h-5 w-5" /></span>
                    <p className="mt-8 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#72a7fb]">arquivo em preparo / novos trabalhos</p>
                    <h3 className="mt-4 max-w-xl font-display text-[clamp(2rem,3.5vw,3.7rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">Quando você quiser, a próxima história começa aqui.</h3>
                    <p className="mt-5 max-w-2xl font-body text-sm leading-7 text-[#9fb2ce]">
                      {projectSearch.trim()
                        ? `Nenhum trabalho real com “${projectSearch.trim()}” no nome, tecnologia ou descrição corresponde ao filtro ${activeTechnology}. Tente outro termo ou limpe a busca.`
                        : activeTechnology === "Todos"
                        ? "Quando houver um link do GitHub, um vídeo ou uma nova filmagem, o registro pode entrar aqui com descrição, tecnologias e acesso direto."
                        : `Ainda não há um trabalho real marcado com ${activeTechnology}. Quando houver, ele será filtrado aqui automaticamente.`}
                    </p>
                    <a href="#contato" className="mt-7 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.13em] text-[#d9e8ff] transition-colors hover:text-[#70a6ff]">enviar material para incluir <ArrowUpRight className="h-3.5 w-3.5" /></a>
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

            <div className="mt-16 border-t border-cyan-100/[0.12] pt-8 sm:pt-10">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a5f3fc]">por trás dos trabalhos</p>
                  <h3 className="mt-3 font-display text-[clamp(2rem,3vw,3.5rem)] font-medium leading-none tracking-[-0.05em] text-white">Contexto, escolha e resultado.</h3>
                </div>
                <p className="max-w-sm font-body text-sm leading-7 text-[#accddd]">Cada estudo resume o que precisava ser resolvido, qual caminho foi escolhido e o que a entrega comprova.</p>
              </div>
              <div className="mt-8 grid gap-px bg-cyan-100/[0.1] lg:grid-cols-2">
                {caseStudies.map((study) => (
                  <article key={study.id} className="relative bg-[#071326] p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4"><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#67e8f9]">{study.id}</span><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7899ae]">nota de processo</span></div>
                    <h4 className="mt-7 font-display text-3xl font-medium tracking-[-0.04em] text-white">{study.title}</h4>
                    <dl className="mt-6 grid gap-5 font-body text-sm leading-7 text-[#bcd9e7]">
                      <div><dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">contexto</dt><dd className="mt-1">{study.context}</dd></div>
                      <div><dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">como resolvi</dt><dd className="mt-1">{study.method}</dd></div>
                      <div><dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">o que aprendi</dt><dd className="mt-1 text-[#d9f4ff]">{study.learning}</dd></div>
                    </dl>
                    <div className="mt-7 flex flex-wrap gap-2">{study.tags.map((tag) => <span key={tag} className="border border-cyan-100/[0.16] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#a5dff4]">{tag}</span>)}</div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Suspense fallback={<section id="social" className="archive-chapter border-t border-white/[0.07] bg-[#050c18] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28" aria-label="Carregando repertório social"><div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">carregando repertório social</div></section>}><InstagramRepertoire /></Suspense>

        <section id="contato" className="archive-chapter relative overflow-hidden bg-[#070a10]">
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto grid max-w-[1440px] lg:grid-cols-[1fr_1.12fr]">
            <div className="border-b border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24 lg:border-b-0 lg:border-r lg:px-12 lg:py-28">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">08 / solicitação de orçamento</p>
                <h2 className="mt-6 max-w-xl font-display text-[clamp(3.1rem,5.6vw,6rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">Tem um projeto? Vamos dar forma.</h2>
                <p className="mt-8 max-w-md font-body text-base leading-8 text-[#c0e3f4]">Não precisa chegar com tudo pronto. Compartilhe o contexto e, juntos, definimos o formato mais útil para o projeto.</p>
              <div className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8ca4c8]"><span className="human-status-dot h-2 w-2 shrink-0 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" /> agenda aberta para novos projetos — vamos começar pelo contexto</div>
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
              <a href="https://ig.me/m/pablogui000" target="_blank" rel="noreferrer" className="group mt-5 inline-flex items-center gap-3 border border-[#38bdf8]/45 bg-[#071b39] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#e4faff] transition-all hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0a2b57] hover:shadow-[0_10px_24px_rgba(56,189,248,0.16)]"><Instagram className="h-4 w-4 text-[#67e8f9]" /> mensagem rápida no Instagram <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
              <div className="mt-5 max-w-md border border-cyan-100/[0.16] bg-[#06172f]/70 px-5 py-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#67e8f9]" />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">área de atendimento</p>
                    <p className="mt-2 font-body text-sm leading-6 text-[#d3edf8]">Águas Lindas de Goiás, Planaltina (GO/DF) e Entorno.</p>
                    <p className="mt-1 font-body text-xs leading-5 text-[#8eb4c8]">Outras regiões podem ser avaliadas conforme o projeto.</p>
                  </div>
                </div>
              </div>
              <div className="availability-calendar mt-5 max-w-md border border-cyan-100/[0.16] bg-[#06172f]/80 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div><p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">consulta de disponibilidade</p><p className="mt-1 font-body text-xs leading-5 text-[#a6c7d8]">Segunda a sexta, das 08:00 às 18:00.</p></div>
                  <span className="grid h-9 w-9 place-items-center border border-cyan-100/[0.2] text-[#67e8f9]"><CalendarDays className="h-4 w-4" /></span>
                </div>
                <div className="mt-5 flex items-center justify-between border-y border-cyan-100/[0.12] py-3">
                  <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} aria-label="Mês anterior" className="grid h-8 w-8 place-items-center text-[#b9dfef] transition-colors hover:bg-cyan-100/10 hover:text-[#67e8f9]"><ChevronLeft className="h-4 w-4" /></button>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#e2f7ff]">{calendarMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</p>
                  <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} aria-label="Próximo mês" className="grid h-8 w-8 place-items-center text-[#b9dfef] transition-colors hover:bg-cyan-100/10 hover:text-[#67e8f9]"><ChevronRight className="h-4 w-4" /></button>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                  {calendarWeekdays.map((day, index) => <span key={`${day}-${index}`} className="py-1 font-mono text-[9px] text-[#63849a]">{day}</span>)}
                  {calendarDays.map((day, index) => {
                    if (!day) return <span key={`blank-${index}`} />;
                    const dateKey = toDateKey(day);
                    const isBlockedDate = blockedDateKeys.has(dateKey);
                    const isAvailableDate = !isBlockedDatesError && isSelectableAvailabilityDate(day, todayStart, blockedDateKeys);
                    const isSelected = selectedDateKey === dateKey;
                    const dayLabel = day.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
                    return <button key={dateKey} type="button" disabled={!isAvailableDate} onClick={() => { setAvailabilityDate(day); setAvailabilityTime(null); }} aria-label={isBlockedDate ? `${dayLabel}, indisponível` : dayLabel} title={isBlockedDate ? "Data indisponível" : undefined} className={`mx-auto grid h-8 w-8 place-items-center rounded-full font-mono text-[10px] transition-all ${isSelected ? "bg-[#38bdf8] font-semibold text-[#02111f] shadow-[0_0_16px_rgba(56,189,248,0.36)]" : isBlockedDate ? "cursor-not-allowed border border-rose-400/55 bg-rose-400/10 text-rose-300 line-through" : isAvailableDate ? "text-[#d7eff9] hover:bg-cyan-100/15 hover:text-[#67e8f9]" : "cursor-not-allowed text-[#385367] line-through"}`}>{day.getDate()}</button>;
                  })}
                </div>
                {isBlockedDatesError ? <div role="alert" className="mt-3 border-l border-amber-300 bg-amber-300/10 px-3 py-2 font-body text-[11px] leading-5 text-amber-100">Não foi possível verificar as datas indisponíveis. A consulta está temporariamente desativada. <button type="button" onClick={() => void refetchBlockedDates()} className="font-semibold underline decoration-amber-200/60 underline-offset-2 hover:text-white">Tentar novamente</button></div> : blockedDates.length > 0 && <p className="mt-3 border-l border-rose-400/70 pl-3 font-body text-[11px] leading-5 text-rose-200">Datas riscadas em rosa estão indisponíveis para consulta.</p>}
                <div className="mt-5 border-t border-cyan-100/[0.12] pt-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7299ad]">{selectedDateLabel ? `horário desejado · ${selectedDateLabel}` : "escolha uma data útil"}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {availableTimes.map((time) => <button key={time} type="button" disabled={!availabilityDate || isBlockedDatesError} onClick={() => setAvailabilityTime(time)} className={`border py-2 font-mono text-[10px] transition-colors ${availabilityTime === time ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : availabilityDate && !isBlockedDatesError ? "border-cyan-100/[0.16] text-[#b9dfef] hover:border-[#67e8f9]/55 hover:text-[#67e8f9]" : "cursor-not-allowed border-white/[0.06] text-[#4b677a]"}`}>{time}</button>)}
                  </div>
                </div>
                <button type="button" disabled={!isAvailabilityConsultationReadyForUser || isAvailabilityRedirecting} onClick={consultAvailabilityOnWhatsApp} aria-busy={isAvailabilityRedirecting} aria-describedby="availability-feedback" className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#38bdf8] px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#02111f] transition-all hover:bg-[#a5f3fc] active:scale-[0.97] disabled:cursor-wait disabled:bg-[#16304c] disabled:text-[#6f91a8]">
                  {isAvailabilityRedirecting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> {getAvailabilityButtonLabel(true)}</> : isBlockedDatesError ? <>indisponível no momento</> : <><MessageCircle className="h-4 w-4 fill-current" aria-hidden="true" /> {getAvailabilityButtonLabel(false)}</>}
                </button>
                <span id="availability-feedback" role="status" aria-live="polite" className="sr-only">{isAvailabilityRedirecting ? "Abrindo o WhatsApp com sua data e horário selecionados." : ""}</span>
                <p className="mt-3 font-body text-[11px] leading-5 text-[#7fa2b6]">A gente confirma a data e o horário diretamente com você, sem compromisso.</p>
              </div>
              <div className="mt-7 max-w-md border-l-2 border-[#38bdf8] bg-[#071a35]/70 px-5 py-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">depois do seu briefing</p>
                <ol className="mt-4 space-y-3 font-body text-sm leading-6 text-[#cbe8f6]">
                  <li><span className="mr-2 font-mono text-[#67e8f9]">01</span>O contexto é organizado para definir o que realmente precisa ser produzido.</li>
                  <li><span className="mr-2 font-mono text-[#67e8f9]">02</span>Formato, data e detalhes são alinhados com transparência.</li>
                  <li><span className="mr-2 font-mono text-[#67e8f9]">03</span>A proposta chega com escopo, entrega e próximos passos claros.</li>
                </ol>
              </div>
            </div>

            <div className="px-5 py-16 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
              <form onSubmit={handleSubmit} className="max-w-xl">
                <div className="mb-8 flex items-center justify-between border-b border-white/[0.1] pb-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#b7cbe8]">formulário de briefing</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-[#637da5]">* campos obrigatórios</p>
                </div>
                <div className="grid gap-7">
                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">nome *</span>
                      <input required name="name" autoComplete="name" placeholder="Como você se chama?" className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">e-mail *</span>
                      <input required type="email" name="email" autoComplete="email" placeholder="voce@exemplo.com" className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                    </label>
                  </div>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">serviço desejado *</span>
                      <select required name="service" defaultValue="" className="mt-3 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                        <option value="" disabled>Selecione um serviço</option>
                        <option>Filmagem aérea com drone</option>
                        <option>Captação terrestre</option>
                        <option>Criação de conteúdo</option>
                        <option>Pacote combinado</option>
                        <option>Outro projeto</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">tipo de projeto *</span>
                      <select required name="projectType" defaultValue="" className="mt-3 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                        <option value="" disabled>Selecione uma opção</option>
                        <option>Evento social</option>
                        <option>Evento corporativo</option>
                        <option>Marca ou negócio</option>
                        <option>Imóvel ou espaço</option>
                        <option>Esporte ou atividade externa</option>
                        <option>Outro</option>
                      </select>
                    </label>
                  </div>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">local do projeto *</span>
                      <input required name="location" placeholder="Ex.: Águas Lindas de Goiás" className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">data prevista</span>
                      <input type="date" name="date" onFocus={(event) => { event.currentTarget.style.outline = "2px solid #a5f3fc"; event.currentTarget.style.outlineOffset = "3px"; event.currentTarget.style.boxShadow = "0 0 0 4px rgba(165, 243, 252, 0.28)"; }} onBlur={(event) => { event.currentTarget.style.outline = ""; event.currentTarget.style.outlineOffset = ""; event.currentTarget.style.boxShadow = ""; }} className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6] [color-scheme:dark]" />
                    </label>
                  </div>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">formato de entrega</span>
                      <select name="delivery" defaultValue="" className="mt-3 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                        <option value="">A definir</option>
                        <option>Vertical 9:16 para Reels</option>
                        <option>Horizontal 16:9</option>
                        <option>Vertical e horizontal</option>
                        <option>Fotos e vídeos</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">faixa de investimento</span>
                      <select name="budget" defaultValue="" className="mt-3 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                        <option value="">Prefiro conversar</option>
                        <option>Até R$ 500</option>
                        <option>R$ 500 a R$ 1.000</option>
                        <option>R$ 1.000 a R$ 2.000</option>
                        <option>Acima de R$ 2.000</option>
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">briefing do projeto *</span>
                    <textarea required name="briefing" rows={5} placeholder="Conte o objetivo, referências, o que precisa ser registrado e qualquer detalhe importante." className="mt-3 w-full resize-none border-b border-white/15 bg-transparent px-0 py-3 font-body text-base leading-7 text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                </div>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button disabled={quoteRequestMutation.isPending} type="submit" className="h-auto w-fit rounded-none bg-[#38bdf8] px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[#02111f] transition-all hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_12px_30px_rgba(56,189,248,0.30)] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70">
                    {quoteRequestMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> enviando pedido</> : <>quero conversar sobre o projeto <Send className="h-4 w-4" /></>}
                  </Button>
                  <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-[#647a9f]">seus dados ficam apenas neste pedido</p>
                </div>
                {formError && <p role="alert" className="mt-6 border-l-2 border-rose-400 bg-rose-400/10 px-4 py-3 font-body text-sm text-rose-100">{formError}</p>}
                {formSent && (
                  <div ref={successMessageRef} tabIndex={-1} role="status" aria-live="polite" className="quote-success mt-7 border border-[#3b82f6]/45 bg-[#0a1730] p-5">
                    <div className="flex gap-4">
                      <span className="quote-success-icon grid h-11 w-11 shrink-0 place-items-center border border-[#3b82f6] bg-[#3b82f6] text-white"><CheckCircle2 className="h-5 w-5" /></span>
                      <div>
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a5f3fc]">briefing recebido</p>
                        <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">Tudo certo: seu pedido chegou.</h3>
                        <p className="mt-2 max-w-lg font-body text-sm leading-6 text-[#d2edf8]">Obrigado por compartilhar sua ideia. Vou analisar as informações e retorno pelo e-mail informado para conversar sobre os próximos passos.</p>
                        <button type="button" onClick={() => setFormSent(false)} className="mt-4 inline-flex items-center gap-2 border-b border-[#3b82f6] pb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#e4efff] transition-colors hover:text-[#77a9fc]">quero contar outra ideia <ArrowUpRight className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.07] bg-[#06080d]">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <div className="flex items-center gap-3">
            <img src={markUrl} alt="" width="24" height="24" decoding="async" className="h-6 w-6 object-contain" />
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#7b91b3]">Pablo Guilherme · TI · conteúdo · audiovisual</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://www.instagram.com/pablogui000/" target="_blank" rel="noreferrer" aria-label="Instagram @pablogui000" className="footer-social-icon text-[#6e85a8]"><Instagram className="h-4 w-4" /></a>
            <a href="https://www.instagram.com/mpjstoryworks/" target="_blank" rel="noreferrer" aria-label="Instagram @mpjstoryworks" className="footer-social-icon text-[#6e85a8]"><Instagram className="h-4 w-4" /></a>
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#526783]">arquivo pessoal / em atualização contínua</p>
          </div>
        </div>
      </footer>

      <a href={whatsAppUrl} target="_blank" rel="noreferrer" aria-label="Falar com Pablo pelo WhatsApp sobre um orçamento" className="whatsapp-float fixed bottom-5 right-5 z-[60] inline-flex items-center gap-3 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.12em]">
        <MessageCircle className="h-5 w-5 fill-current" />
        <span className="hidden sm:inline">WhatsApp</span>
        <span className="hidden max-w-0 overflow-hidden whitespace-nowrap text-[9px] font-medium tracking-[0.08em] opacity-0 transition-all duration-200 group-hover:max-w-[180px] group-hover:opacity-100 lg:inline">falar sobre orçamento</span>
      </a>

      {selectedProject?.kind === "video" && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-[#02050a]/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Vídeo: ${selectedProject.name}`}>
          <div className="relative w-full max-w-5xl border border-white/15 bg-[#080d16] shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
            <button type="button" onClick={() => setSelectedProject(null)} aria-label="Fechar vídeo" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center border border-white/15 bg-[#060a10]/90 text-white transition-colors hover:border-[#3b82f6] hover:text-[#8db8ff]"><X className="h-5 w-5" /></button>
            <video className="max-h-[72vh] w-full bg-black" src={selectedProject.url} poster={selectedProject.cover} controls autoPlay playsInline preload="metadata">Seu navegador não oferece suporte à reprodução de vídeo.</video>
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
