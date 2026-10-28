import { expect, test } from "@playwright/test";

test("PG Shotlist entrega o mascote WebP e não corta a interface móvel", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  const response = await page.goto("lab/shotlist/");
  expect(response?.status()).toBe(200);

  const signature = page.locator('[data-pg-bot="signature"]');
  const mascot = signature.locator("img");
  await expect(signature).toBeAttached();
  const relativeSrc = await mascot.getAttribute("src");
  expect(relativeSrc).toBe("../../brand/pg-bot/mascot.webp");

  const mascotURL = new URL(relativeSrc!, page.url()).href;
  const imageResponse = await page.request.get(mascotURL);
  expect(imageResponse.status()).toBe(200);
  expect(imageResponse.headers()["content-type"]).toContain("image/webp");

  await signature.scrollIntoViewIfNeeded();
  await expect.poll(() => mascot.evaluate(img => {
    const element = img as HTMLImageElement;
    return element.complete && element.naturalWidth > 0;
  })).toBe(true);

  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator("#shot-form")).toBeVisible();
    await expect(page.locator("#shot-list")).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, `Overflow horizontal a ${width}px`).toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
});
