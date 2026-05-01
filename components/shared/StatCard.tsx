import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type StatCardTone = "blue" | "green" | "amber" | "red";

export default function StatCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number | string;
  tone: StatCardTone;
  icon: React.ReactNode;
}) {
  const toneClass =
    tone === "blue"
      ? "bg-primary-light text-primary-normal-active!"
      : tone === "green"
        ? "bg-success-light text-success-normal-active!"
        : tone === "amber"
          ? "bg-warning-light text-warning-dark-hover!"
          : "bg-danger-light text-danger-normal-active!";

  return (
    <div className="flex flex-col gap-4 rounded-md border border-dashboard-border bg-white p-4 shadow-[0_6px_18px_rgba(0,0,0,0.04)]">
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-md",
          toneClass,
        )}
      >
        {icon}
      </div>
      <p className="text-sm text-secondary-300">{label}</p>
      <span className="text-2xl font-semibold text-secondary-normal">
        {value}
      </span>
    </div>
  );
}
