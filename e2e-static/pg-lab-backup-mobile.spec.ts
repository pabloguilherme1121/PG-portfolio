import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

async function restoreBackup(page: import("@playwright/test").Page, prefix: string) {
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#export-json").click(),
  ]);
  const filePath = await download.path();
  expect(filePath, "O backup precisa existir no runner").not.toBeNull();
  const buffer = await readFile(filePath!);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  page.once("dialog", dialog => dialog.accept());
  await page.locator("#import-json").setInputFiles({
    name: `${prefix}-backup.json`,
    mimeType: "application/json",
    buffer,
  });
}

async function verifyCompactWidths(page: import("@playwright/test").Page) {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 780 });
    await expect(page.locator("main")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth,
      ),
      `Overflow horizontal a ${width}px`,
    ).toBeLessThanOrEqual(1);
    await expect(page.locator(".metric small").first()).toHaveCSS("font-size", "13px");
  }
}

test("PG Budget recupera orçamento real após exportar e importar JSON", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  const response = await page.goto("lab/budget/");
  expect(response?.status()).toBe(200);
  await page.locator("#item-description").fill("Transporte para gravação");
  await page.locator("#item-price").fill("35,90");
  await page.locator("#item-submit").click();
  await expect(page.locator("#metric-expense")).toContainText("35,90");
  await restoreBackup(page, "pg-budget");
  await expect(page.locator("#item-list")).toContainText("Transporte para gravação");
  await expect(page.locator("#metric-expense")).toContainText("35,90");
  await verifyCompactWidths(page);
  expect(errors).toEqual([]);
});

test("PG Sprint recupera tarefa após exportar e importar JSON", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  const response = await page.goto("lab/sprint/");
  expect(response?.status()).toBe(200);
  await page.locator("#task-name").fill("Revisar roteiro do vídeo");
  await page.locator("#task-submit").click();
  await expect(page.locator("#metric-total")).toHaveText("1");
  await restoreBackup(page, "pg-sprint");
  await expect(page.locator("#task-list")).toContainText("Revisar roteiro do vídeo");
  await expect(page.locator("#metric-total")).toHaveText("1");
  await verifyCompactWidths(page);
  expect(errors).toEqual([]);
});
