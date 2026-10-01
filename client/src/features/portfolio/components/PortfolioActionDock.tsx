import {
  Braces,
  ClipboardCheck,
  FileText,
  Instagram,
  Layers2,
  MessageCircle,
  Send,
} from "lucide-react";
import type { MobileExperienceRoute } from "@/features/portfolio/utils/mobileJourney";
import type {
  getMobilePrimaryAction,
  getMobileSecondaryShortcut,
} from "@/features/portfolio/utils/mobileJourney";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";

type PortfolioActionDockProps = {
  hidden: boolean;
  compact: boolean;
  scrollProgress: number;
  route: MobileExperienceRoute;
  primaryAction: ReturnType<typeof getMobilePrimaryAction>;
  secondaryAction: ReturnType<typeof getMobileSecondaryShortcut>;
  journeyHint: string;
  whatsAppUrl: string;
  telegramUrl: string;
  onOpenArcade: () => void;
};

export default function PortfolioActionDock({
  hidden,
  compact,
  scrollProgress,
  route,
  primaryAction,
  secondaryAction,
  journeyHint,
  whatsAppUrl,
  telegramUrl,
  onOpenArcade,
}: PortfolioActionDockProps) {
  const SecondaryIcon = route === "recruiter" ? FileText : route === "explorer" ? Braces : Layers2;

  return (
    <nav
      aria-label="Ações rápidas"
      aria-hidden={hidden ? "true" : undefined}
      inert={hidden ? true : undefined}
      data-mobile-contact-bar="true"
      data-mobile-dock="true"
      data-mobile-dock-hidden={hidden ? "true" : "false"}
      data-mobile-dock-compact={compact ? "true" : "false"}
      className={`contact-float fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-[60] grid grid-cols-[minmax(0,1fr)_3.2rem_3.5rem] items-stretch gap-2 overflow-hidden border border-[#67e8f9]/35 bg-[#07101e]/97 p-1.5 shadow-[0_14px_34px_rgba(0,0,0,0.38)] backdrop-blur-sm transition-[opacity,transform] duration-200 sm:bottom-5 sm:left-auto sm:right-5 sm:flex sm:bg-[#07101e]/95 sm:backdrop-blur-md ${hidden ? "pointer-events-none translate-y-2 opacity-0" : "translate-y-0 opacity-100"}`}
    >
      <span data-mobile-dock-progress="true" aria-hidden="true" className="pointer-events-none absolute inset-x-2 top-0 block h-px overflow-hidden rounded-full bg-white/10 sm:hidden">
        <span
          className="block h-full origin-left bg-[#67e8f9] transition-transform duration-150 motion-reduce:transition-none"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />
      </span>

      <a
        data-mobile-primary-action="true"
        data-mobile-dock-primary="true"
        href={primaryAction.href}
        onClick={() => trackPortfolioEvent("quote_cta", { source: "floating" })}
        className="inline-flex min-h-14 min-w-0 flex-1 touch-manipulation flex-col items-center justify-center rounded-[10px] bg-[#38bdf8] px-2 py-1 font-mono text-[#02111f] transition-[background-color,transform] hover:bg-[#a5f3fc] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none min-[360px]:px-3 sm:hidden"
        aria-label={primaryAction.ariaLabel}
      >
        <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em]">
          <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
          {primaryAction.label}
        </span>
        <span data-mobile-journey-hint="true" className={`mt-0.5 max-w-full truncate text-[7px] uppercase tracking-[0.05em] opacity-70 min-[390px]:text-[8px] ${compact ? "hidden" : ""}`}>
          {journeyHint}
        </span>
      </a>

      <a
        data-mobile-dock-secondary="true"
        data-mobile-dock-secondary-route={route}
        href={secondaryAction.href}
        onClick={(event) => {
          if (route !== "explorer") return;
          event.preventDefault();
          onOpenArcade();
        }}
        aria-label={`Abrir ${secondaryAction.label}`}
        title={secondaryAction.label}
        className="mobile-context-action inline-flex min-h-14 min-w-0 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-[10px] border border-white/10 bg-[#071326] px-1 text-center text-[#d9fbff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:hidden"
      >
        <SecondaryIcon className="h-4 w-4 text-[#67e8f9]" aria-hidden="true" />
        <span className="max-w-full truncate font-mono text-[7px] font-semibold uppercase tracking-[0.03em] min-[390px]:text-[8px]">
          {secondaryAction.label === "PG Arcade" ? "arcade" : secondaryAction.label}
        </span>
      </a>

      <a
        data-mobile-whatsapp-action="true"
        href={whatsAppUrl}
        onClick={() => trackPortfolioEvent("whatsapp_click", { source: "floating" })}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp sobre um orçamento"
        title="WhatsApp — falar sobre um orçamento"
        className="contact-float-link contact-float-whatsapp mobile-whatsapp-action group min-h-12 border-[#38bdf8]/70 bg-[#38bdf8]/10"
      >
        <MessageCircle className="h-4 w-4 fill-current" aria-hidden="true" />
        <span>WhatsApp</span>
      </a>
      <a
        href={telegramUrl}
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir canal público de atendimento no Telegram"
        title="Telegram"
        className="contact-float-link contact-float-telegram group hidden sm:flex"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        <span>Telegram</span>
      </a>
      <a
        href="https://www.instagram.com/pablogui000/"
        target="_blank"
        rel="noreferrer"
        aria-label="Abrir Instagram @pablogui000"
        title="Instagram"
        className="contact-float-link contact-float-instagram group hidden sm:flex"
      >
        <Instagram className="h-4 w-4" aria-hidden="true" />
        <span>Instagram</span>
      </a>
    </nav>
  );
}
