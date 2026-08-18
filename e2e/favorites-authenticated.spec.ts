import { expect, test } from "@playwright/test";

const authState = process.env.E2E_AUTH_STATE;

test.describe("favoritos protegidos — sessão autenticada", () => {
  test.skip(!authState, "Defina E2E_AUTH_STATE com um storageState de proprietário para executar estes cenários.");
  test.use({ storageState: authState ?? undefined });

  test("busca por nome ou descrição e abre a edição manual", async ({ page }) => {
    await page.goto("/favoritos");
    await expect(page.getByRole("heading", { name: "Meus favoritos" })).toBeVisible();
    const search = page.getByRole("textbox", { name: /buscar favoritos/i });
    await search.fill("RHAM");
    await expect(page.locator("[aria-label='Lista ordenável de favoritos'] article").first()).toBeVisible();
    await page.getByRole("button", { name: /editar/i }).first().click();
    await expect(page.getByRole("textbox", { name: "Nome", exact: true })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Descrição", exact: true })).toBeVisible();
  });

  test("salva alterações e permite restaurar o metadado original", async ({ page }) => {
    await page.goto("/favoritos");
    await expect(page.getByRole("heading", { name: "Meus favoritos" })).toBeVisible();
    await page.getByRole("button", { name: /editar/i }).first().click();
    const name = page.getByRole("textbox", { name: "Nome", exact: true });
    const original = await name.inputValue();
    await name.fill(`${original} — teste`);
    await page.getByRole("button", { name: /salvar alterações/i }).click();
    await expect(page.locator('p[role="status"]').filter({ hasText: "Dados do projeto atualizados." })).toBeVisible();
    await page.getByRole("button", { name: /editar/i }).first().click();
    const restoreButton = page.getByRole("button", { name: "restaurar original", exact: true });
    await expect(restoreButton).toBeEnabled();
    await restoreButton.click();
    await page.getByRole("button", { name: "Restaurar original", exact: true }).last().click();
    await expect(page.locator('p[role="status"]').filter({ hasText: "Metadados originais restaurados." })).toBeVisible();
  });

  test("reconhece a sessão isolada e encerra o acesso pelo logout do painel", async ({ page }) => {
    await page.goto("/favoritos");
    await expect(page.getByRole("heading", { name: "Meus favoritos" })).toBeVisible();
    await page.getByRole("button", { name: /E2E Test Admin/i }).click();
    await page.getByRole("menuitem", { name: "Sair" }).click();
    await expect(page.getByRole("heading", { name: "Entre para continuar" })).toBeVisible();
  });
});
