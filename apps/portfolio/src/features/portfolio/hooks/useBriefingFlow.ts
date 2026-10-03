import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import {
  briefingDraftStorageKey,
  hasMeaningfulBriefingDraft,
} from "@/features/portfolio/utils/mobileJourney";
import {
  briefingDefaultValues,
  briefingFieldNames,
  briefingSteps,
  getBriefingProgress,
  normalizeBriefingDraft,
  type BriefingDraft,
  type BriefingSeed,
} from "@/features/portfolio/utils/briefingFlow";

type UseBriefingFlowOptions = {
  initialBriefingSeed?: BriefingSeed | null;
  setFormSent: (sent: boolean) => void;
};

function readBriefingDraft(): BriefingDraft {
  if (typeof window === "undefined") return { ...briefingDefaultValues };
  try {
    const raw = window.localStorage.getItem(briefingDraftStorageKey);
    return normalizeBriefingDraft(raw ? JSON.parse(raw) : null);
  } catch {
    return { ...briefingDefaultValues };
  }
}

export function useBriefingFlow({
  initialBriefingSeed = null,
  setFormSent,
}: UseBriefingFlowOptions) {
  const briefingStartedRef = useRef(false);
  const briefingFormRef = useRef<HTMLFormElement>(null);
  const [briefingDraft, setBriefingDraft] = useState<BriefingDraft>(readBriefingDraft);
  const [briefingRevision, setBriefingRevision] = useState(0);
  const [briefingStep, setBriefingStep] = useState(0);
  const { progress: briefingProgress, status: briefingStatus } =
    getBriefingProgress(briefingDraft);

  useLayoutEffect(() => {
    const form = briefingFormRef.current;
    if (!form) return;

    for (const fieldName of briefingFieldNames) {
      const field = form.elements.namedItem(fieldName);
      const value = briefingDraft[fieldName] ?? "";
      if (
        field instanceof HTMLInputElement ||
        field instanceof HTMLTextAreaElement ||
        field instanceof HTMLSelectElement
      ) {
        field.value = value;
      }
    }
  }, [briefingDraft, briefingRevision]);

  function notifyBriefingProgress(nextDraft: BriefingDraft) {
    window.dispatchEvent(
      new CustomEvent<{ hasDraft: boolean }>("portfolio:briefing-progress", {
        detail: { hasDraft: hasMeaningfulBriefingDraft(nextDraft) },
      }),
    );
  }

  function persistBriefingDraft(nextDraft: BriefingDraft) {
    try {
      window.localStorage.setItem(briefingDraftStorageKey, JSON.stringify(nextDraft));
    } catch {
      // O formulário continua utilizável mesmo quando o armazenamento local está indisponível.
    }
  }

  function trackBriefingStarted() {
    if (briefingStartedRef.current) return;
    briefingStartedRef.current = true;
    trackPortfolioEvent("briefing_started");
  }

  function captureBriefingDraft(form: HTMLFormElement) {
    const data = new FormData(form);
    const nextDraft = Object.fromEntries(
      briefingFieldNames.map((field) => [field, String(data.get(field) || "")]),
    ) as BriefingDraft;

    setBriefingDraft(nextDraft);
    persistBriefingDraft(nextDraft);
    notifyBriefingProgress(nextDraft);
  }

  function validateBriefingStep(stepIndex: number) {
    const form = briefingFormRef.current;
    if (!form) return false;
    const section = form.querySelector<HTMLElement>(
      `[data-briefing-step="${briefingSteps[stepIndex]?.id}"]`,
    );
    if (!section) return true;

    const fields = Array.from(
      section.querySelectorAll<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >("input, textarea, select"),
    );
    const invalidField = fields.find((field) => !field.checkValidity());
    if (!invalidField) return true;

    invalidField.reportValidity();
    invalidField.focus();
    return false;
  }

  function moveBriefingStep(nextStep: number) {
    const target = Math.min(briefingSteps.length - 1, Math.max(0, nextStep));
    if (target > briefingStep && !validateBriefingStep(briefingStep)) return;

    setBriefingStep(target);
    trackPortfolioEvent("briefing_step_changed", {
      briefingStep: briefingSteps[target].id,
    });

    window.requestAnimationFrame(() => {
      briefingFormRef.current
        ?.querySelector<HTMLElement>(
          `[data-briefing-step="${briefingSteps[target].id}"]`,
        )
        ?.focus({ preventScroll: true });
    });
  }

  function clearBriefingDraft() {
    try {
      window.localStorage.removeItem(briefingDraftStorageKey);
    } catch {
      // O reset visual ainda funciona quando o armazenamento está indisponível.
    }

    const resetDraft = { ...briefingDefaultValues };
    flushSync(() => {
      setBriefingDraft(resetDraft);
      setBriefingStep(0);
      setBriefingRevision((value) => value + 1);
    });
    notifyBriefingProgress(resetDraft);
    setFormSent(false);
    toast("Briefing limpo", {
      description: "O rascunho local foi removido deste dispositivo.",
    });
  }

  function applyBriefingSeed(detail: BriefingSeed, announce: boolean) {
    const nextDraft = {
      ...readBriefingDraft(),
      ...briefingDraft,
      ...detail,
    };

    flushSync(() => {
      setBriefingDraft(nextDraft);
      setBriefingRevision((value) => value + 1);
    });
    persistBriefingDraft(nextDraft);
    notifyBriefingProgress(nextDraft);

    if (announce) {
      toast.success("Direção aplicada ao briefing", {
        description: "Você pode ajustar qualquer campo antes de enviar.",
      });
    }
  }

  useEffect(() => {
    const applySeed = (event: Event) => {
      const detail = (event as CustomEvent<BriefingSeed>).detail;
      if (!detail) return;
      applyBriefingSeed(detail, true);
    };

    window.addEventListener("portfolio:briefing-seed", applySeed);
    return () => window.removeEventListener("portfolio:briefing-seed", applySeed);
  }, [briefingDraft]);

  useEffect(() => {
    if (!initialBriefingSeed) return;
    applyBriefingSeed(initialBriefingSeed, false);
  }, [initialBriefingSeed]);

  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash !== "#contato-briefing") {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      briefingFormRef.current?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return {
    briefingDraft,
    briefingFormRef,
    briefingProgress,
    briefingRevision,
    briefingStatus,
    briefingStep,
    captureBriefingDraft,
    clearBriefingDraft,
    moveBriefingStep,
    trackBriefingStarted,
  };
}
