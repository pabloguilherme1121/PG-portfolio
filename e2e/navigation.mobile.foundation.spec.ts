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

    const primaryCta = page.locator("#inicio").getByRole("link", { name: /Ver projetos/i });
    expect(await primaryCta.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);

    const skipLink = page.locator(".skip-link");
    for (let index = 0; index < 6 && !(await skipLink.evaluate((element) => element === document.activeElement)); index += 1) {
      await page.keyboard.press("Tab");
    }
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#conteudo-principal")).toBeFocused();
  });

  test("mantém briefing e vitrine do PG Arcade confortáveis entre 320 e 430px", async ({ page }) => {
    await useDataSavingConnection(page);
    for (const width of [320, 360, 390, 430]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto("/");
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();

      const form = await openContactBriefing(page);
      await expect(form.locator('[data-briefing-studio="true"]')).toBeVisible();
      const showcase = page.locator('#pg-lab[data-arcade-showcase="true"]');
      await showcase.scrollIntoViewIfNeeded();
      await expect(showcase).toBeVisible();
      await expect(showcase.locator('[data-arcade-full-site="true"]')).toHaveAttribute("href", "https://pabloguilherme1121.github.io/PG-Arcade/");
      await expect.poll(() => showcase.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBeTruthy();
    }
  });

  test("economia de dados não carrega motores locais do Arcade", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: { saveData: true, effectiveType: "2g" },
      });
    });
    const arcadeRequests: string[] = [];
    page.on("request", (request) => {
      if (/Portfolio(TicTacToe|Chess|Checkers|Domino|Football)/i.test(request.url())) arcadeRequests.push(request.url());
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(arcadeRequests).toEqual([]);
    await expect(page.locator('#pg-lab[data-arcade-showcase="true"]')).toBeVisible();
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

      const showcase = page.locator('#pg-lab[data-arcade-showcase="true"]');
      await showcase.scrollIntoViewIfNeeded();
      await expect(showcase).toBeVisible();

      const overflow = await page.evaluate(() => {
        const selectors = [
          '#pg-lab[data-arcade-showcase="true"]',
          '#pg-lab[data-arcade-showcase="true"] a',
          '.featured-project-card',
          '.process-step-card',
          '.service-offer-panel[data-service-active="true"]',
        ];

        return selectors.flatMap((selector) =>
          Array.from(document.querySelectorAll<HTMLElement>(selector))
            .filter((node) => node.offsetParent !== null)
            .filter((node) => {
              if (
                node.matches('[role="tab"]') &&
                node.closest('[data-arcade-game-strip="true"]')
              ) {
                return false;
              }
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
          .filter((node) => Boolean(node.textContent?.trim()))
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
