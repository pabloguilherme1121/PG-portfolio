/**
 * Design: Arquivo Luminoso — editorial técnico em azul celeste vibrante e azul profundo.
 * A página transforma a trajetória de Pablo em capítulos assimétricos, com
 * metadados, linha de progresso e linguagem visual de arquivo em evolução.
 */
import {
  ArrowUp,
  ArrowUpRight,
  Menu,
  Moon,
  Sun,
  Settings2,
  X,
} from "lucide-react";
import { FormEvent, lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/portfolioApi";
import { getSafeStorage, readStorage, removeStorage, writeStorage } from "@/lib/safeStorage";
import { toast } from "sonner";
import PortfolioHero from "@/features/portfolio/components/PortfolioHero";
import PortfolioTrustBar from "@/features/portfolio/components/PortfolioTrustBar";
import PortfolioArcadeShowcase from "@/features/portfolio/components/PortfolioArcadeShowcase";
import { PortfolioQuickActionsDock } from "@/features/portfolio/components/PortfolioQuickActionsDock";
import { PortfolioDeferredContentSections } from "@/features/portfolio/components/PortfolioDeferredContentSections";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { buildBriefingWhatsAppUrl } from "@/features/portfolio/utils/briefingWhatsApp";
import type { BriefingSeed } from "@/features/portfolio/utils/briefingFlow";
import { copyText, copyTextWithFeedback } from "@/features/portfolio/utils/clipboardFeedback";
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
  portfolioContactEmail as contactEmail,
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
const PortfolioExperienceHub = lazy(() => import("@/features/portfolio/components/PortfolioExperienceHub"));
const ProjectDiagnostic = lazy(() => import("@/features/portfolio/components/ProjectDiagnostic"));
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

const isStaticDeploy = import.meta.env.VITE_STATIC_DEPLOY === "true";

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
  const shouldHideContactFloat = Boolean(selectedProject || isBriefingFieldFocused || isMobileKeyboardOpen || menuOpen || appearanceOpen);
  const isDockHidden = shouldHideContactFloat || isHeroCtaVisible;
  const isBackToTopVisible = showBackToTop && !shouldHideContactFloat;
  const mobileDock = getMobileDockModel(mobileExperienceRoute, hasMobileBriefingDraft);
  const mobilePrimaryAction = mobileDock.primary;
  const mobileJourneyHint = mobileDock.hint;
  const mobileSecondaryShortcut = mobileDock.secondary;
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

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("arcade") !== "1") return;
    const frameId = window.requestAnimationFrame(() => {
      document.getElementById("pg-lab")?.scrollIntoView({ behavior: "auto", block: "start" });
    });
    return () => window.cancelAnimationFrame(frameId);
  }, []);

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
    await copyTextWithFeedback(contactEmail, setEmailCopyStatus);
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
      if (!await copyText(canonicalUrl)) throw new Error("Não foi possível copiar o link");
      trackPortfolioEvent("share_portfolio", { source: "mobile_menu", channel: "copy_link" });
      setPortfolioShareStatus("copied");
    } catch {
      setPortfolioShareStatus("error");
    }
    window.setTimeout(() => setPortfolioShareStatus("idle"), 2600);
  }

  function navigateSavedAgendaContext(target: "saved" | "agenda") {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (contextTransitionTimerRef.current) window.clearTimeout(contextTransitionTimerRef.current);
    setContextTransitionTarget(target);
    setContextNavigationStatus(target === "saved" ? "Seção de projetos em foco." : "Agenda de disponibilidade em foco.");

    window.requestAnimationFrame(() => {
      const targetElement = target === "saved"
        ? document.getElementById("projetos")
        : availabilitySectionRef.current;
      if (!targetElement) return;
      if (target === "saved") window.history.pushState({}, "", "#projetos");
      targetElement.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      targetElement.focus({ preventScroll: true });
      contextTransitionTimerRef.current = window.setTimeout(() => setContextTransitionTarget(null), reduceMotion ? 0 : 180);
    });
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
    completeBriefingSubmission: () => void,
  ) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const eventDate = String(data.get("date") || "");
    setFormError(null);
    setFormSent(false);
    setBriefingWhatsAppUrl(null);

    if (isStaticDeploy) {
      trackPortfolioEvent("briefing_whatsapp_prepared", { channel: "whatsapp" });
      const url = buildBriefingWhatsAppUrl(whatsAppNumber, data);
      setBriefingWhatsAppUrl(url);
      window.open(url, "_blank", "noopener,noreferrer");
      setFormSent(true);
      return;
    }

    const extraContext = [
      data.get("objective") ? `Objetivo: ${String(data.get("objective"))}` : "",
      data.get("audience") ? `Público: ${String(data.get("audience"))}` : "",
      data.get("stage") ? `Estágio atual: ${String(data.get("stage"))}` : "",
      data.get("deadline") ? `Prazo: ${String(data.get("deadline"))}` : "",
      data.get("success") ? `Critério de sucesso: ${String(data.get("success"))}` : "",
      data.get("references") ? `Referências: ${String(data.get("references"))}` : "",
      data.get("constraints") ? `Restrições / integrações: ${String(data.get("constraints"))}` : "",
    ].filter(Boolean).join("\n");
    const enrichedBriefing = [String(data.get("briefing") || ""), extraContext].filter(Boolean).join("\n\n").slice(0, 5000);

    quoteRequestMutation.mutate(
      {
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        service: String(data.get("service") || ""),
        projectType: String(data.get("projectType") || ""),
        location: String(data.get("location") || ""),
        eventDate: eventDate || undefined,
        delivery: String(data.get("delivery") || "") || undefined,
        budget: String(data.get("budget") || "") || undefined,
        briefing: enrichedBriefing,
        website: String(data.get("website") || ""),
      },
      {
        onSuccess: () => {
          form.reset();
          completeBriefingSubmission();
        },
      },
    );
  }

  return (
    <div data-portfolio-shell-version="2" data-theme={theme} data-reduced-data={avoidSpeculativePreload ? "true" : "false"} className="arquivo-page min-h-screen overflow-x-hidden bg-[#07111f] text-[#f2fbff] selection:bg-[#67e8f9] selection:text-[#061226]">
      <a href="#conteudo-principal" className="skip-link">pular para o conteúdo</a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-cyan-200/[0.14] bg-[#07111f]/94 backdrop-blur-md md:bg-[#07111f]/90 md:backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
          <a href="#inicio" aria-label="Ir ao início" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" onClick={closeMenu}>
            <span className="grid h-10 w-10 place-items-center border border-[#67e8f9]/60 bg-[#062044] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.32)]">
              <img src={markUrl} alt="Símbolo PG" width="28" height="28" decoding="async" className="h-7 w-7 object-contain" />
            </span>
            <span className="truncate font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-[#b7cdf1] min-[360px]:text-[10px] min-[360px]:tracking-[0.2em]">Pablo <span className="text-[#67e8f9]">/</span> <span className="max-[359px]:hidden">Guilherme</span></span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
            {navigationItems.map(([label, href, id]) => (
              <a key={label} href={href} aria-current={activeSection === id ? "location" : undefined} className={`nav-link text-[11px] font-mono uppercase tracking-[0.14em] transition-colors hover:text-white ${activeSection === id ? "text-[#67e8f9]" : "text-[#90a3c3]"}`}>
                {label}
              </a>
            ))}
            <a href={"https:" + "//pabloguilherme01.github.io/observatorio/"} target="_blank" rel="noreferrer" className="nav-link text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-[#a5f3fc] transition-colors hover:text-white">observatório <ArrowUpRight className="ml-1 inline h-3 w-3" /></a>
            <button type="button" data-theme-toggle="true" onClick={() => toggleTheme?.()} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} aria-pressed={theme === "dark"} title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} className="grid h-9 w-9 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">{theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}</button>
            <button
              type="button"
              data-appearance-trigger="desktop"
              onClick={(event) => openAppearancePanel(event.currentTarget)}
              aria-label="Configurações de aparência"
              title="Configurações de aparência"
              className="grid h-9 w-9 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
            >
              <Settings2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <a href="#contato" className="inline-flex items-center gap-2 border border-[#67e8f9] bg-[#38bdf8] px-4 py-2 text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-colors hover:bg-[#a5f3fc]">
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
              aria-label={menuOpen ? "Fechar menu" : `Abrir menu · seção ${mobileSectionLabels[activeSection] ?? "portfólio"} · ${Math.round(scrollProgress)}% percorrido`}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <span
                data-mobile-progress-ring="true"
                data-progress={Math.round(scrollProgress)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full p-[2px] transition-[background] motion-reduce:transition-none"
                style={{ background: `conic-gradient(#67e8f9 ${Math.round(scrollProgress)}%, rgba(103,232,249,0.12) 0)` }}
                aria-hidden="true"
              >
                <span className="grid h-full w-full place-items-center rounded-full bg-[#07111f] shadow-inner">
                  {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </span>
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span data-mobile-current-section="true" className="block truncate font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#d9fbff]">
                  {mobileSectionLabels[activeSection] ?? "portfólio"}
                </span>
                <span data-mobile-progress-value="true" className="mt-0.5 block truncate font-mono text-[7px] uppercase tracking-[0.07em] text-[#7fa5bf]">
                  {Math.round(scrollProgress)}% percorrido
                </span>
              </span>
            </button>
            <button type="button" data-theme-toggle="true" onClick={() => toggleTheme?.()} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} aria-pressed={theme === "dark"} title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} className="grid h-11 w-11 place-items-center rounded-[12px] border border-white/10 bg-[#071326]/75 text-[#d8e6fa] transition-colors hover:border-[#67e8f9] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">{theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}</button>
          </div>
        </div>
        {menuOpen && (
          <Suspense fallback={<div role="status" aria-live="polite" className="border-t border-white/[0.07] bg-[#090d16]/98 px-4 py-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc] md:hidden">carregando navegação…</div>}>
            <PortfolioMobileMenu
              portraitUrl={portraitUrl}
              activeSection={activeSection}
              mobilePrimaryAction={mobilePrimaryAction}
              mobileSecondaryShortcut={mobileSecondaryShortcut}
              mobileExperienceRoute={mobileExperienceRoute}
              portfolioShareStatus={portfolioShareStatus}
              showInstallAction={canInstallPortfolio}
              onClose={closeMenu}
              onSelectRoute={(routeId) => {
                setMobileExperienceRoute(routeId);
                writeStorage(getSafeStorage("session"), "pablo-portfolio-experience-route", routeId);
                window.dispatchEvent(new CustomEvent("portfolio:experience-route", { detail: { routeId } }));
                trackPortfolioEvent("experience_route_selected", { experienceRoute: routeId });
              }}
              onOpenAppearance={openAppearancePanel}
              onSharePortfolio={() => void sharePortfolio()}
              onInstallPortfolio={() => void installPortfolioPwa()}
            />
          </Suspense>
        )}
        {appearanceOpen && (
          <Suspense fallback={<div role="status" className="fixed right-4 top-[88px] z-[60] w-[min(92vw,340px)] border border-[#67e8f9]/30 bg-[#071326] p-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc] sm:right-8 lg:right-12">carregando aparência…</div>}>
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
      <div className="scroll-progress-track pointer-events-none fixed inset-x-0 top-[75px] z-40 hidden h-0.5 bg-[#67e8f9]/10 md:block" aria-hidden="true"><span className="scroll-progress-bar block h-full origin-left bg-[#67e8f9]" style={{ transform: `scaleX(${scrollProgress / 100})` }} /></div>

      <main id="conteudo-principal" className="relative" style={{ fontSize: `${fontScale}rem` }} tabIndex={-1}>
        <div className="archive-spine pointer-events-none absolute bottom-0 top-0 z-20" aria-hidden="true" />
        <PortfolioHero
          markUrl={markUrl}
          portraitUrl={portraitUrl}
          portraitResponsive={portraitResponsive}
          heroCtaRef={heroCtaRef}
        />

        <PortfolioTrustBar />

        <section id="projetos" ref={projectsSectionRef} tabIndex={-1} className="archive-chapter relative border-y border-white/[0.07] bg-[#0a0f18]">
          <div className="mx-auto max-w-[1440px] px-4 py-14 min-[360px]:px-5 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
            {shouldRenderProjects ? (
              <Suspense
                fallback={
                  <div data-projects-overview-placeholder="true" role="status" aria-live="polite" className="min-h-[28rem] border border-white/[0.08] bg-[#071326]/55 p-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9] sm:min-h-[32rem]">
                    carregando vitrine de projetos…
                  </div>
                }
              >
                <PortfolioProjectsOverview
                  markUrl={markUrl}
                  portraitUrl={portraitUrl}
                  portraitResponsive={portraitResponsive}
                  featuredCardsReady={featuredCardsReady}
                  featuredRepositories={featuredRepositories}
                  openProjectDetails={openProjectDetails}
                />
              </Suspense>
            ) : (
              <div data-projects-overview-placeholder="true" className="min-h-[28rem] border border-white/[0.08] bg-[#071326]/35 p-5 sm:min-h-[32rem]" aria-label="Vitrine de projetos">
                <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">vitrine de projetos será carregada ao aproximar</p>
              </div>
            )}
            <div className="mt-10 flex flex-col gap-4 border-y border-white/[0.1] py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">quer ver mais ou discutir um projeto?</p>
                <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#a9bfd8]">Os destaques acima representam a seleção principal. Para detalhes técnicos, contexto ou uma proposta, fale diretamente comigo.</p>
              </div>
              <a href="#contato" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[#38bdf8] px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-colors hover:bg-[#a5f3fc]">falar sobre um projeto <ArrowUpRight className="h-4 w-4" /></a>
            </div>

            <div
              id="estudos-de-caso"
              ref={caseStudiesSectionRef}
              data-case-studies-anchor="true"
              aria-busy={!shouldRenderCaseStudies}
              className="scroll-mt-24"
            >
              {shouldRenderCaseStudies ? (
                <Suspense
                  fallback={
                    <div data-case-studies-placeholder="true" className="mt-12 min-h-40 border-t border-cyan-100/[0.12] pt-8 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9] sm:mt-16 sm:pt-10">
                      carregando estudos de caso…
                    </div>
                  }
                >
                  <PortfolioCaseStudies />
                </Suspense>
              ) : (
                <div data-case-studies-placeholder="true" className="mt-12 min-h-40 border-t border-cyan-100/[0.12] pt-8 sm:mt-16 sm:pt-10">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">estudos de caso carregam ao aproximar</p>
                </div>
              )}
            </div>
          </div>
        </section>


        <div ref={experienceHubRef} data-experience-hub-anchor="true" aria-busy={!shouldLoadExperienceHub} className="min-h-px">
          {shouldLoadExperienceHub ? (
            <Suspense
              fallback={
                <section data-experience-hub-placeholder="true" role="status" aria-live="polite" className="experience-hub-surface archive-chapter min-h-[420px] border-y border-white/[0.08] bg-[#050d18] px-5 py-10 sm:min-h-[480px] sm:px-8 sm:py-12 lg:px-12">
                  <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc]">
                    carregando rotas do portfólio…
                  </div>
                </section>
              }
            >
              <PortfolioExperienceHub route={mobileExperienceRoute} />
            </Suspense>
          ) : (
            <section data-experience-hub-placeholder="true" className="experience-hub-surface archive-chapter min-h-[420px] border-y border-white/[0.08] bg-[#050d18] px-5 py-10 sm:min-h-[480px] sm:px-8 sm:py-12 lg:px-12" aria-label="Rotas do portfólio">
              <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8fb6c9]">
                rotas do portfólio serão carregadas ao aproximar
              </div>
            </section>
          )}
        </div>

        <PortfolioArcadeShowcase />

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

        <PortfolioDeferredContentSections
          profileSectionsRef={profileSectionsRef}
          shouldRenderProfileSections={shouldRenderProfileSections}
          webResumeSectionRef={webResumeSectionRef}
          shouldRenderWebResume={shouldRenderWebResume}
          staticSectionsRef={staticSectionsRef}
          shouldRenderStaticSections={shouldRenderStaticSections}
          socialSectionRef={socialSectionRef}
          shouldLoadSocial={shouldLoadSocial}
        />

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
      <PortfolioQuickActionsDock
        isDockHidden={isDockHidden}
        shouldHideContactFloat={shouldHideContactFloat}
        isHeroCtaVisible={isHeroCtaVisible}
        isMobileDockCompact={isMobileDockCompact}
        mobileExperienceRoute={mobileExperienceRoute}
        mobilePrimaryAction={mobilePrimaryAction}
        mobileJourneyHint={mobileJourneyHint}
        mobileSecondaryShortcut={mobileSecondaryShortcut}
        whatsAppUrl={whatsAppUrl}
        telegramUrl={telegramUrl}
      />


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
