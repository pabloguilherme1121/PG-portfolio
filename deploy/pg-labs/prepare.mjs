import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRoot = fileURLToPath(new URL('../../', import.meta.url));
export const LABS = Object.freeze({ qa: true, creator: true, sprint: false, budget: false });
const mascot = 'brand/pg-bot/mascot.webp';
const requiredHeaders = Object.freeze([
  ['X-Content-Type-Options', 'nosniff'],
  ['X-Frame-Options', 'DENY'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Content-Security-Policy', "frame-ancestors 'none'"],
]);

export async function prepareLabBundle({ root = defaultRoot, lab, outputDir } = {}) {
  if (!Object.hasOwn(LABS, lab)) throw new Error('Laboratório desconhecido ou não permitido');
  const output = resolve(outputDir ?? join(root, 'dist', `pg-${lab}`));
  const dir = `apps/portfolio/public/lab/${lab}`;
  const sources = [
    [`${dir}/index.html`, 'index.html'],
    ...(LABS[lab] ? [[`${dir}/visual.css`, 'visual.css']] : []),
    ['apps/portfolio/public/brand/pg-bot/mascot.webp', mascot],
    ['deploy/cloudflare/_headers', '_headers'],
    ['deploy/pg-labs/vercel.json', 'vercel.json'],
  ];
  // Read and validate every input before creating any output.
  const bytes = await Promise.all(sources.map(([from]) => readFile(join(root, from))));
  const html = bytes[0].toString('utf8');
  if (!html.includes('src="../../brand/pg-bot/mascot.webp"')) {
    throw new Error('Referência do mascote ausente ou incorreta');
  }
  if (LABS[lab] && !html.includes('href="./visual.css"')) {
    throw new Error('Referência CSS ausente ou incorreta');
  }
  const image = bytes[sources.findIndex(([, to]) => to === mascot)];
  if (image.length < 12 || image.toString('ascii', 0, 4) !== 'RIFF' || image.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Mascote WebP inválido');
  }
  const config = JSON.parse(bytes[bytes.length - 1].toString('utf8'));
  const headerReady = config.headers?.some(rule => rule.source === '/(.*)' &&
    requiredHeaders.every(([key, value]) => rule.headers?.some(h => h.key === key && h.value === value)));
  if (!headerReady) throw new Error('Cabeçalhos Vercel ausentes ou alterados');
  const expectedPagesHeaders = ['/*', ...requiredHeaders.map(([key, value]) => `  ${key}: ${value}`), ''].join('\n');
  if (bytes[sources.findIndex(([, to]) => to === '_headers')].toString('utf8') !== expectedPagesHeaders) {
    throw new Error('Cabeçalhos Cloudflare Pages ausentes ou alterados');
  }
  await mkdir(dirname(output), { recursive: true });
  await mkdir(output); // Never overwrite a previous output.
  try {
    for (let i = 0; i < sources.length; i++) {
      const path = join(output, sources[i][1]);
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, bytes[i]);
    }
  } catch (error) {
    await rm(output, { recursive: true, force: true });
    throw error;
  }
  return { outputDir: output, files: sources.map(([, to]) => to) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length !== 3) throw Error('Uso: node deploy/pg-labs/prepare.mjs qa|creator|sprint|budget');
    const result = await prepareLabBundle({ lab: process.argv[2] });
    console.log(`PG ${process.argv[2]}: ${result.files.length} arquivos em ${result.outputDir}`);
  } catch (error) {
    console.error(`Empacotamento interrompido: ${error.message}`);
    process.exitCode = 1;
  }
}
