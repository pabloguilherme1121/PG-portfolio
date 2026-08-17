import { expect, test } from "@playwright/test";

test.describe("páginas de erro públicas", () => {
  test("exibe uma página 404 amigável para rotas inexistentes", async ({ page }) => {
    await page.goto("/rota-inexistente");
    await expect(page.getByText("erro 404", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: /ficou fora do arquivo/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /voltar ao início/i })).toBeVisible();
  });
});
