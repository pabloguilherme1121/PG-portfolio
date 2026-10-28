import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("PG QA Lab restaura uma execução e seus metadados a partir do backup JSON", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  const response = await page.goto("lab/qa/");
  expect(response?.status()).toBe(200);
  await page.locator("#new-run").click();
  await page.locator("#new-project").selectOption("PG-Arcade");
  await page.locator("#confirm-create").click();
  await expect(page.locator("#run-list")).toContainText("PG-Arcade");

  await page.locator("#edit-meta").click();
  await page.locator("#edit-sha").fill("abc1234");
  await page.locator("#edit-browser").fill("Chromium de teste");
  await page.locator("#edit-dialog button[value='save']").click();
  await expect(page.locator("#run-meta")).toContainText("abc1234");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#download-json").click(),
  ]);
  expect(download.suggestedFilename()).toBe("pg-qa-lab-backup.json");
  const file = await download.path();
  expect(file).not.toBeNull();
  const bytes = await readFile(file!);
  const backup = JSON.parse(bytes.toString("utf8"));
  expect(backup.runs).toHaveLength(1);
  expect(backup.runs[0].project).toBe("PG-Arcade");
  expect(backup.runs[0].sha).toBe("abc1234");

  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator("#run-list")).not.toContainText("PG-Arcade");

  await page.locator("#upload-json").setInputFiles({
    name: "qa-execucao-ficticia.json",
    mimeType: "application/json",
    buffer: bytes,
  });
  await expect(page.locator("#run-list")).toContainText("PG-Arcade");
  await expect(page.locator("#run-meta")).toContainText("abc1234");
  await page.reload();
  await expect(page.locator("#run-meta")).toContainText("abc1234");
  await expect(page.locator("#run-status")).not.toContainText("CERTIFICADO");

  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 780 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
});

test("PG Creator Kit recupera ideias e cenas após limpar o armazenamento", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  const response = await page.goto("lab/creator/");
  expect(response?.status()).toBe(200);
  await page.locator("#topic").fill("Cena fictícia de teste");
  await page.locator("#scenes").fill("Abertura da cena\nDetalhe do cenário");
  await page.locator("#submit").click();
  await expect(page.locator("#total")).toHaveText("1");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator("#export-json").click(),
  ]);
  expect(download.suggestedFilename()).toBe("pg-creator-kit-backup.json");
  const path = await download.path();
  expect(path).not.toBeNull();
  const bytes = await readFile(path!);
  expect(bytes.toString("utf8")).toContain("Cena fictícia de teste");

  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator("#total")).toHaveText("0");

  await page.locator("#file").setInputFiles({
    name: "creator-ficticio.json",
    mimeType: "application/json",
    buffer: bytes,
  });
  await expect(page.locator("#total")).toHaveText("1");
  await expect(page.locator("#list")).toContainText("Cena fictícia de teste");

  await page.reload();
  await expect(page.locator("#list")).toContainText("Cena fictícia de teste");
  await page.locator('[data-action="edit"]').click();
  await expect(page.locator("#topic")).toHaveValue("Cena fictícia de teste");
  await expect(page.locator("#scenes")).toHaveValue("Abertura da cena\nDetalhe do cenário");

  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 780 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
  expect(errors).toEqual([]);
});
