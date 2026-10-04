import { expect, test } from "@playwright/test";

for (const width of [320, 390]) {
  test(`restored game stays visible in the strip at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.addInitScript(() => localStorage.setItem("pablo-pg-arcade-session-v1", JSON.stringify({ lastGame: "xadrez" })));
    await page.goto("/");
    await page.locator('[data-arcade-open-control]').click();
    const strip = page.locator('[data-arcade-game-strip]');
    const tab = strip.getByRole("tab", { name: /Xadrez/ });
    await expect(tab).toHaveAttribute("aria-selected", "true");
    await expect.poll(async () => {
      const outer = await strip.boundingBox();
      const inner = await tab.boundingBox();
      return !!outer && !!inner && inner.x >= outer.x - 1 && inner.x + inner.width <= outer.x + outer.width + 1;
    }).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("suggestions and clearing history keep keyboard focus on the current game", async ({ page }) => {
  await page.goto("/");
  await page.locator('[data-arcade-open-control]').click();
  await page.getByRole("button", { name: /Experimentar Dominó/ }).click();
  const tab = page.getByRole("tab", { name: /Dominó/ });
  await expect(tab).toBeFocused();
  await page.locator('[data-arcade-reset-progress]').click();
  await expect(tab).toBeFocused();
  await expect(page.locator('[data-domino-game]')).toBeVisible();
  await expect(page.locator('[data-arcade-reset-progress]')).toHaveCount(0);
});
