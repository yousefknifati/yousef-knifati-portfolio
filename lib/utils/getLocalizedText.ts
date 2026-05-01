type LocalizedText = {
  en?: string;
  ar?: string;
  de?: string;
  du?: string;
  [key: string]: string | undefined;
};

const FALLBACK_ORDER = ["en", "ar", "de"];

export function getLocalizedText(
  value?: LocalizedText | null,
  lang?: string,
) {
  if (!value) return "";
  const normalizedLang = (lang || "").toLowerCase();
  const normalizedKey = normalizedLang === "du" ? "de" : normalizedLang;
  const direct = value[normalizedKey];
  if (direct && direct.trim()) return direct.trim();

  for (const key of FALLBACK_ORDER) {
    const v = value[key];
    if (v && v.trim()) return v.trim();
  }

  return "";
}
