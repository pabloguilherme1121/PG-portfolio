import { describe, expect, it } from "vitest";
import { buildBriefingWhatsAppUrl } from "./briefingWhatsApp";

describe("buildBriefingWhatsAppUrl", () => {
  it("prepara uma mensagem profissional com direção, escopo e contexto", () => {
    const data = new FormData();
    data.set("name", "Ana Silva");
    data.set("email", "ana@example.com");
    data.set("service", "Dashboard ou produto digital");
    data.set("projectType", "Projeto com dados / dashboard");
    data.set("objective", "Organizar indicadores para consulta rápida.");
    data.set("audience", "Equipe de gestão");
    data.set("stage", "Ideia inicial");
    data.set("location", "Remoto");
    data.set("delivery", "Dashboard / interface");
    data.set("deadline", "1 a 2 meses");
    data.set("budget", "R$ 3.000 a R$ 6.000");
    data.set("success", "Equipe encontra o indicador certo sem apoio.");
    data.set("contentStatus", "Conteúdo parcialmente pronto");
    data.set("visualIdentity", "Identidade visual existente");
    data.set("pagesScreens", "Dashboard executivo; detalhe do indicador; filtros");
    data.set("features", "Filtros, exportação e estados vazios");
    data.set("integrations", "API interna e autenticação");
    data.set("qualityPriority", "Performance e acessibilidade");
    data.set("postLaunch", "Evolução contínua");
    data.set("briefing", "Hoje os dados estão espalhados em planilhas.");

    const url = new URL(buildBriefingWhatsAppUrl("5561992903029", data));
    const message = url.searchParams.get("text") || "";

    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/5561992903029");
    expect(message).toContain("CONTATO");
    expect(message).toContain("DIREÇÃO");
    expect(message).toContain("Objetivo: Organizar indicadores para consulta rápida.");
    expect(message).toContain("Entrega: Dashboard / interface");
    expect(message).toContain("Prazo: 1 a 2 meses");
    expect(message).toContain("Critério de sucesso: Equipe encontra o indicador certo sem apoio.");
    expect(message).toContain("REQUISITOS");
    expect(message).toContain("Conteúdo: Conteúdo parcialmente pronto");
    expect(message).toContain("Telas / páginas: Dashboard executivo; detalhe do indicador; filtros");
    expect(message).toContain("Integrações: API interna e autenticação");
    expect(message).toContain("Prioridade de qualidade: Performance e acessibilidade");
    expect(message).toContain("Pós-lançamento: Evolução contínua");
    expect(message).not.toContain("Referências:");
  });

  it("não inventa campos opcionais ausentes", () => {
    const data = new FormData();
    data.set("name", "Ana Silva");
    data.set("email", "ana@example.com");
    data.set("service", "Site ou landing page");
    data.set("projectType", "Marca ou negócio");
    data.set("location", "Águas Lindas de Goiás");
    data.set("briefing", "Preciso apresentar melhor meu serviço.");

    const message = new URL(buildBriefingWhatsAppUrl("5561992903029", data)).searchParams.get("text") || "";
    expect(message).not.toContain("Data prevista:");
    expect(message).not.toContain("Investimento:");
    expect(message).not.toContain("Restrições / integrações:");
  });
});
