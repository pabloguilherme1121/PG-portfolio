import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test.use({ baseURL });

test.describe("portfólio profissional", () => {
  test("parâmetros antigos de busca não quebram o contexto do modal de projeto", async ({ page }) => {
    await page.goto("/?projeto=TEC.09&q=consulta-antiga-sem-resultados#projetos");

    const dialog = page.locator('[data-project-details-dialog="true"]');
    await expect(dialog).toBeVisible({ timeout: 30000 });
    await expect(dialog).toContainText(/Trajeto/i);
    await expect(dialog).toContainText("01 / 01");
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

  test("favoritos ignoram armazenamento legado em formato inválido sem quebrar o modal", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("pablo-portfolio-favorites", JSON.stringify("TEC.09"));
    });

    await page.goto("/?projeto=TEC.09#projetos");

    const dialog = page.locator('[data-project-details-dialog="true"]');
    const favorite = dialog.locator('[data-project-modal-favorite="true"]');

    await expect(dialog).toBeVisible({ timeout: 30000 });
    await expect(favorite).toHaveAttribute("aria-pressed", "false");

    await favorite.click();

    await expect(favorite).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() =>
      page.evaluate(() => window.localStorage.getItem("pablo-portfolio-favorites")),
    ).toBe(JSON.stringify(["TEC.09"]));
  });

});
