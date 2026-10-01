# Design System: PG Portfolio

## 1. Visual Theme & Atmosphere

Arquivo técnico editorial, escuro e preciso. A interface deve parecer um produto digital publicado — não um template de portfólio. Densidade 4/10, assimetria 7/10 e movimento 5/10. A primeira jornada é curta: proposta, ação e prova verificável. Elementos decorativos nunca competem com conteúdo.

## 2. Color Palette & Roles

- **Deep Archive** (#07111F) — canvas principal.
- **Night Surface** (#071827) — superfícies e painéis funcionais.
- **Cloud Ink** (#F2FBFF) — texto primário.
- **Steel Copy** (#A7BDD7) — texto secundário.
- **Muted Metadata** (#7F9BB7) — metadados e legendas.
- **Sky Signal** (#38BDF8) — único acento funcional para CTA, foco e estado ativo.
- **Whisper Border** (rgba(255,255,255,0.08)) — divisores e estrutura.

Evitar novos acentos cromáticos. Não usar roxo, neon multicolorido ou gradientes de texto como identidade.

## 3. Typography Rules

- **Display:** Sora — headings e números de destaque. Tracking negativo moderado; escala controlada.
- **Body:** DM Sans — leitura e explicações. Máximo aproximado de 65 caracteres por linha.
- **Mono:** IBM Plex Mono — metadados, status, labels e evidências técnicas.
- Não adicionar outra família sem substituir uma existente.
- Texto funcional mobile nunca menor que 11px; corpo preferencialmente 14–16px.

## 4. Component Stylings

- **Primary button:** preenchimento Sky Signal, contraste escuro, altura mínima 48px no mobile.
- **Secondary action:** outline ou texto, nunca competir com o CTA principal.
- **Touch target:** mínimo 44×44px para qualquer controle.
- **Cards:** só quando elevação comunica hierarquia. Provas rápidas usam linhas/divisores, não pilhas de cards.
- **Inputs:** label explícito, estado de erro próximo ao campo e preservação do conteúdo.
- **Loading:** skeleton/placeholder com dimensões estáveis; sem spinner genérico.
- **Focus:** anel visível Sky Signal em todos os elementos interativos.

## 5. Layout Principles

- Hero assimétrico, alinhado à esquerda e com uma única proposta dominante.
- Mobile first fold: título + proposta + CTA principal devem caber sem depender de gesto horizontal.
- Apenas uma camada de prova imediatamente após o Hero.
- Não repetir prova em Hero, cards, deck e faixa ao mesmo tempo.
- Evitar grids de três cards iguais como padrão; preferir faixas, linhas ou proporções assimétricas.
- Conteúdo essencial não pode exigir carrossel horizontal.
- Seções secundárias devem usar lazy-load por proximidade e placeholders de altura estável.
- Max-width de 1440px e padding responsivo consistente.

## 6. Motion & Interaction

- Movimento só com transform e opacity.
- Hover não pode ser o único sinal de interatividade.
- Active press deve dar resposta tátil curta.
- Respeitar prefers-reduced-motion.
- Nada de loops decorativos permanentes em conteúdo de leitura.
- No mobile, evitar scroll suave forçado em transições longas.

## 7. Mobile Rules

- Navegação principal acessível pelo polegar.
- CTA primário full-width quando necessário.
- Menus, Arcade, briefing e painéis devem preservar estado ao abrir/fechar.
- Provas e dados essenciais em grid/lista vertical; swipe fica reservado a exploração opcional.
- Retrato e elementos de marca que repetem informação textual podem ser ocultados na primeira dobra pequena.
- Nenhum overflow horizontal da página.

## 8. Content & Information Architecture

A ordem de prioridade é:
1. O que Pablo entrega.
2. Como iniciar um projeto.
3. Provas verificáveis.
4. Rota para contratar, recrutar ou explorar.
5. Projetos e cases.
6. Processo, perfil e contato.

Cada informação deve aparecer uma vez na primeira jornada. Repetição só é permitida quando muda o contexto da ação.

## 9. Anti-Patterns

- Não criar nova seção apenas para repetir informação existente.
- Não usar múltiplas hero sections em sequência.
- Não empilhar badges, chips e micro-labels sem função.
- Não usar carrossel horizontal para conteúdo obrigatório.
- Não adicionar fonte, biblioteca, animação ou modo sem benefício mensurável.
- Não usar ícone sem label/aria-label em ações.
- Não introduzir fake metrics ou números não verificáveis.
- Não adicionar dependência visual se CSS nativo resolve.
- Não esconder a ação principal atrás de modal, menu ou onboarding.
