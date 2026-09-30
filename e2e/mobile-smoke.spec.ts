import { test, expect } from "@playwright/test";

test("menu mobile abre, recebe foco e expõe atalhos principais", async ({ page }) => {
  await page.goto("/");

  const menuToggle = page.locator('[data-mobile-menu-toggle="true"]');
  await expect(menuToggle).toBeVisible();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");

  await menuToggle.click();

  const navigation = page.getByRole("navigation", { name: "Navegação móvel" });
  await expect(navigation).toBeVisible();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await expect(navigation.locator('[data-mobile-menu-primary="true"]')).toBeVisible();
  await expect(navigation.locator('[data-mobile-shortcuts="true"]')).toBeVisible();
});

test("hero mobile mantém CTA principal e provas rápidas utilizáveis", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('[data-mobile-hero-proof-rail="true"]')).toBeVisible();
  await expect(page.locator('[data-mobile-hero-proof="true"]')).toHaveCount(3);

  const diagnostic = page.getByRole("link", { name: /começar diagnóstico/i });
  await expect(diagnostic).toBeVisible();
  await expect(diagnostic).toHaveAttribute("href", "#diagnostico");
});
