# Organização de estilos

O `client/src/index.css` agora é apenas o ponto de entrada do sistema visual. As regras foram separadas preservando a ordem de carregamento:

| Arquivo | Conteúdo |
|---|---|
| `client/src/index.css` | Imports do Tailwind, animações utilitárias e arquivos de estilo |
| `client/src/styles/tokens.css` | Tema, cores semânticas, fontes, raios e variáveis globais |
| `client/src/styles/base.css` | Reset leve, tipografia de base, foco, seleção, scrollbar e regras globais |
| `client/src/styles/portfolio.css` | Grid editorial, capítulos, galeria, lightbox, animações e responsividade específica |

A divisão é deliberadamente conservadora. O CSS de portfólio ainda contém regras fortemente relacionadas à experiência editorial e ao lightbox; novos cortes devem ser feitos somente quando um bloco puder ser movido sem alterar precedência ou estados de tema.
