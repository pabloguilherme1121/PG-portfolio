/**
 * Non-destructive on-demand HTTP smoke for the published PG ecosystem.
 * Reports availability of public HTML, not feature correctness or Android acceptance.
 * Run: node scripts/check-ecosystem-endpoints.mjs --json
 */
import { pathToFileURL } from 'node:url';

export const ENDPOINTS = Object.freeze([
  { id: 'pg-tech', url: 'https://pgtech-pi.vercel.app/' },
  { id: 'creator-kit', url: 'https://pg-creator-kit.vercel.app/' },
  { id: 'shotlist', url: 'https://pg-shotlist-lab.vercel.app/' },
  { id: 'qa-lab', url: 'https://pg-qa-lab.vercel.app/' },
  { id: 'budget', url: 'https://pg-budget-lab.vercel.app/' },
  { id: 'sprint', url: 'https://pg-sprint-lab.vercel.app/' },
  { id: 'social-assets', url: 'https://pg-social-assets.vercel.app/' },
  { id: 'arcade', url: 'https://pabloguilherme1121.github.io/PG-Arcade/' },
  { id: 'portfolio', url: 'https://pabloguilherme1121.github.io/PG-portfolio/' },
  { id: 'eleicoes-goias', url: 'https://pabloguilherme1121.github.io/eleicoes-goias-2026/' },
]);

export async function checkEndpoint(endpoint, { fetchImpl = fetch, timeoutMs = 8000 } = {}) {
  const started = performance.now();
  try {
    const response = await fetchImpl(endpoint.url, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      headers: { accept: 'text/html' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const contentType = response.headers.get('content-type') ?? '';
    // Avoid downloading or retaining full pages; the smoke only checks headers.
    if (response.body?.cancel) await response.body.cancel();
    const ok = response.status === 200 && /^text\/html(?:\s*;|\s*$)/i.test(contentType);
    return { id: endpoint.id, url: endpoint.url, ok, status: response.status,
      contentType, durationMs: Math.round(performance.now() - started),
      error: ok ? null : `Expected 200 HTML; received ${response.status} ${contentType}` };
  } catch (error) {
    return { id: endpoint.id, url: endpoint.url, ok: false, status: null,
      contentType: null, durationMs: Math.round(performance.now() - started),
      error: error?.name === 'TimeoutError' ? 'Timed out' : 'Request failed' };
  }
}

export async function checkAll(endpoints = ENDPOINTS, options = {}) {
  // Small concurrency avoids spiking free-tier services.
  const concurrency = Math.min(3, Math.max(1, options.concurrency ?? 3));
  const results = new Array(endpoints.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, endpoints.length) }, async () => {
    while (next < endpoints.length) {
      const index = next++;
      results[index] = await checkEndpoint(endpoints[index], options);
    }
  }));
  return results;
}

async function main(args) {
  const json = args.includes('--json');
  const only = args.find(arg => arg.startsWith('--only='))?.slice(7);
  if (args.some(arg => arg !== '--json' && !arg.startsWith('--only='))) {
    console.error('Usage: node scripts/check-ecosystem-endpoints.mjs [--json] [--only=id]');
    process.exitCode = 2;
    return;
  }
  const targets = only ? ENDPOINTS.filter(item => item.id === only) : ENDPOINTS;
  if (!targets.length) {
    console.error(`Unknown project ID: ${only}`);
    process.exitCode = 2;
    return;
  }
  const results = await checkAll(targets);
  if (json) console.log(JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
  else for (const r of results) console.log(`${r.ok ? 'OK' : 'FAIL'} ${r.id}: ${r.status ?? 'ERR'} ${r.durationMs}ms ${r.error ?? ''}`);
  if (results.some(item => !item.ok)) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main(process.argv.slice(2));
}
