import { describe, expect, it } from "vitest";
import { caseStudies, repositories } from "@/features/portfolio/portfolioData";

describe("portfolioData — catálogo público verificável", () => {
  it("mantém apenas projetos públicos alinhados ao foco atual do portfólio", () => {
    expect(repositories.map((project) => project.id)).toEqual(["TEC.09"]);
    expect(repositories.every((project) => project.kind === "repository")).toBe(true);
    expect(repositories.some((project) => project.id === "TEC.08")).toBe(false);
  });

  it("direciona o Trajeto ao site público sem inventar mídia", () => {
    const trajeto = repositories.find((project) => project.id === "TEC.09");

    expect(trajeto).toEqual(
      expect.objectContaining({
        id: "TEC.09",
        kind: "repository",
        url: "https://pabloguilherme01.github.io/trajeto-web/",
      }),
    );
    expect(trajeto?.cover).toBeUndefined();
  });
  it("apresenta apenas os dois cases comprováveis e mantém as campanhas separadas", () => {
    expect(caseStudies).toHaveLength(2);
    expect(caseStudies.map((study) => study.id)).toEqual(["CIV.01", "AV.02"]);
    expect(caseStudies[0].result).toContain("41 fichas de postos (33 com registros ANP)");
    expect(caseStudies[0].result).toContain("catálogo offline é parcial");
    expect(caseStudies[1].decisions).toContain("RHAM Auto Posto");
    expect(caseStudies[1].decisions).toContain("loja de moda feminina");
    expect(caseStudies[1].proofs).toHaveLength(0);
  });

  it("não transfere integrações e testes do stack geral ao Trajeto", () => {
    const trajeto = repositories.find((project) => project.id === "TEC.09");
    expect(trajeto?.caseStudy?.process).not.toMatch(/tRPC|MySQL|Drizzle/);
    expect(trajeto?.result).toContain("catálogo offline parcial");
    expect(trajeto?.result).toContain("33 com registros ANP");
  });

});
