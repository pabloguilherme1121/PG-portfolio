import { useEffect, useRef } from "react";
import { projectNetwork } from "../projectNetwork";
import "./projectNetwork.css";

export default function PortfolioProjectNetwork() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const positionNetwork = () => {
      if (window.location.hash === "#rede-projetos") {
        sectionRef.current?.scrollIntoView({
          block: "start",
          behavior: "instant",
        });
        sectionRef.current?.focus({ preventScroll: true });
      }
    };
    const frame = requestAnimationFrame(positionNetwork);
    window.addEventListener("hashchange", positionNetwork);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", positionNetwork);
    };
  }, []);
  return (
    <section
      ref={sectionRef}
      tabIndex={-1}
      id="rede-projetos"
      className="project-network"
      aria-labelledby="project-network-title"
    >
      <div className="project-network-inner">
        <p className="professional-eyebrow">Projetos de Pablo Guilherme</p>
        <h2 id="project-network-title">Escolha o que você quer explorar.</h2>
        <p className="project-network-intro">
          Dados públicos, jogos e produtos em construção. Cada projeto tem seu
          próprio espaço; esta é a central para encontrar todos eles.
        </p>
        <ul className="project-network-grid">
          {projectNetwork.map(project => (
            <li key={project.id} data-network-project={project.id}>
              <span className="project-network-category">
                {project.category} · {project.status}
              </span>
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <div className="project-network-actions">
                <a href={project.href}>
                  {project.action}
                  <span className="sr-only"> — {project.name}</span>
                  <span aria-hidden="true"> ↗</span>
                </a>
                {project.href !== project.code && (
                  <a href={project.code}>
                    Código<span className="sr-only"> de {project.name}</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
