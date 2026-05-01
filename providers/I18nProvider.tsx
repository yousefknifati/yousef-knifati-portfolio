"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type EffectiveLang = "en" | "ar" | "de";
export type Lang = EffectiveLang | "du";
type Messages = Record<string, string>;

type I18nContextValue = {
  lang: Lang;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
  setLang: (lang: Lang) => void;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

import enHome from "@/languages/en.json";
import arHome from "@/languages/ar.json";
import deHome from "@/languages/de.json";

const DEFAULT_LANG: EffectiveLang = "en";
const LANG_COOKIE = "lang";
const ONE_YEAR_DAYS = 365;

const messagesByLang: Record<EffectiveLang, Messages> = {
  en: { ...(enHome as Messages) },
  ar: { ...(arHome as Messages) },
  de: { ...(deHome as Messages) },
};

function toEffectiveLang(lang: Lang): EffectiveLang {
  if (lang === "du") return "de";
  return lang;
}

function writeLangCookie(lang: EffectiveLang) {
  const maxAge = 60 * 60 * 24 * ONE_YEAR_DAYS;

  let cookie = `${LANG_COOKIE}=${encodeURIComponent(lang)}; Path=/; Max-Age=${maxAge}; SameSite=Strict`;
  if (window.location.protocol === "https:") cookie += "; Secure";

  document.cookie = cookie;
}

export function I18nProvider({
  initialLang = DEFAULT_LANG,
  children,
}: {
  initialLang?: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const effectiveLang = toEffectiveLang(lang);

  const dir: "ltr" | "rtl" = effectiveLang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    writeLangCookie(effectiveLang);
    document.documentElement.lang = effectiveLang;
    document.documentElement.dir = dir;
  }, [effectiveLang, dir]);

  const t = useMemo(() => {
    const dict = messagesByLang[effectiveLang] || {};
    return (key: string) => dict[key] ?? key;
  }, [effectiveLang]);

  return (
    <I18nContext.Provider value={{ lang, dir, t, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
