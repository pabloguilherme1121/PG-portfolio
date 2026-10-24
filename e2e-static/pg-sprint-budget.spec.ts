import {expect,test} from "@playwright/test";

test("PG Sprint cria e persiste tarefa com exportação CSV",async({page})=>{
  const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
  const response=await page.goto("lab/sprint/");
  expect(response?.status()).toBe(200);
  await page.locator("#task-name").fill("Praticar React e Playwright");
  await page.locator("#task-submit").click();
  await expect(page.locator("#metric-total")).toHaveText("1");
  await expect(page.locator("#cancel-edit")).toBeHidden();
  await page.locator("#focus-task").selectOption({index:1});
  await page.locator("#timer-toggle").click();
  await expect(page.locator("#timer-toggle")).toHaveText("Pausar");
  await page.reload();
  await expect(page.locator("#timer-toggle")).toHaveText("Pausar");
  await page.locator("#timer-toggle").click();
  await expect(page.locator("#timer-toggle")).toHaveText("Iniciar foco");
  await expect(page.locator("#task-list")).toContainText("Praticar React e Playwright");
  await page.locator('#task-list input[type="checkbox"]').check();
  await expect(page.locator("#metric-done")).toHaveText("1");
  const [file]=await Promise.all([page.waitForEvent("download"),page.locator("#export-csv").click()]);
  expect(file.suggestedFilename()).toBe("pg-sprint-tarefas.csv");
  expect(await page.locator("nav[aria-label='Navegação do PG Lab'] a").count()).toBe(5);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});

test("PG Budget persiste custos e calcula saldo projetado exato",async({page})=>{
  const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
  const response=await page.goto("lab/budget/");
  expect(response?.status()).toBe(200);
  await page.locator("#item-description").fill("Transporte para captação");
  await page.locator("#item-price").fill("35,90");
  await page.locator("#item-submit").click();
  await expect(page.locator("#metric-expense")).toContainText("35,90");
  await expect(page.locator("#cancel-edit")).toBeHidden();
  await page.locator("#item-description").fill("Aluguel da câmera");
  await page.locator("#item-price").fill("1.234,56");
  await page.locator("#item-submit").click();
  await expect(page.locator("#metric-expense")).toContainText("1.270,46");
  await page.reload();
  await expect(page.locator("#item-list")).toContainText("Transporte para captação");
  const [file]=await Promise.all([page.waitForEvent("download"),page.locator("#export-csv").click()]);
  expect(file.suggestedFilename()).toBe("pg-budget-itens.csv");
  expect(await page.locator("nav[aria-label='Navegação do PG Lab'] a").count()).toBe(5);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  expect(errors).toEqual([]);
});
