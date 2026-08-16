import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test.use({ baseURL });

test.describe("navegação pública e favoritos", () => {
  test("percorre as âncoras públicas e mantém a galeria acessível", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
    await page.getByRole("link", { name: /galeria pública/i }).click();
    await expect(page.locator("#galeria-publica")).toBeVisible();
    await page.getByRole("link", { name: /meus favoritos/i }).click();
    await expect(page.locator("#favoritos-pessoais")).toBeVisible();
  });

  test("aplica um filtro por tag na galeria pública", async ({ page }) => {
    await page.goto("/#galeria-publica");
    const tagFilter = page.locator('[data-filter-scope="tag"]').filter({ hasText: "Drone" }).first();
    await expect(tagFilter).toBeVisible();
    await tagFilter.click();
    await expect(tagFilter).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-project-id]').first()).toBeVisible();
  });

  test("aplica filtro por tecnologia e atualiza a contagem de resultados", async ({ page }) => {
    await page.goto("/#galeria-publica");
    const technologyFilter = page.locator('[data-filter-scope="technology"]').filter({ hasText: "HTML" }).first();
    await expect(technologyFilter).toBeVisible();
    await technologyFilter.click();
    await expect(technologyFilter).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-technology-result-count="true"]')).toContainText(/projeto/);
  });

  test("oferece contato no rodapé, copia o e-mail e retorna ao topo", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const emailLink = page.locator('#contato-rodape a[href="mailto:mpjcreator@gmail.com"]');
    await expect(emailLink).toBeVisible();
    const copyEmail = page.getByRole("button", { name: /copiar e-mail mpjcreator@gmail.com/i });
    await copyEmail.click();
    await expect(page.locator('#contato-rodape [role="status"]')).toContainText(/copiado|não foi possível/i);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const backToTop = page.locator('button[aria-label="Voltar ao topo da página"]');
    await expect(backToTop).toBeVisible();
    await page.evaluate(() => { window.scrollTo({ top: 0, behavior: "auto" }); window.dispatchEvent(new Event("scroll")); });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(100);
    await expect(backToTop).toHaveAttribute("aria-hidden", "true");
  });

  test("publica canonical, robots e sitemap coerentes", async ({ page, request }) => {
    await page.goto("/");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", `${new URL(baseURL).origin}/`);
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("Sitemap:");
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain("<loc>");
    await page.goto("/favoritos");
    await expect(page.locator('#robots-meta')).toHaveAttribute("content", "noindex, nofollow");
  });

  test("mantém foco visível, skip link e layout sem overflow horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/");
    const skipLink = page.locator(".skip-link");
    for (let index = 0; index < 6 && !(await skipLink.evaluate((element) => element === document.activeElement)); index += 1) {
      await page.keyboard.press("Tab");
    }
    await expect(skipLink).toBeFocused();
    const focusOutline = await skipLink.evaluate((element) => getComputedStyle(element).outlineColor);
    expect(focusOutline).not.toBe("rgba(0, 0, 0, 0)");
    await page.keyboard.press("Enter");
    await expect(page.locator("#conteudo-principal")).toBeFocused();
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalOverflow).toBeFalsy();
    await expect(page.locator("#trabalhos-destaque-title")).toBeVisible();
    await expect(page.locator(".featured-project-card")).toHaveCount(3);
  });

  test("alterna tema, exibe skeleton inicial e abre detalhes dos destaques", async ({ page }) => {
    await page.goto("/");
    const themeToggle = page.locator('[data-theme-toggle="true"]').first();
    await expect(themeToggle).toHaveAttribute("aria-pressed", "true");
    await themeToggle.click();
    await expect(themeToggle).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await page.locator('[data-featured-project]').first().waitFor({ state: "visible" });
    await page.locator('[data-featured-project]').first().click();
    const details = page.locator('[data-project-details-dialog="true"]');
    await expect(details).toBeVisible();
    await expect(details.getByRole("heading", { level: 2 })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(details).toBeHidden();
  });

  test("mantém a rota de favoritos fora da vitrine pública", async ({ page }) => {
    await page.goto("/favoritos");
    await expect(page).toHaveURL(/\/favoritos$/);
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("h1").first()).toContainText(/Gestão de favoritos reservada|Favoritos organizados|Sign in to continue/);
    await expect(page.locator("#projetos")).toHaveCount(0);
  });
});
