import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test.use({ baseURL });

test.describe("portfólio profissional", () => {
  test("apresenta posicionamento, prova pública e contato em uma jornada direta", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: /Desenvolvo produtos digitais que tornam informação complexa simples de usar/i })).toBeVisible();
    await expect(page.locator("#observatorio").getByRole("heading", { name: "Observatório" })).toBeVisible();

    const observatorio = page.getByRole("link", { name: /ver produto em produção/i }).first();
    await expect(observatorio).toHaveAttribute("href", "https://pabloguilherme01.github.io/observatorio/#dashboard");
    await expect(observatorio).toHaveAttribute("target", "_blank");

    const observatorioCode = page.getByRole("link", { name: /ver código-fonte/i });
    await expect(observatorioCode).toHaveAttribute("href", "https://github.com/Pabloguilherme01/observatorio");
    await expect(observatorioCode).toHaveAttribute("target", "_blank");

    await expect(page.locator('[data-quality-proof="true"]')).toHaveCount(4);
    await expect(page.getByText("Validação automatizada", { exact: true })).toBeVisible();

    const projectCta = page.locator("#projetos").getByRole("link", { name: /falar sobre um projeto/i });
    await expect(projectCta).toHaveAttribute("href", "#contato");

    await projectCta.click();
    await expect(page.getByRole("heading", { name: /Vamos definir uma solução clara para o seu projeto/i })).toBeVisible();
  });

  test("hero destaca provas reais e o diagnóstico prepara um briefing profissional", async ({ page }) => {
    await page.goto("/");

    const proofDeck = page.locator('[data-attention-hook="proof-deck"]');
    await expect(proofDeck).toBeVisible();
    await expect(proofDeck.getByRole("heading", { name: /provas que você pode abrir e verificar/i })).toBeVisible();
    await proofDeck.getByRole("button", { name: /qualidade/i }).click();
    await expect(proofDeck).toContainText(/Typecheck|Vitest|Playwright/i);

    const diagnostic = page.locator('[data-project-diagnostic="true"]');
    await expect(diagnostic).toBeVisible();
    await diagnostic.getByRole("button", { name: /organizar informação ou dados/i }).click();
    await expect(diagnostic.getByRole("heading", { name: /Produto para consulta e decisão/i })).toBeVisible();
    await diagnostic.getByRole("button", { name: /já existe e precisa evoluir/i }).click();
    await expect(diagnostic).toContainText(/evolução guiada/i);

    await diagnostic.getByRole("link", { name: /gerar briefing com esta rota/i }).click();

    const form = page.locator("#contato-briefing");
    await expect(form.locator('select[name="service"]')).toHaveValue("Dashboard ou produto digital");
    await expect(form.locator('select[name="projectType"]')).toHaveValue("Projeto com dados / dashboard");
    await expect(form.locator('textarea[name="objective"]')).toHaveValue(/Transformar informação complexa/i);
    await expect(form.locator('input[name="audience"]')).toHaveValue(/gestores|equipes|pessoas/i);
    await expect(form.locator('select[name="stage"]')).toHaveValue("Já existe e precisa evoluir");
    await expect(form.locator('select[name="delivery"]')).toHaveValue("Dashboard / interface");
    await expect(form.locator('textarea[name="success"]')).toHaveValue(/consulta|decis/i);
    await expect(form.locator('textarea[name="briefing"]')).toHaveValue(/dados|fontes|indicadores/i);
    await expect(form.locator('[data-briefing-progress="true"]')).not.toContainText("0%");

    await form.locator('input[name="name"]').fill("Visitante de teste");
    await form.locator('input[name="email"]').fill("visitante@example.com");
    await form.locator('input[name="audience"]').fill("Equipe interna");
    await form.locator('textarea[name="briefing"]').fill("Precisamos centralizar dados dispersos e facilitar a consulta.");
    await page.reload();

    const restoredForm = page.locator("#contato-briefing");
    await expect(restoredForm.locator('input[name="name"]')).toHaveValue("Visitante de teste");
    await expect(restoredForm.locator('input[name="audience"]')).toHaveValue("Equipe interna");
    await expect(restoredForm.locator('[data-briefing-summary="true"]')).toContainText("Dashboard ou produto digital");

    await restoredForm.getByRole("button", { name: /limpar rascunho/i }).click();
    await expect(restoredForm.locator('input[name="name"]')).toHaveValue("");
  });

  test("não expõe ferramentas internas de curadoria na vitrine pública", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#galeria-publica")).toHaveCount(0);
    await expect(page.locator("#favoritos-pessoais")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /CSV|JSON|projetos salvos|minhas imagens/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /observatório/i }).first()).toBeVisible();
  });

  test("usa o retrato versionado e publica o case vertical válido", async ({ page, request }) => {
    await page.goto("/");

    const portrait = page.locator(".hero-portrait-card img");
    await expect(portrait).toHaveAttribute("src", /portfolio-media\/pablo-profile-2026\.webp$/);
    await expect(page.getByText(/Site vendendo enquanto você dorme/i).first()).toBeVisible();

    for (const asset of [
      "/portfolio-media/pablo-profile-2026.avif",
      "/portfolio-media/pablo-profile-2026.webp",
      "/portfolio-media/pg-site-vendendo-2026-poster.webp",
      "/portfolio-media/pg-site-vendendo-2026.mp4",
    ]) {
      const response = await request.get(asset);
      expect(response.ok(), `${asset} não foi servido corretamente`).toBeTruthy();
    }
  });

  test("emite eventos de conversão sem incluir dados pessoais", async ({ page }) => {
    await page.addInitScript(() => {
      const events: unknown[] = [];
      window.addEventListener("portfolio:analytics", (event) => events.push((event as CustomEvent).detail));
      Object.defineProperty(window, "__portfolioAnalyticsEvents", { value: events });
    });
    await page.goto("/");

    const emittedEventNames = () =>
      page.evaluate(() =>
        (window as typeof window & { __portfolioAnalyticsEvents: Array<{ eventName: string }> })
          .__portfolioAnalyticsEvents.map((event) => event.eventName),
      );

    await page.locator("#inicio").getByRole("link", { name: /iniciar um projeto/i }).click();
    await expect.poll(emittedEventNames).toContain("quote_cta");

    await page.locator("#contato-briefing input").first().focus();
    await expect.poll(emittedEventNames).toContain("briefing_started");

    const propertyKeys = await page.evaluate(() =>
      (window as typeof window & { __portfolioAnalyticsEvents: Array<{ properties?: Record<string, unknown> }> })
        .__portfolioAnalyticsEvents.flatMap((event) => Object.keys(event.properties ?? {})),
    );
    expect(propertyKeys).not.toEqual(expect.arrayContaining(["name", "email", "phone", "briefing", "address"]));
  });

  test("abre projeto em destaque e mantém navegação por link direto", async ({ page }) => {
    await page.goto("/");

    const featured = page.locator("[data-featured-project]").first();
    await expect(featured).toBeVisible();
    await featured.click();

    const dialog = page.locator('[data-project-details-dialog="true"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 2 })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await page.goto("/?projeto=TEC.08#projetos");
    await expect(page.locator('[data-project-details-dialog="true"]')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('[data-project-details-dialog="true"]')).toContainText(/Site vendendo enquanto você dorme/i);
  });

  test("mantém mobile sem overflow e com alvos principais acessíveis", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/");

    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();

    const primaryCta = page.locator("#inicio").getByRole("link", { name: /iniciar um projeto/i });
    expect(await primaryCta.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);

    const skipLink = page.locator(".skip-link");
    for (let index = 0; index < 6 && !(await skipLink.evaluate((element) => element === document.activeElement)); index += 1) {
      await page.keyboard.press("Tab");
    }
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#conteudo-principal")).toBeFocused();
  });

  test("publica metadados, robots e sitemap coerentes", async ({ page, request }) => {
    await page.goto("/");

    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /desenvolvimento web.*dashboards/i);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Desenvolvimento Web & Produtos Digitais/i);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${new URL(baseURL).origin}/`);

    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("Sitemap:");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain("<loc>");
  });

  test("mantém contato e disponibilidade visíveis no encerramento", async ({ page }) => {
    await page.goto("/");

    const footer = page.locator("#contato-rodape");
    await footer.scrollIntoViewIfNeeded();
    await expect(footer.locator('a[href="mailto:mpjcreator@gmail.com"]')).toBeVisible();
    await expect(page.locator('[data-availability-status="true"]')).toContainText(/disponibilidade atual: sob consulta/i);
    await expect(page.getByText("modelo", { exact: true }).first()).toBeVisible();
  });
});
