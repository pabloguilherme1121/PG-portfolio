import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const viewports = [320, 390, 768, 1280];
const results = [];

for (const width of viewports) {
  const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: "reduce" });
  await page.goto("http://127.0.0.1:3000/", { waitUntil: "networkidle" });
  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const menuButton = page.getByRole("button", { name: "Abrir menu" });
  const menuVisible = width < 768 && await menuButton.isVisible();
  let menuKeyboardClosed = true;
  if (menuVisible) {
    await menuButton.click();
    await page.keyboard.press("Escape");
    menuKeyboardClosed = !(await page.locator("#mobile-navigation").count());
  }
  await page.locator("#projetos").scrollIntoViewIfNeeded();
  const firstProjectCard = page.locator('#projetos .project-gallery-card').first();
  const previewOverlay = firstProjectCard.locator('[aria-hidden="true"]').filter({ hasText: "resumo rápido" }).first();
  await firstProjectCard.hover();
  const overlayHoverVisible = Number.parseFloat(await previewOverlay.evaluate((element) => getComputedStyle(element).opacity)) > 0;
  const overlayHasTechnologies = (await previewOverlay.locator("span").count()) >= 3;
  await firstProjectCard.focus();
  const overlayFocusVisible = Number.parseFloat(await previewOverlay.evaluate((element) => getComputedStyle(element).opacity)) > 0;
  const overlayTransitionDuration = await previewOverlay.evaluate((element) => getComputedStyle(element).transitionDuration);
  const overlayReducedMotionSafe = (await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches)) ? overlayTransitionDuration === "0s" : true;
  const favoriteControl = firstProjectCard.locator('xpath=..').locator('[data-favorite-control="true"]').first();
  await favoriteControl.click();
  const favoriteActivated = (await favoriteControl.getAttribute("aria-pressed")) === "true";
  const favoritesStored = await page.evaluate(() => {
    try { return JSON.parse(window.localStorage.getItem("pablo-portfolio-favorites") || "[]").length === 1; } catch { return false; }
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#projetos").scrollIntoViewIfNeeded();
  const persistedFavoriteControl = page.locator('#projetos .project-gallery-card').first().locator('xpath=..').locator('[data-favorite-control="true"]').first();
  const favoritePersisted = await persistedFavoriteControl.count() > 0;
  await persistedFavoriteControl.focus();
  const favoriteFocusVisible = await persistedFavoriteControl.evaluate((element) => {
    const style = getComputedStyle(element);
    return style.outlineStyle !== "none" || style.boxShadow !== "none";
  });
  await page.keyboard.press("Enter");
  const favoriteKeyboardRemoved = (await persistedFavoriteControl.getAttribute("aria-pressed")) === "false";
  await page.keyboard.press("Enter");
  const favoriteKeyboardRestored = (await persistedFavoriteControl.getAttribute("aria-pressed")) === "true";
  const savedFilter = page.getByRole("button", { name: /salvos/ }).first();
  await savedFilter.click();
  await page.waitForTimeout(280);
  const favoritesFilterActivated = (await savedFilter.getAttribute("aria-pressed")) === "true";
  const savedCardCount = await page.locator("#projetos .project-gallery-card").count();
  await savedFilter.click();
  const filters = page.locator('#projetos button[data-filter-scope="category"]');
  const filterContainerWidth = await filters.first().locator("..")?.evaluate((element) => ({ scrollWidth: element.scrollWidth, clientWidth: element.clientWidth }));
  const firstFilter = filters.first();
  await firstFilter.focus();
  await page.keyboard.press("Enter");
  const filterFocusVisible = await firstFilter.evaluate((element) => {
    const style = getComputedStyle(element);
    return style.outlineStyle !== "none" || style.boxShadow !== "none";
  });
  const categoryKeyboardFilter = page.locator('#projetos button[data-filter-scope="category"]', { hasText: "Eventos" }).first();
  await categoryKeyboardFilter.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(280);
  const categoryEnterActivated = (await categoryKeyboardFilter.getAttribute("aria-pressed")) === "true";
  await page.keyboard.press("Space");
  await page.waitForTimeout(280);
  const categorySpacePreserved = (await categoryKeyboardFilter.getAttribute("aria-pressed")) === "true";
  const categoryTodosFilter = page.locator('#projetos button[data-filter-scope="category"]', { hasText: "Todos" }).first();
  await categoryTodosFilter.click();
  await page.waitForTimeout(280);
  const initialProjectOrder = await page.locator('#projetos .project-gallery-card .font-display').allTextContents();
  const sortControl = page.locator('#projetos select[data-sort-control="projects"]');
  await sortControl.focus();
  const sortFocusVisible = await sortControl.evaluate((element) => {
    const style = getComputedStyle(element);
    return style.outlineStyle !== "none" || style.boxShadow !== "none";
  });
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(280);
  const sortKeyboardChanged = (await sortControl.inputValue()) === "added";
  await page.keyboard.press("ArrowUp");
  await page.waitForTimeout(280);
  await sortControl.selectOption("added");
  await page.waitForTimeout(280);
  const addedProjectOrder = await page.locator('#projetos .project-gallery-card .font-display').allTextContents();
  const sortAddedChangedOrder = initialProjectOrder.join("|") !== addedProjectOrder.join("|");
  await sortControl.selectOption("relevance");
  await page.waitForTimeout(280);
  const relevanceSortRestored = (await sortControl.inputValue()) === "relevance";
  const droneFilter = page.locator('#projetos button[data-filter-scope="technology"]', { hasText: "Drone" }).first();
  await droneFilter.click();
  await page.waitForTimeout(280);
  const filterClicked = (await droneFilter.getAttribute("aria-pressed")) === "true";
  const todosFilter = page.locator('#projetos button[data-filter-scope="technology"]', { hasText: "Todos" }).first();
  await todosFilter.click();
  await page.waitForTimeout(280);
  const searchInput = page.locator('#projetos input[type="search"]');
  await searchInput.fill("Interface");
  await page.waitForTimeout(280);
  const searchWorked = (await page.locator("#projetos .project-gallery-card").count()) > 0;
  await page.locator("#contato").scrollIntoViewIfNeeded();
  const availableDate = page.locator('#contato .availability-calendar button[aria-label*="feira"]:not(:disabled)').first();
  const calendarHasAvailableDate = await availableDate.count() > 0;
  let calendarInteractive = false;
  if (calendarHasAvailableDate) {
    await availableDate.click();
    const availableTime = page.locator('#contato .availability-calendar button:not(:disabled)', { hasText: "08:00" }).first();
    calendarInteractive = await availableTime.count() > 0;
  }
  const reducedMotion = await page.evaluate(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  results.push({ width, documentWidth, noViewportOverflow: documentWidth <= width, menuKeyboardClosed, filterFocusVisible, categoryEnterActivated, categorySpacePreserved, filterContainerWidth, overlayHoverVisible, overlayFocusVisible, overlayHasTechnologies, overlayReducedMotionSafe, favoriteActivated, favoritesStored, favoritePersisted, favoriteFocusVisible, favoriteKeyboardRemoved, favoriteKeyboardRestored, favoritesFilterActivated, savedCardCount, sortFocusVisible, sortKeyboardChanged, sortAddedChangedOrder, relevanceSortRestored, filterClicked, searchWorked, calendarInteractive, reducedMotion });
  await page.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
