import { Availability } from "./contact/Availability";
import { BriefingWizard } from "./contact/BriefingWizard";
import { ContactMethods } from "./contact/ContactMethods";
import type { PortfolioContactProps } from "./contact/types";

export function PortfolioContact({
  embedded = false,
  ...props
}: PortfolioContactProps) {
  return (
    <section
      id={embedded ? undefined : "contato"}
      className="archive-chapter relative overflow-hidden bg-[#070a10]"
    >
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid w-full min-w-0 max-w-[1440px] lg:grid-cols-[1fr_1.12fr]">
        <ContactMethods
          whatsAppUrl={props.whatsAppUrl}
          telegramUrl={props.telegramUrl}
        >
          <Availability
            blockedDates={props.blockedDates}
            isBlockedDatesError={props.isBlockedDatesError}
            refetchBlockedDates={props.refetchBlockedDates}
            availabilitySectionRef={props.availabilitySectionRef}
            contextTransitionTarget={props.contextTransitionTarget}
            navigateSavedAgendaContext={props.navigateSavedAgendaContext}
            contextNavigationStatus={props.contextNavigationStatus}
            isStaticDeploy={props.isStaticDeploy}
          />
        </ContactMethods>
        <div className="min-w-0 px-4 py-14 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
          <BriefingWizard
            handleSubmit={props.handleSubmit}
            isQuoteRequestPending={props.isQuoteRequestPending}
            formError={props.formError}
            formSent={props.formSent}
            setFormSent={props.setFormSent}
            successMessageRef={props.successMessageRef}
            isStaticDeploy={props.isStaticDeploy}
            briefingWhatsAppUrl={props.briefingWhatsAppUrl}
            onBriefingFocusChange={props.onBriefingFocusChange}
            initialBriefingSeed={props.initialBriefingSeed}
          />
        </div>
      </div>
    </section>
  );
}
