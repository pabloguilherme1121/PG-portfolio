/** Preparing the URL does not submit the message; the visitor must send it in WhatsApp. */
export function buildBriefingWhatsAppUrl(phone: string, data: FormData) {
  const value = (name: string) => String(data.get(name) || "").trim();
  const lines = [
    "Olá, Pablo! Vim pelo portfólio e gostaria de conversar sobre um projeto.",
    `Nome: ${value("name")}`,
    `E-mail: ${value("email")}`,
    `Serviço: ${value("service")}`,
    `Tipo de projeto: ${value("projectType")}`,
    `Local: ${value("location")}`,
    value("date") ? `Data: ${value("date")}` : "",
    value("delivery") ? `Prazo: ${value("delivery")}` : "",
    value("budget") ? `Orçamento: ${value("budget")}` : "",
    `Briefing: ${value("briefing")}`,
  ].filter(Boolean);
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n"))}`;
}
