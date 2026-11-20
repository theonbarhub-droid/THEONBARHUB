const fmt = new Intl.DateTimeFormat("en-CA", {
  weekday: "short",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "America/Toronto",
});

const fmtShort = new Intl.DateTimeFormat("en-CA", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "America/Toronto",
});

// Dates are stored as YYYY-MM-DD; noon Toronto avoids day slips across time zones.
export function toDate(iso: string) {
  return new Date(`${iso}T12:00:00-05:00`);
}

export function formatDate(iso: string) {
  return fmt.format(toDate(iso));
}

export function formatShort(iso: string) {
  return fmtShort.format(toDate(iso));
}
