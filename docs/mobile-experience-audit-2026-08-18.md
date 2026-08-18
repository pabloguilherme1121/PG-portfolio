# Auditoria de experiência mobile — 18 de agosto de 2026

> Registro de observações e validação para o refinamento mobile aprovado. Não houve alteração de identidade, CTAs, navegação, lightbox, modais, favoritos, compartilhamento ou busca.

| Viewport | Área observada | Resultado | Classificação |
|---|---|---|---|
| 320 × 568 | Página completa, antes da mudança | A captura integral não exibiu overflow horizontal; a densidade vertical é alta, como esperado para o conteúdo editorial. | A validar por seção |
| 390 × 844 | Hero, antes da mudança | A barra de contato não encobria os CTAs. O título deixava “que” isolado, quebrando o ritmo de leitura. | Médio — tipografia mobile |
| 360 × 800 | Hero, antes da mudança | Margens laterais preservadas; a mesma quebra pouco natural do título permanecia visível. | Médio — tipografia mobile |
| 430 × 932 | Hero, antes da mudança | A composição já acomodava “Registrando o que” e os dois CTAs na mesma linha. | Referência de comportamento desejável |
| 390 × 844 | Hero, depois da mudança | O H1 agora apresenta quatro linhas, mantendo “que faz sentido.” unido. Retrato, texto e CTA seguem visíveis, sem conflito com a barra flutuante. | Aprovado visualmente |
| 320 × 568 | Hero, depois da mudança | A captura isolada falhou no ambiente de prévia; o cenário Playwright percorreu este viewport e aprovou título em até quatro linhas, CTAs visíveis e ausência de overflow. | Coberto por E2E |

## Resultado da implementação aprovada

O ajuste foi limitado ao H1 abaixo de 400 px. A escala mínima foi reduzida de forma discreta e a versão mobile agrupa “que faz sentido.”; a regra anterior permanece integralmente aplicada a partir de 400 px e em desktop. Não foram modificados estado, comportamento, CTA, barra de contato, mídia, lightbox, modal ou fluxos de favoritos.

| Verificação | Resultado |
|---|---|
| `pnpm check` | Aprovado |
| `pnpm test` | **41/41** aprovados em 14 arquivos |
| `pnpm build` | Aprovado |
| E2E mobile novo + proteção de CTA | **2/2** aprovados |
| Axe isolado | Aprovado, sem violações graves ou críticas |
| Playwright serial completo | **30 aprovados** e **3 ignorados** por ausência deliberada de `E2E_AUTH_STATE`; execução limpa concluída em 9,6 min. |
