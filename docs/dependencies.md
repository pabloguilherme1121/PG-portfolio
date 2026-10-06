# Dependências atuais

Este repositório usa um workspace pnpm com três responsabilidades separadas: tooling na raiz, frontend público em `apps/portfolio` e variante opcional com servidor em `apps/api`. Uma dependência só deve ser removida depois de confirmar que não existe consumidor em código, configuração, build ou testes.

## Responsabilidade por workspace

| Local | Papel |
|---|---|
| `package.json` | TypeScript, Vite, Vitest, Playwright, Tailwind e tooling compartilhado |
| `apps/portfolio/package.json` | React público, primitives Radix realmente usadas, navegação e recursos da experiência |
| `apps/api/package.json` | Express/tRPC, banco, autenticação e cliente administrativo |
| `packages/contracts` | schemas e contratos compartilhados, sem runtime duplicado |

## Dependências que podem parecer opcionais, mas têm consumidores

- `pdf-lib`: carregado dinamicamente por `features/portfolio/utils/exportFavorites.ts` para exportar favoritos em PDF.
- `jszip`: usado pelo painel administrativo `FavoritesManagement.tsx` para exportações compactadas.
- `axios`, `cookie` e `jose`: usados pelo SDK/autenticação da API.
- `superjson`: transformer do tRPC no servidor e no bootstrap do cliente administrativo.
- `nanoid`: usado pelo runtime Vite da variante com servidor.
- `dotenv`: carregado no entrypoint da API.
- `wouter`: permanece com patch versionado em `patches/wouter@3.7.1.patch`; remover o patch ou alterar a versão exige validar navegação nas duas variantes.

Os overrides de `pnpm` na raiz fazem parte do lockfile e da política de segurança atual. Não devem ser eliminados apenas por parecerem transitivos: primeiro confirme a árvore resolvida e a versão final instalada.

## Regra de limpeza

Para remover ou atualizar uma dependência:

1. localizar imports e consumidores indiretos;
2. alterar manifest e `pnpm-lock.yaml` juntos;
3. executar auditoria, lint, TypeScript e testes dos workspaces afetados;
4. validar `build:static` e, quando a API for tocada, `build:server` + smoke HTTP;
5. manter a alteração separada de refatorações funcionais quando isso facilitar identificar regressões.

A CI usa `pnpm install --frozen-lockfile`; inconsistência entre manifest e lockfile deve falhar antes do deploy.
