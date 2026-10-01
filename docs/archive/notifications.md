# Notificações personalizadas

O portfólio usa dois canais distintos. Para visitantes, o formulário de briefing apresenta feedback inline e agora também exibe uma notificação toast personalizada após o envio ou em caso de falha. A mensagem de sucesso informa que o pedido foi registrado e orienta sobre os próximos passos; quando o alerta interno não estiver disponível, a mensagem informa isso sem invalidar o pedido salvo.

Para o proprietário, o procedimento server-side `quoteRequest.create` continua salvando o briefing antes de tentar o alerta operacional. O helper `notifyOwner` usa apenas as credenciais backend `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY`, nunca valores no frontend. O retorno `ownerNotified` permite personalizar o feedback do visitante sem expor detalhes internos.

O componente global `Toaster` já está registrado no `App.tsx`. As notificações respeitam o tema atual do site e complementam, sem substituir, os estados acessíveis `role="status"` do formulário. Nenhuma credencial deve ser colocada no cliente ou no bundle.

## Validação

A implementação foi validada com `pnpm check`, 24 testes Vitest, `pnpm build` e 16 E2E públicos aprovados. Os dois E2E administrativos continuam condicionados a uma sessão `E2E_AUTH_STATE` real.
