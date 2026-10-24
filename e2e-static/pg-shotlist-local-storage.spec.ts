import { expect, test } from "@playwright/test";

test("PG Shotlist preserva cenas entre recargas e impede sobrescrita por uma aba antiga", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  const response = await page.goto("lab/shotlist/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("#shot-title")).toBeVisible();

  await page.locator("#shot-title").fill("Abertura para o reel");
  await page.locator("#submit-shot").click();
  await expect(page.locator("#shot-list")).toContainText("Abertura para o reel");
  await page.reload();
  await expect(page.locator("#shot-list")).toContainText("Abertura para o reel");

  const second = await page.context().newPage();
  try {
    await second.goto("lab/shotlist/");
    await second.locator("#shot-title").fill("Take salvo na outra aba");
    await second.locator("#submit-shot").click();
    await expect(second.locator("#shot-list")).toContainText("Take salvo na outra aba");

    await page.locator("#shot-title").fill("Rascunho da aba antiga");
    await page.locator("#submit-shot").click();
    await expect(page.locator("#save-state")).toContainText(/Conflito entre abas|Outra aba alterou/);
    await second.reload();
    await expect(second.locator("#shot-list")).toContainText("Take salvo na outra aba");
    await expect(second.locator("#shot-list")).not.toContainText("Rascunho da aba antiga");
  } finally {
    await second.close();
  }
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
});
