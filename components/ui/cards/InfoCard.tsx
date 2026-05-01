"use client";

import AppImage from "@/components/shared/AppImage";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/providers/I18nProvider";
import React from "react";
import type { IconType } from "react-icons";
import { FiSearch } from "react-icons/fi";
import { LuFileUser } from "react-icons/lu";

type Variant = "contract" | "default" | "study-aboard" | "step" | "step-chips";

type StudyPathChip = {
  id: string;
  title: Record<string, string>;
};

type InfoCardProps = {
  variant?: Variant;

  title: string;
  description?: string | React.ReactNode;
  bullets?: string[];
  flagSrc?: string;

  icon?: IconType;
  iconSize?: number;

  className?: string;
  contentClassName?: string;

  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;

  footer?: React.ReactNode;
  footerClassName?: string;

  chips?: StudyPathChip[];
  chipsClassName?: string;
  chipClassName?: string;
  stepOrder?: number;
};

export default function InfoCard({
  variant = "default",
  title,
  description,
  bullets,

  icon: Icon = FiSearch,
  iconSize = 44,
  flagSrc,

  className,
  contentClassName,

  iconClassName,
  titleClassName,
  descriptionClassName,

  footer,
  footerClassName,

  chips,
  chipsClassName,
  chipClassName,
  stepOrder,
}: InfoCardProps) {
  const { lang, t } = useI18n();
  const isWorkContract = variant === "contract" || variant === "study-aboard";
  const isStep = variant === "step";
  const isStepChips = variant === "step-chips";

  return (
    <section
      className={cn(
        isWorkContract
          ? [
              "w-full min-h-[392px]",
              "rounded-xs border border-secondary-light-hover border-b-primary-normal bg-white",
              "p-10 pb-16",
              "flex flex-col items-start gap-10",
              "shadow-[0_3px_18px_rgba(0,0,0,0.06)]",
            ].join(" ")
          : isStep || isStepChips
            ? [
                "w-full",
                "rounded-md border border-secondary-light-hover bg-white",
                "shadow-[0_10px_28px_rgba(0,0,0,0.06)]",
                "px-10 py-8",
              ].join(" ")
            : [
                "rounded-md border border-secondary-light-hover bg-white",
                "shadow-[0_10px_28px_rgba(0,0,0,0.06)]",
                "p-10",
              ].join(" "),
        className,
      )}
    >
      {isWorkContract && (
        <div className={cn("mt-1 text-primary-normal", iconClassName)}>
          <Icon size={iconSize} />
        </div>
      )}

      <div className={cn(isWorkContract ? "space-y-4" : "mt-0")}>
        <h3
          className={cn(
            isWorkContract
              ? "text-[28px] font-extrabold leading-[1.15] tracking-tight text-primary-darker"
              : isStep || isStepChips
                ? "text-[20px] font-extrabold leading-snug text-primary-darker"
                : "text-base font-extrabold text-primary-darker",
            "flex gap-4",
            titleClassName,
          )}
        >
          {flagSrc && (
            <AppImage
              src={flagSrc}
              alt={flagSrc}
              width={32}
              height={24}
              className="mt-0.5 h-6 w-8"
            />
          )}
          {stepOrder != null
            ? `${t("studyAbroadLanguageDetails.stepPrefix")} ${stepOrder + 1} - `
            : null}
          {title}
        </h3>

        {isStepChips ? (
          <div className={cn("mt-3", contentClassName)}>
            {description !== undefined &&
              description !== null &&
              (typeof description === "string" ? (
                <p
                  className={cn(
                    "text-[15px] leading-7 text-primary-darker/70",
                    descriptionClassName,
                  )}
                >
                  {description}
                </p>
              ) : (
                <div
                  className={cn(
                    "text-[15px] leading-7 text-primary-darker/70",
                    descriptionClassName,
                  )}
                >
                  {description}
                </div>
              ))}

            {chips?.length ? (
              <div className={cn("mt-6 flex flex-wrap gap-3", chipsClassName)}>
                {chips.map((chip) => {
                  const ChipIcon = LuFileUser;
                  return (
                    <span
                      key={`${chip.id}`}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-sm",
                        "border border-secondary-light-hover bg-primary-light ",
                        "px-4 py-2",
                        "text-[12px] font-semibold uppercase tracking-wide text-primary-darker/70",
                        chipClassName,
                      )}
                    >
                      {ChipIcon ? (
                        <ChipIcon size={24} className="text-primary-normal" />
                      ) : null}
                      {lang === "ar" ? chip.title.ar : chip.title.en}
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : isStep ? (
          <div className={cn("mt-3", contentClassName)}>
            {description !== undefined &&
              description !== null &&
              (typeof description === "string" ? (
                <p
                  className={cn(
                    "text-[15px] leading-7 text-primary-darker/70",
                    descriptionClassName,
                  )}
                >
                  {description}
                </p>
              ) : (
                <div
                  className={cn(
                    "text-[15px] leading-7 text-primary-darker/70",
                    descriptionClassName,
                  )}
                >
                  {description}
                </div>
              ))}

            {bullets?.length ? (
              <ul className="mt-4 list-disc space-y-3 pl-6 text-[15px] leading-7 text-primary-darker/70 marker:text-primary-darker/30">
                {bullets.map((item, idx) => (
                  <li key={`${idx}-${item}`}>{item}</li>
                ))}
              </ul>
            ) : null}

            {footer ? (
              <div
                className={cn("mt-6 flex items-center gap-3", footerClassName)}
              >
                {footer}
              </div>
            ) : null}
          </div>
        ) : (
          <div
            className={cn(
              isWorkContract
                ? "text-[18px] leading-[1.7] text-primary-darker/70"
                : "mt-3 text-md text-primary-darker/70",
              contentClassName,
            )}
          >
            {bullets?.length ? (
              <ul className="list-disc space-y-2 pl-5">
                {bullets.map((item, idx) => (
                  <li key={`${idx}-${item}`}>{item}</li>
                ))}
              </ul>
            ) : typeof description === "string" ? (
              <p
                className={cn(
                  isWorkContract ? "" : "leading-6",
                  descriptionClassName,
                )}
              >
                {description}
              </p>
            ) : (
              <div className={descriptionClassName}>{description}</div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
