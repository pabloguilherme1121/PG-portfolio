import { describe, expect, it } from "vitest";
import { repositories } from "@/features/portfolio/portfolioData";

describe("portfolioData — catálogo público verificável", () => {
  it("aceita mídia versionada e repositórios públicos sem misturar as evidências", () => {
    expect(repositories.map((project) => project.id)).toEqual(["TEC.09", "TEC.08"]);

    for (const project of repositories) {
      if (project.kind === "video") {
        expect(project.url).toContain("/portfolio-media/");
        expect(project.cover).toContain("/portfolio-media/");
        continue;
      }

      expect(project.kind).toBe("repository");
      expect(project.url).toMatch(/^https:\/\/github\.com\//);
    }
  });

  it("associa a mídia versionada ao case audiovisual publicado", () => {
    const video = repositories.find((project) => project.id === "TEC.08");

    expect(video).toEqual(
      expect.objectContaining({
        id: "TEC.08",
        kind: "video",
        url: expect.stringContaining("pg-site-vendendo-2026.mp4"),
        cover: expect.stringContaining("pg-site-vendendo-2026-poster.webp"),
      }),
    );
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
