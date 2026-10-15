# Retornos para a central de projetos

Alterações preparadas em 15/10/2026, ainda não aplicadas aos repositórios de Pabloguilherme01. A integração conectada permite leitura e retornou HTTP 403 ao tentar criar uma branch no Observatório. Não foram abertas PRs nesses três repositórios.

Os patches acrescentam um link de retorno normal para a central pública, sem interceptar o roteador e sem alterar dados ou preferências:

- Observatório: rodapé existente.
- Trajeto: página Ajuda.
- Mapa Planaltina: página Fontes, acessível pela navegação móvel.

Em uma branch do respectivo repositório, confira `git apply --check caminho-do-patch` e aplique `git apply caminho-do-patch`. Execute os checks do repositório e QA de navegador antes de publicar. Os patches foram conferidos contra os snapshots locais; não certificam um HEAD futuro nem navegação em produção.
