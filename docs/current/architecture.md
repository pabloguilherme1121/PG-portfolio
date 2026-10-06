# Arquitetura vigente

## Estrutura

- `apps/portfolio`: interface pública, páginas, componentes e adaptadores locais. É estático por padrão e não depende de banco, Express ou runtime tRPC.
- `apps/api`: variante opcional com Express/tRPC, persistência Drizzle e cliente administrativo.
- `packages/contracts`: contratos e schemas compartilhados entre frontend e API.
- `scripts`: build, auditorias, validação do artefato e smoke tests.
- `e2e` e `e2e-static`: fluxos de navegador para desenvolvimento e para o bundle real de produção.

## Resolução e fronteiras

Vite seleciona `@portfolio/bootstrap` e `@/lib/portfolioApi` conforme `VITE_STATIC_DEPLOY`. Na publicação estática, esses aliases resolvem somente para `apps/portfolio`; na variante servidor, resolvem para o cliente em `apps/api/client`.

Os aliases principais são:

- `@` → `apps/portfolio/src`
- `@api` → `apps/api/client`
- `@shared` → `packages/contracts`

O cliente opcional da API ainda reutiliza algumas primitives de UI localizadas em `apps/portfolio/src/components/ui` pelo alias `@`. Por isso essas primitives são dependências compartilhadas entre as duas variantes, mesmo quando não aparecem diretamente na interface pública. A lista deve permanecer mínima e coberta por `repositoryHygiene.test.ts`.

## Builds e execução

- `pnpm build` e `pnpm build:static` produzem `dist/public` com o frontend estático.
- `pnpm build:server` gera a variante com API e `apps/api/dist/index.js`.
- `pnpm start` inicia somente a variante com API já compilada.
- `pnpm dev` usa o frontend estático.
- `pnpm dev:server` inicia a API com Vite integrado.

No GitHub Pages, o base path é `/PG-portfolio/`. O artefato público é preparado e validado antes do deploy.

## PWA

O site é instalável, mas usa estratégia deliberadamente `network-only`. O service worker atual remove caches legados e não promete operação offline. Uma estratégia offline só deve voltar com versionamento explícito de cache e cobertura E2E dedicada.

## CI

`.github/workflows/pages.yml` é o pipeline do site público:

1. `static-isolation` instala apenas raiz + portfolio + dependências necessárias, faz typecheck/build do frontend e confirma que dependências da API não vazaram para o bundle estático.
2. `quality` executa audit, inventário de mídia, auditoria de source, lint, TypeScript, unitários do portfolio, build estático, Playwright em Chromium/Firefox/WebKit, regressões específicas de WebKit mobile, bundle budget e validação das rotas.
3. `deploy` publica apenas depois de `quality` e `static-isolation` aprovados.

`.github/workflows/api.yml` valida a variante opcional separadamente quando arquivos da API, contratos ou infraestrutura relacionada mudam. Ele executa install congelado, audit, lint, TypeScript, unitários, build servidor e smoke HTTP.

## PG Arcade

O PG Arcade é um projeto dedicado e externo ao portfólio. O portfólio apenas apresenta e direciona para o produto publicado; motores de jogos não devem voltar a ser duplicados neste repositório.

## Documentação

`README.md` descreve a proposta pública. Este arquivo registra a arquitetura vigente. Relatórios e auditorias históricas devem permanecer em `docs/archive` ou ser tratados como referência, não como especificação atual. Decisões visuais continuam em `DESIGN.md`.
