# Arquitetura

| Workspace | Responsabilidade | Dependências |
| --- | --- | --- |
| `apps/portfolio` | Site público estático, UI e assets | React, UI e contratos; sem Express, MySQL ou tRPC |
| `apps/api` | API, OAuth, persistência e cliente administrativo opcional | Express, tRPC, Drizzle/MySQL e adapters de cliente |
| `packages/contracts` | Inputs/validação e tipos compartilhados | Zod; nenhuma importação da API ou do schema de banco |
| raiz | Configuração, CI e comandos de qualidade | Ferramentas de desenvolvimento |

O build padrão é estático. A API é opt-in por `VITE_STATIC_DEPLOY=false`; aliases de build selecionam o bootstrap e o adapter. O pacote público não importa a API. O guard do Vite rejeita módulos de `apps/api`, tRPC, React Query e SuperJSON no artefato estático.

`HomeExperience` compõe `PortfolioShell`, `ProjectJourney`, `ProfileJourney`, `ContactJourney`, `JourneyTools`, `SocialJourney` e `ArcadeSection`. Cada jornada possui o seu estado e os seus limites lazy. `MobileJourney` controla os atalhos dentro do shell. Apenas abertura de overlays/foco relevante ao dock atravessa a composição.

`PortfolioContact` compõe `ContactMethods`, `Availability` e `BriefingWizard`. O calendário não possui estado do briefing. O wizard controla rascunho/etapas e compõe campos, navegação, resumo e resultado. O envio/adapter pertence a `ContactJourney`.

O CSS é importado em ordem explícita: tokens/base, shell, portfolio, utilities, tema claro, apresentação, impressão, experiências, mobile e jornadas. A divisão preserva a cascata; ausência de uso numa única viewport não justifica apagar um seletor.

O cliente administrativo vive em `apps/api/client`. Os mesmos componentes públicos são reutilizados por `ServerApp`; rotas administrativas e providers de dados entram somente nesse bootstrap. Contratos públicos não exportam tipos do banco.
