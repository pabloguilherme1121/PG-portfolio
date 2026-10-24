# PG Shotlist — laboratório de prévia estática (24/10/2026)

Status: **prévia isolada em branch, NÃO PUBLICADA**. A página vive em `apps/portfolio/public/lab/shotlist/index.html`. Somente depois de aprovar e integrar esta PR e certificar o deploy o endereço **esperado** será `https://pabloguilherme1121.github.io/PG-portfolio/lab/shotlist/`. Não divulgar a URL como funcional antes de conferir HTTP 200 e comportamento no HEAD final.

## O que está nesta PR
- Página HTML única, CSS e JavaScript inline, sem chamadas a API, serviços pagos, telemetria, imagens remotas ou bibliotecas de runtime.
- Cria, renomeia e organiza captações; adiciona, edita, ordena, filtra e marca cenas captadas.
- Guarda rascunhos em `localStorage` exclusivo da ferramenta (`pg-shotlist-project-v1`); exporta/importa backup JSON com validação; exporta CSV sanitizado.
- Sem link de destaque na home por enquanto; sem alterar o React, motor de jogos, API ou shell bundle. Esta prévia **não é um PWA instalado**; o pacote completo com manifest/service worker/ícones está fora deste repositório, na entrega ZIP v0.1 e deverá ir para repositório próprio assim que puder ser criado.

## Evidência local
- `npm run check` do pacote original: **6/6** testes unitários e sintaxe JS aprovados.
- Smoke Chromium com DOM injetado (navegação do navegador para `localhost` bloqueada pelo ambiente): 320/390/768/1280 px, criação/edição/captura/filtros/exclusão/JSON/CSV, sem overflow horizontal e sem erros JavaScript. **Isso não equivale a teste HTTPS da prévia real nem Android físico.**

## Condições de merge
- [ ] Verificar `quality` e `static-isolation` verdes no HEAD da PR.
- [ ] Confirmar que `dist/public/lab/shotlist/index.html` foi copiado pelo Vite e que a URL da PR não substitui index do portfólio.
- [ ] Conferir navegação em Chromium, Firefox, WebKit e em dispositivo Android 320/390.
- [ ] Conferir salvamento após recarga, importação JSON e downloads em hospedagem HTTPS.
- [ ] Verificar CSP, foco de teclado, contraste, zoom e uso por leitor de tela.
- [ ] Após merge, confirmar deploy verde no HEAD da `main` e URL pública real.
- [ ] Para publicação como PWA independente, criar repositório próprio e certificar service worker, instalação e atualização offline separadamente.

## Política de custo
Não acrescentar dependências pagas, telemetria, API, banco externo ou serviços de hospedagem novos. GitHub Pages do portfólio público já está configurado; conferir limites e faturamento antes de alterações administrativas. Nenhuma chamada externa é feita pela página.

Coordenação: [#280](https://github.com/pabloguilherme1121/PG-portfolio/issues/280), [#279](https://github.com/pabloguilherme1121/PG-portfolio/issues/279).
