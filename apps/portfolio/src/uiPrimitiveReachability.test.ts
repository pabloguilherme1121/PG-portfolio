import { readFileSync, readdirSync } from "node:fs";
import { basename, join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const uiDirectory = join(root, "apps/portfolio/src/components/ui");
const consumerRoots = [
  join(root, "apps/portfolio/src"),
  join(root, "apps/api/client"),
];

function collectSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(path);
    if (!/\.(ts|tsx)$/.test(entry.name)) return [];
    if (/\.(test|spec)\.(ts|tsx)$/.test(entry.name)) return [];
    return [path];
  });
}

function importedUiModules(source: string): string[] {
  const matches = source.matchAll(
    /(?:from\s+|import\s*)["']@\/components\/ui\/([^"']+)["']/g,
  );
  return [...matches].map((match) => match[1] ?? "").filter(Boolean);
}

describe("UI primitive reachability", () => {
  it("keeps every tracked UI primitive reachable from executable app code", () => {
    const uiModules = readdirSync(uiDirectory)
      .filter((file) => file.endsWith(".tsx"))
      .map((file) => basename(file, ".tsx"))
      .sort();

    const uiEdges = new Map<string, Set<string>>();
    const reachable = new Set<string>();

    for (const file of collectSourceFiles(uiDirectory)) {
      const moduleName = basename(file, ".tsx");
      uiEdges.set(
        moduleName,
        new Set(importedUiModules(readFileSync(file, "utf8"))),
      );
    }

    for (const consumerRoot of consumerRoots) {
      for (const file of collectSourceFiles(consumerRoot)) {
        if (relative(uiDirectory, file).startsWith("..") === false) continue;
        for (const moduleName of importedUiModules(readFileSync(file, "utf8"))) {
          reachable.add(moduleName);
        }
      }
    }

    const queue = [...reachable];
    while (queue.length) {
      const moduleName = queue.shift();
      if (!moduleName) continue;
      for (const dependency of uiEdges.get(moduleName) ?? []) {
        if (reachable.has(dependency)) continue;
        reachable.add(dependency);
        queue.push(dependency);
      }
    }

    const unreachable = uiModules.filter((moduleName) => !reachable.has(moduleName));
    expect(unreachable).toEqual([]);
  });
});
