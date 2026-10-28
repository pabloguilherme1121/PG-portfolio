# PG Shotlist: pacote estático independente

O PG Shotlist publicado em https://pg-shotlist-lab.vercel.app/ apontava para `/brand/pg-bot/mascot.webp`, mas o arquivo retornava HTTP 404. O HTML público de origem está em `apps/portfolio/public/lab/shotlist/index.html`.

O script `prepare.mjs` monta `dist/pg-shotlist/` com **apenas** `index.html`, `visual.css`, `brand/pg-bot/mascot.webp` e `vercel.json`. O HTML, o CSS e o mascote são copiados sem transformação. A publicação deve usar esses arquivos na raiz do upload da Vercel. Uma pasta extra `src/src` pode causar 404.

## Verificação

```sh
pnpm test:shotlist-deploy
node deploy/pg-shotlist/prepare.mjs
```

A preparação **recusa sobrescrever** `dist/pg-shotlist/` quando já existe. Para repetir, use um diretório de trabalho limpo; não apague arquivos de produção nem altere o site ao executar o teste. `node --test` exercita também a cópia exata dos arquivos reais e o cenário do mascote ausente.

A configuração Vercel protege com `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` e `Content-Security-Policy: frame-ancestors 'none'`. Esta CSP não bloqueia os scripts e estilos embutidos do Shotlist. **Não reutilize** a CSP estrita do hub PG Tech neste aplicativo.

## Evidência de preview, sem promoção

O preview `dpl_GE7LmUWQik58tFDyt81wb5P5ZiLd` está em https://pg-shotlist-ovsibkm5e-pabloguilherme1121-4857.vercel.app/ e retornou HTTP 200 para HTML, CSS e WebP; os quatro cabeçalhos foram verificados nas respostas via Vercel. Ele está sem alias de produção.

Antes de publicar no domínio `pg-shotlist-lab.vercel.app`, verificar em navegador autenticado 320/390 px e desktop: criar/editar/excluir cenas, persistência local, importar e exportar JSON, exportar CSV, foco e teclado, overflow, console/rede, imagem e cabeçalhos. Não enviar dados reais ou desativar SSO. `READY` e HTTP 200 não substituem essa validação.

Coordenação: https://github.com/pabloguilherme1121/PG-portfolio/issues/279.
