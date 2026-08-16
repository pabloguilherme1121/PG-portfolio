export type PortfolioCatalogItem = {
  id: string;
  name: string;
  cover: string;
  description: string;
};

export const portfolioCatalog: PortfolioCatalogItem[] = [
  { id: "AUD.01", name: "Chá da Eloise", cover: "/manus-storage/cha-da-eloise-capa_0d17d433.jpg", description: "Registro audiovisual de evento social." },
  { id: "CNT.02", name: "RHAM — Serviços no app", cover: "/manus-storage/rham-interface-servicos-01_72f2d942.jpg", description: "Vídeo vertical de navegação por serviços." },
  { id: "CNT.03", name: "RHAM — Mensagem em vídeo", cover: "/manus-storage/rham-depoimento-02_c0845a39.jpg", description: "Registro vertical para comunicação institucional." },
  { id: "AUD.04", name: "Captação noturna — visão aérea", cover: "/manus-storage/captacao-noturna-03_1033bede.jpg", description: "Registro noturno com perspectiva elevada." },
  { id: "AUD.05", name: "Campo iluminado — vista aérea", cover: "/manus-storage/campo-iluminado-04_665a6d8f.jpg", description: "Captação horizontal de campo esportivo." },
  { id: "CNT.06", name: "RHAM — Navegação de serviços", cover: "/manus-storage/rham-interface-navegacao-05_6de0dfd3.jpg", description: "Recorte vertical de interface móvel." },
  { id: "AUD.07", name: "Campo iluminado — sequência aérea", cover: "/manus-storage/campo-iluminado-movimento-06_cc198d97.jpg", description: "Sequência aérea com atmosfera noturna." },
];

export const portfolioCatalogById = new Map(portfolioCatalog.map((item) => [item.id, item]));
