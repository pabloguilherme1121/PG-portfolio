import { Button } from "@/components/ui/button";
import {
  availableTimes,
  buildAvailabilityWhatsAppUrl,
  calendarWeekdays,
  formatAvailabilityDate,
  getAvailabilityButtonLabel,
  isAvailabilityConsultationReady,
  isSelectableAvailabilityDate,
  toDateKey,
} from "@/lib/availability";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Loader2,
  MapPin,
  MessageCircle,
  RotateCcw,
  Send,
  ShieldCheck,
  X,
} from "lucide-react";
import type { FormEvent, RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type BlockedDate = { dateKey: string };

type BriefingDraft = Record<string, string>;

const briefingDraftStorageKey = "pablo-portfolio-briefing-draft";
const briefingFieldNames = [
  "name",
  "email",
  "service",
  "projectType",
  "objective",
  "audience",
  "stage",
  "location",
  "date",
  "delivery",
  "deadline",
  "budget",
  "success",
  "references",
  "constraints",
  "briefing",
] as const;
const briefingReadinessFields = ["name", "email", "service", "projectType", "objective", "audience", "success", "briefing"] as const;
const briefingSteps = [
  { id: "contact", label: "Contato", description: "Quem é você e como retorno." },
  { id: "direction", label: "Direção", description: "Problema, público e objetivo." },
  { id: "scope", label: "Escopo", description: "Formato, prazo e investimento." },
  { id: "context", label: "Contexto", description: "Sucesso, referências e detalhes." },
] as const;

function readBriefingDraft(): BriefingDraft {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(window.localStorage.getItem(briefingDraftStorageKey) || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(Object.entries(parsed).filter(([, value]) => typeof value === "string")) as BriefingDraft;
  } catch {
    return {};
  }
}

type PortfolioContactProps = {
  whatsAppUrl: string;
  telegramUrl: string;
  blockedDates: BlockedDate[];
  isBlockedDatesError: boolean;
  refetchBlockedDates: () => void | Promise<unknown>;
  availabilitySectionRef: RefObject<HTMLDivElement | null>;
  contextTransitionTarget: "saved" | "agenda" | null;
  navigateSavedAgendaContext: (target: "saved" | "agenda") => void;
  contextNavigationStatus: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isQuoteRequestPending: boolean;
  formError: string | null;
  formSent: boolean;
  setFormSent: (sent: boolean) => void;
  successMessageRef: RefObject<HTMLDivElement | null>;
  isStaticDeploy: boolean;
  briefingWhatsAppUrl: string | null;
  onBriefingFocusChange: (focused: boolean) => void;
};

export function PortfolioContact({
  whatsAppUrl,
  telegramUrl,
  blockedDates,
  isBlockedDatesError,
  refetchBlockedDates,
  availabilitySectionRef,
  contextTransitionTarget,
  navigateSavedAgendaContext,
  contextNavigationStatus,
  handleSubmit,
  isQuoteRequestPending,
  formError,
  formSent,
  setFormSent,
  successMessageRef,
  isStaticDeploy,
  briefingWhatsAppUrl,
  onBriefingFocusChange,
}: PortfolioContactProps) {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [availabilityDate, setAvailabilityDate] = useState<Date | null>(null);
  const [availabilityTime, setAvailabilityTime] = useState<string | null>(null);
  const [isAvailabilityRedirecting, setIsAvailabilityRedirecting] = useState(false);
  const [isClearingAvailabilitySelection, setIsClearingAvailabilitySelection] = useState(false);
  const availabilityClearTimerRef = useRef<number | null>(null);
  const briefingStartedRef = useRef(false);
  const briefingFormRef = useRef<HTMLFormElement>(null);
  const [briefingDraft, setBriefingDraft] = useState<BriefingDraft>(readBriefingDraft);
  const [briefingRevision, setBriefingRevision] = useState(0);
  const [briefingStep, setBriefingStep] = useState(0);

  const blockedDateKeys = useMemo(() => new Set(blockedDates.map((blockedDate) => blockedDate.dateKey)), [blockedDates]);
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const leadingDays = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const calendarDays = Array.from(
    { length: leadingDays + daysInMonth },
    (_, index) => index < leadingDays ? null : new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index - leadingDays + 1),
  );
  const selectedDateLabel = availabilityDate ? formatAvailabilityDate(availabilityDate) : "";
  const selectedDateKey = availabilityDate ? toDateKey(availabilityDate) : "";
  const availabilityWhatsAppUrl = availabilityDate && availabilityTime
    ? buildAvailabilityWhatsAppUrl("5561992903029", availabilityDate, availabilityTime)
    : "";
  const isAvailabilityConsultationReadyForUser = isAvailabilityConsultationReady(
    availabilityDate,
    availabilityTime,
    isBlockedDatesError,
  );
  const briefingCompletedFields = briefingReadinessFields.filter((field) => briefingDraft[field]?.trim()).length;
  const briefingProgress = Math.round((briefingCompletedFields / briefingReadinessFields.length) * 100);
  const briefingStatus = briefingProgress >= 88 ? "pronto para análise" : briefingProgress >= 55 ? "bom contexto" : "em construção";

  useEffect(() => () => {
    if (availabilityClearTimerRef.current) window.clearTimeout(availabilityClearTimerRef.current);
  }, []);

  useEffect(() => {
    if (isBlockedDatesError || (availabilityDate && blockedDateKeys.has(toDateKey(availabilityDate)))) {
      setAvailabilityDate(null);
      setAvailabilityTime(null);
    }
  }, [availabilityDate, blockedDateKeys, isBlockedDatesError]);

  function consultAvailabilityOnWhatsApp() {
    if (!availabilityWhatsAppUrl || isAvailabilityRedirecting || isBlockedDatesError) return;

    setIsAvailabilityRedirecting(true);
    trackPortfolioEvent("whatsapp_click", { source: "availability" });
    window.setTimeout(() => {
      const whatsappWindow = window.open(availabilityWhatsAppUrl, "_blank", "noopener,noreferrer");
      if (!whatsappWindow) window.location.assign(availabilityWhatsAppUrl);
      setIsAvailabilityRedirecting(false);
    }, 240);
  }

  function clearAvailabilitySelection() {
    if (isAvailabilityRedirecting || isClearingAvailabilitySelection) return;
    const clear = () => {
      setAvailabilityDate(null);
      setAvailabilityTime(null);
      setIsClearingAvailabilitySelection(false);
      toast("Seleção limpa", { description: "Escolha uma nova data e horário quando quiser." });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      clear();
      return;
    }
    setIsClearingAvailabilitySelection(true);
    availabilityClearTimerRef.current = window.setTimeout(clear, 180);
  }

  function trackBriefingStarted() {
    if (briefingStartedRef.current) return;
    briefingStartedRef.current = true;
    trackPortfolioEvent("briefing_started");
  }

  function captureBriefingDraft(form: HTMLFormElement) {
    const data = new FormData(form);
    const nextDraft = Object.fromEntries(briefingFieldNames.map((field) => [field, String(data.get(field) || "")])) as BriefingDraft;
    setBriefingDraft(nextDraft);
    try {
      window.localStorage.setItem(briefingDraftStorageKey, JSON.stringify(nextDraft));
    } catch {
      // O formulário continua utilizável mesmo quando o armazenamento local está indisponível.
    }
  }

  function validateBriefingStep(stepIndex: number) {
    const form = briefingFormRef.current;
    if (!form) return false;
    const section = form.querySelector<HTMLElement>(`[data-briefing-step="${briefingSteps[stepIndex]?.id}"]`);
    if (!section) return true;
    const fields = Array.from(section.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select"));
    const invalidField = fields.find((field) => !field.checkValidity());
    if (invalidField) {
      invalidField.reportValidity();
      invalidField.focus();
      return false;
    }
    return true;
  }

  function moveBriefingStep(nextStep: number) {
    const target = Math.min(briefingSteps.length - 1, Math.max(0, nextStep));
    if (target > briefingStep && !validateBriefingStep(briefingStep)) return;
    setBriefingStep(target);
    trackPortfolioEvent("briefing_step_changed", { briefingStep: briefingSteps[target].id });
    window.requestAnimationFrame(() => {
      briefingFormRef.current?.querySelector<HTMLElement>(`[data-briefing-step="${briefingSteps[target].id}"]`)?.focus({ preventScroll: true });
    });
  }

  function clearBriefingDraft() {
    try {
      window.localStorage.removeItem(briefingDraftStorageKey);
    } catch {
      // Nada a fazer: o reset visual ainda funciona.
    }
    setBriefingDraft({});
    setBriefingStep(0);
    setBriefingRevision((value) => value + 1);
    setFormSent(false);
    toast("Briefing limpo", { description: "O rascunho local foi removido deste dispositivo." });
  }

  useEffect(() => {
    const applySeed = (event: Event) => {
      const detail = (event as CustomEvent<Partial<Pick<BriefingDraft, "service" | "projectType" | "objective" | "audience" | "stage" | "delivery" | "success" | "briefing">>>).detail;
      const form = briefingFormRef.current;
      if (!form || !detail) return;

      for (const [name, value] of Object.entries(detail)) {
        if (!value) continue;
        const field = form.elements.namedItem(name);
        if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement || field instanceof HTMLSelectElement) {
          field.value = value;
        }
      }
      captureBriefingDraft(form);
      toast.success("Direção aplicada ao briefing", { description: "Você pode ajustar qualquer campo antes de enviar." });
    };

    window.addEventListener("portfolio:briefing-seed", applySeed);
    return () => window.removeEventListener("portfolio:briefing-seed", applySeed);
  }, []);

  return (
    <section id="contato" className="archive-chapter relative overflow-hidden bg-[#070a10]">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid w-full min-w-0 max-w-[1440px] lg:grid-cols-[1fr_1.12fr]">
        <div className="min-w-0 border-b border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24 lg:border-b-0 lg:border-r lg:px-12 lg:py-28">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">Contato</p>
            <h2 className="mt-6 max-w-full break-words font-display text-[clamp(3.1rem,5.6vw,6rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">Vamos definir uma solução clara para o seu projeto.</h2>
            <p className="mt-8 max-w-md font-body text-base leading-8 text-[#c0e3f4]">Conte o problema, quem vai usar a solução e o resultado esperado. A partir disso, organizo o contexto para alinhar escopo, entrega e próximos passos.</p>
          <div className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8ca4c8]"><span className="human-status-dot h-2 w-2 shrink-0 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" /> disponível para novos projetos e oportunidades</div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#contato-briefing" className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#38bdf8] px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#02111f] transition-all hover:bg-[#a5f3fc] active:scale-[0.97] sm:min-h-0">enviar briefing <ArrowDown className="h-3.5 w-3.5" /></a>
            <a href={whatsAppUrl} onClick={() => trackPortfolioEvent("whatsapp_click", { source: "contact" })} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#67e8f9]/35 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#c9f8ff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] sm:min-h-0">abrir WhatsApp <MessageCircle className="h-3.5 w-3.5" /></a>
            <a href={telegramUrl} target="_blank" rel="noreferrer" aria-label="Abrir canal público de atendimento no Telegram" className="group inline-flex min-h-11 items-center justify-center gap-2 border border-[#67e8f9]/35 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#c9f8ff] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0b2746] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:min-h-0"><Send className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" /> Telegram</a>
          </div>
          <div className="mt-7 grid max-w-md gap-px border border-white/[0.1] bg-white/[0.1] sm:grid-cols-2">
            <a href="https://www.instagram.com/pablogui000/" target="_blank" rel="noreferrer" className="social-channel group flex items-center gap-3 bg-[#070a10] px-4 py-4">
              <span className="social-icon-mark grid h-8 w-8 place-items-center border border-[#3b82f6]/35 text-[#77a9fc]"><Instagram className="h-4 w-4" /></span>
              <span className="min-w-0"><span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f87ad]">Instagram</span><span className="mt-1 block truncate font-mono text-[11px] text-[#e7f0ff]">@pablogui000</span></span>
            </a>
            <a href="https://www.instagram.com/mpjstoryworks/" target="_blank" rel="noreferrer" className="social-channel group flex items-center gap-3 bg-[#070a10] px-4 py-4">
              <span className="social-icon-mark grid h-8 w-8 place-items-center border border-[#3b82f6]/35 text-[#77a9fc]"><Instagram className="h-4 w-4" /></span>
              <span className="min-w-0"><span className="block font-mono text-[9px] uppercase tracking-[0.12em] text-[#6f87ad]">Instagram</span><span className="mt-1 block truncate font-mono text-[11px] text-[#e7f0ff]">@mpjstoryworks</span></span>
            </a>
          </div>
          <a href="https://ig.me/m/pablogui000" target="_blank" rel="noreferrer" className="group mt-5 inline-flex items-center gap-3 border border-[#38bdf8]/45 bg-[#071b39] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#e4faff] transition-all hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0a2b57] hover:shadow-[0_10px_24px_rgba(56,189,248,0.16)]"><Instagram className="h-4 w-4 text-[#67e8f9]" /> Instagram Direct <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
          <div className="mt-5 max-w-md border border-cyan-100/[0.16] bg-[#06172f]/70 px-5 py-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#67e8f9]" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">área de atendimento</p>
                <p className="mt-2 font-body text-sm leading-6 text-[#d3edf8]">Águas Lindas de Goiás, Planaltina (GO/DF) e Entorno.</p>
                <p className="mt-1 font-body text-xs leading-5 text-[#8eb4c8]">Outras regiões podem ser avaliadas conforme o projeto.</p>
              </div>
            </div>
          </div>
          <div ref={availabilitySectionRef} data-availability-context="true" tabIndex={-1} aria-busy={contextTransitionTarget === "agenda"} className={`availability-calendar mt-5 max-w-md scroll-mt-24 border border-cyan-100/[0.16] bg-[#06172f]/80 p-5 outline-none transition-[opacity,transform] duration-[180ms] motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${contextTransitionTarget === "agenda" ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}>
            <div className="flex items-center justify-between gap-4">
              <div><p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">disponibilidade</p><p className="mt-1 font-body text-xs leading-5 text-[#a6c7d8]">Segunda a sexta, das 08:00 às 18:00.</p></div>
              <div className="flex items-center gap-2"><button type="button" data-availability-to-saved="true" onClick={() => navigateSavedAgendaContext("saved")} aria-label="Ir para projetos" className="min-h-11 border border-cyan-100/[0.2] px-2.5 font-mono text-[8px] uppercase tracking-[0.08em] text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">projetos</button><span className="grid h-9 w-9 place-items-center border border-cyan-100/[0.2] text-[#67e8f9]"><CalendarDays className="h-4 w-4" /></span></div>
            </div>
            <div className="mt-5 flex items-center justify-between border-y border-cyan-100/[0.12] py-3">
              <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} disabled={calendarMonth.getFullYear() === todayStart.getFullYear() && calendarMonth.getMonth() === todayStart.getMonth()} aria-label="Mês anterior" className="grid h-11 w-11 place-items-center text-[#b9dfef] transition-colors hover:bg-cyan-100/10 hover:text-[#67e8f9] disabled:cursor-not-allowed disabled:opacity-35 sm:h-8 sm:w-8"><ChevronLeft className="h-4 w-4" /></button>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#e2f7ff]">{calendarMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}</p>
              <button type="button" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} aria-label="Próximo mês" className="grid h-11 w-11 place-items-center text-[#b9dfef] transition-colors hover:bg-cyan-100/10 hover:text-[#67e8f9] sm:h-8 sm:w-8"><ChevronRight className="h-4 w-4" /></button>
            </div>
            <div className="-mx-4 mt-4 grid grid-cols-7 gap-0 text-center sm:mx-0 sm:gap-1">
              {calendarWeekdays.map((day, index) => <span key={`${day}-${index}`} className="py-1 font-mono text-[9px] text-[#63849a]">{day}</span>)}
              {calendarDays.map((day, index) => {
                if (!day) return <span key={`blank-${index}`} />;
                const dateKey = toDateKey(day);
                const isBlockedDate = blockedDateKeys.has(dateKey);
                const isAvailableDate = !isBlockedDatesError && isSelectableAvailabilityDate(day, todayStart, blockedDateKeys);
                const isSelected = selectedDateKey === dateKey;
                const dayLabel = day.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
                return <button key={dateKey} data-availability-date="true" type="button" disabled={!isAvailableDate} onClick={() => { setAvailabilityDate(day); setAvailabilityTime(null); }} aria-label={isBlockedDate ? `${dayLabel}, indisponível` : dayLabel} title={isBlockedDate ? "Data indisponível" : undefined} className={`mx-auto grid h-11 w-11 max-w-11 place-items-center rounded-full font-mono text-[10px] transition-all sm:h-8 sm:w-8 ${isSelected ? "bg-[#38bdf8] font-semibold text-[#02111f] shadow-[0_0_16px_rgba(56,189,248,0.36)]" : isBlockedDate ? "cursor-not-allowed border border-rose-400/55 bg-rose-400/10 text-rose-300 line-through" : isAvailableDate ? "text-[#d7eff9] hover:bg-cyan-100/15 hover:text-[#67e8f9]" : "cursor-not-allowed text-[#385367] line-through"}`}>{day.getDate()}</button>;
              })}
            </div>
            {isBlockedDatesError ? <div role="alert" className="mt-3 border-l border-amber-300 bg-amber-300/10 px-3 py-2 font-body text-[11px] leading-5 text-amber-100">Não foi possível verificar as datas indisponíveis. A consulta está temporariamente desativada. <button type="button" onClick={() => void refetchBlockedDates()} className="inline-flex min-h-11 items-center font-semibold underline decoration-amber-200/60 underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:min-h-0">Tentar novamente</button></div> : blockedDates.length > 0 && <p className="mt-3 border-l border-rose-400/70 pl-3 font-body text-[11px] leading-5 text-rose-200">Datas riscadas em rosa estão indisponíveis para consulta.</p>}
            <div data-availability-selection-content="true" aria-busy={isClearingAvailabilitySelection} className={`transition-[opacity,transform] duration-[180ms] motion-reduce:transition-none ${isClearingAvailabilitySelection ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}>
            <div className="mt-5 border-t border-cyan-100/[0.12] pt-4">
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7299ad] light-muted-ink">{selectedDateLabel ? `horário desejado · ${selectedDateLabel}` : "escolha uma data útil"}</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {availableTimes.map((time) => <button key={time} type="button" disabled={!availabilityDate || isBlockedDatesError} onClick={() => setAvailabilityTime(time)} className={`min-h-11 border py-2 font-mono text-[10px] transition-colors sm:min-h-0 ${availabilityTime === time ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : availabilityDate && !isBlockedDatesError ? "border-cyan-100/[0.16] text-[#b9dfef] hover:border-[#67e8f9]/55 hover:text-[#67e8f9]" : "cursor-not-allowed border-white/[0.06] text-[#4b677a]"}`}>{time}</button>)}
              </div>
            </div>
            {availabilityDate && <button type="button" data-clear-availability-selection="true" onClick={clearAvailabilitySelection} disabled={isAvailabilityRedirecting || isClearingAvailabilitySelection} className="mt-3 inline-flex min-h-11 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#9fc6d9] underline decoration-[#67e8f9]/45 underline-offset-4 transition-colors hover:text-[#e5fbff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-wait disabled:opacity-50"><X className="h-3.5 w-3.5" aria-hidden="true" />limpar data e horário</button>}
            {isAvailabilityConsultationReadyForUser && <div data-availability-selection-summary="true" role="status" aria-live="polite" className="mt-4 border border-[#67e8f9]/30 bg-[#0b2746]/70 px-3 py-3 text-left"><p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#8ddff3]">consulta selecionada</p><p className="mt-1 font-body text-sm font-medium text-[#e5fbff]">{selectedDateLabel} · {availabilityTime}</p></div>}
            </div>
            <button type="button" disabled={!isAvailabilityConsultationReadyForUser || isAvailabilityRedirecting} onClick={consultAvailabilityOnWhatsApp} aria-busy={isAvailabilityRedirecting} aria-describedby="availability-feedback" className="light-dark-cta mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#38bdf8] px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#02111f] transition-all hover:bg-[#a5f3fc] active:scale-[0.97] disabled:cursor-wait disabled:bg-[#16304c] disabled:text-[#6f91a8] light-dark-cta">
              {isAvailabilityRedirecting ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> {getAvailabilityButtonLabel(true)}</> : isBlockedDatesError ? <>indisponível no momento</> : <><MessageCircle className="h-4 w-4 fill-current" aria-hidden="true" /> {getAvailabilityButtonLabel(false)}</>}
            </button>
            <span id="availability-feedback" role="status" aria-live="polite" className="sr-only">{isAvailabilityRedirecting ? "Abrindo o WhatsApp com sua data e horário selecionados." : ""}</span>
            <span data-context-navigation-status="true" role="status" aria-live="polite" className="sr-only">{contextNavigationStatus}</span>
            <p className="mt-3 font-body text-[11px] leading-5 text-[#7fa2b6]">A gente confirma a data e o horário diretamente com você, sem compromisso.</p>
          </div>
          <div className="mt-7 max-w-md border-l-2 border-[#38bdf8] bg-[#071a35]/70 px-5 py-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">depois do seu briefing</p>
            <ol className="mt-4 space-y-3 font-body text-sm leading-6 text-[#cbe8f6]">
              <li><span className="mr-2 font-mono text-[#67e8f9]">01</span>O contexto é organizado para definir o que realmente precisa ser produzido.</li>
              <li><span className="mr-2 font-mono text-[#67e8f9]">02</span>Formato, data e detalhes são alinhados com transparência.</li>
              <li><span className="mr-2 font-mono text-[#67e8f9]">03</span>A proposta chega com escopo, entrega e próximos passos claros.</li>
            </ol>
          </div>
        </div>

        <div className="min-w-0 px-5 py-16 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
          <form
            key={briefingRevision}
            ref={briefingFormRef}
            id="contato-briefing"
            aria-busy={isQuoteRequestPending}
            onSubmit={handleSubmit}
            onChangeCapture={(event) => captureBriefingDraft(event.currentTarget)}
            onFocusCapture={() => { onBriefingFocusChange(true); trackBriefingStarted(); }}
            onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onBriefingFocusChange(false); }}
            className="max-w-2xl scroll-mt-24"
          >
            <div data-briefing-header="true" className="mb-8 border border-[#67e8f9]/20 bg-[#07182a]/80 p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">briefing studio · contexto antes do orçamento</p>
                  <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">Construa um briefing que já começa útil.</h3>
                </div>
                <div className="sm:text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7892b8]">qualidade do contexto</p>
                  <p data-briefing-progress="true" aria-live="polite" className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#a5f3fc]">{briefingProgress}% · {briefingStatus}</p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#7fa2b6]">etapa {briefingStep + 1} de {briefingSteps.length} · {briefingSteps[briefingStep].label}</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden bg-white/10" aria-hidden="true">
                <span className="block h-full origin-left bg-[#38bdf8] transition-transform duration-300 motion-reduce:transition-none" style={{ transform: `scaleX(${briefingProgress / 100})` }} />
              </div>
              <ol className="mt-5 grid gap-px bg-white/10 sm:grid-cols-4" aria-label="Etapas do briefing">
                {briefingSteps.map((step, index) => {
                  const active = index === briefingStep;
                  const completed = index < briefingStep;
                  return (
                    <li
                      key={step.id}
                      aria-current={active ? "step" : undefined}
                      className={`bg-[#07111f] px-3 py-3 ${active ? "ring-1 ring-inset ring-[#67e8f9]" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-mono text-[8px] uppercase tracking-[0.12em] ${active || completed ? "text-[#67e8f9]" : "text-[#5f7695]"}`}>
                          0{index + 1}
                        </span>
                        {completed && <CheckCircle2 className="h-3.5 w-3.5 text-[#67e8f9]" aria-hidden="true" />}
                      </div>
                      <p className={`mt-2 font-mono text-[8px] font-semibold uppercase tracking-[0.09em] ${active ? "text-white" : "text-[#9bb4cf]"}`}>{step.label}</p>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-4 flex items-start gap-3 border-t border-white/10 pt-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#67e8f9]" aria-hidden="true" />
                <p className="font-body text-xs leading-5 text-[#8fb6c9]">O rascunho é salvo apenas neste dispositivo para você não perder o preenchimento. Nada é enviado enquanto você não concluir a ação final.</p>
              </div>
            </div>

            <label aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
              <span>Website</span>
              <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
            </label>

            <div data-briefing-studio="true" className="grid gap-7">
              <fieldset
                data-briefing-step="contact"
                tabIndex={-1}
                hidden={briefingStep !== 0}
                className="border border-white/[0.1] bg-[#080f1a]/60 p-5 outline-none sm:p-6"
              >
                <legend className="px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">01 · contato</legend>
                <div className="grid gap-7 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">nome *</span>
                    <input required maxLength={160} name="name" autoComplete="name" defaultValue={briefingDraft.name ?? ""} placeholder="Como você se chama?" className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">e-mail *</span>
                    <input required maxLength={320} type="email" name="email" autoComplete="email" defaultValue={briefingDraft.email ?? ""} placeholder="voce@exemplo.com" className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                </div>
              </fieldset>

              <fieldset
                data-briefing-step="direction"
                tabIndex={-1}
                hidden={briefingStep !== 1}
                className="border border-white/[0.1] bg-[#080f1a]/60 p-5 outline-none sm:p-6"
              >
                <legend className="px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">02 · direção</legend>
                <div className="grid gap-7 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">serviço desejado *</span>
                    <select required name="service" defaultValue={briefingDraft.service ?? ""} className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                      <option value="" disabled>Selecione um serviço</option>
                      <option>Site ou landing page</option>
                      <option>Dashboard ou produto digital</option>
                      <option>Criação de conteúdo</option>
                      <option>Captação audiovisual / drone</option>
                      <option>Solução combinada</option>
                      <option>Outro projeto</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">tipo de projeto *</span>
                    <select required name="projectType" defaultValue={briefingDraft.projectType ?? ""} className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                      <option value="" disabled>Selecione uma opção</option>
                      <option>Produto ou serviço digital</option>
                      <option>Marca ou negócio</option>
                      <option>Projeto com dados / dashboard</option>
                      <option>Evento social ou corporativo</option>
                      <option>Imóvel, espaço ou operação</option>
                      <option>Esporte ou atividade externa</option>
                      <option>Outro</option>
                    </select>
                  </label>
                </div>
                <label className="mt-7 block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">objetivo principal *</span>
                  <textarea required maxLength={900} name="objective" rows={3} defaultValue={briefingDraft.objective ?? ""} placeholder="O que precisa mudar depois que este projeto estiver pronto?" className="mt-3 w-full resize-y border-b border-white/15 bg-transparent px-0 py-3 font-body text-base leading-7 text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                </label>
                <div className="mt-7 grid gap-7 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">público / quem vai usar *</span>
                    <input required maxLength={240} name="audience" defaultValue={briefingDraft.audience ?? ""} placeholder="Ex.: clientes, equipe, moradores, gestores" className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">estágio atual</span>
                    <select name="stage" defaultValue={briefingDraft.stage ?? ""} className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                      <option value="">A definir</option>
                      <option>Ideia inicial</option>
                      <option>Já existe e precisa evoluir</option>
                      <option>Redesign / reorganização</option>
                      <option>Escopo já definido</option>
                      <option>Pronto para construir</option>
                    </select>
                  </label>
                </div>
              </fieldset>

              <fieldset
                data-briefing-step="scope"
                tabIndex={-1}
                hidden={briefingStep !== 2}
                className="border border-white/[0.1] bg-[#080f1a]/60 p-5 outline-none sm:p-6"
              >
                <legend className="px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">03 · escopo</legend>
                <div className="grid gap-7 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">local ou alcance *</span>
                    <input required maxLength={255} name="location" defaultValue={briefingDraft.location ?? ""} placeholder="Ex.: remoto, Águas Lindas, Brasil" className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">data prevista</span>
                    <input type="date" name="date" defaultValue={briefingDraft.date ?? ""} className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] [color-scheme:dark]" />
                  </label>
                </div>
                <div className="mt-7 grid gap-7 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">formato de entrega</span>
                    <select name="delivery" defaultValue={briefingDraft.delivery ?? ""} className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                      <option value="">A definir</option>
                      <option>Site responsivo</option>
                      <option>Landing page</option>
                      <option>Dashboard / interface</option>
                      <option>Vertical 9:16 para Reels</option>
                      <option>Horizontal 16:9</option>
                      <option>Fotos e vídeos</option>
                      <option>Solução combinada</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">prazo / urgência</span>
                    <select name="deadline" defaultValue={briefingDraft.deadline ?? ""} className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                      <option value="">A definir</option>
                      <option>Sem urgência</option>
                      <option>Até 2 semanas</option>
                      <option>2 a 4 semanas</option>
                      <option>1 a 2 meses</option>
                      <option>Mais de 2 meses</option>
                    </select>
                  </label>
                </div>
                <label className="mt-7 block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">faixa de investimento</span>
                  <select name="budget" defaultValue={briefingDraft.budget ?? ""} className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                    <option value="">Preciso de orientação</option>
                    <option>Até R$ 1.500</option>
                    <option>R$ 1.500 a R$ 3.000</option>
                    <option>R$ 3.000 a R$ 6.000</option>
                    <option>R$ 6.000 a R$ 12.000</option>
                    <option>Acima de R$ 12.000</option>
                  </select>
                </label>
              </fieldset>

              <fieldset
                data-briefing-step="context"
                tabIndex={-1}
                hidden={briefingStep !== 3}
                className="border border-white/[0.1] bg-[#080f1a]/60 p-5 outline-none sm:p-6"
              >
                <legend className="px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">04 · contexto e qualidade</legend>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">como saberemos que deu certo?</span>
                  <textarea maxLength={600} name="success" rows={3} defaultValue={briefingDraft.success ?? ""} placeholder="Ex.: mais pedidos de orçamento, informação mais fácil de consultar, lançamento pronto para uso." className="mt-3 w-full resize-y border-b border-white/15 bg-transparent px-0 py-3 font-body text-base leading-7 text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                </label>
                <div className="mt-7 grid gap-7 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">referências / links</span>
                    <textarea maxLength={1000} name="references" rows={3} defaultValue={briefingDraft.references ?? ""} placeholder="Sites, perfis ou produtos que ajudam a explicar a direção." className="mt-3 w-full resize-y border-b border-white/15 bg-transparent px-0 py-3 font-body text-sm leading-6 text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">restrições / integrações</span>
                    <textarea maxLength={1000} name="constraints" rows={3} defaultValue={briefingDraft.constraints ?? ""} placeholder="Ex.: domínio existente, plataforma obrigatória, identidade visual, APIs." className="mt-3 w-full resize-y border-b border-white/15 bg-transparent px-0 py-3 font-body text-sm leading-6 text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                </div>
                <label className="mt-7 block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">contexto do projeto *</span>
                  <textarea required minLength={12} maxLength={3000} name="briefing" rows={6} defaultValue={briefingDraft.briefing ?? ""} placeholder="Explique o cenário atual, o problema, o que já existe, o que não pode faltar e qualquer detalhe que ajude a entender a entrega." className="mt-3 w-full resize-y border-b border-white/15 bg-transparent px-0 py-3 font-body text-base leading-7 text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                </label>
              </fieldset>
            
              <div className="grid gap-3 border border-white/10 bg-[#07111f]/85 p-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                <button
                  type="button"
                  onClick={() => moveBriefingStep(briefingStep - 1)}
                  disabled={briefingStep === 0}
                  className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/10 px-4 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a8c5d8] transition-colors hover:border-[#67e8f9]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-not-allowed disabled:opacity-35 sm:justify-self-start"
                  aria-label={briefingStep > 0 ? `Voltar para ${briefingSteps[briefingStep - 1].label}` : "Primeira etapa do briefing"}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  {briefingStep > 0 ? `voltar: ${briefingSteps[briefingStep - 1].label}` : "início"}
                </button>

                <div className="text-center">
                  <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#67e8f9]">etapa {briefingStep + 1} de {briefingSteps.length}</p>
                  <p className="mt-1 font-body text-xs leading-5 text-[#86a8bc]">{briefingSteps[briefingStep].description}</p>
                </div>

                {briefingStep < briefingSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => moveBriefingStep(briefingStep + 1)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#123b67] px-4 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#18508c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:justify-self-end"
                    aria-label={`Continuar para ${briefingSteps[briefingStep + 1].label}`}
                  >
                    continuar: {briefingSteps[briefingStep + 1].label}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <span className="hidden sm:block" aria-hidden="true" />
                )}
              </div>

            </div>

            <aside data-briefing-summary="true" className="mt-7 border border-[#67e8f9]/25 bg-[#06172f]/80 p-5">
              <div className="flex items-start gap-3">
                <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#67e8f9]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">resumo ao vivo</p>
                  <p className="mt-2 font-body text-sm leading-6 text-[#cbe8f6]">
                    {briefingDraft.service || "Serviço ainda não definido"} · {briefingDraft.projectType || "tipo de projeto a definir"}
                  </p>
                  {briefingDraft.objective && <p className="mt-2 line-clamp-3 font-body text-xs leading-5 text-[#91b6ca]">{briefingDraft.objective}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {briefingDraft.stage && <span className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#a5c8dd]">{briefingDraft.stage}</span>}
                    {briefingDraft.deadline && <span className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#a5c8dd]">{briefingDraft.deadline}</span>}
                    {briefingDraft.budget && <span className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#a5c8dd]">{briefingDraft.budget}</span>}
                  </div>
                </div>
              </div>
            </aside>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button data-briefing-submit="true" disabled={isQuoteRequestPending || briefingStep !== briefingSteps.length - 1} type="submit" className="min-h-12 w-full justify-center rounded-none bg-[#38bdf8] px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[#02111f] transition-all hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_12px_30px_rgba(56,189,248,0.30)] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 sm:w-fit">
                {isQuoteRequestPending ? <><Loader2 className="h-4 w-4 animate-spin" /> enviando pedido</> : <>quero conversar sobre o projeto <Send className="h-4 w-4" /></>}
              </Button>
              <button type="button" onClick={clearBriefingDraft} className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/10 px-4 font-mono text-[9px] uppercase tracking-[0.11em] text-[#8fa9c6] transition-colors hover:border-[#67e8f9]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> limpar rascunho
              </button>
            </div>
            <p className="mt-4 font-mono text-[9px] uppercase leading-5 tracking-[0.11em] text-[#647a9f] light-muted-ink">{isStaticDeploy ? "o site prepara a mensagem; você revisa e confirma o envio no WhatsApp" : "seus dados são usados apenas para analisar este pedido"}</p>

            {formError && <p role="alert" className="mt-6 border-l-2 border-rose-400 bg-rose-400/10 px-4 py-3 font-body text-sm text-rose-100">{formError}</p>}
            {formSent && (
              <div ref={successMessageRef} tabIndex={-1} role="status" aria-live="polite" className="quote-success mt-7 border border-[#3b82f6]/45 bg-[#0a1730] p-5">
                <div className="flex gap-4">
                  <span className="quote-success-icon grid h-11 w-11 shrink-0 place-items-center border border-[#3b82f6] bg-[#3b82f6] text-white"><CheckCircle2 className="h-5 w-5" /></span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a5f3fc]">{isStaticDeploy ? "mensagem preparada" : "briefing recebido"}</p>
                    <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">{isStaticDeploy ? "Revise a mensagem antes de enviar." : "Tudo certo: seu pedido chegou."}</h3>
                    <p className="mt-2 max-w-lg font-body text-sm leading-6 text-[#d2edf8]">{isStaticDeploy ? "O briefing foi organizado em uma mensagem para o WhatsApp. Você mantém o controle e confirma o envio manualmente." : "As informações foram registradas para análise de escopo e próximos passos."}</p>
                    {isStaticDeploy && briefingWhatsAppUrl && <a href={briefingWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 border-b border-[#3b82f6] font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">abrir mensagem no WhatsApp <ArrowUpRight className="h-4 w-4" /></a>}
                    <button type="button" onClick={() => setFormSent(false)} className="mt-4 inline-flex items-center gap-2 border-b border-[#3b82f6] pb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#e4efff] transition-colors hover:text-[#77a9fc]">continuar editando <ArrowUpRight className="h-3 w-3" /></button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
