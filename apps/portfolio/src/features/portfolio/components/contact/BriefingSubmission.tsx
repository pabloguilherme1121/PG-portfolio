import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Send,
} from "lucide-react";
import { briefingSteps } from "@/features/portfolio/utils/briefingFlow";
import type { PortfolioContactProps } from "./types";

type BriefingSubmissionProps = Pick<
  PortfolioContactProps,
  | "isQuoteRequestPending"
  | "isStaticDeploy"
  | "formError"
  | "formSent"
  | "successMessageRef"
  | "briefingWhatsAppUrl"
  | "setFormSent"
> & { briefingStep: number; clearBriefingDraft: () => void };

export function BriefingSubmission({
  isQuoteRequestPending,
  briefingStep,
  clearBriefingDraft,
  isStaticDeploy,
  formError,
  formSent,
  successMessageRef,
  briefingWhatsAppUrl,
  setFormSent,
}: BriefingSubmissionProps) {
  return (
    <>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button
          data-briefing-submit="true"
          disabled={
            isQuoteRequestPending || briefingStep !== briefingSteps.length - 1
          }
          type="submit"
          className="min-h-12 w-full justify-center whitespace-normal rounded-none bg-[#38bdf8] px-4 py-3.5 text-center font-mono text-[10px] font-semibold uppercase leading-5 tracking-[0.1em] min-[360px]:px-5 min-[360px]:text-[11px] min-[360px]:tracking-[0.13em] text-[#02111f] transition-all hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_12px_30px_rgba(56,189,248,0.30)] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 sm:w-fit"
        >
          {isQuoteRequestPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> enviando pedido
            </>
          ) : (
            <>
              quero conversar sobre o projeto <Send className="h-4 w-4" />
            </>
          )}
        </Button>
        <button
          type="button"
          onClick={clearBriefingDraft}
          className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/10 px-4 font-mono text-[9px] uppercase tracking-[0.11em] text-[#8fa9c6] transition-colors hover:border-[#67e8f9]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> limpar
          rascunho
        </button>
      </div>
      <p className="mt-4 font-mono text-[9px] uppercase leading-5 tracking-[0.11em] text-[#647a9f] light-muted-ink">
        {isStaticDeploy
          ? "o site prepara a mensagem; você revisa e confirma o envio no WhatsApp"
          : "seus dados são usados apenas para analisar este pedido"}
      </p>

      {formError && (
        <p
          role="alert"
          className="mt-6 border-l-2 border-rose-400 bg-rose-400/10 px-4 py-3 font-body text-sm text-rose-100"
        >
          {formError}
        </p>
      )}
      {formSent && (
        <div
          ref={successMessageRef}
          tabIndex={-1}
          role="status"
          aria-live="polite"
          className="quote-success mt-7 border border-[#3b82f6]/45 bg-[#0a1730] p-5"
        >
          <div className="flex gap-4">
            <span className="quote-success-icon grid h-11 w-11 shrink-0 place-items-center border border-[#3b82f6] bg-[#3b82f6] text-white">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a5f3fc]">
                {isStaticDeploy ? "mensagem preparada" : "briefing recebido"}
              </p>
              <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">
                {isStaticDeploy
                  ? "Revise a mensagem antes de enviar."
                  : "Tudo certo: seu pedido chegou."}
              </h3>
              <p className="mt-2 max-w-lg font-body text-sm leading-6 text-[#d2edf8]">
                {isStaticDeploy
                  ? "O briefing foi organizado em uma mensagem para o WhatsApp. Você mantém o controle e confirma o envio manualmente."
                  : "As informações foram registradas para análise de escopo e próximos passos."}
              </p>
              {isStaticDeploy && briefingWhatsAppUrl && (
                <a
                  href={briefingWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center gap-2 border-b border-[#3b82f6] font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
                >
                  abrir mensagem no WhatsApp{" "}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              <button
                type="button"
                onClick={() => setFormSent(false)}
                className="mt-4 inline-flex items-center gap-2 border-b border-[#3b82f6] pb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#e4efff] transition-colors hover:text-[#77a9fc]"
              >
                continuar editando <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
