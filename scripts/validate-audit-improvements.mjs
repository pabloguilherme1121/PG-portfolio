import { chromium } from "playwright";

const baseUrl = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const viewports = [
  { name: "mobile", width: 320, height: 780 },
  { name: "phone", width: 390, height: 844 },
  { name: "desktop", width: 1280, height: 900 },
];

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.locator('nav[aria-label="Atalhos principais"]').scrollIntoViewIfNeeded();
    const routeCount = await page.locator('nav[aria-label="Atalhos principais"] a').count();
    if (routeCount !== 3) throw new Error(`${viewport.name}: expected 3 intent routes, got ${routeCount}`);
    const labels = await page.locator('nav[aria-label="Atalhos principais"] a').allTextContents();
    if (!labels.some((label) => label.includes("ver evidências")) || !labels.some((label) => label.includes("entender serviços")) || !labels.some((label) => label.includes("iniciar conversa"))) {
      throw new Error(`${viewport.name}: intent labels missing`);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) throw new Error(`${viewport.name}: horizontal overflow detected`);
    const focused = await page.locator('nav[aria-label="Atalhos principais"] a').first().evaluate((element) => {
      element.focus();
      return document.activeElement === element;
    });
    if (!focused) throw new Error(`${viewport.name}: route cannot receive focus`);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const reduced = await page.locator(".archive-quick-route").first().evaluate((element) => getComputedStyle(element).transitionDuration === "0s");
    if (!reduced) throw new Error(`${viewport.name}: reduced motion transition not disabled`);
    await page.close();
  }
  console.log("Audit improvement validation passed: intent routes, overflow, focus and reduced motion.");
} finally {
  await browser.close();
}
