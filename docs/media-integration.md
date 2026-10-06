# Mídias do portfólio

O projeto publica somente mídias versionadas em `apps/portfolio/public/portfolio-media/`.
Use `portfolioMediaPath` para resolver o caminho sob a base do GitHub Pages.

As referências antigas a fundos, texturas, capas sociais e PDF sem arquivos foram
removidas. O currículo web continua disponível e pode ser impresso ou salvo em PDF
pelo próprio navegador. A seção social contém links diretos para os perfis publicados
na experiência atual.

Execute `pnpm audit:assets --strict-if-present` antes de publicar mudanças de mídia.
Todo arquivo local referenciado deve existir no repositório; trabalhos reais devem ter
autoria e associação entre título, arquivo e capa verificadas.
