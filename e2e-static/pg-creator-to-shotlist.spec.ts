import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("Creator Kit exporta duas cenas e Shotlist restaura, persiste e marca captação", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));

  const creator = await page.goto("lab/creator/");
  expect(creator?.status()).toBe(200);
  await page.locator("#topic").fill("Bastidores da gravação");
  await page.locator("#scenes").fill("Plano geral da locação\nDetalhe da câmera");
  await page.locator("#submit").click();
  await expect(page.locator("#total")).toHaveText("1");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.locator('[data-action="shotlist"]').click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^pg-shotlist-.*\.json$/);
  const path = await download.path();
  expect(path, "O download JSON deve estar disponível").not.toBeNull();
  const buffer = await readFile(path!);
  const data = JSON.parse(buffer.toString("utf8"));
  expect(data.version).toBe(1);
  expect(data.title).toBe("Bastidores da gravação");
  expect(data.shots).toHaveLength(2);
  expect(data.shots.map((shot: { title: string }) => shot.title)).toEqual([
    "Plano geral da locação",
    "Detalhe da câmera",
  ]);

  const shotlist = await page.goto("lab/shotlist/");
  expect(shotlist?.status()).toBe(200);
  page.once("dialog", dialog => dialog.accept());
  await page.locator("#json-import").setInputFiles({
    name: "cenas-creator.json",
    mimeType: "application/json",
    buffer,
  });
  await expect(page.locator("#project-title")).toHaveValue("Bastidores da gravação");
  await expect(page.locator("#shot-list")).toContainText("Plano geral da locação");
  await expect(page.locator("#shot-list")).toContainText("Detalhe da câmera");
  await expect(page.locator("#list-count")).toHaveText("2");
  await page.reload();
  await expect(page.locator("#list-count")).toHaveText("2");

  await page.locator('#shot-list button[data-action="capture"]').first().click();
  await expect(page.locator("#count-done")).toHaveText("1");
  await page.reload();
  await expect(page.locator("#count-done")).toHaveText("1");

  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 780 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth),
      `Overflow horizontal com largura ${width}px`,
    ).toBeLessThanOrEqual(1);
    await expect(page.locator("#shot-list")).toContainText("Plano geral da locação");
  }
  expect(errors).toEqual([]);
});
