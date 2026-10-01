# Auditoria de performance mobile — sem redesign

## Escopo

Esta auditoria investigou a transferência inicial observada no viewport mobile sem modificar lightbox, modal, navegação, identidade visual, interações, swipe, pinch, zoom ou barra de contato. A medição foi feita no domínio `pabloguilh-jhcmnkrj.manus.space`, usando Chromium headless, contexto novo por viewport e emulação de rede 4G com 150 ms de latência, 1,6 Mbps de download e 750 Kbps de upload.

A leitura do preview local foi descartada como referência principal porque o servidor de desenvolvimento/preview pode incluir respostas e módulos que não representam a entrega publicada. O build local foi usado apenas para inspeção técnica dos chunks.

## Resultado publicado observado antes da otimização

| Viewport | Requests | Transferência observada | LCP | INP observado | CLS | Overflow |
|---|---:|---:|---:|---:|---:|---|
| 320 × 568 | 20 | 236.497 B | 9.032 ms | sem amostra | 0,000 | Não |
| 390 × 844 | 20 | 236.551 B | 8.556 ms | 56 ms | 0,050 | Não |
| 414 × 896 | 23 | 236.974 B | 11.448 ms | 4.344 ms | 0,001 | Não |
| 768 × 900 | 27 | 236.971 B | 7.064 ms | 120 ms | 0,039 | Não |
| 1280 × 720 | 18 | 236.472 B | 4.644 ms | sem amostra | 0,000 | Não |

Os valores de `transferSize` são os observados pela Resource Timing API e devem ser interpretados como uma medição de laboratório, não como um relatório de usuários reais. CDN, cache, respostas sem `Content-Length` e recursos cross-origin podem aparecer com tamanho zero ou sub-representado. A medição não confirma que o site entregue literalmente 236 KB em todos os cenários; confirma apenas o que o navegador registrou nesta execução.

## Recursos antes da primeira interação

| Recurso | Classificação | Decisão aplicada |
|---|---|---|
| `index-*.js`, aproximadamente 91 KB observados | Runtime e bootstrap necessários | Preservado |
| `Home-*.js`, aproximadamente 52 KB observados | Experiência principal e interação | Preservado |
| Vendor de dados, aproximadamente 24 KB | React Query/tRPC e contratos | Preservado |
| Vendor UI, aproximadamente 17 KB | Componentes e acessibilidade | Preservado |
| Vendor React, aproximadamente 4,5 KB | Runtime React | Preservado |
| `dialog-*.js`, aproximadamente 9 KB | Base de diálogos e modais | Preservado |
| CSS principal, aproximadamente 32 KB | Primeiro paint e estabilidade | Preservado |
| Fonte, aproximadamente 1,2 KB observado | Identidade tipográfica | Preservado e monitorado |
| `InstagramRepertoire-*.js`, aproximadamente 3,8 KB | Seção social abaixo da dobra | Adiado por proximidade |
| `availability-*.js`, aproximadamente 0,8 KB | Módulo do calendário | Preservado e acionado por proximidade |
| `availability.listBlocked`, aproximadamente 333 B | Consulta abaixo da dobra | Adiada por proximidade |
| `instagramFeed.status`, aproximadamente 463 B | Estado do feed social | Adiado por proximidade |
| PDF-lib | Exportação PDF após interação | Já dinâmico; preservado |
| JSZip | Curadoria/exportação específica | Fora do primeiro viewport |
| Recharts | Módulo administrativo não usado na Home | Fora do primeiro viewport |
| Favoritos/curadoria | Rotas administrativas separadas | Preservado fora da Home |
| Vídeos e posters | Player e mídia dependentes de viewport/interação | Não antecipados |

## Alteração aplicada

Foi adicionado um `IntersectionObserver` isolado, com margem antecipada de 720 px, para iniciar o carregamento quando o usuário se aproxima da seção. A consulta de disponibilidade deixou de executar no primeiro carregamento e passa a ser habilitada ao aproximar-se do calendário. O módulo social e o estado do feed também permanecem em fallback acessível até a aproximação da seção Social.

A Home, o primeiro projeto, o SEO, a navegação, o lightbox, o modal audiovisual, os gestos, o zoom, os favoritos, o compartilhamento, o calendário visual e a barra de contato foram preservados. O teste E2E confirma que as consultas não são iniciadas antes da aproximação e são iniciadas após o scroll até as respectivas seções.

## Diagnóstico da transferência de 4,82 MB

A medição publicada anterior não reproduziu a transferência inicial de 4,82 MB. No build local, a transferência variou aproximadamente de 0,52 MiB a 2,20 MiB conforme viewport e imagens observadas; no domínio publicado, a Resource Timing API registrou aproximadamente 0,226 MiB. A diferença sugere cache frio, mídia carregada após o primeiro viewport, servidor de desenvolvimento, pré-carregamento ou uma medição que somou recursos de uma navegação mais longa.

O maior custo estrutural verificável é JavaScript publicado, não PDF-lib, JSZip, Recharts ou a curadoria administrativa. Por isso, não foi aplicada redução agressiva no bundle principal: o risco para lightbox e modais seria desproporcional ao ganho provável.

## Comparação antes/depois em 390 × 844

A medição pós-publicação foi feita com a mesma emulação 4G e janela inicial de 500 ms, antes de qualquer scroll. Os números abaixo continuam sujeitos à variabilidade de CDN, rede e laboratório.

| Indicador | Antes | Depois | Resultado observado |
|---|---:|---:|---|
| Transferência inicial | 236.551 B | 232.596 B | redução de 3.955 B |
| Requests iniciais | 20 | 12 | 8 requests a menos |
| JS inicial observado | 202.620 B | 198.988 B | redução de 3.632 B |
| CSS inicial observado | 32.395 B | 32.405 B | estável |
| Requests de disponibilidade/feed antes do scroll | presentes na janela anterior | 0 | adiados |
| LCP de laboratório | 8.556 ms | 6.264 ms | melhora observada, não conclusiva |
| INP inicial | 56 ms | sem amostra | medir após interação |
| CLS | 0,050 | 0,000 | melhora observada |
| Overflow horizontal | Não | Não | preservado |

Na matriz pós-publicação, o carregamento inicial também permaneceu sem overflow em 320 × 568, 414 × 896, 768 × 900 e 1280 × 720. Antes de qualquer scroll, não foram observadas requests de `availability.listBlocked` ou `instagramFeed.status` nos cinco viewports.

## Conclusão crítica

A otimização produziu o ganho correto para este escopo: menos requests e menos trabalho de rede antes da primeira interação, sem reduzir conteúdo crítico nem alterar a experiência visual. A redução em bytes é pequena porque as consultas adiadas eram leves; o benefício principal é evitar processamento e dependências abaixo da dobra durante o primeiro viewport.

A margem antecipada de 720 px reduz o risco de o usuário chegar à seção antes de o conteúdo estar pronto. O fallback social permanece acessível, e a disponibilidade continua protegida por estados de erro já existentes. Não foram aplicadas otimizações de imagens críticas, CSS global ou bundle principal porque o risco de regressão seria maior que o ganho medido.

## Validação executada

A validação incluiu `pnpm check` aprovado, `pnpm test` com 24 testes aprovados, `pnpm build` aprovado, teste E2E específico de adiamento aprovado e Playwright completo com 21 testes públicos aprovados e 2 cenários autenticados ignorados por ausência de sessão. A medição pós-publicação cobriu 320 × 568, 390 × 844, 414 × 896, 768 × 900 e 1280 × 720 sob 4G simulado. Os scripts de medição foram removidos da entrega.
