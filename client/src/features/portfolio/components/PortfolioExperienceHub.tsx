import { ArrowDownRight, Briefcase, CheckCircle2, Compass, UserRound } from "lucide-react";
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
    title: "Transforme uma necessidade em um briefing claro.",
    description: "O diagnóstico organiza objetivo, estágio e direção para a conversa começar com contexto útil.",
    href: "#diagnostico",
    cta: "diagnosticar meu projeto",
    Icon: Briefcase,
    steps: ["Definir o problema", "Montar a rota", "Gerar briefing"],
  },
  {
    id: "recruiter",
    label: "Quero avaliar seu perfil",
    eyebrow: "recrutamento / parceria",
    title: "Veja perfil, currículo e provas sem procurar informação espalhada.",
    description: "A rota profissional reúne experiência, projetos, qualidade técnica e contato em uma leitura curta.",
    href: "#perfil-profissional",
    cta: "abrir perfil profissional",
    Icon: UserRound,
    steps: ["Ler o perfil", "Ver provas", "Abrir currículo"],
  },
  {
    id: "explorer",
    label: "Quero explorar",
    eyebrow: "cases / experiência",
    title: "Abra os projetos e entenda como cada solução foi construída.",
    description: "Cases, produto publicado, decisões técnicas e PG Arcade ficam disponíveis sem bloquear a leitura principal.",
    href: "#projetos",
    cta: "ver projetos selecionados",
    Icon: Compass,
    steps: ["Abrir cases", "Comparar soluções", "Explorar o PG Arcade"],
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
        document.getElementById(`experience-route-${routeId}`)?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "nearest",
          inline: "center",
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
      tabList?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus();
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
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="experience-pointer-glow pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1440px] px-4 py-9 min-[360px]:px-5 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="grid gap-4 border-b border-white/10 pb-5 sm:gap-6 sm:pb-7 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#67e8f9]">
              escolha sua rota
            </p>
            <h2
              id="experience-hub-title"
              className="mt-2 max-w-3xl font-display text-[clamp(1.9rem,8vw,3.8rem)] font-medium leading-[0.98] tracking-[-0.05em] text-white sm:mt-3"
            >
              Vá direto ao que você precisa.
            </h2>
          </div>
          <p className="max-w-xl font-body text-sm leading-6 text-[#b7d4e4] sm:text-base sm:leading-7 lg:justify-self-end">
            Contratar, avaliar o perfil ou explorar projetos. A rota muda os atalhos sem esconder o restante do portfólio.
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-[0.78fr_1.22fr]">
          <div data-experience-route-strip="true" className="experience-route-strip -mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2 sm:mx-0 sm:grid sm:overflow-visible sm:px-0 sm:pb-0" role="tablist" aria-label="Escolha como quer explorar o portfólio">
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
                  className={`experience-route-card group relative min-h-[70px] min-w-[78%] snap-start overflow-hidden border px-3 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none sm:min-h-[84px] sm:min-w-0 sm:px-4 ${active ? "border-[#67e8f9] bg-[#0a2340]" : "border-white/10 bg-[#07111f]/75 hover:border-[#67e8f9]/40 hover:bg-[#09192b]"}`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`grid h-9 w-9 shrink-0 place-items-center border ${active ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : "border-white/10 text-[#91bad6]"}`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-mono text-[8px] uppercase tracking-[0.1em] text-[#6f91b7]">0{index + 1} · {eyebrow}</span>
                      <span className="mt-1 block font-display text-base tracking-[-0.025em] text-white sm:text-lg">{label}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            key={selected.id}
            id={`experience-panel-${selected.id}`}
            role="tabpanel"
            aria-labelledby={`experience-route-${selected.id}`}
            data-experience-panel={selected.id}
            className="experience-panel-enter relative overflow-hidden border border-[#67e8f9]/25 bg-[#071827]/90 p-4 shadow-[0_20px_54px_rgba(0,0,0,0.24)] sm:p-6 lg:p-7"
          >
            <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#67e8f9]">{selected.eyebrow}</p>
            <h3 className="mt-3 max-w-3xl font-display text-[clamp(1.65rem,7vw,3rem)] font-medium leading-[1] tracking-[-0.045em] text-white">
              {selected.title}
            </h3>
            <p className="mt-3 max-w-2xl font-body text-sm leading-6 text-[#b9d6e5]">{selected.description}</p>

            <div className="mt-5 grid grid-cols-3 gap-px bg-white/10" aria-label="Etapas desta rota">
              {selected.steps.map((step, index) => (
                <div key={step} className="min-w-0 bg-[#061423] px-2.5 py-3 sm:px-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#67e8f9]" aria-hidden="true" />
                    <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#6f91b7]">0{index + 1}</span>
                  </div>
                  <p className="mt-1.5 break-words font-body text-[11px] leading-4 text-[#e2f4fb] sm:text-sm sm:leading-5">{step}</p>
                </div>
              ))}
            </div>

            <a
              href={selected.href}
              onClick={() => trackPortfolioEvent("experience_route_cta", { experienceRoute: selected.id })}
              className="group mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-3 bg-[#38bdf8] px-5 py-3 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-all hover:-translate-y-0.5 hover:bg-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none sm:w-auto"
            >
              {selected.cta}
              <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
