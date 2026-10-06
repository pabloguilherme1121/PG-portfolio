import { describe, expect, it } from "vitest";
import { extractInsertId } from "./db";

describe("extractInsertId", () => {
  it("reads the auto-increment id from the mysql2 result header tuple", () => {
    expect(extractInsertId([{ insertId: 42 }] as const)).toBe(42);
  });
});
