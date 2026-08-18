/**
 * Design: Arquivo Luminoso — editorial técnico em azul celeste vibrante e azul profundo.
 * A página transforma a trajetória de Pablo em capítulos assimétricos, com
 * metadados, linha de progresso e linguagem visual de arquivo em evolução.
 */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { calculateMiniMapPosition, calculatePinchZoom, formatMiniMapPositionAnnouncement, getCancelledInteractionState, getViewportOrientation } from "@/lib/lightboxInteractions";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
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
  MapPin,
  Menu,
  Maximize2,
  MessageCircle,
  Play,
  Search,
  Send,
  Share2,
  Moon,
  Sun,
  Volume2,
  VolumeX,
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
import {
  availableTimes,
  buildAvailabilityWhatsAppUrl,
  calendarWeekdays,
  formatAvailabilityDate,
  getAvailabilityButtonLabel,
  isAvailabilityConsultationReady,
  isSelectableAvailabilityDate,
  toDateKey,
} from "@/lib/availability";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import PortfolioFooter from "@/features/portfolio/components/PortfolioFooter";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { exportFavoriteProjects, type FavoriteExportFormat } from "@/features/portfolio/utils/exportFavorites";
import { buildFavoritesShareUrl, buildLightboxContext, buildLightboxEmailPayload, buildLightboxShareUrl, buildProjectShareUrl } from "@/features/portfolio/utils/shareProject";
import { copyTextWithFeedback } from "@/features/portfolio/utils/clipboardFeedback";
import { useNearViewport } from "@/features/portfolio/hooks/useNearViewport";
import {
  caseStudies,
  categoryFilters,
  comparisonPairs,
  optimizedLightboxImages,
  predefinedOrderProfiles,
  processSteps,
  repertoireSignals,
  repositories,
  serviceOffers,
  skillTracks,
  sortOptions,
  tagFilters,
  technologyFilters,
  type ManualOrderProfile,
  type Repository,
} from "@/features/portfolio/portfolioData";
const InstagramRepertoire = lazy(() => import("@/features/social/InstagramRepertoire"));

const markUrl = "/manus-storage/pablo-pg-mark_3a636084.png";
const heroUrl = "/manus-storage/pablo-hero-archive_fbc55c04.png";
const heroResponsive = {
  avif: "/manus-storage/pablo-hero-archive-480w_e40b1df5.avif 480w, /manus-storage/pablo-hero-archive-768w_5499edae.avif 768w, /manus-storage/pablo-hero-archive-1200w_862455f5.avif 1200w, /manus-storage/pablo-hero-archive-1600w_1c356f9e.avif 1600w, /manus-storage/pablo-hero-archive-1920w_64ab699e.avif 1920w",
  webp: "/manus-storage/pablo-hero-archive-480w_b3b1574d.webp 480w, /manus-storage/pablo-hero-archive-768w_cd8f428d.webp 768w, /manus-storage/pablo-hero-archive-1200w_b0307ff4.webp 1200w, /manus-storage/pablo-hero-archive-1600w_d789da48.webp 1600w, /manus-storage/pablo-hero-archive-1920w_19e9d0c3.webp 1920w",
};
const textureUrl = "/manus-storage/pablo-systems-texture_cf9aade1.png";
const textureResponsive = {
  avif: "/manus-storage/pablo-systems-texture-480w_5a6395b2.avif 480w, /manus-storage/pablo-systems-texture-768w_8d43ab9a.avif 768w, /manus-storage/pablo-systems-texture-1200w_bd814e99.avif 1200w, /manus-storage/pablo-systems-texture-1600w_37d28a1c.avif 1600w, /manus-storage/pablo-systems-texture-1920w_743d3758.avif 1920w",
  webp: "/manus-storage/pablo-systems-texture-480w_ec71c815.webp 480w, /manus-storage/pablo-systems-texture-768w_c701324d.webp 768w, /manus-storage/pablo-systems-texture-1200w_4041e6bf.webp 1200w, /manus-storage/pablo-systems-texture-1600w_c56f3109.webp 1600w, /manus-storage/pablo-systems-texture-1920w_89c6d1bd.webp 1920w",
};
const portraitUrl = "/manus-storage/pablo-guilherme-retrato-profissional_a0ec8605.png";
const portraitResponsive = {
  avif: "/manus-storage/pablo-retrato-480w_72345227.avif 480w, /manus-storage/pablo-retrato-768w_02bb45b0.avif 768w, /manus-storage/pablo-retrato-1200w_e67ca5a8.avif 1200w, /manus-storage/pablo-retrato-1600w_09cf51fa.avif 1600w, /manus-storage/pablo-retrato-1664w_a3e67f83.avif 1664w",
  webp: "/manus-storage/pablo-retrato-480w_d51f7f1b.webp 480w, /manus-storage/pablo-retrato-768w_b05571cc.webp 768w, /manus-storage/pablo-retrato-1200w_00268506.webp 1200w, /manus-storage/pablo-retrato-1600w_ad3a0976.webp 1600w, /manus-storage/pablo-retrato-1664w_fe47542b.webp 1664w",
};
const resumeUrl = "/manus-storage/curriculo-pablo-guilherme-profissional_1b06376f.pdf";
const whatsAppNumber = "5561992903029";
const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=Olá%2C%20Pablo%21%20Vim%20pelo%20portfólio%20e%20gostaria%20de%20solicitar%20um%20orçamento.`;
const telegramUrl = "https://t.me/mpjmarketing";
const showreelUrl = "/manus-storage/showreel_e887bf6f.mp4";
const showreelPosterUrl = "/manus-storage/showreel-poster_847cd0c5.jpg";
const showreelPosterResponsive = {
  avif: "/manus-storage/showreel-poster-480w_409a88d2.avif 480w, /manus-storage/showreel-poster-768w_e6e5d093.avif 768w, /manus-storage/showreel-poster-1200w_b3315973.avif 1200w, /manus-storage/showreel-poster-1280w_54c3532c.avif 1280w",
  webp: "/manus-storage/showreel-poster-480w_5c84b53c.webp 480w, /manus-storage/showreel-poster-768w_c3e4972b.webp 768w, /manus-storage/showreel-poster-1200w_876a4b83.webp 1200w, /manus-storage/showreel-poster-1280w_cab44748.webp 1280w",
};
const showreelVerticalUrl = "/manus-storage/showreel-vertical_00d4c92f.mp4";
const showreelVerticalPosterUrl = "/manus-storage/showreel-vertical-poster_e21c73f9.jpg";
const showreelVerticalPosterResponsive = {
  avif: "/manus-storage/showreel-vertical-poster-480w_e4656a6a.avif 480w, /manus-storage/showreel-vertical-poster-720w_7e009499.avif 720w",
  webp: "/manus-storage/showreel-vertical-poster-480w_092fa9d6.webp 480w, /manus-storage/showreel-vertical-poster-720w_d90358f3.webp 720w",
};

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
  ["manifesto", "#sobre", "sobre"],
  ["atuação", "#trilha", "trilha"],
  ["serviços", "#servicos", "servicos"],
  ["trabalhos", "#projetos", "projetos"],
  ["social", "#social", "social"],
] as const;

export default function Home() {
  const { theme, preference, setPreference, toggleTheme } = useTheme();
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [socialSectionRef, shouldLoadSocial] = useNearViewport<HTMLDivElement>();
  const [availabilitySectionRef, shouldLoadAvailability] = useNearViewport<HTMLDivElement>();
  const [showreelSectionRef, shouldLoadShowreelPoster] = useNearViewport<HTMLDivElement>("0px");
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
  const [showreelRequested, setShowreelRequested] = useState(false);
  const [showreelReady, setShowreelReady] = useState(false);
  const [showreelError, setShowreelError] = useState(false);
  const [showreelPlaying, setShowreelPlaying] = useState(false);
  const [showreelMuted, setShowreelMuted] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("inicio");
  const [isDesktopViewport, setIsDesktopViewport] = useState(() => typeof window === "undefined" ? true : window.matchMedia("(min-width: 768px)").matches);
  const [formSent, setFormSent] = useState(false);
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
  const [sharedProjectIds, setSharedProjectIds] = useState<string[] | null>(null);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle");
  const [projectShareStatus, setProjectShareStatus] = useState<"idle" | "copied" | "error">("idle");
  const [projectCopyStatus, setProjectCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [projectDetailsLoading, setProjectDetailsLoading] = useState(false);
  const [projectVideoNeedsPlay, setProjectVideoNeedsPlay] = useState(false);
  const [showProjectSwipeHint, setShowProjectSwipeHint] = useState(false);
  const [isBriefingFieldFocused, setIsBriefingFieldFocused] = useState(false);
  const [isMobileKeyboardOpen, setIsMobileKeyboardOpen] = useState(false);
  const [isHeroCtaVisible, setIsHeroCtaVisible] = useState(() => typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches);
  const [favoriteExportStatus, setFavoriteExportStatus] = useState<"idle" | "csv" | "json" | "pdf" | "error">("idle");
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
  const briefingStartedRef = useRef(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const resumePreviewCloseRef = useRef<HTMLButtonElement>(null);
  const resumePreviewReturnFocusRef = useRef<HTMLElement | null>(null);
  const showreelVideoRef = useRef<HTMLVideoElement>(null);
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
  const [availabilityDate, setAvailabilityDate] = useState<Date | null>(null);
  const [availabilityTime, setAvailabilityTime] = useState<string | null>(null);
  const [isAvailabilityRedirecting, setIsAvailabilityRedirecting] = useState(false);
  const today = new Date();
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const successMessageRef = useRef<HTMLDivElement>(null);
  const projectFilterTimerRef = useRef<number | null>(null);
  const galleryLoadingTimerRef = useRef<number | null>(null);
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
  } = trpc.availability.listBlocked.useQuery(undefined, { enabled: shouldLoadAvailability });

  const normalizedProjectSearch = normalizeSearchText(projectSearch);
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
      const matchesSearch = !normalizedProjectSearch || searchableProjectText.includes(normalizedProjectSearch);
      const matchesFavorites = !favoritesOnly || (sharedProjectIds ? sharedProjectIdSet.has(repository.id) : favoriteProjectIdSet.has(repository.id));
      return matchesTechnology && matchesCategory && matchesTag && matchesSearch && matchesFavorites;
    })
    .sort((first, second) => sortMode === "manual" ? 0 : sortMode === "added" ? second.addedOrder - first.addedOrder : second.relevance - first.relevance);
  const displayedRepositories = visibleRepositories.slice(0, visibleProjectLimit);
  const selectedProjectIndex = selectedProject ? visibleRepositories.findIndex((repository) => repository.id === selectedProject.id) : -1;
  const previousSelectedProject = selectedProjectIndex > 0 ? visibleRepositories[selectedProjectIndex - 1] : null;
  const nextSelectedProject = selectedProjectIndex >= 0 && selectedProjectIndex < visibleRepositories.length - 1 ? visibleRepositories[selectedProjectIndex + 1] : null;
  const featuredRepositories = useMemo(() => repositories.filter((repository) => repository.featured || repository.relevance >= 80).sort((first, second) => second.relevance - first.relevance).slice(0, 3), []);
  const hasMoreRepositories = visibleRepositories.length > visibleProjectLimit;
  const projectPageSize = 4;
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const blockedDateKeys = useMemo(() => new Set(blockedDates.map((blockedDate) => blockedDate.dateKey)), [blockedDates]);
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const leadingDays = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const calendarDays = Array.from({ length: leadingDays + daysInMonth }, (_, index) => index < leadingDays ? null : new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index - leadingDays + 1));
  const selectedDateLabel = availabilityDate ? formatAvailabilityDate(availabilityDate) : "";
  const selectedDateKey = availabilityDate ? toDateKey(availabilityDate) : "";
  const availabilityWhatsAppUrl = availabilityDate && availabilityTime
    ? buildAvailabilityWhatsAppUrl(whatsAppNumber, availabilityDate, availabilityTime)
    : "";
  const isAvailabilityConsultationReadyForUser = isAvailabilityConsultationReady(availabilityDate, availabilityTime, isBlockedDatesError);

  useEffect(() => {
    setVisibleProjectLimit(projectPageSize);
  }, [activeTechnology, activeCategory, activeTag, sortMode, normalizedProjectSearch, favoritesOnly, favoriteProjectIds, sharedProjectIds]);

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

  useEffect(() => {
    if (isBlockedDatesError || (availabilityDate && blockedDateKeys.has(toDateKey(availabilityDate)))) {
      setAvailabilityDate(null);
      setAvailabilityTime(null);
    }
  }, [availabilityDate, blockedDateKeys, isBlockedDatesError]);

  useEffect(() => () => {
    if (projectFilterTimerRef.current) window.clearTimeout(projectFilterTimerRef.current);
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
    setFavoriteProjectIds((current) => current.includes(projectId) ? current.filter((id) => id !== projectId) : [...current, projectId]);
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
    try {
      await navigator.clipboard.writeText(shareUrl);
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
    setFavoriteExportStatus(format);
    try {
      await exportFavoriteProjects(format, favoriteProjects, getRepositoryCategories);
    } catch {
      setFavoriteExportStatus("error");
      favoriteExportTimerRef.current = window.setTimeout(() => setFavoriteExportStatus("idle"), 4000);
      return;
    }
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

  function consultAvailabilityOnWhatsApp() {
    if (!availabilityWhatsAppUrl || isAvailabilityRedirecting || isBlockedDatesError) return;

    setIsAvailabilityRedirecting(true);
    trackPortfolioEvent("whatsapp_click", { source: "availability" });
    window.setTimeout(() => {
      const whatsappWindow = window.open(availabilityWhatsAppUrl, "_blank", "noopener,noreferrer");
      if (!whatsappWindow) {
        window.location.assign(availabilityWhatsAppUrl);
      }
      setIsAvailabilityRedirecting(false);
    }, 240);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const eventDate = String(data.get("date") || "");
    setFormError(null);
    setFormSent(false);
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

  function trackBriefingStarted() {
    if (briefingStartedRef.current) return;
    briefingStartedRef.current = true;
    trackPortfolioEvent("briefing_started");
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
            <button type="button" data-theme-toggle="true" onClick={() => toggleTheme?.()} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} aria-pressed={theme === "dark"} title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} className="grid h-9 w-9 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">{theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}</button>
            <a href={resumeUrl} onClick={openResumePreview} data-resume-header="true" aria-haspopup="dialog" aria-label="Visualizar portfólio atualizado em PDF" title="Visualizar portfólio em PDF" className="resume-header-cta inline-flex items-center gap-2 border border-[#67e8f9] bg-[#0b2746] px-3 py-2 text-[10px] font-mono font-semibold uppercase tracking-[0.1em] text-[#d9fbff] transition-all hover:bg-[#123b67] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
              <Download className="h-3.5 w-3.5" aria-hidden="true" /> <span>portfólio PDF</span>
            </a>
            <a href="#contato" className="inline-flex items-center gap-2 border border-[#67e8f9] bg-[#38bdf8] px-4 py-2 text-[11px] font-mono font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-all hover:bg-[#a5f3fc] hover:shadow-[0_0_28px_rgba(56,189,248,0.36)]">
              contato <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="grid h-10 w-10 place-items-center border border-white/10 text-[#d8e6fa] md:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <button type="button" data-theme-toggle="true" onClick={() => toggleTheme?.()} aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} aria-pressed={theme === "dark"} title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"} className="grid h-10 w-10 place-items-center border border-white/10 text-[#d8e6fa] transition-colors hover:border-[#67e8f9] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] md:hidden">{theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}</button>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="max-h-[calc(100svh-76px)] overflow-y-auto overscroll-contain border-t border-white/[0.07] bg-[#090d16] px-5 py-5 md:hidden" aria-label="Navegação móvel">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-1 sm:px-3">
              {[
                ["01 / manifesto", "#sobre", "sobre"],
                ["02 / atuação", "#trilha", "trilha"],
                ["03 / serviços", "#servicos", "servicos"],
                ["04 / trabalhos", "#projetos", "projetos"],
                ["05 / contato", "#contato", "contato"],
              ].map(([label, href, id]) => (
                <a key={label} href={href} onClick={closeMenu} aria-current={activeSection === id ? "location" : undefined} className={`min-h-12 border-b border-white/[0.07] py-3 font-mono text-xs uppercase tracking-[0.12em] transition-colors hover:bg-[#0b2746] hover:text-white focus-visible:bg-[#0b2746] focus-visible:text-white ${activeSection === id ? "bg-[#0b2746] text-[#67e8f9]" : "text-[#b7cdf1]"}`}>
                  {label}
                </a>
              ))}
              <a href={resumeUrl} onClick={openResumePreview} data-resume-header="true" aria-haspopup="dialog" aria-label="Visualizar portfólio atualizado em PDF" className="resume-header-cta mt-3 inline-flex min-h-12 items-center justify-center gap-3 border border-[#67e8f9] bg-[#0b2746] px-3 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#d9fbff] transition-colors hover:bg-[#123b67] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Download className="h-4 w-4" aria-hidden="true" /> baixar portfólio PDF</a>
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
        <section id="inicio" className="relative isolate min-h-[680px] overflow-hidden pt-[76px] sm:min-h-[850px]">
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-70" />
          <picture className="pointer-events-none absolute inset-y-0 right-0 block w-full opacity-70 lg:w-[72%]"><source type="image/avif" srcSet={heroResponsive.avif} sizes="(min-width: 1024px) 72vw, 100vw" /><source type="image/webp" srcSet={heroResponsive.webp} sizes="(min-width: 1024px) 72vw, 100vw" /><img src={heroUrl} alt="" width="1920" height="1080" loading="eager" fetchPriority="high" decoding="async" className="h-full w-full object-cover object-center" /></picture>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-full bg-[linear-gradient(90deg,#07111f_5%,rgba(7,17,31,0.96)_30%,rgba(7,17,31,0.30)_68%,rgba(7,17,31,0.66)_100%)] lg:w-[80%]" />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-52 bg-[linear-gradient(0deg,#07111f,transparent)]" />
          <div className="pointer-events-none absolute right-[8%] top-[18%] hidden w-24 opacity-30 drop-shadow-[0_0_26px_rgba(56,189,248,0.65)] lg:block"><img src={markUrl} alt="" width="160" height="160" decoding="async" className="w-full" /></div>

          <div className="relative mx-auto flex min-h-[604px] max-w-[1440px] flex-col justify-between px-5 pb-8 pt-12 sm:min-h-[774px] sm:px-8 sm:pt-24 lg:px-12">
            <div className="relative max-w-4xl">
              <div className="reveal flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a5f3fc]">
                <span className="h-px w-10 bg-[#38bdf8]" />
                01 / portfólio em movimento
              </div>
              <h1 className="reveal delay-1 mt-7 max-w-4xl font-display text-[clamp(2.7rem,11vw,3.15rem)] font-semibold leading-[0.84] tracking-[-0.075em] text-white min-[400px]:text-[clamp(2.85rem,8.8vw,8.8rem)]">
                Aprendendo a construir.
                <br />
                <span className="hidden min-[400px]:inline">Registrando o que</span>
                <span className="min-[400px]:hidden">Registrando o</span>
                <br />
                <span className="hidden min-[400px]:inline">faz sentido.</span>
                <span className="whitespace-nowrap min-[400px]:hidden">que faz sentido.</span>
              </h1>
              <figure className="hero-portrait-card mt-7 flex max-w-sm items-center gap-3 border border-[#67e8f9]/25 bg-[#07111f]/80 p-2 backdrop-blur-sm lg:absolute lg:right-[-8rem] lg:top-0 lg:mt-0 lg:w-56 lg:flex-col lg:items-stretch lg:p-2">
                <picture><source type="image/avif" srcSet={portraitResponsive.avif} sizes="(min-width: 1024px) 224px, 80px" /><source type="image/webp" srcSet={portraitResponsive.webp} sizes="(min-width: 1024px) 224px, 80px" /><img src={portraitUrl} alt="Pablo Guilherme em retrato profissional" width="720" height="900" loading="eager" fetchPriority="high" decoding="async" className="h-20 w-20 shrink-0 object-cover object-top lg:h-56 lg:w-full" /></picture>
                <figcaption className="min-w-0 py-1 lg:px-1 lg:pb-1"><span className="block font-mono text-[8px] uppercase tracking-[0.15em] text-[#67e8f9]">arquivo / autor</span><span className="mt-1 block truncate font-display text-lg tracking-[-0.03em] text-white">Pablo Guilherme</span><span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.1em] text-[#8fa8c7]">TI · conteúdo · imagem</span></figcaption>
              </figure>
              <div className="reveal delay-2 mt-9 flex max-w-xl flex-col gap-6 sm:ml-[16.8%]">
                <p className="text-balance font-body text-base leading-8 text-[#bed0ea] sm:text-lg">
                  Um arquivo vivo de tecnologia, conteúdo e imagem — feito enquanto aprendo, testo e encontro formas mais claras de fazer uma ideia circular.
                </p>
                <p className="max-w-xl border-l-2 border-[#38bdf8] pl-3 font-mono text-[10px] uppercase leading-5 tracking-[0.1em] text-[#d8eaff]">Vídeos, imagens aéreas e conteúdo visual para eventos, marcas e projetos que precisam ser vistos com clareza.</p>
                <div ref={heroCtaRef} data-hero-cta="true" className="flex flex-wrap items-center gap-3">
                  <a href="#contato" onClick={() => trackPortfolioEvent("quote_cta", { source: "hero" })} className="group inline-flex items-center gap-3 bg-[#38bdf8] px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[#02111f] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_10px_30px_rgba(56,189,248,0.32)] active:scale-[0.97]">
                    solicitar orçamento <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                  </a>
                  <a href="#projetos" className="inline-flex items-center gap-2 px-2 py-3 font-mono text-[11px] uppercase tracking-[0.13em] text-[#b7cdf1] transition-colors hover:text-white">
                    ver trabalhos <ArrowDownRight className="h-3.5 w-3.5" />
                  </a>
                </div>
                <nav aria-label="Atalhos principais" className="mt-6 grid max-w-2xl gap-px border border-white/[0.1] bg-white/[0.1] sm:grid-cols-3">
                  <a href="#projetos" className="archive-quick-route group bg-[#07111f]/90 px-3 py-3 transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-inset">
                    <span className="font-mono text-[9px] text-[#67e8f9]">01</span>
                    <span className="mt-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#e6f8ff]">ver evidências</span>
                    <span className="mt-1 block font-body text-[11px] leading-4 text-[#8fa8c7]">trabalhos e repertório</span>
                  </a>
                  <a href="#servicos" className="archive-quick-route group bg-[#07111f]/90 px-3 py-3 transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-inset">
                    <span className="font-mono text-[9px] text-[#67e8f9]">02</span>
                    <span className="mt-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#e6f8ff]">entender serviços</span>
                    <span className="mt-1 block font-body text-[11px] leading-4 text-[#8fa8c7]">formatos e duração típica</span>
                  </a>
                  <a href="#contato" className="archive-quick-route group bg-[#07111f]/90 px-3 py-3 transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-inset">
                    <span className="font-mono text-[9px] text-[#67e8f9]">03</span>
                    <span className="mt-2 block font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#e6f8ff]">iniciar conversa</span>
                    <span className="mt-1 block font-body text-[11px] leading-4 text-[#8fa8c7]">orçamento e disponibilidade</span>
                  </a>
                </nav>
                <div ref={showreelSectionRef} className="showreel-card mt-6 overflow-hidden border border-[#67e8f9]/25 bg-[#050c16]/90" data-showreel="true">
                  <div className="flex items-center justify-between gap-4 border-b border-white/[0.1] px-4 py-3">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#67e8f9]">arquivo em movimento</p>
                      <p className="mt-1 font-body text-xs text-[#a9bed8]">showreel curto · imagem aérea, interface e registro</p>
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7189ae]">{showreelRequested ? (showreelError ? "erro" : showreelReady ? "pronto" : "carregando") : isDesktopViewport ? "sob demanda" : "vertical sob demanda"}</span>
                  </div>
                  <div className={`relative bg-[#07111f] ${isDesktopViewport ? "aspect-video" : "aspect-[9/16]"}`}>
                    {!showreelRequested && <button type="button" onClick={() => { setShowreelError(false); setShowreelRequested(true); }} className="showreel-poster group absolute inset-0 grid place-items-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a5f3fc]" aria-label="Carregar e reproduzir o showreel" data-showreel-trigger="true">
                      {shouldLoadShowreelPoster && <picture className="absolute inset-0"><source type="image/avif" srcSet={isDesktopViewport ? showreelPosterResponsive.avif : showreelVerticalPosterResponsive.avif} sizes="(min-width: 1024px) 900px, 100vw" /><source type="image/webp" srcSet={isDesktopViewport ? showreelPosterResponsive.webp : showreelVerticalPosterResponsive.webp} sizes="(min-width: 1024px) 900px, 100vw" /><img src={isDesktopViewport ? showreelPosterUrl : showreelVerticalPosterUrl} alt={isDesktopViewport ? "Pôster horizontal do showreel com imagem aérea e registro audiovisual" : "Pôster vertical do showreel otimizado para celular"} loading="lazy" decoding="async" width={isDesktopViewport ? 1280 : 720} height={isDesktopViewport ? 720 : 1280} className="absolute inset-0 h-full w-full object-cover opacity-75 transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none" /></picture>}
                      <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,11,20,0.82),rgba(3,11,20,0.18))]" />
                      <span className="showreel-play-button relative ml-5 inline-flex items-center gap-3 rounded-full border border-[#a5f3fc]/80 bg-[#38bdf8] px-3 py-2 text-[#02111f] shadow-[0_0_28px_rgba(56,189,248,0.35)] transition-transform duration-200 group-hover:scale-[1.03] motion-reduce:transition-none" data-showreel-play="true"><span className="grid h-10 w-10 place-items-center rounded-full border border-[#02111f]/25 bg-[#a5f3fc]/80"><Play className="ml-0.5 h-4 w-4" fill="currentColor" aria-hidden="true" /></span><span className="pr-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">play</span></span>
                      <span className="absolute bottom-4 left-5 font-mono text-[9px] uppercase tracking-[0.13em] text-[#e6f8ff]">carregar showreel {isDesktopViewport ? "horizontal" : "vertical"} · 00:09</span>
                    </button>}
                    {showreelRequested && !showreelError && <video ref={showreelVideoRef} key={isDesktopViewport ? "showreel-horizontal" : "showreel-vertical"} src={isDesktopViewport ? showreelUrl : showreelVerticalUrl} poster={isDesktopViewport ? "/manus-storage/showreel-poster-1280w_54c3532c.avif" : "/manus-storage/showreel-vertical-poster-720w_7e009499.avif"} controls playsInline preload="metadata" onCanPlay={() => setShowreelReady(true)} onPlay={() => setShowreelPlaying(true)} onPause={() => setShowreelPlaying(false)} onVolumeChange={(event) => setShowreelMuted(event.currentTarget.muted)} onError={() => { setShowreelError(true); setShowreelReady(false); setShowreelPlaying(false); }} className="h-full w-full object-cover" aria-label={isDesktopViewport ? "Showreel horizontal de Pablo Guilherme" : "Showreel vertical de Pablo Guilherme para dispositivos móveis"} data-showreel-video="true" />}
                    {showreelRequested && !showreelError && showreelReady && showreelPlaying && <button type="button" onClick={(event) => { event.stopPropagation(); const video = showreelVideoRef.current; if (!video) return; video.muted = !video.muted; setShowreelMuted(video.muted); }} aria-label={showreelMuted ? "Ativar som do showreel" : "Desativar som do showreel"} aria-pressed={showreelMuted} title={showreelMuted ? "Ativar som" : "Desativar som"} className="showreel-volume-control absolute bottom-4 right-4 z-10 grid h-11 w-11 place-items-center border border-[#a5f3fc]/75 bg-[#02111f]/85 text-[#d9fbff] shadow-[0_10px_25px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-all hover:border-[#67e8f9] hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none" data-showreel-volume="true">{showreelMuted ? <VolumeX className="h-4 w-4" aria-hidden="true" /> : <Volume2 className="h-4 w-4" aria-hidden="true" />}</button>}
                    {showreelRequested && showreelError && <div className="absolute inset-0 grid place-items-center px-5 text-center"><div><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">showreel indisponível</p><p className="mt-2 max-w-sm font-body text-sm leading-6 text-[#b7cdf1]">O vídeo não carregou agora. Você ainda pode conhecer os trabalhos na galeria.</p><button type="button" onClick={() => { setShowreelError(false); setShowreelReady(false); setShowreelPlaying(false); setShowreelMuted(false); setShowreelRequested(false); }} className="mt-4 border border-[#67e8f9]/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#d9fbff] transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">tentar novamente</button></div></div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="reveal delay-3 grid border-t border-white/[0.12] pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="max-w-sm font-mono text-[10px] uppercase leading-5 tracking-[0.12em] text-[#7890b4] light-muted-ink">
                STATUS: aprendendo na prática<br />
                FOCO ATUAL: TI · CONTEÚDO · AUDIOVISUAL<br />
                ATENDIMENTO: ÁGUAS LINDAS · PLANALTINA · ENTORNO
              </p>
              <a href="#sobre" className="mt-6 inline-flex min-h-11 items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#b7cdf1] transition-colors hover:text-[#3b82f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:mt-0">
                ver repertório e skills <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="sobre" className="relative border-t border-white/[0.07] bg-[#0a0f18]">
          <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[0.88fr_2.12fr]">
            <aside className="relative border-b border-white/[0.07] px-5 py-10 sm:px-8 lg:border-b-0 lg:border-r lg:px-12 lg:py-20">
              <div className="sticky top-28">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">02 / manifesto</p>
                <p className="mt-5 max-w-[14rem] font-display text-2xl font-medium leading-tight text-white">Um repertório em construção.</p>
                <div className="mt-12 hidden h-40 w-px bg-[linear-gradient(#3b82f6,transparent)] lg:block" />
              </div>
            </aside>
            <div className="relative px-5 py-12 sm:px-8 lg:px-16 lg:py-20">
              <span className="absolute left-0 top-0 h-full w-px bg-[#3b82f6]/50" />
              <div className="grid gap-12 xl:grid-cols-[1.5fr_0.7fr] xl:gap-16">
                <div>
                  <p className="font-display text-[clamp(2.3rem,4.6vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.05em] text-[#f4f8ff]">
                      Tecnologia, conteúdo e imagem se encontram para dar forma a projetos que precisam ser entendidos, vistos e lembrados.
                  </p>
                  <div className="mt-9 max-w-2xl space-y-5 font-body text-base leading-8 text-[#b8c8df]">
                    <p>O ponto de partida é sempre o mesmo: entender o problema, organizar a ideia e escolher a linguagem que faz sentido para quem vai receber.</p>
                    <p>O repertório reúne interfaces, conteúdo vertical, captação terrestre e imagens aéreas — frentes diferentes que se fortalecem quando trabalham juntas.</p>
                  </div>
                  <aside className="human-note mt-9 max-w-2xl p-5 sm:p-6">
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#a5f3fc]">nota de direção</p>
                    <p className="mt-3 max-w-xl font-body text-lg leading-8 text-[#e6f8ff]">“Um bom projeto não precisa começar pronto. Precisa de clareza para dar o próximo passo.”</p>
                    <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#91b9cd] light-muted-ink">— direção e processo</p>
                  </aside>
                  <a
                    href={resumeUrl}
                    download="portfolio-pablo-guilherme.pdf"
                    className="group mt-9 inline-flex w-full max-w-md items-center justify-between border border-[#67e8f9]/45 bg-[#0b1d2e] px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#102a3b] hover:shadow-[0_12px_30px_rgba(14,116,144,0.28)] sm:w-auto sm:min-w-[320px]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center bg-[#3b82f6] text-white transition-transform duration-200 group-hover:scale-[1.03]"><Download className="h-4 w-4" /></span>
                      <span className="text-left">
                        <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white">Baixar portfólio</span>
                        <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.11em] text-[#9edce9]">PDF · perfil profissional · links clicáveis</span>
                      </span>
                    </span>
                    <ArrowDownRight className="h-4 w-4 text-[#70a6ff] transition-transform duration-200 group-hover:translate-y-1" />
                  </a>
                </div>
                <div className="border-l border-white/10 pl-6 xl:mt-4">
                  <figure className="relative mb-8 overflow-hidden border border-white/10 bg-[#0d1523]">
                    <picture><source type="image/avif" srcSet={portraitResponsive.avif} sizes="(min-width: 640px) 448px, 100vw" /><source type="image/webp" srcSet={portraitResponsive.webp} sizes="(min-width: 640px) 448px, 100vw" /><img src={portraitUrl} alt="Pablo Guilherme" width="720" height="860" loading="lazy" decoding="async" className="h-64 w-full object-cover object-center saturate-[0.8] contrast-110 transition-transform duration-700 hover:scale-[1.03] sm:h-72" /></picture>
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(6,8,13,0.92)_100%)]" />
                    <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 py-3">
                      <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#d9e8ff]">Pablo Guilherme</span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#6fa4ff]">perfil / 2026</span>
                    </figcaption>
                  </figure>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#7d94b8] light-muted-ink">coordenadas atuais</p>
                  <dl className="mt-5 space-y-5">
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#7b91b3]">formação</dt>
                      <dd className="mt-1.5 font-body text-sm text-[#e7f0ff]">Estudante de Tecnologia da Informação</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#7b91b3]">interesse</dt>
                      <dd className="mt-1.5 font-body text-sm text-[#e7f0ff]">Tecnologia, conteúdo e audiovisual</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#7b91b3]">modo de trabalho</dt>
                      <dd className="mt-1.5 font-body text-sm text-[#e7f0ff]">Criatividade, prática e melhoria contínua</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="trilha" className="archive-chapter relative overflow-hidden border-t border-white/[0.07] bg-[#070a10] py-16 sm:py-24 lg:py-32">
          {isDesktopViewport && <picture className="pointer-events-none absolute inset-0 block"><source type="image/avif" srcSet={textureResponsive.avif} sizes="100vw" /><source type="image/webp" srcSet={textureResponsive.webp} sizes="100vw" /><img src={textureUrl} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-[0.13] mix-blend-screen" /></picture>}
          <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.4fr] lg:gap-20">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">03 / frentes de atuação</p>
                <div className="flex items-center gap-3"><img src={markUrl} alt="" width="28" height="28" loading="lazy" decoding="async" className="h-7 w-7 object-contain opacity-80" /><span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">PG / caderno de prática</span></div><h2 className="mt-5 max-w-md font-display text-[clamp(2.4rem,4vw,4.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">O que estou aprendendo a fazer bem.</h2>
                <p className="mt-6 max-w-sm font-body text-base leading-7 text-[#b6d7eb]">As frentes se complementam: lógica e presença, tela e câmera, detalhe e visão geral.</p><div className="mt-8 border-l-2 border-[#67e8f9] pl-4"><p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#67e8f9]">status do arquivo</p><p className="mt-2 font-body text-sm leading-6 text-[#c9e8f0]">Aprendendo na prática, registrando o processo e melhorando a cada entrega.</p></div>
              </div>
              <div className="border-t border-white/[0.1]">
                {skillTracks.map((skill) => (
                  <article key={skill.number} className="group grid gap-4 border-b border-white/[0.1] py-7 sm:grid-cols-[70px_1fr_auto] sm:items-start sm:gap-7 sm:py-8">
                    <span className="font-mono text-xs text-[#3b82f6]">{skill.number}</span>
                    <div>
                      <h3 className="font-display text-2xl font-medium text-[#eff6ff] transition-colors group-hover:text-[#69a1ff]">{skill.title}</h3>
                      <p className="mt-3 max-w-lg font-body text-sm leading-7 text-[#9eb0cc]">{skill.text}</p>
                      <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f91b7] light-muted-ink">{skill.tools}</p>
                    </div>
                    <span className="flex h-8 w-8 items-center justify-center border border-white/10 text-[#7daafa] transition-all duration-200 group-hover:border-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-12 border-t border-white/[0.1] pt-8">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a5f3fc]">repertório aplicado</p>
                  <h3 className="mt-3 font-display text-[clamp(2rem,3vw,3.4rem)] font-medium leading-none tracking-[-0.05em] text-white">Três formas de pensar a imagem.</h3>
                </div>
                <p className="max-w-sm font-body text-sm leading-7 text-[#9eb0cc]">As imagens entram como referência prática: o que foi observado, para que serviu e como pode ajudar um novo projeto.</p>
              </div>
              <div className="mt-7 grid gap-px bg-white/[0.1] md:grid-cols-3">
                {repertoireSignals.map((signal) => (
                  <article key={signal.title} className="evidence-card group relative min-h-[270px] overflow-hidden bg-[#07101c] p-5 sm:p-6">
                    <img src={signal.cover} alt={`Referência visual: ${signal.title}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-45 saturate-[0.75] transition duration-500 group-hover:scale-[1.03] group-hover:opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#030b1e] via-[#030b1e]/65 to-transparent" />
                    <div className="relative flex h-full flex-col justify-end">
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#a5f3fc]">{signal.label}</p>
                      <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">{signal.title}</h3>
                      <p className="mt-2 max-w-sm font-body text-sm leading-6 text-[#c2d9e7]">{signal.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="servicos" className="archive-chapter relative overflow-hidden border-t border-white/[0.07] bg-[#09101a]">
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
            <div className="grid gap-10 border-b border-white/[0.1] pb-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">04 / serviços</p>
                <div className="flex items-center gap-3"><img src={markUrl} alt="" width="28" height="28" loading="lazy" decoding="async" className="h-7 w-7 object-contain opacity-80" /><span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">PG / caderno de produção</span></div><h2 className="mt-5 max-w-md font-display text-[clamp(2.7rem,4.8vw,5.5rem)] font-medium leading-[0.93] tracking-[-0.06em] text-white">Como uma ideia vira entrega.</h2>
                <div className="mt-7 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#7795bf]"><img src={markUrl} alt="" width="20" height="20" loading="lazy" decoding="async" className="h-5 w-5 object-contain" /> PG // direção e imagem</div>
              </div>
              <div className="lg:pb-2">
                <p className="max-w-2xl font-body text-base leading-8 text-[#c0e3f4]">Cada projeto recebe uma combinação de direção, captação e organização para que a entrega seja clara antes, durante e depois da produção.</p>
                <a href="#contato" className="mt-7 inline-flex items-center gap-2 border-b border-[#3b82f6] pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#e3eeff] transition-colors hover:text-[#76aaff]">falar sobre um projeto <ArrowUpRight className="h-3.5 w-3.5" /></a>
              </div>
            </div>

            <div className="mt-8 divide-y divide-white/[0.1] border-y border-white/[0.1]">
              {serviceOffers.map(({ number, label, title, text, detail, delivery, duration, Icon }, index) => (
                <article key={number} className={`archive-entry group relative grid gap-7 overflow-hidden border-l border-transparent py-9 transition-all duration-300 hover:border-[#67e8f9]/60 hover:bg-[#0b1728] sm:py-11 lg:items-start ${index === 1 ? "lg:grid-cols-[0.5fr_1.1fr_0.8fr] lg:pl-[12%]" : "lg:grid-cols-[0.42fr_1.18fr_0.9fr]"}`}>
                  <div className="flex items-start justify-between gap-4 lg:pr-8">
                    <div><span className="font-mono text-xl text-[#3b82f6]">{number}</span><p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#607aa1] light-muted-ink">PG / SVC.{number}</p></div>
                    <span className="grid h-11 w-11 place-items-center border border-[#3b82f6]/25 bg-[#0c1728] text-[#71a6fb] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#3b82f6] group-hover:bg-[#3b82f6] group-hover:text-white"><Icon className="h-5 w-5" /></span>
                  </div>
                  <div className="lg:border-l lg:border-white/[0.1] lg:pl-8">
                    <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#7190bd] light-muted-ink">{label}</p>
                    <h3 className="mt-4 font-display text-[clamp(2rem,3vw,3.2rem)] font-medium leading-[0.96] tracking-[-0.05em] text-white">{title}</h3>
                    <p className="mt-5 max-w-lg font-body text-sm leading-7 text-[#a4b5cf]">{text}</p>
                  </div>
                  <div className="border-t border-white/[0.1] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f8db8] light-muted-ink">{detail}</p>
                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div><p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#516987]">entrega</p><p className="mt-1 font-mono text-[9px] uppercase leading-4 tracking-[0.08em] text-[#b6cae8]">{delivery}</p></div>
                      <div><p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#516987]">duração típica</p><p className="mt-1 font-mono text-[9px] uppercase leading-4 tracking-[0.08em] text-[#b6cae8]">{duration}</p></div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-5 max-w-3xl font-mono text-[9px] uppercase leading-5 tracking-[0.11em] text-[#637da5] light-muted-ink">REFERÊNCIAS INICIAIS DE MERCADO. FORMATOS, QUANTIDADE DE PEÇAS E DURAÇÃO PODEM SER AJUSTADOS CONFORME O OBJETIVO DE CADA PROJETO.</p>
          </div>
        </section>

        <section className="archive-chapter relative overflow-hidden border-t border-white/[0.07] bg-[#061226]">
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-35" />
          <div className="relative mx-auto grid max-w-[1440px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.82fr_1.18fr] lg:px-12 lg:py-28">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a5f3fc]">05 / como o trabalho acontece</p>
              <h2 className="mt-5 max-w-md font-display text-[clamp(2.7rem,4.8vw,5.5rem)] font-medium leading-[0.93] tracking-[-0.06em] text-white">Da primeira conversa<br />à entrega final.</h2>
              <p className="mt-6 max-w-sm font-body text-base leading-8 text-[#c0e3f4]">Um processo simples ajuda a decidir melhor: contexto, formato, produção e próximos usos.</p>
              <a href="#contato" className="mt-7 inline-flex items-center gap-2 border-b border-[#38bdf8] pb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.13em] text-[#e3faff] transition-colors hover:text-[#a5f3fc]">contar sua ideia <ArrowUpRight className="h-3.5 w-3.5" /></a>
            </div>
            <div className="divide-y divide-cyan-100/[0.12] border-y border-cyan-100/[0.12]">
              {processSteps.map((step) => (
                <article key={step.number} className="grid gap-5 py-7 sm:grid-cols-[80px_1fr] sm:py-9">
                  <span className="font-mono text-xl text-[#67e8f9]">{step.number}</span>
                  <div>
                    <h3 className="font-display text-2xl font-medium text-white">{step.title}</h3>
                    <p className="mt-3 max-w-xl font-body text-sm leading-7 text-[#b9d8e8]">{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projetos" className="archive-chapter relative border-y border-white/[0.07] bg-[#0a0f18]">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
            <div className="flex flex-col justify-between gap-6 border-b border-white/[0.1] pb-9 sm:flex-row sm:items-end">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">06 / trabalhos selecionados</p>
                <h2 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,5rem)] font-medium leading-none tracking-[-0.06em] text-white">Repertório em uso,<br className="hidden sm:block" /> não só na vitrine.</h2>
                <div className="mt-6 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-[#7795bf]"><img src={markUrl} alt="" width="20" height="20" loading="lazy" decoding="async" className="h-5 w-5 object-contain" /> PG // arquivo visual em progresso</div>
              </div>
              <div className="max-w-sm">
                <p className="font-body text-sm leading-7 text-[#b6d7eb]">Registros reais para mostrar como repertório, linguagem e execução se encontram em diferentes formatos.</p>
                <div className="mt-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f8fb7] light-muted-ink"><span className="h-px w-8 bg-[#38bdf8]" /> {repositories.length} referências catalogadas</div>
              </div>
            </div>

            <div className="showroom-portrait-entry mt-8 grid gap-5 border-y border-[#67e8f9]/20 bg-[#07111f]/65 p-4 sm:grid-cols-[112px_1fr_auto] sm:items-center sm:p-5">
              <picture><source type="image/avif" srcSet={portraitResponsive.avif} sizes="112px" /><source type="image/webp" srcSet={portraitResponsive.webp} sizes="112px" /><img src={portraitUrl} alt="Retrato profissional de Pablo Guilherme no início do Showroom" width="720" height="900" loading="lazy" decoding="async" className="h-28 w-28 object-cover object-top" /></picture>
              <div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#67e8f9]">entrada / quem está por trás</p><p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#c4d9ee]">Este arquivo é construído por Pablo Guilherme: estudante de TI, criador de conteúdo e operador de imagem aérea e terrestre.</p></div>
              <a href="#sobre" className="inline-flex min-h-11 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#b7cdf1] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">conhecer percurso <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
            </div>

            <section aria-labelledby="trabalhos-destaque-title" className="mt-8 border-y border-[#3b82f6]/25 bg-[#06172f]/55 py-6 sm:py-8">
              <div className="flex flex-col gap-3 px-4 sm:flex-row sm:items-end sm:justify-between sm:px-6">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#60a5fa]">entrada / três evidências</p>
                  <h3 id="trabalhos-destaque-title" className="mt-2 font-display text-[clamp(1.7rem,3vw,2.8rem)] font-medium leading-none tracking-[-0.05em] text-white">O trabalho antes do filtro.</h3>
                </div>
                <p className="max-w-sm font-body text-sm leading-6 text-[#b6d7eb]">Projetos selecionados para mostrar rapidamente o papel, o processo e o resultado de cada registro.</p>
              </div>
              <div className="mt-6 grid gap-px bg-[#3b82f6]/15 sm:grid-cols-3" aria-busy={!featuredCardsReady}>
                <div role="status" aria-live="polite" className="sr-only">{featuredCardsReady ? "Três projetos destacados disponíveis para abrir detalhes." : "Carregando projetos destacados."}</div>
                {featuredCardsReady ? featuredRepositories.map((project) => (
                  <article key={`featured-${project.id}`} data-featured-project={project.id} role="button" tabIndex={0} aria-labelledby={`featured-title-${project.id}`} onClick={() => openProjectDetails(project)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openProjectDetails(project); } }} className="featured-project-card group cursor-pointer bg-[#07111f] p-4 text-left outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-[#60a5fa] focus-visible:ring-inset sm:p-5">
                    {project.cover && <img src={project.cover} alt={`Miniatura de ${project.name}`} width="720" height="480" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover opacity-80 transition-[transform,opacity] duration-200 ease-out group-hover:scale-[1.04] group-hover:opacity-100 motion-reduce:transition-none" />}
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#60a5fa]">{project.id}</p>
                      <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#7894bb]">{project.kind === "video" ? "vídeo" : "repositório"}</span>
                    </div>
                    <h4 id={`featured-title-${project.id}`} className="mt-2 break-words font-display text-xl font-medium leading-tight tracking-[-0.035em] text-white">{project.name}</h4>
                    <dl className="mt-4 grid gap-3 text-sm leading-5">
                      <div><dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#60a5fa]">papel</dt><dd className="mt-1 text-[#c4d9ee]">{project.role}</dd></div>
                      <div><dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#60a5fa]">processo</dt><dd className="mt-1 text-[#c4d9ee]">{project.process}</dd></div>
                      <div><dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#60a5fa]">resultado</dt><dd className="mt-1 text-[#c4d9ee]">{project.result}</dd></div>
                    </dl>
                    <span className="mt-5 inline-flex font-mono text-[9px] uppercase tracking-[0.12em] text-[#8db8ff] transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none">abrir detalhes <ArrowUpRight className="ml-2 h-3.5 w-3.5" aria-hidden="true" /></span>
                  </article>
                )) : Array.from({ length: 3 }).map((_, index) => (
                  <div key={`featured-skeleton-${index}`} aria-hidden="true" className="featured-project-card min-h-[430px] animate-pulse bg-[#0a1422] p-4 sm:p-5 motion-reduce:animate-none">
                    <div className="aspect-[16/10] w-full bg-[#163354]" />
                    <div className="mt-5 space-y-3"><div className="h-2 w-16 bg-[#294568]" /><div className="h-7 w-4/5 bg-[#294568]" /><div className="h-3 w-full bg-[#1c3454]" /><div className="h-3 w-2/3 bg-[#1c3454]" /></div>
                    <div className="mt-6 space-y-3"><div className="h-2 w-12 bg-[#294568]" /><div className="h-3 w-full bg-[#1c3454]" /><div className="h-2 w-16 bg-[#294568]" /><div className="h-3 w-4/5 bg-[#1c3454]" /></div>
                  </div>
                ))}
              </div>
            </section>

            <nav aria-label="Navegação do showroom" className="mt-8 flex flex-wrap gap-2 border-y border-white/[0.1] py-3">
              <a href="#galeria-publica" className="border border-[#67e8f9]/25 bg-[#07101e] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#bdf7ff] transition-colors hover:border-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">galeria pública</a>
              <a href="#favoritos-pessoais" className="border border-[#67e8f9]/25 bg-[#07101e] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#bdf7ff] transition-colors hover:border-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">meus favoritos</a>
              <a href="/favoritos" className="border border-[#67e8f9]/25 bg-[#07101e] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#8edff0] transition-colors hover:border-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">gestão de favoritos</a>
            </nav>
            <div className="mt-8 border-y border-white/[0.1] py-4">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {sharedProjectIds && <aside role="region" aria-labelledby="shared-list-title" className="mb-5 flex flex-col gap-4 border border-[#67e8f9]/35 bg-[#062342]/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                <div className="min-w-0">
                  <p id="shared-list-title" className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">lista compartilhada</p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#d9f4ff]">Você recebeu {sharedProjectIds.length} {sharedProjectIds.length === 1 ? "referência" : "referências"}. Salve {sharedProjectIds.length === 1 ? "esta seleção" : "todas na sua lista"} para acessar depois.</p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <button type="button" onClick={saveSharedFavorites} className="border border-[#67e8f9] bg-[#38bdf8] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#02111f] transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">salvar na minha lista</button>
                  <button type="button" onClick={dismissSharedFavorites} className="border border-white/15 bg-[#07101e]/60 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#9eb5d2] transition-all hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">agora não</button>
                </div>
                <span role="status" aria-live="polite" className="sr-only">Lista compartilhada com {sharedProjectIds.length} {sharedProjectIds.length === 1 ? "referência" : "referências"} carregada.</span>
              </aside>}
              <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#6f8fb7] light-muted-ink">explorar por categoria</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f8fb7] light-muted-ink">{visibleRepositories.length} referências visíveis</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button type="button" onClick={() => setFavoritesOnly((current) => !current)} aria-pressed={favoritesOnly} className={`inline-flex items-center gap-2 border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${favoritesOnly ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : "border-[#67e8f9]/25 bg-[#07101e] text-[#9eb5d2] hover:border-[#67e8f9]/65 hover:text-white"}`}><Heart className={`h-3.5 w-3.5 ${favoritesOnly ? "fill-current" : ""}`} aria-hidden="true" /><span>projetos salvos</span><span aria-hidden="true">{favoriteProjectIds.length}</span></button>
                  <button type="button" data-image-collection-toggle="true" onClick={() => setIsImageCollectionOpen((current) => !current)} aria-expanded={isImageCollectionOpen} aria-controls="curadoria-pessoal" className={`inline-flex items-center gap-2 border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] transition-all active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${isImageCollectionOpen ? "border-[#67e8f9] bg-[#0b3156] text-[#e5fbff]" : "border-[#67e8f9]/25 bg-[#07101e] text-[#9eb5d2] hover:border-[#67e8f9]/65 hover:text-white"}`}><Heart className={`h-3.5 w-3.5 ${favoriteImageIds.length ? "fill-[#67e8f9] text-[#67e8f9]" : ""}`} aria-hidden="true" /><span>minhas imagens</span><span aria-hidden="true">{favoriteImageIds.length}</span></button>
                  <span role="status" aria-live="polite" className="sr-only">{favoriteImageStatus}</span>
                  <span className="hidden h-5 w-px bg-white/10 sm:block" aria-hidden="true" />
                  <button type="button" onClick={shareFavorites} disabled={!favoriteProjectIds.length} className="inline-flex items-center gap-1.5 border border-[#67e8f9]/20 bg-[#07101e] px-2.5 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#9eb5d2] transition-all hover:border-[#67e8f9]/65 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]" title="Copiar link dos favoritos"><Share2 className="h-3.5 w-3.5" aria-hidden="true" /><span>{shareStatus === "copied" ? "copiado" : "compartilhar"}</span></button>
                  <span className="flex items-center gap-1.5" aria-label="Exportar projetos favoritos">
                    <button type="button" onClick={() => exportFavorites("csv")} disabled={!favoriteProjectIds.length} className="inline-flex items-center gap-1.5 border border-[#67e8f9]/20 bg-[#07101e] px-2.5 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#9eb5d2] transition-all hover:border-[#67e8f9]/65 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]" title="Baixar favoritos em CSV"><Download className="h-3.5 w-3.5" aria-hidden="true" /><span>CSV</span></button>
                    <button type="button" onClick={() => exportFavorites("json")} disabled={!favoriteProjectIds.length} className="inline-flex items-center gap-1.5 border border-[#67e8f9]/20 bg-[#07101e] px-2.5 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#9eb5d2] transition-all hover:border-[#67e8f9]/65 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]" title="Baixar favoritos em JSON"><Download className="h-3.5 w-3.5" aria-hidden="true" /><span>JSON</span></button>
                  </span>
                  <span role="status" aria-live="polite" className="sr-only">{shareStatus === "copied" ? "Link dos favoritos copiado." : shareStatus === "error" ? "Não foi possível copiar o link dos favoritos." : ""}</span>

                </div>
              </div>
              <aside id="favoritos-pessoais" aria-label="Coleção pessoal de imagens favoritas" aria-hidden={!isImageCollectionOpen} inert={!isImageCollectionOpen} className={`overflow-hidden border-x border-b border-[#67e8f9]/20 bg-[#06172f]/60 transition-[max-height,opacity,transform] duration-200 motion-reduce:transition-none ${isImageCollectionOpen ? "max-h-[760px] translate-y-0 opacity-100" : "pointer-events-none max-h-0 -translate-y-1 opacity-0"}`}>
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5"><div><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">coleção pessoal</p><h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">Imagens guardadas para rever.</h3><p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#bad9e8]">Esta coleção é salva apenas neste navegador e permanece separada dos projetos favoritos.</p></div><span className="shrink-0 border border-[#67e8f9]/25 bg-[#07101e] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#bdf7ff]">{favoriteImageProjects.length} {favoriteImageProjects.length === 1 ? "imagem" : "imagens"}</span></div>
                {favoriteImageProjects.length ? <div className="grid gap-px border-t border-[#67e8f9]/15 bg-[#67e8f9]/10 sm:grid-cols-2 lg:grid-cols-3">{favoriteImageProjects.map((project) => <button key={`favorite-image-${project.id}`} type="button" data-image-collection-item={project.id} onClick={(event) => { setIsImageCollectionOpen(false); openProjectLightbox(project.id, event); }} className="group relative min-h-40 overflow-hidden bg-[#07101e] p-4 text-left focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><img src={project.cover} alt={`Miniatura salva de ${project.name}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-300 group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:transition-none" /><span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,8,18,0.1),rgba(3,8,18,0.94))]" /><span className="relative flex h-full flex-col justify-between"><Heart className="h-4 w-4 fill-[#67e8f9] text-[#67e8f9]" aria-hidden="true" /><span><span className="block font-mono text-[8px] uppercase tracking-[0.12em] text-[#8edff0]">abrir imagem</span><span className="mt-1 block font-display text-xl font-medium tracking-[-0.03em] text-white">{project.name}</span></span></span></button>)}</div> : <div className="border-t border-[#67e8f9]/15 px-5 py-7 font-body text-sm leading-6 text-[#bad9e8]">Use o coração identificado como <strong className="font-semibold text-white">imagem</strong> nos cartões ou no visualizador para começar sua coleção.</div>}
              </aside>
              </div>
              {favoritesOnly && <section id="projetos-salvos" data-saved-projects-section="true" aria-labelledby="saved-projects-title" aria-describedby="saved-projects-help" className="mb-6 border border-[#67e8f9]/25 bg-[#06172f]/60 p-4 sm:p-5"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">seção dedicada</p><h3 id="saved-projects-title" className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">Projetos salvos para revisitar.</h3><p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#bad9e8]">A lista abaixo respeita a ordenação escolhida e mostra apenas os projetos marcados como favoritos neste navegador.</p><p id="saved-projects-help" className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#8db8ff]">arraste os cartões para ajustar sua ordem manual</p></div><div className="flex flex-wrap gap-2"><button type="button" data-saved-export-csv="true" onClick={() => void exportFavorites("csv")} disabled={!favoriteProjectIds.length} className="inline-flex shrink-0 items-center justify-center gap-1.5 border border-[#67e8f9]/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Download className="h-3.5 w-3.5" aria-hidden="true" />CSV</button><button type="button" data-saved-export-pdf="true" onClick={() => void exportFavorites("pdf")} disabled={!favoriteProjectIds.length} className="inline-flex shrink-0 items-center justify-center gap-1.5 border border-[#67e8f9] bg-[#38bdf8] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#02111f] transition-colors hover:bg-[#a5f3fc] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><FileText className="h-3.5 w-3.5" aria-hidden="true" />PDF</button><button type="button" onClick={() => setFavoritesOnly(false)} className="inline-flex shrink-0 items-center justify-center border border-[#67e8f9]/30 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">ver todos os projetos</button></div></div><p role="status" aria-live="polite" className="mt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-[#8db8ff]">{favoriteExportStatus === "csv" ? "CSV preparado para download." : favoriteExportStatus === "pdf" ? "PDF preparado para download." : favoriteExportStatus === "error" ? "Não foi possível preparar a exportação." : ""}</p></section>}
              <div className="mb-3 flex flex-col gap-2 border-t border-white/[0.08] pt-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#60a5fa]">explorar por tecnologia</p><p className="mt-1 font-body text-xs leading-5 text-[#9fb4d2]">Combine tecnologia, categoria, tags e busca para encontrar evidências específicas.</p></div><p role="status" aria-live="polite" data-technology-result-count="true" className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7894bb]">{visibleRepositories.length} {visibleRepositories.length === 1 ? "projeto encontrado" : "projetos encontrados"}</p></div>
            <div className="flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1 pr-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 sm:pr-0 [&::-webkit-scrollbar]:hidden" aria-label="Filtrar galeria por categoria">
                {categoryFilters.map((category) => {
                  const categoryCount = category === "Todos" ? repositories.length : repositories.filter((repository) => getRepositoryCategories(repository).has(category)).length;
                  return <button type="button" key={category} onClick={() => selectCategory(category)} aria-pressed={activeCategory === category} aria-busy={isProjectFilterTransitioning} data-filter-scope="category" className={`inline-flex shrink-0 items-center gap-2 border px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f18] ${activeCategory === category ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : "border-[#67e8f9]/20 bg-[#07101e] text-[#9eb5d2] hover:border-[#67e8f9]/65 hover:text-white"}`}><span>{category}</span><span aria-hidden="true" className={`min-w-4 text-center text-[8px] ${activeCategory === category ? "text-[#083760]" : "text-[#5e789d]"}`}>{categoryCount}</span></button>;
                })}
              </div>
              <div className="mt-3 flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1 pr-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 sm:pr-0 [&::-webkit-scrollbar]:hidden" aria-label="Filtrar galeria pública por tags">
                {tagFilters.map((tag) => <button type="button" key={tag} onClick={() => selectTag(tag)} aria-pressed={activeTag === tag} data-filter-scope="tag" className={`inline-flex shrink-0 items-center gap-2 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${activeTag === tag ? "border-[#a5f3fc] bg-[#0b3156] text-[#dffbff]" : "border-[#67e8f9]/20 bg-[#07101e] text-[#9eb5d2] hover:border-[#67e8f9]/65 hover:text-white"}`}><span>{tag}</span><span aria-hidden="true" className="text-[8px] text-[#5e789d]">{tag === "Todos" ? repositories.length : repositories.filter((repository) => repository.technologies.includes(tag) || getRepositoryCategories(repository).has(tag)).length}</span></button>)}
              </div>
            <div className="mt-4 flex flex-col gap-4 border-b border-white/[0.1] pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex max-w-full flex-nowrap gap-2 overflow-x-auto pb-1 pr-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0 sm:pr-0 [&::-webkit-scrollbar]:hidden" aria-label="Filtrar repositórios por tecnologia">
              {technologyFilters.map((technology) => (
                <button
                  type="button"
                  key={technology}
                  onClick={() => selectTechnology(technology)}
                  aria-busy={isProjectFilterTransitioning}
                  aria-pressed={activeTechnology === technology}
                  data-filter-scope="technology"
                  className={`inline-flex shrink-0 items-center gap-1.5 border px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f18] ${
                    activeTechnology === technology
                      ? "border-[#3b82f6] bg-[#3b82f6] text-[#02111f]"
                      : "border-white/10 bg-transparent text-[#88a0c4] hover:border-[#3b82f6]/60 hover:text-[#eaf2ff]"
                  }`}
                >
                  <span>{technology}</span>
                  <span aria-hidden="true" className={`ml-1 min-w-4 text-center text-[8px] ${activeTechnology === technology ? "text-[#02111f]" : "text-[#5e789d]"}`}>
                    {technology === "Todos" ? repositories.length : repositories.filter((repository) => repository.technologies.includes(technology)).length}
                  </span>
                </button>
              ))}
              </div>
              <button
                type="button"
                onClick={() => setIsCompactGallery((current) => !current)}
                aria-pressed={isCompactGallery}
                aria-label={isCompactGallery ? "Voltar para visualização detalhada" : "Ativar visualização compacta"}
                className={`inline-flex shrink-0 items-center justify-center gap-2 border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f18] ${isCompactGallery ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : "border-white/[0.12] bg-[#07101e] text-[#9eb5d2] hover:border-[#67e8f9]/60 hover:text-white"}`}
              >
                <Layers2 className="h-3.5 w-3.5" /> {isCompactGallery ? "modo compacto" : "modo detalhado"}
              </button>
            </div>

            <div data-project-search-panel="true" className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block w-full sm:max-w-md">
                <span className="sr-only">Pesquisar projetos por palavra-chave, nome, tecnologia ou descrição</span>
                {isGalleryLoading ? <Loader2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#60a5fa] motion-reduce:animate-none" aria-hidden="true" /> : <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6e8bad]" aria-hidden="true" />}
                <input
                  ref={projectSearchInputRef}
                  type="search"
                  role="combobox"
                  value={projectSearch}
                  onChange={(event) => {
                    setProjectSearch(event.target.value);
                    if (galleryLoadingTimerRef.current) window.clearTimeout(galleryLoadingTimerRef.current);
                    setIsGalleryLoading(true);
                    galleryLoadingTimerRef.current = window.setTimeout(() => setIsGalleryLoading(false), 260);
                    setActiveSearchSuggestionIndex(-1);
                    setIsProjectSearchFocused(true);
                  }}
                  onFocus={() => setIsProjectSearchFocused(true)}
                  onBlur={() => setIsProjectSearchFocused(false)}
                  onKeyDown={handleProjectSearchKeyDown}
                  data-project-search="true"
                  placeholder="pesquisar por palavra-chave, tecnologia ou descrição"
                  aria-describedby="project-search-feedback"
                  aria-keyshortcuts="Escape"
                  enterKeyHint="search"
                  aria-autocomplete="list"
                  aria-controls="project-search-suggestions"
                  aria-expanded={isProjectSearchFocused && visibleSearchSuggestions.length > 0}
                  aria-activedescendant={activeSearchSuggestionIndex >= 0 ? `project-search-suggestion-${activeSearchSuggestionIndex}` : undefined}
                  className="w-full border border-white/[0.12] bg-[#07101e] py-3 pl-10 pr-10 font-mono text-[10px] uppercase tracking-[0.1em] text-white placeholder:text-[#59718f] transition-colors focus:border-[#67e8f9] focus:outline-none focus:ring-2 focus:ring-[#a5f3fc] focus:ring-offset-2 focus:ring-offset-[#0a0f18]"
                />
                {isProjectSearchFocused && visibleSearchSuggestions.length > 0 && (
                  <ul id="project-search-suggestions" role="listbox" aria-label="Sugestões de busca" className="absolute z-20 mt-2 w-full overflow-hidden border border-[#67e8f9]/35 bg-[#061226] shadow-[0_18px_40px_rgba(0,0,0,0.36)]">
                    {visibleSearchSuggestions.map((suggestion, index) => (
                      <li
                        key={`${suggestion.source}-${suggestion.value}`}
                        id={`project-search-suggestion-${index}`}
                        role="option"
                        aria-selected={activeSearchSuggestionIndex === index}
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => applyProjectSearchSuggestion(suggestion)}
                        className={`flex cursor-pointer items-center justify-between gap-4 border-b border-white/[0.08] px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] last:border-b-0 ${activeSearchSuggestionIndex === index ? "bg-[#38bdf8] text-[#02111f]" : "text-[#d6ecf8] hover:bg-[#0a2446]"}`}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          {suggestion.source === "projeto" ? <FolderGit2 data-suggestion-icon="projeto" className={`h-3.5 w-3.5 shrink-0 ${activeSearchSuggestionIndex === index ? "text-[#083760]" : "text-[#60a5fa]"}`} aria-hidden="true" /> : suggestion.source === "tecnologia" ? <Braces data-suggestion-icon="tecnologia" className={`h-3.5 w-3.5 shrink-0 ${activeSearchSuggestionIndex === index ? "text-[#083760]" : "text-[#67e8f9]"}`} aria-hidden="true" /> : <FileText data-suggestion-icon="descrição" className={`h-3.5 w-3.5 shrink-0 ${activeSearchSuggestionIndex === index ? "text-[#083760]" : "text-[#a5b4fc]"}`} aria-hidden="true" />}
                          <span className="truncate">{renderSuggestionMatch(suggestion.value, projectSearch, activeSearchSuggestionIndex === index)}</span>
                        </span>
                        <span className={`shrink-0 text-[8px] tracking-[0.12em] ${activeSearchSuggestionIndex === index ? "text-[#083760]" : "text-[#6f9cbd]"}`}>{suggestion.source}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  type="button"
                  onClick={clearProjectSearch}
                  aria-label="Limpar busca de trabalhos"
                  title="Limpar busca"
                  tabIndex={projectSearch ? 0 : -1}
                  className={`absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center border border-transparent text-[#91acd0] light-muted-ink transition-[opacity,transform,background-color,border-color,color] duration-200 focus-visible:border-[#67e8f9]/60 focus-visible:bg-[#0b2746] focus-visible:text-[#eaffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07101e] active:scale-95 ${projectSearch ? "scale-100 opacity-100 hover:border-[#67e8f9]/35 hover:bg-[#0b2746] hover:text-white" : "pointer-events-none scale-95 opacity-0"}`}
                >
                  <X className="h-4 w-4 transition-transform duration-200 hover:rotate-90" aria-hidden="true" />
                  <span className="sr-only">Limpar busca de trabalhos</span>
                </button>
              </label>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <label className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#7894bb] light-muted-ink"><span>ordenar</span><select data-sort-control="projects" value={sortMode} onChange={(event) => selectSort(event.target.value as (typeof sortOptions)[number]["value"])} aria-label="Ordenar projetos por data ou relevância" className="border border-[#67e8f9]/25 bg-[#07101e] px-2.5 py-2 font-mono text-[9px] uppercase tracking-[0.08em] text-[#d8f7ff] outline-none transition-colors focus:border-[#67e8f9] focus:ring-2 focus:ring-[#a5f3fc]"><option value="relevance">relevância</option><option value="added">data de adição</option><option value="manual">ordem manual</option></select></label>
                <button type="button" onClick={copyCurrentSearchLink} aria-label={searchShareStatus === "copied" ? "Link da busca copiado" : "Copiar link da busca atual"} className="inline-flex min-h-9 items-center gap-2 border border-[#3b82f6]/30 px-2.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#b7d4ff] transition-colors hover:border-[#3b82f6] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]"><Copy className="h-3.5 w-3.5" aria-hidden="true" />{searchShareStatus === "copied" ? "copiado" : searchShareStatus === "error" ? "tente novamente" : "copiar busca"}</button>
                <span data-search-share-status="true" role="status" aria-live="polite" className="sr-only">{searchShareStatus === "copied" ? "Link da busca copiado." : searchShareStatus === "error" ? "Não foi possível copiar o link da busca." : ""}</span>
                <button type="button" onClick={clearAllProjectFilters} aria-label="Limpar todos os filtros de projetos" className="inline-flex min-h-9 items-center gap-2 border border-amber-300/25 px-2.5 font-mono text-[9px] uppercase tracking-[0.1em] text-amber-100 transition-colors hover:border-amber-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]"><X className="h-3.5 w-3.5" aria-hidden="true" />limpar filtros</button>
              </div>
              <p id="project-search-feedback" role="status" aria-live="polite" className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#6e89ab] light-muted-ink">{visibleRepositories.length} {visibleRepositories.length === 1 ? "trabalho encontrado" : "trabalhos encontrados"}{projectSearch ? ` para “${projectSearch}”` : ""}</p>
              {(activeCategory !== "Todos" || activeTag !== "Todos" || activeTechnology !== "Todos" || favoritesOnly || projectSearch) && <div data-active-filter-summary="true" className="mt-3 flex flex-wrap items-center gap-2" role="status" aria-live="polite"><span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#7894bb]">filtros ativos</span>{activeCategory !== "Todos" && <span className="border border-[#67e8f9]/30 bg-[#0b2746] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#d8f7ff]">categoria: {activeCategory}</span>}{activeTag !== "Todos" && <span className="border border-[#67e8f9]/30 bg-[#0b2746] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#d8f7ff]">tag: {activeTag}</span>}{activeTechnology !== "Todos" && <span className="border border-[#67e8f9]/30 bg-[#0b2746] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#d8f7ff]">tecnologia: {activeTechnology}</span>}{favoritesOnly && <span className="border border-[#67e8f9]/30 bg-[#0b2746] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#d8f7ff]">salvos</span>}<button type="button" onClick={clearAllProjectFilters} className="font-mono text-[9px] uppercase tracking-[0.08em] text-amber-100 underline decoration-amber-300/50 underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">limpar ativos</button></div>}
            </div>

            {recentSearches.length > 0 && <div data-recent-searches="true" className="mt-3 flex flex-wrap items-center gap-2" aria-label="Buscas recentes"><span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#6e89ab]">recentes</span>{recentSearches.map((term) => <span key={term} className="inline-flex max-w-full items-center border border-white/[0.1] bg-[#07101e] font-mono text-[9px] uppercase tracking-[0.08em] text-[#9eb5d2]"><button type="button" onClick={() => { setProjectSearch(term); setIsProjectSearchFocused(false); projectSearchInputRef.current?.focus(); }} className="truncate px-2.5 py-1.5 text-left transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a5f3fc]">{term}<span className="sr-only">, repetir busca</span></button><button type="button" onClick={() => removeRecentSearch(term)} aria-label={`Excluir busca recente ${term}`} title={`Excluir ${term}`} className="grid h-7 w-7 shrink-0 place-items-center border-l border-white/[0.1] text-[#7189ae] transition-colors hover:bg-red-400/10 hover:text-red-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a5f3fc]"><Trash2 className="h-3 w-3" aria-hidden="true" /></button></span>)}<button type="button" onClick={clearRecentSearches} aria-label="Limpar todo o histórico de buscas" className="inline-flex items-center gap-1.5 border border-amber-300/25 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.08em] text-amber-100 transition-colors hover:border-amber-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">limpar histórico</button></div>}

            <div id="galeria-publica" aria-label="Galeria pública de trabalhos" aria-busy={isProjectFilterTransitioning || isGalleryLoading} className={`project-gallery-stage mt-8 transition-[opacity,transform] duration-200 ${isProjectFilterTransitioning ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}>
            {isGalleryLoading ? (
              <div role="status" aria-live="polite" aria-label="Carregando projetos" className="grid gap-px bg-white/[0.1] lg:grid-cols-3">
                {Array.from({ length: Math.min(visibleProjectLimit, 4) }).map((_, index) => <div key={`project-skeleton-${index}`} aria-hidden="true" className={`relative overflow-hidden bg-[#0a1422] p-6 sm:p-8 ${galleryView === "list" ? "min-h-[250px] sm:min-h-[280px]" : isCompactGallery ? "min-h-[220px] sm:min-h-[250px]" : "min-h-[380px] sm:min-h-[440px]"}`}><div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(103,232,249,0.08)_45%,transparent_70%)] motion-safe:animate-[skeleton-shimmer_1.4s_linear_infinite] motion-reduce:animate-none" /><div className="relative flex h-full flex-col justify-between"><div className="space-y-3"><span className="block h-2 w-20 bg-[#294568]" /><span className="block h-2 w-28 bg-[#1c3454]" /></div><div className="space-y-4"><span className="block h-8 w-3/4 bg-[#294568]" /><span className="block h-3 w-full bg-[#1c3454]" /><span className="block h-3 w-2/3 bg-[#1c3454]" /><div className="flex gap-2"><span className="h-6 w-16 bg-[#163354]" /><span className="h-6 w-20 bg-[#163354]" /></div></div></div></div>)}
              </div>
            ) : visibleRepositories.length > 0 ? (
              <>
              <div className={`grid gap-px bg-white/[0.1] ${galleryView === "list" ? "grid-cols-1" : isCompactGallery ? "sm:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-3"}`} data-gallery-view={galleryView}><p className="sr-only" role="status" aria-live="polite">{manualOrderStatus}</p>
                {displayedRepositories.map((repository, index) => {
                  const cardContent = (
                    <>
                      {repository.cover && <img src={repository.cover} alt={`Capa do trabalho ${repository.name}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover opacity-55 saturate-[0.75] transition-transform duration-700 group-hover:scale-[1.03]" />}
                      {repository.cover && <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,16,0.18),rgba(6,10,16,0.95)_78%)]" />}
                      <span aria-hidden="true" className="archive-preview pointer-events-none absolute inset-x-4 bottom-4 z-10 translate-y-2 border border-[#67e8f9]/35 bg-[#061a31]/95 p-4 opacity-0 shadow-[0_14px_35px_rgba(0,0,0,0.34)] transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 max-sm:translate-y-0 max-sm:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none">
                        <span className="block font-mono text-[9px] uppercase tracking-[0.13em] text-[#67e8f9]">resumo rápido</span>
                        <span className="mt-2 block font-body text-xs leading-5 text-[#d6edf8]">{repository.description}</span>
                        <span className="mt-3 flex flex-wrap gap-1.5">{repository.technologies.map((technology) => <span key={`preview-${technology}`} className="border border-[#67e8f9]/25 bg-[#0b2746] px-2 py-1 font-mono text-[8px] uppercase tracking-[0.08em] text-[#bdf7ff]">{technology}</span>)}</span>
                      </span>
                      <span className="relative flex items-start justify-between gap-4">
                        <span><span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-[#bdcff0]">{repository.id}</span>{!isCompactGallery && <span className="mt-2 block font-mono text-[8px] uppercase tracking-[0.12em] text-[#8b9cb4]">EVIDÊNCIA / FRAME {String(index + 1).padStart(2, "0")}</span>}</span>
                        {repository.kind === "video" ? <span className="grid h-9 w-9 place-items-center border border-[#8bb4ff]/50 bg-[#3b82f6]/25 text-[#f3f8ff] transition-all duration-200 group-hover:scale-110 group-hover:bg-[#3b82f6]"><Play className="h-4 w-4 fill-current" /></span> : <ArrowUpRight className="h-4 w-4 text-[#6fa4ff] transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />}
                      </span>
                      <span className="relative mt-auto block">
                        <span className={`${isCompactGallery ? "mb-3" : "mb-5"} flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.13em] text-[#a4b1c6]`}>{repository.kind === "video" ? <><Clapperboard className="h-3.5 w-3.5" /> registro de campo / assistir</> : "repositório"}</span>
                        <span className={`block font-display font-medium leading-[1.02] tracking-[-0.04em] text-white ${isCompactGallery ? "text-xl" : "text-3xl"}`}>{repository.name}</span>
                        {!isCompactGallery && <span className="mt-4 block max-w-md font-body text-sm leading-6 text-[#c2d0e4]">{repository.description}</span>}
                        {!isCompactGallery && <span className="mt-5 grid max-w-xl gap-3 border-t border-white/10 pt-4 sm:grid-cols-3"><span><span className="block font-mono text-[8px] uppercase tracking-[0.13em] text-[#67e8f9]">papel</span><span className="mt-1 block font-body text-[11px] leading-4 text-[#b9cce3]">{repository.role}</span></span><span><span className="block font-mono text-[8px] uppercase tracking-[0.13em] text-[#67e8f9]">processo</span><span className="mt-1 block font-body text-[11px] leading-4 text-[#b9cce3]">{repository.process}</span></span><span><span className="block font-mono text-[8px] uppercase tracking-[0.13em] text-[#67e8f9]">resultado</span><span className="mt-1 block font-body text-[11px] leading-4 text-[#b9cce3]">{repository.result}</span></span></span>}
                        <span className={`${isCompactGallery ? "mt-4" : "mt-6"} flex flex-wrap gap-2`}>
                          {(isCompactGallery ? repository.technologies.slice(0, 2) : repository.technologies).map((technology) => <span key={technology} className="border border-white/15 bg-[#07101e]/65 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#abb9ce]">{technology}</span>)}
                        </span>
                      </span>
                    </>
                  );

                  const reorderControls = <div className="absolute bottom-5 right-5 z-20 flex items-center gap-1" role="group" aria-label={`Reordenar ${repository.name}`}><span className="grid h-9 w-9 place-items-center border border-[#67e8f9]/30 bg-[#07101e]/75 text-[#9eb5d2]" title="Arraste para reordenar"><GripVertical className="h-4 w-4" aria-hidden="true" /></span><button type="button" onClick={(event) => { event.stopPropagation(); moveProject(repository.id, -1); }} aria-label={`Mover ${repository.name} para cima`} title="Mover para cima" className="grid h-9 w-9 place-items-center border border-[#67e8f9]/30 bg-[#07101e]/75 text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><ChevronUp className="h-4 w-4" aria-hidden="true" /></button><button type="button" onClick={(event) => { event.stopPropagation(); moveProject(repository.id, 1); }} aria-label={`Mover ${repository.name} para baixo`} title="Mover para baixo" className="grid h-9 w-9 place-items-center border border-[#67e8f9]/30 bg-[#07101e]/75 text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><ChevronDown className="h-4 w-4" aria-hidden="true" /></button></div>;
                  const favoriteButton = <button type="button" data-favorite-control="true" aria-label={favoriteProjectIdSet.has(repository.id) ? `Remover ${repository.name} dos favoritos` : `Favoritar ${repository.name}`} aria-pressed={favoriteProjectIdSet.has(repository.id)} onClick={(event) => toggleFavorite(repository.id, event)} title={favoriteProjectIdSet.has(repository.id) ? "Remover dos favoritos" : "Salvar nos favoritos"} className={`relative absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center border transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${favoriteProjectIdSet.has(repository.id) ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : "border-[#8bb4ff]/50 bg-[#07101e]/80 text-[#f3f8ff] hover:border-[#67e8f9] hover:bg-[#3b82f6]"}`}><Heart className={`h-4 w-4 ${favoriteProjectIdSet.has(repository.id) ? "fill-current" : ""}`} aria-hidden="true" />{favoriteProjectIdSet.has(repository.id) && <span aria-hidden="true" className="absolute -right-2 -top-2 border border-[#67e8f9] bg-[#071326] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-[0.08em] text-[#c8f7ff]">salvo</span>}</button>;
                  const imageFavoriteButton = repository.cover ? <button type="button" data-image-favorite-control="true" aria-label={favoriteImageIdSet.has(repository.id) ? `Remover imagem de ${repository.name} da coleção pessoal` : `Salvar imagem de ${repository.name} na coleção pessoal`} aria-pressed={favoriteImageIdSet.has(repository.id)} onClick={(event) => toggleFavoriteImage(repository.id, event)} title={favoriteImageIdSet.has(repository.id) ? "Remover imagem da coleção pessoal" : "Salvar imagem na coleção pessoal"} className={`absolute right-16 top-5 z-20 grid h-10 w-10 place-items-center border transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${favoriteImageIdSet.has(repository.id) ? "border-[#67e8f9] bg-[#0b3156] text-[#a5f3fc] shadow-[0_0_0_1px_rgba(103,232,249,0.25)]" : "border-[#67e8f9]/35 bg-[#07101e]/80 text-[#c8f7ff] hover:border-[#67e8f9] hover:bg-[#0b2746]"}`}><Heart className={`h-4 w-4 ${favoriteImageIdSet.has(repository.id) ? "fill-current" : ""}`} aria-hidden="true" /></button> : null;
                  const lightboxButton = repository.cover ? <button type="button" onClick={(event) => openProjectLightbox(repository.id, event)} aria-label={`Ampliar imagem de ${repository.name}`} title="Ampliar imagem" className="absolute left-5 top-5 z-20 grid h-10 w-10 place-items-center border border-[#8bb4ff]/50 bg-[#07101e]/80 text-[#f3f8ff] transition-all hover:border-[#67e8f9] hover:bg-[#3b82f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-95"><Maximize2 className="h-4 w-4" aria-hidden="true" /></button> : null;
                  return repository.kind === "video" ? (
                    <div key={`${activeTechnology}-${repository.id}`} data-project-id={repository.id} draggable onDragStart={() => startProjectDrag(repository.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropProject(repository.id)} onDragEnd={() => setDraggedProjectId(null)} aria-label={`Projeto ${repository.name}. Arraste para reordenar ou use os controles de mover.`} className={`relative cursor-grab transition-opacity active:cursor-grabbing ${draggedProjectId === repository.id ? "opacity-45" : "opacity-100"}`}>
                      {lightboxButton}
                      {imageFavoriteButton}
                      {favoriteButton}
                      {reorderControls}
                      <button type="button" onClick={() => openProjectDetails(repository)} style={{ animationDelay: `${index * 45}ms` }} className={`project-gallery-card group relative flex w-full flex-col overflow-hidden bg-[#0a0f18] text-left transition-colors hover:bg-[#0d1523] ${galleryView === "list" ? "min-h-[260px] p-5 sm:min-h-[290px] sm:p-7" : isCompactGallery ? "min-h-[220px] p-4 sm:min-h-[250px] sm:p-5" : `p-6 sm:p-8 ${repository.featured ? "min-h-[440px] lg:col-span-2" : "min-h-[380px]"}`}`}>
                        {cardContent}
                      </button>
                    </div>
                  ) : (
                    <div key={`${activeTechnology}-${repository.id}`} data-project-id={repository.id} draggable onDragStart={() => startProjectDrag(repository.id)} onDragOver={(event) => event.preventDefault()} onDrop={() => dropProject(repository.id)} onDragEnd={() => setDraggedProjectId(null)} aria-label={`Projeto ${repository.name}. Arraste para reordenar ou use os controles de mover.`} className={`relative cursor-grab transition-opacity active:cursor-grabbing ${draggedProjectId === repository.id ? "opacity-45" : "opacity-100"}`}>
                      {lightboxButton}
                      {imageFavoriteButton}
                      {favoriteButton}
                      {reorderControls}
                      <a href={repository.url} target="_blank" rel="noreferrer" style={{ animationDelay: `${index * 45}ms` }} className={`project-gallery-card group relative flex flex-col overflow-hidden bg-[#0a0f18] transition-colors hover:bg-[#0d1523] ${galleryView === "list" ? "min-h-[260px] p-5 sm:min-h-[290px] sm:p-7" : isCompactGallery ? "min-h-[220px] p-4 sm:min-h-[250px] sm:p-5" : "min-h-[380px] p-6 sm:p-8"}`}>
                        {cardContent}
                      </a>
                    </div>
                  );
                })}
              </div>
              {hasMoreRepositories && <div className="mt-5 flex flex-col items-center justify-between gap-3 border border-[#67e8f9]/15 bg-[#07101e]/60 px-4 py-4 sm:flex-row sm:px-5"><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f8fb7] light-muted-ink" aria-live="polite">mostrando {displayedRepositories.length} de {visibleRepositories.length}</p><button type="button" onClick={loadMoreProjects} className="inline-flex items-center gap-2 border border-[#67e8f9]/35 bg-[#0b2746] px-4 py-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#c8f7ff] transition-all hover:border-[#67e8f9] hover:bg-[#12385e] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">carregar mais <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" /></button></div>}
              {!hasMoreRepositories && <p role="status" aria-live="polite" className="mt-5 border border-white/[0.1] bg-[#07101e]/60 px-4 py-3 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f8fb7] light-muted-ink">todos os {visibleRepositories.length} projetos desta seleção foram carregados</p>}
              </>
            ) : (
              <div key={`empty-${activeTechnology}`} className="project-gallery-empty grid border border-white/[0.1] bg-[#09101c] lg:grid-cols-[1.42fr_0.58fr]">
                <div className="relative overflow-hidden p-7 sm:p-10">
                  <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-35" />
                  <div className="relative">
                    <span className="grid h-12 w-12 place-items-center border border-[#3b82f6]/40 bg-[#3b82f6]/10 text-[#70a6ff]"><FolderGit2 className="h-5 w-5" /></span>
                    <p className="mt-8 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#72a7fb]">arquivo em preparo / novos trabalhos</p>
                    <h3 className="mt-4 max-w-xl font-display text-[clamp(2rem,3.5vw,3.7rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white">Quando você quiser, a próxima história começa aqui.</h3>
                    <p className="mt-5 max-w-2xl font-body text-sm leading-7 text-[#9fb2ce]">
                      {projectSearch.trim()
                        ? `Nenhum trabalho real com “${projectSearch.trim()}” no nome, tecnologia ou descrição corresponde ao filtro ${activeTechnology}. Tente outro termo ou limpe a busca.`
                        : activeTechnology === "Todos"
                        ? "Quando houver um link do GitHub, um vídeo ou uma nova filmagem, o registro pode entrar aqui com descrição, tecnologias e acesso direto."
                        : `Ainda não há um trabalho real marcado com ${activeTechnology}. Quando houver, ele será filtrado aqui automaticamente.`}
                    </p>
                    <div className="mt-7 flex flex-wrap items-center gap-3"><button type="button" data-empty-clear-filters="true" onClick={clearAllProjectFilters} className="inline-flex items-center gap-2 border border-[#3b82f6]/50 bg-[#3b82f6]/10 px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#d9e8ff] transition-colors hover:border-[#70a6ff] hover:bg-[#3b82f6]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]"><X className="h-3.5 w-3.5" aria-hidden="true" />limpar filtros ativos</button><a href="#contato" className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.13em] text-[#d9e8ff] transition-colors hover:text-[#70a6ff]">enviar material para incluir <ArrowUpRight className="h-3.5 w-3.5" /></a></div>
                  </div>
                </div>
                <div className="border-t border-white/[0.1] bg-[#070b13] p-7 sm:p-10 lg:border-l lg:border-t-0">
                  <Layers2 className="h-5 w-5 text-[#3b82f6]" />
                  <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-[#7189ae]">ficha de inclusão</p>
                  <div className="mt-5 space-y-3 font-mono text-[11px] leading-5 text-[#c8d8ef]">
                    <p><span className="text-[#3b82f6]">01</span> nome do trabalho</p>
                    <p><span className="text-[#3b82f6]">02</span> descrição objetiva</p>
                    <p><span className="text-[#3b82f6]">03</span> tecnologias ou formato</p>
                    <p><span className="text-[#3b82f6]">04</span> link ou arquivo</p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 border-t border-white/[0.1] pt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#60789d]"><Github className="h-3.5 w-3.5" /> pronto para conectar</div>
                </div>
              </div>
            )}
            </div>

            <div className="mt-16 border-t border-cyan-100/[0.12] pt-8 sm:pt-10">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#a5f3fc]">por trás dos trabalhos</p>
                  <h3 className="mt-3 font-display text-[clamp(2rem,3vw,3.5rem)] font-medium leading-none tracking-[-0.05em] text-white">Contexto, escolha e resultado.</h3>
                </div>
                <p className="max-w-sm font-body text-sm leading-7 text-[#accddd]">Cada estudo resume o que precisava ser resolvido, qual caminho foi escolhido e o que a entrega comprova.</p>
              </div>
              <div className="mt-8 grid gap-px bg-cyan-100/[0.1] lg:grid-cols-2">
                {caseStudies.map((study) => (
                  <article key={study.id} className="relative bg-[#071326] p-6 sm:p-8">
                    <div className="flex items-center justify-between gap-4"><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#67e8f9]">{study.id}</span><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7899ae]">nota de processo</span></div>
                    <h4 className="mt-7 font-display text-3xl font-medium tracking-[-0.04em] text-white">{study.title}</h4>
                    <dl className="mt-6 grid gap-5 font-body text-sm leading-7 text-[#bcd9e7]">
                      <div><dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">contexto</dt><dd className="mt-1">{study.context}</dd></div>
                      <div><dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">como resolvi</dt><dd className="mt-1">{study.method}</dd></div>
                      <div><dt className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#718ca4]">o que aprendi</dt><dd className="mt-1 text-[#d9f4ff]">{study.learning}</dd></div>
                    </dl>
                    <div className="mt-7 flex flex-wrap gap-2">{study.tags.map((tag) => <span key={tag} className="border border-cyan-100/[0.16] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-[#a5dff4]">{tag}</span>)}</div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div ref={socialSectionRef} aria-hidden="true" className="h-px w-full" />
        {shouldLoadSocial ? <Suspense fallback={<section id="social" className="archive-chapter border-t border-white/[0.07] bg-[#050c18] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28" aria-label="Carregando repertório social"><div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">carregando repertório social</div></section>}><InstagramRepertoire /></Suspense> : <section id="social" className="archive-chapter border-t border-white/[0.07] bg-[#050c18] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28" aria-label="Repertório social"><div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">repertório social será carregado ao rolar</div></section>}

        <section id="contato" className="archive-chapter relative overflow-hidden bg-[#070a10]">
          <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative mx-auto grid w-full min-w-0 max-w-[1440px] lg:grid-cols-[1fr_1.12fr]">
            <div className="min-w-0 border-b border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24 lg:border-b-0 lg:border-r lg:px-12 lg:py-28">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">08 / solicitação de orçamento</p>
                <h2 className="mt-6 max-w-full break-words font-display text-[clamp(3.1rem,5.6vw,6rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">Tem um projeto? Vamos dar forma.</h2>
                <p className="mt-8 max-w-md font-body text-base leading-8 text-[#c0e3f4]">Não precisa chegar com tudo pronto. Compartilhe o contexto e, juntos, definimos o formato mais útil para o projeto.</p>
              <div className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8ca4c8]"><span className="human-status-dot h-2 w-2 shrink-0 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" /> agenda aberta para novos projetos — vamos começar pelo contexto</div>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#contato-briefing" className="inline-flex items-center justify-center gap-2 bg-[#38bdf8] px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#02111f] transition-all hover:bg-[#a5f3fc] active:scale-[0.97]">preencher briefing <ArrowDown className="h-3.5 w-3.5" /></a>
                <a href={whatsAppUrl} onClick={() => trackPortfolioEvent("whatsapp_click", { source: "contact" })} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 border border-[#67e8f9]/35 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#c9f8ff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746]">abrir WhatsApp <MessageCircle className="h-3.5 w-3.5" /></a>
                <a href={telegramUrl} target="_blank" rel="noreferrer" aria-label="Abrir canal público de atendimento no Telegram" className="group inline-flex items-center justify-center gap-2 border border-[#67e8f9]/35 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#c9f8ff] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0b2746] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Send className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" /> canal público no Telegram</a>
              </div>
              <div className="mt-7 grid max-w-md gap-px border border-white/[0.1] bg-white/[0.1] sm:grid-cols-2">
                <a href="https://www.instagram.com/pablogui000/" target="_blank" rel="noreferrer" className="social-channel group flex items-center gap-3 bg-[#070a10] px-4 py-4">
                  <span className="social-icon-mark grid h-8 w-8 place-items-center border border-[#3b82f6]/35 text-[#77a9fc]"><Instagram className="h-4 w-4" /></span>
                  <span className="min-w-0"><span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f87ad]">Instagram</span><span className="mt-1 block truncate font-mono text-[11px] text-[#e7f0ff]">@pablogui000</span></span>
                </a>
                <a href="https://www.instagram.com/mpjstoryworks/" target="_blank" rel="noreferrer" className="social-channel group flex items-center gap-3 bg-[#070a10] px-4 py-4">
                  <span className="social-icon-mark grid h-8 w-8 place-items-center border border-[#3b82f6]/35 text-[#77a9fc]"><Instagram className="h-4 w-4" /></span>
                  <span className="min-w-0"><span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f87ad]">Instagram</span><span className="mt-1 block truncate font-mono text-[11px] text-[#e7f0ff]">@mpjstoryworks</span></span>
                </a>
              </div>
              <a href="https://ig.me/m/pablogui000" target="_blank" rel="noreferrer" className="group mt-5 inline-flex items-center gap-3 border border-[#38bdf8]/45 bg-[#071b39] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#e4faff] transition-all hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0a2b57] hover:shadow-[0_10px_24px_rgba(56,189,248,0.16)]"><Instagram className="h-4 w-4 text-[#67e8f9]" /> mensagem rápida no Instagram <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
              <div className="mt-5 max-w-md border border-cyan-100/[0.16] bg-[#06172f]/70 px-5 py-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#67e8f9]" />
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">área de atendimento</p>
                    <p className="mt-2 font-body text-sm leading-6 text-[#d3edf8]">Águas Lindas de Goiás, Planaltina (GO/DF) e Entorno.</p>
                    <p className="mt-1 font-body text-xs leading-5 text-[#8eb4c8]">Outras regiões podem ser avaliadas conforme o projeto.</p>
                  </div>
                </div>
              </div>
              <div ref={availabilitySectionRef} className="availability-calendar mt-5 max-w-md border border-cyan-100/[0.16] bg-[#06172f]/80 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div><p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">consulta de disponibilidade</p><p className="mt-1 font-body text-xs leading-5 text-[#a6c7d8]">Segunda a sexta, das 08:00 às 18:00.</p></div>
                  <span className="grid h-9 w-9 place-items-center border border-cyan-100/[0.2] text-[#67e8f9]"><CalendarDays className="h-4 w-4" /></span>
                </div>
                <div className="mt-5 flex items-center justify-between border-y border-cyan-100/[0.12] py-3">
                  <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} aria-label="Mês anterior" className="grid h-8 w-8 place-items-center text-[#b9dfef] transition-colors hover:bg-cyan-100/10 hover:text-[#67e8f9]"><ChevronLeft className="h-4 w-4" /></button>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#e2f7ff]">{calendarMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</p>
                  <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} aria-label="Próximo mês" className="grid h-8 w-8 place-items-center text-[#b9dfef] transition-colors hover:bg-cyan-100/10 hover:text-[#67e8f9]"><ChevronRight className="h-4 w-4" /></button>
                </div>
                <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                  {calendarWeekdays.map((day, index) => <span key={`${day}-${index}`} className="py-1 font-mono text-[9px] text-[#63849a]">{day}</span>)}
                  {calendarDays.map((day, index) => {
                    if (!day) return <span key={`blank-${index}`} />;
                    const dateKey = toDateKey(day);
                    const isBlockedDate = blockedDateKeys.has(dateKey);
                    const isAvailableDate = !isBlockedDatesError && isSelectableAvailabilityDate(day, todayStart, blockedDateKeys);
                    const isSelected = selectedDateKey === dateKey;
                    const dayLabel = day.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
                    return <button key={dateKey} type="button" disabled={!isAvailableDate} onClick={() => { setAvailabilityDate(day); setAvailabilityTime(null); }} aria-label={isBlockedDate ? `${dayLabel}, indisponível` : dayLabel} title={isBlockedDate ? "Data indisponível" : undefined} className={`mx-auto grid h-8 w-8 place-items-center rounded-full font-mono text-[10px] transition-all ${isSelected ? "bg-[#38bdf8] font-semibold text-[#02111f] shadow-[0_0_16px_rgba(56,189,248,0.36)]" : isBlockedDate ? "cursor-not-allowed border border-rose-400/55 bg-rose-400/10 text-rose-300 line-through" : isAvailableDate ? "text-[#d7eff9] hover:bg-cyan-100/15 hover:text-[#67e8f9]" : "cursor-not-allowed text-[#385367] line-through"}`}>{day.getDate()}</button>;
                  })}
                </div>
                {isBlockedDatesError ? <div role="alert" className="mt-3 border-l border-amber-300 bg-amber-300/10 px-3 py-2 font-body text-[11px] leading-5 text-amber-100">Não foi possível verificar as datas indisponíveis. A consulta está temporariamente desativada. <button type="button" onClick={() => void refetchBlockedDates()} className="font-semibold underline decoration-amber-200/60 underline-offset-2 hover:text-white">Tentar novamente</button></div> : blockedDates.length > 0 && <p className="mt-3 border-l border-rose-400/70 pl-3 font-body text-[11px] leading-5 text-rose-200">Datas riscadas em rosa estão indisponíveis para consulta.</p>}
                <div className="mt-5 border-t border-cyan-100/[0.12] pt-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7299ad] light-muted-ink">{selectedDateLabel ? `horário desejado · ${selectedDateLabel}` : "escolha uma data útil"}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {availableTimes.map((time) => <button key={time} type="button" disabled={!availabilityDate || isBlockedDatesError} onClick={() => setAvailabilityTime(time)} className={`border py-2 font-mono text-[10px] transition-colors ${availabilityTime === time ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : availabilityDate && !isBlockedDatesError ? "border-cyan-100/[0.16] text-[#b9dfef] hover:border-[#67e8f9]/55 hover:text-[#67e8f9]" : "cursor-not-allowed border-white/[0.06] text-[#4b677a]"}`}>{time}</button>)}
                  </div>
                </div>
                <button type="button" disabled={!isAvailabilityConsultationReadyForUser || isAvailabilityRedirecting} onClick={consultAvailabilityOnWhatsApp} aria-busy={isAvailabilityRedirecting} aria-describedby="availability-feedback" className="light-dark-cta mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#38bdf8] px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#02111f] transition-all hover:bg-[#a5f3fc] active:scale-[0.97] disabled:cursor-wait disabled:bg-[#16304c] disabled:text-[#6f91a8] light-dark-cta">
                  {isAvailabilityRedirecting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> {getAvailabilityButtonLabel(true)}</> : isBlockedDatesError ? <>indisponível no momento</> : <><MessageCircle className="h-4 w-4 fill-current" aria-hidden="true" /> {getAvailabilityButtonLabel(false)}</>}
                </button>
                <span id="availability-feedback" role="status" aria-live="polite" className="sr-only">{isAvailabilityRedirecting ? "Abrindo o WhatsApp com sua data e horário selecionados." : ""}</span>
                <p className="mt-3 font-body text-[11px] leading-5 text-[#7fa2b6]">A gente confirma a data e o horário diretamente com você, sem compromisso.</p>
              </div>
              <div className="mt-7 max-w-md border-l-2 border-[#38bdf8] bg-[#071a35]/70 px-5 py-5">
                <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">depois do seu briefing</p>
                <ol className="mt-4 space-y-3 font-body text-sm leading-6 text-[#cbe8f6]">
                  <li><span className="mr-2 font-mono text-[#67e8f9]">01</span>O contexto é organizado para definir o que realmente precisa ser produzido.</li>
                  <li><span className="mr-2 font-mono text-[#67e8f9]">02</span>Formato, data e detalhes são alinhados com transparência.</li>
                  <li><span className="mr-2 font-mono text-[#67e8f9]">03</span>A proposta chega com escopo, entrega e próximos passos claros.</li>
                </ol>
              </div>
            </div>

            <div className="min-w-0 px-5 py-16 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
              <form id="contato-briefing" onSubmit={handleSubmit} onFocusCapture={() => { setIsBriefingFieldFocused(true); trackBriefingStarted(); }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsBriefingFieldFocused(false); }} className="max-w-xl scroll-mt-24">
                <div className="mb-8 flex items-center justify-between border-b border-white/[0.1] pb-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#b7cbe8]">formulário de briefing</p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-[#637da5] light-muted-ink">* campos obrigatórios</p>
                </div>
                <div className="grid gap-7">
                  <label aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
                    <span>Website</span>
                    <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
                  </label>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">nome *</span>
                      <input required name="name" autoComplete="name" placeholder="Como você se chama?" className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">e-mail *</span>
                      <input required type="email" name="email" autoComplete="email" placeholder="voce@exemplo.com" className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                    </label>
                  </div>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">serviço desejado *</span>
                      <select required name="service" defaultValue="" className="mt-3 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                        <option value="" disabled>Selecione um serviço</option>
                        <option>Filmagem aérea com drone</option>
                        <option>Captação terrestre</option>
                        <option>Criação de conteúdo</option>
                        <option>Pacote combinado</option>
                        <option>Outro projeto</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">tipo de projeto *</span>
                      <select required name="projectType" defaultValue="" className="mt-3 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                        <option value="" disabled>Selecione uma opção</option>
                        <option>Evento social</option>
                        <option>Evento corporativo</option>
                        <option>Marca ou negócio</option>
                        <option>Imóvel ou espaço</option>
                        <option>Esporte ou atividade externa</option>
                        <option>Outro</option>
                      </select>
                    </label>
                  </div>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">local do projeto *</span>
                      <input required name="location" placeholder="Ex.: Águas Lindas de Goiás" className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">data prevista</span>
                      <input type="date" name="date" onFocus={(event) => { event.currentTarget.style.outline = "2px solid #a5f3fc"; event.currentTarget.style.outlineOffset = "3px"; event.currentTarget.style.boxShadow = "0 0 0 4px rgba(165, 243, 252, 0.28)"; }} onBlur={(event) => { event.currentTarget.style.outline = ""; event.currentTarget.style.outlineOffset = ""; event.currentTarget.style.boxShadow = ""; }} className="mt-3 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6] [color-scheme:dark]" />
                    </label>
                  </div>
                  <div className="grid gap-7 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">formato de entrega</span>
                      <select name="delivery" defaultValue="" className="mt-3 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                        <option value="">A definir</option>
                        <option>Vertical 9:16 para Reels</option>
                        <option>Horizontal 16:9</option>
                        <option>Vertical e horizontal</option>
                        <option>Fotos e vídeos</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">faixa de investimento</span>
                      <select name="budget" defaultValue="" className="mt-3 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                        <option value="">Prefiro conversar</option>
                        <option>Até R$ 500</option>
                        <option>R$ 500 a R$ 1.000</option>
                        <option>R$ 1.000 a R$ 2.000</option>
                        <option>Acima de R$ 2.000</option>
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">briefing do projeto *</span>
                    <textarea required name="briefing" rows={5} placeholder="Conte o objetivo, referências, o que precisa ser registrado e qualquer detalhe importante." className="mt-3 w-full resize-none border-b border-white/15 bg-transparent px-0 py-3 font-body text-base leading-7 text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                </div>
                <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button disabled={quoteRequestMutation.isPending} type="submit" className="h-auto w-fit rounded-none bg-[#38bdf8] px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[#02111f] transition-all hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_12px_30px_rgba(56,189,248,0.30)] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70">
                    {quoteRequestMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> enviando pedido</> : <>quero conversar sobre o projeto <Send className="h-4 w-4" /></>}
                  </Button>
                  <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-[#647a9f] light-muted-ink">seus dados ficam apenas neste pedido</p>
                </div>
                {formError && <p role="alert" className="mt-6 border-l-2 border-rose-400 bg-rose-400/10 px-4 py-3 font-body text-sm text-rose-100">{formError}</p>}
                {formSent && (
                  <div ref={successMessageRef} tabIndex={-1} role="status" aria-live="polite" className="quote-success mt-7 border border-[#3b82f6]/45 bg-[#0a1730] p-5">
                    <div className="flex gap-4">
                      <span className="quote-success-icon grid h-11 w-11 shrink-0 place-items-center border border-[#3b82f6] bg-[#3b82f6] text-white"><CheckCircle2 className="h-5 w-5" /></span>
                      <div>
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a5f3fc]">briefing recebido</p>
                        <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">Tudo certo: seu pedido chegou.</h3>
                        <p className="mt-2 max-w-lg font-body text-sm leading-6 text-[#d2edf8]">Obrigado por compartilhar sua ideia. Vou analisar as informações e retorno pelo e-mail informado para conversar sobre os próximos passos.</p>
                        <button type="button" onClick={() => setFormSent(false)} className="mt-4 inline-flex items-center gap-2 border-b border-[#3b82f6] pb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#e4efff] transition-colors hover:text-[#77a9fc]">quero contar outra ideia <ArrowUpRight className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </section>
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

      {resumePreviewOpen && (
        <div className="resume-preview-overlay fixed inset-0 z-[70] grid place-items-center bg-[#02050a]/85 p-3 backdrop-blur-md motion-safe:animate-in motion-safe:fade-in duration-200 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="resume-preview-title" aria-describedby="resume-preview-description" onMouseDown={(event) => { if (event.target === event.currentTarget) closeResumePreview(); }}>
          <div className="resume-preview-modal flex h-[min(92svh,900px)] w-full max-w-5xl flex-col overflow-hidden border border-[#67e8f9]/35 bg-[#07101e] shadow-[0_24px_100px_rgba(0,0,0,0.62)]">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#67e8f9]">documento em leitura</p>
                <h2 id="resume-preview-title" className="mt-1 truncate font-display text-xl tracking-[-0.03em] text-white sm:text-2xl">Portfólio de Pablo Guilherme</h2>
                <p id="resume-preview-description" className="mt-1 font-body text-xs text-[#9fb2ce]">Pré-visualize o PDF diretamente na página antes de salvar uma cópia.</p>
              </div>
              <button ref={resumePreviewCloseRef} type="button" onClick={closeResumePreview} aria-label="Fechar pré-visualização do portfólio" title="Fechar pré-visualização" className="grid h-10 w-10 shrink-0 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><X className="h-5 w-5" aria-hidden="true" /></button>
            </div>
            <div className="resume-preview-frame-wrap relative min-h-0 flex-1 bg-[#2b3440] p-2 sm:p-4">
              {resumePreviewLoading && !resumePreviewError && (
                <div className="resume-pdf-loader absolute inset-2 z-10 grid place-items-center border border-[#67e8f9]/20 bg-[#07101e]/95 sm:inset-4" role="status" aria-live="polite">
                  <div className="flex flex-col items-center gap-4 text-center">
                    <span className="resume-loader-orbit relative grid h-14 w-14 place-items-center rounded-full border border-[#67e8f9]/25" aria-hidden="true"><span className="h-8 w-8 rounded-full border-2 border-[#67e8f9]/20 border-t-[#67e8f9] motion-safe:animate-spin" /></span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#c8f7ff]">abrindo portfólio</span>
                    <div className="w-[min(260px,70vw)]" aria-label="Progresso estimado da leitura do portfólio">
                      <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-[#8499b9]"><span>progresso estimado</span><span>{resumePreviewProgress}%</span></div>
                      <div className="h-1 overflow-hidden rounded-full bg-[#19324d]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={resumePreviewProgress} aria-label="Progresso estimado da leitura do portfólio"><div className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] via-[#67e8f9] to-[#d9fbff] transition-[width] duration-200 ease-out" style={{ width: `${resumePreviewProgress}%` }} /></div>
                    </div>
                    <span className="font-body text-xs text-[#8499b9]">Preparando a leitura do documento…</span>
                  </div>
                </div>
              )}
              {resumePreviewError && (
                <div className="absolute inset-2 z-10 grid place-items-center border border-amber-200/30 bg-[#07101e] p-6 text-center sm:inset-4" role="alert">
                  <div className="max-w-sm">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-200">pré-visualização indisponível</p>
                    <p className="mt-3 font-body text-sm leading-6 text-[#c7d7ec]">O PDF não conseguiu ser renderizado aqui. Você ainda pode baixar o arquivo ou abri-lo em uma nova aba.</p>
                    <button type="button" onClick={() => { setResumePreviewError(false); setResumePreviewProgress(8); setResumePreviewLoading(true); }} className="mt-5 min-h-11 border border-[#67e8f9] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#c8f7ff] transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">tentar novamente</button>
                  </div>
                </div>
              )}
              <iframe key={resumePreviewLoading ? "loading" : "ready"} src={resumeUrl} title="Pré-visualização do portfólio de Pablo Guilherme em PDF" onLoad={() => { setResumePreviewProgress(100); setResumePreviewLoading(false); setResumePreviewError(false); }} onError={() => { setResumePreviewLoading(false); setResumePreviewError(true); }} className={`h-full w-full border border-white/10 bg-white transition-opacity duration-300 ${resumePreviewLoading || resumePreviewError ? "opacity-0" : "opacity-100"}`} />
            </div>
            <div className="flex shrink-0 flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#7189ae]">PDF atualizado · links clicáveis incluídos</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <a href={resumeUrl} download="portfolio-pablo-guilherme.pdf" className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#67e8f9] bg-[#38bdf8] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#02111f] transition-colors hover:bg-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Download className="h-4 w-4" aria-hidden="true" /> baixar portfólio em PDF</a>
                <a href={resumeUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/15 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><ArrowUpRight className="h-4 w-4" aria-hidden="true" /> abrir em nova aba</a>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <div className="absolute left-3 top-3 z-20 flex items-center gap-1 border border-white/15 bg-[#06172f]/90 p-1 font-mono text-[9px] uppercase tracking-[0.08em] text-[#c8e5f0]" role="group" aria-label="Controles de zoom"><button type="button" onClick={() => setProjectZoom(lightboxZoom - 0.25)} aria-label="Reduzir zoom (mínimo 100%)" className="grid h-9 w-9 place-items-center text-lg transition-colors hover:bg-[#0b2746] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">−</button><span className="min-w-[3.5rem] text-center" aria-live="polite">{Math.round(lightboxZoom * 100)}%</span><button type="button" onClick={() => setProjectZoom(lightboxZoom + 0.25)} aria-label="Aumentar zoom (máximo 300%)" className="grid h-9 w-9 place-items-center text-lg transition-colors hover:bg-[#0b2746] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">+</button><button type="button" onClick={resetProjectZoom} disabled={lightboxZoom === 1} aria-label="Redefinir zoom e posição da imagem" data-tooltip="Redefinir zoom e posição" className="border-l border-white/15 px-2 py-2 text-[8px] transition-colors hover:bg-[#0b2746] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">1:1</button><button type="button" onClick={clearLightboxSessionPreferences} aria-label="Limpar preferência de zoom desta sessão" data-tooltip="Limpar zoom salvo na sessão" className="border-l border-white/15 px-2 py-2 text-[8px] transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">limpar</button></div>
              {showLightboxShortcutLegend && <div className="pointer-events-none absolute bottom-4 left-4 z-20 hidden border border-white/15 bg-[#06172f]/85 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.08em] text-[#b8d9e7] motion-safe:animate-in motion-safe:fade-in sm:block" aria-label="Atalhos do lightbox">atalhos: +/− zoom · setas movem · ←→ navegam</div>}
              <div className="sr-only" aria-live="polite" aria-atomic="true">{lightboxPositionAnnouncement}</div>
              {lightboxZoom > 1 && (() => { const mapPosition = calculateMiniMapPosition(lightboxZoom, lightboxOffset, getPanBounds()); const { left, top, viewportWidth, viewportHeight, xPercent: positionX, yPercent: positionY } = mapPosition; return <div className={`absolute bottom-4 right-4 z-20 hidden h-20 w-28 touch-none overflow-hidden border border-[#67e8f9]/40 bg-[#06172f]/90 shadow-[0_8px_24px_rgba(0,0,0,0.3)] sm:block ${miniMapDragging ? "cursor-grabbing" : "cursor-grab"}`} role="button" tabIndex={0} aria-label={`Mini-mapa interativo da imagem ampliada em ${Math.round(lightboxZoom * 100)}%. Arraste o quadro para reposicionar`} onPointerDown={handleMiniMapPointerDown} onPointerMove={handleMiniMapPointerMove} onPointerUp={handleMiniMapPointerEnd} onPointerCancel={handleMiniMapPointerEnd} onClick={(event) => { if (!miniMapDragRef.current.active) repositionFromMiniMap(event.clientX, event.clientY, event.currentTarget); }} onFocus={revealShortcutLegend} onKeyDown={(event) => { revealShortcutLegend(); if (event.key === "Enter" || event.key === " ") { event.preventDefault(); repositionFromMiniMap(event.currentTarget.getBoundingClientRect().left + event.currentTarget.getBoundingClientRect().width / 2, event.currentTarget.getBoundingClientRect().top + event.currentTarget.getBoundingClientRect().height / 2, event.currentTarget); } }} style={{ backgroundImage: `url(${lightboxProject.cover})`, backgroundPosition: "center", backgroundSize: "cover" }}><span className="absolute border-2 border-[#a5f3fc] bg-[#67e8f9]/20" style={{ left: `${left}%`, top: `${top}%`, width: `${viewportWidth}%`, height: `${viewportHeight}%` }} /><span className="pointer-events-none absolute inset-x-1 bottom-1 bg-[#030812]/85 px-1 py-0.5 text-center font-mono text-[7px] uppercase tracking-[0.08em] text-[#d9fbff]" aria-live="polite">{positionX}% · {positionY}%</span></div>; })()}
              <div ref={lightboxImageContainerRef} className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden">
                {showSwipeHint && <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 border border-[#67e8f9]/30 bg-[#06172f]/90 px-4 py-2 text-center shadow-[0_8px_24px_rgba(0,0,0,0.25)] motion-safe:animate-in motion-safe:fade-in" role="status" aria-live="polite"><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff]">deslize para navegar</span></div>}
                {lightboxImageLoading && !lightboxImageError && <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center px-6" role="status" aria-live="polite"><span className="inline-flex max-w-sm flex-col items-center gap-2 border border-[#67e8f9]/25 bg-[#06172f]/90 px-4 py-3 text-center shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur-sm"><span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff]"><span className="h-3 w-3 animate-spin rounded-full border border-[#67e8f9]/30 border-t-[#a5f3fc] motion-reduce:animate-none" aria-hidden="true" /> carregando imagem</span><strong className="font-display text-lg font-medium tracking-[-0.03em] text-white">{lightboxProject.name}</strong><span className="font-body text-xs leading-5 text-[#b8d9e7]">{lightboxProject.description}</span></span></div>}
                {lightboxImageError && <div className="absolute inset-0 z-10 grid place-items-center px-6 text-center" role="alert"><div className="max-w-sm border border-[#fb7185]/35 bg-[#190f1c]/95 px-5 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.28)]"><p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#fda4af]">imagem indisponível</p><p className="mt-2 font-display text-xl font-medium tracking-[-0.03em] text-white">Não conseguimos abrir esta imagem agora.</p><p className="mt-2 font-body text-sm leading-6 text-[#f6d8df]">Você pode tentar novamente ou continuar navegando pelos projetos.</p><button type="button" onClick={() => { setLightboxImageError(false); setLightboxImageLoading(true); setLightboxImageAttempt((attempt) => attempt + 1); }} className="mt-4 border border-[#fda4af]/55 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#ffe4e8] transition-colors hover:bg-[#4b1d2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fda4af]">tentar novamente</button></div></div>}
                <img ref={lightboxImageRef} key={`${lightboxProject.id}-${lightboxImageAttempt}`} src={lightboxProject.cover} alt={`Imagem ampliada do projeto ${lightboxProject.name}`} onLoad={() => { setLightboxImageLoading(false); setLightboxImageError(false); }} onError={() => { setLightboxImageLoading(false); setLightboxImageError(true); }} onTouchStart={handleLightboxTouchStart} onTouchMove={handleLightboxTouchMove} onTouchEnd={handleLightboxTouchEnd} onTouchCancel={handleLightboxTouchEnd} onPointerDown={handleLightboxPointerDown} onPointerMove={handleLightboxPointerMove} onPointerUp={handleLightboxPointerEnd} onPointerCancel={handleLightboxPointerEnd} onDoubleClick={() => setProjectZoom(lightboxZoom > 1 ? 1 : 3)} style={{ transform: `translate(${lightboxOffset.x}px, ${lightboxOffset.y}px) scale(${lightboxZoom})`, transformOrigin: "center center", touchAction: "none" }} className={`h-auto max-h-full max-w-full w-auto object-contain ${lightboxZoom > 1 ? (lightboxPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-default"} transition-[transform,opacity] ${lightboxResetting ? "duration-300" : "duration-150"} motion-reduce:transition-none ${lightboxImageLoading || lightboxImageError ? "opacity-0" : "opacity-100"}`} />
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
            <button type="button" data-lightbox-mobile-details-toggle="true" onClick={() => setShowLightboxMobileDetails((open) => !open)} aria-expanded={showLightboxMobileDetails} className="flex w-full items-center justify-between border-t border-white/10 bg-[#06101e] px-5 py-3 text-left font-mono text-[9px] uppercase tracking-[0.12em] text-[#bdf7ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a5f3fc] sm:hidden"><span>{showLightboxMobileDetails ? "ocultar contexto e miniaturas" : "ver contexto e miniaturas"}</span><ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showLightboxMobileDetails ? "rotate-180" : ""}`} aria-hidden="true" /></button>
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
                  <button type="button" data-project-modal-favorite="true" onClick={(event) => toggleFavorite(selectedProject.id, event)} aria-pressed={favoriteProjectIdSet.has(selectedProject.id)} aria-label={favoriteProjectIdSet.has(selectedProject.id) ? `Remover ${selectedProject.name} dos projetos salvos` : `Salvar ${selectedProject.name} nos projetos favoritos`} className={`inline-flex min-h-10 items-center gap-2 self-start border px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97] ${favoriteProjectIdSet.has(selectedProject.id) ? "border-[#67e8f9] bg-[#0b3156] text-[#e5fbff]" : "border-[#3b82f6]/35 text-[#cfe3ff] hover:border-[#70a6ff] hover:text-white"}`}><Heart className={`h-4 w-4 ${favoriteProjectIdSet.has(selectedProject.id) ? "fill-current" : ""}`} aria-hidden="true" />{favoriteProjectIdSet.has(selectedProject.id) ? "salvo nos favoritos" : "salvar nos favoritos"}</button>
                  <button type="button" data-project-modal-share="true" onClick={shareSelectedProject} aria-label={`Copiar link direto de ${selectedProject.name}`} className="inline-flex min-h-10 items-center gap-2 border border-[#3b82f6]/35 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#70a6ff] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]"><Share2 className="h-4 w-4" aria-hidden="true" />{projectShareStatus === "copied" ? "link copiado" : projectShareStatus === "error" ? "tentar novamente" : "compartilhar projeto"}</button>
                  <button type="button" data-project-modal-copy-link="true" onClick={copySelectedProjectLink} aria-label={`Copiar link de ${selectedProject.name}`} className="inline-flex min-h-10 items-center gap-2 border border-[#67e8f9]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] active:scale-[0.97]"><Copy className="h-4 w-4" aria-hidden="true" />{projectCopyStatus === "copied" ? "link copiado" : projectCopyStatus === "error" ? "tentar novamente" : "copiar link"}</button>
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
              <div className="mt-7 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:flex sm:items-center sm:justify-between"><button type="button" data-project-modal-previous="true" onClick={() => navigateSelectedProject("previous")} disabled={!previousSelectedProject} aria-label={previousSelectedProject ? `Ver projeto anterior: ${previousSelectedProject.name}` : "Nenhum projeto anterior"} className="inline-flex min-h-10 items-center gap-2 border border-[#3b82f6]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#70a6ff] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-not-allowed disabled:opacity-35"><ChevronLeft className="h-4 w-4" aria-hidden="true" />anterior</button><span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7189ae]" aria-live="polite">{selectedProjectIndex >= 0 ? `${String(selectedProjectIndex + 1).padStart(2, "0")} / ${String(visibleRepositories.length).padStart(2, "0")}` : ""}</span><button type="button" data-project-modal-next="true" onClick={() => navigateSelectedProject("next")} disabled={!nextSelectedProject} aria-label={nextSelectedProject ? `Ver próximo projeto: ${nextSelectedProject.name}` : "Nenhum próximo projeto"} className="inline-flex min-h-10 items-center gap-2 border border-[#3b82f6]/30 px-3.5 font-mono text-[9px] uppercase tracking-[0.1em] text-[#cfe3ff] transition-colors hover:border-[#70a6ff] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-not-allowed disabled:opacity-35">próximo<ChevronRight className="h-4 w-4" aria-hidden="true" /></button></div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
