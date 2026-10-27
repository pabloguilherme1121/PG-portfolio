import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareShotlistBundle } from './prepare.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'pg-shotlist-deploy-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const src = join(root, 'apps/portfolio/public/lab/shotlist');
  const brand = join(root, 'apps/portfolio/public/brand/pg-bot');
  const configDir = join(root, 'deploy/pg-shotlist');
  await mkdir(src, { recursive: true });
  await mkdir(brand, { recursive: true });
  await mkdir(configDir, { recursive: true });
  const html = Buffer.from('<!doctype html><html><script>window.example=1</script><img src="../../brand/pg-bot/mascot.webp"><link href="./visual.css" rel="stylesheet"></html>');
  const css = Buffer.from('body { color: #fff; }');
  const mascot = Buffer.from([0x52, 0x49, 0x46, 0x46, 0, 0xff, 0x00, 0x01, 0x57, 0x45, 0x42, 0x50]);
  const pagesHeaders = "/*\n  X-Content-Type-Options: nosniff\n  X-Frame-Options: DENY\n  Referrer-Policy: strict-origin-when-cross-origin\n  Content-Security-Policy: frame-ancestors 'none'\n";
  const config = JSON.stringify({ headers: [{ source: '/(.*)', headers: [
    { key: 'X-Content-Type-Options', value: 'nosniff' },
    { key: 'X-Frame-Options', value: 'DENY' },
    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
  ] }] }) + '\n';
  await Promise.all([
    writeFile(join(src, 'index.html'), html),
    writeFile(join(src, 'visual.css'), css),
    writeFile(join(brand, 'mascot.webp'), mascot),
    writeFile(join(configDir, 'vercel.json'), config),
    writeFile(join(configDir, '_headers'), pagesHeaders),
  ]);
  return { root, html, css, mascot, config, pagesHeaders, outputDir: join(root, 'dist/pg-shotlist') };
}

test('prepara somente HTML, CSS, WebP e cabeçalhos, preservando os bytes', async t => {
  const { root, html, css, mascot, config, pagesHeaders, outputDir } = await fixture(t);
  const result = await prepareShotlistBundle({ root, outputDir });
  assert.equal(resolve(result.outputDir), resolve(outputDir));
  const paths = ['index.html', 'visual.css', 'brand/pg-bot/mascot.webp', '_headers', 'vercel.json'];
  assert.deepEqual(result.files, paths);
  const buffers = await Promise.all(paths.map(p => readFile(join(outputDir, p))));
  assert.deepEqual(buffers, [html, css, mascot, Buffer.from(pagesHeaders), Buffer.from(config)]);
  assert.equal(new URL('../../brand/pg-bot/mascot.webp', 'https://shotlist.example/').pathname, '/brand/pg-bot/mascot.webp');
});

test('não substitui um diretório de saída já existente', async t => {
  const { root, outputDir } = await fixture(t);
  await mkdir(outputDir, { recursive: true });
  const existing = join(outputDir, 'important.txt');
  await writeFile(existing, 'preservar');
  await assert.rejects(() => prepareShotlistBundle({ root, outputDir }), { code: 'EEXIST' });
  assert.equal((await readFile(existing, 'utf8')), 'preservar');
});

test('arquivo WebP ausente impede a criação do diretório final', async t => {
  const { root, outputDir } = await fixture(t);
  await rm(join(root, 'apps/portfolio/public/brand/pg-bot/mascot.webp'));
  await assert.rejects(() => prepareShotlistBundle({ root, outputDir }), { code: 'ENOENT' });
  await assert.rejects(() => readFile(join(outputDir, 'index.html')), { code: 'ENOENT' });
});

test('não publica HTML com referência incorreta ao mascote', async t => {
  const { root, outputDir } = await fixture(t);
  await writeFile(join(root, 'apps/portfolio/public/lab/shotlist/index.html'), '<html><img src="/nonexistent.webp"></html>');
  await assert.rejects(() => prepareShotlistBundle({ root, outputDir }), /mascote/);
  await assert.rejects(() => readFile(join(outputDir, 'index.html')), { code: 'ENOENT' });
});

test('bloqueia pacote quando X-Frame-Options está ausente', async t => {
  const { root, config, outputDir } = await fixture(t);
  const rules = JSON.parse(config);
  rules.headers[0].headers = rules.headers[0].headers.filter(h => h.key !== 'X-Frame-Options');
  await writeFile(join(root, 'deploy/pg-shotlist/vercel.json'), JSON.stringify(rules));
  await assert.rejects(() => prepareShotlistBundle({ root, outputDir }), /Cabeçalhos Vercel insuficientes/);
  await assert.rejects(() => readFile(join(outputDir, 'index.html')), { code: 'ENOENT' });
});

test('bloqueia pacote quando Referrer-Policy é enfraquecido', async t => {
  const { root, config, outputDir } = await fixture(t);
  const rules = JSON.parse(config);
  const policy = rules.headers[0].headers.find(h => h.key === 'Referrer-Policy');
  policy.value = 'unsafe-url';
  await writeFile(join(root, 'deploy/pg-shotlist/vercel.json'), JSON.stringify(rules));
  await assert.rejects(() => prepareShotlistBundle({ root, outputDir }), /Cabeçalhos Vercel insuficientes/);
});

test('fonte real do repositório gera pacote com os mesmos bytes', async t => {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const folder = await mkdtemp(join(tmpdir(), 'pg-shotlist-real-'));
  t.after(() => rm(folder, { recursive: true, force: true }));
  const outputDir = join(folder, 'site');
  await prepareShotlistBundle({ root, outputDir });
  const map = [
    ['apps/portfolio/public/lab/shotlist/index.html', 'index.html'],
    ['apps/portfolio/public/lab/shotlist/visual.css', 'visual.css'],
    ['apps/portfolio/public/brand/pg-bot/mascot.webp', 'brand/pg-bot/mascot.webp'],
    ['deploy/pg-shotlist/_headers', '_headers'],
    ['deploy/pg-shotlist/vercel.json', 'vercel.json'],
  ];
  for (const [source, target] of map) {
    assert.deepEqual(await readFile(join(root, source)), await readFile(join(outputDir, target)));
  }
  const config = JSON.parse(await readFile(join(outputDir, 'vercel.json'), 'utf8'));
  const headers = config.headers[0].headers;
  for (const key of ['X-Content-Type-Options','X-Frame-Options','Referrer-Policy','Content-Security-Policy']) {
    assert.ok(headers.find(header => header.key === key), key + ' missing');
  }
  assert.ok(!headers.find(h => h.key === 'Content-Security-Policy').value.includes("script-src 'none'"), 'Shotlist uses inline JavaScript');
});


test('rejects an absent Cloudflare Pages _headers input without leaving a partial output',async t => {
  const {root,outputDir}=await fixture(t);
  await rm(join(root,'deploy/pg-shotlist/_headers'));
  await assert.rejects(()=>prepareShotlistBundle({root,outputDir}),{code:'ENOENT'});
  await assert.rejects(()=>readFile(join(outputDir,'index.html')),{code:'ENOENT'});
});
