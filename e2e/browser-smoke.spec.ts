import { test, expect } from "@playwright/test";

test("carrega a jornada principal sem overflow horizontal", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Desenvolvo produtos digitais que tornam informação complexa simples de usar/i,
    }),
  ).toBeVisible();

  await expect(page.locator("html")).toHaveJSProperty("scrollWidth", await page.locator("html").evaluate((el) => el.clientWidth));

  const projects = page.getByRole("link", { name: /ver projetos selecionados/i });
  await expect(projects).toHaveAttribute("href", "#projetos");
});

test("rota pública de privacidade permanece navegável", async ({ page }) => {
  await page.goto("/privacidade");
  await expect(page.getByRole("heading", { name: /privacidade/i })).toBeVisible();
});
