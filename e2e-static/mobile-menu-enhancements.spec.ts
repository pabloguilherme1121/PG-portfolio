import { expect, test } from "@playwright/test";

test("atalho contextual do menu permite quebra de linha em 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("./");
  await page.locator('[data-mobile-menu-toggle="true"]').click();
  const shortcut = page.locator('[data-mobile-shortcut-contextual="true"] span');
  await expect(shortcut).toBeVisible();
  const styles = await shortcut.evaluate(element => ({
    whiteSpace: getComputedStyle(element).whiteSpace,
    textOverflow: getComputedStyle(element).textOverflow,
  }));
  expect(styles.whiteSpace).toBe("normal");
  expect(styles.textOverflow).not.toBe("ellipsis");
});

test("menu anuncia resultado do compartilhamento para leitores de tela", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: async () => undefined,
    });
  });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("./");
  await page.locator('[data-mobile-menu-toggle="true"]').click();
  const feedback = page.locator('[data-mobile-share-feedback="true"]');
  await expect(feedback).toHaveAttribute("aria-live", "polite");
  await expect(feedback).toBeEmpty();
  await page.locator('[data-mobile-share-action="true"]').click();
  await expect(feedback).toHaveText("Portfólio compartilhado.");
});

test("menu informa cópia do link quando compartilhamento nativo está indisponível", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator.clipboard, "writeText", { configurable: true, value: async () => undefined });
  });
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("./");
  await page.locator('[data-mobile-menu-toggle="true"]').click();
  await page.locator('[data-mobile-share-action="true"]').click();
  await expect(page.locator('[data-mobile-share-feedback="true"]')).toHaveText("Link do portfólio copiado.");
});

test("navegação móvel por teclado mantém destino acessível após fechar menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.locator('[data-mobile-menu-toggle="true"]').click();
  const link = page.locator('#mobile-navigation a[href="#sobre"]');
  await link.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#mobile-navigation")).toBeHidden();
  await expect(page).toHaveURL(/#sobre$/);
  await expect.poll(() => page.evaluate(() => {
    const active = document.activeElement;
    return Boolean(active && (active.id === "sobre" || active.closest("#sobre")));
  })).toBe(true);
});
