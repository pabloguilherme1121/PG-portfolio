import { expect, test } from "@playwright/test";

test("PG Tech provides a scoped privacy notice that opens in the same origin", async ({ page }) => {
  const response = await page.goto("lab/");
  expect(response?.status()).toBe(200);

  const link = page.getByRole("link", { name: "Privacidade e dados" });
  await expect(link).toHaveCount(1);
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "privacidade.html");

  await link.click();
  await expect(page).toHaveURL(/\/lab\/privacidade\.html$/);
  await expect(page.getByRole("heading", { name: "Privacidade na PG Tech" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dados técnicos" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Outros aplicativos" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Contato e solicitações" })).toBeVisible();
  await expect(page.locator("script")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Voltar à PG Tech" })).toHaveAttribute("href", "./");
});
