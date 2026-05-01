"use client";

import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/providers/I18nProvider";
import * as React from "react";
import Select from "@/components/shared/Select";

type PaginationProps = {
  page: number; // 0-based
  totalPages: number; // count (e.g. 1 => only page 0)
  onPageChange: (page: number) => void;

  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;

  className?: string;
  dir?: "rtl" | "ltr";
};

type PaginationItem = number | "ellipsis";

function getPaginationItems(
  page: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  if (totalPages <= 0) return [];

  const firstPage = 0;
  const lastPage = Math.max(totalPages - 1, 0);

  const leftSibling = Math.max(page - siblingCount, firstPage);
  const rightSibling = Math.min(page + siblingCount, lastPage);

  const showLeftEllipsis = leftSibling > firstPage + 1;
  const showRightEllipsis = rightSibling < lastPage - 1;

  const items: PaginationItem[] = [];

  items.push(firstPage);

  if (showLeftEllipsis) {
    items.push("ellipsis");
  } else {
    for (let p = firstPage + 1; p < leftSibling; p++) items.push(p);
  }

  for (let p = leftSibling; p <= rightSibling; p++) {
    if (p !== firstPage && p !== lastPage) items.push(p);
  }

  if (showRightEllipsis) {
    items.push("ellipsis");
  } else {
    for (let p = rightSibling + 1; p < lastPage; p++) items.push(p);
  }

  if (lastPage !== firstPage) items.push(lastPage);

  return items;
}

function clampPage(page: number, totalPages: number) {
  if (totalPages <= 0) return 0;
  const lastPage = Math.max(totalPages - 1, 0);
  return Math.min(Math.max(page, 0), lastPage);
}

function PagerButton({
  active,
  disabled,
  children,
  onClick,
  className,
  ariaLabel,
}: {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "cursor-pointer h-10 min-w-10 px-3",
        "inline-flex items-center justify-center",
        "rounded-sm border border-secondary-light-hover bg-white",
        "text-sm font-medium text-secondary-400",
        "shadow-[0_8px_18px_rgba(0,0,0,0.04)]",
        "transition-colors",
        "hover:bg-secondary-light-hover/60",
        "disabled:opacity-50 disabled:pointer-events-none",
        active && "bg-primary-light text-primary-dark border-primary-normal/30",
        className,
      )}
    >
      {children}
    </button>
  );
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  pageSize,
  pageSizeOptions = [8, 10, 20, 50],
  onPageSizeChange,
  className,
}: PaginationProps) {
  const { t } = useI18n();
  const safePage = clampPage(page, totalPages);
  const lastPage = Math.max(totalPages - 1, 0);

  const items = React.useMemo(
    () => getPaginationItems(safePage, totalPages, 0),
    [safePage, totalPages],
  );

  const canPrev = safePage > 0;
  const canNext = safePage < lastPage;

  const handlePrev = () => onPageChange(clampPage(safePage - 1, totalPages));
  const handleNext = () => onPageChange(clampPage(safePage + 1, totalPages));

  return (
    <div
      className={cn(
        " w-full",
        "flex flex-col gap-3 sm:flex-row sm:items-center justify-center lg:justify-between",
        className,
      )}
    >
      <nav
        aria-label={t("pagination.aria.navigation")}
        className={cn(
          "w-full flex flex-wrap items-center justify-center gap-2",
          "overflow-x-auto pb-1 -mx-1 px-1",
          "sm:flex-nowrap sm:justify-start sm:overflow-visible"
        )}
      >
        <PagerButton
          ariaLabel={t("pagination.aria.previousPage")}
          disabled={!canPrev}
          onClick={handlePrev}
          className="cursor-pointer min-w-16 h-9 text-xs sm:min-w-[72px] sm:h-10 sm:text-sm"
        >
          {t("pagination.prev")}
        </PagerButton>

        <div className="flex items-center gap-2">
          {items.map((it, idx) => {
            if (it === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-secondary-200 text-xs sm:text-sm"
                >
                  …
                </span>
              );
            }

            const isActive = it === safePage;

            return (
              <PagerButton
                key={it}
                ariaLabel={`${t("pagination.aria.page")} ${it}`}
                active={isActive}
                onClick={() => onPageChange(it)}
                className=" h-9 min-w-9 px-2 text-xs sm:h-10 sm:min-w-10 sm:px-3 sm:text-sm"
              >
                {it}
              </PagerButton>
            );
          })}
        </div>

        <PagerButton
          ariaLabel={t("pagination.aria.nextPage")}
          disabled={!canNext}
          onClick={handleNext}
          className=" min-w-16 h-9 text-xs sm:min-w-[72px] sm:h-10 sm:text-sm"
        >
          {t("pagination.next")}
        </PagerButton>
      </nav>

      <div className="flex items-center justify-start sm:justify-end gap-2 sm:gap-3">
        <span className="text-xs sm:text-sm text-text-Grey">
          {t("pagination.show")}
        </span>

        <Select
          value={String(pageSize ?? pageSizeOptions[0])}
          onValueChange={(value) => onPageSizeChange?.(Number(value))}
          options={pageSizeOptions.map((opt) => ({
            value: String(opt),
            label: String(opt),
          }))}
          className={cn(
            "cursor-pointer h-9 w-[76px] sm:h-10 sm:w-[84px]",
            "rounded-sm border border-secondary-light-hover bg-white",
            "px-2 pr-7 text-xs font-medium text-secondary-400 sm:px-3 sm:pr-9 sm:text-sm",
            "shadow-[0_8px_18px_rgba(0,0,0,0.04)]",
            "focus:outline-none focus:ring-2 focus:ring-primary-normal/30",
          )}
          containerClassName="w-[76px] sm:w-[84px]"
        />

        <span className="text-xs sm:text-sm text-text-Grey">
          {t("pagination.rows")}
        </span>
      </div>
    </div>
  );
}
