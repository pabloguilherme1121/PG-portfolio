import { afterEach, describe, expect, it, vi } from "vitest";
import { copyTextWithFeedback } from "./clipboardFeedback";

describe("copyTextWithFeedback", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reporta sucesso e restaura o estado após a cópia", async () => {
    const statuses: string[] = [];
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
    vi.stubGlobal("window", { setTimeout: vi.fn((callback: () => void) => { callback(); return 1; }) });

    await copyTextWithFeedback("mpjcreator@gmail.com", (status) => statuses.push(status));

    expect(statuses).toEqual(["copied", "idle"]);
  });

  it("reporta erro e restaura o estado quando a cópia falha", async () => {
    const statuses: string[] = [];
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("blocked")) } });
    vi.stubGlobal("window", { setTimeout: vi.fn((callback: () => void) => { callback(); return 1; }) });

    await copyTextWithFeedback("mpjcreator@gmail.com", (status) => statuses.push(status));

    expect(statuses).toEqual(["error", "idle"]);
  });
});
