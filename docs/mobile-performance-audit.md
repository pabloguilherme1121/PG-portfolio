# Auditoria de performance mobile — sem redesign

## Escopo

Esta auditoria foi executada com o objetivo exclusivo de investigar a transferência inicial observada no viewport mobile, sem modificar lightbox, modal, navegação, identidade visual, interações, swipe, pinch, zoom ou barra de contato. A medição publicada foi feita no domínio `pabloguilh-jhcmnkrj.manus.space`, usando Chromium headless, contexto novo por viewport e emulação de rede 4G com 150 ms de latência, 1,6 Mbps de download e 750 Kbps de upload.

A leitura do preview local foi descartada como referência principal porque o servidor de desenvolvimento/preview pode incluir respostas e módulos de desenvolvimento que não representam a entrega publicada. O build local também foi medido apenas como comparação técnica, não como tráfego real de produção.

## Resultado publicado observado

| Viewport | Requests | Transferência observada | LCP | INP observado | CLS | Overflow |
|---|---:|---:|---:|---:|---:|---|
| 320 × 568 | 20 | 236.497 B | 9.032 ms | sem amostra | 0,000 | Não |
| 390 × 844 | 20 | 236.551 B | 8.556 ms | 56 ms | 0,050 | Não |
| 414 × 896 | 23 | 236.974 B | 11.448 ms | 4.344 ms | 0,001 | Não |
| 768 × 900 | 27 | 236.971 B | 7.064 ms | 120 ms | 0,039 | Não |
| 1280 × 720 | 18 | 236.472 B | 4.644 ms | sem amostra | 0,000 | Não |

Os valores de `transferSize` são os observados pela Resource Timing API e devem ser interpretados como uma medição de laboratório, não como um relatório de usuários reais. Em particular, recursos servidos por CDN, respostas sem `Content-Length`, cache e recursos cross-origin podem aparecer com tamanho zero ou sub-representado. Por isso, a medição não confirma que o site entregue literalmente 236 KB em todos os cenários; ela confirma que o navegador não registrou 4,82 MB de transferência inicial nesta execução publicada.

## Recursos antes da primeira interação

| Recurso | Observação | Classificação | Decisão |
|---|---|---|---|
| `index-*.js`, aproximadamente 91 KB observados | Runtime principal e bootstrap da aplicação | Necessário para primeiro viewport e navegação | Preservar |
| `Home-*.js`, aproximadamente 52 KB observados | Experiência principal da página e suas interações | Necessário para primeiro viewport e interação principal | Preservar |
| Vendor de dados, aproximadamente 24 KB | React Query/tRPC e contratos de dados | Necessário para inicialização da aplicação | Preservar |
| Vendor UI, aproximadamente 17 KB | Componentes e primitivas de interface | Necessário para renderização e acessibilidade | Preservar |
| Vendor React, aproximadamente 4,5 KB | Runtime React publicado | Necessário | Preservar |
| `dialog-*.js`, aproximadamente 9 KB | Diálogos e base de modais | Necessário para interações principais | Preservar |
| CSS principal, aproximadamente 32 KB | Tokens, layout e estilos responsivos | Necessário para primeiro paint e estabilidade | Preservar |
| Fonte, aproximadamente 1,2 KB observados | Fonte carregada via folha externa | Necessária para identidade tipográfica | Preservar e monitorar |
| `InstagramRepertoire-*.js`, aproximadamente 3,8 KB | Seção social abaixo do primeiro viewport | Necessário após scroll até Social | Candidato a adiamento futuro |
| `availability-*.js`, aproximadamente 0,8 KB | Módulo da disponibilidade | Necessário somente ao uso do calendário | Candidato a adiamento futuro |
| `availability.listBlocked`, aproximadamente 333 B observados | Consulta da agenda, que está abaixo da dobra | Necessário após aproximação/uso do calendário | Candidato a adiamento seguro |
| `instagramFeed.status`, aproximadamente 463 B observados em alguns viewports | Estado do feed social | Necessário após aproximação da seção Social | Candidato a adiamento seguro |
| PDF-lib | Importação dinâmica apenas na exportação PDF | Após interação de exportação | Já está corretamente adiado |
| JSZip | Não apareceu nos recursos públicos medidos | Curadoria/exportação específica | Não é custo do primeiro viewport |
| Recharts | Não apareceu no bundle público observado | Módulo administrativo não usado na Home | Não é custo do primeiro viewport |
| Favoritos/curadoria administrativa | Rotas e chunks separados | Exclusivamente administrativo/curadoria | Preservar fora da Home |
| Vídeos e posters | Não foram registrados como transferência inicial relevante nesta execução publicada | Após interação/viewport do player | Não antecipar para o primeiro viewport |

## Diagnóstico da transferência de 4,82 MB

A medição publicada não reproduziu a transferência inicial de 4,82 MB. No build de produção local, a transferência observada variou aproximadamente de 0,52 MiB a 2,20 MiB conforme viewport e imagens efetivamente consideradas pelo navegador; no domínio publicado, a Resource Timing API registrou aproximadamente 0,226 MiB. Essa diferença é suficiente para indicar que os 4,82 MB provavelmente vieram de uma combinação de cache frio, assets de mídia carregados após o primeiro viewport, servidor de desenvolvimento, pré-carregamento anterior ou uma medição que somou recursos de uma navegação mais longa.

O maior custo estrutural verificável no primeiro carregamento é JavaScript publicado, não PDF-lib, JSZip, Recharts ou a curadoria administrativa. Os módulos de exportação já usam importação dinâmica ou permanecem fora da rota pública. Aplicar uma redução agressiva no bundle principal poderia quebrar o lightbox e os modais protegidos; portanto, não foi aplicada uma otimização de risco nesta rodada.

## Oportunidades de carregamento tardio

A oportunidade mais segura é adiar a consulta `availability.listBlocked` até o usuário se aproximar da seção de contato/calendário. A consulta é pequena, mas não participa do primeiro viewport e sua postergação reduziria trabalho de rede e processamento antes da primeira interação. A mesma estratégia pode ser aplicada ao status do feed social e ao chunk de `InstagramRepertoire`, desde que a seção mantenha um estado de carregamento acessível e que o conteúdo textual essencial permaneça no HTML/React inicial.

Não foi aplicada nenhuma dessas alterações automaticamente nesta auditoria porque a solicitação exigiu preservação integral das interações e proibiu outras melhorias. A mudança deve ser feita separadamente, com teste específico de scroll até calendário, erro de disponibilidade, seção social, teclado, reduced motion e retorno pelo histórico.

## Antes/depois

Não há “depois” de produto nesta rodada: por decisão de escopo, não foram alterados recursos críticos nem aplicado lazy loading novo. A linha de base publicada é a referência correta para a próxima rodada. Portanto, a comparação é:

| Indicador | Antes | Depois | Resultado |
|---|---:|---:|---|
| Transferência publicada observada em 390 × 844 | 236.551 B | Não aplicável | Nenhuma alteração aplicada |
| Requests em 390 × 844 | 20 | Não aplicável | Nenhuma alteração aplicada |
| JS observado em 390 × 844 | aproximadamente 202.620 B | Não aplicável | Preservado |
| CSS observado em 390 × 844 | aproximadamente 32.395 B | Não aplicável | Preservado |
| LCP de laboratório em 390 × 844 | 8.556 ms | Não aplicável | Preservado |
| INP de laboratório em 390 × 844 | 56 ms | Não aplicável | Preservado |
| CLS de laboratório em 390 × 844 | 0,050 | Não aplicável | Preservado |

Os valores são de laboratório e não substituem dados de campo. O INP não aparece em todos os viewports porque a execução não produziu interação elegível em cada navegação; quando disponível, é uma amostra sintética, não um percentil real de usuários.

## Conclusão crítica

A arquitetura atual já separa módulos administrativos e mantém PDF-lib fora do primeiro carregamento. A página publicada não apresentou overflow horizontal nas cinco larguras avaliadas. O principal risco de performance não é uma biblioteca específica, mas a soma de JavaScript da experiência principal com mídia dependente do viewport e consultas abaixo da dobra.

A recomendação profissional é não reduzir KB de forma indiscriminada. A próxima otimização deve adiar consultas de disponibilidade e feed social por proximidade de seção, mantendo hero, primeiro projeto, SEO, navegação e interação principal imediatos. Depois disso, uma nova medição publicada em dispositivo físico e rede 4G real deve confirmar o ganho antes de qualquer nova alteração estrutural.

## Validação executada

A auditoria foi apoiada pelo build de produção local, medição publicada nas cinco larguras solicitadas, verificação de overflow e inspeção dos chunks gerados. A etapa de código não recebeu alterações de produto nesta rodada; os scripts de medição são temporários e não devem integrar o pacote final.
