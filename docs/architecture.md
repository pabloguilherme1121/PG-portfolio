# Arquitetura do projeto

## Visão geral

O portfólio tem uma experiência pública em React 19, TypeScript e Vite. O GitHub Pages publica uma versão estática; o backend Express/tRPC permanece disponível para ambientes que desejem persistir pedidos de briefing.

A arquitetura atual privilegia uma única jornada pública e remove ferramentas administrativas que não contribuíam para a apresentação profissional.

## Fronteiras

| Área | Responsabilidade | Local |
| --- | --- | --- |
| Aplicação | providers, roteamento e fallback | `client/src/App.tsx` |
| Portfólio | home, seções, projetos e contato | `client/src/features/portfolio/` |
| Páginas auxiliares | privacidade e 404 | `client/src/pages/` |
| Backend opcional | briefing, autenticação de infraestrutura e serviços do template | `server/` |
| Persistência | usuários e pedidos de briefing | `drizzle/`, `server/db.ts` |
| QA | unitários, E2E, acessibilidade e build | `client/**/*.test.ts`, `server/*.test.ts`, `e2e/`, `scripts/` |

## Jornada pública

A home segue esta ordem:

1. proposta de valor;
2. perfil e competências;
3. serviços;
4. processo;
5. projetos e estudos de caso;
6. briefing e contato.

O projeto Observatório funciona como prova externa de uma entrega web publicada. Os demais projetos usam um modal único de detalhes, sem favoritos, filtros, exportação, ordenação manual ou lightbox paralelo.

## Dados

`portfolioData.tsx` é a fonte canônica de competências, serviços, processo e projetos. Estudos de caso são derivados dos próprios projetos, evitando duas bases de conteúdo para a mesma informação.

## Publicação

No GitHub Pages, o formulário não envia dados automaticamente: ele prepara uma mensagem para o WhatsApp e exige uma ação explícita do visitante. Em um ambiente com backend, a mesma interface pode usar a procedure `quoteRequest.create`.

## Regras

- componentes visuais não devem duplicar dados canônicos;
- recursos internos não devem ser expostos no bundle público sem uma necessidade concreta;
- novas dependências e rotas devem justificar seu impacto na jornada principal;
- alterações de navegação ou interação devem manter cobertura E2E e acessibilidade.
