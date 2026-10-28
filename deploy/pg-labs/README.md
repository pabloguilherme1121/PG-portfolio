# Pacotes independentes dos laboratórios PG Tech

A Vercel publicou **PG QA Lab**, **PG Creator Kit**, **PG Sprint** e **PG Budget** sem o arquivo referenciado como `../../brand/pg-bot/mascot.webp`. Auditoria externa em 26/10/2026 confirmou HTTP 404 em `/brand/pg-bot/mascot.webp` nos quatro domínios. HTML e demais ferramentas continuam disponíveis.

A preparação versionada corrige apenas o pacote estático e cabeçalhos HTTP. Mantém exatamente os bytes do HTML, do CSS quando houver e do mascote WebP original, além do `vercel.json` em todas as distribuições.

## Execução manual

```sh
pnpm test:pg-labs-deploy
node deploy/pg-labs/prepare.mjs qa
node deploy/pg-labs/prepare.mjs creator
node deploy/pg-labs/prepare.mjs sprint
node deploy/pg-labs/prepare.mjs budget
```

As saídas são, respectivamente, `dist/pg-qa`, `dist/pg-creator`, `dist/pg-sprint` e `dist/pg-budget`. O script recusa sobrescrever diretórios já existentes; execute em uma árvore de trabalho limpa para regenerar.

Cada saída deve ser enviada como **raiz do pacote estático** ao respectivo projeto Vercel existente, sem pasta `src/src` adicional. QA e Creator incluem `visual.css`; Sprint e Budget usam estilos no próprio HTML.

Cabeçalhos utilizados: CSP restrita somente a `frame-ancestors 'none'`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` e `Referrer-Policy: strict-origin-when-cross-origin`. Não aplicar CSP `script-src 'none'`, pois os aplicativos usam JavaScript embutido.

**Antes de publicar:** fazer preview de cada ferramenta, confirmar 200/MIME de HTML, CSS quando existente e WebP, verificações em 320/390 px e desktop, console e toque/teclado, persistência local, exportação/importação, sem usar dados reais. Não desativar SSO, não promover apenas com o estado READY. Nada neste repositório atualiza automaticamente os domínios Vercel.

Esta PR é empilhada sobre a correção do Shotlist (PR #300), para evitar conflito com o empacotador já em revisão. Após a integração da #300, verificar e atualizar a base desta PR antes de fazer merge.
