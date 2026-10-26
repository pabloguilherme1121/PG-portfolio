import { expect, test } from "@playwright/test";

for (const lab of ["qa", "creator", "sprint", "budget"]) {
  test(`PG ${lab} serve PG Bot e preserva o layout em 320 e 390 px`, async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", error => pageErrors.push(error.message));

    const navigation = await page.goto(`lab/${lab}/`);
    expect(navigation?.status()).toBe(200);

    const signature = page.locator('[data-pg-bot="signature"]');
    const mascot = signature.locator("img");
    await expect(signature).toBeAttached();
    await expect(mascot).toHaveAttribute("src", "../../brand/pg-bot/mascot.webp");

    const mascotURL = new URL("../../brand/pg-bot/mascot.webp", page.url()).href;
    const response = await page.request.get(mascotURL);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("image/webp");

    await signature.scrollIntoViewIfNeeded();
    await expect.poll(() => mascot.evaluate(node => {
      const image = node as HTMLImageElement;
      return image.complete && image.naturalWidth > 0;
    })).toBe(true);

    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await expect(page.locator("main").first()).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      expect(overflow, `Overflow horizontal no PG ${lab} a ${width}px`).toBeLessThanOrEqual(1);
    }
    expect(pageErrors).toEqual([]);
  });
}
