export const arcadeSessionStorageKey = "pablo-pg-arcade-session-v1";

export const arcadeGames = ["velha", "domino", "futebol", "damas"] as const;
export type ArcadeGame = (typeof arcadeGames)[number];

export type ArcadeSession = {
  lastGame: ArcadeGame;
  visits: Record<ArcadeGame, number>;
};

export const emptyArcadeSession: ArcadeSession = {
  lastGame: "velha",
  visits: {
    velha: 0,
    domino: 0,
    futebol: 0,
    damas: 0,
  },
};

function isArcadeGame(value: unknown): value is ArcadeGame {
  return typeof value === "string" && arcadeGames.includes(value as ArcadeGame);
}

function normalizeVisitCount(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

export function normalizeArcadeSession(value: unknown): ArcadeSession {
  if (!value || typeof value !== "object") {
    return {
      lastGame: emptyArcadeSession.lastGame,
      visits: { ...emptyArcadeSession.visits },
    };
  }

  const candidate = value as {
    lastGame?: unknown;
    visits?: Partial<Record<ArcadeGame, unknown>>;
  };

  return {
    lastGame: isArcadeGame(candidate.lastGame)
      ? candidate.lastGame
      : emptyArcadeSession.lastGame,
    visits: {
      velha: normalizeVisitCount(candidate.visits?.velha),
      domino: normalizeVisitCount(candidate.visits?.domino),
      futebol: normalizeVisitCount(candidate.visits?.futebol),
      damas: normalizeVisitCount(candidate.visits?.damas),
    },
  };
}

export function recordArcadeGameVisit(
  session: ArcadeSession,
  game: ArcadeGame,
): ArcadeSession {
  return {
    lastGame: game,
    visits: {
      ...session.visits,
      [game]: session.visits[game] + 1,
    },
  };
}

export function getMostVisitedArcadeGame(
  session: ArcadeSession,
): ArcadeGame | null {
  const highest = Math.max(...arcadeGames.map((game) => session.visits[game]));
  if (highest <= 0) return null;
  if (session.visits[session.lastGame] === highest) return session.lastGame;
  return arcadeGames.find((game) => session.visits[game] === highest) ?? null;
}
