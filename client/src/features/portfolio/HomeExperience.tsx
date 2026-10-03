Warning: truncated output (original token count: 14356)
Total output lines: 975

/**
 * Design: Arquivo Luminoso — editorial técnico em azul celeste vibrante e azul profundo.
 * A página transforma a trajetória de Pablo em capítulos assimétricos, com
 * metadados, linha de progresso e linguagem visual de arquivo em evolução.
 */
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  ClipboardCheck,
  Braces,
  FileText,
  Instagram,
  Layers2,
  Menu,
  MessageCircle,
  Send,
  Moon,
  Sun,
  Settings2,
  X,
} from "lucide-react";
import { FormEvent, lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { getSafeStorage, readStorage, removeStorage, writeStorage } from "@/lib/safeStorage";
import { toast } from "sonner";
import PortfolioHero from "@/features/portfolio/components/PortfolioHero";
import PortfolioTrustBar from "@/features/portfolio/components/PortfolioTrustBar";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { buildBriefingWhatsAppUrl } from "@/features/portfolio/utils/briefingWhatsApp";
import { copyTextWithFeedback } from "@/features/portfolio/utils/clipboardFeedback";
import { getMobileDockModel, isMobileExperienceRoute, readStoredBriefingProgress, readStoredExperienceRoute, type MobileExperienceRoute } from "@/features/portfolio/utils/mobileJourney";
import { getNavigatorConnection, shouldAvoidSpeculativePreload } from "@/features/portfolio/utils/networkHints";
import { useNearViewport } from "@/features/portfolio/hooks/useNearViewport";
import { useMobileKeyboardState } from "@/features/portfolio/hooks/useMobileKeyboardState";
import { usePortfolioShellState } from "@/features/portfolio/hooks/usePortfolioShellState";
import { usePortfolioInstallPrompt } from "@/features/portfolio/hooks/usePortfolioInstallPrompt";
import { usePortfolioDeferredHashRequests } from "@/features/portfolio/hooks/usePortfolioDeferredHashRequests";
import { useProjectDetailsController } from "@/features/portfolio/hooks/useProjectDetailsController";
import { useAppearancePanelController } from "@/features/portfolio/hooks/useAppearancePanelController";
import { useMobileMenuController } from "@/features/portfolio/hooks/useMobileMenuController";
import { useFavoriteProjects } from "@/features/portfolio/hooks/useFavoriteProjects";
import {
  portfolioMarkUrl as markUrl,
  portfolioMobileSectionLabels as mobileSectionLabels,
  portfolioNavigationItems as navigationItems,
  portfolioPortraitResponsive as portraitResponsive,
  portfolioPortraitUrl as portraitUrl,
  portfolioTelegramUrl as telegramUrl,
  portfolioWhatsAppNumber as whatsAppNumber,
  portfolioWhatsAppUrl as whatsAppUrl,
} from "@/features/portfolio/portfolioConfig";
import { repositories } from "@/features/portfolio/portfolioData";
const InstagramRepertoire = lazy(() => import("@/features/social/InstagramRepertoire"));
const PortfolioExperienceHub = lazy(() => import("@/features/portfolio/components/PortfolioExperienceHub"));
const ProjectDiagnostic = lazy(() => import("@/features/portfolio/components/ProjectDiagnostic"));
const PortfolioDeferredProfileSections = lazy(() => import("@/features/portfolio/components/PortfolioDeferredProfileSections"));
const PortfolioDeferredStaticSections = lazy(() => import("@/features/portfolio/components/PortfolioDeferredStaticSections"));
const PortfolioProjectsOverview = lazy(() => import("@/features/portfolio/components/PortfolioProjectsOverview"));
const PortfolioAppearancePanel = lazy(() => import("@/features/portfolio/components/PortfolioAppearancePanel"));
const PortfolioProjectDetailsDialog = lazy(() => import("@/features/portfolio/components/PortfolioProjectDetailsDialog"));
const PortfolioMobileMenu = lazy(() => import("@/features/portfolio/components/PortfolioMobileMenu"));
const PortfolioFooter = lazy(() => import("@/features/portfolio/components/PortfolioFooter"));
const PortfolioCaseStudies = lazy(() => import("@/features/portfolio/components/PortfolioCaseStudies"));
const PortfolioContact = lazy(() =>
  import("@/features/portfolio/components/PortfolioContact").then((module) => ({
    default: module.PortfolioContact,
  })),
);
const PortfolioWebResume = lazy(() => import("@/features/portfolio/components/PortfolioWebResume"));
type PortfolioArcadeModule = typeof import("@/features/portfolio/components/PortfolioArcade");
let portfolioArcadePromise: Promise<PortfolioArcadeModule> | null = null;

const loadPortfolioArcade = () => {
  if (!portfolioArcadePromise) {
    portfolioArcadePromise = import("@/features/portfolio/components/PortfolioArcade").catch((error) => {
      portfolioArcadePromise = null;
      throw error;
    });
  }
  return portfolioArcadePromise;
};
const PortfolioArcade = lazy(loadPortfolioArcade);

const isStaticDeploy = import.meta.env.VITE_STATIC_DEPLOY === "true";

type BriefingSeed = Partial<Record<"service" | "projectType" | "objective" | "audience" | "stage" | "delivery" | "success" | "briefing", string>>;

export default function Home() {
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
  const [avoidSpeculativePreload, setAvoidSpeculativePreload] = useState(() =>
    typeof navigator === "undefined" ? false : shouldAvoidSpeculativePreload(getNavigatorConnection(navigator)),
  );
  const deferredRootMargin = avoidSpeculativePreload ? "160px" : "720px";
  const [socialSectionRef, shouldLoadSocial] = useNearViewport<HTMLDivElement>(deferredRootMargin);
  const [availabilitySectionRef, shouldLoadAvailability] = useNearViewport<HTMLDivElement>(deferredRootMargin);
  const [webResumeSectionRef, shouldLoadWebResume] = useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "160px" : "480px");
  const [experienceHubRef, shouldLoadExperienceHub] = useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "40px" : "120px");
  const [diagnosticSectionRef, shouldLoadDiagnostic] = useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "40px" : "180px");
  const [profileSectionsRef, shouldLoadProfileSections] = useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "80px" : "280px");
  const [staticSectionsRef, shouldLoadStaticSections] = useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "80px" : "320px");
  const [projectsSectionRef, shouldLoadProjects] = useNearViewport<HTMLElement>(avoidSpeculativePreload ? "80px" : "240px");
  const [caseStudiesSectionRef, shouldLoadCaseStudies] = useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "80px" : "420px");
  const [contactSectionRef, shouldLoadContact] = useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "80px" : "360px");
  const [footerSectionRef, shouldLoadFooter] = useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "40px" : "260px");
  const [fontScale, setFontScale] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const storedValue = readStorage(getSafeStorage("local"), "pablo-portfolio-font-scale");
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
  const [pgLabOpen, setPgLabOpen] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [briefingWhatsAppUrl, setBriefingWhatsAppUrl] = useState<string | null>(null);
  const [backgroundContactReady, setBackgroundContactReady] = useState(false);
  const [pendingBriefingSeed, setPendingBriefingSeed] = useState<BriefingSeed | null>(null);
  const {
    contact: contactHashRequested,
    caseStudies: caseStudiesHashRequested,
    staticSections: staticSectionsHashRequested,
    profileSections: profileSectionsHashRequested,
  } = usePortfolioDeferredHashRequests();
  const [formError, setFormError] = useState<string | null>(null);
  const [emailCopyStatus, setEmailCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [featuredCardsReady, setFeaturedCardsReady] = useState(false);
  const {
    favoriteProjectIdSet,
    toggleFavoriteProject,
  } = useFavoriteProjects();
  const [contextTransitionTarget, setContextTransitionTarget] = useState<"saved" | "agenda" | null>(null);
  const [contextNavigationStatus, setContextNavigationStatus] = useState("");
  const [portfolioShareStatus, setPortfolioShareStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");
  const [isBriefingFieldFocused, setIsBriefingFieldFocused] = useState(false);
  const isMobileKeyboardOpen = useMobileKeyboardState();
  const [mobileExperienceRoute, setMobileExperienceRoute] = useState<MobileExperienceRoute>(() =>
    readStoredExperienceRoute(getSafeStorage("session")),
  );
  const [hasMobileBriefingDraft, setHasMobileBriefingDraft] = useState(() =>
    readStoredBriefingProgress(getSafeStorage("local")),
  );
  const {
    selectedProject,
    projectDetailsLoading,
    projectDetailsTransition,
    showProjectSwipeHint,
    projectShareStatus,
    projectCopyStatus,
    previousSelectedProject,
    nextSelectedProject,
    selectedProjectIndex,
    projectCount,
    openProjectDetails,
    closeProjectDetails,
    navigateSelectedProject,
    handleProjectDetailsTouchStart,
    handleProjectDetailsTouchEnd,
    shareSelectedProject,
    copySelectedProjectLink,
  } = useProjectDetailsController({ repositories });
  const shouldHideContactFloat = Boolean(selectedProject || isBriefingFieldFocused || isMobileKeyboardOpen || pgLabOpen || menuOpen || appearanceOpen);
  const isDockHidden = shouldHideContactFloat || isHeroCtaVisible;
  const isBackToTopVisible = showBackToTop && !shouldHideContactFloat;
  const mobileDock = getMobileDockModel(mobileExperienceRoute, hasMobileBriefingDraft);
  const mobilePrimaryAction = mobileDock.primary;
  const mobileJourneyHint = mobileDock.hint;
  const mobileSecondaryShortcut = mobileDock.secondary;
  const MobileSecondaryIcon = mobileExperienceRoute === "recruiter" ? FileText : mobileExperienceRoute === "explorer" ? Braces : Layers2;
  const shouldRenderWebResume = shouldLoadWebResume || (typeof window !== "undefined" && window.location.hash === "#curriculo-web");
  const shouldRenderDiagnostic = shouldLoadDiagnostic || (typeof window !== "undefined" && window.location.hash === "#diagnostico");
  const shouldRenderProfileSections = shouldLoadProfileSections || profileSectionsHashRequested;
  const shouldRenderFooter = shouldLoadFooter || shouldLoadContact || (typeof window !== "undefined" && window.location.hash === "#contato-rodape");
  const shouldRenderStaticSections = shouldLoadStaticSections || staticSectionsHashRequested;
  const shouldRenderProjects = shouldLoadProjects || (typeof window !== "undefined" && (window.location.hash === "#projetos" || window.location.hash === "#observatorio" || new URLSearchParams(window.location.search).has("projeto")));
  const shouldRenderCaseStudies = shouldLoadCaseStudies || caseStudiesHashRequested;
  const shouldRenderContact = shouldLoadContact || contactHashRequested || Boolean(pendingBriefingSeed) || backgroundContactReady;

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const connection = getNavigatorConnection(navigator);
    if (!connection?.addEventListener || !connection.removeEventListener) return;
    const syncNetworkPreference = () => setAvoidSpeculativePreload(shouldAvoidSpeculativePreload(connection));
    connection.addEventListener("change", syncNetworkPreference);
    return () => connection.removeEventListener?.("change", syncNetworkPreference);
  }, []);

  useEffect(() => {
    if (avoidSpeculativePreload || backgroundContactReady) return;

    let timer: number | null = null;
    const scheduleBackgroundContact = () => {
      if (timer !== null) return;
      timer = window.setTimeout(() => setBackgroundContactReady(true), 3600);
    };

    if (document.readyState === "complete") scheduleBackgroundContact();
    else window.addEventListener("load", scheduleBackgroundContact, { once: true });

    return () => {
      window.removeEventListener("load", scheduleBackgroundContact);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [avoidSpeculativePreload, backgroundContactReady]);

  useEffect(() => {
    const handleExperienceRoute = (event: Event) => {
      const routeId = (event as CustomEvent<{ routeId?: unknown }>).detail?.routeId;
      if (isMobileExperienceRoute(routeId)) setMobileExperienceRoute(routeId);
    };
    const handleBriefingProgress = (event: Event) => {
      const hasDraft = (event as CustomEvent<{ hasDraft?: unknown }>).detail?.hasDraft;
      if (typeof hasDraft === "boolean") setHasMobileBriefingDraft(hasDraft);
    };
    const handleBriefingSeed = (event: Event) => {
      const detail = (event as CustomEvent<BriefingSeed>).detail;
      if (detail && typeof detail === "object") setPendingBriefingSeed({ ...detail });
    };

    window.addEventListener("portfolio:experience-route", handleExperienceRoute);
    window.addEventListener("portfolio:briefing-progress", handleBriefingProgress);
    window.addEventListener("portfolio:briefing-seed", handleBriefingSeed);
    return () => {
      window.removeEventListener("portfolio:experience-route", handleExperienceRoute);
      window.removeEventListener("portfolio:briefing-progress", handleBriefingProgress);
      window.removeEventListener("portfolio:briefing-seed", handleBriefingSeed);
    };
  }, []);

  useEffect(() => {
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 120 : 420;
    const timer = window.setTimeout(() => setFeaturedCardsReady(true), delay);
    return () => window.clearTimeout(timer);
  }, []);

  const successMessageRef = useRef<HTMLDivElement>(null);
  const contextTransitionTimerRef = useRef<number | null>(null);
  const {
    data: blockedDates = [],
    isError: isBlockedDatesError,
    refetch: refetchBlockedDates,
  } = trpc.availability.listBlocked.useQuery(undefined, { enabled: shouldLoadAvailability && !isStaticDeploy });

  const featuredRepositories = useMemo(() => repositories.filter((repository) => repository.featured || repository.relevance >= 80).sort((first, second) => second.relevance - first.relevance).slice(0, 4), []);


  useEffect(() => {
    const storage = getSafeStorage("local");
    [
      "pablo-portfolio-recent-searches",
      "pablo-portfolio-gallery-view",
      "pablo-portfolio-manual-order",
      "pablo-portfolio-order-profiles",
      "pablo-portfolio-active-order-profile",
    ].forEach((key) => removeStorage(storage, key));
  }, []);

  useEffect(() => {
    writeStorage(getSafeStorage("local"), "pablo-portfolio-font-scale", String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    if (formSent) successMessageRef.current?.focus();
  }, [formSent]);

  useEffect(() => () => {
    if (contextTransitionTimerRef.current) window.clearTimeout(contextTransitionTimerRef.current);
  }, []);

  const quoteRequestMutation = trpc.quoteRequest.create.useMutation({
    onSuccess: (result) => {
      trackPortfolioEvent("briefing_completed");
      setFormSent(true);
      toast.success("Briefing recebido", {
        description: result.ownerNotified
          ? "Seu pedido foi registrado. Em breve, Pablo retorna com os próximos passos."
          : "Seu pedido foi registrado. A confirmação interna será revisada assim que o serviço voltar.",
      });
    },
    onError: () => {
      const message = "Não foi possível enviar agora. Confira sua conexão e tente novamente.";
      setFormError(message);
      toast.error("Não foi possível enviar", { description: message });
    },
  });

  async function installPortfolioPwa() {
    if (!canInstallPortfolio) return;
    try {
      await installPortfolio();
    } finally {
      setMenuOpen(false);
    }
  }

  function preloadPgArcade() {
    if (avoidSpeculativePreload) return;
    void loadPortfolioArcade().catch(() => undefined);
  }

  function openPgArcade() {
    preloadPgArcade();
    setPgLabOpen(true);
    window.requestAnimationFrame(() => {
      const target = document.getElementById("pg-lab");
      if (!target) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
      target.scrollIntoView({
        behavior: reduceMotion || isMobileViewport ? "auto" : "smooth",
        block: "start",
      });
    });
  }

  function togglePgArcade() {
    if (pgLabOpen) {
      setPgLabOpen(false);
      return;
    }
    openPgArcade();
  }

  function scrollToTop() {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function copyContactEmail() {
    await copyTextWithFeedback("mpjcreator@gmail.com", setEmailCopyStatus);
  }

  function toggleFavorite(projectId: string, event: React.MouseEvent | React.KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    const isAlreadySaved = toggleFavoriteProject(projectId);
    const projectName = repositories.find((repository) => repository.id === projectId)?.name ?? "Projeto";
    if (isAlreadySaved) {
      toast("Projeto removido", { description: `${projectName} foi removido dos projetos salvos.` });
    } else {
      toast.success("Projeto salvo", { description: `${projectName} está disponível em projetos salvos.` });
    }
  }

  async function sharePortfolio() {
    const canonicalUrl =
      document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ||
      new URL(import.meta.env.BASE_URL || "/", window.location.origin).toString();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Pablo Guilherme — Portfólio profissional",
          text: "Projetos, produtos digitais, experiência técnica e formas de contato.",
          url: canonicalUrl,
        });
        trackPortfolioEvent("share_portfolio", { source: "mobile_menu", channel: "native" });
        setPortfolioShareStatus("shared");
        window.setTimeout(() => setPortfolioShareStatus("idle"), 2600);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(canonicalUrl);
      trackPortfolioEvent("share_portfolio", { source: "mobile_menu", channel: "copy_link" });
      setPortfolioShareStatus("copied");
    } catch {
      setPortfolioShareStatus("error");
    }
    window.setTimeout(() => setPortfolioShareStatus("idle"), 2600);
  }

  function navigateSavedAgendaContext(target: "saved" | "agenda") {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: re…4356 tokens truncated…67e8f9]/15 bg-[#040a13] px-4 py-10 min-[360px]:px-5 sm:px-8 sm:py-14 lg:px-12" aria-labelledby="pg-lab-title">
          <div className="relative mx-auto max-w-[1440px] overflow-hidden border border-[#67e8f9]/25 bg-[linear-gradient(135deg,rgba(6,23,47,.96),rgba(5,13,24,.92))] p-5 shadow-[0_24px_80px_rgba(0,0,0,.24)] sm:grid sm:grid-cols-[1fr_auto] sm:items-end sm:gap-10 sm:p-8">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">PG Arcade · laboratório interativo</p>
              <h2 id="pg-lab-title" className="mt-3 max-w-3xl font-display text-[clamp(2rem,4vw,4.25rem)] font-medium leading-[0.94] tracking-[-0.055em] text-white">Código que você pode jogar.</h2>
              <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#a9bfd8]">Cinco experiências jogáveis — Jogo da Velha, Dominó, Futebol, Damas e Xadrez — mostram lógica, estados, IA, responsividade e cuidado com interação sem tirar o foco dos projetos profissionais.</p>
            </div>
            <button
              type="button"
              data-arcade-open-control="true"
              data-arcade-preload="intent"
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") preloadPgArcade();
              }}
              onClick={togglePgArcade}
              aria-expanded={pgLabOpen}
              aria-controls="pg-lab-game"
              className="mt-6 inline-flex min-h-12 w-full shrink-0 items-center justify-center border border-[#67e8f9]/45 px-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff] transition-colors hover:border-[#a5f3fc] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:mt-0 sm:w-auto"
            >{pgLabOpen ? "fechar PG Arcade" : "explorar PG Arcade"}</button>
          </div>
          <div id="pg-lab-game" hidden={!pgLabOpen} className="-mx-4 max-w-[1440px] min-[360px]:-mx-5 sm:mx-auto">
            {pgLabOpen && (
              <Suspense fallback={<div data-arcade-loading="true" role="status" aria-live="polite" className="mx-4 my-5 min-h-24 rounded-[14px] border border-[#67e8f9]/20 bg-[#06172f]/70 p-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc] min-[360px]:mx-5 sm:mx-0">carregando PG Arcade…</div>}>
                <PortfolioArcade />
              </Suspense>
            )}
          </div>
        </section>

        <div ref={diagnosticSectionRef} data-project-diagnostic-anchor="true" className="min-h-px">
          {shouldRenderDiagnostic ? (
            <Suspense
              fallback={
                <section
                  id="diagnostico"
                  data-project-diagnostic-placeholder="true"
                  role="status"
                  aria-live="polite"
                  className="archive-chapter min-h-[760px] border-y border-white/[0.08] bg-[#061226] px-5 py-16 sm:min-h-[900px] sm:px-8 sm:py-20"
                >
                  <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc]">
                    carregando Project Lens…
                  </div>
                </section>
              }
            >
              <ProjectDiagnostic />
            </Suspense>
          ) : (
            <section
              id="diagnostico"
              data-project-diagnostic-placeholder="true"
              className="archive-chapter min-h-[760px] border-y border-white/[0.08] bg-[#061226] px-5 py-16 sm:min-h-[900px] sm:px-8 sm:py-20"
              aria-label="Project Lens"
            >
              <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">
                Project Lens será carregado ao aproximar
              </div>
            </section>
          )}
        </div>

        <div
          ref={profileSectionsRef}
          data-profile-sections-anchor="true"
          aria-busy={!shouldRenderProfileSections}
          className="min-h-px"
        >
          {shouldRenderProfileSections ? (
            <Suspense
              fallback={
                <section data-profile-sections-placeholder="true" className="archive-chapter min-h-[1150px] border-t border-white/[0.07] bg-[#0a0f18] px-5 py-16 sm:min-h-[1350px] sm:px-8 sm:py-20" aria-label="Carregando Sobre e perfil profissional">
                  <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc]">
                    carregando Sobre e perfil profissional…
                  </div>
                </section>
              }
            >
              <PortfolioDeferredProfileSections
                portraitUrl={portraitUrl}
                portraitResponsive={portraitResponsive}
              />
            </Suspense>
          ) : (
            <section data-profile-sections-placeholder="true" className="archive-chapter min-h-[1150px] border-t border-white/[0.07] bg-[#0a0f18] px-5 py-16 sm:min-h-[1350px] sm:px-8 sm:py-20" aria-label="Sobre e perfil profissional">
              <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">
                Sobre e perfil profissional serão carregados ao aproximar
              </div>
            </section>
          )}
        </div>

        <div
          id="curriculo-web"
          ref={webResumeSectionRef}
          data-web-resume-anchor="true"
          aria-busy={!shouldRenderWebResume}
          className="scroll-mt-24 min-h-px"
        >
          {shouldRenderWebResume ? (
            <Suspense
              fallback={
                <section data-web-resume-placeholder="true" className="archive-chapter border-t border-white/[0.07] bg-[#f5fbff] px-5 py-14 text-[#365166]" aria-label="Carregando currículo web">
                  <div className="mx-auto max-w-[1120px] font-mono text-[10px] uppercase tracking-[0.14em] text-[#0e7490]">carregando currículo web…</div>
                </section>
              }
            >
              <PortfolioWebResume embedded />
            </Suspense>
          ) : (
            <section data-web-resume-placeholder="true" className="archive-chapter border-t border-white/[0.07] bg-[#f5fbff] px-5 py-10 text-[#365166]" aria-label="Currículo web">
              <div className="mx-auto max-w-[1120px] font-mono text-[9px] uppercase tracking-[0.12em] text-[#0e7490]">currículo web disponível ao aproximar</div>
            </section>
          )}
        </div>

        <div
          ref={staticSectionsRef}
          data-static-sections-anchor="true"
          aria-busy={!shouldRenderStaticSections}
          className="min-h-px"
        >
          {shouldRenderStaticSections ? (
            <Suspense
              fallback={
                <section data-static-sections-placeholder="true" className="archive-chapter min-h-[1200px] border-t border-white/[0.07] bg-[#070a10] px-5 py-16 sm:min-h-[1500px] sm:px-8 sm:py-24" aria-label="Carregando competências, serviços e processo">
                  <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">
                    carregando competências, serviços e processo…
                  </div>
                </section>
              }
            >
              <PortfolioDeferredStaticSections markUrl={markUrl} />
            </Suspense>
          ) : (
            <section data-static-sections-placeholder="true" className="archive-chapter min-h-[1200px] border-t border-white/[0.07] bg-[#070a10] px-5 py-16 sm:min-h-[1500px] sm:px-8 sm:py-24" aria-label="Competências, serviços e processo">
              <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">
                competências, serviços e processo serão carregados ao aproximar
              </div>
            </section>
          )}
        </div>

        <div ref={socialSectionRef} aria-hidden="true" className="h-px w-full" />
        {shouldLoadSocial ? <Suspense fallback={<section id="social" className="archive-chapter border-t border-white/[0.07] bg-[#050c18] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28" aria-label="Carregando repertório social"><div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">carregando repertório social</div></section>}><InstagramRepertoire /></Suspense> : <section id="social" className="archive-chapter border-t border-white/[0.07] bg-[#050c18] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28" aria-label="Repertório social"><div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">repertório social será carregado ao rolar</div></section>}

        <div
          id="contato"
          ref={contactSectionRef}
          data-contact-anchor="true"
          aria-busy={!shouldRenderContact}
          className="scroll-mt-24"
        >
          {shouldRenderContact ? (
            <Suspense
              fallback={
                <section data-contact-placeholder="true" className="archive-chapter min-h-[720px] border-t border-white/[0.07] bg-[#070a10] px-5 py-16 sm:min-h-[820px] sm:px-8 sm:py-24" aria-label="Carregando contato e briefing">
                  <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">carregando contato e briefing…</div>
                </section>
              }
            >
              <PortfolioContact
                embedded
                initialBriefingSeed={pendingBriefingSeed}
                whatsAppUrl={whatsAppUrl}
                telegramUrl={telegramUrl}
                blockedDates={blockedDates}
                isBlockedDatesError={isBlockedDatesError}
                refetchBlockedDates={refetchBlockedDates}
                availabilitySectionRef={availabilitySectionRef}
                contextTransitionTarget={contextTransitionTarget}
                navigateSavedAgendaContext={navigateSavedAgendaContext}
                contextNavigationStatus={contextNavigationStatus}
                handleSubmit={handleSubmit}
                isQuoteRequestPending={quoteRequestMutation.isPending}
                formError={formError}
                formSent={formSent}
                setFormSent={setFormSent}
                successMessageRef={successMessageRef}
                isStaticDeploy={isStaticDeploy}
                briefingWhatsAppUrl={briefingWhatsAppUrl}
                onBriefingFocusChange={setIsBriefingFieldFocused}
              />
            </Suspense>
          ) : (
            <section data-contact-placeholder="true" className="archive-chapter min-h-[720px] border-t border-white/[0.07] bg-[#070a10] px-5 py-16 sm:min-h-[820px] sm:px-8 sm:py-24" aria-label="Contato">
              <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">contato e briefing serão carregados ao aproximar</div>
            </section>
          )}
        </div>


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
              <div data-footer-placeholder="true" role="status" aria-live="polite" className="min-h-[260px] border-t border-white/[0.07] bg-[#06080d] px-5 py-10 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fa8c8] sm:px-8 lg:px-12">
                carregando contato final…
              </div>
            }
          >
            <PortfolioFooter
              markUrl={markUrl}
              telegramUrl={telegramUrl}
              whatsAppUrl={whatsAppUrl}
              onWhatsAppClick={() => trackPortfolioEvent("whatsapp_click", { source: "footer" })}
              emailCopyStatus={emailCopyStatus}
              copyContactEmail={copyContactEmail}
            />
          </Suspense>
        ) : (
          <div data-footer-placeholder="true" className="min-h-[260px] border-t border-white/[0.07] bg-[#06080d] px-5 py-10 sm:px-8 lg:px-12" aria-label="Contato final">
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fa8c8]">contato final será carregado ao aproximar</p>
          </div>
        )}
      </div>

      <button type="button" onClick={scrollToTop} aria-label="Voltar ao topo da página" title="Voltar ao topo" aria-hidden={!isBackToTopVisible} tabIndex={isBackToTopVisible ? 0 : -1} className={`fixed bottom-20 right-4 z-[55] grid h-11 w-11 place-items-center border border-[#67e8f9]/45 bg-[#071b39]/95 text-[#bdf7ff] shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-[opacity,transform,background-color,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0b2b57] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none sm:bottom-5 sm:right-[360px] ${isBackToTopVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}><ArrowUp className="h-4 w-4" aria-hidden="true" /></button>
      <nav
        aria-label="Ações rápidas"
        aria-hidden={isDockHidden ? "true" : undefined}
        inert={isDockHidden ? true : undefined}
        data-mobile-contact-bar="true"
        data-mobile-dock="true"
        data-mobile-dock-hidden={isDockHidden ? "true" : "false"}
        data-mobile-dock-compact={isMobileDockCompact ? "true" : "false"}
        className={`contact-float fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-[60] grid grid-cols-[minmax(0,1fr)_3.2rem_3.5rem] items-stretch gap-2 overflow-hidden border border-[#67e8f9]/35 bg-[#07101e]/97 p-1.5 shadow-[0_14px_34px_rgba(0,0,0,0.38)] backdrop-blur-sm transition-[opacity,transform] duration-200 sm:bottom-5 sm:left-auto sm:right-5 sm:flex sm:bg-[#07101e]/95 sm:backdrop-blur-md ${shouldHideContactFloat ? "pointer-events-none translate-y-2 opacity-0" : isHeroCtaVisible ? "pointer-events-none translate-y-2 opacity-0 lg:pointer-events-auto lg:translate-y-0 lg:opacity-100" : "translate-y-0 opacity-100"}`}>
        <a
          data-mobile-primary-action="true"
          data-mobile-dock-primary="true"
          href={mobilePrimaryAction.href}
          onClick={() => trackPortfolioEvent("quote_cta", { source: "floating" })}
          className="inline-flex min-h-14 min-w-0 flex-1 touch-manipulation flex-col items-center justify-center rounded-[10px] bg-[#38bdf8] px-2 py-1 font-mono text-[#02111f] transition-[background-color,transform] hover:bg-[#a5f3fc] active:scale-[0.985] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none min-[360px]:px-3 sm:hidden"
          aria-label={mobilePrimaryAction.ariaLabel}
        >
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.08em]">
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
            {mobilePrimaryAction.label}
          </span>
          <span data-mobile-journey-hint="true" className={`mt-0.5 max-w-full truncate text-[7px] uppercase tracking-[0.05em] opacity-70 min-[390px]:text-[8px] ${isMobileDockCompact ? "hidden" : ""}`}>
            {mobileJourneyHint}
          </span>
        </a>
        <a
          data-mobile-dock-secondary="true"
          data-mobile-dock-secondary-route={mobileExperienceRoute}
          href={mobileSecondaryShortcut.href}
          onClick={(event) => {
            if (mobileExperienceRoute !== "explorer") return;
            event.preventDefault();
            openPgArcade();
          }}
          aria-label={`Abrir ${mobileSecondaryShortcut.label}`}
          title={mobileSecondaryShortcut.label}
          className="mobile-context-action inline-flex min-h-14 min-w-0 touch-manipulation flex-col items-center justify-center gap-0.5 rounded-[10px] border border-white/10 bg-[#071326] px-1 text-center text-[#d9fbff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:hidden"
        >
          <MobileSecondaryIcon className="h-4 w-4 text-[#67e8f9]" aria-hidden="true" />
          <span className="max-w-full truncate font-mono text-[7px] font-semibold uppercase tracking-[0.03em] min-[390px]:text-[8px]">
            {mobileSecondaryShortcut.label === "PG Arcade" ? "arcade" : mobileSecondaryShortcut.label}
          </span>
        </a>
        <a data-mobile-whatsapp-action="true" href={whatsAppUrl} onClick={() => trackPortfolioEvent("whatsapp_click", { source: "floating" })} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp sobre um orçamento" title="WhatsApp — falar sobre um orçamento" className="contact-float-link contact-float-whatsapp mobile-whatsapp-action group min-h-12 border-[#38bdf8]/70 bg-[#38bdf8]/10">
          <MessageCircle className="h-4 w-4 fill-current" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
        <a href={telegramUrl} target="_blank" rel="noreferrer" aria-label="Abrir canal público de atendimento no Telegram" title="Telegram" className="contact-float-link contact-float-telegram group hidden sm:flex">
          <Send className="h-4 w-4" aria-hidden="true" />
          <span>Telegram</span>
        </a>
        <a href="https://www.instagram.com/pablogui000/" target="_blank" rel="noreferrer" aria-label="Abrir Instagram @pablogui000" title="Instagram" className="contact-float-link contact-float-instagram group hidden sm:flex">
          <Instagram className="h-4 w-4" aria-hidden="true" />
          <span>Instagram</span>
        </a>
      </nav>


      {selectedProject && (
        <Suspense fallback={<div data-project-details-loading-shell="true" role="status" aria-live="polite" className="fixed inset-0 z-[70] grid place-items-center bg-[#02050a]/90 p-6 font-mono text-[10px] uppercase tracking-[0.14em] text-[#c8f7ff]">carregando detalhes do projeto…</div>}>
          <PortfolioProjectDetailsDialog
            project={selectedProject}
            loading={projectDetailsLoading}
            transition={projectDetailsTransition}
            showSwipeHint={showProjectSwipeHint}
            isFavorite={favoriteProjectIdSet.has(selectedProject.id)}
            shareStatus={projectShareStatus}
            copyStatus={projectCopyStatus}
            previousProject={previousSelectedProject}
            nextProject={nextSelectedProject}
            projectIndex={selectedProjectIndex}
            projectCount={projectCount}
            onOpenChange={(open) => { if (!open) closeProjectDetails(); }}
            onTouchStart={handleProjectDetailsTouchStart}
            onTouchEnd={handleProjectDetailsTouchEnd}
            onToggleFavorite={(event) => toggleFavorite(selectedProject.id, event)}
            onShare={shareSelectedProject}
            onCopyLink={copySelectedProjectLink}
            onNavigate={navigateSelectedProject}
          />
        </Suspense>
      )}
    </div>
  );
}

