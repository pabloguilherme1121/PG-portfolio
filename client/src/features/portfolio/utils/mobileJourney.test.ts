import { describe, expect, it } from "vitest";
import { getMobileContextAction, getMobileJourneyHint, getMobilePrimaryAction, hasMeaningfulBriefingDraft } from "@/features/portfolio/utils/mobileJourney";

describe("mobileJourney", () => {
  it("mapeia cada intenção para um atalho móvel direto", () => {
    expect(getMobileContextAction("client")).toEqual({ href: "#diagnostico", label: "diagnóstico" });
    expect(getMobileContextAction("recruiter")).toEqual({ href: "#perfil-profissional", label: "perfil" });
    expect(getMobileContextAction("explorer")).toEqual({ href: "#projetos", label: "projetos" });
  });

  it("considera rascunho apenas quando existe contexto preenchido pelo visitante", () => {
    expect(hasMeaningfulBriefingDraft({ location: "Remoto / online", budget: "Preciso de orientação" })).toBe(false);
    expect(hasMeaningfulBriefingDraft({ name: "Visitante mobile" })).toBe(true);
    expect(hasMeaningfulBriefingDraft({ objective: "Quero melhorar meu site" })).toBe(true);
  });
  it("transforma progresso do briefing em CTA de retomada com contexto", () => {
    expect(getMobilePrimaryAction(false)).toEqual({ href: "#diagnostico", label: "começar", ariaLabel: "Começar diagnóstico do projeto" });
    expect(getMobilePrimaryAction(true)).toEqual({ href: "#contato-briefing", label: "retomar", ariaLabel: "Retomar briefing salvo" });
  });

  it("prioriza uma única próxima ação por intenção", () => {
    expect(getMobileJourneyHint("client", false)).toBe("1. diagnóstico · 2. briefing · 3. contato");
    expect(getMobileJourneyHint("recruiter", false)).toBe("perfil · provas · contato");
    expect(getMobileJourneyHint("explorer", false)).toBe("projetos · cases · código");
    expect(getMobileJourneyHint("client", true)).toBe("briefing salvo · continue de onde parou");
  });

});
