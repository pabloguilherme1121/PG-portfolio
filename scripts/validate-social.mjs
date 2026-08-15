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
const todosButton = buttons.first();
await todosButton.focus();
await page.keyboard.press("Tab");
const focusMovedByTab = await page.evaluate(() => document.activeElement?.textContent?.trim() === "drone");
await page.keyboard.press("Enter");
const transitionClassDuringChange = await page.locator("#social .social-filter-grid").getAttribute("class");
const focusedDuringTransition = await page.evaluate(() => document.activeElement?.textContent?.trim() === "drone");
await page.waitForTimeout(260);
const transitionClassAfterChange = await page.locator("#social .social-filter-grid").getAttribute("class");
const focusPreservedAfterTransition = await page.evaluate(() => document.activeElement?.textContent?.trim() === "drone");
const droneCount = await page.locator('#social [role="status"]').filter({ hasText: "referência" }).last().textContent();
const selectedState = await droneButton.getAttribute("aria-pressed");
const reducedMotion = await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

console.log(JSON.stringify({ labels, focusVisible, focusMovedByTab, focusedDuringTransition, focusPreservedAfterTransition, selectedState, droneCount, reducedMotion, transitionClassDuringChange, transitionClassAfterChange }));
await browser.close();
