# Pablo Guilherme — Portfólio

Portfólio profissional de Pablo Guilherme, reunindo tecnologia, interfaces, conteúdo e produção audiovisual em uma experiência editorial responsiva.

## Qualidade

O projeto usa React 19, TypeScript, Vite, Tailwind CSS e Vitest. A base inclui navegação acessível, suporte a `prefers-reduced-motion`, imagens responsivas, carregamento sob demanda, tratamento de erros, filtros de projetos, favoritos locais e experiência otimizada para mobile.

### Desenvolvimento

```bash
corepack enable
pnpm install
pnpm dev
```

### Verificações

```bash
pnpm check
pnpm test
pnpm build
pnpm test:e2e
```

## GitHub Pages

O workflow `.github/workflows/pages.yml` executa typecheck e testes antes da publicação. A versão do GitHub Pages é uma distribuição estática: o formulário de briefing direciona a solicitação para WhatsApp e a consulta dinâmica de datas bloqueadas fica desativada, evitando chamadas para um backend inexistente.

A aplicação original full-stack continua preservada para ambientes com o servidor tRPC.

## Estrutura

- `client/` — aplicação React e experiência do portfólio.
- `server/` — API e recursos full-stack.
- `shared/` — contratos e tipos compartilhados.
- `scripts/` — utilitários de build e publicação.
- `tests/` / configuração Playwright — validações automatizadas.

## Deploy

Pushes em `main` acionam a publicação no GitHub Pages após as verificações de qualidade. O build usa o caminho base do repositório e prepara `404.html` para suportar rotas da SPA.

## Licença

MIT.
