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
