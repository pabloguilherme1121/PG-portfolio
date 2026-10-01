import { test, expect } from "@playwright/test";
for (const width of [320, 390]) {
  test(`football and color domino work at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page
      .getByRole("button", { name: /abrir.*pg arcade|jogar.*pg arcade/i })
      .click();
    await page.getByRole("tab", { name: /dominó/i }).click();
    await expect(page.locator("[data-domino-color-legend]")).toBeVisible();
    await page.getByRole("tab", { name: /futebol/i }).click();
    const game = page.locator("[data-football-game]");
    await game
      .getByRole("button", { name: "Cobranças de falta", exact: true })
      .click();
    await expect(game.locator("[data-football-wall]")).toBeVisible();
    await game.getByLabel("Força").fill("65");
    await game.getByLabel("Curva").fill("70");
    await game.getByRole("button", { name: "Chutar", exact: true }).click();
    await expect(game.getByRole("status")).toContainText(
      /Gol|Defesa|Fora|Barreira/
    );
    await expect(game).toContainText("1 / 5");
    for (let shot = 1; shot < 5; shot += 1)
      await game.getByRole("button", { name: "Chutar", exact: true }).click();
    await expect(
      game.getByRole("button", { name: "Chutar", exact: true })
    ).toBeDisabled();
    await expect(game.getByRole("status")).toContainText("Série encerrada");
    await game.getByRole("button", { name: "Pênaltis", exact: true }).click();
    await expect(game.locator("[data-football-wall]")).toHaveCount(0);
    await expect(game.getByLabel("Curva")).toHaveCount(0);
    await game.getByRole("button", { name: "Reiniciar série" }).click();
    await expect(game).toContainText("0 / 5");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
  });
}
