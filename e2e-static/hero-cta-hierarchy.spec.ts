import { test, expect } from "@playwright/test";

/** A hiring-oriented hero keeps primary navigation and optional help distinct. */
for (const width of [320, 390, 1024]) {
  test(`hero mantém duas ações centrais e ajuda opcional sem cortar conteúdo em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");
    const hero = page.locator("#inicio");
    const primary = hero.locator('[data-hero-primary-actions="true"]');
    const optional = hero.locator('[data-hero-optional-actions="true"]');

    await expect(primary.getByRole("link")).toHaveCount(2);
    await expect(primary.getByRole("link", { name: "Ver projetos" })).toHaveAttribute("href", "#projetos");
    await expect(primary.getByRole("link", { name: "Conversar sobre um projeto" })).toHaveAttribute("href", "#contato");
    await expect(optional.getByRole("link", { name: "Ver currículo" })).toHaveAttribute("href", "#curriculo-web");

    const bot = optional.getByRole("button", { name: "Perguntar ao PG Bot" });
    await expect(bot).toBeVisible();
    for (const item of [primary.getByRole("link").first(), primary.getByRole("link").last(), optional.getByRole("link"), bot]) {
      const box = await item.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width + 1);
    }
    const first = await primary.boundingBox();
    const second = await optional.boundingBox();
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(second!.y).toBeGreaterThan(first!.y);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await bot.click();
    const dialog = page.locator('[data-pg-bot-dialog="true"]');
    await expect(dialog).toBeVisible();
    await dialog.getByRole("button", { name: "Fechar PG Bot" }).click();
    await expect(bot).toBeFocused();
  });
}
