import { describe, expect, it } from "vitest";
import {
  emptyArcadeSession,
  getMostVisitedArcadeGame,
  normalizeArcadeSession,
  recordArcadeGameVisit,
} from "./arcadeSession";

describe("arcadeSession", () => {
  it("normaliza dados persistidos inválidos sem quebrar o Arcade", () => {
    expect(normalizeArcadeSession(null)).toEqual(emptyArcadeSession);
    expect(
      normalizeArcadeSession({
        lastGame: "inexistente",
        visits: { velha: -3, domino: "4", futebol: 2, damas: Number.NaN },
      }),
    ).toEqual({
      lastGame: "velha",
      visits: { velha: 0, domino: 0, futebol: 2, damas: 0 },
    });
  });

  it("registra a visita e transforma o jogo selecionado no último jogado", () => {
    const next = recordArcadeGameVisit(emptyArcadeSession, "damas");

    expect(next).toEqual({
      lastGame: "damas",
      visits: { velha: 0, domino: 0, futebol: 0, damas: 1 },
    });
    expect(emptyArcadeSession.lastGame).toBe("velha");
  });

  it("identifica o jogo mais visitado e usa o último jogado para desempatar", () => {
    const session = normalizeArcadeSession({
      lastGame: "domino",
      visits: { velha: 1, domino: 3, futebol: 3, damas: 0 },
    });

    expect(getMostVisitedArcadeGame(session)).toBe("domino");
    expect(getMostVisitedArcadeGame(emptyArcadeSession)).toBeNull();
  });
});
