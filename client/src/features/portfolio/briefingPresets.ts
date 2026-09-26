export const briefingDefaultValues = {
  location: "Remoto / online",
  deadline: "",
  budget: "Preciso de orientação",
} as const;

export type BriefingPresetId = "site" | "dashboard" | "content";

export type BriefingPreset = {
  id: BriefingPresetId;
  eyebrow: string;
  title: string;
  description: string;
  values: Record<string, string>;
};

export const briefingQuickStartPresets: BriefingPreset[] = [
  {
    id: "site",
    eyebrow: "presença digital",
    title: "Site / landing page",
    description: "Para apresentar uma oferta, negócio ou serviço e levar a pessoa até uma ação clara.",
    values: {
      service: "Site ou landing page",
      projectType: "Marca ou negócio",
      objective: "Apresentar uma oferta ou proposta com clareza e conduzir visitantes para contato, orçamento ou cadastro.",
      audience: "Clientes e visitantes",
      stage: "Ideia inicial",
      location: briefingDefaultValues.location,
      delivery: "Site responsivo",
      deadline: briefingDefaultValues.deadline,
      budget: briefingDefaultValues.budget,
      success: "Tornar a proposta mais fácil de entender e facilitar ações como contato, orçamento ou cadastro.",
      briefing: "Quero estruturar uma presença digital clara, com proposta de valor, navegação simples e uma ação principal bem definida.",
    },
  },
  {
    id: "dashboard",
    eyebrow: "produto / dados",
    title: "Dashboard / produto",
    description: "Para organizar dados, indicadores ou fluxos em uma experiência fácil de consultar e usar.",
    values: {
      service: "Dashboard ou produto digital",
      projectType: "Projeto com dados / dashboard",
      objective: "Organizar informação complexa em uma experiência clara para consulta, acompanhamento e decisão.",
      audience: "Equipes, gestores e pessoas que consultam os dados",
      stage: "Ideia inicial",
      location: briefingDefaultValues.location,
      delivery: "Dashboard / interface",
      deadline: briefingDefaultValues.deadline,
      budget: briefingDefaultValues.budget,
      success: "Reduzir o esforço de consulta e tornar indicadores, contexto e decisões mais fáceis de compreender.",
      briefing: "Quero transformar dados, fontes ou indicadores em uma experiência navegável, responsiva e fácil de consultar.",
    },
  },
  {
    id: "content",
    eyebrow: "comunicação",
    title: "Conteúdo audiovisual",
    description: "Para explicar, demonstrar ou apresentar uma proposta em um formato visual rápido e publicável.",
    values: {
      service: "Criação de conteúdo",
      projectType: "Marca ou negócio",
      objective: "Explicar ou demonstrar uma proposta com conteúdo visual direto e fácil de entender.",
      audience: "Clientes e público dos canais digitais",
      stage: "Ideia inicial",
      location: briefingDefaultValues.location,
      delivery: "Vertical 9:16 para Reels",
      deadline: briefingDefaultValues.deadline,
      budget: briefingDefaultValues.budget,
      success: "Comunicar a ideia central com clareza e deixar a proposta pronta para publicação nos canais definidos.",
      briefing: "Quero transformar uma proposta, produto ou projeto em conteúdo visual direto, com mensagem central clara e formato adequado ao canal.",
    },
  },
];
