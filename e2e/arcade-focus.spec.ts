import { expect, test } from "@playwright/test";

for (const width of [320, 390]) {
  test(`modo de jogo e ajuda contextual em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.locator('[data-arcade-open-control="true"]').click();
    const arcade = page.locator('[data-arcade-hub="true"]');
    await expect(arcade.getByRole("tab")).toHaveCount(5);
    const firstCell = arcade.locator('[data-game-cell="true"]').first();
    await firstCell.click();
    await expect(firstCell).toHaveText("X");
    await arcade.getByRole("button", { name: "Modo de jogo", exact: true }).click();
    await expect(arcade.getByRole("button", { name: "Modo de jogo", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(arcade.locator('[data-arcade-exploration="true"]')).toBeHidden();
    await arcade.getByRole("tab", { name: /Futebol/ }).click();
    await arcade.getByText("Como jogar Futebol", { exact: true }).click();
    await expect(arcade.getByText(/Ajuste a mira/)).toBeVisible();
    await arcade.getByRole("tab", { name: /Damas/ }).click();
    await arcade.getByText("Como jogar Damas", { exact: true }).click();
    await expect(arcade.getByText(/Capturas são obrigatórias; continue/)).toBeVisible();
    await arcade.getByRole("tab", { name: /Jogo da velha/ }).click();
    await expect(firstCell).toHaveText("X");
    await arcade.getByRole("button", { name: "Modo de jogo", exact: true }).click();
    await expect(arcade.locator('[data-arcade-exploration="true"]')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
