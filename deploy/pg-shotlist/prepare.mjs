import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRoot = fileURLToPath(new URL('../../', import.meta.url));
const files = [
  ['apps/portfolio/public/lab/shotlist/index.html', 'index.html'],
  ['apps/portfolio/public/lab/shotlist/visual.css', 'visual.css'],
  ['apps/portfolio/public/brand/pg-bot/mascot.webp', 'brand/pg-bot/mascot.webp'],
  ['deploy/pg-shotlist/_headers', '_headers'],
  ['deploy/pg-shotlist/vercel.json', 'vercel.json'],
];

export async function prepareShotlistBundle({ root = defaultRoot, outputDir = join(root, 'dist/pg-shotlist') } = {}) {
  const destination = resolve(outputDir);
  // Validate all sources before writing any output.
  const bytes = await Promise.all(files.map(([from]) => readFile(join(root, from))));
  const html = bytes[0].toString('utf8');
  if (!html.includes('../../brand/pg-bot/mascot.webp')) {
    throw new Error('Referência do mascote PG Bot ausente no HTML do Shotlist');
  }
  const config = JSON.parse(bytes[files.findIndex(([, to]) => to === 'vercel.json')].toString('utf8'));
  const requiredHeaders = [
    ['X-Content-Type-Options', 'nosniff'],
    ['X-Frame-Options', 'DENY'],
    ['Referrer-Policy', 'strict-origin-when-cross-origin'],
    ['Content-Security-Policy', "frame-ancestors 'none'"],
  ];
  if (!config.headers?.some(rule =>
    rule.source === '/(.*)' && requiredHeaders.every(([key, value]) =>
      rule.headers?.some(header => header.key === key && header.value === value)))) {
    throw new Error('Cabeçalhos Vercel insuficientes');
  }
  // Cloudflare Pages reads _headers from its published root, not vercel.json.
  const pagesHeaders = bytes[files.findIndex(([, to]) => to === '_headers')].toString('utf8');
  if (!pagesHeaders.startsWith('/*\\n') ||
      !requiredHeaders.every(([key, value]) => pagesHeaders.includes('\\n  ' + key + ': ' + value + '\\n'))) {
    throw new Error('Cabeçalhos Cloudflare Pages insuficientes');
  }
  await mkdir(dirname(destination), { recursive: true });
  await mkdir(destination); // EEXIST is intentional: never overwrite an existing build.
  try {
    for (let i = 0; i < files.length; i++) {
      const to = join(destination, files[i][1]);
      await mkdir(dirname(to), { recursive: true });
      await writeFile(to, bytes[i]);
    }
  } catch (error) {
    await rm(destination, { recursive: true, force: true });
    throw error;
  }
  return { outputDir: destination, files: files.map(([, to]) => to) };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await prepareShotlistBundle();
    console.log(`PG Shotlist: ${result.files.length} arquivos preparados em ${result.outputDir}`);
  } catch (error) {
    console.error(`PG Shotlist: falha na preparação: ${error.message}`);
    process.exitCode = 1;
  }
}
