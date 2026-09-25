import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test.use({ baseURL });

test.describe("navegação pública e favoritos", () => {
  test("emite CTA de orçamento e início de briefing sem incluir dados pessoais", async ({ page }) => {
    await page.addInitScript(() => {
      const events: unknown[] = [];
      window.addEventListener("portfolio:analytics", (event) => events.push((event as CustomEvent).detail));
      Object.defineProperty(window, "__portfolioAnalyticsEvents", { value: events });
    });
    await page.goto("/");

    const emittedEventNames = () => page.evaluate(() => (window as typeof window & { __portfolioAnalyticsEvents: Array<{ eventName: string }> }).__portfolioAnalyticsEvents.map((event) => event.eventName));

    await page.locator('a[href="#contato"]').filter({ hasText: /solicitar orçamento/i }).click();
    await expect.poll(emittedEventNames).toContain("quote_cta");
    await page.locator("#contato-briefing input").first().focus();
    await expect.poll(emittedEventNames).toContain("briefing_started");
    const propertyKeys = await page.evaluate(() => (window as typeof window & { __portfolioAnalyticsEvents: Array<{ properties?: Record<string, unknown> }> }).__portfolioAnalyticsEvents.flatMap((event) => Object.keys(event.properties ?? {})));
    expect(propertyKeys).not.toEqual(expect.arrayContaining(["name", "email", "phone", "briefing", "address"]));
  });

  test("emite abertura de projeto sem incluir dados pessoais", async ({ page }) => {
    await page.addInitScript(() => {
      const events: unknown[] = [];
      window.addEventListener("portfolio:analytics", (event) => events.push((event as CustomEvent).detail));
      Object.defineProperty(window, "__portfolioAnalyticsEvents", { value: events });
    });
    await page.goto("/");

    await page.locator("[data-featured-project]").first().click();
    await expect(page.locator('[data-project-details-dialog="true"]')).toBeVisible();
    await expect.poll(() => page.evaluate(() => (window as typeof window & { __portfolioAnalyticsEvents: Array<{ eventName: string }> }).__portfolioAnalyticsEvents.map((event) => event.eventName))).toContain("project_opened");
    const propertyKeys = await page.evaluate(() => (window as typeof window & { __portfolioAnalyticsEvents: Array<{ properties?: Record<string, unknown> }> }).__portfolioAnalyticsEvents.flatMap((event) => Object.keys(event.properties ?? {})));
    expect(propertyKeys).not.toEqual(expect.arrayContaining(["name", "email", "phone", "briefing", "address"]));
  });

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

  test("reduz a densidade da galeria e amplia os alvos do briefing em 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/#galeria-publica");
    const gallery = page.locator("#galeria-publica");
    await gallery.scrollIntoViewIfNeeded();
    await expect(page.locator('[data-filter-scope="category"]').first()).toBeVisible();
    await expect(page.locator('[data-filter-scope="tag"]').first()).toBeHidden();
    const refine = page.locator('[data-mobile-gallery-refinement-toggle="true"]');
    await expect(refine).toBeVisible();
    await refine.click();
    await expect(page.locator('[data-filter-scope="tag"]').first()).toBeVisible();
    await expect(page.locator('[data-filter-scope="technology"]').first()).toBeVisible();
    const moreActions = page.locator('[data-mobile-gallery-secondary-actions-toggle="true"]');
    await moreActions.click();
    await expect(page.locator('[data-mobile-gallery-secondary-actions="true"]')).toBeVisible();
    await page.locator('[data-filter-scope="category"]').filter({ hasText: "Aéreo" }).click();
    await expect(page.locator('[data-gallery-loading-status="true"]')).toContainText("atualizando resultados");
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();

    const form = page.locator("#contato-briefing");
    await form.scrollIntoViewIfNeeded();
    const inputHeights = await form.locator("input:not([name='website']), select").evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
    expect(inputHeights.every((height) => height >= 48)).toBeTruthy();
    const submit = form.locator('[data-briefing-submit="true"]');
    const widths = await Promise.all([submit.evaluate((element) => element.getBoundingClientRect().width), form.evaluate((element) => element.getBoundingClientRect().width)]);
    expect(widths[0]).toBeGreaterThanOrEqual(widths[1] - 1);
  });

  test("amplia a agenda e torna filtros e favoritos mais claros em 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");
    const calendar = page.locator(".availability-calendar");
    await calendar.scrollIntoViewIfNeeded();
    const previousMonth = calendar.getByRole("button", { name: "Mês anterior" });
    const nextMonth = calendar.getByRole("button", { name: "Próximo mês" });
    expect(await previousMonth.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    expect(await nextMonth.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    const dateHeights = await calendar.locator('[data-availability-date="true"]').evaluateAll((elements) => elements.slice(0, 7).map((element) => element.getBoundingClientRect().height));
    expect(dateHeights.every((height) => height >= 40)).toBeTruthy();
    const timeHeights = await calendar.locator("button").evaluateAll((elements) => elements.slice(-3).map((element) => element.getBoundingClientRect().height));
    expect(timeHeights.every((height) => height >= 44)).toBeTruthy();
    await calendar.locator('[data-availability-date="true"]:not([disabled])').first().click();
    await calendar.getByRole("button", { name: "10:00" }).click();
    await expect(calendar.locator('[data-availability-selection-summary="true"]')).toContainText(/consulta selecionada.*10:00/s);
    await calendar.locator('[data-clear-availability-selection="true"]').click();
    await expect(page.getByText("Seleção limpa")).toBeVisible();
    await expect(calendar.locator('[data-availability-selection-summary="true"]')).toHaveCount(0);
    await expect(calendar.locator('[data-clear-availability-selection="true"]')).toHaveCount(0);

    const gallery = page.locator("#galeria-publica");
    await gallery.scrollIntoViewIfNeeded();
    await expect.poll(() => page.locator('[data-filter-scope="category"]').evaluateAll((elements) => elements.map((element) => element.querySelector("span")?.textContent?.trim()))).toEqual(["Todos", "Eventos", "Aéreo", "Interface", "Conteúdo", "Noturno"]);
    await expect(page.locator('[data-mobile-gallery-refinement-toggle="true"]')).toHaveText(/filtros/i);
    await expect(page.getByRole("button", { name: /Ativar visualização compacta/i })).toHaveText(/detalhes/i);
    const favorite = page.locator('[data-favorite-control="true"]').first();
    await expect(favorite).toHaveAttribute("aria-label", /Favoritar/i);
    expect(await favorite.evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
    await favorite.click();
    await expect(favorite).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("Projeto salvo")).toBeVisible();
    await page.getByRole("button", { name: /projetos salvos/i }).first().click();
    await expect(page.locator('[data-saved-projects-section="true"]')).toBeVisible();
    await page.evaluate(() => {
      window.open = ((url: string | URL) => {
        document.body.dataset.projectShareUrl = String(url);
        return window;
      }) as typeof window.open;
    });
    const shareProject = page.locator('[data-project-whatsapp-share="true"]').first();
    await shareProject.click();
    await expect.poll(() => page.locator("body").getAttribute("data-project-share-url")).toContain("https://wa.me/?text=");
    await expect.poll(() => page.locator("body").getAttribute("data-project-share-url")).toContain(encodeURIComponent("Quero te mostrar"));
    await favorite.click();
    await expect(page.getByText("Projeto removido")).toBeVisible();
    await expect(page.locator('[data-saved-projects-empty="true"]')).toBeVisible();
    await expect(page.locator('[data-saved-projects-empty="true"]')).toContainText(/use o coração/i);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
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
    await expect(details.locator('[data-project-case-study="true"]')).toBeVisible();
    await expect(details.locator('[data-project-case-study="true"]')).toContainText(/contexto|problema|objetivo|minha função|processo|decisões|resultado|aprendizado/i);
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

  test("adia dados abaixo da dobra até a aproximação da seção", async ({ page }) => {
    const deferredRequests: string[] = [];
    page.on("request", (request) => {
      if (/availability\.listBlocked|instagramFeed\.status/.test(request.url())) deferredRequests.push(request.url());
    });
    await page.goto("/");
    await page.waitForTimeout(500);
    expect(deferredRequests).toHaveLength(0);

    await page.locator("#contato .availability-calendar").scrollIntoViewIfNeeded();
    await expect.poll(() => deferredRequests.some((url) => url.includes("availability.listBlocked")), { timeout: 10000 }).toBeTruthy();

    await page.locator("#social").scrollIntoViewIfNeeded();
    await expect(page.locator(".social-filter-card").first()).toBeVisible({ timeout: 10000 });
    await expect.poll(() => deferredRequests.some((url) => url.includes("instagramFeed.status")), { timeout: 10000 }).toBeTruthy();
    await expect(page.locator("#social")).not.toContainText(/autorização da Meta|credenciais|required|feed temporariamente indisponível/i);
    await expect(page.locator("#social")).toContainText(/curadoria editorial|perfis reais/i);
  });

  test("adia o pôster do showreel até a aproximação da seção", async ({ page }) => {
    const showreelRequests: string[] = [];
    page.on("request", (request) => {
      if (/showreel-(vertical-)?poster/.test(request.url())) showreelRequests.push(request.url());
    });
    await page.goto("/");
    await page.waitForTimeout(500);
    await expect(page.locator('[data-showreel-trigger="true"] img')).toHaveCount(0);
    expect(showreelRequests).toHaveLength(0);

    await page.locator('[data-showreel="true"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-showreel-trigger="true"] img')).toBeVisible({ timeout: 10000 });
    await expect.poll(() => showreelRequests.length, { timeout: 10000 }).toBeGreaterThan(0);
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
    await expect.poll(() => page.locator('.social-filter-card img').evaluateAll((images) => images.every((image) => Boolean(image.getAttribute("alt")?.trim())))).toBeTruthy();
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
    await expect(page.locator('[data-saved-projects-sort="true"]')).toBeVisible();
    await page.getByRole("button", { name: /projetos salvos/i }).first().click();
    await expect(page.locator('[data-featured-project]').first()).toBeVisible({ timeout: 10000 });
    await page.locator('[data-featured-project]').first().click();
    await expect(details).toBeVisible();
    const next = details.locator('[data-project-modal-next="true"]');
    await expect(next).toBeEnabled();
    await next.click();
    await expect(title).not.toHaveText(initialTitle ?? "");
    await page.keyboard.press("ArrowLeft");
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
    await expect(page.locator('[data-project-details-dialog="true"]')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('[data-project-details-dialog="true"] [data-project-modal-share="true"]')).toBeVisible();
  });

  test("filtra e ordena projetos salvos sem alterar a galeria pública e alterna para a agenda", async ({ page }) => {
    await page.addInitScript(() => window.localStorage.setItem("pablo-portfolio-favorites", JSON.stringify(["AUD.01", "CNT.02"])));
    await page.goto("/#galeria-publica");
    await page.getByRole("button", { name: /projetos salvos/i }).first().click();
    const savedControls = page.locator('[data-saved-projects-controls="true"]');
    await expect(savedControls).toBeVisible();
    await expect(page.locator('[data-project-search="true"]')).toHaveCount(0);

    const savedSearch = page.locator('[data-saved-projects-search="true"]');
    await savedSearch.fill("RHAM");
    await expect(page.locator('[data-saved-projects-result-count="true"]')).toContainText(/1 projeto salvo encontrado.*RHAM/i);
    await expect(page.locator('[data-project-id="CNT.02"]')).toBeVisible();
    await expect(page.locator('[data-project-id="AUD.01"]')).toHaveCount(0);

    const savedSort = page.locator('[data-saved-projects-sort="true"]');
    await savedSort.selectOption("added");
    await expect(savedSort).toHaveValue("added");
    await expect(page.locator('[data-saved-projects-clear-controls="true"]')).toBeVisible();
    await page.locator('[data-saved-projects-clear-controls="true"]').click();
    await expect(savedSearch).toHaveValue("");
    await expect(savedSort).toHaveValue("relevance");
    await expect(page.locator('[data-saved-projects-result-count="true"]')).toContainText(/2 projetos salvos encontrados/i);

    await page.locator('[data-saved-to-availability="true"]').click();
    const calendar = page.locator('[data-availability-context="true"]');
    await expect(calendar).toBeFocused();
    await expect(page.locator('[data-context-navigation-status="true"]')).toContainText(/agenda de disponibilidade em foco/i);
    await page.locator('[data-availability-to-saved="true"]').click();
    await expect(savedControls).toBeFocused();
    await expect(page.locator('[data-context-navigation-status="true"]')).toContainText(/projetos salvos em foco/i);
  });

  test("compartilha uma coleção salva e abre a pré-visualização sem sair da lista", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("pablo-portfolio-favorites", JSON.stringify(["AUD.01", "CNT.02"]));
      Object.defineProperty(navigator, "share", { configurable: true, value: async (data: { url: string }) => { document.body.dataset.savedShareUrl = data.url; } });
    });
    await page.goto("/#galeria-publica");
    await page.getByRole("button", { name: /projetos salvos/i }).first().click();
    await page.locator('[data-saved-projects-share="true"]').click();
    await expect.poll(() => page.locator("body").getAttribute("data-saved-share-url")).toContain("favorites=AUD.01%2CCNT.02");
    await expect(page.locator('[data-saved-projects-share="true"]')).toContainText(/compartilhado/i);
    await page.locator('[data-project-id="CNT.02"] button.project-gallery-card').click();
    await expect(page.locator('[data-project-details-dialog="true"]')).toBeVisible();
    await expect(page.locator('[data-project-details-dialog="true"]')).toContainText(/RHAM/i);
    await page.keyboard.press("Escape");
    await expect(page.locator('[data-saved-projects-section="true"]')).toBeVisible();
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
    await expect(page.locator('[data-saved-projects-section="true"]')).toContainText(/Preparando PDF|PDF preparado/i);
    await expect(page.locator('[data-saved-projects-section="true"]')).toContainText(/arraste os cartões/i);
    await expect(page.locator('[data-project-id][draggable="true"]').first()).toBeVisible();
  });

  test("mantém o título do hero legível e os CTAs íntegros em telas mobile estreitas", async ({ page }) => {
    test.setTimeout(60000);
    for (const viewport of [{ width: 320, height: 568 }, { width: 360, height: 800 }, { width: 390, height: 844 }, { width: 414, height: 896 }]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const heading = page.getByRole("heading", { level: 1 });
      await expect(heading).toBeVisible();
      const lineCount = await heading.evaluate((element) => {
        const style = window.getComputedStyle(element);
        const lineHeight = Number.parseFloat(style.lineHeight);
        return Math.round(element.getBoundingClientRect().height / lineHeight);
      });
      expect(lineCount, `Título excedeu quatro linhas em ${viewport.width}px`).toBeLessThanOrEqual(4);
      await expect(page.locator('[data-hero-cta="true"]')).toBeVisible();
      await expect(page.locator('[data-hero-cta="true"] a[href="#contato"]')).toBeVisible();
      await expect(page.locator('[data-hero-cta="true"] a[href="#projetos"]')).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    }
  });

  test("mantém os CTAs do hero acima da barra fixa de contato", async ({ page }) => {
    test.setTimeout(90000);
    for (const viewport of [{ width: 320, height: 568 }, { width: 360, height: 800 }, { width: 375, height: 812 }, { width: 390, height: 844 }, { width: 414, height: 896 }, { width: 430, height: 932 }, { width: 768, height: 900 }, { width: 1280, height: 720 }]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      const heroCta = page.locator('[data-hero-cta="true"]');
      const contactBar = page.locator('[data-mobile-contact-bar="true"]');
      await expect(heroCta.getByRole("link", { name: /solicitar orçamento/i })).toBeVisible();
      await expect(heroCta.getByRole("link", { name: /ver trabalhos/i })).toBeVisible();
      const controlsDoNotOverlap = await page.evaluate(() => {
        const cta = document.querySelector<HTMLElement>('[data-hero-cta="true"]');
        const bar = document.querySelector<HTMLElement>('[data-mobile-contact-bar="true"]');
        if (!cta || !bar) return false;
        const style = window.getComputedStyle(bar);
        const barVisible = Number.parseFloat(style.opacity) > 0.01 && style.visibility !== "hidden";
        if (!barVisible) return true;
        const barRect = bar.getBoundingClientRect();
        return Array.from(cta.querySelectorAll<HTMLElement>("a")).every((link) => {
          const rect = link.getBoundingClientRect();
          const horizontallyOverlaps = rect.left < barRect.right && rect.right > barRect.left;
          const verticallyOverlaps = rect.top < barRect.bottom && rect.bottom > barRect.top;
          return !(horizontallyOverlaps && verticallyOverlaps);
        });
      });
      expect(controlsDoNotOverlap, `CTA do hero ficou sob a barra fixa em ${viewport.width}x${viewport.height}`).toBeTruthy();
      const heroCtaIsInViewport = await heroCta.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0;
      });
      if (viewport.width < 1024 && heroCtaIsInViewport) {
        await expect(contactBar).toHaveCSS("opacity", "0");
      }
    }
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
      const lightboxImage = lightbox.locator('[data-lightbox-image="true"]');
      await expect(lightboxImage).toBeVisible({ timeout: 15000 });
      await expect.poll(() => lightboxImage.evaluate((image) => image.getBoundingClientRect().width > 0 && image.getBoundingClientRect().height > 0), { timeout: 15000 }).toBeTruthy();
      const imageFitsMedia = await lightboxImage.evaluate((image) => {
        const media = image.parentElement;
        if (!media) return false;
        const imageRect = image.getBoundingClientRect();
        const mediaRect = media.getBoundingClientRect();
        return imageRect.width <= mediaRect.width + 1 && imageRect.height <= mediaRect.height + 1;
      });
      expect(imageFitsMedia).toBeTruthy();
      const fullscreen = lightbox.locator('button[aria-label="Abrir visualizador em tela cheia"]');
      if (viewport.width < 640) {
        await expect(fullscreen).toBeHidden();
      } else {
        await expect(fullscreen).toBeVisible();
      }
      if (viewport.width === 390) {
        const detailsToggle = lightbox.locator('[data-lightbox-mobile-details-toggle="true"]');
        const detailsSection = lightbox.locator('section[aria-label^="Legenda expandida"]');
        await expect(detailsToggle).toBeVisible();
        await expect(detailsSection).toBeHidden();
        await detailsToggle.click();
        await expect(detailsSection).toBeVisible();
        const moreActions = lightbox.locator('[data-lightbox-more-actions="true"]');
        await expect(moreActions).toBeVisible();
        await moreActions.locator('summary').filter({ hasText: "mais ações" }).click();
        await expect(lightbox.getByRole("button", { name: /Copiar link do projeto/i })).toBeVisible();
        await expect(lightbox.getByRole("button", { name: /Compartilhar projeto no WhatsApp/i })).toBeVisible();
        await detailsToggle.click();
        await expect(detailsSection).toBeHidden();
      }
      await page.keyboard.press("Escape");
      await expect(lightbox).toBeHidden();
    }
  });

  test("contém imagens verticais, quadradas e horizontais no quadro do lightbox mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const imageTrigger = page.getByRole("button", { name: /Ampliar imagem/ }).first();
    await imageTrigger.scrollIntoViewIfNeeded();
    await expect(imageTrigger).toBeVisible({ timeout: 15000 });
    await imageTrigger.click();
    const lightbox = page.locator('[data-lightbox-modal="true"]');
    await expect(lightbox).toBeVisible({ timeout: 15000 });
    const image = lightbox.locator('[data-lightbox-image="true"]');
    await expect(image).toBeVisible({ timeout: 15000 });
    for (const ratio of [{ name: "9:16", width: 900, height: 1600 }, { name: "4:5", width: 800, height: 1000 }, { name: "1:1", width: 1000, height: 1000 }, { name: "4:3", width: 1200, height: 900 }, { name: "16:9", width: 1600, height: 900 }]) {
      await image.evaluate((element, dimensions) => {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${dimensions.width}" height="${dimensions.height}" viewBox="0 0 ${dimensions.width} ${dimensions.height}"><rect width="100%" height="100%" fill="#0b2746"/></svg>`;
        element.setAttribute("src", `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
      }, ratio);
      await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBeTruthy();
      const fits = await image.evaluate((element) => {
        const media = element.parentElement;
        if (!media) return false;
        const imageRect = element.getBoundingClientRect();
        const mediaRect = media.getBoundingClientRect();
        return imageRect.width <= mediaRect.width + 1 && imageRect.height <= mediaRect.height + 1;
      });
      expect(fits, `Imagem ${ratio.name} excedeu o quadro do lightbox`).toBeTruthy();
    }
    await page.keyboard.press("Escape");
    await expect(lightbox).toBeHidden();
  });

  test("prioriza toque e leitura nos controles principais em 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");

    const menuToggle = page.getByRole("button", { name: "Abrir menu" });
    const themeToggle = page.locator('header > div [data-theme-toggle="true"]').last();
    const headerTargetSizes = await Promise.all([
      menuToggle.evaluate((element) => element.getBoundingClientRect()),
      themeToggle.evaluate((element) => element.getBoundingClientRect()),
    ]);
    expect(headerTargetSizes.every(({ width, height }) => width >= 44 && height >= 44)).toBeTruthy();

    const heroCta = page.locator('[data-hero-cta="true"]');
    const quoteCta = heroCta.getByRole("link", { name: /solicitar orçamento/i });
    const heroWidths = await Promise.all([
      heroCta.evaluate((element) => element.getBoundingClientRect().width),
      quoteCta.evaluate((element) => element.getBoundingClientRect().width),
    ]);
    expect(heroWidths[1]).toBeGreaterThanOrEqual(heroWidths[0] - 1);

    await page.locator("#galeria-publica").scrollIntoViewIfNeeded();
    const categoryHeights = await page.locator('[data-filter-scope="category"]').evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().height),
    );
    expect(categoryHeights.every((height) => height >= 44)).toBeTruthy();

    await page.locator('[data-mobile-gallery-refinement-toggle="true"]').click();
    const refinementHeights = await page.locator('[data-filter-scope="tag"], [data-filter-scope="technology"]').evaluateAll((elements) =>
      elements.filter((element) => getComputedStyle(element).display !== "none").map((element) => element.getBoundingClientRect().height),
    );
    expect(refinementHeights.length).toBeGreaterThan(0);
    expect(refinementHeights.every((height) => height >= 44)).toBeTruthy();

    await page.locator("#contato-rodape").scrollIntoViewIfNeeded();
    const footerSocialSizes = await page.locator(".footer-social-icon").evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }),
    );
    expect(footerSocialSizes.every(({ width, height }) => width >= 44 && height >= 44)).toBeTruthy();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  });

  test("mantém ações rápidas dos cards com alvo de toque mínimo em 320px", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/");
    await page.locator("#galeria-publica").scrollIntoViewIfNeeded();

    const firstProject = page.locator("[data-project-id]").first();
    await expect(firstProject).toBeVisible();

    const quickActions = firstProject.locator(
      '[aria-label^="Ampliar imagem"], [data-project-whatsapp-share="true"], [data-image-favorite-control="true"], [data-favorite-control="true"], button[aria-label^="Mover "]',
    );
    const metrics = await quickActions.evaluateAll((elements) =>
      elements.map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          label: element.getAttribute("aria-label"),
          width: rect.width,
          height: rect.height,
        };
      }),
    );

    expect(metrics.length).toBeGreaterThanOrEqual(5);
    for (const metric of metrics) {
      expect(metric.width, `${metric.label} ficou com ${metric.width}px de largura`).toBeGreaterThanOrEqual(44);
      expect(metric.height, `${metric.label} ficou com ${metric.height}px de altura`).toBeGreaterThanOrEqual(44);
    }
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  });

  test("mantém a barra flutuante legível e contida em mobile e landscape", async ({ page }) => {
    test.setTimeout(60000);
    for (const viewport of [{ width: 320, height: 568 }, { width: 568, height: 320 }]) {
      await page.setViewportSize(viewport);
      await page.goto("/");
      await page.locator("#galeria-publica").scrollIntoViewIfNeeded();

      const contactBar = page.locator('[data-mobile-contact-bar="true"]');
      await expect(contactBar).toBeVisible();
      await expect(contactBar).toHaveCSS("opacity", "1");

      const barRect = await contactBar.evaluate((element) => element.getBoundingClientRect());
      expect(barRect.left, `barra saiu pela esquerda em ${viewport.width}x${viewport.height}`).toBeGreaterThanOrEqual(0);
      expect(barRect.right, `barra saiu pela direita em ${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(viewport.width);

      const linkMetrics = await contactBar.locator(".contact-float-link").evaluateAll((elements) =>
        elements.map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            height: rect.height,
            fontSize: Number.parseFloat(getComputedStyle(element).fontSize),
          };
        }),
      );
      expect(linkMetrics.length).toBe(3);
      expect(linkMetrics.every(({ height }) => height >= 44)).toBeTruthy();
      expect(linkMetrics.every(({ fontSize }) => fontSize >= 10)).toBeTruthy();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    }
  });

  test("evita zoom de formulário no iOS e mantém ações secundárias tocáveis no mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const gallery = page.locator("#galeria-publica");
    await gallery.scrollIntoViewIfNeeded();

    const search = page.locator('[data-project-search="true"]');
    const sort = page.locator('[data-sort-control="projects"]');
    const mobileFontSizes = await Promise.all([
      search.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
      sort.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize)),
    ]);
    expect(mobileFontSizes.every((size) => size >= 16)).toBeTruthy();

    await search.fill("drone");
    const compactGalleryActions = [
      page.getByRole("button", { name: /projetos salvos/i }).first(),
      page.getByRole("button", { name: /minhas imagens/i }),
      page.getByRole("button", { name: /Copiar link da busca atual/i }),
      page.getByRole("button", { name: /Limpar todos os filtros de projetos/i }),
      page.getByRole("button", { name: /Limpar busca de trabalhos/i }),
    ];
    for (const control of compactGalleryActions) {
      await expect(control).toBeVisible();
      const rect = await control.evaluate((element) => element.getBoundingClientRect());
      expect(rect.height).toBeGreaterThanOrEqual(44);
    }

    const briefing = page.locator("#contato-briefing");
    await briefing.scrollIntoViewIfNeeded();
    const briefingFontSizes = await briefing
      .locator("input:not([name='website']), select, textarea")
      .evaluateAll((elements) => elements.map((element) => Number.parseFloat(getComputedStyle(element).fontSize)));
    expect(briefingFontSizes.every((size) => size >= 16)).toBeTruthy();

    await search.fill("");
    const preview = page.locator("[data-featured-project]").first();
    await preview.scrollIntoViewIfNeeded();
    await preview.click();
    const projectDialog = page.locator('[data-project-details-dialog="true"]');
    await expect(projectDialog).toBeVisible();
    const modalActionHeights = await projectDialog
      .locator('[data-project-modal-favorite="true"], [data-project-modal-share="true"], [data-project-modal-copy-link="true"]')
      .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
    expect(modalActionHeights.every((height) => height >= 44)).toBeTruthy();

    const modalNavigationTargets = [
      { name: "anterior", locator: projectDialog.locator('[data-project-modal-previous="true"]') },
      { name: "próximo", locator: projectDialog.locator('[data-project-modal-next="true"]') },
      { name: "fechar", locator: projectDialog.locator('[data-slot="dialog-close"]') },
    ];
    for (const target of modalNavigationTargets) {
      const rect = await target.locator.evaluate((element) => element.getBoundingClientRect());
      expect(rect.height, `${target.name} ficou com ${rect.height}px de altura`).toBeGreaterThanOrEqual(44);
      expect(rect.width, `${target.name} ficou com ${rect.width}px de largura`).toBeGreaterThanOrEqual(44);
    }
  });

  test("expõe uma PWA instalável com manifest e service worker no escopo público", async ({ page }) => {
    await page.goto("/");

    const viewportContent = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(viewportContent).toContain("viewport-fit=cover");

    const manifestHref = await page.locator('link[rel="manifest"]').getAttribute("href");
    expect(manifestHref).toBeTruthy();

    const manifestResponse = await page.request.get(manifestHref!);
    expect(manifestResponse.ok()).toBeTruthy();
    const manifest = await manifestResponse.json();
    expect(manifest.name).toContain("Pablo Guilherme");
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("./");
    expect(manifest.scope).toBe("./");
    expect(manifest.icons?.some((icon: { sizes?: string }) => icon.sizes === "any")).toBeTruthy();
    expect(manifest.icons?.some((icon: { sizes?: string }) => icon.sizes === "192x192")).toBeTruthy();
    expect(manifest.icons?.some((icon: { sizes?: string }) => icon.sizes === "512x512")).toBeTruthy();

    const baseUrl = new URL(page.url()).pathname.replace(/[^/]*$/, "");
    const workerResponse = await page.request.get(baseUrl + "sw.js");
    expect(workerResponse.ok()).toBeTruthy();
    expect(await workerResponse.text()).toContain("self.addEventListener");
  });

  test("mantém a rota de favoritos fora da vitrine pública", async ({ page }) => {
    await page.goto("/favoritos");
    await expect(page).toHaveURL(/\/favoritos$/);
    await expect(page.locator("h1").first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator("h1").first()).toContainText(/Gestão de favoritos reservada|Favoritos organizados|Sign in to continue|Entre para continuar/);
    await expect(page.locator("#projetos")).toHaveCount(0);
  });
});
