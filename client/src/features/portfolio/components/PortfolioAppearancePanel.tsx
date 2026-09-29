import { Copy, Eye, LayoutGrid, List, Monitor, Moon, Pencil, Save, Sun, Trash2, X } from "lucide-react";
import type { CSSProperties, Dispatch, SetStateAction } from "react";
import type { ThemePreference } from "@/contexts/ThemeContext";
import { repositories, type ManualOrderProfile } from "@/features/portfolio/portfolioData";

type GalleryView = "grid" | "list";

type PortfolioAppearancePanelProps = {
  theme: "light" | "dark";
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  fontScale: number;
  setFontScale: Dispatch<SetStateAction<number>>;
  galleryView: GalleryView;
  setGalleryView: Dispatch<SetStateAction<GalleryView>>;
  activeOrderProfileId: string | null;
  activeOrderProfile?: ManualOrderProfile;
  manualOrderProfiles: ManualOrderProfile[];
  recentlyActivatedOrderProfileId: string | null;
  previewOrderProfileId: string | null;
  profileNameDraft: string;
  setProfileNameDraft: Dispatch<SetStateAction<string>>;
  selectOrderProfile: (profile: ManualOrderProfile) => void;
  toggleOrderProfilePreview: (profileId: string) => void;
  duplicateOrderProfile: (profile: ManualOrderProfile) => void;
  deleteActiveOrderProfile: () => void;
  createOrderProfile: () => void;
  renameActiveOrderProfile: () => void;
  onClose: () => void;
};

export default function PortfolioAppearancePanel({
  theme,
  preference,
  setPreference,
  fontScale,
  setFontScale,
  galleryView,
  setGalleryView,
  activeOrderProfileId,
  activeOrderProfile,
  manualOrderProfiles,
  recentlyActivatedOrderProfileId,
  previewOrderProfileId,
  profileNameDraft,
  setProfileNameDraft,
  selectOrderProfile,
  toggleOrderProfilePreview,
  duplicateOrderProfile,
  deleteActiveOrderProfile,
  createOrderProfile,
  renameActiveOrderProfile,
  onClose,
}: PortfolioAppearancePanelProps) {
  return (
    <div
      data-appearance-panel="true"
      role="dialog"
      aria-modal="false"
      aria-labelledby="appearance-title"
      className="appearance-panel fixed right-4 top-[88px] z-[60] w-[min(92vw,340px)] border border-[#67e8f9]/30 bg-[#071326] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.42)] sm:right-8 lg:right-12"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#67e8f9]">configurações</p>
          <h2 id="appearance-title" className="mt-2 font-display text-2xl tracking-[-0.04em] text-white">Aparência</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar configurações de aparência"
          className="grid h-8 w-8 place-items-center border border-white/15 text-[#b7cdf1] transition-colors hover:border-[#67e8f9] hover:text-[#67e8f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <p className="mt-3 font-body text-xs leading-5 text-[#9fb2ce]">Escolha como o arquivo deve aparecer neste dispositivo.</p>

      <div className="mt-5 grid gap-2" role="group" aria-label="Preferência de tema">
        {([
          ["light", "Claro", Sun],
          ["dark", "Escuro", Moon],
          ["system", "Preferência do sistema", Monitor],
        ] as const).map(([value, label, Icon]) => (
          <button
            key={value}
            type="button"
            onClick={() => setPreference(value)}
            aria-pressed={preference === value}
            className={`flex items-center gap-3 border px-3 py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${preference === value ? "border-[#67e8f9] bg-[#0b2746] text-[#d9fbff]" : "border-white/10 text-[#9fb2ce] hover:border-[#67e8f9]/60 hover:text-[#d9fbff]"}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            <span className="flex-1">{label}</span>
            {preference === value && <span className="text-[8px] text-[#67e8f9]">ativo</span>}
          </button>
        ))}
      </div>

      <div className="mt-5 border-t border-white/10 pt-4" role="group" aria-label="Tamanho da fonte">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">tamanho do texto</p>
          <span className="font-mono text-[9px] text-[#9fb2ce]">{Math.round(fontScale * 100)}%</span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <button type="button" onClick={() => setFontScale(value => Math.max(0.92, Number((value - 0.04).toFixed(2))))} disabled={fontScale <= 0.92} aria-label="Diminuir tamanho da fonte" className="border border-white/10 px-2 py-3 font-mono text-xs text-[#d9fbff] transition-colors hover:border-[#67e8f9] disabled:opacity-40">A−</button>
          <button type="button" onClick={() => setFontScale(1)} aria-label="Restaurar tamanho padrão da fonte" className="border border-white/10 px-2 py-3 font-mono text-xs text-[#d9fbff] transition-colors hover:border-[#67e8f9]">100%</button>
          <button type="button" onClick={() => setFontScale(value => Math.min(1.16, Number((value + 0.04).toFixed(2))))} disabled={fontScale >= 1.16} aria-label="Aumentar tamanho da fonte" className="border border-white/10 px-2 py-3 font-mono text-xs text-[#d9fbff] transition-colors hover:border-[#67e8f9] disabled:opacity-40">A+</button>
        </div>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4" role="group" aria-label="Visualização dos projetos">
        <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">visualização dos projetos</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {([
            ["grid", "Grade", LayoutGrid],
            ["list", "Lista", List],
          ] as const).map(([value, label, Icon]) => (
            <button
              key={value}
              type="button"
              onClick={() => setGalleryView(value)}
              aria-pressed={galleryView === value}
              className={`flex items-center justify-center gap-2 border px-2 py-3 font-mono text-[10px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${galleryView === value ? "border-[#67e8f9] bg-[#0b2746] text-[#d9fbff]" : "border-white/10 text-[#9fb2ce] hover:border-[#67e8f9]/60 hover:text-[#d9fbff]"}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-white/10 pt-4" role="group" aria-label="Perfis de ordenação">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#67e8f9]">perfis de ordem</p>
          {activeOrderProfileId && <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-[#67e8f9]">ativo</span>}
        </div>
        <p className="mt-2 font-body text-xs leading-5 text-[#9fb2ce]">Salve uma sequência para alternar entre diferentes contextos técnicos.</p>

        <div className="mt-3 space-y-2">
          {manualOrderProfiles.length > 0 ? manualOrderProfiles.map(profile => (
            <div key={profile.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => selectOrderProfile(profile)}
                aria-pressed={activeOrderProfileId === profile.id}
                data-profile-recently-activated={recentlyActivatedOrderProfileId === profile.id ? "true" : undefined}
                className={`min-w-0 flex-1 truncate border px-3 py-2 text-left font-mono text-[9px] uppercase tracking-[0.1em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${recentlyActivatedOrderProfileId === profile.id ? "profile-activation-pulse border-[#fbbf24] bg-[#17304d] text-[#fff7cc] shadow-[0_0_24px_rgba(251,191,36,0.3)]" : activeOrderProfileId === profile.id ? "border-[#67e8f9] bg-[#0b2746] text-[#d9fbff]" : "border-white/10 text-[#9fb2ce] hover:border-[#67e8f9]/60 hover:text-[#d9fbff]"}`}
              >
                <span>{profile.name}</span>
                {profile.preset && <span className="ml-2 text-[8px] text-[#67e8f9]">base</span>}
              </button>

              <button type="button" onClick={() => toggleOrderProfilePreview(profile.id)} aria-expanded={previewOrderProfileId === profile.id} aria-controls={`order-profile-preview-${profile.id}`} aria-label={`${previewOrderProfileId === profile.id ? "Ocultar" : "Ver"} prévia do perfil ${profile.name}`} title="Ver prévia" className={`grid h-9 w-9 shrink-0 place-items-center border text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] ${previewOrderProfileId === profile.id ? "border-[#67e8f9] bg-[#0b2746]" : "border-[#67e8f9]/30"}`}>
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => duplicateOrderProfile(profile)} aria-label={`Duplicar perfil ${profile.name}`} title="Duplicar perfil" className="grid h-9 w-9 shrink-0 place-items-center border border-[#67e8f9]/30 text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              {activeOrderProfileId === profile.id && !profile.preset && (
                <button type="button" onClick={deleteActiveOrderProfile} aria-label={`Excluir perfil ${profile.name}`} title="Excluir perfil" className="grid h-9 w-9 shrink-0 place-items-center border border-rose-300/30 text-rose-200 transition-colors hover:border-rose-300 hover:text-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}

              <div
                id={`order-profile-preview-${profile.id}`}
                role="region"
                tabIndex={previewOrderProfileId === profile.id ? 0 : -1}
                aria-label={`Prévia do perfil ${profile.name}. Clique para ativar esta ordem.`}
                aria-hidden={previewOrderProfileId !== profile.id}
                data-preview-open={previewOrderProfileId === profile.id}
                onClick={() => {
                  if (previewOrderProfileId === profile.id && activeOrderProfileId !== profile.id) selectOrderProfile(profile);
                }}
                onKeyDown={event => {
                  if (previewOrderProfileId === profile.id && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    if (activeOrderProfileId !== profile.id) selectOrderProfile(profile);
                  }
                }}
                className={`col-span-full cursor-pointer overflow-hidden border border-[#67e8f9]/20 bg-[#07101e]/70 p-2 transition-[max-height,opacity,transform] duration-200 ease-out motion-reduce:transform-none motion-reduce:transition-none ${previewOrderProfileId === profile.id ? "max-h-[500px] translate-y-0 opacity-100" : "pointer-events-none max-h-0 -translate-y-1 border-transparent p-0 opacity-0"}`}
              >
                <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#67e8f9]">primeiros projetos nesta ordem · clique para ativar</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                  {profile.order.slice(0, 5).map((projectId, previewIndex) => {
                    const project = repositories.find(repository => repository.id === projectId);
                    return project ? (
                      <div
                        key={project.id}
                        className={`group relative min-w-0 border border-white/10 bg-[#0a1422] ${previewIndex >= 3 ? "hidden sm:block" : ""} ${previewOrderProfileId === profile.id ? "preview-stagger-item" : ""}`}
                        style={{ "--preview-delay": `${previewIndex * 45}ms` } as CSSProperties}
                        title={`${previewIndex + 1}. ${project.name}`}
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-[#0d1b2d]">
                          {project.cover ? <img src={project.cover} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-80" /> : <div className="grid h-full place-items-center font-mono text-[8px] text-[#7189ae]">sem capa</div>}
                        </div>
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 bg-[#030b1e]/92 px-2 py-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                          <p className="truncate font-mono text-[8px] uppercase tracking-[0.08em] text-[#fef3c7]">{project.name}</p>
                        </div>
                        <p className="truncate px-2 py-2 font-mono text-[8px] uppercase tracking-[0.08em] text-[#c8f7ff]">{project.name}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          )) : (
            <p className="border border-dashed border-white/10 px-3 py-3 font-mono text-[9px] uppercase tracking-[0.1em] text-[#7189ae]">nenhum perfil salvo</p>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <input value={profileNameDraft} onChange={event => setProfileNameDraft(event.target.value)} placeholder="ex.: tecnologia" aria-label="Nome do perfil de ordenação" className="min-w-0 flex-1 border border-white/10 bg-transparent px-3 py-2 font-mono text-[9px] uppercase tracking-[0.1em] text-[#d9fbff] outline-none placeholder:text-[#7189ae] focus:border-[#67e8f9] focus:ring-2 focus:ring-[#a5f3fc]" />
          <button type="button" onClick={createOrderProfile} disabled={!profileNameDraft.trim()} aria-label="Salvar novo perfil de ordenação" title="Salvar novo perfil" className="grid h-9 w-9 shrink-0 place-items-center border border-[#67e8f9]/40 text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          {activeOrderProfileId && !activeOrderProfile?.preset && (
            <button type="button" onClick={renameActiveOrderProfile} disabled={!profileNameDraft.trim()} aria-label="Renomear perfil ativo" title="Renomear perfil ativo" className="grid h-9 w-9 shrink-0 place-items-center border border-[#67e8f9]/30 text-[#c8f7ff] transition-colors hover:border-[#67e8f9] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc]">
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 border-t border-white/10 pt-4 font-mono text-[9px] uppercase tracking-[0.11em] text-[#7189ae]">tema aplicado agora: {theme === "dark" ? "escuro" : "claro"}</p>
    </div>
  );
}
