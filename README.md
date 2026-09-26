# Pablo Guilherme · Portfólio

[![Deploy para GitHub Pages](https://github.com/pabloguilherme1121/PG-portfolio/actions/workflows/pages.yml/badge.svg)](https://github.com/pabloguilherme1121/PG-portfolio/actions/workflows/pages.yml) ![React 19](https://img.shields.io/badge/React-19-149eca) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Vite](https://img.shields.io/badge/Vite-7-646cff) [![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green)](LICENSE)

**[Acessar o portfólio publicado](https://pabloguilherme1121.github.io/PG-portfolio/)** · **[Abrir o projeto Observatório](https://pabloguilherme01.github.io/observatorio/)**

Portfólio profissional de Pablo Guilherme, estudante de Análise e Desenvolvimento de Sistemas, com foco em desenvolvimento web e repertório complementar em conteúdo audiovisual.

## Objetivo

A experiência pública foi reduzida ao que ajuda uma pessoa a avaliar o trabalho e iniciar uma conversa: posicionamento, competências, serviços, projetos, estudos de caso e contato.

## Principais características

- Interface responsiva em React e TypeScript.
- Projeto web publicado em destaque e trabalhos selecionados com contexto, processo e resultado.
- Modal de projeto acessível por teclado e por link direto.
- Formulário de briefing com fallback transparente para WhatsApp no GitHub Pages.
- Metadados SEO, PWA, página de privacidade, 404 e sitemap.
- Pipeline de qualidade com TypeScript, Vitest, Playwright, auditoria de assets e validação do bundle do Pages.

## Desenvolvimento

Requer Node.js 22 e Corepack.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

Validação local:

```bash
pnpm audit:assets
pnpm check
pnpm test
pnpm test:e2e
pnpm build
```

Para reproduzir o build do GitHub Pages:

```bash
VITE_DEPLOY_TARGET=github-pages VITE_STATIC_DEPLOY=true pnpm exec vite build
node scripts/prepare-github-pages.mjs
node scripts/validate-pages-bundle.mjs
```

## Estrutura

| Diretório | Responsabilidade |
| --- | --- |
| `client/src/features/portfolio/` | experiência pública, componentes e dados do portfólio |
| `client/src/pages/` | páginas auxiliares públicas, como privacidade e 404 |
| `server/` | API opcional para briefing em implantações com backend |
| `e2e/` | testes de navegador e acessibilidade |
| `scripts/` | auditorias e preparação do GitHub Pages |
| `docs/` | documentação operacional atual |

## Contato

- E-mail: **mpjcreator@gmail.com**
- Instagram: **@pablogui000**
- GitHub: **@pabloguilherme1121**

## Licença

[MIT](LICENSE) © 2026 Pablo Guilherme.
