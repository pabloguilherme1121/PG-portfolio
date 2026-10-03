import { repositories } from "@/features/portfolio/portfolioData";

export type PortfolioCatalogItem = {
  id: string;
  name: string;
  cover: string;
  description: string;
  tags: string[];
};

export const portfolioCatalog: PortfolioCatalogItem[] = repositories.map((repository) => ({
  id: repository.id,
  name: repository.name,
  cover: repository.cover ?? "",
  description: repository.catalog.description,
  tags: repository.catalog.tags,
}));

export const portfolioCatalogById = new Map(portfolioCatalog.map((item) => [item.id, item]));
