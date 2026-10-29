# PG Bot

Mascote dos projetos de Pablo Guilherme: robô compacto de carcaça clara, detalhes azuis e olhos ciano, inspirado na estética do Codex.

## Arquivo e uso

- Arquivo local: `apps/portfolio/public/brand/pg-bot/mascot.webp`.
- Versão estática, 96 × 112 px, transparente e sem serviços externos.
- Exibir como assinatura discreta com dimensões explícitas e carregamento lazy.
- Quando o nome aparece ao lado, usar `alt=""` para evitar repetição.
- Não substituir o nome, o ícone PWA ou a identidade própria do projeto.
- Não usar animação automática nem sobrepor controles, formulários ou jogos.
- A imagem não representa um serviço de IA. Respostas prontas continuam identificadas como automáticas.

A cartela completa de animações fica no kit do mascote; não é carregada pelo site. Para manter consistência, reutilize o mesmo arquivo em vez de gerar uma nova versão por projeto.

## Guia de ajuda no portfólio

O componente `PortfolioPGBot.tsx` funciona como **guia local de respostas automáticas**, e não como um chatbot conectado a um modelo generativo. Os roteamentos determinísticos e testes ficam em `utils/pgBotGuide.ts` e `utils/pgBotGuide.test.ts`.

- **Atalhos visíveis:** hero, navegação mobile, cabeçalho desktop e assinatura no rodapé. Todos abrem o mesmo painel, evitando interfaces duplicadas.
- **Tópicos:** projetos e cases, Observatório, Trajeto, PG Arcade, currículo, serviços, briefing e privacidade. Os links dos projetos individuais vêm do catálogo `projectNetwork.ts`; não se deve declarar produtos como publicados se estiverem em evolução.
- **Privacidade:** a pergunta não é enviada a API ou plugin; as mensagens ficam apenas no estado temporário do diálogo, sem telemetria de conteúdo e sem armazenamento local. Um visitante pode seguir ao formulário/WhatsApp por conta própria; o bot não envia mensagens.
- **Acessibilidade:** painel `<dialog>` nativo, `Escape`, botão de fechamento visível, foco dentro do painel e retorno ao elemento que o abriu (ou ao botão de menu quando esse elemento foi desmontado).
- **Desempenho:** o componente é carregado sob demanda no clique, não no bundle inicial da vitrine. A imagem mantém proporções e não inclui animação automática.
- **Qualidade:** `e2e-static/pg-bot-functional.spec.ts` cobre 320/390/1280 px, atalhos, teclado, URLs, privacidade e ausência de overflow.
