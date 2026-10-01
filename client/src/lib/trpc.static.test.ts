import { describe, expect, it } from "vitest";
import { trpc } from "./trpc.static";

describe("GitHub Pages social fallback", () => {
  it("provides an editorial fallback without a live API", async () => {
    const result = trpc.instagramFeed.status.useQuery();
    expect(result.data.status).toBe("credentials_required");
    expect(result.data.items).toEqual([]);
    expect(result.isError).toBe(false);
    expect(result.isLoading).toBe(false);
    expect((await result.refetch()).data).toEqual(result.data);
  });
});
