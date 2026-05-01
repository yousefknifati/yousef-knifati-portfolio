"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

type AppButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "register" | "md" | "sm";
};

const Button = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, size = "register", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap select-none cursor-pointer",
          "bg-primary-normal text-white font-semibold ",
          "rounded-sm",
          "transition-colors duration-400",
          "hover:bg-primary-dark-hover hover:text-white active:bg-primary-dark-active",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-normal/40 ",
          "disabled:opacity-50 disabled:pointer-events-none",
          size === "register" &&
            "py-3.5 px-5 text-base font-semibold sm:py-4.5 sm:px-7 sm:text-lg",
          size === "md" &&
            "px-4 py-2 text-sm sm:px-6 sm:text-base sm:py-2.5",
          size === "sm" && "px-3 py-1.5 text-sm sm:px-4 sm:text-md sm:py-2.5",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export default Button;
