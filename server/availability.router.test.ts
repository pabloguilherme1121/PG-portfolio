import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const dbMocks = vi.hoisted(() => ({
  blockAvailabilityDate: vi.fn(),
  createQuoteRequest: vi.fn(),
  listBlockedDates: vi.fn(),
  unblockAvailabilityDate: vi.fn(),
}));

vi.mock("./db", () => dbMocks);

import { appRouter } from "./routers";

function createContext(role?: "admin" | "user"): TrpcContext {
  return {
    user: role ? {
      id: 1,
      openId: "test-user",
      name: "Test User",
      email: "test@example.com",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } : null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("availability router", () => {
  beforeEach(() => vi.clearAllMocks());

  it("exibe bloqueios para visitantes sem exigir login", async () => {
    const dates = [{ id: 1, dateKey: "2026-08-17", note: "Feriado", createdAt: new Date() }];
    dbMocks.listBlockedDates.mockResolvedValue(dates);

    await expect(appRouter.createCaller(createContext()).availability.listBlocked()).resolves.toEqual(dates);
  });

  it("recusa bloqueio de data para quem não é administrador", async () => {
    await expect(
      appRouter.createCaller(createContext("user")).availability.block({ dateKey: "2026-08-17" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(dbMocks.blockAvailabilityDate).not.toHaveBeenCalled();
  });

  it("permite que o administrador bloqueie e libere datas válidas", async () => {
    const caller = appRouter.createCaller(createContext("admin"));
    dbMocks.blockAvailabilityDate.mockResolvedValue(undefined);
    dbMocks.unblockAvailabilityDate.mockResolvedValue(undefined);

    await expect(caller.availability.block({ dateKey: "2026-08-17", note: "Feriado" })).resolves.toEqual({ success: true });
    await expect(caller.availability.unblock({ dateKey: "2026-08-17" })).resolves.toEqual({ success: true });
    expect(dbMocks.blockAvailabilityDate).toHaveBeenCalledWith("2026-08-17", "Feriado");
    expect(dbMocks.unblockAvailabilityDate).toHaveBeenCalledWith("2026-08-17");
  });

  it("rejeita uma data inexistente antes de tentar alterar a agenda", async () => {
    await expect(
      appRouter.createCaller(createContext("admin")).availability.block({ dateKey: "2026-02-30" }),
    ).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(dbMocks.blockAvailabilityDate).not.toHaveBeenCalled();
  });
});
