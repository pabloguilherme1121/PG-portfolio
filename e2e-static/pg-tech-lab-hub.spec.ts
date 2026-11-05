import { expect, test } from "@playwright/test";

test("PG Tech oferece cinco ferramentas reais com navegação e tipografia móvel", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  const response = await page.goto("lab/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle("PG Tech | Sites, apps e ferramentas digitais");
  await expect(page.locator("h1")).toContainText("Ferramentas feitas");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://pgtech-pi.vercel.app/",
  );


  const demo = page.locator("#demonstracoes");
  await expect(demo.getByRole("heading", { name: "Seu negócio pode ter uma experiência assim." })).toBeVisible();
  await expect(demo.getByRole("link", { name: /Testar a demo da barbearia/ }))
    .toHaveAttribute("href", "https://pgtech-demo-barbearia-next.vercel.app/demo-barbearia");
  await expect(demo).toContainText("Não há agenda automática nem reserva confirmada");

  await expect(page.locator("#ferramentas .section-top p")).toContainText(
    "a restauração ainda está em validação",
  );

  for (const host of [
    "pg-shotlist-lab.vercel.app",
    "pg-qa-lab.vercel.app",
    "pg-creator-kit.vercel.app",
    "pg-sprint-lab.vercel.app",
    "pg-budget-lab.vercel.app",
  ]) {
    const link = page.locator(`a[href="https://${host}/"]`);
    await expect(link, host).toHaveCount(1);
    await expect(link).toBeVisible();
  }
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 800 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      `Overflow horizontal em ${width}px`,
    ).toBeLessThanOrEqual(1);
    await expect(page.locator("h1")).toBeVisible();
    if (width <= 390) {
      // Mobile labels, section markers and navigation must remain readable without zoom.
      for (const selector of ["header nav a", ".mini", ".micro"]) {
        const sizes = await page.locator(selector).evaluateAll(elements =>
          elements.map(element => parseFloat(getComputedStyle(element).fontSize)),
        );
        expect(sizes.length, `Missing elements for ${selector}`).toBeGreaterThan(0);
        expect(Math.min(...sizes), `${selector} must be at least 14px at ${width}px`)
          .toBeGreaterThanOrEqual(14);
      }
      const projectLabelSizes = await page.locator(".preview small").evaluateAll(elements =>
        elements.map(element => parseFloat(getComputedStyle(element).fontSize)),
      );
      expect(projectLabelSizes.length).toBeGreaterThan(0);
      expect(Math.min(...projectLabelSizes), `Project preview labels at ${width}px`)
        .toBeGreaterThanOrEqual(13);
    }


    const demoActions = page.locator("#demonstracoes .commercial-actions a");
    await expect(demoActions).toHaveCount(2);
    for (const action of await demoActions.all()) {
      const box = await action.boundingBox();
      expect(box, "Commercial action must have a visible hit target").not.toBeNull();
      expect(box!.height, "Commercial action hit target must be at least 44px")
        .toBeGreaterThanOrEqual(44);
    }

    // Links de projetos precisam ser tocáveis sem zoom e sem arrastar a tela.
    const cards = page.locator("#apps .project-body > a, #ferramentas .project-body > a");
    await expect(cards).toHaveCount(9);
    for (const anchor of await cards.all()) {
      const bounds = await anchor.boundingBox();
      expect(bounds, "O link deve ter área de clique").not.toBeNull();
      expect(bounds!.height, `Alvo de toque mínimo a ${width}px`).toBeGreaterThanOrEqual(44);
    }
  }
  expect(errors).toEqual([]);
});
