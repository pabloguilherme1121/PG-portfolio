import { chromium } from "playwright";

const baseUrl = process.env.PERF_URL || "https://pabloguilh-jhcmnkrj.manus.space/";
const viewport = { width: 390, height: 844 };
const profile = { latency: 150, downloadThroughput: 1_600_000 / 8, uploadThroughput: 750_000 / 8 };

async function capture(page, label, cpuRate) {
  await page.addInitScript(() => {
    window.__perfAudit = { lcp: [], cls: 0, longTasks: [] };
    new PerformanceObserver((list) => window.__perfAudit.lcp.push(...list.getEntries().map((entry) => ({ startTime: entry.startTime, url: entry.url || "", size: entry.size || 0, element: entry.element?.tagName || "" })))).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__perfAudit.cls += entry.value; }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => window.__perfAudit.longTasks.push(...list.getEntries().map((entry) => ({ startTime: entry.startTime, duration: entry.duration })))).observe({ type: "longtask", buffered: true });
  });
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", { offline: false, ...profile, connectionType: "cellular4g" });
  await client.send("Emulation.setCPUThrottlingRate", { rate: cpuRate });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForTimeout(5_000);
  const sample = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0];
    const paint = performance.getEntriesByType("paint");
    const resources = performance.getEntriesByType("resource").map((entry) => ({ name: entry.name, initiatorType: entry.initiatorType, transferSize: entry.transferSize, encodedBodySize: entry.encodedBodySize, startTime: entry.startTime, responseEnd: entry.responseEnd, duration: entry.duration })).sort((a, b) => b.transferSize - a.transferSize);
    const hero = document.querySelector("#inicio picture img");
    const imageInfo = hero ? { currentSrc: hero.currentSrc, naturalWidth: hero.naturalWidth, naturalHeight: hero.naturalHeight, loading: hero.loading, fetchPriority: hero.fetchPriority, width: hero.getAttribute("width"), height: hero.getAttribute("height") } : null;
    return {
      nav: nav ? { ttfb: nav.responseStart, htmlEnd: nav.responseEnd, domContentLoaded: nav.domContentLoadedEventEnd, load: nav.loadEventEnd, transferSize: nav.transferSize } : null,
      firstContentfulPaint: paint.find((entry) => entry.name === "first-contentful-paint")?.startTime ?? null,
      lcp: window.__perfAudit.lcp.at(-1) ?? null,
      cls: window.__perfAudit.cls,
      longTasks: window.__perfAudit.longTasks,
      resources,
      imageInfo,
      viewport: { width: window.innerWidth, height: window.innerHeight, scrollWidth: document.documentElement.scrollWidth },
    };
  });
  await client.detach();
  return { label, cpuRate, ...sample };
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const coldContext = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const coldPage = await coldContext.newPage();
  const cold = await capture(coldPage, "4G frio", 1);
  const warm = await capture(coldPage, "4G quente", 1);
  await coldContext.close();
  const cpuContext = await browser.newContext({ viewport, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const cpuPage = await cpuContext.newPage();
  const cpu4x = await capture(cpuPage, "4G frio + CPU 4x", 4);
  await cpuContext.close();
  await browser.close();
  console.log(JSON.stringify({ url: baseUrl, generatedAt: new Date().toISOString(), runs: [cold, warm, cpu4x] }, null, 2));
}

run().catch((error) => { console.error(error); process.exit(1); });
