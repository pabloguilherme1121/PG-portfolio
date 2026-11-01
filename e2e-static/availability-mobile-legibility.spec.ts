import { expect, test } from "@playwright/test";

// Regression for the calendar's 8–11px microtype on small Android/iOS viewports.
for (const width of [320, 390]) {
  test(`consulta de agenda preserva textos legíveis e ações em ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./#agenda");

    const agenda = page.locator("#agenda");
    await expect(agenda).toBeVisible();
    await expect(agenda.getByRole("button", { name: "Ir para projetos" })).toBeVisible();
    await expect(agenda.locator('[data-availability-date="true"]').first()).toBeVisible();
    await expect(agenda.getByRole("button", { name: "08:00" })).toBeVisible();

    // Check visible textual labels and real buttons, including the dates
    // and weekday labels. Icon-only buttons are skipped.
    const textNodes = agenda.locator("p, button, .grid-cols-7 > span");
    for (const element of await textNodes.all()) {
      if (!(await element.isVisible())) continue;
      const text = (await element.textContent())?.trim();
      if (!text) continue;
      const fontSize = await element.evaluate(node => parseFloat(getComputedStyle(node).fontSize));
      expect(fontSize, `texto ${JSON.stringify(text)} em ${width}px`).toBeGreaterThanOrEqual(12);
    }

    const dates = agenda.locator('[data-availability-date="true"]');
    for (const date of await dates.all()) {
      const bounds = await date.boundingBox();
      expect(bounds, "data deve continuar renderizada").not.toBeNull();
      expect(bounds!.height, "data deve manter alvo touch de 44px").toBeGreaterThanOrEqual(44);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
