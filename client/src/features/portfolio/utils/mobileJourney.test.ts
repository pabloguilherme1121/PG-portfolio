import { describe, expect, it } from "vitest";
import { getMobileContextAction, hasMeaningfulBriefingDraft } from "@/features/portfolio/utils/mobileJourney";

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
});
