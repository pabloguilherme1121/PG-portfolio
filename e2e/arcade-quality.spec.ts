import { expect, test } from "@playwright/test";

for (const width of [320, 390]) {
  test(`níveis explicados e controles legíveis em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.locator('[data-arcade-open-control]').click();
    const arcade = page.locator('[data-arcade-hub]');
    for (const name of [/Jogo da velha/, /Dominó/, /Futebol/, /Damas/, /Xadrez/]) {
      await arcade.getByRole("tab", { name }).click();
      await expect(arcade.locator('[role="tabpanel"]:visible [data-arcade-difficulty]')).toContainText("Nível Normal");
    }
    const chess = arcade.locator('[data-chess-game]');
    await chess.getByRole("button", { name: "difícil", exact: true }).click();
    await expect(chess.locator('[data-arcade-difficulty]')).toContainText("resposta do adversário");
    await chess.getByRole("button", { name: /1 × 1 local/ }).click();
    await expect(chess.locator('[data-arcade-difficulty]')).toContainText("A dificuldade do bot não se aplica");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("animações do Arcade respeitam movimento reduzido", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.locator('[data-arcade-open-control]').click();
  const arena = page.locator('[data-tic-tac-toe] [data-arcade-arena]');
  await expect(arena).toBeVisible();
  expect(await arena.evaluate(el => getComputedStyle(el).animationName)).toBe("arcade-arena-enter");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await arena.evaluate(el => getComputedStyle(el).animationName)).toBe("none");
  const cell = page.locator('[data-game-cell]').first();
  await cell.click();
  await expect(cell).toHaveText("X");
  expect(await cell.locator("span").evaluate(el => getComputedStyle(el).animationName)).toBe("none");
});
