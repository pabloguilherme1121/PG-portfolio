import { expect, test } from "@playwright/test";

for (const width of [320, 390, 1280]) {
  test(`PG Bot abre, responde, navega e preserva foco em ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./");

    const opener = page.locator('[data-hero-pg-bot="true"]');
    await expect(opener).toBeVisible();
    await opener.click();
    const dialog = page.locator('[data-pg-bot-dialog="true"]');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("heading", { name: /PG Bot/ })).toBeVisible();
    await expect(dialog.getByText(/sem IA externa/i)).toBeVisible();
    const mascot = dialog.locator("img");
    await expect(mascot).toHaveAttribute("src", /brand\/pg-bot\/mascot\.webp$/);

    await dialog.getByRole("button", { name: "Quero ver seu currículo" }).click();
    await expect(dialog.getByRole("log")).toContainText("currículo web");
    const resume = dialog.getByRole("link", { name: "Ver currículo" });
    await expect(resume).toHaveAttribute("href", "#curriculo-web");
    await dialog.getByRole("button", { name: "Fechar PG Bot" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(opener).toBeFocused();

    await opener.click();
    await dialog.locator('[data-pg-bot-input="true"]').fill("Como pedir orçamento?");
    await dialog.getByRole("button", { name: "Enviar pergunta ao guia local" }).click();
    await expect(dialog.getByRole("log")).toContainText("briefing opcional");
    await dialog.getByRole("link", { name: "Preparar briefing" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page).toHaveURL(/#contato-briefing$/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("menu móvel oferece atalho para o PG Bot e Escape restaura foco", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("./");
  const menuButton = page.locator('[data-mobile-menu-toggle="true"]');
  await menuButton.click();
  const launcher = page.locator('[data-mobile-pg-bot="true"]');
  await expect(launcher).toBeVisible();
  await launcher.click();
  await expect(page.locator("#mobile-navigation")).toHaveCount(0);
  await expect(page.locator('[data-pg-bot-dialog="true"]')).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator('[data-pg-bot-dialog="true"]')).toHaveCount(0);
  await expect(menuButton).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("PG Bot oferece acesso externo real sem prometer envio de mensagem", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  await page.locator('[data-hero-pg-bot="true"]').click();
  const dialog = page.locator('[data-pg-bot-dialog="true"]');
  await dialog.getByRole("button", { name: "Como jogar no PG Arcade?" }).click();
  const action = dialog.getByRole("link", { name: "Abrir PG Arcade" });
  await expect(action).toHaveAttribute("href", "https://pabloguilherme1121.github.io/PG-Arcade/");
  await expect(action).toHaveAttribute("target", "_blank");
  await expect(action).toHaveAttribute("rel", /noopener noreferrer/);
  await expect(dialog.getByText(/sem envio da conversa/i)).toBeVisible();
});

test("hero organiza três provas de trabalho com navegação interna", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("./");
  const choices = page.getByRole("navigation", { name: "Explore meu trabalho" });
  await expect(choices.getByRole("link")).toHaveCount(3);
  await expect(choices.getByRole("link", { name: /Trajeto/ })).toHaveAttribute("href", "#trajeto");
  await expect(choices.getByRole("link", { name: /Observatório/ })).toHaveAttribute("href", "#observatorio");
  await expect(choices.getByRole("link", { name: /PG Arcade/ })).toHaveAttribute("href", "#pg-lab");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
