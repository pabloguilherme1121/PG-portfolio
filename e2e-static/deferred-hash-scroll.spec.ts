import { expect, test } from "@playwright/test";

const cases = [
  { width: 1280, height: 900, href: "#sobre", label: "Perfil" },
  { width: 1280, height: 900, href: "#servicos", label: "Serviços" },
  { width: 320, height: 740, href: "#contato", label: "Conversar sobre um projeto" },
  { width: 320, height: 740, href: "#curriculo-web", label: "Ver currículo" },
] as const;

for (const { width, height, href, label } of cases) {
  test(`âncora ${href} chega ao conteúdo visível após carregamento sob demanda em ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height });
    await page.goto("./");
    if (width >= 768) {
      await page.locator(`header a[href="${href}"]`).first().click();
    } else {
      await page.getByRole("link", { name: label, exact: true }).first().click();
    }
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    const destination = page.locator(href);
    await expect(destination).toBeVisible();
    // Visibility alone is insufficient: before the fix the destination could be
    // thousands of pixels below the viewport after lazy sections were inserted.
    await expect.poll(async () => destination.evaluate(node => {
      const box = node.getBoundingClientRect();
      return box.top >= -16 && box.top <= 160 && box.bottom > 60;
    })).toBe(true);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("acesso direto a #servicos após reload mantém a seção na tela", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./#servicos");
  const destination = page.locator("#servicos");
  await expect(destination).toBeVisible();
  await expect.poll(async () => destination.evaluate(node => {
    const box = node.getBoundingClientRect();
    return box.top >= -16 && box.top <= 160 && box.bottom > 60;
  })).toBe(true);
});
