import { chromium } from "playwright";
import { writeFile } from "node:fs/promises";

const url = "https://pabloguilh-jhcmnkrj.manus.space/";
const outputPath = "/home/ubuntu/perf-published-baseline.json";
const network = {
  offline: false,
  latency: 170,
  downloadThroughput: Math.round((1.6 * 1024 * 1024) / 8),
  uploadThroughput: Math.round((0.75 * 1024 * 1024) / 8),
  connectionType: "cellular4g",
};

async function installObservers(page) {
  await page.addInitScript(() => {
    const state = { lcp: null, cls: 0, inp: null, lcpElement: null };
    window.__portfolioPerf = state;
    try {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const entry = entries.at(-1);
        if (!entry) return;
        state.lcp = entry.startTime;
        const element = entry.element;
        state.lcpElement = element ? `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${element.getAttribute("data-hero-cta") ? "[data-hero-cta]" : ""}${element.getAttribute("alt") ? `[alt=${element.getAttribute("alt")}]` : ""}` : null;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) state.cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = entry.duration || 0;
          if (entry.interactionId && (!state.inp || duration > state.inp)) state.inp = duration;
        }
      }).observe({ type: "event", buffered: true, durationThreshold: 16 });
    } catch {}
  });
}

async function capture(page, session, label, { clearCache = false, cpuRate = 1 } = {}) {
  await session.send("Performance.enable");
  await session.send("Network.enable");
  await session.send("Network.emulateNetworkConditions", network);
  await session.send("Emulation.setCPUThrottlingRate", { rate: cpuRate });
  await session.send("Network.setCacheDisabled", { cacheDisabled: clearCache });
  if (clearCache) await session.send("Network.clearBrowserCache");
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForTimeout(7000);
  const menuButton = page.locator('button[aria-label="Abrir menu"]');
  if (await menuButton.count()) {
    await menuButton.click();
    await page.waitForTimeout(250);
    await page.locator('button[aria-label="Fechar menu"]').click();
    await page.waitForTimeout(1000);
  }
  const values = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource").map((entry) => ({
      name: entry.name,
      initiatorType: entry.initiatorType,
      startTime: entry.startTime,
      responseStart: entry.responseStart,
      responseEnd: entry.responseEnd,
      duration: entry.duration,
      transferSize: entry.transferSize,
      encodedBodySize: entry.encodedBodySize,
      decodedBodySize: entry.decodedBodySize,
    }));
    const paint = performance.getEntriesByType("paint").map((entry) => ({ name: entry.name, startTime: entry.startTime }));
    return { navigation, resources, paint, observer: window.__portfolioPerf };
  });
  const metrics = await session.send("Performance.getMetrics");
  const metric = Object.fromEntries(metrics.metrics.map(({ name, value }) => [name, value]));
  return { label, cpuRate, network, ...values, browserMetrics: metric };
}

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  const coldContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const coldPage = await coldContext.newPage();
  await installObservers(coldPage);
  const coldSession = await coldPage.context().newCDPSession(coldPage);
  results.push(await capture(coldPage, coldSession, "4G cold cache", { clearCache: true, cpuRate: 1 }));
  results.push(await capture(coldPage, coldSession, "4G warm cache", { clearCache: false, cpuRate: 1 }));
  await coldContext.close();

  const cpuContext = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const cpuPage = await cpuContext.newPage();
  await installObservers(cpuPage);
  const cpuSession = await cpuPage.context().newCDPSession(cpuPage);
  results.push(await capture(cpuPage, cpuSession, "4G cold cache + CPU 4x", { clearCache: true, cpuRate: 4 }));
  await cpuContext.close();
} finally {
  await browser.close();
}

await writeFile(outputPath, JSON.stringify({ capturedAt: new Date().toISOString(), url, results }, null, 2));
console.log(outputPath);
