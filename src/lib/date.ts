const TURKEY_TIME_ZONE = "Europe/Istanbul";
const TURKEY_UTC_OFFSET_MINUTES = 3 * 60;

function parseDateParts(dateStr: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  if (!match) {
    throw new Error(`Invalid date string: ${dateStr}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return { year, month, day };
}

function getTimePartsInTurkey(now = new Date()) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TURKEY_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour),
    minute: Number(map.minute),
  };
}

export function getTodayDateInTurkey(now = new Date()): string {
  const parts = getTimePartsInTurkey(now);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export function getTomorrowDateInTurkey(now = new Date()): string {
  const { year, month, day } = getTimePartsInTurkey(now);
  const turkeyTodayAtNoonUtc = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  turkeyTodayAtNoonUtc.setUTCDate(turkeyTodayAtNoonUtc.getUTCDate() + 1);
  return turkeyTodayAtNoonUtc.toISOString().slice(0, 10);
}

export function getCurrentMinutesInTurkey(now = new Date()): number {
  const parts = getTimePartsInTurkey(now);
  return parts.hour * 60 + parts.minute;
}

export function compareDateStrings(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

export function getDayOfWeekFromDate(dateStr: string): number {
  const { year, month, day } = parseDateParts(dateStr);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
}

export function dateOnlyToDbDate(dateStr: string): Date {
  const { year, month, day } = parseDateParts(dateStr);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}

export function getUtcRangeForTurkeyDate(dateStr: string) {
  const { year, month, day } = parseDateParts(dateStr);
  const startUtc = new Date(Date.UTC(year, month - 1, day, 0, 0 - TURKEY_UTC_OFFSET_MINUTES, 0, 0));
  const endUtc = new Date(Date.UTC(year, month - 1, day, 23, 59 - TURKEY_UTC_OFFSET_MINUTES, 59, 999));
  return { startUtc, endUtc };
}

export function dateToIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
