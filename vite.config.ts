import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

const root = import.meta.dirname;
const portfolioRoot = path.join(root, "apps/portfolio");
// Static is the default. The optional API app opts in explicitly.
const isStaticDeploy = process.env.VITE_STATIC_DEPLOY !== "false";

function staticRuntimeGuard(): Plugin {
  return {
    name: "portfolio-static-runtime-guard",
    generateBundle(_options, bundle) {
      if (!isStaticDeploy) return;
      const forbidden = [
        "/@trpc/",
        "/@tanstack/react-query/",
        "/superjson/",
        "/apps/api/",
      ];
      const offenders = new Set<string>();
      for (const output of Object.values(bundle)) {
        if (output.type !== "chunk") continue;
        for (const moduleId of Object.keys(output.modules)) {
          const normalized = moduleId.replaceAll("\\", "/");
          if (forbidden.some(fragment => normalized.includes(fragment)))
            offenders.add(normalized);
        }
      }
      if (offenders.size)
        this.error(
          "Runtime de API detectado no build estático:\n" +
            Array.from(offenders).sort().join("\n")
        );
    },
  };
}

export default defineConfig({
  base:
    process.env.VITE_DEPLOY_TARGET === "github-pages" ? "/PG-portfolio/" : "/",
  plugins: [react(), tailwindcss(), staticRuntimeGuard()],
  define: {
    "import.meta.env.VITE_STATIC_DEPLOY": JSON.stringify(
      String(isStaticDeploy)
    ),
    __PORTFOLIO_RESUME_AVAILABLE__: JSON.stringify(
      process.env.E2E_FORCE_RESUME_AVAILABLE === "true" ||
        fs.existsSync(
          path.join(
            portfolioRoot,
            "public/manus-storage/curriculo-pablo-guilherme-profissional_1b06376f.pdf"
          )
        )
    ),
    __PORTFOLIO_HERO_AVAILABLE__: JSON.stringify(
      fs.existsSync(
        path.join(
          portfolioRoot,
          "public/manus-storage/pablo-hero-archive_fbc55c04.png"
        )
      )
    ),
  },
  resolve: {
    alias: [
      {
        find: "@portfolio/bootstrap",
        replacement: isStaticDeploy
          ? path.join(portfolioRoot, "src/bootstrapStatic.tsx")
          : path.join(root, "apps/api/client/bootstrapServer.tsx"),
      },
      {
        find: "@/lib/portfolioApi",
        replacement: isStaticDeploy
          ? path.join(portfolioRoot, "src/lib/portfolioApi.ts")
          : path.join(root, "apps/api/client/trpc.ts"),
      },
      { find: "@api", replacement: path.join(root, "apps/api/client") },
      { find: "@", replacement: path.join(portfolioRoot, "src") },
      { find: "@shared", replacement: path.join(root, "packages/contracts") },
      { find: "@assets", replacement: path.join(root, "attached_assets") },
    ],
  },
  envDir: root,
  root: portfolioRoot,
  publicDir: path.join(portfolioRoot, "public"),
  build: {
    outDir: path.join(root, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-dom/client"],
          // API imports resolve from apps/api/client, so they are split automatically.
          "vendor-ui": ["lucide-react", "sonner", "wouter"],
          "vendor-primitives": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-tooltip",
          ],
          "vendor-utils": [
            "tailwind-merge",
            "clsx",
            "class-variance-authority",
          ],
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: ["localhost", "127.0.0.1"],
    fs: { strict: true, deny: ["**/.*"] },
  },
});
