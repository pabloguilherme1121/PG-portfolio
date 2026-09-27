import { ArrowDownRight, Briefcase, CheckCircle2, Compass, Sparkles, UserRound } from "lucide-react";
import { useState } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";

const experienceRoutes = [
  {
    id: "client",
    label: "Quero contratar",
    eyebrow: "projeto / orçamento",
    title: "Transforme uma necessidade em uma rota clara de execução.",
    description:
      "Comece pelo diagnóstico interativo, receba uma direção inicial e leve o contexto para um briefing profissional editável.",
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
    title: "Veja competências, provas verificáveis e trajetória sem perder tempo.",
    description:
      "A rota profissional reúne currículo web, projetos em produção, código, qualidade técnica e canais de contato.",
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
    title: "Navegue pelos projetos e descubra como cada solução foi construída.",
    description:
      "Explore produtos digitais, interfaces, dados, conteúdo visual e experiências interativas com contexto e prova pública.",
    href: "#projetos",
    cta: "ver projetos selecionados",
    Icon: Compass,
    steps: ["Abrir cases", "Comparar soluções", "Explorar o PG Lab"],
    proof: "Cases + Observatório + PG Lab",
  },
] as const;

type ExperienceRouteId = (typeof experienceRoutes)[number]["id"];

export default function PortfolioExperienceHub() {
  const [activeRoute, setActiveRoute] = useState<ExperienceRouteId>("client");
  const selected = experienceRoutes.find((route) => route.id === activeRoute) ?? experienceRoutes[0];

  function selectRoute(routeId: ExperienceRouteId) {
    setActiveRoute(routeId);
    trackPortfolioEvent("experience_route_selected", { experienceRoute: routeId });
  }

  return (
    <section
      data-experience-hub="true"
      aria-labelledby="experience-hub-title"
      className="archive-chapter relative overflow-hidden border-y border-white/[0.08] bg-[#050d18]"
    >
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#38bdf8]/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1440px] px-4 py-12 min-[360px]:px-5 sm:px-8 sm:py-18 lg:px-12 lg:py-22">
        <div className="grid gap-7 border-b border-white/10 pb-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-[#67e8f9]">
              PG Experience · escolha sua rota
            </p>
            <h2
              id="experience-hub-title"
              className="mt-4 max-w-4xl font-display text-[clamp(2.35rem,7vw,5.6rem)] font-medium leading-[0.92] tracking-[-0.06em] text-white"
            >
              Escolha como quer explorar este portfólio.
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-xl font-body text-sm leading-7 text-[#b7d4e4] sm:text-base">
              Em vez de obrigar todo mundo a seguir a mesma sequência, o portfólio adapta a próxima etapa à sua intenção.
              Você pode trocar de rota a qualquer momento.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 border border-[#67e8f9]/20 bg-[#06172f]/75 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#9ed8e6]">
              <Sparkles className="h-3.5 w-3.5 text-[#67e8f9]" aria-hidden="true" />
              experiência orientada · sem bloquear a navegação
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="grid gap-2" role="group" aria-label="Escolha como quer explorar o portfólio">
            {experienceRoutes.map(({ id, label, eyebrow, Icon }, index) => {
              const active = activeRoute === id;
              return (
                <button
                  key={id}
                  type="button"
                  data-experience-route="true"
                  aria-pressed={active}
                  onClick={() => selectRoute(id)}
                  className={`group relative min-h-[92px] overflow-hidden border px-4 py-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none ${
                    active
                      ? "border-[#67e8f9] bg-[#0a2340] shadow-[0_16px_48px_rgba(56,189,248,0.12)]"
                      : "border-white/10 bg-[#07111f]/75 hover:border-[#67e8f9]/40 hover:bg-[#09192b]"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className={`grid h-11 w-11 shrink-0 place-items-center border ${
                      active ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : "border-white/10 text-[#91bad6]"
                    }`}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f91b7]">0{index + 1} · {eyebrow}</span>
                        <span className={`h-2 w-2 rounded-full transition-all ${active ? "bg-[#67e8f9] shadow-[0_0_14px_rgba(103,232,249,0.9)]" : "bg-white/15"}`} aria-hidden="true" />
                      </span>
                      <span className="mt-2 block font-display text-xl tracking-[-0.035em] text-white">{label}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            key={selected.id}
            data-experience-panel={selected.id}
            className="relative overflow-hidden border border-[#67e8f9]/25 bg-[#071827]/90 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] min-[360px]:p-5 sm:p-7 lg:p-8"
          >
            <div className="pointer-events-none absolute right-5 top-5 h-20 w-20 border-r border-t border-[#67e8f9]/25" aria-hidden="true" />
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#67e8f9]">{selected.eyebrow}</p>
              <p className="font-mono text-[8px] uppercase tracking-[0.11em] text-[#7798b6]">rota ativa · {selected.proof}</p>
            </div>

            <div className="mt-6">
              <h3 className="max-w-3xl font-display text-[clamp(2rem,4vw,3.8rem)] font-medium leading-[0.95] tracking-[-0.055em] text-white">
                {selected.title}
              </h3>
              <p className="mt-4 max-w-2xl font-body text-sm leading-7 text-[#b9d6e5]">{selected.description}</p>
            </div>

            <div className="mt-7 grid gap-px bg-white/10 sm:grid-cols-3" aria-label="Etapas desta rota">
              {selected.steps.map((step, index) => (
                <div key={step} className="relative bg-[#061423] px-4 py-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#67e8f9]" aria-hidden="true" />
                    <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f91b7]">0{index + 1}</span>
                  </div>
                  <p className="mt-2 font-body text-sm text-[#e2f4fb]">{step}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href={selected.href}
                onClick={() => trackPortfolioEvent("experience_route_cta", { experienceRoute: selected.id })}
                className="group inline-flex min-h-12 items-center justify-center gap-3 bg-[#38bdf8] px-5 py-3.5 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-all hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_12px_32px_rgba(56,189,248,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none"
              >
                {selected.cta}
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
              <p className="font-mono text-[8px] uppercase leading-4 tracking-[0.1em] text-[#66849f]">
                sem cadastro · sem perder sua posição · navegação direta
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
