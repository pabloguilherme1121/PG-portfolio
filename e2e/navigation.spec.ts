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

  test("jogo da velha oferece pausa interativa acessível e reiniciável", async ({ page }) => {
    await page.goto("/");

    const game = page.locator('[data-tic-tac-toe="true"]');
    await expect(game).toHaveCount(0);
    await page.getByRole("button", { name: /abrir.*pg arcade|abrir.*pg lab|jogar.*pg arcade|jogar.*jogo da velha/i }).click();
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

  test("PG Arcade combina presets rápidos, controles avançados e modo local", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /abrir.*pg arcade|abrir.*pg lab|jogar.*pg arcade|jogar.*jogo da velha/i }).click();

    const game = page.locator('[data-tic-tac-toe="true"]');
    const presets = game.locator('[data-arcade-presets="true"]');
    await expect(presets.getByRole("button")).toHaveCount(4);
    await expect(presets.getByRole("button", { name: /rápido/i })).toHaveAttribute("aria-pressed", "true");

    await presets.getByRole("button", { name: /competir/i }).click();
    const advanced = game.locator('[data-arcade-advanced="true"]');
    await advanced.locator("summary").click();
    await expect(game.getByRole("button", { name: "impossível", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(game.getByRole("button", { name: "MD3", exact: true })).toHaveAttribute("aria-pressed", "true");

    await presets.getByRole("button", { name: /sobrevivência/i }).click();
    await expect(game.getByRole("button", { name: "impossível", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(game.getByRole("button", { name: "MD5", exact: true })).toHaveAttribute("aria-pressed", "true");

    await presets.getByRole("button", { name: /dupla/i }).click();
    await expect(game.getByRole("button", { name: /duas pessoas/i })).toHaveAttribute("aria-pressed", "true");

    const cells = game.locator('[data-game-cell="true"]');
    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText("X");
    await expect(game.locator('[data-game-cell="true"]:has-text("O")')).toHaveCount(0);
    await cells.nth(1).click();
    await expect(cells.nth(1)).toHaveText("O");

    await game.getByRole("button", { name: /reiniciar partida/i }).click();
    await expect(game.locator('[data-match-score="true"]')).toContainText("0");
  });

  test("PG Arcade oferece dica estratégica e recupera progressão local", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("pablo-pg-arcade-stats", JSON.stringify({
        games: 5,
        wins: 3,
        losses: 0,
        draws: 2,
        currentWinStreak: 3,
        bestWinStreak: 3,
      }));
    });
    await page.goto("/");
    await page.getByRole("button", { name: /abrir.*pg arcade|abrir.*pg lab|jogar.*pg arcade|jogar.*jogo da velha/i }).click();

    const game = page.locator('[data-tic-tac-toe="true"]');
    await expect(game.locator('[data-arcade-stats="true"]')).toContainText("5");
    await expect(game.locator('[data-arcade-stats="true"]')).toContainText("60%");
    const streakProgress = game.locator('[data-arcade-streak-progress="true"]');
    await expect(streakProgress).toContainText(/sequência atual 3/i);
    await expect(streakProgress).toContainText(/meta 5/i);
    await expect(streakProgress.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "60");
    await expect(game.locator('[data-arcade-achievement="primeira-vitoria"]')).toBeVisible();
    await expect(game.locator('[data-arcade-achievement="trinca"]')).toBeVisible();
    await expect(game.locator('[data-arcade-achievement="invicto"]')).toBeVisible();

    await game.getByRole("button", { name: /dica estratégica/i }).click();
    await expect(game.locator('[data-hint-cell="true"]')).toHaveCount(1);
    await expect(game.locator('[data-hint-cell="true"]')).toHaveAttribute("aria-label", /dica sugerida/i);

    const hintCell = game.locator('[data-hint-cell="true"]');
    await hintCell.click();
    await expect(game.locator('[data-hint-cell="true"]')).toHaveCount(0);
  });

  test("PG Arcade registra a última rodada e usa feedback tátil quando disponível", async ({ page }) => {
    await page.addInitScript(() => {
      const target = window as Window & { __arcadeVibrations?: Array<number | number[]> };
      target.__arcadeVibrations = [];
      Object.defineProperty(navigator, "vibrate", {
        configurable: true,
        value: (pattern: number | number[]) => {
          target.__arcadeVibrations?.push(pattern);
          return true;
        },
      });
    });
    await page.goto("/");
    await page.getByRole("button", { name: /jogar.*pg arcade/i }).click();

    const game = page.locator('[data-tic-tac-toe="true"]');
    await game.locator('[data-arcade-presets="true"]').getByRole("button", { name: /dupla/i }).click();
    const cells = game.locator('[data-game-cell="true"]');
    for (const index of [0, 3, 1, 4, 2]) await cells.nth(index).click();

    await expect(game.locator('[data-arcade-last-result="true"]')).toContainText(/vitória/i);
    const vibrations = await page.evaluate(() => (window as Window & { __arcadeVibrations?: Array<number | number[]> }).__arcadeVibrations ?? []);
    expect(vibrations).toContain(12);
    expect(vibrations.some((pattern) => Array.isArray(pattern) && pattern.join(",") === "25,35,45")).toBeTruthy();
  });

  test("PG Arcade respeita a troca para O e deixa o PG Bot abrir com X", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /abrir.*pg arcade|abrir.*pg lab|jogar.*pg arcade|jogar.*jogo da velha/i }).click();

    const game = page.locator('[data-tic-tac-toe="true"]');
    await game.locator('[data-arcade-advanced="true"] summary').click();
    await game.getByRole("button", { name: /jogar com o símbolo x/i }).click();

    await expect(game.locator('[data-game-cell="true"]:has-text("X")')).toHaveCount(1);
    await expect(game.locator('[data-game-cell="true"]:has-text("O")')).toHaveCount(0);
    await expect(game.locator('[data-game-status="true"]')).toContainText(/sua vez.*O/i);
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
    await page.goto("/#perfil-profissional");

    const profile = page.locator('[data-professional-snapshot="true"]');
    await expect(profile).toBeVisible();
    await profile.locator('[data-professional-proof-id="resume"]').click();

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

  test("mantém currículo web fora do carregamento inicial e preserva a âncora", async ({ page }) => {
    const resumeRequests: string[] = [];
    page.on("request", (request) => {
      if (/PortfolioWebResume/i.test(request.url())) resumeRequests.push(request.url());
    });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(resumeRequests).toEqual([]);
    await expect(page.locator("#curriculo-web")).toHaveCount(1);

    await page.goto("/#curriculo-web");
    await expect(page.locator('[data-web-resume="true"]')).toBeVisible();
    await expect.poll(() => resumeRequests.length).toBeGreaterThan(0);
  });

  test("carrega a prévia PDF apenas quando existe intenção do visitante", async ({ page }) => {
    const previewRequests: string[] = [];
    page.on("request", (request) => {
      if (/PortfolioResumePreview/i.test(request.url())) previewRequests.push(request.url());
    });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(previewRequests).toEqual([]);

    const resumeAction = page.locator('[data-resume-header="true"]').first();
    if (await resumeAction.count()) {
      await expect(resumeAction).toBeVisible();
      await resumeAction.hover();
      await expect.poll(() => previewRequests.length).toBeGreaterThan(0);

      await resumeAction.click();
      await expect(page.getByRole("dialog", { name: /portfólio de Pablo Guilherme/i })).toBeVisible();
    }
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

  test("mantém estudos de caso fora do carregamento inicial e preserva acesso direto", async ({ page }) => {
    const caseStudyRequests: string[] = [];
    page.on("request", (request) => {
      if (/PortfolioCaseStudies/i.test(request.url())) caseStudyRequests.push(request.url());
    });

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(caseStudyRequests).toEqual([]);
    await expect(page.locator("#estudos-de-caso")).toHaveCount(1);

    await page.goto("/#estudos-de-caso");
    await expect(page.locator('[data-case-study="true"]')).toHaveCount(2);
    await expect.poll(() => caseStudyRequests.length).toBeGreaterThan(0);
  });

  test("estudos de caso levam a evidências verificáveis", async ({ page }) => {
    await page.goto("/");
    await page.locator("#estudos-de-caso").scrollIntoViewIfNeeded();

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
    await page.locator("#estudos-de-caso").scrollIntoViewIfNeeded();

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

  test("detalhes completos do projeto carregam apenas quando o visitante abre o modal", async ({ page }) => {
    await page.goto("/#projetos");

    const beforeResources = await page.evaluate(() =>
      performance.getEntriesByType("resource").map((entry) => entry.name),
    );
    expect(beforeResources.some((url) => url.includes("PortfolioProjectDetailsDialog"))).toBeFalsy();

    const featured = page.locator('[data-featured-project="TEC.09"]');
    await expect(featured).toBeVisible();
    await featured.getByRole("button", { name: /ver detalhes.*trajeto/i }).click();

    await expect(page.locator('[data-project-details-dialog="true"]')).toBeVisible();
    await expect.poll(async () =>
      page.evaluate(() =>
        performance.getEntriesByType("resource").some((entry) => entry.name.includes("PortfolioProjectDetailsDialog")),
      ),
    ).toBeTruthy();
  });

  test("projeto destacado responde à posição do toque para feedback visual contextual", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.locator("#projetos").scrollIntoViewIfNeeded();
    const card = page.locator('[data-featured-project="TEC.09"]');
    await expect(card).toBeVisible();
    await card.scrollIntoViewIfNeeded();
    const box = await card.boundingBox();
    expect(box).not.toBeNull();

    await card.dispatchEvent("pointerdown", {
      pointerType: "touch",
      clientX: (box?.x ?? 0) + 54,
      clientY: (box?.y ?? 0) + 86,
    });

    const vars = await card.evaluate((element) => ({
      x: (element as HTMLElement).style.getPropertyValue("--project-x"),
      y: (element as HTMLElement).style.getPropertyValue("--project-y"),
    }));
    expect(vars.x).toMatch(/px$/);
    expect(vars.y).toMatch(/px$/);
  });

  test("projetos destacados mostram estado, prova direta e detalhes separados", async ({ page }) => {
    await page.goto("/");

    await page.locator("#projetos").scrollIntoViewIfNeeded();
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

    await page.locator("#inicio").getByRole("link", { name: /começar diagnóstico/i }).click();
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

    await page.locator("#projetos").scrollIntoViewIfNeeded();
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
    await expect(page.locator(".archive-chapter").first()).toHaveCSS("content-visibility", "auto");
    expect((await page.locator(".arquivo-page").evaluate((element) => getComputedStyle(element).textRendering)).toLowerCase()).toBe("optimizespeed");

    const primaryCta = page.locator("#inicio").getByRole("link", { name: /começar diagnóstico/i });
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

      await page.getByRole("button", { name: /abrir.*pg arcade|abrir.*pg lab|jogar.*pg arcade|jogar.*jogo da velha/i }).click();
      const game = page.locator('[data-tic-tac-toe="true"]');
      await game.scrollIntoViewIfNeeded();
      await expect.poll(() => game.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy();

      await expect(game.locator('[data-arcade-presets="true"]').getByRole("button")).toHaveCount(4);
      const presetColumns = await game.locator('[data-arcade-preset-grid="true"]').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(" ").length);
      expect(presetColumns).toBe(2);
      await game.locator('[data-arcade-advanced="true"] summary').click();

      for (const name of [/contra (o )?bot/i, /duas pessoas/i, /fácil/i, /normal/i, /impossível/i, /reiniciar partida/i]) {
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

  test("hero mobile em 320px transforma provas em rail de swipe sem comprimir leitura", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/");

    const rail = page.locator('[data-mobile-hero-proof-rail="true"]');
    await expect(rail).toBeVisible();
    const metrics = await rail.evaluate((element) => {
      const style = getComputedStyle(element);
      const first = element.querySelector<HTMLElement>('[data-mobile-hero-proof="true"]');
      return {
        display: style.display,
        overflowX: style.overflowX,
        scrollSnapType: style.scrollSnapType,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        firstWidth: first?.getBoundingClientRect().width ?? 0,
      };
    });

    expect(metrics.display).toBe("flex");
    expect(["auto", "scroll"]).toContain(metrics.overflowX);
    expect(metrics.scrollSnapType).toContain("x");
    expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
    expect(metrics.firstWidth).toBeGreaterThanOrEqual(220);
  });

  test("primeira dobra mobile mantém a ação legível e deixa provas detalhadas sob demanda", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/");
    const hero = page.locator("#inicio");
    const primaryAction = hero.getByRole("link", { name: /começar diagnóstico/i });
    const proofDeck = hero.locator('[data-attention-hook="proof-deck"]');
    const disclosure = proofDeck.getByRole("button", { name: /explorar provas/i });

    await expect(disclosure).toHaveAttribute("aria-expanded", "false");
    await expect(proofDeck.getByRole("heading", { name: /provas que você pode abrir/i })).toBeHidden();
    const firstFoldAction = await primaryAction.boundingBox();
    expect((firstFoldAction?.y ?? 1000) + (firstFoldAction?.height ?? 0)).toBeLessThan(760);
    await disclosure.click();
    await expect(disclosure).toHaveAttribute("aria-expanded", "true");
    await expect(proofDeck.getByRole("heading", { name: /provas que você pode abrir/i })).toBeVisible();
    await proofDeck.getByRole("button", { name: "qualidade", exact: true }).click();
    await expect(proofDeck).toContainText(/Typecheck|Vitest|Playwright/i);

    await page.setViewportSize({ width: 390, height: 844 });
    const wideAction = await primaryAction.boundingBox();
    expect(wideAction?.width ?? 0).toBeGreaterThanOrEqual(320);
    expect(wideAction?.height ?? 1000).toBeLessThanOrEqual(60);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });

  test("mobile incorpora hierarquia visual do mockup sem aumentar a carga de navegação", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const heroProofs = page.locator('[data-mobile-hero-proof-rail="true"]');
    await expect(heroProofs).toBeVisible();
    await expect(heroProofs.locator('[data-mobile-hero-proof="true"]')).toHaveCount(3);

    await page.locator('[data-mobile-menu-toggle="true"]').click();
    const menu = page.locator("#mobile-navigation");
    const profile = menu.locator('[data-mobile-menu-profile="true"]');
    await expect(profile).toBeVisible();
    await expect(profile).toContainText(/Pablo Guilherme/i);
    await expect(profile).toContainText(/produtos digitais/i);
    await expect(profile).toContainText(/agenda.*consulta|sob consulta/i);

    await page.locator('[data-mobile-menu-toggle="true"]').click();
    const dock = page.locator('[data-mobile-contact-bar="true"]');
    await expect(dock).toHaveAttribute("data-mobile-dock", "true");
    await expect(dock.locator('[data-mobile-primary-action="true"]')).toHaveAttribute("data-mobile-dock-primary", "true");
    await expect(dock.locator('[data-mobile-dock-secondary="true"]')).toBeVisible();
    await expect(dock.locator('[data-mobile-dock-secondary="true"]')).toHaveAttribute("href", "#servicos");
    await expect(dock.locator('[data-mobile-dock-progress="true"]')).toHaveCount(1);
    await expect(dock.locator('[data-mobile-context-action="true"]')).toHaveCount(0);

    await page.getByRole("button", { name: /abrir.*pg arcade|jogar.*pg arcade/i }).click();
    await expect(dock).toHaveAttribute("data-mobile-dock-hidden", "true");
    const game = page.locator('[data-tic-tac-toe="true"]');
    await expect(game.locator('[data-arcade-preset-card="true"]')).toHaveCount(4);
    await expect(game.locator('[data-arcade-preset-card="true"]').nth(0)).toContainText(/contra.*bot|contra.*ia/i);
    await expect(game.locator('[data-arcade-preset-card="true"]').nth(1)).toContainText(/impossível|estratégia/i);
    await expect(game.locator('[data-arcade-preset-card="true"]').nth(2)).toContainText(/local|1.*1/i);
    await expect(game.locator('[data-arcade-preset-card="true"]').nth(3)).toContainText(/sobrevivência|MD5/i);
  });

  test("economia de dados evita preload especulativo mas mantém Arcade funcional no toque", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: { saveData: true, effectiveType: "2g" },
      });
    });

    const optionalRequests: string[] = [];
    page.on("request", (request) => {
      if (/Portfolio(TicTacToe|ResumePreview)/i.test(request.url())) optionalRequests.push(request.url());
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const arcadeControl = page.locator('[data-arcade-open-control="true"]');
    await arcadeControl.hover();
    expect(optionalRequests.filter((url) => /PortfolioTicTacToe/i.test(url))).toEqual([]);

    await arcadeControl.click();
    await expect(page.locator('[data-tic-tac-toe="true"]')).toBeVisible();
    await expect.poll(() => optionalRequests.filter((url) => /PortfolioTicTacToe/i.test(url)).length).toBeGreaterThan(0);
  });

  test("header mobile mostra seção atual e progresso da jornada", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const context = page.locator('[data-mobile-scroll-context="true"]');
    await expect(context).toBeVisible();
    await expect(context.locator('[data-mobile-current-section="true"]')).toContainText(/início/i);
    await expect(context.locator('[data-mobile-progress-value="true"]')).toContainText(/%/);

    const ring = context.locator('[data-mobile-progress-ring="true"]');
    const initialProgress = Number(await ring.getAttribute("data-progress"));
    expect(initialProgress).toBeGreaterThanOrEqual(0);

    await page.locator("#projetos").scrollIntoViewIfNeeded();
    await expect(page.locator('[data-featured-project-strip="true"]')).toBeVisible();
    await page.locator("#projetos").scrollIntoViewIfNeeded();
    await expect.poll(async () => (await context.locator('[data-mobile-current-section="true"]').textContent()) ?? "")
      .toMatch(/projetos|observatório/i);
    await expect.poll(async () => Number(await ring.getAttribute("data-progress"))).toBeGreaterThan(initialProgress);

    const box = await context.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(48);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  });

  test("mobile esconde o dock enquanto o menu está aberto", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator("#diagnostico").scrollIntoViewIfNeeded();

    const dock = page.locator('[data-mobile-contact-bar="true"]');
    await expect(dock).toHaveAttribute("data-mobile-dock-hidden", "false");

    await page.locator('[data-mobile-menu-toggle="true"]').click();
    await expect(page.locator("#mobile-navigation")).toBeVisible();
    await expect(dock).toHaveAttribute("data-mobile-dock-hidden", "true");
    await expect(dock).toHaveAttribute("aria-hidden", "true");

    await page.locator('[data-mobile-menu-toggle="true"]').click();
    await expect(dock).toHaveAttribute("data-mobile-dock-hidden", "false");
  });

  test("dock mobile reduz detalhes ao descer e restaura ao subir, sem cobrir o teclado", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const dock = page.locator('[data-mobile-dock="true"]');
    const expandedHeight = (await dock.boundingBox())?.height ?? 0;
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(dock).toHaveAttribute("data-mobile-dock-compact", "true");
    expect((await dock.boundingBox())?.height ?? 0).toBeLessThan(expandedHeight);
    await page.evaluate(() => window.scrollTo(0, 450));
    await expect(dock).toHaveAttribute("data-mobile-dock-compact", "false");
    await page.locator("#contato-briefing").scrollIntoViewIfNeeded();
    await page.locator('#contato-briefing input[name="name"]').focus();
    await expect(dock).toHaveAttribute("data-mobile-dock-hidden", "true");
  });

  test("dock oculto pelo CTA do hero não recebe foco até voltar a aparecer", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.goto("/");

    const dock = page.locator('[data-mobile-dock="true"]');
    await page.locator('[data-hero-cta="true"]').scrollIntoViewIfNeeded();
    await expect(dock).toHaveAttribute("data-mobile-dock-hidden", "true");
    await expect(dock).toHaveAttribute("aria-hidden", "true");
    await expect(dock).toHaveAttribute("inert", "");

    await page.locator("#diagnostico").scrollIntoViewIfNeeded();
    await expect(dock).toHaveAttribute("data-mobile-dock-hidden", "false");
    await expect(dock).not.toHaveAttribute("aria-hidden", "true");
    await expect(dock).not.toHaveAttribute("inert", "");
  });

  test("cards de projeto oferecem prévia local com prova e fechamento por teclado", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    await page.goto("/#projetos");
    const card = page.locator('[data-featured-project]').first();
    const toggle = card.getByRole("button", { name: /prévia rápida/i });
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(card.getByRole("region", { name: /prévia do projeto/i })).toBeVisible();
    await toggle.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("Observatório apresenta problema, solução e prova em uma leitura guiada", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto("/#observatorio");
    const caseStudy = page.locator("#observatorio");
    await expect(caseStudy.getByRole("button", { name: "Problema" })).toHaveAttribute("aria-pressed", "true");
    await caseStudy.getByRole("button", { name: "Solução" }).click();
    await expect(caseStudy.getByRole("button", { name: "Solução" })).toHaveAttribute("aria-pressed", "true");
    await expect(caseStudy.locator('[data-observatorio-insight="true"]')).toContainText(/interface|indicadores/i);
  });

  test("Observatório mostra capturas reais adaptativas com troca acessível de formato", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#observatorio");
    const story = page.locator("#observatorio");
    const desktop = story.getByRole("button", { name: "Desktop" });
    const mobile = story.getByRole("button", { name: "Mobile" });
    const capture = story.locator('[data-observatorio-capture="true"]');

    await expect(mobile).toHaveAttribute("aria-pressed", "true");
    await expect(capture).toHaveAttribute("src", /observatorio-dashboard-mobile\.png$/);
    await capture.scrollIntoViewIfNeeded();
    await expect(capture).toHaveJSProperty("naturalWidth", 351);
    await expect(story.getByText(/captura da interface publicada/i)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await desktop.focus();
    await page.keyboard.press("Enter");
    await expect(capture).toHaveAttribute("src", /observatorio-dashboard-desktop\.png$/);
    await expect(capture).toHaveJSProperty("naturalWidth", 1376);
  });

  test("nova leitura mobile preserva largura e ações entre 320 e 430px, landscape e zoom", async ({ page }) => {
    for (const width of [320, 360, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/#projetos");
      await expect(page.locator("#observatorio")).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      const action = page.locator("#observatorio").getByRole("button", { name: "Solução" });
      const box = await action.boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
    }
    await page.setViewportSize({ width: 844, height: 390 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.setViewportSize({ width: 640, height: 844 });
    await page.evaluate(() => { document.documentElement.style.zoom = "2"; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });

  test("mobile compartilha o portfólio pela API nativa sem poluir a navegação", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "__portfolioShareCalls", { value: 0, writable: true });
      Object.defineProperty(window, "__portfolioSharePayload", { value: null, writable: true });
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: async (payload: ShareData) => {
          const target = window as Window & { __portfolioShareCalls: number; __portfolioSharePayload: ShareData | null };
          target.__portfolioShareCalls += 1;
          target.__portfolioSharePayload = payload;
        },
      });
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator('[data-mobile-menu-toggle="true"]').click();

    const action = page.locator('[data-mobile-share-action="true"]');
    await expect(action).toBeVisible();
    await expect(action).toContainText(/compartilhar/i);
    await action.click();

    await expect.poll(() =>
      page.evaluate(() => (window as Window & { __portfolioShareCalls: number }).__portfolioShareCalls),
    ).toBe(1);
    const payload = await page.evaluate(() =>
      (window as Window & { __portfolioSharePayload: ShareData | null }).__portfolioSharePayload,
    );
    expect(payload?.title).toMatch(/Pablo Guilherme/i);
    expect(payload?.url).toBe(new URL("/", baseURL).toString());
    await expect(action).toContainText(/compartilhado/i);
  });

  test("mobile oferece instalação PWA apenas quando o navegador disponibiliza", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(window, "__pwaPromptCalls", { value: 0, writable: true });
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.evaluate(() => {
      const event = new Event("beforeinstallprompt", { cancelable: true });
      Object.defineProperty(event, "prompt", {
        value: async () => {
          const target = window as Window & { __pwaPromptCalls: number };
          target.__pwaPromptCalls += 1;
        },
      });
      Object.defineProperty(event, "userChoice", {
        value: Promise.resolve({ outcome: "accepted", platform: "web" }),
      });
      window.dispatchEvent(event);
    });

    await page.locator('[data-mobile-menu-toggle="true"]').click();
    const installAction = page.locator('[data-mobile-install-action="true"]');
    await expect(installAction).toBeVisible();
    await expect(installAction).toContainText(/instalar/i);
    await installAction.click();

    await expect.poll(() =>
      page.evaluate(() => (window as Window & { __pwaPromptCalls: number }).__pwaPromptCalls),
    ).toBe(1);
    await expect(installAction).toHaveCount(0);
  });

  test("menu mobile é carregado apenas quando o visitante abre a navegação", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const beforeResources = await page.evaluate(() =>
      performance.getEntriesByType("resource").map((entry) => entry.name),
    );
    expect(beforeResources.some((url) => url.includes("PortfolioMobileMenu"))).toBeFalsy();
    await expect(page.locator("#mobile-navigation")).toHaveCount(0);

    await page.locator('[data-mobile-menu-toggle="true"]').click();

    await expect(page.locator("#mobile-navigation")).toBeVisible();
    await expect.poll(async () =>
      page.evaluate(() =>
        performance.getEntriesByType("resource").some((entry) => entry.name.includes("PortfolioMobileMenu")),
      ),
    ).toBeTruthy();
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
    await expect(mobileNavigation.getByRole("link", { name: "03 / serviços", exact: true })).toBeVisible();
    await expect(mobileNavigation.getByRole("link", { name: /contato/i })).toBeVisible();
    expect(await mobileNavigation.getByRole("link").count()).toBeLessThanOrEqual(7);

    await mobileMenuButton.click();
    const mobilePrimaryAction = page.locator('[data-mobile-primary-action="true"]');
    await expect(mobilePrimaryAction).toBeVisible();
    await expect(mobilePrimaryAction).toHaveAttribute("href", "#diagnostico");
    await expect(mobilePrimaryAction).toContainText(/começar/i);
    const actionBox = await mobilePrimaryAction.boundingBox();
    expect(actionBox?.height ?? 0).toBeGreaterThanOrEqual(48);
    expect(actionBox?.width ?? 0).toBeGreaterThanOrEqual(160);
  });

  test("menu mobile prioriza próxima ação e evita atalhos redundantes", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");
    await page.locator('[data-mobile-menu-toggle="true"]').click();

    const menu = page.locator("#mobile-navigation");
    const nextAction = menu.locator('[data-mobile-menu-primary="true"]');
    const shortcuts = menu.locator('[data-mobile-shortcuts="true"]');

    await expect(nextAction).toHaveAttribute("href", "#diagnostico");
    await expect(nextAction).toContainText(/começar diagnóstico/i);
    await expect(shortcuts.getByRole("link")).toHaveCount(2);
    await expect(shortcuts.getByRole("link", { name: /serviços/i })).toHaveAttribute("href", "#servicos");
    await expect(shortcuts.getByRole("link", { name: /observatório/i })).toBeVisible();

    const box = await nextAction.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(48);
  });

  test("mobile adapta atalhos à rota e retoma briefing automaticamente", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator('[data-experience-hub="true"]').scrollIntoViewIfNeeded();

    const quickBar = page.locator('[data-mobile-contact-bar="true"]');
    const primaryAction = page.locator('[data-mobile-primary-action="true"]');
    const secondaryAction = page.locator('[data-mobile-dock-secondary="true"]');
    const whatsappAction = page.locator('[data-mobile-whatsapp-action="true"]');

    await expect(quickBar).toBeVisible();
    await expect(quickBar.locator('[data-mobile-context-action="true"]')).toHaveCount(0);
    await expect(primaryAction).toHaveAttribute("href", "#diagnostico");
    await expect(secondaryAction).toHaveAttribute("href", "#servicos");
    await expect(primaryAction).toContainText(/começar/i);
    await expect(primaryAction.locator('[data-mobile-journey-hint="true"]')).toContainText(/diagnóstico.*briefing.*contato/i);
    await expect(whatsappAction).toBeVisible();

    const hub = page.locator('[data-experience-hub="true"]');
    await hub.getByRole("tab", { name: /quero avaliar seu perfil/i }).click();
    await expect(primaryAction).toHaveAttribute("href", "#perfil-profissional");
    await expect(primaryAction).toContainText(/ver perfil/i);
    await expect(primaryAction.locator('[data-mobile-journey-hint="true"]')).toContainText(/perfil.*provas.*contato/i);
    await expect(secondaryAction).toHaveAttribute("href", "#curriculo-web");

    await page.reload();
    await page.locator('[data-experience-hub="true"]').scrollIntoViewIfNeeded();
    await expect(hub.getByRole("tab", { name: /quero avaliar seu perfil/i })).toHaveAttribute("aria-selected", "true");
    await expect(primaryAction).toHaveAttribute("href", "#perfil-profissional");

    await hub.getByRole("tab", { name: /quero explorar/i }).click();
    await expect(primaryAction).toHaveAttribute("href", "#projetos");
    await expect(primaryAction).toContainText(/explorar/i);
    await expect(primaryAction.locator('[data-mobile-journey-hint="true"]')).toContainText(/projetos.*cases.*código/i);
    await expect(secondaryAction).toHaveAttribute("href", "#pg-lab");

    await page.locator("#contato-briefing").scrollIntoViewIfNeeded();
    await page.locator('#contato-briefing input[name="name"]').fill("Visitante mobile");
    await page.locator("#contato").getByRole("heading", { name: /solução clara/i }).click();

    await expect(primaryAction).toHaveAttribute("href", "#contato-briefing");
    await expect(primaryAction).toContainText(/retomar/i);
    await expect(primaryAction.locator('[data-mobile-journey-hint="true"]')).toContainText(/briefing salvo/i);

    for (const action of [primaryAction, secondaryAction, whatsappAction]) {
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
    await expect(menu.locator('[data-mobile-menu-primary="true"]')).toHaveAttribute("href", "#diagnostico");
    await expect(shortcuts.getByRole("link", { name: /serviços/i })).toHaveAttribute("href", "#servicos");
    await expect(shortcuts.getByRole("link", { name: /observatório/i })).toHaveAttribute("href", /observatorio/);

    const shortcutLinks = shortcuts.getByRole("link");
    expect(await shortcutLinks.count()).toBe(2);
    for (let index = 0; index < 2; index += 1) {
      const box = await shortcutLinks.nth(index).boundingBox();
      expect(box?.height ?? 0).toBeGreaterThanOrEqual(48);
    }
  });

  test("atalho mobile contextual leva exploradores direto ao PG Arcade", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const hub = page.locator('[data-experience-hub="true"]');
    await hub.scrollIntoViewIfNeeded();
    await hub.getByRole("tab", { name: /quero explorar/i }).click();

    await page.locator('[data-mobile-menu-toggle="true"]').click();
    const shortcut = page.locator('[data-mobile-shortcut-contextual="true"]');
    await expect(shortcut).toHaveAttribute("href", "#pg-lab");
    await expect(shortcut).toContainText(/PG Arcade/i);
    await shortcut.click();

    await expect(page.locator("#pg-lab")).toBeVisible();
    await expect(page.locator('[data-tic-tac-toe="true"]')).toBeVisible();
  });

  test("mobile torna a paginação dos projetos destacadas clicável e sincronizada", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const projects = page.locator("#projetos");
    await projects.scrollIntoViewIfNeeded();

    const strip = projects.locator('[data-featured-project-strip="true"]');
    const pagination = projects.locator('[data-featured-pagination="true"]');
    const cards = strip.locator("[data-featured-project]");

    await expect(strip).toHaveAttribute("aria-busy", "false");
    await expect(cards.first()).toBeVisible();
    const cardCount = await cards.count();

    await expect(pagination).toBeVisible();
    await expect(pagination.locator("button")).toHaveCount(cardCount);
    await expect(projects.locator('[data-featured-active-label="true"]')).toHaveText(`1 / ${cardCount}`);

    if (cardCount > 1) {
      const second = pagination.locator("button").nth(1);
      const initialScroll = await strip.evaluate((element) => element.scrollLeft);
      await second.click();
      await expect(second).toHaveAttribute("aria-current", "true");
      await expect(projects.locator('[data-featured-active-label="true"]')).toHaveText(`2 / ${cardCount}`);
      await expect.poll(() => strip.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialScroll);
    }
  });

  test("mobile apresenta projetos destacados em showcase horizontal por swipe", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const projects = page.locator("#projetos");
    await projects.scrollIntoViewIfNeeded();

    const strip = projects.locator('[data-featured-project-strip="true"]');
    await expect(strip).toBeVisible();
    await expect(strip).toHaveCSS("overflow-x", "auto");
    await expect(strip).toHaveCSS("scroll-snap-type", /x/);
    await expect(strip).toHaveCSS("touch-action", /pan-x pan-y|pan-y pan-x/);

    await expect(strip).toHaveAttribute("aria-busy", "false");
    const cards = strip.locator("[data-featured-project]");
    await expect(cards.first()).toBeVisible();
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(1);
    const firstBox = await cards.first().boundingBox();
    expect(firstBox?.width ?? 0).toBeLessThan(390);
    expect(firstBox?.width ?? 0).toBeGreaterThanOrEqual(280);

    if (cardCount > 1) {
      const initialScroll = await strip.evaluate((element) => element.scrollLeft);
      await strip.evaluate((element) => element.scrollTo({ left: element.scrollWidth, behavior: "instant" as ScrollBehavior }));
      await expect.poll(() => strip.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialScroll);
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  });

  test("mobile transforma serviços em explorador compacto por toque", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#servicos");

    const services = page.locator("#servicos");
    await services.scrollIntoViewIfNeeded();

    const tabs = services.locator('[data-service-selector="true"] [role="tab"]');
    await expect(tabs).toHaveCount(2);
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "false");

    const panels = services.locator('[data-service-panel="true"]');
    await expect(panels).toHaveCount(2);
    await expect(panels.nth(0)).toBeVisible();
    await expect(panels.nth(1)).toBeHidden();

    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(panels.nth(0)).toBeHidden();
    await expect(panels.nth(1)).toBeVisible();
    await expect(panels.nth(1).getByRole("link", { name: /iniciar briefing/i })).toBeVisible();

    const selectedBox = await panels.nth(1).boundingBox();
    expect(selectedBox?.width ?? 0).toBeLessThanOrEqual(390);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  });

  test("mobile torna a paginação do processo clicável e sincronizada", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#processo");

    const process = page.locator("#processo");
    await process.scrollIntoViewIfNeeded();

    const strip = process.locator('[data-process-strip="true"]');
    const pagination = process.locator('[data-process-pagination="true"]');
    const buttons = pagination.locator("button");

    await expect(pagination).toBeVisible();
    await expect(buttons).toHaveCount(3);
    await expect(buttons.first()).toHaveAttribute("aria-current", "step");
    await expect(process.locator('[data-process-active-label="true"]')).toHaveText("1 / 3");

    const initialScroll = await strip.evaluate((element) => element.scrollLeft);
    await buttons.nth(2).click();
    await expect(buttons.nth(2)).toHaveAttribute("aria-current", "step");
    await expect(process.locator('[data-process-active-label="true"]')).toHaveText("3 / 3");
    await expect.poll(() => strip.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialScroll);
  });

  test("mobile transforma o processo em linha do tempo horizontal por swipe", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#processo");

    const process = page.locator("#processo");
    await process.scrollIntoViewIfNeeded();

    const strip = process.locator('[data-process-strip="true"]');
    await expect(strip).toBeVisible();
    await expect(strip).toHaveCSS("overflow-x", "auto");
    await expect(strip).toHaveCSS("scroll-snap-type", /x/);
    await expect(strip).toHaveCSS("touch-action", /pan-x pan-y|pan-y pan-x/);

    const steps = strip.locator('[data-process-step="true"]');
    await expect(steps).toHaveCount(3);
    const firstBox = await steps.first().boundingBox();
    expect(firstBox?.width ?? 0).toBeGreaterThanOrEqual(280);
    expect(firstBox?.width ?? 0).toBeLessThan(390);

    const initialScroll = await strip.evaluate((element) => element.scrollLeft);
    await strip.evaluate((element) => element.scrollTo({ left: element.scrollWidth, behavior: "instant" as ScrollBehavior }));
    await expect.poll(() => strip.evaluate((element) => element.scrollLeft)).toBeGreaterThan(initialScroll);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
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

    await page.locator("#estudos-de-caso").scrollIntoViewIfNeeded();
    const caseStudy = projects.locator('[data-case-study="true"]').first();
    await expect(caseStudy).toBeVisible();
    const caseBox = await caseStudy.boundingBox();
    expect(caseBox?.width ?? 0).toBeLessThanOrEqual(288);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
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

  test("painel de aparência é acessível e carregado apenas sob demanda", async ({ page }) => {
    await page.goto("/");

    const trigger = page.getByRole("button", { name: /configurações de aparência/i });
    await expect(trigger).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Aparência" })).toHaveCount(0);

    const beforeResources = await page.evaluate(() =>
      performance.getEntriesByType("resource").map((entry) => entry.name),
    );
    expect(beforeResources.some((url) => url.includes("PortfolioAppearancePanel"))).toBeFalsy();

    await trigger.click();

    await expect(page.getByRole("dialog", { name: "Aparência" })).toBeVisible();
    await expect.poll(async () =>
      page.evaluate(() =>
        performance.getEntriesByType("resource").some((entry) => entry.name.includes("PortfolioAppearancePanel")),
      ),
    ).toBeTruthy();
  });

  test("mantém contato e disponibilidade visíveis no encerramento", async ({ page }) => {
    await page.goto("/");

    const contact = page.locator("#contato");
    await contact.scrollIntoViewIfNeeded();
    await expect(contact.getByText(/agenda sob consulta para novos projetos e oportunidades/i)).toBeVisible();
    await expect(contact.getByText(/consulta de agenda/i)).toBeVisible();

    const footerPlaceholder = page.locator('[data-footer-placeholder="true"]');
    await footerPlaceholder.scrollIntoViewIfNeeded();

    const footer = page.locator("#contato-rodape");
    await expect(footer).toBeVisible();
    await expect(footer.locator('a[href="mailto:mpjcreator@gmail.com"]')).toBeVisible();
    await expect(page.locator('[data-availability-status="true"]')).toContainText(/disponibilidade atual: sob consulta/i);
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

  test("experience hub centraliza automaticamente a rota escolhida no mobile", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/");

    const hub = page.locator('[data-experience-hub="true"]');
    await hub.scrollIntoViewIfNeeded();
    const strip = hub.locator('[data-experience-route-strip="true"]');
    const third = hub.locator('[data-experience-route="true"]').nth(2);

    await third.evaluate((element) => (element as HTMLButtonElement).click());
    await expect(third).toHaveAttribute("aria-selected", "true");

    await expect.poll(async () => strip.evaluate((element) => {
      const active = element.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!active) return 999;
      const stripRect = element.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      const stripCenter = stripRect.left + stripRect.width / 2;
      const activeCenter = activeRect.left + activeRect.width / 2;
      return Math.abs(stripCenter - activeCenter);
    })).toBeLessThanOrEqual(24);
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
