import { describe, expect, it } from "vitest";
import { isValidStorageKey } from "./storageProxy";

describe("isValidStorageKey", () => {
  it("aceita chaves relativas normais", () => {
    expect(isValidStorageKey("portfolio/media/file.jpg")).toBe(true);
    expect(isValidStorageKey("folder name/file.png")).toBe(true);
  });

  it("rejeita traversal, caminhos absolutos, barras invertidas e chaves grandes", () => {
    expect(isValidStorageKey("")).toBe(false);
    expect(isValidStorageKey("../secret.txt")).toBe(false);
    expect(isValidStorageKey("folder\\secret.txt")).toBe(false);
    expect(isValidStorageKey("/absolute/path.txt")).toBe(false);
    expect(isValidStorageKey("a".repeat(513))).toBe(false);
  });

  it("rejeita caracteres de controle ASCII", () => {
    expect(isValidStorageKey("bad\u0000key")).toBe(false);
    expect(isValidStorageKey("bad\u001fkey")).toBe(false);
    expect(isValidStorageKey("bad\u007fkey")).toBe(false);
  });
});
