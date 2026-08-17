# Correção do erro `Unexpected token '<'`

## Causa identificada

O erro reportado ocorreu durante um estado anterior do servidor Vite em que `HomeExperience.tsx` ainda referenciava o componente social com um caminho inválido (`./InstagramRepertoire`). Quando o navegador tentava interpretar a resposta de erro do Vite como JavaScript, o primeiro caractere HTML (`<`) produzia `Uncaught SyntaxError: Unexpected token '<'`.

A árvore atual já contém o componente correto em `client/src/features/social/InstagramRepertoire.tsx`, e o import atual é:

```ts
const InstagramRepertoire = lazy(() => import("@/features/social/InstagramRepertoire"));
```

## Correção aplicada

Foi reiniciado o servidor de desenvolvimento para limpar o estado HMR/cache que mantinha a referência antiga. Não foi necessária alteração de funcionalidade ou de arquitetura.

## Evidências

O módulo `HomeExperience.tsx` passou a responder com `HTTP 200` e `Content-Type: text/javascript`. Depois do reinício, não surgiram novos erros `Unexpected token`, `Failed to resolve import` ou `Internal server error` nos logs recentes.

| Validação | Resultado |
|---|---|
| `pnpm check` | Aprovado |
| `pnpm test` | 8 arquivos, 24 testes aprovados |
| `pnpm build` | Aprovado |
| Módulo Vite | HTTP 200, `text/javascript` |
| Logs recentes | Sem erro correspondente |
