"use client";

import { cn } from "@/lib/utils/cn";
import * as React from "react";
import { PiBriefcaseFill } from "react-icons/pi";
import Pagination from "../Pagination";
import { useI18n } from "@/providers/I18nProvider";

type PaginationConfig = {
  page: number; // 0-based
  totalPages: number;
  onPageChange: (page: number) => void;

  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;

  dir?: "rtl" | "ltr";
};

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  render: (item: T, index: number) => React.ReactNode;
};

type DataTableProps<T> = {
  title?: React.ReactNode;
  actions?: React.ReactNode;

  items: T[];
  columns: ReadonlyArray<DataTableColumn<T>>;
  getRowKey?: (item: T, index: number) => React.Key;

  emptyText?: React.ReactNode;
  className?: string;

  pagination?: PaginationConfig;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
};

export default function DataTable<T>({
  title,
  actions,
  items,
  columns,
  getRowKey,
  emptyText = "لا توجد بيانات",
  className,
  pagination,
  icon,
}: DataTableProps<T>) {
  const orderedColumns = React.useMemo(() => {
    if (!columns.length) return [];
    const actionsCols = columns.filter((c) => c.key === "actions");
    const otherCols = columns.filter((c) => c.key !== "actions");
    return [...otherCols, ...actionsCols];
  }, [columns]);
const {lang} = useI18n();
  const resolvedRowKeys = React.useMemo(() => {
    const counts = new Map<string, number>();

    return items.map((item, index) => {
      const baseKey = getRowKey?.(item, index) ?? index;
      const baseKeyString = String(baseKey);
      const count = counts.get(baseKeyString) ?? 0;
      counts.set(baseKeyString, count + 1);

      return count === 0 ? baseKey : `${baseKeyString}__${count}`;
    });
  }, [items, getRowKey]);

  const Icon = icon;
  return (
    <section className={cn("w-full", className)}>
      {(title || actions) && (
        <header className="mb-6 flex items-center justify-between gap-3 ">
          <div className="flex items-center gap-2 min-w-0">
            {typeof title === "string" ? (
              <h2 className="flex gap-4 text-3xl font-bold text-secondary-normal  truncate">
                {Icon ? (
                  <Icon className="text-primary-normal" size={32} />
                ) : (
                  <PiBriefcaseFill className="text-primary-normal" size={32} />
                )}
                {title}
              </h2>
            ) : (
              title
            )}
          </div>

          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </header>
      )}

      <div className="rounded-md border border-dashboard-border bg-white overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-230 w-full border-collapse">
            {orderedColumns.length > 0 && (
              <colgroup>
                {orderedColumns.map((c, idx) => (
                  <col
                    key={`col-${c.key}-${idx}`}
                    style={c.key === "actions" ? { width: "120px" } : undefined}
                  />
                ))}
              </colgroup>
            )}
            <thead className="bg-dashboard-bg">
              <tr className={`${lang==="en"?"text-left":"text-right"}`}>
                {orderedColumns.map((c, headerIndex) => (
                  <th
                    key={c.key}
                    className={cn(
                      "px-4 py-3 text-sm font-bold tracking-wide text-secondary-normal uppercase border-b border-dashboard-border",
                      headerIndex !== 0 ? "text-center" : "",
                      c.key === "actions" ? "w-24 whitespace-nowrap" : "",
                      c.headerClassName,
                    )}
                  >
                    {c.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td
                    colSpan={orderedColumns.length}
                    className="px-4 py-10 text-center text-sm text-secondary-normal "
                  >
                    {emptyText}
                  </td>
                </tr>
              ) : (
                items.map((item, index) => {
                  const key = resolvedRowKeys[index] ?? index;
                  return (
                    <tr
                      key={key}
                      className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors"
                    >
                      {orderedColumns.map((c, valueIndex) => (
                        <td
                          key={c.key}
                          className={cn(
                            "px-4 py-4 text-sm text-secondary-normal  align-middle ",
                            valueIndex !== 0 ? "text-center" : "",
                            c.key === "actions" ? "w-24 whitespace-nowrap" : "",
                            c.cellClassName,
                          )}
                        >
                          {c.render(item, index)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && (
        <footer className="mt-4">
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={pagination.onPageChange}
            pageSize={pagination.pageSize}
            pageSizeOptions={pagination.pageSizeOptions}
            onPageSizeChange={pagination.onPageSizeChange}
            dir={pagination.dir ?? "ltr"}
          />
        </footer>
      )}
    </section>
  );
}
