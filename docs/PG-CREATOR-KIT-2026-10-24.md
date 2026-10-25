# PG Creator Kit — prévia estática (24/10/2026)

**Produto:** estúdio pessoal de ideias para Instagram Reels, Shorts e TikTok, feito com um HTML único e sem dependências externas.

### Funcionalidades
- Criar/editar/duplicar/excluir até 100 ideias, filtrar status, buscar títulos, acompanhar produção.
- Gerar gancho de texto por template local (não é IA generativa).
- Registrar cenas, exportar uma ideia como backup JSON **compatível** com o PG Shotlist v0.5, através do botão Shotlist JSON e depois Importar JSON no Shotlist.
- CSV com neutralização de fórmulas; backup completo JSON v1 com validação de entradas.
- Estado localStorage com detecção de conflito entre abas; sem nuvem, credenciais, conexão automática com Instagram nem postagem automatizada.

### Testes
- Smoke Chromium DOM injetado (sem navegação localhost) em 320,390,768,1280 px: criação/edição/duplicação/filtros, geração local, download Shotlist JSON de duas cenas, export JSON, overflow/pageerror: aprovado.
- Teste real de navegador HTTP, Firefox, Safari, Android físico, armazenamento após recarga e import/export real: **pendente**; novo E2E está em `e2e-static/pg-creator-kit.spec.ts`, não executado no CI na criação desta branch.

### Publicação e qualidade
- Esta branch não deve entrar na main enquanto o audit do PG-portfolio (PR #284) e o gate E2E não estiverem verdes no HEAD final.
- A demonstração externa pode ser criada na Vercel Hobby apenas para uso pessoal não comercial, não é PWA instalável.
- Nenhum banco, API paga, upgrade ou publicação social automática. Sem prometer integração OAuth com Canva/Meta/Descript que não exista.

Relacionados: PG Shotlist #281, QA Lab #283, segurança #284 e issue #282.


## Recertificação após PR #284 — 25/10/2026

- PR de segurança [#284](https://github.com/pabloguilherme1121/PG-portfolio/pull/284) foi integrada em `main` no commit `b6b58759917d2d0395dea805670570bb2805b691`, com audit de dependências, qualidade e isolamento estático aprovados no HEAD da PR.
- O aplicativo independente está publicado em [Vercel](https://pg-creator-kit.vercel.app/); o HTML/CSS contém os ajustes editoriais de leitura e a navegação integrada. Deploy de produção READY e resposta HTTP 200 conferidos.
- A sincronização do HTML com a versão publicada preservou os scripts próprios e identificadores de formulários; a versão do aplicativo não foi declarada certificada para Android físico.
- Este commit documental solicita uma execução nova dos gates no contexto da base segura, sem relaxar `pnpm audit --audit-level=low` e sem liberar merge automático. A integração só ocorrerá após aprovar os gates do HEAD final.
