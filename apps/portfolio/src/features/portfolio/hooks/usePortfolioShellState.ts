import { useEffect, useRef, useState } from "react";
import { portfolioNavigationItems } from "@/features/portfolio/portfolioConfig";
import { normalizeScrollProgress } from "@/features/portfolio/utils/mobileJourney";
import { subscribeToMediaQuery } from "@/lib/mediaQuery";

export function usePortfolioShellState() {
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileDockCompact, setIsMobileDockCompact] = useState(false);
  const [activeSection, setActiveSection] = useState("inicio");
  const [isDesktopViewport, setIsDesktopViewport] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.matchMedia("(min-width: 768px)").matches
  );
  const [isHeroCtaVisible, setIsHeroCtaVisible] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 1023px)").matches
  );

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
    const unsubscribeMobileQuery = subscribeToMediaQuery(
      mobileQuery,
      scheduleSync
    );

    return () => {
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      unsubscribeMobileQuery();
    };
  }, []);

  useEffect(() => {
    const sectionIds = [
      "inicio",
      ...portfolioNavigationItems.map(([, , id]) => id),
      "contato",
    ];
    let sections = sectionIds
      .map(id => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    let frameId: number | null = null;
    let previousScrollY = window.scrollY;

    const refreshSections = () => {
      sections = sectionIds
        .map(id => document.getElementById(id))
        .filter((section): section is HTMLElement => Boolean(section));
    };

    const updateScrollState = () => {
      frameId = null;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = normalizeScrollProgress(
        scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0
      );
      const readingLine = window.scrollY + window.innerHeight * 0.22;
      let nextSection = "inicio";

      // The visitor journey can differ from the menu's order. Choose the
      // nearest preceding section by its current layout position.
      let nearestSectionTop = Number.NEGATIVE_INFINITY;
      for (const section of sections) {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= readingLine + 1 && sectionTop >= nearestSectionTop) {
          nearestSectionTop = sectionTop;
          nextSection = section.id;
        }
      }

      setShowBackToTop(window.scrollY > 640);
      if (window.innerWidth < 768) {
        const delta = window.scrollY - previousScrollY;
        if (window.scrollY < 240 || delta < -12) setIsMobileDockCompact(false);
        else if (delta > 12) setIsMobileDockCompact(true);
      } else {
        setIsMobileDockCompact(false);
      }

      previousScrollY = window.scrollY;
      setScrollProgress(nextProgress);
      setActiveSection(nextSection);
    };

    const scheduleScrollUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateScrollState);
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            refreshSections();
            scheduleScrollUpdate();
          });

    refreshSections();
    updateScrollState();
    resizeObserver?.observe(document.body);
    window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
    window.addEventListener("resize", scheduleScrollUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleScrollUpdate);
      window.removeEventListener("resize", scheduleScrollUpdate);
      resizeObserver?.disconnect();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleViewportChange = () => setIsDesktopViewport(mediaQuery.matches);
    handleViewportChange();
    return subscribeToMediaQuery(mediaQuery, handleViewportChange);
  }, []);

  return {
    activeSection,
    heroCtaRef,
    isDesktopViewport,
    isHeroCtaVisible,
    isMobileDockCompact,
    scrollProgress,
    showBackToTop,
  };
}
