import { expect, test } from "@playwright/test";

test("currículo reúne posicionamento direto, competências e três provas públicas", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#curriculo-web");
  const resume = page.locator('[data-web-resume="true"]');
  await expect(resume).toBeVisible({ timeout: 30000 });
  await expect(resume.locator("#web-resume-title")).toHaveText("Pablo Guilherme");
  await expect(resume.getByText("Desenvolvimento Front-end · React e TypeScript", { exact: true })).toBeVisible();
  await expect(resume.getByText(/Estágio ou posição júnior em desenvolvimento front-end/)).toBeVisible();
  await expect(resume.getByRole("heading", { name: "Projetos selecionados" })).toBeVisible();
  for (const name of ["Observatório", "Trajeto", "PG Arcade"]) {
    await expect(resume.getByRole("heading", { name, exact: true })).toBeVisible();
  }
  await expect(resume.getByRole("link", { name: "Jogar no PG Arcade" }))
    .toHaveAttribute("href", "https://pabloguilherme1121.github.io/PG-Arcade/");
  await expect(resume.getByRole("button", { name: /imprimir \/ salvar em PDF/i })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("impressão do currículo mantém as competências em texto e remove controles interativos", async ({ page }) => {
  await page.goto("/#curriculo-web");
  const resume = page.locator('[data-web-resume="true"]');
  await expect(resume).toBeVisible({ timeout: 30000 });
  await page.emulateMedia({ media: "print" });
  await expect(resume.locator(".resume-competency-summary")).toBeVisible();
  await expect(resume.locator(".resume-competency-controls")).toBeHidden();
  await expect(resume.getByRole("button", { name: /imprimir \/ salvar em PDF/i })).toBeHidden();
});
