import { describe, expect, it } from "vitest";
import { repositories } from "../portfolioData";
import { buildFavoritesShareUrl, buildLightboxContext, buildLightboxEmailPayload, buildLightboxShareUrl, buildProjectShareUrl } from "./shareProject";

describe("shareProject", () => {
  const currentUrl = "https://portfolio.test/?favorites=AUD.01,CNT.02#galeria-publica";

  it("preserva as URLs diretas de projeto, favoritos e lightbox", () => {
    expect(buildProjectShareUrl(currentUrl, "CNT.02")).toBe("https://portfolio.test/?projeto=CNT.02#projetos");
    expect(buildFavoritesShareUrl(currentUrl, ["AUD.01", "CNT.02"])).toBe("https://portfolio.test/?favorites=AUD.01%2CCNT.02#projetos");
    expect(buildLightboxShareUrl(currentUrl, "AUD.01")).toBe("https://portfolio.test/?favorites=AUD.01%2CCNT.02&imagem=AUD.01#projetos");
  });

  it("preserva o contexto e o e-mail de compartilhamento do projeto", () => {
    const project = repositories[0]!;
    const projectUrl = buildLightboxShareUrl(currentUrl, project.id);

    expect(buildLightboxContext(project, projectUrl)).toContain(`Papel: ${project.role}`);
    expect(buildLightboxContext(project, projectUrl)).toContain(projectUrl);
    expect(buildLightboxEmailPayload(project, projectUrl)).toEqual(expect.objectContaining({
      subject: `Projeto ${project.name} — Pablo Guilherme`,
      body: expect.stringContaining(project.description),
    }));
  });
});
