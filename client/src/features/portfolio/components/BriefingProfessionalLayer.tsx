type BriefingProfessionalLayerProps = {
  draft: Record<string, string>;
  requirementsHidden: boolean;
  reviewHidden: boolean;
};

const fieldClass = "mt-3 min-h-12 min-w-0 max-w-full w-full border-b border-white/15 bg-[#070a10] px-0 py-3 font-body text-base text-white transition-colors focus:border-[#3b82f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]";
const textareaClass = "mt-3 min-w-0 max-w-full w-full resize-y border-b border-white/15 bg-transparent px-0 py-3 font-body text-sm leading-6 text-white transition-colors placeholder:text-[#4e607d] focus:border-[#3b82f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]";

export default function BriefingProfessionalLayer({
  draft,
  requirementsHidden,
  reviewHidden,
}: BriefingProfessionalLayerProps) {
  return (
    <>
      <fieldset
        data-briefing-step="requirements"
        tabIndex={-1}
        hidden={requirementsHidden}
        className="min-w-0 border border-white/[0.1] bg-[#080f1a]/60 p-4 outline-none sm:p-6"
      >
        <legend className="px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">
          04 · requisitos
        </legend>
        <p className="mb-6 max-w-2xl font-body text-sm leading-6 text-[#9bb9ca]">
          Defina o que já existe e o que a solução precisa considerar. Tudo abaixo é editável e pode ficar em “A definir”.
        </p>

        <div className="grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">conteúdo disponível</span>
            <select name="contentStatus" defaultValue={draft.contentStatus ?? ""} className={fieldClass}>
              <option value="">A definir</option>
              <option>Conteúdo pronto</option>
              <option>Conteúdo parcialmente pronto</option>
              <option>Preciso organizar o conteúdo</option>
              <option>Preciso criar o conteúdo</option>
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">identidade visual</span>
            <select name="visualIdentity" defaultValue={draft.visualIdentity ?? ""} className={fieldClass}>
              <option value="">A definir</option>
              <option>Identidade visual existente</option>
              <option>Identidade parcial / em evolução</option>
              <option>Preciso adaptar uma identidade existente</option>
              <option>Preciso definir a direção visual</option>
            </select>
          </label>
        </div>

        <div className="mt-7 grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">páginas / telas / peças</span>
            <textarea name="pagesScreens" rows={4} maxLength={1200} defaultValue={draft.pagesScreens ?? ""} placeholder="Ex.: home, serviços, contato; dashboard, detalhe e filtros; roteiro, captação e versões." className={textareaClass} />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">funcionalidades essenciais</span>
            <textarea name="features" rows={4} maxLength={1200} defaultValue={draft.features ?? ""} placeholder="Ex.: formulário, busca, filtros, autenticação, mapa, CMS, exportação, animações." className={textareaClass} />
          </label>
        </div>

        <label className="mt-7 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">integrações / ferramentas existentes</span>
          <textarea name="integrations" rows={3} maxLength={1200} defaultValue={draft.integrations ?? ""} placeholder="Ex.: WhatsApp, Analytics, CRM, API, banco de dados, domínio, hospedagem, redes sociais." className={textareaClass} />
        </label>

        <div className="mt-7 grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">prioridade de qualidade</span>
            <select name="qualityPriority" defaultValue={draft.qualityPriority ?? ""} className={fieldClass}>
              <option value="">A definir</option>
              <option>Equilíbrio geral</option>
              <option>Conversão e clareza</option>
              <option>Performance e acessibilidade</option>
              <option>SEO e descoberta</option>
              <option>Dados e mensuração</option>
              <option>Consistência visual</option>
            </select>
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">depois do lançamento</span>
            <select name="postLaunch" defaultValue={draft.postLaunch ?? ""} className={fieldClass}>
              <option value="">A definir</option>
              <option>Entrega pontual</option>
              <option>Suporte e ajustes iniciais</option>
              <option>Manutenção recorrente</option>
              <option>Evolução contínua</option>
              <option>Treinamento / handoff</option>
            </select>
          </label>
        </div>

        <div className="mt-7 grid gap-2 sm:grid-cols-3" aria-label="Critérios considerados no planejamento">
          {["Responsividade", "Acessibilidade", "Performance", "SEO quando aplicável", "Mensuração", "Estados e erros"].map((item) => (
            <span key={item} className="border border-[#67e8f9]/15 bg-[#06172f]/55 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.09em] text-[#9ec7d9]">
              {item}
            </span>
          ))}
        </div>
      </fieldset>

      <fieldset
        data-briefing-step="review"
        tabIndex={-1}
        hidden={reviewHidden}
        className="min-w-0 border border-white/[0.1] bg-[#080f1a]/60 p-4 outline-none sm:p-6"
      >
        <legend className="px-2 font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#67e8f9]">
          05 · contexto e revisão
        </legend>

        <div data-briefing-professional-review="true" className="mb-7 border border-[#67e8f9]/20 bg-[#06172f]/70 p-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">leitura profissional do escopo</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <p className="font-body text-xs leading-5 text-[#b9d6e5]"><strong className="text-white">Conteúdo:</strong> {draft.contentStatus || "A definir"}</p>
            <p className="font-body text-xs leading-5 text-[#b9d6e5]"><strong className="text-white">Identidade:</strong> {draft.visualIdentity || "A definir"}</p>
            <p className="font-body text-xs leading-5 text-[#b9d6e5]"><strong className="text-white">Qualidade:</strong> {draft.qualityPriority || "A definir"}</p>
            <p className="font-body text-xs leading-5 text-[#b9d6e5]"><strong className="text-white">Pós-lançamento:</strong> {draft.postLaunch || "A definir"}</p>
          </div>
          {(draft.pagesScreens || draft.features || draft.integrations) && (
            <div className="mt-4 border-t border-white/10 pt-4">
              {draft.pagesScreens && <p className="font-body text-xs leading-5 text-[#91b6ca]"><strong className="text-[#d9edf7]">Páginas / telas:</strong> {draft.pagesScreens}</p>}
              {draft.features && <p className="mt-2 font-body text-xs leading-5 text-[#91b6ca]"><strong className="text-[#d9edf7]">Funcionalidades:</strong> {draft.features}</p>}
              {draft.integrations && <p className="mt-2 font-body text-xs leading-5 text-[#91b6ca]"><strong className="text-[#d9edf7]">Integrações:</strong> {draft.integrations}</p>}
            </div>
          )}
        </div>

        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">como saberemos que deu certo?</span>
          <textarea maxLength={600} name="success" rows={3} defaultValue={draft.success ?? ""} placeholder="Ex.: mais pedidos de orçamento, informação mais fácil de consultar, lançamento pronto para uso." className={textareaClass} />
        </label>
        <div className="mt-7 grid gap-7 sm:grid-cols-2">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">referências / links</span>
            <textarea maxLength={1000} name="references" rows={3} defaultValue={draft.references ?? ""} placeholder="Sites, perfis, concorrentes ou produtos que ajudam a explicar a direção." className={textareaClass} />
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">restrições / riscos / dependências</span>
            <textarea maxLength={1000} name="constraints" rows={3} defaultValue={draft.constraints ?? ""} placeholder="Ex.: tecnologia obrigatória, aprovação de terceiros, prazo externo, API, domínio, conteúdo pendente." className={textareaClass} />
          </label>
        </div>
        <label className="mt-7 block">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#7892b8]">contexto do projeto *</span>
          <textarea required minLength={12} maxLength={3000} name="briefing" rows={6} defaultValue={draft.briefing ?? ""} placeholder="Explique o cenário atual, o problema, o que já existe, o que não pode faltar e qualquer detalhe que ajude a entender a entrega." className={textareaClass} />
        </label>
      </fieldset>
    </>
  );
}
