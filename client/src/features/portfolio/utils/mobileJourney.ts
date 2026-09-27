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
