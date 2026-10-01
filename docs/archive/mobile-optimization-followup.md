# Revisão crítica da otimização mobile — Arquivo Profundo

**Base comparativa:** auditoria mobile do checkpoint `1ca1ddbd`  
**Rodada avaliada:** melhorias mobile aplicadas em 17 de agosto de 2026  
**Escopo:** interação do modal, contato fixo, vídeo, orientação, acessibilidade e desempenho percebido.

## Resultado executivo

A rodada melhorou os três pontos de maior impacto identificados na auditoria sem alterar a identidade visual nem remover recursos. A barra fixa de contatos agora respeita a safe-area e desaparece durante modais, preview de currículo, busca focada, preenchimento do briefing e abertura do teclado virtual. O modal de detalhes ganhou uma dica única de swipe em telas estreitas e o vídeo ganhou uma ação clara de “tocar vídeo” quando o autoplay é bloqueado pelo navegador.

A qualidade funcional subiu de **17 para 18 cenários E2E públicos aprovados**. Os novos cenários cobrem a descoberta do swipe, a ocultação da barra fixa durante o modal e o fallback de reprodução. Os testes unitários continuam com 24 casos aprovados, o typecheck passou e o build de produção foi concluído.

## Evidências objetivas

| Medição | Resultado | Interpretação |
|---|---:|---|
| `pnpm check` | Aprovado | Nenhum erro TypeScript após a rodada |
| `pnpm test` | 8 arquivos / 24 testes aprovados | Regressão unitária não observada |
| `pnpm build` | Aprovado | Bundle de produção gerado corretamente |
| Playwright público | 18/18 aprovados em 1 worker | Fluxos públicos e mobile estáveis |
| Viewport de medição | 390 × 844 | Cenário representativo de smartphone |
| Overflow horizontal | `false`; `scrollWidth = 390` | A página respeitou a viewport |
| DOM inicial | 1.354 nós | Complexidade relevante, mas estável |
| Recursos carregados | 66 | Deve ser monitorado em rede móvel |
| Transferência inicial observada | ~4,82 MB | Principal oportunidade de performance futura |
| First Paint | 268 ms | Bom no ambiente de validação |
| First Contentful Paint | 288 ms | Bom no ambiente de validação |

Os tempos de pintura foram medidos no ambiente de desenvolvimento/preview e não substituem uma medição de campo em rede 4G, CPU intermediária e aparelho Android real. A transferência inicial de aproximadamente 4,82 MB é o alerta técnico mais importante: não gerou falha nos testes, mas pode afetar usuários com franquia limitada ou conexão instável.

## Melhorias aplicadas

### Barra fixa de contato

A barra agora usa `env(safe-area-inset-bottom)` e é ocultada de forma contextual durante estados em que ocupa a área útil ou compete com a tarefa principal. Isso reduz sobreposição com modais, campos de entrada, teclado virtual e preview de currículo, mantendo os três canais disponíveis na navegação normal.

### Descoberta do swipe

O modal de detalhes exibe uma dica discreta, somente em telas abaixo do breakpoint mobile e apenas na primeira abertura. A dica desaparece automaticamente e não interfere em botões, links, vídeo, inputs ou rolagem vertical. Os controles anterior/próximo e as setas do teclado continuam sendo alternativas acessíveis.

### Autoplay de vídeo

Quando a política do navegador rejeita a reprodução automática, o modal apresenta o botão “tocar vídeo”. A ação é explícita, acessível e não tenta contornar a política do navegador. Quando o vídeo começa, o fallback desaparece.

### Cobertura de testes

A suíte ganhou validação para o hint de swipe, a opacidade da barra fixa durante o modal, o gesto horizontal e a ação de reprodução quando `HTMLMediaElement.play()` rejeita. A suíte completa passou com 18 cenários públicos.

## Análise crítica do resultado

O resultado é **mais profissional e previsível no mobile**, principalmente em tarefas de leitura e interação com projetos audiovisuais. A barra fixa deixou de ser uma presença constante em contextos onde poderia cobrir conteúdo, e o vídeo agora comunica melhor a diferença entre “carregando” e “aguardando ação”. A dica de swipe resolve o principal problema de descoberta sem criar um tutorial persistente.

A melhoria não elimina a principal dívida de performance: o carregamento inicial ainda envolve uma aplicação editorial rica, muitos cards e aproximadamente 4,82 MB transferidos na medição de preview. O próximo ganho não deve ser adicionar mais interações. Deve ser confirmar, com dados de produção, quais módulos e imagens chegam antes da primeira interação e adiar o que não participa do primeiro viewport.

Também permanece uma limitação de validação: o teclado virtual foi inferido por `visualViewport` e coberto por lógica de estado, mas o Playwright não reproduz integralmente as diferenças de teclado entre iOS Safari e Android Chrome. A orientação e o cancelamento de toque permanecem protegidos pelos handlers existentes, porém uma rodada em aparelhos reais ainda teria valor antes de uma campanha de tráfego maior.

## Recomendações pós-publicação

A primeira recomendação é medir LCP, INP, CLS, tamanho transferido e taxa de reprodução iniciada em produção, segmentando Android e iOS. A segunda é investigar uma divisão adicional do módulo principal e o carregamento ainda mais tardio das funções de exportação PDF, caso o perfil de rede confirme que o bundle inicial é o gargalo. A terceira é revisar a posição do CTA de orçamento em 320–390 px com dados de interação, não apenas com inspeção visual.

## Conclusão

A versão final está pronta para republicação do ponto de vista de integridade, responsividade e regressão funcional. Os problemas mobile prioritários da auditoria foram tratados com mudanças localizadas. O projeto agora tem uma proteção melhor contra sobreposição da barra fixa, menor ambiguidade no uso de vídeo e maior descoberta da navegação por swipe. A performance inicial está boa no preview, mas o tamanho transferido recomenda monitoramento contínuo em produção.
