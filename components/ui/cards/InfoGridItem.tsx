"use client";

import type { ReactNode } from "react";

type Props = {
  label: string;
  value: ReactNode;
};

export default function InfoGridItem({ label, value }: Props) {
  return (
    <div className="space-y-1">
      <p className="text-sm font-normal text-secondary-normal/70">{label}</p>
      <p className="text-md font-medium text-secondary-normal">{value}</p>
    </div>
  );
}
