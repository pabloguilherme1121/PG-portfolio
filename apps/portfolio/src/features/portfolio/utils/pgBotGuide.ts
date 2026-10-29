import { portfolioArcadeUrl, portfolioContactEmail } from "@/features/portfolio/portfolioConfig";
import { projectNetwork } from "@/features/portfolio/projectNetwork";

export type PgBotAnswer = {
  kind: "answer" | "fallback";
  text: string;
  action?: { label: string; href: string; external?: boolean };
};

/** Orientações locais e verificáveis; o visitante não envia perguntas a servidores. */
export const PG_BOT_SUGGESTIONS = [
  "Quais projetos posso conhecer?",
  "Como jogar no PG Arcade?",
  "Quero ver seu currículo",
  "Quais serviços você presta?",
  "Como pedir orçamento?",
] as const;

const normalize = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

export function resolvePgBotAnswer(question: string): PgBotAnswer {
  const term = normalize(question.slice(0, 400));
  if (!term) {
    return { kind: "fallback", text: "Escolha um assunto ou escreva sua dúvida sobre projetos, currículo, serviços ou contato." };
  }
  if (/privacidad|cookies|lgpd|dados pessoais|meus dados|coleta de dados|armazenamento de dados/.test(term)) {
    return {
      kind: "answer",
      text: "O guia PG Bot responde neste navegador, sem enviar esta conversa a um servidor. O briefing usa um rascunho local e você decide se envia a mensagem. Leia também a política de privacidade.",
      action: { label: "Ler privacidade", href: `${import.meta.env.BASE_URL}privacidade/` },
    };
  }
  if (/^(oi|ola|bom dia|boa tarde|boa noite|ajuda|menu|o que voce faz)[!?.\s]*$/.test(term)) {
    return {
      kind: "answer",
      text: "Posso indicar projetos em funcionamento, o currículo, o código no GitHub e as etapas para preparar um briefing. Escreva o que você procura ou escolha uma sugestão abaixo.",
    };
  }
  const projectMatch = [
    ["observatorio", "observatorio"],
    ["trajeto", "trajeto"],
    ["eleicoes goias", "eleicoes-goias"],
    ["eleicoes de goias", "eleicoes-goias"],
    ["mapa planaltina", "mapa-planaltina"],
    ["mapa de planaltina", "mapa-planaltina"],
  ].find(([name]) => term.includes(name));
  const linkedProject = projectMatch && projectNetwork.find(project => project.id === projectMatch[1]);
  if (linkedProject) {
    return {
      kind: "answer",
      text: `${linkedProject.name}: ${linkedProject.description} Estado informado na vitrine: ${linkedProject.status}.`,
      action: { label: `Abrir ${linkedProject.name}`, href: linkedProject.href, external: true },
    };
  }
  if (/estrateg|miss(?:ao|oes)|campanha tatica/.test(term)) {
    return {
      kind: "answer",
      text: "O PG Estratégia é a expansão de jogos de estratégia do PG Arcade. A campanha reúne 150 missões distribuídas por seis sistemas de regras; missões não devem ser contadas como 150 jogos independentes. Conheça o Arcade e acompanhe a evolução dos novos motores.",
      action: { label: "Abrir PG Arcade", href: portfolioArcadeUrl, external: true },
    };
  }
  if (/arcade|jog|game|estrateg|snake|tabuleiro/.test(term)) {
    return {
      kind: "answer",
      text: "O PG Arcade é o projeto de jogos no navegador, com opções para celular e computador. Os jogos têm um site próprio para não sobrecarregar o portfólio.",
      action: { label: "Abrir PG Arcade", href: portfolioArcadeUrl, external: true },
    };
  }
  if (/curricul|recrutad|formac|tecnolog|competenc|perfil profission/.test(term)) {
    return {
      kind: "answer",
      text: "O currículo web apresenta formação em Análise e Desenvolvimento de Sistemas, tecnologias e projetos. Abra a seção e confira as evidências disponíveis.",
      action: { label: "Ver currículo", href: "#curriculo-web" },
    };
  }
  if (/e-?mail|correio eletronico/.test(term)) {
    return {
      kind: "answer",
      text: "Você também pode entrar em contato por e-mail. O PG Bot não envia mensagens: ao selecionar a opção, seu aplicativo de e-mail abre um rascunho para você revisar.",
      action: { label: "Escrever e-mail", href: `mailto:${portfolioContactEmail}`, external: true },
    };
  }
  if (/contrat|orcament|briefing|preco|quanto custa|falar|contat|propost|whatsapp|e-?mail/.test(term)) {
    return {
      kind: "answer",
      text: "Para discutir uma ideia, abra o briefing opcional. São cinco etapas para organizar contexto e necessidades. A conversa segue por WhatsApp, e o envio depende da sua confirmação.",
      action: { label: "Preparar briefing", href: "#contato-briefing" },
    };
  }
  if (/codigo|github|repositori|playwright|testes|qualidade/.test(term)) {
    return {
      kind: "answer",
      text: "O código deste portfólio está no GitHub. Lá você pode conferir o React e TypeScript, os testes automatizados e as mudanças propostas. O histórico de commits mostra a evolução do projeto.",
      action: { label: "Ver repositório", href: "https://github.com/pabloguilherme1121/PG-portfolio", external: true },
    };
  }
  if (/servic|soluc|desenvolv|site|dashboard|interface/.test(term)) {
    return {
      kind: "answer",
      text: "O trabalho apresentado envolve sites, interfaces responsivas, dashboards e produtos digitais. Cada serviço começa pela compreensão do problema e do público.",
      action: { label: "Explorar serviços", href: "#servicos" },
    };
  }
  if (/outro|rede|acompanhar|ecossistema|todos os projetos/.test(term)) {
    return {
      kind: "answer",
      text: "A rede de projetos reúne aplicações publicadas e outras em evolução. Cada card indica o estado do produto e traz acessos ao site ou ao código.",
      action: { label: "Ver rede de projetos", href: "#rede-projetos" },
    };
  }
  if (/projet|portfolio|observatorio|trajeto|case|trabalho/.test(term)) {
    return {
      kind: "answer",
      text: "Comece pelos três trabalhos de destaque: Observatório, PG Arcade e Trajeto. Cada um apresenta problema, decisões e acesso público quando disponível.",
      action: { label: "Conhecer projetos", href: "#projetos" },
    };
  }
  return {
    kind: "fallback",
    text: "Sou o PG Bot, um guia de respostas locais, não um chat com IA online. Posso orientar sobre projetos, currículo, jogos, serviços, briefing e privacidade. Escolha um tema para continuar.",
  };
}
