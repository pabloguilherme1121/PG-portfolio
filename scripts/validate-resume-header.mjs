import { chromium } from "playwright";

const baseUrl = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const expectedHref = "/manus-storage/curriculo-pablo-guilherme-profissional_dc004b40.pdf";
const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const headerCta = page.locator('[data-resume-header="true"]').first();
  const visibleBeforeMenu = await headerCta.isVisible();
  if (viewport.width < 768) {
    await page.getByRole("button", { name: "Abrir menu" }).click();
  }
  const cta = page.locator('[data-resume-header="true"]').last();
  const box = await cta.boundingBox();
  const href = await cta.getAttribute("href");
  const download = await cta.getAttribute("download");
  await cta.focus();
  const focusVisible = await cta.evaluate((element) => document.activeElement === element && element.className.includes("focus-visible:ring-2"));
  const hasTarget = href?.includes(expectedHref) === true;
  const hasDownload = download === "curriculo-pablo-guilherme.pdf";
  results.push({ viewport, visibleBeforeMenu, visibleInActiveHeader: await cta.isVisible(), hasTarget, hasDownload, focusVisible, height: box?.height, overflow: await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1) });
  await context.close();
}

await browser.close();
  if (results.some((result) => !result.visibleInActiveHeader || !result.hasTarget || !result.hasDownload || !result.focusVisible || (result.height ?? 0) < (result.viewport.width < 768 ? 44 : 32) || result.overflow)) {
  console.error(JSON.stringify(results, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(results, null, 2));
