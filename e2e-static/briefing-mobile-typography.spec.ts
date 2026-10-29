import { test, expect } from "@playwright/test";

for (const width of [320, 390]) {
  test(`briefing mantém etiquetas legíveis e funcionalidade em ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./?consultation=1#contato");
    const section = page.locator("#contato");
    await expect(section).toBeVisible();
    await section.getByRole("button", { name: /briefing opcional/i }).click();
    const form = section.locator('[data-briefing-form="true"]');
    await expect(form).toBeVisible();

    const labels = form.locator(
      '[data-briefing-header] p, [data-briefing-header] ol li span, ' +
      '[data-briefing-header] ol li p, ' +
      '[data-briefing-step="contact"] label span',
    );
    for (const label of await labels.all()) {
      if (!(await label.isVisible())) continue;
      const px = await label.evaluate(element => parseFloat(getComputedStyle(element).fontSize));
      expect(px).toBeGreaterThanOrEqual(12);
    }
    const first = form.locator('[data-briefing-step="contact"]');
    await first.locator('input[name="name"]').fill("Visitante de teste");
    await first.locator('input[name="email"]').fill("teste@example.com");
    await form.getByRole("button", { name: "Continuar para Direção" }).click();
    await expect(form.locator('[data-briefing-step="direction"]')).toBeVisible();
    const directionLabels = form.locator('[data-briefing-step="direction"] label span');
    for (const label of await directionLabels.all()) {
      expect(await label.evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(12);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.reload();
    await expect(section.getByRole("button", { name: /briefing opcional/i })).toBeVisible();
  });
}
