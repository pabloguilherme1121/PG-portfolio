import { expect, test } from "@playwright/test";
for (const width of [320, 390, 1280])
  test(`dedicated Arcade link and return route at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./?arcade=1");
    await expect(page.locator("[data-arcade-hub]")).toBeVisible();
    const link = page.locator("[data-arcade-full-site]");
    await expect(link).toHaveAttribute(
      "href",
      "https://pabloguilherme1121.github.io/PG-Arcade/"
    );
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await link.scrollIntoViewIfNeeded();
    const bounds = await link.boundingBox();
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await page.locator("[data-arcade-open-control]").click();
    await expect(page.locator("[data-arcade-hub]")).toHaveCount(0);
    await expect(link).toBeVisible();
  });
