import { expect, test } from "@playwright/test";

for (const width of [320, 390, 1280]) {
  test(`dedicated Arcade link and return route at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./?arcade=1");

    const showcase = page.locator("#pg-lab");
    await expect(showcase).toBeVisible();
    const link = showcase.locator('[data-arcade-full-site="true"]');
    await expect(link).toHaveAttribute(
      "href",
      "https://pabloguilherme1121.github.io/PG-Arcade/",
    );
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(page.locator('[data-arcade-open-control="true"]')).toHaveCount(0);
    await expect(page.locator('[data-arcade-hub="true"]')).toHaveCount(0);

    const bounds = await link.boundingBox();
    expect(bounds?.height ?? 0).toBeGreaterThanOrEqual(44);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBe(true);
  });
}
