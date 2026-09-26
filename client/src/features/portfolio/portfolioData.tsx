import { Braces, Clapperboard } from "lucide-react";

const portfolioMediaPath = (file: string) => `${import.meta.env.BASE_URL}portfolio-media/${file}`;

export const skillTracks = [
  {
    number: "01",
    title: "Produto e estrutura",
    text: "Transformo objetivos, conteúdo e dados em uma estrutura clara: o que precisa aparecer, para quem e em qual ordem.",
    tools: "Problema · fluxo · arquitetura de informação · priorização",
  },
  {
    number: "02",
    title: "Interface e desenvolvimento",
    text: "Construo interfaces responsivas e produtos web com atenção a usabilidade, consistência, desempenho e publicação.",
    tools: "TypeScript · React · Vite · HTML · CSS · JavaScript",
  },
  {
    number: "03",
    title: "Comunicação da solução",
    text: "Uso conteúdo e audiovisual como apoio quando a entrega precisa ser explicada, demonstrada ou apresentada com mais clareza.",
    tools: "Roteiro · vídeo · demonstração · narrativa visual",
  },
];

export const serviceOffers = [
  {
    number: "01",
    label: "presença digital",
    title: "Sites e landing pages",
    text: "Páginas responsivas que organizam a proposta de valor, facilitam a navegação e conduzem a pessoa para a próxima ação.",
    detail: "ESTRUTURA · INTERFACE · PUBLICAÇÃO",
    delivery: "Site responsivo · landing page",
    duration: "Escopo definido por projeto",
    Icon: Braces,
  },
  {
    number: "02",
    label: "produto / informação",
    title: "Interfaces e dashboards",
    text: "Experiências digitais para organizar dados, fluxos e informações que precisam ser consultados, compreendidos e usados com facilidade.",
    detail: "INFORMAÇÃO · USABILIDADE · DADOS",
    delivery: "Dashboard · interface · produto web",
    duration: "Escopo definido por projeto",
    Icon: Braces,
  },
  {
    number: "03",
    label: "comunicação complementar",
    title: "Conteúdo e audiovisual",
    text: "Peças visuais para explicar uma solução, demonstrar um produto ou apresentar um projeto de forma mais direta.",
    detail: "MENSAGEM · DEMONSTRAÇÃO · NARRATIVA",
    delivery: "Vídeo · conteúdo vertical · captação",
    duration: "Conforme a necessidade",
    Icon: Clapperboard,
  },
];

export const processSteps = [
  {
    number: "01",
    title: "Entender e priorizar",
    text: "Defino o problema, o público, a informação essencial e a ação que precisa ficar mais simples.",
  },
  {
    number: "02",
    title: "Estruturar e construir",
    text: "Organizo conteúdo e fluxo, desenho a interface e desenvolvo a solução com foco em clareza e responsividade.",
  },
  {
    number: "03",
    title: "Validar e publicar",
    text: "Testo o que foi construído, ajusto os pontos críticos e entrego uma versão publicada que pode ser usada e evoluída.",
  },
];

export const caseStudies = [
  {
    id: "TEC.01",
    title: "Observatório — informação pública transformada em produto digital",
    context: "Produto publicado criado para organizar informação pública em uma experiência navegável com indicadores e dashboard.",
    method: "Estrutura de informação, hierarquia visual, interface responsiva e publicação web com foco em reduzir o esforço para encontrar contexto e interpretar dados.",
    learning: "Uma boa interface de dados não precisa mostrar tudo de uma vez; precisa ajudar a pessoa a encontrar o que importa e entender o contexto.",
    tags: ["Produto digital", "Web", "Dashboard", "Dados"],
    proofs: [
      {
        label: "Abrir produto",
        description: "Dashboard publicado e navegável em produção.",
        href: "https://pabloguilherme01.github.io/observatorio/#dashboard",
        type: "live" as const,
      },
      {
        label: "Ver código",
        description: "Repositório público do produto.",
        href: "https://github.com/Pabloguilherme01/observatorio",
        type: "code" as const,
      },
    ],
  },
  {
    id: "TEC.08",
    title: "Site vendendo enquanto você dorme — comunicação de uma proposta digital",
    context: "Peça autoral curta criada para apresentar uma proposta ligada a presença digital em um formato rápido.",
    method: "Mensagem central, hierarquia tipográfica e edição vertical para mostrar uma ideia sem competir pela atenção com argumentos demais.",
    learning: "Quando a proposta é curta, clareza e hierarquia importam mais do que quantidade de informação.",
    tags: ["Web", "Conteúdo", "Vídeo"],
    proofs: [
      {
        label: "Assistir peça",
        description: "Arquivo vertical publicado no próprio portfólio.",
        href: portfolioMediaPath("pg-site-vendendo-2026.mp4"),
        type: "media" as const,
      },
    ],
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
