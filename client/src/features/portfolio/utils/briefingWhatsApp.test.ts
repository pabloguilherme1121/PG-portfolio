import { describe, expect, it } from "vitest";
import { buildBriefingWhatsAppUrl } from "./briefingWhatsApp";

describe("buildBriefingWhatsAppUrl", () => {
  it("prepara uma mensagem legível sem inventar campos opcionais", () => {
    const data = new FormData();
    data.set("name", "Ana Silva");
    data.set("email", "ana@example.com");
    data.set("service", "Vídeo");
    data.set("projectType", "Evento");
    data.set("location", "Águas Lindas de Goiás");
    data.set("briefing", "Captar & editar uma apresentação.");

    const url = new URL(buildBriefingWhatsAppUrl("5561992903029", data));
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/5561992903029");
    expect(url.searchParams.get("text")).toContain("Nome: Ana Silva\nE-mail: ana@example.com");
    expect(url.searchParams.get("text")).toContain("Captar & editar uma apresentação.");
    expect(url.searchParams.get("text")).not.toContain("Data:");
    expect(url.searchParams.get("text")).not.toContain("Orçamento:");
  });
});
