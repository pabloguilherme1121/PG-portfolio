# Notificações personalizadas

O portfólio usa dois canais distintos. Para visitantes, o formulário de briefing apresenta feedback inline e toast após envio ou falha. O pedido salvo não deve ser tratado como inválido apenas porque o alerta interno ao proprietário ficou indisponível.

Para o proprietário, `quoteRequest.create` persiste o briefing antes de tentar o alerta operacional. O helper `notifyOwner` usa no backend `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY`; nenhum desses valores deve entrar no frontend. O retorno `ownerNotified` permite ajustar o feedback da interface sem expor detalhes internos.

Os nomes `BUILT_IN_FORGE_API_*` são legado da integração atual, mas ainda possuem consumidores reais em `apps/api/src/_core/notification.ts`. Não remover ou renomear essas chaves separadamente: uma migração deve alterar serviço, configuração, contratos e smoke tests no mesmo conjunto de mudanças.

O `Toaster` global está registrado na aplicação. As notificações visuais complementam, e não substituem, os estados acessíveis `role="status"` do formulário.

## Validação

Não registrar contagens fixas de testes neste documento, porque elas envelhecem rapidamente. Alterações no fluxo devem ser validadas pelo SHA atual:

- `pnpm check:api` e `pnpm test:api`;
- `pnpm build:server` e `node scripts/smoke-api.mjs`;
- workflow **Validate optional API** quando os paths relevantes forem alterados;
- suíte do Pages quando houver mudança também na interface pública.

Credenciais reais ficam exclusivamente no ambiente de implantação.
