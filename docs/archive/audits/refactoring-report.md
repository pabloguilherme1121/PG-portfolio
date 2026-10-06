# Relatório de refatoração e endurecimento

## Resumo

Esta rodada foi aplicada de forma incremental sobre a base existente. A rota pública, a identidade Arquivo Profundo e os fluxos de galeria, lightbox, favoritos, exportação e briefing foram preservados. O foco foi transportar a organização arquitetural da segunda rodada de referência sem sobrescrever recursos que já estavam mais avançados na versão atual.

## Alterações executadas

| Área | Resultado |
|---|---|
| Entrada pública | `client/src/pages/Home.tsx` tornou-se um adaptador mínimo para `features/portfolio/HomeExperience.tsx`. |
| Repertório social | `InstagramRepertoire` foi extraído para `features/social/`, mantendo o carregamento sob demanda e a rota existente. |
| Rodapé | Contato direto, disponibilidade sob consulta, cópia de e-mail, redes sociais e privacidade foram extraídos para `PortfolioFooter.tsx`. |
| Privacidade | Criada a página pública `/privacidade` e o documento operacional `docs/privacy.md`. |
| Documentação | Arquitetura, decisões, acessibilidade, estilos, implantação e auditorias foram organizados em `docs/`. |
| Performance | Removida a pintura adiada dos capítulos editoriais, que criava bandas vazias em capturas longas; lazy loading e variantes responsivas de mídia foram preservados. |

## O que não foi sobrescrito

A referência recebida estava atrás da versão atual em funcionalidades. Portanto, não foram copiados por cima do projeto o catálogo real, busca textual, filtros compartilháveis, histórico, favoritos, modal navegável, exportação PDF/CSV, lightbox gestual, calendário ou integrações. Esses fluxos continuam na base atual e foram validados novamente.

## Limites deliberados

A narrativa, filtros, favoritos e lightbox continuam parcialmente em `HomeExperience.tsx` porque concentram estados interdependentes, gestos, foco, sincronização de URL e eventos de teclado. A próxima extração deve ser feita somente com testes de regressão visual e de interação específicos, evitando transformar a experiência em uma camada genérica difícil de manter.

## Validação executada

| Verificação | Resultado |
|---|---:|
| `pnpm check` | Aprovado |
| Vitest | **8 arquivos e 24 testes aprovados** |
| Playwright E2E público | **15 cenários aprovados em 1 worker** |
| `pnpm build` | Aprovado |
| Visual desktop | Homepage e privacidade inspecionadas; ritmo editorial corrigido após remover bandas vazias |
| Visual mobile | Homepage e privacidade inspecionadas em 375 × 812 px, sem corte de texto observado |

## Segurança e privacidade

A autorização real continua no servidor. O gate visual das áreas internas não substitui `protectedProcedure` ou `adminProcedure`. A nova página de privacidade explica dados de briefing, preferências locais, analytics opcional e solicitações do titular sem prometer uma política jurídica além do que foi implementado.

## Comandos de reprodução

```bash
pnpm check
pnpm test
E2E_BASE_URL=<preview-url> pnpm exec playwright test e2e/navigation.spec.ts --workers=1
pnpm build
```
