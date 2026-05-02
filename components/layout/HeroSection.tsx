"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import AppImage from "@/components/shared/AppImage";
import { useI18n } from "@/providers/I18nProvider";

const portraitUrl = "/front.jpg";

const navKeys = [
  "home.nav.about",
  "home.nav.skills",
  "home.nav.portfolio",
  "home.nav.testimonial",
];

const statistics = [
  {
    value: "80+",
    labelKey: "home.stats.satisfiedClients",
  },
  {
    value: "200+",
    labelKey: "home.stats.projectsCompleted",
  },
  {
    value: "99+",
    labelKey: "home.stats.reviewsGiven",
  },
];

const dots = [
  "left-[2.5%] top-[7%] h-2.5 w-2.5 bg-primary",
  "left-[8.5%] top-[5.5%] h-1.5 w-1.5 bg-red-500",
  "left-[9.5%] top-[14%] h-3 w-3 bg-blue-500",
  "left-[24%] top-[1%] h-1.5 w-1.5 bg-blue-500",
  "left-[32%] top-[8.5%] h-2.5 w-2.5 bg-primary",
  "left-[35%] top-[5.8%] h-1.5 w-1.5 bg-foreground/70",
  "left-[43%] top-[3.5%] h-3 w-3 bg-blue-500",
  "left-[24.5%] top-[21%] h-1.5 w-1.5 bg-primary",
  "left-[34%] top-[24.5%] h-1.5 w-1.5 bg-blue-500",
  "left-[40%] top-[21.5%] h-3 w-3 bg-yellow-500",
  "left-[29.3%] top-[29.5%] h-3 w-3 bg-red-500",
  "left-[37.8%] top-[30.5%] h-3 w-3 bg-primary",
  "left-[7%] bottom-[18%] h-1.5 w-1.5 bg-primary",
  "left-[12.5%] bottom-[16.5%] h-3 w-3 bg-yellow-500",
  "left-[12%] bottom-[12%] h-1.5 w-1.5 bg-blue-500",
  "left-[6.5%] bottom-[7%] h-3 w-3 bg-red-500",
  "left-[15.8%] bottom-[6.2%] h-3 w-3 bg-primary",
];

export default function HeroSection() {
  const { t } = useI18n();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {dots.map((className) => (
          <span
            key={className}
            className={`absolute rounded-full shadow-sm ${className}`}
          />
        ))}
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-8 sm:px-10 lg:px-14">
        <Link href="#" className="flex items-center gap-3" aria-label="T Agency">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-3xl font-black leading-none text-white">
            t
          </span>
          <span className="text-2xl font-bold text-primary">
            {t("home.brand")}
          </span>
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-semibold text-foreground md:flex">
          {navKeys.map((key) => (
            <Link key={key} href="#" className="transition-colors hover:text-primary">
              {t(key)}
            </Link>
          ))}
        </nav>

        <Link
          href="#"
          className="rounded-lg border-2 border-primary px-5 py-3 text-sm font-bold text-foreground transition-colors hover:bg-primary hover:text-white"
        >
          {t("home.downloadCv")}
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-14 px-6 pb-12 pt-6 sm:px-10 lg:grid-cols-[1fr_0.95fr] lg:px-14 lg:pb-20 lg:pt-10">
        <div className="max-w-2xl">
          <span className="inline-flex rotate-[-5deg] rounded-[50%] border border-primary px-3 py-1 text-base font-medium text-primary">
            {t("home.welcome")}
          </span>

          <h1 className="mt-4 text-5xl font-bold leading-[1.08] tracking-normal text-foreground sm:text-6xl lg:text-7xl">
            {t("home.heroPrefix")}{" "}
            <span className="text-primary">{t("home.heroCreative")}</span>
            <br />
            <span className="text-primary">{t("home.heroDesign")}</span>{" "}
            {t("home.heroExperience")}
          </h1>

          <p className="mt-7 max-w-xl text-base font-medium leading-7 text-foreground/70 sm:text-lg">
            {t("home.heroDescription")}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-7">
            <Link
              href="#"
              className="rounded-lg bg-primary px-7 py-4 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5"
            >
              {t("home.contactMe")}
            </Link>
            <Link
              href="#"
              className="inline-flex items-center gap-2 text-sm font-bold text-foreground transition-colors hover:text-primary"
            >
              {t("home.viewPortfolio")}
              <FiArrowUpRight className="text-xl text-primary" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[520px] justify-center lg:justify-end">
          <div className="absolute left-3 top-14 h-[72%] w-[78%] border-4 border-foreground sm:left-0 sm:top-16" />
          <AppImage
            src={portraitUrl}
            alt={t("home.portraitAlt")}
            fill
            priority
            sizes="(min-width: 1024px) 405px, (min-width: 640px) 340px, 280px"
            wrapperClassName="relative mr-0 mt-2 aspect-[1/1] w-[78%] min-w-[280px] bg-primary sm:min-w-[340px] lg:mr-4"
            className="object-cover object-center"
          />
        </div>
      </section>

      <aside className="absolute right-7 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-7 text-primary lg:flex">
        <span className="[writing-mode:vertical-rl] text-sm font-medium">
          {t("home.followMe")}
        </span>
        <span className="h-14 w-px bg-primary/40" aria-hidden="true" />
        <Link href="#" aria-label="Facebook" className="rounded bg-primary p-1.5 text-white">
          <FaFacebookF className="size-3.5" />
        </Link>
        <Link href="#" aria-label="Instagram" className="rounded bg-primary p-1.5 text-white">
          <FaInstagram className="size-3.5" />
        </Link>
        <Link href="#" aria-label="LinkedIn" className="rounded bg-primary p-1.5 text-white">
          <FaLinkedinIn className="size-3.5" />
        </Link>
      </aside>

      <section className="relative z-10 bg-background px-6 py-14 sm:px-10 lg:px-14">
        <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-3 md:gap-0">
          {statistics.map((item, index) => (
            <div
              key={item.labelKey}
              className="relative flex flex-col items-center text-center md:items-start md:text-start"
            >
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -left-12 top-1/2 hidden h-20 w-px -translate-y-1/2 bg-primary md:block"
                />
              )}
              <p className="text-5xl font-extrabold leading-none text-primary sm:text-6xl">
                {item.value}
              </p>
              <p className="mt-5 text-2xl font-medium leading-tight text-foreground sm:text-3xl">
                {t(item.labelKey)}
              </p>
            </div>
          ))}
        </div>

        <div
          aria-hidden="true"
          className="absolute bottom-4 right-5 grid grid-cols-3 gap-1.5"
        >
          {Array.from({ length: 15 }, (_, index) => (
            <span
              key={index}
              className={`size-1.5 rounded-full ${
                index % 3 === 2 ? "bg-primary" : "bg-red-500"
              }`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
