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
    id: "AUD.01",
    name: "Chá da Eloise — cobertura aérea",
    description: "Registro audiovisual de evento social com leitura do ambiente, da celebração e da escala do espaço.",
    role: "Captação aérea e construção do registro visual.",
    process: "Planos amplos e movimentos suaves selecionados para um preview curto e direto.",
    result: "Uma amostra audiovisual que preserva atmosfera e contexto sem transformar o portfólio em arquivo bruto.",
    technologies: ["Vídeo", "Drone", "Conteúdo"],
    url: portfolioMediaPath("cha-da-eloise-2026.mp4"),
    kind: "video",
    cover: portfolioMediaPath("cha-da-eloise-2026-poster.webp"),
    featured: true,
    addedOrder: 9,
    relevance: 100,
    catalog: {
      description: "Cobertura aérea de evento social.",
      tags: ["Drone", "Evento", "Conteúdo", "Vídeo"],
    },
    caseStudy: {
      context: "Registro de um evento social com necessidade de situar o ambiente e preservar a sensação de celebração.",
      problem: "Mostrar espaço e atmosfera em pouco tempo sem reduzir o evento a uma sequência genérica de tomadas.",
      objective: "Criar uma memória visual curta, reconhecível e adequada para apresentação profissional.",
      function: "Captação aérea e construção do registro visual.",
      process: "Seleção de planos amplos, aproximações e movimentos suaves para contextualizar o evento.",
      decisions: "Priorizar tomadas que acrescentam escala e atmosfera e condensar o original em um preview leve para web.",
      result: "Uma amostra audiovisual que preserva o ambiente e demonstra domínio de perspectiva aérea.",
      learning: "O contexto espacial funciona melhor quando ajuda a contar a história do evento, e não quando vira apenas efeito visual.",
    },
  },
  {
    id: "CNT.03",
    name: "RHAM — Seu combustível vale ouro",
    description: "Campanha vertical para posto de combustíveis, combinando imagem aérea, equipe e mensagem promocional em uma narrativa curta.",
    role: "Captação aérea e terrestre, direção de conteúdo e organização da peça.",
    process: "Seleção de cenas de contexto e presença, montagem vertical e foco em leitura rápida para celular.",
    result: "Preview de campanha que demonstra produção de conteúdo comercial com variedade de enquadramentos.",
    technologies: ["Vídeo", "Conteúdo", "Drone", "Vertical"],
    url: portfolioMediaPath("rham-combustivel-ouro-2026.mp4"),
    kind: "video",
    cover: portfolioMediaPath("rham-combustivel-ouro-2026-poster.webp"),
    featured: true,
    addedOrder: 10,
    relevance: 97,
    catalog: {
      description: "Campanha vertical de conteúdo comercial.",
      tags: ["Conteúdo", "Vídeo", "Drone", "Vertical"],
    },
    caseStudy: {
      context: "Peça promocional vertical para comunicar uma campanha de posto de combustíveis em canais digitais.",
      problem: "Apresentar ambiente, equipe e chamada promocional sem perder clareza no formato curto.",
      objective: "Construir uma peça comercial com leitura imediata no celular e identidade ligada ao local.",
      function: "Captação aérea e terrestre, direção de conteúdo e organização da peça.",
      process: "Combinação de tomadas aéreas e em solo, seleção de momentos de presença e edição orientada ao formato vertical.",
      decisions: "Abrir espaço para o local e para as pessoas, evitando excesso de informação simultânea.",
      result: "Preview de campanha que evidencia repertório de captação e conteúdo comercial.",
      learning: "A peça fica mais convincente quando a mensagem promocional é sustentada por imagens reais do espaço e da equipe.",
    },
  },
  {
    id: "TEC.08",
    name: "PG — Site vendendo enquanto você dorme",
    description: "Peça vertical curta sobre aquisição digital, apresentando o site como um ativo que continua trabalhando para transformar visitas em oportunidades.",
    role: "Conceito, direção e composição de conteúdo.",
    process: "Roteiro enxuto, identidade PG, mensagem de conversão e apoio de IA na construção visual.",
    result: "Uma peça de 8 segundos pensada para comunicar valor rapidamente em canais verticais.",
    technologies: ["Vídeo", "Conteúdo", "IA", "Web", "Vertical"],
    url: portfolioMediaPath("pg-site-vendendo-2026.mp4"),
    kind: "video",
    cover: portfolioMediaPath("pg-site-vendendo-2026-poster.webp"),
    featured: true,
    addedOrder: 8,
    relevance: 94,
    catalog: {
      description: "Conteúdo vertical de aquisição digital.",
      tags: ["Conteúdo", "Vídeo", "IA", "Web", "Vertical"],
    },
    caseStudy: {
      context: "Peça autoral curta para comunicar como um site pode apoiar aquisição e conversão de forma contínua.",
      problem: "Explicar uma proposta de valor digital em poucos segundos sem transformar a mensagem em uma tela carregada.",
      objective: "Apresentar uma ideia de site como ativo de aquisição com leitura imediata em formato vertical.",
      function: "Conceito, direção e composição de conteúdo.",
      process: "Roteiro enxuto, identidade visual PG, hierarquia tipográfica e apoio de IA na construção e iteração visual.",
      decisions: "Concentrar a mensagem em uma promessa principal, usar contraste alto e fechar com uma chamada clara.",
      result: "Uma peça curta e legível, pensada para Reels e Stories, conectando tecnologia e conteúdo.",
      learning: "Em formatos de poucos segundos, uma única promessa forte comunica melhor do que vários argumentos simultâneos.",
    },
  },
  {
    id: "AUD.05",
    name: "Cobertura esportiva — noite",
    description: "Registro esportivo noturno que alterna presença em campo e perspectiva aérea para mostrar pessoas, luz, movimento e escala.",
    role: "Captação terrestre e aérea do evento.",
    process: "Planos próximos para presença, tomadas amplas para contexto e edição condensada em preview web.",
    result: "Uma amostra dinâmica de cobertura que combina leitura humana do evento e dimensão espacial.",
    technologies: ["Vídeo", "Drone", "Noturno", "Esporte"],
    url: portfolioMediaPath("cobertura-esportiva-2026.mp4"),
    kind: "video",
    cover: portfolioMediaPath("cobertura-esportiva-2026-poster.webp"),
    featured: true,
    addedOrder: 11,
    relevance: 92,
    catalog: {
      description: "Cobertura esportiva noturna com captação aérea e terrestre.",
      tags: ["Drone", "Noturno", "Esporte", "Vídeo"],
    },
    caseStudy: {
      context: "Registro noturno de um evento esportivo com ações em campo e leitura aérea do ambiente.",
      problem: "Manter energia e contexto em baixa luz, sem depender apenas de planos amplos ou apenas de cenas próximas.",
      objective: "Demonstrar cobertura capaz de conectar pessoas, movimento e escala do local.",
      function: "Captação terrestre e aérea do evento.",
      process: "Alternância entre planos de presença em campo e tomadas aéreas, com seleção de momentos que funcionam como preview curto.",
      decisions: "Usar a iluminação do campo como referência visual e alternar proximidade e escala para criar ritmo.",
      result: "Uma amostra dinâmica que apresenta o evento por mais de uma perspectiva.",
      learning: "Em coberturas noturnas, a combinação de proximidade e visão geral ajuda o público a entender o acontecimento e o espaço.",
    },
  },
];

export const optimizedLightboxImages: Record<string, { webp: string; avif: string }> = {};
export const comparisonPairs: Record<string, { before: string; after: string }> = {};

export const repertoireSignals = [
  {
    label: "escala e perspectiva",
    title: "Imagem aérea",
    text: "Leitura de espaço, movimento e contexto para apresentar um lugar de outro ponto de vista.",
    cover: portfolioMediaPath("cobertura-esportiva-2026-poster.webp"),
  },
  {
    label: "clareza e ritmo",
    title: "Conteúdo vertical",
    text: "Peças curtas com foco em mensagem, presença e leitura rápida nos canais digitais.",
    cover: portfolioMediaPath("rham-combustivel-ouro-2026-poster.webp"),
  },
  {
    label: "atmosfera e memória",
    title: "Registro de evento",
    text: "Captação que usa ambiente, movimento e perspectiva para preservar a sensação do acontecimento.",
    cover: portfolioMediaPath("cha-da-eloise-2026-poster.webp"),
  },
];

export const technologyFilters = ["Todos", "Web", "Vídeo", "Conteúdo", "Drone", "IA", "Noturno", "Esporte"];
export const categoryFilters = ["Todos", "Produto digital", "Conteúdo", "Eventos", "Aéreo", "Noturno"];
export const tagFilters = ["Todos", "Web", "Conteúdo", "Vídeo", "Drone", "Vertical", "Noturno"] as const;
export type ManualOrderProfile = { id: string; name: string; order: string[]; preset?: boolean };

export const predefinedOrderProfiles: ManualOrderProfile[] = [
  { id: "preset-audiovisual", name: "Audiovisual", preset: true, order: ["AUD.01", "CNT.03", "AUD.05", "TEC.08"] },
  { id: "preset-tecnologia", name: "Tecnologia", preset: true, order: ["TEC.08", "CNT.03", "AUD.01", "AUD.05"] },
];

export const sortOptions = [
  { value: "manual", label: "ordem manual" },
  { value: "relevance", label: "relevância editorial" },
  { value: "added", label: "ordem de adição" },
] as const;
