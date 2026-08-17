import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test.use({ baseURL });

test.describe("navegação pública e favoritos", () => {
  test("percorre as âncoras públicas e mantém a galeria acessível", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
    await page.getByRole("link", { name: /galeria pública/i }).click();
    await expect(page.locator("#galeria-publica")).toBeVisible();
    await page.getByRole("link", { name: /meus favoritos/i }).click();
    await expect(page.locator("#favoritos-pessoais")).toBeVisible();
  });

  test("aplica um filtro por tag na galeria pública", async ({ page }) => {
    await page.goto("/#galeria-publica");
    const tagFilter = page.locator('[data-filter-scope="tag"]').filter({ hasText: "Drone" }).first();
    await expect(tagFilter).toBeVisible();
    await tagFilter.click();
    await expect(tagFilter).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-project-id]').first()).toBeVisible();
  });

  test("aplica filtro por tecnologia e atualiza a contagem de resultados", async ({ page }) => {
    await page.goto("/#galeria-publica");
    const technologyFilter = page.locator('[data-filter-scope="technology"]').filter({ hasText: "HTML" }).first();
    await expect(technologyFilter).toBeVisible();
    await technologyFilter.click();
    await expect(technologyFilter).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-technology-result-count="true"]')).toContainText(/projeto/);
  });

  test("oferece contato no rodapé, copia o e-mail e retorna ao topo", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const emailLink = page.locator('#contato-rodape a[href="mailto:mpjcreator@gmail.com"]');
    await expect(emailLink).toBeVisible();
    const copyEmail = page.getByRole("button", { name: /copiar e-mail mpjcreator@gmail.com/i });
    await copyEmail.click();
    await expect(page.locator('#contato-rodape [data-email-copy-status="true"]')).toContainText(/copiado|não foi possível/i);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const backToTop = page.locator('button[aria-label="Voltar ao topo da página"]');
    await expect(backToTop).toBeVisible();
    await page.evaluate(() => { window.scrollTo({ top: 0, behavior: "auto" }); window.dispatchEvent(new Event("scroll")); });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(100);
    await expect(backToTop).toHaveAttribute("aria-hidden", "true");
  });

  test("restaura filtros e busca a partir da URL compartilhada", async ({ page }) => {
    await page.goto("/?technology=HTML&category=Interface&tag=Interface&q=site#galeria-publica");
    await expect(page.locator('[data-filter-scope="technology"]').filter({ hasText: "HTML" }).first()).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-filter-scope="category"]').filter({ hasText: "Interface" }).first()).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-filter-scope="tag"]').filter({ hasText: "Interface" }).first()).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator('[data-project-search="true"]')).toHaveValue("site");
    await page.locator('[data-project-search="true"]').fill("drone");
    await expect.poll(() => new URL(page.url()).searchParams.get("q")).toBe("drone");
  });

  test("copia a busca atual, mostra debounce e ordena os projetos", async ({ page }) => {
    await page.goto("/?technology=HTML&q=site#galeria-publica");
    const search = page.locator('[data-project-search="true"]');
    await expect(search).toHaveValue("site");
    const copySearch = page.getByRole("button", { name: /copiar link da busca atual/i });
    await copySearch.click();
    await expect(page.locator('[data-search-share-status="true"]')).toContainText(/copiado|não foi possível/i);
    await search.fill("drone");
    await expect(page.locator("#galeria-publica")).toHaveAttribute("aria-busy", "true");
    const sort = page.locator('[data-sort-control="projects"]');
    await sort.selectOption("added");
    await expect(sort).toHaveValue("added");
  });

  test("mantém ordenação na URL, mostra histórico e limpa todos os filtros", async ({ page }) => {
    await page.goto("/?technology=HTML&category=Interface&tag=Interface&sort=added&q=site#galeria-publica");
    const sort = page.locator('[data-sort-control="projects"]');
    await expect(sort).toHaveValue("added");
    await expect(page.locator('[data-project-search="true"]')).toHaveValue("site");
    await page.locator('[data-project-search="true"]').fill("drone");
    await page.getByRole("button", { name: /limpar todos os filtros de projetos/i }).click();
    await expect(page.locator('[data-project-search="true"]')).toHaveValue("");
    await expect(sort).toHaveValue("relevance");
    await expect(page.locator('[data-filter-scope="technology"]').filter({ hasText: "Todos" }).first()).toHaveAttribute("aria-pressed", "true");
    await expect.poll(() => {
      const params = new URL(page.url()).searchParams;
      return [params.get("technology"), params.get("category"), params.get("tag"), params.get("sort"), params.get("q")].map((value) => value ?? "").join("|");
    }).toBe("||||");
  });

  test("gerencia histórico, limpa estado vazio e navega entre projetos no modal", async ({ page }) => {
    test.setTimeout(60000);
    await page.addInitScript(() => window.localStorage.setItem("pablo-portfolio-recent-searches", JSON.stringify(["termo-unico-de-teste"])));
    await page.goto("/#galeria-publica");
    const search = page.locator('[data-project-search="true"]');
    const recent = page.locator('[data-recent-searches="true"]');
    await expect(recent).toContainText("termo-unico-de-teste");
    await recent.getByRole("button", { name: /Excluir busca recente termo-unico-de-teste/i }).click();
    await expect.poll(() => page.evaluate(() => JSON.parse(window.localStorage.getItem("pablo-portfolio-recent-searches") || "[]").includes("termo-unico-de-teste")), { timeout: 15000 }).toBe(false);

    await expect(page.locator('[data-project-details-dialog="true"]')).toHaveCount(0);
    await search.fill("__sem-resultado-real__");
    await expect(page.locator('#galeria-publica')).toHaveAttribute("aria-busy", "false", { timeout: 10000 });
    await expect(page.locator('[data-empty-clear-filters="true"]')).toBeVisible({ timeout: 10000 });
    await page.locator('[data-empty-clear-filters="true"]').click();
    await expect(search).toHaveValue("");

    await expect(page.locator('[data-featured-project]').first()).toBeVisible({ timeout: 10000 });
    await page.locator('[data-featured-project]').first().click();
    const details = page.locator('[data-project-details-dialog="true"]');
    const title = details.getByRole("heading", { level: 2 });
    const initialTitle = await title.textContent();
    const next = details.locator('[data-project-modal-next="true"]');
    await expect(next).toBeEnabled();
    await next.click();
    await expect(title).not.toHaveText(initialTitle ?? "");
    await expect(details.locator('[data-project-modal-previous="true"]')).toBeEnabled();
  });

  test("exibe status de disponibilidade no contato do rodapé", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-availability-status="true"]')).toContainText("disponibilidade atual: sob consulta");
  });

  test("publica canonical, robots e sitemap coerentes", async ({ page, request }) => {
    await page.goto("/");
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute("href", `${new URL(baseURL).origin}/`);
    const robots = await request.get("/robots.txt");
    expect(robots.ok()).toBeTruthy();
    expect(await robots.text()).toContain("Sitemap:");
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain("<loc>");
    await page.goto("/favoritos");
    await expect(page.locator('#robots-meta')).toHaveAttribute("content", "noindex, nofollow");
  });

  test("mantém foco visível, skip link e layout sem overflow horizontal", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 812 });
    await page.goto("/");
    const skipLink = page.locator(".skip-link");
    for (let index = 0; index < 6 && !(await skipLink.evaluate((element) => element === document.activeElement)); index += 1) {
      await page.keyboard.press("Tab");
    }
    await expect(skipLink).toBeFocused();
    const focusOutline = await skipLink.evaluate((element) => getComputedStyle(element).outlineColor);
    expect(focusOutline).not.toBe("rgba(0, 0, 0, 0)");
    await page.keyboard.press("Enter");
    await expect(page.locator("#conteudo-principal")).toBeFocused();
    const hasHorizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(hasHorizontalOverflow).toBeFalsy();
    await expect(page.locator("#trabalhos-destaque-title")).toBeVisible();
    await expect(page.locator(".featured-project-card")).toHaveCount(3);
  });

  test("alterna tema, exibe skeleton inicial e abre detalhes dos destaques", async ({ page }) => {
    await page.goto("/");
    const themeToggle = page.locator('[data-theme-toggle="true"]').first();
    await expect(themeToggle).toHaveAttribute("aria-pressed", "true");
    await themeToggle.click();
    await expect(themeToggle).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await page.locator('[data-featured-project]').first().waitFor({ state: "visible" });
    await page.locator('[data-featured-project]').first().click();
    const details = page.locator('[data-project-details-dialog="true"]');
    await expect(details).toBeVisible();
    const title = details.getByRole("heading", { level: 2 });
    const initialTitle = await title.textContent();
    const favorite = details.locator('[data-project-modal-favorite="true"]');
    await favorite.click();
    await expect(favorite).toHaveAttribute("aria-pressed", "true");
    const copyProjectLink = details.locator('[data-project-modal-copy-link="true"]');
    await copyProjectLink.click();
    await expect(copyProjectLink).toContainText(/link copiado|tentar novamente/i);
    await expect.poll(() => page.evaluate(() => JSON.parse(window.localStorage.getItem("pablo-portfolio-favorites") || "[]").length)).toBeGreaterThan(0);
    await details.locator('[data-project-modal-share="true"]').click();
    await expect(details.locator('[data-project-modal-share="true"]')).toContainText(/link copiado|tentar novamente/);
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-favorite-control="true"][aria-pressed="true"]').first()).toBeVisible();
    await page.getByRole("button", { name: /projetos salvos/i }).first().click();
    await expect(page.locator('[data-saved-projects-section="true"]')).toBeVisible();
    await expect(page.locator('[data-sort-control="projects"]')).toBeVisible();
    await page.getByRole("button", { name: /projetos salvos/i }).first().click();
    await expect(page.locator('[data-featured-project]').first()).toBeVisible({ timeout: 10000 });
    await page.locator('[data-featured-project]').first().click();
    await expect(details).toBeVisible();
    const next = details.locator('[data-project-modal-next="true"]');
    await expect(next).toBeEnabled();
    await next.click();
    await expect(details).toHaveAttribute("data-project-details-transition", "next");
    await expect(title).not.toHaveText(initialTitle ?? "");
    await page.keyboard.press("ArrowLeft");
    await expect(details).toHaveAttribute("data-project-details-transition", "previous");
    await expect(title).toHaveText(initialTitle ?? "");
    await page.keyboard.press("Escape");
    await expect(details).toBeHidden();
  });

  test("navega entre projetos do modal com swipe horizontal no mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#galeria-publica");
    const firstProject = page.locator('[data-featured-project]').first();
    await firstProject.click();
    const dialog = page.locator('[data-project-details-dialog="true"]');
    await expect(dialog).toBeVisible();
    await expect(page.locator('[data-project-swipe-hint="true"]')).toBeVisible();
    await expect(page.locator('[data-mobile-contact-bar="true"]')).toHaveCSS("opacity", "0");
    const title = dialog.getByRole("heading", { level: 2 });
    const initialTitle = await title.textContent();
    await dialog.evaluate((element) => {
      const touch = (x) => new Touch({ identifier: 1, target: element, clientX: x, clientY: 420 });
      element.dispatchEvent(new TouchEvent("touchstart", { bubbles: true, touches: [touch(300)] }));
      element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, changedTouches: [touch(100)] }));
    });
    await expect(title).not.toHaveText(initialTitle ?? "");
  });

  test("mostra ação clara quando o autoplay do vídeo é bloqueado", async ({ page }) => {
    await page.addInitScript(() => {
      HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/#galeria-publica");
    await page.locator('[data-featured-project]').first().click();
    const video = page.locator('[data-project-details-dialog="true"] video');
    await expect(video).toBeVisible();
    await video.dispatchEvent("loadeddata");
    await expect(page.locator('[data-project-video-play="true"]')).toBeVisible();
  });

  test("abre automaticamente um projeto ao acessar link direto", async ({ page }) => {
    await page.goto("/?projeto=AUD.01#projetos");
    await expect(page.locator('[data-project-details-dialog="true"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-project-details-dialog="true"] [data-project-modal-share="true"]')).toBeVisible();
  });

  test("expõe exportação offline e instrução de reordenação nos favoritos", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem("pablo-portfolio-favorites", JSON.stringify(["AUD.01"])))
    await page.goto("/#galeria-publica");
    await page.getByRole("button", { name: /projetos salvos/i }).first().click();
    await expect(page.locator('[data-saved-projects-section="true"]')).toBeVisible();
    await expect(page.locator('[data-saved-export-csv="true"]')).toBeVisible();
    await expect(page.locator('[data-saved-export-pdf="true"]')).toBeVisible();
    await page.locator('[data-saved-export-csv="true"]').click();
    await expect(page.locator('[data-saved-projects-section="true"]')).toContainText(/CSV preparado/i);
    await page.locator('[data-saved-export-pdf="true"]').click();
    await expect(page.locator('[data-saved-projects-section="true"]')).toContainText(/PDF preparado/i);
    await expect(page.locator('[data-saved-projects-section="true"]')).toContainText(/arraste os cartões/i);
    await expect(page.locator('[data-project-id][draggable="true"]').first()).toBeVisible();
  });

  test("mantém o lightbox e os modais audiovisuais utilizáveis em telas estreitas", async ({ page }) => {
    test.setTimeout(180000);
    for (const viewport of [{ width: 320, height: 568 }, { width: 360, height: 800 }, { width: 375, height: 812 }, { width: 390, height: 844 }, { width: 414, height: 896 }, { width: 430, height: 932 }, { width: 768, height: 900 }, { width: 1280, height: 720 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 }]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const imageTrigger = page.getByRole("button", { name: /Ampliar imagem/ }).first();
      await imageTrigger.scrollIntoViewIfNeeded();
      await imageTrigger.click();
      const lightbox = page.locator('[data-lightbox-modal="true"]');
      await expect(lightbox).toBeVisible();
      await expect(lightbox.locator("#project-lightbox-title")).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
      await expect(page.locator(".contact-float")).toHaveCSS("opacity", "0");
      await page.keyboard.press("Escape");
      await expect(lightbox).toBeHidden();
    }
  });

  test("mantém a rota de favoritos fora da vitrine pública", async ({ page }) => {
    await page.goto("/favoritos");
    await expect(page).toHaveURL(/\/favoritos$/);
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("h1").first()).toContainText(/Gestão de favoritos reservada|Favoritos organizados|Sign in to continue|Entre para continuar/);
    await expect(page.locator("#projetos")).toHaveCount(0);
  });
});
