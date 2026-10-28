# PG Tech — paridade dos hubs publicados

## Objetivo

Verificar se a página pública da Vercel (`https://pgtech-pi.vercel.app/`) e o espelho versionado do GitHub Pages (`https://pabloguilherme1121.github.io/PG-portfolio/lab/`) mantêm as funções básicas de navegação, sem confundir **HTTP 200** com **mesma versão publicada**.

## Executar sob demanda

A partir da raiz do repositório, com Node.js 22+:

```sh
node --test scripts/check-pgtech-parity.test.mjs
node scripts/check-pgtech-parity.mjs
```

O script faz dois GET HTTPS de leitura, com timeout de 8 segundos cada, e não envia cookies, formulários ou dados dos usuários. Retorna JSON com resultado para cada host e `exit code 1` quando encontra diferença ou indisponibilidade. Não executa deploy, não armazena o HTML e não roda automaticamente no CI.

O contrato checa que **ambas** as versões entregam HTML 200, incluem o atalho para pular ao conteúdo, exibem a assinatura `data-pg-bot="signature"` e contêm as URLs públicas de Shotlist, QA Lab, Creator Kit, Sprint e Budget. O teste unitário usa respostas simuladas e inclui casos de divergência, links faltantes, falha de rede e página que não retorna HTML.

## Evidência que motivou este gate

Na inspeção pública de 25/10/2026, Firecrawl retornou HTTP 200 para os dois hubs. A página `PG-portfolio/lab/` apresentava a assinatura PG Bot e os cinco links de laboratório; a URL principal da Vercel continha os links, mas **não apresentava a assinatura PG Bot no HTML**. O repositório já versiona a assinatura em `apps/portfolio/public/lab/index.html` e a produção da Vercel é um projeto independente. Por isso o sucesso do workflow do GitHub Pages não certifica a versão Vercel.

## Critério para corrigir o desvio

1. Inspecionar o projeto `pgtech` e sua configuração de origem na conta Vercel correta. Não supor que o merge no repositório publica automaticamente lá.
2. Preparar um preview usando o HTML atual **junto com todos os arquivos locais que ele referenciar**; conferir se CSS, imagens, links, âncoras, assinatura e contato funcionam. Não substituir a produção com um único HTML se faltarem assets.
3. Validar a versão de preview em 320/390 px, navegação por teclado, abertura das cinco ferramentas, console sem erros e política de proteção correta.
4. Somente depois de teste e confirmação da revisão do deploy, publicar/promover para o domínio de produção e executar novamente o verificador; registrar commit/fonte e URL do deploy no acompanhamento [#279](https://github.com/pabloguilherme1121/PG-portfolio/issues/279).

A checagem não valida layout visual, rotas completas, dados persistidos, acessibilidade integral, Core Web Vitals ou Android físico. Conservar esses aceites separados. Um erro de rede temporário não é evidência de regressão: repetir no navegador e consultar logs do provedor antes de mudar produção. Nenhum recurso pago deve ser habilitado por este procedimento.
