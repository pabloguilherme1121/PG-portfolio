import type { InstagramFeedResponse } from "../../../server/routers";

type StaticQueryResult<T> = {
  data: T;
  isError: false;
  isLoading: false;
  refetch: () => Promise<{ data: T }>;
};

type StaticMutationResult = {
  isPending: false;
  mutate: (..._args: unknown[]) => void;
  mutateAsync: (..._args: unknown[]) => Promise<never>;
};

function staticQuery<T>(data: T): StaticQueryResult<T> {
  return {
    data,
    isError: false,
    isLoading: false,
    refetch: async () => ({ data }),
  };
}

function staticMutation(): StaticMutationResult {
  return {
    isPending: false,
    mutate: () => undefined,
    mutateAsync: async () => {
      throw new Error("API indisponível no build estático.");
    },
  };
}

/**
 * Adaptador usado somente no build do GitHub Pages.
 * Mantém a interface mínima consumida pela home sem carregar tRPC/React Query.
 */
export const trpc = {
  instagramFeed: {
    status: {
      useQuery: () => staticQuery<InstagramFeedResponse>({
        status: "credentials_required",
        items: [],
        message: "Acompanhe as publicações diretamente nos perfis do Instagram.",
      }),
    },
  },
  availability: {
    listBlocked: {
      useQuery: () => staticQuery<{ dateKey: string }[]>([]),
    },
  },
  quoteRequest: {
    create: {
      useMutation: () => staticMutation(),
    },
  },
};
