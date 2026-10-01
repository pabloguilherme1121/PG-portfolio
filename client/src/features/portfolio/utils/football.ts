export type FootballDifficulty = "easy" | "normal" | "hard" | "master" | "expert";
export type FootballMode = "penalty" | "free-kick";
export function resolveFootballShot(
  mode: FootballMode,
  aim: number,
  power: number,
  curve: number,
  keeper: number
) {
  const x = aim + (mode === "free-kick" ? curve * 0.18 : 0);
  const y = 90 - power * 0.7;
  const result: "gol" | "defesa" | "fora" | "barreira" =
    power > 90 || power < 25 || x < 8 || x > 92
      ? "fora"
      : mode === "free-kick" &&
          Math.abs(aim - 50) < 18 &&
          power < 58 &&
          Math.abs(curve) < 40
        ? "barreira"
        : Math.abs(x - keeper) < (power < 55 ? 18 : 12)
          ? "defesa"
          : "gol";
  return { result, x, y };
}


export function chooseFootballKeeperPosition(
  difficulty: FootballDifficulty,
  aim: number,
  power: number,
  curve: number,
  random: () => number = Math.random,
) {
  const randomPosition = 15 + random() * 70;
  if (difficulty === "easy") return randomPosition;

  const projected = Math.max(10, Math.min(90, aim + curve * 0.18));
  const reaction = difficulty === "normal" ? 0.28 : difficulty === "hard" ? 0.5 : difficulty === "master" ? 0.68 : 0.8;
  const powerPenalty = Math.max(0, Math.min(0.18, (power - 68) / 180));
  const effectiveReaction = Math.max(0.18, reaction - powerPenalty);
  return Math.max(10, Math.min(90, randomPosition * (1 - effectiveReaction) + projected * effectiveReaction));
}
