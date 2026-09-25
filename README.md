# Pablo Guilherme · Portfólio

[![Deploy para GitHub Pages](https://github.com/pabloguilherme1121/PG-portfolio/actions/workflows/pages.yml/badge.svg)](https://github.com/pabloguilherme1121/PG-portfolio/actions/workflows/pages.yml) ![React 19](https://img.shields.io/badge/React-19-149eca) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Vite](https://img.shields.io/badge/Vite-7-646cff) [![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green)](LICENSE)

**[Acessar o portfólio publicado](https://pabloguilherme1121.github.io/PG-portfolio/)**

Portfólio de Pablo Guilherme, estudante de Análise e Desenvolvimento de Sistemas e criador audiovisual em Águas Lindas de Goiás e no entorno do Distrito Federal. A experiência editorial “Arquivo Profundo” reúne trajetória, competências, projetos e contato.

## Destaques

- Layout responsivo com navegação por seções, cuidado com acessibilidade e redução de movimento.
- Projetos com filtros e favoritos salvos no navegador.
- Briefing e consulta de disponibilidade pelo WhatsApp na publicação estática.
- Rotas com fallback `404.html` para visitas diretas no GitHub Pages.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Navegação e dados | Wouter, TanStack Query, tRPC na versão com servidor |
| Testes | Vitest, Playwright |
| Publicação | GitHub Actions, GitHub Pages |

## Desenvolvimento

Requer Node.js 22 e Corepack.

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

O servidor local usa recursos full stack. O GitHub Pages gera a versão estática, sem backend; nela, os pedidos seguem para o WhatsApp e a consulta dinâmica de datas bloqueadas fica desativada.

```bash
pnpm check
pnpm test
pnpm build
pnpm test:e2e
```

Para reproduzir a publicação estática:

```bash
VITE_DEPLOY_TARGET=github-pages VITE_STATIC_DEPLOY=true pnpm exec vite build
node scripts/prepare-github-pages.mjs
```

## Estrutura

| Diretório | Conteúdo |
| --- | --- |
| `client/` | Interface, seções e arquivos públicos |
| `server/` e `shared/` | API e contratos da versão com servidor |
| `scripts/` | Preparação e validação do build |
| `e2e/` | Testes de navegador |
| `docs/archive/` | Histórico de trabalho e pesquisas |

## Contato

- [Instagram pessoal](https://www.instagram.com/pablogui000/) · @pablogui000
- [Instagram audiovisual](https://www.instagram.com/mpjstoryworks/) · @mpjstoryworks
- [GitHub](https://github.com/pabloguilherme1121)
- Águas Lindas de Goiás, Planaltina (GO/DF) e entorno.

## Licença

[MIT](LICENSE) © 2026 Pablo Guilherme.
