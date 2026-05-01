"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type FormCardSectionProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  headingClassName?: string;
  bodyClassName?: string;
};

export default function FormCardSection({
  title,
  children,
  action,
  className,
  headingClassName,
  bodyClassName,
}: FormCardSectionProps) {
  return (
    <section
      className={cn(
        "rounded-sm border border-secondary-light-hover bg-white shadow-[0_6px_18px_rgba(0,0,0,0.04)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-3 rounded-t-sm border-b border-dashboard-border bg-dashboard-bg p-4",
          headingClassName,
        )}
      >
        <h2 className="text-xs font-bold uppercase text-primary-normal">
          {title}
        </h2>
        {action}
      </div>
      <div className={cn("p-3 sm:p-4 pt-0!", bodyClassName)}>{children}</div>
    </section>
  );
}
