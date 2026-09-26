# Implantação e operação

## Instalação

```bash
corepack enable
pnpm install --frozen-lockfile
```

## Variáveis

Variáveis de backend devem permanecer no ambiente do servidor. Variáveis com prefixo `VITE_` são públicas e devem conter apenas configurações seguras para o navegador.

O GitHub Pages usa:

- `VITE_DEPLOY_TARGET=github-pages`
- `VITE_STATIC_DEPLOY=true`

Nessa modalidade, o briefing é preparado para envio manual pelo WhatsApp; nenhum dado do formulário é persistido automaticamente.

## Comandos

| Comando | Finalidade |
| --- | --- |
| `pnpm dev` | desenvolvimento local |
| `pnpm audit:assets` | validação do inventário público de mídia |
| `pnpm check` | TypeScript |
| `pnpm test` | testes unitários |
| `pnpm test:e2e` | testes de navegador |
| `pnpm build` | build de frontend e backend |
| `pnpm start` | execução do build com servidor |

## Rotas públicas

| Rota | Uso |
| --- | --- |
| `/` | portfólio |
| `/privacidade` | informações de privacidade |
| `/404` | fallback de rota |

## Pipeline do GitHub Pages

O workflow `.github/workflows/pages.yml` executa, nesta ordem:

1. instalação com lockfile;
2. auditoria de assets;
3. typecheck;
4. testes unitários;
5. testes Playwright;
6. build estático;
7. preparação do bundle;
8. validação das rotas;
9. deploy.

O deploy só acontece depois de todas as etapas de qualidade passarem.
