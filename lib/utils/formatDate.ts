export function formatDate(
  dateString?: string | null,
  opts: {
    addHours?: number;
    addMinutes?: number;
    fromOffset?: number | string;
    toOffset?: number | string;
  } = {}
) {
  const parseOffsetToMinutes = (val?: number | string): number | undefined => {
    if (val === undefined || val === null) return undefined;
    if (typeof val === "number" && Number.isFinite(val)) {
      return Math.round(val * 60);
    }
    if (typeof val === "string") {
      const s = val.trim().toUpperCase().replace(/^GMT|^UTC/, "");
      const m = /^([+-]?)(\d{1,2})(?::(\d{2}))?$/.exec(s);
      if (!m) return undefined;
      const sign = m[1] === "-" ? -1 : 1;
      const hh = Number(m[2]);
      const mm = m[3] ? Number(m[3]) : 0;
      return sign * (hh * 60 + mm);
    }
    return undefined;
  };

  const localOffsetMinutes = -new Date().getTimezoneOffset();
  const localOffsetHours = localOffsetMinutes / 60;

  const {
    addHours,
    addMinutes = 0,
    fromOffset = 0,
    toOffset = localOffsetHours,
  } = opts;

  let deltaMinutes: number;
  if (addHours !== undefined || addMinutes !== 0) {
    deltaMinutes = Number(addHours ?? 0) * 60 + Number(addMinutes);
  } else {
    const fromMin = parseOffsetToMinutes(fromOffset) ?? 0;
    const toMin = parseOffsetToMinutes(toOffset) ?? 0;
    deltaMinutes = toMin - fromMin;
  }

  const trimmed = (dateString ?? "").trim();

  if (!trimmed || /^0001-01-01(?:[T\s].*)?$/.test(trimmed)) return "-";

  const timeOnly = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(trimmed);
  const isoNoTz = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.test(
    trimmed
  );

  let baseUTC: Date;

  if (timeOnly) {
    const [, hhStr, mmStr, ssStr] = timeOnly;
    const hh = Number(hhStr);
    const mm = Number(mmStr);
    const ss = Number(ssStr ?? "0");
    const now = new Date();
    baseUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        hh,
        mm,
        ss,
        0
      )
    );
  } else if (isoNoTz) {
    baseUTC = new Date(trimmed + "Z");
  } else {
    baseUTC = new Date(trimmed);
  }

  if (isNaN(baseUTC.getTime())) return "-";

  const shiftedMs = baseUTC.getTime() + deltaMinutes * 60 * 1000;
  const shifted = new Date(shiftedMs);

  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    hour12: true,
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  const parts = fmt.formatToParts(shifted);
  const get = (t: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === t)?.value ?? "";

  const mm = get("month");
  const dd = get("day");
  const yyyy = get("year");
  const hh = get("hour");
  const min = get("minute");
  const ampm = get("dayPeriod");

  return `${mm}/${dd}/${yyyy}\n${hh}:${min} ${ampm}`;
}