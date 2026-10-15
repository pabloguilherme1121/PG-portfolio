import { describe, expect, it } from "vitest";
import { getPortfolioDeferredHashRequests } from "./usePortfolioDeferredHashRequests";

describe("getPortfolioDeferredHashRequests", () => {
  it("ativa somente a família lazy correspondente ao hash", () => {
    expect(getPortfolioDeferredHashRequests("#contato-briefing")).toEqual({
      footer: false,
      contact: true,
      caseStudies: false,
      staticSections: false,
      profileSections: false,
    });
    expect(getPortfolioDeferredHashRequests("#estudos-de-caso")).toEqual({
      footer: false,
      contact: false,
      caseStudies: true,
      staticSections: false,
      profileSections: false,
    });
    expect(getPortfolioDeferredHashRequests("#servicos")).toEqual({
      footer: false,
      contact: false,
      caseStudies: false,
      staticSections: true,
      profileSections: false,
    });
    expect(getPortfolioDeferredHashRequests("#perfil-profissional")).toEqual({
      footer: false,
      contact: false,
      caseStudies: false,
      staticSections: false,
      profileSections: true,
    });
  });

  it("abre a central diretamente sem carregar famílias não relacionadas", () => {
    expect(getPortfolioDeferredHashRequests("#rede-projetos")).toEqual({
      footer: true,
      contact: false,
      caseStudies: false,
      staticSections: false,
      profileSections: false,
    });
  });

  it("não força carregamento lazy para hashes sem família dedicada", () => {
    expect(getPortfolioDeferredHashRequests("#projetos")).toEqual({
      footer: false,
      contact: false,
      caseStudies: false,
      staticSections: false,
      profileSections: false,
    });
  });
});
