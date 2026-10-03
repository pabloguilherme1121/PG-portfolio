import { ArrowDownRight, Briefcase, CheckCircle2, Compass, UserRound } from "lucide-react";
import type { KeyboardEvent } from "react";
import { useEffect, useState } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import {
  experienceRouteStorageKey,
  isMobileExperienceRoute,
  readStoredExperienceRoute,
  type MobileExperienceRoute,
} from "@/features/portfolio/utils/mobileJourney";
import { getSafeStorage, writeStorage } from "@/lib/safeStorage";

const experienceRoutes = [
  {
    id: "client",
    label: "Quero contratar",
    eyebrow: "projeto / orçamento",
    title: "Transforme a necessidade em uma rota clara.",
    description: "Use o diagnóstico para organizar objetivo, estágio e direção antes do primeiro contato.",
    href: "#diagnostico",
    cta: "diagnosticar meu projeto",
    Icon: Briefcase,
    steps: ["problema", "direção", "briefing"],
  },
  {
    id: "recruiter",
    label: "Quero avaliar seu perfil",
    eyebrow: "recrutamento / parceria",
    title: "Veja perfil, provas e currículo sem procurar informação espalhada.",
    description: "A rota profissional concentra experiência, projetos, qualidade técnica e currículo web.",
    href: "#perfil-profissional",
    cta: "abrir perfil profissional",
    Icon: UserRound,
    steps: ["perfil", "provas", "currículo"],
  },
  {
    id: "explorer",
    label: "Quero explorar",
    eyebrow: "cases / laboratório",
    title: "Continue pelos projetos e depois explore os recursos interativos.",
    description: "Cases, Observatório e PG Arcade ficam disponíveis sem competir com a apresentação profissional.",
    href: "#projetos",
    cta: "ver projetos selecionados",
    Icon: Compass,
    steps: ["cases", "código", "PG Arcade"],
  },
] as const;

type ExperienceRouteId = (typeof experienceRoutes)[number]["id"];

export default function PortfolioExperienceHub() {
  const [activeRoute, setActiveRoute] = useState<ExperienceRouteId>(
    () => readStoredExperienceRoute(getSafeStorage("session")) as ExperienceRouteId,
  );
  const selected = experienceRoutes.find((route) => route.id === activeRoute) ?? experienceRoutes[0];
  const selectedIndex = experienceRoutes.findIndex((route) => route.id === selected.id);
  const SelectedIcon = selected.Icon;

  useEffect(() => {
    const update = (event: Event) => {
      const route = (event as CustomEvent<{ routeId?: unknown }>).detail?.routeId;
      if (isMobileExperienceRoute(route)) setActiveRoute(route);
    };
    window.addEventListener("portfolio:experience-route", update);
    return () => window.removeEventListener("portfolio:experience-route", update);
  }, []);

  function selectRoute(routeId: ExperienceRouteId) {
    setActiveRoute(routeId);
    writeStorage(getSafeStorage("session"), experienceRouteStorageKey, routeId);
    window.dispatchEvent(
      new CustomEvent<{ routeId: MobileExperienceRoute }>("portfolio:experience-route", {
        detail: { routeId },
      }),
    );
    trackPortfolioEvent("experience_route_selected", { experienceRoute: routeId });
  }

  function handleRouteKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = experienceRoutes.length - 1;
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? lastIndex
          : event.key === "ArrowDown" || event.key === "ArrowRight"
            ? index === lastIndex
              ? 0
              : index + 1
            : event.key === "ArrowUp" || event.key === "ArrowLeft"
              ? index === 0
                ? lastIndex
                : index - 1
              : null;

    if (nextIndex === null) return;
    event.preventDefault();
    const tabList = event.currentTarget.closest('[role="tablist"]');
    const nextRoute = experienceRoutes[nextIndex];
    selectRoute(nextRoute.id);
    window.requestAnimationFrame(() => {
      tabList?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus();
    });
  }

  return (
    <section
      data-experience-hub="true"
      data-active-route={selected.id}
      aria-labelledby="experience-hub-title"
      className="archive-chapter border-y border-white/[0.08] bg-[#050d18]"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-9 min-[360px]:px-5 sm:px-8 sm:py-12 lg:px-12">
        <div className="grid gap-3 border-b border-white/10 pb-5 sm:grid-cols-[minmax(0,1fr)_minmax(16rem,0.65fr)] sm:items-end sm:gap-8 sm:pb-6">
          <div>
            <p className="font-mono text-[8px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">
              próximo passo · escolha sua rota
            </p>
            <h2
              id="experience-hub-title"
              className="mt-2 max-w-3xl font-display text-[clamp(1.65rem,5vw,3rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white"
            >
              Escolha como quer explorar este portfólio pelo caminho mais útil para você.
            </h2>
          </div>
          <p className="font-body text-xs leading-5 text-[#9fb6d0] sm:text-sm sm:leading-6">
            Projetos primeiro; depois você decide se quer contratar, avaliar o perfil ou explorar o laboratório.
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[0.78fr_1.22fr]">
          <div
            role="tablist"
            aria-label="Rotas do portfólio"
            data-experience-route-strip="true"
            className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1"
          >
            {experienceRoutes.map((route, index) => {
              const selectedRoute = route.id === selected.id;
              const Icon = route.Icon;
              return (
                <button
                  key={route.id}
                  id={`experience-route-${route.id}`}
                  type="button"
                  role="tab"
                  data-experience-route="true"
                  aria-selected={selectedRoute}
                  aria-controls={`experience-panel-${route.id}`}
                  tabIndex={selectedRoute ? 0 : -1}
                  onClick={() => selectRoute(route.id)}
                  onKeyDown={(event) => handleRouteKeyDown(event, index)}
                  className={`grid min-h-14 min-w-0 grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-3 border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${
                    selectedRoute
                      ? "border-[#67e8f9]/55 bg-[#0b2746] text-white"
                      : "border-white/10 bg-[#07111f] text-[#a8bdd3] hover:border-[#67e8f9]/35 hover:text-white"
                  }`}
                >
                  <span className={`grid h-9 w-9 place-items-center rounded-[10px] border ${
                    selectedRoute
                      ? "border-[#67e8f9]/35 bg-[#0d3355] text-[#a5f3fc]"
                      : "border-white/10 bg-[#081827] text-[#7fa4c1]"
                  }`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-mono text-[8px] font-semibold uppercase tracking-[0.09em]">
                      {route.label}
                    </span>
                    <span className="mt-0.5 block truncate font-body text-[11px] text-[#829db6]">
                      {route.eyebrow}
                    </span>
                  </span>
                  <span className="font-mono text-[8px] text-[#67e8f9]" aria-hidden="true">
                    0{index + 1}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id={`experience-panel-${selected.id}`}
            role="tabpanel"
            aria-labelledby={`experience-route-${selected.id}`}
            data-experience-panel={selected.id}
            className="min-w-0 border border-[#67e8f9]/20 bg-[#071326] p-4 sm:p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#67e8f9]/25 bg-[#0b2746] text-[#a5f3fc]">
                <SelectedIcon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-mono text-[8px] font-semibold uppercase tracking-[0.12em] text-[#67e8f9]">
                0{selectedIndex + 1} / 03
              </span>
            </div>

            <p className="mt-4 font-mono text-[8px] uppercase tracking-[0.13em] text-[#7ea4bd]">
              {selected.eyebrow}
            </p>
            <h3 className="mt-2 max-w-3xl font-display text-[clamp(1.5rem,4vw,2.5rem)] font-semibold leading-[1] tracking-[-0.04em] text-white">
              {selected.title}
            </h3>
            <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-[#a9bfd8]">
              {selected.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2" aria-label="Etapas desta rota">
              {selected.steps.map((step) => (
                <span
                  key={step}
                  className="inline-flex min-h-8 items-center gap-1.5 border border-white/10 bg-[#081827] px-2.5 font-mono text-[8px] uppercase tracking-[0.09em] text-[#b7d4e4]"
                >
                  <CheckCircle2 className="h-3 w-3 text-[#67e8f9]" aria-hidden="true" />
                  {step}
                </span>
              ))}
            </div>

            <a
              href={selected.href}
              onClick={() =>
                trackPortfolioEvent("experience_route_cta", { experienceRoute: selected.id })
              }
              className="group mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 border-b border-[#38bdf8] font-mono text-[9px] font-semibold uppercase tracking-[0.11em] text-[#e3faff] transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:w-auto sm:justify-start"
            >
              {selected.cta}
              <ArrowDownRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5 motion-reduce:transition-none" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
