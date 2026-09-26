import { afterEach, describe, expect, it, vi } from "vitest";
import { repositories } from "../portfolioData";
import { exportFavoriteProjects } from "./exportFavorites";

describe("exportFavoriteProjects", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function setupDownloadEnvironment() {
    const anchor = { href: "", download: "", click: vi.fn(), remove: vi.fn() };
    let exportedBlob: Blob | undefined;
    const createObjectURL = vi.fn((blob: Blob) => {
      exportedBlob = blob;
      return "blob:favorite-export";
    });

    vi.stubGlobal("document", {
      body: { appendChild: vi.fn() },
      createElement: vi.fn(() => anchor),
    });
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL: vi.fn() });
    vi.stubGlobal("window", { setTimeout: vi.fn((callback: () => void) => { callback(); return 1; }) });

    return { anchor, getExportedBlob: () => exportedBlob };
  }

  it("preserva a estrutura e o nome do download CSV", async () => {
    const { anchor, getExportedBlob } = setupDownloadEnvironment();
    const project = repositories[0]!;

    await exportFavoriteProjects("csv", [project], () => new Set(["Eventos", "Aéreo"]));

    expect(anchor.download).toBe("pablo-guilherme-favoritos.csv");
    expect(anchor.click).toHaveBeenCalledOnce();
    await expect(getExportedBlob()?.text()).resolves.toContain("id,nome,resumo,tecnologias,categorias,tipo,link");
    await expect(getExportedBlob()?.text()).resolves.toContain(project.name);
  });

  it("preserva o formato JSON e as categorias derivadas", async () => {
    const { anchor, getExportedBlob } = setupDownloadEnvironment();
    const project = repositories[0]!;

    await exportFavoriteProjects("json", [project], () => new Set(["Interface", "Conteúdo"]));

    expect(anchor.download).toBe("pablo-guilherme-favoritos.json");
    await expect(getExportedBlob()?.text()).resolves.toContain('"categorias": [');
    await expect(getExportedBlob()?.text()).resolves.toContain("Interface");
  });
});
