# Implantação e operação

## Instalação

Use a versão de Node e pnpm compatível com o projeto e instale as dependências a partir do lockfile:

```bash
pnpm install --frozen-lockfile
```

## Variáveis de ambiente

As variáveis de backend devem ser fornecidas pelo ambiente de implantação e nunca publicadas no frontend. A integração SimilarWeb utiliza a infraestrutura de Data API já disponível no template e depende de `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` no servidor.

Variáveis com prefixo `VITE_` são públicas por natureza. Use-as apenas para configurações que podem ser expostas ao navegador, como identificadores de analytics de frontend.

## Scripts de operação

| Comando | Finalidade |
|---|---|
| `pnpm dev` | Desenvolvimento local |
| `pnpm check` | Verificação TypeScript |
| `pnpm test` | Testes unitários |
| `pnpm test:e2e` | Testes end-to-end |
| `pnpm build` | Build de frontend e backend |
| `pnpm start` | Execução do build de produção |
| `pnpm db:push` | Geração e aplicação de migrations quando necessário |

## Rotas relevantes

| Rota | Jornada | Acesso |
|---|---|---|
| `/` | Portfólio público | Público |
| `/agenda` | Gestão de disponibilidade | Administrador |
| `/favoritos` | Curadoria e exportação | Administrador |
| `/curadoria` | Alias da curadoria | Administrador |
| `/analytics` | Dashboard SimilarWeb | Administrador |

## Checklist de release

Antes de publicar, execute `pnpm check`, `pnpm test`, `pnpm build` e, quando houver alterações de navegação ou interação, `pnpm test:e2e`. Verifique também as auditorias específicas em `scripts/audit/`, `scripts/validate/` e `scripts/performance/`.

O build pode emitir avisos sobre placeholders de analytics do template quando as variáveis `VITE_ANALYTICS_ENDPOINT` e `VITE_ANALYTICS_WEBSITE_ID` não estão definidas. Esses avisos são independentes do módulo SimilarWeb, que usa chamadas server-side.
