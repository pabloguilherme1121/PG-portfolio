# PG Tech: cabeçalhos HTTP no deploy Vercel

Este diretório mantém versionada a configuração comprovada no preview do hub PG Tech. O arquivo `vercel.json` **não é utilizado automaticamente pelo GitHub Pages** e não altera o projeto Vercel até ser incluído explicitamente no pacote do próximo deploy.

## Contexto

- Origem do HTML do hub: `apps/portfolio/public/lab/index.html`.
- Mascote: `apps/portfolio/public/brand/pg-bot/mascot.webp`.
- Vercel: projeto existente `pgtech`; **não criar um novo projeto, não alterar o domínio de produção sem QA**.
- Preview de segurança: `dpl_14HkLvJtEaxJMirG5pDN7foSNJM6`, https://pgtech-kolm7tqa4-pabloguilherme1121-4857.vercel.app/
- Fonte de conteúdo verificada: `main` `7260b2324b5323e6fc4b12531ed3f9c06d573d9b`.

O preview retornou **HTTP 200** em `/`, `/brand/pg-bot/mascot.webp`, `/favicon.svg` e `/robots.txt`. Em todos esses endereços, o conector Vercel confirmou:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: frame-ancestors 'none'`

A CSP restringe apenas quem pode incorporar o site em um frame. **Não adicionar** `default-src`, `script-src` ou `style-src` sem testes reais, porque o HTML usa estilo embutido e a plataforma pode incluir scripts adicionais. Não remover a proteção SSO dos previews para facilitar testes.

## Publicação e aceite

O projeto Vercel usa um pacote de **cinco arquivos na raiz do envio**, não `src/src`:

1. `index.html` obtido de `apps/portfolio/public/lab/index.html`;
2. `brand/pg-bot/mascot.webp` obtido de `apps/portfolio/public/brand/pg-bot/mascot.webp`;
3. `favicon.svg` correspondente à revisão de produção aprovada;
4. `robots.txt` correspondente à revisão de produção aprovada;
5. `vercel.json` deste diretório.

O primeiro envio experimental com a pasta extra `src/src` retornou 404; não reutilizar. Manter `target` omitido para preview e não associar aliases de produção durante QA.

Critérios antes de promover: conferir no navegador autorizado com SSO em 320 px, 390 px e desktop; header e links; foco/Tab/Enter e âncoras; ausência de overflow e erros de console; contatos sem enviar mensagem; imagem do PG Bot carregada; status e MIME dos quatro recursos; as quatro proteções HTTP presentes; comparar HTML com fonte do SHA. Não confundir status `READY` com aprovação funcional.

A produção `pgtech-pi.vercel.app` ainda não foi atualizada durante esta tarefa. Para rastreabilidade, registrar o ID do deploy, SHA da fonte e resultados na issue #279 antes de qualquer promoção.

Evidências: https://github.com/pabloguilherme1121/PG-portfolio/issues/279
