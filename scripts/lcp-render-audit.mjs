import { chromium } from "@playwright/test";

const url = process.env.AUDIT_URL ?? "https://pabloguilh-jhcmnkrj.manus.space/";
const viewport = { width: 390, height: 844 };
const network = {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
  connectionType: "cellular4g",
};

async function configure(page, cpuSlowdown) {
  const client = await page.context().newCDPSession(page);
  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", network);
  await client.send("Performance.enable");
  if (cpuSlowdown) await client.send("Emulation.setCPUThrottlingRate", { rate: cpuSlowdown });
  return client;
}

async function installObservers(page) {
  await page.addInitScript(() => {
    window.__audit = { lcp: [], cls: [], inp: [], paints: [] };
    try {
      new PerformanceObserver((list) => list.getEntries().forEach((entry) => window.__audit.lcp.push({
        startTime: entry.startTime,
        element: entry.element ? {
          tag: entry.element.tagName,
          id: entry.element.id,
          className: typeof entry.element.className === "string" ? entry.element.className : "",
          text: (entry.element.textContent || "").trim().slice(0, 180),
          src: entry.element.currentSrc || entry.element.getAttribute?.("src") || null,
          outer: entry.element.outerHTML?.slice(0, 600) || null,
        } : null,
        size: entry.size,
      }))).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((list) => list.getEntries().forEach((entry) => { if (!entry.hadRecentInput) window.__audit.cls.push({ startTime: entry.startTime, value: entry.value }); })).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((list) => list.getEntries().forEach((entry) => window.__audit.inp.push({ startTime: entry.startTime, duration: entry.duration, name: entry.name }))).observe({ type: "event", buffered: true, durationThreshold: 0 });
      new PerformanceObserver((list) => list.getEntries().forEach((entry) => window.__audit.paints.push({ name: entry.name, startTime: entry.startTime }))).observe({ type: "paint", buffered: true });
    } catch {}
  });
}

function requestSummary(requests) {
  return requests.map((item) => ({
    url: item.url,
    type: item.type,
    method: item.method,
    start: item.start,
    end: item.end,
    duration: item.end == null ? null : item.end - item.start,
    status: item.status ?? null,
    contentLength: item.contentLength ?? null,
    transferSize: item.transferSize ?? null,
  }));
}

async function collect(page, client, label, cpuSlowdown, warm) {
  const requests = new Map();
  const onRequest = (request) => requests.set(request, { url: request.url(), type: request.resourceType(), method: request.method(), start: performance.now() });
  const onResponse = async (response) => {
    const item = requests.get(response.request());
    if (!item) return;
    item.status = response.status();
    const headers = response.headers();
    item.contentLength = Number(headers["content-length"] || 0) || null;
    try {
      const timing = response.request().timing();
      item.serverTiming = timing;
    } catch {}
  };
  const onRequestFinished = async (request) => {
    const item = requests.get(request);
    if (!item) return;
    item.end = performance.now();
    try {
      const response = await request.response();
      if (response) {
        const headers = response.headers();
        item.contentLength = Number(headers["content-length"] || 0) || item.contentLength;
      }
    } catch {}
  };
  page.on("request", onRequest);
  page.on("response", onResponse);
  page.on("requestfinished", onRequestFinished);
  const startedAt = performance.now();
  await page.goto(url, { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(2500);
  const browserMetrics = await client.send("Performance.getMetrics");
  const pageData = await page.evaluate(() => {
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
      renderBlockingStatus: entry.renderBlockingStatus ?? null,
    }));
    const lcp = window.__audit.lcp.at(-1) || null;
    const paints = Object.fromEntries(window.__audit.paints.map((entry) => [entry.name, entry.startTime]));
    const renderBlocking = [...document.querySelectorAll("link[rel=stylesheet], script[src]")].map((element) => ({
      tag: element.tagName,
      url: element.href || element.src,
      media: element.getAttribute("media"),
      async: element.getAttribute("async"),
      defer: element.getAttribute("defer"),
    }));
    const fonts = resources.filter((entry) => /\.(woff2?|ttf|otf)(\?|$)/i.test(entry.name));
    const lcpResource = lcp?.element?.src ? resources.find((entry) => entry.name === lcp.element.src) : null;
    return {
      navigation: navigation ? {
        startTime: navigation.startTime,
        requestStart: navigation.requestStart,
        responseStart: navigation.responseStart,
        responseEnd: navigation.responseEnd,
        domContentLoaded: navigation.domContentLoadedEventEnd,
        loadEventEnd: navigation.loadEventEnd,
        ttfb: navigation.responseStart - navigation.requestStart,
        htmlDownload: navigation.responseEnd - navigation.responseStart,
      } : null,
      paints,
      lcp,
      lcpResource,
      cls: window.__audit.cls.reduce((sum, entry) => sum + entry.value, 0),
      inp: window.__audit.inp.length ? Math.max(...window.__audit.inp.map((entry) => entry.duration)) : null,
      resources,
      fonts,
      renderBlocking,
      htmlBytes: document.documentElement.outerHTML.length,
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    };
  });
  page.removeListener("request", onRequest);
  page.removeListener("response", onResponse);
  page.removeListener("requestfinished", onRequestFinished);
  const metrics = Object.fromEntries((browserMetrics.metrics || []).map((metric) => [metric.name, metric.value]));
  const sorted = requestSummary([...requests.values()]).sort((a, b) => a.start - b.start);
  return { label, cpuSlowdown, warm, elapsed: performance.now() - startedAt, page: pageData, metrics, requests: sorted };
}

async function runScenario(cpuSlowdown, warm) {
  const context = await chromium.launch({ headless: true }).then((browser) => browser.newContext({ viewport, deviceScaleFactor: 1 }));
  const page = await context.newPage();
  await installObservers(page);
  const client = await configure(page, cpuSlowdown);
  if (!warm) {
    const result = await collect(page, client, `cold-${cpuSlowdown ? "cpu4x" : "cpu1x"}`, cpuSlowdown, false);
    await context.browser()?.close?.();
    return result;
  }
  await page.goto(url, { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(1500);
  return await collect(page, client, `warm-${cpuSlowdown ? "cpu4x" : "cpu1x"}`, cpuSlowdown, true).finally(() => context.browser()?.close?.());
}

const results = [];
for (const cpu of [1, 4]) {
  results.push(await runScenario(cpu, false));
  results.push(await runScenario(cpu, true));
}
console.log(JSON.stringify({ url, viewport, network, measuredAt: new Date().toISOString(), results }, null, 2));
