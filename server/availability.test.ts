import { describe, expect, it } from "vitest";
import {
  availableTimes,
  buildAvailabilityWhatsAppUrl,
  getAvailabilityButtonLabel,
  isAvailabilityConsultationReady,
  isSelectableAvailabilityDate,
  isWeekday,
  toDateKey,
} from "../client/src/lib/availability";
import { blockedDateInputSchema } from "./routers";

describe("regras de disponibilidade", () => {
  it("aceita somente dias úteis presentes ou futuros", () => {
    const today = new Date(2026, 7, 15); // sábado
    expect(isWeekday(new Date(2026, 7, 17))).toBe(true);
    expect(isWeekday(new Date(2026, 7, 16))).toBe(false);
    expect(isSelectableAvailabilityDate(new Date(2026, 7, 17), today)).toBe(true);
    expect(isSelectableAvailabilityDate(new Date(2026, 7, 14), today)).toBe(false);
    expect(isSelectableAvailabilityDate(new Date(2026, 7, 16), today)).toBe(false);
  });

  it("impede a seleção de uma data útil marcada como indisponível", () => {
    const blockedDateKeys = new Set(["2026-08-17"]);
    const monday = new Date(2026, 7, 17);

    expect(toDateKey(monday)).toBe("2026-08-17");
    expect(isSelectableAvailabilityDate(monday, new Date(2026, 7, 15), blockedDateKeys)).toBe(false);
  });

  it("aceita somente datas de calendário válidas para bloqueio administrativo", () => {
    expect(blockedDateInputSchema.safeParse({ dateKey: "2026-08-17", note: "Feriado local" }).success).toBe(true);
    expect(blockedDateInputSchema.safeParse({ dateKey: "2026-02-30" }).success).toBe(false);
    expect(blockedDateInputSchema.safeParse({ dateKey: "17/08/2026" }).success).toBe(false);
  });

  it("mantém os horários comerciais e encaminha a consulta com data e hora", () => {
    expect(availableTimes).toEqual(["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]);

    const url = buildAvailabilityWhatsAppUrl("5561992903029", new Date(2026, 7, 17), "14:00");
    expect(url).toContain("https://wa.me/5561992903029?text=");
    expect(decodeURIComponent(url)).toContain("segunda-feira, 17 de agosto, às 14:00");
  });

  it("descreve o estado de carregamento antes do redirecionamento", () => {
    expect(getAvailabilityButtonLabel(false)).toBe("consultar no WhatsApp");
    expect(getAvailabilityButtonLabel(true)).toBe("abrindo WhatsApp");
  });

  it("não libera a consulta enquanto a verificação de bloqueios estiver indisponível", () => {
    const selectedDate = new Date(2026, 7, 17);
    expect(isAvailabilityConsultationReady(selectedDate, "14:00", false)).toBe(true);
    expect(isAvailabilityConsultationReady(selectedDate, "14:00", true)).toBe(false);
    expect(isAvailabilityConsultationReady(null, "14:00", false)).toBe(false);
  });
});
