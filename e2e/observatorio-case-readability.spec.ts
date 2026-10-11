import { test, expect, type Locator } from "@playwright/test";

test.use({ baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000" });

async function expectReadable(locator: Locator) {
  await expect(locator).toBeVisible();
  const size = await locator.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).fontSize),
  );
  expect(size).toBeGreaterThanOrEqual(12);
}

test("case Observatório mantém CTAs, filtros e orientações legíveis em 320/390px", async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/#projetos");
    const caseRoot = page.locator("#observatorio");
    await expect(caseRoot).toBeVisible();
    await caseRoot.scrollIntoViewIfNeeded();

    await expectReadable(caseRoot.getByText("case principal · produto em produção", { exact: true }));
    await expectReadable(caseRoot.getByRole("group", { name: "Etapas do case" }).getByRole("button", { name: "Solução" }));
    await expectReadable(caseRoot.getByText("React", { exact: true }));
    await expectReadable(caseRoot.getByRole("group", { name: "Formato da captura do Observatório" }).getByRole("button", { name: "Mobile" }));
    await expectReadable(caseRoot.getByRole("link", { name: /ver produto em produção/i }));
    await expectReadable(caseRoot.getByRole("link", { name: /ver código-fonte/i }));
    await expectReadable(caseRoot.locator("figcaption"));
    await expectReadable(page.locator('[data-featured-swipe-hint="true"]'));

    await caseRoot.getByRole("group", { name: "Etapas do case" }).getByRole("button", { name: "Solução" }).click();
    await expect(caseRoot.locator('[data-observatorio-insight="true"]')).toContainText("leitura rápida");
    await expect.poll(() => page.evaluate(() =>
      document.documentElement.scrollWidth <= window.innerWidth,
    )).toBeTruthy();
  }
});
