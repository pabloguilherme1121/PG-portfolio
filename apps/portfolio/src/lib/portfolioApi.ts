import type { PortfolioApi, QueryResult } from "@shared/portfolioApi";

function staticQuery<T>(data: T): QueryResult<T> {
  return {
    data,
    isError: false,
    isLoading: false,
    refetch: async () => ({ data }),
  };
}

/** Public adapter: no network, database or tRPC dependencies. */
export const trpc: PortfolioApi = {
  instagramFeed: {
    status: {
      useQuery: () =>
        staticQuery({
          status: "credentials_required",
          items: [],
          message: "O feed ao vivo não está disponível no GitHub Pages.",
        }),
    },
  },
  availability: { listBlocked: { useQuery: () => staticQuery([]) } },
  quoteRequest: {
    create: {
      useMutation: options => ({
        isPending: false,
        mutate: () =>
          options?.onError?.(new Error("API indisponível no build estático.")),
      }),
    },
  },
};
