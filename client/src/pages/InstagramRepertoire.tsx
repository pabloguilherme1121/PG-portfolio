import { ArrowUpRight, Instagram } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";

const formatFilters = ["todos", "drone", "eventos", "bastidores"] as const;
type FormatFilter = (typeof formatFilters)[number];

const profiles = [
  {
    handle: "@pablogui000",
    label: "arquivo pessoal",
    description: "Bastidores, estudos e registros que ajudam a acompanhar o processo.",
    url: "https://www.instagram.com/pablogui000/",
    cover: "/manus-storage/rham-depoimento-02_c0845a39.jpg",
    position: "object-[center_35%]",
    formats: ["bastidores"],
  },
  {
    handle: "@mpjstoryworks",
    label: "storyworks",
    description: "Projetos audiovisuais, captação e narrativas pensadas para circular.",
    url: "https://www.instagram.com/mpjstoryworks/",
    cover: "/manus-storage/cha-da-eloise-capa_0d17d433.jpg",
    position: "object-center",
    formats: ["eventos", "bastidores"],
  },
  {
    handle: "ver projetos",
    label: "repertório em movimento",
    description: "A seleção completa de trabalhos fica no portfólio; o Instagram mostra o que está acontecendo agora.",
    url: "https://www.instagram.com/mpjstoryworks/",
    cover: "/manus-storage/campo-iluminado-04_665a6d8f.jpg",
    position: "object-[center_58%]",
    formats: ["drone"],
  },
];

export default function InstagramRepertoire() {
  const [activeFormat, setActiveFormat] = useState<FormatFilter>("todos");
  const [isFilterTransitioning, setIsFilterTransitioning] = useState(false);
  const transitionTimerRef = useRef<number | null>(null);
  const feedStatus = trpc.instagramFeed.status.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
  const feedState = feedStatus.isLoading ? "loading" : feedStatus.isError ? "query_error" : (feedStatus.data?.status ?? "error");
  const liveItems = feedStatus.data?.status === "available" ? feedStatus.data.items : [];
  const hasLiveItems = liveItems.length > 0;
  const visibleProfiles = activeFormat === "todos" ? profiles : profiles.filter((profile) => profile.formats.includes(activeFormat));

  useEffect(() => () => {
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
  }, []);

  function selectFormat(format: FormatFilter) {
    if (format === activeFormat || isFilterTransitioning) return;
    if (transitionTimerRef.current) window.clearTimeout(transitionTimerRef.current);
    setIsFilterTransitioning(true);
    transitionTimerRef.current = window.setTimeout(() => {
      setActiveFormat(format);
      transitionTimerRef.current = window.setTimeout(() => setIsFilterTransitioning(false), 40);
    }, 130);
  }

  return (
    <section id="social" className="archive-chapter relative overflow-hidden border-t border-white/[0.07] bg-[#050c18]">
      <div className="blueprint-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="grid gap-8 border-b border-white/[0.1] pb-9 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-20">
          <div>
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#67e8f9]">07 / repertório social</p>
            <h2 className="mt-5 max-w-xl font-display text-[clamp(2.7rem,4.8vw,5.4rem)] font-medium leading-[0.92] tracking-[-0.06em] text-white">O que está em movimento.</h2>
          </div>
          <div>
            <p className="max-w-2xl font-body text-base leading-8 text-[#b9ddec]">Os perfis concentram registros, estudos e projetos audiovisuais. Entre por onde fizer mais sentido e acompanhe as próximas peças diretamente na origem.</p>
            <div className="mt-4 max-w-2xl border-l border-[#67e8f9]/50 pl-3 font-mono text-[9px] uppercase leading-5 tracking-[0.12em] text-[#6e8aa8]" role={feedState === "query_error" || feedState === "error" ? "alert" : "status"} aria-live="polite">
              {feedState === "loading" && "verificando conexão do feed · preparando o repertório visual"}
              {feedState === "query_error" && "feed temporariamente indisponível · os perfis continuam acessíveis pelos links abaixo"}
              {feedState === "credentials_required" && "feed aguardando autorização da Meta · os links reais permanecem ativos enquanto isso"}
              {feedState === "empty" && "feed conectado, mas ainda sem publicações para exibir · acompanhe os perfis na origem"}
              {feedState === "error" && "a fonte do feed retornou um erro · a seleção visual continua disponível como fallback"}
              {feedState === "available" && hasLiveItems && "feed atualizado · publicações recentes carregadas da origem"}
            </div>
          </div>
        </div>

        <div className="mt-8 border-y border-white/[0.1] py-4" role="group" aria-label="Filtrar repertório social por formato">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-[#7899ae]">filtrar por formato</p>
            <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Formatos disponíveis">
              {formatFilters.map((format) => {
                const isActive = activeFormat === format;
                const label = format === "todos" ? "todos" : format;
                return (
                  <button
                    key={format}
                    type="button"
                    onClick={() => selectFormat(format)}
                    aria-busy={isFilterTransitioning}
                    aria-pressed={isActive}
                    className={`border px-3 py-2 font-mono text-[9px] uppercase tracking-[0.12em] transition-all duration-200 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050c18] ${isActive ? "border-[#67e8f9] bg-[#38bdf8] text-[#02111f]" : "border-white/[0.12] bg-transparent text-[#88a6bd] hover:border-[#67e8f9]/60 hover:text-[#dffaff]"}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
          <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-[#5f7e9a] light-muted-ink" role="status" aria-live="polite">{visibleProfiles.length} {visibleProfiles.length === 1 ? "referência" : "referências"} visível{visibleProfiles.length === 1 ? "" : "eis"}</p>
        </div>

        {visibleProfiles.length > 0 ? (
          <div aria-busy={isFilterTransitioning} className={`social-filter-grid mt-4 grid gap-px bg-cyan-100/[0.1] transition-[opacity,transform] duration-200 ${isFilterTransitioning ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"} md:grid-cols-3`}>
          {visibleProfiles.map((profile, index) => (
            <a
              key={`${activeFormat}-${profile.handle}`}
              href={profile.url}
              target="_blank"
              rel="noreferrer"
              style={{ animationDelay: `${index * 45}ms` }}
              className="social-filter-card group relative isolate flex min-h-[310px] flex-col overflow-hidden bg-[#071326] p-5 transition-colors duration-300 hover:bg-[#0a1a31] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a5f3fc] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050c18] sm:p-6"
              aria-label={`${profile.handle}, abrir no Instagram`}
            >
              <img
                src={profile.cover}
                alt=""
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 -z-10 h-full w-full object-cover ${profile.position} opacity-40 saturate-[0.72] transition duration-500 group-hover:scale-105 group-hover:opacity-55`}
              />
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-[#030b1e] via-[#030b1e]/70 to-[#030b1e]/10" />
              <span className="flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#a5f3fc]">{String(index + 1).padStart(2, "0")} / {profile.label}</span>
                <span className="grid h-9 w-9 place-items-center border border-cyan-100/[0.22] bg-[#06172f]/60 text-[#67e8f9] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[#67e8f9] group-hover:bg-[#38bdf8] group-hover:text-[#02111f]"><Instagram className="h-4 w-4" /></span>
              </span>
              <span className="mt-auto block">
                <span className="block font-display text-2xl font-medium tracking-[-0.04em] text-white sm:text-3xl">{profile.handle}</span>
                <span className="mt-3 block max-w-sm font-body text-sm leading-6 text-[#c7e0ec]">{profile.description}</span>
                <span className="mt-6 inline-flex items-center gap-2 border-b border-[#67e8f9]/60 pb-1 font-mono text-[9px] font-semibold uppercase tracking-[0.13em] text-[#dffaff] transition-colors group-hover:border-[#a5f3fc] group-hover:text-[#a5f3fc]">abrir perfil <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span>
              </span>
            </a>
          ))}
          </div>
        ) : (
          <div className="mt-4 border border-dashed border-[#67e8f9]/25 bg-[#06172f]/60 px-5 py-8 text-center" role="status" aria-live="polite">
            <p className="font-mono text-[10px] uppercase tracking-[0.13em] text-[#a5f3fc]">nenhuma referência neste filtro</p>
            <p className="mt-2 font-body text-sm leading-6 text-[#9fc4d4]">Escolha outro formato para continuar explorando o repertório disponível.</p>
          </div>
        )}

        {feedState === "available" && hasLiveItems && (
          <div className="mt-6 border border-[#67e8f9]/20 bg-[#06172f]/70 p-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#a5f3fc]">publicações recentes</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {liveItems.map((item) => (
                <a key={item.id} href={item.permalink} target="_blank" rel="noreferrer" className="border border-white/[0.1] p-3 font-mono text-[10px] text-[#dffaff] hover:border-[#67e8f9]">{item.caption || "Abrir publicação"}</a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 border-l-2 border-[#38bdf8] bg-[#071a35]/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="max-w-3xl font-body text-sm leading-6 text-[#c8e5f0]">A conexão automática depende de uma conta profissional e de autorização Meta. O bloco continua útil enquanto isso: os perfis estão acessíveis, as imagens vêm do arquivo real e nenhum post é simulado.</p>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.12em] text-[#67e8f9] transition-colors hover:text-white">Instagram <ArrowUpRight className="h-3.5 w-3.5" /></a>
        </div>
      </div>
    </section>
  );
}
