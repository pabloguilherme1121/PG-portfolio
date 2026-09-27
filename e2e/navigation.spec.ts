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
    await page.reload();

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

  test("jogo da velha oferece pausa interativa acessível e reiniciável", async ({ page }) => {
    await page.goto("/");

    const game = page.locator('[data-tic-tac-toe="true"]');
    await expect(game).toBeHidden();
    await page.getByRole("button", { name: /abrir.*pg lab|jogar.*jogo da velha/i }).click();
    await game.scrollIntoViewIfNeeded();
    await expect(game).toBeVisible();
    await expect(game.getByRole("heading", { name: /jogo da velha/i })).toBeVisible();

    const cells = game.locator('[data-game-cell="true"]');
    await expect(cells).toHaveCount(9);

    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText("X");
    await expect(game.locator('[data-game-cell="true"]:has-text("O")')).toHaveCount(1);
    await expect(game.locator('[data-game-status="true"]')).toContainText(/sua vez|você|empate|pg bot/i);

    await game.getByRole("button", { name: /reiniciar partida/i }).click();
    for (let index = 0; index < 9; index += 1) {
      await expect(cells.nth(index)).toHaveText("");
    }
  });

  test("PG Arcade permite alternar modo, dificuldade, símbolo e série", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /abrir.*pg lab|jogar.*jogo da velha/i }).click();

    const game = page.locator('[data-tic-tac-toe="true"]');
    await expect(game.getByRole("button", { name: /contra o bot/i })).toBeVisible();
    await expect(game.getByRole("button", { name: /duas pessoas/i })).toBeVisible();
    await expect(game.getByRole("button", { name: /fácil/i })).toBeVisible();
    await expect(game.getByRole("button", { name: /impossível/i })).toBeVisible();
    await expect(game.getByRole("button", { name: /melhor de 3/i })).toBeVisible();
    await expect(game.getByRole("button", { name: /jogar com.*símbolo/i })).toBeVisible();

    await game.getByRole("button", { name: /duas pessoas/i }).click();
    const cells = game.locator('[data-game-cell="true"]');
    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText("X");
    await expect(game.locator('[data-game-cell="true"]:has-text("O")')).toHaveCount(0);
    await cells.nth(1).click();
    await expect(cells.nth(1)).toHaveText("O");

    await game.getByRole("button", { name: /reiniciar partida/i }).click();
    await expect(game.locator('[data-match-score="true"]')).toContainText("0");
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

    await form.locator('input[name="name"]').fill("Cliente profissional");
    await form.locator('input[name="email"]').fill("cliente@example.com");
    await form.getByRole("button", { name: /continuar.*direção/i }).click();

    await form.locator('select[name="service"]').selectOption({ label: "Site ou landing page" });
    await form.locator('select[name="projectType"]').selectOption({ label: "Marca ou negócio" });
    await form.locator('textarea[name="objective"]').fill("Gerar pedidos de orçamento qualificados.");
    await form.locator('input[name="audience"]').fill("Empresas que precisam contratar o serviço");
    await form.getByRole("button", { name: /continuar.*escopo/i }).click();

    await form.getByRole("button", { name: /continuar.*requisitos/i }).click();
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

  test("não expõe ferramentas internas de curadoria na vitrine pública", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#galeria-publica")).toHaveCount(0);
    await expect(page.locator("#favoritos-pessoais")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /CSV|JSON|projetos salvos|minhas imagens/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /observatório/i }).first()).toBeVisible();
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

  test("oferece currículo web imprimível sem depender do PDF", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "__portfolioPrintCalls", { value: 0, writable: true });
      window.print = () => {
        const target = window as typeof window & { __portfolioPrintCalls: number };
        target.__portfolioPrintCalls += 1;
      };
    });
    await page.goto("/");

    await page.locator('[data-professional-proof-id="resume"]').click();

    const resume = page.locator('[data-web-resume="true"]');
    await expect(resume).toBeVisible();
    await expect(resume.getByRole("heading", { name: /currículo profissional/i })).toBeVisible();
    await expect(resume).toContainText(/análise e desenvolvimento de sistemas/i);
    await expect(resume).toContainText(/react.*typescript.*trpc/i);
    await expect(resume.getByRole("link", { name: /observatório/i })).toHaveAttribute(
      "href",
      "https://pabloguilherme01.github.io/observatorio/#dashboard",
    );
    await expect(resume.getByRole("link", { name: /trajeto/i })).toHaveAttribute(
      "href",
      "https://github.com/Pabloguilherme01/trajeto-web",
    );

    await resume.getByRole("button", { name: /imprimir.*salvar.*pdf/i }).click();
    await expect.poll(() =>
      page.evaluate(() =>
        (window as typeof window & { __portfolioPrintCalls: number }).__portfolioPrintCalls,
      ),
    ).toBe(1);
  });

  test("serviços conectam oferta a prova e briefing pré-preenchido", async ({ page }) => {
    await page.goto("/");

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

  test("estudos de caso levam a evidências verificáveis", async ({ page }) => {
    await page.goto("/");

    const studies = page.locator('[data-case-study="true"]');
    await expect(studies).toHaveCount(2);

    const observatorioStudy = studies.filter({ hasText: "Observatório" });
    await expect(observatorioStudy.getByRole("link", { name: /abrir produto/i })).toHaveAttribute(
      "href",
      "https://pabloguilherme01.github.io/observatorio/#dashboard",
    );
    await expect(observatorioStudy.getByRole("link", { name: /ver código/i })).toHaveAttribute(
      "href",
      "https://github.com/Pabloguilherme01/observatorio",
    );

    const trajetoStudy = studies.filter({ hasText: "Trajeto" });
    await expect(trajetoStudy.getByRole("link", { name: /ver código/i })).toHaveAttribute(
      "href",
      "https://github.com/Pabloguilherme01/trajeto-web",
    );

    await expect(page.locator('[data-case-evidence="true"]')).toHaveCount(3);
  });

  test("apresenta Trajeto como produto em evolução com código verificável", async ({ page }) => {
    await page.goto("/");

    const studies = page.locator('[data-case-study="true"]');
    await expect(studies).toHaveCount(2);

    const trajetoStudy = studies.filter({ hasText: "Trajeto" });
    await expect(trajetoStudy).toContainText(/produto.*evolução|em evolução/i);
    await expect(trajetoStudy.getByRole("link", { name: /ver código/i })).toHaveAttribute(
      "href",
      "https://github.com/Pabloguilherme01/trajeto-web",
    );

    await expect(page.locator('[data-case-evidence="true"]')).toHaveCount(3);

    const featured = page.locator('[data-featured-project="TEC.09"]');
    await expect(featured).toBeVisible();
    await expect(featured).toContainText(/Trajeto/i);
    await expect(featured).toContainText(/em evolução/i);
    await expect(featured.getByRole("link", { name: /abrir prova.*código/i })).toHaveAttribute(
      "href",
      "https://github.com/Pabloguilherme01/trajeto-web",
    );
    await featured.getByRole("button", { name: /ver detalhes.*trajeto/i }).click();

    const dialog = page.locator('[data-project-details-dialog="true"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: /Trajeto/i })).toBeVisible();
    await expect(dialog.getByRole("link", { name: /abrir projeto/i })).toHaveAttribute(
      "href",
      "https://github.com/Pabloguilherme01/trajeto-web",
    );
  });

  test("projetos destacados mostram estado, prova direta e detalhes separados", async ({ page }) => {
    await page.goto("/");

    const featured = page.locator("[data-featured-project]");
    await expect(featured).toHaveCount(1);

    const trajeto = page.locator('[data-featured-project="TEC.09"]');
    await expect(trajeto.locator('[data-project-status="true"]')).toContainText(/em evolução/i);
    await expect(trajeto.getByRole("link", { name: /abrir prova.*código/i })).toHaveAttribute(
      "href",
      "https://github.com/Pabloguilherme01/trajeto-web",
    );
    await expect(trajeto.getByRole("button", { name: /ver detalhes.*trajeto/i })).toBeVisible();

    await expect(page.locator('[data-featured-evidence="true"]')).toHaveCount(1);
  });

  test("usa o retrato profissional versionado", async ({ page, request }) => {
    await page.goto("/");

    const portrait = page.locator(".hero-portrait-card img");
    await expect(portrait).toHaveAttribute("src", /portfolio-media\/pablo-profile-2026\.webp$/);

    for (const asset of [
      "/portfolio-media/pablo-profile-2026.avif",
      "/portfolio-media/pablo-profile-2026.webp",
    ]) {
      const response = await request.get(asset);
      expect(response.ok(), `${asset} não foi servido corretamente`).toBeTruthy();
    }
  });

  test("não publica mais a peça vertical autoral nem fluxos relacionados", async ({ page, request }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.getByText(/Site vendendo enquanto você dorme/i)).toHaveCount(0);
    await expect(page.getByText("Conteúdo e audiovisual", { exact: true })).toHaveCount(0);
    await expect(page.locator('a[href*="pg-site-vendendo-2026"]')).toHaveCount(0);
    await expect(page.locator('[data-showreel="true"]')).toHaveCount(0);
    await expect(page.getByText(/showreel em preparação/i)).toHaveCount(0);

    await page.goto("/?projeto=TEC.08#projetos");
    await expect(page.locator('[data-project-details-dialog="true"]')).toHaveCount(0);

    await page.goto("/?imagem=TEC.08");
    await expect(page.locator("[data-lightbox-modal]")).toHaveCount(0);

    for (const asset of [
      "/portfolio-media/pg-site-vendendo-2026-poster.webp",
      "/portfolio-media/pg-site-vendendo-2026.mp4",
    ]) {
      const response = await request.get(asset);
      const contentType = response.headers()["content-type"] ?? "";
      expect(contentType, `${asset} ainda está sendo servido como mídia`).not.toMatch(/^(image|video)\//);
    }

    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
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
    await featured.getByRole("button", { name: /ver detalhes/i }).click();

    const dialog = page.locator('[data-project-details-dialog="true"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { level: 2 })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await page.goto("/?projeto=TEC.09#projetos");
    await expect(page.locator('[data-project-details-dialog="true"]')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('[data-project-details-dialog="true"]')).toContainText(/Trajeto/i);
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

  test("mantém briefing e PG Arcade confortáveis entre 320 e 430px", async ({ page }) => {
    for (const width of [320, 360, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/");

      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();

      const form = page.locator("#contato-briefing");
      await form.scrollIntoViewIfNeeded();
      await expect(form.locator('[data-briefing-studio="true"]')).toBeVisible();
      const briefingOverflow = await form.evaluate((element) =>
        Array.from(element.querySelectorAll<HTMLElement>("*"))
          .filter((node) => node.offsetParent !== null && node.getAttribute("aria-hidden") !== "true" && node.scrollWidth > node.clientWidth + 1)
          .slice(0, 12)
          .map((node) => ({
            tag: node.tagName,
            className: node.className,
            scrollWidth: node.scrollWidth,
            clientWidth: node.clientWidth,
            text: node.textContent?.trim().slice(0, 80),
          })),
      );
      expect(briefingOverflow).toEqual([]);

      const briefingButtons = form.getByRole("button");
      const briefingCount = await briefingButtons.count();
      for (let index = 0; index < Math.min(briefingCount, 8); index += 1) {
        const box = await briefingButtons.nth(index).boundingBox();
        if (box) expect(box.height).toBeGreaterThanOrEqual(44);
      }

      await page.getByRole("button", { name: /abrir.*pg lab|jogar.*jogo da velha/i }).click();
      const game = page.locator('[data-tic-tac-toe="true"]');
      await game.scrollIntoViewIfNeeded();
      await expect.poll(() => game.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy();

      for (const name of [/contra o bot/i, /duas pessoas/i, /fácil/i, /normal/i, /impossível/i, /reiniciar partida/i]) {
        const button = game.getByRole("button", { name }).first();
        await expect(button).toBeVisible();
        const box = await button.boundingBox();
        expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
      }

      const board = game.locator('[data-game-cell="true"]').first();
      const boardBox = await board.boundingBox();
      expect(boardBox?.width ?? 0).toBeGreaterThanOrEqual(72);
      expect(boardBox?.height ?? 0).toBeGreaterThanOrEqual(72);
    }
  });

  test("mobile prioriza navegação curta e CTA de projeto ao alcance do polegar", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const mobileMenuButton = page.locator('[data-mobile-menu-toggle="true"]');
    await mobileMenuButton.click();

    const mobileNavigation = page.locator("#mobile-navigation");
    await expect(mobileNavigation).toBeVisible();
    await expect(mobileNavigation.getByRole("link", { name: /início/i })).toBeVisible();
    await expect(mobileNavigation.getByRole("link", { name: /projetos/i })).toBeVisible();
    await expect(mobileNavigation.getByRole("link", { name: /serviços/i })).toBeVisible();
    await expect(mobileNavigation.getByRole("link", { name: /contato/i })).toBeVisible();
    expect(await mobileNavigation.getByRole("link").count()).toBeLessThanOrEqual(7);

    await mobileMenuButton.click();
    const mobilePrimaryAction = page.locator('[data-mobile-primary-action="true"]');
    await expect(mobilePrimaryAction).toBeVisible();
    await expect(mobilePrimaryAction).toHaveAttribute("href", "#contato");
    const actionBox = await mobilePrimaryAction.boundingBox();
    expect(actionBox?.height ?? 0).toBeGreaterThanOrEqual(48);
    expect(actionBox?.width ?? 0).toBeGreaterThanOrEqual(160);
  });

  test("mobile adapta atalhos à rota e retoma briefing automaticamente", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator('[data-experience-hub="true"]').scrollIntoViewIfNeeded();

    const quickBar = page.locator('[data-mobile-contact-bar="true"]');
    const contextAction = page.locator('[data-mobile-context-action="true"]');
    const primaryAction = page.locator('[data-mobile-primary-action="true"]');
    const whatsappAction = page.locator('[data-mobile-whatsapp-action="true"]');

    await expect(quickBar).toBeVisible();
    await expect(contextAction).toHaveAttribute("href", "#diagnostico");
    await expect(contextAction).toContainText(/diagnóstico/i);
    await expect(primaryAction).toHaveAttribute("href", "#contato");
    await expect(primaryAction).toContainText(/briefing/i);
    await expect(whatsappAction).toBeVisible();

    const hub = page.locator('[data-experience-hub="true"]');
    await hub.getByRole("tab", { name: /quero avaliar seu perfil/i }).click();
    await expect(contextAction).toHaveAttribute("href", "#perfil-profissional");
    await expect(contextAction).toContainText(/perfil/i);

    await page.reload();
    await page.locator('[data-experience-hub="true"]').scrollIntoViewIfNeeded();
    await expect(hub.getByRole("tab", { name: /quero avaliar seu perfil/i })).toHaveAttribute("aria-selected", "true");
    await expect(contextAction).toHaveAttribute("href", "#perfil-profissional");

    await hub.getByRole("tab", { name: /quero explorar/i }).click();
    await expect(contextAction).toHaveAttribute("href", "#projetos");
    await expect(contextAction).toContainText(/projetos/i);

    await page.locator("#contato-briefing").scrollIntoViewIfNeeded();
    await page.locator('#contato-briefing input[name="name"]').fill("Visitante mobile");
    await page.locator("#contato").getByRole("heading", { name: /solução clara/i }).click();

    await expect(primaryAction).toContainText(/continuar/i);

    for (const action of [contextAction, primaryAction, whatsappAction]) {
      const box = await action.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(48);
    }

    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  });

  test("menu mobile oferece atalhos diretos sem aumentar a navegação principal", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/");

    await page.locator('[data-mobile-menu-toggle="true"]').click();
    const menu = page.locator("#mobile-navigation");
    const shortcuts = menu.locator('[data-mobile-shortcuts="true"]');

    await expect(shortcuts).toBeVisible();
    await expect(shortcuts.getByRole("link", { name: /diagnóstico/i })).toHaveAttribute("href", "#diagnostico");
    await expect(shortcuts.getByRole("link", { name: /perfil/i })).toHaveAttribute("href", "#perfil-profissional");
    await expect(shortcuts.getByRole("link", { name: /observatório/i })).toHaveAttribute("href", /observatorio/);

    const shortcutLinks = shortcuts.getByRole("link");
    expect(await shortcutLinks.count()).toBe(3);
    for (let index = 0; index < 3; index += 1) {
      const box = await shortcutLinks.nth(index).boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(48);
    }
  });

  test("mobile reduz densidade dos projetos e mantém CTAs principais em largura confortável", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/");

    const projects = page.locator("#projetos");
    await projects.scrollIntoViewIfNeeded();
    const observatorio = projects.locator("#observatorio");
    await expect(observatorio).toBeVisible();

    const proofActions = observatorio.getByRole("link");
    const proofCount = await proofActions.count();
    for (let index = 0; index < proofCount; index += 1) {
      const box = await proofActions.nth(index).boundingBox();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(48);
        expect(box.width).toBeGreaterThanOrEqual(240);
      }
    }

    const caseStudy = projects.locator('[data-case-study="true"]').first();
    const caseBox = await caseStudy.boundingBox();
    expect(caseBox?.width ?? 0).toBeLessThanOrEqual(288);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
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
  test("experience hub orienta perfis diferentes sem quebrar a jornada principal", async ({ page }) => {
    await page.goto("/");

    const hub = page.locator('[data-experience-hub="true"]');
    await expect(hub).toBeVisible();
    await expect(hub.getByRole("heading", { name: /escolha como quer explorar este portfólio/i })).toBeVisible();

    await expect(hub.locator('[data-experience-route="true"]')).toHaveCount(3);

    await hub.getByRole("tab", { name: /quero contratar/i }).click();
    await expect(hub.locator('[data-experience-panel="client"]')).toBeVisible();
    await expect(hub.getByRole("link", { name: /diagnosticar meu projeto/i })).toHaveAttribute("href", "#diagnostico");

    await hub.getByRole("tab", { name: /quero avaliar seu perfil/i }).click();
    await expect(hub.locator('[data-experience-panel="recruiter"]')).toBeVisible();
    await expect(hub.getByRole("link", { name: /abrir perfil profissional/i })).toHaveAttribute("href", "#perfil-profissional");

    await hub.getByRole("tab", { name: /quero explorar/i }).click();
    await expect(hub.locator('[data-experience-panel="explorer"]')).toBeVisible();
    await expect(hub.getByRole("link", { name: /ver projetos selecionados/i })).toHaveAttribute("href", "#projetos");
  });

  test("experience hub oferece navegação premium por teclado e progresso de rota", async ({ page }) => {
    await page.goto("/");

    const hub = page.locator('[data-experience-hub="true"]');
    const routes = hub.getByRole("tab");
    await expect(routes).toHaveCount(3);

    const first = routes.nth(0);
    const second = routes.nth(1);
    const third = routes.nth(2);

    await first.focus();
    await page.keyboard.press("ArrowDown");
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute("aria-selected", "true");
    await expect(hub.locator('[data-experience-panel="recruiter"]')).toBeVisible();
    await expect(hub.locator('[data-experience-progress="true"]')).toHaveAttribute("aria-valuenow", "2");

    await page.keyboard.press("End");
    await expect(third).toBeFocused();
    await expect(third).toHaveAttribute("aria-selected", "true");
    await expect(hub.locator('[data-experience-progress="true"]')).toHaveAttribute("aria-valuenow", "3");

    await page.keyboard.press("Home");
    await expect(first).toBeFocused();
    await expect(first).toHaveAttribute("aria-selected", "true");
    await expect(hub.locator('[data-experience-progress="true"]')).toHaveAttribute("aria-valuenow", "1");
  });

  test("experience hub vira uma navegação compacta e confortável no mobile", async ({ page }) => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/");

      const hub = page.locator('[data-experience-hub="true"]');
      await hub.scrollIntoViewIfNeeded();

      const routeStrip = hub.locator('[data-experience-route-strip="true"]');
      await expect(routeStrip).toBeVisible();
      await expect(hub.locator('[data-experience-route="true"]')).toHaveCount(3);

      const stripOverflow = await routeStrip.evaluate((element) => ({
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        overflowX: getComputedStyle(element).overflowX,
      }));
      expect(stripOverflow.scrollWidth).toBeGreaterThan(stripOverflow.clientWidth);
      expect(["auto", "scroll"]).toContain(stripOverflow.overflowX);

      const firstRoute = hub.locator('[data-experience-route="true"]').first();
      const routeBox = await firstRoute.boundingBox();
      expect(routeBox?.height ?? 0).toBeGreaterThanOrEqual(64);
      expect(routeBox?.height ?? 999).toBeLessThanOrEqual(84);

      const progress = hub.locator('[data-experience-progress="true"]');
      expect(await progress.evaluate((element) => getComputedStyle(element).position)).toBe("static");

      const panel = hub.locator('[data-experience-panel="client"]');
      await expect(panel).toBeVisible();
      const cta = panel.getByRole("link", { name: /diagnosticar meu projeto/i });
      const ctaBox = await cta.boundingBox();
      expect(ctaBox?.height ?? 0).toBeGreaterThanOrEqual(48);
      expect(ctaBox?.width ?? 0).toBeGreaterThanOrEqual(width - 64);

      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    }
  });

});
