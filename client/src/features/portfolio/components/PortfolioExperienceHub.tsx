import { ArrowDownRight, Briefcase, CheckCircle2, Compass, Sparkles, UserRound } from "lucide-react";
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
    steps: ["Definir o problema", "Montar a rota", "Gerar briefing"],
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
    steps: ["Ler o perfil", "Ver provas", "Abrir currículo"],
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
    steps: ["Abrir cases", "Comparar soluções", "Explorar o PG Lab"],
    proof: "Cases + Observatório + PG Lab",
  },
] as const;

type ExperienceRouteId = (typeof experienceRoutes)[number]["id"];

export default function PortfolioExperienceHub() {
  const [activeRoute, setActiveRoute] = useState<ExperienceRouteId>(() => readStoredExperienceRoute(getSafeStorage("session")) as ExperienceRouteId);
  const selected = experienceRoutes.find((route) => route.id === activeRoute) ?? experienceRoutes[0];
  const selectedIndex = experienceRoutes.findIndex((route) => route.id === selected.id);

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

        const routeRect = route.getBoundingClientRect();
        const stripRect = strip.getBoundingClientRect();
        const routeLeft = routeRect.left - stripRect.left + strip.scrollLeft;
        const targetLeft = routeLeft - (strip.clientWidth - routeRect.width) / 2;
        const maxLeft = Math.max(0, strip.scrollWidth - strip.clientWidth);
        strip.scrollTo({
          left: Math.min(maxLeft, Math.max(0, targetLeft)),
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

      <div className="relative mx-auto min-w-0 max-w-[1440px] overflow-hidden px-4 py-10 min-[360px]:px-5 sm:px-8 sm:py-18 lg:px-12 lg:py-22">
        <div className="grid min-w-0 max-w-full gap-5 border-b border-white/10 pb-6 sm:gap-7 sm:pb-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="min-w-0">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#67e8f9]">
              PG Experience · escolha sua rota
            </p>
            <h2
              id="experience-hub-title"
              className="mt-3 max-w-4xl font-display text-[clamp(2.05rem,10vw,5.6rem)] font-medium leading-[0.94] tracking-[-0.055em] text-white sm:mt-4 sm:leading-[0.92] sm:tracking-[-0.06em]"
            >
              Escolha como quer explorar este portfólio pelo caminho mais útil para você.
            </h2>
          </div>
          <div className="min-w-0 lg:pb-1">
            <p className="max-w-xl font-body text-sm leading-7 text-[#b7d4e4] sm:text-base">
              Contratar, avaliar o perfil ou explorar projetos: a próxima etapa se adapta à sua intenção.
              Você pode trocar de rota a qualquer momento.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 border border-[#67e8f9]/20 bg-[#06172f]/75 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#9ed8e6]">
              <Sparkles className="h-3.5 w-3.5 text-[#67e8f9]" aria-hidden="true" />
              experiência orientada · sem bloquear a navegação
            </div>
          </div>
        </div>

        <div className="mt-6 grid min-w-0 max-w-full gap-5 sm:mt-7 sm:gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="min-w-0 max-w-full overflow-hidden">
            <div data-experience-route-strip="true" className="experience-route-strip flex min-w-0 w-full max-w-full snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain pb-2 sm:grid sm:overflow-visible sm:pb-0" role="tablist" aria-label="Escolha como quer explorar o portfólio">
            <span role="presentation" aria-hidden="true" className="shrink-0 basis-[8%] sm:hidden" />
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
                  className={`experience-route-card group relative min-h-[72px] w-[78%] shrink-0 snap-center overflow-hidden border px-3 py-1 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none sm:min-h-[92px] sm:w-auto sm:min-w-0 sm:px-4 sm:py-4 ${
                    active
                      ? "border-[#67e8f9] bg-[#0a2340] shadow-[0_16px_48px_rgba(56,189,248,0.12)]"
                      : "border-white/10 bg-[#07111f]/75 hover:border-[#67e8f9]/40 hover:bg-[#09192b]"
                  }`}
                >
                  <span className="flex items-center gap-3 sm:gap-4">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center border sm:h-11 sm:w-11 ${
                      active ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : "border-white/10 text-[#91bad6]"
                    }`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f91b7]">0{index + 1} · {eyebrow}</span>
                        <span className={`h-2 w-2 rounded-full transition-all ${active ? "bg-[#67e8f9] shadow-[0_0_14px_rgba(103,232,249,0.9)]" : "bg-white/15"}`} aria-hidden="true" />
                      </span>
                      <span className="mt-1.5 block font-display text-base leading-5 tracking-[-0.03em] text-white sm:mt-2 sm:text-xl sm:leading-7 sm:tracking-[-0.035em]">{label}</span>
                    </span>
                  </span>
                </button>
              );
            })}
            <span role="presentation" aria-hidden="true" className="shrink-0 basis-[8%] sm:hidden" />
            </div>
            <div
              data-experience-progress="true"
              role="progressbar"
              aria-label="Progresso entre as rotas do portfólio"
              aria-valuemin={1}
              aria-valuemax={experienceRoutes.length}
              aria-valuenow={selectedIndex + 1}
              className="mt-2 min-w-0 max-w-full overflow-hidden border border-white/10 bg-[#07111f]/70 p-3 sm:mt-4"
            >
              <div className="flex min-w-0 items-center justify-between gap-3 font-mono text-[8px] uppercase tracking-[0.12em] text-[#7597b4]">
                <span>rota {selectedIndex + 1} de {experienceRoutes.length}</span>
                <span className="min-w-0 truncate text-right text-[#a5f3fc]">{selected.label}</span>
              </div>
              <div className="mt-2 h-px overflow-hidden bg-white/10">
                <span
                  className="experience-progress-bar block h-full bg-[#67e8f9]"
                  style={{ width: `${((selectedIndex + 1) / experienceRoutes.length) * 100}%` }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          <div
            key={selected.id}
            id={`experience-panel-${selected.id}`}
            role="tabpanel"
            aria-labelledby={`experience-route-${selected.id}`}
            data-experience-panel={selected.id}
            className="experience-panel-enter relative min-w-0 max-w-full overflow-hidden border border-[#67e8f9]/25 bg-[#071827]/90 p-2.5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:p-7 lg:p-8"
          >
            <div className="pointer-events-none absolute right-5 top-5 h-20 w-20 border-r border-t border-[#67e8f9]/25" aria-hidden="true" />
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#67e8f9]">{selected.eyebrow}</p>
              <p className="hidden font-mono text-[8px] uppercase tracking-[0.11em] text-[#7798b6] min-[390px]:block">rota ativa · {selected.proof}</p>
            </div>

            <div className="mt-6">
              <h3 className="max-w-full break-words font-display text-[clamp(1.75rem,9vw,3.8rem)] font-medium leading-[0.98] tracking-[-0.045em] text-white sm:leading-[0.95] sm:tracking-[-0.055em]">
                {selected.title}
              </h3>
              <p className="mt-4 max-w-2xl font-body text-sm leading-7 text-[#b9d6e5]">{selected.description}</p>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-px bg-white/10 sm:mt-7" aria-label="Etapas desta rota">
              {selected.steps.map((step, index) => (
                <div key={step} className="relative min-w-0 bg-[#061423] px-2.5 py-3 sm:px-4 sm:py-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#67e8f9]" aria-hidden="true" />
                    <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f91b7]">0{index + 1}</span>
                  </div>
                  <p className="mt-1.5 break-words font-body text-[11px] leading-4 text-[#e2f4fb] sm:mt-2 sm:text-sm sm:leading-normal">{step}</p>
                </div>
              ))}
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
