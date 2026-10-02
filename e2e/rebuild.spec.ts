import { expect, test } from "@playwright/test";

test.describe("reconstrução profissional do portfólio", () => {
  test("primeira jornada conecta proposta, provas e projetos verificáveis", async ({ page }) => {
    await page.goto("/");

    const root = page.locator('[data-portfolio-shell-version="2"]');
    await expect(root).toBeVisible();

    const hero = page.locator("#inicio");
    await expect(hero.getByRole("heading", { level: 1 })).toContainText(/produtos digitais|interfaces|dados/i);
    await expect(hero.getByRole("link", { name: /começar diagnóstico/i })).toHaveAttribute("href", "#diagnostico");

    const trustBar = page.locator('[data-portfolio-trust-bar="true"]');
    await expect(trustBar).toBeVisible();
    await expect(trustBar.locator('[data-portfolio-proof="true"]')).toHaveCount(3);
    await expect(trustBar.getByRole("link", { name: /observatório/i })).toHaveAttribute(
      "href",
      "https://pabloguilherme01.github.io/observatorio/#dashboard",
    );
    await expect(trustBar.getByRole("link", { name: /trajeto/i })).toHaveAttribute(
      "href",
      "https://github.com/Pabloguilherme01/trajeto-web",
    );
  });


  test("home prioriza trabalho verificável sem repetir Proof Deck no Hero", async ({ page }) => {
    await page.goto("/");

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

  test("primeira jornada mobile é compacta sem sacrificar provas verificáveis", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const hero = page.locator("#inicio");
    const trustBar = page.locator('[data-portfolio-trust-bar="true"]');

    const heroBox = await hero.boundingBox();
    const trustBox = await trustBar.boundingBox();

    expect(heroBox?.height ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(650);
    expect(trustBox?.height ?? Number.POSITIVE_INFINITY).toBeLessThanOrEqual(500);
    await expect(trustBar.locator('[data-portfolio-proof="true"]')).toHaveCount(3);
  });

  test("provas verificáveis ficam legíveis no mobile sem exigir gesto horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const trustBar = page.locator('[data-portfolio-trust-bar="true"]');
    const rail = trustBar.locator('[data-portfolio-proof-rail="true"]');

    await expect(rail).toBeVisible();
    await expect(rail.locator('[data-portfolio-proof="true"]')).toHaveCount(3);
    const metrics = await rail.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        display: style.display,
        overflowX: style.overflowX,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
      };
    });

    expect(metrics.display).toBe("grid");
    expect(["auto", "scroll"]).not.toContain(metrics.overflowX);
    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
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

  test("reconstrução mantém a primeira dobra mobile legível e sem overflow horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.locator('[data-portfolio-shell-version="2"]')).toBeVisible();
    await expect(page.locator('[data-mobile-hero-proof-rail="true"]')).toHaveCount(0);
    await expect(page.locator('[data-portfolio-trust-bar="true"]')).toBeVisible();

    const overflow = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.viewport + 1);
  });
});
