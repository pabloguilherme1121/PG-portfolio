import { useState } from "react";
import { resolveFootballShot, type FootballMode } from "../utils/football";
const control =
  "min-h-11 rounded-lg border border-white/20 px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300";
export default function PortfolioFootball() {
  const [mode, setMode] = useState<FootballMode>("penalty");
  const [aim, setAim] = useState(30);
  const [power, setPower] = useState(65);
  const [curve, setCurve] = useState(0);
  const [shots, setShots] = useState<ReturnType<typeof resolveFootballShot>[]>(
    []
  );
  const [keeper, setKeeper] = useState(50);
  const last = shots.at(-1);
  const goals = shots.filter(shot => shot.result === "gol").length;
  const reset = () => {
    setShots([]);
    setKeeper(50);
  };
  const shoot = () => {
    if (shots.length >= 5) return;
    const position = 15 + Math.random() * 70;
    setKeeper(position);
    setShots(previous => [
      ...previous,
      resolveFootballShot(mode, aim, power, curve, position),
    ]);
  };
  return (
    <section
      data-football-game
      aria-labelledby="football-title"
      className="bg-[#06111e] text-white"
    >
      <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-8 lg:px-12">
        <p className="font-mono text-xs uppercase tracking-widest text-emerald-300">
          PG Arcade · futebol
        </p>
        <h2 id="football-title" className="mt-3 font-display text-4xl">
          Decida no chute.
        </h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
          Cinco cobranças. Escolha o canto, ajuste a força e vença o goleiro.
          Nas faltas, use altura ou curva para passar pela barreira.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {(
            [
              ["penalty", "Pênaltis"],
              ["free-kick", "Cobranças de falta"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={mode === value}
              className={`${control} ${mode === value ? "bg-emerald-800" : "bg-slate-900"}`}
              onClick={() => {
                setMode(value);
                reset();
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-[1.5fr_1fr]">
          <div>
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-emerald-400/30 bg-[repeating-linear-gradient(0deg,#14532d_0px,#14532d_40px,#166534_40px,#166534_80px)]"
              role="img"
              aria-label={`Campo de futebol. Mira em ${aim} por cento. ${mode === "free-kick" ? "Barreira à frente do gol." : "Cobrança de pênalti."}`}
            >
              <div className="absolute left-[10%] top-[12%] h-[35%] w-[80%] border-4 border-white bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_19px,#ffffff30_20px),repeating-linear-gradient(0deg,transparent_0px,transparent_19px,#ffffff30_20px)]" />
              <div
                className="absolute top-[29%] text-3xl"
                style={{
                  left: `${10 + keeper * 0.8}%`,
                  transform: "translateX(-50%)",
                }}
                aria-hidden="true"
              >
                🧤
              </div>
              <div
                className="absolute top-[20%] text-xl text-yellow-200"
                style={{
                  left: `${10 + aim * 0.8}%`,
                  transform: "translateX(-50%)",
                }}
                aria-hidden="true"
              >
                ＋
              </div>
              {mode === "free-kick" && (
                <div
                  data-football-wall
                  className="absolute left-[38%] top-[56%] flex gap-1"
                  aria-hidden="true"
                >
                  {[1, 2, 3].map(n => (
                    <span
                      key={n}
                      className="h-10 w-4 rounded-t-full border border-white/50 bg-blue-700"
                    />
                  ))}
                </div>
              )}
              <span
                key={shots.length}
                className="absolute text-2xl"
                style={{
                  left: last ? `${10 + last.x * 0.8}%` : "50%",
                  top: last ? `${12 + last.y * 0.35}%` : "82%",
                  transform: "translate(-50%, -50%)",
                }}
                aria-hidden="true"
              >
                ⚽
              </span>
            </div>
            <p role="status" className="mt-4 min-h-12 text-sm text-emerald-200">
              {last
                ? `${{ gol: "Gol!", defesa: "Defesa do goleiro.", fora: "Fora! Ajuste a mira e a força.", barreira: "Barreira! Use mais força ou curva." }[last.result]} `
                : "Prepare sua primeira cobrança. "}
              {shots.length === 5
                ? `Série encerrada: ${goals} de 5 gols.`
                : "Mire e chute quando estiver pronto."}
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
            <ol
              aria-label="Resultados das cobranças"
              className="mb-4 flex gap-2"
            >
              {shots.map((shot, index) => (
                <li
                  key={index}
                  aria-label={`Cobrança ${index + 1}: ${shot.result}`}
                  className="rounded border border-white/20 px-2 py-1 text-xs"
                >
                  {shot.result === "gol" ? "●" : "×"}
                </li>
              ))}
            </ol>
            <p className="mb-5 text-lg">
              {goals} gols · {shots.length} / 5 cobranças
            </p>
            <div className="space-y-5">
              <label className="block text-sm">
                Mira: {aim}%{" "}
                <input
                  aria-label="Mira"
                  className="mt-3 block w-full accent-emerald-400"
                  type="range"
                  min="0"
                  max="100"
                  value={aim}
                  onChange={event => setAim(Number(event.target.value))}
                />
              </label>
              <label className="block text-sm">
                Força: {power}%{" "}
                <input
                  aria-label="Força"
                  className="mt-3 block w-full accent-emerald-400"
                  type="range"
                  min="0"
                  max="100"
                  value={power}
                  onChange={event => setPower(Number(event.target.value))}
                />
              </label>
              {mode === "free-kick" && (
                <label className="block text-sm">
                  Curva: {curve}{" "}
                  <input
                    aria-label="Curva"
                    className="mt-3 block w-full accent-emerald-400"
                    type="range"
                    min="-100"
                    max="100"
                    value={curve}
                    onChange={event => setCurve(Number(event.target.value))}
                  />
                </label>
              )}
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-300">
              Força entre 58 e 90 levanta a bola. Curva negativa vai à esquerda;
              positiva à direita. Evite o centro e a força máxima.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={shots.length >= 5}
                onClick={shoot}
                className={`${control} bg-emerald-700 disabled:opacity-40`}
              >
                Chutar
              </button>
              <button type="button" onClick={reset} className={control}>
                Reiniciar série
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
