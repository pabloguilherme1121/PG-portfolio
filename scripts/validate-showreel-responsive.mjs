import { chromium } from 'playwright';

const baseUrl = process.env.PREVIEW_URL || 'https://3000-ifdjg8odfpc7tjerrl156-59b127c0.us3.manus.computer';

async function checkViewport(viewport, expected) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  const trigger = page.locator('[data-showreel-trigger="true"]');
  if (await trigger.count() !== 1) throw new Error(`Gatilho ausente em ${viewport.width}px`);
  const poster = trigger.locator('img');
  const posterSrc = await poster.getAttribute('src');
  const expectedPoster = expected === 'vertical' ? '/manus-storage/showreel-vertical-poster_e21c73f9.jpg' : '/manus-storage/showreel-poster_847cd0c5.jpg';
  if (posterSrc !== expectedPoster) throw new Error(`Pôster incorreto em ${viewport.width}px: ${posterSrc}`);
  const container = page.locator('[data-showreel="true"] > div.relative').last();
  const ratio = await container.evaluate((element) => element.clientWidth / element.clientHeight);
  const expectedRatio = expected === 'vertical' ? 9 / 16 : 16 / 9;
  if (Math.abs(ratio - expectedRatio) > 0.05) throw new Error(`Proporção incorreta em ${viewport.width}px: ${ratio}`);
  if (await page.locator('[data-showreel-video="true"]').count() !== 0) throw new Error('Vídeo carregado antes do clique');
  await trigger.click();
  const video = page.locator('[data-showreel-video="true"]');
  await video.waitFor({ state: 'attached', timeout: 8000 });
  const source = await video.getAttribute('src');
  const expectedSource = expected === 'vertical' ? 'showreel-vertical_00d4c92f.mp4' : 'showreel_e887bf6f.mp4';
  if (!source?.includes(expectedSource)) throw new Error(`Vídeo incorreto em ${viewport.width}px: ${source}`);
  if (await video.getAttribute('controls') === null) throw new Error('Controles nativos ausentes');
  if (errors.length) throw new Error(`Erro de página: ${errors.join('; ')}`);
  await browser.close();
  return `ok ${viewport.width}x${viewport.height} ${expected}`;
}

console.log(await checkViewport({ width: 390, height: 844 }, 'vertical'));
console.log(await checkViewport({ width: 1280, height: 900 }, 'horizontal'));
console.log('Seleção responsiva do showreel validada.');
