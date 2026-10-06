# Melhorias baseadas no relatório de auditoria

## Escopo

Esta rodada aplicou somente melhorias de clareza, conversão e robustez identificadas no relatório, sem redesign estrutural ou inclusão de novas funcionalidades.

## Correções aplicadas

A abertura passou a declarar com mais objetividade a oferta audiovisual e o público atendido. O CTA primário agora é **pedir orçamento**, enquanto **ver trabalhos** permanece como ação secundária.

A galeria pública ganhou um resumo semântico dos filtros ativos, mostrando categoria, tag, tecnologia, projetos salvos e a ação para limpar os filtros. O resumo é atualizado com `aria-live` e preserva a sincronização existente da URL.

A exclusão do histórico de buscas agora persiste imediatamente no `localStorage`, além do efeito React existente. O gatilho de ampliação do lightbox interrompe a propagação em cards de vídeo, evitando conflito com o botão de abertura do modal audiovisual.

## Validação

`pnpm check`, `pnpm test` e `pnpm build` foram executados após as correções. Os cenários E2E críticos de histórico, navegação direta e lightbox foram executados isoladamente; a suíte completa em uma única execução apresentou timeouts intermitentes do ambiente dev após vários minutos, sem erro de compilação ou falha determinística reproduzida nos cenários isolados.
