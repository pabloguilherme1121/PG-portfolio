import { chromium } from "playwright";

const url = process.env.SITE_URL ?? "https://3000-ifdjg8odfpc7tjerrl156-59b127c0.us3.manus.computer";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await context.addInitScript(() => localStorage.setItem("theme-preference", "light"));
const page = await context.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(1800);

const result = await page.evaluate(() => {
  const parse = (value) => {
    const match = value.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const values = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
    return values.length >= 3 ? [values[0], values[1], values[2], values[3] ?? 1] : null;
  };
  const luminance = ([r, g, b]) => {
    const channel = (v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const contrast = (foreground, background) => {
    const a = luminance(foreground), b = luminance(background);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  const bodyBackground = parse(getComputedStyle(document.body).backgroundColor) ?? [255, 255, 255, 1];
  const samples = [];
  for (const element of document.querySelectorAll("h1,h2,h3,p,a,button,label,input,textarea,select")) {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    if (!rect.width || !rect.height || style.visibility === "hidden" || style.display === "none") continue;
    const foreground = parse(style.color);
    if (!foreground || foreground[3] === 0) continue;
    let background = bodyBackground;
    let parent = element;
    while (parent && parent !== document.documentElement) {
      const candidate = parse(getComputedStyle(parent).backgroundColor);
      if (candidate && candidate[3] > 0) { background = candidate; break; }
      parent = parent.parentElement;
    }
    const ratio = contrast(foreground, background);
    samples.push({ tag: element.tagName.toLowerCase(), text: (element.textContent || element.getAttribute("aria-label") || "").trim().slice(0, 70), foreground: style.color, background: `rgb(${background.slice(0, 3).join(", ")})`, ratio: Number(ratio.toFixed(2)) });
  }
  const weak = samples.filter((sample) => sample.ratio < 4.5).sort((a, b) => a.ratio - b.ratio).slice(0, 12);
  return { theme: document.querySelector(".arquivo-page")?.getAttribute("data-theme"), bodyTextLength: document.body.innerText.length, bodyText: document.body.innerText.slice(0, 220), samples: samples.length, weak };
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
if (result.theme !== "light" || result.weak.length) process.exitCode = 1;
