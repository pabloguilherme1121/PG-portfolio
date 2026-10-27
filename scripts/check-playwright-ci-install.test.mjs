import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const yaml = readFileSync(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8");
const checkSource = readFileSync(new URL("./verify-playwright-startup.mjs", import.meta.url), "utf8");

test("CI installs all three Playwright engines without relying on runtime apt mirrors", () => {
  assert.match(yaml, /pnpm exec playwright install chromium firefox webkit/);
  assert.doesNotMatch(yaml, /playwright install --with-deps/);
  assert.match(yaml, /name: Verify Playwright browser startup/);
  assert.match(yaml, /run: node scripts\/verify-playwright-startup\.mjs/);
});

test("startup check must actually launch and close Chromium, Firefox and WebKit", () => {
  assert.match(checkSource, /import\s*\{\s*chromium,\s*firefox,\s*webkit\s*\}\s*from\s*["']@playwright\/test["']/);
  assert.match(checkSource, /for\s*\(\s*const browserType of \[chromium, firefox, webkit\]\s*\)/);
  assert.match(checkSource, /browserType\.launch\(\{/);
  assert.match(checkSource, /await browser\.close\(\)/);
});

test("keep full static and mobile E2E in quality job", () => {
  for (const command of [
    "pnpm test:e2e:static",
    "pnpm test:e2e",
    "Repeat static mobile WebKit Arcade opening",
    "Repeat mobile WebKit Arcade regression",
    "pnpm audit:bundle",
  ]) {
    assert.ok(yaml.includes(command), "Missing required gate: " + command);
  }
});
