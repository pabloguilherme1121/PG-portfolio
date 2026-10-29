type PgBotKeyEvent = Pick<KeyboardEvent, "key" | "altKey" | "ctrlKey" | "metaKey" | "repeat">;

/** Atalho intencional: não intercepta campos editáveis, teclas do sistema ou repetição. */
export function isPgBotKeyboardShortcut(event: PgBotKeyEvent, isEditing: boolean): boolean {
  return !isEditing &&
    event.altKey &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.repeat &&
    event.key.toLowerCase() === "b";
}
