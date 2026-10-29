import { expect, test } from "@playwright/test";

for (const width of [320, 390]) {
  test(`menu apresenta percurso linear com perfil acessível em ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");
    await page.locator('[data-mobile-menu-toggle="true"]').click();
    const menu = page.locator("#mobile-navigation");
    await expect(menu).toBeVisible();

    const navigation = menu.getByRole("group", { name: "Seções do portfólio" });
    const links = navigation.getByRole("link");
    await expect(links).toHaveCount(5);
    const expected = [
      ["01 / início", "#inicio"],
      ["02 / projetos", "#projetos"],
      ["03 / perfil", "#sobre"],
      ["04 / serviços", "#servicos"],
      ["05 / contato", "#contato"],
    ] as const;
    for (const [index, [label, href]] of expected.entries()) {
      const link = links.nth(index);
      await expect(link).toHaveText(label);
      await expect(link).toHaveAttribute("href", href);
      const rect = await link.boundingBox();
      expect(rect).not.toBeNull();
      expect(rect!.height).toBeGreaterThanOrEqual(44);
    }
    const contactBounds = await links.nth(4).boundingBox();
    const groupBounds = await navigation.boundingBox();
    expect(contactBounds).not.toBeNull();
    expect(groupBounds).not.toBeNull();
    // Final destination is clearly visible rather than a half-width orphan card.
    expect(contactBounds!.width).toBeGreaterThanOrEqual(groupBounds!.width - 2);
    await links.nth(2).click();
    await expect(menu).toBeHidden();
    await expect(page).toHaveURL(/#sobre$/);
    await expect(page.locator("#sobre")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}

test("navegação mobile e desktop compartilham os quatro destinos principais", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.locator('[data-mobile-menu-toggle="true"]').click();
  const mobile = await page.locator('#mobile-navigation [aria-label="Seções do portfólio"] a').evaluateAll(nodes =>
    nodes.map(node => node.getAttribute("href")).filter(href => href !== "#inicio")
  );
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole("navigation", { name: "Navegação principal" })).toBeVisible();
  const desktop = await page.getByRole("navigation", { name: "Navegação principal" }).locator('a[href^="#"]').evaluateAll(nodes =>
    nodes.map(node => node.getAttribute("href"))
  );
  expect(mobile).toEqual(desktop);
});
