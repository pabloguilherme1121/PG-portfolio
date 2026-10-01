import type { BriefingDraft } from "@/features/portfolio/utils/briefingFlow";

type BriefingFieldsProps = {
  briefingDraft: BriefingDraft;
  briefingStep: number;
};

export function BriefingFields({
  briefingDraft,
  briefingStep,
}: BriefingFieldsProps) {
  return (
    <>
      <fieldset
        data-briefing-step="contact"
        tabIndex={-1}
        hidden={briefingStep !== 0}
        className="min-w-0 border border-white/[0.1] bg-[#080f1a]/60 p-4 outline-none sm:p-6"
      >
        <legend className="px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">
          01 · contato
        </legend>
        <div className="grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">
              nome *
            </span>
            <input
              required
              maxLength={160}
              name="name"
              autoComplete="name"
              defaultValue={briefingDraft.name ?? ""}
              placeholder="Como você se chama?"
              className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">
              e-mail *
            </span>
            <input
              required
              maxLength={320}
              type="email"
              name="email"
              autoComplete="email"
              defaultValue={briefingDraft.email ?? ""}
              placeholder="voce@exemplo.com"
              className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]"
            />
          </label>
        </div>
      </fieldset>

      <fieldset
        data-briefing-step="direction"
        tabIndex={-1}
        hidden={briefingStep !== 1}
        className="min-w-0 border border-white/[0.1] bg-[#080f1a]/60 p-4 outline-none sm:p-6"
      >
        <legend className="px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">
          02 · direção
        </legend>
        <div className="grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">
              serviço desejado *
            </span>
            <select
              required
              name="service"
              defaultValue={briefingDraft.service ?? ""}
              className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]"
            >
              <option value="" disabled>
                Selecione um serviço
              </option>
              <option>Site ou landing page</option>
              <option>Dashboard ou produto digital</option>
              <option>Solução combinada</option>
              <option>Outro projeto</option>
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">
              tipo de projeto *
            </span>
            <select
              required
              name="projectType"
              defaultValue={briefingDraft.projectType ?? ""}
              className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]"
            >
              <option value="" disabled>
                Selecione uma opção
              </option>
              <option>Produto ou serviço digital</option>
              <option>Marca ou negócio</option>
              <option>Projeto com dados / dashboard</option>
              <option>Outro</option>
            </select>
          </label>
        </div>
        <label className="mt-7 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">
            objetivo principal *
          </span>
          <textarea
            required
            maxLength={900}
            name="objective"
            rows={3}
            defaultValue={briefingDraft.objective ?? ""}
            placeholder="O que precisa mudar depois que este projeto estiver pronto?"
            className="mt-3 w-full resize-y border-b border-white/15 bg-transparent px-0 py-3 font-body text-base leading-7 text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]"
          />
        </label>
        <div className="mt-7 grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">
              público / quem vai usar *
            </span>
            <input
              required
              maxLength={240}
              name="audience"
              defaultValue={briefingDraft.audience ?? ""}
              placeholder="Ex.: clientes, equipe, moradores, gestores"
              className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">
              estágio atual
            </span>
            <select
              name="stage"
              defaultValue={briefingDraft.stage ?? ""}
              className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]"
            >
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
        <legend className="px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">
          03 · escopo
        </legend>
        <div className="grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">
              local ou alcance *
            </span>
            <input
              required
              maxLength={255}
              name="location"
              defaultValue={briefingDraft.location ?? ""}
              placeholder="Ex.: remoto, Águas Lindas, Brasil"
              className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6]"
            />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">
              data prevista
            </span>
            <input
              type="date"
              name="date"
              defaultValue={briefingDraft.date ?? ""}
              className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-transparent px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] [color-scheme:dark]"
            />
          </label>
        </div>
        <div className="mt-7 grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">
              formato de entrega
            </span>
            <select
              name="delivery"
              defaultValue={briefingDraft.delivery ?? ""}
              className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]"
            >
              <option value="">A definir</option>
              <option>Site responsivo</option>
              <option>Landing page</option>
              <option>Dashboard / interface</option>
              <option>Solução combinada</option>
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">
              prazo / urgência
            </span>
            <select
              name="deadline"
              defaultValue={briefingDraft.deadline ?? ""}
              className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]"
            >
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
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">
            faixa de investimento
          </span>
          <select
            name="budget"
            defaultValue={briefingDraft.budget ?? ""}
            className="mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6]"
          >
            <option value="Preciso de orientação">Preciso de orientação</option>
            <option>Até R$ 1.500</option>
            <option>R$ 1.500 a R$ 3.000</option>
            <option>R$ 3.000 a R$ 6.000</option>
            <option>R$ 6.000 a R$ 12.000</option>
            <option>Acima de R$ 12.000</option>
          </select>
        </label>
      </fieldset>
    </>
  );
}
