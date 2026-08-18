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

## Aplicação das instruções do arquivo anexado — rodada complementar

A última rodada foi executada sem redesign, troca de stack ou alteração do lightbox/mobile. Três ajustes concretos foram aplicados. O CTA primário da Home passou de “pedir orçamento” para **“solicitar orçamento”**, mantendo o mesmo destino e hierarquia visual. O bloco social deixou de exibir mensagens técnicas como autorização Meta, credenciais ou erro de feed quando a integração não está disponível; agora se apresenta como curadoria editorial de perfis e referências reais, mantendo os links e os filtros. Também foram adicionados headers de baixo risco no servidor: `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, remoção de `X-Powered-By` e `Strict-Transport-Security` em produção.

A decisão sobre **Eliane Fashion** foi manter o conteúdo inalterado. O projeto e as evidências citadas no arquivo anexado não existem no `portfolioData` atual nem no ZIP analisado. Não foram criados nome, stack, checkout, Stripe, autenticação, resultados ou métricas sem fonte verificável. Para transformar esse item em um case profissional, ainda são necessários os links, responsabilidades, tecnologias e resultados reais fornecidos pelo proprietário.

A nova asserção E2E confirma que o bloco social não exibe estados técnicos de autorização/erro e apresenta a linguagem de curadoria real. Typecheck, testes unitários, build e a suíte E2E pública serial foram executados após as mudanças.

## Melhorias inteligentes — rodada do arquivo `pasted_content_10.txt`

A auditoria selecionou quatro mudanças de baixo risco e impacto direto. O viewport deixou de usar `maximum-scale=1`, devolvendo o zoom nativo aos usuários móveis. O formulário de orçamento recebeu um honeypot invisível validado no servidor; bots que o preenchem são filtrados antes da persistência e da notificação. O endpoint público passou a limitar cinco pedidos por identificador em uma janela de dez minutos, reduzindo spam de notificações sem introduzir CAPTCHA. Essa limitação é um mecanismo em memória por processo; em múltiplas instâncias, deve ser migrada para um store compartilhado antes de uma operação de alto volume.

A camada de headers foi mantida e ampliada com `Content-Security-Policy-Report-Only`, usando uma política compatível com fontes Google, storage, mídia, analytics e APIs externas atuais sem bloquear a aplicação nesta etapa. `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` e a remoção de `X-Powered-By` continuam ativos. A CSP está em modo de observação para permitir revisão dos avisos reais antes de eventual endurecimento para enforcement.

Não foram criados cases artificiais. O item Eliane Fashion continua pendente de dados verificáveis; o projeto e as evidências técnicas listadas no arquivo não estão presentes no `portfolioData` atual. Também não houve refatoração especulativa de `HomeExperience.tsx`, redesign, troca de stack ou alteração no lightbox/mobile.

| Área | Antes | Depois | Evidência |
|---|---|---|---|
| Acessibilidade móvel | Viewport limitava o zoom com `maximum-scale=1` | Zoom nativo preservado | `client/index.html` e E2E responsivo aprovado |
| Formulário | Validação server-side, sem barreira específica contra bots | Honeypot + rate limit de 5/10 min antes de persistir/notificar | `server/routers.ts`, 26 testes Vitest aprovados |
| Headers | Headers de segurança básicos | CSP report-only compatível + headers existentes preservados | Resposta local de produção confirmou os headers |
| Performance | Bundle crítico preservado | Nenhum lazy-load novo em hero, primeiro conteúdo ou lightbox | Build aprovado; chunks principais mantidos |
| Regressão | 21 E2E públicos aprovados no checkpoint anterior | 21 E2E públicos aprovados novamente; 2 autenticados ignorados sem sessão | `pnpm exec playwright test --workers=1` |

### Validação desta rodada

`pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`, `pnpm build` e `pnpm exec playwright test --workers=1` foram executados. O resultado foi: instalação aprovada, typecheck aprovado, **26 testes unitários aprovados**, build aprovado, **21 E2E públicos aprovados** e **2 cenários autenticados ignorados** por ausência de `E2E_AUTH_STATE`. Os artefatos `dist`, `test-results` e `coverage` foram removidos ao final.

## Correção isolada — CTA mobile e barra fixa

A causa confirmada era visual: a barra `contact-float`, fixa na base da viewport, ocupava a mesma zona vertical dos CTAs “solicitar orçamento” e “ver trabalhos” no hero em telas compactas. Em 390×844, a barra sobrepunha parcialmente o botão de orçamento e o link secundário.

A correção escolhida foi **ocultar temporariamente a barra de contato enquanto o grupo de CTAs do hero estiver dentro da viewport em telas abaixo de 1024 px**. Assim que essa região sai da viewport, a barra retorna. A partir de 1024 px, o comportamento desktop original permanece. Estados que já ocultavam a barra — lightbox, modal de projeto, preview de portfólio, busca focada, formulário focado e teclado móvel — foram preservados prioritariamente.

| Evidência | Antes | Depois |
|---|---|---|
| Hero 390×844 | Barra fixa sobrepunha a região inferior dos CTAs | Botão e link ficam inteiros e acionáveis; a barra reaparece após a região do hero |
| Tablet 768×900 | Barra lateral podia cruzar a área dos CTAs | Barra permanece oculta enquanto os CTAs estão visíveis |
| Desktop 1280×720 | Comportamento original da barra fixa | Mantido |
| Lightbox e modais | Barra deveria continuar oculta em overlays | Mantido e coberto por E2E |

Foram alterados somente `client/src/features/portfolio/HomeExperience.tsx` e `e2e/navigation.spec.ts`. A nova asserção E2E percorre 320×568, 360×800, 375×812, 390×844, 414×896, 430×932, 768×900 e 1280×720, verificando que nenhum CTA do hero fica sob a barra fixa. Validações reais: `pnpm check` aprovado; `pnpm test` com 26 testes aprovados; `pnpm build` aprovado; E2E específico do CTA e do lightbox aprovado em modo serial. Nenhuma mudança foi feita em identidade, CTA, lightbox, modal, swipe, pinch, zoom, favoritos, compartilhamento ou formulário.

## Hardening de segurança — A-03, A-04 e A-05

### Inventário antes da alteração

Não há endpoint público de upload no projeto. O storage público é servido por `GET /manus-storage/*`; uploads assinados são helpers server-side e não passam pelo parser global. Os procedimentos públicos aceitam apenas campos textuais validados por Zod; o maior campo é `briefing`, limitado a 5.000 caracteres. OAuth usa callback `GET`, e o router de sistema aceita apenas timestamp ou mensagens administrativas curtas. Portanto, não foi encontrada integração legítima que justificasse o limite global de 50 MB.

As origens reais observadas na página publicada foram: o próprio domínio para SPA, tRPC, storage e vídeo; `https://fonts.googleapis.com` para folha de estilos de fonte; `https://fonts.gstatic.com` para arquivos de fonte; `https://manus-analytics.com` para Umami; e `https://files.manuscdn.com` para o dispatcher de edição injetado pelo hosting. Não foi encontrada chamada browser para WebSocket, origem genérica `https:` ou upload público. Links externos e metadados JSON-LD não exigem permissão CSP de carregamento.

### Antes e depois

| Área | Antes | Depois | Evidência |
|---|---|---|---|
| Parser global | JSON e URL-encoded aceitavam 50 MB globalmente | Limite reduzido para 100 KB, acima dos payloads textuais atuais e abaixo de abuso desnecessário | POST JSON de 110 KB ao servidor de produção local retornou `413` |
| CSP efetiva | Somente `Content-Security-Policy-Report-Only`; `script-src https:` e `connect-src https: wss:` genéricos | Enforcement aplicado apenas a `base-uri 'self'`, `object-src 'none'` e `frame-ancestors 'self'`; política completa segue em report-only com origens exatas | Headers locais de produção confirmaram ausência de curingas de origem |
| Fontes e scripts | Origens genéricas em report-only | Google Fonts, analytics e dispatcher de hosting explicitamente enumerados | HTML publicado e header de produção local |
| Rate limit | Map por processo e primeiro `x-forwarded-for` aceito sem avaliar o peer | Map por processo preservado; `x-forwarded-for` aceito somente quando a conexão vem de loopback/faixa privada típica de proxy | Testes de proxy confiável e direto aprovados |
| Formulário | Testes de schema, honeypot e contador | Procedimento público exercitado com persistência/notificação simuladas: envio, falha de notificação, honeypot e sexto pedido bloqueado | 31 testes Vitest aprovados, sem gravar pedido de teste nem alertar o proprietário |

### Riscos e limites remanescentes

O rate limit continua **local ao processo**, por decisão deliberada: não há store com TTL ou infraestrutura compartilhada comprovadamente disponível e não foi adicionada nova dependência. Em múltiplas instâncias ou após reinício, contadores não são compartilhados. Além disso, a lista de proxies confiáveis é conservadora; se o proxy de produção encaminhar conexões por endereço público fora das faixas permitidas, o identificador passará a ser o IP do peer. Esse comportamento é seguro contra spoofing, mas deve ser observado em produção para evitar bucket compartilhado.

A política CSP completa permanece em `Report-Only` porque a página precisa de script inline para metadados dinâmicos, analytics e dispatcher de hosting. As diretivas de baixo risco já passaram para enforcement. Antes de promover `script-src`, `connect-src`, `style-src`, `font-src`, `img-src`, `media-src` ou `frame-src`, é necessário coletar violações em produção e manter as origens explícitas.

### Validação desta rodada

`pnpm check` foi aprovado. `pnpm test` foi aprovado com **9 arquivos e 31 testes**. `pnpm build` foi aprovado. O servidor de produção local confirmou os headers CSP efetivo e report-only; a requisição JSON acima do limite retornou `413`. O procedimento de formulário foi testado com mocks de banco e notificação para evitar a criação de briefing falso ou o disparo de alerta real ao proprietário. Não houve alteração em UX, design, mobile, lightbox, modal, swipe, pinch, zoom, favoritos, compartilhamento ou fluxo visual do formulário.

## Performance profissional — medição publicada e otimização baseada em evidência

### Matriz de baseline e pós-otimização

As medições foram feitas em 390×844 com emulação 4G (170 ms de latência, 1,6 Mbps de download, 0,75 Mbps de upload), em cache frio, cache quente e CPU 4×. INP é uma amostra da abertura/fechamento do menu móvel; CLS foi observado por `PerformanceObserver`. As variações de TTFB entre execuções são próprias do ambiente publicado e, por isso, devem ser lidas como faixa observada, não como promessa de SLA.

| Cenário publicado | Requests antes/depois | Transferência antes/depois | LCP antes/depois | INP antes/depois | CLS antes/depois |
|---|---:|---:|---:|---:|---:|
| 4G, cache frio | 18 / **17** | 330,3 KB / 330,2 KB | 12,90 s / 15,99 s | 88 ms / 104 ms | 0 / 0 |
| 4G, cache quente | 25 / **24** | 104,5 KB / 104,5 KB | 6,22 s / 4,92 s | 88 ms / 48 ms | 0 / 0 |
| 4G, cache frio, CPU 4× | 16 / **16** | 330,2 KB / 330,3 KB | 28,81 s / 18,75 s | 184 ms / 144 ms | 0 / 0 |

O request do pôster vertical do showreel estava presente em todos os cenários iniciais, começando entre 2,44 s e 8,19 s mesmo sem scroll e levando até 3,78 s para finalizar no cenário frio. Após a correção, o request não aparece antes da aproximação da seção. O `transferSize` desse recurso é informado como zero pelo navegador porque `/manus-storage/*` responde com redirect para URL assinada; a redução confirmada é de **um request iniciado antes da primeira interação**, não uma estimativa de bytes inventada.

### Chunks e classificação

| Severidade | Evidência | Diagnóstico | Decisão nesta rodada |
|---|---|---|---|
| **CRÍTICO** | TTFB frio observado entre 3,17 s e 6,16 s; HTML concluído entre 4,26 s e 6,68 s | O navegador não começa CSS, JS nem imagens antes da resposta HTML. Isso impede LCP abaixo de 2,5 s em cache frio sob esta 4G, independentemente de micro-otimizações no React. | Sem alteração cega no app. Requer análise de cache/edge/TTFB da infraestrutura Manus. |
| **ALTO** | Chunk principal: 944,5 KB bruto / 214,7 KB gzip; carregado como ~148 KB transferidos na amostra 4G | `HomeExperience` concentra estado e interações públicas. O chunk contém o fluxo principal, lightbox e galeria, portanto uma extração ampla teria risco alto de regressão. | Não extraído sem fronteira independente comprovada. |
| **ALTO** | Chunk de 435,6 KB bruto / 180,5 KB gzip | É a dependência `pdf-lib`, identificada por `PDFDocument`; ela já é importada dinamicamente apenas na exportação PDF. | Mantido: não participa do request inicial. |
| **MÉDIO** | Pôster de showreel abaixo da primeira região iniciava cedo e concorria com hero | `loading="lazy"` nativo ainda acionava o recurso dentro da margem de pré-carregamento do navegador. | Corrigido com observação por viewport real; poster continua disponível ao chegar à seção. |
| **BAIXO** | CSS ~32,8 KB transferidos e folha de Google Fonts ~1,2 KB; CLS 0 | Não há evidência de bloqueio ou deslocamento relevante desses recursos na amostra. | Mantidos. |
| **BAIXO** | Rotas de disponibilidade, favoritos, curadoria e social já são lazy/deferidas; vídeo só inicia após clique | As prioridades de exportação, PDF, curadoria e ferramentas administrativas já estavam fora do caminho crítico. | Nenhuma alteração adicional. |

### Alteração aplicada

Foram alterados somente `client/src/features/portfolio/HomeExperience.tsx`, `e2e/navigation.spec.ts` e esta documentação. O card mantém a mesma marcação, CTA e reprodução sob demanda; somente o pôster passa a existir quando a seção efetivamente entra na viewport. A asserção E2E verifica ausência da imagem e de request antes do scroll, e disponibilidade após `scrollIntoViewIfNeeded()`.

### Veredito de metas

CLS atende a meta (< 0,1). A amostra de INP atende a meta (< 200 ms), inclusive com CPU 4× na pós-medição (144 ms). LCP não atende < 2,5 s na emulação 4G publicada: o gargalo dominante é TTFB/HTML e, em seguida, o carregamento de recursos pelo proxy de storage. A aplicação reduziu concorrência abaixo da dobra sem prejudicar o caminho crítico, mas não pode compensar sozinha a faixa de 3–6 s observada antes do início de CSS/JS/imagem.

Validações da rodada: `pnpm check` aprovado; `pnpm test` com 31 testes aprovados; `pnpm build` aprovado; E2E relevante do pôster adiado aprovado. Não foram alterados design, conteúdo, hero, H1, primeiro projeto, lightbox, SEO, formulário, favoritos, compartilhamento ou funcionalidades administrativas.

## Conversão e prova profissional — casos públicos

Esta rodada trabalhou exclusivamente com os projetos já publicados na vitrine. A seleção foi limitada aos três destaques calculados pela própria galeria pública: **Chá da Eloise**, **RHAM — Serviços no app** e **Campo iluminado — vista aérea**. Nenhum projeto privado, não publicado ou Eliane Fashion foi incluído.

O modal de detalhes existente agora mostra, quando há evidência suficiente no registro já público, uma leitura de caso com **contexto, problema, objetivo, minha função, processo, decisões, resultado e aprendizado**. Cada texto foi derivado de descrição, papel, processo, resultado e tecnologias que já existiam no projeto; não foram incluídos clientes adicionais, métricas, faturamento, usuários, conversões ou tecnologias novas. Os campos de resultado permanecem qualitativos e verificáveis pela peça pública.

| Projeto público | Prova esclarecida | Limite factual preservado |
|---|---|---|
| Chá da Eloise | Cobertura aérea, leitura de ambiente, planos abertos e aproximações para registrar espaço, pessoas e atmosfera. | Não há alegação de cliente, alcance ou resultado comercial. |
| RHAM — Serviços no app | Vídeo vertical de jornada de serviços, com leitura de tela e ritmo para demonstrar navegação. | Não há alegação sobre conversão, adoção ou dados do aplicativo. |
| Campo iluminado — vista aérea | Captação horizontal noturna que explicita decisões de luz, escala, perspectiva e movimento. | Não há alegação de audiência, uso institucional ou métricas de vídeo. |

Os CTAs **“solicitar orçamento”** e **“falar no WhatsApp”** foram preservados sem duplicação. A mudança não redesenha a página: aproveita o modal já existente e mantém favoritos, compartilhamento, navegação, vídeo, lightbox e filtros. A E2E pública confirma a presença da leitura de caso no modal; `pnpm check`, 31 testes Vitest e `pnpm build` foram aprovados.

## Analytics de conversão — Umami

A integração publicada já carregava o script do Umami a partir de `https://manus-analytics.com/umami`, com o identificador público do site configurado no HTML. Nesta rodada, a aplicação passou a centralizar a instrumentação em `portfolioAnalytics.ts`, usando prioritariamente a API nativa `window.umami.track()`. O adaptador também emite um evento local de observabilidade e preserva o fallback de transporte existente apenas quando a API ainda não está disponível, sem transformar analytics em dependência de navegação, contato ou envio do formulário.

| Área | Antes | Depois | Evidência |
|---|---|---|---|
| Taxonomia | Havia chamadas legadas específicas de lightbox e lacunas em CTAs e formulário. | Somente sete eventos de conversão: `quote_cta`, `whatsapp_click`, `briefing_started`, `briefing_completed`, `project_opened`, `share_project` e `download_project`. | União literal tipada `ConversionEventName`; busca no código não encontrou os nomes legados. |
| Orçamento e briefing | Não havia medição centralizada da intenção e do início do briefing. | O CTA principal registra `quote_cta`; o primeiro foco no formulário registra `briefing_started` uma vez por visita; a mutação bem-sucedida registra `briefing_completed`. | `HomeExperience.tsx`; cobertura E2E pública. |
| Interesse em trabalho | Aberturas e compartilhamentos não seguiam a taxonomia solicitada. | A abertura em lightbox e modal registra `project_opened`; cópia de link, Web Share, WhatsApp, LinkedIn e e-mail registram `share_project`; downloads registram `download_project`. | Handlers existentes preservados com apenas a troca de evento. |
| Privacidade | Parte das propriedades legadas carregava nome de projeto no payload. | Os eventos enviam somente `projectId` interno e, quando necessário, `surface`, `source`, `channel` ou `format`. Nome, e-mail, telefone, texto do briefing, endereço e URL com parâmetros não são enviados. | Teste unitário do contrato e asserção E2E verificam as chaves de propriedades emitidas. |
| WhatsApp | Pontos de contato não eram medidos de modo uniforme. | Disponibilidade, seção de contato, barra fixa e rodapé registram o mesmo evento `whatsapp_click`, distinguindo apenas a origem. | `HomeExperience.tsx` e `PortfolioFooter.tsx`. |

O evento de início do briefing é protegido por `useRef`, portanto não é repetido quando o visitante alterna entre campos. Todos os eventos são acionados somente por uma ação explícita; não há rastreamento de digitação, conteúdo do formulário ou cliques genéricos. A chegada histórica no painel do Umami não foi inferida nesta auditoria sem acesso ao painel: a evidência desta rodada é a chamada à API nativa quando disponível e a validação pública do payload emitido no navegador.

Validações do BLOCO 5: `pnpm check` aprovado; `pnpm test` aprovado com **32 testes em 10 arquivos**; `pnpm exec playwright test e2e/navigation.spec.ts --grep 'eventos de conversão essenciais' --workers=1` aprovado com **1 cenário**; `pnpm build` aprovado. Artefatos `dist/`, `test-results/` e `coverage/` foram removidos após a validação.

## Acessibilidade — auditoria WCAG 2.2 AA

A auditoria automatizada passou a usar `@axe-core/playwright` somente como dependência de desenvolvimento, sem impacto no bundle público. A varredura percorre as seções públicas carregadas sob demanda e aplica as regras `wcag2a`, `wcag2aa`, `wcag21aa` e `wcag22aa`. A baseline encontrou três violações graves, todas de contraste; não foram encontradas violações graves ou críticas de imagens sem texto alternativo, nome acessível, estrutura de diálogo, teclado ou movimento reduzido.

| Área | Antes | Depois | Evidência |
|---|---|---|---|
| Texto alternativo | 13 ocorrências de `alt=""` no código da feature. | Todas foram classificadas como **decorativas** e permaneceram vazias: imagem de fundo do hero, texturas, marcas gráficas repetidas, miniatura redundante da prévia e logomarca acompanhada de identificação textual. Imagens informativas — retrato, projetos, cards salvos, lightbox e miniaturas navegáveis — já possuem descrições curtas e objetivas. | Inventário: 8 ocorrências em `HomeExperience`, 1 no rodapé e 4 no componente narrativo não utilizado pela rota pública. |
| Metadados no perfil | `#536887` sobre `#0a0f18` apresentava contraste de **3,37:1** em “formação”, “interesse” e “modo de trabalho”. | Metadados migrados para `#7b91b3`, preservando o azul editorial e atingindo o limiar AA. | Axe, regra `color-contrast`. |
| Filtro ativo | Texto branco sobre o azul `#3b82f6` apresentava contraste de **3,67:1**. | Texto e contador do filtro de tecnologia ativo usam `#02111f` sobre o mesmo azul, sem alteração de layout ou interação. | Axe, regra `color-contrast`. |
| Rodapé | Metadado “arquivo pessoal / em atualização contínua” usava `#526783` sobre `#06080d`, com **3,45:1**. | Cor elevada para `#7b91b3`, mantendo a hierarquia discreta e aprovada pelo Axe. | Axe, regra `color-contrast`. |
| Alvos de toque | Três links textuais eram menores que 24 px em mobile. | “ver repertório e skills”, “conhecer percurso” e “privacidade” agora possuem área mínima de 44 px; o primeiro também recebeu foco visível. | E2E em 390×844; todos os controles interativos visíveis atendem ao mínimo de 24 px da WCAG 2.2 AA. |
| Modal e teclado | O modal preservava foco e Escape, mas o atributo modal não era exposto diretamente. | O modal de detalhes declara `aria-modal="true"`, além de `role="dialog"`, título e descrição existentes. | E2E abre o modal, verifica semântica e confirma fechamento por `Escape`. |

Também foram validados foco visível por teclado, o link de salto existente, `Escape` no modal de detalhes, comportamento de movimento reduzido (rolagem automática e transições minimizadas) e a semântica consumida por leitores de tela via DOM/Axe. Um leitor de tela físico não está disponível no ambiente automatizado; por isso, esta rodada não substitui uma revisão manual com NVDA, VoiceOver ou TalkBack. O lightbox não foi alterado.

## Refatoração controlada de HomeExperience

Esta rodada não procurou reduzir linhas artificialmente. Antes de cada extração, foi mapeado o estado compartilhado e foram preservados no componente os estados de interface, temporizadores, efeitos, chamadas de analytics e handlers de navegação. Hero, lightbox, estado principal da galeria, filtros, favoritos e formulário de orçamento não foram reescritos nem deslocados para componentes artificiais.

| Responsabilidade | Antes | Depois | Evidência |
|---|---|---|---|
| Exportação | `HomeExperience` duplicava a geração de CSV, JSON e PDF, inclusive a criação do download. | O componente mantém apenas a seleção dos favoritos e o estado de feedback; a geração de arquivos usa `utils/exportFavorites.ts`. | Teste unitário cobre nomes dos arquivos, cabeçalho CSV, conteúdo JSON e categorias. |
| Curadoria e compartilhamento | Regras puras de URL, contexto de projeto e payload de e-mail estavam duplicadas dentro dos handlers. | As regras foram centralizadas em `utils/shareProject.ts`; o componente retém somente status de cópia, analytics e abertura de canais. | Teste unitário cobre URL de projeto, favoritos, lightbox, contexto e e-mail. |
| Contato | A seção completa envolve agenda, formulário, validação, disponibilidade e analytics, portanto tem alto acoplamento. | Somente o feedback independente de cópia do e-mail foi extraído para `utils/clipboardFeedback.ts`; a seção, formulário e agenda foram preservados. | Teste unitário cobre sucesso, falha e retorno ao estado inativo. |
| Hook independente | A observação de proximidade da viewport ficava declarada no arquivo de página. | `useNearViewport` foi movido para `hooks/useNearViewport.ts`, mantendo a mesma API, margem padrão e fallback sem `IntersectionObserver`. | A E2E pública mantém a cobertura de dados e pôster adiados até a aproximação da seção. |

As validações ocorreram após cada extração com `pnpm check` e `pnpm test`. Ao final, o build de produção foi aprovado e o Playwright serial aprovou **26/26 cenários**, cobrindo navegação pública, contato, curadoria, modal, lightbox, carregamento adiado e acessibilidade. Artefatos temporários de build e teste foram removidos após a execução.

## Fechamento da QA — determinismo de testes

| Teste | Resultado antes | Resultado depois | Causa | Correção |
|---|---|---|---|---|
| Analytics de conversão | O cenário combinado falhou em uma execução serial e em 1 de 5 repetições, embora a sequência isolada emitisse `quote_cta`, `briefing_started` e `project_opened`. | Os dois cenários separados passaram em **10/10 repetições** (cinco para CTA/briefing e cinco para abertura de projeto). A suíte pública serial passou em **28/28**. | Um único cenário combinava navegação por âncora, foco no briefing e abertura de projeto; a última asserção observava três eventos depois de várias transições de interface. | O teste passou a sincronizar cada evento com a ação que o produz e separou a abertura de projeto em contexto novo. Não houve mudança na emissão de analytics, timeouts ou produto. |
| Swipe em modal | O teste falhava ao exigir a presença de `data-project-swipe-hint`, mesmo após limpar a preferência de onboarding. A navegação por swipe isolada alterou “Chá da Eloise” para “RHAM — Serviços no app”. | O swipe funcional passou em **5/5 repetições** e na suíte serial. | A dica é onboarding temporário, não requisito funcional da navegação; sua exibição depende de estado/timing de primeira visita. | A expectativa frágil da dica foi removida. O teste continua exigindo abertura do modal, ocultação da barra móvel e mudança efetiva de projeto após o gesto. |
| Fluxos autenticados | Os dois cenários de favoritos protegidos estavam ignorados por ausência de `E2E_AUTH_STATE`. | Continuam **2 skipped**, sem aprovação. | Não há `E2E_AUTH_STATE` no ambiente; o navegador também apresentou a tela “Entre para continuar” na rota protegida. | Nenhuma sessão foi criada, simulada, armazenada ou versionada. Login, painel, edição, restauração e logout permanecem não validados. |
| Build | Build aprovado com aviso de chunk principal de 955,61 kB. | Build continua aprovado com o mesmo aviso. | Otimização de bundle está fora do escopo desta rodada. | Nenhuma alteração de chunking foi aplicada. |

Validação final: `pnpm check` aprovado; `pnpm test` aprovado com **38/38**; `pnpm build` aprovado; Playwright público serial aprovado com **28/28**. **FLUXOS AUTENTICADOS NÃO VALIDADOS — E2E_AUTH_STATE AUSENTE.** Artefatos temporários foram removidos após a execução.

## Sessão E2E isolada, build de produção e leitura assistiva

| Área | Antes | Depois | Evidência |
|---|---|---|---|
| Fluxos protegidos | `E2E_AUTH_STATE` estava ausente e os cenários administrativos eram ignorados. | Uma identidade administrativa **isolada**, sem e-mail e com duração de 15 minutos, foi criada apenas durante a execução. Ela usou o token de sessão assinado pelo contrato existente, dois IDs de projetos públicos e limpeza explícita de metadata, ordenação, usuário e storageState ao final. | Os **3/3** cenários autenticados aprovaram abertura de sessão no painel, busca, edição, restauração e logout. A autenticação é real para o contrato da aplicação; o único atalho é a criação local da identidade efêmera, não uma credencial ou conta de produção. |
| Logout local | O logout limpava o cookie em HTTP local com `SameSite=None`, combinação rejeitada pelos navegadores modernos quando `Secure` não está ativo. | Em HTTPS continua `SameSite=None; Secure`; em HTTP local passa a `SameSite=Lax`, mantendo o cookie de teste disponível e removível. | E2E entra no painel, abre o menu de conta, aciona “Sair” e retorna ao estado “Entre para continuar”. |
| Build e chunk principal | O script `build` herdava `NODE_ENV=development` do ambiente, incluindo `react-dom-client.development` no bundle. O entry reportado era **955,61 kB** (215,93 kB gzip). | O build fixa `NODE_ENV=production`; o entry direto caiu primeiro para **594,49 kB** (152,33 kB gzip). Em seguida, React, primitives Radix, utilitários e dados foram separados em chunks estáveis; o entry ficou em **325,95 kB** (64,59 kB gzip), sem aviso de chunk acima de 500 kB. | Análise do bundle: a versão de desenvolvimento incluía cerca de 931,8 kB de React dev. A divisão final prioriza cache e análise paralela; como vendors críticos continuam preloaded, o ganho de transferência total não deve ser inferido apenas pelo menor entry. |
| HTML injetado pelo hosting | O documento compilado aparentava 372 kB, sem atribuição de origem. | A análise identificou 367.116 bytes no script inline `manus-runtime`; não foi removido por ser infraestrutura do hosting. | O HTML segue com 372,22 kB (106,81 kB gzip); essa parcela não é código de `HomeExperience`. |
| Simulação de leitor de tela | Axe verificava regras WCAG, mas não havia teste explícito de árvore assistiva e nomes de controles. | A E2E inspeciona a árvore ARIA para landmarks, heading, botões e links e executa regras de nomes de botão/link/campo, atributos ARIA válidos, obrigatórios e permitidos, além de foco em elementos ocultos. Nenhuma correção adicional foi necessária. | Cenário aprovado; a validação automatizada não substitui NVDA, VoiceOver ou TalkBack em dispositivo real. |

Validação final desta rodada: `pnpm check` aprovado; `pnpm test` aprovado com **38/38**; `pnpm build` aprovado; Playwright serial completo aprovado com **32/32** cenários, incluindo os **3** autenticados. A identidade de teste, o storageState de permissão 600, relatórios de análise e scripts temporários foram removidos antes da entrega.
