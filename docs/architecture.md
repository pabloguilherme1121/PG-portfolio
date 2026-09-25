# Arquitetura do projeto

## Visão geral

O projeto é uma aplicação fullstack em React 19, TypeScript, Vite, Express, tRPC, Drizzle ORM e MySQL. O GitHub Pages publica somente o bundle estático da jornada pública; as rotas e integrações administrativas continuam justificando as dependências de backend no mesmo repositório.

## Fronteiras principais

| Área | Responsabilidade | Local principal |
|---|---|---|
| Aplicação | Bootstrap, providers e roteamento | `client/src/App.tsx`, `client/src/main.tsx` |
| Jornada pública | Entrada fina da Home | `client/src/pages/Home.tsx` |
| Orquestração do portfólio | Estado compartilhado, galeria, favoritos e lightbox | `client/src/features/portfolio/HomeExperience.tsx` |
| Hero e showreel | Primeira dobra, CTA e mídia de abertura | `client/src/features/portfolio/components/PortfolioHero.tsx` |
| Contato | Agenda pública, briefing e canais de contato | `client/src/features/portfolio/components/PortfolioContact.tsx` |
| Seções estáticas | Skills, serviços e processo | `client/src/features/portfolio/components/PortfolioStaticSections.tsx` |
| Rodapé | Encerramento e canais | `client/src/features/portfolio/components/PortfolioFooter.tsx` |
| Feature social | Repertório social carregado sob demanda | `client/src/features/social/InstagramRepertoire.tsx` |
| Curadoria | Favoritos, ordenação e exportação administrativa | `client/src/pages/FavoritesManagement.tsx` + `favoritesManagementUtils.ts` |
| Agenda administrativa | Disponibilidade e bloqueios | `client/src/pages/AvailabilityManager.tsx` |
| Backend | Procedures tRPC, autenticação e regras de negócio | `server/` |
| Persistência | Schema, migrations e helpers Drizzle | `drizzle/`, `server/db.ts` |
| QA | Unitários, bundle checks e navegador | `client/**/*.test.ts`, `server/**/*.test.ts`, `e2e/`, `scripts/` |

## Refatoração da Home

A rota pública permanece estável, mas a Home deixou de concentrar a primeira dobra e o contato. O estado que realmente atravessa seções continua em `HomeExperience.tsx`; comportamento autocontido fica junto de seu componente.

```text
client/src/pages/Home.tsx
        ↓
client/src/features/portfolio/HomeExperience.tsx
        ├── components/PortfolioHero.tsx
        ├── components/PortfolioContact.tsx
        ├── components/PortfolioStaticSections.tsx
        └── components/PortfolioFooter.tsx

client/src/features/social/InstagramRepertoire.tsx
```

A regra para novos cortes é não extrair apenas JSX: o componente deve levar consigo estado, efeitos ou regras que não precisem ser compartilhados. Isso evita transformar um monólito em vários componentes fortemente acoplados por dezenas de props.

## Curadoria e exportação

A tela administrativa de favoritos continua responsável por autenticação, mutations e composição visual. Filtros, reordenação e cálculo de exportação que não dependem de React/tRPC ficam em `favoritesManagementUtils.ts`, com testes unitários próprios. Dessa forma mudanças nessas regras podem ser verificadas sem montar a tela administrativa inteira.

## Validação do GitHub Pages

O workflow constrói e prepara `dist/public`, valida as rotas geradas e então inicia `scripts/serve-pages-e2e.mjs`, que reproduz o base path `/PG-portfolio/`. O Playwright executa contra esse artefato antes de ele ser enviado ao job de deploy. Uma regressão de navegador, acessibilidade ou navegação bloqueia a publicação.

## Regras de dependência

As páginas podem consumir features, componentes compartilhados e bibliotecas de domínio. Features não devem importar páginas umas das outras. Componentes de UI não devem conhecer regras de negócio ou endpoints tRPC. O backend deve continuar sendo acessado por procedures tipadas. Rotas internas usam `DashboardLayout` como gate visual de defesa em profundidade; a autoridade de autorização permanece no servidor.

## Jornadas do produto

A experiência pública apresenta trabalho, competências, prova e contato. A curadoria permanece em rotas protegidas (`/curadoria` e `/favoritos`), a agenda administrativa em `/agenda` e a privacidade pública em `/privacidade`.
