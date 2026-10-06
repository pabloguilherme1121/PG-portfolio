# Recomendações futuras de UI/UX — Arquivo Profundo

**Objetivo:** orientar próximas evoluções do portfólio sem descaracterizar a identidade Arquivo Profundo.  
**Princípio:** reduzir competição entre elementos antes de adicionar novas funcionalidades.

## Prioridade imediata

| Prioridade | Recomendação | Benefício esperado | Complexidade |
|---|---|---|---|
| P0 | Criar uma hierarquia progressiva no lightbox mobile para leitura, comparação e miniaturas | Reduz a densidade visual e mantém a imagem como foco principal | Média |
| P0 | Medir LCP, INP, CLS e TTFB no domínio publicado em rede 4G e aparelho intermediário | Diferencia problema real de cold start de percepção local | Baixa |
| P0 | Avaliar o CTA “Pedir orçamento” com dados de clique e posição no primeiro viewport | Melhora conversão sem alterar a narrativa | Baixa |

## Navegação e descoberta

O cabeçalho mobile deve continuar enxuto, com marca, menu e tema. A próxima evolução recomendada é indicar a seção ativa durante a rolagem, sem aumentar a altura do header. Um indicador de progresso editorial discreto pode ajudar em uma homepage longa, desde que não concorra com o CTA nem com a barra de contato.

A galeria possui muitos modos e filtros. Em vez de adicionar mais categorias, recomenda-se tornar o resumo dos filtros ativos mais visível e oferecer um estado persistente de “limpar filtros” próximo dos resultados. O histórico de buscas deve permanecer limitado e editável, evitando transformar a busca em um painel pesado.

## Cards e projetos

Os cards devem priorizar três sinais: imagem, tipo de trabalho e ação. Tecnologias e metadados podem aparecer no hover/foco ou no modal, mas não devem competir com o título em 320–390 px. Para projetos audiovisuais, uma etiqueta curta como “vídeo”, “drone” ou “interface” é mais útil que uma lista extensa de tecnologias no primeiro contato.

Uma futura evolução de baixo risco seria exibir uma microinformação de contexto no card, como “captação aérea” ou “sistema de interface”, derivada dos dados reais já existentes. Não se recomenda adicionar avaliações, depoimentos ou números de desempenho sem fonte verificável.

## Modal e lightbox

O modal de projeto já possui navegação, favoritos, copiar link e swipe. A principal recomendação é usar divulgação progressiva: imagem ou vídeo, título, descrição e ação principal devem aparecer primeiro; papel, processo, resultado, comparação, formatos de download e miniaturas podem ser agrupados em uma seção expansível no mobile. No desktop, a disposição atual pode permanecer mais aberta.

O lightbox deve manter foco no conteúdo visual. Controles essenciais são fechar, anterior/próximo, zoom e salvar; compartilhamento, formatos de download, comparação e leitura expandida podem ficar em uma área secundária. Nenhuma funcionalidade precisa ser removida: apenas deve deixar de ocupar o mesmo peso visual simultaneamente.

A dica de swipe deve continuar aparecendo uma única vez, com alternativa equivalente por botões e teclado. Para vídeo, o estado “tocar vídeo” deve ser mantido quando autoplay for bloqueado, pois é mais claro e acessível do que tentar reproduzir novamente de forma silenciosa.

## Conversão e contato

A barra fixa com WhatsApp, Telegram e Instagram é útil, mas deve continuar desaparecendo durante leitura modal, preenchimento e teclado virtual. Fora desses estados, WhatsApp deve conservar a maior ênfase, Telegram deve funcionar como canal público e Instagram como repertório visual.

O formulário de briefing pode ganhar, em uma próxima rodada, uma indicação de duração estimada para preenchimento e uma confirmação resumida dos dados antes do envio. Isso reduz abandono sem criar campos adicionais. O status de disponibilidade deve permanecer honesto e editável pela área protegida.

## Performance percebida

A prioridade não é retirar imagens reais, mas controlar quando elas entram na tela. Recomenda-se observar se o showreel, repertório social, exportação PDF e lightbox carregam somente após intenção clara. A seguir, deve-se medir o tamanho efetivamente transferido no primeiro viewport e o tempo até a primeira interação.

Também é recomendável revisar fontes externas e o comportamento de cache. A tipografia é parte importante da identidade, portanto a troca de fontes não deve ser feita sem evidência. Uma melhoria mais segura é verificar preconnect, cache-control, subset de pesos realmente utilizados e comportamento em conexão lenta.

## Acessibilidade e confiança

Cada ação deve continuar com foco visível, nome ARIA, estado anunciado e alternativa por teclado. Para imagens informativas, o texto alternativo deve identificar o projeto; para texturas e marcas decorativas, `alt=""` é adequado. Recomenda-se uma revisão manual dos 11 elementos atualmente contabilizados com alt vazio para confirmar essa distinção.

Em futuras alterações, preservar `prefers-reduced-motion`, tamanho mínimo confortável dos alvos de toque, contraste e rolagem interna. A interface não deve depender apenas de cor, hover ou gesto para comunicar estado.

## Conteúdo e posicionamento

O texto já está mais orientado a processo, repertório e resultado do que a uma autobiografia centrada no “eu”. A próxima evolução deve fortalecer provas concretas: qual era o contexto, qual papel foi desempenhado e qual entrega foi produzida. Evite aumentar a quantidade de texto; prefira legendas curtas e verificáveis nos projetos reais.

Para SEO e conversão local, é recomendável manter referências factuais a Águas Lindas de Goiás, Planaltina, Goiás, Distrito Federal e Entorno, sem repetir localidades artificialmente. Uma futura página ou seção de serviços pode trabalhar intenção comercial, desde que não duplique a homepage.

## O que não fazer

Não reescrever `HomeExperience` apenas para reduzir o número de linhas. Não substituir a identidade azul escura editorial por um template genérico. Não esconder ações essenciais com `overflow-hidden`, escala visual ou fonte excessivamente pequena. Não adicionar integrações de tráfego, reviews, depoimentos ou métricas sem fonte real. Não alterar o layout desktop para corrigir um comportamento que pode ser resolvido com composição mobile específica.

## Sequência recomendada

A sequência profissional é medir produção, reformar a hierarquia dos visualizadores, validar Home e contato em mobile, revisar alt text, medir novamente e somente então considerar novos módulos de conteúdo. Essa ordem reduz risco e permite atribuir cada melhoria a uma evidência concreta.
