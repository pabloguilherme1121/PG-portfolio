import type { QuoteRequestInput } from "./quoteRequest";

export type InstagramFeedItem = {
  id: string;
  caption?: string;
  permalink: string;
};
export type InstagramFeedResponse =
  | { status: "available"; items: InstagramFeedItem[]; message?: string }
  | {
      status: "empty" | "credentials_required" | "error";
      items: [];
      message: string;
    };

export type QueryOptions = { enabled?: boolean; staleTime?: number };
export type QueryResult<T> = {
  data: T | undefined;
  isError: boolean;
  isLoading: boolean;
  refetch: () => Promise<unknown>;
};
export type QuoteResult = { ownerNotified: boolean };
export type QuoteOptions = {
  onSuccess?: (result: QuoteResult) => void;
  onError?: (error: unknown) => void;
};
export type PortfolioApi = {
  instagramFeed: {
    status: {
      useQuery: (
        input?: undefined,
        options?: QueryOptions
      ) => QueryResult<InstagramFeedResponse>;
    };
  };
  availability: {
    listBlocked: {
      useQuery: (
        input?: undefined,
        options?: QueryOptions
      ) => QueryResult<{ dateKey: string }[]>;
    };
  };
  quoteRequest: {
    create: {
      useMutation: (options?: QuoteOptions) => {
        isPending: boolean;
        mutate: (
          input: QuoteRequestInput,
          options?: { onSuccess?: () => void }
        ) => void;
      };
    };
  };
};
