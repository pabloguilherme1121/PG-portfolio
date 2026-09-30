import { describe, expect, it } from "vitest";
import { repositories } from "@/features/portfolio/portfolioData";

describe("portfolioData — catálogo público verificável", () => {
  it("mantém apenas projetos públicos alinhados ao foco atual do portfólio", () => {
    expect(repositories.map((project) => project.id)).toEqual(["TEC.09"]);
    expect(repositories.every((project) => project.kind === "repository")).toBe(true);
    expect(repositories.some((project) => project.id === "TEC.08")).toBe(false);
  });

  it("mantém o Trajeto como código público sem inventar mídia ou deploy", () => {
    const trajeto = repositories.find((project) => project.id === "TEC.09");

    expect(trajeto).toEqual(
      expect.objectContaining({
        id: "TEC.09",
        kind: "repository",
        url: "https://github.com/Pabloguilherme01/trajeto-web",
      }),
    );
    expect(trajeto?.cover).toBeUndefined();
  });
});
