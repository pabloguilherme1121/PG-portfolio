export type ClipboardFeedbackStatus = "idle" | "copied" | "error";

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // A denied modern clipboard can still permit copying a selected field.
  }
  if (typeof document === "undefined") return false;
  const focused = document.activeElement;
  const selection = document.getSelection();
  const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, i) => selection.getRangeAt(i).cloneRange()) : [];
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.setAttribute("aria-hidden", "true");
  field.tabIndex = -1;
  field.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
  const container = focused instanceof Element ? focused.closest('[role="dialog"]') ?? document.body : document.body;
  container.appendChild(field);
  try {
    field.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
    if (focused instanceof HTMLElement) focused.focus({ preventScroll: true });
    if (selection) {
      selection.removeAllRanges();
      ranges.forEach(range => selection.addRange(range));
    }
  }
}

export async function copyTextWithFeedback(
  text: string,
  setStatus: (status: ClipboardFeedbackStatus) => void,
  resetAfterMs = 2200,
) {
  try {
    setStatus(await copyText(text) ? "copied" : "error");
  } catch {
    setStatus("error");
  }
  window.setTimeout(() => setStatus("idle"), resetAfterMs);
}
