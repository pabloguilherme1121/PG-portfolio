import { ArrowUpRight, Braces, ClipboardCheck, Download, Eye, FileText, Layers2, Settings2, Share2 } from "lucide-react";
import type { MobileExperienceRoute } from "@/features/portfolio/utils/mobileJourney";
import { useEffect, useRef, type MouseEvent } from "react";

type MobilePrimaryAction = {
  href: string;
  label: string;
  ariaLabel: string;
};

type MobileSecondaryShortcut = {
  href: string;
  label: string;
};

type PortfolioShareStatus = "idle" | "shared" | "copied" | "error";

type PortfolioMobileMenuProps = {
  portraitUrl: string;
  activeSection: string;
  mobilePrimaryAction: MobilePrimaryAction;
  mobileSecondaryShortcut: MobileSecondaryShortcut;
  mobileExperienceRoute: MobileExperienceRoute;
  portfolioShareStatus: PortfolioShareStatus;
  showInstallAction: boolean;
  resumeAvailable: boolean;
  onClose: () => void;
  onOpenArcade: () => void;
  onOpenAppearance: (trigger?: HTMLElement | null) => void;
  onSharePortfolio: () => void;
  onInstallPortfolio: () => void;
  onPreloadResume: () => void;
  onOpenResume: (event: MouseEvent<HTMLButtonElement>) => void;
};

const sectionLinks = [
  ["01 / início", "#inicio", "inicio"],
  ["02 / projetos", "#projetos", "projetos"],
  ["03 / serviços", "#servicos", "servicos"],
  ["04 / contato", "#contato", "contato"],
] as const;

export default function PortfolioMobileMenu({
  portraitUrl,
  activeSection,
  mobilePrimaryAction,
  mobileSecondaryShortcut,
  mobileExperienceRoute,
  portfolioShareStatus,
  showInstallAction,
  resumeAvailable,
  onClose,
  onOpenArcade,
  onOpenAppearance,
  onSharePortfolio,
  onInstallPortfolio,
  onPreloadResume,
  onOpenResume,
}: PortfolioMobileMenuProps) {
  const navigationRef = useRef<HTMLDivElement>(null);
  const SecondaryIcon =
    mobileExperienceRoute === "recruiter" ? FileText : mobileExperienceRoute === "explorer" ? Braces : Layers2;

  useEffect(() => {
    const navigation = navigationRef.current;
    if (!navigation) return;

    const getFocusableElements = () =>
      Array.from(
        navigation.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((element) => element.offsetParent !== null);

    const frameId = window.requestAnimationFrame(() => {
      const focusTarget =
        navigation.querySelector<HTMLElement>('[aria-current="location"]') ??
        getFocusableElements()[0];
      focusTarget?.focus({ preventScroll: true });
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (!focusableElements.length) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && (activeElement === first || !navigation.contains(activeElement))) {
        event.preventDefault();
        last.focus({ preventScroll: true });
        return;
      }

      if (!event.shiftKey && (activeElement === last || !navigation.contains(activeElement))) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    navigation.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frameId);
      navigation.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={navigationRef}
      id="mobile-navigation"
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação móvel"
      className="max-h-[calc(100svh-76px)] overflow-y-auto overscroll-contain border-t border-white/[0.07] bg-[#090d16]/98 px-4 py-4 shadow-[0_20px_48px_rgba(0,0,0,0.42)] backdrop-blur-md md:hidden"
    >
      <nav aria-label="Links principais">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-1 sm:px-3">
        <div data-mobile-menu-profile="true" className="mb-3 flex items-center gap-3 rounded-[16px] border border-[#67e8f9]/15 bg-[linear-gradient(135deg,rgba(10,39,70,0.92),rgba(7,19,38,0.92))] p-3 shadow-[0_12px_34px_rgba(0,0,0,0.22)]">
          <img src={portraitUrl} alt="" width="64" height="64" loading="lazy" decoding="async" className="h-14 w-14 shrink-0 rounded-full border border-[#67e8f9]/35 object-cover object-top" />
          <div className="min-w-0">
            <p className="truncate font-display text-lg tracking-[-0.035em] text-white">Pablo Guilherme</p>
            <p className="mt-0.5 font-body text-xs text-[#a9bfd8]">Desenvolvimento de produtos digitais</p>
            <p className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.08em] text-amber-100">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" aria-hidden="true" />
              agenda sob consulta
            </p>
          </div>
        </div>

        {sectionLinks.map(([label, href, id]) => (
          <a
            key={label}
            href={href}
            onClick={onClose}
            aria-current={activeSection === id ? "location" : undefined}
            className={`flex min-h-12 items-center border-b border-white/[0.07] px-2 py-3 font-mono text-xs uppercase tracking-[0.12em] transition-colors hover:bg-[#0b2746] hover:text-white focus-visible:bg-[#0b2746] focus-visible:text-white ${activeSection === id ? "bg-[#0b2746] text-[#67e8f9]" : "text-[#b7cdf1]"}`}
          >
            {label}
          </a>
        ))}

        <a
          data-mobile-menu-primary="true"
          href={mobilePrimaryAction.href}
          onClick={onClose}
          className="mt-3 flex min-h-12 items-center justify-between rounded-[10px] bg-[#38bdf8] px-3 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#02111f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
        >
          <span className="inline-flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
            {mobilePrimaryAction.ariaLabel}
          </span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>

        <div data-mobile-shortcuts="true" className="mt-2 grid grid-cols-2 gap-2" aria-label="Atalhos rápidos">
          <a
            data-mobile-shortcut-contextual="true"
            href={mobileSecondaryShortcut.href}
            onClick={() => {
              if (mobileExperienceRoute === "explorer") onOpenArcade();
              onClose();
            }}
            className="mobile-shortcut-card flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-[#071326] px-2 py-2 text-center font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#d7e9f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
          >
            <SecondaryIcon className="h-4 w-4 text-[#67e8f9]" aria-hidden="true" />
            <span>{mobileSecondaryShortcut.label}</span>
          </a>
          <a
            href="https://pabloguilherme01.github.io/observatorio/"
            target="_blank"
            rel="noreferrer"
            onClick={onClose}
            className="mobile-shortcut-card flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-[10px] border border-[#67e8f9]/30 bg-[#0b2746] px-2 py-2 text-center font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#d9fbff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
          >
            <Eye className="h-4 w-4 text-[#67e8f9]" aria-hidden="true" />
            <span>observatório</span>
          </a>
        </div>

        <div className="mt-3 border-t border-white/[0.08] pt-3">
          <p className="px-1 font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-[#7fa5bf]">ferramentas</p>
          <div data-mobile-utility-grid="true" className="mt-2 grid grid-cols-2 gap-2" aria-label="Ferramentas do portfólio">
            <button
              type="button"
              data-mobile-appearance-action="true"
              onClick={(event) => {
                onOpenAppearance(event.currentTarget);
                onClose();
              }}
              className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-[#071326] px-2 py-2.5 text-center font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#d9fbff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
            >
              <Settings2 className="h-4 w-4 shrink-0 text-[#67e8f9]" aria-hidden="true" />
              <span>aparência</span>
            </button>

            <button
              type="button"
              data-mobile-share-action="true"
              onClick={onSharePortfolio}
              className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-[#071326] px-2 py-2.5 text-center font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#d9fbff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
            >
              <Share2 className="h-4 w-4 shrink-0 text-[#67e8f9]" aria-hidden="true" />
              <span>{portfolioShareStatus === "shared" ? "compartilhado" : portfolioShareStatus === "copied" ? "link copiado" : portfolioShareStatus === "error" ? "tentar de novo" : "compartilhar"}</span>
            </button>

            {showInstallAction && (
              <button
                type="button"
                data-mobile-install-action="true"
                onClick={onInstallPortfolio}
                className="inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-[#071326] px-2 py-2.5 text-center font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#d9fbff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
              >
                <Download className="h-4 w-4 shrink-0 text-[#67e8f9]" aria-hidden="true" />
                <span>instalar</span>
              </button>
            )}

            {resumeAvailable && (
              <button
                type="button"
                onPointerEnter={onPreloadResume}
                onFocus={onPreloadResume}
                onTouchStart={onPreloadResume}
                onClick={onOpenResume}
                data-resume-header="true"
                data-resume-preview-preload="intent"
                aria-haspopup="dialog"
                aria-label="Visualizar portfólio atualizado em PDF"
                className={`inline-flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-[10px] border border-[#67e8f9]/30 bg-[#0b2746] px-2 py-2.5 text-center font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#d9fbff] transition-colors hover:border-[#67e8f9] hover:bg-[#123b67] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${showInstallAction ? "" : "col-span-2"}`}
              >
                <FileText className="h-4 w-4 shrink-0 text-[#67e8f9]" aria-hidden="true" />
                <span>portfólio PDF</span>
              </button>
            )}
          </div>
        </div>
        </div>
      </nav>
    </div>
  );
}
