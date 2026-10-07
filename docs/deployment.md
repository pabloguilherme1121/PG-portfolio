# Implantação e operação

## Requisitos

O projeto usa Node.js 22 e pnpm 10.34.5 via Corepack.

```bash
corepack enable
pnpm install --frozen-lockfile
```

## Portfólio estático

O destino público principal é GitHub Pages, com base `/PG-portfolio/`. A variante estática não depende de Express, banco ou tRPC em runtime.

```bash
pnpm dev
pnpm build:static
node scripts/prepare-github-pages.mjs
```

`pnpm build` é um alias para o build estático. O site permanece instalável como PWA, mas a estratégia vigente é `network-only`; o service worker atual serve para retirar caches/workers legados, não para prometer uso offline.

O workflow `.github/workflows/pages.yml` é a referência de publicação. Antes do deploy ele valida isolamento da API, dependências, mídia, source audit, lint, TypeScript, unitários, build real, Playwright cross-browser/mobile, budget de bundle e rotas públicas.

## Variante opcional com API

A variante servidor é independente do Pages:

```bash
pnpm dev:server
pnpm build:server
pnpm start
```

`pnpm start` inicia o artefato já compilado em `apps/api/dist/index.js`; portanto, em produção, execute o build servidor antes do start.

As rotas administrativas só existem nessa variante:

| Rota | Função |
|---|---|
| `/agenda` | gestão de disponibilidade |
| `/favoritos` | curadoria, metadados e exportações |
| `/curadoria` | alias do painel de favoritos |

O workflow `.github/workflows/api.yml` roda somente quando paths da API, contratos ou infraestrutura relacionada mudam. Ele valida audit, lint, TypeScript, unitários, build servidor e smoke HTTP.

## Variáveis de ambiente

Valores de backend devem ficar no secret manager do ambiente e nunca no bundle público. O arquivo `env.example` documenta os nomes esperados:

- `DATABASE_URL`
- `JWT_SECRET`
- `VITE_APP_ID`
- `OAUTH_SERVER_URL`
- `VITE_OAUTH_PORTAL_URL`
- `OWNER_OPEN_ID`
- `NOTIFICATION_SERVICE_URL`
- `NOTIFICATION_SERVICE_API_KEY`
- `VITE_ANALYTICS_ENDPOINT`
- `VITE_ANALYTICS_WEBSITE_ID`

Use `NOTIFICATION_SERVICE_URL` e `NOTIFICATION_SERVICE_API_KEY` como nomes preferenciais para o serviço backend de notificação ao proprietário. Para compatibilidade com ambientes existentes, `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` continuam aceitas como fallback legado quando as variáveis neutras não estiverem definidas. Variáveis com prefixo `VITE_` podem chegar ao cliente e não devem conter segredos.

## Banco

`pnpm db:push` gera e aplica migrations usando `drizzle.config.ts`. O comando exige `DATABASE_URL` válida e não faz parte do deploy estático.

## Critério de release

A evidência autoritativa é a CI do SHA que será publicado. Para a `main`, o deploy do Pages só deve ocorrer depois de `quality` e `static-isolation` verdes. Alterações da variante servidor devem ter também o job `api` verde quando o workflow for acionado.
