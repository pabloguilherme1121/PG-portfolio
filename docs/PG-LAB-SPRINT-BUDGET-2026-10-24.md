# PG Sprint e PG Budget — publicação independente v1.1 (24/10/2026)

Duas ferramentas locais, com código em `labs/{sprint,budget}` e HTML autônomo em `apps/portfolio/public/lab/{sprint,budget}/index.html`. Nenhuma dependência adicionada ao shell React.

## Evidência já obtida
- Node.js `node --test`: Sprint **6/6** e Budget **6/6** verdes; sintaxe `node --check` dos dois cores e app scripts aprovada.
- TDD: novos testes de **resumo CSV** falharam (RED) antes da implementação, passaram (GREEN) depois.
- Smoke Chromium com HTML injetado, armazenamento simulado e downloads: **320/390/768/1280 px** para ambos; criação, conclusão de tarefa, totais, CSV, nav, 0 overflow horizontal, 0 pageerror. Reproduzido e corrigido erro `crypto.randomUUID is not a function` em contexto não seguro, com fallback `getRandomValues`.
- Vercel Hobby recebeu deployments de produção **READY** separados: Sprint `dpl_2Jek6zzKLChiixM75TshpSUtHcC3`, Budget `dpl_EP9avd868SnrrYqQteaDhrZ7DHTD`; aliases `pg-sprint-lab.vercel.app` e `pg-budget-lab.vercel.app`. HTTP público e Android físico ainda não certificados.
- Existe E2E Playwright em `e2e-static/pg-sprint-budget.spec.ts`; não marcar como verde sem execução no CI.

## Funcionalidades
- Sprint: tarefas por projeto, duração estimada, data, estado, filtro, busca, foco com timer, exportação JSON/CSV com resumo e importação JSON.
- Budget: entradas e despesas em centavos inteiros, quantidade, saldo estimado, edição, busca, filtros, impressão e exportação JSON/CSV com totais.
- Navegação entre cinco aplicativos do PG Lab (Shotlist, QA Lab, Creator Kit, Sprint, Budget).
- `localStorage` somente no dispositivo, sem login, servidor, sincronização ou telemetria. Backup é responsabilidade do usuário.
- Orçamento não é documento fiscal; timer não garante execução/alarmes em segundo plano.

## Condições de merge e compatibilidade
- [ ] Corrigir base do PG-portfolio por #284 e recertificar audit, quality, static-isolation, E2E do mesmo HEAD antes de integrar a PR.
- [ ] Conferir build do Vite e rotas estáticas `/PG-portfolio/lab/sprint/` e `/PG-portfolio/lab/budget/`.
- [ ] Testar recarga localStorage, importação JSON, downloads e impressão diretamente em HTTPS, Firefox, WebKit e Android físico 320/390.
- [ ] Validar foco/contraste/reduced-motion em dispositivo e leitor de tela.
- [ ] Confirmar deployment de `main` e URLs públicas apenas após merge.
- [ ] Não comprar planos, domínios, APIs ou servidores. Vercel Hobby apenas para demonstrações pessoais/não comerciais.

Cloudflare Pages continua separado e dependente de autorização GitHub (issue #286). Nenhum projeto Pages foi criado.
