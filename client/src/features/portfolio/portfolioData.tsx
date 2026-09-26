import { Braces, Clapperboard, Plane } from "lucide-react";

const portfolioMediaPath = (file: string) => `${import.meta.env.BASE_URL}portfolio-media/${file}`;

export const skillTracks = [
  {
    number: "01",
    title: "Tecnologia e produto",
    text: "Desenvolvimento de interfaces e organização de produto para transformar problemas em experiências web claras, responsivas e utilizáveis.",
    tools: "TypeScript · React · Vite · HTML · CSS · JavaScript · Python",
  },
  {
    number: "02",
    title: "Conteúdo e narrativa",
    text: "Roteiro, captação e edição para organizar mensagens curtas, demonstrações de interface e conteúdo vertical com clareza.",
    tools: "Roteiro · edição · vídeo vertical · direção",
  },
  {
    number: "03",
    title: "Imagem aérea e terrestre",
    text: "Enquadramento, movimento e leitura de espaço aplicados a eventos, ambientes e registros noturnos em solo e por drone.",
    tools: "Drone · câmera · composição · captação",
  },
];

export const serviceOffers = [
  {
    number: "01",
    label: "produto / presença digital",
    title: "Sites e produtos digitais",
    text: "Planejamento e desenvolvimento de sites, interfaces e dashboards que organizam informação, apresentam valor e criam um caminho claro para a próxima ação.",
    detail: "ESTRATÉGIA · INTERFACE · PUBLICAÇÃO",
    delivery: "Site · landing page · dashboard",
    duration: "Escopo definido por projeto",
    Icon: Braces,
  },
  {
    number: "02",
    label: "narrativa / presença digital",
    title: "Conteúdo para marcas e projetos",
    text: "Planejamento, captação e edição de peças que explicam uma ideia, apresentam um produto e fortalecem sua presença nos canais digitais.",
    detail: "MENSAGEM · RITMO · CONVERSÃO",
    delivery: "Vídeos · peças verticais · demonstrações",
    duration: "Pacotes sob medida",
    Icon: Clapperboard,
  },
  {
    number: "03",
    label: "drone / cobertura visual",
    title: "Captação aérea e audiovisual",
    text: "Imagem aérea e terrestre para mostrar espaços, eventos, pessoas e operações com contexto, movimento e acabamento profissional.",
    detail: "PERSPECTIVA · PRESENÇA · ATMOSFERA",
    delivery: "9:16 · 16:9 · fotos e vídeos",
    duration: "Conforme cobertura",
    Icon: Plane,
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Entendemos o problema",
    text: "Objetivo, público, contexto e resultado esperado definem o que realmente precisa ser construído ou produzido.",
  },
  {
    number: "02",
    title: "Definimos a solução",
    text: "Escopo, experiência, formato, tecnologia e entregáveis são organizados antes da execução.",
  },
  {
    number: "03",
    title: "Construímos e publicamos",
    text: "A solução é desenvolvida, testada e entregue pronta para uso — com espaço para medir, aprender e evoluir.",
  },
];

export const caseStudies = [
  {
    id: "TEC.01",
    title: "Observatório — dados públicos em uma experiência utilizável",
    context: "Produto digital publicado para organizar dados públicos e transformá-los em uma interface navegável, com indicadores e dashboard.",
    method: "Arquitetura de informação, hierarquia visual, desenvolvimento responsivo e publicação web com foco em tornar dados complexos mais fáceis de explorar.",
    learning: "Um dashboard cria mais valor quando reduz o esforço para encontrar contexto e interpretar informação, em vez de apenas exibir números.",
    tags: ["Produto digital", "Web", "Dashboard", "Dados"],
  },
  {
    id: "TEC.08",
    title: "Site vendendo enquanto você dorme",
    context: "Peça autoral curta para comunicar como um site pode apoiar aquisição e conversão de forma contínua.",
    method: "Roteiro enxuto, hierarquia tipográfica e uma promessa principal adaptada ao formato vertical.",
    learning: "Em poucos segundos, uma proposta clara comunica melhor do que vários argumentos competindo pela atenção.",
    tags: ["Web", "Conteúdo", "Vídeo"],
  },
  {
    id: "AUD.01",
    title: "Chá da Eloise",
    context: "Evento social registrado com foco em atmosfera, pessoas e leitura do espaço.",
    method: "Seleção de planos amplos e movimentos suaves, usando a perspectiva aérea como contexto da celebração.",
    learning: "A cobertura ganha força quando o espaço situa a história sem competir com as pessoas.",
    tags: ["Evento", "Vídeo", "Drone"],
  },
  {
    id: "CNT.03",
    title: "RHAM — Seu combustível vale ouro",
    context: "Campanha vertical para um posto de combustíveis, combinando espaço, equipe e mensagem promocional.",
    method: "Captação aérea e terrestre, seleção de planos objetivos e montagem orientada à leitura rápida no celular.",
    learning: "Em conteúdo comercial curto, cenário, equipe e chamada precisam aparecer como uma única narrativa.",
    tags: ["Conteúdo", "Vídeo", "Vertical", "Drone"],
  },
  {
    id: "AUD.05",
    title: "Cobertura esportiva noturna",
    context: "Registro de evento esportivo à noite, alternando presença em campo e perspectiva aérea do ambiente.",
    method: "Planos terrestres para proximidade e tomadas aéreas para mostrar escala, luz e dinâmica do espaço.",
    learning: "Alternar proximidade e contexto cria ritmo e dá dimensão ao acontecimento.",
    tags: ["Esporte", "Vídeo", "Drone", "Noturno"],
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
  addedOrder: number;
  relevance: number;
  catalog: {
    description: string;
    tags: string[];
  };
  caseStudy?: {
    context: string;
    problem: string;
    objective: string;
    function: string;
    process: string;
    decisions: string;
    result: string;
    learning: string;
  };
};

/**
 * Trabalhos publicados a partir de arquivos reais fornecidos por Pablo.
 * Os originais permanecem preservados; o site usa previews web otimizados.
 */
export const repositories: Repository[] = [
  {
    id: "TEC.08",
    name: "PG — Site vendendo enquanto você dorme",
    description: "Peça vertical de comunicação digital que apresenta uma proposta de valor ligada a presença web e automação.",
    role: "Conceito, estrutura da mensagem e produção do conteúdo.",
    process: "Roteiro curto, hierarquia visual e edição vertical pensados para leitura rápida em canais digitais.",
    result: "Uma demonstração compacta de como produto, mensagem e conteúdo podem trabalhar juntos.",
    technologies: ["Vídeo", "Conteúdo", "Web"],
    url: portfolioMediaPath("pg-site-vendendo-2026.mp4"),
    kind: "video",
    cover: portfolioMediaPath("pg-site-vendendo-2026-poster.webp"),
    featured: true,
    addedOrder: 12,
    relevance: 94,
    catalog: {
      description: "Conteúdo vertical sobre presença digital e produto web.",
      tags: ["Vídeo", "Conteúdo", "Web", "Vertical"],
    },
    caseStudy: {
      context: "Peça curta criada para comunicar uma proposta de presença digital de forma direta.",
      problem: "Explicar valor em poucos segundos sem transformar o conteúdo em uma apresentação longa.",
      objective: "Conectar uma mensagem comercial a uma demonstração visual simples e adequada ao formato vertical.",
      function: "Comunicação de produto e presença digital.",
      process: "Estruturação da mensagem, seleção de elementos visuais e edição curta.",
      decisions: "Priorizar uma ideia central e reduzir elementos concorrentes para manter a leitura rápida.",
      result: "Uma peça compacta que conecta desenvolvimento web e comunicação.",
      learning: "Mensagens curtas funcionam melhor quando cada elemento visual reforça a mesma ideia central.",
    },
  },
];

export const optimizedLightboxImages: Record<string, { webp: string; avif: string }> = {};
export const comparisonPairs: Record<string, { before: string; after: string }> = {};

export const repertoireSignals = [
  {
    label: "produto e mensagem",
    title: "Comunicação digital",
    text: "Conteúdo curto que conecta uma proposta de valor a uma experiência digital.",
    cover: portfolioMediaPath("pg-site-vendendo-2026-poster.webp"),
  },
];

export const technologyFilters = ["Todos", "Web", "Vídeo", "Conteúdo"];
export const categoryFilters = ["Todos", "Produto digital", "Conteúdo"];
export const tagFilters = ["Todos", "Web", "Conteúdo", "Vídeo", "Vertical"] as const;
export type ManualOrderProfile = { id: string; name: string; order: string[]; preset?: boolean };

export const predefinedOrderProfiles: ManualOrderProfile[] = [
  { id: "preset-tecnologia", name: "Tecnologia", preset: true, order: ["TEC.08"] },
];

export const sortOptions = [
  { value: "manual", label: "ordem manual" },
  { value: "relevance", label: "relevância editorial" },
  { value: "added", label: "ordem de adição" },
] as const;
