import { expect, test } from "@playwright/test";

test("build público exclui rotas administrativas e conserva retorno à home", async ({ page }) => {
  for (const route of ["agenda", "favoritos", "curadoria"]) {
    await page.goto(`./${route}`);
    await expect(page.getByRole("heading", { name: "Esta página ficou fora do arquivo." })).toBeVisible();
    await page.getByRole("button", { name: "Voltar ao início" }).click();
    await expect(page.locator("#inicio")).toBeVisible();
    await expect(page).toHaveURL(/\/PG-portfolio\/$/);
  }
});

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
      name: /Interfaces claras.*Produtos que você pode usar/i,
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

test("bundle estático carrega PG Arcade dedicado sem módulos de jogos", async ({ page }) => {
  const pageErrors = collectPageErrors(page);
  const gameRequests: string[] = [];
  page.on("request", (request) => {
    if (/Portfolio(?:Arcade|Checkers|Domino|TicTacToe|Football|Chess)-/.test(request.url())) {
      gameRequests.push(request.url());
    }
  });

  await page.goto("./");
  const showcase = page.locator("#pg-lab");
  await showcase.scrollIntoViewIfNeeded();
  const link = showcase.locator('[data-arcade-full-site="true"]');
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute(
    "href",
    "https://pabloguilherme1121.github.io/PG-Arcade/",
  );
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(page.locator('[data-arcade-open-control="true"]')).toHaveCount(0);
  await expect(page.locator('[data-arcade-hub="true"]')).toHaveCount(0);
  expect(gameRequests).toEqual([]);
  expect(pageErrors).toEqual([]);
});


test("bundle estático mostra curadoria social sem depender da API", async ({ page }) => {
  const pageErrors = collectPageErrors(page);
  await page.goto("./");
  await page.locator("#social").scrollIntoViewIfNeeded();
  await expect(page.locator("#social").getByRole("heading", { name: "O que está em movimento." })).toBeVisible();
  const profiles = page.locator('[data-social-profiles="true"]');
  await expect(profiles.getByRole("link")).toHaveCount(2);
  await expect(profiles.getByRole("link", { name: /@pablogui000/ })).toHaveAttribute("href", "https://www.instagram.com/pablogui000/");
  await expect(profiles.getByRole("link", { name: /@mpjstoryworks/ })).toHaveAttribute("href", "https://www.instagram.com/mpjstoryworks/");
  await expect(page.locator("#social img")).toHaveCount(0);
  await expect(page.locator("#social button")).toHaveCount(0);
  await expect(page.getByText("Algo saiu do percurso.", { exact: true })).toHaveCount(0);
  expect(pageErrors).toEqual([]);
});
