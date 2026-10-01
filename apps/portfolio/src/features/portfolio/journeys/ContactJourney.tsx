import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNearViewport } from "@/features/portfolio/hooks/useNearViewport";
import { usePortfolioDeferredHashRequests } from "@/features/portfolio/hooks/usePortfolioDeferredHashRequests";
import type { FormEvent } from "react";
import { trpc } from "@/lib/portfolioApi";
import { toast } from "sonner";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { buildBriefingWhatsAppUrl } from "@/features/portfolio/utils/briefingWhatsApp";
import type { BriefingSeed } from "@/features/portfolio/utils/briefingFlow";
import {
  portfolioWhatsAppNumber as whatsAppNumber,
  portfolioWhatsAppUrl as whatsAppUrl,
  portfolioTelegramUrl as telegramUrl,
} from "@/features/portfolio/portfolioConfig";
const PortfolioContact = lazy(() =>
  import("@/features/portfolio/components/PortfolioContact").then(module => ({
    default: module.PortfolioContact,
  }))
);
const isStaticDeploy = import.meta.env.VITE_STATIC_DEPLOY === "true";
export function ContactJourney({
  avoidSpeculativePreload,
  onFocusChange,
}: {
  avoidSpeculativePreload: boolean;
  onFocusChange: (focused: boolean) => void;
}) {
  const availabilitySectionRef = useRef<HTMLDivElement>(null);
  const [contactSectionRef, shouldLoadContact] =
    useNearViewport<HTMLDivElement>(avoidSpeculativePreload ? "80px" : "360px");
  const { contact: contactHashRequested } = usePortfolioDeferredHashRequests();
  const [formSent, setFormSent] = useState(false);
  const [briefingWhatsAppUrl, setBriefingWhatsAppUrl] = useState<string | null>(
    null
  );
  const [backgroundContactReady, setBackgroundContactReady] = useState(false);
  const [pendingBriefingSeed, setPendingBriefingSeed] =
    useState<BriefingSeed | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [contextTransitionTarget, setContextTransitionTarget] = useState<
    "saved" | "agenda" | null
  >(null);
  const [contextNavigationStatus, setContextNavigationStatus] = useState("");
  const shouldRenderContact =
    shouldLoadContact ||
    contactHashRequested ||
    Boolean(pendingBriefingSeed) ||
    backgroundContactReady;
  useEffect(() => {
    if (avoidSpeculativePreload || backgroundContactReady) return;

    let timer: number | null = null;
    const scheduleBackgroundContact = () => {
      if (timer !== null) return;
      timer = window.setTimeout(() => setBackgroundContactReady(true), 3600);
    };

    if (document.readyState === "complete") scheduleBackgroundContact();
    else
      window.addEventListener("load", scheduleBackgroundContact, {
        once: true,
      });

    return () => {
      window.removeEventListener("load", scheduleBackgroundContact);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [avoidSpeculativePreload, backgroundContactReady]);

  useEffect(() => {
    const handleBriefingSeed = (event: Event) => {
      const detail = (event as CustomEvent<BriefingSeed>).detail;
      if (detail && typeof detail === "object")
        setPendingBriefingSeed({ ...detail });
    };
    window.addEventListener("portfolio:briefing-seed", handleBriefingSeed);
    return () =>
      window.removeEventListener("portfolio:briefing-seed", handleBriefingSeed);
  }, []);
  const successMessageRef = useRef<HTMLDivElement>(null);
  const contextTransitionTimerRef = useRef<number | null>(null);
  const {
    data: blockedDates = [],
    isError: isBlockedDatesError,
    refetch: refetchBlockedDates,
  } = trpc.availability.listBlocked.useQuery(undefined, {
    enabled: shouldRenderContact && !isStaticDeploy,
  });

  useEffect(() => {
    if (formSent) successMessageRef.current?.focus();
  }, [formSent]);

  useEffect(
    () => () => {
      if (contextTransitionTimerRef.current)
        window.clearTimeout(contextTransitionTimerRef.current);
    },
    []
  );

  const quoteRequestMutation = trpc.quoteRequest.create.useMutation({
    onSuccess: result => {
      trackPortfolioEvent("briefing_completed");
      setFormSent(true);
      toast.success("Briefing recebido", {
        description: result.ownerNotified
          ? "Seu pedido foi registrado. Em breve, Pablo retorna com os próximos passos."
          : "Seu pedido foi registrado. A confirmação interna será revisada assim que o serviço voltar.",
      });
    },
    onError: () => {
      const message =
        "Não foi possível enviar agora. Confira sua conexão e tente novamente.";
      setFormError(message);
      toast.error("Não foi possível enviar", { description: message });
    },
  });

  function navigateSavedAgendaContext(target: "saved" | "agenda") {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (contextTransitionTimerRef.current)
      window.clearTimeout(contextTransitionTimerRef.current);
    setContextTransitionTarget(target);
    setContextNavigationStatus(
      target === "saved"
        ? "Seção de projetos em foco."
        : "Agenda de disponibilidade em foco."
    );

    window.requestAnimationFrame(() => {
      const targetElement =
        target === "saved"
          ? document.getElementById("projetos")
          : availabilitySectionRef.current;
      if (!targetElement) return;
      if (target === "saved") window.history.pushState({}, "", "#projetos");
      targetElement.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
      targetElement.focus({ preventScroll: true });
      contextTransitionTimerRef.current = window.setTimeout(
        () => setContextTransitionTarget(null),
        reduceMotion ? 0 : 180
      );
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const eventDate = String(data.get("date") || "");
    setFormError(null);
    setFormSent(false);
    setBriefingWhatsAppUrl(null);

    if (isStaticDeploy) {
      trackPortfolioEvent("briefing_whatsapp_prepared", {
        channel: "whatsapp",
      });
      const url = buildBriefingWhatsAppUrl(whatsAppNumber, data);
      setBriefingWhatsAppUrl(url);
      window.open(url, "_blank", "noopener,noreferrer");
      setFormSent(true);
      return;
    }

    const extraContext = [
      data.get("objective") ? `Objetivo: ${String(data.get("objective"))}` : "",
      data.get("audience") ? `Público: ${String(data.get("audience"))}` : "",
      data.get("stage") ? `Estágio atual: ${String(data.get("stage"))}` : "",
      data.get("deadline") ? `Prazo: ${String(data.get("deadline"))}` : "",
      data.get("success")
        ? `Critério de sucesso: ${String(data.get("success"))}`
        : "",
      data.get("references")
        ? `Referências: ${String(data.get("references"))}`
        : "",
      data.get("constraints")
        ? `Restrições / integrações: ${String(data.get("constraints"))}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    const enrichedBriefing = [String(data.get("briefing") || ""), extraContext]
      .filter(Boolean)
      .join("\n\n")
      .slice(0, 5000);

    quoteRequestMutation.mutate(
      {
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        service: String(data.get("service") || ""),
        projectType: String(data.get("projectType") || ""),
        location: String(data.get("location") || ""),
        eventDate: eventDate || undefined,
        delivery: String(data.get("delivery") || "") || undefined,
        budget: String(data.get("budget") || "") || undefined,
        briefing: enrichedBriefing,
        website: String(data.get("website") || ""),
      },
      { onSuccess: () => form.reset() }
    );
  }

  return (
    <div
      id="contato"
      ref={contactSectionRef}
      data-contact-anchor="true"
      aria-busy={!shouldRenderContact}
      className="scroll-mt-24"
    >
      {shouldRenderContact ? (
        <Suspense
          fallback={
            <section
              data-contact-placeholder="true"
              className="archive-chapter min-h-[720px] border-t border-white/[0.07] bg-[#070a10] px-5 py-16 sm:min-h-[820px] sm:px-8 sm:py-24"
              aria-label="Carregando contato e briefing"
            >
              <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">
                carregando contato e briefing…
              </div>
            </section>
          }
        >
          <PortfolioContact
            embedded
            initialBriefingSeed={pendingBriefingSeed}
            whatsAppUrl={whatsAppUrl}
            telegramUrl={telegramUrl}
            blockedDates={blockedDates}
            isBlockedDatesError={isBlockedDatesError}
            refetchBlockedDates={refetchBlockedDates}
            availabilitySectionRef={availabilitySectionRef}
            contextTransitionTarget={contextTransitionTarget}
            navigateSavedAgendaContext={navigateSavedAgendaContext}
            contextNavigationStatus={contextNavigationStatus}
            handleSubmit={handleSubmit}
            isQuoteRequestPending={quoteRequestMutation.isPending}
            formError={formError}
            formSent={formSent}
            setFormSent={setFormSent}
            successMessageRef={successMessageRef}
            isStaticDeploy={isStaticDeploy}
            briefingWhatsAppUrl={briefingWhatsAppUrl}
            onBriefingFocusChange={onFocusChange}
          />
        </Suspense>
      ) : (
        <section
          data-contact-placeholder="true"
          className="archive-chapter min-h-[720px] border-t border-white/[0.07] bg-[#070a10] px-5 py-16 sm:min-h-[820px] sm:px-8 sm:py-24"
          aria-label="Contato"
        >
          <div className="mx-auto max-w-[1440px] border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.12em] text-[#a5f3fc]">
            contato e briefing serão carregados ao aproximar
          </div>
        </section>
      )}
    </div>
  );
}
