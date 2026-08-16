# Auditoria crítica do portfólio de Pablo Guilherme

## Síntese executiva

O portfólio já possui uma base acima da média para um perfil em formação: identidade visual autoral, galeria com busca e filtros, lightbox, coleção de imagens, temas, ordenação manual, calendário, canais de contato e currículo em PDF. O problema principal não é falta de funcionalidades. É **hierarquia de decisão**. Um visitante precisa entender em poucos segundos se deve ver evidências, entender um serviço ou iniciar uma conversa.

A pesquisa comparativa mostra que portfólios profissionais fortes costumam combinar uma entrada visual clara, uma chamada de ação acima da dobra, uma seleção pequena de trabalhos destacados e páginas ou blocos que contextualizam papel, método e resultado. O showreel curto é uma forma recorrente de demonstrar capacidade em áreas de tela e vídeo [1]. Cases eficazes também apresentam resultado e contexto cedo, antes de exigir leitura longa [2]. Em referências de videografia, CTA no cabeçalho, grade filtrável, lightbox e cabeçalho fixo aparecem como padrões de conversão e exploração [3].

> A recomendação central é não adicionar complexidade indiscriminadamente. O próximo salto de qualidade vem de tornar as escolhas mais claras, reduzir áreas sem evidência, preservar o azul como cor de decisão e transformar trabalhos em arquivos de prova, não apenas em cartões.

## Pontos fortes atuais

| Área | Avaliação | Evidência no projeto |
|---|---|---|
| Identidade | Forte e diferenciada | Arquivo Profundo, linha de progresso, metadados e contraste azul/preto |
| Exploração | Muito completa | Busca, categorias, tecnologia, lista/grade, ordenação e carregamento progressivo |
| Visualização | Forte | Lightbox, zoom, miniaturas, compartilhamento e favoritos de imagens |
| Conversão | Boa, mas dispersa | WhatsApp, Telegram, Instagram, formulário, calendário e currículo |
| Acessibilidade | Boa base | Foco visível, aria-live, Escape, reduced motion e validações Chromium |
| Velocidade percebida | Boa base | Lazy loading, componentes isolados e `content-visibility` em capítulos |
| Risco principal | Clareza de escolha | Muitas funções podem competir com o caminho principal do visitante |

## Diagnóstico crítico

### 1. O hero comunica personalidade, mas precisava explicitar intenções

A headline e a estética já criam diferenciação. O risco era o visitante ter de interpretar sozinho o próximo passo. A melhoria implementada adiciona três caminhos curtos e sem ambiguidade: **ver evidências**, **entender serviços** e **iniciar conversa**. Isso reduz a carga cognitiva sem criar uma nova página ou um novo sistema.

### 2. A densidade narrativa cai depois das primeiras seções

A revisão visual indicou que a hero e o manifesto estão fortes, enquanto grandes áreas posteriores podem parecer mais atmosféricas do que documentais. A arquitetura existente já contém material suficiente para resolver isso: contexto, método, aprendizado, formatos, duração e repertório. A prioridade é continuar rotulando cada seção como entrada de arquivo e aproximar resultados da primeira leitura, sem aumentar o volume de texto.

### 3. A galeria é rica, mas precisa ser tratada como evidência

A galeria já tem muitas funções. A recomendação é não adicionar mais filtros agora. O ganho maior virá de manter a ordem editorial, o contexto e a capa de cada projeto visíveis, deixando os recursos avançados como camada opcional. Isso segue a lógica de cases narrativos: contexto, processo, solução, resultado e aprendizado [2].

### 4. Contato está bem coberto; a hierarquia deve continuar curta

WhatsApp, Telegram, Instagram, calendário, formulário e currículo oferecem cobertura suficiente. A barra flutuante e os CTAs fixos resolvem acesso durante a rolagem. Não há justificativa, nesta rodada, para bot, automação externa, feed adicional ou integração de analytics sem objetivo de negócio mensurável.

### 5. Velocidade deve ser protegida por seleção, não por remoção de personalidade

Os assets grandes devem continuar sob demanda. Vídeo em destaque pode demonstrar capacidade, mas autoplay em toda a página adicionaria custo e distração. O padrão recomendado é poster leve, lazy loading, interação sob demanda e preferência por movimento reduzido. O projeto já aplica lazy loading em imagens e content visibility em capítulos; a melhoria atual não altera esse comportamento.

## Melhorias implementadas nesta rodada

| Melhoria | Objetivo | Resultado esperado |
|---|---|---|
| Faixa “Atalhos principais” na hero | Separar intenções de visita | Menos fricção entre explorar, contratar e conversar |
| Rótulos de evidência e serviço | Dar contexto antes do clique | Mais clareza para visitantes com pouco tempo |
| Microinteração dos atalhos | Reforçar direção sem excesso | Feedback visual curto, controlado e coerente |
| Respeito a reduced motion | Evitar movimento obrigatório | A mesma estrutura funciona sem animação |
| Registro de referências | Manter decisões auditáveis | Próximas melhorias podem ser priorizadas por evidência |

## Backlog prioritário recomendado

| Prioridade | Próxima melhoria | Justificativa |
|---|---|---|
| Alta | Destacar um showreel curto ou projeto principal com poster otimizado | Evidência audiovisual imediata, alinhada ao nicho |
| Alta | Adicionar “papel / processo / resultado” aos projetos principais | Aumenta credibilidade sem inventar métricas |
| Média | Criar uma página ou estado de leitura focada em 2–3 cases | Evita que a galeria avançada seja a única forma de entender o trabalho |
| Média | Medir cliques dos três caminhos da hero | Permite otimizar conversão com dados reais, se analytics for habilitado |
| Baixa | Feed social ao vivo ou integração externa adicional | Só vale quando houver objetivo e credenciais estáveis |

## Skills avaliadas

As skills de análise financeira, ações, planilhas, vídeo generativo, Manus API, TTS, música, SimilarWeb e criação de skills não são necessárias para a melhoria implementada. Pesquisa audiovisual foi atendida por fontes profissionais e editoriais sobre portfólio; nenhuma integração externa foi criada sem necessidade funcional. A skill de PDF foi considerada anteriormente e o currículo atual já possui fluxo validado.

## Limitações

A auditoria não inventa clientes, métricas, depoimentos ou resultados. A avaliação de velocidade é estrutural e deve ser complementada por métricas reais de usuários caso o proprietário habilite analytics. Referências de terceiros são padrões de inspiração, não cópias de layout.

## Referências

[1]: https://www.screenskills.com/starting-your-career/building-your-portfolio/ "ScreenSkills — Build your portfolio"

[2]: https://ixdf.org/literature/article/how-to-write-great-case-studies-for-your-ux-design-portfolio "Interaction Design Foundation — How to Write Great Case Studies for Your UX Design Portfolio"

[3]: https://colorlib.com/wp/videographer-websites/ "Colorlib — 19 Best Videographer Websites"

[4]: https://www.journoportfolio.com/examples/videographers/ "JournoPortfolio — Videographer Portfolio Examples"

[5]: https://www.ahausten.com/ "Adam Hausten — Innovate, Create, Captivate"

[6]: https://www.jannis-grosse.com/ "Jannis Große — Journalist"
