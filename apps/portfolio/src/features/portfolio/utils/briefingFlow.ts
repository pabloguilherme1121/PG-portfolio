export type BriefingDraft = Record<string, string>;

export const briefingDefaultValues: BriefingDraft = {
  location: "Remoto / online",
  deadline: "",
  budget: "Preciso de orientação",
};

export type BriefingDraftStorage = {
  removeItem(key: string): void;
};

export function clearPersistedBriefingDraft(
  storage: BriefingDraftStorage | null | undefined,
  storageKey: string,
): BriefingDraft {
  try {
    storage?.removeItem(storageKey);
  } catch {
    // O reset do fluxo continua mesmo quando o armazenamento local falha.
  }

  return { ...briefingDefaultValues };
}

export const briefingFieldNames = [
  "name",
  "email",
  "service",
  "projectType",
  "objective",
  "audience",
  "stage",
  "location",
  "date",
  "delivery",
  "deadline",
  "budget",
  "contentStatus",
  "visualIdentity",
  "pagesScreens",
  "features",
  "integrations",
  "qualityPriority",
  "postLaunch",
  "success",
  "references",
  "constraints",
  "briefing",
] as const;

export const briefingReadinessFields = [
  "name",
  "email",
  "service",
  "projectType",
  "objective",
  "audience",
  "contentStatus",
  "qualityPriority",
  "success",
  "briefing",
] as const;

export const briefingSteps = [
  { id: "contact", label: "Contato", description: "Quem é você e como retorno." },
  { id: "direction", label: "Direção", description: "Problema, público e objetivo." },
  { id: "scope", label: "Escopo", description: "Formato, prazo e investimento." },
  { id: "requirements", label: "Requisitos", description: "Conteúdo, funcionalidades, integrações e qualidade." },
  { id: "review", label: "Revisão", description: "Critérios de sucesso, referências e contexto final." },
] as const;

export type BriefingSeed = Partial<
  Pick<
    BriefingDraft,
    "service" | "projectType" | "objective" | "audience" | "stage" | "delivery" | "success" | "briefing"
  >
>;

export function normalizeBriefingDraft(value: unknown): BriefingDraft {
  const defaults = { ...briefingDefaultValues };
  if (!value || typeof value !== "object" || Array.isArray(value)) return defaults;

  const stored = Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => typeof fieldValue === "string"),
  ) as BriefingDraft;

  return { ...defaults, ...stored };
}

export function getBriefingProgress(draft: BriefingDraft) {
  const completedFields = briefingReadinessFields.filter((field) => draft[field]?.trim()).length;
  const progress = Math.round((completedFields / briefingReadinessFields.length) * 100);
  const status =
    progress >= 88 ? "pronto para análise" :
    progress >= 55 ? "bom contexto" :
    "em construção";

  return { progress, status } as const;
}
