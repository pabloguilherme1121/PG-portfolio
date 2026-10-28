# PG Lab — integrações de ferramentas sem novas cobranças (2026-10-24)

Este documento separa **integrações implantadas** de fluxos de trabalho opcionais por plugins.

## Integrações implantadas
- **GitHub plugin:** código do Creator Kit, testes Playwright e documentação na PR #285. Shotlist #281 e QA Lab #283 permanecem em draft. Manter CI como fonte de verdade antes de merge; não enfraquecer audit.
- **Vercel plugin:** três projetos independentes em plano Hobby existente, com deploy `READY`; aliases `pg-creator-kit.vercel.app`, `pg-shotlist-lab.vercel.app` e `pg-qa-lab.vercel.app`. São demonstrações **pessoais/não comerciais**.
- **Skill TDD:** usar primeiro um teste que reproduza um defeito; corrigir e retestar. Para armazenamento em duas abas, Shotlist e QA Lab tiveram teste RED/GREEN, além de 9/9 e 10/10 testes unitários.
- **Creator Kit → Shotlist:** botão `Shotlist JSON` exporta `version:1`, `title`, `shots`. Importe no botão `Importar JSON` do PG Shotlist; o arquivo foi validado contra o parser do core do Shotlist.

## Fluxos manuais compatíveis (não são OAuth/integrações automáticas)
- **Canva:** usar o gancho e o roteiro exportados pelo Creator Kit como referência para capa/arte. Criar design apenas após checar se os recursos pretendidos são gratuitos no plano da conta. Não há transferência API direta implementada.
- **Descript ou outro editor de vídeo:** copiar roteiro e lista de cenas; editar manualmente, validando recursos do plano gratuito. Nenhum processamento enviado automaticamente.
- **Meta Business Suite:** programar Reel manualmente depois de revisar direitos de imagem, CTA, público e conta conectada. O Creator Kit não publica em Instagram/Facebook.
- **QA Lab:** registrar execução do fluxo no Chrome Android e links de evidência; não inserir dados sensíveis de pacientes, tokens ou mensagens privadas no QA Lab.

## Limites e aceite
- Os aplicativos usam `localStorage` não criptografado. Exportar backup, testar importação/recarga e não armazenar informação sensível.
- Nenhum app possui sincronização multiaparelho, banco remoto ou PWA instalado certificado.
- Antes de alegar produção pública validada, testar HTTP 200 e fluxos em origem HTTPS, Firefox, WebKit e Android físico 320/390.
- Não contratar plano, token pago, créditos, domínio nem habilitar serviços de faturamento sem aprovação explícita.
- A Vercel Hobby só pode hospedar aplicações pessoais/não comerciais. Para serviços comerciais, avaliar hospedagem de acordo com os termos e custos.
