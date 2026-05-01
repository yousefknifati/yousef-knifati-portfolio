"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

type EmptyStateCardProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  className?: string;
};

export default function EmptyStateCard({
  title,
  subtitle,
  icon,
  className,
}: EmptyStateCardProps) {
  return (
    <div
      className={cn(
        "mx-auto  rounded-md border border-secondary-light-hover bg-white",
        "px-6 py-10 text-center shadow-sm",
        className,
      )}
    >
      {icon ? (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-light text-primary-normal">
          {icon}
        </div>
      ) : null}
      <h3 className="mt-4 text-lg font-semibold text-primary-darker">
        {title}
      </h3>
      {subtitle ? (
        <p className="mt-2 text-sm text-secondary-400">{subtitle}</p>
      ) : null}
    </div>
  );
}
