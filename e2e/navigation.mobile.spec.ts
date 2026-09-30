import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test.use({ baseURL });

test.describe("portfólio profissional", () => {
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
    await page.locator('[data-experience-hub-placeholder="true"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-experience-hub="true"]')).toBeVisible();

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
    await page.locator('[data-experience-hub-placeholder="true"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-experience-hub="true"]')).toBeVisible();
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

    await page.locator('[data-experience-hub-placeholder="true"]').scrollIntoViewIfNeeded();
    const hub = page.locator('[data-experience-hub="true"]');
    await expect(hub).toBeVisible();
    await hub.getByRole("tab", { name: /quero explorar/i }).click();

    await page.locator('[data-mobile-menu-toggle="true"]').click();
    const shortcut = page.locator('[data-mobile-shortcut-contextual="true"]');
    await expect(shortcut).toHaveAttribute("href", "#pg-lab");
    await expect(shortcut).toContainText(/PG Arcade/i);
    await shortcut.click();

    await expect(page.locator("#pg-lab")).toBeVisible();
    await expect(page.locator('[data-tic-tac-toe="true"]')).toBeVisible();
  });

  test("showcase com um único projeto não exibe controles de comparação redundantes", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const projects = page.locator("#projetos");
    await projects.scrollIntoViewIfNeeded();

    const strip = projects.locator('[data-featured-project-strip="true"]');
    const cards = strip.locator("[data-featured-project]");

    await expect(strip).toHaveAttribute("aria-busy", "false");
    await expect(cards).toHaveCount(1);
    await expect(cards.first()).toBeVisible();
    await expect(projects.locator('[data-featured-pagination="true"]')).toHaveCount(0);
    await expect(projects.locator('[data-featured-active-label="true"]')).toHaveCount(0);
    await expect(projects.locator('[data-featured-swipe-hint="true"]')).toContainText(/toque para ver detalhes/i);
    await expect(strip).toHaveAttribute("aria-label", /projeto em destaque/i);
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


  test("experience hub oferece navegação premium por teclado e progresso de rota", async ({ page }) => {
    await page.goto("/");

    const hubPlaceholder = page.locator('[data-experience-hub-placeholder="true"]');
    await hubPlaceholder.scrollIntoViewIfNeeded();

    const hub = page.locator('[data-experience-hub="true"]');
    await expect(hub).toBeVisible();
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

    const hubPlaceholder = page.locator('[data-experience-hub-placeholder="true"]');
    await hubPlaceholder.scrollIntoViewIfNeeded();

    const hub = page.locator('[data-experience-hub="true"]');
    await expect(hub).toBeVisible();
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

      const hubPlaceholder = page.locator('[data-experience-hub-placeholder="true"]');
      await hubPlaceholder.scrollIntoViewIfNeeded();

      const hub = page.locator('[data-experience-hub="true"]');
      await expect(hub).toBeVisible();

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


  test("menu mobile move o foco para a seção atual e devolve ao botão ao fechar com Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const menuButton = page.locator('[data-mobile-menu-toggle="true"]');
    await menuButton.focus();
    await page.keyboard.press("Enter");

    const menu = page.locator("#mobile-navigation");
    await expect(menu).toBeVisible();
    await expect(menu.locator('[aria-current="location"]')).toBeFocused();

    await page.keyboard.press("Escape");

    await expect(menu).toHaveCount(0);
    await expect(menuButton).toBeFocused();
  });


});
