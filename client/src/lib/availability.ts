export const calendarWeekdays = ["D", "S", "T", "Q", "Q", "S", "S"];
export const availableTimes = ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"];

export function isWeekday(date: Date) {
  const day = date.getDay();
  return day >= 1 && day <= 5;
}

export function isSelectableAvailabilityDate(date: Date, today: Date) {
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return isWeekday(dateStart) && dateStart >= todayStart;
}

export function formatAvailabilityDate(date: Date) {
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export function buildAvailabilityWhatsAppUrl(phone: string, date: Date, time: string) {
  const dateLabel = formatAvailabilityDate(date);
  const message = `Olá, Pablo! Vim pelo seu portfólio e gostaria de consultar a disponibilidade para ${dateLabel}, às ${time}.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function getAvailabilityButtonLabel(isRedirecting: boolean) {
  return isRedirecting ? "abrindo WhatsApp" : "consultar no WhatsApp";
}
