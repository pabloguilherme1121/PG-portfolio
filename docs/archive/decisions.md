# Decisões arquiteturais

## Refatoração incremental em vez de reescrita

A base existente tem comportamento suficiente e cobertura de testes para justificar uma migração gradual. A Home foi movida para uma feature sem alterar sua rota pública, seus URLs ou seus fluxos de interação.

## Separação entre visitante e curadoria

A Home deve priorizar apresentação, trabalhos, competências, prova, contato e agenda. Favoritos, ordenação, exportação e analytics permanecem em rotas administrativas protegidas. A separação reduz a carga cognitiva da página pública e preserva as ferramentas internas para quem precisa delas.

## Dados estáticos fora da página

Catálogo de projetos, filtros, perfis de ordenação e sinais de repertório ficam em `features/portfolio/portfolioData.tsx`. Isso reduz a quantidade de declarações misturadas com o estado da página e cria um ponto único para futuras alterações de catálogo.

## Utilitários fora da página

Normalização de busca, leitura de filtros da URL, telemetria e categorização de projetos ficam em `features/portfolio/portfolioUtils.tsx`. O objetivo é permitir testes e reutilização sem depender do ciclo de renderização da Home.

## CSS preservado com organização progressiva

O `index.css` ainda concentra o sistema visual porque possui regras de tema, acessibilidade, animação e responsividade fortemente acopladas. A divisão agressiva neste momento aumentaria o risco de regressão de precedência. A organização será feita em cortes menores, começando por tokens e blocos independentes após cada alteração visual ser coberta por validação.

## Não adicionar novas funcionalidades ao caminho público

O painel SimilarWeb existente foi mantido como ferramenta administrativa. A refatoração atual não adiciona novos botões, integrações ou etapas à Home; seu objetivo é reduzir acoplamento, melhorar localização do código e preservar o foco comercial do portfólio.

## Componentes por responsabilidade

As seções narrativas, contato/briefing e rodapé foram extraídas para componentes da feature. Exportação de favoritos, compartilhamento de projetos e telemetria agora vivem em utilitários próprios. Essa divisão reduz o acoplamento sem criar uma camada abstrata genérica que esconderia as regras do portfólio.

## Autorização em duas camadas

As páginas administrativas usam `DashboardLayout requireAdmin` para impedir que usuários autenticados comuns renderizem o shell interno. O backend continua usando `adminProcedure` como autoridade final, e as queries/mutations permanecem desabilitadas no cliente quando a role não é `admin`. O gate visual não substitui a autorização do servidor.

## Limpeza conservadora de dependências

Foram removidos somente pacotes sem referências no código, nos estilos ou nas configurações atuais: `framer-motion`, `add`, `tailwindcss-animate` e `@tailwindcss/typography`. Dependências de tipos globais, build, UI e integração foram mantidas quando havia uso direto ou indireto comprovável.
