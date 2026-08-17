import { Camera, Clapperboard, Plane } from "lucide-react";

export const skillTracks = [
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

export const serviceOffers = [
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

export const processSteps = [
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

export const caseStudies = [
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

export type Repository = {

  id: string;
  name: string;
  description: string;
  role: string;
  process: string;
  result: string;
  technologies: string[];
  url: string;
  kind: "repository" | "video";
  cover?: string;
  featured?: boolean;
  /** Ordem de entrada no arquivo visual, preservada pela sequência de cadastro dos projetos. */
  addedOrder: number;
  /** Critério editorial relativo: destaque, variedade técnica e força demonstrativa do registro. */
  relevance: number;
};

/**
 * Galeria de trabalhos reais. Novos repositórios e vídeos devem entrar aqui
 * somente quando Pablo fornecer os respectivos links ou arquivos verdadeiros.
 */
const optimizedLightboxImages: Record<string, { webp: string; avif: string }> = {
  "/manus-storage/cha-da-eloise-capa_0d17d433.jpg": { webp: "/manus-storage/cha-da-eloise-capa-1920w_9c3ac5f3.webp", avif: "/manus-storage/cha-da-eloise-capa-1920w_a7d6987c.avif" },
  "/manus-storage/rham-interface-servicos-01_72f2d942.jpg": { webp: "/manus-storage/rham-interface-servicos-01-720w_f9038490.webp", avif: "/manus-storage/rham-interface-servicos-01-720w_f8e84767.avif" },
  "/manus-storage/rham-depoimento-02_c0845a39.jpg": { webp: "/manus-storage/rham-depoimento-02-720w_3e5f42e1.webp", avif: "/manus-storage/rham-depoimento-02-720w_3f7b257b.avif" },
  "/manus-storage/captacao-noturna-03_1033bede.jpg": { webp: "/manus-storage/captacao-noturna-03-720w_e51d98e0.webp", avif: "/manus-storage/captacao-noturna-03-720w_f24e9f42.avif" },
  "/manus-storage/campo-iluminado-04_665a6d8f.jpg": { webp: "/manus-storage/campo-iluminado-04-1280w_bc353281.webp", avif: "/manus-storage/campo-iluminado-04-1280w_5f023100.avif" },
  "/manus-storage/campo-iluminado-movimento-06_cc198d97.jpg": { webp: "/manus-storage/campo-iluminado-movimento-06-1280w_298c2385.webp", avif: "/manus-storage/campo-iluminado-movimento-06-1280w_7f75fd17.avif" },
  "/manus-storage/rham-interface-navegacao-05_6de0dfd3.jpg": { webp: "/manus-storage/rham-interface-navegacao-05-720w_bf1a85c4.webp", avif: "/manus-storage/rham-interface-navegacao-05-720w_b585edb6.avif" },
};

const comparisonPairs: Record<string, { before: string; after: string }> = {};

const repositories: Repository[] = [
  {
    id: "AUD.01",
    name: "Chá da Eloise",
    description: "Registro audiovisual de evento social, com imagens amplas do ambiente e momentos da celebração.",
    role: "Cobertura aérea e leitura do ambiente.",
    process: "Planos abertos, aproximações e movimentos suaves.",
    result: "Uma memória visual que preserva espaço, presença e atmosfera.",
    technologies: ["Vídeo", "Drone", "Conteúdo"],
    url: "/manus-storage/cha-da-eloise-cobertura-aerea_d6a43ac9.mp4",
    kind: "video",
    cover: "/manus-storage/cha-da-eloise-capa_0d17d433.jpg",
    featured: true,
    addedOrder: 7,
    relevance: 100,
  },
  {
    id: "CNT.02",
    name: "RHAM — Serviços no app",
    description: "Vídeo vertical de navegação por serviços em uma interface móvel da RHAM Águas Lindas.",
    role: "Apresentação visual da jornada de serviços.",
    process: "Sequência curta guiada por leitura de tela e ritmo.",
    result: "Uma demonstração direta da navegação no aplicativo.",
    technologies: ["Vídeo", "Conteúdo", "Interface"],
    url: "/manus-storage/rham-interface-servicos-01_de540335.mp4",
    kind: "video",
    cover: "/manus-storage/rham-interface-servicos-01_72f2d942.jpg",
    addedOrder: 6,
    relevance: 88,
  },
  {
    id: "CNT.03",
    name: "RHAM — Mensagem em vídeo",
    description: "Registro vertical com apresentação diante da câmera para comunicação institucional.",
    role: "Captação e organização de uma mensagem em vídeo.",
    process: "Enquadramento vertical e condução direta diante da câmera.",
    result: "Uma peça curta para comunicar uma mensagem com presença.",
    technologies: ["Vídeo", "Conteúdo"],
    url: "/manus-storage/rham-depoimento-02_e0bfccc3.mp4",
    kind: "video",
    cover: "/manus-storage/rham-depoimento-02_c0845a39.jpg",
    addedOrder: 5,
    relevance: 76,
  },
  {
    id: "AUD.04",
    name: "Captação noturna — visão aérea",
    description: "Registro vertical noturno com perspectiva elevada sobre o espaço e seus arredores.",
    role: "Exploração aérea de espaço e entorno.",
    process: "Captação noturna com perspectiva elevada e movimento controlado.",
    result: "Um recorte vertical que valoriza escala e atmosfera.",
    technologies: ["Vídeo", "Drone", "Noturno"],
    url: "/manus-storage/captacao-noturna-03_7e22eda5.mp4",
    kind: "video",
    cover: "/manus-storage/captacao-noturna-03_1033bede.jpg",
    addedOrder: 4,
    relevance: 82,
  },
  {
    id: "AUD.05",
    name: "Campo iluminado — vista aérea",
    description: "Captação horizontal de campo esportivo à noite, valorizando escala, luz e movimento.",
    role: "Construção de uma visão ampla do campo.",
    process: "Enquadramento horizontal atento à luz, escala e movimento.",
    result: "Uma imagem de contexto para apresentar o espaço com impacto.",
    technologies: ["Vídeo", "Drone", "Noturno"],
    url: "/manus-storage/campo-iluminado-04_dace435d.mp4",
    kind: "video",
    cover: "/manus-storage/campo-iluminado-04_665a6d8f.jpg",
    addedOrder: 3,
    relevance: 84,
  },
  {
    id: "CNT.06",
    name: "RHAM — Navegação de serviços",
    description: "Segundo recorte vertical de interface móvel, focado na jornada de serviços do aplicativo.",
    role: "Reforço visual da jornada de serviços.",
    process: "Recorte vertical com foco nas etapas principais da interface.",
    result: "Uma leitura complementar e rápida do fluxo do aplicativo.",
    technologies: ["Vídeo", "Conteúdo", "Interface"],
    url: "/manus-storage/rham-interface-navegacao-05_b0c568ac.mp4",
    kind: "video",
    cover: "/manus-storage/rham-interface-navegacao-05_6de0dfd3.jpg",
    addedOrder: 2,
    relevance: 80,
  },
  {
    id: "AUD.07",
    name: "Campo iluminado — sequência aérea",
    description: "Novo enquadramento horizontal do campo, explorando a perspectiva de voo e a atmosfera noturna.",
    role: "Variação de perspectiva para ampliar o repertório do registro.",
    process: "Movimento aéreo horizontal com atenção à atmosfera noturna.",
    result: "Uma sequência alternativa para comparar escala e direção.",
    technologies: ["Vídeo", "Drone", "Noturno"],
    url: "/manus-storage/campo-iluminado-movimento-06_d3806c2d.mp4",
    kind: "video",
    cover: "/manus-storage/campo-iluminado-movimento-06_cc198d97.jpg",
    addedOrder: 1,
    relevance: 79,
  },
];

export const repertoireSignals = [
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

export const technologyFilters = ["Todos", "Vídeo", "Drone", "Conteúdo", "Interface", "Noturno", "HTML", "CSS", "JavaScript", "Python"];
export const categoryFilters = ["Todos", "Eventos", "Aéreo", "Interface", "Conteúdo", "Noturno"];
export const tagFilters = ["Todos", "Drone", "Vídeo", "Conteúdo", "Interface", "Noturno", "Vertical"] as const;
export type ManualOrderProfile = { id: string; name: string; order: string[]; preset?: boolean };

export const predefinedOrderProfiles: ManualOrderProfile[] = [
  { id: "preset-audiovisual", name: "Audiovisual", preset: true, order: ["AUD.01", "AUD.05", "AUD.07", "AUD.04", "CNT.03", "CNT.02", "CNT.06"] },
  { id: "preset-tecnologia", name: "Tecnologia", preset: true, order: ["CNT.02", "CNT.06", "CNT.03", "AUD.01", "AUD.05", "AUD.04", "AUD.07"] },
];

export const sortOptions = [
  { value: "manual", label: "ordem manual" },
  { value: "relevance", label: "relevância editorial" },
  { value: "added", label: "ordem de adição" },
] as const;

export { comparisonPairs, optimizedLightboxImages, repositories };
