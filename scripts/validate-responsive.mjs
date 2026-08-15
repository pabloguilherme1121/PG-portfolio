import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const viewports = [320, 390, 768, 1280];
const results = [];

for (const width of viewports) {
  const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const menuButton = page.getByRole("button", { name: "Abrir menu" });
  const menuVisible = width < 768 && await menuButton.isVisible();
  let menuKeyboardClosed = true;
  if (menuVisible) {
    await menuButton.click();
    await page.keyboard.press("Escape");
    menuKeyboardClosed = !(await page.locator("#mobile-navigation").count());
  }
  await page.locator("#projetos").scrollIntoViewIfNeeded();
  const filters = page.locator('#projetos button[aria-pressed]');
  const filterContainerWidth = await filters.first().locator("..")?.evaluate((element) => ({ scrollWidth: element.scrollWidth, clientWidth: element.clientWidth }));
  const firstFilter = filters.first();
  await firstFilter.focus();
  const filterFocusVisible = await firstFilter.evaluate((element) => {
    const style = getComputedStyle(element);
    return style.outlineStyle !== "none" || style.boxShadow !== "none";
  });
  const droneFilter = page.locator('#projetos button[aria-pressed]', { hasText: "Drone" }).first();
  await droneFilter.click();
  await page.waitForTimeout(280);
  const filterClicked = (await droneFilter.getAttribute("aria-pressed")) === "true";
  const todosFilter = page.locator('#projetos button[aria-pressed]', { hasText: "Todos" }).first();
  await todosFilter.click();
  await page.waitForTimeout(280);
  const searchInput = page.locator('#projetos input[type="search"]');
  await searchInput.fill("Interface");
  await page.waitForTimeout(280);
  const searchWorked = (await page.locator("#projetos .project-gallery-card").count()) > 0;
  await page.locator("#contato").scrollIntoViewIfNeeded();
  const availableDate = page.locator('#contato .availability-calendar button[aria-label*="feira"]:not(:disabled)').first();
  const calendarHasAvailableDate = await availableDate.count() > 0;
  let calendarInteractive = false;
  if (calendarHasAvailableDate) {
    await availableDate.click();
    const availableTime = page.locator('#contato .availability-calendar button:not(:disabled)', { hasText: "08:00" }).first();
    calendarInteractive = await availableTime.count() > 0;
  }
  const reducedMotion = await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  results.push({ width, documentWidth, noViewportOverflow: documentWidth <= width, menuKeyboardClosed, filterFocusVisible, filterContainerWidth, filterClicked, searchWorked, calendarInteractive, reducedMotion });
  await page.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
