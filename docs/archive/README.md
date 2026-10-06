# Arquivo técnico

Esta pasta preserva contexto histórico sem tratá-lo como especificação atual do projeto.

- `audits/`: auditorias, relatórios de performance, revisões mobile, hardening, consolidações e correções pontuais de versões anteriores.
- `architecture-legacy.md`: arquitetura anterior à estrutura de workspaces atual.
- demais arquivos na raiz deste diretório: pesquisas, ideias e validações antigas preservadas para consulta.

Para o estado vigente, use `../current/architecture.md`, `../current/github-governance.md`, o `README.md` da raiz e `DESIGN.md`.

Arquivos históricos podem conter caminhos, números de testes, decisões e funcionalidades que já foram substituídos; não devem ser usados como contrato de implementação sem revalidação contra a `main`.

Novos relatórios pontuais devem ir diretamente para `audits/`, em vez de voltar à raiz de `docs/`.
