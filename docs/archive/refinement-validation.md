# Validação do refinamento humano e performance

## Interface

A composição foi revisada em desktop, com viewport de 1280×720, e em mobile, com viewport de 375×812. A hierarquia do hero, a navegação móvel, o CTA humanizado “me chama para conversar” e o botão flutuante de WhatsApp permanecem legíveis e sem sobreposição.

A seção de contato recebeu microcopy mais próxima e direta. O estado vazio da galeria agora convida o visitante a enviar um link quando quiser, sem inventar projetos, depoimentos ou avaliações.

## Acessibilidade

A folha global mantém foco visível com `:focus-visible`, foco específico no calendário e `scroll-margin-top` para navegação por âncoras. A regra `prefers-reduced-motion: reduce` desativa animações não essenciais e reduz transições para praticamente zero. A página também preserva `aria-busy`, `aria-live` e `aria-describedby` no fluxo de consulta ao WhatsApp, além de `role="status"` e `role="alert"` nos feedbacks correspondentes.

A validação CDP em Chromium isolado percorreu 16 controles consecutivos, com `document.activeElement` confirmando cada foco na ordem esperada. O CTA “me chama para conversar” permaneceu ativo durante o foco. Com `prefers-reduced-motion: reduce` emulado, `matchMedia` retornou `true`, o calendário apresentou `animation-name: none` e as durações de animação/transição foram reduzidas para `0.000001s`. A validação visual confirmou leitura e composição em desktop e mobile.

## Performance

O bundle foi dividido por rota: a página pública (`Home`) e a área administrativa (`AvailabilityManager`) são carregadas sob demanda. Dependências React, dados e UI foram separadas em chunks próprios.

Antes do code-splitting, o chunk principal tinha aproximadamente 595,87 kB. Depois, o chunk de entrada caiu para aproximadamente 467,31 kB; `Home` passou a 127,98 kB e a área administrativa a 100,75 kB. O build continua exibindo o alerta de chunk acima de 500 kB para o CSS/entrada combinado, mas a divisão efetivamente reduziu o JavaScript inicial principal e manteve todos os ativos reais.

## Qualidade

`pnpm check`, `pnpm test` e `pnpm build` foram executados com sucesso. A suíte automatizada reportou 13 testes aprovados em quatro arquivos. O aviso não bloqueante de `dotenv` no servidor permanece anterior ao refinamento e não afeta a renderização do frontend.

## Próximo checkpoint

Salvar um checkpoint após revisar este registro e atualizar o TODO com as validações comprovadas.


## Reformulação natural e profissional

A validação CDP executada em 15 de agosto de 2026 percorreu dez avanços reais por Tab na página pública. O foco ativo terminou no controle “Baixar currículo”, com `outline-style: solid`, espessura de 2px, deslocamento de 3px e cor ciano visível. A execução confirmou `prefers-reduced-motion: reduce`, transição de calendário reduzida para `0.000001s` e preservação do carregamento da página após a reformulação de conteúdo, skills e repertório visual.

A inspeção visual confirmou a leitura da nova composição em desktop e mobile. O filtro HTML não apresentou o estado vazio esperado nesta execução, portanto essa mensagem específica não foi considerada evidência positiva; os demais controles e a sequência de foco foram validados.

## Validação final da reformulação

A execução CDP mais recente percorreu 90 passos de Tab e encontrou 26 controles dentro do calendário e do formulário. Todos os alvos reportaram foco visível por outline ou box-shadow, incluindo o campo de data nativo, que recebeu um fallback inline para garantir a indicação em Chromium. A mídia emulada confirmou `prefers-reduced-motion: reduce` durante toda a execução. Testes, typecheck e build também foram executados com sucesso, com 13 testes aprovados.


## Movimento reduzido nos novos blocos

Com `prefers-reduced-motion: reduce` emulado no Chromium, foram inspecionados o hero com reveal, as linhas de skills, as imagens do repertório aplicado, o retrato e as linhas de serviços. Todos reportaram `animation-name: none`, duração de animação e transição de `0.000001s`, além de transformações neutralizadas. As imagens mantiveram sua utilidade visual, sem movimento não essencial. A execução confirmou a preferência reduzida ativa em todos os elementos encontrados.


## Repertório Social / Instagram

A seção `#social` foi criada como um bloco independente e carregado sob demanda por `lazy` + `Suspense`, mantendo o code-splitting já adotado na página pública. Os dois links reais são `@pablogui000` e `@mpjstoryworks`; as imagens exibidas vêm do arquivo audiovisual existente do projeto e não representam postagens simuladas.

A seção consulta o contrato público `instagramFeed.status` via tRPC. O contrato não expõe tokens e distingue os estados `loading`, `query_error`, `credentials_required`, `empty`, `error` e `available`. No estado atual, o servidor retorna `credentials_required`, pois uma conta profissional e uma autorização Meta ainda não foram fornecidas. O fallback visual permanece acionável e direciona o visitante aos perfis reais.

A cobertura automatizada inclui `server/instagramFeed.test.ts`, que verifica que o estado de credenciais ausentes retorna lista vazia e nenhuma publicação inventada. A suíte completa passou com 14 testes; TypeScript e build de produção também passaram. A validação visual foi executada em viewport desktop de 1280×720 e móvel de 390×844, confirmando a leitura da grade, o contraste azul celeste/preto, os links externos e a adaptação para uma coluna em telas estreitas.


## Filtros do Repertório Social

A seção social agora possui os filtros `todos`, `drone`, `eventos` e `bastidores`. Cada card está associado somente a formatos presentes no repertório real já disponível no projeto; os filtros não simulam publicações do Instagram. O botão ativo usa `aria-pressed`, há contagem de referências visíveis e existe um estado vazio acessível para categorias sem correspondência.

A validação prática em Chromium, com viewport móvel de 390×844 e `prefers-reduced-motion: reduce`, encontrou os quatro rótulos esperados, confirmou foco visível no primeiro filtro, acionou o filtro `drone`, verificou `aria-pressed="true"`, confirmou a mensagem `1 referência visível` e registrou `matchMedia('(prefers-reduced-motion: reduce)').matches === true`. As validações visuais desktop/mobile e a suíte de 14 testes continuam aprovadas.


## Transição suave dos filtros sociais

A troca de formato usa uma sequência curta de saída e entrada: a grade atual reduz opacidade e desloca-se 4px para baixo durante a troca; após 130ms, o filtro é atualizado e os novos cards entram com `opacity` e `transform`, com atraso escalonado de 45ms por card. A animação usa somente `opacity` e `transform`, sem alterar propriedades de layout durante o movimento.

A validação Chromium confirmou foco visível nos filtros, `aria-pressed="true"` após selecionar Drone, contagem de `1 referência visível`, `prefers-reduced-motion: reduce` ativo e as classes `translate-y-1 opacity-0` durante a troca, seguidas de `translate-y-0 opacity-100` após 260ms. A regra global de reduced motion reduz a duração da transição para aproximadamente zero, preservando a troca de conteúdo sem movimento obrigatório.


## Validação final da animação dos filtros

A validação Chromium foi repetida após a implementação da animação em viewport móvel de 390×844. O roteiro deslocou o foco por `Tab` do filtro “todos” para “drone”, acionou a seleção por `Enter` e confirmou que o foco permaneceu no botão durante e após a transição. O estado `aria-pressed="true"`, a contagem `1 referência visível` e `prefers-reduced-motion: reduce` ativo foram confirmados. Durante a troca, a grade exibiu `translate-y-1 opacity-0`; após 260ms, retornou a `translate-y-0 opacity-100`.

Novas capturas visuais foram realizadas em desktop de 1280×720 e mobile de 390×844 depois da implementação. A composição dos botões, a grade filtrável e o fallback visual permaneceram responsivos e legíveis nos dois tamanhos.

## Transição da galeria principal de trabalhos

A galeria `#projetos` agora aplica a mesma sequência suave usada no Repertório Social: a grade reduz opacidade e desloca-se 4px durante 130ms, o filtro é atualizado e os cards ou estado vazio entram com `opacity` e `transform`, com atraso escalonado de 45ms para os cards. O carregamento inicial e as trocas de tecnologia usam a mesma animação, sem recorrer a mudanças animadas de tamanho ou posição de layout.

A validação Chromium em viewport móvel de 390×844 confirmou os dez filtros esperados, foco visível, deslocamento por `Tab`, ativação de Drone por `Enter`, preservação de foco durante e após a transição, `aria-pressed="true"`, quatro cards visíveis para Drone e `prefers-reduced-motion: reduce` ativo. As classes de saída `translate-y-1 opacity-0` e de entrada `translate-y-0 opacity-100` foram confirmadas em execução. Capturas visuais finais em 1280×720 e 390×844 preservaram legibilidade e responsividade.

## Modo compacto da galeria

O novo controle de alternância permite trocar entre o modo detalhado e o modo compacto. No modo compacto, a grade passa a priorizar mais itens na tela, os cards reduzem altura e espaçamento, as descrições são omitidas e apenas as duas primeiras tecnologias permanecem visíveis. O acesso a vídeos, links e filtros é preservado, e o controle expõe o estado por `aria-pressed` e rótulo acessível atualizado.

A validação Chromium em viewport móvel confirmou ativação por `Enter`, `aria-pressed="true"`, rótulo “Voltar para visualização detalhada”, foco preservado no controle e cards compactos com altura mínima reduzida. A mesma execução confirmou a troca de filtro Drone, quatro cards visíveis, foco por Tab/Enter, classes da transição e `prefers-reduced-motion: reduce` ativo.

## Busca rápida da galeria

A galeria recebeu uma busca por nome, combinada ao filtro de tecnologia já selecionado. O campo possui rótulo acessível, ícone de busca, atalho de limpeza, contagem anunciada por região de status e estado vazio que informa tanto o termo buscado quanto a tecnologia ativa. A busca preserva os modos detalhado e compacto, os cards com transição e a abertura de vídeos.

A validação Chromium confirmou que, com Drone selecionado e o modo compacto ativo, a busca por “Eloise” retorna um trabalho e anuncia `1 trabalho encontrado para “Eloise”`. Uma busca sem correspondência mostrou o estado vazio com termo e filtro contextualizados; o botão de limpeza restaurou o campo vazio e quatro trabalhos do filtro Drone. Capturas recentes em 1280×720 e 390×844 confirmaram o encaixe da barra de busca aos controles existentes.

## Busca expandida por tecnologia e descrição

A busca da galeria agora consulta, além do nome, a descrição e as tecnologias declaradas em cada trabalho. A microcopy do campo e a mensagem de estado vazio foram atualizadas para explicitar os três campos pesquisáveis, mantendo a combinação com filtros de tecnologia, os modos de visualização e os controles de limpeza.

A validação Chromium confirmou duas correspondências para “Interface”, localizado como tecnologia, e uma correspondência para “celebração”, localizado na descrição de um projeto. A busca por nome, o estado vazio, a limpeza, a seleção por teclado e reduced motion continuaram aprovados. Capturas atualizadas em 1280×720 e 390×844 preservaram a legibilidade e o arranjo dos controles.

## Sugestões de preenchimento automático

O campo de busca agora apresenta sugestões reais derivadas dos nomes de projetos, tecnologias e termos relevantes das descrições. As sugestões respeitam o filtro de tecnologia ativo, são limitadas a seis opções, identificam a origem de cada termo e não introduzem conteúdo simulado. O campo usa semântica de combobox, com `aria-expanded`, `aria-controls`, `aria-activedescendant` e opções em `listbox`.

A validação Chromium confirmou uma sugestão contextual ao digitar “cha” com Drone ativo; a seleção por seta para baixo e Enter preencheu “Chá da Eloise” e retornou um card. A seleção por clique de “celebração” também retornou um resultado. Após selecionar Todos, a sugestão “Interface” foi escolhida por teclado e retornou dois trabalhos. O foco, filtros, modo compacto, reduced motion e as capturas em 1280×720 e 390×844 permaneceram adequados.

## Ícones semânticos das sugestões

Cada sugestão agora exibe um ícone visual associado à origem: pasta para projeto, chaves para tecnologia e documento para descrição. As três variações usam cores distintas no estado padrão e se tornam azul-escuro no estado ativo, mantendo contraste com o fundo azul celeste. Os ícones são decorativos para leitores de tela; o rótulo textual de origem continua disponível ao lado do termo.

A validação Chromium confirmou a presença de um ícone de projeto para “Chá da Eloise”, um ícone de descrição para “celebração” e um ícone de tecnologia para “Interface”, preservando a escolha por teclado e clique. A captura de inspeção em viewport móvel confirmou o posicionamento do ícone antes do termo e a continuidade da leitura da lista.

## Destaque da correspondência nas sugestões

O trecho encontrado em cada sugestão agora é renderizado em negrito. A correspondência usa normalização sem distinção entre maiúsculas/minúsculas e acentos, mantendo a grafia original exibida no resultado. Ícones, rótulos de origem, estados ativos e a semântica de combobox permanecem inalterados.

A validação Chromium confirmou que, ao digitar “cha”, a sugestão “Chá da Eloise” apresenta “Chá” no elemento de destaque, com peso computado `700`. A mesma verificação encontrou “cele” em negrito na sugestão de descrição “celebração” e “Inte” em negrito na sugestão de tecnologia “Interface”, ambos também com peso `700`. A seleção por teclado, as sugestões por tecnologia e descrição, os filtros, o modo compacto e reduced motion continuaram funcionais; testes, TypeScript e build foram aprovados.

As capturas finais em desktop de 1280×720 e mobile de 390×844 confirmaram que a barra de busca, filtros, modo de visualização e a grade permanecem legíveis e responsivos após o novo tratamento tipográfico.


## Refinamento profissional do botão de limpar busca

O botão X agora permanece dentro da barra com área de toque de 32px, borda e fundo sutis no hover, foco visível com anel ciano, estado ativo com redução de escala e transição combinando opacidade, transformação, cor e borda. Quando não há texto, fica oculto visualmente e fora da ordem de Tab; quando a busca está preenchida, torna-se um controle acessível com `aria-label`, tooltip nativo e acionamento por clique ou Enter. Após a limpeza, o foco retorna automaticamente ao campo de busca.

A validação Chromium confirmou `tabindex="0"`, foco visível, limpeza por Enter, campo vazio e retorno do foco ao input. O comportamento de sugestões, filtros, modo compacto e `prefers-reduced-motion` permaneceu estável. Capturas finais em 1280×720 e 390×844 confirmaram o encaixe da barra e a legibilidade dos controles em desktop e mobile.

A rodada final também validou a ação por clique: ao preencher “Eloise”, o botão X foi acionado com mouse/tap, esvaziou o campo e devolveu o foco ao input. Em seguida, com “inexistente”, a navegação real por Tab alcançou o botão (`tabindex="0"`) com foco visível, e Enter executou a mesma limpeza. O reduced motion permaneceu ativo sem regressões.


## Revisão ampla profissional

A revisão ampla preservou os sinais mais fortes do Arquivo Profundo — tipografia editorial de alto impacto, linha vertical azul, metadados em mono e apresentação de trabalhos como evidência — e concentrou a melhoria em pontos de uso recorrente. A busca recebeu limpeza por Escape, retorno automático de foco e remoção do botão nativo duplicado do navegador, mantendo um único controle X visualmente consistente. A microinteração também foi refinada para hover, active, focus-visible e reduced motion.

A execução Chromium confirmou limpeza por clique e Escape, retorno do foco ao campo, foco visível por Tab, filtros, sugestões, modo compacto e `prefers-reduced-motion`. Testes, TypeScript e build foram aprovados. Capturas finais em 1280×720 e 390×844 confirmaram que a hierarquia visual, a barra de busca, a galeria e os controles continuam coerentes e legíveis nas duas larguras.


## Auditoria ampla e refinamento de descoberta

A auditoria priorizou cinco pontos de maior impacto: descoberta de trabalhos, entendimento dos filtros, limpeza da busca, continuidade da navegação por teclado e consistência em telas menores. Além da busca refinada, os filtros da galeria agora exibem contagens reais de trabalhos por tecnologia, mantendo o estado ativo, a área de toque e os nomes acessíveis dos controles. Isso transforma a filtragem em uma leitura rápida de repertório, sem introduzir dados fictícios.

A revisão de navegação preservou a hierarquia editorial, os links de contato, os cards acionáveis e os estados de vídeo. A validação Chromium confirmou busca por clique, Enter e Escape, foco visível e retorno ao campo; filtros e sugestões continuaram funcionais. O build de produção concluiu com `Home` em aproximadamente 146 kB e CSS em aproximadamente 158 kB antes de gzip, enquanto os testes e TypeScript permaneceram aprovados. Capturas finais em 1280×720 e 390×844 confirmaram coerência visual e responsividade.


## Correção mobile e velocidade percebida

O diagnóstico em viewport de 390px encontrou overflow real no bloco de contato/calendário: o grid móvel estava assumindo largura de conteúdo de até 406px, fazendo textos e controles ultrapassarem a tela. A correção adicionou `w-full` e `min-w-0` ao grid e às colunas, limitou o título a `max-w-full` com `break-words` e preservou o comportamento desktop. O diagnóstico final passou a registrar `documentWidth: 390` e apenas dois falsos positivos de elementos `sr-only`, sem conteúdo visual cortado.

Para a velocidade percebida, a pintura de capítulos fora da viewport foi adiada apenas em telas maiores com `content-visibility: auto`, evitando a sensação de conteúdo tardio no mobile. Imagens continuam com carregamento lazy onde apropriado, a seção social permanece lazy e o build manteve code-splitting. No build final, o chunk Home ficou em aproximadamente 146 kB e o CSS em aproximadamente 158 kB antes de gzip; testes, TypeScript e build foram aprovados. A captura mobile final confirmou leitura contínua e ausência do corte observado anteriormente.


A medição final em build de produção (viewport 390px) registrou `documentWidth: 390`, sem overflow visual real; os dois itens restantes são apenas spans `sr-only` esperados. O carregamento passou de 21 para 20 recursos após impedir a textura decorativa no mobile, e a versão final manteve o hero, o retrato e os chunks essenciais sem carregar a textura de skills em telas menores. As fontes foram movidas do `@import` para um `<link rel="stylesheet">` no HTML, reduzindo uma etapa de cascata no carregamento inicial. A validação final de teclado, filtros, sugestões, reduced motion, testes, TypeScript, build e captura mobile foi aprovada.


## Responsividade e interatividade avançadas

O menu mobile ganhou fechamento por `Escape`, bloqueio de rolagem do documento enquanto aberto, navegação interna rolável, áreas de toque maiores, `aria-controls` e estados visuais de hover/foco. Os filtros da galeria passaram a usar rolagem horizontal no mobile, evitando uma coluna excessivamente alta, e receberam foco visível consistente.

A validação automatizada cobriu 320px, 390px, 768px e 1280px: todas as larguras registraram `documentWidth` igual à viewport, sem overflow horizontal; o menu fechou por `Escape`; e os filtros mantiveram foco visível. Testes, TypeScript, build e capturas mobile/desktop foram concluídos.


A validação ampliada confirmou em 320px, 390px, 768px e 1280px: `documentWidth` igual à viewport, filtro Drone acionável, busca por Interface com resultado, calendário com seleção de data e horário, foco visível nos filtros, menu mobile fechando por Escape e `prefers-reduced-motion` ativo. Os filtros móveis mantêm conteúdo horizontal rolável sem provocar overflow do documento.
