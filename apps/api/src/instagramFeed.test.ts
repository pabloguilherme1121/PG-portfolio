import { describe, expect, it } from "vitest";
import type { TrpcContext } from "./_core/context";
import { appRouter } from "./routers";

function createContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("instagram feed router", () => {
  it("declara credenciais ausentes sem fabricar publicações", async () => {
    await expect(appRouter.createCaller(createContext()).instagramFeed.status()).resolves.toEqual({
      status: "credentials_required",
      items: [],
      message: "A conexão com a API da Meta ainda depende de uma conta profissional e autorização válida.",
    });
  });
});
