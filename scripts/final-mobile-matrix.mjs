import { chromium } from "@playwright/test";

const url = process.env.AUDIT_URL ?? "https://pabloguilh-jhcmnkrj.manus.space/";
const viewports = [
  [320, 568],
  [360, 800],
  [375, 812],
  [390, 844],
  [414, 896],
];
const network = {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  connectionType: "cellular4g",
};

async function measure(browser, width, height) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__metrics = { lcp: null, cls: 0, inp: [] };
    try {
      new PerformanceObserver((list) => { for (const entry of list.getEntries()) { window.__metrics.lcp = { startTime: entry.startTime, size: entry.size, element: entry.element ? { tag: entry.element.tagName, id: entry.element.id, text: (entry.element.textContent || "").trim().slice(0, 120), src: entry.element.currentSrc || entry.element.src || null } : null }; } }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__metrics.cls += entry.value; }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => { for (const entry of list.getEntries()) window.__metrics.inp.push(entry.duration); }).observe({ type: "event", buffered: true, durationThreshold: 16 });
    } catch {}
  });
  const client = await context.newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", network);
  const started = Date.now();
  await page.goto(url, { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(2500);
  const result = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource");
    const size = resources.reduce((sum, resource) => sum + (resource.transferSize || 0), 0);
    const types = resources.reduce((acc, resource) => { acc[resource.initiatorType] = (acc[resource.initiatorType] || 0) + 1; return acc; }, {});
    const blocking = resources.filter((resource) => resource.renderBlockingStatus === "blocking").map((resource) => ({ name: resource.name, start: resource.startTime, end: resource.responseEnd, transferSize: resource.transferSize }));
    return {
      navigation: nav ? { ttfb: nav.responseStart - nav.requestStart, html: nav.responseEnd - nav.responseStart, dcl: nav.domContentLoadedEventEnd, load: nav.loadEventEnd } : null,
      paints: Object.fromEntries(performance.getEntriesByType("paint").map((entry) => [entry.name, entry.startTime])),
      lcp: window.__metrics.lcp,
      cls: window.__metrics.cls,
      inp: window.__metrics.inp.length ? Math.max(...window.__metrics.inp) : null,
      requestCount: resources.length,
      transferBytes: size,
      types,
      blocking,
      overflow: document.documentElement.scrollWidth > window.innerWidth,
      longTasks: performance.getEntriesByType("longtask").map((entry) => entry.duration),
    };
  });
  await context.close();
  return { viewport: `${width}x${height}`, elapsed: Date.now() - started, ...result };
}

const browser = await chromium.launch({ headless: true });
const results = [];
for (const [width, height] of viewports) results.push(await measure(browser, width, height));
await browser.close();
console.log(JSON.stringify({ url, network, measuredAt: new Date().toISOString(), results }, null, 2));
