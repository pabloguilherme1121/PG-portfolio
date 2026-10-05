import { Button } from "@/components/ui/button";
import { briefingSteps, type BriefingSeed } from "@/features/portfolio/utils/briefingFlow";
import { useBriefingFlow } from "@/features/portfolio/hooks/useBriefingFlow";
import { PortfolioContactIntro } from "@/features/portfolio/components/PortfolioContactIntro";
import {
  PortfolioAvailabilityConsultation,
  type BlockedDate,
} from "@/features/portfolio/components/PortfolioAvailabilityConsultation";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RotateCcw,
  Send,
  ShieldCheck,
} from "lucide-react";
import type { FormEvent, RefObject } from "react";
import { lazy, Suspense } from "react";

const BriefingProfessionalLayer = lazy(
  () => import("@/features/portfolio/components/BriefingProfessionalLayer"),
);

type PortfolioContactProps = {
  whatsAppUrl: string;
  telegramUrl: string;
  blockedDates: BlockedDate[];
  isBlockedDatesError: boolean;
  refetchBlockedDates: () => void | Promise<unknown>;
  availabilitySectionRef: RefObject<HTMLDivElement | null>;
  contextTransitionTarget: "saved" | "agenda" | null;
  navigateSavedAgendaContext: (target: "saved" | "agenda") => void;
  contextNavigationStatus: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isQuoteRequestPending: boolean;
  formError: string | null;
  formSent: boolean;
  setFormSent: (sent: boolean) => void;
  successMessageRef: RefObject<HTMLDivElement | null>;
  isStaticDeploy: boolean;
  briefingWhatsAppUrl: string | null;
  onBriefingFocusChange: (focused: boolean) => void;
  embedded?: boolean;
  initialBriefingSeed?: BriefingSeed | null;
};

export function PortfolioContact({
  whatsAppUrl,
  telegramUrl,
  blockedDates,
  isBlockedDatesError,
  refetchBlockedDates,
  availabilitySectionRef,
  contextTransitionTarget,
  navigateSavedAgendaContext,
  contextNavigationStatus,
  handleSubmit,
  isQuoteRequestPending,
  formError,
  formSent,
  setFormSent,
  successMessageRef,
  isStaticDeploy,
  briefingWhatsAppUrl,
  onBriefingFocusChange,
  embedded = false,
  initialBriefingSeed = null,
}: PortfolioContactProps) {
  const {
    briefingDraft,
    briefingFormRef,
    briefingProgress,
    briefingRevision,
    briefingStatus,
    briefingStep,
    captureBriefingDraft,
    clearBriefingDraft,
    moveBriefingStep,
    trackBriefingStarted,
  } = useBriefingFlow({ initialBriefingSeed, setFormSent });

  const hasProfessionalBriefingDraft = [
    "contentStatus",
    "visualIdentity",
    "pagesScreens",
    "features",
    "integrations",
    "qualityPriority",
    "postLaunch",
    "success",
    "references",
    "constraints",
    "briefing",
  ].some((field) => briefingDraft[field]?.trim());
  const shouldLoadProfessionalLayer = briefingStep >= 3 || hasProfessionalBriefingDraft;

  return (
    <section id={embedded ? undefined : "contato"} className="archive-chapter relative overflow-hidden bg-[#070a10]">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid w-full min-w-0 max-w-[1440px] lg:grid-cols-[1fr_1.12fr]">
        <div className="min-w-0 border-b border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24 lg:border-b-0 lg:border-r lg:px-12 lg:py-28">
          <PortfolioContactIntro whatsAppUrl={whatsAppUrl} telegramUrl={telegramUrl} />
          <PortfolioAvailabilityConsultation
            blockedDates={blockedDates}
            isBlockedDatesError={isBlockedDatesError}
            refetchBlockedDates={refetchBlockedDates}
            availabilitySectionRef={availabilitySectionRef}
            contextTransitionTarget={contextTransitionTarget}
            navigateSavedAgendaContext={navigateSavedAgendaContext}
            contextNavigationStatus={contextNavigationStatus}
            isStaticDeploy={isStaticDeploy}
          />
          <div className="mt-7 max-w-md border-l-2 border-[#38bdf8] bg-[#071a35]/70 px-5 py-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">depois do seu briefing</p>
            <ol className="mt-4 space-y-3 font-body text-sm leading-6 text-[#cbe8f6]">
              <li><span className="mr-2 font-mono text-[#67e8f9]">01</span>O contexto é organizado para definir o que realmente precisa ser produzido.</li>
              <li><span className="mr-2 font-mono text-[#67e8f9]">02</span>Formato, data e detalhes são alinhados com transparência.</li>
              <li><span className="mr-2 font-mono text-[#67e8f9]">03</span>A proposta chega com escopo, entrega e próximos passos claros.</li>
            </ol>
          </div>
        </div>

        <div className="min-w-0 px-4 py-14 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
          <form
            data-briefing-form="true"
            key={briefingRevision}
            ref={briefingFormRef}
            id="contato-briefing"
            aria-busy={isQuoteRequestPending}
            onSubmit={handleSubmit}
            onChangeCapture={(event) => captureBriefingDraft(event.currentTarget)}
            onFocusCapture={() => { onBriefingFocusChange(true); trackBriefingStarted(); }}
            onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onBriefingFocusChange(false); }}
            className="w-full min-w-0 max-w-2xl scroll-mt-24"
          >
            <div data-briefing-header="true" className="mb-6 min-w-0 border border-[#67e8f9]/20 bg-[#07182a]/80 p-3.5 sm:mb-8 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[#67e8f9]">briefing studio · contexto antes do orçamento</p>
                  <h3 className="mt-2 font-display text-[1.35rem] font-medium leading-tight tracking-[-0.04em] text-white sm:text-2xl">Transforme contexto em um briefing pronto para avançar.</h3>
                </div>
                <div className="sm:text-right">
                  <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#7892b8]">qualidade do contexto</p>
                  <p data-briefing-progress="true" aria-live="polite" className="mt-1 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#a5f3fc]">{briefingProgress}% · {briefingStatus}</p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#7fa2b6]">etapa {briefingStep + 1} de {briefingSteps.length} · {briefingSteps[briefingStep].label}</p>
                </div>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden bg-white/10" aria-hidden="true">
                <span className="block h-full origin-left bg-[#38bdf8] transition-transform duration-300 motion-reduce:transition-none" style={{ transform: `scaleX(${briefingProgress / 100})` }} />
              </div>
              <ol className="mt-5 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-5" aria-label="Etapas do briefing">
                {briefingSteps.map((step, index) => {
                  const active = index === briefingStep;
                  const completed = index < briefingStep;
                  return (
                    <li
                      key={step.id}
                      aria-current={active ? "step" : undefined}
                      className={`min-w-0 bg-[#07111f] px-2.5 py-2.5 sm:px-3 sm:py-3 ${active ? "ring-1 ring-inset ring-[#67e8f9]" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-mono text-[8px] uppercase tracking-[0.12em] ${active || completed ? "text-[#67e8f9]" : "text-[#5f7695]"}`}>
                          0{index + 1}
                        </span>
                        {completed && <CheckCircle2 className="h-3.5 w-3.5 text-[#67e8f9]" aria-hidden="true" />}
                      </div>
                      <p className={`mt-2 font-mono text-[8px] font-semibold uppercase tracking-[0.09em] ${active ? "text-white" : "text-[#9bb4cf]"}`}>{step.label}</p>
                    </li>
                  );
                })}
              </ol>
              <div className="mt-4 flex items-start gap-3 border-t border-white/10 pt-4">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#67e8f9]" aria-hidden="true" />
                <p className="font-body text-xs leading-5 text-[#8fb6c9]">O rascunho é salvo apenas neste dispositivo para você não perder o preenchimento. Nada é enviado enquanto você não concluir a ação final.</p>
              </div>
            </div>
<label aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
              <span>Website</span>
              <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
            </label>

            <div data-briefing-studio="true" className="grid min-w-0 gap-7">
              <fieldset
                data-briefing-step="contact"
                tabIndex={-1}
                hidden={briefingStep !== 0}
                className="min-w-0 border border-white/[0.1] bg-[#080f1a]/60 p-4 outline-none sm:p-6"
              >
                <legend className="px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">01 · contato</legend>
                <div className="grid gap-7 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">nome *</span>
                    <input required maxLength={160} name="name" autoComplete="name" defaultValue={briefingDraft.name ?? ""} placeholder="Como você se chama?" className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">e-mail *</span>
                    <input required maxLength={320} type="email" name="email" autoComplete="email" defaultValue={briefingDraft.email ?? ""} placeholder="voce@exemplo.com" className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                </div>
              </fieldset>

              <fieldset
                data-briefing-step="direction"
                tabIndex={-1}
                hidden={briefingStep !== 1}
                className="min-w-0 border border-white/[0.1] bg-[#080f1a]/60 p-4 outline-none sm:p-6"
              >
                <legend className="px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">02 · direção</legend>
                <div className="grid gap-7 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">serviço desejado *</span>
                    <select required name="service" defaultValue={briefingDraft.service ?? ""} className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                      <option value="" disabled>Selecione um serviço</option>
                      <option>Site ou landing page</option>
                      <option>Dashboard ou produto digital</option>
                      <option>Solução combinada</option>
                      <option>Outro projeto</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">tipo de projeto *</span>
                    <select required name="projectType" defaultValue={briefingDraft.projectType ?? ""} className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                      <option value="" disabled>Selecione uma opção</option>
                      <option>Produto ou serviço digital</option>
                      <option>Marca ou negócio</option>
                      <option>Projeto com dados / dashboard</option>
                      <option>Outro</option>
                    </select>
                  </label>
                </div>
                <label className="mt-7 block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">objetivo principal *</span>
                  <textarea required maxLength={900} name="objective" rows={3} defaultValue={briefingDraft.objective ?? ""} placeholder="O que precisa mudar depois que este projeto estiver pronto?" className="mt-3 w-full resize-y border-b border-white/15 bg-transparent px-0 py-3 font-body text-base leading-7 text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                </label>
                <div className="mt-7 grid gap-7 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">público / quem vai usar *</span>
                    <input required maxLength={240} name="audience" defaultValue={briefingDraft.audience ?? ""} placeholder="Ex.: clientes, equipe, moradores, gestores" className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">estágio atual</span>
                    <select name="stage" defaultValue={briefingDraft.stage ?? ""} className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                      <option value="">A definir</option>
                      <option>Ideia inicial</option>
                      <option>Já existe e precisa evoluir</option>
                      <option>Redesign / reorganização</option>
                      <option>Escopo já definido</option>
                      <option>Pronto para construir</option>
                    </select>
                  </label>
                </div>
              </fieldset>

              <fieldset
                data-briefing-step="scope"
                tabIndex={-1}
                hidden={briefingStep !== 2}
                className="min-w-0 border border-white/[0.1] bg-[#080f1a]/60 p-4 outline-none sm:p-6"
              >
                <legend className="px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">03 · escopo</legend>
                <div className="grid gap-7 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">local ou alcance *</span>
                    <input required maxLength={255} name="location" defaultValue={briefingDraft.location ?? ""} placeholder="Ex.: remoto, Águas Lindas, Brasil" className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">data prevista</span>
                    <input type="date" name="date" defaultValue={briefingDraft.date ?? ""} className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] [color-scheme:dark]" />
                  </label>
                </div>
                <div className="mt-7 grid gap-7 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">formato de entrega</span>
                    <select name="delivery" defaultValue={briefingDraft.delivery ?? ""} className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                      <option value="">A definir</option>
                      <option>Site responsivo</option>
                      <option>Landing page</option>
                      <option>Dashboard / interface</option>
                      <option>Solução combinada</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">prazo / urgência</span>
                    <select name="deadline" defaultValue={briefingDraft.deadline ?? ""} className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                      <option value="">A definir</option>
                      <option>Sem urgência</option>
                      <option>Até 2 semanas</option>
                      <option>2 a 4 semanas</option>
                      <option>1 a 2 meses</option>
                      <option>Mais de 2 meses</option>
                    </select>
                  </label>
                </div>
                <label className="mt-7 block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">faixa de investimento</span>
                  <select name="budget" defaultValue={briefingDraft.budget ?? ""} className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]">
                    <option value="Preciso de orientação">Preciso de orientação</option>
                    <option>Até R$ 1.500</option>
                    <option>R$ 1.500 a R$ 3.000</option>
                    <option>R$ 3.000 a R$ 6.000</option>
                    <option>R$ 6.000 a R$ 12.000</option>
                    <option>Acima de R$ 12.000</option>
                  </select>
                </label>
              </fieldset>

              {shouldLoadProfessionalLayer && (
                <Suspense
                  fallback={
                    <div
                      data-briefing-professional-loading="true"
                      role="status"
                      aria-live="polite"
                      className="border border-white/[0.1] bg-[#080f1a]/60 p-6 font-mono text-[9px] uppercase tracking-[0.12em] text-[#9bb9ca]"
                    >
                      carregando requisitos do briefing…
                    </div>
                  }
                >
                  <BriefingProfessionalLayer
                    draft={briefingDraft}
                    requirementsHidden={briefingStep !== 3}
                    reviewHidden={briefingStep !== 4}
                  />
                </Suspense>
              )}
            
              <div className="grid gap-3 border border-white/10 bg-[#07111f]/85 p-3.5 sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:p-4">
                <button
                  type="button"
                  onClick={() => moveBriefingStep(briefingStep - 1)}
                  disabled={briefingStep === 0}
                  className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/10 px-4 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-[#a8c5d8] transition-colors hover:border-[#67e8f9]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] disabled:cursor-not-allowed disabled:opacity-35 sm:justify-self-start"
                  aria-label={briefingStep > 0 ? `Voltar para ${briefingSteps[briefingStep - 1].label}` : "Primeira etapa do briefing"}
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  {briefingStep > 0 ? `voltar: ${briefingSteps[briefingStep - 1].label}` : "início"}
                </button>

                <div className="text-center">
                  <p className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#67e8f9]">etapa {briefingStep + 1} de {briefingSteps.length}</p>
                  <p className="mt-1 font-body text-xs leading-5 text-[#86a8bc]">{briefingSteps[briefingStep].description}</p>
                </div>

                {briefingStep < briefingSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => moveBriefingStep(briefingStep + 1)}
                    className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#123b67] px-4 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#18508c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] sm:justify-self-end"
                    aria-label={`Continuar para ${briefingSteps[briefingStep + 1].label}`}
                  >
                    continuar: {briefingSteps[briefingStep + 1].label}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <span className="hidden sm:block" aria-hidden="true" />
                )}
              </div>

            </div>

            <aside data-briefing-summary="true" className="mt-7 border border-[#67e8f9]/25 bg-[#06172f]/80 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#67e8f9]" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">resumo ao vivo</p>
                  <p className="mt-2 font-body text-sm leading-6 text-[#cbe8f6]">
                    {briefingDraft.service || "Serviço ainda não definido"} · {briefingDraft.projectType || "tipo de projeto a definir"}
                  </p>
                  {briefingDraft.objective && <p className="mt-2 line-clamp-3 font-body text-xs leading-5 text-[#91b6ca]">{briefingDraft.objective}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {briefingDraft.stage && <span className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#a5c8dd]">{briefingDraft.stage}</span>}
                    {briefingDraft.deadline && <span className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#a5c8dd]">{briefingDraft.deadline}</span>}
                    {briefingDraft.budget && <span className="border border-white/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#a5c8dd]">{briefingDraft.budget}</span>}
                  </div>
                </div>
              </div>
            </aside>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button data-briefing-submit="true" disabled={isQuoteRequestPending || briefingStep !== briefingSteps.length - 1} type="submit" className="min-h-12 w-full justify-center whitespace-normal rounded-none bg-[#38bdf8] px-4 py-3.5 text-center font-mono text-[10px] font-semibold uppercase leading-5 tracking-[0.1em] min-[360px]:px-5 min-[360px]:text-[11px] min-[360px]:tracking-[0.13em] text-[#02111f] transition-all hover:-translate-y-0.5 hover:bg-[#a5f3fc] hover:shadow-[0_12px_30px_rgba(56,189,248,0.30)] active:scale-[0.97] disabled:cursor-wait disabled:opacity-70 sm:w-fit">
                {isQuoteRequestPending ? <><Loader2 className="h-4 w-4 animate-spin" /> enviando pedido</> : <>quero conversar sobre o projeto <Send className="h-4 w-4" /></>}
              </Button>
              <button type="button" onClick={clearBriefingDraft} className="inline-flex min-h-11 items-center justify-center gap-2 border border-white/10 px-4 font-mono text-[9px] uppercase tracking-[0.11em] text-[#8fa9c6] transition-colors hover:border-[#67e8f9]/50 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> limpar rascunho
              </button>
            </div>
            <p className="mt-4 font-mono text-[9px] uppercase leading-5 tracking-[0.11em] text-[#647a9f] light-muted-ink">{isStaticDeploy ? "o site prepara a mensagem; você revisa e confirma o envio no WhatsApp" : "seus dados são usados apenas para analisar este pedido"}</p>

            {formError && <p role="alert" className="mt-6 border-l-2 border-rose-400 bg-rose-400/10 px-4 py-3 font-body text-sm text-rose-100">{formError}</p>}
            {formSent && (
              <div ref={successMessageRef} tabIndex={-1} role="status" aria-live="polite" className="quote-success mt-7 border border-[#3b82f6]/45 bg-[#0a1730] p-5">
                <div className="flex gap-4">
                  <span className="quote-success-icon grid h-11 w-11 shrink-0 place-items-center border border-[#3b82f6] bg-[#3b82f6] text-white"><CheckCircle2 className="h-5 w-5" /></span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a5f3fc]">{isStaticDeploy ? "mensagem preparada" : "briefing recebido"}</p>
                    <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">{isStaticDeploy ? "Revise a mensagem antes de enviar." : "Tudo certo: seu pedido chegou."}</h3>
                    <p className="mt-2 max-w-lg font-body text-sm leading-6 text-[#d2edf8]">{isStaticDeploy ? "O briefing foi organizado em uma mensagem para o WhatsApp. Você mantém o controle e confirma o envio manualmente." : "As informações foram registradas para análise de escopo e próximos passos."}</p>
                    {isStaticDeploy && briefingWhatsAppUrl && <a href={briefingWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 border-b border-[#3b82f6] font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a5f3fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">abrir mensagem no WhatsApp <ArrowUpRight className="h-4 w-4" /></a>}
                    <button type="button" onClick={() => setFormSent(false)} className="mt-4 inline-flex items-center gap-2 border-b border-[#3b82f6] pb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#e4efff] transition-colors hover:text-[#77a9fc]">continuar editando <ArrowUpRight className="h-3 w-3" /></button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
