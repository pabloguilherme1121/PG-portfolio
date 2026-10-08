import { ArrowDown, MessageCircle } from "lucide-react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";

export function PortfolioContactIntro({ whatsAppUrl }: { whatsAppUrl: string; telegramUrl: string }) {
  return <>
    <p className="professional-eyebrow">Contato</p>
    <h2 className="mt-4 max-w-xl font-display text-[clamp(2rem,4vw,3.5rem)] font-medium leading-tight tracking-[-0.035em] text-white">Vamos conversar sobre seu projeto.</h2>
    <p className="mt-5 max-w-[60ch] font-body text-base leading-7 text-[#c0e3f4]">Conte o que precisa resolver e quem vai usar a solução. A conversa começa por aí; depois alinhamos escopo, prazo e próximos passos.</p>
    <div className="mt-6 flex flex-wrap gap-3">
      <a href={whatsAppUrl} onClick={() => trackPortfolioEvent("whatsapp_click", { source: "contact" })} target="_blank" rel="noopener noreferrer" className="professional-primary">Conversar no WhatsApp <MessageCircle className="h-4 w-4" aria-hidden="true" /></a>
      <a href="#contato-briefing" className="professional-secondary">Prefiro preparar um briefing <ArrowDown className="h-4 w-4" aria-hidden="true" /></a>
    </div>
    <p className="mt-4 max-w-lg font-body text-sm leading-6 text-[#a9bfd8]">O WhatsApp abre em outra aba. Você revisa a mensagem e decide quando enviar. Atendimento em Águas Lindas de Goiás, Planaltina e Entorno; outras regiões sob consulta.</p>
  </>;
}
