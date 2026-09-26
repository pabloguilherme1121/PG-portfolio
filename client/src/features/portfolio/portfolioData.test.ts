import { describe, expect, it } from "vitest";
import { repositories } from "@/features/portfolio/portfolioData";

describe("portfolioData — mídia pública", () => {
  it("mantém somente projetos com mídia real versionada no portfólio", () => {
    expect(repositories.map((project) => project.id)).toEqual(["TEC.08"]);

    for (const project of repositories) {
      expect(project.url).toContain("/portfolio-media/");
      expect(project.cover).toContain("/portfolio-media/");
    }
  });

  it("associa a mídia versionada ao case publicado", () => {
    expect(repositories[0]).toEqual(
      expect.objectContaining({
        id: "TEC.08",
        url: expect.stringContaining("pg-site-vendendo-2026.mp4"),
        cover: expect.stringContaining("pg-site-vendendo-2026-poster.webp"),
      }),
    );
  });
});
