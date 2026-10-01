import { ArrowDownRight, Briefcase, Compass, UserRound } from "lucide-react";
import type { KeyboardEvent, PointerEvent } from "react";
import { useState } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { experienceRouteStorageKey, readStoredExperienceRoute, type MobileExperienceRoute } from "@/features/portfolio/utils/mobileJourney";
import { getSafeStorage, writeStorage } from "@/lib/safeStorage";

const experienceRoutes = [
  {
    id: "client",
    label: "Quero contratar",
    eyebrow: "projeto / orçamento",
    title: "Comece pelo problema e avance com uma rota clara.",
    description:
      "O diagnóstico organiza objetivo, estágio e direção para o briefing já começar com contexto útil.",
    href: "#diagnostico",
    cta: "diagnosticar meu projeto",
    Icon: Briefcase,
    proof: "Project Lens + Briefing Studio",
  },
  {
    id: "recruiter",
    label: "Quero avaliar seu perfil",
    eyebrow: "recrutamento / parceria",
    title: "Avalie perfil e provas sem procurar informação espalhada.",
    description:
      "Currículo web, projetos, código, qualidade técnica e contato ficam reunidos em uma rota curta.",
    href: "#perfil-profissional",
    cta: "abrir perfil profissional",
    Icon: UserRound,
    proof: "Perfil + currículo + GitHub",
  },
  {
    id: "explorer",
    label: "Quero explorar",
    eyebrow: "cases / experiência",
    title: "Explore projetos e entenda como cada solução foi construída.",
    description:
      "Veja produtos digitais, interfaces, dados, decisões técnicas e provas públicas sem ruído desnecessário.",
    href: "#projetos",
    cta: "ver projetos selecionados",
    Icon: Compass,
    proof: "Cases + Observatório + PG Lab",
  },
] as const;

type ExperienceRouteId = (typeof experienceRoutes)[number]["id"];

export default function PortfolioExperienceHub() {
  const [activeRoute, setActiveRoute] = useState<ExperienceRouteId>(() => readStoredExperienceRoute(getSafeStorage("session")) as ExperienceRouteId);
  const selected = experienceRoutes.find((route) => route.id === activeRoute) ?? experienceRoutes[0];

  function selectRoute(routeId: ExperienceRouteId) {
    setActiveRoute(routeId);
    writeStorage(getSafeStorage("session"), experienceRouteStorageKey, routeId);
    window.dispatchEvent(new CustomEvent<{ routeId: MobileExperienceRoute }>("portfolio:experience-route", { detail: { routeId } }));
    trackPortfolioEvent("experience_route_selected", { experienceRoute: routeId });

    if (window.matchMedia("(max-width: 639px)").matches) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.requestAnimationFrame(() => {
        const route = document.getElementById(`experience-route-${routeId}`);
        const strip = route?.closest<HTMLElement>('[data-experience-route-strip="true"]');
        if (!route || !strip) return;

        const targetLeft = route.offsetLeft - (strip.clientWidth - route.offsetWidth) / 2;
        strip.scrollTo({
          left: Math.max(0, targetLeft),
          behavior: reduceMotion ? "auto" : "smooth",
        });
      });
    }
  }

  function handleRouteKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const lastIndex = experienceRoutes.length - 1;
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? lastIndex
          : event.key === "ArrowDown" || event.key === "ArrowRight"
            ? index === lastIndex ? 0 : index + 1
            : event.key === "ArrowUp" || event.key === "ArrowLeft"
              ? index === 0 ? lastIndex : index - 1
              : null;

    if (nextIndex === null) return;
    event.preventDefault();
    const tabList = event.currentTarget.closest('[role="tablist"]');
    const nextRoute = experienceRoutes[nextIndex];
    selectRoute(nextRoute.id);
    window.requestAnimationFrame(() => {
      tabList
        ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
        [nextIndex]?.focus();
    });
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--experience-x", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--experience-y", `${event.clientY - bounds.top}px`);
  }

  return (
    <section
      data-experience-hub="true"
      data-active-route={selected.id}
      aria-labelledby="experience-hub-title"
      onPointerMove={handlePointerMove}
      className="experience-hub-surface archive-chapter relative overflow-hidden border-y border-white/[0.08] bg-[#050d18]"
    >
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="experience-pointer-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#38bdf8]/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1440px] px-4 py-8 min-[360px]:px-5 sm:px-8 sm:py-12 lg:px-12 lg:py-14">
        <div className="grid gap-3 border-b border-white/10 pb-5 sm:gap-5 sm:pb-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#67e8f9]">
              PG Experience · escolha sua rota
            </p>
            <h2
              id="experience-hub-title"
              className="mt-2 max-w-3xl font-display text-[clamp(1.8rem,8vw,3.8rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white sm:mt-3 sm:leading-[0.94]"
            >
              Escolha a rota mais útil para você.
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-xl font-body text-sm leading-6 text-[#b7d4e4] sm:text-base sm:leading-7">
              Contratar, avaliar o perfil ou explorar projetos. Troque de rota quando quiser.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <div data-experience-route-strip="true" className="experience-route-strip flex w-full max-w-full snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2 sm:grid sm:overflow-visible sm:pb-0" role="tablist" aria-label="Escolha como quer explorar o portfólio">
            {experienceRoutes.map(({ id, label, eyebrow, Icon }, index) => {
              const active = activeRoute === id;
              return (
                <button
                  key={id}
                  type="button"
                  data-experience-route="true"
                  id={`experience-route-${id}`}
                  role="tab"
                  aria-selected={active}
                  aria-controls={`experience-panel-${id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectRoute(id)}
                  onKeyDown={(event) => handleRouteKeyDown(event, index)}
                  className={`experience-route-card group relative min-h-[72px] min-w-[calc(78%-0.5rem)] max-w-[calc(100vw-2rem)] snap-start overflow-hidden border px-3 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none sm:min-h-[92px] sm:min-w-0 sm:px-4 sm:py-4 ${
                    active
                      ? "border-[#67e8f9] bg-[#0a2340] shadow-[0_16px_48px_rgba(56,189,248,0.12)]"
                      : "border-white/10 bg-[#07111f]/75 hover:border-[#67e8f9]/40 hover:bg-[#09192b]"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center border sm:h-11 sm:w-11 ${
                      active ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : "border-white/10 text-[#91bad6]"
                    }`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f91b7]">0{index + 1} · {eyebrow}</span>
                        <span className={`h-2 w-2 rounded-full transition-all ${active ? "bg-[#67e8f9] shadow-[0_0_14px_rgba(103,232,249,0.9)]" : "bg-white/15"}`} aria-hidden="true" />
                      </span>
                      <span className="mt-1.5 block font-display text-lg tracking-[-0.03em] text-white sm:mt-2 sm:text-xl sm:tracking-[-0.035em]">{label}</span>
                    </span>
                  </span>
                </button>
              );
            })}
            </div>

          </div>

          <div
            key={selected.id}
            id={`experience-panel-${selected.id}`}
            role="tabpanel"
            aria-labelledby={`experience-route-${selected.id}`}
            data-experience-panel={selected.id}
            className="experience-panel-enter relative min-w-0 max-w-full overflow-hidden border border-[#67e8f9]/25 bg-[#071827]/90 p-4 shadow-[0_20px_56px_rgba(0,0,0,0.24)] sm:p-6 lg:p-7"
          >
            <div className="pointer-events-none absolute right-5 top-5 h-20 w-20 border-r border-t border-[#67e8f9]/25" aria-hidden="true" />
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#67e8f9]">{selected.eyebrow}</p>
              <p className="hidden font-mono text-[8px] uppercase tracking-[0.11em] text-[#7798b6] min-[390px]:block">rota ativa · {selected.proof}</p>
            </div>

            <div className="mt-5">
              <h3 className="max-w-full break-words font-display text-[clamp(1.75rem,9vw,3.8rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white sm:leading-[0.95] sm:tracking-[-0.055em]">
                {selected.title}
              </h3>
              <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-[#b9d6e5] sm:leading-7">{selected.description}</p>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center">
              <a
                href={selected.href}
                onClick={() => trackPortfolioEvent("experience_route_cta", { experienceRoute: selected.id })}
                className="group inline-flex min-h-[50px] w-full items-center justify-center gap-3 bg-[#38bdf8] px-5 py-3.5 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-all hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_12px_32px_rgba(56,189,248,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none sm:w-auto"
              >
                {selected.cta}
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
              <p className="hidden font-mono text-[8px] uppercase leading-4 tracking-[0.1em] text-[#66849f] sm:block">
                sem cadastro · sem perder sua posição · navegação direta
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
