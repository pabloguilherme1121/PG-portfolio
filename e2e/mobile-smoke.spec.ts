import { test, expect } from "@playwright/test";

test("menu mobile abre, recebe foco e expõe atalhos principais", async ({ page }) => {
  await page.goto("/");

  const menuToggle = page.locator('[data-mobile-menu-toggle="true"]');
  await expect(menuToggle).toBeVisible();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "false");

  await menuToggle.click();

  const navigation = page.getByRole("dialog", { name: "Menu de navegação móvel" });
  await expect(navigation).toBeVisible();
  await expect(menuToggle).toHaveAttribute("aria-expanded", "true");
  await expect(navigation.locator('[data-mobile-menu-primary="true"]')).toBeVisible();
  await expect(navigation.locator('[data-mobile-shortcuts="true"]')).toBeVisible();
});

test("hero mobile mantém CTA principal e provas rápidas utilizáveis", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('[data-mobile-hero-proof-rail="true"]')).toBeVisible();
  await expect(page.locator('[data-mobile-hero-proof="true"]')).toHaveCount(3);

  const diagnostic = page.locator('[data-hero-cta="true"]').getByRole("link", { name: /começar diagnóstico/i });
  await expect(diagnostic).toBeVisible();
  await expect(diagnostic).toHaveAttribute("href", "#diagnostico");
});


test("PG Arcade mobile expõe três jogos e modos locais", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /jogar no pg arcade/i }).click();

  const arcade = page.locator('[data-arcade-hub="true"]');
  await expect(arcade).toBeVisible();
  await expect(arcade.getByRole("tab")).toHaveCount(3);

  await arcade.getByRole("tab", { name: /dominó/i }).click();
  const domino = arcade.locator('[data-domino-game="true"]');
  await expect(domino).toBeVisible();
  await domino.getByRole("button", { name: /1 × 1 local/i }).click();
  await expect(domino.locator('[data-domino-mode="local"]')).toHaveAttribute("aria-pressed", "true");

  await arcade.getByRole("tab", { name: /damas/i }).click();
  const checkers = arcade.locator('[data-checkers-game="true"]');
  await expect(checkers.locator('[data-checkers-board="true"]')).toBeVisible();
  await checkers.getByRole("button", { name: /1 × 1 local/i }).click();
  await expect(checkers.locator('[data-checkers-mode="local"]')).toHaveAttribute("aria-pressed", "true");
});
