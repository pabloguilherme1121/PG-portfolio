import {
  ArrowUp,
  Braces,
  ClipboardCheck,
  FileText,
  Instagram,
  Layers2,
  MessageCircle,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getSafeStorage } from "@/lib/safeStorage";
import {
  getMobileDockModel,
  isMobileExperienceRoute,
  readStoredBriefingProgress,
  readStoredExperienceRoute,
  type MobileExperienceRoute,
} from "@/features/portfolio/utils/mobileJourney";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import {
  portfolioWhatsAppUrl as whatsAppUrl,
  portfolioTelegramUrl as telegramUrl,
} from "@/features/portfolio/portfolioConfig";

export function useMobileJourney() {
  const [mobileExperienceRoute, setMobileExperienceRoute] =
    useState<MobileExperienceRoute>(() =>
      readStoredExperienceRoute(getSafeStorage("session"))
    );
  const [hasMobileBriefingDraft, setHasMobileBriefingDraft] = useState(() =>
    readStoredBriefingProgress(getSafeStorage("local"))
  );
  useEffect(() => {
    const handleExperienceRoute = (event: Event) => {
      const routeId = (event as CustomEvent<{ routeId?: unknown }>).detail
        ?.routeId;
      if (isMobileExperienceRoute(routeId)) setMobileExperienceRoute(routeId);
    };
    const handleBriefingProgress = (event: Event) => {
      const hasDraft = (event as CustomEvent<{ hasDraft?: unknown }>).detail
        ?.hasDraft;
      if (typeof hasDraft === "boolean") setHasMobileBriefingDraft(hasDraft);
    };

    window.addEventListener(
      "portfolio:experience-route",
      handleExperienceRoute
    );
    window.addEventListener(
      "portfolio:briefing-progress",
      handleBriefingProgress
    );
    return () => {
      window.removeEventListener(
        "portfolio:experience-route",
        handleExperienceRoute
      );
      window.removeEventListener(
        "portfolio:briefing-progress",
        handleBriefingProgress
      );
    };
  }, []);

  const mobileDock = getMobileDockModel(
    mobileExperienceRoute,
    hasMobileBriefingDraft
  );
  return {
    mobileExperienceRoute,
    mobilePrimaryAction: mobileDock.primary,
    mobileJourneyHint: mobileDock.hint,
    mobileSecondaryShortcut: mobileDock.secondary,
  };
}

type MobileJourneyProps = ReturnType<typeof useMobileJourney> & {
  shouldHideContactFloat: boolean;
  isHeroCtaVisible: boolean;
  isMobileDockCompact: boolean;
  scrollProgress: number;
  showBackToTop: boolean;
  pgLabOpen: boolean;
  openPgArcade: () => void;
};
export function MobileJourney({
  shouldHideContactFloat,
  isHeroCtaVisible,
  isMobileDockCompact,
  scrollProgress,
  showBackToTop,
  pgLabOpen,
  openPgArcade,
  mobileExperienceRoute,
  mobilePrimaryAction,
  mobileJourneyHint,
  mobileSecondaryShortcut,
}: MobileJourneyProps) {
  const isDockHidden = shouldHideContactFloat || isHeroCtaVisible;
  const MobileSecondaryIcon =
    mobileExperienceRoute === "recruiter"
      ? FileText
      : mobileExperienceRoute === "explorer"
        ? Braces
        : Layers2;
  function scrollToTop() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Voltar ao topo da página"
        title="Voltar ao topo"
        aria-hidden={!showBackToTop || pgLabOpen}
        tabIndex={showBackToTop && !pgLabOpen ? 0 : -1}
        className={`fixed bottom-20 right-4 z-[55] grid h-11 w-11 place-items-center border border-[#67e8f9]/45 bg-[#071b39]/95 text-[#bdf7ff] shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-[opacity,transform,background-color,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0b2b57] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none sm:bottom-5 sm:right-[360px] ${showBackToTop && !pgLabOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
      <nav
        aria-label="Ações rápidas"
        aria-hidden={isDockHidden ? "true" : undefined}
        inert={isDockHidden ? true : undefined}
        data-mobile-contact-bar="true"
        data-mobile-dock="true"
        data-mobile-dock-hidden={isDockHidden ? "true" : "false"}
        data-mobile-dock-compact={isMobileDockCompact ? "true" : "false"}
        className={`contact-float fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-[60] grid grid-cols-[minmax(0,1fr)_3.2rem_3.5rem] items-stretch gap-2 overflow-hidden border border-[#67e8f9]/35 bg-[#07101e]/97 p-1.5 shadow-[0_14px_34px_rgba(0,0,0,0.38)] backdrop-blur-sm transition-[opacity,transform] duration-200 sm:bottom-5 sm:left-auto sm:right-5 sm:flex sm:bg-[#07101e]/95 sm:backdrop-blur-md ${shouldHideContactFloat ? "pointer-events-none translate-y-2 opacity-0" : isHeroCtaVisible ? "pointer-events-none translate-y-2 opacity-0 lg:pointer-events-auto lg:translate-y-0 lg:opacity-100" : "translate-y-0 opacity-100"}`}
      >
        <span
          data-mobile-dock-progress="true"
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-2 top-0 block h-px overflow-hidden rounded-full bg-white/10 sm:hidden"
        >
          <span
            className="block h-full origin-left bg-[#67e8f9] transition-transform duration-150 motion-reduce:transition-none"
            style={{ transform: `scaleX(${scrollProgress / 100})` }}
          />
        </span>
        <a
          data-mobile-primary-action="true"
          data-mobile-dock-primary="true"
          href={mobilePrimaryAction.href}
          onClick={() =>
            trackPortfolioEvent("quote_cta", { source: "floating" })
          }
          className="inline-flex min-h-14 min-w-0 flex-1 touch-manipulation flex-col items-center justify-center rounded-[10px] bg-[#38bdf8] px-2 py-1 font-mono text-[#02111f] transition-[background-color,transform] hover:bg-[#a5f3fc] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none min-[360px]:px-3 sm:hidden"
          aria-label={mobilePrimaryAction.ariaLabel}
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em]">
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
            {mobilePrimaryAction.label}
          </span>
          <span
            data-mobile-journey-hint="true"
            className={`mt-0.5 max-w-full truncate text-[7px] uppercase tracking-[0.05em] opacity-70 min-[390px]:text-[8px] ${isMobileDockCompact ? "hidden" : ""}`}
          >
            {mobileJourneyHint}
          </span>
        </a>
        <a
          data-mobile-dock-secondary="true"
          data-mobile-dock-secondary-route={mobileExperienceRoute}
          href={mobileSecondaryShortcut.href}
          onClick={event => {
            if (mobileExperienceRoute !== "explorer") return;
            event.preventDefault();
            openPgArcade();
          }}
          aria-label={`Abrir ${mobileSecondaryShortcut.label}`}
          title={mobileSecondaryShortcut.label}
          className="mobile-context-action inline-flex min-h-14 min-w-0 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-[10px] border border-white/10 bg-[#071326] px-1 text-center text-[#d9fbff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:hidden"
        >
          <MobileSecondaryIcon
            className="h-4 w-4 text-[#67e8f9]"
            aria-hidden="true"
          />
          <span className="max-w-full truncate font-mono text-[7px] font-semibold uppercase tracking-[0.03em] min-[390px]:text-[8px]">
            {mobileSecondaryShortcut.label === "PG Arcade"
              ? "arcade"
              : mobileSecondaryShortcut.label}
          </span>
        </a>
        <a
          data-mobile-whatsapp-action="true"
          href={whatsAppUrl}
          onClick={() =>
            trackPortfolioEvent("whatsapp_click", { source: "floating" })
          }
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
    </>
  );
}
