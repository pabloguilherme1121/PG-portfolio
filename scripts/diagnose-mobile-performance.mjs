import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const baseUrl = process.env.DIAGNOSTIC_URL || "http://127.0.0.1:3000";
await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });

const diagnostics = await page.evaluate(() => {
  const overflowing = Array.from(document.querySelectorAll("body *")).flatMap((element) => {
    const htmlElement = element;
    const style = getComputedStyle(htmlElement);
    const rect = htmlElement.getBoundingClientRect();
    const isVisible = rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    const horizontalOverflow = htmlElement.scrollWidth > htmlElement.clientWidth + 1;
    const viewportOverflow = rect.right > window.innerWidth + 1 || rect.left < -1;
    const text = htmlElement.children.length === 0 ? (htmlElement.textContent || "").trim().replace(/\\s+/g, " ") : "";
    if (!isVisible || (!horizontalOverflow && !viewportOverflow) || !text) return [];
    return [{ tag: htmlElement.tagName.toLowerCase(), className: htmlElement.className, text: text.slice(0, 100), scrollWidth: htmlElement.scrollWidth, clientWidth: htmlElement.clientWidth, right: Math.round(rect.right) }];
  });

  const resources = performance.getEntriesByType("resource").map((entry) => ({
    name: entry.name.split("/").pop() || entry.name,
    type: entry.initiatorType,
    duration: Math.round(entry.duration),
    transferSize: entry.transferSize || 0,
    decodedBodySize: entry.decodedBodySize || 0,
  })).sort((a, b) => (b.transferSize || b.decodedBodySize) - (a.transferSize || a.decodedBodySize));

  const paint = performance.getEntriesByType("paint").map((entry) => ({ name: entry.name, startTime: Math.round(entry.startTime) }));
  const lcp = performance.getEntriesByType("largest-contentful-paint").at(-1);
  const mediaResources = resources.filter((resource) => /manus-storage|\.(mp4|webm|png|jpe?g|webp|avif|woff2?)(\?|$)/i.test(resource.name));
  const fontResources = resources.filter((resource) => /fonts\.(googleapis|gstatic)\.com|\.(woff2?|ttf|otf)(\?|$)/i.test(resource.name));
  const mediaElements = Array.from(document.querySelectorAll("img, video")).map((element) => ({ tag: element.tagName.toLowerCase(), loading: element.getAttribute("loading"), src: element.getAttribute("src")?.split("/").pop() || "" }));

  return {
    viewport: { width: window.innerWidth, height: window.innerHeight },
    documentWidth: document.documentElement.scrollWidth,
    overflowCount: overflowing.length,
    overflowSamples: overflowing.slice(0, 20),
    resourceCount: resources.length,
    largestResources: resources.slice(0, 12),
    mediaResourceCount: mediaResources.length,
    largestMediaResources: mediaResources.slice(0, 12),
    fontResourceCount: fontResources.length,
    fontResources: fontResources.slice(0, 12),
    mediaElements,
    paint,
    lcp: lcp ? Math.round(lcp.startTime) : null,
  };
});

console.log(JSON.stringify(diagnostics, null, 2));
await browser.close();
