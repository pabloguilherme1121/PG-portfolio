# Arquitetura do projeto

## Visão geral

O projeto é uma aplicação fullstack em React 19, TypeScript, Vite, Express, tRPC, Drizzle ORM e MySQL. A arquitetura permanece incremental: a refatoração reorganiza responsabilidades sem reescrever a aplicação nem alterar as rotas públicas existentes.

## Fronteiras principais

| Área | Responsabilidade | Local principal |
|---|---|---|
| Aplicação | Bootstrap, providers e roteamento | `client/src/App.tsx`, `client/src/main.tsx` |
| Jornada pública | Home, apresentação e contato | `client/src/pages/Home.tsx` |
| Feature de portfólio | Experiência editorial, catálogo, filtros, contato e rodapé | `client/src/features/portfolio/` |
| Feature social | Repertório social carregado sob demanda | `client/src/features/social/` |
| Curadoria | Favoritos, ordenação e exportação administrativa | `client/src/pages/FavoritesManagement.tsx` |
| Agenda | Disponibilidade e fluxo administrativo | `client/src/pages/AvailabilityManager.tsx` |
| Analytics | Eventos agregados opcionais e consultas protegidas quando configuradas | `client/src/`, `server/` |
| Backend | Procedures tRPC, autenticação e regras de negócio | `server/` |
| Persistência | Schema, migrations e helpers Drizzle | `drizzle/`, `server/db.ts` |
| QA | Testes unitários, E2E e auditorias manuais | `server/*.test.ts`, `client/**/*.test.ts`, `e2e/`, `scripts/` |

## Refatoração da Home

A rota pública continua apontando para `client/src/pages/Home.tsx`, que agora funciona como um ponto de entrada fino. A implementação da experiência foi movida para `client/src/features/portfolio/HomeExperience.tsx`, enquanto dados estáticos e utilitários reutilizáveis vivem em arquivos próprios.

```text
client/src/pages/Home.tsx
        ↓
client/src/features/portfolio/HomeExperience.tsx
        └── components/
            └── PortfolioFooter.tsx

client/src/features/social/InstagramRepertoire.tsx
```

A feature já separa a rota pública, o rodapé e o repertório social carregado sob demanda. A narrativa, os filtros, favoritos e lightbox permanecem na experiência principal porque concentram estados interdependentes. O próximo corte seguro é separar esses blocos em hooks ou componentes específicos, sempre acompanhado pelos testes existentes e sem duplicar regras de negócio.

## Regras de dependência

As páginas podem consumir features, componentes compartilhados e bibliotecas de domínio. Features não devem importar páginas umas das outras. Componentes de UI não devem conhecer regras de negócio ou endpoints tRPC. O backend deve continuar sendo acessado por procedures tipadas, sem chamadas HTTP manuais espalhadas pelo frontend. Rotas internas usam `DashboardLayout` com `requireAdmin` como gate visual de defesa em profundidade; a autoridade de autorização permanece em `adminProcedure` no servidor.

## Jornadas do produto

A experiência pública tem como objetivo apresentar trabalho, competências, prova e contato. A curadoria permanece em rotas protegidas (`/curadoria` e `/favoritos`), a agenda permanece em `/agenda` e a privacidade pública está disponível em `/privacidade`. Essa separação evita que ferramentas internas dominem o caminho principal do visitante.
