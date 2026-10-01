import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Use system fonts so external font availability cannot mask runtime regressions.
  await page.route("https://fonts.googleapis.com/**", (route) => route.fulfill({ contentType: "text/css", body: "" }));
});

test("Arcade troca jogos sem buscar mais código depois de abrir", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: /jogar no pg arcade/i }).click();
  const arcade = page.locator('[data-arcade-hub="true"]');
  await expect(arcade.locator('[data-tic-tac-toe="true"]')).toBeVisible({ timeout: 15_000 });
  const requests: string[] = [];
  await page.route(/\/assets\/.*\.js$/, (route) => {
    requests.push(route.request().url());
    return route.abort();
  });
  await arcade.getByRole("tab", { name: /dominó/i }).click();
  await expect(arcade.locator('[data-domino-game="true"]')).toBeVisible();
  await arcade.getByRole("tab", { name: /damas/i }).click();
  await expect(arcade.locator('[data-checkers-board="true"]')).toBeVisible();
  expect(requests).toEqual([]);
});

for (const file of ["bootstrapStatic", "index"]) {
test(`arquivo ${file} indisponível permite uma recuperação e exibe alternativa utilizável`, async ({ page }) => {
  let attempts = 0;
  let navigations = 0;
  page.on("request", (request) => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) navigations += 1;
  });
  await page.addInitScript(() => {
    Object.defineProperty(window, "sessionStorage", { get() { throw new DOMException("Storage denied", "SecurityError"); } });
  });
  await page.route(new RegExp(`/assets/${file}-[^/]+\\.js$`), (route) => {
    attempts += 1;
    return route.abort();
  });
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Não foi possível carregar o portfólio." })).toBeVisible({ timeout: 15_000 });
  await expect.poll(() => navigations).toBe(2);
  // WebKit may reuse a failed module response during the second navigation.
  expect(attempts).toBeGreaterThanOrEqual(1);
  expect(attempts).toBeLessThanOrEqual(2);
  await expect(page.getByRole("link", { name: "Abrir o portfólio novamente" })).toHaveAttribute("href", "/PG-portfolio/");
  const retried = await page.evaluate(async () => {
    return (window as Window & { __pgRuntimeRescue: { rescue: (reason: string) => Promise<boolean> } }).__pgRuntimeRescue.rescue("window-error");
  });
  expect(retried).toBe(false);
});
}

test("página inteira e repertório social funcionam em telas pequenas", async ({ page }) => {
  test.setTimeout(60_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");
    for (const id of ["projetos", "social", "contato-briefing", "pg-lab"]) {
      const section = page.locator(`#${id}`);
      // Deferred placeholders are replaced during scrolling; reacquire by ID afterwards.
      await section.evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "center" }));
      await expect(section).toBeVisible();
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
    }
    const social = page.locator("#social");
    await expect(social.getByRole("heading", { name: "O que está em movimento." })).toBeVisible();
    const filter = social.getByRole("button", { name: "drone", exact: true });
    await filter.evaluate((element) => element.scrollIntoView({ behavior: "instant", block: "center" }));
    await filter.click();
    await expect(social.getByText(/1 referência visível/)).toBeVisible();
    await expect(page.getByText("Algo saiu do percurso.", { exact: true })).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test("controles flutuantes permanecem ocultos enquanto o teclado fecha", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    const viewport = new EventTarget();
    Object.assign(viewport, { height: 844, width: 390, scale: 1, offsetTop: 0, offsetLeft: 0 });
    Object.defineProperty(window, "visualViewport", { configurable: true, value: viewport });
  });
  await page.goto("./#contato-briefing");
  const form = page.locator('[data-briefing-form="true"]');
  await expect(form).toBeVisible();
  await form.locator('input[name="name"]').focus();
  await page.evaluate(() => {
    Object.assign(window.visualViewport!, { height: 450 });
    window.visualViewport!.dispatchEvent(new Event("resize"));
    (document.activeElement as HTMLElement).blur();
  });
  const dock = page.locator('[data-mobile-dock="true"]');
  await expect(dock).toHaveAttribute("data-mobile-dock-hidden", "true");
  await expect(page.getByRole("button", { name: "Voltar ao topo da página" })).toHaveCount(0);
  await page.evaluate(() => {
    Object.assign(window.visualViewport!, { height: 844 });
    window.visualViewport!.dispatchEvent(new Event("resize"));
  });
  await expect(dock).toHaveAttribute("data-mobile-dock-hidden", "false");
  await expect(page.getByRole("button", { name: "Voltar ao topo da página" })).toBeVisible();
});

test("mobile continua utilizável com armazenamento bloqueado em 320px", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.setViewportSize({ width: 320, height: 800 });
  await page.addInitScript(() => {
    for (const key of ["localStorage", "sessionStorage"]) {
      Object.defineProperty(window, key, { configurable: true, get() { throw new DOMException("Storage denied", "SecurityError"); } });
    }
  });
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.locator('[data-mobile-menu-toggle="true"]').click();
  await expect(page.getByRole("dialog", { name: "Menu de navegação móvel" })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: /jogar no pg arcade/i }).click();
  const arcade = page.locator('[data-arcade-hub="true"]');
  await expect(arcade, JSON.stringify(errors)).toBeVisible({ timeout: 15_000 });
  for (const game of [/dominó/i, /damas/i]) {
    await arcade.getByRole("tab", { name: game }).click();
    await expect(arcade.getByRole("tabpanel")).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  }
  expect(errors).toEqual([]);
});
