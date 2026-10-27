import { expect, test } from "@playwright/test";

test("PG Tech oferece cinco ferramentas reais com navegação e tipografia móvel", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const response = await page.goto("lab/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("PG Tech | Sites, apps e ferramentas digitais");
  await expect(page.locator("h1")).toContainText("Ferramentas feitas");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://pgtech-pi.vercel.app/",
  );

  for (const host of [
    "pg-shotlist-lab.vercel.app",
    "pg-qa-lab.vercel.app",
    "pg-creator-kit.vercel.app",
    "pg-sprint-lab.vercel.app",
    "pg-budget-lab.vercel.app",
  ]) {
    const link = page.locator(`a[href="https://${host}/"]`);
    await expect(link, host).toHaveCount(1);
    await expect(link).toBeVisible();
  }
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      `Overflow horizontal em ${width}px`,
    ).toBeLessThanOrEqual(1);
    await expect(page.locator("h1")).toBeVisible();
    // Links de projetos precisam ser tocáveis sem zoom e sem arrastar a tela.
    const cards = page.locator("#apps .project-body > a, #ferramentas .project-body > a");
    await expect(cards).toHaveCount(9);
    for (const anchor of await cards.all()) {
      const bounds = await anchor.boundingBox();
      expect(bounds, "O link deve ter área de clique").not.toBeNull();
      expect(bounds!.height, `Alvo de toque mínimo a ${width}px`).toBeGreaterThanOrEqual(44);
    }
  }
  expect(errors).toEqual([]);
});
