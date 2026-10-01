# Pablo Guilherme · Produtos digitais, interfaces e dados

[![Deploy para GitHub Pages](https://github.com/pabloguilherme1121/PG-portfolio/actions/workflows/pages.yml/badge.svg)](https://github.com/pabloguilherme1121/PG-portfolio/actions/workflows/pages.yml)
![React 19](https://img.shields.io/badge/React-19-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Vite](https://img.shields.io/badge/Vite-7-646cff)
[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green)](LICENSE)

**[Abrir o portfólio](https://pabloguilherme1121.github.io/PG-portfolio/)** · **[Abrir o Observatório](https://pabloguilherme01.github.io/observatorio/#dashboard)**

Produtos digitais, interfaces e dados com projetos verificáveis. Portfólio de Pablo Guilherme, estudante de Análise e Desenvolvimento de Sistemas, focado em transformar informação, dados e objetivos de negócio em produtos digitais claros, responsivos e publicáveis.

O projeto foi estruturado para mostrar **provas de trabalho**, e não apenas uma galeria: produto em produção, produto full-stack em evolução, decisões de interface, código verificável, testes automatizados e uma jornada de contato que transforma uma necessidade inicial em briefing estruturado.

## Jornada principal

**Projetos verificáveis → competências e processo → contato.**

Observatório e Trajeto são as provas centrais. Cases conectam contexto, decisão e evidência. O briefing progressivo mantém rascunho local e prepara contato pelo WhatsApp no Pages.

Project Lens, Experience Hub, currículo, repertório social e PG Arcade são recursos auxiliares. As quatro experiências do Arcade demonstram lógica local, bots determinísticos, touch/keyboard, acessibilidade e testes de navegador. O foco agora é refinamento e manutenção, sem expandir o catálogo de jogos.

## Case principal: Observatório

O Observatório organiza informação pública em uma experiência navegável com indicadores e dashboard.

**Provas públicas:**

- [Produto em produção](https://pabloguilherme01.github.io/observatorio/#dashboard)
- [Código-fonte](https://github.com/Pabloguilherme01/observatorio)

O case é usado no portfólio como evidência de arquitetura de informação, interface responsiva, produto com dados e publicação web.

## Case técnico: Trajeto

O Trajeto é um produto full-stack em evolução para apoiar decisões de rota e abastecimento no Entorno do Distrito Federal. A proposta organiza o fluxo **buscar → comparar → decidir → navegar** e separa explicitamente dados oficiais, dados de terceiros e estimativas próprias.

**Prova pública:**

- [Código-fonte do Trajeto](https://github.com/Pabloguilherme01/trajeto-web)

O repositório demonstra React + TypeScript no frontend, tRPC/Express na API, MySQL + Drizzle na persistência, validação com Zod, testes automatizados, CI e auditoria de dependências. O portfólio não apresenta o Trajeto como produto publicado enquanto não houver uma evidência pública de produção.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Navegação e dados | Wouter, TanStack Query, tRPC na versão com servidor |
| Interação | Project Lens, Proof Deck, Briefing Studio |
| Testes | Vitest, Playwright, axe-core |
| Publicação | GitHub Actions, GitHub Pages |
| Qualidade | Typecheck, testes de navegador, auditoria de assets e validação de rotas |

## Qualidade, performance e CI

O workflow de publicação só entrega o build depois das verificações de qualidade.

```bash
pnpm audit --audit-level=low
pnpm check
pnpm test
pnpm test:e2e
pnpm build:static
pnpm audit:bundle
```

A vitrine completa de projetos é carregada sob demanda quando `#projetos` se aproxima da viewport, enquanto links diretos para projetos e Observatório continuam carregando o conteúdo imediatamente. A CI também aplica um orçamento de regressão: cada chunk JavaScript deve permanecer abaixo de **225 kB** e o CSS compilado abaixo de **220 kB**.

A pipeline verifica ainda o inventário de mídia e as rotas públicas antes do deploy para GitHub Pages. Os fluxos críticos passam pela suíte principal em Chromium, smoke mobile em Pixel 5 e smoke de compatibilidade em Firefox e WebKit. Dependabot acompanha atualizações de npm e GitHub Actions semanalmente.

## Desenvolvimento local

Requer Node.js 22 e Corepack.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Para reproduzir a publicação estática:

```bash
pnpm build:static
node scripts/prepare-github-pages.mjs
```

Na publicação estática, o briefing prepara a mensagem para o WhatsApp e mantém a confirmação de envio sob controle do visitante.

## Estrutura

| Diretório | Conteúdo |
| --- | --- |
| `apps/portfolio/` | Site público estático, componentes e mídia |
| `apps/portfolio/src/features/portfolio/` | Composição de jornadas, projetos, contato e experiências opcionais |
| `apps/api/` | Backend e cliente administrativo opcionais; não enviados ao Pages |
| `packages/contracts/` | Inputs e tipos compartilhados, sem acoplamento ao banco |
| `scripts/` | Preparação, auditoria e validação do build |
| `e2e/` | Testes de navegador, mobile, SEO e acessibilidade |
| `docs/current/` | Arquitetura, direção de produto, operação e migração vigentes |
| `docs/archive/` | Histórico técnico e pesquisas preservadas |

A instalação padrão é estática; use `pnpm dev:server` e `pnpm build:server` para a variante com API. Consulte a [documentação vigente](docs/current/README.md).

## Princípios do projeto

1. Não inventar métricas ou resultados.
2. Preferir prova pública a afirmações genéricas.
3. Tratar mobile e acessibilidade como requisitos, não acabamento.
4. Medir interações sem enviar dados pessoais do briefing.
5. Manter a versão estática funcional mesmo sem backend.

## Contato

- [Portfólio publicado](https://pabloguilherme1121.github.io/PG-portfolio/)
- [GitHub](https://github.com/pabloguilherme1121)
- [Instagram pessoal](https://www.instagram.com/pablogui000/) · @pablogui000

## Licença

[MIT](LICENSE) © 2026 Pablo Guilherme.
