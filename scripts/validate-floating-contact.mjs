import { chromium } from "playwright";

const baseUrl = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const channels = [
  "https://wa.me/5561992903029?text=Olá%2C%20Pablo%21%20Vim%20pelo%20portfólio%20e%20gostaria%20de%20solicitar%20um%20orçamento.",
  "https://t.me/mpjmarketing",
  "https://www.instagram.com/pablogui000/",
];
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
  const bar = page.locator('[aria-label="Canais de contato"]');
  const links = bar.locator("a");
  const boxes = await links.evaluateAll((items) => items.map((item) => {
    const rect = item.getBoundingClientRect();
    return { href: item.getAttribute("href"), label: item.getAttribute("aria-label"), target: item.getAttribute("target"), rel: item.getAttribute("rel"), width: rect.width, height: rect.height, bottom: window.innerHeight - rect.bottom };
  }));
  const hrefsMatch = boxes.map((item) => item.href).every((href, index) => href === channels[index]);
  await links.nth(0).focus();
  const focusVisible = await page.evaluate(() => document.activeElement?.matches('[aria-label="Falar com Pablo pelo WhatsApp sobre um orçamento"]'));
  await page.emulateMedia({ reducedMotion: "reduce" });
  const transitionDuration = await links.nth(0).evaluate((element) => getComputedStyle(element).transitionDuration);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  results.push({ viewport, count: boxes.length, hrefsMatch, boxes, focusVisible, transitionDuration, overflow });
  await context.close();
}

await browser.close();
if (results.some((result) => result.count !== 3 || !result.hrefsMatch || !result.focusVisible || result.overflow)) {
  console.error(JSON.stringify(results, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(results, null, 2));
