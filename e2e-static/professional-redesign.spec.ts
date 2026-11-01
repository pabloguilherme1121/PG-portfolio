import { test, expect } from "@playwright/test";

for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
  for (const activation of ["pointer", "keyboard"] as const) {
    test(`professional journey at ${width}px via ${activation}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.setViewportSize({ width, height: 900 });
      await page.goto("./");
      const hero = page.locator("#inicio");
      const projects = hero.getByRole("link", { name: "Ver projetos" });
      await expect(projects).toBeVisible();
      await expect(hero.getByRole("link", { name: "Conversar sobre um projeto" })).toHaveAttribute("href", "#contato");
      const position = await projects.boundingBox();
      expect(position!.y + position!.height).toBeLessThan(900);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      await projects.click();
      await expect(page.locator('[data-observatorio-capture="true"]')).toBeVisible();
      const arcade = page.locator('[data-arcade-full-site="true"]');
      await expect(arcade).toHaveAttribute("target", "_blank");
      await expect(arcade).toHaveAttribute("href", "https://pabloguilherme1121.github.io/PG-Arcade/");
      await page.goto("./?consultation=1#contato");
      const contact = page.locator("#contato");
      await expect(contact.getByRole("link", { name: "Conversar no WhatsApp" })).toBeVisible();
      await expect(contact.locator('[data-briefing-form="true"]')).toBeHidden();
      const briefingLink = contact.getByRole("link", { name: "Prefiro preparar um briefing" });
      await briefingLink.scrollIntoViewIfNeeded();
      // Keep pointer and keyboard activation independent: keyboard success must
      // never hide a pointer regression, including on mobile WebKit.
      if (activation === "keyboard") {
        await briefingLink.focus();
        await expect(briefingLink).toBeFocused();
        await briefingLink.press("Enter");
      } else {
        await briefingLink.click();
      }
      await expect(page).toHaveURL(/#contato-briefing$/);
      await expect(contact.locator('[data-briefing-form="true"]')).toBeVisible();
      await page.reload();
      await expect(page.locator('[data-briefing-form="true"]')).toBeVisible();
    });
  }
}

// Browser fixture creates a fresh context with full project device emulation
// (isMobile, hasTouch, DPR and viewport), unlike browser.newPage overrides.
for (let attempt = 1; attempt <= 5; attempt += 1) {
  test(`briefing native anchor survives pointer cold visit ${attempt}/5 at 390px`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("./?consultation=1#contato");
    const contact = page.locator("#contato");
    const briefingLink = contact.getByRole("link", { name: "Prefiro preparar um briefing" });
    const form = contact.locator('[data-briefing-form="true"]');
    await expect(briefingLink).toHaveAttribute("href", "#contato-briefing");
    await expect(briefingLink).toBeVisible();
    await expect(form).toBeHidden();
    await briefingLink.scrollIntoViewIfNeeded();
    await briefingLink.click();
    await expect(page).toHaveURL(/#contato-briefing$/);
    await expect(form).toBeVisible();
  });
}

test("briefing normal-motion pointer at 390px opens its native anchor", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./?consultation=1#contato");
  const contact = page.locator("#contato");
  const briefingLink = contact.getByRole("link", { name: "Prefiro preparar um briefing" });
  const form = contact.locator('[data-briefing-form="true"]');
  await expect(briefingLink).toHaveAttribute("href", "#contato-briefing");
  await expect(briefingLink).toBeVisible();
  await expect(form).toBeHidden();
  await briefingLink.scrollIntoViewIfNeeded();
  await briefingLink.click();
  await expect(page).toHaveURL(/#contato-briefing$/);
  await expect(form).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("briefing ignores pointer release without a matching press at 390px", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 900 });
  // A primeira visita já cria um documento frio; o reload extra pode competir
  // com a navegação inicial por âncora no WebKit.
  await page.goto("./?consultation=1#contato");

  const contact = page.locator("#contato");
  const briefingLink = contact.getByRole("link", { name: "Prefiro preparar um briefing" });
  const form = contact.locator('[data-briefing-form="true"]');
  await expect(briefingLink).toBeVisible();
  await expect(form).toBeHidden();
  await briefingLink.scrollIntoViewIfNeeded();
  const bounds = await briefingLink.boundingBox();
  expect(bounds).not.toBeNull();

  // Pressionar fora e soltar dentro nao ativa a ancora nativa.
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height + 12);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.up();

  await expect(page).toHaveURL(/#contato$/);
  await expect(form).toBeHidden();
});

for (const width of [320, 390]) {
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    test(`main navigation names and skip-link remain keyboard-accessible at ${width}px (cold visit ${attempt}/5)`, async ({ page, browserName }) => {
      // The page fixture preserves every device option from the Playwright project.
      await page.setViewportSize({ width, height: 900 });
      await page.goto("./");
      const links = page.locator('header nav a[href^="#"]');
      await expect(links).not.toHaveCount(0);
      const names = await links.allTextContents();
      expect(new Set(names.map(name => name.trim())).size).toBe(names.length);
      const skipLink = page.getByRole("link", { name: /pular para o conteúdo/i });
      await expect(skipLink).toBeAttached();
      if (browserName === "webkit") {
        // Safari full keyboard access depends on the operating system.
        await skipLink.focus();
      } else {
        // In Chromium a genuine first Tab must focus the skip-link.
        await page.keyboard.press("Tab");
      }
      await expect(skipLink).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("#conteudo-principal")).toBeFocused();
    });
  }
}

test("calendar deep link opens contextual consultation without requiring briefing", async ({ page }) => {
  await page.goto("./#agenda");
  const calendar = page.locator("#agenda");
  await expect(calendar).toBeVisible();
  await expect(calendar.locator(".." )).toHaveAttribute("open", "");
  await expect(page.locator('[data-briefing-form="true"]')).toBeHidden();
  await page.goto("./?consultation=1#contato");
  await page.locator("#contato summary").filter({ hasText: "Consultar uma data" }).scrollIntoViewIfNeeded();
  await page.locator("#contato summary").filter({ hasText: "Consultar uma data" }).click();
  await expect(calendar).toBeVisible();
});


test("normal-motion contact journey opens optional briefing after public navigation", async ({ page, browserName }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./");
  await page.locator("#inicio").getByRole("link", { name: "Conversar sobre um projeto" }).click();
  const contact = page.locator("#contato");
  await expect(contact.getByRole("link", { name: "Conversar no WhatsApp" })).toBeVisible();
  const briefing = contact.getByRole("link", { name: "Prefiro preparar um briefing" });
  // WebKit can move the click hit target while smooth scrolling and deferred
  // sections reflow. Activate the same native link using keyboard semantics;
  // pointer activation has its own reduced-motion journey in every browser.
  if (browserName === "webkit") {
    await briefing.focus();
    await expect(briefing).toBeFocused();
    await briefing.press("Enter");
  } else {
    await briefing.click();
  }
  await expect(page).toHaveURL(/#contato-briefing$/);
  await expect(contact.locator('[data-briefing-form="true"]')).toBeVisible();
  await expect(contact.locator('input[name="name"]')).toBeEditable();
});
