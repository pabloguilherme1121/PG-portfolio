import { publicMediaPath } from "@/features/portfolio/utils/publicMediaPath";

const portfolioMediaPath = (file: string) => `${import.meta.env.BASE_URL}portfolio-media/${file}`;
import { Braces, Clapperboard, Plane } from "lucide-react";

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
    label: "desenvolvimento / produto",
    title: "Desenvolvimento web",
    text: "Sites, landing pages e interfaces responsivas construídos com foco em clareza, desempenho e experiência de uso.",
    detail: "REACT · TYPESCRIPT · RESPONSIVIDADE",
    delivery: "site · landing page · interface",
    duration: "escopo sob consulta",
    Icon: Braces,
  },
  {
    number: "02",
    label: "conteúdo / narrativa",
    title: "Conteúdo audiovisual",
    text: "Peças curtas para apresentar produtos, serviços e experiências com ritmo, hierarquia visual e mensagem objetiva.",
    detail: "ROTEIRO · EDIÇÃO · VÍDEO VERTICAL",
    delivery: "reels · demonstrações · peças",
    duration: "escopo sob consulta",
    Icon: Clapperboard,
  },
  {
    number: "03",
    label: "captação / imagem",
    title: "Captação aérea e terrestre",
    text: "Registro de eventos, espaços e atividades com enquadramento pensado para a entrega final e para os canais de publicação.",
    detail: "DRONE · CÂMERA · COMPOSIÇÃO",
    delivery: "9:16 · 16:9 · fotos e vídeo",
    duration: "escopo sob consulta",
    Icon: Plane,
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
  /** Critério editorial relativo: destaque, variedade técnica e força demonstrativa do registro. */
  relevance: number;
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
    id: "TEC.08",
    name: "PG — Site vendendo enquanto você dorme",
    description: "Peça vertical curta sobre aquisição digital, apresentando o site como um ativo que continua trabalhando para transformar visitas em oportunidades.",
    role: "Conceito, direção e composição de conteúdo.",
    process: "Roteiro enxuto, identidade PG, mensagem de conversão e apoio de IA na construção visual.",
    result: "Uma peça de 8 segundos pensada para comunicar valor rapidamente em canais verticais.",
    technologies: ["Vídeo", "Conteúdo", "IA", "Web"],
    url: portfolioMediaPath("pg-site-vendendo-2026.mp4"),
    kind: "video",
    cover: portfolioMediaPath("pg-site-vendendo-2026-poster.webp"),
    featured: true,
    relevance: 94,
    caseStudy: {
      context: "Peça autoral curta para comunicar como um site pode apoiar aquisição e conversão de forma contínua.",
      problem: "Explicar uma proposta de valor digital em poucos segundos sem transformar a mensagem em uma tela carregada.",
      objective: "Apresentar uma ideia de site como ativo de aquisição com leitura imediata em formato vertical.",
      function: "Conceito, direção e composição de conteúdo.",
      process: "Roteiro enxuto, identidade visual PG, hierarquia tipográfica e apoio de IA na construção e iteração visual.",
      decisions: "Concentrar a mensagem em uma promessa principal, usar contraste alto e fechar com uma chamada clara para transformar visitantes em clientes.",
      result: "Uma peça curta e legível, pensada para Reels e Stories, conectando tecnologia e conteúdo.",
      learning: "Em formatos de poucos segundos, uma única promessa forte e uma chamada clara comunicam melhor do que vários argumentos simultâneos.",
    },
  },

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
    relevance: 100,
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
    relevance: 88,
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
    relevance: 76,
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
    relevance: 82,
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
    relevance: 84,
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
    relevance: 80,
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
    relevance: 79,
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
