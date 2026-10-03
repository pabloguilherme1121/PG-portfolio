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
  it("registra a rota escolhida no experience hub sem dados pessoais", () => {
    const track = vi.fn();
    vi.stubGlobal("CustomEvent", class {
      detail: unknown;
      constructor(_name: string, init: { detail: unknown }) {
        this.detail = init.detail;
      }
    });
    vi.stubGlobal("window", {
      location: { pathname: "/" },
      dispatchEvent: vi.fn(),
      umami: { track },
    });

    trackPortfolioEvent("experience_route_selected", { experienceRoute: "client" });

    expect(track).toHaveBeenCalledWith("experience_route_selected", { experienceRoute: "client" });
  });

  it("registra presets e uso de dica do PG Arcade sem PII", () => {
    const track = vi.fn();
    vi.stubGlobal("CustomEvent", class {
      detail: unknown;
      constructor(_name: string, init: { detail: unknown }) {
        this.detail = init.detail;
      }
    });
    vi.stubGlobal("window", {
      location: { pathname: "/" },
      dispatchEvent: vi.fn(),
      umami: { track },
    });

    trackPortfolioEvent("tic_tac_toe_preset_selected", { arcadePreset: "competitive" });
    trackPortfolioEvent("tic_tac_toe_hint_used");
    trackPortfolioEvent("arcade_game_selected", { arcadeGame: "damas" });
    trackPortfolioEvent("arcade_progress_reset", { arcadeGame: "domino" });

    expect(track).toHaveBeenNthCalledWith(1, "tic_tac_toe_preset_selected", { arcadePreset: "competitive" });
    expect(track).toHaveBeenNthCalledWith(2, "tic_tac_toe_hint_used", {});
    expect(track).toHaveBeenNthCalledWith(3, "arcade_game_selected", { arcadeGame: "damas" });
    expect(track).toHaveBeenNthCalledWith(4, "arcade_progress_reset", { arcadeGame: "domino" });
  });
});
