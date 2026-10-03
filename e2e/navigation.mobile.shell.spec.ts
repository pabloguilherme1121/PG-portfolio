import { test, expect } from "@playwright/test";
import { openContactBriefing, useDataSavingConnection } from "./helpers/contact";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test.use({ baseURL });

test.describe("portfólio profissional", () => {
  test("seção ativa acompanha a posição real dos projetos antes de serviços", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator("#projetos").scrollIntoViewIfNeeded();
    await expect(page.locator('[data-featured-project-strip="true"]')).toBeVisible();
    await page.evaluate(() => {
      const projects = document.getElementById("projetos")!;
      window.scrollTo({ top: projects.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.22 + 2, behavior: "instant" });
    });
    await expect(page.locator('[data-mobile-current-section="true"]')).toHaveText("projetos");
    await page.locator('[data-mobile-menu-toggle="true"]').click();
    await expect(page.locator('#mobile-navigation a[href="#projetos"]')).toHaveAttribute("aria-current", "location");
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
    await useDataSavingConnection(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const dock = page.locator('[data-mobile-dock="true"]');
    const expandedHeight = (await dock.boundingBox())?.height ?? 0;
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(dock).toHaveAttribute("data-mobile-dock-compact", "true");
    expect((await dock.boundingBox())?.height ?? 0).toBeLessThan(expandedHeight);
    await page.evaluate(() => window.scrollTo(0, 450));
    await expect(dock).toHaveAttribute("data-mobile-dock-compact", "false");
    const form = await openContactBriefing(page);
    await form.locator('input[name="name"]').focus();
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
    await useDataSavingConnection(page);
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

    const form = await openContactBriefing(page);
    await form.locator('input[name="name"]').fill("Visitante mobile");
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
    const previousHash = await page.evaluate(() => location.hash);
    await shortcut.click();

    expect(await page.evaluate(() => location.hash)).toBe(previousHash);
    await expect(page.locator("#pg-lab")).toBeVisible();
    await expect(page.locator('[data-tic-tac-toe="true"]')).toBeVisible();
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


  test("menu mobile abre currículo web sem depender de PDF ausente", async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem("pablo-portfolio-experience-route", "recruiter"));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.locator('[data-mobile-menu-toggle="true"]').click();
    const menu = page.locator("#mobile-navigation");
    await expect(menu.locator('[data-resume-header="true"]')).toHaveCount(0);
    await menu.locator('[data-mobile-shortcut-contextual="true"]').click();
    await expect(page.locator('[data-web-resume="true"]')).toBeVisible();
    await expect(menu).toHaveCount(0);
    await expect(page.locator('[data-mobile-menu-toggle="true"]')).toHaveAttribute("aria-expanded", "false");
  });

  test("menu mobile mantém o foco dentro da navegação ao usar Tab", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const menuButton = page.locator('[data-mobile-menu-toggle="true"]');
    await menuButton.click();

    const menu = page.locator("#mobile-navigation");
    await expect(menu).toBeVisible();

    const focusables = menu.locator('a[href], button:not([disabled])');
    await expect(menu.locator('[aria-current="location"]')).toBeFocused();

    await page.keyboard.press("Shift+Tab");
    await expect.poll(() =>
      menu.evaluate((navigation) => navigation.contains(document.activeElement)),
    ).toBeTruthy();

    await focusables.last().focus();
    await page.keyboard.press("Tab");
    await expect.poll(() =>
      menu.evaluate((navigation) => navigation.contains(document.activeElement)),
    ).toBeTruthy();
  });

  test("menu mobile expõe semântica modal coerente para leitores de tela", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.locator('[data-mobile-menu-toggle="true"]').click();

    const dialog = page.getByRole("dialog", { name: /menu de navegação móvel/i });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog.getByRole("navigation", { name: /links principais/i })).toBeVisible();
  });

});

