import { expect, test } from "@playwright/test";

test.describe("reconstrução profissional do portfólio", () => {
  test("primeira jornada conecta proposta, provas e projetos verificáveis", async ({ page }) => {
    await page.goto("/");

    const root = page.locator('[data-portfolio-shell-version="2"]');
    await expect(root).toBeVisible();

    const hero = page.locator("#inicio");
    await expect(hero.getByRole("heading", { level: 1 })).toContainText(/produtos digitais|interfaces|dados/i);
    await expect(hero.getByRole("link", { name: /começar diagnóstico/i })).toHaveAttribute("href", "#diagnostico");

    await expect(page.locator('[data-portfolio-trust-bar="true"]')).toHaveCount(0);

    const signals = hero.locator('[data-home-signal-strip="true"]');
    await expect(signals).toBeVisible();
    await expect(signals.locator('[data-home-signal="true"]')).toHaveCount(4);
    await expect(signals).toContainText(/2 cases/i);
    await expect(signals).toContainText(/1 produto publicado/i);
    await expect(signals).toContainText(/5 jogos/i);
    await expect(signals.getByRole("link", { name: /observatório publicado/i })).toHaveAttribute(
      "href",
      "https://pabloguilherme01.github.io/observatorio/#dashboard",
    );
  });

  test("sinais da home ficam compactos no mobile sem exigir gesto horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const strip = page.locator('[data-home-signal-strip="true"]');
    await expect(strip).toBeVisible();
    await expect(strip.locator('[data-home-signal="true"]')).toHaveCount(4);

    const metrics = await strip.evaluate((element) => ({
      overflowX: getComputedStyle(element).overflowX,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
    }));

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
    await expect(page.locator('[data-home-signal-strip="true"]')).toBeVisible();

    const overflow = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(overflow.scroll).toBeLessThanOrEqual(overflow.viewport + 1);
  });
});
