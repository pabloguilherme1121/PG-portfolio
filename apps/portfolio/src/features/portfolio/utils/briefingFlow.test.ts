import { describe, expect, it } from "vitest";
import {
  briefingDefaultValues,
  clearPersistedBriefingDraft,
  getBriefingProgress,
  normalizeBriefingDraft,
} from "@/features/portfolio/utils/briefingFlow";

describe("briefingFlow", () => {
  it("preserva apenas valores textuais e recompõe os padrões do briefing", () => {
    expect(
      normalizeBriefingDraft({
        name: "Pablo",
        location: "Brasília",
        budget: 1200,
        nested: { invalid: true },
      }),
    ).toMatchObject({
      name: "Pablo",
      location: "Brasília",
      budget: "Preciso de orientação",
    });
  });

  it("retorna os padrões quando o rascunho persistido é inválido", () => {
    expect(normalizeBriefingDraft(null)).toMatchObject({
      location: "Remoto / online",
      deadline: "",
      budget: "Preciso de orientação",
    });
    expect(normalizeBriefingDraft([])).toMatchObject({
      location: "Remoto / online",
      budget: "Preciso de orientação",
    });
  });

  it("remove o rascunho persistido após um envio aceito pela API", () => {
    const removedKeys: string[] = [];
    const storage = {
      removeItem(key: string) {
        removedKeys.push(key);
      },
    };

    const nextDraft = clearPersistedBriefingDraft(storage, "portfolio-briefing");

    expect(removedKeys).toEqual(["portfolio-briefing"]);
    expect(nextDraft).toEqual(briefingDefaultValues);
    expect(nextDraft).not.toBe(briefingDefaultValues);
  });

  it("tolera storage indisponível e ainda devolve um rascunho limpo", () => {
    const storage = {
      removeItem() {
        throw new Error("storage indisponível");
      },
    };

    expect(clearPersistedBriefingDraft(storage, "portfolio-briefing")).toEqual(
      briefingDefaultValues,
    );
  });

  it("calcula progresso e status com os mesmos limiares da experiência atual", () => {
    expect(getBriefingProgress({})).toEqual({ progress: 0, status: "em construção" });
    expect(
      getBriefingProgress({
        name: "A",
        email: "a@b.com",
        service: "Site",
        projectType: "Marca",
        objective: "Vender",
        audience: "Clientes",
      }),
    ).toEqual({ progress: 60, status: "bom contexto" });
    expect(
      getBriefingProgress({
        name: "A",
        email: "a@b.com",
        service: "Site",
        projectType: "Marca",
        objective: "Vender",
        audience: "Clientes",
        contentStatus: "Pronto",
        qualityPriority: "Performance",
        success: "Conversões",
        briefing: "Contexto completo",
      }),
    ).toEqual({ progress: 100, status: "pronto para análise" });
  });
});
