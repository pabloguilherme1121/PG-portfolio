# Migração temporária de runtime

A retirada do service worker v10 aconteceu recentemente. Não existe evidência de uma janela suficiente de migração para apagar agora os endpoints usados por clientes antigos.

A limpeza duplicada em `pwa.ts` foi removida. `legacyRuntimeMigration.ts` centraliza o reset e compartilha a Promise de migração do shell pré-React. Clientes já migrados sem controller evitam enumerar caches/workers. Observers/listeners do shell terminam no handoff de bootstrap, com limite máximo de 20 segundos. A recuperação moderna de chunks mantém cooldown compartilhado de 45 segundos e fallback para storage bloqueado.

Mantêm-se `public/sw.js`, `public/sw-runtime-v8.js` e o pequeno resgate pré-bootstrap enquanto clients antigos ainda podem estar presos em bundles obsoletos. Preservar recovery de chunks atuais é uma responsabilidade distinta da migração v10.

Critérios para a próxima retirada:

1. Observar uma janela real de uso sem incidentes de clientes controlados por workers antigos.
2. Reproduzir atualização de clientes com cache legado, storage bloqueado, offline e chunks expirados.
3. Remover a enumeração na inicialização primeiro; manter o endpoint de aposentadoria por uma janela adicional.
4. Remover o resgate pré-React somente após validar atualização a partir da versão legada e rollback.

Esta tarefa não inventa uma data de migração nem apaga o mecanismo antes da confirmação desses critérios.
