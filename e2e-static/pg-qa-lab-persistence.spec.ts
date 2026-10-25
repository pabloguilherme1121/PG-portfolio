import { expect, test } from "@playwright/test";

test("PG QA Lab persiste execuções e permite corrigir rastreabilidade sem apagar os registros", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  const response = await page.goto("lab/qa/");
  expect(response?.status()).toBe(200);
  await expect(page.locator("#new-run")).toBeVisible();
  await page.locator("#new-run").click();
  await page.locator("#new-project").selectOption("PG-Arcade");
  await page.locator("#confirm-create").click();
  await expect(page.locator("#run-list")).toContainText("PG-Arcade");

  await page.locator("#edit-meta").click();
  await page.locator("#edit-sha").fill("a2c82c7");
  await page.locator("#edit-browser").fill("Chrome Android");
  await page.locator("#edit-viewport").fill("390 × 844");
  await page.locator("#edit-dialog button[value='save']").click();
  await expect(page.locator("#run-meta")).toContainText("a2c82c7");

  await page.reload();
  await expect(page.locator("#run-list")).toContainText("PG-Arcade");
  await expect(page.locator("#run-meta")).toContainText("a2c82c7");
  await expect(page.locator("#run-status")).not.toContainText("CERTIFICADO");
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
});
