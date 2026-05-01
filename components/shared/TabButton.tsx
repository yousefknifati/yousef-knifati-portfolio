"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { TabType, useTabStore } from "@/lib/store/useTabStore";

type TabButtonStoreProps = {
  value: TabType;
  children: React.ReactNode;
  className?: string;
};

type TabButtonControlledProps = {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
};

type TabButtonProps = TabButtonStoreProps | TabButtonControlledProps;

export function TabButton({
  children,
  className,
  ...props
}: TabButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = useTabStore((s) => s.activeTab);
  const setTabState = useTabStore((s) => s.setTab);

  const isStoreDriven = "value" in props;
  const isActive = isStoreDriven ? activeTab === props.value : props.isActive;

  const handleClick = () => {
    if (isStoreDriven) {
      if (props.value === activeTab) return;

      setTabState(props.value);

      const params = new URLSearchParams(searchParams);
      params.set("tab", props.value);
      const url = `?${params.toString()}`;

      if (
        typeof document !== "undefined" &&
        "startViewTransition" in document
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (document as any).startViewTransition(() =>
          router.replace(url, { scroll: false }),
        );
      } else {
        router.replace(url, { scroll: false });
      }
    } else {
      props.onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isActive}
      className={cn(
        "relative pb-2 text-sm transition-colors duration-200 cursor-pointer",
        isActive ? "text-primary-normal" : "text-secondary-300",
        "after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:w-full",
        "after:origin-left after:scale-x-0 after:bg-primary-normal after:transition-transform after:duration-200",
        isActive ? "after:scale-x-100" : "after:scale-x-0",
        className,
      )}
    >
      {children}
    </button>
  );
}
