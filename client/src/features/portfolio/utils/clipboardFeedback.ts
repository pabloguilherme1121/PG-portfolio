export type ClipboardFeedbackStatus = "idle" | "copied" | "error";

export async function copyTextWithFeedback(
  text: string,
  setStatus: (status: ClipboardFeedbackStatus) => void,
  resetAfterMs = 2200,
) {
  try {
    await navigator.clipboard.writeText(text);
    setStatus("copied");
  } catch {
    setStatus("error");
  }
  window.setTimeout(() => setStatus("idle"), resetAfterMs);
}
