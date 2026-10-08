
export const portfolioMediaPath = (file: string) => `${import.meta.env.BASE_URL}portfolio-media/${file}`;

export const portfolioMarkUrl = `${import.meta.env.BASE_URL}favicon.svg`;
export const portfolioPortraitUrl = portfolioMediaPath("pablo-profile-2026.webp");
export const portfolioPortraitResponsive = {
  avif: portfolioMediaPath("pablo-profile-2026.avif"),
  webp: portfolioMediaPath("pablo-profile-2026.webp"),
};

export const portfolioWhatsAppNumber = "5561992903029";
export const portfolioWhatsAppUrl = `https://wa.me/${portfolioWhatsAppNumber}?text=Ol%C3%A1%2C%20Pablo%21%20Vim%20pelo%20portf%C3%B3lio%20e%20gostaria%20de%20solicitar%20um%20or%C3%A7amento.`;
export const portfolioTelegramUrl = "https://t.me/mpjmarketing";
export const portfolioContactEmail = "mpjcreator@gmail.com";
export const portfolioInstagramPersonalHandle = "@pablogui000";
export const portfolioInstagramPersonalUrl = "https://www.instagram.com/pablogui000/";
export const portfolioInstagramWorkHandle = "@mpjstoryworks";
export const portfolioInstagramWorkUrl = "https://www.instagram.com/mpjstoryworks/";
export const portfolioInstagramDmUrl = "https://ig.me/m/pablogui000";
export const portfolioArcadeUrl = "https://pabloguilherme1121.github.io/PG-Arcade/";

export const portfolioNavigationItems = [
  ["projetos", "#projetos", "projetos"],
  ["perfil", "#sobre", "sobre"],
  ["serviços", "#servicos", "servicos"],
  ["contato", "#contato", "contato"],
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
