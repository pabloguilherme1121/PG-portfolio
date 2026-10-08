import { expect, test } from "@playwright/test";

test.describe("reconstrução profissional do portfólio", () => {


  test("home prioriza trabalho verificável sem repetir Proof Deck no Hero", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#inicio").getByRole("heading", { level: 1 })).toBeVisible();

    await expect(page.locator('[data-attention-hook="proof-deck"]')).toHaveCount(0);

    const order = await page.evaluate(() => {
      const projects = document.querySelector("#projetos");
      const experience = document.querySelector('[data-experience-hub-anchor="true"]');
      const arcade = document.querySelector("#pg-lab");
      if (!projects || !experience || !arcade) return null;

      return {
        projectsBeforeExperience: Boolean(projects.compareDocumentPosition(experience) & Node.DOCUMENT_POSITION_FOLLOWING),
        projectsBeforeArcade: Boolean(projects.compareDocumentPosition(arcade) & Node.DOCUMENT_POSITION_FOLLOWING),
      };
    });

    expect(order).toEqual({
      projectsBeforeExperience: true,
      projectsBeforeArcade: true,
    });
  });

  test("descrições das provas permanecem legíveis em telas estreitas", async ({ page }) => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/");
      await page.locator("#projetos").scrollIntoViewIfNeeded();
      const descriptions = page.locator("#observatorio > div > p.font-body");
      await expect(descriptions).toHaveCount(1);
      const sizes = await descriptions.evaluateAll(nodes => nodes.map(node => parseFloat(getComputedStyle(node).fontSize)));
      expect(sizes.every(size => size >= 14)).toBe(true);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });



  test("Experience Hub carrega apenas quando se aproxima da viewport", async ({ page }) => {
    await page.goto("/");

    const placeholder = page.locator('[data-experience-hub-placeholder="true"]');
    await expect(placeholder).toHaveCount(1);
    await expect(page.locator('[data-experience-hub="true"]')).toHaveCount(0);

    await placeholder.scrollIntoViewIfNeeded();

    await expect(page.locator('[data-experience-hub="true"]')).toBeVisible();
    await expect(placeholder).toHaveCount(0);
  });

  test("Project Lens carrega apenas quando o diagnóstico se aproxima da viewport", async ({ page }) => {
    await page.goto("/");

    const placeholder = page.locator('[data-project-diagnostic-placeholder="true"]');
    await expect(placeholder).toHaveCount(1);
    await expect(page.locator('[data-project-diagnostic="true"]')).toHaveCount(0);

    await placeholder.scrollIntoViewIfNeeded();

    await expect(page.locator('[data-project-diagnostic="true"]')).toBeVisible();
    await expect(placeholder).toHaveCount(0);
  });

  test("Sobre e perfil profissional carregam apenas quando se aproximam da viewport", async ({ page }) => {
    await page.goto("/");

    const placeholder = page.locator('[data-profile-sections-placeholder="true"]');
    await expect(placeholder).toHaveCount(1);
    await expect(page.locator("#sobre")).toHaveCount(0);
    await expect(page.locator('[data-professional-snapshot="true"]')).toHaveCount(0);

    await placeholder.scrollIntoViewIfNeeded();

    await expect(page.locator("#sobre")).toBeVisible();
    await expect(page.locator('[data-professional-snapshot="true"]')).toBeVisible();
    await expect(placeholder).toHaveCount(0);
  });

  test("competências, serviços e processo carregam apenas quando se aproximam da viewport", async ({ page }) => {
    await page.goto("/");

    const deferred = page.locator('[data-static-sections-placeholder="true"]');
    await expect(deferred).toHaveCount(1);
    await expect(page.locator("#trilha")).toHaveCount(0);
    await expect(page.locator("#servicos")).toHaveCount(0);
    await expect(page.locator("#processo")).toHaveCount(0);

    await deferred.scrollIntoViewIfNeeded();

    await expect(page.locator("#trilha")).toBeVisible();
    await expect(page.locator("#servicos")).toBeVisible();
    await expect(page.locator("#processo")).toBeVisible();
    await expect(deferred).toHaveCount(0);
  });

  test("vitrine completa de projetos carrega apenas quando se aproxima da seção", async ({ page }) => {
    await page.goto("/");

    const projects = page.locator("#projetos");
    await expect(projects.locator('[data-projects-overview-placeholder="true"]')).toHaveCount(1);
    await expect(page.locator('[data-featured-project-strip="true"]')).toHaveCount(0);

    await projects.scrollIntoViewIfNeeded();

    await expect(page.locator('[data-featured-project-strip="true"]')).toBeVisible();
    await expect(projects.locator('[data-projects-overview-placeholder="true"]')).toHaveCount(0);
  });

  test("rodapé carrega apenas quando se aproxima do fim da página", async ({ page }) => {
    await page.goto("/");

    const placeholder = page.locator('[data-footer-placeholder="true"]');
    await expect(placeholder).toHaveCount(1);
    await expect(page.locator("#contato-rodape")).toHaveCount(0);

    await placeholder.scrollIntoViewIfNeeded();

    await expect(page.locator("#contato-rodape")).toBeVisible();
    await expect(placeholder).toHaveCount(0);
  });
});
