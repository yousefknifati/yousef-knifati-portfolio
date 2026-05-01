"use client";

import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/providers/I18nProvider";
import Link from "next/link";

type ReadinessScoreCardProps = {
  title?: string;
  score?: number;
  subtitle?: string;
  items?: string[];
  actions?: { label: string; link: string }[];
  className?: string;
};

const formatEnumLabel = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();

const ReadinessScoreCard = ({
  title,
  score = 83,
  subtitle,
  items,
  actions,
  className,
}: ReadinessScoreCardProps) => {
  const { t, lang } = useI18n();

  const resolvedTitle = title ?? t("workContractDetails.readiness.title");
  const readinessSuffix = t("workContractDetails.readiness.subtitle");
  const translatedLevel = subtitle
    ? (() => {
        const key = `workContractDetails.readiness.level.${subtitle}`;
        const translated = t(key);

        if (translated !== key) return translated;

        if (lang === "ar") {
          const arFallback: Record<string, string> = {
            Weak: "ضعيف",
            Medium: "متوسط",
            Strong: "قوي",
          };
          return arFallback[subtitle] ?? formatEnumLabel(subtitle);
        }

        return formatEnumLabel(subtitle);
      })()
    : "";

  const resolvedSubtitle = subtitle
    ? lang === "ar"
      ? ` ${readinessSuffix} ${translatedLevel}`
      : ` ${translatedLevel} ${readinessSuffix}`
    : readinessSuffix;

  const resolvedItems = items ?? [
    t("workContractDetails.readiness.items.specialization"),
    t("workContractDetails.readiness.items.language"),
    t("workContractDetails.readiness.items.certificates"),
  ];
  const resolvedActions = actions ?? [
    {
      label: t("workContractDetails.readiness.actions.improveCv"),
      link: "/profile?tab=personal",
    },
    {
      label: t("workContractDetails.readiness.actions.addCertificate"),
      link: "/profile?tab=experience",
    },
  ];

  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div
      className={cn(
        "rounded-md border border-secondary-light-hover bg-white",
        "shadow-[0_10px_28px_rgba(0,0,0,0.06)]",
        "p-6",
        className,
      )}
    >
      <div>
        <div className="text-lg font-bold text-primary-darker">
          {resolvedTitle}
        </div>

        <div className="mt-4 text-4xl font-extrabold text-success-dark">
          {safeScore}%
        </div>

        <div className="mt-2 text-sm text-primary-darker">
          {resolvedSubtitle}
        </div>
      </div>

      <div className="mt-6">
        <div className="space-y-0">
          {resolvedItems.map((text, idx) => (
            <div
              key={`${text}-${idx}`}
              className={cn(
                "py-4 text-sm text-primary-darker",
                idx !== resolvedItems.length - 1 &&
                  "border-b border-secondary-light-hover",
              )}
            >
              {text}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-3 flex flex-col ">
        {resolvedActions.map((a) => (
          <Link
            href={a.link}
            key={a.label}
            className={cn(
              "w-full",
              "bg-white text-secondary-normal font-medium py-2.5 px-4 rounded-md transition-all duration-300",
              "border border-secondary-light-hover",
              "hover:bg-secondary-light hover:text-secondary-500",
              "active:bg-secondary-light-active",
            )}
          >
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ReadinessScoreCard;
