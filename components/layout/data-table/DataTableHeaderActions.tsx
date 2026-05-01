"use client";

import Link from "next/link";
import { HiOutlinePlus } from "react-icons/hi";
import { IoFilter } from "react-icons/io5";
import { useI18n } from "@/providers/I18nProvider";

type DataTableHeaderActionsProps = {
  onFilter: () => void;
  filterCount?: number;
  onClear?: () => void;
  addHref?: string;
  onAdd?: () => void;
  addLabel: string;
};

export default function DataTableHeaderActions({
  onFilter,
  filterCount = 0,
  onClear,
  addHref,
  onAdd,
  addLabel,
}: DataTableHeaderActionsProps) {
  const { t } = useI18n();
  const hasFilters = filterCount > 0;

  return (
    <>
      <button
        type="button"
        onClick={onFilter}
        className="cursor-pointer inline-flex h-10 items-center gap-2 rounded-md border border-dashboard-border bg-white px-4 text-sm text-secondary-400 hover:bg-secondary-section-bg"
      >
        <IoFilter size={14} />
        <span className="hidden lg:block">{t("company.common.filter")}</span>
        {hasFilters ? ` (${filterCount})` : ""}
      </button>

      {hasFilters && onClear ? (
        <button
          type="button"
          onClick={onClear}
          className="cursor-pointer inline-flex h-10 items-center gap-2 rounded-md border border-dashboard-border bg-white px-4 text-sm text-secondary-400 hover:bg-secondary-section-bg"
        >
          {t("company.common.clear")}
        </button>
      ) : null}

      {onAdd ? (
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-primary-normal px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-dark-hover"
        >
          <span className="hidden lg:block">{addLabel}</span>
          <HiOutlinePlus size={14} />
        </button>
      ) : addHref ? (
        <Link
          href={addHref}
          className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-primary-normal px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-dark-hover"
        >
          <span className="hidden lg:block">{addLabel}</span>
          <HiOutlinePlus size={14} />
        </Link>
      ) : null}
    </>
  );
}
