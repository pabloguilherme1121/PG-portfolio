import { test, expect } from "@playwright/test";
import { openContactBriefing, useDataSavingConnection } from "./helpers/contact";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test.use({ baseURL });

test.describe("portfólio profissional", () => {
  test("não expõe ferramentas internas de curadoria na vitrine pública", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("#galeria-publica")).toHaveCount(0);
    await expect(page.locator("#favoritos-pessoais")).toHaveCount(0);
    await expect(page.getByRole("button", { name: /CSV|JSON|projetos salvos|minhas imagens/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /observatório/i }).first()).toBeVisible();
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

  test("remove o leitor PDF legado e mantém o currículo web imprimível", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('[data-resume-header="true"]')).toHaveCount(0);
    await page.goto("/#curriculo-web");
    await expect(page.locator('[data-web-resume="true"]')).toBeVisible();
    await expect(page.getByRole("button", { name: /imprimir.*salvar.*pdf/i })).toBeVisible();
    await expect(page.locator('a[download]')).toHaveCount(0);
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

  test("usa o retrato profissional versionado", async ({ page, request }) => {
    await page.goto("/");

    const portrait = page.locator(".hero-portrait-card img");
    await expect(portrait).toBeVisible();
    await expect.poll(() => portrait.evaluate(img => (img as HTMLImageElement).currentSrc)).toMatch(/portfolio-media\/pablo-profile-2026\.(avif|webp)$/);
    await expect.poll(() => portrait.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(1);

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
    await useDataSavingConnection(page);
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

    const form = await openContactBriefing(page);
    await form.locator("input").first().focus();
    await expect.poll(emittedEventNames).toContain("briefing_started");

    const propertyKeys = await page.evaluate(() =>
      (window as typeof window & { __portfolioAnalyticsEvents: Array<{ properties?: Record<string, unknown> }> })
        .__portfolioAnalyticsEvents.flatMap((event) => Object.keys(event.properties ?? {})),
    );
    expect(propertyKeys).not.toEqual(expect.arrayContaining(["name", "email", "phone", "briefing", "address"]));
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

  test("painel de aparência não expõe controles de projeto sem efeito e remove preferências órfãs", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("pablo-portfolio-gallery-view", "list");
      window.localStorage.setItem("pablo-portfolio-manual-order", JSON.stringify(["TEC.09"]));
      window.localStorage.setItem("pablo-portfolio-order-profiles", JSON.stringify([{ id: "legado", name: "Legado", order: ["TEC.09"] }]));
      window.localStorage.setItem("pablo-portfolio-active-order-profile", "legado");
    });
    await page.goto("/");

    await page.getByRole("button", { name: /configurações de aparência/i }).click();

    const appearance = page.getByRole("dialog", { name: "Aparência" });
    await expect(appearance).toBeVisible();
    await expect(appearance.getByRole("group", { name: /visualização dos projetos/i })).toHaveCount(0);
    await expect(appearance.getByRole("group", { name: /perfis de ordenação/i })).toHaveCount(0);

    await expect.poll(() =>
      page.evaluate(() => ({
        galleryView: window.localStorage.getItem("pablo-portfolio-gallery-view"),
        manualOrder: window.localStorage.getItem("pablo-portfolio-manual-order"),
        orderProfiles: window.localStorage.getItem("pablo-portfolio-order-profiles"),
        activeOrderProfile: window.localStorage.getItem("pablo-portfolio-active-order-profile"),
      })),
    ).toEqual({
      galleryView: null,
      manualOrder: null,
      orderProfiles: null,
      activeOrderProfile: null,
    });
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
  test("painel de aparência move o foco para dentro e devolve ao gatilho ao fechar", async ({ page }) => {
    await page.goto("/");

    const trigger = page.locator('[data-appearance-trigger="desktop"]');
    await expect(trigger).toBeVisible();
    await trigger.focus();
    await trigger.click();

    const appearance = page.getByRole("dialog", { name: "Aparência" });
    const closeButton = appearance.getByRole("button", { name: /fechar configurações de aparência/i });

    await expect(appearance).toBeVisible();
    await expect(closeButton).toBeFocused();

    await page.keyboard.press("Escape");

    await expect(appearance).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });


  test("remove histórico de busca órfão do armazenamento local", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("pablo-portfolio-recent-searches", JSON.stringify(["Observatório", "React"]));
    });

    await page.goto("/?q=dashboard");
    await page.waitForTimeout(800);

    await expect.poll(() =>
      page.evaluate(() => window.localStorage.getItem("pablo-portfolio-recent-searches")),
    ).toBeNull();
  });

  test("experience hub orienta perfis diferentes sem quebrar a jornada principal", async ({ page }) => {
    await page.goto("/");

    const hubPlaceholder = page.locator('[data-experience-hub-placeholder="true"]');
    await hubPlaceholder.scrollIntoViewIfNeeded();

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

  test("tema sincroniza a barra do navegador, controles nativos e feedbacks", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(() => {
      window.localStorage.setItem("theme-preference", "light");
      window.localStorage.setItem("theme", "light");
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    const themeColor = page.locator('meta[name="theme-color"]');
    const toaster = page.locator('[data-sonner-toaster]');
    await expect(themeColor).toHaveAttribute("content", "#f4f8fc");
    await expect.poll(() => page.evaluate(() => document.documentElement.style.colorScheme)).toBe("light");
    await expect(toaster).toHaveAttribute("data-theme", "light");

    const toggle = page.locator('[data-theme-toggle="true"]').filter({ visible: true }).first();
    await toggle.click();

    await expect(themeColor).toHaveAttribute("content", "#030b1e");
    await expect.poll(() => page.evaluate(() => document.documentElement.style.colorScheme)).toBe("dark");
    await expect(toaster).toHaveAttribute("data-theme", "dark");
  });


  test("portfólio continua funcional quando o armazenamento do navegador é bloqueado", async ({ page }) => {
    await page.addInitScript(() => {
      const blocked = () => {
        throw new DOMException("Storage blocked by browser policy", "SecurityError");
      };
      Object.defineProperty(Storage.prototype, "getItem", { configurable: true, value: blocked });
      Object.defineProperty(Storage.prototype, "setItem", { configurable: true, value: blocked });
      Object.defineProperty(Storage.prototype, "removeItem", { configurable: true, value: blocked });
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Desenvolvo produtos digitais que tornam informação complexa simples de usar/i,
      }),
    ).toBeVisible();
    await expect(page.locator('[data-mobile-menu-toggle="true"]')).toBeVisible();
  });


  test("novo visitante começa com tamanho de texto padrão em 100%", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.removeItem("pablo-portfolio-font-scale");
    });
    await page.goto("/");

    const main = page.locator("#conteudo-principal");
    await expect(main).toBeVisible();
    await expect.poll(() => main.evaluate((element) => (element as HTMLElement).style.fontSize)).toBe("1rem");
  });

});
