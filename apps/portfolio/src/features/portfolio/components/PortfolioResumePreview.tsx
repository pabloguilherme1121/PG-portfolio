import { ArrowUpRight, Download, X } from "lucide-react";
import type { RefObject } from "react";

type PortfolioResumePreviewProps = {
  open: boolean;
  loading: boolean;
  error: boolean;
  progress: number;
  resumeUrl: string;
  closeRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onRetry: () => void;
  onLoad: () => void;
  onError: () => void;
};

export function PortfolioResumePreview({
  open,
  loading,
  error,
  progress,
  resumeUrl,
  closeRef,
  onClose,
  onRetry,
  onLoad,
  onError,
}: PortfolioResumePreviewProps) {
  if (!open) return null;

  return (
    <div className="resume-preview-overlay fixed inset-0 z-[70] grid place-items-center bg-[#02050a]/85 p-3 backdrop-blur-md motion-safe:animate-in motion-safe:fade-in duration-200 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="resume-preview-title" aria-describedby="resume-preview-description" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="resume-preview-modal flex h-[min(92svh,900px)] w-full max-w-5xl flex-col overflow-hidden border border-[#67e8f9]/35 bg-[#07101e] shadow-[0_24px_100px_rgba(0,0,0,0.62)]">
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#67e8f9]">documento em leitura</p>
            <h2 id="resume-preview-title" className="mt-1 truncate font-display text-xl tracking-[-0.03em] text-white sm:text-2xl">Portfólio de Pablo Guilherme</h2>
            <p id="resume-preview-description" className="mt-1 font-body text-xs text-[#9fb2ce]">Pré-visualize o PDF diretamente na página antes de salvar uma cópia.</p>
          </div>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Fechar pré-visualização do portfólio" title="Fechar pré-visualização" className="grid h-11 w-11 shrink-0 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:h-10 sm:w-10"><X className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <div className="resume-preview-frame-wrap relative min-h-0 flex-1 bg-[#2b3440] p-2 sm:p-4">
          {loading && !error && (
            <div className="resume-pdf-loader absolute inset-2 z-10 grid place-items-center border border-[#67e8f9]/20 bg-[#07101e]/95 sm:inset-4" role="status" aria-live="polite">
              <div className="flex flex-col items-center gap-4 text-center">
                <span className="resume-loader-orbit relative grid h-14 w-14 place-items-center rounded-full border border-[#67e8f9]/25" aria-hidden="true"><span className="h-8 w-8 rounded-full border-2 border-[#67e8f9]/20 border-t-[#67e8f9] motion-safe:animate-spin" /></span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#c8f7ff]">abrindo portfólio</span>
                <div className="w-[min(260px,70vw)]" aria-label="Progresso estimado da leitura do portfólio">
                  <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-[#8499b9]"><span>progresso estimado</span><span>{progress}%</span></div>
                  <div className="h-1 overflow-hidden rounded-full bg-[#19324d]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Progresso estimado da leitura do portfólio"><div className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] via-[#67e8f9] to-[#d9fbff] transition-[width] duration-200 ease-out" style={{ width: `${progress}%` }} /></div>
                </div>
                <span className="font-body text-xs text-[#8499b9]">Preparando a leitura do documento…</span>
              </div>
            </div>
          )}
          {error && (
            <div className="absolute inset-2 z-10 grid place-items-center border border-amber-200/30 bg-[#07101e] p-6 text-center sm:inset-4" role="alert">
              <div className="max-w-sm">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-200">pré-visualização indisponível</p>
                <p className="mt-3 font-body text-sm leading-6 text-[#c7d7ec]">O PDF não conseguiu ser renderizado aqui. Você ainda pode baixar o arquivo ou abri-lo em uma nova aba.</p>
                <button type="button" onClick={onRetry} className="mt-5 min-h-11 border border-[#67e8f9] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#c8f7ff] transition-colors hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">tentar novamente</button>
              </div>
            </div>
          )}
          <iframe key={loading ? "loading" : "ready"} src={resumeUrl} title="Pré-visualização do portfólio de Pablo Guilherme em PDF" onLoad={onLoad} onError={onError} className={`h-full w-full border border-white/10 bg-white transition-opacity duration-300 ${loading || error ? "opacity-0" : "opacity-100"}`} />
        </div>
        <div className="flex shrink-0 flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#7189ae]">PDF atualizado · links clicáveis incluídos</p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a href={resumeUrl} download="portfolio-pablo-guilherme.pdf" className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#67e8f9] bg-[#38bdf8] px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#02111f] transition-colors hover:bg-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><Download className="h-4 w-4" aria-hidden="true" /> baixar portfólio em PDF</a>
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/15 px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><ArrowUpRight className="h-4 w-4" aria-hidden="true" /> abrir em nova aba</a>
          </div>
        </div>
      </div>
    </div>
  );
}
