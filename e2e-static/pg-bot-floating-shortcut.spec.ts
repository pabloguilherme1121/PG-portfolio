import { expect, test } from "@playwright/test";

for (const width of [320, 390]) {
  test(`PG Bot possui atalho móvel discreto e acessível em ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");

    const shortcut = page.locator('[data-pg-bot-floating="true"]');
    await expect(shortcut).toHaveCount(1);
    await expect(shortcut).toHaveAttribute("aria-hidden", "true");

    // Hero already offers PG Bot: do not duplicate a visible launcher there.
    await page.locator("#projetos").scrollIntoViewIfNeeded();
    await expect(shortcut).toHaveAttribute("aria-hidden", "false");
    await expect(shortcut).toBeVisible();
    expect(await shortcut.evaluate(node => node.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);

    await shortcut.click();
    const dialog = page.locator('[data-pg-bot-dialog="true"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: /PG Bot/ })).toBeVisible();
    await expect(shortcut).toHaveAttribute("aria-hidden", "true");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(shortcut).toBeFocused();

    await page.locator('[data-mobile-menu-toggle="true"]').click();
    await expect(page.locator("#mobile-navigation")).toBeVisible();
    await expect(shortcut).toHaveAttribute("aria-hidden", "true");
    await page.getByRole("button", { name: /Fechar menu/ }).click();
    await expect(shortcut).toHaveAttribute("aria-hidden", "false");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("não mostra lançador flutuante duplicado no desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("./");
  await page.locator("#projetos").scrollIntoViewIfNeeded();
  await expect(page.locator('[data-pg-bot-floating="true"]')).toBeHidden();
  await expect(page.locator('[data-pg-bot-header="true"]')).toBeVisible();
});
