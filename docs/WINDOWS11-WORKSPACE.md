# Workspace PG-portfolio — Windows 11

O repositório é um **monorepo pnpm**, com site React/Vite e API separada. Execute os comandos na **raiz** do repositório, usando o terminal integrado do VS Code.

## Preparar uma vez

1. Instale o Git e o Node.js LTS de uma fonte oficial, mantendo ambos no PATH.
2. Abra o PowerShell no VS Code e confira `node --version`, `git --version` e `corepack --version`.
3. Execute `corepack enable` (em um terminal com permissão para configurar os shims) e `corepack pnpm --version`. O `package.json` fixa a versão de pnpm do projeto; não use npm para instalar este workspace.
4. Abra a **pasta raiz** no VS Code e instale as extensões sugeridas em `.vscode/extensions.json`.
5. Rode `pnpm install --frozen-lockfile` e depois `pnpm exec playwright install chromium webkit`.

No Windows, as tarefas do VS Code executam `pnpm.cmd` para evitar conflitos de resolução do PowerShell. Se `pnpm` não for encontrado, reinicie o VS Code para recarregar o PATH.

## Rotina de desenvolvimento

```powershell
pnpm dev
pnpm check
pnpm test
pnpm build
pnpm exec playwright test --project=desktop-chromium
pnpm exec playwright test --config=playwright.static.config.ts --project=static-mobile-webkit
```

O Playwright inicia o servidor previsto na configuração de testes. Para testes estáticos, gere primeiro o build com `pnpm build`. Em caso de falha em WebKit, consulte os rastros e capturas em `test-results/`; não use um retry como prova de correção.

## Critérios antes de integrar

Manter `quality`, `static-isolation`, E2E mobile e validação de publicação aprovados no commit final. Instalar extensões **não** instala dependências nem provisiona GitHub/Git automaticamente. A autenticação do GitHub é configurada pelo próprio usuário no VS Code.
