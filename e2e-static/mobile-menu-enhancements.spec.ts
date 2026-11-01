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

for (const href of ["#inicio", "#projetos", "#sobre", "#servicos", "#contato"]) {
  test(`navegação móvel por teclado mantém destino ${href} acessível após fechar menu`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("./");
    await page.locator('[data-mobile-menu-toggle="true"]').click();
    const link = page.locator('#mobile-navigation [aria-label="Seções do portfólio"] a[href="' + href + '"]');
    await expect(link).toBeVisible();
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("#mobile-navigation")).toBeHidden();
    await expect(page).toHaveURL(new RegExp(href + "$"));
    await expect.poll(() => page.evaluate((hash) => {
      const target = document.getElementById(hash.slice(1));
      return Boolean(target && (document.activeElement === target || target.contains(document.activeElement)));
    }, href)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
