export const PINCH_ZOOM_SENSITIVITY = 0.86;

export type MiniMapPosition = {
  left: number;
  top: number;
  viewportWidth: number;
  viewportHeight: number;
  xPercent: number;
  yPercent: number;
};

export function calculateMiniMapPosition(
  zoom: number,
  offset: { x: number; y: number },
  bounds: { x: number; y: number },
): MiniMapPosition {
  const safeZoom = Math.min(3, Math.max(1, zoom));
  const viewportWidth = Math.max(18, 100 / safeZoom);
  const viewportHeight = Math.max(18, 100 / safeZoom);
  const left = Math.min(100 - viewportWidth, Math.max(0, 50 - (bounds.x ? (offset.x / bounds.x) * 50 : 0) - viewportWidth / 2));
  const top = Math.min(100 - viewportHeight, Math.max(0, 50 - (bounds.y ? (offset.y / bounds.y) * 50 : 0) - viewportHeight / 2));
  return {
    left,
    top,
    viewportWidth,
    viewportHeight,
    xPercent: Math.round(left + viewportWidth / 2),
    yPercent: Math.round(top + viewportHeight / 2),
  };
}

export function calculatePinchZoom(startZoom: number, startDistance: number, currentDistance: number): number {
  if (!Number.isFinite(startDistance) || startDistance <= 0 || !Number.isFinite(currentDistance) || currentDistance <= 0) return startZoom;
  const distanceRatio = currentDistance / startDistance;
  return Math.min(3, Math.max(1, startZoom * Math.pow(distanceRatio, PINCH_ZOOM_SENSITIVITY)));
}

export function formatMiniMapPositionAnnouncement(position: Pick<MiniMapPosition, "xPercent" | "yPercent">): string {
  return `Posição da imagem: ${position.xPercent}% na horizontal e ${position.yPercent}% na vertical.`;
}
