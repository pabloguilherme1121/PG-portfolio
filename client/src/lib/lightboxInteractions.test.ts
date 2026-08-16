import { describe, expect, it } from "vitest";
import {
  calculateMiniMapPosition,
  calculatePinchZoom,
  formatMiniMapPositionAnnouncement,
  PINCH_ZOOM_SENSITIVITY,
  getCancelledInteractionState,
  getViewportOrientation,
} from "./lightboxInteractions";

describe("lightbox interaction helpers", () => {
  it("updates the mini-map position percentages as the dragged viewport changes", () => {
    const centered = calculateMiniMapPosition(2, { x: 0, y: 0 }, { x: 300, y: 200 });
    const dragged = calculateMiniMapPosition(2, { x: -150, y: 100 }, { x: 300, y: 200 });

    expect(centered.xPercent).toBe(50);
    expect(centered.yPercent).toBe(50);
    expect(dragged.xPercent).toBe(75);
    expect(dragged.yPercent).toBe(25);
    expect(formatMiniMapPositionAnnouncement(dragged)).toBe("Posição da imagem: 75% na horizontal e 25% na vertical.");
  });

  it("keeps mini-map percentages within the visible image bounds", () => {
    const position = calculateMiniMapPosition(3, { x: -9999, y: 9999 }, { x: 300, y: 200 });

    expect(position.xPercent).toBeGreaterThanOrEqual(17);
    expect(position.xPercent).toBeLessThanOrEqual(83);
    expect(position.yPercent).toBeGreaterThanOrEqual(17);
    expect(position.yPercent).toBeLessThanOrEqual(83);
  });

  it("returns a neutral state after pointercancel or touchcancel cleanup", () => {
    expect(getCancelledInteractionState()).toEqual({ isPanning: false, isPinching: false, allowSwipe: false });
  });

  it("detects orientation changes consistently for portrait and landscape viewports", () => {
    expect(getViewportOrientation(390, 844)).toBe("portrait");
    expect(getViewportOrientation(844, 390)).toBe("landscape");
    expect(getViewportOrientation(800, 800)).toBe("landscape");
  });

  it("applies a damped pinch curve for smoother mobile zoom changes", () => {
    expect(PINCH_ZOOM_SENSITIVITY).toBeLessThan(1);
    expect(calculatePinchZoom(1, 100, 200)).toBeGreaterThan(1);
    expect(calculatePinchZoom(1, 100, 200)).toBeLessThan(2);
    expect(calculatePinchZoom(2.9, 100, 200)).toBe(3);
    expect(calculatePinchZoom(2, 0, 150)).toBe(2);
  });
});
