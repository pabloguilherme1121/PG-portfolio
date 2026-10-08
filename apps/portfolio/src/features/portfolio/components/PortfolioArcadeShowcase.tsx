import { ArrowUpRight, Gamepad2, Github } from "lucide-react";
import { portfolioArcadeUrl, portfolioMediaPath } from "@/features/portfolio/portfolioConfig";

export default function PortfolioArcadeShowcase() {
  return (
    <section id="pg-lab" data-arcade-showcase="true" className="mt-8 scroll-mt-24 border-t border-[#67e8f9]/25 pt-8" aria-labelledby="pg-lab-title">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div className="min-w-0">
          <p className="professional-eyebrow">PG Arcade · produto publicado</p>
          <h2 id="pg-lab-title" className="mt-3 font-display text-[clamp(1.8rem,3vw,3rem)] font-medium leading-tight tracking-[-0.035em] text-white">Escolha um jogo. Aprenda jogando.</h2>
          <p className="mt-4 max-w-[60ch] font-body text-base leading-7 text-[#bed0ea]">Puzzles, jogos de tabuleiro e desafios de ação em um catálogo aberto, sem cadastro. Um produto para escolher uma mecânica, entender o objetivo e começar a partida.</p>
          <dl className="mt-5 space-y-3 font-body text-sm leading-6 text-[#bed0ea]">
            <div><dt className="font-semibold text-white">Meu papel</dt><dd>Produto, interface, implementação frontend e validação dos fluxos de jogo.</dd></div>
            <div><dt className="font-semibold text-white">Decisões</dt><dd>Controles de toque e teclado, regras por mecânica e carregamento separado do portfólio. Favoritos e progresso ficam no dispositivo.</dd></div>
            <div><dt className="font-semibold text-white">Resultado verificável</dt><dd>Catálogo e partidas disponíveis no produto publicado, com código público para examinar regras e estados.</dd></div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={portfolioArcadeUrl} target="_blank" rel="noopener noreferrer" data-arcade-full-site="true" className="professional-primary"><Gamepad2 className="h-4 w-4" aria-hidden="true" /> Jogar PG Arcade <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></a>
            <a href="https://github.com/pabloguilherme1121/PG-Arcade" target="_blank" rel="noopener noreferrer" className="professional-secondary"><Github className="h-4 w-4" aria-hidden="true" /> Ver código</a>
          </div>
          <p className="mt-3 font-body text-sm leading-6 text-[#a9bfd8]">O jogo abre em outra aba. Sem ranking global ou multiplayer online.</p>
        </div>
        <figure className="min-w-0">
          <img src={portfolioMediaPath("arcade-resta-um.png")} alt="Partida de Resta Um no PG Arcade, com tabuleiro, peças e controles" width="1440" height="1000" loading="lazy" decoding="async" className="h-auto w-full rounded-lg border border-white/15" />
          <figcaption className="mt-3 font-body text-sm leading-6 text-[#a9bfd8]">Resta Um: selecionar uma peça, saltar sobre outra e buscar a última peça no tabuleiro. Captura real do produto em outubro de 2026.</figcaption>
        </figure>
      </div>
      <details className="professional-disclosure mt-6">
        <summary>Estudo de caso · controles, progresso e limites</summary>
        <div className="grid gap-5 pb-6 font-body text-sm leading-7 text-[#bed0ea] md:grid-cols-3">
          <div><h3 className="font-semibold text-white">Problema e público</h3><p>Quem joga no celular precisa reconhecer o desafio e alcançar os controles sem atravessar uma sequência de painéis. A arena e o objetivo orientam o primeiro contato.</p></div>
          <div><h3 className="font-semibold text-white">Construção e aprendizado</h3><p>Um shell comum organiza navegação e preferências; cada mecânica mantém regras e resultados próprios. A validação combina catálogo carregável, cenários por família, teclado e persistência local.</p></div>
          <div><h3 className="font-semibold text-white">Limitações</h3><p>Dados locais não sincronizam entre aparelhos. Offline depende dos recursos preparados. Testes automatizados demonstram cenários específicos, sem prometer ausência de falhas ou acessibilidade certificada.</p></div>
        </div>
      </details>
    </section>
  );
}
