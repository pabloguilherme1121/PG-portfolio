import { expect, test } from "@playwright/test";

test("cases preservam provas e explicam decisões sem overflow em 320 px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto("/#estudos-de-caso");
  const cases = page.locator('[data-case-study="true"]');
  await expect(cases).toHaveCount(2);
  for (const study of await cases.all()) {
    for (const detail of ["problema", "objetivo", "decisões", "resultado"]) {
      await expect(
        study.locator(`[data-case-detail="${detail}"]`)
      ).toBeVisible();
    }
    await expect(study.locator('[data-case-stage="true"]')).toBeVisible();
    expect(
      await study.locator('[data-case-evidence="true"]').count()
    ).toBeGreaterThan(0);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth
    )
  ).toBe(true);
  await page.goto("/#qualidade");
  await expect(page.locator('[data-quality-pipeline="true"]')).toHaveAttribute(
    "href",
    "https://github.com/pabloguilherme1121/PG-portfolio/actions/workflows/pages.yml"
  );
});

test("xadrez permite roque local e desfaz rei e torre juntos", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('[data-arcade-open-control="true"]').click();
  await page.getByRole("tab", { name: /xadrez/i }).click();
  const game = page.locator('[data-chess-game="true"]');
  await game.locator('[data-chess-mode="local"]').click();
  const board = game.locator('[data-chess-board="true"]');
  const square = (name: string) =>
    board.getByRole("gridcell", { name: new RegExp(`^${name} ·`) });
  for (const [from, to] of [
    ["g1", "f3"],
    ["g8", "f6"],
    ["e2", "e4"],
    ["e7", "e5"],
    ["f1", "e2"],
    ["b8", "c6"],
    ["e1", "g1"],
  ]) {
    await square(from).click();
    await square(to).click();
  }
  await expect(square("g1")).toHaveAttribute("aria-label", /rei branco/);
  await expect(square("f1")).toHaveAttribute("aria-label", /torre branco/);
  await game.getByRole("button", { name: /desfazer jogada/i }).click();
  await expect(square("e1")).toHaveAttribute("aria-label", /rei branco/);
  await expect(square("h1")).toHaveAttribute("aria-label", /torre branco/);
});

test("quatro jogos oferecem especialista sem perder modo local", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator('[data-arcade-open-control="true"]').click();
  for (const [tab, selector] of [
    ["dominó", "domino"],
    ["futebol", "football"],
    ["damas", "checkers"],
    ["xadrez", "chess"],
  ]) {
    await page.getByRole("tab", { name: new RegExp(tab, "i") }).click();
    const game = page.locator(`[data-${selector}-game]`);
    const expert = game.getByRole("button", {
      name: /^especialista$/i,
      exact: true,
    });
    await expert.click();
    await expect(expert).toHaveAttribute("aria-pressed", "true");
    await expect(game.locator("[data-arcade-difficulty]")).toContainText(
      "Especialista"
    );
  }
});
