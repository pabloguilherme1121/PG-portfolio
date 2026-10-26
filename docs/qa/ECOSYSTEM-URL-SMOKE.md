# Verificação do ecossistema PG — URLs públicas

Este verificador é **somente leitura**, sob demanda, e não faz deploy, login, rastreamento de usuários ou testes de carga.

## Executar

Use Node.js 22+ a partir da raiz do repositório:

```sh
node --test scripts/check-ecosystem-endpoints.test.mjs
node scripts/check-ecosystem-endpoints.mjs
node scripts/check-ecosystem-endpoints.mjs --json
node scripts/check-ecosystem-endpoints.mjs --only=arcade
```

O inventário explícito cobre 10 páginas verificadas em 25/10/2026: PG Tech, Creator Kit, Shotlist, QA Lab, Budget, Sprint, Social Assets, PG Arcade, PG Portfolio e Eleições Goiás. O verificador usa concorrência máxima de três requisições e 8 s de timeout por destino. Não grava arquivos.

## Critérios e limitações

- **OK** exige status HTTP 200 e `Content-Type: text/html`; outros códigos, HTML ausente, timeout ou falha de rede são **FAIL** e causam exit code 1.
- `--json` emite identificador, URL, status, content type, latência e erro, quando houver.
- O teste unitário injeta um `fetch` simulado: não depende de internet nem dos serviços terceiros.
- O verificador **não comprova funcionalidade de botões, segurança, acessibilidade, Android físico, disponibilidade contínua, integridade de dados, qualidade dos jogos ou experiência do usuário**.
- Há risco de falha transitória por bloqueio temporário ou indisponibilidade de terceiros. Por isso **não está conectado aos gates obrigatórios de merge/deploy**.
- Caso um projeto tenha sido renomeado ou movido, atualize a URL no inventário e o contrato do teste após conferir a URL de produção.

## Continuidade

1. Execute este smoke antes da auditoria cross-app; guarde a saída JSON como evidência em issue.
2. Para falhas, confirme no navegador e no painel do provedor antes de concluir que o produto está indisponível.
3. Mantenha os gates internos separados: PG Arcade (`quality`, Chromium, Firefox, WebKit, `validate` e bundle), portfólio (audit, static-isolation e E2E), Cuidador(a) (segurança, privacidade, carga) e eleições (PWA/dados).
4. O Cuidador(a) e a vitrine `pg-tech-storefront` não estão neste inventário enquanto seus URLs públicos de produção não forem reconciliados e conferidos. Não associe estes produtos automaticamente ao `pgtech-pi.vercel.app`.

Referência de acompanhamento: issue [#279](https://github.com/pabloguilherme1121/PG-portfolio/issues/279).
