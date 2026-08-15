import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await page.locator("#social").scrollIntoViewIfNeeded();
await page.locator('#social button[aria-label="Formatos disponíveis"]');

const buttons = page.locator('#social button[aria-pressed]');
const labels = await buttons.allTextContents();
const firstButton = buttons.first();
await firstButton.focus();
const focusVisible = await firstButton.evaluate((element) => {
  const style = getComputedStyle(element);
  return style.outlineStyle !== "none" || style.boxShadow !== "none";
});

const droneButton = page.getByRole("button", { name: "drone", exact: true }).last();
await droneButton.click();
const droneCount = await page.locator('#social [role="status"]').filter({ hasText: "referência" }).last().textContent();
const selectedState = await droneButton.getAttribute("aria-pressed");
const reducedMotion = await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

console.log(JSON.stringify({ labels, focusVisible, selectedState, droneCount, reducedMotion }));
await browser.close();
