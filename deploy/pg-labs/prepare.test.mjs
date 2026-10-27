import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { prepareLabBundle, LABS } from './prepare.mjs';

const WEBP = Buffer.concat([Buffer.from('RIFF'), Buffer.from([0,0,0,0]), Buffer.from('WEBP'), Buffer.from([1,2,3])]);
const config = { headers: [{ source: '/(.*)', headers: [
  {key:'X-Content-Type-Options',value:'nosniff'},
  {key:'X-Frame-Options',value:'DENY'},
  {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
  {key:'Content-Security-Policy',value:"frame-ancestors 'none'"}
]}] };

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'pg-labs-'));
  t.after(async () => rm(root, {recursive:true, force:true}));
  const mascotPath = join(root,'apps/portfolio/public/brand/pg-bot/mascot.webp');
  await mkdir(join(root, 'apps/portfolio/public/brand/pg-bot'), {recursive:true});
  await writeFile(mascotPath, WEBP);
  await mkdir(join(root, 'deploy/pg-labs'), {recursive:true});
  await writeFile(join(root,'deploy/pg-labs/vercel.json'), JSON.stringify(config)+'\n');
  const htmls = {}, styles = {};
  for (const [lab, hasCss] of Object.entries(LABS)) {
    const folder = join(root, 'apps/portfolio/public/lab',lab);
    await mkdir(folder,{recursive:true});
    const html = Buffer.from(`<html><img src="../../brand/pg-bot/mascot.webp" />${hasCss?'<link rel="stylesheet" href="./visual.css" />':''}<script>window.lab='${lab}'</script></html>`);
    htmls[lab]=html;
    await writeFile(join(folder,'index.html'),html);
    if(hasCss) { styles[lab]=Buffer.from(`/* ${lab} */`);await writeFile(join(folder,'visual.css'),styles[lab]); }
  }
  return {root, htmls, styles, mascotPath};
}

test('four Vercel lab bundles preserve HTML, CSS and WebP byte-for-byte', async t => {
  const f=await fixture(t);
  assert.deepEqual(Object.keys(LABS), ['qa','creator','sprint','budget']);
  for(const lab of Object.keys(LABS)){
    const outputDir=join(f.root,'out',lab);
    const result=await prepareLabBundle({root:f.root,lab,outputDir});
    const expected=['index.html',...(LABS[lab]?['visual.css']:[]),'brand/pg-bot/mascot.webp','vercel.json'];
    assert.deepEqual(result.files,expected);
    assert.deepEqual(await readFile(join(outputDir,'index.html')),f.htmls[lab]);
    assert.deepEqual(await readFile(join(outputDir,'brand/pg-bot/mascot.webp')),WEBP);
    assert.deepEqual(await readFile(join(outputDir,'vercel.json')),Buffer.from(JSON.stringify(config)+'\n'));
    if(LABS[lab]) assert.deepEqual(await readFile(join(outputDir,'visual.css')),f.styles[lab]);
    assert.deepEqual((await readdir(outputDir)).sort(),(LABS[lab]?['index.html','visual.css','brand','vercel.json']:['index.html','brand','vercel.json']).sort());
  }
});

test('rejects unknown labs without path traversal',async t=>{
  const {root}=await fixture(t);
  for(const lab of ['../secret','shotlist','', 'QA']) await assert.rejects(()=>prepareLabBundle({root,lab}),/laborat[oó]rio/i);
});

test('rejects missing mascot before making an output directory',async t=>{
  const f=await fixture(t);await rm(f.mascotPath);
  const outputDir=join(f.root,'out','qa');
  await assert.rejects(()=>prepareLabBundle({root:f.root,lab:'qa',outputDir}),{code:'ENOENT'});
  await assert.rejects(()=>readFile(join(outputDir,'index.html')),{code:'ENOENT'});
});

test('rejects HTML without exact mascot reference before writing output',async t=>{
  const f=await fixture(t);const outputDir=join(f.root,'out','creator');
  await writeFile(join(f.root,'apps/portfolio/public/lab/creator/index.html'),'<html><img src="bad.webp"></html>');
  await assert.rejects(()=>prepareLabBundle({root:f.root,lab:'creator',outputDir}),/mascote/);
  await assert.rejects(()=>readFile(join(outputDir,'index.html')),{code:'ENOENT'});
});

test('rejects destination overwrite and preserves existing user data',async t=>{
  const f=await fixture(t);const outputDir=join(f.root,'out','sprint');
  await mkdir(outputDir,{recursive:true});await writeFile(join(outputDir,'important.txt'),'preserve');
  await assert.rejects(()=>prepareLabBundle({root:f.root,lab:'sprint',outputDir}),{code:'EEXIST'});
  assert.equal(await readFile(join(outputDir,'important.txt'),'utf8'),'preserve');
});

test('rejects weakened frame protection before writing',async t=>{
  const f=await fixture(t);const outputDir=join(f.root,'out','budget');
  await writeFile(join(f.root,'deploy/pg-labs/vercel.json'),JSON.stringify({headers:[{source:'/(.*)',headers:[{key:'Content-Security-Policy',value:"frame-ancestors 'self'"}]}]}));
  await assert.rejects(()=>prepareLabBundle({root:f.root,lab:'budget',outputDir}),/cabeçalhos/i);
  await assert.rejects(()=>readFile(join(outputDir,'index.html')),{code:'ENOENT'});
});

test('rejects missing visual.css for labs that require it',async t=>{
  const f=await fixture(t);const outputDir=join(f.root,'out','qa');
  await rm(join(f.root,'apps/portfolio/public/lab/qa/visual.css'));
  await assert.rejects(()=>prepareLabBundle({root:f.root,lab:'qa',outputDir}),{code:'ENOENT'});
});

test('real project source and artwork also build with exact original bytes',async t=>{
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const folder=await mkdtemp(join(tmpdir(),'pg-labs-real-'));
  t.after(()=>rm(folder,{recursive:true,force:true}));
  for(const lab of Object.keys(LABS)){
    const outputDir=join(folder,lab);
    const r=await prepareLabBundle({root,lab,outputDir});
    for(const name of r.files){
      const source=name==='vercel.json'?join(root,'deploy/pg-labs/vercel.json')
        : name==='brand/pg-bot/mascot.webp'?join(root,'apps/portfolio/public/brand/pg-bot/mascot.webp')
        : join(root,'apps/portfolio/public/lab',lab,name);
      assert.deepEqual(await readFile(source),await readFile(join(outputDir,name)));
    }
  }
});

test('Cloudflare Pages recebe _headers nos pacotes QA e Creator', async t => {
  const { root } = await fixture(t);
  for (const lab of ['qa', 'creator']) {
    const outputDir = join(root, 'cloudflare-out', lab);
    const result = await prepareLabBundle({ root, lab, outputDir });
    assert.ok(result.files.includes('_headers'));
    const headers = await readFile(join(outputDir, '_headers'), 'utf8');
    assert.match(headers, /^\/\*\n/);
    for (const directive of [
      'X-Content-Type-Options: nosniff',
      'X-Frame-Options: DENY',
      'Referrer-Policy: strict-origin-when-cross-origin',
      "Content-Security-Policy: frame-ancestors 'none'",
    ]) assert.ok(headers.split('\n').includes('  ' + directive), directive);
  }
});
