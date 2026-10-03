import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const mode = process.argv[2];
process.chdir(root);
const env = { ...process.env };
function run(file, args = []) {
  const result = spawnSync(process.execPath, [path.join(root, file), ...args], { cwd: root, env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
const vite = "node_modules/vite/bin/vite.js";
switch (mode) {
  case "static":
    env.VITE_DEPLOY_TARGET = "github-pages";
    env.VITE_STATIC_DEPLOY = "true";
    run(vite, ["build"]);
    break;
  case "server":
    env.NODE_ENV = "production";
    env.VITE_STATIC_DEPLOY = "false";
    env.VITE_DEPLOY_TARGET = "server";
    run(vite, ["build"]);
    run("scripts/build-api.mjs");
    break;
  case "api-build":
    run("scripts/build-api.mjs");
    break;
  case "api-start":
    env.NODE_ENV = "production";
    run("apps/api/dist/index.js");
    break;
  case "api-dev":
    env.NODE_ENV = "development";
    env.VITE_STATIC_DEPLOY = "false";
    run("apps/api/node_modules/tsx/dist/cli.mjs", ["watch", "apps/api/src/_core/index.ts"]);
    break;
  case "dev":
  case "dev-server":
    env.VITE_STATIC_DEPLOY = String(mode === "dev");
    env.VITE_DEPLOY_TARGET = "local";
    run(vite, process.argv.slice(3));
    break;
  case "preview":
    env.VITE_STATIC_DEPLOY = "true";
    env.VITE_DEPLOY_TARGET = "github-pages";
    run(vite, ["preview", ...process.argv.slice(3)]);
    break;
  case "check":
    run("node_modules/typescript/bin/tsc", ["--noEmit", "-p", "apps/portfolio/tsconfig.json"]);
    run("node_modules/typescript/bin/tsc", ["--noEmit", "-p", "apps/api/tsconfig.json"]);
    break;
  default:
    throw new Error(`Unknown workspace task: ${mode}`);
}
