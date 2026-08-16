import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test.use({ baseURL });

test.describe("navegação pública e favoritos", () => {
  test("percorre as âncoras públicas e mantém a galeria acessível", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
    await page.getByRole("link", { name: /galeria pública/i }).click();
    await expect(page.locator("#galeria-publica")).toBeVisible();
    await page.getByRole("link", { name: /meus favoritos/i }).click();
    await expect(page.locator("#favoritos-pessoais")).toBeVisible();
  });

  test("aplica um filtro por tag na galeria pública", async ({ page }) => {
    await page.goto("/#galeria-publica");
    const tagFilter = page.locator('[data-filter-scope="tag"]').filter({ hasText: "Drone" }).first();
    await expect(tagFilter).toBeVisible();
    await tagFilter.click();
    await expect(tagFilter).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-project-id]').first()).toBeVisible();
  });

  test("mantém a rota de favoritos fora da vitrine pública", async ({ page }) => {
    await page.goto("/favoritos");
    await expect(page).toHaveURL(/\/favoritos$/);
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("h1").first()).toContainText(/Gestão de favoritos reservada|Favoritos organizados|Sign in to continue/);
    await expect(page.locator("#projetos")).toHaveCount(0);
  });
});
