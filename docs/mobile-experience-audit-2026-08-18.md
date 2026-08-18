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

## Auditoria de ergonomia da galeria e do formulário — escopo pendente de aprovação

| Área | Achado | Impacto em 320 px | Proposta a validar |
|---|---|---|---|
| Filtros da galeria | Categoria, tag e tecnologia já usam faixas horizontais independentes, mas cada grupo mantém todos os chips expostos, além dos controles de modo, busca, ordenação, cópia e limpeza. | Alta densidade de decisões antes do primeiro cartão; não há corte horizontal comprovado. | Priorizar o primeiro grupo e recolher os dois grupos secundários em divulgação progressiva somente no mobile. |
| Ações de favoritos | Salvos, imagens, compartilhar, CSV e JSON aparecem no mesmo bloco antes dos filtros. | Pressão visual para uma ação secundária de uso pouco frequente. | Manter salvos/imagens aparentes; transferir compartilhar e exportações para uma área “mais ações” mobile. |
| Formulário | Campos usam `py-3` e o botão de envio usa largura de conteúdo. Há spinner no envio e retorno de sucesso/erro. | Os campos já têm altura funcional, mas o botão principal não ocupa toda a largura disponível e os alvos não têm mínima explícita. | Estabelecer mínimo de 48 px para controles e botão de largura total em mobile, preservando o desktop. |
| Carregamento | Busca, “carregar mais”, skeleton da galeria e envio do formulário já oferecem estados; filtros expõem apenas `aria-busy` e a transição da galeria. | O feedback visual no toque de filtro é discreto demais. | Adicionar um status visual curto de atualização e transições de opacidade/transformação, respeitando movimento reduzido. |

## Resultado do refinamento de ergonomia mobile

| Área | Antes | Depois | Evidência |
|---|---|---|---|
| Densidade da galeria | Tags, tecnologias e ações secundárias disputavam atenção antes dos cartões. | Categoria, busca e modo permanecem diretos; tags e tecnologias entram em “refinar resultados” e compartilhar/exportar em “mais ações” abaixo de 640 px. | E2E em 320 px confirma a divulgação progressiva, os controles disponíveis e zero overflow horizontal. |
| Formulário | Campos e selects dependiam apenas do espaçamento vertical; o envio tinha largura de conteúdo. | Inputs e selects têm mínimo de 48 px; o botão ocupa a largura mobile e preserva o formato compacto a partir de `sm`. | E2E mede os controles visíveis com pelo menos 48 px e a largura do submit no formulário. |
| Feedback de operação | Atualização de filtros era majoritariamente semântica. | Operações reais de filtro e busca exibem “atualizando resultados” com transição curta; skeleton, carregar mais e envio seguem seus estados existentes. | O cenário E2E aciona filtro e confirma o status; `prefers-reduced-motion` continua coberto. |

Validação final: `pnpm check` aprovado; `pnpm test` com **41/41**; `pnpm build` aprovado; Playwright serial limpo com **31 aprovados** e **3 ignorados** por ausência deliberada de `E2E_AUTH_STATE`. A primeira execução serial perdeu a sessão do navegador durante exportação PDF após carga acumulada; o mesmo cenário passou isoladamente e também passou na repetição serial limpa.

## Auditoria de agenda, filtros e favoritos — escopo pendente de aprovação

| Área | Achado em 320 px | Impacto | Proposta a validar |
|---|---|---|---|
| Agenda | A grade de dias usa células de 32 px, setas de mês de 32 px e horários com apenas o espaçamento vertical `py-2`. A leitura está íntegra, mas os alvos ficam menores que os demais controles móveis. | Ergonomia de toque média, sobretudo na escolha de data e mês. | Usar 40 px nos dias e 44 px nas setas e horários; reduzir somente o espaçamento interno do cartão para absorver o aumento sem alargar a agenda. |
| Filtros | Os rótulos técnicos “modo detalhado”, “modo compacto” e “refinar resultados” são corretos, mas longos para uma faixa de 320 px. | Densidade textual moderada, sem overflow confirmado. | No mobile, trocar o texto visível por “detalhes”, “compacto” e “filtros”; manter nomes ARIA descritivos e os textos longos no desktop. |
| Favoritos nos cartões | A galeria já possui um botão funcional de favoritos no canto superior direito de cada item. Em 320 px ele mede 40 px e compete visualmente com os botões de imagem e ampliação. | O recurso existe, mas não é tão reconhecível nem confortável quanto poderia ser. | Não criar botão duplicado: aumentar o controle existente para 44 px e exibir “salvar” ou “salvo” no mobile; reposicionar o controle de imagem para evitar colisão. |

## Resultado do refinamento de agenda, filtros e favoritos

| Área | Antes | Depois | Evidência |
|---|---|---|---|
| Agenda | Dias e setas mediam 32 px; horários não tinham altura mínima de toque. | Dias agora medem 40 px e as setas/horários 44 px abaixo de `sm`; o comportamento de datas e WhatsApp foi preservado. | E2E em 320 px mede todos os alvos e valida a ausência de overflow. |
| Rótulos | “Refinar resultados” e “modo detalhado” ocupavam mais espaço visual no mobile. | Em telas estreitas, os textos visíveis são “filtros”, “detalhes” e “compacto”; os nomes ARIA e o desktop seguem descritivos. | E2E confirma texto curto e nome acessível completo. |
| Favoritar | O coração por projeto media 40 px e a tentativa inicial de texto adjacente interferiu na ação de ampliar. | O controle existente foi ajustado para 44 px, com `aria-pressed`, rótulos completos e separação física da ação de imagem; não foi criado um duplicado. | E2E confirma toque, estado salvo e os dois testes de lightbox aprovados. |

Validação final: `pnpm check` aprovado; `pnpm test` com **41/41**; `pnpm build` aprovado; Playwright serial limpo com **32 aprovados** e **3 ignorados** por ausência deliberada de `E2E_AUTH_STATE`. A interação de ampliar do lightbox foi repetida depois do ajuste de favoritos e manteve-se aprovada em todos os viewports cobertos.
