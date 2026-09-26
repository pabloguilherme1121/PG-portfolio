import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.describe("acessibilidade pública", () => {
  test("não possui violações graves ou críticas de WCAG A/AA", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();

    const violations = [];
    for (const selector of ["#inicio", "#diagnostico", "#sobre", "#atuacao", "#servicos", "#trabalhos", "#social", "#contato", "#contato-rodape"]) {
      const section = page.locator(selector);
      if (!(await section.count())) continue;
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      violations.push(...results.violations);
    }
    const blockingViolations = [...new Map(violations
      .filter((violation) => violation.impact === "critical" || violation.impact === "serious")
      .map((violation) => [violation.id + violation.nodes.map((node) => node.target.join(",")).join("|"), violation]))
      .values()];

    expect(blockingViolations, blockingViolations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      help: violation.help,
      nodes: violation.nodes.map((node) => node.target),
    }))).toEqual([]);
  });

  test("preserva foco, ESC, semântica de modal e alvos de toque em mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.keyboard.press("Tab");
    const focusedOutline = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineColor);
    expect(focusedOutline).not.toBe("rgba(0, 0, 0, 0)");

    const undersizedControls = await page.evaluate(() => [...document.querySelectorAll<HTMLElement>("button, a[href], input, select, textarea, [role='button']")]
      .filter((element) => {
        const styles = getComputedStyle(element);
        const bounds = element.getBoundingClientRect();
        return styles.visibility !== "hidden" && styles.display !== "none" && element.getAttribute("tabindex") !== "-1" && bounds.width > 0 && bounds.height > 0;
      })
      .map((element) => {
        const bounds = element.getBoundingClientRect();
        return { label: element.getAttribute("aria-label") ?? element.textContent?.trim() ?? element.tagName, width: bounds.width, height: bounds.height, html: element.outerHTML.slice(0, 220) };
      })
      .filter(({ width, height }) => width < 24 || height < 24));
    expect(undersizedControls).toEqual([]);

    await page.locator("[data-featured-project]").first().click();
    const dialog = page.locator('[data-project-details-dialog="true"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("role", "dialog");
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("respeita a preferência de movimento reduzido", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
    expect(await page.locator(".scroll-progress-bar").evaluate((element) => getComputedStyle(element).transitionProperty)).toBe("none");
    const revealDuration = await page.locator(".reveal").first().evaluate((element) => Number.parseFloat(getComputedStyle(element).animationDuration));
    expect(revealDuration).toBeLessThan(0.01);
  });

  test("expõe landmarks, nomes e controles na árvore de acessibilidade", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("main")).toBeVisible();

    const snapshot = await page.locator("body").ariaSnapshot();
    expect(snapshot).toContain("main");
    expect(snapshot).toContain("heading");
    expect(snapshot).toContain("button");
    expect(snapshot).toContain("link");

    const nameResults = await new AxeBuilder({ page })
      .withRules([
        "button-name",
        "link-name",
        "label",
        "aria-input-field-name",
        "aria-command-name",
        "aria-hidden-focus",
        "aria-valid-attr",
        "aria-required-attr",
        "aria-allowed-attr",
      ])
      .analyze();
    expect(nameResults.violations, nameResults.violations.map((violation) => ({
      id: violation.id,
      nodes: violation.nodes.map((node) => node.target),
    }))).toEqual([]);
  });
});
