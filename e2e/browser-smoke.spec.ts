import { test, expect } from "@playwright/test";

test("carrega a jornada principal sem overflow horizontal", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Interfaces claras.*Produtos que você pode usar/i,
    }),
  ).toBeVisible();

  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", await page.locator("html").evaluate((el) => el.clientWidth));

  const projects = page.getByRole("link", { name: /ver projetos/i });
  await expect(projects).toHaveAttribute("href", "#projetos");
});

test("rota pública de privacidade permanece navegável", async ({ page }) => {
  await page.goto("/privacidade");
  await expect(page.getByRole("heading", { name: /privacidade/i })).toBeVisible();
});


test("continua navegável quando o navegador bloqueia storage", async ({ page }) => {
  await page.addInitScript(() => {
    const blockedStorage = {
      configurable: true,
      get() {
        throw new Error("Storage access blocked");
      },
    };
    Object.defineProperty(window, "localStorage", blockedStorage);
    Object.defineProperty(window, "sessionStorage", blockedStorage);
  });

  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Interfaces claras.*Produtos que você pode usar/i,
    }),
  ).toBeVisible();

  await page.locator('[data-experience-hub-placeholder="true"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-experience-hub="true"]')).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("carrega seções lazy sem erros de página", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");

  for (const selector of [
    '[data-experience-hub-placeholder="true"]',
    '[data-profile-sections-anchor="true"]',
    '[data-static-sections-anchor="true"]',
    "#projetos",
    '[data-contact-anchor="true"]',
    '[data-footer-anchor="true"]',
  ]) {
    const target = page.locator(selector);
    if (await target.count()) {
      await target.scrollIntoViewIfNeeded();
    }
  }

  await expect(page.locator("#projetos")).toBeVisible();
  await expect(page.locator("#contato")).toBeVisible();
  expect(pageErrors).toEqual([]);
});
