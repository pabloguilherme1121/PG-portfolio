import { useEffect } from "react";
import PortfolioAbout from "@/features/portfolio/components/PortfolioAbout";
import PortfolioProfessionalSnapshot from "@/features/portfolio/components/PortfolioProfessionalSnapshot";

type ResponsiveSourceSet = {
  avif: string;
  webp: string;
};

type PortfolioDeferredProfileSectionsProps = {
  portraitUrl: string;
  portraitResponsive: ResponsiveSourceSet;
};

const profileHashes = new Set(["#sobre", "#perfil-profissional"]);

export default function PortfolioDeferredProfileSections({
  portraitUrl,
  portraitResponsive,
}: PortfolioDeferredProfileSectionsProps) {
  useEffect(() => {
    if (typeof window === "undefined" || !profileHashes.has(window.location.hash)) return;

    const scrollToRequestedSection = () => {
      const target = document.getElementById(window.location.hash.slice(1));
      if (!target) return false;
      target.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start",
      });
      return true;
    };

    if (scrollToRequestedSection()) return;

    const frame = window.requestAnimationFrame(scrollToRequestedSection);
    const timer = window.setTimeout(scrollToRequestedSection, 180);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <PortfolioAbout
        portraitUrl={portraitUrl}
        portraitResponsive={portraitResponsive}
      />
      <PortfolioProfessionalSnapshot />
    </>
  );
}
