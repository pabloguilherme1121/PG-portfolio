import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for(const width of [320,390,1280]) test(`portfolio has direct playable evidence at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('./');
  const hero=page.locator('#inicio');
  await hero.getByRole('link',{name:/Interação que convida a jogar/}).click();
  const showcase=page.locator('#pg-lab');
  await expect(showcase).toBeVisible();
  for(const id of ['peg','snake','liga4']) {
    const pick=showcase.locator(`[data-arcade-direct-game="${id}"]`);
    await expect(pick).toHaveAttribute('href',`https://pabloguilherme1121.github.io/PG-Arcade/#/jogar/${id}`);
    await expect(pick).toHaveAttribute('target','_blank');
    await pick.scrollIntoViewIfNeeded();
    await expect(pick.locator('img')).toHaveJSProperty('complete',true);
    expect(await pick.locator('img').evaluate((img:HTMLImageElement)=>img.naturalWidth)).toBeGreaterThan(0);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect((await new AxeBuilder({page}).include('#pg-lab').analyze()).violations).toEqual([]);
});
