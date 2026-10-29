import { describe, expect, it } from "vitest";
import { isPgBotKeyboardShortcut } from "./pgBotShortcut";

const shortcut = {
  key: "b",
  altKey: true,
  ctrlKey: false,
  metaKey: false,
  repeat: false,
};

describe("atalho de teclado do PG Bot", () => {
  it("abre com Alt+B, aceitando maiúsculas", () => {
    expect(isPgBotKeyboardShortcut(shortcut, false)).toBe(true);
    expect(isPgBotKeyboardShortcut({ ...shortcut, key: "B" }, false)).toBe(true);
  });

  it("não interrompe digitação, atalhos do navegador nem repetições", () => {
    expect(isPgBotKeyboardShortcut(shortcut, true)).toBe(false);
    expect(isPgBotKeyboardShortcut({ ...shortcut, altKey: false }, false)).toBe(false);
    expect(isPgBotKeyboardShortcut({ ...shortcut, ctrlKey: true }, false)).toBe(false);
    expect(isPgBotKeyboardShortcut({ ...shortcut, metaKey: true }, false)).toBe(false);
    expect(isPgBotKeyboardShortcut({ ...shortcut, repeat: true }, false)).toBe(false);
    expect(isPgBotKeyboardShortcut({ ...shortcut, key: "x" }, false)).toBe(false);
  });
});
