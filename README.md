# Pablo Guilherme · Produtos digitais, interfaces e dados

[![Deploy para GitHub Pages](https://github.com/pabloguilherme1121/PG-portfolio/actions/workflows/pages.yml/badge.svg)](https://github.com/pabloguilherme1121/PG-portfolio/actions/workflows/pages.yml)
![React 19](https://img.shields.io/badge/React-19-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Vite](https://img.shields.io/badge/Vite-7-646cff)
[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green)](LICENSE)

**[Abrir o portfólio](https://pabloguilherme1121.github.io/PG-portfolio/)** · **[Abrir o Observatório](https://pabloguilherme01.github.io/observatorio/#dashboard)**

Portfólio profissional de Pablo Guilherme, estudante de Análise e Desenvolvimento de Sistemas, focado em transformar informação, conteúdo e objetivos de negócio em produtos digitais claros, responsivos e publicáveis.

O projeto foi estruturado para mostrar **provas de trabalho**, e não apenas uma galeria: produto em produção, produto full-stack em evolução, decisões de interface, código verificável, testes automatizados e uma jornada de contato que transforma uma necessidade inicial em briefing estruturado.

## O que este portfólio demonstra

- **Produto real em produção:** o Observatório pode ser aberto, navegado e avaliado fora do portfólio.
- **Produto full-stack em evolução:** o Trajeto expõe arquitetura de produto, frontend, API, persistência, testes, CI e segurança em código público.
- **Engenharia verificável:** React, TypeScript, Vite, testes unitários, Playwright e auditoria de assets fazem parte do fluxo.
- **Project Lens:** diagnóstico interativo que transforma um problema inicial em uma rota de projeto e pré-preenche o briefing.
- **Briefing Studio:** fluxo progressivo em quatro etapas, com autosave local, validação e resumo do contexto.
- **Estudos de caso verificáveis:** cada case conecta contexto, decisão, aprendizado e evidência concreta.
- **Leitura curta para recrutadores:** currículo/perfil, GitHub, Observatório, Trajeto, audiovisual e qualidade reunidos em uma matriz única de provas.
- **Experiência responsiva:** mobile, acessibilidade, foco, alvos de toque e preferência por movimento reduzido são cobertos pela suíte de qualidade.

## Jornada principal

```text
Posicionamento
    ↓
Proof Deck
    ↓
Project Lens
    ↓
Serviços e processo
    ↓
Produto em produção + estudos de caso
    ↓
Briefing Studio
    ↓
Contato / WhatsApp
```

A narrativa prioriza uma pergunta: **o que esta entrega resolve, como foi construída e onde pode ser verificada?**

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

## Qualidade e CI

O workflow de publicação só entrega o build depois das verificações de qualidade.

```bash
pnpm check
pnpm test
pnpm test:e2e
pnpm build
```

A pipeline também verifica o inventário de mídia e as rotas públicas antes do deploy para GitHub Pages.

## Desenvolvimento local

Requer Node.js 22 e Corepack.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Para reproduzir a publicação estática:

```bash
VITE_DEPLOY_TARGET=github-pages VITE_STATIC_DEPLOY=true pnpm exec vite build
node scripts/prepare-github-pages.mjs
```

Na publicação estática, o briefing prepara a mensagem para o WhatsApp e mantém a confirmação de envio sob controle do visitante.

## Estrutura

| Diretório | Conteúdo |
| --- | --- |
| `client/` | Experiência pública, componentes e mídia |
| `client/src/features/portfolio/` | Hero, Proof Deck, Project Lens, cases, briefing e analytics |
| `server/` e `shared/` | API e contratos da versão com servidor |
| `scripts/` | Preparação, auditoria e validação do build |
| `e2e/` | Testes de navegador, mobile, SEO e acessibilidade |
| `docs/archive/` | Histórico técnico e pesquisas preservadas |

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
- [Instagram audiovisual](https://www.instagram.com/mpjstoryworks/) · @mpjstoryworks

## Licença

[MIT](LICENSE) © 2026 Pablo Guilherme.
