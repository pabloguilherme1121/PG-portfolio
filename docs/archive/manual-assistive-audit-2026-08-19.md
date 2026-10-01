# Auditoria manual assistiva — 19 de agosto de 2026

> Esta rodada avalia a navegação assistiva do fluxo público sem alterar o produto. A validação com leitor de tela nativo depende da disponibilidade do ambiente e será documentada separadamente.

## Evidências iniciais

| Área | Evidência observada | Situação |
|---|---|---|
| Entrada pelo teclado | O primeiro `Tab` alcança o link “Pular para o conteúdo”, visível no topo da página. | Aprovado na inspeção manual inicial. |
| Landmarks e rótulos | A árvore expõe links de navegação, botão de tema, CTA de portfólio, controles de galeria, busca com nome calculado, ordenação e comandos por projeto. | Aprovado na inspeção inicial; revisar a sequência completa até agenda e formulário. |
| Projetos salvos | A ação informa a quantidade salva e a seção dedicada já expõe orientação, exportações e retorno à vitrine. O filtro e a ordenação atuais são globais à galeria. | O pedido de filtro/ordenação específica exige estado próprio para não afetar a vitrine pública. |
| Agenda | Os botões de mês têm nome acessível, a seleção usa regiões de status e o reset informa estado ocupado durante a transição. | A estrutura é compatível com uma transição de visibilidade; a nova transição não deve deslocar foco nem ocultar conteúdo focado. |

## Verificação manual de teclado

O foco inicial alcançou “Pular para o conteúdo”, cujo destino é `#conteudo-principal`. Ao ativá-lo com `Enter`, a URL recebeu a âncora esperada e nenhuma ação secundária foi disparada. A inspeção da árvore também mostrou nomes calculados para os controles de busca, ordenação, favoritos, compartilhamento, exportação, calendário e projetos individuais.

O ambiente não disponibiliza NVDA, VoiceOver, Orca nem um serviço de fala compatível. Por esse motivo, esta rodada combinará navegação manual por teclado, árvore de acessibilidade do Chromium e a suite Axe existente. A experiência auditiva de regiões de status e o retorno de foco deverão continuar como validação complementar em leitor de tela real.

## Resultado da implementação aprovada

| Área | Resultado | Evidência |
|---|---|---|
| Projetos salvos | A visualização dedicada agora tem busca própria por título, descrição, tecnologia e categoria, além de ordenação independente por relevância, data de adição ou ordem manual. Os filtros públicos não aparecem nesse contexto e permanecem preservados ao retornar à vitrine. | E2E cria dois favoritos, pesquisa “RHAM”, confirma apenas o projeto correspondente, limpa a busca e altera a ordenação sem tocar na galeria pública. |
| Transição de contexto | Os controles “ver agenda” e “projetos salvos” movem o foco para a região de destino, usam rolagem suave e uma transição de opacidade/deslocamento de 180 ms. Com movimento reduzido, a transição é imediata. | E2E confirma foco no calendário e no painel de salvos, além dos anúncios de status; os dois destinos têm `tabIndex=-1`, nomes acessíveis e margens de rolagem para não ficar sob a barra fixa. |
| Navegação assistiva | O botão da agenda recebeu nome específico “Ir para projetos salvos”, reduzindo a ambiguidade na árvore assistiva. A cobertura manual confirmou o skip link e a árvore expõe landmarks, nomes e controles. | Baseline de acessibilidade: 4/4 cenários aprovados; o primeiro foco alcança o skip link e `Enter` direciona a `#conteudo-principal`. |

## Validação final

| Verificação | Resultado |
|---|---|
| `pnpm check` | Aprovado |
| `pnpm test` | **41/41** aprovados em 14 arquivos |
| `pnpm build` | Aprovado |
| Playwright — acessibilidade | **4/4** aprovados |
| Playwright — regressões de agenda, tema e projetos salvos | **3/3** aprovados |
| Playwright serial completo | **33 aprovados** e **3 ignorados** por ausência deliberada de `E2E_AUTH_STATE` |

> Permanece pendente somente a confirmação auditiva em um leitor de tela real, pois NVDA, VoiceOver, Orca e serviços de fala não estavam disponíveis no ambiente de validação.
