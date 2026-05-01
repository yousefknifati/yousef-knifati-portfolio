export function formatDurationFromIso(
  iso: string,
  now: Date = new Date(),
  lang: string = "en"
): string {
  const normalizedIso =
    /[zZ]|[+-]\d{2}:\d{2}$/.test(iso) ? iso : `${iso}Z`;
  const date = new Date(normalizedIso);
  const diffMs = now.getTime() - date.getTime();

  if (!Number.isFinite(diffMs)) return "0s";

  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts: string[] = [];

  const normalizedLang = lang.toLowerCase();
  const units =
    normalizedLang === "ar"
      ? { d: "ي", h: "س", m: "د" }
      : normalizedLang === "de" || normalizedLang === "du"
        ? { d: "T", h: "Std", m: "Min" }
        : { d: "d", h: "h", m: "m" };

  if (days > 0) parts.push(`${days}${units.d}`);
  if (hours > 0) parts.push(`${hours}${units.h}`);
  if (minutes > 0) parts.push(`${minutes}${units.m}`);

  return parts.length === 0 ? "0s" : parts.join(" ");
}
