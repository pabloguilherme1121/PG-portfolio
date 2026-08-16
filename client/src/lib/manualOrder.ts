export function normalizeManualOrder(storedIds: unknown, validIds: string[]) {
  const validIdSet = new Set(validIds);
  const persistedIds = Array.isArray(storedIds)
    ? storedIds.filter((id): id is string => typeof id === "string" && validIdSet.has(id)).filter((id, index, ids) => ids.indexOf(id) === index)
    : [];
  return [...persistedIds, ...validIds.filter((id) => !persistedIds.includes(id))];
}

export function moveProjectInOrder(order: string[], projectId: string, direction: -1 | 1) {
  const nextOrder = [...order];
  const currentIndex = nextOrder.indexOf(projectId);
  const targetIndex = currentIndex + direction;
  if (currentIndex < 0 || targetIndex < 0 || targetIndex >= nextOrder.length) return order;
  [nextOrder[currentIndex], nextOrder[targetIndex]] = [nextOrder[targetIndex], nextOrder[currentIndex]];
  return nextOrder;
}

export function dropProjectInOrder(order: string[], draggedProjectId: string, targetProjectId: string) {
  if (draggedProjectId === targetProjectId) return order;
  const nextOrder = [...order];
  const fromIndex = nextOrder.indexOf(draggedProjectId);
  const toIndex = nextOrder.indexOf(targetProjectId);
  if (fromIndex < 0 || toIndex < 0) return order;
  const [movedProject] = nextOrder.splice(fromIndex, 1);
  const adjustedTargetIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
  nextOrder.splice(adjustedTargetIndex, 0, movedProject);
  return nextOrder;
}
