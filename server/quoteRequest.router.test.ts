import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  createQuoteRequest: vi.fn(),
  notifyOwner: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, createQuoteRequest: mocks.createQuoteRequest };
});

vi.mock("./_core/notification", () => ({ notifyOwner: mocks.notifyOwner }));

import { appRouter } from "./routers";

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

function createPublicCaller(forwardedAddress: string) {
  const context = {
    req: {
      headers: { "x-forwarded-for": forwardedAddress },
      socket: { remoteAddress: "127.0.0.1" },
    },
    res: {},
    user: null,
  } as unknown as TrpcContext;
  return appRouter.createCaller(context);
}

describe("quoteRequest.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createQuoteRequest.mockResolvedValue({ id: 42 });
    mocks.notifyOwner.mockResolvedValue(true);
  });

  it("persiste um briefing válido e tenta notificar o proprietário", async () => {
    const result = await createPublicCaller("203.0.113.11").quoteRequest.create({ ...validRequest, website: "" });

    expect(result).toEqual({ success: true, requestId: 42, ownerNotified: true });
    expect(mocks.createQuoteRequest).toHaveBeenCalledWith(expect.objectContaining({
      name: validRequest.name,
      email: validRequest.email,
      eventDate: new Date("2026-09-15T12:00:00.000Z"),
    }));
    expect(mocks.notifyOwner).toHaveBeenCalledWith(expect.objectContaining({
      title: "Novo pedido de orçamento",
      content: expect.stringContaining(validRequest.email),
    }));
  });

  it("mantém o envio salvo quando a notificação falha", async () => {
    mocks.notifyOwner.mockRejectedValueOnce(new Error("notification unavailable"));

    const result = await createPublicCaller("203.0.113.14").quoteRequest.create({ ...validRequest, website: "" });

    expect(result).toEqual({ success: true, requestId: 42, ownerNotified: false });
    expect(mocks.createQuoteRequest).toHaveBeenCalledTimes(1);
  });

  it("filtra honeypot antes de persistir ou notificar", async () => {
    const result = await createPublicCaller("203.0.113.12").quoteRequest.create({ ...validRequest, website: "https://bot.example" });

    expect(result).toEqual({ success: true, requestId: "filtered", ownerNotified: false });
    expect(mocks.createQuoteRequest).not.toHaveBeenCalled();
    expect(mocks.notifyOwner).not.toHaveBeenCalled();
  });

  it("bloqueia o sexto pedido na mesma janela antes de persistir", async () => {
    const caller = createPublicCaller("203.0.113.13");
    await Promise.all(Array.from({ length: 5 }, () => caller.quoteRequest.create({ ...validRequest, website: "" })));

    await expect(caller.quoteRequest.create({ ...validRequest, website: "" })).rejects.toMatchObject({ code: "TOO_MANY_REQUESTS" });
    expect(mocks.createQuoteRequest).toHaveBeenCalledTimes(5);
    expect(mocks.notifyOwner).toHaveBeenCalledTimes(5);
  });
});
