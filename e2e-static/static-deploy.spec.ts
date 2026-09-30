import { expect, test } from "@playwright/test";

function collectPageErrors(page: import("@playwright/test").Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

test("bundle estático inicia pelo caminho do GitHub Pages sem boundary de erro", async ({ page }) => {
  const pageErrors = collectPageErrors(page);

  await page.goto("./");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /Desenvolvo produtos digitais que tornam informação complexa simples de usar/i,
    }),
  ).toBeVisible();

  await expect(page.getByText("ERRO 500", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Algo saiu do percurso.", { exact: true })).toHaveCount(0);

  const scripts = await page.locator('script[type="module"][src]').evaluateAll((nodes) =>
    nodes.map((node) => (node as HTMLScriptElement).src),
  );
  expect(scripts.some((src) => src.includes("/PG-portfolio/assets/"))).toBeTruthy();
  expect(scripts.some((src) => src.includes("/src/"))).toBeFalsy();

  const rescue = await page.evaluate(() => {
    const runtime = (window as Window & {
      __pgRuntimeRescue?: { version?: string; mode?: string };
    }).__pgRuntimeRescue;
    return { version: runtime?.version, mode: runtime?.mode };
  });

  expect(rescue).toEqual({ version: "v10", mode: "network-only" });
  expect(pageErrors).toEqual([]);
});

test("bundle estático resolve briefing por âncora direta", async ({ page }) => {
  const pageErrors = collectPageErrors(page);

  await page.goto("./#contato-briefing");

  const form = page.locator('[data-briefing-form="true"]');
  await expect(form).toBeVisible({ timeout: 15_000 });
  await expect(form.locator('input[name="name"]')).toBeEditable();
  await expect(form.locator('input[name="email"]')).toBeEditable();
  expect(pageErrors).toEqual([]);
});

test("bundle estático carrega os chunks lazy do PG Arcade", async ({ page }) => {
  const pageErrors = collectPageErrors(page);

  await page.goto("./");
  await page.getByRole("button", { name: /jogar no pg arcade/i }).click();

  const arcade = page.locator('[data-arcade-hub="true"]');
  await expect(arcade).toBeVisible({ timeout: 15_000 });
  await expect(arcade.getByRole("tab")).toHaveCount(3);

  await arcade.getByRole("tab", { name: /dominó/i }).click();
  await expect(arcade.locator('[data-domino-game="true"]')).toBeVisible({ timeout: 15_000 });

  await arcade.getByRole("tab", { name: /damas/i }).click();
  await expect(arcade.locator('[data-checkers-board="true"]')).toBeVisible({ timeout: 15_000 });

  expect(pageErrors).toEqual([]);
});
