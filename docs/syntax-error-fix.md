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

## Reprodução recorrente em 17/08/2026

A URL exata reportada (`/?from_webdev=1`) foi aberta em uma sessão limpa após o checkpoint `c1b3af2e`. A homepage renderizou integralmente, o navegador identificou o título e os controles esperados, e o console da sessão não apresentou mensagens de erro. Isso confirma que o erro reportado em 03:26:49 não é reproduzível no preview atual; ele é compatível com cache/asset antigo no cliente ou com uma cópia publicada diferente do checkpoint corrigido.

## Correção definitiva do fallback

A investigação revelou uma segunda causa estrutural que explicava a recorrência: tanto o middleware de desenvolvimento quanto o servidor estático de produção faziam fallback para `index.html` em qualquer caminho não encontrado. Se um bundle JavaScript estivesse ausente, desatualizado ou com hash antigo, o navegador recebia HTML e falhava no primeiro caractere `<`.

`server/_core/vite.ts` agora só entrega o app shell quando a requisição aceita HTML e não possui extensão de arquivo. Requests para `.js`, `.css`, imagens e outros assets inexistentes seguem para o tratamento normal de 404, em vez de receber HTML. Rotas client-side sem extensão continuam funcionando normalmente.

O comportamento foi testado no bundle de produção: uma rota HTML desconhecida respondeu `200` com `text/html`, enquanto `/assets/missing-module.js` respondeu `404` e não recebeu o app shell. Após reiniciar o preview, a URL reportada carregou sem erro no navegador.

| Validação final | Resultado |
|---|---|
| `pnpm check` | Aprovado |
| `pnpm build` | Aprovado |
| `pnpm test` | 8 arquivos, 24 testes aprovados |
| Playwright público | 15 aprovados, 2 ignorados por ausência de sessão |
| Preview limpo | Homepage carregada, console sem erro |
| Servidor de produção | HTML fallback preservado; asset JS inexistente retorna 404 |
