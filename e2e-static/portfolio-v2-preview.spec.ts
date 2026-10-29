import { expect, test } from "@playwright/test";

for (const width of [320, 390, 1280]) {
  test(`prévia v2 abre de verdade e mantém CTAs acessíveis em ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 844 });
    const response = await page.goto("./v2/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    await expect(page.getByRole("heading", { level: 1, name: /Produtos digitais que saem do papel/i })).toBeVisible();
    const navigation = page.getByRole("navigation", { name: "Navegação da prévia" });
    await expect(navigation.getByRole("link", { name: "Projetos" })).toHaveAttribute("href", "#projetos");
    await expect(page.getByRole("link", { name: "Ver projetos" })).toHaveAttribute("href", "#projetos");
    await expect(page.getByRole("link", { name: "Preparar briefing" })).toHaveAttribute("href", "../#contato-briefing");
    await expect(page.getByRole("link", { name: "Ver currículo" })).toHaveAttribute("href", "../#curriculo-web");
    await expect(page.getByRole("link", { name: "Abrir PG Arcade" })).toHaveAttribute("href", "https://pabloguilherme1121.github.io/PG-Arcade/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const link of [page.getByRole("link", { name: "Ver projetos" }), page.getByRole("link", { name: "Preparar briefing" }), navigation.getByRole("link", { name: "Projetos" })]) {
      const bounds = await link.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.height).toBeGreaterThanOrEqual(44);
    }
    await page.getByRole("link", { name: "Ver projetos" }).click();
    await expect(page).toHaveURL(/\/v2\/#projetos$/);
    await expect(page.getByRole("heading", { name: "Três projetos, três tipos de problema" })).toBeVisible();
  });
}

test("prévia v2 começa com skip link e não executa scripts nem coleta dados", async ({ page }) => {
  await page.goto("./v2/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Pular para o conteúdo" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/v2\/#conteudo$/);
  await expect(page.locator("script")).toHaveCount(0);
});
