/** Preparing the URL does not submit the message; the visitor must send it in WhatsApp. */
export function buildBriefingWhatsAppUrl(phone: string, data: FormData) {
  const value = (name: string) => String(data.get(name) || "").trim();
  const lines = [
    "Olá, Pablo! Vim pelo portfólio e gostaria de conversar sobre um projeto.",
    "",
    "CONTATO",
    `Nome: ${value("name")}`,
    `E-mail: ${value("email")}`,
    "",
    "DIREÇÃO",
    `Serviço: ${value("service")}`,
    `Tipo de projeto: ${value("projectType")}`,
    value("objective") ? `Objetivo: ${value("objective")}` : "",
    value("audience") ? `Público: ${value("audience")}` : "",
    value("stage") ? `Estágio atual: ${value("stage")}` : "",
    "",
    "ESCOPO",
    `Local / alcance: ${value("location")}`,
    value("date") ? `Data prevista: ${value("date")}` : "",
    value("delivery") ? `Entrega: ${value("delivery")}` : "",
    value("deadline") ? `Prazo: ${value("deadline")}` : "",
    value("budget") ? `Investimento: ${value("budget")}` : "",
    "",
    "CONTEXTO",
    value("success") ? `Critério de sucesso: ${value("success")}` : "",
    value("references") ? `Referências: ${value("references")}` : "",
    value("constraints") ? `Restrições / integrações: ${value("constraints")}` : "",
    `Detalhes: ${value("briefing")}`,
  ].filter((line, index, source) => line !== "" || (index > 0 && source[index - 1] !== ""));
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join("\n").trim())}`;
}
