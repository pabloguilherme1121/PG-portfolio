import type { FormEvent, RefObject } from "react";
import type { BriefingSeed } from "@/features/portfolio/utils/briefingFlow";

type BlockedDate = { dateKey: string };

export type PortfolioContactProps = {
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
  embedded?: boolean;
  initialBriefingSeed?: BriefingSeed | null;
};
