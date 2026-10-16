import { useEffect, useState } from "react";

export type PortfolioDeferredHashRequests = {
  footer: boolean;
  contact: boolean;
  caseStudies: boolean;
  staticSections: boolean;
  profileSections: boolean;
};

export function getPortfolioDeferredHashRequests(hash: string): PortfolioDeferredHashRequests {
  return {
    footer: ["#rede-projetos", "#contato-rodape"].includes(hash),
    contact: ["#contato", "#contato-briefing", "#agenda"].includes(hash),
    caseStudies: hash === "#estudos-de-caso",
    staticSections: ["#trilha", "#qualidade", "#servicos", "#processo"].includes(hash),
    profileSections: ["#sobre", "#perfil-profissional"].includes(hash),
  };
}

export function usePortfolioDeferredHashRequests() {
  const [requests, setRequests] = useState<PortfolioDeferredHashRequests>(() =>
    getPortfolioDeferredHashRequests(typeof window === "undefined" ? "" : window.location.hash),
  );

  useEffect(() => {
    const syncRequests = () => {
      setRequests(getPortfolioDeferredHashRequests(window.location.hash));
    };

    window.addEventListener("hashchange", syncRequests);
    return () => window.removeEventListener("hashchange", syncRequests);
  }, []);

  return requests;
}
