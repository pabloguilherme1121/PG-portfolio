import { expect, test } from "@playwright/test";

function collectPageErrors(page: import("@playwright/test").Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => {
    errors.push(error.message);
    console.error("Static page error:", error.stack ?? error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error") console.error("Static browser console:", message.text());
  });
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
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true, effectiveType: "4g" },
    });
  });

  await page.goto("./#contato-briefing");

  const form = page.locator('[data-briefing-form="true"]');
  await expect(form).toBeVisible({ timeout: 15_000 });
  await expect(form.locator('input[name="name"]')).toBeEditable();
  await expect(form.locator('input[name="email"]')).toBeEditable();
  expect(pageErrors).toEqual([]);
});

test("bundle estático carrega PG Arcade e troca jogos sem novos módulos", async ({ page }) => {
  const pageErrors = collectPageErrors(page);

  await page.goto("./");
  await page.locator('[data-arcade-open-control="true"]').click();

  const arcade = page.locator('[data-arcade-hub="true"]');
  await expect(arcade).toBeVisible({ timeout: 15_000 });
  await expect(arcade.getByRole("tab")).toHaveCount(4);

  await arcade.getByRole("tab", { name: /dominó/i }).click();
  await expect(arcade.locator('[data-domino-game="true"]')).toBeVisible({ timeout: 15_000 });

  await arcade.getByRole("tab", { name: /futebol/i }).click();
  await expect(arcade.locator("[data-football-game]")).toBeVisible();
  await arcade.getByRole("button", { name: "Chutar", exact: true }).click();
  await expect(arcade.getByRole("status")).toContainText(/Gol|Defesa|Fora/);

  const checkersTab = arcade.getByRole("tab", { name: /damas/i });
  await checkersTab.click();
  await expect(checkersTab).toHaveAttribute("aria-selected", "true");
  await expect(arcade.locator('[data-checkers-board="true"]')).toBeVisible({ timeout: 15_000 });

  expect(pageErrors).toEqual([]);
});

test("bundle estático mostra curadoria social sem depender da API", async ({ page }) => {
  const pageErrors = collectPageErrors(page);
  await page.goto("./");
  await page.locator("#social").scrollIntoViewIfNeeded();
  await expect(page.locator("#social").getByRole("heading", { name: "O que está em movimento." })).toBeVisible();
  await expect(page.locator("#social").getByText("curadoria editorial · perfis reais · referências selecionadas")).toBeVisible();
  await expect(page.getByText("Algo saiu do percurso.", { exact: true })).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});
