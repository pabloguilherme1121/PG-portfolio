import { expect, test } from "@playwright/test";

test("menu altera objetivo, sincroniza o hub e preserva a escolha ao recarregar", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  const hub = page.locator('[data-experience-hub="true"]');
  await page.locator('[data-experience-hub-anchor="true"]').scrollIntoViewIfNeeded();
  await expect(hub).toBeVisible();
  await page.locator('[data-mobile-menu-toggle="true"]').click();
  const menu = page.getByRole("dialog", { name: "Menu de navegação móvel" });
  await menu.getByRole("button", { name: "Recrutador", exact: true }).click();
  await expect(menu.getByRole("button", { name: "Recrutador", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(menu.locator('[data-mobile-menu-primary="true"]')).toHaveAttribute("href", "#perfil-profissional");
  await page.keyboard.press("Escape");
  await expect(hub.locator('[data-experience-panel="recruiter"]')).toBeVisible();
  await page.reload();
  await page.locator('[data-mobile-menu-toggle="true"]').click();
  await expect(menu.getByRole("button", { name: "Recrutador", exact: true })).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("menu troca objetivo mesmo quando o armazenamento é bloqueado", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
  });
  await page.goto("/");
  await page.locator('[data-mobile-menu-toggle="true"]').click();
  const menu = page.getByRole("dialog", { name: "Menu de navegação móvel" });
  await menu.getByRole("button", { name: "Explorar", exact: true }).click();
  await expect(menu.getByRole("button", { name: "Explorar", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(menu.locator('[data-mobile-menu-primary="true"]')).toHaveAttribute("href", "#projetos");
  await page.keyboard.press("Escape");
  await page.locator('[data-experience-hub-anchor="true"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-experience-panel="explorer"]')).toBeVisible();
});
