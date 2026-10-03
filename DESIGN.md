# Design System: PG Portfolio — Arquivo Luminoso

## 1. Visual Theme & Atmosphere

Um portfólio técnico-editorial que funciona como arquivo vivo: preciso, legível, assimétrico e orientado por evidências. A interface deve parecer uma combinação de estúdio de produto digital e arquivo técnico contemporâneo, nunca um dashboard genérico.

- **Densidade:** 5/10 — informação suficiente para demonstrar profundidade, sem empilhar explicações redundantes.
- **Variância:** 6/10 — composição assimétrica controlada; hierarquia vem de escala, espaço e ritmo.
- **Motion:** 4/10 — microinterações rápidas e discretas; movimento nunca compete com conteúdo.
- **Modo principal:** Experience/Persuade — o trabalho aparece cedo e a interface conduz para prova, avaliação ou contato.

## 2. Color Palette & Roles

- **Arquivo Deep Navy** (#07111F) — canvas principal e Hero.
- **Arquivo Surface** (#081827) — superfícies elevadas e blocos interativos.
- **Arquivo Ink** (#E6F2FF) — texto principal.
- **Arquivo Muted** (#8FA8C7) — metadados e texto secundário.
- **Arquivo Border** (rgba(255,255,255,0.08)) — divisores estruturais.
- **Celeste Signal** (#38BDF8) — único accent dominante para CTA, foco e estados ativos.
- **Celeste Soft** (#A5F3FC) — realce de acessibilidade e hover, sem virar segundo accent.

Evitar roxo, neon multicolorido, preto puro e gradientes usados como decoração sem função.

## 3. Typography Rules

- **Display:** Sora — títulos, mensagens de posicionamento e nomes de projetos; tracking apertado e escala controlada.
- **Body:** DM Sans — descrições, cases, contexto e formulários; leitura confortável com largura máxima de 65ch.
- **Mono:** IBM Plex Mono — metadados, estados, filtros, labels e dados técnicos.
- **Escala mobile:** títulos devem usar `clamp()` e nunca exigir rolagem apenas para completar a primeira mensagem.
- **Texto mínimo interativo:** 0.75rem quando acompanhado de ícone; corpo nunca abaixo de 0.875rem em conteúdo essencial.

As recomendações externas de tipografia apontam para grotescas/humanistas limpas e altamente legíveis; a pilha atual já atende esse objetivo sem introduzir dependência ou licenciamento adicional.

## 4. Home Journey

A ordem padrão da home é:

1. **Hero** — proposta, identidade e CTA principal.
2. **Provas verificáveis** — três evidências curtas e clicáveis.
3. **Projetos selecionados** — trabalho real antes de recursos experimentais.
4. **Próximo passo** — seletor de rota: contratar, avaliar perfil ou explorar.
5. **PG Arcade / Project Lens / Perfil / Processo** — recursos de aprofundamento.
6. **Contato** — briefing e canais.
7. **Footer** — encerramento e links institucionais.

### Regras

- Nunca repetir a mesma prova em Hero, Trust Bar e outro deck.
- Nunca inserir uma seção exploratória antes de Projetos se ela não provar trabalho profissional diretamente.
- O Hero possui no máximo **1 CTA primário + 1 secundário**.
- A primeira dobra mobile deve caber em aproximadamente 650px de altura útil após o header.
- Projetos devem estar acessíveis com um único salto de âncora a partir do Hero.

## 5. Component Stylings

### Buttons
- Alvo de toque mínimo de 44px; preferir 48–56px no mobile.
- Primário: Celeste Signal preenchido, texto Deep Navy.
- Secundário: borda estrutural, sem brilho externo.
- Active: escala sutil de 0.97–0.985; somente transform/opacity.
- Evitar mais de três ações concorrentes na mesma zona visual.

### Proofs
- Provas são links compactos, não mini landing pages.
- Cada prova contém: status curto, título, uma frase e destino verificável.
- No mobile: lista vertical compacta; sem swipe obrigatório para informação essencial.

### Cards
- Só usar quando a borda agrupa informação que precisa ser percebida como unidade.
- Evitar três cards grandes repetidos em sequência.
- Preferir linhas, divisores e grids assimétricos para alta densidade.

### Navigation
- Desktop: navegação curta, sem menus duplicados.
- Mobile: quatro destinos principais + ação contextual + ferramentas agrupadas.
- Dock móvel prioriza: ação principal, contexto atual e contato rápido.

## 6. Layout Principles

- Max-width estrutural: 1440px.
- Mobile-first abaixo de 768px.
- Sem overflow horizontal para conteúdo essencial.
- Seções longas usam lazy-load por proximidade e placeholders dimensionados para reduzir CLS.
- Projetos e evidências vêm antes de laboratório, jogos e configurações.
- Evitar alturas mínimas artificiais que criem áreas vazias; usar conteúdo e padding para formar o ritmo.
- Não sobrepor texto e mídia; cada elemento ocupa zona espacial própria.

## 7. Motion & Interaction

- Duração padrão: 160–240ms.
- Easing: ease-out ou curvas com desaceleração clara.
- Somente `transform` e `opacity` em animações frequentes.
- Respeitar `prefers-reduced-motion`.
- Hover nunca é requisito de descoberta; toda ação funciona por toque e teclado.
- Não usar loops decorativos contínuos fora de indicadores de estado realmente ativos.

## 8. Mobile Rules

- Hero: mensagem, perfil, CTA e saída para projetos; nenhuma prova duplicada.
- CTA principal e secundário podem dividir linha a partir de 360px quando os rótulos continuam legíveis.
- Trust Bar completa deve ocupar menos de ~500px em 390px de largura.
- Menus usam grid para ferramentas secundárias em vez de pilhas de botões full-width.
- Safe-area deve ser respeitada no dock.
- Qualquer modal/jogo deve esconder ou inertizar o dock quando aberto.

## 9. Content Rules

- Toda afirmação de qualidade deve apontar para evidência real.
- Evitar números inventados, métricas sem fonte e superlativos.
- Preferir verbos concretos: publicar, testar, construir, validar, navegar.
- Remover texto que repete o bloco imediatamente anterior.
- “Produto publicado”, “código público”, “testes” e “processo” devem aparecer uma vez na jornada inicial, não em múltiplas variações.

## 10. Anti-Patterns (Banned)

- Provas duplicadas em múltiplos decks.
- Hero com mais de duas CTAs.
- Três grandes cards iguais em sequência quando uma lista resolve.
- Swipe obrigatório para informação essencial.
- Glows externos fortes em botões.
- Gradiente em texto de título.
- Scroll arrows ou “role para explorar” como filler.
- Emojis como linguagem de interface.
- Inter como fonte genérica.
- Preto puro (#000000).
- Conteúdo experimental antes dos projetos principais.
- Alturas mínimas grandes sem necessidade de conteúdo.
- Botões menores que 44px em touch.
- Recursos órfãos, preferências sem efeito ou componentes sem consumidor.

## Contratos da simplificação

Manter uma única faixa de provas verificáveis, descrições de pelo menos 14px e ações de pelo menos 44px. O menu e o Experience Hub compartilham o objetivo da visita, com sessionStorage e fallback para armazenamento bloqueado. Preservar lazy loading, retorno de foco, cinco jogos e as remoções de PDF e mídias ausentes da main.
