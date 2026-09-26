import { describe, expect, it } from "vitest";
import { repositories } from "@/features/portfolio/portfolioData";

describe("portfolioData — mídia pública", () => {
  it("mantém somente projetos com mídia real versionada no portfólio", () => {
    expect(repositories.map((project) => project.id)).toEqual([
      "TEC.08",
      "AUD.01",
      "CNT.03",
      "AUD.05",
    ]);

    for (const project of repositories) {
      expect(project.url).toContain("/portfolio-media/");
      expect(project.cover).toContain("/portfolio-media/");
    }
  });

  it("associa os arquivos enviados aos cases correspondentes", () => {
    const mediaByProject = Object.fromEntries(
      repositories.map((project) => [project.id, { url: project.url, cover: project.cover }]),
    );

    expect(mediaByProject["TEC.08"]).toEqual(
      expect.objectContaining({
        url: expect.stringContaining("pg-site-vendendo-2026.mp4"),
        cover: expect.stringContaining("pg-site-vendendo-2026-poster.webp"),
      }),
    );
    expect(mediaByProject["AUD.01"]).toEqual(
      expect.objectContaining({
        url: expect.stringContaining("cha-da-eloise-2026.mp4"),
        cover: expect.stringContaining("cha-da-eloise-2026-poster.webp"),
      }),
    );
    expect(mediaByProject["CNT.03"]).toEqual(
      expect.objectContaining({
        url: expect.stringContaining("rham-combustivel-ouro-2026.mp4"),
        cover: expect.stringContaining("rham-combustivel-ouro-2026-poster.webp"),
      }),
    );
    expect(mediaByProject["AUD.05"]).toEqual(
      expect.objectContaining({
        url: expect.stringContaining("cobertura-esportiva-2026.mp4"),
        cover: expect.stringContaining("cobertura-esportiva-2026-poster.webp"),
      }),
    );
  });
});
