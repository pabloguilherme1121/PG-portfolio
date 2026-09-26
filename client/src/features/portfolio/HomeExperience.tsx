import { ArrowUp, ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { useTheme } from "@/contexts/ThemeContext";
import PortfolioAbout from "@/features/portfolio/components/PortfolioAbout";
import PortfolioCaseStudies from "@/features/portfolio/components/PortfolioCaseStudies";
import { PortfolioContact } from "@/features/portfolio/components/PortfolioContact";
import PortfolioFooter from "@/features/portfolio/components/PortfolioFooter";
import PortfolioHero from "@/features/portfolio/components/PortfolioHero";
import PortfolioProjectDialog from "@/features/portfolio/components/PortfolioProjectDialog";
import PortfolioProjectsOverview from "@/features/portfolio/components/PortfolioProjectsOverview";
import { PortfolioProcess, PortfolioServices, PortfolioSkills } from "@/features/portfolio/components/PortfolioStaticSections";
import { repositories, type Repository } from "@/features/portfolio/portfolioData";
import { buildBriefingWhatsAppUrl } from "@/features/portfolio/utils/briefingWhatsApp";
import { copyTextWithFeedback } from "@/features/portfolio/utils/clipboardFeedback";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { publicMediaPath } from "@/features/portfolio/utils/publicMediaPath";
import { trpc } from "@/lib/trpc";

const markUrl = `${import.meta.env.BASE_URL}favicon.svg`;
const portfolioMediaPath = (file: string) => `${import.meta.env.BASE_URL}portfolio-media/${file}`;
const portraitUrl = portfolioMediaPath("pablo-profile-2026.webp");
const portraitResponsive = {
  avif: portfolioMediaPath("pablo-profile-2026.avif"),
  webp: portfolioMediaPath("pablo-profile-2026.webp"),
};
const resumeUrl = publicMediaPath("/manus-storage/curriculo-pablo-guilherme-profissional_1b06376f.pdf");
const whatsAppNumber = "5561992903029";
const whatsAppUrl = `https://wa.me/${whatsAppNumber}?text=Olá%2C%20Pablo%21%20Vim%20pelo%20portfólio%20e%20gostaria%20de%20conversar%20sobre%20um%20projeto.`;
const isStaticDeploy = import.meta.env.VITE_STATIC_DEPLOY === "true";

declare const __PORTFOLIO_RESUME_AVAILABLE__: boolean;
declare const __PORTFOLIO_HERO_AVAILABLE__: boolean;

const resumeAvailable = !isStaticDeploy || __PORTFOLIO_RESUME_AVAILABLE__;
const heroAvailable = !isStaticDeploy || __PORTFOLIO_HERO_AVAILABLE__;

const navigationItems = [
  ["sobre", "#sobre", "sobre"],
  ["competências", "#trilha", "trilha"],
  ["serviços", "#servicos", "servicos"],
  ["projetos", "#projetos", "projetos"],
] as const;

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("inicio");
  const [isDesktopViewport, setIsDesktopViewport] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia("(min-width: 768px)").matches,
  );
  const [featuredCardsReady, setFeaturedCardsReady] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Repository | null>(null);
  const [formSent, setFormSent] = useState(false);
  const [briefingWhatsAppUrl, setBriefingWhatsAppUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailCopyStatus, setEmailCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  const successMessageRef = useRef<HTMLDivElement>(null);

  const featuredRepositories = useMemo(
    () =>
      [...repositories]
        .filter((repository) => repository.featured || repository.relevance >= 80)
        .sort((first, second) => second.relevance - first.relevance)
        .slice(0, 3),
    [],
  );

  const quoteRequestMutation = trpc.quoteRequest.create.useMutation({
    onSuccess: (result) => {
      trackPortfolioEvent("briefing_completed");
      setFormSent(true);
      toast.success("Briefing recebido", {
        description: result.ownerNotified
          ? "Seu pedido foi registrado. Em breve, Pablo retorna com os próximos passos."
          : "Seu pedido foi registrado. A confirmação interna será revisada assim que o serviço voltar.",
      });
    },
    onError: () => {
      const message = "Não foi possível enviar agora. Confira sua conexão e tente novamente.";
      setFormError(message);
      toast.error("Não foi possível enviar", { description: message });
    },
  });

  useEffect(() => {
    const delay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 240;
    const timer = window.setTimeout(() => setFeaturedCardsReady(true), delay);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      setShowBackToTop(window.scrollY > 640);
      setScrollProgress(
        scrollableHeight > 0
          ? Math.min(100, Math.max(0, (window.scrollY / scrollableHeight) * 100))
          : 0,
      );
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleViewportChange = () => {
      setIsDesktopViewport(mediaQuery.matches);
      if (mediaQuery.matches) setMenuOpen(false);
    };
    mediaQuery.addEventListener("change", handleViewportChange);
    return () => mediaQuery.removeEventListener("change", handleViewportChange);
  }, []);

  useEffect(() => {
    const sectionIds = ["inicio", ...navigationItems.map(([, , id]) => id), "contato"];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visibleEntry?.target.id) setActiveSection(visibleEntry.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0.1, 0.3, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  useEffect(() => {
    const projectId = new URLSearchParams(window.location.search).get("projeto");
    if (!projectId) return;
    const project = repositories.find((repository) => repository.id === projectId);
    if (project) setSelectedProject(project);
  }, []);

  useEffect(() => {
    if (formSent) successMessageRef.current?.focus();
  }, [formSent]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function openProjectDetails(project: Repository) {
    trackPortfolioEvent("project_opened", { projectId: project.id, surface: "details" });
    setSelectedProject(project);
    const params = new URLSearchParams(window.location.search);
    params.set("projeto", project.id);
    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}#projetos`);
  }

  function closeProjectDetails() {
    setSelectedProject(null);
    const params = new URLSearchParams(window.location.search);
    params.delete("projeto");
    const query = params.toString();
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash === "#projetos" ? "#projetos" : ""}`,
    );
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
      const url = buildBriefingWhatsAppUrl(whatsAppNumber, data);
      trackPortfolioEvent("briefing_whatsapp_prepared", { channel: "whatsapp" });
      setBriefingWhatsAppUrl(url);
      setFormSent(true);
      return;
    }

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
        briefing: String(data.get("briefing") || ""),
        website: String(data.get("website") || ""),
      },
      { onSuccess: () => form.reset() },
    );
  }

  async function copyContactEmail() {
    await copyTextWithFeedback("mpjcreator@gmail.com", setEmailCopyStatus);
  }

  function scrollToTop() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  }

  return (
    <div
      data-theme={theme}
      className="arquivo-page min-h-screen overflow-x-hidden bg-[#07111f] text-[#f2fbff] selection:bg-[#67e8f9] selection:text-[#061226]"
    >
      <a href="#conteudo-principal" className="skip-link">pular para o conteúdo</a>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-cyan-200/[0.14] bg-[#07111f]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a href="#inicio" aria-label="Ir ao início" className="group flex items-center gap-3" onClick={closeMenu}>
            <span className="grid h-10 w-10 place-items-center border border-[#67e8f9]/60 bg-[#062044] transition-transform duration-200 group-hover:-translate-y-0.5">
              <img src={markUrl} alt="" width="28" height="28" decoding="async" className="h-7 w-7 object-contain" />
            </span>
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#b7cdf1]">
              Pablo <span className="text-[#67e8f9]">/</span> Guilherme
            </span>
          </a>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Navegação principal">
            {navigationItems.map(([label, href, id]) => (
              <a
                key={label}
                href={href}
                aria-current={activeSection === id ? "location" : undefined}
                className={`nav-link font-mono text-[11px] uppercase tracking-[0.14em] transition-colors hover:text-white ${activeSection === id ? "text-[#67e8f9]" : "text-[#90a3c3]"}`}
              >
                {label}
              </a>
            ))}
            <a
              href="https://pabloguilherme01.github.io/observatorio/"
              target="_blank"
              rel="noreferrer"
              className="nav-link font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a5f3fc] transition-colors hover:text-white"
            >
              observatório <ArrowUpRight className="ml-1 inline h-3 w-3" />
            </a>
            <button
              type="button"
              data-theme-toggle="true"
              onClick={() => toggleTheme?.()}
              aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
              aria-pressed={theme === "dark"}
              className="grid h-9 w-9 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
            </button>
            <a
              href="#contato"
              onClick={() => trackPortfolioEvent("quote_cta", { source: "contact" })}
              className="inline-flex min-h-10 items-center gap-2 bg-[#38bdf8] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-colors hover:bg-[#a5f3fc]"
            >
              contato <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              data-theme-toggle="true"
              onClick={() => toggleTheme?.()}
              aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
              aria-pressed={theme === "dark"}
              className="grid h-11 w-11 place-items-center border border-white/10 text-[#d8e6fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button
              type="button"
              data-mobile-menu-toggle="true"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              className="grid h-11 w-11 place-items-center border border-white/10 text-[#d8e6fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Navegação móvel"
            className="border-t border-white/10 bg-[#07111f] px-5 py-5 md:hidden"
          >
            <div className="grid gap-1">
              {navigationItems.map(([label, href], index) => (
                <a
                  key={label}
                  href={href}
                  onClick={closeMenu}
                  className="flex min-h-12 items-center justify-between border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.14em] text-[#d6e7f8]"
                >
                  <span>0{index + 1} / {label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#67e8f9]" />
                </a>
              ))}
              <a
                href="https://pabloguilherme01.github.io/observatorio/"
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
                className="flex min-h-12 items-center justify-between border-b border-white/10 font-mono text-[11px] uppercase tracking-[0.14em] text-[#a5f3fc]"
              >
                <span>05 / observatório</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a
                href="#contato"
                onClick={closeMenu}
                className="mt-3 inline-flex min-h-12 items-center justify-center bg-[#38bdf8] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#02111f]"
              >
                06 / contato
              </a>
            </div>
          </nav>
        )}
      </header>

      <div className="scroll-progress-track pointer-events-none fixed inset-x-0 top-[75px] z-40 h-0.5 bg-[#67e8f9]/10" aria-hidden="true">
        <span
          className="scroll-progress-bar block h-full origin-left bg-[#67e8f9] shadow-[0_0_12px_rgba(103,232,249,0.8)]"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />
      </div>

      <main id="conteudo-principal" className="relative" tabIndex={-1}>
        <div className="archive-spine pointer-events-none absolute bottom-0 top-0 z-20" aria-hidden="true" />

        <PortfolioHero
          heroAvailable={heroAvailable}
          markUrl={markUrl}
          portraitUrl={portraitUrl}
          portraitResponsive={portraitResponsive}
        />

        <PortfolioAbout resumeAvailable={resumeAvailable} resumeUrl={resumeUrl} />

        <PortfolioSkills isDesktopViewport={isDesktopViewport} markUrl={markUrl} />
        <PortfolioServices markUrl={markUrl} />
        <PortfolioProcess />

        <section id="projetos" className="archive-chapter relative border-y border-white/[0.07] bg-[#0a0f18]">
          <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
            <PortfolioProjectsOverview
              markUrl={markUrl}
              featuredCardsReady={featuredCardsReady}
              featuredRepositories={featuredRepositories}
              openProjectDetails={openProjectDetails}
            />

            <PortfolioCaseStudies />

            <div className="mt-10 flex flex-col gap-4 border-y border-white/[0.1] py-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">próximo passo</p>
                <p className="mt-2 max-w-2xl font-body text-sm leading-6 text-[#a9bfd8]">
                  Se o projeto fizer sentido para o que você precisa, envie o contexto e o prazo para alinharmos o escopo.
                </p>
              </div>
              <a
                href="#contato"
                onClick={() => trackPortfolioEvent("quote_cta", { source: "contact" })}
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[#38bdf8] px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-colors hover:bg-[#a5f3fc]"
              >
                falar sobre um projeto <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <PortfolioContact
          whatsAppUrl={whatsAppUrl}
          handleSubmit={handleSubmit}
          isQuoteRequestPending={quoteRequestMutation.isPending}
          formError={formError}
          formSent={formSent}
          setFormSent={setFormSent}
          successMessageRef={successMessageRef}
          isStaticDeploy={isStaticDeploy}
          briefingWhatsAppUrl={briefingWhatsAppUrl}
        />
      </main>

      <PortfolioFooter
        markUrl={markUrl}
        whatsAppUrl={whatsAppUrl}
        onWhatsAppClick={() => trackPortfolioEvent("whatsapp_click", { source: "footer" })}
        emailCopyStatus={emailCopyStatus}
        copyContactEmail={copyContactEmail}
      />

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Voltar ao topo da página"
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
        className={`fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center border border-[#67e8f9]/40 bg-[#07111f]/95 text-[#bdf7ff] shadow-[0_10px_28px_rgba(0,0,0,0.35)] backdrop-blur transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${showBackToTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"}`}
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>

      <PortfolioProjectDialog
        project={selectedProject}
        onOpenChange={(open) => {
          if (!open) closeProjectDetails();
        }}
      />
    </div>
  );
}
