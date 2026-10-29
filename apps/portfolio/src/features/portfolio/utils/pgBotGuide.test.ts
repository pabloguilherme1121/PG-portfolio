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
      ["Como funcionam meus dados e privacidade?", `${import.meta.env.BASE_URL}privacidade/`],
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


  it("abre os produtos específicos usando a rede centralizada, com estado verídico", () => {
    const observatorio = resolvePgBotAnswer("Quero abrir o Observatório");
    expect(observatorio.action).toEqual({ label: "Abrir Observatório", href: "https://pabloguilherme01.github.io/observatorio/#dashboard", external: true });
    expect(observatorio.text).toContain("Produto publicado");
    const trajeto = resolvePgBotAnswer("Me mostre o Trajeto");
    expect(trajeto.action?.href).toBe("https://pabloguilherme01.github.io/trajeto-web/");
    expect(trajeto.text).toContain("Em evolução");
  });


  it("distingue as missões estratégicas de jogos independentes sem criar URL não certificada", () => {
    for (const query of ["Como jogar PG Estratégia?", "Quero conhecer as missões de estratégia"]) {
      const answer = resolvePgBotAnswer(query);
      expect(answer.kind).toBe("answer");
      expect(answer.text).toMatch(/missões/);
      expect(answer.text).toMatch(/mecânicas|sistemas/);
      expect(answer.action?.href).toBe("https://pabloguilherme1121.github.io/PG-Arcade/");
      expect(answer.action?.external).toBe(true);
    }
  });

  it("aceita caminhos públicos próprios do GitHub Pages", () => {
    const answer = resolvePgBotAnswer("privacidade");
    expect(answer.action?.href).toBe(`${import.meta.env.BASE_URL}privacidade/`);
  });
  it("responde a saudações e dúvidas sobre GitHub e WhatsApp com destinos reais", () => {
    const help = resolvePgBotAnswer("Oi");
    expect(help.kind).toBe("answer");
    expect(help.text).toMatch(/projetos|currículo/i);
    const code = resolvePgBotAnswer("Onde vejo o código no GitHub?");
    expect(code.action).toEqual({ label: "Ver repositório", href: "https://github.com/pabloguilherme1121/PG-portfolio", external: true });
    expect(resolvePgBotAnswer("WhatsApp").action?.href).toBe("#contato-briefing");
  });

  it("reconhece variações de nomes dos projetos e oferece contato por e-mail sem enviar mensagens", () => {
    expect(resolvePgBotAnswer("Quero ver as eleições de Goiás 2026").action?.href).toBe(
      "https://pabloguilherme1121.github.io/eleicoes-goias-2026/"
    );
    expect(resolvePgBotAnswer("Onde encontro o mapa de Planaltina?").action?.href).toBe(
      "https://pabloguilherme01.github.io/mapa-planaltina-go/"
    );
    expect(resolvePgBotAnswer("Quero falar por e-mail").action).toEqual({
      label: "Escrever e-mail",
      href: "mailto:mpjcreator@gmail.com",
      external: true,
    });
  });

});
