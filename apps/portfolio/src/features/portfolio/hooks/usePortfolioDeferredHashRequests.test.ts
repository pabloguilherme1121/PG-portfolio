import { describe, expect, it } from "vitest";
import { getPortfolioDeferredHashRequests } from "./usePortfolioDeferredHashRequests";

describe("getPortfolioDeferredHashRequests", () => {
  it("ativa somente a família lazy correspondente ao hash", () => {
    expect(getPortfolioDeferredHashRequests("#contato-briefing")).toEqual({
      contact: true,
      caseStudies: false,
      staticSections: false,
      profileSections: false,
    });
    expect(getPortfolioDeferredHashRequests("#estudos-de-caso")).toEqual({
      contact: false,
      caseStudies: true,
      staticSections: false,
      profileSections: false,
    });
    expect(getPortfolioDeferredHashRequests("#servicos")).toEqual({
      contact: false,
      caseStudies: false,
      staticSections: true,
      profileSections: false,
    });
    expect(getPortfolioDeferredHashRequests("#perfil-profissional")).toEqual({
      contact: false,
      caseStudies: false,
      staticSections: false,
      profileSections: true,
    });
  });

  it("não força carregamento lazy para hashes sem família dedicada", () => {
    expect(getPortfolioDeferredHashRequests("#projetos")).toEqual({
      contact: false,
      caseStudies: false,
      staticSections: false,
      profileSections: false,
    });
  });
});
