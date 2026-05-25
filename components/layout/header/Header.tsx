"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useI18n } from "@/providers/I18nProvider";

const navKeys = [
  { key: "home.nav.work", href: "#work", isActive: true },
  { key: "home.nav.experience", href: "#experience", isActive: false },
  { key: "home.nav.stack", href: "#stack", isActive: false },
  { key: "home.nav.contact", href: "#contact", isActive: false },
];

export default function Header() {
  const { t } = useI18n();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const updateCompactState = () => {
      setIsCompact(window.scrollY > 16);
    };

    const animationFrame = window.requestAnimationFrame(updateCompactState);
    window.addEventListener("scroll", updateCompactState, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateCompactState);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-portfolio-border bg-portfolio-surface text-white backdrop-blur-sm">
      <div
        className={`mx-auto flex w-full items-center justify-between px-6 transition-all duration-300 ${
          isCompact ? "h-18" : "h-23.5"
        }`}
      >
        <Link
          href="/"
          className="text-2xl font-bold leading-none tracking-tighter text-white sm:text-3xl"
          aria-label={t("home.brand")}
        >
          {t("home.brand")}
        </Link>

        <nav
          aria-label={t("home.navigationLabel")}
          className="absolute left-1/2 hidden h-full -translate-x-1/2 items-center gap-12 text-base lg:flex"
        >
          {navKeys.map(({ key, href, isActive }) => (
            <Link
              key={key}
              href={href}
              aria-current={isActive ? "location" : undefined}
              className={`flex h-full items-center border-b-2 pt-0.5 transition-colors ${
                isActive
                  ? "border-portfolio-accent text-portfolio-accent"
                  : "border-transparent text-portfolio-muted hover:text-white"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <Link
          href="#resume"
          className="rounded-md bg-portfolio-accent px-5 py-4 text-sm font-bold text-white transition-colors hover:bg-portfolio-accent-hover sm:px-9.5 sm:text-base"
        >
          {t("home.resume")}
        </Link>
      </div>
      <nav
        aria-label={t("home.navigationLabel")}
        className="flex gap-7 overflow-x-auto border-t border-portfolio-border px-6 text-xs lg:hidden"
      >
        {navKeys.map(({ key, href, isActive }) => (
          <Link
            key={key}
            href={href}
            aria-current={isActive ? "location" : undefined}
            className={`shrink-0 border-b-2 transition-all duration-300 ${
              isCompact ? "py-3" : "py-4"
            } ${
              isActive
                ? "border-portfolio-accent text-portfolio-accent"
                : "border-transparent text-portfolio-muted hover:text-white"
            }`}
          >
            {t(key)}
          </Link>
        ))}
      </nav>
    </header>
  );
}
