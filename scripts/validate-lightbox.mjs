import { chromium } from "playwright";

const url = process.env.SITE_URL ?? "http://127.0.0.1:3000/";
const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const trigger = page.locator('button[aria-label^="Ampliar imagem"]').first();
  if (!(await trigger.count())) throw new Error(`Nenhum gatilho de lightbox em ${viewport.width}px`);
  await trigger.click();
  const dialog = page.locator('[role="dialog"][aria-labelledby="project-lightbox-title"]');
  await dialog.waitFor({ state: "visible" });
  const initialTitle = await page.locator("#project-lightbox-title").textContent();
  const imageAlt = await dialog.locator("img").getAttribute("alt");
  const lockedScroll = await page.evaluate(() => document.body.style.overflow === "hidden");
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(80);
  const nextTitle = await page.locator("#project-lightbox-title").textContent();
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  const restoredFocus = await page.evaluate(() => document.activeElement?.getAttribute("aria-label")?.startsWith("Ampliar imagem") ?? false);
  results.push({ viewport: viewport.width, opened: true, hasImageAlt: Boolean(imageAlt), lockedScroll, arrowNavigationChangedTitle: initialTitle !== nextTitle, closedByEscape: true, restoredFocus });
  await context.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
