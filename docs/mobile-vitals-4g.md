# Medição mobile em 4G simulado

**Projeto:** Arquivo Profundo — Pablo Guilherme  
**Data da medição:** 17 de agosto de 2026  
**Viewport:** 390 × 844 px  
**Ambiente:** Chromium headless local, emulação CDP de rede celular 4G, latência de 150 ms, download aproximado de 1,6 Mbps e upload aproximado de 750 Kbps.

## Resultado observado

| Métrica | Resultado | Observação |
|---|---:|---|
| LCP | 18.828 ms | Medição fria sob rede limitada; muito acima do objetivo de experiência rápida |
| INP | 952 ms | Amostra baseada em clique, teclado, tema e navegação após carregamento |
| CLS | 0,0499 | Baixo e dentro de uma faixa visualmente estável |
| DOMContentLoaded | 18.805 ms | Atraso acompanha o carregamento inicial sob a rede simulada |
| Transferência da navegação | 372.366 bytes | Valor reportado pelo entry de navegação do documento |
| Overflow horizontal | Não detectado | `scrollWidth` não excedeu a largura da viewport |

> Estes números são uma amostra de laboratório, não dados de usuários reais. O LCP e o INP foram medidos em um ambiente local com emulação de rede e não devem ser apresentados como Core Web Vitals de produção.

## Interpretação crítica

O **CLS de aproximadamente 0,05** indica que as dimensões explícitas das imagens, o controle de altura dos modais e a composição mobile estão evitando deslocamentos relevantes. O resultado de overflow também confirma que a correção de largura e quebra de conteúdo continua íntegra em 390 px.

O **LCP de 18,8 s** e o **INP de 952 ms** são sinais de uma medição fria muito severa. O valor não deve ser ignorado: ele sugere que, sob rede celular limitada, o documento ainda demora a se tornar visualmente útil e as primeiras interações acumulam espera. Antes de remover conteúdo real ou reduzir a identidade visual, é necessário repetir a medição em produção com cache frio e quente, CPU limitada e waterfall de recursos. A diferença anterior entre preview local e domínio publicado também recomenda medir TTFB e cold start.

## Acessibilidade e alt text

A auditoria local encontrou 11 ocorrências de `alt=""`. Nove são imagens decorativas — marca PG repetida e textura de fundo — e permaneceram com alt vazio, que é o tratamento correto para não inserir ruído em leitores de tela. Duas imagens são conteúdo informativo e foram corrigidas:

| Área | Texto alternativo aplicado |
|---|---|
| Repertório social | “Imagem de capa do perfil [perfil]: [descrição real do perfil]” |
| Miniaturas do lightbox | “Miniatura do projeto [nome real do projeto]” |

A suíte E2E passou a verificar que as imagens dos cards do repertório social possuem texto alternativo não vazio.

## Analytics e Search Console

A instrumentação de GA4 e a meta de verificação do Search Console ficaram **preparadas, mas desativadas**, conforme a decisão desta rodada. Nenhum Measurement ID, token ou credencial foi inventado, embutido ou versionado. A ativação futura deve ocorrer somente após o fornecimento de `VITE_GA4_MEASUREMENT_ID` e `VITE_GOOGLE_SITE_VERIFICATION` por configuração segura.

## Próximas medições recomendadas

A próxima rodada deve repetir o teste diretamente no domínio publicado, usando cache frio e quente, Android intermediário e iPhone, rede 4G real ou throttling equivalente, CPU 4× mais lenta, além de registrar LCP, INP, CLS, TTFB, tamanho transferido e tempo até o primeiro frame do vídeo. O foco deve ser identificar qual recurso domina o LCP antes de reduzir ou substituir mídia real.
