"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

import { useI18n } from "@/providers/I18nProvider";

type AnimatedTitleLineProps = {
  text: string;
  startDelay?: number;
};

function AnimatedTitleLine({ text, startDelay = 0 }: AnimatedTitleLineProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <span aria-hidden="true" className="block overflow-hidden pb-1">
      {Array.from(text).map((character, index) => (
        <motion.span
          key={`${character}-${index}`}
          className="inline-block"
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  y: ["110%", "0%", "0%", "-110%"],
                  opacity: [0, 1, 1, 0],
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: 3.5,
                  delay: startDelay + index * 0.035,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 0.65,
                  ease: ["easeOut", "linear", "easeIn"],
                  times: [0, 0.24, 0.67, 1],
                }
          }
        >
          {character === " " ? "\u00a0" : character}
        </motion.span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const { t } = useI18n();
  const titleLineOne = t("home.heroTitleLineOne");
  const titleLineTwo = t("home.heroTitleLineTwo");

  return (
    <main className="relative isolate flex min-h-[calc(100svh-5.875rem)] overflow-hidden bg-portfolio-surface text-white">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 right-0 w-2/3 bg-[radial-gradient(circle_at_90%_8%,rgba(48,74,242,0.14),transparent_44%)]"
      />

      <section className="relative mx-auto flex w-full max-w-7xl flex-col justify-center px-6 py-20 sm:px-10 lg:px-6 lg:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 bottom-7 hidden select-none overflow-hidden text-9xl font-extrabold uppercase leading-none tracking-tighter text-white/6 lg:block"
        >
          <span className="block">{t("home.backgroundWordOne")}</span>
          <span className="block">{t("home.backgroundWordTwo")}</span>
        </div>

        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest text-portfolio-accent">
            {t("home.availability")}
          </p>

          <h1
            aria-label={`${titleLineOne} ${titleLineTwo}`}
            className="mt-6 max-w-5xl text-5xl font-extrabold uppercase leading-none tracking-tighter text-white sm:text-7xl lg:text-8xl"
          >
            <AnimatedTitleLine text={titleLineOne} />
            <AnimatedTitleLine text={titleLineTwo} startDelay={0.15} />
          </h1>

          <p className="mt-8 max-w-xl text-sm leading-6 text-portfolio-muted sm:text-base">
            {t("home.heroDescription")}
          </p>

          <div className="mt-11 flex flex-wrap gap-4">
            <Link
              href="#work"
              className="inline-flex items-center gap-2 rounded-md bg-portfolio-accent px-7 py-4 text-sm font-medium text-white transition-colors hover:bg-portfolio-accent-hover"
            >
              {t("home.viewProjects")}
              <FiArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center rounded-md border border-portfolio-border px-7 py-4 text-sm text-white transition-colors hover:border-portfolio-muted"
            >
              <span aria-hidden="true" className="me-1 text-portfolio-muted">
                &gt;
              </span>
              {t("home.letsConnect")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
