import {expect,test} from '@playwright/test';

test('Creator Kit guarda ideias, permite editar e exporta cenas compatíveis com Shotlist',async({page})=>{
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  const r=await page.goto('lab/creator/');
  expect(r?.status()).toBe(200);
  await page.locator('#topic').fill('Reel PG Tech');
  await page.locator('#scenes').fill('Plano geral\nDetalhe do equipamento');
  await page.locator('#generate').click();
  await expect(page.locator('#hook')).toHaveValue(/Reel PG Tech/);
  await page.locator('#submit').click();
  await expect(page.locator('#total')).toHaveText('1');
  await page.reload();
  await expect(page.locator('#total')).toHaveText('1');
  await page.locator('[data-action="edit"]').click();
  await page.locator('#stage').selectOption('Gravação');
  await page.locator('#submit').click();
  await expect(page.locator('#active')).toHaveText('1');
  const [download]=await Promise.all([
    page.waitForEvent('download'),
    page.locator('[data-action="shotlist"]').click(),
  ]);
  expect(download.suggestedFilename()).toMatch(/^pg-shotlist-.*\.json$/);
  expect(errors).toEqual([]);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)).toBeLessThanOrEqual(1);
});
