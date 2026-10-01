import {
  ArrowDown,
  ArrowUpRight,
  Instagram,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";
import type { ReactNode } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import type { PortfolioContactProps } from "./types";

type ContactMethodsProps = Pick<
  PortfolioContactProps,
  "whatsAppUrl" | "telegramUrl"
> & { children: ReactNode };

export function ContactMethods({
  whatsAppUrl,
  telegramUrl,
  children,
}: ContactMethodsProps) {
  return (
    <div className="min-w-0 border-b border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24 lg:border-b-0 lg:border-r lg:px-12 lg:py-28">
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">
        Contato
      </p>
      <h2 className="mt-6 max-w-full break-words font-display text-[clamp(3.1rem,5.6vw,6rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">
        Vamos definir uma solução clara para o seu projeto.
      </h2>
      <p className="mt-8 max-w-md font-body text-base leading-8 text-[#c0e3f4]">
        Conte o problema, quem vai usar a solução e o resultado esperado. A
        partir disso, organizo o contexto para alinhar escopo, entrega e
        próximos passos.
      </p>
      <div className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8ca4c8]">
        <span className="human-status-dot h-2 w-2 shrink-0 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" />{" "}
        agenda sob consulta para novos projetos e oportunidades
      </div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <a
          href="#contato-briefing"
          className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#38bdf8] px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#02111f] transition-all hover:bg-[#a5f3fc] active:scale-[0.97] sm:min-h-0"
        >
          enviar briefing <ArrowDown className="h-3.5 w-3.5" />
        </a>
        <a
          href={whatsAppUrl}
          onClick={() =>
            trackPortfolioEvent("whatsapp_click", { source: "contact" })
          }
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#67e8f9]/35 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#c9f8ff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] sm:min-h-0"
        >
          abrir WhatsApp <MessageCircle className="h-3.5 w-3.5" />
        </a>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Abrir canal público de atendimento no Telegram"
          className="group inline-flex min-h-11 items-center justify-center gap-2 border border-[#67e8f9]/35 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#c9f8ff] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0b2746] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:min-h-0"
        >
          <Send className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />{" "}
          Telegram
        </a>
      </div>
      <div className="mt-7 grid max-w-md gap-px border border-white/[0.1] bg-white/[0.1] sm:grid-cols-2">
        <a
          href="https://www.instagram.com/pablogui000/"
          target="_blank"
          rel="noreferrer"
          className="social-channel group flex items-center gap-3 bg-[#070a10] px-4 py-4"
        >
          <span className="social-icon-mark grid h-8 w-8 place-items-center border border-[#3b82f6]/35 text-[#77a9fc]">
            <Instagram className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f87ad]">
              Instagram
            </span>
            <span className="mt-1 block truncate font-mono text-[11px] text-[#e7f0ff]">
              @pablogui000
            </span>
          </span>
        </a>
        <a
          href="https://www.instagram.com/mpjstoryworks/"
          target="_blank"
          rel="noreferrer"
          className="social-channel group flex items-center gap-3 bg-[#070a10] px-4 py-4"
        >
          <span className="social-icon-mark grid h-8 w-8 place-items-center border border-[#3b82f6]/35 text-[#77a9fc]">
            <Instagram className="h-4 w-4" />
          </span>
          <span className="min-w-0">
            <span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f87ad]">
              Instagram
            </span>
            <span className="mt-1 block truncate font-mono text-[11px] text-[#e7f0ff]">
              @mpjstoryworks
            </span>
          </span>
        </a>
      </div>
      <a
        href="https://ig.me/m/pablogui000"
        target="_blank"
        rel="noreferrer"
        className="group mt-5 inline-flex items-center gap-3 border border-[#38bdf8]/45 bg-[#071b39] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#e4faff] transition-all hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0a2b57] hover:shadow-[0_10px_24px_rgba(56,189,248,0.16)]"
      >
        <Instagram className="h-4 w-4 text-[#67e8f9]" /> Instagram Direct{" "}
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
      <div className="mt-5 max-w-md border border-cyan-100/[0.16] bg-[#06172f]/70 px-5 py-4">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#67e8f9]" />
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">
              área de atendimento
            </p>
            <p className="mt-2 font-body text-sm leading-6 text-[#d3edf8]">
              Águas Lindas de Goiás, Planaltina (GO/DF) e Entorno.
            </p>
            <p className="mt-1 font-body text-xs leading-5 text-[#8eb4c8]">
              Outras regiões podem ser avaliadas conforme o projeto.
            </p>
          </div>
        </div>
      </div>
      {children}
      <div className="mt-7 max-w-md border-l-2 border-[#38bdf8] bg-[#071a35]/70 px-5 py-5">
        <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">
          depois do seu briefing
        </p>
        <ol className="mt-4 space-y-3 font-body text-sm leading-6 text-[#cbe8f6]">
          <li>
            <span className="mr-2 font-mono text-[#67e8f9]">01</span>O contexto
            é organizado para definir o que realmente precisa ser produzido.
          </li>
          <li>
            <span className="mr-2 font-mono text-[#67e8f9]">02</span>Formato,
            data e detalhes são alinhados com transparência.
          </li>
          <li>
            <span className="mr-2 font-mono text-[#67e8f9]">03</span>A proposta
            chega com escopo, entrega e próximos passos claros.
          </li>
        </ol>
      </div>
    </div>
  );
}
