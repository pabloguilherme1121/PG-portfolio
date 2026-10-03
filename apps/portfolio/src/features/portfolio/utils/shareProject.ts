import type { Repository } from "../portfolioData";

export function buildProjectShareUrl(currentUrl: string, projectId: string) {
  const projectUrl = new URL(currentUrl);
  projectUrl.searchParams.delete("favorites");
  projectUrl.searchParams.set("projeto", projectId);
  projectUrl.hash = "projetos";
  return projectUrl.toString();
}

export function buildFavoritesShareUrl(currentUrl: string, projectIds: string[]) {
  const current = new URL(currentUrl);
  const shareUrl = new URL(current.pathname, current.origin);
  shareUrl.searchParams.set("favorites", projectIds.join(","));
  shareUrl.hash = "projetos";
  return shareUrl.toString();
}

export function buildLightboxShareUrl(currentUrl: string, projectId: string) {
  const url = new URL(currentUrl);
  url.searchParams.set("imagem", projectId);
  url.hash = "projetos";
  return url.toString();
}

export function buildLightboxContext(project: Repository, projectUrl: string) {
  return [
    `${project.name} — Pablo Guilherme`,
    project.description,
    `Papel: ${project.role}`,
    `Processo: ${project.process}`,
    `Resultado: ${project.result}`,
    projectUrl,
  ].join("\n\n");
}

export function buildLightboxEmailPayload(project: Repository, projectUrl: string) {
  return {
    subject: `Projeto ${project.name} — Pablo Guilherme`,
    body: [
      "Olá,",
      "",
      `Quero compartilhar este projeto do portfólio de Pablo Guilherme: ${project.name}.`,
      "",
      project.description,
      "",
      `Papel: ${project.role}`,
      `Processo: ${project.process}`,
      `Resultado: ${project.result}`,
      "",
      projectUrl,
    ].join("\n"),
  };
}
