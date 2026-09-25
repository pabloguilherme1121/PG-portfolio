import { publicMediaPath } from "@/features/portfolio/utils/publicMediaPath";
import { Camera, Clapperboard, Plane } from "lucide-react";

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
    label: "drone / perspectiva aérea",
    title: "Filmagem aérea",
    text: "Captação aérea para apresentar espaços, eventos e ambientes por uma perspectiva ampla, com atenção a movimento, escala e composição.",
    detail: "ENQUADRAMENTO · ESCALA · ATMOSFERA",
    delivery: "9:16 · 16:9",
    duration: "15–60 s / 1–2 min",
    Icon: Plane,
  },
  {
    number: "02",
    label: "câmera / registro em solo",
    title: "Captação terrestre",
    text: "Captação em solo para registrar pessoas, detalhes e momentos com enquadramento pensado para a entrega final.",
    detail: "PRESENÇA · RITMO · DETALHE",
    delivery: "Reels · aftermovie",
    duration: "30–90 s / 1–3 min",
    Icon: Camera,
  },
  {
    number: "03",
    label: "narrativa / presença digital",
    title: "Criação de conteúdo",
    text: "Planejamento, captação e edição de peças curtas para apresentar uma mensagem, uma experiência ou uma interface em canais digitais.",
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
  /** Projeção resumida usada na gestão de favoritos, com tags próprias já exibidas no painel. */
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
 * Galeria de trabalhos reais. Novos repositórios e vídeos devem entrar aqui
 * somente quando Pablo fornecer os respectivos links ou arquivos verdadeiros.
 */
export const optimizedLightboxImages: Record<string, { webp: string; avif: string }> = {
  [publicMediaPath("/manus-storage/cha-da-eloise-capa_0d17d433.jpg")]: { webp: publicMediaPath("/manus-storage/cha-da-eloise-capa-1920w_9c3ac5f3.webp"), avif: publicMediaPath("/manus-storage/cha-da-eloise-capa-1920w_a7d6987c.avif") },
  [publicMediaPath("/manus-storage/rham-interface-servicos-01_72f2d942.jpg")]: { webp: publicMediaPath("/manus-storage/rham-interface-servicos-01-720w_f9038490.webp"), avif: publicMediaPath("/manus-storage/rham-interface-servicos-01-720w_f8e84767.avif") },
  [publicMediaPath("/manus-storage/rham-depoimento-02_c0845a39.jpg")]: { webp: publicMediaPath("/manus-storage/rham-depoimento-02-720w_3e5f42e1.webp"), avif: publicMediaPath("/manus-storage/rham-depoimento-02-720w_3f7b257b.avif") },
  [publicMediaPath("/manus-storage/captacao-noturna-03_1033bede.jpg")]: { webp: publicMediaPath("/manus-storage/captacao-noturna-03-720w_e51d98e0.webp"), avif: publicMediaPath("/manus-storage/captacao-noturna-03-720w_f24e9f42.avif") },
  [publicMediaPath("/manus-storage/campo-iluminado-04_665a6d8f.jpg")]: { webp: publicMediaPath("/manus-storage/campo-iluminado-04-1280w_bc353281.webp"), avif: publicMediaPath("/manus-storage/campo-iluminado-04-1280w_5f023100.avif") },
  [publicMediaPath("/manus-storage/campo-iluminado-movimento-06_cc198d97.jpg")]: { webp: publicMediaPath("/manus-storage/campo-iluminado-movimento-06-1280w_298c2385.webp"), avif: publicMediaPath("/manus-storage/campo-iluminado-movimento-06-1280w_7f75fd17.avif") },
  [publicMediaPath("/manus-storage/rham-interface-navegacao-05_6de0dfd3.jpg")]: { webp: publicMediaPath("/manus-storage/rham-interface-navegacao-05-720w_bf1a85c4.webp"), avif: publicMediaPath("/manus-storage/rham-interface-navegacao-05-720w_b585edb6.avif") },
};

export const comparisonPairs: Record<string, { before: string; after: string }> = {};

export const repositories: Repository[] = [
  {
    id: "AUD.01",
    name: "Chá da Eloise",
    description: "Registro audiovisual de evento social, com imagens amplas do ambiente e momentos da celebração.",
    role: "Cobertura aérea e leitura do ambiente.",
    process: "Planos abertos, aproximações e movimentos suaves.",
    result: "Uma memória visual que preserva espaço, presença e atmosfera.",
    technologies: ["Vídeo", "Drone", "Conteúdo"],
    url: publicMediaPath("/manus-storage/cha-da-eloise-cobertura-aerea_d6a43ac9.mp4"),
    kind: "video",
    cover: publicMediaPath("/manus-storage/cha-da-eloise-capa_0d17d433.jpg"),
    featured: true,
    addedOrder: 7,
    relevance: 100,
    catalog: {
      description: "Registro audiovisual de evento social.",
      tags: ["Drone", "Evento", "Conteúdo"],
    },
    caseStudy: {
      context: "Registro audiovisual de um evento social, reunindo ambiente, pessoas e momentos da celebração.",
      problem: "Concentrar espaço, presença e detalhes em um registro breve sem perder a atmosfera do encontro.",
      objective: "Construir uma memória visual que ajude a revisitar o ambiente e os momentos do dia.",
      function: "Cobertura aérea e leitura do ambiente.",
      process: "Planos abertos, aproximações e movimentos suaves durante o registro.",
      decisions: "Equilibrar vistas amplas do espaço com aproximações das pessoas e dos detalhes da celebração.",
      result: "Uma memória visual que preserva espaço, presença e atmosfera.",
      learning: "A imagem funciona quando o ambiente e as pessoas têm espaço para aparecer.",
    },
  },
  {
    id: "CNT.02",
    name: "RHAM — Serviços no app",
    description: "Vídeo vertical de navegação por serviços em uma interface móvel da RHAM Águas Lindas.",
    role: "Apresentação visual da jornada de serviços.",
    process: "Sequência curta guiada por leitura de tela e ritmo.",
    result: "Uma demonstração direta da navegação no aplicativo.",
    technologies: ["Vídeo", "Conteúdo", "Interface"],
    url: publicMediaPath("/manus-storage/rham-interface-servicos-01_de540335.mp4"),
    kind: "video",
    cover: publicMediaPath("/manus-storage/rham-interface-servicos-01_72f2d942.jpg"),
    addedOrder: 6,
    relevance: 88,
    catalog: {
      description: "Vídeo vertical de navegação por serviços.",
      tags: ["Interface", "Conteúdo"],
    },
    caseStudy: {
      context: "Vídeo vertical público que percorre serviços em uma interface móvel da RHAM Águas Lindas.",
      problem: "Apresentar uma jornada de serviços em pouco tempo, sem perder a leitura das etapas na tela.",
      objective: "Demonstrar a navegação no aplicativo de forma direta e compreensível em formato vertical.",
      function: "Apresentação visual da jornada de serviços.",
      process: "Sequência curta guiada por leitura de tela e ritmo.",
      decisions: "Organizar as etapas em uma ordem curta e usar o ritmo para priorizar o que precisa ser entendido primeiro.",
      result: "Uma demonstração direta da navegação no aplicativo.",
      learning: "Legibilidade e ritmo também são parte do produto final.",
    },
  },
  {
    id: "CNT.03",
    name: "RHAM — Mensagem em vídeo",
    description: "Registro vertical com apresentação diante da câmera para comunicação institucional.",
    role: "Captação e organização de uma mensagem em vídeo.",
    process: "Enquadramento vertical e condução direta diante da câmera.",
    result: "Uma peça curta para comunicar uma mensagem com presença.",
    technologies: ["Vídeo", "Conteúdo"],
    url: publicMediaPath("/manus-storage/rham-depoimento-02_e0bfccc3.mp4"),
    kind: "video",
    cover: publicMediaPath("/manus-storage/rham-depoimento-02_c0845a39.jpg"),
    addedOrder: 5,
    relevance: 76,
    catalog: {
      description: "Registro vertical para comunicação institucional.",
      tags: ["Conteúdo", "Vídeo"],
    },
    caseStudy: {
      context: "Registro vertical com apresentação diante da câmera para uma comunicação institucional curta.",
      problem: "Organizar uma mensagem direta em vídeo mantendo presença, enquadramento e leitura adequados ao formato vertical.",
      objective: "Produzir uma peça curta e clara para comunicação em canais digitais.",
      function: "Captação e organização de uma mensagem em vídeo.",
      process: "Enquadramento vertical e condução direta diante da câmera.",
      decisions: "Priorizar enquadramento simples e leitura imediata da pessoa e da mensagem.",
      result: "Uma peça curta para comunicar uma mensagem com presença.",
      learning: "Em mensagens curtas, enquadramento e objetividade precisam trabalhar juntos.",
    },
  },
  {
    id: "AUD.04",
    name: "Captação noturna — visão aérea",
    description: "Registro vertical noturno com perspectiva elevada sobre o espaço e seus arredores.",
    role: "Exploração aérea de espaço e entorno.",
    process: "Captação noturna com perspectiva elevada e movimento controlado.",
    result: "Um recorte vertical que valoriza escala e atmosfera.",
    technologies: ["Vídeo", "Drone", "Noturno"],
    url: publicMediaPath("/manus-storage/captacao-noturna-03_7e22eda5.mp4"),
    kind: "video",
    cover: publicMediaPath("/manus-storage/captacao-noturna-03_1033bede.jpg"),
    addedOrder: 4,
    relevance: 82,
    catalog: {
      description: "Registro noturno com perspectiva elevada.",
      tags: ["Drone", "Noturno", "Vídeo"],
    },
    caseStudy: {
      context: "Registro vertical noturno de um espaço e de seus arredores a partir de uma perspectiva elevada.",
      problem: "Preservar a leitura do espaço em baixa luz sem perder a sensação de escala.",
      objective: "Criar um recorte vertical que apresente ambiente, iluminação e perspectiva aérea.",
      function: "Exploração aérea de espaço e entorno.",
      process: "Captação noturna com perspectiva elevada e movimento controlado.",
      decisions: "Manter movimentos controlados e usar os pontos de luz como referência para a composição.",
      result: "Um recorte vertical que valoriza escala e atmosfera.",
      learning: "Em baixa luz, estabilidade e referências luminosas ajudam a orientar a leitura da cena.",
    },
  },
  {
    id: "AUD.05",
    name: "Campo iluminado — vista aérea",
    description: "Captação horizontal de campo esportivo à noite, valorizando escala, luz e movimento.",
    role: "Construção de uma visão ampla do campo.",
    process: "Enquadramento horizontal atento à luz, escala e movimento.",
    result: "Uma imagem de contexto para apresentar o espaço com impacto.",
    technologies: ["Vídeo", "Drone", "Noturno"],
    url: publicMediaPath("/manus-storage/campo-iluminado-04_dace435d.mp4"),
    kind: "video",
    cover: publicMediaPath("/manus-storage/campo-iluminado-04_665a6d8f.jpg"),
    addedOrder: 3,
    relevance: 84,
    catalog: {
      description: "Captação horizontal de campo esportivo.",
      tags: ["Drone", "Noturno", "Esporte"],
    },
    caseStudy: {
      context: "Captação horizontal noturna de um campo esportivo, com foco em escala, luz e movimento.",
      problem: "Apresentar o espaço à noite mantendo a leitura de escala e da iluminação disponível.",
      objective: "Construir uma imagem de contexto que revele o campo por uma perspectiva aérea ampla.",
      function: "Construção de uma visão ampla do campo.",
      process: "Enquadramento horizontal atento à luz, escala e movimento.",
      decisions: "Priorizar uma perspectiva aérea aberta e manter luz, escala e deslocamento como referências do enquadramento.",
      result: "Uma imagem de contexto para apresentar o espaço com impacto.",
      learning: "Em registros noturnos, luz e escala precisam orientar a leitura antes do movimento.",
    },
  },
  {
    id: "CNT.06",
    name: "RHAM — Navegação de serviços",
    description: "Segundo recorte vertical de interface móvel, focado na jornada de serviços do aplicativo.",
    role: "Reforço visual da jornada de serviços.",
    process: "Recorte vertical com foco nas etapas principais da interface.",
    result: "Uma leitura complementar e rápida do fluxo do aplicativo.",
    technologies: ["Vídeo", "Conteúdo", "Interface"],
    url: publicMediaPath("/manus-storage/rham-interface-navegacao-05_b0c568ac.mp4"),
    kind: "video",
    cover: publicMediaPath("/manus-storage/rham-interface-navegacao-05_6de0dfd3.jpg"),
    addedOrder: 2,
    relevance: 80,
    catalog: {
      description: "Recorte vertical de interface móvel.",
      tags: ["Interface", "Conteúdo"],
    },
    caseStudy: {
      context: "Segundo recorte vertical dedicado à navegação por serviços em uma interface móvel.",
      problem: "Mostrar etapas importantes da interface sem transformar o vídeo em uma demonstração longa.",
      objective: "Complementar a apresentação do aplicativo com uma leitura rápida de sua jornada de serviços.",
      function: "Reforço visual da jornada de serviços.",
      process: "Recorte vertical com foco nas etapas principais da interface.",
      decisions: "Selecionar apenas as etapas necessárias para manter a sequência curta e compreensível.",
      result: "Uma leitura complementar e rápida do fluxo do aplicativo.",
      learning: "Selecionar menos etapas pode tornar a demonstração de uma interface mais fácil de acompanhar.",
    },
  },
  {
    id: "AUD.07",
    name: "Campo iluminado — sequência aérea",
    description: "Novo enquadramento horizontal do campo, explorando a perspectiva de voo e a atmosfera noturna.",
    role: "Variação de perspectiva para ampliar o repertório do registro.",
    process: "Movimento aéreo horizontal com atenção à atmosfera noturna.",
    result: "Uma sequência alternativa para comparar escala e direção.",
    technologies: ["Vídeo", "Drone", "Noturno"],
    url: publicMediaPath("/manus-storage/campo-iluminado-movimento-06_d3806c2d.mp4"),
    kind: "video",
    cover: publicMediaPath("/manus-storage/campo-iluminado-movimento-06_cc198d97.jpg"),
    addedOrder: 1,
    relevance: 79,
    catalog: {
      description: "Sequência aérea com atmosfera noturna.",
      tags: ["Drone", "Noturno", "Esporte"],
    },
    caseStudy: {
      context: "Variação de captação aérea horizontal do campo esportivo em período noturno.",
      problem: "Criar uma perspectiva complementar do mesmo espaço sem repetir o enquadramento principal.",
      objective: "Ampliar o repertório visual do registro com uma segunda leitura de escala e direção.",
      function: "Variação de perspectiva para ampliar o repertório do registro.",
      process: "Movimento aéreo horizontal com atenção à atmosfera noturna.",
      decisions: "Variar direção e enquadramento mantendo o campo e a iluminação como referências visuais.",
      result: "Uma sequência alternativa para comparar escala e direção.",
      learning: "Variações de perspectiva funcionam melhor quando acrescentam informação em vez de apenas repetir a cena.",
    },
  },
];

export const repertoireSignals = [
  {
    label: "escala e perspectiva",
    title: "Imagem aérea",
    text: "Leitura de espaço, movimento e contexto para apresentar um lugar de outro ponto de vista.",
    cover: publicMediaPath("/manus-storage/campo-iluminado-04_665a6d8f.jpg"),
  },
  {
    label: "clareza e ritmo",
    title: "Interface em movimento",
    text: "Registro de produto e serviço com foco no que a pessoa precisa entender primeiro.",
    cover: publicMediaPath("/manus-storage/rham-interface-servicos-01_72f2d942.jpg"),
  },
  {
    label: "presença e detalhe",
    title: "Registro de evento",
    text: "Captação que aproxima o público da atmosfera, das pessoas e dos pequenos momentos.",
    cover: publicMediaPath("/manus-storage/cha-da-eloise-capa_0d17d433.jpg"),
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
