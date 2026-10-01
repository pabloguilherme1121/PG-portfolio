import { describe, expect, it } from "vitest";
import { trpc } from "./trpc.static";

describe("adaptador de API do GitHub Pages", () => {
  it("oferece o contrato do feed social para a curadoria editorial sem API", async () => {
    const result = trpc.instagramFeed.status.useQuery(undefined, { staleTime: 300_000 });
    expect(result.isLoading).toBe(false);
    expect(result.isError).toBe(false);
    expect(result.data.status).toBe("credentials_required");
    expect(result.data.items).toEqual([]);
    expect(await result.refetch()).toEqual({ data: result.data });
  });
});
