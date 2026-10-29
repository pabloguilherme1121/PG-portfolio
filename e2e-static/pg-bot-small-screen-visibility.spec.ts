import { expect, test } from "@playwright/test";

for (const { width, height } of [{ width: 320, height: 568 }, { width: 320, height: 740 }, { width: 390, height: 844 }]) {
  test(`PG Bot mantém mensagem inicial visível ou recuperável ao rolar em ${width}x${height}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height });
    await page.goto("./");
    await page.locator('[data-hero-pg-bot="true"]').click();
    const dialog = page.locator('[data-pg-bot-dialog="true"]');
    const log = dialog.getByRole("log", { name: "Respostas do PG Bot" });
    const intro = log.getByText(/Posso indicar projetos, currículo, jogos e o caminho para conversar sobre sua ideia\./);
    await expect(dialog).toBeVisible();
    await expect(intro).toBeVisible();
    const metrics = await log.evaluate(element => ({
      height: element.clientHeight,
      scrollHeight: element.scrollHeight,
      parentHeight: element.parentElement?.clientHeight ?? 0,
      overflowY: getComputedStyle(element).overflowY,
    }));
    expect(metrics.height).toBeGreaterThan(40);
    expect(metrics.overflowY).toBe("auto");
    await log.evaluate(element => { element.scrollTop = element.scrollHeight; });
    await expect.poll(async () => log.evaluate((element) => {
      const text = element.querySelector("p.whitespace-pre-wrap");
      if (!text) return false;
      const textRect = text.getBoundingClientRect();
      const logRect = element.getBoundingClientRect();
      return textRect.bottom <= logRect.bottom + 1 && textRect.top >= logRect.top - 1;
    })).toBe(true);
    await expect(dialog.getByRole("button", { name: "Quais projetos posso conhecer?" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await dialog.getByRole("button", { name: "Fechar PG Bot" }).click();
    await expect(page.locator('[data-hero-pg-bot="true"]')).toBeFocused();
  });
}

test("handle social não quebra no meio em 320px e preserva os links", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("./");
  const social = page.locator("#social");
  await social.scrollIntoViewIfNeeded();
  const handle = social.getByText("@mpjstoryworks", { exact: true });
  await expect(handle).toBeVisible();
  const metrics = await handle.evaluate(element => {
    const style = getComputedStyle(element);
    return { height: element.getBoundingClientRect().height, fontSize: parseFloat(style.fontSize), scrollWidth: element.scrollWidth, clientWidth: element.clientWidth };
  });
  expect(metrics.height).toBeLessThan(metrics.fontSize * 1.6);
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  await expect(handle.locator("xpath=ancestor::a")).toHaveAttribute("href", "https://www.instagram.com/mpjstoryworks/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
