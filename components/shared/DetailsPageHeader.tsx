"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/providers/I18nProvider";

type Props = {
  title: string;
  backHref: string;
  status?: ReactNode;
  actions?: ReactNode;
  className?: string;
  leftClassName?: string;
  backLinkClassName?: string;
  titleClassName?: string;
  backIconClassName?: string;
  backIconSize?: number;
};

export default function DetailsPageHeader({
  title,
  backHref,
  status,
  actions,
  className,
  leftClassName,
  backLinkClassName,
  titleClassName,
  backIconClassName,
  backIconSize = 20,
}: Props) {
  const { lang } = useI18n();
  return (
    <header
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-dashboard-border bg-white px-4 lg:px-8 py-3",
        className,
      )}
    >
      <div className={cn("flex items-center gap-2", leftClassName)}>
        <Link
          href={backHref}
          className={cn(
            "rounded-sm border border-dashboard-input-border bg-transparent p-2.5 text-secondary-300 hover:bg-secondary-section-bg hover:text-secondary-400",
            backLinkClassName,
          )}
        >
          {lang === "ar" ? (
            <IoChevronForwardOutline
              className={backIconClassName}
              size={backIconSize}
            />
          ) : (
            <IoChevronBackOutline
              className={backIconClassName}
              size={backIconSize}
            />
          )}
        </Link>
        <h1
          className={cn(
            "text-xl font-medium text-secondary-normal",
            titleClassName,
          )}
        >
          {title}
        </h1>
        {status}
      </div>
      {actions}
    </header>
  );
}
