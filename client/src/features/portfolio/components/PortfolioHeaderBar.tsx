import {
  ArrowUpRight,
  Download,
  Menu,
  Moon,
  Settings2,
  Sun,
  X,
} from "lucide-react";
import type { MouseEvent, RefObject } from "react";
import {
  portfolioMarkUrl as markUrl,
  portfolioMobileSectionLabels as mobileSectionLabels,
  portfolioNavigationItems as navigationItems,
  portfolioResumeUrl as resumeUrl,
} from "@/features/portfolio/portfolioConfig";

type PortfolioHeaderBarProps = {
  theme: "light" | "dark";
  activeSection: string;
  menuOpen: boolean;
  scrollProgress: number;
  resumeAvailable: boolean;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  onCloseMenu: () => void;
  onToggleMenu: () => void;
  onToggleTheme?: () => void;
  onOpenAppearance: (trigger?: HTMLElement | null) => void;
  onPreloadResume: () => void;
  onOpenResume: (event: MouseEvent<HTMLElement>) => void;
};

export default function PortfolioHeaderBar({
  theme,
  activeSection,
  menuOpen,
  scrollProgress,
  resumeAvailable,
  menuButtonRef,
  onCloseMenu,
  onToggleMenu,
  onToggleTheme,
  onOpenAppearance,
  onPreloadResume,
  onOpenResume,
}: PortfolioHeaderBarProps) {
  const roundedProgress = Math.round(scrollProgress);

  return (
    <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
      <a href="#inicio" aria-label="Ir ao início" className="group flex min-w-0 items-center gap-2.5 sm:gap-3" onClick={onCloseMenu}>
        <span className="grid h-10 w-10 place-items-center border border-[#67e8f9]/60 bg-[#062044] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_20px_rgba(56,189,248,0.32)]">
          <img src={markUrl} alt="Símbolo PG" width="28" height="28" decoding="async" className="h-7 w-7 object-contain" />
        </span>
        <span className="truncate font-mono text-[9px] font-medium uppercase tracking-[0.16em] text-[#b7cdf1] min-[360px]:text-[10px] min-[360px]:tracking-[0.2em]">
          Pablo <span className="text-[#67e8f9]">/</span> <span className="max-[359px]:hidden">Guilherme</span>
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
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          aria-pressed={theme === "dark"}
          title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          className="grid h-9 w-9 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        </button>
        <button
          type="button"
          data-appearance-trigger="desktop"
          onClick={(event) => onOpenAppearance(event.currentTarget)}
          aria-label="Configurações de aparência"
          title="Configurações de aparência"
          className="grid h-9 w-9 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
        >
          <Settings2 className="h-4 w-4" aria-hidden="true" />
        </button>
        {resumeAvailable && (
          <a
            href={resumeUrl}
            onPointerEnter={onPreloadResume}
            onFocus={onPreloadResume}
            onTouchStart={onPreloadResume}
            onClick={onOpenResume}
            data-resume-header="true"
            data-resume-preview-preload="intent"
            aria-haspopup="dialog"
            aria-label="Visualizar portfólio atualizado em PDF"
            title="Visualizar portfólio em PDF"
            className="resume-header-cta inline-flex items-center gap-2 border border-[#67e8f9] bg-[#0b2746] px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-[#d9fbff] transition-all hover:bg-[#123b67] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" /> <span>portfólio PDF</span>
          </a>
        )}
        <a
          href="#contato"
          className="inline-flex items-center gap-2 border border-[#67e8f9] bg-[#38bdf8] px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-all hover:bg-[#a5f3fc] hover:shadow-[0_0_28px_rgba(56,189,248,0.36)]"
        >
          contato <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </nav>

      <div className="flex shrink-0 items-center gap-1.5 md:hidden">
        <button
          ref={menuButtonRef}
          type="button"
          data-mobile-menu-toggle="true"
          data-mobile-scroll-context="true"
          onClick={onToggleMenu}
          className="group flex h-12 min-w-[108px] max-w-[136px] items-center gap-2 rounded-[14px] border border-[#67e8f9]/20 bg-[#071827]/92 px-1.5 text-[#d8e6fa] shadow-[0_10px_26px_rgba(2,17,31,0.24)] transition-[border-color,background-color,box-shadow] hover:border-[#67e8f9]/55 hover:bg-[#0b2746] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] min-[360px]:min-w-[124px] min-[390px]:min-w-[136px]"
          aria-label={menuOpen ? "Fechar menu" : `Abrir menu · seção ${mobileSectionLabels[activeSection] ?? "portfólio"} · ${roundedProgress}% percorrido`}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span
            data-mobile-progress-ring="true"
            data-progress={roundedProgress}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full p-[2px] transition-[background] motion-reduce:transition-none"
            style={{ background: `conic-gradient(#67e8f9 ${roundedProgress}%, rgba(103,232,249,0.12) 0)` }}
            aria-hidden="true"
          >
            <span className="grid h-full w-full place-items-center rounded-full bg-[#07111f] shadow-inner">
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </span>
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span data-mobile-current-section="true" className="block truncate font-mono text-[8px] font-semibold uppercase tracking-[0.08em] text-[#d9fbff]">
              {mobileSectionLabels[activeSection] ?? "portfólio"}
            </span>
            <span data-mobile-progress-value="true" className="mt-0.5 block truncate font-mono text-[7px] uppercase tracking-[0.07em] text-[#7fa5bf]">
              {roundedProgress}% percorrido
            </span>
          </span>
        </button>
        <button
          type="button"
          data-theme-toggle="true"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          aria-pressed={theme === "dark"}
          title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
          className="grid h-11 w-11 place-items-center rounded-[12px] border border-white/10 bg-[#071326]/75 text-[#d8e6fa] transition-colors hover:border-[#67e8f9] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
