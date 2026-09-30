import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { getSafeStorage, readStorage, writeStorage } from "@/lib/safeStorage";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { buildProjectShareUrl } from "@/features/portfolio/utils/shareProject";
import type { Repository } from "@/features/portfolio/portfolioData";

type UsePortfolioProjectDetailsOptions = {
  repositories: Repository[];
  manualProjectOrder: string[];
};

export function usePortfolioProjectDetails({
  repositories,
  manualProjectOrder,
}: UsePortfolioProjectDetailsOptions) {
  const [selectedProject, setSelectedProject] = useState<Repository | null>(null);
  const [projectDetailsLoading, setProjectDetailsLoading] = useState(false);
  const [projectDetailsTransition, setProjectDetailsTransition] = useState<
    "next" | "previous" | null
  >(null);
  const [showProjectSwipeHint, setShowProjectSwipeHint] = useState(false);
  const [projectShareStatus, setProjectShareStatus] = useState<
    "idle" | "copied" | "error"
  >("idle");
  const [projectCopyStatus, setProjectCopyStatus] = useState<
    "idle" | "copied" | "error"
  >("idle");
  const projectDetailsSwipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const projectNavigationRepositories = useMemo(() => {
    const orderIndex = new Map(manualProjectOrder.map((id, index) => [id, index]));
    return [...repositories].sort(
      (first, second) =>
        (orderIndex.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
        (orderIndex.get(second.id) ?? Number.MAX_SAFE_INTEGER),
    );
  }, [manualProjectOrder, repositories]);

  const selectedProjectIndex = selectedProject
    ? projectNavigationRepositories.findIndex(
        (repository) => repository.id === selectedProject.id,
      )
    : -1;
  const previousSelectedProject =
    selectedProjectIndex > 0
      ? projectNavigationRepositories[selectedProjectIndex - 1]
      : null;
  const nextSelectedProject =
    selectedProjectIndex >= 0 &&
    selectedProjectIndex < projectNavigationRepositories.length - 1
      ? projectNavigationRepositories[selectedProjectIndex + 1]
      : null;

  const openProjectDetails = useCallback((project: Repository) => {
    trackPortfolioEvent("project_opened", {
      projectId: project.id,
      surface: "details",
    });
    setProjectDetailsLoading(true);
    if (
      window.innerWidth < 768 &&
      !readStorage(
        getSafeStorage("local"),
        "pablo-portfolio-project-swipe-hint-seen",
      )
    ) {
      setShowProjectSwipeHint(true);
      writeStorage(
        getSafeStorage("local"),
        "pablo-portfolio-project-swipe-hint-seen",
        "true",
      );
      window.setTimeout(() => setShowProjectSwipeHint(false), 2800);
    }
    setSelectedProject(project);
  }, []);

  const closeProjectDetails = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const navigateSelectedProject = useCallback(
    (direction: "next" | "previous") => {
      const target =
        direction === "next" ? nextSelectedProject : previousSelectedProject;
      if (!target) return;
      setShowProjectSwipeHint(false);
      setProjectDetailsLoading(true);
      setProjectDetailsTransition(direction);
      setSelectedProject(target);
      window.setTimeout(() => setProjectDetailsTransition(null), 260);
    },
    [nextSelectedProject, previousSelectedProject],
  );

  function handleProjectDetailsTouchStart(event: TouchEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement | null;
    if (target?.closest("button, a, input, summary")) {
      projectDetailsSwipeStartRef.current = null;
      return;
    }
    if (event.touches.length === 1) {
      projectDetailsSwipeStartRef.current = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
    }
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
    const sharedProjectId = new URLSearchParams(window.location.search).get("projeto");
    if (!sharedProjectId || selectedProject || !repositories.length) return;
    const sharedProject = repositories.find(
      (repository) => repository.id === sharedProjectId,
    );
    if (sharedProject) openProjectDetails(sharedProject);
  }, [openProjectDetails, repositories, selectedProject]);

  useEffect(() => {
    if (!selectedProject) {
      setProjectDetailsLoading(false);
      return;
    }
    const timer = window.setTimeout(() => setProjectDetailsLoading(false), 420);
    return () => window.clearTimeout(timer);
  }, [selectedProject]);

  useEffect(() => {
    if (!selectedProject) return;
    const handleProjectDetailsKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) {
        return;
      }
      if (event.key === "ArrowRight" && nextSelectedProject) {
        event.preventDefault();
        navigateSelectedProject("next");
      } else if (event.key === "ArrowLeft" && previousSelectedProject) {
        event.preventDefault();
        navigateSelectedProject("previous");
      }
    };
    window.addEventListener("keydown", handleProjectDetailsKeyDown);
    return () =>
      window.removeEventListener("keydown", handleProjectDetailsKeyDown);
  }, [
    navigateSelectedProject,
    nextSelectedProject,
    previousSelectedProject,
    selectedProject,
  ]);

  const getSelectedProjectUrl = useCallback(() => {
    if (!selectedProject) return "";
    return buildProjectShareUrl(window.location.href, selectedProject.id);
  }, [selectedProject]);

  const shareSelectedProject = useCallback(async () => {
    const projectUrl = getSelectedProjectUrl();
    if (!projectUrl) return;
    try {
      await navigator.clipboard.writeText(projectUrl);
      if (selectedProject) {
        trackPortfolioEvent("share_project", {
          projectId: selectedProject.id,
          channel: "copy_link",
        });
      }
      setProjectShareStatus("copied");
    } catch {
      setProjectShareStatus("error");
    }
    window.setTimeout(() => setProjectShareStatus("idle"), 2400);
  }, [getSelectedProjectUrl, selectedProject]);

  const copySelectedProjectLink = useCallback(async () => {
    const projectUrl = getSelectedProjectUrl();
    if (!projectUrl) return;
    try {
      await navigator.clipboard.writeText(projectUrl);
      if (selectedProject) {
        trackPortfolioEvent("share_project", {
          projectId: selectedProject.id,
          channel: "copy_link",
        });
      }
      setProjectCopyStatus("copied");
    } catch {
      setProjectCopyStatus("error");
    }
    window.setTimeout(() => setProjectCopyStatus("idle"), 2400);
  }, [getSelectedProjectUrl, selectedProject]);

  return {
    selectedProject,
    projectDetailsLoading,
    projectDetailsTransition,
    showProjectSwipeHint,
    projectShareStatus,
    projectCopyStatus,
    projectNavigationRepositories,
    selectedProjectIndex,
    previousSelectedProject,
    nextSelectedProject,
    openProjectDetails,
    closeProjectDetails,
    navigateSelectedProject,
    handleProjectDetailsTouchStart,
    handleProjectDetailsTouchEnd,
    shareSelectedProject,
    copySelectedProjectLink,
  };
}
