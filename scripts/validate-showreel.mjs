import { chromium } from 'playwright';

const baseUrl = process.env.PREVIEW_URL || 'https://3000-ifdjg8odfpc7tjerrl156-59b127c0.us3.manus.computer';

async function checkViewport(viewport) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(baseUrl, { waitUntil: 'networkidle' });
  const trigger = page.locator('[data-showreel-trigger="true"]');
  if (await trigger.count() !== 1) throw new Error(`Gatilho do showreel ausente em ${viewport.width}px`);
  if (await page.locator('[data-showreel-video="true"]').count() !== 0) throw new Error('O vídeo foi carregado antes da intenção do usuário');
  const poster = trigger.locator('img');
  if ((await poster.getAttribute('src')) !== '/manus-storage/showreel-poster_847cd0c5.jpg') throw new Error('Pôster otimizado não encontrado');
  if ((await page.locator('[data-showreel="true"]').evaluate((el) => el.scrollWidth > el.clientWidth))) throw new Error(`Overflow no showreel em ${viewport.width}px`);
  await trigger.click();
  const video = page.locator('[data-showreel-video="true"]');
  await video.waitFor({ state: 'attached', timeout: 8000 });
  if (!(await video.getAttribute('src'))?.includes('showreel_e887bf6f.mp4')) throw new Error('Vídeo do showreel incorreto');
  if ((await video.getAttribute('poster')) !== '/manus-storage/showreel-poster_847cd0c5.jpg') throw new Error('Pôster não associado ao vídeo');
  const hasControls = await video.getAttribute('controls') !== null;
  if (!hasControls) throw new Error('Controles nativos ausentes');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const transition = await trigger.evaluate((el) => getComputedStyle(el).transitionDuration).catch(() => '');
  if (transition && transition !== '0s' && transition !== '0.0s') throw new Error(`Transição não reduzida: ${transition}`);
  if (errors.length) throw new Error(`Erro de página: ${errors.join('; ')}`);
  await browser.close();
  return `ok ${viewport.width}x${viewport.height}`;
}

for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 900 }]) {
  console.log(await checkViewport(viewport));
}
console.log('Showreel sob demanda validado.');
