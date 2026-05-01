"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type DetailsSectionContainerProps = {
  title: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
};

export default function DetailsSectionContainer({
  title,
  children,
  className,
  titleClassName,
  contentClassName,
}: DetailsSectionContainerProps) {
  return (
    <section
      className={cn(
        "rounded-sm border border-secondary-light-hover bg-white shadow-[0_6px_18px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      <h2
        className={cn(
          "rounded-t-sm border-b border-dashboard-border bg-dashboard-bg p-4 text-xs font-bold uppercase text-primary-normal",
          titleClassName,
        )}
      >
        {title}
      </h2>
      <div className={cn("p-4", contentClassName)}>{children}</div>
    </section>
  );
}
