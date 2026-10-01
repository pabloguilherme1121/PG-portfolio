import { describe, expect, it } from "vitest";
import {
  emptyArcadeSession,
  getMostVisitedArcadeGame,
  getSuggestedArcadeGame,
  markArcadeGameExplored,
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
        explored: ["futebol", "inexistente", "futebol"],
      }),
    ).toEqual({
      lastGame: "velha",
      visits: { velha: 0, domino: 0, futebol: 2, damas: 0 },
      explored: ["futebol"],
    });
  });

  it("migra sessões antigas usando os jogos que já têm visitas", () => {
    expect(
      normalizeArcadeSession({
        lastGame: "damas",
        visits: { velha: 1, domino: 0, futebol: 0, damas: 2 },
      }),
    ).toEqual({
      lastGame: "damas",
      visits: { velha: 1, domino: 0, futebol: 0, damas: 2 },
      explored: ["velha", "damas"],
    });
  });

  it("marca o jogo aberto como explorado sem inflar a contagem de seleções", () => {
    const next = markArcadeGameExplored(emptyArcadeSession, "velha");

    expect(next.explored).toEqual(["velha"]);
    expect(next.visits.velha).toBe(0);
  });

  it("registra a visita, marca o jogo como explorado e transforma-o no último jogado", () => {
    const next = recordArcadeGameVisit(emptyArcadeSession, "damas");

    expect(next).toEqual({
      lastGame: "damas",
      visits: { velha: 0, domino: 0, futebol: 0, damas: 1 },
      explored: ["damas"],
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

  it("sugere primeiro um jogo ainda não explorado e nunca repete o jogo ativo", () => {
    const session = normalizeArcadeSession({
      lastGame: "domino",
      visits: { velha: 4, domino: 2, futebol: 1, damas: 0 },
      explored: ["velha", "domino", "futebol"],
    });

    expect(getSuggestedArcadeGame(session, "domino")).toBe("damas");

    const completed = markArcadeGameExplored(session, "damas");
    expect(getSuggestedArcadeGame(completed, "domino")).toBe("damas");
    expect(getSuggestedArcadeGame(completed, "damas")).toBe("futebol");
  });
});
