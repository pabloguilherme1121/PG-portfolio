import { test, expect } from "@playwright/test";

for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
  test(`professional journey at ${width}px`, async ({ page }) => {
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
    await contact.getByRole("link", { name: "Prefiro preparar um briefing" }).click();
    await expect(contact.locator('[data-briefing-form="true"]')).toBeVisible();
    await page.reload();
    await expect(page.locator('[data-briefing-form="true"]')).toBeVisible();
  });
}

test("main navigation names are distinct and keyboard-accessible", async ({ page, browserName }) => {
  await page.goto("./");
  const links = page.locator('header nav a[href^="#"]');
  const names = await links.allTextContents();
  expect(new Set(names.map(name => name.trim())).size).toBe(names.length);
  const skipLink = page.getByRole("link", { name: /pular para o conteúdo/i });
  if (browserName === "webkit") {
    // Safari full keyboard access is an OS preference; test activation separately.
    await skipLink.focus();
  } else {
    await page.keyboard.press("Tab");
  }
  await expect(skipLink).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#conteudo-principal")).toBeFocused();
});

test("calendar deep link opens contextual consultation without requiring briefing", async ({ page }) => {
  await page.goto("./#agenda");
  const calendar = page.locator("#agenda");
  await expect(calendar).toBeVisible();
  await expect(calendar.locator(".." )).toHaveAttribute("open", "");
  await expect(page.locator('[data-briefing-form="true"]')).toBeHidden();
  await page.goto("./?consultation=1#contato");
  await page.locator("#contato summary").filter({ hasText: "Consultar uma data" }).click();
  await expect(calendar).toBeVisible();
});


test("normal-motion contact journey opens optional briefing after public navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("./");
  await page.locator("#inicio").getByRole("link", { name: "Conversar sobre um projeto" }).click();
  const contact = page.locator("#contato");
  await expect(contact.getByRole("link", { name: "Conversar no WhatsApp" })).toBeVisible();
  await contact.getByRole("link", { name: "Prefiro preparar um briefing" }).click();
  await expect(contact.locator('[data-briefing-form="true"]')).toBeVisible();
  await expect(contact.locator('input[name="name"]')).toBeEditable();
});
