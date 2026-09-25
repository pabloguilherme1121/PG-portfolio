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
  ChevronLeft,
  ChevronRight,
  Instagram,
  Loader2,
  MapPin,
  MessageCircle,
  Send,
  X,
} from "lucide-react";
import type { FormEvent, RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type BlockedDate = { dateKey: string };

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

  return (
    <section id="contato" className="archive-chapter relative overflow-hidden bg-[#070a10]">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid w-full min-w-0 max-w-[1440px] lg:grid-cols-[1fr_1.12fr]">
        <div className="min-w-0 border-b border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24 lg:border-b-0 lg:border-r lg:px-12 lg:py-28">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">08 / solicitação de orçamento</p>
            <h2 className="mt-6 max-w-full break-words font-display text-[clamp(3.1rem,5.6vw,6rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">Tem um projeto? Vamos dar forma.</h2>
            <p className="mt-8 max-w-md font-body text-base leading-8 text-[#c0e3f4]">Não precisa chegar com tudo pronto. Compartilhe o contexto e, juntos, definimos o formato mais útil para o projeto.</p>
          <div className="mt-12 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#8ca4c8]"><span className="human-status-dot h-2 w-2 shrink-0 rounded-full bg-[#3b82f6] shadow-[0_0_10px_#3b82f6]" /> agenda aberta para novos projetos — vamos começar pelo contexto</div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#contato-briefing" className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#38bdf8] px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#02111f] transition-all hover:bg-[#a5f3fc] active:scale-[0.97] sm:min-h-0">preencher briefing <ArrowDown className="h-3.5 w-3.5" /></a>
            <a href={whatsAppUrl} onClick={() => trackPortfolioEvent("whatsapp_click", { source: "contact" })} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 border border-[#67e8f9]/35 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#c9f8ff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] sm:min-h-0">abrir WhatsApp <MessageCircle className="h-3.5 w-3.5" /></a>
            <a href={telegramUrl} target="_blank" rel="noreferrer" aria-label="Abrir canal público de atendimento no Telegram" className="group inline-flex min-h-11 items-center justify-center gap-2 border border-[#67e8f9]/35 px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#c9f8ff] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0b2746] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:min-h-0"><Send className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" /> canal público no Telegram</a>
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
          <a href="https://ig.me/m/pablogui000" target="_blank" rel="noreferrer" className="group mt-5 inline-flex items-center gap-3 border border-[#38bdf8]/45 bg-[#071b39] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#e4faff] transition-all hover:-translate-y-0.5 hover:border-[#67e8f9] hover:bg-[#0a2b57] hover:shadow-[0_10px_24px_rgba(56,189,248,0.16)]"><Instagram className="h-4 w-4 text-[#67e8f9]" /> mensagem rápida no Instagram <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a>
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
              <div><p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">consulta de disponibilidade</p><p className="mt-1 font-body text-xs leading-5 text-[#a6c7d8]">Segunda a sexta, das 08:00 às 18:00.</p></div>
              <div className="flex items-center gap-2"><button type="button" data-availability-to-saved="true" onClick={() => navigateSavedAgendaContext("saved")} aria-label="Ir para projetos salvos" className="min-h-11 border border-cyan-100/[0.2] px-2.5 font-mono text-[8px] uppercase tracking-[0.08em] text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">projetos salvos</button><span className="grid h-9 w-9 place-items-center border border-cyan-100/[0.2] text-[#67e8f9]"><CalendarDays className="h-4 w-4" /></span></div>
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
          <form id="contato-briefing" aria-busy={isQuoteRequestPending} onSubmit={handleSubmit} onFocusCapture={() => { onBriefingFocusChange(true); trackBriefingStarted(); }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onBriefingFocusChange(false); }} className="max-w-xl scroll-mt-24">
            <div className="mb-8 flex items-center justify-between border-b border-white/[0.1] pb-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#b7cbe8]">formulário de briefing</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-[#637da5] light-muted-ink">* campos obrigatórios</p>
            </div>
            <div className="grid gap-7">
              <label aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
                <span>Website</span>
                <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
              </label>
              <div className="grid gap-7 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">nome *</span>
                  <input required name="name" autoComplete="name" placeholder="Como você se chama?" className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">e-mail *</span>
                  <input required type="email" name="email" autoComplete="email" placeholder="voce@exemplo.com" className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                </label>
              </div>
              <div className="grid gap-7 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">serviço desejado *</span>
                  <select required name="service" defaultValue="" className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                    <option value="" disabled>Selecione um serviço</option>
                    <option>Filmagem aérea com drone</option>
                    <option>Captação terrestre</option>
                    <option>Criação de conteúdo</option>
                    <option>Pacote combinado</option>
                    <option>Outro projeto</option>
                  </select>
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">tipo de projeto *</span>
                  <select required name="projectType" defaultValue="" className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                    <option value="" disabled>Selecione uma opção</option>
                    <option>Evento social</option>
                    <option>Evento corporativo</option>
                    <option>Marca ou negócio</option>
                    <option>Imóvel ou espaço</option>
                    <option>Esporte ou atividade externa</option>
                    <option>Outro</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-7 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">local do projeto *</span>
                  <input required name="location" placeholder="Ex.: Águas Lindas de Goiás" className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">data prevista</span>
                  <input type="date" name="date" onFocus={(event) => { event.currentTarget.style.outline = "2px solid #a5f3fc"; event.currentTarget.style.outlineOffset = "3px"; event.currentTarget.style.boxShadow = "0 0 0 4px rgba(165, 243, 252, 0.28)"; }} onBlur={(event) => { event.currentTarget.style.outline = ""; event.currentTarget.style.outlineOffset = ""; event.currentTarget.style.boxShadow = ""; }} className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6] [color-scheme:dark]" />
                </label>
              </div>
              <div className="grid gap-7 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">formato de entrega</span>
                  <select name="delivery" defaultValue="" className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                    <option value="">A definir</option>
                    <option>Vertical 9:16 para Reels</option>
                    <option>Horizontal 16:9</option>
                    <option>Vertical e horizontal</option>
                    <option>Fotos e vídeos</option>
                  </select>
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">faixa de investimento</span>
                  <select name="budget" defaultValue="" className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                    <option value="">Prefiro conversar</option>
                    <option>Até R$ 500</option>
                    <option>R$ 500 a R$ 1.000</option>
                    <option>R$ 1.000 a R$ 2.000</option>
                    <option>Acima de R$ 2.000</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">briefing do projeto *</span>
                <textarea required name="briefing" rows={5} placeholder="Conte o objetivo, referências, o que precisa ser registrado e qualquer detalhe importante." className="mt-3 w-full resize-none border-b border-white/15 bg-transparent px-0 py-3 font-body text-base leading-7 text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
              </label>
            </div>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button data-briefing-submit="true" disabled={isQuoteRequestPending} type="submit" className="min-h-12 w-full justify-center rounded-none bg-[#38bdf8] px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[#02111f] transition-all hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_12px_30px_rgba(56,189,248,0.30)] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 sm:w-fit">
                {isQuoteRequestPending ? <><Loader2 className="h-4 w-4 animate-spin" /> enviando pedido</> : <>quero conversar sobre o projeto <Send className="h-4 w-4" /></>}
              </Button>
              <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-[#647a9f] light-muted-ink">{isStaticDeploy ? "revise e envie a mensagem no WhatsApp" : "seus dados ficam apenas neste pedido"}</p>
            </div>
            {formError && <p role="alert" className="mt-6 border-l-2 border-rose-400 bg-rose-400/10 px-4 py-3 font-body text-sm text-rose-100">{formError}</p>}
            {formSent && (
              <div ref={successMessageRef} tabIndex={-1} role="status" aria-live="polite" className="quote-success mt-7 border border-[#3b82f6]/45 bg-[#0a1730] p-5">
                <div className="flex gap-4">
                  <span className="quote-success-icon grid h-11 w-11 shrink-0 place-items-center border border-[#3b82f6] bg-[#3b82f6] text-white"><CheckCircle2 className="h-5 w-5" /></span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a5f3fc]">{isStaticDeploy ? "mensagem preparada" : "briefing recebido"}</p>
                    <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">{isStaticDeploy ? "Confira o WhatsApp para concluir." : "Tudo certo: seu pedido chegou."}</h3>
                    <p className="mt-2 max-w-lg font-body text-sm leading-6 text-[#d2edf8]">{isStaticDeploy ? "O site não enviou seu pedido automaticamente. Revise a mensagem e toque em enviar no WhatsApp. Seus dados continuam no formulário caso precise tentar novamente." : "Obrigado por compartilhar sua ideia. Vou analisar as informações e retorno pelo e-mail informado para conversar sobre os próximos passos."}</p>
                    {isStaticDeploy && briefingWhatsAppUrl && <a href={briefingWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 border-b border-[#3b82f6] font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">abrir mensagem no WhatsApp <ArrowUpRight className="h-4 w-4" /></a>}
                    <button type="button" onClick={() => setFormSent(false)} className="mt-4 inline-flex items-center gap-2 border-b border-[#3b82f6] pb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#e4efff] transition-colors hover:text-[#77a9fc]">quero contar outra ideia <ArrowUpRight className="h-3 w-3" /></button>
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
