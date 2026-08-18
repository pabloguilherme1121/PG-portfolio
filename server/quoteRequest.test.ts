import { describe, expect, it } from "vitest";
import { consumeQuoteRequestRateLimit, isQuoteRequestHoneypotFilled, quoteRequestInputSchema } from "./routers";

const validRequest = {
  name: "Cliente de teste",
  email: "cliente@example.com",
  service: "Filmagem aérea com drone",
  projectType: "Evento social",
  location: "Águas Lindas de Goiás",
  eventDate: "2026-09-15",
  delivery: "Vertical 9:16 para Reels",
  budget: "Prefiro conversar",
  briefing: "Preciso de uma cobertura de teste com vídeos verticais e imagens aéreas.",
};

describe("quoteRequestInputSchema", () => {
  it("aceita um pedido de orçamento completo", () => {
    expect(quoteRequestInputSchema.safeParse(validRequest).success).toBe(true);
  });

  it("rejeita pedidos sem as informações essenciais", () => {
    expect(quoteRequestInputSchema.safeParse({ ...validRequest, email: "sem-email" }).success).toBe(false);
    expect(quoteRequestInputSchema.safeParse({ ...validRequest, briefing: "curto" }).success).toBe(false);
  });

  it("aceita o honeypot vazio e identifica bots que o preenchem", () => {
    expect(isQuoteRequestHoneypotFilled(undefined)).toBe(false);
    expect(isQuoteRequestHoneypotFilled("   ")).toBe(false);
    expect(isQuoteRequestHoneypotFilled("https://bot.example")).toBe(true);
    expect(quoteRequestInputSchema.safeParse({ ...validRequest, website: "" }).success).toBe(true);
  });

  it("limita pedidos repetidos por identificador e libera uma nova janela", () => {
    const identifier = `test-${Date.now()}-${Math.random()}`;
    const now = 1_700_000_000_000;
    expect(Array.from({ length: 5 }, () => consumeQuoteRequestRateLimit(identifier, now))).toEqual([true, true, true, true, true]);
    expect(consumeQuoteRequestRateLimit(identifier, now)).toBe(false);
    expect(consumeQuoteRequestRateLimit(identifier, now + 10 * 60 * 1000)).toBe(true);
  });
});
