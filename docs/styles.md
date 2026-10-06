# Organização de estilos

A estrutura vigente não possui mais o antigo diretório `client/src/styles`. O ponto global de estilos do portfólio é `apps/portfolio/src/index.css`, combinado com Tailwind e classes locais dos componentes React.

## Contrato atual

- `DESIGN.md` é a referência de identidade, hierarquia, motion, mobile e anti-patterns.
- `apps/portfolio/src/index.css` concentra tokens globais necessários, regras editoriais, temas claro/escuro, impressão, estados responsivos e fallbacks de acessibilidade.
- componentes em `apps/portfolio/src/features/portfolio/components` mantêm a maior parte da composição e dos estados visuais próximos ao markup.
- regras de `prefers-reduced-motion`, touch/mobile e tema claro podem repetir seletores em contextos diferentes; isso é intencional quando o contexto de media query ou a propriedade aplicada muda.

## Regra para refatorar CSS

Não mover blocos apenas para reduzir tamanho de arquivo. A precedência e a ordem do CSS fazem parte do comportamento visual. Antes de consolidar regras:

1. confirmar que seletor, contexto de media query e especificidade são equivalentes;
2. distinguir regra complementar de regra realmente sobrescrita;
3. adicionar cobertura quando a duplicação possa voltar;
4. executar unitários, build e Playwright, incluindo tema claro, mobile e reduced-motion.

`indexCssHygiene.test.ts` protege duplicações comprovadamente mortas. Ele não deve ser ampliado para proibir repetições responsivas legítimas.
