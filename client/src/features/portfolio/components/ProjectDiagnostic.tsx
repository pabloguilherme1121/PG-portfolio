import { ArrowDownRight, BarChart3, Braces, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";

const diagnosticPaths = [
  {
    id: "presence",
    number: "01",
    label: "Quero apresentar ou vender melhor",
    title: "Presença digital com direção",
    recommendation: "Site ou landing page",
    objective: "Apresentar uma oferta com clareza e conduzir a pessoa para a próxima ação.",
    signal: ["mensagem", "estrutura", "conversão"],
    audience: "Clientes e pessoas que precisam entender a oferta e decidir o próximo passo",
    stage: "Ideia inicial",
    delivery: "Site responsivo",
    success: "Tornar a proposta mais fácil de entender e aumentar ações como contato, orçamento ou cadastro.",
    briefing: "Precisamos organizar a proposta de valor, priorizar a mensagem principal e criar uma experiência responsiva que conduza o visitante para uma ação clara.",
    deliverables: ["Arquitetura da página", "Interface responsiva", "CTA e publicação"],
    Icon: Braces,
  },
  {
    id: "data",
    number: "02",
    label: "Quero organizar informação ou dados",
    title: "Produto para consulta e decisão",
    recommendation: "Dashboard ou produto digital",
    objective: "Transformar informação complexa em uma experiência navegável, compreensível e útil.",
    signal: ["dados", "contexto", "interface"],
    audience: "Gestores, equipes e pessoas que precisam consultar ou interpretar os dados",
    stage: "Ideia inicial",
    delivery: "Dashboard / interface",
    success: "Reduzir o esforço de consulta e tornar indicadores e decisões mais fáceis de compreender.",
    briefing: "Há dados, fontes ou indicadores que precisam ser organizados em uma experiência clara. O projeto deve definir hierarquia, contexto, filtros e uma interface responsiva para consulta e decisão.",
    deliverables: ["Arquitetura da informação", "Dashboard responsivo", "Estados, filtros e publicação"],
    Icon: BarChart3,
  },
  {
    id: "launch",
    number: "03",
    label: "Quero lançar ou demonstrar algo",
    title: "Produto + comunicação",
    recommendation: "Solução combinada",
    objective: "Construir a experiência digital e explicar seu valor com conteúdo visual direto.",
    signal: ["produto", "demonstração", "interesse"],
    audience: "Pessoas que precisam experimentar, entender ou compartilhar a nova solução",
    stage: "Ideia inicial",
    delivery: "Solução combinada",
    success: "Colocar a solução no ar com uma demonstração clara, consistente e pronta para apresentação.",
    briefing: "O projeto combina uma entrega digital com comunicação visual. Precisamos definir a experiência principal, o que deve ser demonstrado e quais peças ajudam o público a entender o valor rapidamente.",
    deliverables: ["Experiência digital", "Demonstração visual", "Pacote de lançamento"],
    Icon: Sparkles,
  },
] as const;

const diagnosticStages = [
  {
    id: "idea",
    label: "Ideia inicial",
    value: "Ideia inicial",
    summary: "descoberta orientada",
    description: "Organizar problema, público e prioridade antes da construção.",
  },
  {
    id: "evolve",
    label: "Já existe e precisa evoluir",
    value: "Já existe e precisa evoluir",
    summary: "evolução guiada",
    description: "Preservar o que funciona, corrigir atritos e priorizar a próxima versão.",
  },
  {
    id: "ready",
    label: "Pronto para construir",
    value: "Pronto para construir",
    summary: "execução objetiva",
    description: "Levar um escopo já claro para interface, desenvolvimento, validação e publicação.",
  },
] as const;

export default function ProjectDiagnostic() {
  const [selectedId, setSelectedId] = useState<(typeof diagnosticPaths)[number]["id"]>("data");
  const [selectedStageId, setSelectedStageId] = useState<(typeof diagnosticStages)[number]["id"]>("idea");
  const selected = diagnosticPaths.find((path) => path.id === selectedId) ?? diagnosticPaths[0];
  const selectedStage = diagnosticStages.find((stage) => stage.id === selectedStageId) ?? diagnosticStages[0];

  function seedBriefing() {
    trackPortfolioEvent("diagnostic_completed", {
      diagnosticPath: selected.id,
      diagnosticStage: selectedStage.id,
    });
    window.dispatchEvent(
      new CustomEvent("portfolio:briefing-seed", {
        detail: {
          service: selected.recommendation,
          objective: selected.objective,
          projectType:
            selected.id === "data"
              ? "Projeto com dados / dashboard"
              : selected.id === "launch"
                ? "Produto ou serviço digital"
                : "Marca ou negócio",
          audience: selected.audience,
          stage: selectedStage.value,
          delivery: selected.delivery,
          success: selected.success,
          briefing: `${selected.briefing} Estágio informado: ${selectedStage.value}. Direção inicial: ${selectedStage.description}`,
        },
      }),
    );
  }

  return (
    <section
      id="diagnostico"
      data-project-diagnostic="true"
      className="archive-chapter relative overflow-hidden border-y border-white/[0.08] bg-[#061226]"
    >
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-[#38bdf8]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <div className="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a5f3fc]">
              Project Lens · experiência interativa
            </p>
            <h2 className="mt-5 max-w-3xl font-display text-[clamp(2.6rem,5vw,5.7rem)] font-medium leading-[0.9] tracking-[-0.065em] text-white">
              Transforme uma ideia vaga em uma rota de projeto.
            </h2>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-2xl font-body text-base leading-8 text-[#badbec]">
              Escolha o problema mais próximo do seu cenário. O portfólio monta uma direção inicial, mostra o que faria parte da entrega e leva essa lógica para um briefing já estruturado.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-px bg-white/10">
              {["problema", "rota", "briefing"].map((step, index) => (
                <div key={step} className="bg-[#07111f]/90 px-3 py-3">
                  <span className="font-mono text-[8px] text-[#67e8f9]">0{index + 1}</span>
                  <span className="mt-1 block font-mono text-[8px] uppercase tracking-[0.12em] text-[#9db7d6]">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="grid content-start gap-2" role="group" aria-label="Escolha o objetivo principal do projeto">
            {diagnosticPaths.map(({ id, number, label, title, Icon }) => {
              const active = selectedId === id;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setSelectedId(id);
                    trackPortfolioEvent("diagnostic_option_selected", { diagnosticPath: id });
                  }}
                  className={`group relative min-h-[118px] overflow-hidden border px-4 py-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none sm:px-5 ${
                    active
                      ? "border-[#67e8f9] bg-[#0b2746] shadow-[0_18px_50px_rgba(56,189,248,0.16)]"
                      : "border-white/10 bg-[#07101e]/70 hover:border-[#67e8f9]/50 hover:bg-[#091b30]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-0.5 transition-colors ${active ? "bg-[#67e8f9]" : "bg-transparent"}`}
                  />
                  <span className="flex items-start gap-4">
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center border transition-colors ${
                        active ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : "border-white/10 text-[#8eb8dd]"
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#67e8f9]">{number}</span>
                        <span className={`font-mono text-[8px] uppercase tracking-[0.12em] ${active ? "text-[#a5f3fc]" : "text-[#607a9f]"}`}>
                          {active ? "rota ativa" : "explorar"}
                        </span>
                      </span>
                      <span className="mt-2 block font-body text-sm font-medium text-[#e8f7ff]">{label}</span>
                      <span className="mt-1 block font-display text-xl tracking-[-0.035em] text-white">{title}</span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative overflow-hidden border border-[#67e8f9]/30 bg-[#07111f]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7 lg:p-8">
            <div className="pointer-events-none absolute right-5 top-5 h-20 w-20 border-r border-t border-[#67e8f9]/30" aria-hidden="true" />
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">rota recomendada</p>
                <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f8fb7]">PG / PROJECT.LENS / {selected.number}</p>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#a8c6da]">
                <span className="h-2 w-2 rounded-full bg-[#67e8f9] shadow-[0_0_16px_rgba(103,232,249,0.9)]" aria-hidden="true" />
                análise ativa
              </span>
            </div>

            <div key={selected.id} className="mt-7 animate-[fadeIn_220ms_ease-out] motion-reduce:animate-none" aria-live="polite">
              <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#7fa8cc]">{selected.recommendation}</p>
              <h3 className="mt-3 max-w-2xl font-display text-[clamp(2.15rem,3.5vw,4rem)] font-medium leading-[0.93] tracking-[-0.055em] text-white">
                {selected.title}
              </h3>
              <p className="mt-5 max-w-2xl font-body text-sm leading-7 text-[#bed9e8]">{selected.objective}</p>

              <div className="mt-7">
                <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#6f91b7]">fluxo da solução</p>
                <div className="mt-3 grid gap-px bg-white/10 sm:grid-cols-3">
                  {selected.signal.map((item, index) => (
                    <div key={item} className="relative bg-[#08182a] px-4 py-4">
                      <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#8aa8cc]">0{index + 1}</p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#d8f3ff]">{item}</p>
                      {index < selected.signal.length - 1 && (
                        <span aria-hidden="true" className="absolute -right-1 top-1/2 z-10 hidden h-2 w-2 -translate-y-1/2 rotate-45 border-r border-t border-[#67e8f9]/70 sm:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_0.9fr]">
                <div className="border border-white/10 bg-[#06172f]/65 p-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#67e8f9]">entregáveis iniciais</p>
                  <div className="mt-3 grid gap-2">
                    {selected.deliverables.map((item) => (
                      <div key={item} data-diagnostic-deliverable="true" className="flex items-center gap-2 font-body text-sm text-[#d9edf7]">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#67e8f9]" aria-hidden="true" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border border-white/10 bg-[#06172f]/65 p-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#67e8f9]">critério de sucesso</p>
                  <p className="mt-3 font-body text-sm leading-6 text-[#bcd9e8]">{selected.success}</p>
                </div>
              </div>


              <div className="mt-6 border border-white/10 bg-[#06172f]/65 p-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.13em] text-[#67e8f9]">maturidade do projeto</p>
                    <p className="mt-2 font-body text-xs leading-5 text-[#9fbfd3]">A rota muda conforme o ponto de partida.</p>
                  </div>
                  <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#a5f3fc]">{selectedStage.summary}</p>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3" role="group" aria-label="Escolha o estágio atual do projeto">
                  {diagnosticStages.map((stage) => {
                    const active = selectedStageId === stage.id;
                    return (
                      <button
                        key={stage.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setSelectedStageId(stage.id);
                          trackPortfolioEvent("diagnostic_stage_selected", { diagnosticStage: stage.id });
                        }}
                        className={`min-h-12 border px-3 py-3 text-left font-mono text-[8px] font-semibold uppercase leading-4 tracking-[0.09em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${active ? "border-[#67e8f9] bg-[#0b2746] text-white" : "border-white/10 bg-[#07101e] text-[#8fa8c7] hover:border-[#67e8f9]/45 hover:text-white"}`}
                      >
                        {stage.label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 font-body text-xs leading-5 text-[#88a9bf]">{selectedStage.description}</p>
              </div>

              <div className="mt-6 border-l-2 border-[#38bdf8] bg-[#08172a]/80 px-4 py-3">
                <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#67e8f9]">o que acontece ao continuar</p>
                <p className="mt-2 font-body text-xs leading-5 text-[#9fbfd3]">
                  Serviço, público, estágio, formato de entrega, objetivo, sucesso esperado e contexto inicial entram no briefing. Você pode editar tudo antes de enviar.
                </p>
              </div>

              <a
                href="#contato-briefing"
                onClick={seedBriefing}
                className="group mt-7 inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#38bdf8] px-5 py-3.5 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#02111f] transition-all hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_14px_34px_rgba(56,189,248,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none sm:w-auto"
              >
                gerar briefing com esta rota
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
