import { test, expect } from "@playwright/test";
for (const width of [320, 390, 768]) {
  test(`football keeps playfield and touch controls together at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await page.locator('[data-arcade-open-control="true"]').click();
    await page.getByRole("tab", { name: /futebol/i }).click();
    await expect(
      page.locator('button[aria-label="Voltar ao topo da página"]')
    ).toHaveAttribute("aria-hidden", "true");
    const game = page.locator("[data-football-game]");
    const target = game.getByRole("slider", { name: "Mira no gol" });
    await expect(target).toBeVisible();
    const bounds = (await target.boundingBox())!;
    await target.click({
      position: { x: bounds.width * 0.7, y: bounds.height * 0.5 },
    });
    expect(Number(await target.getAttribute("aria-valuenow"))).toBeGreaterThan(
      60
    );
    await target.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(target).toHaveAttribute("aria-valuenow", "65");
    const force = game.getByLabel("Força", { exact: true });
    expect((await force.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await game.getByRole("button", { name: "Chutar", exact: true }).click();
    await expect(
      game.getByRole("button", { name: "Chutar", exact: true })
    ).toBeDisabled();
    await expect(game.getByRole("status")).toContainText(/Gol|Defesa|Fora/);
    await expect(
      game.getByRole("button", { name: "Chutar", exact: true })
    ).toBeEnabled();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await page.getByRole("tab", { name: /dominó/i }).click();
    const settings = page.locator("[data-domino-settings]");
    await expect(settings).not.toHaveAttribute("open");
    await settings.locator("summary").click();
    await expect(
      settings.getByRole("button", { name: "mestre", exact: true })
    ).toBeVisible();
  });
}

test("football cancels a pending shot on restart and respects reduced motion", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('[data-arcade-open-control="true"]').click();
  await page.getByRole("tab", { name: /futebol/i }).click();
  const game = page.locator("[data-football-game]");
  await game.getByRole("button", { name: "Chutar", exact: true }).click();
  await game.getByRole("button", { name: "Reiniciar série" }).click();
  await page.waitForTimeout(700);
  await expect(game).toContainText("0 / 5 cobranças");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await game.getByRole("button", { name: "Chutar", exact: true }).click();
  await expect(game).toContainText("1 / 5 cobranças");
  await expect(game.locator("animateMotion")).toHaveCount(0);
});
