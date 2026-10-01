import { expect, test } from "@playwright/test";

test("PG Arcade mostra progresso de exploração e sugere o próximo jogo sem perder a sessão", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("button", {
      name: /abrir.*pg arcade|abrir.*pg lab|jogar.*pg arcade|jogar.*jogo da velha/i,
    })
    .click();

  const arcade = page.locator('[data-arcade-hub="true"]');
  const exploration = arcade.locator('[data-arcade-exploration="true"]');

  await expect(exploration).toContainText(/1 de 4 jogos explorados/i);
  await expect(exploration.getByRole("progressbar")).toHaveAttribute(
    "aria-valuenow",
    "1",
  );

  const suggestion = arcade.getByRole("button", {
    name: /experimentar dominó/i,
  });
  await expect(suggestion).toBeVisible();
  await suggestion.click();

  await expect(arcade.getByRole("tab", { name: /dominó/i })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(arcade.locator('[data-domino-game="true"]')).toBeVisible();
  await expect(exploration).toContainText(/2 de 4 jogos explorados/i);

  await arcade.getByRole("tab", { name: /futebol/i }).click();
  await expect(exploration).toContainText(/3 de 4 jogos explorados/i);
  await expect(
    arcade.getByRole("button", { name: /experimentar damas/i }),
  ).toBeVisible();

  const stored = await page.evaluate(() =>
    JSON.parse(
      window.localStorage.getItem("pablo-pg-arcade-session-v1") || "{}",
    ),
  );

  expect(stored).toMatchObject({
    lastGame: "futebol",
    visits: { velha: 0, domino: 1, futebol: 1, damas: 0 },
    explored: ["velha", "domino", "futebol"],
  });
});
