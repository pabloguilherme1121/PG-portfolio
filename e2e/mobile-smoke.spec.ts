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


test("PG Arcade mobile aponta para a experiência dedicada sem carregar jogos locais", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
  const showcase = page.locator("#pg-lab");
  await showcase.scrollIntoViewIfNeeded();
  await expect(showcase).toBeVisible();
  await expect(showcase).toHaveAttribute("data-arcade-showcase", "true");

  const link = showcase.locator('[data-arcade-full-site="true"]');
  await expect(link).toHaveAttribute(
    "href",
    "https://pabloguilherme1121.github.io/PG-Arcade/",
  );
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator('[data-arcade-open-control="true"]')).toHaveCount(0);
  await expect(page.locator('[data-arcade-hub="true"]')).toHaveCount(0);
  await expect.poll(
    () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
  ).toBeTruthy();
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
