import { describe, expect, it } from "vitest";
import { resolvePgBotAnswer, PG_BOT_SUGGESTIONS } from "./pgBotGuide";

describe("PG Bot guia local do portfólio", () => {
  it("encaminha dúvidas a links reais sem prometer integração remota", () => {
    const cases = [
      ["Me mostra os projetos", "#projetos"],
      ["Quero ver seu currículo", "#curriculo-web"],
      ["Como contratar ou pedir orçamento?", "#contato-briefing"],
      ["Como jogar no PG Arcade?", "https://pabloguilherme1121.github.io/PG-Arcade/"],
      ["Quais serviços você presta?", "#servicos"],
      ["Como acompanhar outros projetos?", "#rede-projetos"],
      ["Como funcionam meus dados e privacidade?", "/PG-portfolio/privacidade/"],
    ] as const;
    for (const [question, href] of cases) {
      const answer = resolvePgBotAnswer(question);
      expect(answer.text.length).toBeGreaterThan(30);
      expect(answer.action?.href, question).toBe(href);
    }
  });

  it("trata texto vazio, variante sem acentos e pergunta desconhecida", () => {
    expect(resolvePgBotAnswer("   ").action).toBeUndefined();
    expect(resolvePgBotAnswer("CURRICULO").action?.href).toBe("#curriculo-web");
    expect(resolvePgBotAnswer("teste xyz")).toMatchObject({ kind: "fallback" });
  });

  it("não guarda nem devolve dados fornecidos pelo visitante", () => {
    const secret = "meu telefone 11987654321";
    const response = resolvePgBotAnswer(secret);
    expect(JSON.stringify(response)).not.toContain("11987654321");
    expect(PG_BOT_SUGGESTIONS.length).toBeGreaterThanOrEqual(4);
  });

  it("aceita caminhos públicos próprios do GitHub Pages", () => {
    const answer = resolvePgBotAnswer("privacidade");
    expect(answer.action?.href).toMatch(/^\/PG-portfolio\/privacidade\/$/);
  });
});
