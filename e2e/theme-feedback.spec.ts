import { expect, test } from "@playwright/test";

for (const theme of ["dark", "light"] as const) {
  test(`feedback follows the ${theme} portfolio theme instead of the system`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme === "dark" ? "light" : "dark", reducedMotion: "reduce" });
    await page.addInitScript((value) => {
      localStorage.setItem("theme-preference", value);
      localStorage.setItem("theme", value);
    }, theme);
    await page.goto("/#contato-briefing");
    const form = page.locator("#contato-briefing");
    await expect(form).toBeVisible();
    await form.locator('input[name="name"]').fill("Visitante");
    await form.getByRole("button", { name: /limpar rascunho/i }).click();
    await expect(page.getByText("Briefing limpo", { exact: true })).toBeVisible();
    await expect(page.locator("[data-sonner-toaster]")).toHaveAttribute("data-sonner-theme", theme);
    await page.locator('[data-theme-toggle="true"]').filter({ visible: true }).first().click();
    await form.getByRole("button", { name: /limpar rascunho/i }).click();
    await expect(page.locator("[data-sonner-toaster]")).toHaveAttribute("data-sonner-theme", theme === "dark" ? "light" : "dark");
  });
}
