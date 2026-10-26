import test from 'node:test';
import assert from 'node:assert/strict';
import { HUB_URLS, LAB_URLS, inspectHtml, compareHubParity } from './check-pgtech-parity.mjs';

const labLinks = LAB_URLS.map(url => `<a href="${url}">Abrir</a>`).join('');
const html = (branded = true) => `<!doctype html><html lang="pt-BR"><body><a href="#principal">Ir para o conteúdo</a><main id="principal">${labLinks}${branded ? '<span data-pg-bot="signature"><img src="/brand/pg-bot/mascot.webp" alt=""></span>' : ''}</main></body></html>`;
const fakeFetch = (pages) => async url => {
  if (!Object.hasOwn(pages, url)) throw new Error('unexpected host');
  const page = pages[url];
  if (page instanceof Error) throw page;
  return new Response(page, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
};

test('recognizes expected signature, skip navigation and five lab links', () => {
  const inspected = inspectHtml(html());
  assert.equal(inspected.pgBot, true);
  assert.equal(inspected.skipLink, true);
  assert.deepEqual(inspected.missingLabs, []);
});

test('recognizes drift even when both public pages return HTML 200', async () => {
  const result = await compareHubParity({
    fetchImpl: fakeFetch({ [HUB_URLS.vercel]: html(false), [HUB_URLS.pages]: html() }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.sites.vercel.httpOk, true);
  assert.equal(result.sites.pages.httpOk, true);
  assert(result.problems.includes('PG Bot ausente no hub Vercel'));
});

test('accepts parity only when the two versions have required features', async () => {
  const result = await compareHubParity({
    fetchImpl: fakeFetch({ [HUB_URLS.vercel]: html(), [HUB_URLS.pages]: html() }),
  });
  assert.equal(result.ok, true);
  assert.deepEqual(result.problems, []);
});

test('fails when a tool link is missing despite 200 HTML', async () => {
  const incomplete = html().replace(`<a href="${LAB_URLS[0]}">Abrir</a>`, '');
  const result = await compareHubParity({
    fetchImpl: fakeFetch({ [HUB_URLS.vercel]: incomplete, [HUB_URLS.pages]: html() }),
  });
  assert.equal(result.ok, false);
  assert(result.problems.some(x => x.includes('laboratório') && x.includes('Vercel')));
});

test('reports network and non-HTML errors without printing page data', async () => {
  const result = await compareHubParity({
    fetchImpl: async url => url === HUB_URLS.vercel
      ? Promise.reject(new Error('private network detail'))
      : new Response('not html', { headers: {'content-type': 'application/json'} }),
  });
  assert.equal(result.ok, false);
  assert.equal(result.sites.vercel.httpOk, false);
  assert.equal(result.sites.pages.httpOk, false);
  assert(!JSON.stringify(result).includes('private network detail'));
});

test('reports skip-navigation removal on either publication', async () => {
  const result = await compareHubParity({
    fetchImpl: fakeFetch({ [HUB_URLS.vercel]: html().replace('href="#principal"', 'href="#broken"'), [HUB_URLS.pages]: html() }),
  });
  assert.equal(result.ok, false);
  assert(result.problems.some(x => x.includes('pular navegação') && x.includes('Vercel')));
});
