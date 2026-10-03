import { build } from "esbuild";

await build({
  entryPoints: ["apps/api/src/_core/index.ts"],
  platform: "node",
  packages: "external",
  bundle: true,
  format: "esm",
  outfile: "apps/api/dist/index.js",
});
