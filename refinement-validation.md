# Validação do refinamento humano e performance

## Interface

A composição foi revisada em desktop, com viewport de 1280×720, e em mobile, com viewport de 375×812. A hierarquia do hero, a navegação móvel, o CTA humanizado “me chama para conversar” e o botão flutuante de WhatsApp permanecem legíveis e sem sobreposição.

A seção de contato recebeu microcopy mais próxima e direta. O estado vazio da galeria agora convida o visitante a enviar um link quando quiser, sem inventar projetos, depoimentos ou avaliações.

## Acessibilidade

A folha global mantém foco visível com `:focus-visible`, foco específico no calendário e `scroll-margin-top` para navegação por âncoras. A regra `prefers-reduced-motion: reduce` desativa animações não essenciais e reduz transições para praticamente zero. A página também preserva `aria-busy`, `aria-live` e `aria-describedby` no fluxo de consulta ao WhatsApp, além de `role="status"` e `role="alert"` nos feedbacks correspondentes.

A validação CDP em Chromium isolado percorreu 16 controles consecutivos, com `document.activeElement` confirmando cada foco na ordem esperada. O CTA “me chama para conversar” permaneceu ativo durante o foco. Com `prefers-reduced-motion: reduce` emulado, `matchMedia` retornou `true`, o calendário apresentou `animation-name: none` e as durações de animação/transição foram reduzidas para `0.000001s`. A validação visual confirmou leitura e composição em desktop e mobile.

## Performance

O bundle foi dividido por rota: a página pública (`Home`) e a área administrativa (`AvailabilityManager`) são carregadas sob demanda. Dependências React, dados e UI foram separadas em chunks próprios.

Antes do code-splitting, o chunk principal tinha aproximadamente 595,87 kB. Depois, o chunk de entrada caiu para aproximadamente 467,31 kB; `Home` passou a 127,98 kB e a área administrativa a 100,75 kB. O build continua exibindo o alerta de chunk acima de 500 kB para o CSS/entrada combinado, mas a divisão efetivamente reduziu o JavaScript inicial principal e manteve todos os ativos reais.

## Qualidade

`pnpm check`, `pnpm test` e `pnpm build` foram executados com sucesso. A suíte automatizada reportou 13 testes aprovados em quatro arquivos. O aviso não bloqueante de `dotenv` no servidor permanece anterior ao refinamento e não afeta a renderização do frontend.

## Próximo checkpoint

Salvar um checkpoint após revisar este registro e atualizar o TODO com as validações comprovadas.
