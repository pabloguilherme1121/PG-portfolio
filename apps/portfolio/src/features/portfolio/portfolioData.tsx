import { Braces } from "lucide-react";


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
    title: "Qualidade e publicação",
    text: "Valido fluxos, responsividade, acessibilidade e desempenho antes de publicar e evoluir a entrega.",
    tools: "Git · GitHub · revisão · Playwright em outros projetos",
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
    id: "CIV.01",
    stage: "Demonstrações públicas",
    title: "Trajeto + Observatório — serviços, rotas e dados cívicos",
    context: "Dois produtos para organizar informação de utilidade pública em Águas Lindas de Goiás e no Entorno do DF.",
    problem: "Serviços, rotas e indicadores públicos estão dispersos, com fontes, datas e recortes diferentes.",
    objective: "Facilitar a consulta no celular sem esconder a origem ou os limites de cada informação.",
    decisions: "Dados estáticos estruturados e armazenamento local, busca por serviço, endereço ou bairro e acesso parcial offline no Trajeto. No Observatório, indicadores com fontes e cálculos reproduzíveis, incluindo dados do Censo 2022 e do TSE.",
    result: "Trajeto: 157 serviços, 33 categorias, 41 fichas de postos (33 com registros ANP) e 72 rotas prontas. O catálogo offline é parcial, com estimativa offline de rotas. Observatório: 20+ versões documentadas e dados contextualizados.",
    learning: "Quando a fonte não permite conciliar um registro, a interface informa a limitação em vez de inventar um dado.",
    limits: "Preços individuais podem estar indisponíveis e devem ser confirmados no posto. Os dados não são atualizados ao vivo. Consulta offline não inclui todos os recursos.",
    tags: ["Utilidade pública", "React", "TypeScript", "PWA"],
    proofs: [
      {
        label: "Abrir Trajeto",
        description: "Aplicativo demonstrado: serviços, postos e rotas.",
        href: "https://pabloguilherme01.github.io/trajeto-web/",
        type: "live" as const,
      },
      {
        label: "Abrir Observatório",
        description: "Painel cívico com indicadores e fontes.",
        href: "https://pabloguilherme01.github.io/observatorio/#dashboard",
        type: "live" as const,
      },
      {
        label: "Código do Trajeto",
        description: "Repositório público para conferir a implementação.",
        href: "https://github.com/Pabloguilherme01/trajeto-web",
        type: "code" as const,
      },
    ],
  },
  {
    id: "AV.02",
    stage: "Produção audiovisual",
    title: "MPJ Storyworks — vídeos para negócios locais",
    context: "Trabalhos de roteiro, captação e edição para campanhas locais; a divulgação depende da autorização de cada cliente.",
    problem: "Negócios locais precisam apresentar ações concretas em vídeos claros e adequados ao celular.",
    objective: "Explicar uma campanha e direcionar a atenção para uma próxima ação, sem prometer resultados não medidos.",
    decisions: "No RHAM Auto Posto, a ação Abasteceu Ganhou usou QR Code no ponto de abastecimento. Em uma loja de moda feminina, a entrega foi um sorteio com adesivo no carro. São campanhas diferentes.",
    result: "Roteiro, filmagem, captação com drone quando aplicável e edição dinâmica para conteúdos curtos. Não há métricas de vendas ou conversão apresentadas como comprovadas.",
    learning: "O vídeo funciona melhor como demonstração quando a peça, o objetivo e o caminho de contato estão claros.",
    limits: "Não publicar imagens de clientes, depoimentos ou métricas comerciais sem permissão e evidência. Os materiais das duas campanhas precisam ser vinculados separadamente.",
    tags: ["Vídeo", "Drone", "Edição", "Roteiro"],
    proofs: [],
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
  kind: "repository";
  status: "Em evolução" | "Publicado";
  evidence: {
    label: "código" | "site";
    href: string;
    type: "code" | "live";
  };
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
 * Projetos públicos com evidência verificável.
 * Projetos de software apontam para repositórios públicos quando ainda não
 * existe uma produção verificável.
 */
export const repositories: Repository[] = [
  {
    id: "TEC.09",
    name: "Trajeto — encontre o que precisa. Saiba por onde seguir.",
    description: "PWA de utilidade pública para Águas Lindas e o Entorno do DF: 157 serviços, 33 categorias, rotas e postos de combustível com origem dos dados identificada.",
    role: "Produto, interface, organização de dados e produção de demonstração.",
    process: "Estruturação do fluxo buscar → resolver → decidir → navegar, com dados estáticos estruturados, armazenamento local e separação entre fontes e estimativas.",
    result: "157 serviços, 33 categorias, 41 fichas de postos, 33 com registros ANP e 72 rotas prontas; catálogo offline parcial e estimativas sinalizadas.",
    technologies: ["PWA", "React", "TypeScript", "Dados estruturados"],
    url: "https://pabloguilherme01.github.io/trajeto-web/",
    kind: "repository",
    status: "Em evolução",
    evidence: {
      label: "site",
      href: "https://pabloguilherme01.github.io/trajeto-web/",
      type: "live",
    },
    featured: true,
    addedOrder: 13,
    relevance: 98,
    catalog: {
      description: "Utilidade pública e mobilidade para encontrar serviços locais e decidir por onde seguir.",
      tags: ["Produto digital", "PWA", "React", "TypeScript", "Dados"],
    },
    caseStudy: {
      context: "Plataforma mobile de utilidade pública e mobilidade para moradores de Águas Lindas e do Entorno do DF.",
      problem: "Encontrar e comparar opções de parada exige consultar fontes diferentes e entender quanto um desvio realmente altera a rota.",
      objective: "Organizar contexto suficiente para decidir onde parar, quanto desviar e qual é a origem de cada dado antes de navegar.",
      function: "Produto, interface, organização dos dados e demonstração audiovisual.",
      process: "Fluxo buscar → resolver → decidir → navegar, implementado com React, TypeScript, dados estáticos estruturados e armazenamento local.",
      decisions: "Consulta sem cadastro obrigatório, catálogo offline parcial, separação explícita de dados oficiais e estimativas e indicação de informações não conciliadas.",
      result: "Aplicação disponível para consultar 157 serviços, 33 categorias, 41 fichas de postos (33 com registros ANP) e 72 rotas prontas. Catálogo offline parcial; preços devem ser confirmados no posto.",
      learning: "Transparência de fonte e redução de passos são parte do produto quando a interface apoia uma decisão prática.",
    },
  },

];

