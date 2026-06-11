type LocalParts = { date: string; minutes: number };

export function getLocalParts(date: Date, timezone: string): LocalParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  const parts = Object.fromEntries(formatter.formatToParts(date).map(part => [part.type, part.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export function isReminderDue(time: string, timezone: string, now: Date, windowMinutes = 15) {
  const [hour, minute] = time.split(":").map(Number);
  const scheduledMinutes = hour * 60 + minute;
  const local = getLocalParts(now, timezone);
  const elapsed = (local.minutes - scheduledMinutes + 1440) % 1440;
  return { due: elapsed < windowMinutes, localDate: local.date };
}

export function wasSentOnLocalDate(sentAt: Date | null, timezone: string, localDate: string) {
  return Boolean(sentAt && getLocalParts(sentAt, timezone).date === localDate);
}
