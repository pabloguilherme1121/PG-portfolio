import { ArrowLeft, Home, SearchX } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <main className="min-h-screen bg-[#050b16] px-5 py-16 text-[#f5f7fb] sm:px-8 sm:py-24">
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center border-l-2 border-[#38bdf8] pl-6 sm:pl-10">
        <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#67e8f9]">
          arquivo / registro não encontrado
        </p>
        <div className="mb-6 flex items-center gap-4">
          <SearchX className="h-9 w-9 text-[#38bdf8]" aria-hidden="true" />
          <p className="font-mono text-sm uppercase tracking-[0.16em] text-[#94a3b8]">
            erro 404
          </p>
        </div>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
          Esta página ficou fora do arquivo.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-[#a8b5c7] sm:text-lg">
          O endereço pode ter mudado ou o registro ainda não existir. Volte ao início para explorar trabalhos, repertório e formas de conversar.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => setLocation("/")} className="bg-[#38bdf8] text-[#06111f] hover:bg-[#67e8f9]">
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            Voltar ao início
          </Button>
          <Button onClick={() => window.history.back()} variant="outline" className="border-white/20 bg-transparent text-[#f5f7fb] hover:bg-white/10 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Página anterior
          </Button>
        </div>
      </div>
    </main>
  );
}
