import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test.use({ baseURL });

test.describe("portfólio profissional", () => {
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
    await expect(hub.locator('[data-experience-panel="recruiter"]')).toContainText(/perfil|currículo/i);

    await page.keyboard.press("End");
    await expect(third).toBeFocused();
    await expect(third).toHaveAttribute("aria-selected", "true");
    await expect(hub.locator('[data-experience-panel="explorer"]')).toBeVisible();

    await page.keyboard.press("Home");
    await expect(first).toBeFocused();
    await expect(first).toHaveAttribute("aria-selected", "true");
    await expect(hub.locator('[data-experience-panel="client"]')).toBeVisible();
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
      expect(stripOverflow.scrollWidth).toBeLessThanOrEqual(stripOverflow.clientWidth + 1);
      expect(["auto", "scroll"]).not.toContain(stripOverflow.overflowX);

      const firstRoute = hub.locator('[data-experience-route="true"]').first();
      const routeBox = await firstRoute.boundingBox();
      expect(routeBox?.height ?? 0).toBeGreaterThanOrEqual(56);
      expect(routeBox?.height ?? 999).toBeLessThanOrEqual(84);

      await expect(hub.locator('[data-experience-progress="true"]')).toHaveCount(0);

      const panel = hub.locator('[data-experience-panel="client"]');
      await expect(panel).toBeVisible();
      const cta = panel.getByRole("link", { name: /diagnosticar meu projeto/i });
      const ctaBox = await cta.boundingBox();
      expect(ctaBox?.height ?? 0).toBeGreaterThanOrEqual(48);
      const availableWidth = await panel.evaluate((element) => {
        const style = getComputedStyle(element);
        return element.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      });
      expect(ctaBox?.width ?? 0).toBeGreaterThanOrEqual(availableWidth - 1);

      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    }
  });



  test("experience hub mantém conteúdo textual dentro do viewport após rolar a rota mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const hubPlaceholder = page.locator('[data-experience-hub-placeholder="true"]');
    await hubPlaceholder.scrollIntoViewIfNeeded();
    const hub = page.locator('[data-experience-hub="true"]');
    await expect(hub).toBeVisible();

    await hub.getByRole("tab", { name: /quero explorar/i }).click();
    await expect(hub.locator('[data-experience-panel="explorer"]')).toBeVisible();

    const clipped = await hub.evaluate((root) =>
      Array.from(root.querySelectorAll<HTMLElement>("h2, h3, p, [data-experience-progress='true']"))
        .filter((node) => node.offsetParent !== null)
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          return rect.left < -1 || rect.right > window.innerWidth + 1;
        })
        .map((node) => ({ text: node.textContent?.trim().slice(0, 80), left: node.getBoundingClientRect().left, right: node.getBoundingClientRect().right })),
    );
    expect(clipped).toEqual([]);
  });

  test("experience hub não desloca a página horizontalmente ao escolher Quero explorar", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const hubPlaceholder = page.locator('[data-experience-hub-placeholder="true"]');
    await hubPlaceholder.scrollIntoViewIfNeeded();
    const hub = page.locator('[data-experience-hub="true"]');
    await expect(hub).toBeVisible();

    await hub.getByRole("tab", { name: /quero explorar/i }).click();
    await expect(hub.locator('[data-experience-panel="explorer"]')).toBeVisible();

    await expect.poll(() => page.evaluate(() => window.scrollX)).toBe(0);
    const panelBox = await hub.locator('[data-experience-panel="explorer"]').boundingBox();
    expect(panelBox?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((panelBox?.x ?? 0) + (panelBox?.width ?? 9999)).toBeLessThanOrEqual(390);
  });

});
