import { expect, test } from '@playwright/test';

for (const app of ['sprint', 'budget']) {
  test(`PG ${app} permite pular a navegação pelo teclado`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const response = await page.goto(`lab/${app}/`);
    expect(response?.status()).toBe(200);

    const skip = page.getByRole('link', { name: 'Ir para o conteúdo principal' });
    await expect(skip).toHaveAttribute('href', '#main-content');
    await page.keyboard.press('Tab');
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#main-content$/);
    await expect(page.locator('main#main-content')).toBeFocused();
    expect(await page.evaluate(
      () => document.documentElement.scrollWidth - innerWidth
    )).toBeLessThanOrEqual(1);
  });
}
