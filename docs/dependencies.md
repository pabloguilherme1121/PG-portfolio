# Auditoria de dependências

A auditoria foi conduzida por busca de referências no código, estilos e configurações, seguida de checagem TypeScript, testes e build. A regra aplicada foi remover somente pacotes sem uso comprovável, mantendo dependências que sustentam build, tipos globais, UI ou integrações indiretas.

| Pacote | Resultado | Motivo |
|---|---|---|
| `framer-motion` | Removido | Nenhuma importação ou referência encontrada. |
| `add` | Removido | Nenhuma importação ou referência encontrada. |
| `tailwindcss-animate` | Removido | Nenhuma referência encontrada; a animação atual usa a entrada de estilos já presente no projeto. |
| `@tailwindcss/typography` | Removido | Nenhum plugin ou classe de tipografia encontrada na configuração atual. |
| `@types/google.maps` | Mantido | `client/src/components/Map.tsx` usa tipos globais do Google Maps. |
| `recharts` | Mantido | Usado na tela administrativa de analytics. |
| `pdf-lib` | Mantido | Usado nas exportações PDF do portfólio. |

O lockfile foi atualizado pelo gerenciador de pacotes. A validação final deve sempre executar `pnpm check`, `pnpm test` e `pnpm build` antes de publicar.
