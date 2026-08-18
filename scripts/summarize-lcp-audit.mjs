import fs from "node:fs";
const data = JSON.parse(fs.readFileSync("/tmp/lcp-render-audit.json", "utf8"));
const summary = data.results.map((result) => {
  const navigation = result.page.navigation || {};
  const resources = result.page.resources || [];
  const blocking = resources.filter((resource) => resource.renderBlockingStatus === "blocking");
  const js = resources.filter((resource) => /\.js($|\?)/i.test(resource.name));
  const css = resources.filter((resource) => /\.css($|\?)/i.test(resource.name));
  const fonts = resources.filter((resource) => /\.(woff2?|ttf|otf)(\?|$)/i.test(resource.name));
  const totals = (items) => items.reduce((sum, item) => sum + (item.transferSize || 0), 0);
  const lcp = result.page.lcp;
  return {
    scenario: `${result.warm ? "warm" : "cold"}-cpu${result.cpuSlowdown}x`,
    ttfbMs: navigation.ttfb,
    htmlMs: navigation.htmlDownload,
    domContentLoadedMs: navigation.domContentLoaded,
    firstPaintMs: result.page.paints?.["first-paint"] ?? null,
    fcpMs: result.page.paints?.["first-contentful-paint"] ?? null,
    lcpMs: lcp?.startTime ?? null,
    lcpElement: lcp?.element ?? null,
    lcpSize: lcp?.size ?? null,
    inpMs: result.page.inp,
    cls: result.page.cls,
    requestCount: resources.length,
    transferBytes: totals(resources),
    jsBytes: totals(js),
    cssBytes: totals(css),
    fontBytes: totals(fonts),
    blockingCount: blocking.length,
    blocking: blocking.map((item) => ({ name: item.name, startTime: item.startTime, responseEnd: item.responseEnd, transferSize: item.transferSize })),
    longestResources: [...resources].sort((a, b) => (b.duration || 0) - (a.duration || 0)).slice(0, 8),
    browserTaskDuration: result.metrics.TaskDuration ?? null,
    browserScriptDuration: result.metrics.ScriptDuration ?? null,
    browserLayoutDuration: result.metrics.LayoutDuration ?? null,
  };
});
console.log(JSON.stringify({ measuredAt: data.measuredAt, summary }, null, 2));
