# Relatório de performance e SEO — Arquivo Profundo

**Projeto:** Pablo Guilherme — Arquivo Profundo  
**Versão publicada auditada:** `https://pabloguilh-jhcmnkrj.manus.space/`  
**Data:** 17 de agosto de 2026  
**Autor:** Manus AI

## Síntese executiva

A base técnica do portfólio apresenta uma implementação madura de responsividade, acessibilidade e SEO técnico. As principais melhorias já aplicadas incluem code splitting por rota e fornecedor, carregamento preguiçoso de mídia abaixo da dobra, imagens responsivas em AVIF/WebP, `decoding="async"`, posters para vídeo, carregamento sob demanda do showreel e do PDF, bloqueio de scroll em modais, `safe-area`, canonical dinâmico, robots e sitemap no backend, JSON-LD de pessoa, rotas de erro seguras e fallback de assets que não responde HTML para arquivos JavaScript/CSS inexistentes.

A verificação publicada confirmou **status HTTP 200, ausência de overflow horizontal em 320–844 px e desktop, modal sem overflow interno e um H1 único**. O ponto crítico encontrado não foi clipping, mas **tempo de pintura elevado em uma medição fria da versão pública**: FCP de aproximadamente 5,1 s no ambiente de auditoria, em contraste com aproximadamente 288 ms no preview local. Isso exige monitoramento de produção e possível investigação de cold start, rede, fontes e mídia inicial antes de novas otimizações estruturais.

## Escopo e método

A análise combinou inspeção da árvore íntegra do projeto, leitura dos componentes de portfólio, execução de `pnpm check`, `pnpm test`, `pnpm build`, Playwright em 18 cenários públicos, matriz de viewports de 320×568 a 1920×1080 e auditoria automatizada diretamente no domínio publicado. O ZIP incompleto citado no material de referência não foi usado como base de alteração.

| Evidência | Resultado |
|---|---:|
| Typecheck | Aprovado |
| Testes Vitest | 8 arquivos / 24 testes aprovados |
| Build | Aprovado |
| Playwright público | 18/18 aprovados |
| Viewports auditados | 320, 360, 375, 390, 414, 430, 768, 844×390 e desktop |
| Overflow horizontal publicado | Não detectado |
| Overflow interno do modal | Não detectado |
| H1 na página publicada | 1 |
| Imagens sem `alt` não vazio | 11 ocorrências; parte delas é decorativa e usa `alt=""` intencionalmente |

## Melhorias de performance aplicadas

### Carregamento de imagens

As imagens abaixo da dobra usam `loading="lazy"` e `decoding="async"`. O portfólio utiliza fontes responsivas com `picture`, `srcSet`, AVIF/WebP e `sizes`, reduzindo a dependência de imagens grandes em telas estreitas. O retrato e os elementos editoriais possuem dimensões explícitas, diminuindo o risco de deslocamento de layout.

### Vídeo e mídia audiovisual

O showreel usa carregamento sob demanda com poster otimizado, versões orientadas para mobile e controles acessíveis. O vídeo de projeto usa `preload="metadata"`, limite de altura com `svh`, `object-fit: contain` e fallback “tocar vídeo” quando o navegador bloqueia autoplay. Essa escolha evita forçar reprodução e evita que um player vertical domine a primeira tela.

### Code splitting e carregamento sob demanda

Rotas como favoritos, disponibilidade, privacidade e repertório social são separadas em chunks. A exportação PDF é carregada apenas quando solicitada. A estratégia preserva recursos reais e reduz o custo inicial, embora o bundle principal ainda mereça monitoramento em dispositivos de entrada.

### Interação e estabilidade visual

A aplicação usa skeletons durante a abertura de modais, transições curtas, `prefers-reduced-motion`, limites com `svh`, `min-w-0`, quebra segura de textos, rolagem interna e `safe-area-inset-bottom`. A barra fixa de contato desaparece durante modais, preview de currículo, busca focada, formulário e teclado virtual, evitando competição com a tarefa principal.

## Métricas da versão publicada

A medição foi realizada em um navegador headless contra o domínio público. Os valores abaixo são **uma amostra de auditoria**, não um RUM nem uma medição de Lighthouse em aparelho físico.

| Métrica | Preview local anterior | Publicado auditado | Leitura crítica |
|---|---:|---:|---|
| FCP | 288 ms | ~5.112 ms | Diferença relevante; investigar cold start, rede e mídia |
| First Paint | 268 ms | ~4.900 ms | Mesmo padrão de atraso no domínio público |
| Recursos observados | 66 | Não consolidado nesta rodada pública | Medir em rede móvel real |
| Overflow em 390 px | Não | Não | Geometria estável |
| Overflow em 320 px | Não | Não | Geometria estável |
| Modal em 390 px | Sem overflow | Sem overflow | Conteúdo alcançável por rolagem |

A discrepância entre preview e produção é o principal achado técnico. Como o domínio publicado respondeu corretamente e a estrutura renderizou, o próximo passo não deve ser uma reescrita. Deve ser uma medição com cache frio e quente, rede 4G, CPU limitada, Web Vitals, waterfall de recursos e observação do tempo de resposta inicial do servidor.

## SEO técnico aplicado

A página possui título específico, meta description regionalizada e coerente, `robots` com tratamento especial para favoritos, canonical ajustado ao `window.location.origin`, Open Graph, Twitter Card, favicon e JSON-LD `Person` com áreas de atuação, conhecimentos e perfis sociais reais. O backend gera `/robots.txt` e `/sitemap.xml`, com exclusão das rotas privadas de favoritos.

Nesta rodada, Open Graph e Twitter Image passaram a receber URL absoluta dinamicamente baseada no domínio atual. Isso evita que rastreadores sociais interpretem o caminho relativo do poster como URL incompleta e mantém a imagem coerente em preview, domínio Manus e eventual domínio personalizado.

| Elemento | Situação |
|---|---|
| `title` | Presente e específico |
| `description` | Presente, regionalizada e factual |
| `canonical` | Dinâmico por origem |
| Open Graph | Presente; imagem absoluta dinamicamente |
| Twitter Card | Presente; imagem absoluta dinamicamente |
| JSON-LD | `Person`, `sameAs`, `knowsAbout`, `areaServed` |
| `robots.txt` | Gerado pelo backend |
| `sitemap.xml` | Gerado pelo backend |
| Headings | Um H1 principal na página pública |
| Privacidade | Rotas de favoritos com `noindex, nofollow` |

## Riscos e próximos testes

O risco mais importante é a diferença de tempo de pintura entre preview e produção. O segundo é a presença de 11 imagens com `alt` vazio no DOM; isso não significa automaticamente erro, pois imagens decorativas devem usar `alt=""`, mas uma revisão manual deve confirmar que nenhuma imagem informativa ficou sem descrição. O terceiro é o peso cognitivo do lightbox, que foi reduzido no modal audiovisual, mas ainda merece um teste de descoberta das ações avançadas em aparelhos reais.

A próxima medição deve registrar LCP, INP, CLS, TTFB, tamanho transferido, cache hit/miss, tempo até o primeiro frame do vídeo e falhas de autoplay. Recomenda-se comparar Android intermediário e iPhone em rede 4G, com cache frio e quente.

## Referências internas

[1]: `docs/mobile-optimization-followup.md` — revisão anterior da otimização mobile.  
[2]: `client/index.html` — metadados, canonical, Open Graph, Twitter Card e JSON-LD.  
[3]: `server/seo.ts` — geração de robots.txt e sitemap.xml.  
[4]: `e2e/navigation.spec.ts` — cobertura pública de navegação, responsividade, modais e SEO.

## Rodada medida — 19 de agosto de 2026

### Método e leitura responsável

Esta rodada repetiu a navegação publicada em 390×844, com perfil de 4G simulado, cache frio, cache quente e CPU 4×. São amostras headless, portanto adequadas para localizar gargalos e regressões, mas não para atribuir uma meta absoluta de campo. A medição confirmou que o **H1** é o maior elemento de conteúdo nas amostras frias e que a resposta inicial do domínio continua dominando o caminho crítico.

| Cenário | Antes: TTFB | Depois: TTFB | Antes: LCP | Depois: LCP | CLS antes/depois | Leitura |
|---|---:|---:|---:|---:|---:|---|
| 4G frio | 3.797 ms | 4.038 ms | 9.684 ms | 9.968 ms | 0 / 0 | A variação acompanha o TTFB; não houve ganho de LCP atribuível ao aplicativo. |
| 4G frio + CPU 4× | 3.220 ms | 3.022 ms | 6.464 ms | 6.904 ms | 0,00085 / 0,00086 | O HTML chegou mais cedo, mas o LCP não melhorou de modo consistente. |
| 4G quente | 2.181 ms | 1.722 ms | 6.380 ms | não conclusivo nesta amostra | 0 / 0 | A coleta quente não produziu entrada LCP confiável; não foi usada para alegação de ganho. |

> A tentativa de remover a animação de entrada do H1 foi revertida. A comparação não demonstrou ganho reproduzível depois de controlar a variação de TTFB, e a animação editorial existente foi preservada.

### Recursos críticos auditados

| Recurso / hipótese | Evidência observada | Decisão |
|---|---|---|
| Hero | Já seleciona AVIF responsivo de 480 px no viewport 390 px, mantém fallback WebP, dimensões 1920×1080, `loading="eager"` e `fetchPriority="high"`. Não foi o LCP nas amostras. | Não adicionar preload concorrente: ele competiria com CSS e JS sem evidência de ganho em LCP. |
| Fontes | `preconnect` para `fonts.googleapis.com` e `fonts.gstatic.com` já estava presente; o CSS de fontes chegou em aproximadamente 247–271 ms após o início de recursos. | Manter a configuração existente; não duplicar preconnect. |
| Estabilidade visual | Hero e retrato já têm dimensões explícitas; CLS permaneceu praticamente nulo em todas as amostras. | Não alterar proporções nem inserir atributos redundantes. |
| JavaScript crítico | Em cache frio, os chunks iniciais começaram após o TTFB, com o principal em cerca de 67 KB transferidos e React em cerca de 60 KB. | Preservar a divisão atual; PDF, rotas administrativas, disponibilidade e repertório já permanecem tardios. |

### Entregas de experiência premium

| Área | Resultado implementado |
|---|---|
| Coleção de projetos salvos | O compartilhamento usa Web Share API quando o dispositivo oferece suporte e copia o link como fallback. A URL contém apenas IDs públicos, e o evento continua limitado a `share_project` com canal técnico permitido. |
| Pré-visualização | Cartões salvos abrem o modal de detalhes existente, mantendo foco, Escape, retorno à coleção, navegação entre itens visíveis e acesso externo quando o projeto possui URL. |
| Tema | O modo escuro existente foi preservado e reforçado: a preferência persistida é aplicada antes da hidratação, a transição de cores dura 180 ms e respeita movimento reduzido; o controle móvel agora mede 44×44 px. |
| Mobile | A auditoria em 390 px confirmou ausência de overflow horizontal; a nova ação de compartilhar fica junto à agenda dentro da coleção salva, com alvo mínimo de 44 px. |

### Decisão SSR, PWA e Next.js

O portfólio mantém SEO técnico de base, mas continua uma SPA: o HTML inicial público contém uma casca antes da execução do React. Se uma futura auditoria de crawler provar que o corpo, as rotas de case ou os previews sociais precisam de HTML completo no primeiro byte, a recomendação é **SSR incremental no stack React/Vite/Express atual**, mantendo rotas autenticadas como client-only e `noindex`. Uma migração para Next.js não é justificada por esta rodada, pois adicionaria risco de hydration e custo de reestruturação sem resolver o TTFB de infraestrutura demonstrado na amostra. PWA também fica adiado até existir política explícita de cache e atualização, para não servir um portfólio desatualizado offline.

### Validação de encerramento

| Verificação | Resultado |
|---|---|
| `pnpm check` | Aprovado |
| `pnpm test` | **41/41** aprovados em 14 arquivos |
| `pnpm build` | Aprovado |
| Playwright dirigido — tema, coleção e pré-visualização | **2/2** aprovados |
| Playwright serial final | **34 aprovados** e **3 ignorados** por ausência deliberada de `E2E_AUTH_STATE` |

A primeira execução serial após a limpeza de artefatos apresentou duas expirações de espera — analytics do CTA e final da transição de busca — que passaram isoladamente. A repetição integral em ambiente limpo aprovou todos os cenários públicos; por isso, a evidência final registrada é a repetição de **34/34 públicos**.
