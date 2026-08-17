# Integração SimilarWeb — status do projeto

A integração SimilarWeb não está exposta como rota no checkpoint atual. A aplicação registra apenas o portfólio público e as áreas administrativas efetivamente registradas em `client/src/App.tsx`; não existe um painel de analytics disponível para acesso.

Este arquivo é mantido como registro de escopo e não deve ser interpretado como instrução de uso de um painel ativo. Qualquer integração futura deverá manter consultas e credenciais exclusivamente no backend, usar procedimentos protegidos por autenticação/autorização e ser documentada somente depois que a rota e os testes correspondentes forem implementados.

As variáveis server-side relacionadas a integrações devem ser fornecidas pelo secret manager do ambiente de deploy. Não coloque `BUILT_IN_FORGE_API_KEY`, `DATABASE_URL`, `JWT_SECRET` ou qualquer token em arquivos públicos, no frontend, no bundle ou em arquivos `.env` versionados.
