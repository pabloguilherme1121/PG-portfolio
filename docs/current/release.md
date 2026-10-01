# Publicação e qualidade

Node 22 e pnpm 10.34.5 (via Corepack).

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

`dev`/`build` priorizam o site estático. `dev:server`, `build:server` e `start` são opt-in para a variante com API. Banco, OAuth e credenciais externas são exigidos apenas no ambiente de servidor; nunca usar segredos em variáveis `VITE_`.

```bash
pnpm check
pnpm test
pnpm audit --audit-level=low
pnpm audit:assets --strict-if-present
pnpm build:server
pnpm build:static
pnpm test:e2e:static
pnpm test:e2e
pnpm exec playwright test --project=mobile-webkit --grep="PG Arcade mobile" --repeat-each=5 --workers=1
VITE_STATIC_DEPLOY=true pnpm audit:bundle
node scripts/prepare-github-pages.mjs
node scripts/validate-pages-bundle.mjs
```

Os E2E principais usam a variante com API e respostas controladas de teste. Os smoke estáticos usam o artefato real de Pages. A CI mantém os dois caminhos e só publica depois de todas as verificações. Limites: JS por chunk 225 KiB; CSS por arquivo 220 KiB.

Instalação independente do frontend:

```bash
pnpm --filter . --filter @pg/portfolio... install --frozen-lockfile
pnpm build:static
pnpm check:portfolio
```

O build de servidor ocorre antes do build estático na CI: ambos usam `dist/public`, e o último deve ser o artefato que será publicado. Nunca validar Pages contra o build de servidor.

Relatos de sucesso devem indicar o commit e o run verificáveis. Um build local não comprova deploy; falha de instalação de navegador não comprova regressão do produto.
