import { describe, expect, it } from "vitest";
import {
  availableTimes,
  buildAvailabilityWhatsAppUrl,
  isSelectableAvailabilityDate,
  isWeekday,
} from "../client/src/lib/availability";

describe("regras de disponibilidade", () => {
  it("aceita somente dias úteis presentes ou futuros", () => {
    const today = new Date(2026, 7, 15); // sábado
    expect(isWeekday(new Date(2026, 7, 17))).toBe(true);
    expect(isWeekday(new Date(2026, 7, 16))).toBe(false);
    expect(isSelectableAvailabilityDate(new Date(2026, 7, 17), today)).toBe(true);
    expect(isSelectableAvailabilityDate(new Date(2026, 7, 14), today)).toBe(false);
    expect(isSelectableAvailabilityDate(new Date(2026, 7, 16), today)).toBe(false);
  });

  it("mantém os horários comerciais e encaminha a consulta com data e hora", () => {
    expect(availableTimes).toEqual(["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"]);

    const url = buildAvailabilityWhatsAppUrl("5561992903029", new Date(2026, 7, 17), "14:00");
    expect(url).toContain("https://wa.me/5561992903029?text=");
    expect(decodeURIComponent(url)).toContain("segunda-feira, 17 de agosto, às 14:00");
  });
});
