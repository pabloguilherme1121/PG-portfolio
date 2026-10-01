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
