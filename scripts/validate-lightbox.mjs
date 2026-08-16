import { chromium } from "playwright";

const url = process.env.SITE_URL ?? "http://127.0.0.1:3000/";
const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  const context = await browser.newContext({ viewport });
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const trigger = page.locator('button[aria-label^="Ampliar imagem"]').first();
  if (!(await trigger.count())) throw new Error(`Nenhum gatilho de lightbox em ${viewport.width}px`);
  await trigger.click();
  const dialog = page.locator('[role="dialog"][aria-labelledby="project-lightbox-title"]');
  await dialog.waitFor({ state: "visible" });
  const initialTitle = await page.locator("#project-lightbox-title").textContent();
  const imageAlt = await dialog.locator('img[alt^="Imagem ampliada"]').getAttribute("alt");
  const thumbnails = dialog.locator('[role="listitem"]');
  const thumbnailCount = await thumbnails.count();
  const activeThumbnailCount = await dialog.locator('[role="listitem"][aria-current="true"]').count();
  const lockedScroll = await page.evaluate(() => document.body.style.overflow === "hidden");
  const copyLinkButton = dialog.getByRole("button", { name: "Copiar link do projeto" });
  await copyLinkButton.click();
  const copiedProjectLink = await page.evaluate(() => navigator.clipboard.readText());
  const shareStatus = await dialog.locator('[role="status"]').filter({ hasText: "Link do projeto copiado." }).textContent();
  const zoomGroup = dialog.locator('[aria-label="Controles de zoom"]');
  const zoomStatus = zoomGroup.locator('[aria-live="polite"]');
  const zoomIncrease = zoomGroup.getByRole("button", { name: "Aumentar zoom" });
  await zoomIncrease.click();
  const zoomAfterIncrease = await zoomStatus.textContent();
  await zoomGroup.getByRole("button", { name: "Restaurar zoom original" }).click();
  const mainImage = dialog.locator('img[alt^="Imagem ampliada"]');
  await mainImage.dblclick();
  const zoomTransform = await mainImage.getAttribute("style");
  await zoomGroup.getByRole("button", { name: "Restaurar zoom original" }).click();
  const zoomAfterReset = await zoomStatus.textContent();
  const lastThumbnail = thumbnails.last();
  await lastThumbnail.click();
  await page.waitForTimeout(80);
  const clickedThumbnailTitle = await page.locator("#project-lightbox-title").textContent();
  await page.keyboard.press("ArrowRight");
  await page.waitForTimeout(80);
  const nextTitle = await page.locator("#project-lightbox-title").textContent();
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  await page.waitForTimeout(60);
  const restoredFocus = await page.evaluate(() => document.activeElement?.getAttribute("aria-label")?.startsWith("Ampliar imagem") ?? false);
  results.push({ viewport: viewport.width, opened: true, hasImageAlt: Boolean(imageAlt), thumbnailCount, activeThumbnailCount, copiedProjectLink, shareStatus, thumbnailClickChangedTitle: clickedThumbnailTitle !== initialTitle, lockedScroll, zoomAfterIncrease, doubleClickZoomed: zoomTransform?.includes("scale(2)") ?? false, zoomAfterReset, arrowNavigationChangedTitle: clickedThumbnailTitle !== nextTitle, closedByEscape: true, restoredFocus });
  await context.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
