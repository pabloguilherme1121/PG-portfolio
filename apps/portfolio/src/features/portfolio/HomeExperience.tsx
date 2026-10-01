import { useState } from "react";
import PortfolioHero from "@/features/portfolio/components/PortfolioHero";
import PortfolioTrustBar from "@/features/portfolio/components/PortfolioTrustBar";
import {
  portfolioMarkUrl as markUrl,
  portfolioPortraitResponsive as portraitResponsive,
  portfolioPortraitUrl as portraitUrl,
} from "@/features/portfolio/portfolioConfig";
import { usePortfolioNetworkPreference } from "@/features/portfolio/hooks/usePortfolioNetworkPreference";
import { PortfolioShell } from "./journeys/PortfolioShell";
import { ProjectJourney } from "./journeys/ProjectJourney";
import { ProfileJourney } from "./journeys/ProfileJourney";
import { JourneyTools } from "./journeys/JourneyTools";
import { SocialJourney } from "./journeys/SocialJourney";
import { ContactJourney } from "./journeys/ContactJourney";
import { ArcadeSection, useArcadeSection } from "./journeys/ArcadeSection";

declare const __PORTFOLIO_HERO_AVAILABLE__: boolean;

/** Compose the public journey; feature owners keep their own state and lazy boundaries. */
export default function Home() {
  const avoidSpeculativePreload = usePortfolioNetworkPreference();
  const arcade = useArcadeSection(avoidSpeculativePreload);
  const [projectOverlayOpen, setProjectOverlayOpen] = useState(false);
  const [contactFocused, setContactFocused] = useState(false);

  return (
    <PortfolioShell
      avoidSpeculativePreload={avoidSpeculativePreload}
      arcade={arcade}
      projectOverlayOpen={projectOverlayOpen}
      contactFocused={contactFocused}
    >
      {({ heroCtaRef, isDesktopViewport, resumeAvailable }) => (
        <>
          <PortfolioHero
            heroAvailable={
              __PORTFOLIO_HERO_AVAILABLE__ && !avoidSpeculativePreload
            }
            markUrl={markUrl}
            portraitUrl={portraitUrl}
            portraitResponsive={portraitResponsive}
            heroCtaRef={heroCtaRef}
          />
          <PortfolioTrustBar />
          <ProjectJourney
            avoidSpeculativePreload={avoidSpeculativePreload}
            onOverlayChange={setProjectOverlayOpen}
          />
          <ProfileJourney
            avoidSpeculativePreload={avoidSpeculativePreload}
            isDesktopViewport={isDesktopViewport}
            resumeAvailable={resumeAvailable}
          />
          <ContactJourney
            avoidSpeculativePreload={avoidSpeculativePreload}
            onFocusChange={setContactFocused}
          />
          <JourneyTools avoidSpeculativePreload={avoidSpeculativePreload} />
          <SocialJourney avoidSpeculativePreload={avoidSpeculativePreload} />
          <ArcadeSection controller={arcade} />
        </>
      )}
    </PortfolioShell>
  );
}
