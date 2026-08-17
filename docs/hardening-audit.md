# Auditoria de hardening — evidências iniciais

## Escopo

A auditoria foi iniciada contra o código atual, sem confiar apenas em relatórios anteriores. Até este ponto, foram inspecionadas a árvore do projeto, os imports, a arquitetura de features, as rotas, os procedures do servidor, os schemas, a documentação, os artefatos e a experiência visual em desktop e mobile.

## Evidências visuais

Em 1440 × 900, a homepage preserva a identidade Arquivo Profundo: headline editorial, linha vertical de progresso, metadados monoespaçados, contraste alto e ritmo assimétrico. A página de privacidade mantém linguagem visual coerente, com composição silenciosa e boa legibilidade.

A rota `/favoritos` é funcional e responsiva, mas apresenta maior densidade de controles e ainda se aproxima visualmente de um painel administrativo genérico. Isso foi classificado como risco visual médio, não como bloqueador funcional.

Em 375 × 812, a homepage não apresentou corte horizontal visível nem palavras truncadas. O hero reorganiza retrato, headline, descrição, CTA e barra de contato em uma sequência legível. A página de privacidade mantém quebras naturais. A rota `/favoritos` empilha exportações, busca e filtros verticalmente; o conteúdo inicial permanece utilizável, embora a densidade de controles seja alta para uma experiência pública.

## Achados provisórios

| Severidade | Achado | Evidência |
|---|---|---|
| Crítico | Nenhum bloqueador de integridade identificado no workspace atual. | `Home.tsx`, feature portfolio e imports presentes. |
| Alto | Nenhum erro de TypeScript ou import quebrado observado na auditoria inicial. | Typecheck já validado no checkpoint anterior; nova execução será feita na fase de testes. |
| Médio | `/favoritos` tem linguagem visual mais próxima de dashboard do que de arquivo editorial. | Inspeção visual em desktop e mobile. |
| Médio | `HomeExperience.tsx` permanece grande, mas concentra estados fortemente acoplados. | Tamanho e análise de imports/estado; não será dividido artificialmente. |
| Baixo | `ComponentShowcase.tsx` é grande e deve permanecer fora da navegação pública principal. | Arquivo existe como página separada; não é usado pela homepage pública. |

## Regra de decisão

Nenhuma alteração visual será aplicada somente para atender a uma nota estética. As próximas fases devem confirmar performance, SEO, segurança, privacidade, formulário e dependências; somente achados com benefício concreto serão corrigidos.

## Breakpoints adicionais

Em 414 × 896, a homepage mantém headline, retrato, descrição, CTAs e barra fixa sem corte horizontal. O segundo CTA passa para uma linha própria, preservando leitura e área de toque. Em `/favoritos`, os controles continuam empilhados e utilizáveis; a seção de campos exportáveis aparece abaixo da dobra, sem compressão perigosa.

Em 768 × 900, a homepage muda para navegação horizontal e reorganiza o hero em uma composição mais larga, sem overflow visível. A rota `/favoritos` usa a navegação lateral e distribui os filtros em três colunas; os controles permanecem legíveis. O principal ponto de atenção continua sendo a linguagem de painel administrativo, não uma falha de responsividade.

Em 1024 × 900, a homepage mantém a navegação, o hero, o retrato e as ações principais sem clipping aparente. `/favoritos` organiza exportações e filtros em largura suficiente, mas o indicador de sincronização quebra para uma linha inferior; isso é aceitável, embora confirme a densidade operacional da rota. A privacidade permanece legível em duas colunas.

A inspeção de 1440 × 900 confirmou o ritmo editorial da homepage e a coerência da privacidade. O principal desvio visual está concentrado em `/favoritos`, cuja barra lateral, nomenclatura “Navigation” e conjunto de exportações/checklists se aproximam de um dashboard genérico. O achado será considerado para correção somente se puder ser resolvido com uma alteração pequena e sem risco funcional.

## Correção aplicada após a auditoria

Foi aplicada uma correção pequena e justificada em `client/src/components/DashboardLayout.tsx`: os textos genéricos em inglês da área protegida foram traduzidos para português (`Navegação`, `Entrar`, `Sair` e o texto de autenticação), incluindo o rótulo ARIA do controle lateral. Nenhuma lógica, rota, procedure, estado ou funcionalidade foi alterada.

Deliberadamente não foi feita uma divisão adicional de `HomeExperience.tsx`, porque seus estados de filtros, URL, favoritos, gestos, teclado e lightbox permanecem fortemente acoplados. Também não foram removidas dependências, alteradas URLs públicas ou adicionadas bibliotecas; a auditoria não encontrou evidência suficiente para justificar essas intervenções.

## Validação técnica final desta rodada

A inspeção em 390 × 844 confirmou a transição estável entre os breakpoints móveis: o hero não corta palavras, a barra de contato permanece dentro da largura e `/favoritos` mantém exportações, busca e filtros acessíveis por rolagem vertical.

| Verificação | Resultado |
|---|---|
| `pnpm check` | Aprovado; TypeScript sem erros. |
| `pnpm test` | 8 arquivos e 24 testes aprovados. |
| `pnpm build` | Aprovado; Vite transformou 1.973 módulos e o bundle do servidor foi gerado. |
| Playwright público | 15 aprovados e 2 ignorados por ausência de sessão autenticada. |
| Reexecução E2E após correção | 15 aprovados; a falha de expectativa causada pela tradução foi corrigida. |
| Imports | Nenhum import quebrado no typecheck/build atual. |
| Artefatos | `dist/`, `test-results/`, `coverage/`, `node_modules/`, `.git/` e coletor de debug permanecem fora da entrega. |

## Veredito

O projeto está **tecnicamente pronto para revisão de publicação**, com ressalvas específicas: a área protegida ainda depende de uma sessão administrativa real para validar os dois cenários autenticados, e métricas reais de Core Web Vitals em produção não foram coletadas nesta rodada. Não há evidência de regressão funcional após o hardening.
