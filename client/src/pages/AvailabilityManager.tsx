import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout, { type DashboardNavigationItem } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { formatAvailabilityDate } from "@/lib/availability";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, CalendarOff, Loader2, ShieldCheck, Trash2 } from "lucide-react";
import { FormEvent, useState } from "react";

const navigation: DashboardNavigationItem[] = [
  { icon: CalendarOff, label: "Disponibilidade", path: "/agenda" },
];

function formatBlockedDate(dateKey: string) {
  return formatAvailabilityDate(new Date(`${dateKey}T12:00:00`));
}

function AvailabilityManagerContent() {
  const { loading: authLoading, user } = useAuth();
  const utils = trpc.useUtils();
  const { data: blockedDates = [], isLoading, isError, refetch } = trpc.availability.listBlocked.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const [dateKey, setDateKey] = useState("");
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const blockDateMutation = trpc.availability.block.useMutation({
    onSuccess: async () => {
      await utils.availability.listBlocked.invalidate();
      setDateKey("");
      setNote("");
      setFeedback("A data foi marcada como indisponível no calendário público.");
    },
    onError: () => setFeedback("Não foi possível bloquear esta data. Tente novamente."),
  });
  const unblockDateMutation = trpc.availability.unblock.useMutation({
    onSuccess: async () => {
      await utils.availability.listBlocked.invalidate();
      setFeedback("A data voltou a ficar disponível para consulta.");
    },
    onError: () => setFeedback("Não foi possível liberar esta data. Tente novamente."),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    blockDateMutation.mutate({ dateKey, note: note.trim() || undefined });
  }

  if (authLoading) {
    return <p className="font-body text-sm text-slate-300">Verificando acesso à agenda...</p>;
  }

  if (user?.role !== "admin") {
    return (
      <section className="mx-auto max-w-xl py-12">
        <ShieldCheck className="h-8 w-8 text-cyan-300" aria-hidden="true" />
        <p className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-cyan-200">acesso restrito</p>
        <h1 className="mt-3 font-display text-3xl font-semibold text-white">Gestão reservada ao proprietário.</h1>
        <p className="mt-4 font-body leading-7 text-slate-300">Entre com a conta proprietária do portfólio para bloquear ou liberar datas da agenda.</p>
        <a href="/" className="mt-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-cyan-300 hover:text-cyan-100"><ArrowLeft className="h-4 w-4" /> voltar ao portfólio</a>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl py-4 text-white">
      <div className="flex flex-col gap-5 border-b border-cyan-100/15 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan-300">Agenda · gestão</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Datas indisponíveis</h1>
          <p className="mt-3 max-w-2xl font-body leading-7 text-slate-300">Bloqueie férias, feriados ou compromissos. A alteração aparece automaticamente no calendário público.</p>
        </div>
        <a href="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-cyan-300 hover:text-cyan-100"><ArrowLeft className="h-4 w-4" /> ver portfólio</a>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-5 border border-cyan-100/15 bg-[#06172f] p-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] sm:items-end">
        <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-cyan-100">Data
          <input required type="date" value={dateKey} onChange={(event) => setDateKey(event.target.value)} className="mt-3 block w-full border border-cyan-100/25 bg-[#031026] px-3 py-2.5 font-body text-sm text-white outline-none transition-colors focus:border-cyan-300" />
        </label>
        <label className="block font-mono text-[11px] uppercase tracking-[0.12em] text-cyan-100">Motivo opcional
          <input value={note} maxLength={180} onChange={(event) => setNote(event.target.value)} placeholder="Ex.: compromisso pessoal" className="mt-3 block w-full border border-cyan-100/25 bg-[#031026] px-3 py-2.5 font-body text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" />
        </label>
        <Button disabled={!dateKey || blockDateMutation.isPending} type="submit" className="h-[42px] rounded-none bg-cyan-300 px-5 font-mono text-[11px] uppercase tracking-[0.12em] text-[#031026] hover:bg-cyan-100 disabled:cursor-wait">
          {blockDateMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin" /> bloqueando</> : <><CalendarOff className="h-4 w-4" /> bloquear data</>}
        </Button>
      </form>

      {feedback && <p role="status" aria-live="polite" className="mt-5 border-l-2 border-cyan-300 bg-cyan-300/10 px-4 py-3 font-body text-sm text-cyan-50">{feedback}</p>}

      <div className="mt-8">
        <div className="flex items-center justify-between gap-4"><h2 className="font-display text-2xl font-semibold">Bloqueios ativos</h2><span className="font-mono text-xs text-slate-400">{isError ? "indisponível" : `${blockedDates.length} data${blockedDates.length === 1 ? "" : "s"}`}</span></div>
        {isLoading ? <div className="mt-5 flex items-center gap-3 font-body text-sm text-slate-300"><Loader2 className="h-4 w-4 animate-spin" /> Carregando agenda...</div> : isError ? <div role="alert" className="mt-5 border-l-2 border-amber-300 bg-amber-300/10 px-4 py-4 font-body text-sm leading-6 text-amber-50">Não foi possível carregar a lista de datas indisponíveis. Nenhuma alteração foi feita. <button type="button" onClick={() => void refetch()} className="font-semibold underline decoration-amber-100/60 underline-offset-2 hover:text-white">Tentar novamente</button></div> : blockedDates.length === 0 ? <p className="mt-5 border border-dashed border-cyan-100/20 px-5 py-6 font-body text-sm leading-6 text-slate-400">Nenhuma data bloqueada. O calendário está seguindo apenas a regra de dias úteis.</p> : <div className="mt-5 grid gap-3">
          {blockedDates.map((blockedDate) => <article key={blockedDate.id} className="flex flex-col gap-4 border border-cyan-100/15 bg-[#06172f]/70 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div><p className="font-body text-base font-semibold text-white">{formatBlockedDate(blockedDate.dateKey)}</p><p className="mt-1 font-body text-sm text-slate-400">{blockedDate.note || "Sem motivo registrado"}</p></div>
            <Button type="button" variant="outline" disabled={unblockDateMutation.isPending} onClick={() => { setFeedback(null); unblockDateMutation.mutate({ dateKey: blockedDate.dateKey }); }} className="rounded-none border-rose-300/45 px-4 font-mono text-[11px] uppercase tracking-[0.1em] text-rose-200 hover:bg-rose-400/10 hover:text-rose-100"><Trash2 className="h-4 w-4" /> liberar data</Button>
          </article>)}
        </div>}
      </div>
    </section>
  );
}

export default function AvailabilityManager() {
  return <DashboardLayout navigation={navigation}><AvailabilityManagerContent /></DashboardLayout>;
}
