import { describe, expect, it } from "vitest";
import { quoteRequestInputSchema } from "./routers";

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
});
