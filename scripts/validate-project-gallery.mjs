import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ reducedMotion: "reduce", viewport: { width: 390, height: 844 } });
await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
await page.locator("#projetos").scrollIntoViewIfNeeded();

const filters = page.locator("#projetos button[aria-pressed]");
const labels = await filters.allTextContents();
const todosButton = filters.first();
await todosButton.focus();
const focusVisible = await todosButton.evaluate((element) => {
  const style = getComputedStyle(element);
  return style.outlineStyle !== "none" || style.boxShadow !== "none";
});

await page.keyboard.press("Tab");
const focusMovedByTab = await page.evaluate(() => document.activeElement?.textContent?.trim() === "Vídeo");
const droneButton = page.getByRole("button", { name: "Drone", exact: true }).first();
await droneButton.focus();
await page.keyboard.press("Enter");
const transitionClassDuringChange = await page.locator("#projetos .project-gallery-stage").getAttribute("class");
const focusedDuringTransition = await page.evaluate(() => document.activeElement?.textContent?.trim() === "Drone");
await page.waitForTimeout(260);
const transitionClassAfterChange = await page.locator("#projetos .project-gallery-stage").getAttribute("class");
const focusPreservedAfterTransition = await page.evaluate(() => document.activeElement?.textContent?.trim() === "Drone");
const selectedState = await droneButton.getAttribute("aria-pressed");
const visibleCards = await page.locator("#projetos .project-gallery-card").count();
const reducedMotion = await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

console.log(JSON.stringify({ labels, focusVisible, focusMovedByTab, focusedDuringTransition, focusPreservedAfterTransition, selectedState, visibleCards, reducedMotion, transitionClassDuringChange, transitionClassAfterChange }));
await browser.close();
