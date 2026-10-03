import { useEffect } from "react";
import { PortfolioProcess, PortfolioServices, PortfolioSkills } from "@/features/portfolio/components/PortfolioStaticSections";

const staticSectionHashes = new Set(["#trilha", "#qualidade", "#servicos", "#processo"]);

export default function PortfolioDeferredStaticSections({
  markUrl,
}: {
  markUrl: string;
}) {
  useEffect(() => {
    if (typeof window === "undefined" || !staticSectionHashes.has(window.location.hash)) return;

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
      <PortfolioSkills markUrl={markUrl} />
      <PortfolioServices markUrl={markUrl} />
      <PortfolioProcess />
    </>
  );
}
