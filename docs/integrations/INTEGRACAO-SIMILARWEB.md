# Integração SimilarWeb — pablo-guilherme-portfolio

## O que foi adicionado

Este pacote adiciona um painel administrativo de analytics para consultar o domínio `metodoip.com.br` ou qualquer outro domínio válido. A integração mantém as chamadas no backend, protege o acesso com a conta administradora e apresenta os resultados em uma interface responsiva.

| Função | Descrição |
|---|---|
| Visitas totais | Série mensal de visitas do domínio |
| Visitantes únicos | Estimativa de visitantes únicos |
| Taxa de rejeição | Indicador mensal de rejeição |
| Ranking global | Posição global retornada pela fonte |
| Fontes desktop | Canais de aquisição em dispositivos desktop |
| Fontes mobile | Canais de aquisição em dispositivos móveis |
| Tráfego por país | Distribuição dos principais países |
| Filtros | Domínio, mês inicial e mês final |
| Exportação | Download do retorno completo em JSON |
| Segurança | Rota e procedimento tRPC restritos a administrador |
| Estados de erro | Mensagens para fonte indisponível, dados ausentes e consulta não concluída |

## Como acessar

Depois de iniciar o projeto, entre com a conta proprietária/administradora e abra:

```text
/analytics
```

A rota também aparece na navegação administrativa da página de favoritos.

## Arquivos principais

```text
server/similarweb.ts
server/similarweb.test.ts
client/src/pages/SimilarWebAnalytics.tsx
server/routers.ts
client/src/App.tsx
client/src/pages/FavoritesManagement.tsx
```

O serviço usa o wrapper de Data API já presente em `server/_core/dataApi.ts`. Nenhuma credencial da fonte é enviada para o navegador.

## Configuração

O projeto já possui a infraestrutura de Data API do template fullstack. Em uma implantação compatível, mantenha configuradas as variáveis de ambiente do backend fornecidas pelo ambiente da aplicação, especialmente `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY`. Não coloque essas variáveis em arquivos públicos, no frontend ou em um `.env` versionado.

A conta que acessa o painel precisa ter `role = admin` na tabela de usuários. Usuários comuns recebem uma tela de acesso restrito e não conseguem executar as consultas.

## Períodos

O painel aceita até 12 meses para as métricas gerais. As métricas de fontes e países são automaticamente restringidas aos três meses mais recentes do período informado, respeitando a limitação do endpoint.

As consultas foram separadas por métrica e retornam um status individual. Se uma consulta falhar, o painel mantém as outras métricas disponíveis e mostra uma mensagem específica no cartão correspondente.

## Comandos de validação

```bash
pnpm install --frozen-lockfile
pnpm check
pnpm test
pnpm build
```

Todos esses comandos foram executados com sucesso durante a preparação deste pacote. O build ainda pode mostrar avisos preexistentes sobre os placeholders de analytics do template (`VITE_ANALYTICS_ENDPOINT` e `VITE_ANALYTICS_WEBSITE_ID`); eles não impedem a compilação do módulo SimilarWeb.

## Observação importante

Os dados do SimilarWeb são estimativas de terceiros. O painel não substitui Google Analytics, Google Search Console, Meta Ads ou outras fontes internas de conversão. Se a fonte não disponibilizar dados, o sistema mostra a indisponibilidade em vez de criar números simulados.
