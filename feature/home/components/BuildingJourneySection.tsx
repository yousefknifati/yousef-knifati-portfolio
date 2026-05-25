"use client";

import { useI18n } from "@/providers/I18nProvider";

const experienceKeys = ["architect", "lead", "frontend"] as const;

export default function BuildingJourneySection() {
  const { t } = useI18n();

  return (
    <section
      id="experience"
      className="bg-portfolio-surface px-6 py-20 text-white sm:px-10 lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
        <div className="journey-overview-reveal">
          <h2 className="max-w-sm text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl">
            {t("home.journey.titleLineOne")}
            <br />
            {t("home.journey.titleLineTwo")}
          </h2>
          <p className="mt-7 max-w-xs text-sm leading-6 text-portfolio-muted">
            {t("home.journey.description")}
          </p>
        </div>

        <ol>
          {experienceKeys.map((key) => (
            <li
              key={key}
              className="journey-item-reveal border-b border-portfolio-border py-12 first:pt-0"
            >
              <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-3xl font-semibold tracking-tight text-white">
                    {t(`home.journey.${key}.role`)}
                  </h3>
                  <p className="mt-1 text-sm text-portfolio-muted">
                    {t(`home.journey.${key}.company`)}
                  </p>
                </div>
                <p className="shrink-0 text-sm text-portfolio-muted">
                  {t(`home.journey.${key}.period`)}
                </p>
              </div>
              <p className="mt-6 max-w-xl text-sm leading-6 text-portfolio-muted">
                {t(`home.journey.${key}.description`)}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
