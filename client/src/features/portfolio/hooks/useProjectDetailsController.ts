import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { getSafeStorage, readStorage, writeStorage } from "@/lib/safeStorage";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { buildProjectShareUrl } from "@/features/portfolio/utils/shareProject";
import { getProjectNavigationModel } from "@/features/portfolio/utils/projectNavigation";
import type { Repository } from "@/features/portfolio/portfolioData";

type ProjectFeedbackStatus = "idle" | "copied" | "error";

type UseProjectDetailsControllerOptions = {
  repositories: readonly Repository[];
  manualProjectOrder: readonly string[];
};

export function useProjectDetailsController({
  repositories,
  manualProjectOrder,
}: UseProjectDetailsControllerOptions) {
  const [selectedProject, setSelectedProject] = useState<Repository | null>(null);
  const [projectDetailsTransition, setProjectDetailsTransition] = useState<
    "next" | "previous" | null
  >(null);
  const [projectDetailsLoading, setProjectDetailsLoading] = useState(false);
  const [showProjectSwipeHint, setShowProjectSwipeHint] = useState(false);
  const [projectShareStatus, setProjectShareStatus] =
    useState<ProjectFeedbackStatus>("idle");
  const [projectCopyStatus, setProjectCopyStatus] =
    useState<ProjectFeedbackStatus>("idle");
  const projectDetailsSwipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const navigation = useMemo(
    () =>
      getProjectNavigationModel(
        repositories,
        manualProjectOrder,
        selectedProject?.id ?? null,
      ),
    [manualProjectOrder, repositories, selectedProject?.id],
  );

  function openProjectDetails(project: Repository) {
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
  }

  function closeProjectDetails() {
    setSelectedProject(null);
  }

  function navigateSelectedProject(direction: "next" | "previous") {
    const target =
      direction === "next"
        ? navigation.nextProject
        : navigation.previousProject;
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

    if (deltaX < 0 && navigation.nextProject) navigateSelectedProject("next");
    if (deltaX > 0 && navigation.previousProject) {
      navigateSelectedProject("previous");
    }
  }

  function getSelectedProjectUrl() {
    if (!selectedProject) return "";
    return buildProjectShareUrl(window.location.href, selectedProject.id);
  }

  async function copyProjectUrl(
    setStatus: (status: ProjectFeedbackStatus) => void,
  ) {
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
      setStatus("copied");
    } catch {
      setStatus("error");
    }

    window.setTimeout(() => setStatus("idle"), 2400);
  }

  function shareSelectedProject() {
    return copyProjectUrl(setProjectShareStatus);
  }

  function copySelectedProjectLink() {
    return copyProjectUrl(setProjectCopyStatus);
  }

  useEffect(() => {
    const sharedProjectId = new URLSearchParams(window.location.search).get(
      "projeto",
    );
    if (!sharedProjectId || selectedProject || !repositories.length) return;

    const sharedProject = repositories.find(
      (repository) => repository.id === sharedProjectId,
    );
    if (sharedProject) openProjectDetails(sharedProject);
  }, [repositories, selectedProject]);

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
      if (
        target?.matches(
          "input, textarea, select, [contenteditable='true']",
        )
      ) {
        return;
      }

      if (event.key === "ArrowRight" && navigation.nextProject) {
        event.preventDefault();
        navigateSelectedProject("next");
      } else if (event.key === "ArrowLeft" && navigation.previousProject) {
        event.preventDefault();
        navigateSelectedProject("previous");
      }
    };

    window.addEventListener("keydown", handleProjectDetailsKeyDown);
    return () => window.removeEventListener("keydown", handleProjectDetailsKeyDown);
  }, [
    selectedProject,
    navigation.nextProject,
    navigation.previousProject,
  ]);

  return {
    selectedProject,
    projectDetailsLoading,
    projectDetailsTransition,
    showProjectSwipeHint,
    projectShareStatus,
    projectCopyStatus,
    previousSelectedProject: navigation.previousProject,
    nextSelectedProject: navigation.nextProject,
    selectedProjectIndex: navigation.projectIndex,
    projectCount: navigation.projectCount,
    openProjectDetails,
    closeProjectDetails,
    navigateSelectedProject,
    handleProjectDetailsTouchStart,
    handleProjectDetailsTouchEnd,
    shareSelectedProject,
    copySelectedProjectLink,
  };
}
