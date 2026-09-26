import { Button } from "@/components/ui/button";
import { trackPortfolioEvent } from "@/features/portfolio/utils/portfolioAnalytics";
import { ArrowDown, ArrowUpRight, CheckCircle2, Loader2, Mail, MessageCircle, Send } from "lucide-react";
import type { FormEvent, RefObject } from "react";
import { useRef } from "react";

type PortfolioContactProps = {
  whatsAppUrl: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isQuoteRequestPending: boolean;
  formError: string | null;
  formSent: boolean;
  setFormSent: (sent: boolean) => void;
  successMessageRef: RefObject<HTMLDivElement | null>;
  isStaticDeploy: boolean;
  briefingWhatsAppUrl: string | null;
};

export function PortfolioContact({
  whatsAppUrl,
  handleSubmit,
  isQuoteRequestPending,
  formError,
  formSent,
  setFormSent,
  successMessageRef,
  isStaticDeploy,
  briefingWhatsAppUrl,
}: PortfolioContactProps) {
  const briefingStartedRef = useRef(false);

  function trackBriefingStarted() {
    if (briefingStartedRef.current) return;
    briefingStartedRef.current = true;
    trackPortfolioEvent("briefing_started");
  }

  return (
    <section id="contato" className="archive-chapter relative overflow-hidden bg-[#070a10]">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative mx-auto grid w-full max-w-[1440px] lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-b border-white/[0.08] px-5 py-16 sm:px-8 sm:py-24 lg:border-b-0 lg:border-r lg:px-12 lg:py-28">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77a9fc]">Contato</p>
          <h2 className="mt-6 max-w-xl font-display text-[clamp(3rem,5.3vw,5.6rem)] font-medium leading-[0.92] tracking-[-0.065em] text-white">
            Vamos conversar sobre seu projeto.
          </h2>
          <p className="mt-8 max-w-md font-body text-base leading-8 text-[#c0e3f4]">
            Envie o objetivo, o contexto e o prazo. A partir disso, alinhamos escopo, formato e próximos passos.
          </p>

          <div className="mt-10 grid max-w-md gap-3">
            <a
              href="#contato-briefing"
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#38bdf8] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#02111f] transition-colors hover:bg-[#a5f3fc]"
            >
              enviar briefing <ArrowDown className="h-3.5 w-3.5" />
            </a>
            <a
              href={whatsAppUrl}
              onClick={() => trackPortfolioEvent("whatsapp_click", { source: "contact" })}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#67e8f9]/35 px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.11em] text-[#c9f8ff] transition-colors hover:border-[#67e8f9] hover:bg-[#0b2746]"
            >
              <MessageCircle className="h-4 w-4" /> falar pelo WhatsApp
            </a>
            <a
              href="mailto:mpjcreator@gmail.com"
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-white/15 px-4 font-mono text-[10px] uppercase tracking-[0.11em] text-[#b8cae5] transition-colors hover:border-[#67e8f9] hover:text-white"
            >
              <Mail className="h-4 w-4" /> mpjcreator@gmail.com
            </a>
          </div>

          <div className="mt-8 max-w-md border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#a5f3fc]">como funciona</p>
            <ol className="mt-4 space-y-3 font-body text-sm leading-6 text-[#cbe8f6]">
              <li><span className="mr-2 font-mono text-[#67e8f9]">01</span>Você envia contexto, objetivo e prazo.</li>
              <li><span className="mr-2 font-mono text-[#67e8f9]">02</span>O escopo é organizado de acordo com a necessidade real.</li>
              <li><span className="mr-2 font-mono text-[#67e8f9]">03</span>Você recebe próximos passos e formato de entrega com clareza.</li>
            </ol>
          </div>
        </div>

        <div className="px-5 py-16 sm:px-8 sm:py-24 lg:px-16 lg:py-28">
          <form
            id="contato-briefing"
            aria-busy={isQuoteRequestPending}
            onSubmit={handleSubmit}
            onFocusCapture={trackBriefingStarted}
            className="max-w-xl scroll-mt-24"
          >
            <div className="mb-8 flex items-center justify-between border-b border-white/[0.1] pb-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#b7cbe8]">briefing inicial</p>
              <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-[#637da5]">* obrigatório</p>
            </div>

            <label aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
              <span>Website</span>
              <input tabIndex={-1} autoComplete="off" name="website" defaultValue="" />
            </label>

            <div className="grid gap-7">
              <div className="grid gap-7 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">nome *</span>
                  <input required name="name" autoComplete="name" placeholder="Como você se chama?" className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent py-3 font-body text-base text-white placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">e-mail *</span>
                  <input required type="email" name="email" autoComplete="email" placeholder="voce@exemplo.com" className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent py-3 font-body text-base text-white placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                </label>
              </div>

              <div className="grid gap-7 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">serviço *</span>
                  <select required name="service" defaultValue="" className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] py-3 font-body text-base text-white focus:border-[#3b82f6]">
                    <option value="" disabled>Selecione um serviço</option>
                    <option>Desenvolvimento web</option>
                    <option>Landing page ou portfólio</option>
                    <option>Conteúdo audiovisual</option>
                    <option>Captação aérea e terrestre</option>
                    <option>Projeto combinado</option>
                    <option>Outro</option>
                  </select>
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">tipo de projeto *</span>
                  <select required name="projectType" defaultValue="" className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] py-3 font-body text-base text-white focus:border-[#3b82f6]">
                    <option value="" disabled>Selecione uma opção</option>
                    <option>Site ou landing page</option>
                    <option>Marca ou negócio</option>
                    <option>Produto ou serviço</option>
                    <option>Evento</option>
                    <option>Conteúdo para redes sociais</option>
                    <option>Outro</option>
                  </select>
                </label>
              </div>

              <div className="grid gap-7 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">local *</span>
                  <input required name="location" placeholder="Cidade ou atendimento remoto" className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent py-3 font-body text-base text-white placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">data de início ou evento</span>
                  <input type="date" name="date" className="mt-3 min-h-12 w-full border-b border-white/15 bg-transparent py-3 font-body text-base text-white focus:border-[#3b82f6] [color-scheme:dark]" />
                </label>
              </div>

              <div className="grid gap-7 sm:grid-cols-2">
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">prazo desejado</span>
                  <select name="delivery" defaultValue="" className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] py-3 font-body text-base text-white focus:border-[#3b82f6]">
                    <option value="">A combinar</option>
                    <option>Até 2 semanas</option>
                    <option>2 a 4 semanas</option>
                    <option>1 a 2 meses</option>
                    <option>Mais de 2 meses</option>
                  </select>
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">faixa de investimento</span>
                  <select name="budget" defaultValue="" className="mt-3 min-h-12 w-full border-b border-white/15 bg-[#070a10] py-3 font-body text-base text-white focus:border-[#3b82f6]">
                    <option value="">Prefiro conversar</option>
                    <option>Até R$ 500</option>
                    <option>R$ 500 a R$ 1.000</option>
                    <option>R$ 1.000 a R$ 2.000</option>
                    <option>Acima de R$ 2.000</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">objetivo e contexto *</span>
                <textarea required name="briefing" rows={5} placeholder="Conte o que precisa ser construído ou produzido, para quem e qual resultado espera." className="mt-3 w-full resize-none border-b border-white/15 bg-transparent py-3 font-body text-base leading-7 text-white placeholder:text-[#4e607d] focus:border-[#3b82f6]" />
              </label>
            </div>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button
                data-briefing-submit="true"
                disabled={isQuoteRequestPending}
                type="submit"
                className="min-h-12 w-full justify-center rounded-none bg-[#38bdf8] px-5 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[#02111f] transition-colors hover:bg-[#a5f3fc] disabled:cursor-wait disabled:opacity-70 sm:w-fit"
              >
                {isQuoteRequestPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> enviando</>
                ) : (
                  <>enviar briefing <Send className="h-4 w-4" /></>
                )}
              </Button>
              <p className="font-mono text-[9px] uppercase tracking-[0.11em] text-[#647a9f]">
                {isStaticDeploy ? "a mensagem será preparada para o WhatsApp" : "seus dados ficam apenas neste pedido"}
              </p>
            </div>

            {formError && (
              <p role="alert" className="mt-6 border-l-2 border-rose-400 bg-rose-400/10 px-4 py-3 font-body text-sm text-rose-100">
                {formError}
              </p>
            )}

            {formSent && (
              <div ref={successMessageRef} tabIndex={-1} role="status" aria-live="polite" className="quote-success mt-7 border border-[#3b82f6]/45 bg-[#0a1730] p-5">
                <div className="flex gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center bg-[#3b82f6] text-white">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a5f3fc]">
                      {isStaticDeploy ? "mensagem preparada" : "briefing recebido"}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-medium tracking-[-0.04em] text-white">
                      {isStaticDeploy ? "Revise e envie pelo WhatsApp." : "Seu pedido foi registrado."}
                    </h3>
                    <p className="mt-2 max-w-lg font-body text-sm leading-6 text-[#d2edf8]">
                      {isStaticDeploy
                        ? "Nenhum dado foi enviado automaticamente pelo site. Abra a mensagem preparada, revise e toque em enviar no WhatsApp."
                        : "As informações foram recebidas e serão usadas apenas para retornar sobre este pedido."}
                    </p>
                    {isStaticDeploy && briefingWhatsAppUrl && (
                      <a
                        href={briefingWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex min-h-11 items-center gap-2 border-b border-[#3b82f6] font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a5f3fc]"
                      >
                        abrir mensagem no WhatsApp <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setFormSent(false)}
                      className="mt-4 block min-h-11 font-mono text-[9px] uppercase tracking-[0.12em] text-[#e4efff] underline decoration-[#3b82f6]/60 underline-offset-4"
                    >
                      editar briefing
                    </button>
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
