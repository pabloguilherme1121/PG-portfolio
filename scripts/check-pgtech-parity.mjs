/**
 * Manual, read-only content parity check for the two PG Tech hub publications.
 * This does not deploy, persist HTML, or replace browser/Android QA.
 * Run: node scripts/check-pgtech-parity.mjs
 */
import { pathToFileURL } from 'node:url';

export const HUB_URLS = Object.freeze({
  vercel: 'https://pgtech-pi.vercel.app/',
  pages: 'https://pabloguilherme1121.github.io/PG-portfolio/lab/',
});

export const LAB_URLS = Object.freeze([
  'https://pg-shotlist-lab.vercel.app/',
  'https://pg-qa-lab.vercel.app/',
  'https://pg-creator-kit.vercel.app/',
  'https://pg-sprint-lab.vercel.app/',
  'https://pg-budget-lab.vercel.app/',
]);

export function inspectHtml(html) {
  return {
    pgBot: /\bdata-pg-bot\s*=\s*(["'])signature\1/i.test(html) && /mascot\.webp/i.test(html),
    skipLink: /<a\b[^>]*href\s*=\s*(["'])#principal\1[^>]*>/i.test(html),
    missingLabs: LAB_URLS.filter(url => !html.includes(url)),
  };
}

async function inspectSite(url, { fetchImpl, timeoutMs }) {
  try {
    const response = await fetchImpl(url, {
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store',
      headers: { accept: 'text/html' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const contentType = response.headers.get('content-type') ?? '';
    const httpOk = response.status === 200 && /^text\/html(?:\s*;|\s*$)/i.test(contentType);
    if (!httpOk) {
      if (response.body?.cancel) await response.body.cancel();
      return { httpOk: false, status: response.status, features: null, error: 'Expected HTTP 200 HTML' };
    }
    const html = await response.text();
    if (html.length > 250_000) return { httpOk: false, status: response.status, features: null, error: 'HTML response exceeds 250k characters' };
    return { httpOk: true, status: response.status, features: inspectHtml(html), error: null };
  } catch {
    return { httpOk: false, status: null, features: null, error: 'Fetch failed or timed out' };
  }
}

export async function compareHubParity({ fetchImpl = fetch, timeoutMs = 8000 } = {}) {
  const [vercel, pages] = await Promise.all([
    inspectSite(HUB_URLS.vercel, { fetchImpl, timeoutMs }),
    inspectSite(HUB_URLS.pages, { fetchImpl, timeoutMs }),
  ]);
  const problems = [];
  for (const [label, result] of [['Vercel', vercel], ['GitHub Pages', pages]]) {
    if (!result.httpOk) {
      problems.push(`${label}: ${result.error}`);
      continue;
    }
    if (!result.features.pgBot) problems.push(`PG Bot ausente no hub ${label}`);
    if (!result.features.skipLink) problems.push(`Link de pular navegação ausente no hub ${label}`);
    if (result.features.missingLabs.length) problems.push(`Links de laboratório ausentes no hub ${label}: ${result.features.missingLabs.join(', ')}`);
  }
  return { ok: problems.length === 0, checkedUrls: HUB_URLS, sites: { vercel, pages }, problems };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await compareHubParity();
  console.log(JSON.stringify({ checkedAt: new Date().toISOString(), ...report }, null, 2));
  if (!report.ok) process.exitCode = 1;
}
