import fs from "node:fs";
const { results } = JSON.parse(fs.readFileSync("/tmp/final-mobile-matrix.json", "utf8"));
for (const result of results) {
  console.log(JSON.stringify({
    viewport: result.viewport,
    ttfb: result.navigation?.ttfb,
    html: result.navigation?.html,
    fcp: result.paints?.["first-contentful-paint"],
    lcp: result.lcp?.startTime,
    lcpElement: result.lcp?.element,
    cls: result.cls,
    inp: result.inp,
    requests: result.requestCount,
    transfer: result.transferBytes,
    types: result.types,
    blocking: result.blocking,
    overflow: result.overflow,
    longTasks: result.longTasks,
  }));
}
