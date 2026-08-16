import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout, { type DashboardNavigationItem } from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { portfolioCatalogById } from "@/lib/portfolioCatalog";
import { ArrowLeft, Download, GripVertical, ShieldCheck, Cloud, CloudOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const FAVORITES_KEY = "pablo-portfolio-favorites";
const ORDER_KEY = "pablo-portfolio-favorite-order";
const navigation: DashboardNavigationItem[] = [{ icon: ShieldCheck, label: "Favoritos", path: "/favoritos" }];

function readIds(key: string) {
  if (typeof window === "undefined") return [] as string[];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : [];
  } catch {
    return [] as string[];
  }
}

function downloadFile(filename: string, type: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function FavoritesManagementContent() {
  const { loading, user } = useAuth();
  const { data: savedOrder = [], isLoading: orderLoading, isError: orderError } = trpc.favoriteOrder.list.useQuery(undefined, { enabled: user?.role === "admin" });
  const replaceOrder = trpc.favoriteOrder.replace.useMutation();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    const localFavorites = readIds(FAVORITES_KEY);
    const localOrder = readIds(ORDER_KEY);
    const databaseOrder = savedOrder.map((item) => item.projectId);
    const source = databaseOrder.length ? databaseOrder : localOrder;
    const ordered = [...source.filter((id) => localFavorites.includes(id) || databaseOrder.includes(id)), ...localFavorites.filter((id) => !source.includes(id))];
    setFavoriteIds(Array.from(new Set(ordered)));
  }, [savedOrder]);

  const entries = useMemo(() => favoriteIds.map((id, position) => ({ ...portfolioCatalogById.get(id), id, position })), [favoriteIds]);

  function persist(nextIds: string[]) {
    setFavoriteIds(nextIds);
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(nextIds));
    if (user?.role === "admin") {
      replaceOrder.mutate({ projectIds: nextIds }, { onSuccess: () => setFeedback("Ordem salva e sincronizada entre dispositivos."), onError: () => setFeedback("A ordem foi atualizada neste dispositivo, mas não pôde ser sincronizada agora.") });
    }
  }

  function moveFavorite(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    const next = [...favoriteIds];
    const sourceIndex = next.indexOf(sourceId);
    const targetIndex = next.indexOf(targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    next.splice(sourceIndex, 1);
    next.splice(next.indexOf(targetId), 0, sourceId);
    persist(next);
  }

  function exportFavorites(format: "csv" | "json") {
    if (!favoriteIds.length) return;
    if (format === "json") downloadFile("favoritos-pablo-guilherme.json", "application/json", JSON.stringify({ exportedAt: new Date().toISOString(), favorites: entries }, null, 2));
    else downloadFile("favoritos-pablo-guilherme.csv", "text/csv;charset=utf-8", ["position,id,name,description", ...entries.map(({ id, name, description, position }) => `${position + 1},${id},${name ?? id},${description ?? ""}`)].join("\n"));
    setFeedback(`Favoritos exportados em ${format.toUpperCase()}.`);
  }

  if (loading) return <p className="font-body text-sm text-slate-300">Verificando acesso aos favoritos...</p>;
  if (user?.role !== "admin") return <section className="mx-auto max-w-xl py-12"><ShieldCheck className="h-8 w-8 text-cyan-300" aria-hidden="true" /><p className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-cyan-200">acesso restrito</p><h1 className="mt-3 font-display text-3xl font-semibold text-white">Gestão de favoritos reservada.</h1><p className="mt-4 font-body leading-7 text-slate-300">Entre com a conta proprietária do portfólio para ordenar e exportar seus favoritos.</p><a href="/" className="mt-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-cyan-300 hover:text-cyan-100"><ArrowLeft className="h-4 w-4" /> voltar ao portfólio</a></section>;

  return <section className="mx-auto w-full max-w-5xl py-4 text-white"><div className="flex flex-col gap-5 border-b border-cyan-100/15 pb-8 sm:flex-row sm:items-end sm:justify-between"><div className="min-w-0"><p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan-300">Favoritos · gestão</p><h1 className="mt-3 break-words font-display text-4xl font-semibold tracking-tight">Meus favoritos</h1><p className="mt-3 max-w-2xl break-words font-body leading-7 text-slate-300">Organize referências salvas. Esta ordem é sincronizada e não altera a vitrine pública.</p></div><a href="/#favoritos-pessoais" className="inline-flex shrink-0 items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-cyan-300 hover:text-cyan-100"><ArrowLeft className="h-4 w-4" /> ver favoritos</a></div><div className="mt-6 flex flex-wrap items-center gap-3"><button type="button" onClick={() => exportFavorites("csv")} disabled={!favoriteIds.length} className="inline-flex items-center gap-2 border border-cyan-300/30 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-100 hover:border-cyan-200 disabled:opacity-40"><Download className="h-4 w-4" /> exportar CSV</button><button type="button" onClick={() => exportFavorites("json")} disabled={!favoriteIds.length} className="inline-flex items-center gap-2 border border-cyan-300/30 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-100 hover:border-cyan-200 disabled:opacity-40"><Download className="h-4 w-4" /> exportar JSON</button><span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-slate-400" role="status" aria-live="polite">{orderError ? <CloudOff className="h-4 w-4 text-amber-300" aria-hidden="true" /> : <Cloud className="h-4 w-4 text-cyan-300" aria-hidden="true" />}{orderError ? "sincronização indisponível" : replaceOrder.isPending || orderLoading ? "sincronizando" : "sincronizado"}</span></div>{feedback && <p role="status" aria-live="polite" className="mt-4 border-l-2 border-cyan-300 bg-cyan-300/10 px-4 py-3 font-body text-sm text-cyan-50">{feedback}</p>}<div className="mt-8 grid gap-3" aria-label="Lista ordenável de favoritos">{favoriteIds.length ? entries.map(({ id, name, cover, description, position }) => <article key={id} draggable onDragStart={() => setDraggedId(id)} onDragEnd={() => setDraggedId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedId) moveFavorite(draggedId, id); setDraggedId(null); }} className={`group flex min-w-0 flex-col gap-4 border border-cyan-100/15 bg-[#06172f]/70 p-3 transition-colors sm:flex-row sm:items-center sm:p-4 ${draggedId === id ? "border-cyan-300 bg-cyan-300/10" : ""}`}><div className="flex min-w-0 items-center gap-3"><GripVertical className="h-5 w-5 shrink-0 cursor-grab text-cyan-300" aria-hidden="true" /><span className="w-8 shrink-0 font-mono text-xs text-slate-500">{String(position + 1).padStart(2, "0")}</span><div className="h-20 w-28 shrink-0 overflow-hidden border border-cyan-100/15 bg-[#0b1d34] sm:h-24 sm:w-36">{cover ? <img src={cover} alt={`Miniatura de ${name ?? id}`} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" /> : <div className="grid h-full place-items-center px-2 text-center font-mono text-[8px] text-slate-500">sem miniatura</div>}</div></div><div className="min-w-0"><p className="break-words font-display text-xl font-medium tracking-[-0.03em] text-white">{name ?? id}</p><p className="mt-1 break-words font-body text-sm leading-6 text-slate-400">{description ?? "Referência salva na lista de favoritos."}</p><p className="mt-2 font-mono text-[9px] uppercase tracking-[0.12em] text-cyan-300">{id}</p></div></article>) : <p className="border border-dashed border-cyan-100/20 px-5 py-7 font-body text-sm text-slate-400">Nenhum favorito foi salvo ainda. Volte à galeria pública para selecionar referências.</p>}</div></section>;
}

export default function FavoritesManagement() { return <DashboardLayout navigation={navigation}><FavoritesManagementContent /></DashboardLayout>; }
