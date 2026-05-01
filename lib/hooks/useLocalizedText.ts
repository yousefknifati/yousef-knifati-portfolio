"use client";

import { useI18n } from "@/providers/I18nProvider";
import { getLocalizedText } from "@/lib/utils/getLocalizedText";

type LocalizedText = Parameters<typeof getLocalizedText>[0];

export function useLocalizedText() {
  const { lang } = useI18n();

  return (value?: LocalizedText | null) => getLocalizedText(value, lang);
}
