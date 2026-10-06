# Procedimento manual — issue #182

Base: https://github.com/pabloguilherme1121/PG-portfolio/issues/182

## Evidência consultada

Na auditoria de 2026-10-06, a `main` continuava sem proteção administrativa
(`protected=false`) e sem ruleset ativo. A descrição pública ainda mencionava Manus,
`homepage=null` e `topics=[]`. A exclusão automática de branches após merge estava
desativada e a API retornou 204 branches no repositório. Esses dados administrativos
não são corrigidos por CI verde nem por mudanças no README.

Commits de merge produzidos pelo GitHub podem aparecer como `Verified`; isso não
comprova assinatura configurada no computador do proprietário. Nenhum item
administrativo abaixo deve ser marcado como aplicado sem evidência posterior à
configuração no GitHub.

## GitHub: configurar e verificar

1. Settings → Rules → Rulesets → New branch ruleset. Nome: main-governance;
   enforcement: Active; alvo: branch main. Não exigir PR/aprovações de um segundo
   mantenedor: Require a pull request before merging com 0 aprovações obrigatórias.
   Não ativar aprovação de CODEOWNERS para este fluxo solo.
2. Ativar Require status checks to pass: quality e static-isolation, com origem
   GitHub Actions. Usar os nomes exibidos no PR atual; não exigir deploy, que ocorre
   depois do merge. Ativar branch atualizada antes de merge, atualizando-a normalmente
   quando main mudar e aguardando novamente a CI.
3. Ativar Block force pushes, Restrict deletions e Require conversation resolution
   before merging. Não ativar Restrict updates, que impediria merges rotineiros.
   Não adicionar bypass permanente do proprietário: ele também usa PRs e 0 aprovações.
   Se precisar de recuperação administrativa, editar a regra explicitamente, registrar
   o motivo e restaurá-la; não usar bypass no dia a dia.
4. Validar: reabrir o ruleset e confirmar Active e alvo main. Consultar a página
   de regras da main. Em um PR de mudança pequena, conferir que quality e
   static-isolation do SHA atual são exigidos; falha/pendência deve bloquear o merge.
   Registrar URL do PR, SHA, resultado dos checks e captura/exportação das regras.
   Verificar que não há bypass nem proteção antiga conflitante. Não testar force-push
   ou exclusão na main; para teste de rejeição, reproduzir as regras em branch
   descartável. A inspeção da regra comprova configuração, não uma rejeição executada.

### Check api: condicional, sem travar PRs estáticos

O workflow .github/workflows/api.yml só roda em PRs para main que alterem seus paths:
apps/api/**, packages/contracts/**, package.json, pnpm-lock.yaml, pnpm-workspace.yaml,
drizzle.config.ts, vite.config.ts, scripts/build-api.mjs, scripts/run-workspace.mjs,
scripts/smoke-api.mjs ou o próprio workflow. Consultar o YAML atual em caso de mudança.

Não adicionar api como requisito global enquanto houver esse filtro: workflow
não acionado pode deixar um check obrigatório permanentemente pendente. A UI de
status checks não expressa “obrigatório apenas se aparecer”. No procedimento manual,
PR que tocar esses paths só pode ser integrado com api aprovado no SHA atual;
PR estático deve passar os dois checks globais, sem esperar api. Registrar os paths
alterados e a URL do run api quando aplicável. workflow_dispatch não substitui
automaticamente um check elegível de pull_request.

Se quiser bloquear isso automaticamente, primeiro adaptar o workflow para criar
sempre um job api em pull_request, com detecção de mudanças e etapas condicionais:
mudança relevante roda validação; demais mudanças terminam com sucesso documentado.
Só após testar ambos os tipos de PR tornar api obrigatório globalmente. Isso exige
alteração de código/workflow; não foi aplicado aqui.

### Higiene de branches após merge

Em Settings → General → Pull Requests, ativar **Automatically delete head branches**.
Isso evita que novas branches de PR integrado continuem se acumulando.

Para as branches históricas já existentes, revisar antes de excluir: manter somente
branches ainda ligadas a trabalho ativo ou a um motivo histórico explicitamente
documentado. Branch integrada, substituída ou abandonada pode ser removida depois de
confirmar que o commit relevante já está alcançável pela `main` ou por uma tag.

Validar a configuração abrindo uma PR descartável, integrando-a e confirmando que a
head branch foi removida automaticamente. Depois da limpeza histórica, registrar a
nova contagem de branches na issue #182. Não usar force-push nem reescrever a `main`
como mecanismo de limpeza.

### Metadados públicos

Na página inicial do repositório → engrenagem de About, salvar:

- Description: Portfólio profissional de Pablo Guilherme — produtos digitais, interfaces, dados e engenharia frontend com React e TypeScript.
- Website: https://pabloguilherme1121.github.io/PG-portfolio/
- Topics: portfolio, react, typescript, vite, playwright, github-pages, frontend, pwa.

Validar recarregando About, abrindo o Website e conferindo description, homepage e
topics na API pública do repositório. README atualizado não comprova estes campos.

## Local: assinar commits e verificar no GitHub

No computador de manutenção, criar ou selecionar uma chave SSH de assinatura com
frase secreta. Para criar uma chave dedicada, escolher um caminho ainda inexistente:

```sh
ssh-keygen -t ed25519 -f ~/.ssh/pg_commit_signing -C "PG commit signing"
```

GitHub → Settings da conta → SSH and GPG keys → New SSH key → Signing key:
cadastrar somente o conteúdo do arquivo .pub. Nunca enviar a chave privada.
Dentro do checkout do projeto, configurar a chave e email verificado da conta:

```sh
git config --local gpg.format ssh
git config --local user.signingkey ~/.ssh/pg_commit_signing.pub
git config --local commit.gpgsign true
git config --local user.email "EMAIL_VERIFICADO_DA_CONTA"
```

Usar git/SSH modernos e carregar a chave privada correspondente no ssh-agent
(ssh-add ~/.ssh/pg_commit_signing), se necessário. Criar um commit real de documentação
em uma branch de teste, publicar a branch e abrir PR. Conferir git config --local
--get commit.gpgsign e git cat-file commit HEAD para a presença de gpgsig; presença
não prova verificação criptográfica. A evidência decisiva no GitHub é Verified no
commit desse PR ou verification.verified=true na API. git log --show-signature
com SSH exige também gpg.ssh.allowedSignersFile configurado localmente.

Só depois validar o merge e os fluxos de bots/conector considerar Require signed
commits no ruleset. PRs com commits antigos sem assinatura podem ser bloqueados,
inclusive em squash; não presumir que a assinatura do merge pelo GitHub resolve o
histórico do PR. Corrigir o histórico apenas na branch de trabalho, com coordenação,
sem reescrever main. A chave local do proprietário não fica disponível ao conector.

## Registro de conclusão

Manter cada tarefa pendente até anexar a evidência correspondente na issue #182:
regras ativas/exportadas, PR demonstrando checks aplicáveis e conversas resolvidas,
campos públicos conferidos e commit local Verified. Não marcar toda a issue concluída
com base apenas em CI verde ou assinatura de um merge feito pelo GitHub.

Referências: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets
e https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks
