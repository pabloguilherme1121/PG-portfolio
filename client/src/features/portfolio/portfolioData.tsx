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
    id: "site",
    number: "01",
    label: "presença digital",
    title: "Sites e landing pages",
    text: "Páginas responsivas que organizam a proposta de valor, facilitam a navegação e conduzem a pessoa para a próxima ação.",
    detail: "ESTRUTURA · INTERFACE · PUBLICAÇÃO",
    delivery: "Site responsivo · landing page",
    duration: "Escopo definido por projeto",
    Icon: Braces,
    evidence: null,
    briefingSeed: {
      service: "Site ou landing page",
      projectType: "Marca ou negócio",
      objective: "Apresentar uma oferta com clareza e conduzir visitantes para uma próxima ação.",
      delivery: "Site responsivo",
      success: "Tornar a proposta mais fácil de entender e facilitar ações como contato, orçamento ou cadastro.",
      briefing: "Quero estruturar uma presença digital com proposta de valor clara, navegação simples e uma ação principal bem definida.",
    },
  },
  {
    id: "dashboard",
    number: "02",
    label: "produto / informação",
    title: "Interfaces e dashboards",
    text: "Experiências digitais para organizar dados, fluxos e informações que precisam ser consultados, compreendidos e usados com facilidade.",
    detail: "INFORMAÇÃO · USABILIDADE · DADOS",
    delivery: "Dashboard · interface · produto web",
    duration: "Escopo definido por projeto",
    Icon: Braces,
    evidence: {
      label: "ver prova: Observatório",
      href: "#observatorio",
    },
    briefingSeed: {
      service: "Dashboard ou produto digital",
      projectType: "Projeto com dados / dashboard",
      objective: "Organizar dados ou informação complexa em uma experiência clara para consulta e decisão.",
      delivery: "Dashboard / interface",
      success: "Reduzir o esforço de consulta e tornar indicadores e contexto mais fáceis de compreender.",
      briefing: "Quero transformar dados, fontes ou indicadores em uma experiência navegável, com hierarquia de informação, interface responsiva e contexto suficiente para consulta e decisão.",
    },
  },
  {
    id: "content",
    number: "03",
    label: "comunicação complementar",
    title: "Conteúdo e audiovisual",
    text: "Peças visuais para explicar uma solução, demonstrar um produto ou apresentar um projeto de forma mais direta.",
    detail: "MENSAGEM · DEMONSTRAÇÃO · NARRATIVA",
    delivery: "Vídeo · conteúdo vertical · captação",
    duration: "Conforme a necessidade",
    Icon: Clapperboard,
    evidence: {
      label: "ver prova: peça vertical",
      href: "?projeto=TEC.08#projetos",
    },
    briefingSeed: {
      service: "Criação de conteúdo",
      projectType: "Marca ou negócio",
      objective: "Explicar, demonstrar ou apresentar uma proposta com conteúdo visual direto.",
      delivery: "Vertical 9:16 para Reels",
      success: "Comunicar a ideia central com clareza em um formato rápido e publicável.",
      briefing: "Quero transformar uma proposta, produto ou projeto em conteúdo visual direto, com mensagem central clara, formato adequado ao canal e uma demonstração fácil de entender.",
    },
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
    id: "TEC.09",
    title: "Trajeto — produto full-stack para decisões de rota e abastecimento",
    context: "Produto em evolução para motoristas do Entorno do Distrito Federal, estruturado para ajudar a comparar parada, desvio, referência de combustível e origem dos dados antes de abrir a navegação.",
    method: "Fluxo buscar → comparar → decidir → navegar, com frontend React + TypeScript, API tRPC/Express, persistência MySQL/Drizzle, validação Zod, testes automatizados, CI e auditoria de dependências.",
    learning: "Produtos de decisão ficam mais úteis quando cada tela responde uma pergunta prática e a origem do dado é tratada como parte da experiência, não como detalhe técnico.",
    tags: ["Produto digital", "Full-stack", "React", "TypeScript", "Dados"],
    proofs: [
      {
        label: "Ver código",
        description: "Repositório público com frontend, API, testes, CI e segurança documentada.",
        href: "https://github.com/Pabloguilherme01/trajeto-web",
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
    id: "TEC.09",
    name: "Trajeto — decisão de rota e abastecimento",
    description: "Produto full-stack em evolução para transformar busca de posto ou rota em uma decisão prática, com comparação de desvio, contexto de combustível e transparência sobre fontes.",
    role: "Produto, interface e arquitetura full-stack.",
    process: "Estruturação do fluxo buscar → comparar → decidir → navegar, separando dados oficiais, dados de terceiros e estimativas próprias.",
    result: "Repositório público com frontend React, API tRPC/Express, persistência MySQL/Drizzle, testes automatizados, CI e auditoria de segurança.",
    technologies: ["Web", "Interface", "React", "TypeScript"],
    url: "https://github.com/Pabloguilherme01/trajeto-web",
    kind: "repository",
    featured: true,
    addedOrder: 13,
    relevance: 98,
    catalog: {
      description: "Produto full-stack para decisões de rota e abastecimento no Entorno do Distrito Federal.",
      tags: ["Produto digital", "Full-stack", "React", "TypeScript", "Dados"],
    },
    caseStudy: {
      context: "Ferramenta de decisão para motoristas que circulam pelo Entorno do Distrito Federal.",
      problem: "Encontrar e comparar opções de parada exige consultar fontes diferentes e entender quanto um desvio realmente altera a rota.",
      objective: "Organizar contexto suficiente para decidir onde parar, quanto desviar e qual é a origem de cada dado antes de navegar.",
      function: "Produto, interface, arquitetura de dados e implementação full-stack.",
      process: "Fluxo buscar → comparar → decidir → navegar, com React/TypeScript no frontend e tRPC, Express, MySQL, Drizzle e Zod no backend.",
      decisions: "Cadastro opcional, separação explícita entre dado oficial, dado de terceiro e estimativa, e CI com typecheck, testes, build e auditoria de dependências.",
      result: "Base técnica pública e testável para um produto em evolução, sem apresentar referência oficial como preço de bomba ou inventar disponibilidade de produção.",
      learning: "Transparência de fonte e redução de passos são parte do produto quando a interface apoia uma decisão prática.",
    },
  },
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

export const technologyFilters = ["Todos", "Web", "React", "TypeScript", "Vídeo", "Conteúdo"];
export const categoryFilters = ["Todos", "Produto digital", "Conteúdo"];
export const tagFilters = ["Todos", "Web", "Conteúdo", "Vídeo", "Vertical"] as const;
export type ManualOrderProfile = { id: string; name: string; order: string[]; preset?: boolean };

export const predefinedOrderProfiles: ManualOrderProfile[] = [
  { id: "preset-tecnologia", name: "Tecnologia", preset: true, order: ["TEC.09", "TEC.08"] },
];

export const sortOptions = [
  { value: "manual", label: "ordem manual" },
  { value: "relevance", label: "relevância editorial" },
  { value: "added", label: "ordem de adição" },
] as const;
