export type MobileExperienceRoute = "client" | "recruiter" | "explorer";

export const experienceRouteStorageKey = "pablo-portfolio-experience-route";
export const briefingDraftStorageKey = "pablo-portfolio-briefing-draft";

const meaningfulBriefingFields = [
  "name",
  "email",
  "service",
  "projectType",
  "objective",
  "audience",
  "stage",
  "delivery",
  "contentStatus",
  "qualityPriority",
  "success",
  "briefing",
] as const;

export function isMobileExperienceRoute(value: unknown): value is MobileExperienceRoute {
  return value === "client" || value === "recruiter" || value === "explorer";
}

export function readStoredExperienceRoute(storage?: Storage | null): MobileExperienceRoute {
  if (!storage) return "client";
  try {
    const value = storage.getItem(experienceRouteStorageKey);
    return isMobileExperienceRoute(value) ? value : "client";
  } catch {
    return "client";
  }
}

export function hasMeaningfulBriefingDraft(draft: Record<string, string> | null | undefined) {
  if (!draft) return false;
  return meaningfulBriefingFields.some((field) => Boolean(draft[field]?.trim()));
}

export function readStoredBriefingProgress(storage?: Storage | null) {
  if (!storage) return false;
  try {
    const parsed = JSON.parse(storage.getItem(briefingDraftStorageKey) || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return false;
    return hasMeaningfulBriefingDraft(parsed as Record<string, string>);
  } catch {
    return false;
  }
}

export function getMobileContextAction(route: MobileExperienceRoute) {
  if (route === "recruiter") return { href: "#perfil-profissional", label: "perfil" } as const;
  if (route === "explorer") return { href: "#projetos", label: "projetos" } as const;
  return { href: "#diagnostico", label: "diagnóstico" } as const;
}

export function getMobilePrimaryAction(route: MobileExperienceRoute, hasBriefingDraft: boolean) {
  if (hasBriefingDraft) {
    return { href: "#contato-briefing", label: "retomar", ariaLabel: "Retomar briefing salvo" } as const;
  }
  if (route === "recruiter") {
    return { href: "#perfil-profissional", label: "ver perfil", ariaLabel: "Avaliar perfil profissional" } as const;
  }
  if (route === "explorer") {
    return { href: "#projetos", label: "explorar", ariaLabel: "Explorar projetos selecionados" } as const;
  }
  return { href: "#diagnostico", label: "começar", ariaLabel: "Começar diagnóstico do projeto" } as const;
}

export function getMobileJourneyHint(route: MobileExperienceRoute, hasBriefingDraft: boolean) {
  if (hasBriefingDraft) return "briefing salvo · continue de onde parou";
  if (route === "recruiter") return "perfil · provas · contato";
  if (route === "explorer") return "projetos · cases · código";
  return "1. diagnóstico · 2. briefing · 3. contato";
}


export function getMobileSecondaryShortcut(route: MobileExperienceRoute) {
  if (route === "recruiter") return { href: "#curriculo-web", label: "currículo" } as const;
  if (route === "explorer") return { href: "#pg-lab", label: "PG Arcade" } as const;
  return { href: "#servicos", label: "serviços" } as const;
}


export function getMobileDockModel(route: MobileExperienceRoute, hasBriefingDraft: boolean) {
  return {
    primary: getMobilePrimaryAction(route, hasBriefingDraft),
    secondary: getMobileSecondaryShortcut(route),
    hint: getMobileJourneyHint(route, hasBriefingDraft),
  } as const;
}

export function normalizeScrollProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.round(Math.min(100, Math.max(0, value)));
}
