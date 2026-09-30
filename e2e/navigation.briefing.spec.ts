import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test.use({ baseURL });

test.describe("portfólio profissional", () => {
  test("apresenta posicionamento, prova pública e contato em uma jornada direta", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1, name: /Desenvolvo produtos digitais que tornam informação complexa simples de usar/i })).toBeVisible();
    await page.locator("#projetos").scrollIntoViewIfNeeded();
    await expect(page.locator('[data-featured-project-strip="true"]')).toBeVisible();
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

    const diagnosticPlaceholder = page.locator('[data-project-diagnostic-placeholder="true"]');
    await diagnosticPlaceholder.scrollIntoViewIfNeeded();

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
    await expect(form.locator('[data-briefing-progress="true"]')).not.toHaveText(/^0%/);

    await form.locator('input[name="name"]').fill("Visitante de teste");
    await form.locator('input[name="email"]').fill("visitante@example.com");

    const studio = form.locator('[data-briefing-studio="true"]');
    await studio.getByRole("button", { name: /continuar.*direção/i }).click();
    await form.locator('input[name="audience"]').fill("Equipe interna");

    await studio.getByRole("button", { name: /continuar.*escopo/i }).click();
    await form.locator('input[name="location"]').fill("Remoto");

    await studio.getByRole("button", { name: /continuar.*requisitos/i }).click();
    await studio.getByRole("button", { name: /continuar.*revisão/i }).click();
    await form.locator('textarea[name="briefing"]').fill("Precisamos centralizar dados dispersos e facilitar a consulta.");
    await page.reload({ waitUntil: "networkidle" });

    const restoredForm = page.locator("#contato-briefing");
    await expect(restoredForm.locator('input[name="name"]')).toHaveValue("Visitante de teste");
    await expect(restoredForm.locator('input[name="audience"]')).toHaveValue("Equipe interna");
    await expect(restoredForm.locator('[data-briefing-summary="true"]')).toContainText("Dashboard ou produto digital");

    await restoredForm.getByRole("button", { name: /limpar rascunho/i }).click();
    await expect(restoredForm.locator('input[name="name"]')).toHaveValue("");
  });


  test("briefing mantém apenas o fluxo estável e editável", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator('[data-briefing-quick-start="true"]')).toHaveCount(0);

    const form = page.locator('[data-briefing-form="true"]');
    await expect(form).toBeVisible();
    await expect(form.locator('input[name="name"]')).toBeEditable();
    await expect(form.locator('input[name="email"]')).toBeEditable();
    await expect(form.locator('select[name="service"]')).toBeEditable();
    await expect(form.locator('textarea[name="objective"]')).toBeEditable();
  });

  test("briefing studio conduz o visitante por etapas sem perder contexto", async ({ page }) => {
    await page.goto("/");

    const form = page.locator("#contato-briefing");
    await form.scrollIntoViewIfNeeded();

    const studio = form.locator('[data-briefing-studio="true"]');
    await expect(studio).toBeVisible();
    await expect(studio.locator('[data-briefing-step="contact"]')).toBeVisible();
    await expect(studio.locator('[data-briefing-step="direction"]')).toBeHidden();
    await expect(studio.getByText(/etapa 1 de 5/i)).toBeVisible();

    await studio.getByRole("button", { name: /continuar.*direção/i }).click();
    await expect(studio.locator('[data-briefing-step="contact"]')).toBeVisible();

    await form.locator('input[name="name"]').fill("Visitante guiado");
    await form.locator('input[name="email"]').fill("guiado@example.com");
    await studio.getByRole("button", { name: /continuar.*direção/i }).click();

    await expect(studio.locator('[data-briefing-step="contact"]')).toBeHidden();
    await expect(studio.locator('[data-briefing-step="direction"]')).toBeVisible();
    await expect(studio.getByText(/etapa 2 de 5/i)).toBeVisible();

    await studio.getByRole("button", { name: /voltar.*contato/i }).click();
    await expect(studio.locator('[data-briefing-step="contact"]')).toBeVisible();
    await expect(form.locator('input[name="name"]')).toHaveValue("Visitante guiado");
  });

  test("briefing profissional coleta requisitos, conteúdo, integrações e qualidade antes da revisão", async ({ page }) => {
    await page.goto("/");

    const form = page.locator("#contato-briefing");
    await form.scrollIntoViewIfNeeded();

    await expect.poll(async () =>
      page.evaluate(() =>
        performance.getEntriesByType("resource").some((entry) => entry.name.includes("BriefingProfessionalLayer")),
      ),
    ).toBeFalsy();

    await form.locator('input[name="name"]').fill("Cliente profissional");
    await form.locator('input[name="email"]').fill("cliente@example.com");
    await form.getByRole("button", { name: /continuar.*direção/i }).click();

    await form.locator('select[name="service"]').selectOption({ label: "Site ou landing page" });
    await form.locator('select[name="projectType"]').selectOption({ label: "Marca ou negócio" });
    await form.locator('textarea[name="objective"]').fill("Gerar pedidos de orçamento qualificados.");
    await form.locator('input[name="audience"]').fill("Empresas que precisam contratar o serviço");
    await form.getByRole("button", { name: /continuar.*escopo/i }).click();

    await form.getByRole("button", { name: /continuar.*requisitos/i }).click();

    await expect.poll(async () =>
      page.evaluate(() =>
        performance.getEntriesByType("resource").some((entry) => entry.name.includes("BriefingProfessionalLayer")),
      ),
    ).toBeTruthy();
    await expect(form.locator('[data-briefing-step="requirements"]')).toBeVisible();

    await expect(form.locator('select[name="contentStatus"]')).toBeVisible();
    await expect(form.locator('select[name="visualIdentity"]')).toBeVisible();
    await expect(form.locator('textarea[name="pagesScreens"]')).toBeVisible();
    await expect(form.locator('textarea[name="features"]')).toBeVisible();
    await expect(form.locator('textarea[name="integrations"]')).toBeVisible();
    await expect(form.locator('select[name="qualityPriority"]')).toBeVisible();
    await expect(form.locator('select[name="postLaunch"]')).toBeVisible();

    await form.locator('select[name="contentStatus"]').selectOption({ label: "Conteúdo parcialmente pronto" });
    await form.locator('select[name="qualityPriority"]').selectOption({ label: "Conversão e clareza" });
    await form.getByRole("button", { name: /continuar.*revisão/i }).click();

    await expect(form.locator('[data-briefing-step="review"]')).toBeVisible();
    await expect(form.locator('[data-briefing-professional-review="true"]')).toContainText("Conteúdo parcialmente pronto");
    await expect(form.locator('[data-briefing-professional-review="true"]')).toContainText("Conversão e clareza");
  });

  test("oferece rota curta para recrutadores com provas e contato profissional", async ({ page }) => {
    await page.goto("/");

    const recruiterEntry = page.locator("#inicio").getByRole("link", { name: /avaliar perfil profissional/i });
    await expect(recruiterEntry).toHaveAttribute("href", "#perfil-profissional");
    await recruiterEntry.click();

    const profile = page.locator('[data-professional-snapshot="true"]');
    await expect(profile).toBeVisible();
    await expect(profile.getByRole("heading", { name: /avaliação profissional/i })).toBeVisible();
    await expect(profile.locator('[data-professional-proof="true"]')).toHaveCount(5);

    const resumeProof = profile.locator('[data-professional-proof-id="resume"]');
    await expect(resumeProof).toHaveAttribute("href", "#curriculo-web");
    await expect(resumeProof).toContainText(/abrir currículo web/i);
    await expect(profile.getByRole("link", { name: /ver github/i })).toHaveAttribute(
      "href",
      "https://github.com/pabloguilherme1121",
    );
    await expect(profile.getByRole("link", { name: /ver observatório/i })).toHaveAttribute(
      "href",
      "https://pabloguilherme01.github.io/observatorio/#dashboard",
    );
    await expect(profile.getByRole("link", { name: /ver trajeto/i })).toHaveAttribute(
      "href",
      "https://github.com/Pabloguilherme01/trajeto-web",
    );
    await expect(profile.getByRole("link", { name: /ver qualidade/i })).toHaveAttribute("href", "#qualidade");

    await expect(profile.getByRole("link", { name: /falar sobre oportunidade/i })).toHaveAttribute(
      "href",
      /^mailto:mpjcreator@gmail\.com\?subject=Oportunidade%20profissional/,
    );
  });

  test("mantém contato e briefing fora do bundle inicial sem quebrar acesso direto", async ({ page }) => {
    const contactRequests: string[] = [];
    page.on("request", (request) => {
      if (/PortfolioContact/i.test(request.url())) contactRequests.push(request.url());
    });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(contactRequests).toEqual([]);
    await expect(page.locator("#contato")).toHaveCount(1);

    await page.waitForTimeout(2600);
    expect(contactRequests).toEqual([]);

    await page.goto("/#contato-briefing");
    await expect(page.locator('[data-briefing-form="true"]')).toBeVisible();
    await expect.poll(() => contactRequests.length).toBeGreaterThan(0);
  });

  test("serviços conectam oferta a prova e briefing pré-preenchido", async ({ page }) => {
    await page.goto("/#servicos");

    const services = page.locator("#servicos");
    await expect(services.locator('[data-service-offer="true"]')).toHaveCount(2);

    const dashboard = services.locator('[data-service-id="dashboard"]');
    await expect(dashboard.getByRole("link", { name: /ver prova.*observatório/i })).toHaveAttribute("href", "#observatorio");

    await dashboard.getByRole("link", { name: /iniciar briefing.*interfaces e dashboards/i }).click();

    const form = page.locator("#contato-briefing");
    await expect(form.locator('select[name="service"]')).toHaveValue("Dashboard ou produto digital");
    await expect(form.locator('select[name="projectType"]')).toHaveValue("Projeto com dados / dashboard");
    await expect(form.locator('textarea[name="objective"]')).toHaveValue(/organizar dados|informação complexa/i);
    await expect(form.locator('select[name="delivery"]')).toHaveValue("Dashboard / interface");
    await expect(form.locator('textarea[name="success"]')).toHaveValue(/consulta|indicadores|contexto/i);

    await expect(services.locator('[data-service-id="content"]')).toHaveCount(0);
  });

  test("PWA expõe atalhos úteis para projetos, contato e PG Arcade", async ({ request }) => {
    const response = await request.get("/manifest.webmanifest");
    expect(response.ok()).toBeTruthy();
    const manifest = await response.json() as { shortcuts?: Array<{ name?: string; url?: string }> };
    expect(manifest.shortcuts).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: "Ver trabalhos", url: "./#projetos" }),
      expect.objectContaining({ name: "Entrar em contato", url: "./#contato" }),
      expect.objectContaining({ name: "Abrir PG Arcade", url: "./#pg-lab" }),
    ]));
  });

  test("agenda leva de volta à seção de projetos", async ({ page }) => {
    await page.goto("/#contato");

    const contact = page.locator("#contato");
    await expect(contact).toBeVisible();

    const projectsShortcut = contact.getByRole("button", { name: /ir para projetos/i });
    await expect(projectsShortcut).toBeVisible();
    await projectsShortcut.click();

    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe("#projetos");
    await expect(page.locator("#projetos")).toBeInViewport();
  });

  test("mantém contato e disponibilidade visíveis no encerramento", async ({ page }) => {
    await page.goto("/");

    const contact = page.locator("#contato");
    await contact.scrollIntoViewIfNeeded();
    await expect(contact.getByText(/agenda sob consulta para novos projetos e oportunidades/i)).toBeVisible();
    await expect(contact.getByText(/consulta de agenda/i)).toBeVisible();

    const footerPlaceholder = page.locator('[data-footer-placeholder="true"]');
    await expect(footerPlaceholder).toBeVisible();
    await footerPlaceholder.scrollIntoViewIfNeeded();

    const footer = page.locator("#contato-rodape");
    await expect(footer).toBeVisible({ timeout: 10000 });
    await expect(footer.locator('a[href="mailto:mpjcreator@gmail.com"]')).toBeVisible();
    await expect(page.locator('[data-availability-status="true"]')).toContainText(/disponibilidade atual: sob consulta/i);
  });
});
