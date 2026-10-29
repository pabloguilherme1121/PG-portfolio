import { expect, test } from "@playwright/test";

for (const width of [320, 390]) {
  test(`diagnóstico mantém opções e estágios legíveis em ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./#diagnostico");
    const section = page.locator('[data-project-diagnostic="true"]');
    await expect(section).toBeVisible();

    const stages = section.getByRole("group", { name: "Escolha o estágio atual do projeto" }).getByRole("button");
    await expect(stages).toHaveCount(3);
    for (const button of await stages.all()) {
      const metrics = await button.evaluate(node => ({
        font: parseFloat(getComputedStyle(node).fontSize),
        height: node.getBoundingClientRect().height,
        scrollWidth: node.scrollWidth,
        width: node.clientWidth,
      }));
      expect(metrics.font).toBeGreaterThanOrEqual(12);
      expect(metrics.height).toBeGreaterThanOrEqual(44);
      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.width + 2);
    }
    const stage = stages.getByText("Já existe e precisa evoluir");
    await stage.click();
    await expect(stage).toHaveAttribute("aria-pressed", "true");

    for (const selector of [
      'p',
      '[role="group"]',
    ]) {
      const tiny = await section.locator(selector).evaluateAll(nodes =>
        nodes.filter(node => node.getBoundingClientRect().width > 0 &&
          getComputedStyle(node).visibility !== "hidden" &&
          parseFloat(getComputedStyle(node).fontSize) < 11).length
      );
      expect(tiny, `texto pequeno em ${selector}`).toBe(0);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test(`ações e metadados dos detalhes de projeto são legíveis em ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./#trajeto");
    const project = page.locator('[data-featured-project="TEC.09"]');
    await project.getByRole("button", { name: /ver detalhes de trajeto/i }).click();
    const dialog = page.locator('[data-project-details-dialog="true"]');
    await expect(dialog).toBeVisible();

    const actions = dialog.locator(
      '[data-project-modal-favorite="true"], [data-project-modal-share="true"], [data-project-modal-copy-link="true"], [data-project-modal-previous="true"], [data-project-modal-next="true"]'
    );
    await expect(actions).toHaveCount(5);
    for (const button of await actions.all()) {
      const size = await button.evaluate(node => ({
        font: parseFloat(getComputedStyle(node).fontSize),
        height: node.getBoundingClientRect().height,
      }));
      expect(size.font).toBeGreaterThanOrEqual(12);
      expect(size.height).toBeGreaterThanOrEqual(44);
    }
    for (const label of ["papel", "processo", "resultado"]) {
      const item = dialog.getByText(label, { exact: true }).first();
      await expect(item).toBeVisible();
      expect(await item.evaluate(node => parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThanOrEqual(11);
    }
    expect(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth + 2)).toBe(true);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
