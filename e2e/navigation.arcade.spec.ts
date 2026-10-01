import { test, expect } from "@playwright/test";

const baseURL = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test.use({ baseURL });

test.describe("portfólio profissional", () => {
  test("jogo da velha oferece pausa interativa acessível e reiniciável", async ({ page }) => {
    await page.goto("/");

    const game = page.locator('[data-tic-tac-toe="true"]');
    await expect(game).toHaveCount(0);
    await page.getByRole("button", { name: /abrir.*pg arcade|abrir.*pg lab|jogar.*pg arcade|jogar.*jogo da velha/i }).click();
    await game.scrollIntoViewIfNeeded();
    await expect(game).toBeVisible();
    await expect(game.getByRole("heading", { name: /jogo da velha/i })).toBeVisible();

    const cells = game.locator('[data-game-cell="true"]');
    await expect(cells).toHaveCount(9);

    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText("X");
    await expect(game.locator('[data-game-cell="true"]:has-text("O")')).toHaveCount(1);
    await expect(game.locator('[data-game-status="true"]')).toContainText(/sua vez|você|empate|pg bot/i);

    await game.getByRole("button", { name: /reiniciar partida/i }).click();
    for (let index = 0; index < 9; index += 1) {
      await expect(cells.nth(index)).toHaveText("");
    }
  });

  test("PG Arcade combina presets rápidos, controles avançados e modo local", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /abrir.*pg arcade|abrir.*pg lab|jogar.*pg arcade|jogar.*jogo da velha/i }).click();

    const game = page.locator('[data-tic-tac-toe="true"]');
    const presets = game.locator('[data-arcade-presets="true"]');
    await expect(presets.getByRole("button")).toHaveCount(4);
    await expect(presets.getByRole("button", { name: /rápido/i })).toHaveAttribute("aria-pressed", "true");

    await presets.getByRole("button", { name: /competir/i }).click();
    const advanced = game.locator('[data-arcade-advanced="true"]');
    await advanced.locator("summary").click();
    await expect(game.getByRole("button", { name: "impossível", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(game.getByRole("button", { name: "MD3", exact: true })).toHaveAttribute("aria-pressed", "true");

    await presets.getByRole("button", { name: /sobrevivência/i }).click();
    await expect(game.getByRole("button", { name: "impossível", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(game.getByRole("button", { name: "MD5", exact: true })).toHaveAttribute("aria-pressed", "true");

    await presets.getByRole("button", { name: /dupla/i }).click();
    await expect(game.getByRole("button", { name: /duas pessoas/i })).toHaveAttribute("aria-pressed", "true");

    const cells = game.locator('[data-game-cell="true"]');
    await cells.nth(0).click();
    await expect(cells.nth(0)).toHaveText("X");
    await expect(game.locator('[data-game-cell="true"]:has-text("O")')).toHaveCount(0);
    await cells.nth(1).click();
    await expect(cells.nth(1)).toHaveText("O");

    await game.getByRole("button", { name: /reiniciar partida/i }).click();
    await expect(game.locator('[data-match-score="true"]')).toContainText("0");
  });

  test("PG Arcade oferece dica estratégica e recupera progressão local", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("pablo-pg-arcade-stats", JSON.stringify({
        games: 5,
        wins: 3,
        losses: 0,
        draws: 2,
        currentWinStreak: 3,
        bestWinStreak: 3,
      }));
    });
    await page.goto("/");
    await page.getByRole("button", { name: /abrir.*pg arcade|abrir.*pg lab|jogar.*pg arcade|jogar.*jogo da velha/i }).click();

    const game = page.locator('[data-tic-tac-toe="true"]');
    await expect(game.locator('[data-arcade-stats="true"]')).toContainText("5");
    await expect(game.locator('[data-arcade-stats="true"]')).toContainText("60%");
    const streakProgress = game.locator('[data-arcade-streak-progress="true"]');
    await expect(streakProgress).toContainText(/sequência atual 3/i);
    await expect(streakProgress).toContainText(/meta 5/i);
    await expect(streakProgress.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "60");
    await expect(game.locator('[data-arcade-achievement="primeira-vitoria"]')).toBeVisible();
    await expect(game.locator('[data-arcade-achievement="trinca"]')).toBeVisible();
    await expect(game.locator('[data-arcade-achievement="invicto"]')).toBeVisible();

    await game.getByRole("button", { name: /dica estratégica/i }).click();
    await expect(game.locator('[data-hint-cell="true"]')).toHaveCount(1);
    await expect(game.locator('[data-hint-cell="true"]')).toHaveAttribute("aria-label", /dica sugerida/i);

    const hintCell = game.locator('[data-hint-cell="true"]');
    await hintCell.click();
    await expect(game.locator('[data-hint-cell="true"]')).toHaveCount(0);
  });

  test("PG Arcade registra a última rodada e usa feedback tátil quando disponível", async ({ page }) => {
    await page.addInitScript(() => {
      const target = window as Window & { __arcadeVibrations?: Array<number | number[]> };
      target.__arcadeVibrations = [];
      Object.defineProperty(navigator, "vibrate", {
        configurable: true,
        value: (pattern: number | number[]) => {
          target.__arcadeVibrations?.push(pattern);
          return true;
        },
      });
    });
    await page.goto("/");
    await page.getByRole("button", { name: /jogar.*pg arcade/i }).click();

    const game = page.locator('[data-tic-tac-toe="true"]');
    await game.locator('[data-arcade-presets="true"]').getByRole("button", { name: /dupla/i }).click();
    const cells = game.locator('[data-game-cell="true"]');
    for (const index of [0, 3, 1, 4, 2]) await cells.nth(index).click();

    await expect(game.locator('[data-arcade-last-result="true"]')).toContainText(/vitória/i);
    const vibrations = await page.evaluate(() => (window as Window & { __arcadeVibrations?: Array<number | number[]> }).__arcadeVibrations ?? []);
    expect(vibrations).toContain(12);
    expect(vibrations.some((pattern) => Array.isArray(pattern) && pattern.join(",") === "25,35,45")).toBeTruthy();
  });

  test("PG Arcade respeita a troca para O e deixa o PG Bot abrir com X", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /abrir.*pg arcade|abrir.*pg lab|jogar.*pg arcade|jogar.*jogo da velha/i }).click();

    const game = page.locator('[data-tic-tac-toe="true"]');
    await game.locator('[data-arcade-advanced="true"] summary').click();
    await game.getByRole("button", { name: /jogar com o símbolo x/i }).click();

    await expect(game.locator('[data-game-cell="true"]:has-text("X")')).toHaveCount(1);
    await expect(game.locator('[data-game-cell="true"]:has-text("O")')).toHaveCount(0);
    await expect(game.locator('[data-game-status="true"]')).toContainText(/sua vez.*O/i);
  });

  test("PG Arcade alterna entre dominó e damas com modos, mestre, séries e 1x1 local", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /jogar.*pg arcade/i }).click();

    const arcade = page.locator('[data-arcade-hub="true"]');
    await expect(arcade.getByRole("tab")).toHaveCount(4);

    await arcade.getByRole("tab", { name: /dominó/i }).click();
    const domino = arcade.locator('[data-domino-game="true"]');
    await expect(domino).toBeVisible();
    await expect(domino.getByRole("button", { name: /contra bot/i })).toHaveAttribute("aria-pressed", "true");

    await domino.getByRole("button", { name: /mestre/i }).click();
    await expect(domino.getByRole("button", { name: /mestre/i })).toHaveAttribute("aria-pressed", "true");
    await domino.getByRole("button", { name: /bloqueio sem compra/i }).click();
    await expect(domino.locator('[data-domino-rules="block"]')).toHaveAttribute("aria-pressed", "true");
    await domino.getByRole("button", { name: "MD5", exact: true }).click();
    await expect(domino.locator('[data-domino-series="MD5"]')).toHaveAttribute("aria-pressed", "true");

    await domino.getByRole("button", { name: /1 × 1 local/i }).click();
    await expect(domino.locator('[data-domino-mode="local"]')).toHaveAttribute("aria-pressed", "true");
    const dominoTiles = domino.locator('[data-domino-tile="true"]');
    await expect(dominoTiles).toHaveCount(5);
    await dominoTiles.first().click();
    await expect(domino.locator('[data-domino-handoff="true"]')).toBeVisible();
    await domino.getByRole("button", { name: /jogador 2.*revelar mão/i }).click();
    await expect(domino.locator('[data-domino-handoff="true"]')).toHaveCount(0);

    await arcade.getByRole("tab", { name: /damas/i }).click();
    const checkers = arcade.locator('[data-checkers-game="true"]');
    await expect(checkers).toBeVisible();
    await expect(checkers.locator('[data-checkers-cell="true"]')).toHaveCount(64);

    await checkers.getByRole("button", { name: /mestre/i }).click();
    await expect(checkers.getByRole("button", { name: /mestre/i })).toHaveAttribute("aria-pressed", "true");
    await checkers.getByRole("button", { name: "MD5", exact: true }).click();
    await expect(checkers.locator('[data-checkers-series="MD5"]')).toHaveAttribute("aria-pressed", "true");
    await checkers.getByRole("button", { name: /1 × 1 local/i }).click();
    await expect(checkers.locator('[data-checkers-mode="local"]')).toHaveAttribute("aria-pressed", "true");

    await checkers.getByRole("gridcell", { name: /Peça azul/i }).first().click();
    await expect(checkers.locator('[data-legal-destination="true"]')).not.toHaveCount(0);
    await checkers.locator('[data-legal-destination="true"]').first().click();
    await expect(checkers.locator('[data-checkers-status="true"]')).toContainText(/jogador 2|vermelho/i);
  });

  test("abas do PG Arcade suportam setas, Home e End pelo teclado", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /jogar.*pg arcade/i }).click();

    const arcade = page.locator('[data-arcade-hub="true"]');
    const tabs = arcade.getByRole("tab");
    await tabs.first().focus();
    await page.keyboard.press("ArrowRight");
    await expect(arcade.getByRole("tab", { name: /dominó/i })).toBeFocused();
    await expect(arcade.getByRole("tab", { name: /dominó/i })).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("End");
    await expect(arcade.getByRole("tab", { name: /damas/i })).toBeFocused();
    await expect(arcade.locator('[data-checkers-game="true"]')).toBeVisible();

    await page.keyboard.press("Home");
    await expect(arcade.getByRole("tab", { name: /jogo da velha/i })).toBeFocused();
    await expect(arcade.locator('[data-tic-tac-toe="true"]')).toBeVisible();
  });

});
