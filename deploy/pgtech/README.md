# PG Tech: implantação Vercel do hub

Configuração canônica do domínio https://pgtech-pi.vercel.app/. O conteúdo público está em `apps/portfolio/public/lab/index.html`. Esta pasta não é publicada automaticamente pelo GitHub Pages e o merge não faz deploy no Vercel.

## Pacote estático

Enviar somente os arquivos da revisão aprovada à raiz do deployment: `index.html` (fonte `apps/portfolio/public/lab/index.html`), `brand/pg-bot/mascot.webp` (fonte `apps/portfolio/public/brand/pg-bot/mascot.webp`), `vercel.json` (este diretório), `robots.txt` e `sitemap.xml` (ambos neste diretório), além de `favicon.svg` somente quando verificado. Os arquivos `robots.txt` e `sitemap.xml` devem estar na **raiz pública**, não dentro de `/deploy/pgtech/`. Não publicar scripts internos, segredos nem `apps/api`.

## Evidências e segurança

Em 26/10/2026, SiteTriage observou HTTP 200 sem `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options` e `Referrer-Policy` no hub anterior. O deployment de produção `dpl_G4t4iTFYQqbWJHxFC1zL5CkStWZW` foi publicado com a configuração agora versionada e confirmado `READY`. A resposta pública posteriormente retornou HTTP 200, HSTS, CSP `default-src 'none'; script-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:` e diretivas complementares, `nosniff`, `DENY`, `no-referrer`. Firecrawl confirmou cinco links PG Lab e a assinatura do PG Bot; WebP 200 com MIME correto.

A CSP é válida para este HTML **sem JavaScript**. Caso o hub precise de scripts no futuro, revisar a política, os testes e a prévia autenticada em vez de enfraquecer genericamente `script-src`. Evitar bloquear scripts utilizados por outras ferramentas: esta configuração é exclusiva do hub, não dos outros apps.

## Controle antes do próximo deploy

```sh
node --test scripts/check-pgtech-vercel-headers.test.mjs
node --test scripts/check-pgtech-seo.test.mjs
node --test scripts/check-pgtech-parity.test.mjs
node scripts/check-pgtech-parity.mjs
```

Revisar navegação com teclado e leitores de tela, visual 320/390 px, ancoragem, contato sem envio real, links, console, HTTP e imagens. Nenhum `READY` isolado certifica esses fluxos. Não desabilitar proteção SSO das prévias para facilitar QA. Versão anterior disponível para rollback: `dpl_5YcpvboygpY3psjEmdcZoYkTvxNX`.

O fluxo de manutenção está registrado na issue [#279](https://github.com/pabloguilherme1121/PG-portfolio/issues/279).

## Descoberta e metadados

O hub possui metadados Open Graph factuais, endereço canônico e um bloco inerte JSON-LD `WebSite` com editor pessoa física. A política CSP continua bloqueando JavaScript executável. O `sitemap.xml` declara apenas a página principal; não anunciar rotas ou releases inexistentes. Um deploy Vercel **não ocorre** ao integrar mudanças no repositório: empacotar, validar preview sem alterar SSO, publicar apenas com aceite e verificar HTTP 200 de `/robots.txt` e `/sitemap.xml`, além de `/brand/pg-bot/mascot.webp`. Manter referência do deployment anterior para rollback.
