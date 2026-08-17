import type { Repository } from "../portfolioData";

export type FavoriteExportFormat = "csv" | "json" | "pdf";

type FavoriteExportRow = {
  id: string;
  nome: string;
  resumo: string;
  tecnologias: string[];
  categorias: string[];
  tipo: Repository["kind"];
  link: string;
};

function buildRows(repositories: Repository[], getCategories: (repository: Repository) => Set<string>) {
  return repositories.map((repository): FavoriteExportRow => ({
    id: repository.id,
    nome: repository.name,
    resumo: repository.description,
    tecnologias: repository.technologies,
    categorias: Array.from(getCategories(repository)),
    tipo: repository.kind,
    link: repository.url,
  }));
}

function downloadBlob(content: BlobPart, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0);
}

export async function exportFavoriteProjects(
  format: FavoriteExportFormat,
  repositories: Repository[],
  getCategories: (repository: Repository) => Set<string>,
) {
  const exportRows = buildRows(repositories, getCategories);
  if (!exportRows.length) return;

  const csvEscape = (value: string) => `"${value.replaceAll("\"", "\"\"")}"`;
  if (format === "pdf") {
    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
    const pdf = await PDFDocument.create();
    const regularFont = await pdf.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);
    const pageSize: [number, number] = [595.28, 841.89];
    let page = pdf.addPage(pageSize);
    let y = pageSize[1] - 48;
    const drawLine = (text: string, bold = false, size = 10) => {
      if (y < 46) {
        page = pdf.addPage(pageSize);
        y = pageSize[1] - 48;
      }
      page.drawText(text.slice(0, 110), { x: 42, y, size, font: bold ? boldFont : regularFont, color: rgb(0.08, 0.14, 0.23) });
      y -= size + 7;
    };
    drawLine("Pablo Guilherme — projetos favoritos", true, 16);
    drawLine(`Arquivo exportado em ${new Date().toLocaleDateString("pt-BR")}`, false, 9);
    y -= 8;
    exportRows.forEach((row, index) => {
      drawLine(`${String(index + 1).padStart(2, "0")}  ${row.nome}`, true, 12);
      drawLine(`${row.id} · ${row.tipo}`, false, 9);
      drawLine(`Tecnologias: ${row.tecnologias.join(", ")}`, false, 9);
      drawLine(row.resumo, false, 9);
      drawLine(row.link, false, 8);
      y -= 8;
    });
    const bytes = await pdf.save();
    downloadBlob(bytes as unknown as ArrayBuffer, "pablo-guilherme-favoritos.pdf", "application/pdf");
    return;
  }

  const content = format === "json"
    ? JSON.stringify(exportRows, null, 2)
    : [
        "id,nome,resumo,tecnologias,categorias,tipo,link",
        ...exportRows.map((row) => [row.id, row.nome, row.resumo, row.tecnologias.join(" | "), row.categorias.join(" | "), row.tipo, row.link].map(csvEscape).join(",")),
      ].join("\n");
  downloadBlob(format === "csv" ? `\uFEFF${content}` : content, `pablo-guilherme-favoritos.${format}`, format === "csv" ? "text/csv;charset=utf-8" : "application/json;charset=utf-8");
}
