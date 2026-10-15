import { useState } from "react";
import { ArrowRight } from "lucide-react";

const journey = [
  {
    label: "Buscar",
    detail: "Encontrar opções de posto ou rota para começar a decisão.",
  },
  {
    label: "Comparar",
    detail:
      "Colocar parada, desvio e contexto de combustível na mesma leitura.",
  },
  {
    label: "Decidir",
    detail:
      "Entender a origem de cada dado: referência oficial, terceiro ou estimativa.",
  },
  {
    label: "Navegar",
    detail: "Escolher a próxima ação depois de comparar o contexto da parada.",
  },
] as const;

/** A factual diagram of the documented flow, rather than a product screenshot. */
export default function TrajetoFlowPreview() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div data-project-flow-preview="true" className="project-flow-preview">
      <div className="project-flow-heading">
        <span>Fluxo de decisão</span>
        <span>Diagrama do projeto</span>
      </div>
      <svg
        viewBox="0 0 600 100"
        className="project-flow-route"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="trajeto-flow-grid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="currentColor"
              strokeWidth=".6"
              opacity=".15"
            />
          </pattern>
        </defs>
        <rect width="600" height="100" fill="url(#trajeto-flow-grid)" />
        <path
          d="M30 67 C125 67 105 27 205 27 S335 78 400 65 S500 27 570 27"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          opacity=".35"
        />
        {[
          { x: 30, y: 67 },
          { x: 205, y: 27 },
          { x: 400, y: 65 },
          { x: 570, y: 27 },
        ].map(({ x, y }, index) => (
          <g
            key={index}
            className={
              activeStep === index
                ? "project-flow-node is-active"
                : "project-flow-node"
            }
          >
            <circle cx={x} cy={y} r="14" />
            <text x={x} y={y + 4} textAnchor="middle">
              {index + 1}
            </text>
          </g>
        ))}
      </svg>
      <div
        role="group"
        aria-label="Etapas do fluxo Trajeto"
        className="project-flow-steps"
      >
        {journey.map(({ label }, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={activeStep === index}
            aria-controls="trajeto-flow-detail"
            onClick={() => setActiveStep(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {label}
            {index < journey.length - 1 && <ArrowRight aria-hidden="true" />}
          </button>
        ))}
      </div>
      <p id="trajeto-flow-detail" role="status" className="project-flow-detail">
        {journey[activeStep].detail}
      </p>
      <div
        className="project-flow-stack"
        aria-label="Camadas documentadas da arquitetura"
      >
        <span>
          <strong>Interface</strong> React + TypeScript
        </span>
        <span>
          <strong>API</strong> tRPC + Express
        </span>
        <span>
          <strong>Persistência</strong> MySQL + Drizzle
        </span>
      </div>
    </div>
  );
}
