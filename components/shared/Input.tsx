"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";
import { useI18n } from "@/providers/I18nProvider";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  floatingLabel?: string;
  hint?: string;
  error?: string | boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;

  mode?: "edit" | "view";
  displayValue?: React.ReactNode;
  viewLabel?: string;
  viewContainerClassName?: string;
  viewLabelClassName?: string;
  viewValueClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      floatingLabel,
      hint,
      error,
      leftIcon,
      rightIcon,
      id,
      disabled,
      mode = "edit",
      displayValue,
      viewLabel,
      viewContainerClassName,
      viewLabelClassName,
      viewValueClassName,
      placeholder,
      value,
      ...props
    },
    ref
  ) => {
    const { dir } = useI18n();
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : "";

    const describedBy = [
      hint ? `${inputId}-hint` : null,
      hasError ? `${inputId}-error` : null,
    ]
      .filter(Boolean)
      .join(" ");

    const effectiveLabel =
      viewLabel ?? floatingLabel ?? label ?? placeholder ?? "";

    const resolvedTextValue = (() => {
      if (displayValue !== undefined) return displayValue;

      if (value == null) return "-";
      if (Array.isArray(value)) {
        const joined = value.filter(Boolean).join(", ");
        return joined.trim() ? joined : "-";
      }
      const s = String(value).trim();
      return s ? s : "-";
    })();

    if (mode === "view") {
      return (
        <div className={cn("w-full", containerClassName)}>
          <div className={cn("space-y-2", viewContainerClassName)}>
            <p
              className={cn(
                "text-md font-semibold text-primary-darker",
                viewLabelClassName
              )}
            >
              {effectiveLabel}
            </p>
            <p
              className={cn(
                "text-lg text-secondary-normal",
                viewValueClassName
              )}
            >
              {resolvedTextValue}
            </p>
          </div>
        </div>
      );
    }

    const isFloating = !!floatingLabel;

    return (
      <div className={cn("w-full", containerClassName)}>
        {!isFloating && label ? (
          <label
            htmlFor={inputId}
            className="mb-2 block text-sm font-medium text-white/90"
          >
            {label}
          </label>
        ) : null}

        <div
          className={cn(
            "relative",
            isFloating
              ? cn(
                  "rounded-sm border bg-white",
                  "border-secondary-light-hover",
                  "focus-within:border-primary-normal",
                  "focus-within:ring-1 focus-within:ring-primary-normal/60"
                )
              : ""
          )}
        >
          {isFloating ? (
            <span
              className={cn(
                "absolute -top-3 px-2 text-sm font-medium",
                dir === "rtl" ? "right-4" : "left-4",
                "bg-white text-secondary-normal",
                disabled ? "opacity-60" : ""
              )}
            >
              {floatingLabel}
            </span>
          ) : null}

          {leftIcon ? (
            <span
              className={cn(
                "pointer-events-none absolute inset-y-0 left-3 flex items-center text-black"
              )}
            >
              {leftIcon}
            </span>
          ) : null}

          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={describedBy || undefined}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value={value as any}
            placeholder={placeholder}
            className={cn(
              isFloating
                ? cn(
                    "h-14 w-full rounded-sm border-0",
                    "px-5 pb-2 pt-2",
                    "bg-white text-md font-medium text-secondary-normal/70",
                    "placeholder:text-secondary-normal/70",
                    "focus:outline-none focus:ring-0"
                  )
                : cn(
                    "h-11 w-full rounded-sm border px-4 text-sm transition",
                    "bg-input-bg text-black placeholder:text-secondary-normal",
                    "border-white/15 focus-visible:border-white/30",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-normal/60"
                  ),
              leftIcon ? (isFloating ? "pl-12" : "pl-10") : "",
              rightIcon ? (isFloating ? "pr-12" : "pr-10") : "",
              hasError
                ? isFloating
                  ? "border-danger-normal ring-1 ring-danger-normal focus-within:ring-danger-normal"
                  : "border-danger-normal ring-1 ring-danger-normal focus-visible:ring-danger-normal"
                : "",
              className
            )}
            {...props}
          />

          {rightIcon ? (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black">
              {rightIcon}
            </span>
          ) : null}
        </div>

        {hint && !error ? (
          <p id={`${inputId}-hint`} className="mt-2 text-xs text-black">
            {hint}
          </p>
        ) : null}

        {hasError && errorMessage ? (
          <p id={`${inputId}-error`} className="mt-2 text-xs text-danger-normal">
            {errorMessage}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
