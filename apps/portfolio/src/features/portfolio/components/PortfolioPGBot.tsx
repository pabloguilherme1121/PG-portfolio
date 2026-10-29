import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Send, X } from "lucide-react";
import { PG_BOT_SUGGESTIONS, resolvePgBotAnswer, type PgBotAnswer } from "@/features/portfolio/utils/pgBotGuide";

type Entry = { id: number; speaker: "visitor" | "bot"; text: string; action?: PgBotAnswer["action"] };

export default function PortfolioPGBot({ onClose }: { onClose: (restoreFocus: boolean, destinationId?: string | null) => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const navigatingInternallyRef = useRef(false);
  const destinationIdRef = useRef<string | null>(null);
  const [question, setQuestion] = useState("");
  const [entries, setEntries] = useState<Entry[]>([
    { id: 0, speaker: "bot", text: "Olá! Sou o PG Bot. Posso indicar projetos, currículo, jogos e o caminho para conversar sobre sua ideia." },
  ]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  function ask(message: string) {
    const trimmed = message.trim().slice(0, 400);
    if (!trimmed) return;
    const answer = resolvePgBotAnswer(trimmed);
    idRef.current += 2;
    setEntries(current => [
      ...current.slice(-10),
      { id: idRef.current - 1, speaker: "visitor", text: trimmed },
      { id: idRef.current, speaker: "bot", text: answer.text, action: answer.action },
    ]);
    setQuestion("");
    window.requestAnimationFrame(() => {
      transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: "instant" });
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    ask(question);
  }

  return (
    <dialog
      ref={dialogRef}
      data-pg-bot-dialog="true"
      aria-labelledby="pg-bot-title"
      onClose={() => onClose(!navigatingInternallyRef.current, destinationIdRef.current)}
      className="fixed inset-0 m-auto w-[calc(100%-24px)] max-w-[540px] max-h-[min(90dvh,720px)] overflow-hidden rounded-2xl border border-[#7de7f5]/45 bg-[#09182b] p-0 text-[#f2fbff] shadow-[0_28px_90px_rgba(0,0,0,0.65)] backdrop:bg-[#030812]/85"
    >
      <div className="flex max-h-[min(90dvh,720px)] min-h-0 flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-[#67e8f9]/20 bg-[#0b2540] px-4 py-3 sm:px-5">
          <img src={`${import.meta.env.BASE_URL}brand/pg-bot/mascot.webp`} alt="" width={44} height={51} decoding="async" className="h-[51px] w-11 shrink-0 object-contain" />
          <div className="min-w-0 flex-1">
            <h2 id="pg-bot-title" className="font-display text-lg font-semibold text-white">PG Bot · guia do portfólio</h2>
            <p className="mt-0.5 font-body text-xs text-[#bed8ec]">Respostas locais · sem IA externa · sem envio da conversa</p>
          </div>
          <button ref={closeRef} type="button" data-pg-bot-close="true" onClick={() => dialogRef.current?.close()} aria-label="Fechar PG Bot" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/20 text-white hover:border-[#67e8f9] hover:bg-[#174166] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"><X className="h-5 w-5" aria-hidden="true" /></button>
        </header>
        <div ref={transcriptRef} role="log" aria-label="Respostas do PG Bot" aria-live="polite" aria-relevant="additions" className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 font-body text-sm leading-6 sm:px-5">
          {entries.map(entry => (
            <div key={entry.id} className={`max-w-[95%] rounded-xl border p-3 ${entry.speaker === "visitor" ? "ml-auto border-[#67e8f9]/25 bg-[#124168] text-white" : "mr-auto border-white/10 bg-[#102439] text-[#d7edfa]"}`}>
              <p className="mb-1 font-mono text-xs font-semibold uppercase text-[#a5f3fc]">{entry.speaker === "bot" ? "PG Bot" : "Você"}</p>
              <p className="whitespace-pre-wrap break-words">{entry.text}</p>
              {entry.action && (
                <a
                  data-pg-bot-action="true"
                  href={entry.action.href}
                  onClick={() => {
                    // Internal navigation keeps focus near the destination, not at the old hero button.
                    navigatingInternallyRef.current = !entry.action?.external;
                    destinationIdRef.current = entry.action?.href.startsWith("#") ? entry.action.href.slice(1) : null;
                    dialogRef.current?.close();
                  }}
                  target={entry.action.external ? "_blank" : undefined}
                  rel={entry.action.external ? "noopener noreferrer" : undefined}
                  className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#67e8f9]/45 bg-[#0c3353] px-3 py-2 font-semibold text-[#d2fbff] underline-offset-4 hover:bg-[#175076] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
                >
                  {entry.action.label} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>
          ))}
        </div>
        <div className="shrink-0 border-t border-white/10 bg-[#081727] px-4 py-3 sm:px-5">
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-[#b1d6e9]">Comece por um assunto</p>
          <div className="flex flex-wrap gap-2" data-pg-bot-suggestions="true">
            {PG_BOT_SUGGESTIONS.map(value => (
              <button key={value} type="button" onClick={() => ask(value)} className="min-h-10 rounded-lg border border-[#67e8f9]/25 bg-[#112d48] px-3 py-2 text-left font-body text-xs text-[#e2f6ff] hover:border-[#67e8f9] hover:bg-[#194064] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">{value}</button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Pergunta para o PG Bot</span>
              <input data-pg-bot-input="true" value={question} onChange={event => setQuestion(event.target.value)} maxLength={400} placeholder="Pergunte sobre o portfólio..." className="min-h-12 w-full min-w-0 rounded-lg border border-[#8bacc3]/40 bg-[#07111f] px-3 font-body text-base text-white placeholder:text-[#9fb7cb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]" />
            </label>
            <button type="submit" disabled={!question.trim()} aria-label="Enviar pergunta ao guia local" className="grid min-h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#38bdf8] text-[#02111f] hover:bg-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:opacity-50"><Send className="h-5 w-5" aria-hidden="true" /></button>
          </form>
          <p className="mt-2 font-body text-xs leading-5 text-[#a9c6d9]">Guia automático. Para conversar com uma pessoa, escolha a opção de briefing ou contato.</p>
        </div>
      </div>
    </dialog>
  );
}
