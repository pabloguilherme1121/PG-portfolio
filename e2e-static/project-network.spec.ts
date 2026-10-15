import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const [width, theme] of [
  [320, "dark"],
  [390, "light"],
  [1280, "dark"],
] as const) {
  test(`project network is readable and linked at ${width}px in ${theme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 844 });
    await page.addInitScript(
      value => localStorage.setItem("theme-preference", value),
      theme
    );
    await page.goto("./#rede-projetos");
    const network = page.getByRole("region", {
      name: "Escolha o que você quer explorar.",
    });
    await expect(network).toBeInViewport();
    const expected = [
      [
        "observatorio",
        "https://pabloguilherme01.github.io/observatorio/#dashboard",
        "Produto publicado",
      ],
      [
        "eleicoes-goias",
        "https://pabloguilherme1121.github.io/eleicoes-goias-2026/",
        "Produto publicado",
      ],
      [
        "pg-arcade",
        "https://pabloguilherme1121.github.io/PG-Arcade/#/",
        "Produto publicado",
      ],
      [
        "trajeto",
        "https://github.com/Pabloguilherme01/trajeto-web",
        "Em evolução",
      ],
      [
        "eliane-fashion",
        "https://github.com/pabloguilherme1121/elianefashion-netlify-template",
        "Template",
      ],
    ];
    await expect(network.getByRole("listitem")).toHaveCount(5);
    for (const [id, href, status] of expected) {
      const card = network.locator(`[data-network-project="${id}"]`);
      await expect(card).toContainText(status);
      const link = card.getByRole("link").first();
      await expect(link).toHaveAttribute("href", href);
      await link.scrollIntoViewIfNeeded();
      await link.focus();
      await expect(link).toBeFocused();
      expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    expect(
      (await new AxeBuilder({ page }).include("#rede-projetos").analyze())
        .violations
    ).toEqual([]);
    await page.reload();
    await expect(network).toBeInViewport();
  });
}
