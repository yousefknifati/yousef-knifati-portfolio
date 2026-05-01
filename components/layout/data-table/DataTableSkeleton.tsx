"use client";

import "react-loading-skeleton/dist/skeleton.css";

import Skeleton from "react-loading-skeleton";

import { cn } from "@/lib/utils/cn";
import { useSkeletonColor } from "@/lib/hooks/useSkeletonColor";

type Props = {
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
  showIcon?: boolean;
  actionsCount?: number;
  showPagination?: boolean;
};

export default function DataTableSkeleton({
  rows = 8,
  columns = 6,
  className,
  showHeader = true,
  showIcon = true,
  actionsCount = 0,
  showPagination = false,
}: Props) {
  const palette = useSkeletonColor();

  return (
    <section className={cn("w-full", className)}>
      {showHeader && (
        <header className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {showIcon && <Skeleton height={28} width={28} {...palette} />}
            <Skeleton height={28} width={180} {...palette} />
          </div>
          {actionsCount > 0 && (
            <div className="flex items-center gap-2 shrink-0">
              {Array.from({ length: actionsCount }).map((_, idx) => (
                <Skeleton
                  key={`sk-action-${idx}`}
                  height={40}
                  width={idx === actionsCount - 1 ? 150 : 90}
                  {...palette}
                />
              ))}
            </div>
          )}
        </header>
      )}

      <div className="rounded-md border border-dashboard-border bg-white overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="min-w-[920px] w-full border-collapse">
            <thead className="bg-dashboard-bg">
              <tr className="text-left">
                {Array.from({ length: columns }).map((_, idx) => (
                  <th
                    key={`sk-head-${idx}`}
                    className={cn(
                      "px-4 py-3 text-sm font-semibold tracking-wide text-secondary-normal uppercase border-b border-dashboard-border",
                      idx !== 0 ? "text-center" : "",
                    )}
                  >
                    <Skeleton height={12} width={90} {...palette} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIdx) => (
                <tr
                  key={`sk-row-${rowIdx}`}
                  className="border-b border-slate-100"
                >
                  {Array.from({ length: columns }).map((__, colIdx) => (
                    <td
                      key={`sk-cell-${rowIdx}-${colIdx}`}
                      className={cn("px-4 py-4", colIdx !== 0 ? "text-center" : "")}
                    >
                      <Skeleton height={12} width="90%" {...palette} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPagination && (
        <footer className="mt-4">
          <Skeleton height={40} width={280} {...palette} />
        </footer>
      )}
    </section>
  );
}
