/**
 * Design: Arquivo Luminoso — editorial técnico em azul celeste vibrante e azul profundo.
 * A página transforma a trajetória de Pablo em capítulos assimétricos, com
 * metadados, linha de progresso e linguagem visual de arquivo em evolução.
 */
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  CalendarDays,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  GripVertical,
  Braces,
  Download,
  FileText,
  FolderGit2,
  Pencil,
  Copy,
  Eye,
  Save,
  Trash2,
  Github,
  Heart,
  Instagram,
  Layers2,
  Loader2,
  Menu,
  MessageCircle,
  Search,
  Send,
  Share2,
  Moon,
  Sun,
  Monitor,
  Settings2,
  List,
  LayoutGrid,
  X,
} from "lucide-react";
import { FormEvent, lazy, MouseEvent, Suspense, TouchEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { dropProjectInOrder, moveProjectInOrder, normalizeManualOrder } from "@/lib/manualOrder";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import PortfolioFooter from "@/features/portfolio/components/PortfolioFooter";
import PortfolioHero from "@/features/portfolio/components/PortfolioHero";
import PortfolioExperienceHub from "@/features/portfolio/components/PortfolioExperienceHub";
import PortfolioAbout from "@/features/portfolio/components/PortfolioAbout";
import PortfolioProfessionalSnapshot from "@/features/portfolio/components/PortfolioProfessionalSnapshot";
import PortfolioTrustBar from "@/features/portfolio/components/PortfolioTrustBar";
import ProjectDiagnostic from "@/features/portfolio/components/ProjectDiagnostic";
import { PortfolioProcess, PortfolioServices, PortfolioSkills } from "@/features/portfolio/components/PortfolioStaticSections";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { buildBriefingWhatsAppUrl } from "@/features/portfolio/utils/briefingWhatsApp";
import { exportFavoriteProjects, type FavoriteExportFormat } from "@/features/portfolio/utils/exportFavorites";
import { buildFavoritesShareUrl, buildProjectShareUrl } from "@/features/portfolio/utils/shareProject";
import { copyTextWithFeedback } from "@/features/portfolio/utils/clipboardFeedback";
import { getMobileDockModel, isMobileExperienceRoute, readStoredBriefingProgress, readStoredExperienceRoute, type MobileExperienceRoute } from "@/features/portfolio/utils/mobileJourney";
import { getNavigatorConnection, shouldAvoidSpeculativePreload } from "@/features/portfolio/utils/networkHints";
import { useNearViewport } from "@/features/portfolio/hooks/useNearViewport";
import { usePortfolioShellState } from "@/features/portfolio/hooks/usePortfolioShellState";
import {
  portfolioMarkUrl as markUrl,
  portfolioMobileSectionLabels as mobileSectionLabels,
  portfolioNavigationItems as navigationItems,
  portfolioPortraitResponsive as portraitResponsive,
  portfolioPortraitUrl as portraitUrl,
  portfolioResumeUrl as resumeUrl,
  portfolioTelegramUrl as telegramUrl,
  portfolioWhatsAppNumber as whatsAppNumber,
  portfolioWhatsAppUrl as whatsAppUrl,
} from "@/features/portfolio/portfolioConfig";
import {
  categoryFilters,
  predefinedOrderProfiles,
  repositories,
  sortOptions,
  tagFilters,
  technologyFilters,
  type ManualOrderProfile,
  type Repository,
} from "@/features/portfolio/portfolioData";
const InstagramRepertoire = lazy(() => import("@/features/social/InstagramRepertoire"));
const PortfolioProjectsOverview = lazy(() => import("@/features/portfolio/components/PortfolioProjectsOverview"));
const PortfolioCaseStudies = lazy(() => import("@/features/portfolio/components/PortfolioCaseStudies"));
const PortfolioContact = lazy(() =>
  import("@/features/portfolio/components/PortfolioContact").then((module) => ({
    default: module.PortfolioContact,
  })),
);
const PortfolioWebResume = lazy(() => import("@/features/portfolio/components/PortfolioWebResume"));
const loadPortfolioResumePreview = () =>
  import("@/features/portfolio/components/PortfolioResumePreview").then((module) => ({
    default: module.PortfolioResumePreview,
  }));
const PortfolioResumePreview = lazy(loadPortfolioResumePreview);
const loadPortfolioTicTacToe = () => import("@/features/portfolio/components/PortfolioTicTacToe");
const PortfolioTicTacToe = lazy(loadPortfolioTicTacToe);

const isStaticDeploy = import.meta.env.VITE_STATIC_DEPLOY === "true";
declare const __PORTFOLIO_RESUME_AVAILABLE__: boolean;
declare const __PORTFOLIO_HERO_AVAILABLE__: boolean;
const resumeAvailable = __PORTFOLIO_RESUME_AVAILABLE__;
const heroAvailable = __PORTFOLIO_HERO_AVAILABLE__;

type SearchSuggestion = {
  value: string;
  source: "projeto" | "tecnologia" | "descrição";
};

type PwaInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

type BriefingSeed = Partial<Record<"service" | "projectType" | "objective" | "audience" | "stage" | "delivery" | "success" | "briefing", string>>;

const descriptionStopWords = new Set([
  "a", "ao", "as", "com", "da", "de", "do", "dos", "e", "em", "na", "nas", "no", "nos", "o", "os", "ou", "para", "por", "que", "uma", "um",
]);

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

function renderSuggestionMatch(value: string, query: string, isActive: boolean) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return value;

  const characters = Array.from(value);
  const normalizedCharacters = characters.map((character) => normalizeSearchText(character));
  const normalizedValue = normalizedCharacters.join("");
  const matchStart = normalizedValue.indexOf(normalizedQuery);
  if (matchStart < 0) return value;

  let characterStart = 0;
  let characterEnd = characters.length;
  let normalizedOffset = 0;
  for (let index = 0; index < normalizedCharacters.length; index += 1) {
    const nextOffset = normalizedOffset + normalizedCharacters[index].length;
    if (normalizedOffset <= matchStart && matchStart < nextOffset) characterStart = index;
    if (normalizedOffset < matchStart + normalizedQuery.length && matchStart + normalizedQuery.length <= nextOffset) {
      characterEnd = index + 1;
      break;
    }
    normalizedOffset = nextOffset;
  }

  return <>{characters.slice(0, characterStart).join("")}<strong data-suggestion-match="true" className={`font-bold ${isActive ? "text-[#02111f]" : "text-white"}`}>{characters.slice(characterStart, characterEnd).join("")}</strong>{characters.slice(characterEnd).join("")}</>;
}

function getPortfolioUrlFilter(key: string, allowed: readonly string[], fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = new URLSearchParams(window.location.search).get(key);
  return value && allowed.includes(value) ? value : fallback;
}

function getPortfolioUrlSearch() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

function getRepositoryCategories(repository: Repository) {
  const categories = new Set<string>(["Produto digital"]);
  if (repository.technologies.includes("Interface")) categories.add("Interface");
  return categories;
}

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
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [avoidSpeculativePreload, setAvoidSpeculativePreload] = useState(() =>
    typeof navigator === "undefined" ? false : shouldAvoidSpeculativePreload(getNavigatorConnection(navigator)),
  );
  const deferredRootMargin = avoidSpeculativePreload ? "160px" : "720px";
  const [socialSectionRef, shouldLoadSocial] = useNearViewport<HTMLDivElement>(deferredRootMargin);
  const [availabilitySectionRef, shouldLoadAvailability] = useNearViewport<HTMLDivElement>(deferredRootMargin);
  const [webResumeSectionRef, shouldLoadWebResume] = useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "160px" : "480px");
  const [projectsSectionRef, shouldLoadProjects] = useNearViewport<HTMLElement>(avoidSpeculativePreload ? "80px" : "240px");
  const [caseStudiesSectionRef, shouldLoadCaseStudies] = useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "80px" : "420px");
  const [contactSectionRef, shouldLoadContact] = useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "80px" : "360px");
  const [fontScale, setFontScale] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const stored = Number(window.localStorage.getItem("pablo-portfolio-font-scale"));
    return Number.isFinite(stored) ? Math.min(1.16, Math.max(0.92, stored)) : 1;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState<PwaInstallPromptEvent | null>(null);
  const [pgLabOpen, setPgLabOpen] = useState(false);
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const [resumePreviewLoading, setResumePreviewLoading] = useState(false);
  const [resumePreviewProgress, setResumePreviewProgress] = useState(0);
  const [resumePreviewError, setResumePreviewError] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [briefingWhatsAppUrl, setBriefingWhatsAppUrl] = useState<string | null>(null);
  const [deferredContactReady, setDeferredContactReady] = useState(false);
  const [pendingBriefingSeed, setPendingBriefingSeed] = useState<BriefingSeed | null>(null);
  const [contactHashRequested, setContactHashRequested] = useState(() =>
    typeof window !== "undefined" && (window.location.hash === "#contato" || window.location.hash === "#contato-briefing"),
  );
  const [caseStudiesHashRequested, setCaseStudiesHashRequested] = useState(() =>
    typeof window !== "undefined" && window.location.hash === "#estudos-de-caso",
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [emailCopyStatus, setEmailCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [searchShareStatus, setSearchShareStatus] = useState<"idle" | "copied" | "error">("idle");
  const [activeTechnology, setActiveTechnology] = useState(() => getPortfolioUrlFilter("technology", technologyFilters, "Todos"));
  const [activeCategory, setActiveCategory] = useState(() => getPortfolioUrlFilter("category", categoryFilters, "Todos"));
  const [activeTag, setActiveTag] = useState<(typeof tagFilters)[number]>(() => getPortfolioUrlFilter("tag", tagFilters, "Todos") as (typeof tagFilters)[number]);
  const [sortMode, setSortMode] = useState<(typeof sortOptions)[number]["value"]>(() => getPortfolioUrlFilter("sort", sortOptions.map((option) => option.value), "relevance") as (typeof sortOptions)[number]["value"]);
  const [manualProjectOrder, setManualProjectOrder] = useState<string[]>(() => {
    if (typeof window === "undefined") return repositories.map((repository) => repository.id);
    try {
      const stored = JSON.parse(window.localStorage.getItem("pablo-portfolio-manual-order") || "[]");
      return normalizeManualOrder(stored, repositories.map((repository) => repository.id));
    } catch {
      return repositories.map((repository) => repository.id);
    }
  });
  const [draggedProjectId, setDraggedProjectId] = useState<string | null>(null);
  const [manualOrderStatus, setManualOrderStatus] = useState("");
  const [manualOrderProfiles, setManualOrderProfiles] = useState<ManualOrderProfile[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = JSON.parse(window.localStorage.getItem("pablo-portfolio-order-profiles") || "[]");
      const storedProfiles = Array.isArray(stored) ? stored.filter((profile): profile is ManualOrderProfile => Boolean(profile && typeof profile.id === "string" && typeof profile.name === "string" && Array.isArray(profile.order))) : [];
      const storedIds = new Set(storedProfiles.map((profile) => profile.id));
      return [...predefinedOrderProfiles.filter((profile) => !storedIds.has(profile.id)), ...storedProfiles];
    } catch {
      return [];
    }
  });
  const [activeOrderProfileId, setActiveOrderProfileId] = useState<string | null>(() => typeof window === "undefined" ? null : window.localStorage.getItem("pablo-portfolio-active-order-profile"));
  const [profileNameDraft, setProfileNameDraft] = useState("");
  const [previewOrderProfileId, setPreviewOrderProfileId] = useState<string | null>(null);
  const [recentlyActivatedOrderProfileId, setRecentlyActivatedOrderProfileId] = useState<string | null>(null);
  const activeOrderProfile = manualOrderProfiles.find((profile) => profile.id === activeOrderProfileId);

  const [isProjectFilterTransitioning, setIsProjectFilterTransitioning] = useState(false);
  const [isGalleryLoading, setIsGalleryLoading] = useState(false);
  const [featuredCardsReady, setFeaturedCardsReady] = useState(false);
  const [visibleProjectLimit, setVisibleProjectLimit] = useState(4);
  const [isCompactGallery, setIsCompactGallery] = useState(false);
  const [isMobileGalleryRefinementOpen, setIsMobileGalleryRefinementOpen] = useState(false);
  const [galleryView, setGalleryView] = useState<"grid" | "list">(() => {
    if (typeof window === "undefined") return "grid";
    return window.localStorage.getItem("pablo-portfolio-gallery-view") === "list" ? "list" : "grid";
  });
  const [favoriteProjectIds, setFavoriteProjectIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem("pablo-portfolio-favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [savedProjectSearch, setSavedProjectSearch] = useState("");
  const [savedProjectSortMode, setSavedProjectSortMode] = useState<(typeof sortOptions)[number]["value"]>("relevance");
  const [savedProjectControlStatus, setSavedProjectControlStatus] = useState("");
  const [contextTransitionTarget, setContextTransitionTarget] = useState<"saved" | "agenda" | null>(null);
  const [contextNavigationStatus, setContextNavigationStatus] = useState("");
  const [sharedProjectIds, setSharedProjectIds] = useState<string[] | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");
  const [portfolioShareStatus, setPortfolioShareStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");
  const [projectShareStatus, setProjectShareStatus] = useState<"idle" | "copied" | "error">("idle");
  const [projectCopyStatus, setProjectCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [projectDetailsLoading, setProjectDetailsLoading] = useState(false);
  const [showProjectSwipeHint, setShowProjectSwipeHint] = useState(false);
  const [isBriefingFieldFocused, setIsBriefingFieldFocused] = useState(false);
  const [isMobileKeyboardOpen, setIsMobileKeyboardOpen] = useState(false);
  const [mobileExperienceRoute, setMobileExperienceRoute] = useState<MobileExperienceRoute>(() =>
    readStoredExperienceRoute(typeof window === "undefined" ? null : window.sessionStorage),
  );
  const [hasMobileBriefingDraft, setHasMobileBriefingDraft] = useState(() =>
    readStoredBriefingProgress(typeof window === "undefined" ? null : window.localStorage),
  );
  const [favoriteExportStatus, setFavoriteExportStatus] = useState<"idle" | "csv" | "json" | "pdf-loading" | "pdf" | "error">("idle");
  const [projectSearch, setProjectSearch] = useState(getPortfolioUrlSearch);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = JSON.parse(window.localStorage.getItem("pablo-portfolio-recent-searches") || "[]");
      return Array.isArray(stored) ? stored.filter((term): term is string => typeof term === "string" && term.trim().length >= 2).slice(0, 6) : [];
    } catch {
      return [];
    }
  });
  const [isProjectSearchFocused, setIsProjectSearchFocused] = useState(false);
  const [activeSearchSuggestionIndex, setActiveSearchSuggestionIndex] = useState(-1);
  const [selectedProject, setSelectedProject] = useState<Repository | null>(null);
  const [projectDetailsTransition, setProjectDetailsTransition] = useState<"next" | "previous" | null>(null);
  const projectDetailsSwipeStartRef = useRef<{ x: number; y: number } | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const resumePreviewCloseRef = useRef<HTMLButtonElement>(null);
  const resumePreviewReturnFocusRef = useRef<HTMLElement | null>(null);
  const shouldHideContactFloat = Boolean(selectedProject || resumePreviewOpen || isProjectSearchFocused || isBriefingFieldFocused || isMobileKeyboardOpen || pgLabOpen || menuOpen || appearanceOpen);
  const isDockHidden = shouldHideContactFloat || isHeroCtaVisible;
  const mobileDock = getMobileDockModel(mobileExperienceRoute, hasMobileBriefingDraft);
  const mobilePrimaryAction = mobileDock.primary;
  const mobileJourneyHint = mobileDock.hint;
  const mobileSecondaryShortcut = mobileDock.secondary;
  const MobileSecondaryIcon = mobileExperienceRoute === "recruiter" ? FileText : mobileExperienceRoute === "explorer" ? Braces : Layers2;
  const shouldRenderWebResume = shouldLoadWebResume || (typeof window !== "undefined" && window.location.hash === "#curriculo-web");
  const shouldRenderProjects = shouldLoadProjects || (typeof window !== "undefined" && window.location.hash === "#projetos");
  const shouldRenderCaseStudies = shouldLoadCaseStudies || caseStudiesHashRequested;
  const shouldRenderContact = shouldLoadContact || contactHashRequested || Boolean(pendingBriefingSeed) || deferredContactReady;

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const connection = getNavigatorConnection(navigator);
    if (!connection?.addEventListener || !connection.removeEventListener) return;
    const syncNetworkPreference = () => setAvoidSpeculativePreload(shouldAvoidSpeculativePreload(connection));
    connection.addEventListener("change", syncNetworkPreference);
    return () => connection.removeEventListener?.("change", syncNetworkPreference);
  }, []);

  useEffect(() => {
    if (avoidSpeculativePreload || deferredContactReady) return;

    let timer: number | null = null;
    const scheduleDeferredContact = () => {
      if (timer !== null) return;
      timer = window.setTimeout(() => setDeferredContactReady(true), 2200);
    };

    if (document.readyState === "complete") scheduleDeferredContact();
    else window.addEventListener("load", scheduleDeferredContact, { once: true });

    return () => {
      window.removeEventListener("load", scheduleDeferredContact);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [avoidSpeculativePreload, deferredContactReady]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      const promptEvent = event as PwaInstallPromptEvent;
      if (typeof promptEvent.prompt !== "function") return;
      event.preventDefault();
      setPwaInstallPrompt(promptEvent);
    };
    const handleAppInstalled = () => setPwaInstallPrompt(null);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

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
    const syncDeferredHashes = () => {
      setContactHashRequested(window.location.hash === "#contato" || window.location.hash === "#contato-briefing");
      setCaseStudiesHashRequested(window.location.hash === "#estudos-de-caso");
    };
    window.addEventListener("hashchange", syncDeferredHashes);
    return () => window.removeEventListener("hashchange", syncDeferredHashes);
  }, []);

  useEffect(() => {
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 120 : 420;
    const timer = window.setTimeout(() => setFeaturedCardsReady(true), delay);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const sharedProjectId = new URLSearchParams(window.location.search).get("projeto");
    if (!sharedProjectId || selectedProject || !repositories.length) return;
    const sharedProject = repositories.find((repository) => repository.id === sharedProjectId);
    if (sharedProject) openProjectDetails(sharedProject);
  }, [repositories, selectedProject]);


  useEffect(() => {
    if (!resumePreviewOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => resumePreviewCloseRef.current?.focus(), 0);
    const handleResumePreviewKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setResumePreviewOpen(false);
        setMenuOpen(false);
        window.setTimeout(() => {
          const returnTarget = resumePreviewReturnFocusRef.current;
          if (returnTarget?.isConnected && returnTarget.offsetParent !== null) returnTarget.focus();
          else (Array.from(document.querySelectorAll<HTMLElement>('[data-resume-header="true"]')).find((element) => element.offsetParent !== null) ?? menuButtonRef.current)?.focus();
        }, 0);
      }
    };
    window.addEventListener("keydown", handleResumePreviewKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleResumePreviewKeyDown);
    };
  }, [resumePreviewOpen]);

  useEffect(() => {
    if (!resumePreviewOpen || !resumePreviewLoading) return;
    const progressTimer = window.setInterval(() => {
      setResumePreviewProgress((currentProgress) => Math.min(92, currentProgress + (currentProgress < 55 ? 5 : 2)));
    }, 180);
    const loadingFallbackTimer = window.setTimeout(() => setResumePreviewLoading(false), 4000);
    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(loadingFallbackTimer);
    };
  }, [resumePreviewOpen, resumePreviewLoading]);


  const successMessageRef = useRef<HTMLDivElement>(null);
  const projectFilterTimerRef = useRef<number | null>(null);
  const galleryLoadingTimerRef = useRef<number | null>(null);
  const contextTransitionTimerRef = useRef<number | null>(null);
  const favoriteExportTimerRef = useRef<number | null>(null);
  const projectSearchInputRef = useRef<HTMLInputElement>(null);
  const favoriteProjectIdSet = useMemo(() => new Set(favoriteProjectIds), [favoriteProjectIds]);
  const sharedProjectIdSet = useMemo(() => new Set(sharedProjectIds ?? []), [sharedProjectIds]);
  const {
    data: blockedDates = [],
    isError: isBlockedDatesError,
    refetch: refetchBlockedDates,
  } = trpc.availability.listBlocked.useQuery(undefined, { enabled: shouldLoadAvailability && !isStaticDeploy });

  const normalizedProjectSearch = normalizeSearchText(projectSearch);
  const normalizedSavedProjectSearch = normalizeSearchText(savedProjectSearch);
  const activeProjectSearch = favoritesOnly ? normalizedSavedProjectSearch : normalizedProjectSearch;
  const activeProjectSortMode = favoritesOnly ? savedProjectSortMode : sortMode;
  const hasActiveSavedProjectControls = Boolean(savedProjectSearch.trim()) || savedProjectSortMode !== "relevance";
  const projectSearchSuggestions = useMemo<SearchSuggestion[]>(() => {
    const candidates = new Map<string, SearchSuggestion>();
    const addCandidate = (value: string, source: SearchSuggestion["source"]) => {
      const normalizedValue = normalizeSearchText(value);
      if (!normalizedValue || candidates.has(normalizedValue)) return;
      candidates.set(normalizedValue, { value, source });
    };

    repositories
      .filter((repository) => (activeTechnology === "Todos" || repository.technologies.includes(activeTechnology)) && (activeCategory === "Todos" || getRepositoryCategories(repository).has(activeCategory)))
      .forEach((repository) => {
      addCandidate(repository.name, "projeto");
      repository.technologies.forEach((technology) => addCandidate(technology, "tecnologia"));
      repository.description
        .split(/[^A-Za-zÀ-ÿ0-9]+/)
        .filter((word) => word.length >= 4 && !descriptionStopWords.has(normalizeSearchText(word)))
        .forEach((word) => addCandidate(word, "descrição"));
    });

    return Array.from(candidates.values());
  }, [activeTechnology, activeCategory]);
  const visibleSearchSuggestions = normalizedProjectSearch.length >= 2
    ? projectSearchSuggestions
      .filter((suggestion) => normalizeSearchText(suggestion.value).includes(normalizedProjectSearch))
      .slice(0, 6)
    : [];
  const orderedRepositories = useMemo(() => {
    const orderIndex = new Map(manualProjectOrder.map((id, index) => [id, index]));
    return [...repositories].sort((first, second) => (orderIndex.get(first.id) ?? Number.MAX_SAFE_INTEGER) - (orderIndex.get(second.id) ?? Number.MAX_SAFE_INTEGER));
  }, [manualProjectOrder]);
  const visibleRepositories = orderedRepositories
    .filter((repository) => {
      const matchesTechnology = activeTechnology === "Todos" || repository.technologies.includes(activeTechnology);
      const matchesCategory = activeCategory === "Todos" || getRepositoryCategories(repository).has(activeCategory);
      const matchesTag = activeTag === "Todos" || repository.technologies.includes(activeTag) || getRepositoryCategories(repository).has(activeTag);
      const searchableProjectText = normalizeSearchText([repository.name, repository.description, ...repository.technologies, ...Array.from(getRepositoryCategories(repository))].join(" "));
      const matchesSearch = !activeProjectSearch || searchableProjectText.includes(activeProjectSearch);
      const matchesFavorites = !favoritesOnly || (sharedProjectIds ? sharedProjectIdSet.has(repository.id) : favoriteProjectIdSet.has(repository.id));
      return matchesTechnology && matchesCategory && matchesTag && matchesSearch && matchesFavorites;
    })
    .sort((first, second) => activeProjectSortMode === "manual" ? 0 : activeProjectSortMode === "added" ? second.addedOrder - first.addedOrder : second.relevance - first.relevance);
  const displayedRepositories = visibleRepositories.slice(0, visibleProjectLimit);
  const selectedProjectIndex = selectedProject ? visibleRepositories.findIndex((repository) => repository.id === selectedProject.id) : -1;
  const previousSelectedProject = selectedProjectIndex > 0 ? visibleRepositories[selectedProjectIndex - 1] : null;
  const nextSelectedProject = selectedProjectIndex >= 0 && selectedProjectIndex < visibleRepositories.length - 1 ? visibleRepositories[selectedProjectIndex + 1] : null;
  const featuredRepositories = useMemo(() => repositories.filter((repository) => repository.featured || repository.relevance >= 80).sort((first, second) => second.relevance - first.relevance).slice(0, 4), []);
  const hasMoreRepositories = visibleRepositories.length > visibleProjectLimit;
  const projectPageSize = 4;

  useEffect(() => {
    setVisibleProjectLimit(projectPageSize);
  }, [activeTechnology, activeCategory, activeTag, sortMode, normalizedProjectSearch, savedProjectSearch, savedProjectSortMode, favoritesOnly, favoriteProjectIds, sharedProjectIds]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const setOrDelete = (key: string, value: string, fallback: string) => {
      if (value && value !== fallback) params.set(key, value);
      else params.delete(key);
    };
    setOrDelete("technology", activeTechnology, "Todos");
    setOrDelete("category", activeCategory, "Todos");
    setOrDelete("tag", activeTag, "Todos");
    setOrDelete("sort", sortMode, "relevance");
    if (projectSearch.trim()) params.set("q", projectSearch.trim());
    else params.delete("q");
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
  }, [activeTechnology, activeCategory, activeTag, sortMode, projectSearch]);

  useEffect(() => {
    const readUrlState = () => {
      setActiveTechnology(getPortfolioUrlFilter("technology", technologyFilters, "Todos"));
      setActiveCategory(getPortfolioUrlFilter("category", categoryFilters, "Todos"));
      setActiveTag(getPortfolioUrlFilter("tag", tagFilters, "Todos") as (typeof tagFilters)[number]);
      setSortMode(getPortfolioUrlFilter("sort", sortOptions.map((option) => option.value), "relevance") as (typeof sortOptions)[number]["value"]);
      setProjectSearch(getPortfolioUrlSearch());
    };
    window.addEventListener("popstate", readUrlState);
    return () => window.removeEventListener("popstate", readUrlState);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("pablo-portfolio-recent-searches", JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    const term = projectSearch.trim();
    if (term.length < 2) return;
    const timer = window.setTimeout(() => {
      setRecentSearches((current) => [term, ...current.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 6));
    }, 650);
    return () => window.clearTimeout(timer);
  }, [projectSearch]);

  useEffect(() => {
    window.localStorage.setItem("pablo-portfolio-gallery-view", galleryView);
  }, [galleryView]);

  useEffect(() => {
    window.localStorage.setItem("pablo-portfolio-font-scale", String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    window.localStorage.setItem("pablo-portfolio-manual-order", JSON.stringify(manualProjectOrder));
  }, [manualProjectOrder]);

  useEffect(() => {
    window.localStorage.setItem("pablo-portfolio-order-profiles", JSON.stringify(manualOrderProfiles));
  }, [manualOrderProfiles]);

  useEffect(() => {
    if (activeOrderProfileId) window.localStorage.setItem("pablo-portfolio-active-order-profile", activeOrderProfileId);
    else window.localStorage.removeItem("pablo-portfolio-active-order-profile");
  }, [activeOrderProfileId]);

  useEffect(() => {
    if (!activeOrderProfileId) return;
    setManualOrderProfiles((profiles) => profiles.map((profile) => profile.id === activeOrderProfileId && JSON.stringify(profile.order) !== JSON.stringify(manualProjectOrder) ? { ...profile, order: manualProjectOrder } : profile));
  }, [activeOrderProfileId, manualProjectOrder]);

  useEffect(() => {
    if (!isProjectFilterTransitioning) setIsGalleryLoading(false);
  }, [isProjectFilterTransitioning]);

  useEffect(() => {
    if (!recentlyActivatedOrderProfileId) return;
    const timer = window.setTimeout(() => setRecentlyActivatedOrderProfileId(null), 1500);
    return () => window.clearTimeout(timer);
  }, [recentlyActivatedOrderProfileId]);

  useEffect(() => {
    const sharedFavorites = new URLSearchParams(window.location.search).get("favorites");
    if (!sharedFavorites) return;
    const validProjectIds = new Set(repositories.map((repository) => repository.id));
    const importedIds = sharedFavorites.split(",").map((id) => id.trim()).filter((id) => validProjectIds.has(id));
    if (!importedIds.length) return;
    setSharedProjectIds(importedIds);
    setFavoritesOnly(true);
    window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.hash}`);
  }, []);


  useEffect(() => {
    try {
      window.localStorage.setItem("pablo-portfolio-favorites", JSON.stringify(favoriteProjectIds));
    } catch {
      // A preferência continua válida durante a sessão mesmo quando o armazenamento está indisponível.
    }
  }, [favoriteProjectIds]);


  useEffect(() => {
    if (formSent) successMessageRef.current?.focus();
  }, [formSent]);

  useEffect(() => {
    const handleAppearanceKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setAppearanceOpen(false);
    };
    window.addEventListener("keydown", handleAppearanceKeyDown);
    return () => window.removeEventListener("keydown", handleAppearanceKeyDown);
  }, []);

  useEffect(() => {
    if (isDesktopViewport) setMenuOpen(false);
  }, [isDesktopViewport]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleMenuKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleMenuKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleMenuKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => () => {
    if (projectFilterTimerRef.current) window.clearTimeout(projectFilterTimerRef.current);
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

  function preloadResumePreview() {
    if (avoidSpeculativePreload) return;
    void loadPortfolioResumePreview();
  }

  async function installPortfolioPwa() {
    const promptEvent = pwaInstallPrompt;
    if (!promptEvent) return;
    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
    } finally {
      setPwaInstallPrompt(null);
      setMenuOpen(false);
    }
  }

  function preloadPgArcade() {
    if (avoidSpeculativePreload) return;
    void loadPortfolioTicTacToe();
  }

  function openPgArcade() {
    preloadPgArcade();
    setPgLabOpen(true);
    window.requestAnimationFrame(() => {
      const target = document.getElementById("pg-lab");
      if (!target) return;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  }

  function togglePgArcade() {
    if (pgLabOpen) {
      setPgLabOpen(false);
      return;
    }
    openPgArcade();
  }

  function closeMenu() {
    setMenuOpen(false);
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

  async function copyCurrentSearchLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setSearchShareStatus("copied");
    } catch {
      setSearchShareStatus("error");
    }
    window.setTimeout(() => setSearchShareStatus("idle"), 2200);
  }

  function openProjectDetails(project: Repository) {
    trackPortfolioEvent("project_opened", { projectId: project.id, surface: "details" });
    setProjectDetailsLoading(true);
    if (window.innerWidth < 768 && !window.localStorage.getItem("pablo-portfolio-project-swipe-hint-seen")) {
      setShowProjectSwipeHint(true);
      window.localStorage.setItem("pablo-portfolio-project-swipe-hint-seen", "true");
      window.setTimeout(() => setShowProjectSwipeHint(false), 2800);
    }
    setSelectedProject(project);
  }
  function navigateSelectedProject(direction: "next" | "previous") {
    const target = direction === "next" ? nextSelectedProject : previousSelectedProject;
    if (!target) return;
    setShowProjectSwipeHint(false);
    setProjectDetailsLoading(true);
    setProjectDetailsTransition(direction);
    setSelectedProject(target);
    window.setTimeout(() => setProjectDetailsTransition(null), 260);
  }
  function handleProjectDetailsTouchStart(event: TouchEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, a, input, summary")) {
      projectDetailsSwipeStartRef.current = null;
      return;
    }
    if (event.touches.length === 1) projectDetailsSwipeStartRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  function handleProjectDetailsTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = projectDetailsSwipeStartRef.current;
    projectDetailsSwipeStartRef.current = null;
    if (!start || event.changedTouches.length !== 1) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (deltaX < 0 && nextSelectedProject) navigateSelectedProject("next");
    if (deltaX > 0 && previousSelectedProject) navigateSelectedProject("previous");
  }
  useEffect(() => {
    if (!selectedProject) {
      setProjectDetailsLoading(false);
        return;
    }
    const timer = window.setTimeout(() => setProjectDetailsLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, [selectedProject]);
  useEffect(() => {
    const visualViewport = window.visualViewport;
    if (!visualViewport) return;
    const updateKeyboardState = () => setIsMobileKeyboardOpen(window.innerWidth < 768 && visualViewport.height < window.innerHeight * 0.78);
    updateKeyboardState();
    visualViewport.addEventListener("resize", updateKeyboardState, { passive: true });
    return () => visualViewport.removeEventListener("resize", updateKeyboardState);
  }, []);

  function clearAllProjectFilters() {
    setActiveTechnology("Todos");
    setActiveCategory("Todos");
    setActiveTag("Todos");
    setProjectSearch("");
    setSortMode("relevance");
    setFavoritesOnly(false);
    setActiveSearchSuggestionIndex(-1);
    setIsProjectSearchFocused(false);
    const params = new URLSearchParams(window.location.search);
    ["technology", "category", "tag", "sort", "q"].forEach((key) => params.delete(key));
    const nextQuery = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}${window.location.hash}`);
  }

  useEffect(() => {
    if (!selectedProject) return;
    const handleProjectDetailsKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowRight" && nextSelectedProject) {
        event.preventDefault();
        navigateSelectedProject("next");
      } else if (event.key === "ArrowLeft" && previousSelectedProject) {
        event.preventDefault();
        navigateSelectedProject("previous");
      }
    };
    window.addEventListener("keydown", handleProjectDetailsKeyDown);
    return () => window.removeEventListener("keydown", handleProjectDetailsKeyDown);
  }, [selectedProject, nextSelectedProject, previousSelectedProject]);

  function removeRecentSearch(term: string) {
    const next = recentSearches.filter((item) => item.toLowerCase() !== term.toLowerCase());
    setRecentSearches(next);
    window.localStorage.setItem("pablo-portfolio-recent-searches", JSON.stringify(next));
  }

  function clearRecentSearches() {
    setRecentSearches([]);
    window.localStorage.setItem("pablo-portfolio-recent-searches", "[]");
  }

  function saveSharedFavorites() {
    if (!sharedProjectIds?.length) return;
    setFavoriteProjectIds((current) => Array.from(new Set([...current, ...sharedProjectIds])));
    setSharedProjectIds(null);
    setFavoritesOnly(true);
  }

  function dismissSharedFavorites() {
    setSharedProjectIds(null);
    setFavoritesOnly(false);
  }

  function toggleFavorite(projectId: string, event: React.MouseEvent | React.KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
    const isAlreadySaved = favoriteProjectIdSet.has(projectId);
    const projectName = repositories.find((repository) => repository.id === projectId)?.name ?? "Projeto";
    setFavoriteProjectIds((current) => current.includes(projectId) ? current.filter((id) => id !== projectId) : [...current, projectId]);
    if (isAlreadySaved) {
      toast("Projeto removido", { description: `${projectName} foi removido dos projetos salvos.` });
    } else {
      toast.success("Projeto salvo", { description: `${projectName} está disponível em projetos salvos.` });
    }
  }

  function getSelectedProjectUrl() {
    if (!selectedProject) return "";
    return buildProjectShareUrl(window.location.href, selectedProject.id);
  }
  async function shareSelectedProject() {
    const projectUrl = getSelectedProjectUrl();
    if (!projectUrl) return;
    try {
      await navigator.clipboard.writeText(projectUrl);
      if (selectedProject) trackPortfolioEvent("share_project", { projectId: selectedProject.id, channel: "copy_link" });
      setProjectShareStatus("copied");
    } catch {
      setProjectShareStatus("error");
    }
    window.setTimeout(() => setProjectShareStatus("idle"), 2400);
  }
  async function copySelectedProjectLink() {
    const projectUrl = getSelectedProjectUrl();
    if (!projectUrl) return;
    try {
      await navigator.clipboard.writeText(projectUrl);
      if (selectedProject) trackPortfolioEvent("share_project", { projectId: selectedProject.id, channel: "copy_link" });
      setProjectCopyStatus("copied");
    } catch {
      setProjectCopyStatus("error");
    }
    window.setTimeout(() => setProjectCopyStatus("idle"), 2400);
  }

  async function shareFavorites() {
    if (!favoriteProjectIds.length) return;
    const shareUrl = buildFavoritesShareUrl(window.location.href, favoriteProjectIds);
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "Projetos salvos — Pablo Guilherme",
          text: "Confira esta seleção de projetos do portfólio de Pablo Guilherme.",
          url: shareUrl,
        });
        trackPortfolioEvent("share_project", { channel: "native" });
        setShareStatus("shared");
        window.setTimeout(() => setShareStatus("idle"), 2600);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      trackPortfolioEvent("share_project", { channel: "copy_link" });
      setShareStatus("copied");
    } catch {
      setShareStatus("error");
    }
    window.setTimeout(() => setShareStatus("idle"), 2600);
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

  async function exportFavorites(format: FavoriteExportFormat) {
    const favoriteProjects = repositories.filter((repository) => favoriteProjectIdSet.has(repository.id));
    if (!favoriteProjects.length) return;
    if (favoriteExportTimerRef.current) window.clearTimeout(favoriteExportTimerRef.current);
    setFavoriteExportStatus(format === "pdf" ? "pdf-loading" : format);
    if (format === "pdf") {
      await new Promise<void>((resolve) => window.requestAnimationFrame(() => resolve()));
    }
    try {
      await exportFavoriteProjects(format, favoriteProjects, getRepositoryCategories);
    } catch {
      setFavoriteExportStatus("error");
      favoriteExportTimerRef.current = window.setTimeout(() => setFavoriteExportStatus("idle"), 4000);
      return;
    }
    if (format === "pdf") setFavoriteExportStatus("pdf");
    favoriteExportTimerRef.current = window.setTimeout(() => setFavoriteExportStatus("idle"), 4000);
  }

  function selectCategory(category: string) {
    if (category === activeCategory) return;
    if (projectFilterTimerRef.current) window.clearTimeout(projectFilterTimerRef.current);
    setActiveCategory(category);
    setIsProjectFilterTransitioning(true);
    projectFilterTimerRef.current = window.setTimeout(() => { setIsProjectFilterTransitioning(false); setIsGalleryLoading(false); }, 170);
  }

  function selectSort(mode: (typeof sortOptions)[number]["value"]) {
    if (mode === sortMode) return;
    if (projectFilterTimerRef.current) window.clearTimeout(projectFilterTimerRef.current);
    setSortMode(mode);
    setIsProjectFilterTransitioning(true);
    projectFilterTimerRef.current = window.setTimeout(() => { setIsProjectFilterTransitioning(false); setIsGalleryLoading(false); }, 170);
  }

  function clearSavedProjectControls() {
    setSavedProjectSearch("");
    setSavedProjectSortMode("relevance");
    setSavedProjectControlStatus("Busca e ordenação dos projetos salvos foram limpas.");
  }

  function navigateSavedAgendaContext(target: "saved" | "agenda") {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (contextTransitionTimerRef.current) window.clearTimeout(contextTransitionTimerRef.current);
    if (target === "saved") setFavoritesOnly(true);
    setContextTransitionTarget(target);
    setContextNavigationStatus(target === "saved" ? "Projetos salvos em foco." : "Agenda de disponibilidade em foco.");

    window.requestAnimationFrame(() => {
      const targetElement = target === "saved"
        ? document.querySelector<HTMLElement>("[data-saved-projects-controls='true']")
        : availabilitySectionRef.current;
      if (!targetElement) return;
      targetElement.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      targetElement.focus({ preventScroll: true });
      contextTransitionTimerRef.current = window.setTimeout(() => setContextTransitionTarget(null), reduceMotion ? 0 : 180);
    });
  }

  function selectTag(tag: (typeof tagFilters)[number]) {
    if (tag === activeTag) return;
    if (projectFilterTimerRef.current) window.clearTimeout(projectFilterTimerRef.current);
    setActiveTag(tag);
    setIsProjectFilterTransitioning(true);
    projectFilterTimerRef.current = window.setTimeout(() => { setIsProjectFilterTransitioning(false); setIsGalleryLoading(false); }, 170);
  }
  function selectTechnology(technology: string) {
    if (technology === activeTechnology) return;
    if (projectFilterTimerRef.current) window.clearTimeout(projectFilterTimerRef.current);
    setActiveTechnology(technology);
    setIsProjectFilterTransitioning(true);
    projectFilterTimerRef.current = window.setTimeout(() => { setIsProjectFilterTransitioning(false); setIsGalleryLoading(false); }, 170);
  }

  function createOrderProfile() {
    const name = profileNameDraft.trim();
    if (!name) return;
    const profile: ManualOrderProfile = { id: `profile-${Date.now()}`, name, order: manualProjectOrder };
    setManualOrderProfiles((profiles) => [...profiles, profile]);
    setActiveOrderProfileId(profile.id);
    setRecentlyActivatedOrderProfileId(profile.id);
    setProfileNameDraft("");
    setManualOrderStatus(`Perfil ${name} salvo e ativado.`);
  }

  function selectOrderProfile(profile: ManualOrderProfile) {
    setManualProjectOrder(normalizeManualOrder(profile.order, repositories.map((repository) => repository.id)));
    setActiveOrderProfileId(profile.id);
    setRecentlyActivatedOrderProfileId(profile.id);
    setProfileNameDraft(profile.preset ? "" : profile.name);
    setSortMode("manual");
    setManualOrderStatus(`Perfil ${profile.name} ativado.`);
  }

  function toggleOrderProfilePreview(profileId: string) {
    setPreviewOrderProfileId((currentId) => currentId === profileId ? null : profileId);
  }

  function duplicateOrderProfile(profile: ManualOrderProfile) {
    const duplicatedProfile: ManualOrderProfile = { id: `profile-${Date.now()}`, name: `${profile.name} — cópia`, order: [...profile.order] };
    setManualOrderProfiles((profiles) => [...profiles, duplicatedProfile]);
    setActiveOrderProfileId(duplicatedProfile.id);
    setRecentlyActivatedOrderProfileId(duplicatedProfile.id);
    setProfileNameDraft(duplicatedProfile.name);
    setManualProjectOrder(normalizeManualOrder(duplicatedProfile.order, repositories.map((repository) => repository.id)));
    setSortMode("manual");
    setManualOrderStatus(`Perfil ${profile.name} duplicado como ${duplicatedProfile.name}.`);
  }

  function renameActiveOrderProfile() {
    const name = profileNameDraft.trim();
    if (!activeOrderProfileId || activeOrderProfile?.preset || !name) return;
    setManualOrderProfiles((profiles) => profiles.map((profile) => profile.id === activeOrderProfileId ? { ...profile, name } : profile));
    setProfileNameDraft("");
    setManualOrderStatus(`Perfil renomeado para ${name}.`);
  }

  function deleteActiveOrderProfile() {
    if (!activeOrderProfileId || activeOrderProfile?.preset) return;
    const deletedProfile = manualOrderProfiles.find((profile) => profile.id === activeOrderProfileId);
    setManualOrderProfiles((profiles) => profiles.filter((profile) => profile.id !== activeOrderProfileId));
    setActiveOrderProfileId(null);
    setProfileNameDraft("");
    setManualOrderStatus(deletedProfile ? `Perfil ${deletedProfile.name} excluído.` : "Perfil excluído.");
  }

  function moveProject(projectId: string, direction: -1 | 1) {
    setManualProjectOrder((currentOrder) => {
      return moveProjectInOrder(currentOrder, projectId, direction);
    });
    if (sortMode !== "manual") setSortMode("manual");
    const movedRepository = repositories.find((repository) => repository.id === projectId);
    setManualOrderStatus(movedRepository ? `${movedRepository.name} movido ${direction < 0 ? "para cima" : "para baixo"}.` : "Ordem manual atualizada.");
  }

  function startProjectDrag(projectId: string) {
    setDraggedProjectId(projectId);
    if (sortMode !== "manual") setSortMode("manual");
  }

  function dropProject(projectId: string) {
    if (!draggedProjectId || draggedProjectId === projectId) {
      setDraggedProjectId(null);
      return;
    }
    setManualProjectOrder((currentOrder) => {
      return dropProjectInOrder(currentOrder, draggedProjectId, projectId);
    });
    setDraggedProjectId(null);
    const movedRepository = repositories.find((repository) => repository.id === draggedProjectId);
    const targetRepository = repositories.find((repository) => repository.id === projectId);
    setManualOrderStatus(movedRepository && targetRepository ? `${movedRepository.name} movido antes de ${targetRepository.name}.` : "Ordem manual atualizada.");
  }

  function loadMoreProjects() {
    if (!hasMoreRepositories || isGalleryLoading) return;
    setIsGalleryLoading(true);
    if (galleryLoadingTimerRef.current) window.clearTimeout(galleryLoadingTimerRef.current);
    galleryLoadingTimerRef.current = window.setTimeout(() => {
      setVisibleProjectLimit((current) => Math.min(current + projectPageSize, visibleRepositories.length));
      setIsGalleryLoading(false);
    }, 220);
  }

  function applyProjectSearchSuggestion(suggestion: SearchSuggestion) {
    setProjectSearch(suggestion.value);
    setActiveSearchSuggestionIndex(-1);
    setIsProjectSearchFocused(false);
    window.requestAnimationFrame(() => projectSearchInputRef.current?.focus());
  }

  function clearProjectSearch() {
    setProjectSearch("");
    setActiveSearchSuggestionIndex(-1);
    setIsProjectSearchFocused(false);
    window.requestAnimationFrame(() => projectSearchInputRef.current?.focus());
  }

  function handleProjectSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      if (projectSearch) {
        event.preventDefault();
        clearProjectSearch();
      } else {
        setActiveSearchSuggestionIndex(-1);
        setIsProjectSearchFocused(false);
      }
      return;
    }
    if (!visibleSearchSuggestions.length) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSearchSuggestionIndex((current) => (current + 1) % visibleSearchSuggestions.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSearchSuggestionIndex((current) => current <= 0 ? visibleSearchSuggestions.length - 1 : current - 1);
    }
    if (event.key === "Enter" && activeSearchSuggestionIndex >= 0) {
      event.preventDefault();
      applyProjectSearchSuggestion(visibleSearchSuggestions[activeSearchSuggestionIndex]);
    }
  }

  function shareRepositoryToWhatsApp(repository: Repository, event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const projectUrl = buildProjectShareUrl(window.location.href, repository.id);
    trackPortfolioEvent("share_project", { channel: "whatsapp", projectId: repository.id });
    const shareMessage = `Quero te mostrar ${repository.name} do portfólio de Pablo Guilherme. Veja os detalhes: ${projectUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, "_blank", "noopener,noreferrer");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
      { onSuccess: () => form.reset() },
    );
  }

  const openResumePreview = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    preloadResumePreview();
    resumePreviewReturnFocusRef.current = event.currentTarget;
    setResumePreviewError(false);
    setResumePreviewProgress(8);
    setResumePreviewLoading(true);
    setResumePreviewOpen(true);
  };

  const closeResumePreview = () => {
    setResumePreviewOpen(false);
    setMenuOpen(false);
    window.setTimeout(() => {
      const returnTarget = resumePreviewReturnFocusRef.current;
      if (returnTarget?.isConnected && returnTarget.offsetParent !== null) returnTarget.focus();
      else (Array.from(document.querySelectorAll<HTMLElement>('[data-resume-header="true"]')).find((element) => element.offsetParent !== null) ?? menuButtonRef.current)?.focus();
    }, 0);
  };

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
            {resumeAvailable && <a href={resumeUrl} onPointerEnter={preloadResumePreview} onFocus={preloadResumePreview} onTouchStart={preloadResumePreview} onClick={openResumePreview} data-resume-header="true" data-resume-preview-preload="intent" aria-haspopup="dialog" aria-label="Visualizar portfólio atualizado em PDF" title="Visualizar portfólio em PDF" className="resume-header-cta inline-flex items-center gap-2 border border-[#67e8f9] bg-[#0b2746] px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-[#d9fbff] transition-all hover:bg-[#123b67] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
              <Download className="h-3.5 w-3.5" aria-hidden="true" /> <span>portfólio PDF</span>
            </a>}
            <a href="#contato" className="inline-flex items-center gap-2 border border-[#67e8f9] bg-[#38bdf8] px-4 py-2 text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-all hover:bg-[#a5f3fc] hover:shadow-[0_0_28px_rgba(56,189,248,0.36)]">
              contato <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 md:hidden">
            <button
              ref={menuButtonRef}
              type="button"
              data-mobile-menu-toggle="true"
              data-mobile-scroll-context="true"
              onClick={() => setMenuOpen((open) => !open)}
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
          <nav id="mobile-navigation" className="max-h-[calc(100svh-76px)] overflow-y-auto overscroll-contain border-t border-white/[0.07] bg-[#090d16]/98 px-4 py-4 shadow-[0_20px_48px_rgba(0,0,0,0.42)] backdrop-blur-md md:hidden" aria-label="Navegação móvel">
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
              {[
                ["01 / início", "#inicio", "inicio"],
                ["02 / projetos", "#projetos", "projetos"],
                ["03 / serviços", "#servicos", "servicos"],
                ["04 / contato", "#contato", "contato"],
              ].map(([label, href, id]) => (
                <a key={label} href={href} onClick={closeMenu} aria-current={activeSection === id ? "location" : undefined} className={`flex min-h-12 items-center border-b border-white/[0.07] px-2 py-3 font-mono text-xs uppercase tracking-[0.12em] transition-colors hover:bg-[#0b2746] hover:text-white focus-visible:bg-[#0b2746] focus-visible:text-white ${activeSection === id ? "bg-[#0b2746] text-[#67e8f9]" : "text-[#b7cdf1]"}`}>
                  {label}
                </a>
              ))}
              <a
                data-mobile-menu-primary="true"
                href={mobilePrimaryAction.href}
                onClick={closeMenu}
                className="mt-3 flex min-h-12 items-center justify-between rounded-[10px] bg-[#38bdf8] px-3 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#02111f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
              >
                <span className="inline-flex items-center gap-2"><ClipboardCheck className="h-4 w-4" aria-hidden="true" />{mobilePrimaryAction.ariaLabel}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <div data-mobile-shortcuts="true" className="mt-2 grid grid-cols-2 gap-2" aria-label="Atalhos rápidos">
                <a
                  data-mobile-shortcut-contextual="true"
                  href={mobileSecondaryShortcut.href}
                  onClick={() => {
                    if (mobileExperienceRoute === "explorer") openPgArcade();
                    closeMenu();
                  }}
                  className="mobile-shortcut-card flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-[#071326] px-2 py-2 text-center font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#d7e9f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
                >
                  <MobileSecondaryIcon className="h-4 w-4 text-[#67e8f9]" aria-hidden="true" />
                  <span>{mobileSecondaryShortcut.label}</span>
                </a>
                <a href={"https:" + "//pabloguilherme01.github.io/observatorio/"} target="_blank" rel="noreferrer" onClick={closeMenu} className="mobile-shortcut-card flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-[10px] border border-[#67e8f9]/30 bg-[#0b2746] px-2 py-2 text-center font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#d9fbff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Eye className="h-4 w-4 text-[#67e8f9]" aria-hidden="true" /><span>observatório</span></a>
              </div>
              <button
                type="button"
                data-mobile-share-action="true"
                onClick={() => void sharePortfolio()}
                className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-white/10 bg-[#071326] px-3 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#d9fbff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
              >
                <Share2 className="h-4 w-4 text-[#67e8f9]" aria-hidden="true" />
                {portfolioShareStatus === "shared"
                  ? "portfólio compartilhado"
                  : portfolioShareStatus === "copied"
                    ? "link copiado"
                    : portfolioShareStatus === "error"
                      ? "tentar compartilhar novamente"
                      : "compartilhar portfólio"}
              </button>
              {pwaInstallPrompt && (
                <button
                  type="button"
                  data-mobile-install-action="true"
                  onClick={() => void installPortfolioPwa()}
                  className="mt-2 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] border border-[#67e8f9]/35 bg-[#071827] px-3 py-3 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#d9fbff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
                >
                  <Download className="h-4 w-4 text-[#67e8f9]" aria-hidden="true" />
                  instalar portfólio
                </button>
              )}
              {resumeAvailable && <button type="button" onPointerEnter={preloadResumePreview} onFocus={preloadResumePreview} onTouchStart={preloadResumePreview} onClick={openResumePreview} data-resume-header="true" data-resume-preview-preload="intent" aria-haspopup="dialog" aria-label="Visualizar portfólio atualizado em PDF" className="resume-header-cta mt-3 inline-flex min-h-12 items-center justify-center gap-3 border border-[#67e8f9] bg-[#0b2746] px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#d9fbff] transition-colors hover:bg-[#123b67] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Download className="h-4 w-4" aria-hidden="true" /> visualizar portfólio PDF</button>}
            </div>
          </nav>
        )}
        {appearanceOpen && <div role="dialog" aria-modal="false" aria-labelledby="appearance-title" className="appearance-panel fixed right-4 top-[88px] z-[60] w-[min(92vw,340px)] border border-[#67e8f9]/30 bg-[#071326] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.42)] sm:right-8 lg:right-12">
          <div className="flex items-start justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#67e8f9]">configurações</p><h2 id="appearance-title" className="mt-2 font-display text-2xl tracking-[-0.04em] text-white">Aparência</h2></div><button type="button" onClick={() => setAppearanceOpen(false)} aria-label="Fechar configurações de aparência" className="grid h-8 w-8 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><X className="h-4 w-4" aria-hidden="true" /></button></div>
          <p className="mt-3 font-body text-xs leading-5 text-[#9fb2ce]">Escolha como o arquivo deve aparecer neste dispositivo.</p>
          <div className="mt-5 grid gap-2" role="group" aria-label="Preferência de tema">
            {([['light', 'Claro', Sun], ['dark', 'Escuro', Moon], ['system', 'Preferência do sistema', Monitor] ] as const).map(([value, label, Icon]) => <button key={value} type="button" onClick={() => setPreference(value)} aria-pressed={preference === value} className={`flex items-center gap-3 border px-3 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${preference === value ? "border-[#67e8f9] bg-[#0b2746] text-[#d9fbff]" : "border-white/10 text-[#9fb2ce] hover:border-[#67e8f9]/60 hover:text-[#d9fbff]"}`}><Icon className="h-4 w-4" aria-hidden="true" /><span className="flex-1">{label}</span>{preference === value && <span className="text-[8px] text-[#67e8f9]">ativo</span>}</button>)}
          </div>
          <div className="mt-5 border-t border-white/10 pt-4" role="group" aria-label="Tamanho da fonte"><div className="flex items-center justify-between gap-3"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">tamanho do texto</p><span className="font-mono text-[9px] text-[#9fb2ce]">{Math.round(fontScale * 100)}%</span></div><div className="mt-2 grid grid-cols-3 gap-2"><button type="button" onClick={() => setFontScale((value) => Math.max(0.92, Number((value - 0.04).toFixed(2))))} disabled={fontScale <= 0.92} aria-label="Diminuir tamanho da fonte" className="border border-white/10 px-2 py-3 font-mono text-xs text-[#d9fbff] transition-colors hover:border-[#67e8f9] disabled:opacity-40">A−</button><button type="button" onClick={() => setFontScale(1)} aria-label="Restaurar tamanho padrão da fonte" className="border border-white/10 px-2 py-3 font-mono text-xs text-[#d9fbff] transition-colors hover:border-[#67e8f9]">100%</button><button type="button" onClick={() => setFontScale((value) => Math.min(1.16, Number((value + 0.04).toFixed(2))))} disabled={fontScale >= 1.16} aria-label="Aumentar tamanho da fonte" className="border border-white/10 px-2 py-3 font-mono text-xs text-[#d9fbff] transition-colors hover:border-[#67e8f9] disabled:opacity-40">A+</button></div></div>
          <div className="mt-5 border-t border-white/10 pt-4" role="group" aria-label="Visualização dos projetos"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">visualização dos projetos</p><div className="mt-2 grid grid-cols-2 gap-2">{([['grid', 'Grade', LayoutGrid], ['list', 'Lista', List]] as const).map(([value, label, Icon]) => <button key={value} type="button" onClick={() => setGalleryView(value)} aria-pressed={galleryView === value} className={`flex items-center justify-center gap-2 border px-2 py-3 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${galleryView === value ? "border-[#67e8f9] bg-[#0b2746] text-[#d9fbff]" : "border-white/10 text-[#9fb2ce] hover:border-[#67e8f9]/60 hover:text-[#d9fbff]"}`}><Icon className="h-4 w-4" aria-hidden="true" />{label}</button>)}</div></div>
          <div className="mt-5 border-t border-white/10 pt-4" role="group" aria-label="Perfis de ordenação"><div className="flex items-center justify-between gap-3"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">perfis de ordem</p>{activeOrderProfileId && <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#67e8f9]">ativo</span>}</div><p className="mt-2 font-body text-xs leading-5 text-[#9fb2ce]">Salve uma sequência para alternar entre diferentes contextos técnicos.</p><div className="mt-3 space-y-2">{manualOrderProfiles.length > 0 ? manualOrderProfiles.map((profile) => <div key={profile.id} className="flex items-center gap-2"><button type="button" onClick={() => selectOrderProfile(profile)} aria-pressed={activeOrderProfileId === profile.id} data-profile-recently-activated={recentlyActivatedOrderProfileId === profile.id ? "true" : undefined} className={`min-w-0 flex-1 truncate border px-3 py-2 text-left font-mono text-[9px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${recentlyActivatedOrderProfileId === profile.id ? "profile-activation-pulse border-[#fbbf24] bg-[#17304d] text-[#fff7cc] shadow-[0_0_24px_rgba(251,191,36,0.3)]" : activeOrderProfileId === profile.id ? "border-[#67e8f9] bg-[#0b2746] text-[#d9fbff]" : "border-white/10 text-[#9fb2ce] hover:border-[#67e8f9]/60 hover:text-[#d9fbff]"}`}><span>{profile.name}</span>{profile.preset && <span className="ml-2 text-[8px] text-[#67e8f9]">base</span>}</button><button type="button" onClick={() => toggleOrderProfilePreview(profile.id)} aria-expanded={previewOrderProfileId === profile.id} aria-controls={`order-profile-preview-${profile.id}`} aria-label={`${previewOrderProfileId === profile.id ? "Ocultar" : "Ver"} prévia do perfil ${profile.name}`} title="Ver prévia" className={`grid h-9 w-9 shrink-0 place-items-center border text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${previewOrderProfileId === profile.id ? "border-[#67e8f9] bg-[#0b2746]" : "border-[#67e8f9]/30"}`}><Eye className="h-3.5 w-3.5" aria-hidden="true" /></button><button type="button" onClick={() => duplicateOrderProfile(profile)} aria-label={`Duplicar perfil ${profile.name}`} title="Duplicar perfil" className="grid h-9 w-9 shrink-0 place-items-center border border-[#67e8f9]/30 text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Copy className="h-3.5 w-3.5" aria-hidden="true" /></button>{activeOrderProfileId === profile.id && !profile.preset && <button type="button" onClick={deleteActiveOrderProfile} aria-label={`Excluir perfil ${profile.name}`} title="Excluir perfil" className="grid h-9 w-9 shrink-0 place-items-center border border-rose-300/30 text-rose-200 transition-colors hover:border-rose-300 hover:text-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Trash2 className="h-3.5 w-3.5" aria-hidden="true" /></button>}<div id={`order-profile-preview-${profile.id}`} role="region" tabIndex={previewOrderProfileId === profile.id ? 0 : -1} aria-label={`Prévia do perfil ${profile.name}. Clique para ativar esta ordem.`} aria-hidden={previewOrderProfileId !== profile.id} data-preview-open={previewOrderProfileId === profile.id} onClick={() => { if (previewOrderProfileId === profile.id && activeOrderProfileId !== profile.id) selectOrderProfile(profile); }} onKeyDown={(event) => { if (previewOrderProfileId === profile.id && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); if (activeOrderProfileId !== profile.id) selectOrderProfile(profile); } }} className={`col-span-full cursor-pointer overflow-hidden border border-[#67e8f9]/20 bg-[#07101e]/70 p-2 transition-[max-height,opacity,transform] duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none ${previewOrderProfileId === profile.id ? "max-h-[500px] translate-y-0 opacity-100" : "pointer-events-none max-h-0 -translate-y-1 border-transparent p-0 opacity-0"}`}><p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#67e8f9]">primeiros projetos nesta ordem · clique para ativar</p><div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">{profile.order.slice(0, 5).map((projectId: string, previewIndex: number) => { const project = repositories.find((repository) => repository.id === projectId); return project ? <div key={project.id} className={`group relative min-w-0 border border-white/10 bg-[#0a1422] ${previewIndex >= 3 ? "hidden sm:block" : ""} ${previewOrderProfileId === profile.id ? "preview-stagger-item" : ""}`} style={{ "--preview-delay": `${previewIndex * 45}ms` } as React.CSSProperties} title={`${previewIndex + 1}. ${project.name}`}><div className="aspect-[4/3] overflow-hidden bg-[#0d1b2d]">{project.cover ? <img src={project.cover} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-80" /> : <div className="grid h-full place-items-center font-mono text-[8px] text-[#7189ae]">sem capa</div>}</div><div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 bg-[#030b1e]/92 px-2 py-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"><p className="truncate font-mono text-[8px] uppercase tracking-[0.08em] text-[#fef3c7]">{project.name}</p></div><p className="truncate px-2 py-2 font-mono text-[8px] uppercase tracking-[0.08em] text-[#c8f7ff]">{project.name}</p></div> : null; })}</div></div></div>) : <p className="border border-dashed border-white/10 px-3 py-3 font-mono text-[9px] uppercase tracking-[0.1em] text-[#7189ae]">nenhum perfil salvo</p>}</div><div className="mt-3 flex gap-2"><input value={profileNameDraft} onChange={(event) => setProfileNameDraft(event.target.value)} placeholder="ex.: tecnologia" aria-label="Nome do perfil de ordenação" className="min-w-0 flex-1 border border-white/10 bg-transparent px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#d9fbff] outline-none placeholder:text-[#7189ae] focus:border-[#67e8f9] focus:ring-2 focus:ring-[#a5f3fc]" /><button type="button" onClick={createOrderProfile} disabled={!profileNameDraft.trim()} aria-label="Salvar novo perfil de ordenação" title="Salvar novo perfil" className="grid h-9 w-9 shrink-0 place-items-center border border-[#67e8f9]/40 text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Save className="h-3.5 w-3.5" aria-hidden="true" /></button>{activeOrderProfileId && !activeOrderProfile?.preset && <button type="button" onClick={renameActiveOrderProfile} disabled={!profileNameDraft.trim()} aria-label="Renomear perfil ativo" title="Renomear perfil ativo" className="grid h-9 w-9 shrink-0 place-items-center border border-[#67e8f9]/30 text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /></button>}</div></div>
          <p className="mt-4 border-t border-white/10 pt-4 font-mono text-[9px] uppercase tracking-[0.11em] text-[#7189ae]">tema aplicado agora: {theme === "dark" ? "escuro" : "claro"}</p>
        </div>}
      </header>
      <div className="scroll-progress-track pointer-events-none fixed inset-x-0 top-[75px] z-40 h-0.5 bg-[#67e8f9]/10" aria-hidden="true"><span className="scroll-progress-bar block h-full origin-left bg-[#67e8f9] shadow-[0_0_12px_rgba(103,232,249,0.8)]" style={{ transform: `scaleX(${scrollProgress / 100})` }} /></div>

      <main id="conteudo-principal" className="relative" style={{ fontSize: `${fontScale}rem` }} tabIndex={-1}>
        <div className="archive-spine pointer-events-none absolute bottom-0 top-0 z-20" aria-hidden="true" />
        <PortfolioHero
          heroAvailable={heroAvailable && !avoidSpeculativePreload}
          markUrl={markUrl}
          portraitUrl={portraitUrl}
          portraitResponsive={portraitResponsive}
          heroCtaRef={heroCtaRef}
        />

        <PortfolioTrustBar />

        <PortfolioExperienceHub />

        <ProjectDiagnostic />

        <PortfolioAbout
          resumeAvailable={resumeAvailable}
          resumeUrl={resumeUrl}
          portraitUrl={portraitUrl}
          portraitResponsive={portraitResponsive}
        />

        <PortfolioProfessionalSnapshot />

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
              <PortfolioWebResume embedded resumeAvailable={resumeAvailable} resumeUrl={resumeUrl} />
            </Suspense>
          ) : (
            <section data-web-resume-placeholder="true" className="archive-chapter border-t border-white/[0.07] bg-[#f5fbff] px-5 py-10 text-[#365166]" aria-label="Currículo web">
              <div className="mx-auto max-w-[1120px] font-mono text-[9px] uppercase tracking-[0.12em] text-[#0e7490]">currículo web disponível ao aproximar</div>
            </section>
          )}
        </div>

        <PortfolioSkills isDesktopViewport={isDesktopViewport} markUrl={markUrl} />

        <PortfolioServices markUrl={markUrl} />

        <PortfolioProcess />

        <section id="projetos" ref={projectsSectionRef} className="archive-chapter relative border-y border-white/[0.07] bg-[#0a0f18]">
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

        <section id="pg-lab" className="archive-chapter scroll-mt-24 border-t border-white/[0.07] bg-[#040a13] px-4 py-9 min-[360px]:px-5 sm:px-8 sm:py-10 lg:px-12" aria-labelledby="pg-lab-title">
          <div className="mx-auto max-w-[1440px] border border-[#67e8f9]/20 bg-[#06172f]/55 p-4 min-[360px]:p-5 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-7">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">PG Arcade · opcional</p>
              <h2 id="pg-lab-title" className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">Quer testar uma interação que responde?</h2>
              <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#a9bfd8]">Uma prova técnica opcional de lógica, estado, persistência e acessibilidade. O jogo só é carregado quando você abre o Arcade.</p>
            </div>
            <button
              type="button"
              data-arcade-open-control="true"
              data-arcade-preload="intent"
              onPointerEnter={preloadPgArcade}
              onFocus={preloadPgArcade}
              onTouchStart={preloadPgArcade}
              onClick={togglePgArcade}
              aria-expanded={pgLabOpen}
              aria-controls="pg-lab-game"
              className="mt-5 inline-flex min-h-12 w-full shrink-0 items-center justify-center border border-[#67e8f9]/45 px-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff] transition-colors hover:border-[#a5f3fc] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:mt-0 sm:w-auto"
            >{pgLabOpen ? "fechar PG Arcade" : "jogar no PG Arcade"}</button>
          </div>
          <div id="pg-lab-game" hidden={!pgLabOpen} className="-mx-4 max-w-[1440px] min-[360px]:-mx-5 sm:mx-auto">
            {pgLabOpen && (
              <Suspense fallback={<div data-arcade-loading="true" role="status" aria-live="polite" className="mx-4 my-5 min-h-24 rounded-[14px] border border-[#67e8f9]/20 bg-[#06172f]/70 p-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc] min-[360px]:mx-5 sm:mx-0">carregando PG Arcade…</div>}>
                <PortfolioTicTacToe />
              </Suspense>
            )}
          </div>
        </section>
      </main>

      <PortfolioFooter markUrl={markUrl} telegramUrl={telegramUrl} whatsAppUrl={whatsAppUrl} onWhatsAppClick={() => trackPortfolioEvent("whatsapp_click", { source: "footer" })} emailCopyStatus={emailCopyStatus} copyContactEmail={copyContactEmail} />

      <button type="button" onClick={scrollToTop} aria-label="Voltar ao topo da página" title="Voltar ao topo" aria-hidden={!showBackToTop} tabIndex={showBackToTop ? 0 : -1} className={`fixed bottom-20 right-4 z-[55] grid h-11 w-11 place-items-center border border-[#67e8f9]/45 bg-[#071b39]/95 text-[#bdf7ff] shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-[opacity,transform,background-color,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0b2b57] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none sm:bottom-5 sm:right-[360px] ${showBackToTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}><ArrowUp className="h-4 w-4" aria-hidden="true" /></button>
      <nav
        aria-label="Ações rápidas"
        aria-hidden={isDockHidden ? "true" : undefined}
        inert={isDockHidden ? true : undefined}
        data-mobile-contact-bar="true"
        data-mobile-dock="true"
        data-mobile-dock-hidden={isDockHidden ? "true" : "false"}
        data-mobile-dock-compact={isMobileDockCompact ? "true" : "false"}
        className={`contact-float fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 right-3 z-[60] grid grid-cols-[minmax(0,1fr)_3.2rem_3.5rem] items-stretch gap-2 overflow-hidden border border-[#67e8f9]/35 bg-[#07101e]/97 p-1.5 shadow-[0_14px_34px_rgba(0,0,0,0.38)] backdrop-blur-sm transition-[opacity,transform] duration-200 sm:bottom-5 sm:left-auto sm:right-5 sm:flex sm:bg-[#07101e]/95 sm:backdrop-blur-md ${shouldHideContactFloat ? "pointer-events-none translate-y-2 opacity-0" : isHeroCtaVisible ? "pointer-events-none translate-y-2 opacity-0 lg:pointer-events-auto lg:translate-y-0 lg:opacity-100" : "translate-y-0 opacity-100"}`}>
        <span data-mobile-dock-progress="true" aria-hidden="true" className="pointer-events-none absolute inset-x-2 top-0 block h-px overflow-hidden rounded-full bg-white/10 sm:hidden">
          <span className="block h-full origin-left bg-[#67e8f9] transition-transform duration-150 motion-reduce:transition-none" style={{ transform: `scaleX(${scrollProgress / 100})` }} />
        </span>
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

      {resumePreviewOpen && (
        <Suspense fallback={<div data-resume-preview-loading-shell="true" role="status" aria-live="polite" className="fixed inset-0 z-[70] grid place-items-center bg-[#02050a]/90 p-6 font-mono text-[10px] uppercase tracking-[0.14em] text-[#c8f7ff]">carregando leitor do portfólio…</div>}>
          <PortfolioResumePreview
            open={resumePreviewOpen}
            loading={resumePreviewLoading}
            error={resumePreviewError}
            progress={resumePreviewProgress}
            resumeUrl={resumeUrl}
            closeRef={resumePreviewCloseRef}
            onClose={closeResumePreview}
            onRetry={() => {
              setResumePreviewError(false);
              setResumePreviewProgress(8);
              setResumePreviewLoading(true);
            }}
            onLoad={() => {
              setResumePreviewProgress(100);
              setResumePreviewLoading(false);
              setResumePreviewError(false);
            }}
            onError={() => {
              setResumePreviewLoading(false);
              setResumePreviewError(true);
            }}
          />
        </Suspense>
      )}

      <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => { if (!open) setSelectedProject(null); }}>
        {selectedProject && (
          <DialogContent data-project-details-dialog="true" data-project-details-transition={projectDetailsTransition ?? "idle"} aria-modal="true" aria-busy={projectDetailsLoading} onTouchStart={handleProjectDetailsTouchStart} onTouchEnd={handleProjectDetailsTouchEnd} className={`touch-pan-y w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-3xl h-[calc(100svh-1rem)] min-h-0 max-h-[calc(100svh-1rem)] overflow-x-hidden overflow-y-auto overscroll-contain border-[#3b82f6]/30 bg-[#071326] p-0 text-[#e6f2ff] shadow-[0_24px_90px_rgba(0,0,0,0.6)] transition-[opacity,transform] duration-260 motion-reduce:transition-none ${projectDetailsTransition === "next" ? "translate-x-1 opacity-90" : projectDetailsTransition === "previous" ? "-translate-x-1 opacity-90" : "translate-x-0 opacity-100"}`}>
            {projectDetailsLoading && <div data-project-details-loading="true" role="status" aria-live="polite" className="pointer-events-none absolute inset-x-0 top-0 z-20 grid gap-3 border-b border-[#67e8f9]/20 bg-[#071326]/90 p-4 backdrop-blur-sm sm:p-8"><div className="h-2 w-28 animate-pulse bg-[#3b82f6]/35" /><div className="h-9 w-4/5 animate-pulse bg-white/10" /><div className="h-3 w-full animate-pulse bg-white/10" /><div className="h-3 w-2/3 animate-pulse bg-white/10" /><span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9fc6e9]">carregando projeto…</span></div>}
            {showProjectSwipeHint && <div data-project-swipe-hint="true" className="pointer-events-none absolute inset-x-4 top-4 z-30 flex justify-center sm:hidden" role="status" aria-live="polite"><span className="border border-[#67e8f9]/35 bg-[#06172f]/95 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff] shadow-[0_10px_28px_rgba(0,0,0,0.3)]">deslize para navegar</span></div>}
            {selectedProject.cover && <img src={selectedProject.cover} alt={`Imagem do projeto ${selectedProject.name}`} width="1200" height="800" className="max-h-[38svh] w-full max-w-full object-cover sm:max-h-[42svh]" />}
            <div className="min-h-0 min-w-0 overflow-x-hidden p-4 sm:p-8">
              <DialogHeader className="min-w-0 text-left">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#60a5fa]">projeto em destaque</p>
                <DialogTitle className="mt-2 break-words font-display text-3xl font-medium tracking-[-0.05em] text-white [overflow-wrap:anywhere]">{selectedProject.name}</DialogTitle>
                <DialogDescription className="mt-3 max-w-2xl break-words font-body text-sm leading-6 text-[#c4d9ee] [overflow-wrap:anywhere]">{selectedProject.description}</DialogDescription>
                <div className="mt-5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
                  <button type="button" data-project-modal-favorite="true" onClick={(event) => toggleFavorite(selectedProject.id, event)} aria-pressed={favoriteProjectIdSet.has(selectedProject.id)} aria-label={favoriteProjectIdSet.has(selectedProject.id) ? `Remover ${selectedProject.name} dos projetos salvos` : `Salvar ${selectedProject.name} nos projetos favoritos`} className={`inline-flex min-h-11 items-center gap-2 self-start border px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97] ${favoriteProjectIdSet.has(selectedProject.id) ? "border-[#67e8f9] bg-[#0b3156] text-[#e5fbff]" : "border-[#3b82f6]/35 text-[#cfe3ff] hover:border-[#70a6ff] hover:text-white"}`}><Heart className={`h-4 w-4 ${favoriteProjectIdSet.has(selectedProject.id) ? "fill-current" : ""}`} aria-hidden="true" />{favoriteProjectIdSet.has(selectedProject.id) ? "salvo nos favoritos" : "salvar nos favoritos"}</button>
                  <button type="button" data-project-modal-share="true" onClick={shareSelectedProject} aria-label={`Copiar link direto de ${selectedProject.name}`} className="inline-flex min-h-11 items-center gap-2 border border-[#3b82f6]/35 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#70a6ff] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]"><Share2 className="h-4 w-4" aria-hidden="true" />{projectShareStatus === "copied" ? "link copiado" : projectShareStatus === "error" ? "tentar novamente" : "compartilhar projeto"}</button>
                  <button type="button" data-project-modal-copy-link="true" onClick={copySelectedProjectLink} aria-label={`Copiar link de ${selectedProject.name}`} className="inline-flex min-h-11 items-center gap-2 border border-[#67e8f9]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]"><Copy className="h-4 w-4" aria-hidden="true" />{projectCopyStatus === "copied" ? "link copiado" : projectCopyStatus === "error" ? "tentar novamente" : "copiar link"}</button>
                  <a href={selectedProject.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-[#67e8f9]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]"><ArrowUpRight className="h-4 w-4" aria-hidden="true" />abrir projeto</a>
                  <span data-project-modal-share-status="true" role="status" aria-live="polite" className="sr-only">{projectShareStatus === "copied" || projectCopyStatus === "copied" ? "Link direto do projeto copiado." : projectShareStatus === "error" || projectCopyStatus === "error" ? "Não foi possível copiar o link direto do projeto." : ""}</span>
                </div>
              </DialogHeader>
              <div className="mt-7 grid gap-5 sm:grid-cols-3">
                <div><p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#60a5fa]">papel</p><p className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{selectedProject.role || "Informação não registrada."}</p></div>
                <div><p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#60a5fa]">processo</p><p className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{selectedProject.process || "Informação não registrada."}</p></div>
                <div><p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#60a5fa]">resultado</p><p className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{selectedProject.result || "Informação não registrada."}</p></div>
              </div>
              {selectedProject.caseStudy && <section data-project-case-study="true" className="mt-7 border-t border-white/10 pt-5" aria-labelledby="project-case-study-title"><p id="project-case-study-title" className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#60a5fa]">leitura do caso</p><dl className="mt-4 grid gap-5 sm:grid-cols-2"><div><dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#87b8c9]">contexto</dt><dd className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{selectedProject.caseStudy.context}</dd></div><div><dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#87b8c9]">problema</dt><dd className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{selectedProject.caseStudy.problem}</dd></div><div><dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#87b8c9]">objetivo</dt><dd className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{selectedProject.caseStudy.objective}</dd></div><div><dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#87b8c9]">minha função</dt><dd className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{selectedProject.caseStudy.function}</dd></div><div><dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#87b8c9]">processo</dt><dd className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{selectedProject.caseStudy.process}</dd></div><div><dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#87b8c9]">decisões</dt><dd className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{selectedProject.caseStudy.decisions}</dd></div><div><dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#87b8c9]">resultado</dt><dd className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{selectedProject.caseStudy.result}</dd></div><div><dt className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#87b8c9]">aprendizado</dt><dd className="mt-2 font-body text-sm leading-6 text-[#d9e9f8]">{selectedProject.caseStudy.learning}</dd></div></dl></section>}
              <div className="mt-7 border-t border-white/10 pt-5"><p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#60a5fa]">tecnologias e repertório</p><div className="mt-3 flex flex-wrap gap-2">{selectedProject.technologies.map((technology) => <span key={technology} className="border border-[#3b82f6]/30 bg-[#0b2746] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-[#cfe3ff]">{technology}</span>)}</div></div>
              <div className="mt-7 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:flex sm:items-center sm:justify-between"><button type="button" data-project-modal-previous="true" onClick={() => navigateSelectedProject("previous")} disabled={!previousSelectedProject} aria-label={previousSelectedProject ? `Ver projeto anterior: ${previousSelectedProject.name}` : "Nenhum projeto anterior"} className="inline-flex min-h-11 items-center gap-2 border border-[#3b82f6]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#70a6ff] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-not-allowed disabled:opacity-35"><ChevronLeft className="h-4 w-4" aria-hidden="true" />anterior</button><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7189ae]" aria-live="polite">{selectedProjectIndex >= 0 ? `${String(selectedProjectIndex + 1).padStart(2, "0")} / ${String(visibleRepositories.length).padStart(2, "0")}` : ""}</span><button type="button" data-project-modal-next="true" onClick={() => navigateSelectedProject("next")} disabled={!nextSelectedProject} aria-label={nextSelectedProject ? `Ver próximo projeto: ${nextSelectedProject.name}` : "Nenhum próximo projeto"} className="inline-flex min-h-11 items-center gap-2 border border-[#3b82f6]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#70a6ff] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-not-allowed disabled:opacity-35">próximo<ChevronRight className="h-4 w-4" aria-hidden="true" /></button></div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
