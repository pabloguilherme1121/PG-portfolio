import { chromium } from "playwright";

const baseUrl = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({ headless: true });
const results = [];

for (const reduceMotion of [false, true]) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: reduceMotion ? "reduce" : "no-preference" });
  const page = await context.newPage();
  await page.route("**/manus-storage/*.pdf", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    await route.continue();
  });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page.locator('[data-resume-header="true"]').last().click();
  const loader = page.locator(".resume-pdf-loader");
  const loadingVisible = await loader.isVisible();
  const loadingText = await page.getByText("abrindo currículo").isVisible();
  const progressBar = page.getByRole("progressbar", { name: "Progresso estimado da leitura do currículo" });
  const initialProgress = Number(await progressBar.getAttribute("aria-valuenow"));
  const initialWidth = await progressBar.locator("div").first().evaluate((element) => getComputedStyle(element).width);
  const spinnerAnimation = await page.locator('.resume-pdf-loader [class*="animate-spin"]').evaluate((element) => getComputedStyle(element).animationName);
  await page.waitForTimeout(420);
  const updatedProgress = Number(await progressBar.getAttribute("aria-valuenow"));
  const updatedWidth = await progressBar.locator("div").first().evaluate((element) => getComputedStyle(element).width);
  await page.locator('iframe[title*="Pré-visualização do currículo"]').waitFor({ state: "visible" });
  await page.waitForTimeout(5000);
  const loaderHiddenAfterLoad = !(await loader.isVisible().catch(() => false));
  results.push({ reduceMotion, loadingVisible, loadingText, initialProgress, updatedProgress, initialWidth, updatedWidth, spinnerAnimation, loaderHiddenAfterLoad });
  await context.close();
}

await browser.close();
if (results.some((result) => !result.loadingVisible || !result.loadingText || !Number.isFinite(result.initialProgress) || result.initialProgress <= 0 || !Number.isFinite(result.updatedProgress) || result.updatedProgress < result.initialProgress || !result.initialWidth || !result.updatedWidth || !result.loaderHiddenAfterLoad || (result.reduceMotion && result.spinnerAnimation !== "none"))) {
  console.error(JSON.stringify(results, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(results, null, 2));
