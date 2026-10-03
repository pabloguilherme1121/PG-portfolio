# Arquitetura vigente

- `apps/portfolio`: interface pública, páginas, componentes, mídias e adaptador local. Estático por padrão, sem banco ou runtime tRPC.
- `apps/api`: API Express/tRPC, migrações Drizzle e cliente administrativo opcional.
- `packages/contracts`: constantes, erros e schema de briefing compartilhados, sem dependência da API.
- A raiz contém ferramentas de build, testes, auditorias e publicação.

Vite seleciona `@portfolio/bootstrap` e `@/lib/portfolioApi` conforme a variante. `@` aponta para o frontend, `@api` para o cliente administrativo e `@shared` para contratos. Os tsconfigs verificam as duas variantes separadamente.

`pnpm build` e `pnpm build:static` produzem `dist/public` com base `/PG-portfolio/`. `pnpm build:server` produz HTML na raiz e `apps/api/dist/index.js`; somente então `pnpm start` inicia a API. `pnpm dev` usa frontend estático; `pnpm dev:server` inicia a API com Vite integrado. Os comandos são portáveis entre Windows e Linux.

Pages publica somente Home e privacidade; agenda, favoritos e curadoria pertencem à variante servidor. A preparação de Pages gera privacidade com canonical próprio e 404 com noindex. Workers antigos e o resgate v10 permanecem até haver evidência de migração dos clientes instalados. A recuperação automática é limitada mesmo com armazenamento bloqueado.

O CI exige instalação filtrada da raiz, frontend e contratos sem pacotes da API, TypeScript público e build estático. O job de qualidade verifica ambos os apps, unitários, variante API e smoke HTTP, builds, navegadores, auditorias, orçamento e rotas. O deploy depende dos dois jobs aprovados.

A migração conserva o conteúdo e comportamento atuais, os cinco jogos e as remoções de PDF e mídias ausentes. Home/contato/CSS não são reescritos junto com a troca de diretórios. Decisões de interface permanecem em `DESIGN.md`.
