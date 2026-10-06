## Resumo

Descreva o problema, a solução aplicada e o motivo da mudança.

## Escopo

- [ ] A mudança está limitada ao necessário.
- [ ] Código, documentação ou assets obsoletos/duplicados relacionados foram removidos somente quando o uso foi verificado.
- [ ] Não há mudança de comportamento sem cobertura correspondente.

## Verificação local

Marque apenas o que realmente foi executado:

- [ ] `pnpm lint`
- [ ] `pnpm check:portfolio`
- [ ] `pnpm test:portfolio`
- [ ] `pnpm build:static`
- [ ] `pnpm test:e2e:static` quando a mudança afeta navegação, UI, PWA ou bundle estático
- [ ] `pnpm audit:assets --strict-if-present` quando há mudança de mídia/assets
- [ ] `pnpm audit:source` quando há mudança em scripts, API ou limites de isolamento

## Gates do GitHub Actions

Antes de integrar:

- [ ] `quality` está verde no workflow **Deploy portfolio to GitHub Pages**
- [ ] `static-isolation` está verde no workflow **Deploy portfolio to GitHub Pages**
- [ ] `api` está verde no workflow **Validate optional API** quando a PR toca `apps/api/**`, `packages/contracts/**`, lockfile, workspace, configuração compartilhada ou scripts de build da API

## Testes e regressão

- [ ] Correções de bug incluem teste de regressão que reproduz o problema.
- [ ] Mudanças de comportamento incluem teste focado no contrato alterado.
- [ ] Nenhum teste foi desabilitado ou relaxado apenas para obter CI verde.
- [ ] Conferência manual foi feita quando houve mudança visual ou de interação.

## Impacto na publicação estática

Explique se a mudança afeta GitHub Pages, rotas públicas, PWA, service worker, cache, lazy loading, bundle ou isolamento da API. Use **Nenhum** quando não houver impacto.

## Risco e rollback

Liste riscos concretos e como reverter a mudança. Use **Baixo / revert do commit** quando aplicável.
