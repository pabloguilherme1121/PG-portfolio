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

O lockfile deve continuar sendo a fonte de instalação reproduzível. As dependências de Express, tRPC, Drizzle/MySQL e integrações server-side permanecem intencionais porque o repositório também contém as jornadas administrativas e o backend; o deploy estático do GitHub Pages apenas não as empacota na página pública. A validação de release executa `pnpm check`, `pnpm test`, build/validação do bundle e `pnpm test:e2e` antes de publicar.
