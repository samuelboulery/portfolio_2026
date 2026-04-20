/**
 * Formatte une date au style macOS : "Lun. 17 nov. 21:17".
 */
export function formatOsBarDate(date: Date, locale = "fr-FR"): string {
  const day = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
  const dateLabel = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
  }).format(date);
  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);

  const capitalized = day.charAt(0).toUpperCase() + day.slice(1);
  return `${capitalized} ${dateLabel} ${time}`;
}
