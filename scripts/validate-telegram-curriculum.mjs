import { chromium } from "playwright";

const baseUrl = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const viewports = [
  { width: 1280, height: 720 },
  { width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });

  const telegramLinks = await page.locator('a[href="https://t.me/mpjmarketing"]').count();
  const telegramTargets = await page.locator('a[href="https://t.me/mpjmarketing"]').evaluateAll((links) => links.map((link) => ({ target: link.getAttribute("target"), rel: link.getAttribute("rel"), label: link.getAttribute("aria-label") || link.textContent?.trim() })));
  const resumeHref = await page.locator('a[download="curriculo-pablo-guilherme.pdf"]').getAttribute("href");
  const telegramCta = page.locator('a[href="https://t.me/mpjmarketing"]').first();
  const telegramBox = await telegramCta.boundingBox();
  const bodyOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);

  await page.emulateMedia({ reducedMotion: "reduce" });
  const reducedMotionTransitions = await telegramCta.evaluate((element) => getComputedStyle(element).transitionDuration);

  results.push({ viewport, telegramLinks, telegramTargets, resumeHref, telegramCtaVisible: await telegramCta.isVisible(), telegramBox, bodyOverflow, reducedMotionTransitions });
  await context.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
