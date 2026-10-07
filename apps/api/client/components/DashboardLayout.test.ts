import { describe, expect, it } from "vitest";
import { parseStoredSidebarWidth } from "./DashboardLayout";

describe("parseStoredSidebarWidth", () => {
  it("falls back when the stored width is invalid", () => {
    expect(parseStoredSidebarWidth("abc")).toBe(280);
    expect(parseStoredSidebarWidth(null)).toBe(280);
  });

  it("clamps persisted widths to the supported range", () => {
    expect(parseStoredSidebarWidth("120")).toBe(200);
    expect(parseStoredSidebarWidth("900")).toBe(480);
    expect(parseStoredSidebarWidth("320")).toBe(320);
  });
});
