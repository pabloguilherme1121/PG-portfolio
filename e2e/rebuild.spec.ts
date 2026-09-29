import { expect, test } from "@playwright/test";

test.describe("reconstrução profissional do portfólio", () => {
  test("primeira jornada conecta proposta, provas e projetos verificáveis", async ({ page }) => {
    await page.goto("/");

    const root = page.locator('[data-portfolio-shell-version="2"]');
    await expect(root).toBeVisible();

    const hero = page.locator("#inicio");
    await expect(hero.getByRole("heading", { level: 1 })).toContainText(/produtos digitais|interfaces|dados/i);
    await expect(hero.getByRole("link", { name: /começar diagnóstico/i })).toHaveAttribute("href", "#diagnostico");

    const trustBar = page.locator('[data-portfolio-trust-bar="true"]');
    await expect(trustBar).toBeVisible();
    await expect(trustBar.locator('[data-portfolio-proof="true"]')).toHaveCount(3);
    await expect(trustBar.getByRole("link", { name: /observatório/i })).toHaveAttribute(
      "href",
      "https://pabloguilherme01.github.io/observatorio/#dashboard",
    );
    await expect(trustBar.getByRole("link", { name: /trajeto/i })).toHaveAttribute(
      "href",
      "https://github.com/Pabloguilherme01/trajeto-web",
    );
  });

  test("reconstrução mantém a primeira dobra mobile legível e sem overflow horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.locator('[data-portfolio-shell-version="2"]')).toBeVisible();
    await expect(page.locator('[data-mobile-hero-proof-rail="true"]')).toBeVisible();
    await expect(page.locator('[data-portfolio-trust-bar="true"]')).toBeVisible();

    const overflow = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.viewport + 1);
  });
});
