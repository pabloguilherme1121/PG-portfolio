import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";
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
import { portfolioWhatsAppNumber } from "@/features/portfolio/portfolioConfig";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import type { PortfolioContactProps } from "./types";

type AvailabilityProps = Pick<
  PortfolioContactProps,
  | "blockedDates"
  | "isBlockedDatesError"
  | "refetchBlockedDates"
  | "availabilitySectionRef"
  | "contextTransitionTarget"
  | "navigateSavedAgendaContext"
  | "contextNavigationStatus"
  | "isStaticDeploy"
>;

export function Availability({
  blockedDates,
  isBlockedDatesError,
  refetchBlockedDates,
  availabilitySectionRef,
  contextTransitionTarget,
  navigateSavedAgendaContext,
  contextNavigationStatus,
  isStaticDeploy,
}: AvailabilityProps) {
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const [calendarMonth, setCalendarMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [availabilityDate, setAvailabilityDate] = useState<Date | null>(null);
  const [availabilityTime, setAvailabilityTime] = useState<string | null>(null);
  const [isAvailabilityRedirecting, setIsAvailabilityRedirecting] =
    useState(false);
  const [isClearingAvailabilitySelection, setIsClearingAvailabilitySelection] =
    useState(false);
  const availabilityClearTimerRef = useRef<number | null>(null);
  const blockedDateKeys = useMemo(
    () => new Set(blockedDates.map(blockedDate => blockedDate.dateKey)),
    [blockedDates]
  );
  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0
  ).getDate();
  const leadingDays = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1
  ).getDay();
  const calendarDays = Array.from(
    { length: leadingDays + daysInMonth },
    (_, index) =>
      index < leadingDays
        ? null
        : new Date(
            calendarMonth.getFullYear(),
            calendarMonth.getMonth(),
            index - leadingDays + 1
          )
  );
  const selectedDateLabel = availabilityDate
    ? formatAvailabilityDate(availabilityDate)
    : "";
  const selectedDateKey = availabilityDate ? toDateKey(availabilityDate) : "";
  const availabilityWhatsAppUrl =
    availabilityDate && availabilityTime
      ? buildAvailabilityWhatsAppUrl(
          portfolioWhatsAppNumber,
          availabilityDate,
          availabilityTime
        )
      : "";
  const isAvailabilityConsultationReadyForUser =
    isAvailabilityConsultationReady(
      availabilityDate,
      availabilityTime,
      isBlockedDatesError
    );
  useEffect(
    () => () => {
      if (availabilityClearTimerRef.current)
        window.clearTimeout(availabilityClearTimerRef.current);
    },
    []
  );

  useEffect(() => {
    if (
      isBlockedDatesError ||
      (availabilityDate && blockedDateKeys.has(toDateKey(availabilityDate)))
    ) {
      setAvailabilityDate(null);
      setAvailabilityTime(null);
    }
  }, [availabilityDate, blockedDateKeys, isBlockedDatesError]);

  function consultAvailabilityOnWhatsApp() {
    if (
      !availabilityWhatsAppUrl ||
      isAvailabilityRedirecting ||
      isBlockedDatesError
    )
      return;

    setIsAvailabilityRedirecting(true);
    trackPortfolioEvent("whatsapp_click", { source: "availability" });
    window.setTimeout(() => {
      const whatsappWindow = window.open(
        availabilityWhatsAppUrl,
        "_blank",
        "noopener,noreferrer"
      );
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
      toast("Seleção limpa", {
        description: "Escolha uma nova data e horário quando quiser.",
      });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      clear();
      return;
    }
    setIsClearingAvailabilitySelection(true);
    availabilityClearTimerRef.current = window.setTimeout(clear, 180);
  }

  return (
    <div
      ref={availabilitySectionRef}
      data-availability-context="true"
      tabIndex={-1}
      aria-busy={contextTransitionTarget === "agenda"}
      className={`availability-calendar mt-5 max-w-md scroll-mt-24 border border-cyan-100/[0.16] bg-[#06172f]/80 p-5 outline-none transition-[opacity,transform] duration-[180ms] motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${contextTransitionTarget === "agenda" ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">
            consulta de agenda
          </p>
          <p className="mt-1 font-body text-xs leading-5 text-[#a6c7d8]">
            {isStaticDeploy
              ? "Horários de referência: segunda a sexta, das 08:00 às 18:00. Confirmação pelo WhatsApp."
              : "Segunda a sexta, das 08:00 às 18:00."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            data-availability-to-saved="true"
            onClick={() => navigateSavedAgendaContext("saved")}
            aria-label="Ir para projetos"
            className="min-h-11 border border-cyan-100/[0.2] px-2.5 font-mono text-[8px] uppercase tracking-[0.08em] text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
          >
            projetos
          </button>
          <span className="grid h-9 w-9 place-items-center border border-cyan-100/[0.2] text-[#67e8f9]">
            <CalendarDays className="h-4 w-4" />
          </span>
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between border-y border-cyan-100/[0.12] py-3">
        <button
          type="button"
          onClick={() =>
            setCalendarMonth(
              new Date(
                calendarMonth.getFullYear(),
                calendarMonth.getMonth() - 1,
                1
              )
            )
          }
          disabled={
            calendarMonth.getFullYear() === todayStart.getFullYear() &&
            calendarMonth.getMonth() === todayStart.getMonth()
          }
          aria-label="Mês anterior"
          className="grid h-11 w-11 place-items-center text-[#b9dfef] transition-colors hover:bg-cyan-100/10 hover:text-[#67e8f9] disabled:cursor-not-allowed disabled:opacity-35 sm:h-8 sm:w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#e2f7ff]">
          {calendarMonth.toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <button
          type="button"
          onClick={() =>
            setCalendarMonth(
              new Date(
                calendarMonth.getFullYear(),
                calendarMonth.getMonth() + 1,
                1
              )
            )
          }
          aria-label="Próximo mês"
          className="grid h-11 w-11 place-items-center text-[#b9dfef] transition-colors hover:bg-cyan-100/10 hover:text-[#67e8f9] sm:h-8 sm:w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="-mx-4 mt-4 grid grid-cols-7 gap-0 text-center sm:mx-0 sm:gap-1">
        {calendarWeekdays.map((day, index) => (
          <span
            key={`${day}-${index}`}
            className="py-1 font-mono text-[9px] text-[#63849a]"
          >
            {day}
          </span>
        ))}
        {calendarDays.map((day, index) => {
          if (!day) return <span key={`blank-${index}`} />;
          const dateKey = toDateKey(day);
          const isBlockedDate = blockedDateKeys.has(dateKey);
          const isAvailableDate =
            !isBlockedDatesError &&
            isSelectableAvailabilityDate(day, todayStart, blockedDateKeys);
          const isSelected = selectedDateKey === dateKey;
          const dayLabel = day.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "numeric",
            month: "long",
          });
          return (
            <button
              key={dateKey}
              data-availability-date="true"
              type="button"
              disabled={!isAvailableDate}
              onClick={() => {
                setAvailabilityDate(day);
                setAvailabilityTime(null);
              }}
              aria-label={
                isBlockedDate ? `${dayLabel}, indisponível` : dayLabel
              }
              title={isBlockedDate ? "Data indisponível" : undefined}
              className={`mx-auto grid h-11 w-11 max-w-11 place-items-center rounded-full font-mono text-[10px] transition-all sm:h-8 sm:w-8 ${isSelected ? "bg-[#38bdf8] font-semibold text-[#02111f] shadow-[0_0_16px_rgba(56,189,248,0.36)]" : isBlockedDate ? "cursor-not-allowed border border-rose-400/55 bg-rose-400/10 text-rose-300 line-through" : isAvailableDate ? "text-[#d7eff9] hover:bg-cyan-100/15 hover:text-[#67e8f9]" : "cursor-not-allowed text-[#385367] line-through"}`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
      {isBlockedDatesError ? (
        <div
          role="alert"
          className="mt-3 border-l border-amber-300 bg-amber-300/10 px-3 py-2 font-body text-[11px] leading-5 text-amber-100"
        >
          Não foi possível verificar as datas indisponíveis. A consulta está
          temporariamente desativada.{" "}
          <button
            type="button"
            onClick={() => void refetchBlockedDates()}
            className="inline-flex min-h-11 items-center font-semibold underline decoration-amber-200/60 underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:min-h-0"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        blockedDates.length > 0 && (
          <p className="mt-3 border-l border-rose-400/70 pl-3 font-body text-[11px] leading-5 text-rose-200">
            Datas riscadas em rosa estão indisponíveis para consulta.
          </p>
        )
      )}
      <div
        data-availability-selection-content="true"
        aria-busy={isClearingAvailabilitySelection}
        className={`transition-[opacity,transform] duration-[180ms] motion-reduce:transition-none ${isClearingAvailabilitySelection ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"}`}
      >
        <div className="mt-5 border-t border-cyan-100/[0.12] pt-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7299ad] light-muted-ink">
            {selectedDateLabel
              ? `horário desejado · ${selectedDateLabel}`
              : "escolha uma data útil"}
          </p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {availableTimes.map(time => (
              <button
                key={time}
                type="button"
                disabled={!availabilityDate || isBlockedDatesError}
                onClick={() => setAvailabilityTime(time)}
                className={`min-h-11 border py-2 font-mono text-[10px] transition-colors sm:min-h-0 ${availabilityTime === time ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : availabilityDate && !isBlockedDatesError ? "border-cyan-100/[0.16] text-[#b9dfef] hover:border-[#67e8f9]/55 hover:text-[#67e8f9]" : "cursor-not-allowed border-white/[0.06] text-[#4b677a]"}`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
        {availabilityDate && (
          <button
            type="button"
            data-clear-availability-selection="true"
            onClick={clearAvailabilitySelection}
            disabled={
              isAvailabilityRedirecting || isClearingAvailabilitySelection
            }
            className="mt-3 inline-flex min-h-11 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#9fc6d9] underline decoration-[#67e8f9]/45 underline-offset-4 transition-colors hover:text-[#e5fbff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-wait disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            limpar data e horário
          </button>
        )}
        {isAvailabilityConsultationReadyForUser && (
          <div
            data-availability-selection-summary="true"
            role="status"
            aria-live="polite"
            className="mt-4 border border-[#67e8f9]/30 bg-[#0b2746]/70 px-3 py-3 text-left"
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#8ddff3]">
              consulta selecionada
            </p>
            <p className="mt-1 font-body text-sm font-medium text-[#e5fbff]">
              {selectedDateLabel} · {availabilityTime}
            </p>
          </div>
        )}
      </div>
      <button
        type="button"
        disabled={
          !isAvailabilityConsultationReadyForUser || isAvailabilityRedirecting
        }
        onClick={consultAvailabilityOnWhatsApp}
        aria-busy={isAvailabilityRedirecting}
        aria-describedby="availability-feedback"
        className="light-dark-cta mt-5 inline-flex w-full items-center justify-center gap-2 bg-[#38bdf8] px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#02111f] transition-all hover:bg-[#a5f3fc] active:scale-[0.97] disabled:cursor-wait disabled:bg-[#16304c] disabled:text-[#6f91a8] light-dark-cta"
      >
        {isAvailabilityRedirecting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />{" "}
            {getAvailabilityButtonLabel(true)}
          </>
        ) : isBlockedDatesError ? (
          <>indisponível no momento</>
        ) : (
          <>
            <MessageCircle
              className="h-4 w-4 fill-current"
              aria-hidden="true"
            />{" "}
            {getAvailabilityButtonLabel(false)}
          </>
        )}
      </button>
      <span
        id="availability-feedback"
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {isAvailabilityRedirecting
          ? "Abrindo o WhatsApp com sua data e horário selecionados."
          : ""}
      </span>
      <span
        data-context-navigation-status="true"
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {contextNavigationStatus}
      </span>
      <p className="mt-3 font-body text-[11px] leading-5 text-[#7fa2b6]">
        A gente confirma a data e o horário diretamente com você, sem
        compromisso.
      </p>
    </div>
  );
}
