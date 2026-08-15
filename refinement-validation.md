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
