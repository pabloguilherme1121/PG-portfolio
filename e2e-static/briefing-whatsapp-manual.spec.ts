import { expect, test } from "@playwright/test";

for (const width of [320, 390]) {
  test(`briefing estático oferece link explícito para WhatsApp sem popup em ${width}px`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./?consultation=1#contato");

    const contact = page.locator("#contato");
    await expect(contact).toBeVisible();
    await contact.getByRole("button", { name: /briefing opcional/i }).click();
    const form = contact.locator('[data-briefing-form="true"]');
    await expect(form).toBeVisible();

    await form.locator('input[name="name"]').fill("Visitante de teste");
    await form.locator('input[name="email"]').fill("teste@example.com");
    await form.getByRole("button", { name: /continuar.*direção/i }).click();
    await form.locator('select[name="service"]').selectOption("Site ou landing page");
    await form.locator('select[name="projectType"]').selectOption("Marca ou negócio");
    await form.locator('textarea[name="objective"]').fill("Preciso de um site rápido e responsivo.");
    await form.locator('input[name="audience"]').fill("Clientes da região");
    await expect(form.locator('input[name="audience"]')).toHaveValue("Clientes da região");
    await form.getByRole("button", { name: /continuar.*escopo/i }).click();
    await expect(form.locator('[data-briefing-step="scope"]')).toBeVisible();
    await form.locator('input[name="location"]').fill("Remoto");
    await form.getByRole("button", { name: /continuar.*requisitos/i }).click();
    await expect(form.locator('[data-briefing-step="requirements"]')).toBeVisible();
    await form.getByRole("button", { name: /continuar.*revisão/i }).click();
    await expect(form.locator('[data-briefing-step="review"]')).toBeVisible();
    const briefingField = form.locator('textarea[name="briefing"]');
    const briefingText = "Preciso de um site profissional para apresentar serviços e receber contatos.";
    await briefingField.fill(briefingText);
    // A alteração de estado no resumo não pode apagar o texto digitado no WebKit.
    await expect(briefingField).toHaveValue(briefingText);

    // Native constraint validation runs before React's onSubmit callback.
    // Optional controls with invalid values also block submission.
    const invalidFields = await form.evaluate(node =>
      Array.from(node.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select"))
        .filter(field => field.willValidate && !field.checkValidity())
        .map(field => ({ name: field.name, validationMessage: field.validationMessage }))
    );
    expect(invalidFields, "todos os controles sujeitos à validação nativa devem estar válidos após as cinco etapas").toEqual([]);

    let popups = 0;
    page.on("popup", () => { popups += 1; });
    await form.locator('[data-briefing-submit="true"]').click();
    const link = form.getByRole("link", { name: /abrir mensagem no WhatsApp/i });
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    const url = new URL(href!);
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe("/5561992903029");
    expect(url.searchParams.get("text")).toContain("Preciso de um site rápido e responsivo.");
    expect(popups).toBe(0);
    await expect(form).toContainText("Nenhuma mensagem foi enviada");
    await expect(link).toHaveAttribute("target", "_blank");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
