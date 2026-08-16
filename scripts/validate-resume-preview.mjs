import { chromium } from "playwright";

const baseUrl = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of [{ width: 1280, height: 720 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  const trigger = page.locator('[data-resume-header="true"]').first();
  if (viewport.width < 768) await page.getByRole("button", { name: "Abrir menu" }).click();
  const activeTrigger = page.locator('[data-resume-header="true"]').last();
  await activeTrigger.click();
  const dialog = page.getByRole("dialog", { name: "Currículo de Pablo Guilherme" });
  const iframe = dialog.locator("iframe");
  const download = dialog.getByRole("link", { name: /baixar PDF/i });
  const close = dialog.getByRole("button", { name: "Fechar pré-visualização do currículo" });
  const opened = await dialog.isVisible();
  const iframeSrc = await iframe.getAttribute("src");
  const iframeTitle = await iframe.getAttribute("title");
  const downloadName = await download.getAttribute("download");
  const bodyOverflowLocked = await page.evaluate(() => document.body.style.overflow === "hidden");
  const dialogBox = await dialog.boundingBox();
  const frameBox = await iframe.boundingBox();
  await close.focus();
  const closeFocused = await page.evaluate(() => document.activeElement?.getAttribute("aria-label") === "Fechar pré-visualização do currículo");
  await page.keyboard.press("Escape");
  const closedByEscape = !(await dialog.isVisible().catch(() => false));
  const triggerFocused = await page.evaluate(() => ["Visualizar currículo atualizado em PDF", "Abrir menu"].includes(document.activeElement?.getAttribute("aria-label") || ""));
  results.push({ viewport, opened, iframeSrc, iframeTitle, downloadName, bodyOverflowLocked, dialogWidth: dialogBox?.width, dialogHeight: dialogBox?.height, frameWidth: frameBox?.width, frameHeight: frameBox?.height, closeFocused, closedByEscape, triggerFocused });
  await context.close();
}

await browser.close();
if (results.some((result) => !result.opened || !result.iframeSrc?.includes("curriculo-pablo-guilherme-profissional") || !result.iframeTitle || result.downloadName !== "curriculo-pablo-guilherme.pdf" || !result.bodyOverflowLocked || !result.closeFocused || !result.closedByEscape || !result.triggerFocused || (result.frameWidth ?? 0) < 300)) {
  console.error(JSON.stringify(results, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(results, null, 2));
