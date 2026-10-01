import {
  ArrowUpRight,
  Download,
  Menu,
  Moon,
  Settings2,
  Sun,
  X,
} from "lucide-react";
import {
  lazy,
  Suspense,
  useEffect,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  getSafeStorage,
  readStorage,
  removeStorage,
  writeStorage,
} from "@/lib/safeStorage";
import { copyTextWithFeedback } from "@/features/portfolio/utils/clipboardFeedback";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { useNearViewport } from "@/features/portfolio/hooks/useNearViewport";
import { usePortfolioShellState } from "@/features/portfolio/hooks/usePortfolioShellState";
import { usePortfolioInstallPrompt } from "@/features/portfolio/hooks/usePortfolioInstallPrompt";
import { useAppearancePanelController } from "@/features/portfolio/hooks/useAppearancePanelController";
import { useResumePreviewController } from "@/features/portfolio/hooks/useResumePreviewController";
import { useMobileMenuController } from "@/features/portfolio/hooks/useMobileMenuController";
import { MobileJourney, useMobileJourney } from "./MobileJourney";
import type { ArcadeController } from "./ArcadeSection";
import {
  portfolioMarkUrl as markUrl,
  portfolioMobileSectionLabels as mobileSectionLabels,
  portfolioNavigationItems as navigationItems,
  portfolioPortraitUrl as portraitUrl,
  portfolioResumeUrl as resumeUrl,
  portfolioTelegramUrl as telegramUrl,
  portfolioWhatsAppUrl as whatsAppUrl,
} from "@/features/portfolio/portfolioConfig";
const PortfolioAppearancePanel = lazy(
  () => import("@/features/portfolio/components/PortfolioAppearancePanel")
);
const PortfolioMobileMenu = lazy(
  () => import("@/features/portfolio/components/PortfolioMobileMenu")
);
const PortfolioFooter = lazy(
  () => import("@/features/portfolio/components/PortfolioFooter")
);
const loadPortfolioResumePreview = () =>
  import("@/features/portfolio/components/PortfolioResumePreview").then(
    module => ({
      default: module.PortfolioResumePreview,
    })
  );
const PortfolioResumePreview = lazy(loadPortfolioResumePreview);

declare const __PORTFOLIO_RESUME_AVAILABLE__: boolean;
const resumeAvailable = __PORTFOLIO_RESUME_AVAILABLE__;
type ShellContent = {
  heroCtaRef: RefObject<HTMLDivElement | null>;
  isDesktopViewport: boolean;
  resumeAvailable: boolean;
};
type PortfolioShellProps = {
  avoidSpeculativePreload: boolean;
  projectOverlayOpen: boolean;
  contactFocused: boolean;
  arcade: ArcadeController;
  children: (content: ShellContent) => ReactNode;
};
export function PortfolioShell({
  avoidSpeculativePreload,
  projectOverlayOpen,
  contactFocused,
  arcade,
  children,
}: PortfolioShellProps) {
  const { pgLabOpen, openPgArcade } = arcade;
  const { theme, preference, setPreference, toggleTheme } = useTheme();
  const {
    activeSection,
    heroCtaRef,
    isDesktopViewport,
    isHeroCtaVisible,
    isMobileDockCompact,
    scrollProgress,
    showBackToTop,
  } = usePortfolioShellState();
  const [fontScale, setFontScale] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const storedValue = readStorage(
      getSafeStorage("local"),
      "pablo-portfolio-font-scale"
    );
    if (storedValue === null) return 1;
    const stored = Number(storedValue);
    return Number.isFinite(stored) ? Math.min(1.16, Math.max(0.92, stored)) : 1;
  });
  const {
    open: menuOpen,
    setOpen: setMenuOpen,
    buttonRef: menuButtonRef,
    close: closeMenu,
    toggle: toggleMenu,
  } = useMobileMenuController({ isDesktopViewport });
  const {
    open: appearanceOpen,
    closeRef: appearanceCloseRef,
    openPanel: openAppearancePanel,
    closePanel: closeAppearancePanel,
  } = useAppearancePanelController({ fallbackTriggerRef: menuButtonRef });
  const { canInstallPortfolio, installPortfolio } = usePortfolioInstallPrompt();
  const {
    open: resumePreviewOpen,
    loading: resumePreviewLoading,
    progress: resumePreviewProgress,
    error: resumePreviewError,
    closeRef: resumePreviewCloseRef,
    preload: preloadResumePreview,
    openPreview: openResumePreview,
    close: closeResumePreview,
    retry: retryResumePreview,
    handleLoad: handleResumePreviewLoad,
    handleError: handleResumePreviewError,
  } = useResumePreviewController({
    avoidSpeculativePreload,
    loadPreview: loadPortfolioResumePreview,
    menuButtonRef,
    setMenuOpen,
  });
  const mobile = useMobileJourney();
  const {
    mobilePrimaryAction,
    mobileSecondaryShortcut,
    mobileExperienceRoute,
  } = mobile;
  const [emailCopyStatus, setEmailCopyStatus] = useState<
    "idle" | "copied" | "error"
  >("idle");
  const [portfolioShareStatus, setPortfolioShareStatus] = useState<
    "idle" | "shared" | "copied" | "error"
  >("idle");
  const [footerSectionRef, shouldLoadFooter] = useNearViewport<HTMLDivElement>(
    avoidSpeculativePreload ? "40px" : "260px"
  );
  const shouldRenderFooter =
    shouldLoadFooter ||
    (typeof window !== "undefined" &&
      window.location.hash === "#contato-rodape");
  const shouldHideContactFloat =
    projectOverlayOpen ||
    resumePreviewOpen ||
    contactFocused ||
    pgLabOpen ||
    menuOpen ||
    appearanceOpen;
  useEffect(() => {
    const storage = getSafeStorage("local");
    [
      "pablo-portfolio-recent-searches",
      "pablo-portfolio-gallery-view",
      "pablo-portfolio-manual-order",
      "pablo-portfolio-order-profiles",
      "pablo-portfolio-active-order-profile",
    ].forEach(key => removeStorage(storage, key));
  }, []);

  useEffect(() => {
    writeStorage(
      getSafeStorage("local"),
      "pablo-portfolio-font-scale",
      String(fontScale)
    );
  }, [fontScale]);

  async function installPortfolioPwa() {
    if (!canInstallPortfolio) return;
    try {
      await installPortfolio();
    } finally {
      setMenuOpen(false);
    }
  }

  async function copyContactEmail() {
    await copyTextWithFeedback("mpjcreator@gmail.com", setEmailCopyStatus);
  }

  async function sharePortfolio() {
    const canonicalUrl =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ||
      new URL(
        import.meta.env.BASE_URL || "/",
        window.location.origin
      ).toString();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Pablo Guilherme — Portfólio profissional",
          text: "Projetos, produtos digitais, experiência técnica e formas de contato.",
          url: canonicalUrl,
        });
        trackPortfolioEvent("share_portfolio", {
          source: "mobile_menu",
          channel: "native",
        });
        setPortfolioShareStatus("shared");
        window.setTimeout(() => setPortfolioShareStatus("idle"), 2600);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
      }
    }

    try {
      await navigator.clipboard.writeText(canonicalUrl);
      trackPortfolioEvent("share_portfolio", {
        source: "mobile_menu",
        channel: "copy_link",
      });
      setPortfolioShareStatus("copied");
    } catch {
      setPortfolioShareStatus("error");
    }
    window.setTimeout(() => setPortfolioShareStatus("idle"), 2600);
  }

  return (
    <div
      data-portfolio-shell-version="2"
      data-theme={theme}
      data-reduced-data={avoidSpeculativePreload ? "true" : "false"}
      className="arquivo-page min-h-screen overflow-x-hidden bg-[#07111f] text-[#f2fbff] selection:bg-[#67e8f9] selection:text-[#061226]"
    >
      <a href="#conteudo-principal" className="skip-link">
        pular para o conteúdo
      </a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-cyan-200/[0.14] bg-[#07111f]/94 backdrop-blur-md md:bg-[#07111f]/90 md:backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
          <a
            href="#inicio"
            aria-label="Ir ao início"
            className="group flex min-w-0 items-center gap-2.5 sm:gap-3"
            onClick={closeMenu}
          >
            <span className="grid h-10 w-10 place-items-center border border-[#67e8f9]/60 bg-[#062044] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.32)]">
              <img
                src={markUrl}
                alt="Símbolo PG"
                width="28"
                height="28"
                decoding="async"
                className="h-7 w-7 object-contain"
              />
            </span>
            <span className="truncate font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-[#b7cdf1] min-[360px]:text-[10px] min-[360px]:tracking-[0.2em]">
              Pablo <span className="text-[#67e8f9]">/</span>{" "}
              <span className="max-[359px]:hidden">Guilherme</span>
            </span>
          </a>

          <nav
            className="hidden items-center gap-7 md:flex"
            aria-label="Navegação principal"
          >
            {navigationItems.map(([label, href, id]) => (
              <a
                key={label}
                href={href}
                aria-current={activeSection === id ? "location" : undefined}
                className={`nav-link text-[11px] font-mono uppercase tracking-[0.14em] transition-colors hover:text-white ${activeSection === id ? "text-[#67e8f9]" : "text-[#90a3c3]"}`}
              >
                {label}
              </a>
            ))}
            <a
              href={"https:" + "//pabloguilherme01.github.io/observatorio/"}
              target="_blank"
              rel="noreferrer"
              className="nav-link text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-[#a5f3fc] transition-colors hover:text-white"
            >
              observatório <ArrowUpRight className="ml-1 inline h-3 w-3" />
            </a>
            <button
              type="button"
              data-theme-toggle="true"
              onClick={() => toggleTheme?.()}
              aria-label={
                theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
              }
              aria-pressed={theme === "dark"}
              title={
                theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
              }
              className="grid h-9 w-9 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              data-appearance-trigger="desktop"
              onClick={event => openAppearancePanel(event.currentTarget)}
              aria-label="Configurações de aparência"
              title="Configurações de aparência"
              className="grid h-9 w-9 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
            >
              <Settings2 className="h-4 w-4" aria-hidden="true" />
            </button>
            {resumeAvailable && (
              <a
                href={resumeUrl}
                onPointerEnter={preloadResumePreview}
                onFocus={preloadResumePreview}
                onTouchStart={preloadResumePreview}
                onClick={openResumePreview}
                data-resume-header="true"
                data-resume-preview-preload="intent"
                aria-haspopup="dialog"
                aria-label="Visualizar portfólio atualizado em PDF"
                title="Visualizar portfólio em PDF"
                className="resume-header-cta inline-flex items-center gap-2 border border-[#67e8f9] bg-[#0b2746] px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-[#d9fbff] transition-all hover:bg-[#123b67] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />{" "}
                <span>portfólio PDF</span>
              </a>
            )}
            <a
              href="#contato"
              className="inline-flex items-center gap-2 border border-[#67e8f9] bg-[#38bdf8] px-4 py-2 text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-all hover:bg-[#a5f3fc] hover:shadow-[0_0_28px_rgba(56,189,248,0.36)]"
            >
              contato <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 md:hidden">
            <button
              ref={menuButtonRef}
              type="button"
              data-mobile-menu-toggle="true"
              data-mobile-scroll-context="true"
              onClick={toggleMenu}
              className="group flex h-12 min-w-[108px] max-w-[136px] items-center gap-2 rounded-[14px] border border-[#67e8f9]/20 bg-[#071827]/92 px-1.5 text-[#d8e6fa] shadow-[0_10px_26px_rgba(2,17,31,0.24)] transition-[border-color,background-color,box-shadow] hover:border-[#67e8f9]/55 hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] min-[360px]:min-w-[124px] min-[390px]:min-w-[136px]"
              aria-label={
                menuOpen
                  ? "Fechar menu"
                  : `Abrir menu · seção ${mobileSectionLabels[activeSection] ?? "portfólio"} · ${Math.round(scrollProgress)}% percorrido`
              }
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <span
                data-mobile-progress-ring="true"
                data-progress={Math.round(scrollProgress)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full p-[2px] transition-[background] motion-reduce:transition-none"
                style={{
                  background: `conic-gradient(#67e8f9 ${Math.round(scrollProgress)}%, rgba(103,232,249,0.12) 0)`,
                }}
                aria-hidden="true"
              >
                <span className="grid h-full w-full place-items-center rounded-full bg-[#07111f] shadow-inner">
                  {menuOpen ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Menu className="h-4 w-4" />
                  )}
                </span>
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span
                  data-mobile-current-section="true"
                  className="block truncate font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#d9fbff]"
                >
                  {mobileSectionLabels[activeSection] ?? "portfólio"}
                </span>
                <span
                  data-mobile-progress-value="true"
                  className="mt-0.5 block truncate font-mono text-[7px] uppercase tracking-[0.07em] text-[#7fa5bf]"
                >
                  {Math.round(scrollProgress)}% percorrido
                </span>
              </span>
            </button>
            <button
              type="button"
              data-theme-toggle="true"
              onClick={() => toggleTheme?.()}
              aria-label={
                theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
              }
              aria-pressed={theme === "dark"}
              title={
                theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"
              }
              className="grid h-11 w-11 place-items-center rounded-[12px] border border-white/10 bg-[#071326]/75 text-[#d8e6fa] transition-colors hover:border-[#67e8f9] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Moon className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <Suspense
            fallback={
              <div
                role="status"
                aria-live="polite"
                className="border-t border-white/[0.07] bg-[#090d16]/98 px-4 py-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc] md:hidden"
              >
                carregando navegação…
              </div>
            }
          >
            <PortfolioMobileMenu
              portraitUrl={portraitUrl}
              activeSection={activeSection}
              mobilePrimaryAction={mobilePrimaryAction}
              mobileSecondaryShortcut={mobileSecondaryShortcut}
              mobileExperienceRoute={mobileExperienceRoute}
              portfolioShareStatus={portfolioShareStatus}
              showInstallAction={canInstallPortfolio}
              resumeAvailable={resumeAvailable}
              onClose={closeMenu}
              onOpenArcade={openPgArcade}
              onOpenAppearance={openAppearancePanel}
              onSharePortfolio={() => void sharePortfolio()}
              onInstallPortfolio={() => void installPortfolioPwa()}
              onPreloadResume={preloadResumePreview}
              onOpenResume={openResumePreview}
            />
          </Suspense>
        )}
        {appearanceOpen && (
          <Suspense
            fallback={
              <div
                role="status"
                className="fixed right-4 top-[88px] z-[60] w-[min(92vw,340px)] border border-[#67e8f9]/30 bg-[#071326] p-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc] sm:right-8 lg:right-12"
              >
                carregando aparência…
              </div>
            }
          >
            <PortfolioAppearancePanel
              theme={theme}
              preference={preference}
              setPreference={setPreference}
              fontScale={fontScale}
              setFontScale={setFontScale}
              closeRef={appearanceCloseRef}
              onClose={closeAppearancePanel}
            />
          </Suspense>
        )}
      </header>
      <div
        className="scroll-progress-track pointer-events-none fixed inset-x-0 top-[75px] z-40 h-0.5 bg-[#67e8f9]/10"
        aria-hidden="true"
      >
        <span
          className="scroll-progress-bar block h-full origin-left bg-[#67e8f9] shadow-[0_0_12px_rgba(103,232,249,0.8)]"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />
      </div>

      <main
        id="conteudo-principal"
        className="relative"
        style={{ fontSize: `${fontScale}rem` }}
        tabIndex={-1}
      >
        <div
          className="archive-spine pointer-events-none absolute bottom-0 top-0 z-20"
          aria-hidden="true"
        />
        {children({ heroCtaRef, isDesktopViewport, resumeAvailable })}
      </main>
      <div
        ref={footerSectionRef}
        data-footer-anchor="true"
        aria-busy={!shouldRenderFooter}
        className="min-h-px"
      >
        {shouldRenderFooter ? (
          <Suspense
            fallback={
              <div
                data-footer-placeholder="true"
                role="status"
                aria-live="polite"
                className="min-h-[260px] border-t border-white/[0.07] bg-[#06080d] px-5 py-10 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fa8c8] sm:px-8 lg:px-12"
              >
                carregando contato final…
              </div>
            }
          >
            <PortfolioFooter
              markUrl={markUrl}
              telegramUrl={telegramUrl}
              whatsAppUrl={whatsAppUrl}
              onWhatsAppClick={() =>
                trackPortfolioEvent("whatsapp_click", { source: "footer" })
              }
              emailCopyStatus={emailCopyStatus}
              copyContactEmail={copyContactEmail}
            />
          </Suspense>
        ) : (
          <div
            data-footer-placeholder="true"
            className="min-h-[260px] border-t border-white/[0.07] bg-[#06080d] px-5 py-10 sm:px-8 lg:px-12"
            aria-label="Contato final"
          >
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fa8c8]">
              contato final será carregado ao aproximar
            </p>
          </div>
        )}
      </div>

      <MobileJourney
        {...mobile}
        shouldHideContactFloat={shouldHideContactFloat}
        isHeroCtaVisible={isHeroCtaVisible}
        isMobileDockCompact={isMobileDockCompact}
        scrollProgress={scrollProgress}
        showBackToTop={showBackToTop}
        pgLabOpen={pgLabOpen}
        openPgArcade={openPgArcade}
      />
      {resumePreviewOpen && (
        <Suspense
          fallback={
            <div
              data-resume-preview-loading-shell="true"
              role="status"
              aria-live="polite"
              className="fixed inset-0 z-[70] grid place-items-center bg-[#02050a]/90 p-6 font-mono text-[10px] uppercase tracking-[0.14em] text-[#c8f7ff]"
            >
              carregando leitor do portfólio…
            </div>
          }
        >
          <PortfolioResumePreview
            open={resumePreviewOpen}
            loading={resumePreviewLoading}
            error={resumePreviewError}
            progress={resumePreviewProgress}
            resumeUrl={resumeUrl}
            closeRef={resumePreviewCloseRef}
            onClose={closeResumePreview}
            onRetry={retryResumePreview}
            onLoad={handleResumePreviewLoad}
            onError={handleResumePreviewError}
          />
        </Suspense>
      )}
    </div>
  );
}
