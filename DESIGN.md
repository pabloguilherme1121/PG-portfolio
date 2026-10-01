# Design System: PG Portfolio

## 1. Visual theme
Arquivo técnico editorial: escuro, preciso e verificável. A interface deve parecer um portfólio de produto em produção, não um dashboard decorativo.

- Densidade: 4/10 — informação suficiente, sem empilhar blocos.
- Variância: 6/10 — assimetria controlada, sem layouts caóticos.
- Movimento: 4/10 — transições curtas e funcionais.
- Regra principal: cada seção deve responder a uma pergunta real do visitante.

## 2. Color palette

- **Canvas profundo** — `#050d18`: fundos de capítulos.
- **Superfície azul** — `#071827`: painéis e estados elevados.
- **Texto principal** — `#FFFFFF`: títulos e ações principais.
- **Texto secundário** — `#B7D4E4`: corpo e descrições.
- **Texto discreto** — `#7EA4BD`: metadados.
- **Accent ciano** — `#38BDF8`: único accent para CTA, foco e estados ativos.
- **Accent claro** — `#A5F3FC`: hover/foco, nunca como segundo sistema de cor.

Evitar roxo, gradientes neon, preto puro e cores concorrentes.

## 3. Typography

- **Display:** Sora — headlines curtas, tracking negativo controlado.
- **Body:** DM Sans — leitura confortável, máximo aproximado de 65 caracteres por linha.
- **Mono:** IBM Plex Mono — labels, metadados, status e números técnicos.

Regras:
- Body mobile: mínimo 14 px quando a informação precisa ser lida.
- Mono abaixo de 9 px somente para metadado auxiliar, nunca ação principal.
- Headlines não devem ocupar mais de 3–4 linhas no mobile.

## 4. Home hierarchy

A home segue esta sequência:

1. **Proposta** — quem é Pablo e o que resolve.
2. **Ação** — ver projetos primeiro; diagnóstico como ação secundária.
3. **Sinais** — fatos compactos, não marketing.
4. **Provas** — produto publicado, código público e processo testado.
5. **Rota** — contratar, avaliar perfil ou explorar.
6. **Conteúdo profundo** — diagnóstico, perfil, serviços, projetos, contato.

Nunca repetir o mesmo argumento em duas seções consecutivas.

## 5. Components

### Buttons
- Alvo de toque mínimo: 44 × 44 px.
- Máximo de 1 CTA preenchido por bloco.
- Ação secundária: outline/ghost.
- Active: `scale(0.97–0.985)` ou deslocamento máximo de 1–2 px.
- Sem glow neon externo.

### Cards
- Usar apenas quando o agrupamento precisa de uma superfície.
- Evitar sequência de três grids idênticos; no mobile, rail horizontal só quando a comparação entre itens é útil.
- Cards informativos não devem conter outro card visualmente equivalente dentro deles.

### Tabs / modes
- Usar tabs para alternativas mutuamente exclusivas.
- Nunca usar progressbar para opções que não são etapas sequenciais.
- Estado selecionado precisa funcionar por cor + borda + ARIA.

### Mobile dock
- Máximo de 3 ações visíveis.
- Ação primária ocupa a maior área.
- Ação contextual secundária deve mudar com a rota sem esconder o caminho principal.
- Respeitar safe-area inferior.

## 6. Layout

- Conteúdo central: máximo 1440 px.
- Mobile-first; múltiplas colunas colapsam abaixo de 768 px.
- Nenhum overflow horizontal da página.
- Rails horizontais precisam de snap e largura de item suficiente para mostrar que existe próximo conteúdo.
- Evitar alturas mínimas maiores que o conteúdo real apenas para “encher tela”.
- Usar `100dvh` quando uma superfície realmente precisa de viewport inteira.

## 7. Motion

- Animar apenas `transform` e `opacity` sempre que possível.
- Respeitar `prefers-reduced-motion`.
- Sem loops decorativos contínuos em conteúdo de leitura.
- Preload por intenção apenas para recursos pesados e opcionais.
- Carregamento adiado deve manter espaço estável sem criar grandes vazios.

## 8. Mobile rules

- Primeiro viewport: proposta + sinais + CTA, sem controles redundantes.
- Botões principais em largura confortável para polegar.
- Evitar mais de quatro decisões simultâneas.
- Formulários longos usam escolhas pré-selecionadas e persistência de progresso.
- Conteúdo opcional pesado (Arcade, PDF, detalhes, seções tardias) permanece lazy.
- WebKit mobile faz parte da definição de pronto.

## 9. Anti-patterns

Nunca:
- duplicar CTA ou link para a mesma função no mesmo bloco;
- repetir “prova”, “qualidade” ou “processo” em cards consecutivos com o mesmo conteúdo;
- usar progressbar em tabs;
- criar seções só para preencher espaço;
- adicionar recurso sem uma ação ou decisão de usuário correspondente;
- exibir jargão técnico antes da proposta de valor;
- introduzir dependência ou fonte apenas por estética;
- usar três ou mais estilos de botão com a mesma importância;
- colocar navegação externa e âncora interna com o mesmo rótulo lado a lado;
- quebrar touch targets, foco visível ou `prefers-reduced-motion`.

## 10. Definition of done

Uma mudança visual só entra na `main` quando:
- funciona em desktop e mobile;
- não cria overflow horizontal;
- mantém teclado e ARIA;
- passa Chromium, Firefox e WebKit onde a suíte cobre;
- respeita bundle budget;
- não duplica uma função já existente;
- melhora uma pergunta, decisão ou ação real do visitante.
