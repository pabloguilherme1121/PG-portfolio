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
