import fs from "node:fs";
const { results } = JSON.parse(fs.readFileSync("/tmp/lcp-render-audit.json", "utf8"));
for (const result of results) {
  const scenario = `${result.warm ? "warm" : "cold"}-cpu${result.cpuSlowdown}x`;
  console.log(`\n### ${scenario}`);
  const resources = result.page.resources.filter((resource) => /fonts\.googleapis|fonts\.gstatic|index-.*\.css|\.js($|\?)|pablo-(hero|retrato|pg-mark)|showreel.*poster/i.test(resource.name));
  for (const resource of resources) {
    console.log(JSON.stringify({
      name: resource.name,
      type: resource.initiatorType,
      start: Number(resource.startTime?.toFixed?.(1) ?? resource.startTime),
      responseStart: Number(resource.responseStart?.toFixed?.(1) ?? resource.responseStart),
      end: Number(resource.responseEnd?.toFixed?.(1) ?? resource.responseEnd),
      duration: Number(resource.duration?.toFixed?.(1) ?? resource.duration),
      transferSize: resource.transferSize,
      encodedBodySize: resource.encodedBodySize,
      renderBlockingStatus: resource.renderBlockingStatus,
    }));
  }
}
