import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const [width, theme] of [
  [320, "dark"],
  [390, "dark"],
  [390, "light"],
  [1440, "dark"],
] as const) {
  test(`project decision flow and evidence remain usable at ${width}px in ${theme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 844 });
    await page.addInitScript(
      value => localStorage.setItem("theme-preference", value),
      theme
    );
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("./#projetos");

    const choices = page.getByRole("navigation", {
      name: "Escolher uma leitura dos projetos",
    });
    await expect(
      choices.getByRole("link", { name: /explorar o produto/i })
    ).toHaveAttribute("href", "#observatorio");
    await choices
      .getByRole("link", { name: /entender a arquitetura/i })
      .click();
    await expect(page).toHaveURL(/#trajeto$/);
    const project = page.locator('[data-featured-project="TEC.09"]');
    await expect(project).toBeVisible();
    await page.reload();
    await expect(project).toBeVisible();
    await expect(project.locator('[data-project-status="true"]')).toHaveText(
      "Em evolução"
    );

    const flow = project.getByRole("group", {
      name: "Etapas do fluxo Trajeto",
    });
    const decide = flow.getByRole("button", { name: /decidir/i });
    await decide.click();
    await expect(decide).toHaveAttribute("aria-pressed", "true");
    await expect(project.locator("#trajeto-flow-detail")).toContainText(
      "referência oficial, terceiro ou estimativa"
    );
    for (const button of await flow.getByRole("button").all()) {
      const box = await button.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(box?.width).toBeGreaterThanOrEqual(44);
    }

    const preview = project.getByRole("button", {
      name: "prévia rápida",
      exact: true,
    });
    await preview.focus();
    await page.keyboard.press("Enter");
    const reading = project.getByRole("group", {
      name: /leitura rápida de trajeto/i,
    });
    const decisions = reading.getByRole("button", {
      name: "Decisões",
      exact: true,
    });
    await decisions.click();
    await expect(decisions).toHaveAttribute("aria-pressed", "true");
    await expect(
      project.locator('[id="featured-reading-TEC.09"]')
    ).toContainText("Cadastro opcional");
    // Safari pointer activation does not focus buttons; enter the keyboard phase explicitly.
    await decisions.focus();
    await expect(decisions).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(preview).toHaveAttribute("aria-expanded", "false");
    await expect(preview).toBeFocused();

    await expect(
      project.getByRole("link", { name: /abrir prova.*site/i })
    ).toHaveAttribute(
      "href",
      "https://pabloguilherme01.github.io/trajeto-web/"
    );
    await project
      .getByRole("button", { name: /ver detalhes de trajeto/i })
      .click();
    const dialog = page.locator('[data-project-details-dialog="true"]');
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth
      )
    ).toBe(true);
    const strip = page.locator('[data-featured-project-strip="true"]');
    expect(
      await strip.evaluate(
        element => element.scrollWidth <= element.clientWidth + 1
      )
    ).toBe(true);
    expect(errors).toEqual([]);
    const accessibility = await new AxeBuilder({ page })
      .include("#trajeto")
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    expect(accessibility.violations).toEqual([]);
  });
}
