"use client";

import Link from "next/link";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

import Button from "@/components/shared/Button";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/providers/I18nProvider";

type FormPageHeaderProps = {
  backHref: string;
  title: string;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
  cancelLabel?: string;
  className?: string;
  submitClassName?: string;
  cancelClassName?: string;
};

export default function FormPageHeader({
  backHref,
  title,
  onCancel,
  isSubmitting = false,
  submitLabel,
  submittingLabel,
  cancelLabel,
  className,
  submitClassName,
  cancelClassName,
}: FormPageHeaderProps) {
  const { lang, t } = useI18n();
  const resolvedSubmitLabel = submitLabel ?? t("company.common.sendRequest");
  const resolvedSubmittingLabel = submittingLabel ?? t("company.common.sending");
  const resolvedCancelLabel = cancelLabel ?? t("company.common.cancel");

  return (
    <header
      className={cn(
        "fixed border-b border-dashboard-border top-16 z-50 flex w-full flex-wrap items-center justify-between gap-3 bg-white px-4 lg:px-8 py-3 lg:w-[calc(100%-279px)]",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Link
          href={backHref}
          className="rounded-sm border border-dashboard-input-border bg-transparent p-2.5 text-secondary-300 hover:bg-secondary-section-bg hover:text-secondary-400"
        >
          {lang === "ar" ? (
            <IoChevronForwardOutline
              className="text-secondary-normal"
              size={20}
            />
          ) : (
            <IoChevronBackOutline className="text-secondary-normal" size={20} />
          )}
        </Link>
        <h1 className="text-xl font-medium text-secondary-normal">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="sm"
          className={cn(
            "bg-white text-secondary-300 hover:bg-secondary-section-bg hover:text-secondary-400",
            cancelClassName,
          )}
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {resolvedCancelLabel}
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className={submitClassName}
        >
          {isSubmitting ? resolvedSubmittingLabel : resolvedSubmitLabel}
        </Button>
      </div>
    </header>
  );
}
