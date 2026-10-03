import { expect, test } from "@playwright/test";

test("tabuleiro aparece antes das configurações no celular", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/");
  await page.locator("[data-arcade-open-control]").click();
  const arcade = page.locator("[data-arcade-hub]");
  for (const name of [/Jogo da velha/, /Dominó/, /Damas/, /Xadrez/]) {
    await arcade.getByRole("tab", { name }).click();
    const arena = await arcade
      .locator('[role="tabpanel"]:visible [data-arcade-arena]')
      .boundingBox();
    const settings = await arcade
      .locator('[role="tabpanel"]:visible [data-arcade-settings]')
      .boundingBox();
    expect(arena).not.toBeNull();
    expect(settings).not.toBeNull();
    expect(arena!.y).toBeLessThan(settings!.y);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
});

test("xadrez desfaz jogada local e permite reiniciar sem histórico antigo", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("[data-arcade-open-control]").click();
  await page.getByRole("tab", { name: /Xadrez/ }).click();
  const chess = page.locator("[data-chess-game]");
  await chess.getByRole("button", { name: /1 × 1 local/ }).click();
  const undo = chess.getByRole("button", {
    name: "Desfazer jogada",
    exact: true,
  });
  await expect(undo).toBeDisabled();
  await chess
    .getByRole("gridcell", { name: "e2 · peão branco", exact: true })
    .click();
  await chess.getByRole("gridcell", { name: /e4 · vazia/ }).click();
  await expect(
    chess.getByRole("gridcell", { name: "e4 · peão branco", exact: true })
  ).toBeVisible();
  await undo.click();
  await expect(
    chess.getByRole("gridcell", { name: "e2 · peão branco", exact: true })
  ).toBeVisible();
  await expect(undo).toBeDisabled();
  await chess.getByRole("button", { name: /nova partida/ }).click();
  await expect(undo).toBeDisabled();
});

test("xadrez desfaz a resposta do bot junto com a jogada do jogador", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("[data-arcade-open-control]").click();
  await page.getByRole("tab", { name: /Xadrez/ }).click();
  const chess = page.locator("[data-chess-game]");
  await chess
    .getByRole("gridcell", { name: "e2 · peão branco", exact: true })
    .click();
  await chess.getByRole("gridcell", { name: /e4 · vazia/ }).click();
  await expect(chess.getByRole("status")).toHaveText("Sua vez");
  await chess
    .getByRole("button", { name: "Desfazer jogada", exact: true })
    .click();
  await expect(
    chess.getByRole("gridcell", { name: "e2 · peão branco", exact: true })
  ).toBeVisible();
  await expect(chess.getByRole("status")).toHaveText("Sua vez");
  await expect(
    chess.getByRole("button", { name: "Desfazer jogada", exact: true })
  ).toBeDisabled();
});

test("xadrez cancela a resposta pendente do bot ao desfazer", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("[data-arcade-open-control]").click();
  await page.getByRole("tab", { name: /Xadrez/ }).click();
  const chess = page.locator("[data-chess-game]");
  await chess.getByRole("button", { name: "mestre", exact: true }).click();
  await chess
    .getByRole("gridcell", { name: "e2 · peão branco", exact: true })
    .click();
  await chess.getByRole("gridcell", { name: /e4 · vazia/ }).click();
  await chess
    .getByRole("button", { name: "Desfazer jogada", exact: true })
    .click();
  await expect(
    chess.getByRole("gridcell", { name: "e2 · peão branco", exact: true })
  ).toBeVisible();
  await page.waitForTimeout(800);
  await expect(chess.getByRole("status")).toHaveText("Sua vez");
  await expect(
    chess.getByRole("button", { name: "Desfazer jogada", exact: true })
  ).toBeDisabled();
});

test("xadrez navega pelas casas com setas sem exigir 64 paradas de Tab", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator("[data-arcade-open-control]").click();
  await page.getByRole("tab", { name: /Xadrez/ }).click();
  const chess = page.locator("[data-chess-game]");
  await chess
    .getByRole("gridcell", { name: "e2 · peão branco", exact: true })
    .focus();
  await page.keyboard.press("ArrowUp");
  await expect(
    chess.getByRole("gridcell", { name: "e3 · vazia", exact: true })
  ).toBeFocused();
  await page.keyboard.press("Home");
  await expect(
    chess.getByRole("gridcell", { name: "a3 · vazia", exact: true })
  ).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(
    chess.getByRole("gridcell", { name: "a3 · vazia", exact: true })
  ).toBeFocused();
  await expect(chess.locator('[role="gridcell"][tabindex="0"]')).toHaveCount(1);
});
