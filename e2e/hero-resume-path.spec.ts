import { test, expect } from "@playwright/test";

// A recruiter should reach the existing web resume directly from the first viewport.
for (const width of [320, 390]) {
  test(`hero opens the professional resume on a ${width}px screen`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");

    const resumeLink = page.locator("#inicio").getByRole("link", { name: "Ver currículo", exact: true });
    await expect(resumeLink).toHaveAttribute("href", "#curriculo-web");
    await resumeLink.click();

    await expect(page).toHaveURL(/#curriculo-web$/);
    const resume = page.locator('#curriculo-web [data-web-resume="true"]');
    await expect(resume).toBeVisible({ timeout: 30000 });
    await expect(resume.getByRole("button", { name: /imprimir \/ salvar em PDF/i })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
