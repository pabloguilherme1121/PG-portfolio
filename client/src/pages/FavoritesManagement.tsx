import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout, { type DashboardNavigationItem } from "@/components/DashboardLayout";
import { ArrowLeft, Download, GripVertical, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const FAVORITES_KEY = "pablo-portfolio-favorites";
const ORDER_KEY = "pablo-portfolio-favorite-order";
const navigation: DashboardNavigationItem[] = [{ icon: ShieldCheck, label: "Curadoria", path: "/curadoria" }];

type FavoriteEntry = { id: string; position: number };

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
  anchor.click();
  URL.revokeObjectURL(url);
}

function FavoritesManagementContent() {
  const { loading, user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    const favoriteIds = readIds(FAVORITES_KEY);
    const savedOrder = readIds(ORDER_KEY);
    const ordered = [...savedOrder.filter((id) => favoriteIds.includes(id)), ...favoriteIds.filter((id) => !savedOrder.includes(id))];
    setFavoriteIds(ordered);
  }, []);

  const entries = useMemo<FavoriteEntry[]>(() => favoriteIds.map((id, position) => ({ id, position })), [favoriteIds]);

  function persist(nextIds: string[]) {
    setFavoriteIds(nextIds);
    window.localStorage.setItem(ORDER_KEY, JSON.stringify(nextIds));
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
    setFeedback("Ordem da curadoria atualizada.");
  }

  function exportFavorites(format: "csv" | "json") {
    if (!favoriteIds.length) return;
    if (format === "json") downloadFile("curadoria-pessoal.json", "application/json", JSON.stringify({ exportedAt: new Date().toISOString(), favorites: entries }, null, 2));
    else downloadFile("curadoria-pessoal.csv", "text/csv;charset=utf-8", ["position,id", ...entries.map(({ id, position }) => `${position + 1},${id}`)].join("\n"));
    setFeedback(`Curadoria exportada em ${format.toUpperCase()}.`);
  }

  if (loading) return <p className="font-body text-sm text-slate-300">Verificando acesso à curadoria...</p>;
  if (user?.role !== "admin") return <section className="mx-auto max-w-xl py-12"><ShieldCheck className="h-8 w-8 text-cyan-300" aria-hidden="true" /><p className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-cyan-200">acesso restrito</p><h1 className="mt-3 font-display text-3xl font-semibold text-white">Curadoria reservada.</h1><p className="mt-4 font-body leading-7 text-slate-300">Entre com a conta proprietária do portfólio para ordenar e exportar seus favoritos.</p><a href="/" className="mt-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-cyan-300 hover:text-cyan-100"><ArrowLeft className="h-4 w-4" /> voltar ao portfólio</a></section>;

  return <section className="mx-auto max-w-4xl py-4 text-white"><div className="flex flex-col gap-5 border-b border-cyan-100/15 pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan-300">Curadoria · gestão</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">Favoritos organizados</h1><p className="mt-3 max-w-2xl font-body leading-7 text-slate-300">A ordem desta área é pessoal e não altera a vitrine pública.</p></div><a href="/#curadoria-pessoal" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-cyan-300 hover:text-cyan-100"><ArrowLeft className="h-4 w-4" /> ver curadoria</a></div><div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => exportFavorites("csv")} disabled={!favoriteIds.length} className="inline-flex items-center gap-2 border border-cyan-300/30 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-100 hover:border-cyan-200 disabled:opacity-40"><Download className="h-4 w-4" /> exportar CSV</button><button type="button" onClick={() => exportFavorites("json")} disabled={!favoriteIds.length} className="inline-flex items-center gap-2 border border-cyan-300/30 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-100 hover:border-cyan-200 disabled:opacity-40"><Download className="h-4 w-4" /> exportar JSON</button></div>{feedback && <p role="status" aria-live="polite" className="mt-4 border-l-2 border-cyan-300 bg-cyan-300/10 px-4 py-3 font-body text-sm text-cyan-50">{feedback}</p>}<div className="mt-8 space-y-3" aria-label="Lista ordenável de favoritos">{favoriteIds.length ? entries.map(({ id, position }) => <article key={id} draggable onDragStart={() => setDraggedId(id)} onDragEnd={() => setDraggedId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggedId) moveFavorite(draggedId, id); setDraggedId(null); }} className={`flex items-center gap-3 border border-cyan-100/15 bg-[#06172f]/70 p-4 transition-colors ${draggedId === id ? "border-cyan-300 bg-cyan-300/10" : ""}`}><GripVertical className="h-5 w-5 shrink-0 text-cyan-300" aria-hidden="true" /><span className="w-8 font-mono text-xs text-slate-500">{String(position + 1).padStart(2, "0")}</span><div><p className="font-mono text-sm text-white">{id}</p><p className="mt-1 font-body text-xs text-slate-400">Referência salva na curadoria pessoal</p></div></article>) : <p className="border border-dashed border-cyan-100/20 px-5 py-7 font-body text-sm text-slate-400">Nenhum favorito foi salvo ainda. Volte à galeria pública para selecionar referências.</p>}</div></section>;
}

export default function FavoritesManagement() { return <DashboardLayout navigation={navigation}><FavoritesManagementContent /></DashboardLayout>; }
