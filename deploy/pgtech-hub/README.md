# PG Tech Hub: Vercel sem configuração esquecida

Esta pasta contém a configuração usada no deploy estático e independente do hub público `pgtech-pi.vercel.app`. Ela não configura os demais apps PG Lab, nem altera o deploy GitHub Pages.

## Origem do deployment

Monte a raiz do deployment com arquivos **da mesma revisão certificada**:

| Destino na Vercel | Origem no repositório |
| --- | --- |
| `index.html` | `apps/portfolio/public/lab/index.html` |
| `brand/pg-bot/mascot.webp` | `apps/portfolio/public/brand/pg-bot/mascot.webp` |
| `vercel.json` | `deploy/pgtech-hub/vercel.json` |
| `robots.txt` | Política de indexação do domínio PG Tech aprovada separadamente; não copiar a do portfólio sem revisão |

Não publicar `node_modules`, segredos, artefatos de teste ou pastas `apps/api` no projeto Vercel. Não assumir que um merge no PG-portfolio publica a instância Vercel automaticamente.

## Verificação

```sh
node --test scripts/check-pgtech-vercel-headers.test.mjs
node --test scripts/check-pgtech-parity.test.mjs
node scripts/check-pgtech-parity.mjs
```

Após publicar, verificar **na resposta HTTP real** `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, além de HTTP 200 no HTML, `image/webp` do PG Bot e links das cinco ferramentas. Conferir teclado, 320/390 px e Android físico separadamente.

Em 26/10/2026, SiteTriage detectou ausência de quatro cabeçalhos no hub antigo. Nova produção Vercel `dpl_G4t4iTFYQqbWJHxFC1zL5CkStWZW` foi confirmada `READY`, com HTTP 200 e os cabeçalhos acima presentes. Firecrawl confirmou PG Bot e cinco links; os testes móveis físicos continuam pendentes.

A política CSP pressupõe **site sem JavaScript**. Se scripts forem introduzidos, atualizar CSP e testes antes de publicar. Não adicionar `unsafe-inline` em `script-src` para mascarar quebra.

Histórico anterior para reversão: `dpl_5YcpvboygpY3psjEmdcZoYkTvxNX` (antes dos cabeçalhos). Reverter somente em caso de regressão comprovada e registrar a decisão.
