import { test, expect } from "@playwright/test";
import { openContactBriefing, useDataSavingConnection } from "./helpers/contact";

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
    await expect(page.locator(".archive-chapter").first()).toHaveCSS("content-visibility", "visible");
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
    await useDataSavingConnection(page);
    for (const width of [320, 360, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/");

      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();

      const form = await openContactBriefing(page);
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

      await page.locator('[data-arcade-open-control="true"]').click();
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

  test("hero mobile evita provas duplicadas e resume evidências em sinais compactos", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/");

    await expect(page.locator('[data-mobile-hero-proof-rail="true"]')).toHaveCount(0);
    await expect(page.locator('[data-portfolio-trust-bar="true"]')).toHaveCount(0);

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

  test("menu mobile permite trocar o modo da experiência sem voltar ao Experience Hub", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.locator('[data-mobile-menu-toggle="true"]').click();
    const menu = page.locator("#mobile-navigation");
    await expect(menu).toBeVisible();

    const recruiterMode = menu.locator('[data-mobile-experience-mode="recruiter"]');
    await expect(recruiterMode).toBeVisible();
    await recruiterMode.click();

    await expect(page.locator('[data-mobile-dock-secondary="true"]')).toHaveAttribute(
      "data-mobile-dock-secondary-route",
      "recruiter",
    );
    await expect(page.locator('[data-mobile-dock-primary="true"]')).toHaveAttribute(
      "href",
      "#perfil-profissional",
    );
  });

  test("mobile incorpora hierarquia visual do mockup sem aumentar a carga de navegação", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(page.locator('[data-mobile-hero-proof-rail="true"]')).toHaveCount(0);
    await expect(page.locator('[data-home-signal-strip="true"]')).toBeVisible();

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

    await page.locator('[data-arcade-open-control="true"]').click();
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


  test("cards e textos críticos permanecem dentro da largura mobile", async ({ page }) => {
    for (const width of [320, 360, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/");

      await page.locator('[data-arcade-open-control="true"]').click();
      await expect(page.locator('[data-arcade-hub="true"]')).toBeVisible();

      const overflow = await page.evaluate(() => {
        const selectors = [
          '[data-arcade-hub="true"]',
          '[data-arcade-hub="true"] [role="tab"]',
          '[data-arcade-exploration="true"]',
          '[data-arcade-preset-card="true"]',
          '.featured-project-card',
          '.process-step-card',
          '.service-offer-panel[data-service-active="true"]',
        ];

        return selectors.flatMap((selector) =>
          Array.from(document.querySelectorAll<HTMLElement>(selector))
            .filter((node) => node.offsetParent !== null)
            .filter((node) => {
              const rect = node.getBoundingClientRect();
              return rect.left < -1 || rect.right > window.innerWidth + 1;
            })
            .map((node) => ({
              selector,
              text: node.textContent?.trim().slice(0, 80),
              left: Math.round(node.getBoundingClientRect().left),
              right: Math.round(node.getBoundingClientRect().right),
              width: Math.round(node.getBoundingClientRect().width),
            })),
        );
      });

      expect(overflow).toEqual([]);

      const clippedText = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLElement>(
          '[data-arcade-hub="true"] p, [data-arcade-hub="true"] span, [data-arcade-hub="true"] button'
        ))
          .filter((node) => node.offsetParent !== null)
          .filter((node) => node.scrollWidth > node.clientWidth + 1)
          .map((node) => ({
            tag: node.tagName,
            text: node.textContent?.trim().slice(0, 80),
            scrollWidth: node.scrollWidth,
            clientWidth: node.clientWidth,
          }))
          .slice(0, 20),
      );

      expect(clippedText).toEqual([]);
    }
  });

});
