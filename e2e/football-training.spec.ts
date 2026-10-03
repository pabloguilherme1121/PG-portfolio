import { expect, test } from "@playwright/test";

test("futebol oferece cantos rápidos e mantém os ajustes durante o chute", async ({ page }) => {
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.goto("/");
  await page.locator('[data-arcade-open-control]').click();
  await page.getByRole("tab", { name: /Futebol/ }).click();
  const game = page.locator('[data-football-game]');
  await game.getByRole("button", { name: "Canto direito", exact: true }).click();
  await expect(game.getByLabel("Mira", { exact: true })).toHaveValue("80");
  await game.getByRole("button", { name: "Chutar", exact: true }).click();
  await expect(game.getByLabel("Força", { exact: true })).toBeDisabled();
  await expect(game.getByLabel("Mira", { exact: true })).toBeDisabled();
  await page.clock.runFor(650);
  await expect(game.getByRole("status")).not.toContainText("Bola em jogo");
  await expect(game.getByLabel("Força", { exact: true })).toBeEnabled();
});

test("prévia da falta acompanha a curva e a força", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-arcade-open-control]').click();
  await page.getByRole("tab", { name: /Futebol/ }).click();
  const game = page.locator('[data-football-game]');
  await game.getByRole("button", { name: "Cobranças de falta", exact: true }).click();
  await game.getByLabel("Mira", { exact: true }).fill("50");
  await game.getByLabel("Curva", { exact: true }).fill("50");
  await game.getByLabel("Força", { exact: true }).fill("65");
  const path = await game.locator('[data-football-preview]').getAttribute("d");
  const values = path!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  expect(values.at(-2)).toBeCloseTo(228.8);
  expect(values.at(-1)).toBeCloseTo(79.5);
});

test("futebol resume a série e permite avançar de nível", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await page.locator('[data-arcade-open-control]').click();
  await page.getByRole("tab", { name: /Futebol/ }).click();
  const game = page.locator('[data-football-game]');
  await game.getByLabel("Força", { exact: true }).fill("95");
  for (let i = 0; i < 5; i++) await game.getByRole("button", { name: "Chutar", exact: true }).click();
  await expect(game.locator('[data-football-series-review]')).toContainText("0% de aproveitamento");
  await expect(game.locator('[data-football-series-review]')).toContainText("5 para fora");
  await game.getByRole("button", { name: "Próximo nível", exact: true }).click();
  await expect(game.getByRole("button", { name: "Difícil", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(game).toContainText("0 / 5 cobranças");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
