# Consolidação dos PRs abertos

Base: `3a9afa67`, após os PRs 172, 173, 171, 170, 145 e 148.

| PR | Destino |
| --- | --- |
| 144 | Preservar a regressão com `saveData` no teste atual de carregamento do contato. O preload de fundo não pode competir com a asserção de ausência de carga especulativa. |
| 150 | Substituído pela hierarquia atual. Não recuperar o Hero antigo, provas duplicadas, alturas artificiais nem contratos de quatro jogos. |
| 151 | Substituído pelas simplificações integradas. Manter Trust Bar única, menu compacto e projetos antes do laboratório. |
| 158 | Preservar a intenção da regressão: foco não carrega o Arcade; ativação por toque abre o módulo. Manter a correção mobile atual e o preload somente por hover de mouse. |
| 160 | Recuperar roque, en passant e nível Especialista nos jogos. Adaptar o motor de xadrez ao desfazer, coordenadas e navegação por teclado atuais, mantendo a avaliação de material corrigida na main. |
| 167 | Recuperar problema, objetivo, decisões e resultado dos cases e o link público do pipeline. Não duplicar a seção de qualidade nem transplantar componentes do shell anterior à migração de workspaces. |

## Contratos preservados

- Cinco jogos, modos locais, sessão antiga e descoberta progressiva.
- Hero compacto, Trust Bar única, projetos antes de Experience Hub e Arcade.
- Seleção de objetivo sincronizada entre menu, Hub e dock, inclusive com storage bloqueado.
- Currículo web imprimível; nenhum leitor PDF ou mídia aposentada.
- Frontend público isolado da API opcional.
- Teste mobile de abertura por toque executado em Chromium e WebKit.

## Regressões adicionais

- Roque move rei e torre; desfazer restaura a posição e os direitos anteriores.
- Roque proibido através de ataque ou após movimentação da torre.
- En passant expira após uma rodada e não pode expor o próprio rei.
- Xeque-mate, afogamento, promoção e proteção contra sacrifício de rainha.
- Dados externos de uma jogada não podem forjar roque ou captura especial.
- Cases legíveis em 320 px e destino público para conferir o pipeline.
- Controles de Especialista nos quatro jogos com dificuldade configurável.

A consolidação deve passar o workflow completo antes do merge. Fechar as propostas antigas como substituídas preserva suas branches e histórico.
