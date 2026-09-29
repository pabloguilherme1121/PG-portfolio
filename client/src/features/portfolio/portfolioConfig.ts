import { publicMediaPath } from "@/features/portfolio/utils/publicMediaPath";

export const portfolioMediaPath = (file: string) => `${import.meta.env.BASE_URL}portfolio-media/${file}`;

export const portfolioMarkUrl = `${import.meta.env.BASE_URL}favicon.svg`;
export const portfolioPortraitUrl = portfolioMediaPath("pablo-profile-2026.webp");
export const portfolioPortraitResponsive = {
  avif: portfolioMediaPath("pablo-profile-2026.avif"),
  webp: portfolioMediaPath("pablo-profile-2026.webp"),
};

export const portfolioResumeUrl = publicMediaPath("/manus-storage/curriculo-pablo-guilherme-profissional_1b06376f.pdf");
export const portfolioWhatsAppNumber = "5561992903029";
export const portfolioWhatsAppUrl = `https://wa.me/${portfolioWhatsAppNumber}?text=Ol%C3%A1%2C%20Pablo%21%20Vim%20pelo%20portf%C3%B3lio%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento.`;
export const portfolioTelegramUrl = "https://t.me/mpjmarketing";

export const portfolioNavigationItems = [
  ["sobre", "#sobre", "sobre"],
  ["competências", "#trilha", "trilha"],
  ["serviços", "#servicos", "servicos"],
  ["projetos", "#projetos", "projetos"],
  ["observatório", "#observatorio", "observatorio"],
] as const;

export const portfolioMobileSectionLabels: Record<string, string> = {
  inicio: "início",
  sobre: "sobre",
  trilha: "competências",
  servicos: "serviços",
  projetos: "projetos",
  observatorio: "observatório",
  contato: "contato",
};
