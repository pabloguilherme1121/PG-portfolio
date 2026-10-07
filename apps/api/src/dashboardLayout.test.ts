import { describe, expect, it } from "vitest";
import {
  parseStoredSidebarWidth,
  readStoredSidebarWidth,
  persistSidebarWidth,
} from "../client/sidebarWidth";

describe("parseStoredSidebarWidth", () => {
  it("falls back when the stored width is invalid", () => {
    expect(parseStoredSidebarWidth("abc")).toBe(280);
    expect(parseStoredSidebarWidth("320px")).toBe(280);
    expect(parseStoredSidebarWidth(null)).toBe(280);
  });

  it("clamps persisted widths to the supported range", () => {
    expect(parseStoredSidebarWidth("120")).toBe(200);
    expect(parseStoredSidebarWidth("900")).toBe(480);
    expect(parseStoredSidebarWidth("200")).toBe(200);
    expect(parseStoredSidebarWidth("320")).toBe(320);
    expect(parseStoredSidebarWidth("480")).toBe(480);
  });
  it("falls back safely when browser storage blocks reads", () => {
    const storage = {
      getItem() {
        throw new DOMException("Storage blocked", "SecurityError");
      },
    } as Storage;

    expect(readStoredSidebarWidth(storage)).toBe(280);
    expect(readStoredSidebarWidth(null)).toBe(280);
  });

  it("does not throw when browser storage blocks writes", () => {
    const storage = {
      setItem() {
        throw new DOMException("Storage blocked", "SecurityError");
      },
    } as Storage;

    expect(persistSidebarWidth(storage, 320)).toBe(false);
    expect(persistSidebarWidth(null, 320)).toBe(false);
  });
});
