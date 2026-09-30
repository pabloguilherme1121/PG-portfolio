type ProjectLike = {
  id: string;
};

export function orderRepositoriesForNavigation<T extends ProjectLike>(
  repositories: readonly T[],
  manualProjectOrder: readonly string[],
): T[] {
  const orderIndex = new Map(
    manualProjectOrder.map((projectId, index) => [projectId, index]),
  );

  return [...repositories].sort(
    (first, second) =>
      (orderIndex.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
      (orderIndex.get(second.id) ?? Number.MAX_SAFE_INTEGER),
  );
}

export function getProjectNavigationModel<T extends ProjectLike>(
  repositories: readonly T[],
  manualProjectOrder: readonly string[],
  selectedProjectId: string | null,
) {
  const orderedProjects = orderRepositoriesForNavigation(
    repositories,
    manualProjectOrder,
  );
  const projectIndex = selectedProjectId
    ? orderedProjects.findIndex((project) => project.id === selectedProjectId)
    : -1;

  return {
    orderedProjects,
    projectIndex,
    previousProject: projectIndex > 0 ? orderedProjects[projectIndex - 1] : null,
    nextProject:
      projectIndex >= 0 && projectIndex < orderedProjects.length - 1
        ? orderedProjects[projectIndex + 1]
        : null,
    projectCount: orderedProjects.length,
  };
}
