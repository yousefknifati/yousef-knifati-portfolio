"use client";

import AppImage from "@/components/shared/AppImage";
import { useI18n } from "@/providers/I18nProvider";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

type Lang = "en" | "ar" | "de";

type LangOption = {
  code: Lang;
  label: string;
  flagSrc?: string;
  flagAlt: string;
};

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();

  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const el = detailsRef.current;
      if (!el || !el.open) return;
      if (!el.contains(e.target as Node)) setOpen(false);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.open = open;
    }
  }, [open]);

  const options: LangOption[] = [
    {
      code: "en",
      label: t("language.english"),
      flagSrc: "/header/usa.png",
      flagAlt: "English",
    },
    {
      code: "ar",
      label: t("language.arabic"),
      flagSrc: "/header/arabic.png",
      flagAlt: "Arabic",
    },
    {
      code: "de",
      label: t("language.german"),
      flagSrc: "/countries/Germany.svg",
      flagAlt: "German",
    },
  ];

  const activeLang = options.find((o) => o.code === lang) ?? options[0];

  const selectLang = (next: Lang) => {
    if (next === lang) {
      setOpen(false);
      return;
    }

    Cookies.set("lang", next, {
      path: "/",
      expires: 365,
      sameSite: "strict",
      secure: window.location.protocol === "https:",
    });

    setLang(next);
    setOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <details ref={detailsRef} className="group relative z-1000">
      <summary
        className="flex cursor-pointer list-none items-center gap-2 text-sm text-white/90 hover:text-white"
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        aria-expanded={open}
      >
        <span className="leading-none">
          {activeLang.flagSrc ? (
            <AppImage
              src={activeLang.flagSrc}
              alt={activeLang.flagAlt}
              width={22}
              height={22}
              className="h-auto w-[22px]"
            />
          ) : (
            <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white/50 text-[10px] font-bold">
              DE
            </span>
          )}
        </span>

        <span>{activeLang.label}</span>
        <FaChevronDown className="h-4 w-4 transition group-open:rotate-180" />
      </summary>

      <div
        className={[
          "absolute mt-3 w-44 overflow-hidden rounded-md border border-secondary-50 bg-white shadow-lg",
          lang === "ar" ? "left-0 right-auto" : "right-0",
        ].join(" ")}
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {options.map((option) => (
          <button
            key={option.code}
            type="button"
            onClick={() => selectLang(option.code)}
            className={[
              "cursor-pointer flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-secondary-50/90",
              lang === "ar" ? "flex-row-reverse text-right" : "",
              option.code !== options[options.length - 1].code
                ? "border-b border-secondary-50"
                : "",
              lang === option.code
                ? "bg-secondary-50/90 font-bold text-primary-normal"
                : "text-black",
            ].join(" ")}
          >
            {option.flagSrc ? (
              <AppImage
                src={option.flagSrc}
                alt={option.flagAlt}
                width={22}
                height={22}
                className="h-auto w-[22px]"
              />
            ) : (
              <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full border border-secondary-200 text-[10px] font-bold text-secondary-500">
                DE
              </span>
            )}
            {option.label}
          </button>
        ))}
      </div>
    </details>
  );
}
