import test from 'node:test';
import assert from 'node:assert/strict';
import { ENDPOINTS, checkEndpoint, checkAll } from './check-ecosystem-endpoints.mjs';

test('inventory contains one unique HTTPS URL for every documented public product', () => {
  assert.equal(ENDPOINTS.length, 10);
  assert.equal(new Set(ENDPOINTS.map(item => item.id)).size, ENDPOINTS.length);
  assert.equal(new Set(ENDPOINTS.map(item => item.url)).size, ENDPOINTS.length);
  assert(ENDPOINTS.every(item => item.url.startsWith('https://')));
});

test('accepts HTTP 200 HTML for a public product', async () => {
  const result = await checkEndpoint({ id: 'ok', url: 'https://example.org/' }, {
    fetchImpl: async () => ({
      ok: true, status: 200,
      headers: new Headers({ 'content-type': 'text/html; charset=utf-8' }),
    }),
  });
  assert.equal(result.ok, true);
  assert.equal(result.status, 200);
});

test('flags HTTP errors and non-HTML responses without inventing success', async () => {
  const bad = await checkEndpoint({id:'missing', url:'https://example.org/nope'}, {
    fetchImpl: async () => ({ok:false, status:404, headers:new Headers({'content-type':'text/html'})}),
  });
  assert.equal(bad.ok, false);
  const invalid = await checkEndpoint({id:'binary', url:'https://example.org/data'}, {
    fetchImpl: async () => ({ok:true, status:200, headers:new Headers({'content-type':'application/json'})}),
  });
  assert.equal(invalid.ok, false);
});

test('network errors do not reject the batch and cannot fake a status', async () => {
  const result = await checkAll([{id:'down', url:'https://example.org/down'}], {
    fetchImpl: async () => { throw new Error('network down'); },
  });
  assert.equal(result.every(item => !item.ok), true);
  assert.equal(result[0].status, null);
});

test('each site is requested once and output keeps configured order', async () => {
  const seen = [];
  const endpoints = [
    {id:'first',url:'https://example.org/one'},
    {id:'second',url:'https://example.org/two'},
  ];
  const output = await checkAll(endpoints, {fetchImpl: async url => {
    seen.push(url);
    return {ok:true, status:200, headers:new Headers({'content-type':'text/html'})};
  }});
  assert.deepEqual(output.map(x=>x.id), ['first','second']);
  assert.deepEqual(seen, endpoints.map(x=>x.url));
});
