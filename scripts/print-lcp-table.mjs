import fs from "node:fs";
const { summary } = JSON.parse(fs.readFileSync("/tmp/lcp-audit-summary.json", "utf8"));
for (const item of summary) {
  console.log(JSON.stringify({
    scenario: item.scenario,
    ttfb: item.ttfbMs,
    html: item.htmlMs,
    fcp: item.fcpMs,
    lcp: item.lcpMs,
    lcpElement: item.lcpElement?.tag,
    lcpText: item.lcpElement?.text,
    lcpSrc: item.lcpElement?.src,
    requestCount: item.requestCount,
    transferBytes: item.transferBytes,
    jsBytes: item.jsBytes,
    cssBytes: item.cssBytes,
    fontBytes: item.fontBytes,
    blockingCount: item.blockingCount,
    inp: item.inpMs,
    cls: item.cls,
    taskDuration: item.browserTaskDuration,
    scriptDuration: item.browserScriptDuration,
    layoutDuration: item.browserLayoutDuration,
  }));
}
