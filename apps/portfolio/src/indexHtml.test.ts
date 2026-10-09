import { readFile } from "node:fs/promises";
import path from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const indexHtmlPath = path.resolve(import.meta.dirname, "../index.html");
const serverAppPath = path.resolve(
  import.meta.dirname,
  "../../api/client/ServerApp.tsx"
);

async function readIndexHtml() {
  return readFile(indexHtmlPath, "utf8");
}

function readAdministrativeRoutes(source: string): string[] {
  const file = ts.createSourceFile(
    "ServerApp.tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );
  const routes: string[] = [];
  function visit(node: ts.Node) {
    if (
      ts.isJsxAttribute(node) &&
      node.name.getText(file) === "administrativeRoutes" &&
      ts.isJsxAttributes(node.parent) &&
      (ts.isJsxSelfClosingElement(node.parent.parent) ||
        ts.isJsxOpeningElement(node.parent.parent)) &&
      node.parent.parent.tagName.getText(file) === "PortfolioApp"
    ) {
      const initializer = node.initializer;
      if (
        !initializer ||
        !ts.isJsxExpression(initializer) ||
        !initializer.expression ||
        !ts.isArrayLiteralExpression(initializer.expression)
      ) {
        throw new Error(
          "administrativeRoutes must be an explicit JSX route array"
        );
      }
      for (const element of initializer.expression.elements) {
        const opening = ts.isJsxSelfClosingElement(element)
          ? element
          : ts.isJsxElement(element)
            ? element.openingElement
            : undefined;
        if (!opening || opening.tagName.getText(file) !== "Route")
          throw new Error("Expected an administrative Route element");
        const attribute = opening.attributes.properties.find(
          property =>
            ts.isJsxAttribute(property) &&
            property.name.getText(file) === "path"
        );
        if (
          !attribute ||
          !ts.isJsxAttribute(attribute) ||
          !attribute.initializer ||
          !ts.isStringLiteral(attribute.initializer)
        ) {
          throw new Error("Administrative route paths must be string literals");
        }
        routes.push(attribute.initializer.text);
      }
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  return routes;
}

function readShellRobots(html: string, route: string, baseUrl: string): string {
  const script = [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(
      ([, attributes]) =>
        !/type=["'](?:module|application\/ld\+json)["']/i.test(attributes)
    )
    .map(([, , body]) => body)
    .find(body => body.includes('"noindex, nofollow"'));
  expect(script).toBeTruthy();
  let robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1];
  expect(robots).toBe("index, follow");
  runInNewContext(script!.replaceAll("%BASE_URL%", baseUrl), {
    URL,
    window: {
      location: new URL(baseUrl + route.slice(1), "https://example.com"),
    },
    localStorage: {
      getItem() {
        throw new Error("Storage blocked");
      },
    },
    document: {
      documentElement: { classList: { add() {} } },
      querySelector(selector: string) {
        return selector === "#robots-meta"
          ? {
              setAttribute(name: string, value: string) {
                if (name === "content") robots = value;
              },
            }
          : null;
      },
    },
  });
  return robots!;
}

describe("portfolio HTML shell", () => {
  it("keeps classic inline scripts free from import.meta syntax", async () => {
    const html = await readIndexHtml();
    const inlineScripts = [
      ...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi),
    ];
    const classicScripts = inlineScripts
      .filter(([, attributes]) => !/type=["']module["']/i.test(attributes))
      .map(([, , body]) => body);

    expect(classicScripts.join("\n")).not.toContain("import.meta");
  });

  it("ships valid Person structured data", async () => {
    const html = await readIndexHtml();
    const structuredData = html.match(
      /<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i
    )?.[1];

    expect(structuredData).toBeTruthy();
    expect(() => JSON.parse(structuredData ?? "")).not.toThrow();
    expect(JSON.parse(structuredData ?? "{}").url).toBe(
      "https://pabloguilherme1121.github.io/PG-portfolio/"
    );
  });

  it("uses the dedicated social preview and Vite base-aware favicon", async () => {
    const html = await readIndexHtml();

    expect(html).toContain(
      'content="https://pabloguilherme1121.github.io/PG-portfolio/social-preview.png"'
    );
    expect(html).toContain('href="%BASE_URL%favicon.svg"');
  });
  it("marks every administrative server route as noindex in the HTML shell", async () => {
    const [html, serverApp] = await Promise.all([
      readIndexHtml(),
      readFile(serverAppPath, "utf8"),
    ]);
    const adminRoutes = readAdministrativeRoutes(serverApp);
    expect(adminRoutes.toSorted()).toEqual([
      "/agenda",
      "/curadoria",
      "/favoritos",
    ]);
    for (const baseUrl of ["/", "/PG-portfolio/"]) {
      for (const route of adminRoutes) {
        for (const suffix of ["", "/", "/item"]) {
          expect(readShellRobots(html, route + suffix, baseUrl)).toBe(
            "noindex, nofollow"
          );
        }
      }
    }
  });
  it("discovers only Route elements inside administrativeRoutes, ignoring comments and unrelated paths", () => {
    const source = `
      // <Route path="/commented" />
      const unrelated = <Route path="/public" />;
      const text = 'path="/string"';
      const app = <PortfolioApp path="/unrelated" administrativeRoutes={[
        /* <Route path="/disabled" /> */
        <Route path="/agenda" />,
        <Route path="/favoritos"></Route>,
        <Route path="/curadoria" />,
      ]} />;
    `;
    expect(readAdministrativeRoutes(source)).toEqual([
      "/agenda",
      "/favoritos",
      "/curadoria",
    ]);
  });
  it("keeps public routes and administrative name prefixes indexable", async () => {
    const html = await readIndexHtml();
    for (const baseUrl of ["/", "/PG-portfolio/"]) {
      for (const route of [
        "/",
        "/privacidade",
        "/404",
        "/agenda-publica",
        "/favoritos-publicos",
        "/curadoria-publica",
        "/projetos/agenda",
      ]) {
        expect(readShellRobots(html, route, baseUrl)).toBe("index, follow");
      }
    }
  });
});
