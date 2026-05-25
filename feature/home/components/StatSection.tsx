"use client";
import { useI18n } from "@/providers/I18nProvider";

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

const StatSection = () => {
  const { t } = useI18n();

  return (
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
  );
};

export default StatSection;
