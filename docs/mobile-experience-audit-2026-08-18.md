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

## Auditoria de prévia, prioridade de filtros e feedback de favoritos — escopo pendente de aprovação

| Área | Achado | Limite de evidência | Proposta a validar |
|---|---|---|---|
| Disponibilidade | A agenda já deriva `selectedDateLabel`, horário e URL do WhatsApp, mas só apresenta a seleção no rótulo discreto “horário desejado”. | Não é necessário alterar a mensagem ou o redirecionamento para expor uma confirmação útil antes do clique. | Mostrar uma prévia visível de data e hora acima do CTA somente quando ambas estiverem selecionadas. |
| Ordem de filtros | A taxonomia canônica está em ordem manual. A instrumentação permitida não registra uso de filtros; portanto, não há dado de popularidade de visitantes. | Não é correto alegar que filtros são mais usados sem um evento que não faz parte da taxonomia aprovada. | Priorizar por cobertura factual do catálogo público: Aéreo e Conteúdo (4), Noturno (3), Interface (2), Eventos (1), mantendo “Todos” primeiro e desempate pela ordem editorial atual. |
| Favoritos | Favorito de projeto persiste no navegador e atualiza `aria-pressed`, mas não fornece retorno visual; a coleção de imagens já mantém status temporário. | O produto já usa `toast` no envio de briefing, sem necessidade de nova dependência. | Reutilizar o toast existente ao salvar ou remover projeto, com nome do trabalho e sem analytics ou PII adicionais. |

## Resultado da prévia, prioridade de filtros e feedback de favoritos

| Área | Antes | Depois | Evidência |
|---|---|---|---|
| Consulta de disponibilidade | Data e horário escolhidos apareciam apenas no rótulo do seletor. | Uma prévia “consulta selecionada” apresenta data e horário acima do CTA de WhatsApp quando ambos estão definidos. | E2E seleciona uma data e 10:00, confirma a prévia e preserva o botão de consulta. |
| Ordem de categorias | A sequência era editorial e não refletia a cobertura do catálogo. | A ordem é `Todos`, `Aéreo`, `Conteúdo`, `Noturno`, `Interface`, `Eventos`, usando a quantidade factual de projetos (4, 4, 3, 2, 1), sem afirmar uso de visitantes. | E2E confirma a sequência renderizada e os filtros continuam URL-compartilháveis. |
| Favoritos | O estado mudava silenciosamente no cartão. | Salvar/remover exibe toast com o nome do projeto, sem dado pessoal nem novo evento analítico. | E2E confirma `aria-pressed` e o toast “Projeto salvo”. |

Validação final: `pnpm check` aprovado; `pnpm test` com **41/41**; `pnpm build` aprovado; Playwright serial com **32 aprovados** e **3 ignorados** por ausência deliberada de `E2E_AUTH_STATE`. Os testes de lightbox, busca, filtros, agenda, exportação e acessibilidade permaneceram aprovados.

## Auditoria de reset, projetos salvos e compartilhamento por WhatsApp — escopo pendente de aprovação

| Pedido | Estado atual | Decisão de escopo |
|---|---|---|
| Limpar data e horário | A agenda possui estados independentes de data e horário e só os limpa por invalidação de data bloqueada; não expõe ação manual de reset. | Adicionar uma ação explícita que restaure ambos os estados, sem mudar o mês exibido nem o CTA principal. |
| Filtrar projetos favoritados | Já existe o botão “projetos salvos”, que ativa `favoritesOnly`, mostra a seção dedicada e respeita a busca/ordenação. | Não duplicar um filtro que já está funcionando; apenas cobrir sua disponibilidade na regressão desta rodada. |
| Compartilhar projeto por WhatsApp | O lightbox compartilha por WhatsApp, mas cada cartão da galeria não oferece acesso direto. | Acrescentar um botão de WhatsApp por cartão, reutilizando o deep link e o evento `share_project` já permitidos. |

## Resultado do reset de agenda e compartilhamento por WhatsApp

| Área | Antes | Depois | Evidência |
|---|---|---|---|
| Agenda | Uma data ou horário escolhido só era removido ao selecionar outra opção ou quando a data se tornava indisponível. | A ação “limpar data e horário” aparece após escolher uma data e restaura os dois campos sem alterar o mês atual. | E2E seleciona data/hora, confirma a prévia e verifica a remoção da prévia e do controle após o reset. |
| Projetos salvos | O filtro solicitado já existia como “projetos salvos”. | Nenhum segundo filtro foi criado; a ação existente continuou ativando a seção de itens salvos e foi coberta nesta rodada. | E2E favorita um projeto, aciona “projetos salvos” e confirma a seção dedicada. |
| Compartilhamento por cartão | WhatsApp estava disponível no lightbox, não diretamente na galeria. | Cada cartão ganhou um botão de WhatsApp que compartilha nome e deep link do projeto, sem abrir detalhes. | E2E intercepta e confirma URL `wa.me` gerada pelo botão do cartão. |

Validação final: `pnpm check` aprovado; `pnpm test` com **41/41**; `pnpm build` aprovado; Playwright serial com **32 aprovados** e **3 ignorados** por ausência deliberada de `E2E_AUTH_STATE`. A implementação mantém somente o evento `share_project` com canal `whatsapp`; não adiciona PII nem eventos novos.

## Auditoria de estado vazio, mensagem de WhatsApp e feedback de reset — escopo pendente de aprovação

| Área | Achado | Proposta a validar |
|---|---|---|
| Projetos salvos | O filtro existe e a seção dedicada aparece, mas quando a lista tem zero itens a galeria cai no estado vazio genérico, que não explica como salvar um projeto. | Exibir estado vazio específico, com instrução para usar o coração dos cartões e ação para voltar à vitrine. |
| Compartilhamento por cartão | A mensagem atual contém somente título e URL. | Personalizar para mencionar o título e convidar explicitamente a ver os detalhes do projeto, preservando o mesmo deep link. |
| Reset de agenda | O reset remove a seleção instantaneamente, sem transição perceptível. | Fazer a área selecionada desaparecer em até 200 ms e confirmar “Seleção limpa”; movimento reduzido mantém remoção imediata sem animação. |

## Resultado do estado vazio, mensagem de WhatsApp e feedback de reset

| Área | Antes | Depois | Evidência |
|---|---|---|---|
| Projetos salvos | Sem itens, a área reutilizava o estado vazio genérico da galeria. | A seção dedicada mostra “Nenhum projeto salvo ainda”, orienta o uso do botão de salvar nos cartões e oferece retorno à vitrine. | E2E remove todos os favoritos, abre projetos salvos e confirma o estado específico e a ação de retorno. |
| Compartilhamento por cartão | O WhatsApp recebia somente título e URL. | A mensagem agora convida a pessoa a ver os detalhes: “Quero te mostrar [título] do portfólio de Pablo Guilherme. Veja os detalhes: [URL]”. | E2E intercepta a URL `wa.me` e confirma a mensagem codificada e o deep link do projeto. |
| Reset da agenda | A prévia desaparecia sem confirmação de ação. | A seleção usa uma saída de 180 ms e anuncia “Seleção limpa”; com movimento reduzido, o estado é removido imediatamente. | E2E confirma `aria-busy` durante a transição, a remoção da prévia e o toast; o cenário de movimento reduzido já permanece aprovado. |
| Exportação em PDF | A importação dinâmica de `pdf-lib` podia não oferecer retorno antes da montagem do arquivo. | O botão informa “Preparando PDF” imediatamente e troca para o estado de conclusão quando a geração termina. | E2E aceita os dois estados reais de feedback, eliminando a condição de corrida observada na execução anterior. |

Validação final: `pnpm check` aprovado; `pnpm test` com **41/41**; `pnpm build` aprovado; Playwright serial completo com **32 aprovados** e **3 ignorados** por ausência deliberada de `E2E_AUTH_STATE`. Nenhuma regressão foi observada nos cenários de hero, busca, filtros, agenda, exportação, lightbox, acessibilidade ou favoritos.
