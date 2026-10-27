import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../deploy/pgtech/vercel.json', import.meta.url), 'utf8'));
const html = readFileSync(new URL('../apps/portfolio/public/lab/index.html', import.meta.url), 'utf8');
const configuredHeaders = config.headers.find(item => item.source === '/(.*)')?.headers ?? [];
const value = name => configuredHeaders.find(item => item.key.toLowerCase() === name.toLowerCase())?.value;

test('PG Tech static Vercel deployment has response hardening on every route', () => {
  assert.equal(value('X-Content-Type-Options'), 'nosniff');
  assert.equal(value('X-Frame-Options'), 'DENY');
  assert.equal(value('Referrer-Policy'), 'no-referrer');
  assert.match(value('Permissions-Policy'), /camera=\(\)/);
  assert.match(value('Content-Security-Policy'), /frame-ancestors 'none'/);
});

test('static CSP matches the actual HTML instead of blocking its inline styles or brand image', () => {
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  assert.equal(scripts.length, 1, 'Only inert structured data may be embedded');
  assert.match(scripts[0][1], /type=["']application\/ld\+json["']/i);
  assert.match(html, /<style>/i, 'Hub uses inline styles');
  assert.match(value('Content-Security-Policy'), /style-src 'unsafe-inline'/);
  assert.match(value('Content-Security-Policy'), /img-src 'self'/);
  assert.match(value('Content-Security-Policy'), /script-src 'none'/);
  assert.match(html, /data-pg-bot="signature"/);
  assert.match(html, /src="\.\.\/brand\/pg-bot\/mascot\.webp"/);
  assert.equal(existsSync(new URL('../apps/portfolio/public/brand/pg-bot/mascot.webp', import.meta.url)), true);
});

test('config uses the supported static Vercel headers format', () => {
  assert.equal(config.$schema, 'https://openapi.vercel.sh/vercel.json');
  assert.equal(config.headers.length, 1);
  assert.ok(configuredHeaders.every(({key,value}) => typeof key === 'string' && typeof value === 'string'));
});
