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


test("PG Arcade mobile expõe cinco jogos, preserva modos e permite zerar progresso", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  await expect(page.locator("#pg-lab")).toHaveCSS("content-visibility", "visible");
  const openArcade = page.getByRole("button", { name: /jogar no pg arcade/i });
  await openArcade.tap();

  await expect(page.locator('[data-arcade-open-control="true"]')).toHaveAttribute("aria-expanded", "true");
  const arcade = page.locator('[data-arcade-hub="true"]');
  const loadingOrArcade = page.locator('[data-arcade-loading="true"], [data-arcade-hub="true"]');
  await expect(loadingOrArcade).toBeVisible({ timeout: 15_000 });
  await expect(arcade).toBeVisible({ timeout: 15_000 });
  await expect(arcade.getByRole("tab")).toHaveCount(5);

  await arcade.getByRole("tab", { name: /dominó/i }).click();
  const domino = arcade.locator('[data-domino-game="true"]');
  await expect(domino).toBeVisible();
  await domino.getByRole("button", { name: /1 × 1 local/i }).click();
  await expect(domino.locator('[data-domino-mode="local"]')).toHaveAttribute("aria-pressed", "true");

  const checkersTab = arcade.getByRole("tab", { name: /damas/i });
  await checkersTab.click();
  await expect(checkersTab).toHaveAttribute("aria-selected", "true");
  const checkers = arcade.locator('[data-checkers-game="true"]');
  await expect(checkers.locator('[data-checkers-board="true"]')).toBeVisible({ timeout: 15_000 });
  await checkers.getByRole("button", { name: /1 × 1 local/i }).click();
  await expect(checkers.locator('[data-checkers-mode="local"]')).toHaveAttribute("aria-pressed", "true");

  await arcade.getByRole("tab", { name: /jogo da velha/i }).click();
  await expect(checkers).not.toBeVisible();
  await checkersTab.click();
  await expect(checkers.locator('[data-checkers-board="true"]')).toBeVisible();
  await expect(checkers.locator('[data-checkers-mode="local"]')).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await arcade.getByRole("tab", { name: /xadrez/i }).click();
  const chess = arcade.locator('[data-chess-game="true"]');
  await expect(chess.locator('[data-chess-board="true"]')).toBeVisible();
  await expect(chess.locator('[data-chess-cell="true"]')).toHaveCount(64);
  await chess.getByRole("button", { name: /1 × 1 local/i }).click();
  await expect(chess.locator('[data-chess-mode="local"]')).toHaveAttribute("aria-pressed", "true");

  await checkersTab.click();

  const resetProgress = arcade.locator('[data-arcade-reset-progress="true"]');
  await expect(resetProgress).toBeVisible();
  await resetProgress.click();
  await expect(arcade.locator('[data-arcade-exploration="true"]')).toContainText("1 de 5 jogos explorados");
  await expect(arcade.getByRole("tab", { name: /damas/i })).toHaveAttribute(
    "data-arcade-game-visits",
    "0",
  );
});


test("runtime mobile usa resgate v10 sem service worker persistente", async ({ page }) => {
  await page.goto("/");

  const rescue = await page.evaluate(() => {
    const runtime = (window as Window & {
      __pgRuntimeRescue?: { version?: string; mode?: string };
    }).__pgRuntimeRescue;
    return { version: runtime?.version, mode: runtime?.mode };
  });

  expect(rescue).toEqual({ version: "v10", mode: "network-only" });
  await expect(page.getByText("ERRO 500", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Tentar novamente", { exact: true })).toHaveCount(0);
});
