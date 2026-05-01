"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import {
  type OpportunityLangTab,
  useOpportunityLangFormStore,
} from "@/lib/store/useOpportunityLangFormStore";

const tabs: Array<{ value: OpportunityLangTab; label: string }> = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "de", label: "Germany" },
];

export default function LangTabForm({ className }: { className?: string }) {
  const activeLangTab = useOpportunityLangFormStore((s) => s.activeLangTab);
  const setActiveLangTab = useOpportunityLangFormStore((s) => s.setActiveLangTab);

  return (
    <div
      className={cn(
        "flex items-center gap-6   py-4  mt-30! lg:mt-0!",
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeLangTab === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveLangTab(tab.value)}
            className={cn(
              "relative pb-1 text-sm transition-colors duration-200",
              isActive ? "text-primary-normal" : "text-secondary-300",
              "after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-primary-normal",
              isActive ? "after:scale-x-100" : "after:scale-x-0",
              "after:origin-left after:transition-transform after:duration-200",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
