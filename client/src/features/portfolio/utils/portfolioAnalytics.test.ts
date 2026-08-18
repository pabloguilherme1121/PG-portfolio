import { afterEach, describe, expect, it, vi } from "vitest";
import { trackPortfolioEvent } from "./portfolioAnalytics";

describe("trackPortfolioEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("envia ao Umami somente o evento e propriedades mínimas sem PII", () => {
    const track = vi.fn();
    const dispatched: Array<{ detail: unknown }> = [];
    vi.stubGlobal("CustomEvent", class {
      detail: unknown;
      constructor(_name: string, init: { detail: unknown }) {
        this.detail = init.detail;
      }
    });
    vi.stubGlobal("window", {
      location: { pathname: "/" },
      dispatchEvent: (event: { detail: unknown }) => dispatched.push(event),
      umami: { track },
    });

    trackPortfolioEvent("project_opened", { projectId: "AUD.01", surface: "details" });

    expect(track).toHaveBeenCalledWith("project_opened", { projectId: "AUD.01", surface: "details" });
    expect(dispatched).toHaveLength(1);
    expect(dispatched[0]?.detail).toMatchObject({
      eventName: "project_opened",
      properties: { projectId: "AUD.01", surface: "details" },
      path: "/",
    });
    const detail = dispatched[0]?.detail as { properties: Record<string, unknown> };
    expect(Object.keys(detail.properties)).not.toEqual(expect.arrayContaining(["name", "email", "phone", "briefing", "address"]));
  });
});
