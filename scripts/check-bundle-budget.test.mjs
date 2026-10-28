import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const source = path.join(path.dirname(fileURLToPath(import.meta.url)), 'check-bundle-budget.mjs');
function audit(assets, extraEnv = {}) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pg-bundle-test-'));
  try {
    fs.mkdirSync(path.join(tempRoot, 'scripts'));
    fs.mkdirSync(path.join(tempRoot, 'dist', 'public', 'assets'), { recursive: true });
    fs.copyFileSync(source, path.join(tempRoot, 'scripts', 'check-bundle-budget.mjs'));
    for (const [name, bytes] of Object.entries(assets)) fs.writeFileSync(path.join(tempRoot, 'dist', 'public', 'assets', name), Buffer.alloc(bytes));
    return spawnSync(process.execPath, [path.join(tempRoot, 'scripts', 'check-bundle-budget.mjs')], { encoding: 'utf8', env: { ...process.env, VITE_STATIC_DEPLOY: 'true', ...extraEnv } });
  } finally {
    if (!path.resolve(tempRoot).startsWith(path.resolve(os.tmpdir()) + path.sep + 'pg-bundle-test-')) throw new Error('invalid fixture path');
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
test('fails instead of reporting success if required build artifacts are missing', () => {
  for (const assets of [{}, { 'app.js': 5 }, { 'app.css': 5 }]) {
    const result = audit(assets);
    assert.equal(result.status, 1, result.stdout + result.stderr);
  }
});
test('accepts both required asset types within budget', () => {
  const result = audit({ 'app.js': 5, 'app.css': 5 });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
test('continues rejecting oversized and forbidden static runtime chunks', () => {
  for (const assets of [{ 'app.js': 225 * 1024 + 1, 'app.css': 5 }, { 'vendor-data-abc.js': 5, 'app.css': 5 }, { 'app.js': 5, 'app.css': 220 * 1024 + 1 }]) {
    const result = audit(assets);
    assert.equal(result.status, 1, result.stdout + result.stderr);
  }
});
