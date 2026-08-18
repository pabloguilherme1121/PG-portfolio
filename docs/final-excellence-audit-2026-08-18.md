# Auditoria final de excelência — Pablo Guilherme

**Identidade auditada:** Arquivo Profundo  
**Domínio publicado:** https://pabloguilh-jhcmnkrj.manus.space/  
**Data:** 18 de agosto de 2026  
**Escopo:** performance, UX, mobile, acessibilidade, SEO, conversão, social, curadoria, segurança e regressão técnica.

## Síntese executiva

O portfólio está tecnicamente consistente e publicado com uma identidade própria, fluxo de contratação compreensível, galeria pública funcional, cases editoriais, showreel sob demanda, lightbox robusto, favoritos, exportação e tratamento seguro de erros. A preservação do lightbox, modal audiovisual, navegação, gestos, temas e barra de contato foi confirmada nesta rodada.

A principal ressalva é de performance de produção: o domínio público continua apresentando uma diferença grande entre preview local e navegador publicado sob 4G severamente limitado. A investigação identificou o fallback textual de carregamento da rota inicial como elemento LCP intermediário e a alteração aplicada passou a priorizar a Home pública no bundle inicial. Entretanto, a medição local pós-alteração não produz um LCP comparável porque o ambiente local não reproduz integralmente o edge, o storage e o cold start publicados. Portanto, não é correto declarar LCP < 2,5 s em aparelho real sem nova medição de campo.

## Alteração aplicada nesta sessão

Antes, a rota pública inicial era carregada atrás de uma fronteira de `lazy()` e de um fallback de viewport inteiro com a mensagem “carregando agenda...”. A Home pública passou a ser importada de forma prioritária em `client/src/App.tsx`; as rotas administrativas e secundárias continuam com carregamento tardio. Nenhuma funcionalidade, identidade visual, lightbox, modal, navegação ou interação foi removida.

A alteração foi medida antes e depois com a matriz mobile local em 4G simulado e validada com typecheck, Vitest, build e Playwright serial. A matriz local não deve ser interpretada como RUM: o `vite preview` não expõe todos os recursos de storage e não é equivalente ao domínio publicado.

## Tabela antes/depois/evidência

| Área | Antes | Depois | Evidência |
|---|---|---|---|
| Carregamento da Home | Home atrás de `lazy()` e fallback de viewport inteiro; o fallback foi observado como LCP intermediário na auditoria fria | Home importada de forma prioritária no roteador público | `client/src/App.tsx`; inspeção do DOM/LCP e build pós-alteração |
| FCP publicado | Aproximadamente 5.112 ms na amostra publicada anterior | Não há medição publicada pós-checkpoint nesta sessão | `docs/performance-seo-report.md`; nova medição publicada deve ser feita após o checkpoint |
| LCP publicado | Relatório anterior registrou comportamento elevado sob 4G severamente limitado; a amostra não é RUM | Ainda não comprovado abaixo de 2,5 s | Não declarar conformidade sem aparelho real, cache frio/quente e CPU limitada |
| Transferência inicial local | Aproximadamente 1,33 MB e 9–12 requests na matriz local pós-alteração | Mantida a separação de chunks; disponibilidade e social seguem adiados por proximidade | `scripts/final-mobile-matrix.mjs`; resultado pós-alteração de 18/08 |
| CLS | Aproximadamente 0,05 na auditoria anterior | Sem regressão observada; matriz local pós-alteração registrou CLS 0 | Matriz local pós-alteração; imagens com dimensões e mídia contida |
| INP | Amostra anterior sob ambiente severamente limitado chegou a aproximadamente 952 ms | Não comprovado <200 ms em dispositivo físico | Medição headless não substitui interação real; risco permanece de performance de execução em aparelhos de entrada |
| Mobile | Correções de overflow, safe-area, clipping e controles do lightbox já aplicadas | Preservadas; E2E público cobriu 320–430 px, 768 px e desktop | Playwright serial: 21 aprovados; cenário de lightbox multi-viewport aprovado |
| Lightbox | Já corrigido para imagens 9:16, 4:5, 1:1, 4:3 e 16:9 | Não alterado nesta rodada | E2E de proporções e navegação; CSS com `max-width: 100%`, `max-height: 100%`, `object-fit: contain` |
| Cases | Cartões com contexto, decisões e aprendizado; alguns ainda não têm resultado mensurável factual | Nenhum resultado foi inventado; cases permanecem honestos, mas não equivalem a estudos de caso longos | Conteúdo em `portfolioData`; falta de métricas verificáveis impede afirmar resultado quantitativo |
| Conversão | CTAs existentes para orçamento, WhatsApp, Telegram e Instagram | CTA primário “Pedir orçamento” permanece claro; WhatsApp é caminho secundário | Texto publicado e E2E de contato/status |
| Social | Feed dinâmico depende de credencial Meta; fallback real existia | Mantido como repertório estático honesto, sem posts simulados nem estado técnico exposto como se fosse feed ativo | `InstagramRepertoire.tsx`, `server/routers.ts`, `instagramFeed` em estado `credentials_required` |
| SEO | Title, description, canonical, OG, Twitter, JSON-LD, robots e sitemap já presentes | Preservados e confirmados | E2E público de canonical/robots/sitemap; `client/index.html`, `server/seo.ts` |
| Segurança | Secrets removidos do pacote-fonte; validação Zod server-side; headers básicos publicados | Preservados; nenhum secret foi adicionado | `docs/security-production-audit.md`, `server/routers.ts`, headers publicados com HSTS e `nosniff` |
| Testes | Suite pública anterior validada em rodadas anteriores | `pnpm check`, `pnpm test`, `pnpm build` aprovados; Playwright serial 21 aprovados e 2 autenticados ignorados sem sessão | Saída real da execução de 18/08; teste isolado de PDF passou |

## Performance e renderização

A decomposição anterior mostrou que o TTFB observado no ambiente local é baixo, enquanto a espera até HTML e a pintura são dominadas pelo throttling artificial, pelo CSS/fontes e pelo tempo de execução/hydration em navegador headless. No domínio publicado, a resposta HTML também recebeu `Cache-Control: no-cache, no-store, must-revalidate`, além de HSTS e `X-Content-Type-Options: nosniff`. A política de não armazenamento pode contribuir para repetição de custo de HTML, mas não foi alterada nesta rodada porque a política de cache precisa ser decidida junto do comportamento de autenticação e da infraestrutura edge.

A matriz local pós-alteração registrou, em 390×844 com 4G simulado, TTFB próximo de 1 ms no servidor local, HTML em aproximadamente 5,4 s, first paint em aproximadamente 4,1 s, 9 requests e 1.331.498 bytes observados. Esses números são úteis para regressão local, mas não medem o domínio publicado. O LCP apareceu como `null` nessa matriz porque o servidor local não reproduziu integralmente todos os recursos do storage; isso é uma limitação de instrumentação, não uma aprovação de Core Web Vitals.

As oportunidades de maior relação ganho/risco são: medir novamente o domínio publicado com cache frio e quente; avaliar cache seguro do HTML público no edge; e substituir ou reduzir o CSS/fontes bloqueantes apenas depois de confirmar o waterfall em dispositivo real. A alteração de cache não foi aplicada automaticamente por envolver política de infraestrutura e autenticação.

## UX, cases e conversão

O fluxo editorial está presente: **identidade → prova → case → serviço → contato**. A Home apresenta quem é Pablo, o repertório técnico/audiovisual, provas visuais, serviços de drone/captação/conteúdo, disponibilidade e formulário de briefing. A contratação pode começar por “Pedir orçamento” e seguir por WhatsApp ou Telegram.

Os cases são honestos e utilizam contexto, papel, processo, stack e aprendizado disponíveis nos dados do projeto. Não há métricas de negócio ou depoimentos fabricados. A melhoria futura de maior valor é transformar os dois ou três cases com maior evidência em páginas detalhadas com problema, contexto, decisões, execução e resultado verificável, mediante fornecimento de dados reais pelo proprietário.

## Acessibilidade e mobile

A implementação mantém skip link, foco visível, navegação por teclado, Escape em modais, foco gerenciado, `aria-live`, rótulos ARIA, estados de carregamento, `prefers-reduced-motion`, safe-area e áreas de toque adequadas. Os E2E públicos validaram ausência de overflow horizontal e uso do lightbox em viewports de 320×568, 360×800, 375×812, 390×844, 414×896, 430×932, 768×900 e larguras desktop, além de cinco proporções de imagem.

A conformidade WCAG 2.2 AA foi tratada como objetivo de implementação, mas não deve ser declarada como certificação formal: ainda faltam auditoria manual com leitor de tela, contraste completo de todos os estados e teste em aparelhos físicos. O risco residual mais relevante é a carga cognitiva das ações avançadas do lightbox, mitigada pelo agrupamento em “mais ações”.

## SEO e segurança

O SEO técnico está em condição adequada para publicação: title factual, descrição regionalizada, canonical dinâmico, Open Graph/Twitter com URLs absolutas, JSON-LD `Person`, `robots.txt`, `sitemap.xml` e exclusão das rotas privadas de favoritos. A rota de erro 404 é amigável e o ErrorBoundary não expõe stack em produção.

O pacote não inclui `.project-config.json`, `.env` real, `dist`, `test-results`, `coverage` ou logs de execução. O `.env.example` contém somente nomes de variáveis. A validação server-side do briefing usa Zod com limites de comprimento e formato de data. Os headers publicados confirmados foram HSTS e `X-Content-Type-Options: nosniff`; não foi observada CSP, `Referrer-Policy` ou `Permissions-Policy` na amostra. Recomenda-se adicionar esses headers em uma rodada dedicada, depois de verificar compatibilidade com storage, OAuth e embeds.

A proteção anti-spam do formulário não está comprovada como rate limiting ou honeypot server-side. Como o briefing é público, essa é uma pendência de segurança operacional de prioridade média. Não foi aplicada agora para não misturar escopo sem medir o impacto no fluxo.

## Resultado dos comandos

| Comando | Resultado real |
|---|---|
| `pnpm install --frozen-lockfile` | Aprovado; instalação reproduzível |
| `pnpm check` | Aprovado; `tsc --noEmit` sem erros |
| `pnpm test` | Aprovado; 8 arquivos e 24 testes |
| `pnpm build` | Aprovado; Vite e bundle server concluídos; aviso não bloqueante de chunks grandes |
| `pnpm exec playwright test` paralelo | Instável no ambiente por crash de páginas/pressão de memória |
| `pnpm exec playwright test --workers=1` | Aprovado para os cenários públicos: 21 passed, 2 skipped por ausência de `E2E_AUTH_STATE`; duração aproximada de 6 minutos |
| E2E de exportação PDF isolado | Aprovado; 1 passed |

Os 2 testes ignorados são os fluxos autenticados de gestão. Eles não foram falsamente marcados como aprovados: exigem uma sessão real em `E2E_AUTH_STATE`.

## Arquivos alterados nesta sessão

| Arquivo | Alteração |
|---|---|
| `client/src/App.tsx` | Home pública deixou de ser lazy-loaded; rotas secundárias continuam sob carregamento tardio |
| `todo.md` | Registro das medições, validações e pendências desta sessão |
| `docs/final-excellence-audit-2026-08-18.md` | Este relatório |

## Problemas restantes e prioridades

A prioridade crítica é repetir a medição no domínio publicado com cache frio/quente, 4G realista e CPU 4×, registrando TTFB, LCP element, CSS, JS, hydration, imagem e waterfall. A prioridade alta é confirmar a causa do atraso de HTML/pintura no edge e decidir uma política segura de cache do HTML público. A prioridade média é adicionar proteção anti-spam server-side e headers CSP/Referrer-Policy/Permissions-Policy após teste de compatibilidade. A prioridade de conteúdo é completar cases somente com resultados fornecidos pelo proprietário.

## Veredito

> **PRODUÇÃO COM RESSALVAS.**

O código passa typecheck, testes unitários, build e E2E público serial; a alteração de prioridade da Home é pequena e preserva as funcionalidades principais. O portfólio pode permanecer publicado, mas não deve ser apresentado como comprovadamente dentro de LCP < 2,5 s em mobile real até a nova medição publicada. Também permanece pendente a execução dos E2E autenticados com uma sessão real e a confirmação de anti-spam e headers de segurança adicionais.

## Matriz publicada adicional — cache frio/quente e CPU 4×

A medição publicada foi executada em 390×844, com 4G simulado, usando o domínio publicado. O cenário frio é mais representativo de primeira visita; o cenário quente mostra a variação após a navegação anterior. A instrumentação reporta bytes de cache como zero nos cenários quentes, portanto o tamanho transferido quente não deve ser comparado literalmente com a transferência fria.

| Cenário | TTFB | HTML | First Paint | FCP | LCP | Elemento LCP | JS observado | CSS observado | Tasks | CLS | INP |
|---|---:|---:|---:|---:|---:|---|---:|---:|---:|---:|---:|
| Frio, CPU 1× | 638 ms | 1.174 ms | 6.756 ms | 7.180 ms | 8.908 ms | H1 “Aprendendo a construir…” | 199.057 B | 32.373 B | 4,78 s | 0,050 | 40 ms |
| Quente, CPU 1× | 922 ms | 1.660 ms | 1.708 ms | 2.612 ms | 9.176 ms | imagem de retrato profissional AVIF | cache | cache | 6,22 s | 0 | indisponível |
| Frio, CPU 4× | 950 ms | 707 ms | 2.816 ms | 4.300 ms | 5.872 ms | span “Pablo Guilherme” | 198.923 B | 32.373 B | 6,80 s | 0,033 | 24 ms |
| Quente, CPU 4× | 367 ms | 647 ms | 10.604 ms | 10.684 ms | 17.228 ms | imagem de retrato profissional AVIF | cache | cache | 12,16 s | 0 | indisponível |

O elemento LCP não é constante: em cache frio e CPU normal é o H1; em cache quente e nos cenários com imagem pronta mais tarde, é o retrato; em CPU 4× fria, é o nome do cartão de perfil. Isso confirma que o problema é composto por rede/edge, execução e mídia crítica, não por um único seletor CSS. Em todos os quatro cenários há dois recursos render-blocking identificados: a folha de fontes do Google e o CSS principal.

A leitura crítica é: TTFB publicado variou de aproximadamente 367 a 950 ms; o JS medido em frio foi aproximadamente 199 KB; o CSS foi aproximadamente 32 KB; CLS permaneceu abaixo de 0,1; e INP ficou abaixo de 200 ms nos cenários em que houve interação observável. O objetivo de LCP < 2,5 s não foi atingido nesta medição severamente limitada. A intervenção de maior retorno e menor risco continua sendo reduzir a variabilidade do HTML/edge e medir a rota de storage das imagens críticas; remover o retrato ou alterar a identidade visual não é recomendado sem um asset substituto aprovado.

## Waterfall textual e classificação

A sequência comum observada foi: resposta HTML/TTFB; fontes e CSS bloqueantes; JavaScript inicial e chunks Home; imagens críticas do cartão/hero; execução/hydration; analytics não bloqueante. A imagem de retrato e o mark foram recursos longos em alguns cenários, com início depois do JS e conclusão vários segundos mais tarde. Analytics, Amplitude e Plausible foram classificados como não bloqueantes e não são candidatos prioritários para explicar o LCP renderizado.

| Gargalo | Severidade | Evidência | Intervenção recomendada |
|---|---|---|---|
| Variabilidade de TTFB e HTML no domínio publicado | Crítico | TTFB de 367–950 ms e HTML de 647–1.660 ms na matriz publicada | Medir edge/cache e definir política segura de cache para HTML público |
| Imagens críticas do cartão de perfil | Alto | Retrato apareceu como LCP em cenários quentes e teve conclusão tardia | Validar storage/CDN, `Content-Length`, cache e formato entregue antes de trocar o asset |
| CSS/fontes render-blocking | Médio | Dois recursos blocking em todos os cenários | Auditar preload/subset de fontes e CSS crítico após confirmação de waterfall de campo |
| Execução/hydration sob CPU 4× | Médio | Tasks de 6,80–12,16 s; script 0,72–0,84 s medido no navegador | Profiling de aparelho real antes de refatorar HomeExperience |

As três intervenções de melhor relação ganho/risco são, portanto, **(1)** corrigir a variabilidade de cache/edge do HTML público, **(2)** validar e otimizar a entrega CDN da imagem de retrato crítica sem trocar a identidade, e **(3)** revisar preload/subset de fontes e CSS crítico. A terceira não foi aplicada nesta rodada por risco de alteração visual e por falta de confirmação em aparelho físico.
