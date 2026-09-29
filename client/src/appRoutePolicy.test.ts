import { describe, expect, it } from "vitest";
import { getPublicRoutePolicy } from "./appRoutePolicy";

describe("getPublicRoutePolicy", () => {
  it("esconde rotas internas no deploy estático", () => {
    expect(getPublicRoutePolicy(true)).toEqual({
      agenda: false,
      favorites: false,
      curation: false,
      privacy: true,
    });
  });

  it("mantém rotas internas disponíveis na versão com servidor", () => {
    expect(getPublicRoutePolicy(false)).toEqual({
      agenda: true,
      favorites: true,
      curation: true,
      privacy: true,
    });
  });
});
