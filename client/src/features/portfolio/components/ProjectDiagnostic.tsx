import { ArrowDownRight, BarChart3, Braces, CheckCircle2, Sparkles } from "lucide-react";
import { useState } from "react";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";

const diagnosticPaths = [
  {
    id: "presence",
    label: "Quero apresentar ou vender melhor",
    title: "Presença digital com direção",
    recommendation: "Site ou landing page",
    objective: "Apresentar uma oferta com clareza e conduzir a pessoa para a próxima ação.",
    signal: "mensagem → estrutura → conversão",
    audience: "Clientes e pessoas que precisam entender a oferta e agir",
    delivery: "Site responsivo",
    success: "A proposta fica mais fácil de entender e mais pessoas chegam ao contato ou à ação principal.",
    briefing: "Precisamos organizar a mensagem, a proposta de valor, as provas e a chamada para ação em uma presença digital clara e responsiva.",
    proof: "estrutura da mensagem + experiência responsiva + publicação",
    Icon: Braces,
  },
  {
    id: "data",
    label: "Quero organizar informação ou dados",
    title: "Produto para consulta e decisão",
    recommendation: "Dashboard ou produto digital",
    objective: "Transformar informação complexa em uma experiência navegável, compreensível e útil.",
    signal: "dados → contexto → interface",
    audience: "Gestores, equipes e pessoas que precisam consultar informações e tomar decisões",
    delivery: "Dashboard / interface",
    success: "A consulta fica mais rápida, os indicadores ganham contexto e as decisões exigem menos esforço para encontrar informação.",
    briefing: "Precisamos reunir dados, fontes e indicadores dispersos, definir hierarquia e transformar esse conteúdo em uma interface de consulta clara e responsiva.",
    proof: "arquitetura da informação + interface + validação de uso",
    Icon: BarChart3,
  },
  {
    id: "launch",
    label: "Quero lançar ou demonstrar algo",
    title: "Produto + comunicação",
    recommendation: "Solução combinada",
    objective: "Construir a experiência digital e explicar seu valor com conteúdo visual direto.",
    signal: "produto → demonstração → interesse",
    audience: "Pessoas que precisam conhecer, testar ou entender rapidamente a solução",
    delivery: "Solução combinada",
    success: "A solução fica pronta para ser apresentada e a demonstração comunica valor sem depender de explicações longas.",
    briefing: "Precisamos estruturar a experiência digital, preparar a publicação e criar uma demonstração visual que conecte problema, solução e próximo passo.",
    proof: "produto publicável + demonstração + narrativa visual",
    Icon: Sparkles,
  },
] as const;

const diagnosticStages = [
  {
    id: "idea",
    label: "Ideia inicial",
    value: "Ideia inicial",
    summary: "descoberta orientada",
    description: "Organizar problema, público, conteúdo e prioridade antes de construir.",
  },
  {
    id: "evolve",
    label: "Já existe e precisa evoluir",
    value: "Já existe e precisa evoluir",
    summary: "evolução guiada",
    description: "Diagnosticar o que funciona, o que trava a experiência e o que merece ser preservado.",
  },
  {
    id: "ready",
    label: "Pronto para construir",
    value: "Pronto para construir",
    summary: "execução objetiva",
    description: "Transformar um escopo já claro em interface, desenvolvimento, validação e publicação.",
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
    window.dispatchEvent(new CustomEvent("portfolio:briefing-seed", {
      detail: {
        service: selected.recommendation,
        objective: selected.objective,
        projectType: selected.id === "data"
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
    }));
  }

  return (
    <section id="diagnostico" data-project-diagnostic="true" className="archive-chapter relative overflow-hidden border-y border-white/[0.08] bg-[#061226]">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[0.92fr_1.08fr] lg:px-12">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#a5f3fc]">diagnóstico interativo · 30 segundos</p>
          <h2 className="mt-5 max-w-xl font-display text-[clamp(2.5rem,4.6vw,5.2rem)] font-medium leading-[0.93] tracking-[-0.06em] text-white">
            Qual problema você quer tornar mais simples?
          </h2>
          <p className="mt-6 max-w-xl font-body text-base leading-8 text-[#badbec]">
            Escolha o objetivo e o estágio do projeto. A combinação gera uma rota inicial e prepara o briefing com contexto suficiente para uma conversa profissional.
          </p>

          <div className="mt-8 grid gap-2" role="group" aria-label="Escolha o objetivo principal do projeto">
            {diagnosticPaths.map(({ id, label, Icon }) => {
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
                  className={`group flex min-h-14 items-center gap-4 border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] motion-reduce:transition-none ${active ? "border-[#67e8f9] bg-[#0b2746] shadow-[0_12px_36px_rgba(56,189,248,0.14)]" : "border-white/10 bg-[#07101e]/70 hover:border-[#67e8f9]/50 hover:bg-[#091b30]"}`}
                >
                  <span className={`grid h-10 w-10 shrink-0 place-items-center border transition-colors ${active ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : "border-white/10 text-[#8eb8dd]"}`}>
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1 font-body text-sm font-medium text-[#e8f7ff]">{label}</span>
                  <span className={`font-mono text-[9px] uppercase tracking-[0.12em] ${active ? "text-[#67e8f9]" : "text-[#607a9f]"}`}>{active ? "selecionado" : "explorar"}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-7 border-t border-white/10 pt-6">
            <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#7fa8cc]">em que ponto o projeto está?</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3" role="group" aria-label="Escolha o estágio atual do projeto">
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
                    className={`min-h-12 border px-3 py-3 text-left font-mono text-[9px] uppercase leading-4 tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${active ? "border-[#67e8f9] bg-[#0b2746] text-white" : "border-white/10 bg-[#07101e]/60 text-[#8fa8c7] hover:border-[#67e8f9]/45 hover:text-white"}`}
                  >
                    {stage.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 font-body text-xs leading-5 text-[#88a9bf]">
              <span className="font-mono text-[8px] uppercase tracking-[0.11em] text-[#67e8f9]">{selectedStage.summary}</span>
              {" · "}
              {selectedStage.description}
            </p>
          </div>
        </div>

        <div className="relative self-center border border-[#67e8f9]/30 bg-[#07111f]/90 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-7">
          <div className="pointer-events-none absolute right-5 top-5 h-16 w-16 border-r border-t border-[#67e8f9]/30" aria-hidden="true" />
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">rota sugerida</p>
              <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f8fb7]">PG / PROJECT.LENS</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#67e8f9] shadow-[0_0_16px_rgba(103,232,249,0.9)] motion-safe:animate-pulse" aria-hidden="true" />
          </div>

          <div key={`${selected.id}-${selectedStage.id}`} className="mt-7 animate-[fadeIn_220ms_ease-out] motion-reduce:animate-none" aria-live="polite">
            <div className="flex flex-wrap items-center gap-2">
              <span className="border border-[#67e8f9]/25 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#67e8f9]">{selected.recommendation}</span>
              <span className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-[#9ab7d4]">{selectedStage.summary}</span>
            </div>
            <h3 className="mt-4 font-display text-[clamp(2rem,3.2vw,3.5rem)] font-medium leading-[0.95] tracking-[-0.05em] text-white">{selected.title}</h3>
            <p className="mt-5 max-w-xl font-body text-sm leading-7 text-[#bed9e8]">{selected.objective}</p>

            <div className="mt-7 grid gap-px bg-white/10 sm:grid-cols-3">
              {selected.signal.split(" → ").map((item, index) => (
                <div key={item} className="bg-[#08182a] px-4 py-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#8aa8cc]">0{index + 1}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-[#d8f3ff]">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f8fb7]">entrega provável</p>
                <p className="mt-2 font-body text-sm leading-6 text-[#d8edf6]">{selected.delivery}</p>
              </div>
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#6f8fb7]">prova esperada</p>
                <p className="mt-2 font-body text-sm leading-6 text-[#d8edf6]">{selected.proof}</p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-3 border border-[#67e8f9]/20 bg-[#06172f]/70 p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#67e8f9]" aria-hidden="true" />
              <p className="font-body text-xs leading-5 text-[#9fc4d6]">
                O briefing receberá automaticamente objetivo, público, estágio, formato provável, critério de sucesso e contexto inicial. Você revisa tudo antes do envio.
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
    </section>
  );
}
