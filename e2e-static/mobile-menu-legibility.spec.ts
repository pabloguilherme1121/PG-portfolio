import { test, expect } from "@playwright/test";

/** The menu is a primary hiring/contact path. Avoid 10px microcopy on phones. */
for (const width of [320, 390]) {
  test(`menu mobile mantém textos legíveis, atalhos acionáveis e sem overflow em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");
    await page.locator('[data-mobile-menu-toggle="true"]').click();

    const menu = page.locator("#mobile-navigation");
    await expect(menu).toBeVisible();
    for (const selector of [
      '[aria-label="Seções do portfólio"] a',
      '[data-mobile-menu-primary="true"]',
      '[data-mobile-shortcut-contextual="true"]',
      '[data-mobile-shortcuts="true"] a',
      '[data-mobile-appearance-action="true"]',
      '[data-mobile-share-action="true"]',
    ]) {
      const items = menu.locator(selector);
      expect(await items.count(), `seletor ${selector}`).toBeGreaterThan(0);
      for (const item of await items.all()) {
        await expect(item).toBeVisible();
        const metrics = await item.evaluate((element) => {
          const css = getComputedStyle(element);
          const box = element.getBoundingClientRect();
          return { fontSize: parseFloat(css.fontSize), width: box.width, height: box.height };
        });
        expect(metrics.fontSize, `microtipografia em ${selector}`).toBeGreaterThanOrEqual(12);
        expect(metrics.height, `alvo de toque em ${selector}`).toBeGreaterThanOrEqual(44);
      }
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const primary = menu.locator('[data-mobile-menu-primary="true"]');
    const text = primary.locator("span").last();
    expect(await text.evaluate(element => {
      const style = getComputedStyle(element);
      return style.whiteSpace !== "nowrap" && element.scrollWidth <= element.clientWidth + 2;
    })).toBe(true);
    await menu.locator('[aria-label="Seções do portfólio"] a[href="#projetos"]').click();
    await expect(menu).not.toBeVisible();
    await expect(page).toHaveURL(/#projetos$/);
  });
}

for (const width of [320, 390]) {
  test(`indicador da seção, progresso e marca continuam legíveis no cabeçalho em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");
    for (const selector of [
      '[data-mobile-current-section="true"]',
      '[data-mobile-progress-value="true"]',
      'header a[aria-label="Ir ao início"] > span:last-child',
    ]) {
      const item = page.locator(selector);
      await expect(item).toBeVisible();
      const fontSize = await item.evaluate(element => parseFloat(getComputedStyle(element).fontSize));
      expect(fontSize, selector).toBeGreaterThanOrEqual(10);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("rodapé mantém rótulos de contato legíveis no celular", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("./");
  await page.locator('[data-footer-anchor="true"]').scrollIntoViewIfNeeded();
  const footer = page.locator("#contato-rodape");
  await expect(footer).toBeVisible();
  for (const label of ["contato direto", "links profissionais"]) {
    const element = footer.getByText(label, { exact: true });
    const fontSize = await element.evaluate(node => parseFloat(getComputedStyle(node).fontSize));
    expect(fontSize, label).toBeGreaterThanOrEqual(11);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
