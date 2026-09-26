import { publicMediaPath } from "@/features/portfolio/utils/publicMediaPath";
/**
 * Design: Arquivo Luminoso — editorial técnico em azul celeste vibrante e azul profundo.
 * A página transforma a trajetória de Pablo em capítulos assimétricos, com
 * metadados, linha de progresso e linguagem visual de arquivo em evolução.
 */
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { calculateMiniMapPosition, calculatePinchZoom, formatMiniMapPositionAnnouncement, getCancelledInteractionState, getViewportOrientation } from "@/lib/lightboxInteractions";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Clapperboard,
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
  Linkedin,
  Loader2,
  Mail,
  Menu,
  Maximize2,
  MessageCircle,
  Play,
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
import { favoriteImageStorageKey, normalizeFavoriteImageIds, toggleFavoriteImageId } from "@/lib/imageFavorites";
import { dropProjectInOrder, moveProjectInOrder, normalizeManualOrder } from "@/lib/manualOrder";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import PortfolioFooter from "@/features/portfolio/components/PortfolioFooter";
import PortfolioHero from "@/features/portfolio/components/PortfolioHero";
import PortfolioAbout from "@/features/portfolio/components/PortfolioAbout";
import PortfolioProjectsOverview from "@/features/portfolio/components/PortfolioProjectsOverview";
import PortfolioCaseStudies from "@/features/portfolio/components/PortfolioCaseStudies";
import { PortfolioContact } from "@/features/portfolio/components/PortfolioContact";
import { PortfolioResumePreview } from "@/features/portfolio/components/PortfolioResumePreview";
import { PortfolioProcess, PortfolioServices, PortfolioSkills } from "@/features/portfolio/components/PortfolioStaticSections";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { buildBriefingWhatsAppUrl } from "@/features/portfolio/utils/briefingWhatsApp";
import { exportFavoriteProjects, type FavoriteExportFormat } from "@/features/portfolio/utils/exportFavorites";
import { buildFavoritesShareUrl, buildLightboxContext, buildLightboxEmailPayload, buildLightboxShareUrl, buildProjectShareUrl } from "@/features/portfolio/utils/shareProject";
import { copyTextWithFeedback } from "@/features/portfolio/utils/clipboardFeedback";
import { useNearViewport } from "@/features/portfolio/hooks/useNearViewport";
import {
  categoryFilters,
  comparisonPairs,
  optimizedLightboxImages,
  predefinedOrderProfiles,
  repositories,
  sortOptions,
  tagFilters,
  technologyFilters,
  type ManualOrderProfile,
  type Repository,
} from "@/features/portfolio/portfolioData";
const InstagramRepertoire = lazy(() => import("@/features/social/InstagramRepertoire"));

const markUrl = `${import.meta.env.BASE_URL}favicon.svg`;
const portraitUrl = publicMediaPath("/manus-storage/pablo-guilherme-retrato-profissional_a0ec8605.png");
const portraitResponsive = {
  avif: publicMediaPath("/manus-storage/pablo-retrato-480w_72345227.avif 480w, /manus-storage/pablo-retrato-768w_02bb45b0.avif 768w, /manus-storage/pablo-retrato-1200w_e67ca5a8.avif 1200w, /manus-storage/pablo-retrato-1600w_09cf51fa.avif 1600w, /manus-storage/pablo-retrato-1664w_a3e67f83.avif 1664w"),
  webp: publicMediaPath("/manus-storage/pablo-retrato-480w_7aa7df67.webp 480w, /manus-storage/pablo-retrato-768w_f9f682be.webp 768w, /manus-storage/pablo-retrato-1200w_57f8c32f.webp 1200w, /manus-storage/pablo-retrato-1600w_09cf51fa.webp 1600w"),
};
const resumeUrl = publicMediaPath("/manus-storage/curriculo-pablo-guilherme-profissional_1b06376f.pdf");
const whatsAppNumber = "5561992903029";
const isStaticDeploy = import.meta.env.VITE_STATIC_DEPLOY === "true";
declare const __PORTFOLIO_RESUME_AVAILABLE__: boolean;
declare const __PORTFOLIO_HERO_AVAILABLE__: boolean;
declare const __PORTFOLIO_SHOWREEL_AVAILABLE__: boolean;
const resumeAvailable = !isStaticDeploy || __PORTFOLIO_RESUME_AVAILABLE__;
const heroAvailable = !isStaticDeploy || __PORTFOLIO_HERO_AVAILABLE__;
const showreelAvailable = !isStaticDeploy || __PORTFOLIO_SHOWREEL_AVAILABLE__;
const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=Olá%2C%20Pablo%21%20Vim%20pelo%20portfólio%20e%20gostaria%20de%20solicitar%20um%20orçamento.`;
const telegramUrl = "https://t.me/mpjmarketing";

type SearchSuggestion = {
  value: string;
  source: "projeto" | "tecnologia" | "descrição";
};

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
  const categories = new Set<string>();
  if (repository.description.toLocaleLowerCase("pt-BR").includes("evento") || repository.name.toLocaleLowerCase("pt-BR").includes("eloise")) categories.add("Eventos");
  if (repository.technologies.includes("Drone")) categories.add("Aéreo");
  if (repository.technologies.includes("Interface")) categories.add("Interface");
  if (repository.technologies.includes("Conteúdo")) categories.add("Conteúdo");
  if (repository.technologies.includes("Noturno")) categories.add("Noturno");
  return categories;
}
const navigationItems = [
  ["sobre", "#sobre", "sobre"],
  ["competências", "#trilha", "trilha"],
  ["serviços", "#servicos", "servicos"],
  ["projetos", "#projetos", "projetos"],
  ["social", "#social", "social"],
] as const;

export default function Home() {
  const { theme, preference, setPreference, toggleTheme } = useTheme();
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [socialSectionRef, shouldLoadSocial] = useNearViewport<HTMLDivElement>();
  const [availabilitySectionRef, shouldLoadAvailability] = useNearViewport<HTMLDivElement>();
  const [fontScale, setFontScale] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const stored = Number(window.localStorage.getItem("pablo-portfolio-font-scale"));
    return Number.isFinite(stored) ? Math.min(1.16, Math.max(0.92, stored)) : 1;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const [resumePreviewLoading, setResumePreviewLoading] = useState(false);
  const [resumePreviewProgress, setResumePreviewProgress] = useState(0);
  const [resumePreviewError, setResumePreviewError] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("inicio");
  const [isDesktopViewport, setIsDesktopViewport] = useState(() => typeof window === "undefined" ? true : window.matchMedia("(min-width: 768px)").matches);
  const [formSent, setFormSent] = useState(false);
  const [briefingWhatsAppUrl, setBriefingWhatsAppUrl] = useState<string | null>(null);
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
  const [favoriteImageIds, setFavoriteImageIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(favoriteImageStorageKey);
      return normalizeFavoriteImageIds(stored ? JSON.parse(stored) : [], repositories.filter((repository) => Boolean(repository.cover)).map((repository) => repository.id));
    } catch {
      return [];
    }
  });
  const [isImageCollectionOpen, setIsImageCollectionOpen] = useState(false);
  const [favoriteImageStatus, setFavoriteImageStatus] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [savedProjectSearch, setSavedProjectSearch] = useState("");
  const [savedProjectSortMode, setSavedProjectSortMode] = useState<(typeof sortOptions)[number]["value"]>("relevance");
  const [savedProjectControlStatus, setSavedProjectControlStatus] = useState("");
  const [contextTransitionTarget, setContextTransitionTarget] = useState<"saved" | "agenda" | null>(null);
  const [contextNavigationStatus, setContextNavigationStatus] = useState("");
  const [sharedProjectIds, setSharedProjectIds] = useState<string[] | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "error">("idle");
  const [projectShareStatus, setProjectShareStatus] = useState<"idle" | "copied" | "error">("idle");
  const [projectCopyStatus, setProjectCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [projectDetailsLoading, setProjectDetailsLoading] = useState(false);
  const [projectVideoNeedsPlay, setProjectVideoNeedsPlay] = useState(false);
  const [showProjectSwipeHint, setShowProjectSwipeHint] = useState(false);
  const [isBriefingFieldFocused, setIsBriefingFieldFocused] = useState(false);
  const [isMobileKeyboardOpen, setIsMobileKeyboardOpen] = useState(false);
  const [isHeroCtaVisible, setIsHeroCtaVisible] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches);
  const [favoriteExportStatus, setFavoriteExportStatus] = useState<"idle" | "csv" | "json" | "pdf-loading" | "pdf" | "error">("idle");
  const [lightboxShareStatus, setLightboxShareStatus] = useState<"idle" | "copied" | "shared" | "error">("idle");
  const [lightboxCopiedAction, setLightboxCopiedAction] = useState<"link" | "context" | null>(null);
  const [showLightboxMobileDetails, setShowLightboxMobileDetails] = useState(false);
  const [lightboxRedirectingChannel, setLightboxRedirectingChannel] = useState<"whatsapp" | "linkedin" | null>(null);
  const [lightboxEmailStatus, setLightboxEmailStatus] = useState<"idle" | "opening">("idle");
  const [lightboxFullscreen, setLightboxFullscreen] = useState(false);
  const [lightboxFullscreenNotice, setLightboxFullscreenNotice] = useState("");
  const [lightboxSwipeDirection, setLightboxSwipeDirection] = useState<"previous" | "next" | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [lightboxPanning, setLightboxPanning] = useState(false);
  const [lightboxZoomFeedback, setLightboxZoomFeedback] = useState<number | null>(null);
  const [lightboxZoomLimitFeedback, setLightboxZoomLimitFeedback] = useState<"min" | "max" | null>(null);
  const [viewportOrientation, setViewportOrientation] = useState<"portrait" | "landscape">(() => getViewportOrientation(window.innerWidth, window.innerHeight));
  const [showLightboxShortcutLegend, setShowLightboxShortcutLegend] = useState(false);
  const [miniMapDragging, setMiniMapDragging] = useState(false);
  const [lightboxPositionAnnouncement, setLightboxPositionAnnouncement] = useState("");
  const [lightboxResetting, setLightboxResetting] = useState(false);
  const [lightboxClosing, setLightboxClosing] = useState(false);
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
  const [lightboxProjectId, setLightboxProjectId] = useState<string | null>(null);
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxOffset, setLightboxOffset] = useState({ x: 0, y: 0 });
  const [lightboxImageLoading, setLightboxImageLoading] = useState(true);
  const [lightboxImageError, setLightboxImageError] = useState(false);
  const [lightboxImageAttempt, setLightboxImageAttempt] = useState(0);
  const [lightboxComparisonPosition, setLightboxComparisonPosition] = useState(50);
  const pinchStartDistanceRef = useRef(0);
  const pinchStartZoomRef = useRef(1);
  const pinchWasActiveRef = useRef(false);
  const swipeStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ active: false, x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const panPointerRef = useRef({ active: false, pointerId: -1, x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const zoomFeedbackTimerRef = useRef<number | null>(null);
  const zoomLimitFeedbackTimerRef = useRef<number | null>(null);
  const shortcutLegendTimerRef = useRef<number | null>(null);
  const miniMapDragRef = useRef({ active: false, pointerId: -1 });
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const lightboxModalRef = useRef<HTMLDivElement>(null);
  const lightboxImageRef = useRef<HTMLImageElement>(null);
  const lightboxImageContainerRef = useRef<HTMLDivElement>(null);
  const lightboxActiveThumbRef = useRef<HTMLButtonElement>(null);
  const lightboxReturnFocusRef = useRef<HTMLElement | null>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const resumePreviewCloseRef = useRef<HTMLButtonElement>(null);
  const resumePreviewReturnFocusRef = useRef<HTMLElement | null>(null);
  const lightboxProjects = useMemo(() => repositories.filter((repository) => Boolean(repository.cover)), []);
  const lightboxProject = lightboxProjectId ? lightboxProjects.find((repository) => repository.id === lightboxProjectId) ?? null : null;
  const lightboxProjectIndex = lightboxProject ? lightboxProjects.findIndex((repository) => repository.id === lightboxProject.id) : -1;
  const lightboxNextProject = lightboxProjectIndex >= 0 ? lightboxProjects[(lightboxProjectIndex + 1) % lightboxProjects.length] : null;
  const lightboxPreviousProject = lightboxProjectIndex >= 0 ? lightboxProjects[(lightboxProjectIndex - 1 + lightboxProjects.length) % lightboxProjects.length] : null;
  const lightboxComparison = lightboxProject ? comparisonPairs[lightboxProject.id] ?? null : null;
  const shouldHideContactFloat = Boolean(lightboxProjectId || selectedProject || resumePreviewOpen || isProjectSearchFocused || isBriefingFieldFocused || isMobileKeyboardOpen);

  useEffect(() => {
    const target = heroCtaRef.current;
    if (!target || typeof window === "undefined") return;

    const mobileQuery = window.matchMedia("(max-width: 1023px)");
    let animationFrame: number | null = null;

    const syncVisibility = () => {
      animationFrame = null;
      if (!mobileQuery.matches) {
        setIsHeroCtaVisible(false);
        return;
      }
      const rect = target.getBoundingClientRect();
      setIsHeroCtaVisible(rect.top < window.innerHeight && rect.bottom > 0);
    };

    const scheduleSync = () => {
      if (animationFrame !== null) return;
      animationFrame = window.requestAnimationFrame(syncVisibility);
    };

    scheduleSync();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    mobileQuery.addEventListener("change", scheduleSync);
    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      mobileQuery.removeEventListener("change", scheduleSync);
    };
  }, []);

  useEffect(() => {
    setLightboxImageLoading(Boolean(lightboxProject));
    setLightboxImageError(false);
    setLightboxImageAttempt(0);
    setLightboxComparisonPosition(50);
    [lightboxNextProject, lightboxPreviousProject].forEach((project) => {
      if (!project?.cover) return;
      const preloader = new Image();
      preloader.decoding = "async";
      preloader.src = project.cover;
    });
  }, [lightboxProject?.id]);

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
    if (!lightboxProjectId) return;
    const handleViewportChange = () => {
      setViewportOrientation(getViewportOrientation(window.innerWidth, window.innerHeight));
      setLightboxOffset((offset) => clampPanOffset(offset.x, offset.y));
    };
    window.addEventListener("resize", handleViewportChange, { passive: true });
    window.addEventListener("orientationchange", handleViewportChange, { passive: true });
    window.screen.orientation?.addEventListener?.("change", handleViewportChange);
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
      window.screen.orientation?.removeEventListener?.("change", handleViewportChange);
    };
  }, [lightboxProjectId, lightboxZoom]);

  const openProjectLightbox = (projectId: string, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowLightboxMobileDetails(false);
    lightboxReturnFocusRef.current = event.currentTarget;
    setLightboxClosing(false);
    setLightboxFullscreenNotice("");
    setLightboxSwipeDirection(null);
    try {
      const swipeHintSeen = window.localStorage.getItem("arquivo-profundo-swipe-hint-seen") === "true";
      if (!swipeHintSeen) {
        setShowSwipeHint(true);
        window.localStorage.setItem("arquivo-profundo-swipe-hint-seen", "true");
        window.setTimeout(() => setShowSwipeHint(false), 3200);
      }
    } catch {
      setShowSwipeHint(true);
      window.setTimeout(() => setShowSwipeHint(false), 3200);
    }
    trackPortfolioEvent("project_opened", { projectId, surface: "lightbox" });
    setLightboxProjectId(projectId);
  };

  const closeProjectLightbox = () => {
    if (lightboxClosing) return;
    setLightboxClosing(true);
    if (document.fullscreenElement) void document.exitFullscreen?.();
    setLightboxFullscreen(false);
    window.setTimeout(() => {
      setLightboxProjectId(null);
      setLightboxClosing(false);
      setLightboxZoom(1);
      setLightboxOffset({ x: 0, y: 0 });
      lightboxReturnFocusRef.current?.focus();
    }, 180);
  };

  const toggleLightboxFullscreen = async () => {
    const modal = lightboxModalRef.current;
    if (!modal) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen?.();
      } else if (modal.requestFullscreen) {
        await modal.requestFullscreen();
      }
    } catch {
      setLightboxFullscreen(false);
      setLightboxFullscreenNotice("A tela cheia foi bloqueada pelo navegador. Você ainda pode ampliar a imagem usando os controles de zoom.");
      window.setTimeout(() => setLightboxFullscreenNotice(""), 4200);
      return;
    }
    setLightboxFullscreen(Boolean(document.fullscreenElement));
  };

  const setProjectZoom = (nextZoom: number, announceLimit = true) => {
    const clampedZoom = Math.min(3, Math.max(1, nextZoom));
    const hitLimit = announceLimit && (nextZoom <= 1 || nextZoom >= 3);
    if (hitLimit) {
      const limit = nextZoom < 1 ? "min" : "max";
      setLightboxZoomLimitFeedback(limit);
      if (zoomLimitFeedbackTimerRef.current) window.clearTimeout(zoomLimitFeedbackTimerRef.current);
      zoomLimitFeedbackTimerRef.current = window.setTimeout(() => setLightboxZoomLimitFeedback(null), 1200);
    }
    setLightboxZoom(clampedZoom);
    try { window.sessionStorage.setItem("arquivo-profundo-lightbox-zoom", String(clampedZoom)); } catch { /* sessionStorage pode estar indisponível */ }
    setLightboxZoomFeedback(Math.round(clampedZoom * 100));
    if (zoomFeedbackTimerRef.current) window.clearTimeout(zoomFeedbackTimerRef.current);
    zoomFeedbackTimerRef.current = window.setTimeout(() => setLightboxZoomFeedback(null), 900);
    if (clampedZoom === 1) setLightboxOffset({ x: 0, y: 0 });
  };

  const resetProjectZoom = () => {
    setLightboxResetting(true);
    setProjectZoom(1, false);
    setLightboxOffset({ x: 0, y: 0 });
    window.setTimeout(() => setLightboxResetting(false), 320);
  };

  const revealShortcutLegend = () => {
    setShowLightboxShortcutLegend(true);
    if (shortcutLegendTimerRef.current) window.clearTimeout(shortcutLegendTimerRef.current);
    shortcutLegendTimerRef.current = window.setTimeout(() => setShowLightboxShortcutLegend(false), 3600);
  };

  const clearLightboxSessionPreferences = () => {
    try { window.sessionStorage.removeItem("arquivo-profundo-lightbox-zoom"); } catch { /* sessionStorage pode estar indisponível */ }
    resetProjectZoom();
    revealShortcutLegend();
  };

  const getTouchDistance = (touches: TouchEvent<HTMLImageElement>["touches"]) => {
    const first = touches[0];
    const second = touches[1];
    return Math.hypot(second.clientX - first.clientX, second.clientY - first.clientY);
  };

  const getPanBounds = () => {
    const image = lightboxImageRef.current;
    const container = lightboxImageContainerRef.current;
    if (!image || !container || !image.naturalWidth || !image.naturalHeight) return { x: 0, y: 0 };
    const containerRect = container.getBoundingClientRect();
    const aspectRatio = image.naturalWidth / image.naturalHeight;
    const fitWidth = Math.min(containerRect.width, containerRect.height * aspectRatio);
    const fitHeight = fitWidth / aspectRatio;
    return { x: Math.max(0, (fitWidth * lightboxZoom - containerRect.width) / 2), y: Math.max(0, (fitHeight * lightboxZoom - containerRect.height) / 2) };
  };

  const clampPanOffset = (x: number, y: number) => {
    const bounds = getPanBounds();
    return { x: Math.min(bounds.x, Math.max(-bounds.x, x)), y: Math.min(bounds.y, Math.max(-bounds.y, y)) };
  };

  const handleMiniMapPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    revealShortcutLegend();
    miniMapDragRef.current = { active: true, pointerId: event.pointerId };
    setMiniMapDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
    repositionFromMiniMap(event.clientX, event.clientY, event.currentTarget);
  };

  const handleMiniMapPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!miniMapDragRef.current.active || miniMapDragRef.current.pointerId !== event.pointerId) return;
    event.preventDefault();
    repositionFromMiniMap(event.clientX, event.clientY, event.currentTarget);
  };

  const handleMiniMapPointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (miniMapDragRef.current.pointerId === event.pointerId) {
      miniMapDragRef.current.active = false;
      setMiniMapDragging(false);
    }
  };

  const repositionFromMiniMap = (clientX: number, clientY: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const xRatio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const yRatio = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    const bounds = getPanBounds();
    const nextOffset = clampPanOffset((0.5 - xRatio) * 2 * bounds.x, (0.5 - yRatio) * 2 * bounds.y);
    setLightboxOffset(nextOffset);
    setLightboxPositionAnnouncement(formatMiniMapPositionAnnouncement(calculateMiniMapPosition(lightboxZoom, nextOffset, bounds)));
  };

  const handleLightboxPointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    if (event.pointerType === "touch" || lightboxZoom <= 1 || !lightboxImageRef.current) return;
    event.preventDefault();
    panPointerRef.current = { active: true, pointerId: event.pointerId, x: event.clientX, y: event.clientY, offsetX: lightboxOffset.x, offsetY: lightboxOffset.y };
    setLightboxPanning(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handleLightboxPointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!panPointerRef.current.active || panPointerRef.current.pointerId !== event.pointerId) return;
    event.preventDefault();
    setLightboxOffset(clampPanOffset(panPointerRef.current.offsetX + event.clientX - panPointerRef.current.x, panPointerRef.current.offsetY + event.clientY - panPointerRef.current.y));
  };

  const handleLightboxPointerEnd = (event: React.PointerEvent<HTMLImageElement>) => {
    if (panPointerRef.current.pointerId === event.pointerId) {
      panPointerRef.current.active = getCancelledInteractionState().isPanning;
      setLightboxPanning(false);
    }
  };

  const handleLightboxTouchStart = (event: TouchEvent<HTMLImageElement>) => {
    if (event.touches.length === 1) {
      const touch = event.touches[0];
      swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
      panStartRef.current = { active: lightboxZoom > 1, x: touch.clientX, y: touch.clientY, offsetX: lightboxOffset.x, offsetY: lightboxOffset.y };
    }
    if (event.touches.length === 2) {
      event.preventDefault();
      panStartRef.current.active = false;
      pinchWasActiveRef.current = true;
      pinchStartDistanceRef.current = getTouchDistance(event.touches);
      pinchStartZoomRef.current = lightboxZoom;
    }
  };

  const handleLightboxTouchMove = (event: TouchEvent<HTMLImageElement>) => {
    if (event.touches.length === 1 && panStartRef.current.active && lightboxZoom > 1) {
      event.preventDefault();
      const touch = event.touches[0];
      const nextX = panStartRef.current.offsetX + touch.clientX - panStartRef.current.x;
      const nextY = panStartRef.current.offsetY + touch.clientY - panStartRef.current.y;
      setLightboxOffset(clampPanOffset(nextX, nextY));
      return;
    }
    if (event.touches.length !== 2 || pinchStartDistanceRef.current <= 0) return;
    event.preventDefault();
    setProjectZoom(calculatePinchZoom(pinchStartZoomRef.current, pinchStartDistanceRef.current, getTouchDistance(event.touches)));
  };

  const handleLightboxTouchEnd = (event: TouchEvent<HTMLImageElement>) => {
    if (panStartRef.current.active) {
      panStartRef.current.active = false;
      pinchStartDistanceRef.current = 0;
      return;
    }
    if (event.changedTouches.length === 1 && lightboxZoom === 1 && lightboxProject && pinchStartDistanceRef.current === 0 && !pinchWasActiveRef.current) {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - swipeStartRef.current.x;
      const deltaY = touch.clientY - swipeStartRef.current.y;
      if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY)) {
        const currentIndex = lightboxProjects.findIndex((repository) => repository.id === lightboxProject.id);
        const direction = deltaX < 0 ? 1 : -1;
        setLightboxSwipeDirection(direction === 1 ? "next" : "previous");
        window.setTimeout(() => setLightboxSwipeDirection(null), 520);
        const nextProject = lightboxProjects[(currentIndex + direction + lightboxProjects.length) % lightboxProjects.length];
        if (nextProject?.cover) setLightboxProjectId(nextProject.id);
      }
    }
    pinchStartDistanceRef.current = 0;
    pinchWasActiveRef.current = false;
  };

  useEffect(() => {
    if (!lightboxProjectId) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => lightboxCloseRef.current?.focus(), 0);
    const handleFullscreenChange = () => setLightboxFullscreen(document.fullscreenElement === document.querySelector("[data-lightbox-modal]"));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    const handleLightboxKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        const modal = document.querySelector<HTMLElement>("[data-lightbox-modal]");
        const focusable = modal ? Array.from(modal.querySelectorAll<HTMLElement>('button:not([disabled]), summary, a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')).filter((element) => element.getClientRects().length > 0) : [];
        if (focusable.length) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        closeProjectLightbox();
        return;
      }
      if (!lightboxProject) return;
      const projectIndex = lightboxProjects.findIndex((repository) => repository.id === lightboxProject.id);
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setProjectZoom(lightboxZoom + 0.25);
        return;
      }
      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        setProjectZoom(lightboxZoom - 0.25);
        return;
      }
      if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(event.key) && lightboxZoom > 1) {
        event.preventDefault();
        const step = 48;
        const deltaX = event.key === "ArrowRight" ? -step : event.key === "ArrowLeft" ? step : 0;
        const deltaY = event.key === "ArrowDown" ? -step : event.key === "ArrowUp" ? step : 0;
        setLightboxOffset((offset) => clampPanOffset(offset.x + deltaX, offset.y + deltaY));
        return;
      }
      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (projectIndex + direction + lightboxProjects.length) % lightboxProjects.length;
        const nextProject = lightboxProjects[nextIndex];
        if (nextProject?.cover) setLightboxProjectId(nextProject.id);
      }
    };
    window.addEventListener("keydown", handleLightboxKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleLightboxKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (document.fullscreenElement) void document.exitFullscreen?.();
    };
  }, [lightboxProjectId, lightboxProject, lightboxProjects, lightboxZoom]);

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

  useEffect(() => {
    if (!lightboxProjectId) return;
    let savedZoom = 1;
    try { savedZoom = Math.min(3, Math.max(1, Number(window.sessionStorage.getItem("arquivo-profundo-lightbox-zoom")) || 1)); } catch { savedZoom = 1; }
    setLightboxZoom(savedZoom);
    setLightboxOffset({ x: 0, y: 0 });
    window.requestAnimationFrame(() => lightboxActiveThumbRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }));
  }, [lightboxProjectId]);
  const successMessageRef = useRef<HTMLDivElement>(null);
  const projectFilterTimerRef = useRef<number | null>(null);
  const galleryLoadingTimerRef = useRef<number | null>(null);
  const contextTransitionTimerRef = useRef<number | null>(null);
  const favoriteExportTimerRef = useRef<number | null>(null);
  const projectSearchInputRef = useRef<HTMLInputElement>(null);
  const favoriteProjectIdSet = useMemo(() => new Set(favoriteProjectIds), [favoriteProjectIds]);
  const favoriteImageIdSet = useMemo(() => new Set(favoriteImageIds), [favoriteImageIds]);
  const favoriteImageProjects = useMemo(() => lightboxProjects.filter((project) => favoriteImageIdSet.has(project.id)), [favoriteImageIdSet, lightboxProjects]);
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
  const featuredRepositories = useMemo(() => repositories.filter((repository) => repository.featured || repository.relevance >= 80).sort((first, second) => second.relevance - first.relevance).slice(0, 3), []);
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
    const sharedImageId = new URLSearchParams(window.location.search).get("imagem");
    if (!sharedImageId || !lightboxProjects.some((project) => project.id === sharedImageId)) return;
    setLightboxProjectId(sharedImageId);
  }, [lightboxProjects]);

  useEffect(() => {
    try {
      window.localStorage.setItem("pablo-portfolio-favorites", JSON.stringify(favoriteProjectIds));
    } catch {
      // A preferência continua válida durante a sessão mesmo quando o armazenamento está indisponível.
    }
  }, [favoriteProjectIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(favoriteImageStorageKey, JSON.stringify(favoriteImageIds));
    } catch {
      // A coleção continua disponível durante a sessão quando o armazenamento está indisponível.
    }
  }, [favoriteImageIds]);

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
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setShowBackToTop(window.scrollY > 640);
      setScrollProgress(scrollableHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100)) : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleViewportChange = () => {
      setIsDesktopViewport(mediaQuery.matches);
      if (mediaQuery.matches) setMenuOpen(false);
    };
    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    const sectionIds = ["inicio", ...navigationItems.map(([, , id]) => id), "contato"];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver((entries) => {
      const visibleEntry = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visibleEntry?.target.id) setActiveSection(visibleEntry.target.id);
    }, { rootMargin: "-18% 0px -68% 0px", threshold: [0.1, 0.3, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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
    setProjectVideoNeedsPlay(false);
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
    setProjectVideoNeedsPlay(false);
    setProjectDetailsTransition(direction);
    setSelectedProject(target);
    window.setTimeout(() => setProjectDetailsTransition(null), 260);
  }
  function handleProjectDetailsTouchStart(event: TouchEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, a, input, video, summary")) {
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
      setProjectVideoNeedsPlay(false);
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

  function toggleFavoriteImage(projectId: string, event?: React.MouseEvent | React.KeyboardEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    const isAlreadySaved = favoriteImageIdSet.has(projectId);
    const projectName = lightboxProjects.find((project) => project.id === projectId)?.name ?? "Imagem";
    setFavoriteImageIds((current) => toggleFavoriteImageId(current, projectId));
    setFavoriteImageStatus(isAlreadySaved ? `Imagem ${projectName} removida da coleção pessoal.` : `Imagem ${projectName} salva na coleção pessoal.`);
    window.setTimeout(() => setFavoriteImageStatus(""), 2600);
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

  function getLightboxShareUrl(project: Repository) {
    return buildLightboxShareUrl(window.location.href, project.id);
  }

  async function copyLightboxProjectLink() {
    if (!lightboxProject) return;
    try {
      await navigator.clipboard.writeText(getLightboxShareUrl(lightboxProject));
      setLightboxShareStatus("copied");
      setLightboxCopiedAction("link");
      trackPortfolioEvent("share_project", { channel: "copy_link", projectId: lightboxProject.id });
    } catch {
      setLightboxShareStatus("error");
    }
    window.setTimeout(() => { setLightboxShareStatus("idle"); setLightboxCopiedAction(null); }, 2600);
  }

  function downloadLightboxImage(format: "original" | "webp" | "avif") {
    if (!lightboxProject?.cover) return;
    const safeName = lightboxProject.name.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "imagem";
    const optimized = optimizedLightboxImages[lightboxProject.cover];
    const source = format === "webp" ? optimized?.webp : format === "avif" ? optimized?.avif : lightboxProject.cover;
    if (!source) return;
    const extension = format === "original" ? source.split(".").pop()?.split("?")[0] || "jpg" : format;
    const anchor = document.createElement("a");
    anchor.href = source;
    anchor.download = `pablo-${safeName}.${extension}`;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    trackPortfolioEvent("download_project", { format, projectId: lightboxProject.id });
  }

  async function copyLightboxProjectContext() {
    if (!lightboxProject) return;
    const context = buildLightboxContext(lightboxProject, getLightboxShareUrl(lightboxProject));
    try {
      await navigator.clipboard.writeText(context);
      setLightboxShareStatus("copied");
      setLightboxCopiedAction("context");
    } catch {
      setLightboxShareStatus("error");
    }
    window.setTimeout(() => { setLightboxShareStatus("idle"); setLightboxCopiedAction(null); }, 2600);
  }

  function shareLightboxToWhatsApp() {
    if (!lightboxProject || lightboxRedirectingChannel) return;
    const projectId = lightboxProject.id;
    const projectName = lightboxProject.name;
    const shareText = `${projectName} — ${getLightboxShareUrl(lightboxProject)}`;
    setLightboxRedirectingChannel("whatsapp");
    trackPortfolioEvent("share_project", { channel: "whatsapp", projectId });
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
    window.setTimeout(() => setLightboxRedirectingChannel(null), 1400);
  }

  function shareLightboxToLinkedIn() {
    if (!lightboxProject || lightboxRedirectingChannel) return;
    const projectId = lightboxProject.id;
    setLightboxRedirectingChannel("linkedin");
    trackPortfolioEvent("share_project", { channel: "linkedin", projectId });
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getLightboxShareUrl(lightboxProject))}`, "_blank", "noopener,noreferrer");
    window.setTimeout(() => setLightboxRedirectingChannel(null), 1400);
  }

  function shareLightboxByEmail() {
    if (!lightboxProject || lightboxEmailStatus === "opening") return;
    const projectId = lightboxProject.id;
    const projectUrl = getLightboxShareUrl(lightboxProject);
    const { subject, body } = buildLightboxEmailPayload(lightboxProject, projectUrl);
    setLightboxEmailStatus("opening");
    trackPortfolioEvent("share_project", { channel: "email", projectId });
    window.setTimeout(() => setLightboxEmailStatus("idle"), 1800);
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function shareLightboxProject() {
    if (!lightboxProject) return;
    const shareData = {
      title: `${lightboxProject.name} — Pablo Guilherme`,
      text: lightboxProject.description,
      url: getLightboxShareUrl(lightboxProject),
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setLightboxShareStatus("shared");
        trackPortfolioEvent("share_project", { channel: "native", projectId: lightboxProject.id });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLightboxShareStatus("error");
      }
    } else {
      await copyLightboxProjectLink();
      return;
    }
    window.setTimeout(() => { setLightboxShareStatus("idle"); setLightboxCopiedAction(null); }, 2600);
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
        briefing: String(data.get("briefing") || ""),
        website: String(data.get("website") || ""),
      },
      { onSuccess: () => form.reset() },
    );
  }

  const openResumePreview = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
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
    <div data-theme={theme} className="arquivo-page min-h-screen overflow-x-hidden bg-[#07111f] text-[#f2fbff] selection:bg-[#67e8f9] selection:text-[#061226]">
      <a href="#conteudo-principal" className="skip-link">pular para o conteúdo</a>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-cyan-200/[0.14] bg-[#07111f]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#inicio" aria-label="Ir ao início" className="group flex items-center gap-3" onClick={closeMenu}>
            <span className="grid h-10 w-10 place-items-center border border-[#67e8f9]/60 bg-[#062044] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.32)]">
              <img src={markUrl} alt="Símbolo PG" width="28" height="28" decoding="async" className="h-7 w-7 object-contain" />
            </span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#b7cdf1]">
              Pablo <span className="text-[#67e8f9]">/</span> Guilherme
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
            {navigationItems.map(([label, href, id]) => (
              <a key={label} href={href} aria-current={activeSection === id ? "location" : undefined} className={`nav-link text-[11px] font-mono uppercase tracking-[0.14em] transition-colors hover:text-white ${activeSection === id ? "text-[#67e8f9]" : "text-[#90a3c3]"}`}>
                {label}
              </a>
            ))}
            <a href={"https:" + "//pabloguilherme01.github.io/observatorio/"} target="_blank" rel="noreferrer" className="nav-link text-[11px] font-mono font-semibold uppercase tracking-[0.14em] text-[#a5f3fc] transition-colors hover:text-white">meu site <ArrowUpRight className="ml-1 inline h-3 w-3" /></a>
            <button type="button" data-theme-toggle="true" onClick={() => toggleTheme?.()} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} aria-pressed={theme === "dark"} title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} className="grid h-9 w-9 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">{theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}</button>
            {resumeAvailable && <a href={resumeUrl} onClick={openResumePreview} data-resume-header="true" aria-haspopup="dialog" aria-label="Visualizar portfólio atualizado em PDF" title="Visualizar portfólio em PDF" className="resume-header-cta inline-flex items-center gap-2 border border-[#67e8f9] bg-[#0b2746] px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-[#d9fbff] transition-all hover:bg-[#123b67] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
              <Download className="h-3.5 w-3.5" aria-hidden="true" /> <span>portfólio PDF</span>
            </a>}
            <a href="#contato" className="inline-flex items-center gap-2 border border-[#67e8f9] bg-[#38bdf8] px-4 py-2 text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-all hover:bg-[#a5f3fc] hover:shadow-[0_0_28px_rgba(56,189,248,0.36)]">
              contato <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <button
              ref={menuButtonRef}
              type="button"
              data-mobile-menu-toggle="true"
              onClick={() => setMenuOpen((open) => !open)}
              className="grid h-11 w-11 place-items-center border border-white/10 text-[#d8e6fa] transition-colors hover:border-[#67e8f9] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <button type="button" data-theme-toggle="true" onClick={() => toggleTheme?.()} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} aria-pressed={theme === "dark"} title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} className="grid h-11 w-11 place-items-center border border-white/10 text-[#d8e6fa] transition-colors hover:border-[#67e8f9] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">{theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}</button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="max-h-[calc(100svh-76px)] overflow-y-auto overscroll-contain border-t border-white/[0.07] bg-[#090d16] px-5 py-5 md:hidden" aria-label="Navegação móvel">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-1 sm:px-3">
              {[
                ["01 / sobre", "#sobre", "sobre"],
                ["02 / competências", "#trilha", "trilha"],
                ["03 / serviços", "#servicos", "servicos"],
                ["04 / projetos", "#projetos", "projetos"],
                ["05 / contato", "#contato", "contato"],
              ].map(([label, href, id]) => (
                <a key={label} href={href} onClick={closeMenu} aria-current={activeSection === id ? "location" : undefined} className={`min-h-12 border-b border-white/[0.07] py-3 font-mono text-xs uppercase tracking-[0.12em] transition-colors hover:bg-[#0b2746] hover:text-white focus-visible:bg-[#0b2746] focus-visible:text-white ${activeSection === id ? "bg-[#0b2746] text-[#67e8f9]" : "text-[#b7cdf1]"}`}>
                  {label}
                </a>
              ))}
              <a href={"https:" + "//pabloguilherme01.github.io/observatorio/"} target="_blank" rel="noreferrer" onClick={closeMenu} className="mt-2 inline-flex min-h-12 items-center justify-between border border-[#67e8f9]/40 bg-[#0b2746] px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#d9fbff]">06 / meu site <ArrowUpRight className="h-4 w-4" /></a>
              {resumeAvailable && <a href={resumeUrl} onClick={openResumePreview} data-resume-header="true" aria-haspopup="dialog" aria-label="Visualizar portfólio atualizado em PDF" className="resume-header-cta mt-3 inline-flex min-h-12 items-center justify-center gap-3 border border-[#67e8f9] bg-[#0b2746] px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#d9fbff] transition-colors hover:bg-[#123b67] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Download className="h-4 w-4" aria-hidden="true" /> baixar portfólio PDF</a>}
              <button type="button" data-theme-toggle="true" onClick={() => toggleTheme?.()} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} aria-pressed={theme === "dark"} className="mt-3 inline-flex min-h-12 items-center gap-3 border border-white/[0.12] px-3 py-3 font-mono text-xs uppercase tracking-[0.12em] text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><span className="grid h-7 w-7 place-items-center border border-[#67e8f9]/35">{theme === "dark" ? <Sun className="h-3.5 w-3.5" aria-hidden="true" /> : <Moon className="h-3.5 w-3.5" aria-hidden="true" />}</span>{theme === "dark" ? "ativar modo claro" : "ativar modo escuro"}</button>
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
          <div className="mt-5 border-t border-white/10 pt-4" role="group" aria-label="Perfis de ordenação"><div className="flex items-center justify-between gap-3"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">perfis de ordem</p>{activeOrderProfileId && <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#67e8f9]">ativo</span>}</div><p className="mt-2 font-body text-xs leading-5 text-[#9fb2ce]">Salve uma sequência para alternar entre audiovisual, tecnologia ou outros contextos.</p><div className="mt-3 space-y-2">{manualOrderProfiles.length > 0 ? manualOrderProfiles.map((profile) => <div key={profile.id} className="flex items-center gap-2"><button type="button" onClick={() => selectOrderProfile(profile)} aria-pressed={activeOrderProfileId === profile.id} data-profile-recently-activated={recentlyActivatedOrderProfileId === profile.id ? "true" : undefined} className={`min-w-0 flex-1 truncate border px-3 py-2 text-left font-mono text-[9px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${recentlyActivatedOrderProfileId === profile.id ? "profile-activation-pulse border-[#fbbf24] bg-[#17304d] text-[#fff7cc] shadow-[0_0_24px_rgba(251,191,36,0.3)]" : activeOrderProfileId === profile.id ? "border-[#67e8f9] bg-[#0b2746] text-[#d9fbff]" : "border-white/10 text-[#9fb2ce] hover:border-[#67e8f9]/60 hover:text-[#d9fbff]"}`}><span>{profile.name}</span>{profile.preset && <span className="ml-2 text-[8px] text-[#67e8f9]">base</span>}</button><button type="button" onClick={() => toggleOrderProfilePreview(profile.id)} aria-expanded={previewOrderProfileId === profile.id} aria-controls={`order-profile-preview-${profile.id}`} aria-label={`${previewOrderProfileId === profile.id ? "Ocultar" : "Ver"} prévia do perfil ${profile.name}`} title="Ver prévia" className={`grid h-9 w-9 shrink-0 place-items-center border text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${previewOrderProfileId === profile.id ? "border-[#67e8f9] bg-[#0b2746]" : "border-[#67e8f9]/30"}`}><Eye className="h-3.5 w-3.5" aria-hidden="true" /></button><button type="button" onClick={() => duplicateOrderProfile(profile)} aria-label={`Duplicar perfil ${profile.name}`} title="Duplicar perfil" className="grid h-9 w-9 shrink-0 place-items-center border border-[#67e8f9]/30 text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Copy className="h-3.5 w-3.5" aria-hidden="true" /></button>{activeOrderProfileId === profile.id && !profile.preset && <button type="button" onClick={deleteActiveOrderProfile} aria-label={`Excluir perfil ${profile.name}`} title="Excluir perfil" className="grid h-9 w-9 shrink-0 place-items-center border border-rose-300/30 text-rose-200 transition-colors hover:border-rose-300 hover:text-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Trash2 className="h-3.5 w-3.5" aria-hidden="true" /></button>}<div id={`order-profile-preview-${profile.id}`} role="region" tabIndex={previewOrderProfileId === profile.id ? 0 : -1} aria-label={`Prévia do perfil ${profile.name}. Clique para ativar esta ordem.`} aria-hidden={previewOrderProfileId !== profile.id} data-preview-open={previewOrderProfileId === profile.id} onClick={() => { if (previewOrderProfileId === profile.id && activeOrderProfileId !== profile.id) selectOrderProfile(profile); }} onKeyDown={(event) => { if (previewOrderProfileId === profile.id && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); if (activeOrderProfileId !== profile.id) selectOrderProfile(profile); } }} className={`col-span-full cursor-pointer overflow-hidden border border-[#67e8f9]/20 bg-[#07101e]/70 p-2 transition-[max-height,opacity,transform] duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none ${previewOrderProfileId === profile.id ? "max-h-[500px] translate-y-0 opacity-100" : "pointer-events-none max-h-0 -translate-y-1 border-transparent p-0 opacity-0"}`}><p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#67e8f9]">primeiros projetos nesta ordem · clique para ativar</p><div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">{profile.order.slice(0, 5).map((projectId: string, previewIndex: number) => { const project = repositories.find((repository) => repository.id === projectId); return project ? <div key={project.id} className={`group relative min-w-0 border border-white/10 bg-[#0a1422] ${previewIndex >= 3 ? "hidden sm:block" : ""} ${previewOrderProfileId === profile.id ? "preview-stagger-item" : ""}`} style={{ "--preview-delay": `${previewIndex * 45}ms` } as React.CSSProperties} title={`${previewIndex + 1}. ${project.name}`}><div className="aspect-[4/3] overflow-hidden bg-[#0d1b2d]">{project.cover ? <img src={project.cover} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-80" /> : <div className="grid h-full place-items-center font-mono text-[8px] text-[#7189ae]">sem capa</div>}</div><div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 bg-[#030b1e]/92 px-2 py-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"><p className="truncate font-mono text-[8px] uppercase tracking-[0.08em] text-[#fef3c7]">{project.name}</p></div><p className="truncate px-2 py-2 font-mono text-[8px] uppercase tracking-[0.08em] text-[#c8f7ff]">{project.name}</p></div> : null; })}</div></div></div>) : <p className="border border-dashed border-white/10 px-3 py-3 font-mono text-[9px] uppercase tracking-[0.1em] text-[#7189ae]">nenhum perfil salvo</p>}</div><div className="mt-3 flex gap-2"><input value={profileNameDraft} onChange={(event) => setProfileNameDraft(event.target.value)} placeholder="ex.: audiovisual" aria-label="Nome do perfil de ordenação" className="min-w-0 flex-1 border border-white/10 bg-transparent px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#d9fbff] outline-none placeholder:text-[#7189ae] focus:border-[#67e8f9] focus:ring-2 focus:ring-[#a5f3fc]" /><button type="button" onClick={createOrderProfile} disabled={!profileNameDraft.trim()} aria-label="Salvar novo perfil de ordenação" title="Salvar novo perfil" className="grid h-9 w-9 shrink-0 place-items-center border border-[#67e8f9]/40 text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Save className="h-3.5 w-3.5" aria-hidden="true" /></button>{activeOrderProfileId && !activeOrderProfile?.preset && <button type="button" onClick={renameActiveOrderProfile} disabled={!profileNameDraft.trim()} aria-label="Renomear perfil ativo" title="Renomear perfil ativo" className="grid h-9 w-9 shrink-0 place-items-center border border-[#67e8f9]/30 text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /></button>}</div></div>
          <p className="mt-4 border-t border-white/10 pt-4 font-mono text-[9px] uppercase tracking-[0.11em] text-[#7189ae]">tema aplicado agora: {theme === "dark" ? "escuro" : "claro"}</p>
        </div>}
      </header>
      <div className="scroll-progress-track pointer-events-none fixed inset-x-0 top-[75px] z-40 h-0.5 bg-[#67e8f9]/10" aria-hidden="true"><span className="scroll-progress-bar block h-full origin-left bg-[#67e8f9] shadow-[0_0_12px_rgba(103,232,249,0.8)]" style={{ transform: `scaleX(${scrollProgress / 100})` }} /></div>

      <main id="conteudo-principal" className="relative" style={{ fontSize: `${fontScale}rem` }} tabIndex={-1}>
        <div className="archive-spine pointer-events-none absolute bottom-0 top-0 z-20" aria-hidden="true" />
        <PortfolioHero
          heroAvailable={heroAvailable}
          markUrl={markUrl}
          portraitUrl={portraitUrl}
          portraitResponsive={portraitResponsive}
          showreelAvailable={showreelAvailable}
          isDesktopViewport={isDesktopViewport}
          heroCtaRef={heroCtaRef}
        />

        <PortfolioAbout
          resumeAvailable={resumeAvailable}
          resumeUrl={resumeUrl}
          portraitUrl={portraitUrl}
          portraitResponsive={portraitResponsive}
        />

        <PortfolioSkills isDesktopViewport={isDesktopViewport} markUrl={markUrl} />

        <PortfolioServices markUrl={markUrl} />

        <PortfolioProcess />

        <section id="projetos" className="archive-chapter relative border-y border-white/[0.07] bg-[#0a0f18]">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
            <PortfolioProjectsOverview
              markUrl={markUrl}
              portraitUrl={portraitUrl}
              portraitResponsive={portraitResponsive}
              featuredCardsReady={featuredCardsReady}
              featuredRepositories={featuredRepositories}
              openProjectDetails={openProjectDetails}
            />
            <div className="mt-10 flex flex-col gap-4 border-y border-white/[0.1] py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">quer ver mais ou discutir um projeto?</p>
                <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#a9bfd8]">Os destaques acima representam a seleção principal. Para detalhes técnicos, contexto ou uma proposta, fale diretamente comigo.</p>
              </div>
              <a href="#contato" className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[#38bdf8] px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-colors hover:bg-[#a5f3fc]">falar sobre um projeto <ArrowUpRight className="h-4 w-4" /></a>
            </div>

            <PortfolioCaseStudies />
          </div>
        </section>

        <div ref={socialSectionRef} aria-hidden="true" className="h-px w-full" />
        {shouldLoadSocial ? <Suspense fallback={<section id="social" className="archive-chapter border-t border-white/[0.07] bg-[#050c18] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28" aria-label="Carregando repertório social"><div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">carregando repertório social</div></section>}><InstagramRepertoire /></Suspense> : <section id="social" className="archive-chapter border-t border-white/[0.07] bg-[#050c18] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28" aria-label="Repertório social"><div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">repertório social será carregado ao rolar</div></section>}

        <PortfolioContact
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
      </main>

      <PortfolioFooter markUrl={markUrl} telegramUrl={telegramUrl} whatsAppUrl={whatsAppUrl} onWhatsAppClick={() => trackPortfolioEvent("whatsapp_click", { source: "footer" })} emailCopyStatus={emailCopyStatus} copyContactEmail={copyContactEmail} />

      <button type="button" onClick={scrollToTop} aria-label="Voltar ao topo da página" title="Voltar ao topo" aria-hidden={!showBackToTop || Boolean(lightboxProjectId)} tabIndex={showBackToTop && !lightboxProjectId ? 0 : -1} className={`fixed bottom-24 right-5 z-[55] grid h-11 w-11 place-items-center border border-[#67e8f9]/45 bg-[#071b39]/95 text-[#bdf7ff] shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-[opacity,transform,background-color,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0b2b57] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none sm:bottom-5 sm:right-[360px] ${showBackToTop && !lightboxProjectId ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}><ArrowUp className="h-4 w-4" aria-hidden="true" /></button>
      <nav aria-label="Canais de contato" data-mobile-contact-bar="true" className={`contact-float fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 z-[60] transition-opacity duration-200 ${shouldHideContactFloat ? "pointer-events-none translate-y-2 opacity-0" : isHeroCtaVisible ? "pointer-events-none translate-y-2 opacity-0 lg:pointer-events-auto lg:translate-y-0 lg:opacity-100" : "opacity-100"} flex -translate-x-1/2 items-center gap-1.5 border border-[#67e8f9]/35 bg-[#07101e]/95 p-1.5 shadow-[0_16px_44px_rgba(0,0,0,0.42)] backdrop-blur-md sm:bottom-5 sm:left-auto sm:right-5 sm:translate-x-0`}>
        <a href={whatsAppUrl} onClick={() => trackPortfolioEvent("whatsapp_click", { source: "floating" })} target="_blank" rel="noreferrer" aria-label="Falar no WhatsApp sobre um orçamento" title="WhatsApp — falar sobre um orçamento" className="contact-float-link contact-float-whatsapp group border-[#38bdf8]/70 bg-[#38bdf8]/10">
          <MessageCircle className="h-4 w-4 fill-current" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
        <a href={telegramUrl} target="_blank" rel="noreferrer" aria-label="Abrir canal público de atendimento no Telegram" title="Telegram" className="contact-float-link contact-float-telegram group">
          <Send className="h-4 w-4" aria-hidden="true" />
          <span>Telegram</span>
        </a>
        <a href="https://www.instagram.com/pablogui000/" target="_blank" rel="noreferrer" aria-label="Abrir Instagram @pablogui000" title="Instagram" className="contact-float-link contact-float-instagram group">
          <Instagram className="h-4 w-4" aria-hidden="true" />
          <span>Instagram</span>
        </a>
      </nav>

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

      {lightboxProject?.cover && (
        <div ref={lightboxModalRef} className={`project-lightbox fixed inset-0 z-[75] grid place-items-center bg-[#02050a]/95 p-2 sm:p-4 backdrop-blur-md motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 duration-200 ${lightboxFullscreen ? "lightbox-fullscreen" : ""} ${lightboxClosing ? "lightbox-closing" : ""}`} data-lightbox-modal="true" data-viewport-orientation={viewportOrientation} role="dialog" aria-modal="true" aria-labelledby="project-lightbox-title" aria-describedby="project-lightbox-description" onMouseDown={(event) => { revealShortcutLegend(); if (event.target === event.currentTarget) closeProjectLightbox(); }} onPointerDown={revealShortcutLegend} onFocus={revealShortcutLegend}>
          <div className="relative flex h-[min(92svh,900px)] max-h-[100svh] w-full max-w-6xl flex-col overflow-hidden border border-[#67e8f9]/35 bg-[#07101e] shadow-[0_24px_100px_rgba(0,0,0,0.62)]">
            <button ref={lightboxCloseRef} type="button" onClick={closeProjectLightbox} aria-label="Fechar visualizador de imagem" title="Fechar visualizador" className="absolute right-3 top-3 z-20 grid h-11 w-11 place-items-center border border-white/20 bg-[#060a10]/90 text-white transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-95"><X className="h-5 w-5" aria-hidden="true" /></button>
            <button type="button" onClick={toggleLightboxFullscreen} data-tooltip={lightboxFullscreen ? "Sair da tela cheia" : "Abrir em tela cheia"} aria-label={lightboxFullscreen ? "Sair da tela cheia" : "Abrir visualizador em tela cheia"} title={lightboxFullscreen ? "Sair da tela cheia" : "Abrir em tela cheia"} className="absolute right-16 top-3 z-20 hidden h-11 w-11 place-items-center sm:grid border border-white/20 bg-[#060a10]/90 text-white transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-95"><Maximize2 className="h-5 w-5" aria-hidden="true" /></button>
            <div className="relative flex h-[min(44svh,360px)] min-h-0 flex-none items-center justify-center overflow-hidden bg-[#030812] p-2 sm:h-auto sm:min-h-0 sm:flex-1 sm:p-6">
              {lightboxSwipeDirection && <div className="pointer-events-none absolute inset-x-0 top-1/2 z-30 flex -translate-y-1/2 justify-between px-5" aria-hidden="true"><span className={`grid h-10 w-10 place-items-center rounded-full border border-[#67e8f9]/45 bg-[#06172f]/90 text-[#bdf7ff] shadow-[0_8px_24px_rgba(0,0,0,0.3)] motion-safe:animate-in motion-safe:fade-in ${lightboxSwipeDirection === "previous" ? "opacity-100" : "opacity-30"}`}><ChevronLeft className="h-5 w-5" /></span><span className={`grid h-10 w-10 place-items-center rounded-full border border-[#67e8f9]/45 bg-[#06172f]/90 text-[#bdf7ff] shadow-[0_8px_24px_rgba(0,0,0,0.3)] motion-safe:animate-in motion-safe:fade-in ${lightboxSwipeDirection === "next" ? "opacity-100" : "opacity-30"}`}><ChevronRight className="h-5 w-5" /></span></div>}
              {lightboxFullscreenNotice && <div className="absolute left-1/2 top-3 z-30 -translate-x-1/2 border border-amber-200/35 bg-[#2a1d0b]/95 px-4 py-3 text-center shadow-[0_10px_30px_rgba(0,0,0,0.3)]" role="status" aria-live="polite"><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-amber-100">tela cheia indisponível</p><p className="mt-1 max-w-sm font-body text-xs leading-5 text-amber-50">{lightboxFullscreenNotice}</p></div>}
              {lightboxZoomFeedback !== null && <div className="pointer-events-none absolute left-1/2 top-4 z-30 -translate-x-1/2 border border-[#67e8f9]/40 bg-[#06172f]/95 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-[#bdf7ff] shadow-[0_8px_24px_rgba(0,0,0,0.28)] motion-safe:animate-in motion-safe:fade-in" role="status" aria-live="polite">zoom {lightboxZoomFeedback}%</div>}
              {lightboxZoomLimitFeedback && <div className="pointer-events-none absolute left-1/2 top-16 z-30 -translate-x-1/2 border border-[#67e8f9]/35 bg-[#06172f]/90 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.1em] text-[#bdf7ff] motion-safe:animate-in motion-safe:fade-in" role="status" aria-live="polite">zoom {lightboxZoomLimitFeedback === "max" ? "máximo · 300%" : "mínimo · 100%"}</div>}
              <div className="absolute left-3 top-3 z-20 flex items-center gap-1 border border-white/15 bg-[#06172f]/90 p-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#c8e5f0]" role="group" aria-label="Controles de zoom"><button type="button" onClick={() => setProjectZoom(lightboxZoom - 0.25)} aria-label="Reduzir zoom (mínimo 100%)" className="grid h-11 w-11 place-items-center text-lg transition-colors hover:bg-[#0b2746] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">−</button><span className="min-w-[3.5rem] text-center" aria-live="polite">{Math.round(lightboxZoom * 100)}%</span><button type="button" onClick={() => setProjectZoom(lightboxZoom + 0.25)} aria-label="Aumentar zoom (máximo 300%)" className="grid h-11 w-11 place-items-center text-lg transition-colors hover:bg-[#0b2746] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">+</button><button type="button" onClick={resetProjectZoom} disabled={lightboxZoom === 1} aria-label="Redefinir zoom e posição da imagem" data-tooltip="Redefinir zoom e posição" className="min-h-11 border-l border-white/15 px-2 py-2 text-[8px] transition-colors hover:bg-[#0b2746] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">1:1</button><button type="button" onClick={clearLightboxSessionPreferences} aria-label="Limpar preferência de zoom desta sessão" data-tooltip="Limpar zoom salvo na sessão" className="min-h-11 border-l border-white/15 px-2 py-2 text-[8px] transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">limpar</button></div>
              {showLightboxShortcutLegend && <div className="pointer-events-none absolute bottom-4 left-4 z-20 hidden border border-white/15 bg-[#06172f]/85 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.08em] text-[#b8d9e7] motion-safe:animate-in motion-safe:fade-in sm:block" aria-label="Atalhos do lightbox">atalhos: +/− zoom · setas movem · ←→ navegam</div>}
              <div className="sr-only" aria-live="polite" aria-atomic="true">{lightboxPositionAnnouncement}</div>
              {lightboxZoom > 1 && (() => { const mapPosition = calculateMiniMapPosition(lightboxZoom, lightboxOffset, getPanBounds()); const { left, top, viewportWidth, viewportHeight, xPercent: positionX, yPercent: positionY } = mapPosition; return <div className={`absolute bottom-4 right-4 z-20 hidden h-20 w-28 touch-none overflow-hidden border border-[#67e8f9]/40 bg-[#06172f]/90 shadow-[0_8px_24px_rgba(0,0,0,0.3)] sm:block ${miniMapDragging ? "cursor-grabbing" : "cursor-grab"}`} role="button" tabIndex={0} aria-label={`Mini-mapa interativo da imagem ampliada em ${Math.round(lightboxZoom * 100)}%. Arraste o quadro para reposicionar`} onPointerDown={handleMiniMapPointerDown} onPointerMove={handleMiniMapPointerMove} onPointerUp={handleMiniMapPointerEnd} onPointerCancel={handleMiniMapPointerEnd} onClick={(event) => { if (!miniMapDragRef.current.active) repositionFromMiniMap(event.clientX, event.clientY, event.currentTarget); }} onFocus={revealShortcutLegend} onKeyDown={(event) => { revealShortcutLegend(); if (event.key === "Enter" || event.key === " ") { event.preventDefault(); repositionFromMiniMap(event.currentTarget.getBoundingClientRect().left + event.currentTarget.getBoundingClientRect().width / 2, event.currentTarget.getBoundingClientRect().top + event.currentTarget.getBoundingClientRect().height / 2, event.currentTarget); } }} style={{ backgroundImage: `url(${lightboxProject.cover})`, backgroundPosition: "center", backgroundSize: "cover" }}><span className="absolute border-2 border-[#a5f3fc] bg-[#67e8f9]/20" style={{ left: `${left}%`, top: `${top}%`, width: `${viewportWidth}%`, height: `${viewportHeight}%` }} /><span className="pointer-events-none absolute inset-x-1 bottom-1 bg-[#030812]/85 px-1 py-0.5 text-center font-mono text-[7px] uppercase tracking-[0.08em] text-[#d9fbff]" aria-live="polite">{positionX}% · {positionY}%</span></div>; })()}
              <div ref={lightboxImageContainerRef} className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden">
                {showSwipeHint && <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 border border-[#67e8f9]/30 bg-[#06172f]/90 px-4 py-2 text-center shadow-[0_8px_24px_rgba(0,0,0,0.25)] motion-safe:animate-in motion-safe:fade-in" role="status" aria-live="polite"><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff]">deslize para navegar</span></div>}
                {lightboxImageLoading && !lightboxImageError && <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6" role="status" aria-live="polite"><span className="inline-flex max-w-sm flex-col items-center gap-2 border border-[#67e8f9]/25 bg-[#06172f]/90 px-4 py-3 text-center shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm"><span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff]"><span className="h-3 w-3 animate-spin rounded-full border border-[#67e8f9]/30 border-t-[#a5f3fc] motion-reduce:animate-none" aria-hidden="true" /> carregando imagem</span><strong className="font-display text-lg font-medium tracking-[-0.03em] text-white">{lightboxProject.name}</strong><span className="font-body text-xs leading-5 text-[#b8d9e7]">{lightboxProject.description}</span></span></div>}
                {lightboxImageError && <div className="absolute inset-0 z-10 grid place-items-center px-6 text-center" role="alert"><div className="max-w-sm border border-[#fb7185]/35 bg-[#190f1c]/95 px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.28)]"><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#fda4af]">imagem indisponível</p><p className="mt-2 font-display text-xl font-medium tracking-[-0.03em] text-white">Não conseguimos abrir esta imagem agora.</p><p className="mt-2 font-body text-sm leading-6 text-[#f6d8df]">Você pode tentar novamente ou continuar navegando pelos projetos.</p><button type="button" onClick={() => { setLightboxImageError(false); setLightboxImageLoading(true); setLightboxImageAttempt((attempt) => attempt + 1); }} className="mt-4 border border-[#fda4af]/55 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#ffe4e8] transition-colors hover:bg-[#4b1d2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fda4af]">tentar novamente</button></div></div>}
                <img ref={lightboxImageRef} data-lightbox-image="true" key={`${lightboxProject.id}-${lightboxImageAttempt}`} src={lightboxProject.cover} alt={`Imagem ampliada do projeto ${lightboxProject.name}`} onLoad={() => { setLightboxImageLoading(false); setLightboxImageError(false); }} onError={() => { setLightboxImageLoading(false); setLightboxImageError(true); }} onTouchStart={handleLightboxTouchStart} onTouchMove={handleLightboxTouchMove} onTouchEnd={handleLightboxTouchEnd} onTouchCancel={handleLightboxTouchEnd} onPointerDown={handleLightboxPointerDown} onPointerMove={handleLightboxPointerMove} onPointerUp={handleLightboxPointerEnd} onPointerCancel={handleLightboxPointerEnd} onDoubleClick={() => setProjectZoom(lightboxZoom > 1 ? 1 : 3)} style={{ transform: `translate(${lightboxOffset.x}px, ${lightboxOffset.y}px) scale(${lightboxZoom})`, transformOrigin: "center center", touchAction: "none" }} className={`h-auto max-h-full max-w-full w-auto object-contain ${lightboxZoom > 1 ? (lightboxPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-default"} transition-[transform,opacity] ${lightboxResetting ? "duration-300" : "duration-150"} motion-reduce:transition-none ${lightboxImageLoading || lightboxImageError ? "opacity-0" : "opacity-100"}`} />
              </div>
              <button type="button" onClick={() => { const projectIndex = lightboxProjects.findIndex((repository) => repository.id === lightboxProject.id); const previousProject = lightboxProjects[(projectIndex - 1 + lightboxProjects.length) % lightboxProjects.length]; if (previousProject?.cover) setLightboxProjectId(previousProject.id); }} aria-label="Imagem anterior" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/20 bg-[#06172f]/90 text-white transition-all hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-95 sm:left-6"><ChevronLeft className="h-5 w-5" aria-hidden="true" /></button>
              <button type="button" onClick={() => { const projectIndex = lightboxProjects.findIndex((repository) => repository.id === lightboxProject.id); const nextProject = lightboxProjects[(projectIndex + 1) % lightboxProjects.length]; if (nextProject?.cover) setLightboxProjectId(nextProject.id); }} aria-label="Próxima imagem" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/20 bg-[#06172f]/90 text-white transition-all hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-95 sm:right-6"><ChevronRight className="h-5 w-5" aria-hidden="true" /></button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
            <div className="shrink-0 flex flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-7">
              <div className="min-w-0"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">arquivo / imagem ampliada</p><h2 id="project-lightbox-title" className="mt-1 break-words font-display text-2xl font-medium tracking-[-0.04em] text-white [overflow-wrap:anywhere]">{lightboxProject.name}</h2><p id="project-lightbox-description" className="mt-2 max-w-2xl break-words font-body text-sm leading-6 text-[#c8e5f0] [overflow-wrap:anywhere]">{lightboxProject.description}</p></div>
              <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
                <button type="button" data-lightbox-image-favorite="true" onClick={() => toggleFavoriteImage(lightboxProject.id)} aria-pressed={favoriteImageIdSet.has(lightboxProject.id)} aria-label={favoriteImageIdSet.has(lightboxProject.id) ? `Remover imagem de ${lightboxProject.name} da coleção pessoal` : `Salvar imagem de ${lightboxProject.name} na coleção pessoal`} title={favoriteImageIdSet.has(lightboxProject.id) ? "Remover imagem da coleção pessoal" : "Salvar imagem na coleção pessoal"} className={`inline-flex min-h-11 items-center gap-2 border px-3 font-mono text-[8px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97] ${favoriteImageIdSet.has(lightboxProject.id) ? "border-[#67e8f9] bg-[#0b3156] text-[#bdf7ff]" : "border-white/15 bg-[#06172f]/80 text-[#c8e5f0] hover:bg-[#0b2746] hover:text-white"}`}><Heart className={`h-3.5 w-3.5 ${favoriteImageIdSet.has(lightboxProject.id) ? "fill-current" : ""}`} aria-hidden="true" /><span className="hidden sm:inline">{favoriteImageIdSet.has(lightboxProject.id) ? "imagem salva" : "salvar imagem"}</span></button>
                <div className="inline-flex border border-white/15 bg-[#06172f]/80" role="group" aria-label="Compartilhar projeto">
                  <button type="button" data-tooltip="Compartilhar usando o menu do seu dispositivo" onClick={shareLightboxProject} className="inline-flex min-h-11 items-center gap-2 px-3 font-mono text-[8px] uppercase tracking-[0.1em] text-[#c8e5f0] transition-colors hover:bg-[#0b2746] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]" aria-label="Compartilhar projeto"><Share2 className="h-3.5 w-3.5" aria-hidden="true" /><span className="hidden sm:inline">compartilhar</span></button>
                </div>
                <details data-lightbox-more-actions="true" className="group relative col-span-full sm:contents"><summary className="inline-flex min-h-11 w-full cursor-pointer list-none items-center justify-center gap-2 border border-white/15 bg-[#06172f]/80 px-3 font-mono text-[8px] uppercase tracking-[0.1em] text-[#c8e5f0] transition-colors hover:bg-[#0b2746] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:hidden"><span>mais ações</span><ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180" aria-hidden="true" /></summary><div className="hidden gap-2 group-open:grid sm:flex sm:flex-wrap sm:justify-end">
                  <details className="relative"><summary data-tooltip="Escolha original, WebP ou AVIF otimizado" title="Escolha original, WebP ou AVIF otimizado" className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 border border-white/15 bg-[#06172f]/80 px-3 font-mono text-[8px] uppercase tracking-[0.1em] text-[#c8e5f0] transition-colors hover:bg-[#0b2746] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Download className="h-3.5 w-3.5" aria-hidden="true" /><span>baixar imagem</span></summary><div className="absolute right-0 top-11 z-30 min-w-44 border border-white/15 bg-[#07101e] p-1 shadow-[0_14px_35px_rgba(0,0,0,0.35)]"><button type="button" onClick={() => downloadLightboxImage("original")} aria-label={`Baixar imagem original de ${lightboxProject.name}`} className="block min-h-11 w-full px-3 py-2 text-left font-mono text-[8px] uppercase tracking-[0.1em] text-[#c8e5f0] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">original</button><button type="button" onClick={() => downloadLightboxImage("webp")} aria-label={`Baixar ${lightboxProject.name} em WebP otimizado`} disabled={!optimizedLightboxImages[lightboxProject.cover]?.webp} className="block min-h-11 w-full px-3 py-2 text-left font-mono text-[8px] uppercase tracking-[0.1em] text-[#c8e5f0] hover:bg-[#0b2746] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">WebP otimizado</button><button type="button" onClick={() => downloadLightboxImage("avif")} aria-label={`Baixar ${lightboxProject.name} em AVIF otimizado`} disabled={!optimizedLightboxImages[lightboxProject.cover]?.avif} className="block min-h-11 w-full px-3 py-2 text-left font-mono text-[8px] uppercase tracking-[0.1em] text-[#c8e5f0] hover:bg-[#0b2746] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">AVIF otimizado</button></div></details>
                  <button type="button" data-tooltip={lightboxCopiedAction === "link" ? "Link copiado" : "Copiar link do projeto"} onClick={copyLightboxProjectLink} className="inline-flex min-h-11 items-center gap-2 border border-white/15 bg-[#06172f]/80 px-3 text-[#c8e5f0] transition-colors hover:bg-[#0b2746] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]" aria-label="Copiar link do projeto" title={lightboxCopiedAction === "link" ? "Copiado!" : "Copiar link"}><Copy className="h-3.5 w-3.5" aria-hidden="true" /><span>{lightboxCopiedAction === "link" ? "Copiado!" : "copiar link"}</span></button>
                  <button type="button" data-tooltip={lightboxCopiedAction === "context" ? "Link e legenda copiados" : "Copiar link e legenda expandida"} onClick={copyLightboxProjectContext} className="inline-flex min-h-11 items-center gap-2 border border-white/15 bg-[#06172f]/80 px-3 font-mono text-[8px] uppercase tracking-[0.1em] text-[#c8e5f0] transition-colors hover:bg-[#0b2746] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]" aria-label="Copiar link e legenda expandida" title={lightboxCopiedAction === "context" ? "Copiado!" : "Copiar link e legenda"}><Copy className="h-3.5 w-3.5" aria-hidden="true" /><span>{lightboxCopiedAction === "context" ? "Copiado!" : "copiar contexto"}</span></button>
                  <button type="button" data-tooltip="Abrir o WhatsApp com o link do projeto" onClick={shareLightboxToWhatsApp} disabled={Boolean(lightboxRedirectingChannel)} className="inline-flex min-h-11 items-center gap-2 border border-[#25d366]/35 bg-[#07351f]/70 px-3 font-mono text-[8px] uppercase tracking-[0.1em] text-[#b8ffd0] transition-colors hover:bg-[#0b5d35] disabled:cursor-wait disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]" aria-label="Compartilhar projeto no WhatsApp" title="Abrir o WhatsApp com o link deste projeto"><MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /><span>{lightboxRedirectingChannel === "whatsapp" ? "Redirecionando..." : "WhatsApp"}</span></button>
                  <button type="button" data-tooltip="Abrir o LinkedIn para compartilhar o projeto" onClick={shareLightboxToLinkedIn} disabled={Boolean(lightboxRedirectingChannel)} className="inline-flex min-h-11 items-center gap-2 border border-[#70a9e8]/35 bg-[#092545]/80 px-3 font-mono text-[8px] uppercase tracking-[0.1em] text-[#c8e1ff] transition-colors hover:bg-[#123e70] disabled:cursor-wait disabled:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]" aria-label="Compartilhar projeto no LinkedIn" title="Abrir o LinkedIn com o link deste projeto"><Linkedin className="h-3.5 w-3.5" aria-hidden="true" /><span>{lightboxRedirectingChannel === "linkedin" ? "Redirecionando..." : "LinkedIn"}</span></button>
                  <button type="button" data-tooltip={lightboxEmailStatus === "opening" ? "Abrindo e-mail..." : "Abrir um e-mail com assunto e detalhes preenchidos"} onClick={shareLightboxByEmail} disabled={lightboxEmailStatus === "opening"} className="inline-flex min-h-11 items-center gap-2 border border-white/15 bg-[#06172f]/80 px-3 font-mono text-[8px] uppercase tracking-[0.1em] text-[#c8e5f0] transition-colors hover:bg-[#0b2746] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]" aria-label="Compartilhar projeto por e-mail" title="Abrir e-mail com detalhes do projeto"><Mail className="h-3.5 w-3.5" aria-hidden="true" /><span>{lightboxEmailStatus === "opening" ? "Abrindo e-mail..." : "e-mail"}</span></button>
                  <span role="status" aria-live="polite" className="sr-only">{lightboxEmailStatus === "opening" ? "Abrindo e-mail..." : lightboxRedirectingChannel ? `Redirecionando para ${lightboxRedirectingChannel === "whatsapp" ? "o WhatsApp" : "o LinkedIn"}...` : lightboxShareStatus === "copied" ? "Link e contexto copiados." : lightboxShareStatus === "shared" ? "Projeto compartilhado." : lightboxShareStatus === "error" ? "Não foi possível compartilhar o projeto." : ""}</span>
                </div></details>
                <div className="shrink-0 font-mono text-[9px] uppercase tracking-[0.12em] text-[#9eb5d2]">{lightboxProjects.findIndex((repository) => repository.id === lightboxProject.id) + 1} / {lightboxProjects.length}</div>
              </div>
            </div>
            <button type="button" data-lightbox-mobile-details-toggle="true" onClick={() => setShowLightboxMobileDetails((open) => !open)} aria-expanded={showLightboxMobileDetails} className="flex min-h-11 w-full items-center justify-between border-t border-white/10 bg-[#06101e] px-5 py-3 text-left font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a5f3fc] sm:hidden"><span>{showLightboxMobileDetails ? "ocultar contexto e miniaturas" : "ver contexto e miniaturas"}</span><ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showLightboxMobileDetails ? "rotate-180" : ""}`} aria-hidden="true" /></button>
            <section className={`${showLightboxMobileDetails ? "block" : "hidden"} sm:block border-t border-white/10 bg-[#06101e] px-5 py-4 sm:px-7`} aria-label={`Legenda expandida de ${lightboxProject.name}`}><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">leitura do projeto</p><div className="mt-3 grid gap-4 sm:grid-cols-3"><div><p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#87b8c9]">papel</p><p className="mt-1 font-body text-xs leading-5 text-[#c8e5f0]">{lightboxProject.role || "Informação não registrada."}</p></div><div><p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#87b8c9]">processo</p><p className="mt-1 font-body text-xs leading-5 text-[#c8e5f0]">{lightboxProject.process || "Informação não registrada."}</p></div><div><p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#87b8c9]">resultado</p><p className="mt-1 font-body text-xs leading-5 text-[#c8e5f0]">{lightboxProject.result || "Informação não registrada."}</p></div></div></section>
            {lightboxProject.technologies.includes("Interface") && (lightboxComparison ? <section className="border-t border-white/10 bg-[#050b15] px-5 py-4 sm:px-7" aria-label={`Comparação antes e depois de ${lightboxProject.name}`}><div className="flex items-end justify-between gap-3"><div><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">comparação visual</p><p className="mt-1 font-body text-xs text-[#c8e5f0]">Arraste o controle para comparar antes e depois.</p></div><span className="font-mono text-[9px] text-[#9eb5d2]">{lightboxComparisonPosition}%</span></div><div className="relative mt-3 aspect-video overflow-hidden border border-white/15 bg-[#030812]"><img src={lightboxComparison.before} alt="Antes" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-y-0 left-0 overflow-hidden" style={{ width: `${lightboxComparisonPosition}%` }}><img src={lightboxComparison.after} alt="Depois" className="h-full w-full max-w-none object-cover" style={{ width: `${100 / (lightboxComparisonPosition / 100)}%` }} /></div><span className="pointer-events-none absolute left-3 top-3 bg-[#030812]/80 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-white">antes / depois</span><input type="range" min="0" max="100" value={lightboxComparisonPosition} onChange={(event) => setLightboxComparisonPosition(Number(event.target.value))} aria-label="Posição da comparação antes e depois" className="absolute inset-x-3 bottom-3 z-10 accent-[#67e8f9]" /></div></section> : <section className="border-t border-white/10 bg-[#050b15] px-5 py-4 sm:px-7" aria-label="Comparação antes e depois indisponível"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">comparação visual</p><p className="mt-2 font-body text-xs leading-5 text-[#9fb7ca]">Este projeto ainda não possui um par antes/depois real publicado. O comparador será habilitado quando as duas imagens estiverem disponíveis.</p></section>)}
            <div className={`${showLightboxMobileDetails ? "block" : "hidden"} sm:block shrink-0 border-t border-white/10 bg-[#050b15] px-4 py-3 sm:px-6`} role="group" aria-label="Miniaturas dos projetos">
              <div className="flex gap-2 overflow-x-auto pb-1" role="list">
                {lightboxProjects.map((project) => {
                  const isActive = project.id === lightboxProject.id;
                  return <button key={`lightbox-thumb-${project.id}`} ref={isActive ? lightboxActiveThumbRef : undefined} type="button" onClick={() => setLightboxProjectId(project.id)} aria-current={isActive ? "true" : undefined} aria-label={`Ver imagem de ${project.name}`} title={project.name} className={`group relative w-24 shrink-0 overflow-hidden border text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.98] sm:w-28 ${isActive ? "border-[#67e8f9] shadow-[0_0_0_1px_rgba(103,232,249,0.4)]" : "border-white/15 opacity-65 hover:border-[#67e8f9]/70 hover:opacity-100"}`} role="listitem"><img src={project.cover} alt={`Miniatura do projeto ${project.name}`} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" /><span className={`absolute inset-x-0 bottom-0 truncate bg-[#030812]/85 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.08em] ${isActive ? "text-[#bdf7ff]" : "text-[#c1d1e5]"}`}>{project.name}</span></button>;
                })}
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={Boolean(selectedProject)} onOpenChange={(open) => { if (!open) setSelectedProject(null); }}>
        {selectedProject && (
          <DialogContent data-project-details-dialog="true" data-project-details-transition={projectDetailsTransition ?? "idle"} aria-modal="true" aria-busy={projectDetailsLoading} onTouchStart={handleProjectDetailsTouchStart} onTouchEnd={handleProjectDetailsTouchEnd} className={`touch-pan-y w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] sm:max-w-3xl h-[calc(100svh-1rem)] min-h-0 max-h-[calc(100svh-1rem)] overflow-x-hidden overflow-y-auto overscroll-contain border-[#3b82f6]/30 bg-[#071326] p-0 text-[#e6f2ff] shadow-[0_24px_90px_rgba(0,0,0,0.6)] transition-[opacity,transform] duration-260 motion-reduce:transition-none ${projectDetailsTransition === "next" ? "translate-x-1 opacity-90" : projectDetailsTransition === "previous" ? "-translate-x-1 opacity-90" : "translate-x-0 opacity-100"}`}>
            {projectDetailsLoading && <div data-project-details-loading="true" role="status" aria-live="polite" className="pointer-events-none absolute inset-x-0 top-0 z-20 grid gap-3 border-b border-[#67e8f9]/20 bg-[#071326]/90 p-4 backdrop-blur-sm sm:p-8"><div className="h-2 w-28 animate-pulse bg-[#3b82f6]/35" /><div className="h-9 w-4/5 animate-pulse bg-white/10" /><div className="h-3 w-full animate-pulse bg-white/10" /><div className="h-3 w-2/3 animate-pulse bg-white/10" /><span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#9fc6e9]">carregando projeto…</span></div>}
            {showProjectSwipeHint && <div data-project-swipe-hint="true" className="pointer-events-none absolute inset-x-4 top-4 z-30 flex justify-center sm:hidden" role="status" aria-live="polite"><span className="border border-[#67e8f9]/35 bg-[#06172f]/95 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff] shadow-[0_10px_28px_rgba(0,0,0,0.3)]">deslize para navegar</span></div>}
            {selectedProject.kind === "video" && <div className="relative bg-black"><video className="block h-auto max-h-[38svh] w-full max-w-full bg-black object-contain sm:max-h-[42svh]" src={selectedProject.url} poster={selectedProject.cover} controls autoPlay playsInline preload="metadata" onLoadedData={(event) => { event.currentTarget.play().catch(() => setProjectVideoNeedsPlay(true)); }} onPlay={() => setProjectVideoNeedsPlay(false)}>Seu navegador não oferece suporte à reprodução audiovisual.</video>{projectVideoNeedsPlay && <button type="button" data-project-video-play="true" onClick={(event) => { const video = event.currentTarget.parentElement?.querySelector("video"); video?.play().then(() => setProjectVideoNeedsPlay(false)).catch(() => setProjectVideoNeedsPlay(true)); }} className="absolute left-1/2 top-1/2 inline-flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 border border-[#a5f3fc]/55 bg-[#06172f]/90 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-colors hover:border-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Play className="h-4 w-4" aria-hidden="true" />tocar vídeo</button>}</div>}
            {selectedProject.kind !== "video" && selectedProject.cover && <img src={selectedProject.cover} alt={`Imagem do projeto ${selectedProject.name}`} width="1200" height="800" className="max-h-[38svh] w-full max-w-full object-cover sm:max-h-[42svh]" />}
            <div className="min-h-0 min-w-0 overflow-x-hidden p-4 sm:p-8">
              <DialogHeader className="min-w-0 text-left">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#60a5fa]">{selectedProject.kind === "video" ? "projeto audiovisual" : "projeto em destaque"}</p>
                <DialogTitle className="mt-2 break-words font-display text-3xl font-medium tracking-[-0.05em] text-white [overflow-wrap:anywhere]">{selectedProject.name}</DialogTitle>
                <DialogDescription className="mt-3 max-w-2xl break-words font-body text-sm leading-6 text-[#c4d9ee] [overflow-wrap:anywhere]">{selectedProject.description}</DialogDescription>
                <div className="mt-5 grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
                  <button type="button" data-project-modal-favorite="true" onClick={(event) => toggleFavorite(selectedProject.id, event)} aria-pressed={favoriteProjectIdSet.has(selectedProject.id)} aria-label={favoriteProjectIdSet.has(selectedProject.id) ? `Remover ${selectedProject.name} dos projetos salvos` : `Salvar ${selectedProject.name} nos projetos favoritos`} className={`inline-flex min-h-11 items-center gap-2 self-start border px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97] ${favoriteProjectIdSet.has(selectedProject.id) ? "border-[#67e8f9] bg-[#0b3156] text-[#e5fbff]" : "border-[#3b82f6]/35 text-[#cfe3ff] hover:border-[#70a6ff] hover:text-white"}`}><Heart className={`h-4 w-4 ${favoriteProjectIdSet.has(selectedProject.id) ? "fill-current" : ""}`} aria-hidden="true" />{favoriteProjectIdSet.has(selectedProject.id) ? "salvo nos favoritos" : "salvar nos favoritos"}</button>
                  <button type="button" data-project-modal-share="true" onClick={shareSelectedProject} aria-label={`Copiar link direto de ${selectedProject.name}`} className="inline-flex min-h-11 items-center gap-2 border border-[#3b82f6]/35 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#70a6ff] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]"><Share2 className="h-4 w-4" aria-hidden="true" />{projectShareStatus === "copied" ? "link copiado" : projectShareStatus === "error" ? "tentar novamente" : "compartilhar projeto"}</button>
                  <button type="button" data-project-modal-copy-link="true" onClick={copySelectedProjectLink} aria-label={`Copiar link de ${selectedProject.name}`} className="inline-flex min-h-11 items-center gap-2 border border-[#67e8f9]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]"><Copy className="h-4 w-4" aria-hidden="true" />{projectCopyStatus === "copied" ? "link copiado" : projectCopyStatus === "error" ? "tentar novamente" : "copiar link"}</button>
                  {selectedProject.kind !== "video" && <a href={selectedProject.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-2 border border-[#67e8f9]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]"><ArrowUpRight className="h-4 w-4" aria-hidden="true" />abrir projeto</a>}
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
