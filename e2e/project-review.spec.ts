import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const theme of ["dark", "light"]) {
  test(`entrada do portfólio sem violações WCAG A/AA em ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(value => localStorage.setItem("theme-preference", value), theme);
    await page.goto("/");
    await expect(page.locator("#inicio h1")).toBeVisible();
    await page.locator("#observatorio").waitFor();
    if (theme === "light") {
      await expect(page.locator("#inicio")).toHaveCSS("background-color", "rgb(244, 248, 252)");
      for (const shade of await page.locator("#inicio .hero-shade").all()) await expect(shade).toBeHidden();
    }
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(result.violations).toEqual([]);
  });
}

test("retrato real mantém proporção no celular e desktop", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const portrait = page.locator(".professional-portrait img");
  await expect(portrait).toBeVisible();
  await expect.poll(() => portrait.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(1);
  await page.setViewportSize({ width: 1024, height: 900 });
  await expect(portrait).toBeVisible();
  await expect.poll(() => portrait.evaluate(img => (img as HTMLImageElement).currentSrc)).not.toMatch(/^data:/);
  await expect.poll(() => portrait.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(1);
});

test("compartilhar usa alternativa de cópia e preserva o foco", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: () => Promise.reject(new Error("blocked")) } });
    document.execCommand = (command: string) => {
      if (command !== "copy") return false;
      (window as unknown as { copiedText: string }).copiedText = document.querySelector<HTMLTextAreaElement>('textarea[readonly]')?.value ?? "";
      return true;
    };
  });
  await page.goto("/");
  await page.locator('[data-mobile-menu-toggle]').click();
  const share = page.locator('[data-mobile-share-action]');
  await share.click();
  await expect(share).toContainText("link copiado");
  await expect(share).toBeFocused();
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(await page.evaluate(() => (window as unknown as { copiedText: string }).copiedText)).toBe(canonical);
  await expect(page.locator('textarea[readonly]')).toHaveCount(0);
});
