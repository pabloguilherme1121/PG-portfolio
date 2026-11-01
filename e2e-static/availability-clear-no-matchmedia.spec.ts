import { expect, test } from "@playwright/test";

test("limpar consulta de agenda funciona sem matchMedia no navegador", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#agenda");

  const agenda = page.locator("#agenda");
  await expect(agenda).toBeVisible();
  const date = agenda.locator('[data-availability-date="true"]:not([disabled])').first();
  await expect(date).toBeVisible();
  await date.click();
  await agenda.getByRole("button", { name: "08:00" }).click();

  const summary = agenda.locator('[data-availability-selection-summary="true"]');
  await expect(summary).toBeVisible();
  // Remove the optional API only after initial app boot, isolating the clear action.
  await page.evaluate(() => {
    Object.defineProperty(window, "matchMedia", { configurable: true, value: undefined });
  });
  await agenda.locator('[data-clear-availability-selection="true"]').click();

  await expect(summary).toHaveCount(0);
  await expect(agenda.locator('[data-clear-availability-selection="true"]')).toHaveCount(0);
  // The absence of the summary alone could also mean the React error boundary replaced the app.
  await expect(agenda).toBeVisible();
  await expect(agenda.getByText("escolha uma data útil")).toBeVisible();
  // Force the deferred projects strip to render after the optional API disappears.
  // Its horizontal snap hook must not bring down the entire portfolio.
  await page.locator("#projetos").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Trabalho em uso, código aberto." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Algo saiu do percurso." })).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});
