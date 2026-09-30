import { expect, type Page } from "@playwright/test";

/** Disable speculative loading so contact journeys must express real intent. */
export async function useDataSavingConnection(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true, effectiveType: "4g" },
    });
  });
}

export async function openContactBriefing(page: Page) {
  // The section anchor exists before its lazy form. Scrolling the form first
  // would wait forever when background preloading is disabled.
  await page.locator("#contato").scrollIntoViewIfNeeded();
  const form = page.locator('[data-briefing-form="true"]');
  await expect(form).toBeVisible();
  await form.scrollIntoViewIfNeeded();
  return form;
}
