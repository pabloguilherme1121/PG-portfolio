import { test, expect } from "@playwright/test";

for (const width of [320, 390, 1280]) {
  test(`currículo mantém contato, competências e impressão a ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: async (text: string) => {
            (window as typeof window & { copiedEmail?: string }).copiedEmail =
              text;
          },
        },
      });
    });
    await page.goto("./#curriculo-web");
    const resume = page.locator('[data-web-resume="true"]');
    await expect(
      resume.getByRole("heading", {
        name: "Currículo profissional de Pablo Guilherme",
      })
    ).toBeVisible();
    await resume
      .getByRole("button", { name: "Copiar e-mail", exact: true })
      .click();
    await expect(
      resume.getByRole("status").filter({ hasText: "E-mail copiado." })
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => (window as typeof window & { copiedEmail?: string }).copiedEmail
      )
    ).toBe("mpjcreator@gmail.com");
    const group = resume.getByRole("group", { name: "Explorar competências" });
    for (const name of ["Frontend", "APIs e dados", "Qualidade"]) {
      const button = group.getByRole("button", { name, exact: true });
      await button.focus();
      await button.press("Enter");
      await expect(button).toHaveAttribute("aria-pressed", "true");
      expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth
      )
    ).toBe(true);
    await page.emulateMedia({ media: "print" });
    await expect(
      resume.getByRole("button", { name: "Copiar e-mail", exact: true })
    ).toBeHidden();
    await expect(group).toBeHidden();
    await expect(resume.locator(".resume-competency-summary")).toContainText(
      "React · TypeScript"
    );
    await expect(resume.locator(".resume-competency-summary")).toContainText(
      "tRPC · Express"
    );
    await expect(resume.locator(".resume-competency-summary")).toContainText(
      "Vitest · Playwright"
    );
    await expect(resume.locator(".resume-competency-summary")).toBeVisible();
  });
}

test("currículo oferece alternativa quando a cópia não está disponível", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("Clipboard unavailable");
        },
      },
    });
  });
  await page.goto("./#curriculo-web");
  const resume = page.locator('[data-web-resume="true"]');
  await resume
    .getByRole("button", { name: "Copiar e-mail", exact: true })
    .click();
  await expect(
    resume.getByRole("status").filter({ hasText: "Não foi possível copiar." })
  ).toBeVisible();
  await expect(
    resume.getByRole("link", { name: "Entrar em contato", exact: true })
  ).toHaveAttribute("href", "mailto:mpjcreator@gmail.com");
});
