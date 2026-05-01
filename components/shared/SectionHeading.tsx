"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

type Props = {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  lineClassName?: string;
  showAccent?: boolean;
};

 function SectionHeading({
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
  lineClassName,
  showAccent = true,
}: Props) {
  return (
    <div className={cn("w-full  text-center pt-20 px-10 lg:px-0", className)}>
      {/* title with lines */}
      <div className="w-full flex items-center justify-center gap-2 lg:gap-6 ">
        <div
          className={cn("hidden lg:block w-20 md:w-[213px] h-px  bg-secondary-light-hover text-center", lineClassName)}
        />
        <h2
          className={cn(
            "text-3xl md:text-[40px] font-extrabold tracking-tight text-primary-darker",
            titleClassName
          )}
        >
          {title}
        </h2>
        <div
          className={cn("hidden lg:block w-20 md:w-[213px] h-px  bg-secondary-light-hover", lineClassName)}
        />
      </div>

      {/* subtitle */}
      {subtitle ? (
        <p
          className={cn("mt-3 text-md md:text-lg text-secondary-200 ", subtitleClassName)}
        >
          {subtitle}
        </p>
      ) : null}

      {/* accent */}
      {showAccent ? (
        <div className="mt-6 flex items-center justify-center gap-1">
          <span className="h-1.5 w-1.5 rounded-[2px] bg-primary-normal" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-secondary-normal" />
          <span className="h-3 w-3 rounded-[3px] bg-primary-normal" />
          <span className="h-2.5 w-2.5 rounded-[2px] bg-secondary-normal" />
          <span className="h-1.5 w-1.5 rounded-[2px] bg-primary-normal" />
        </div>
      ) : null}
    </div>
  );
}
export default SectionHeading;